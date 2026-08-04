import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

const h = vi.hoisted(() => ({
  paymentsGet: vi.fn(),
  bevestiging: vi.fn(),
}));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/lib/orderbevestiging", () => ({
  stuurOrderbevestiging: h.bevestiging,
}));
vi.mock("@/lib/mollie", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mollie")>();
  return {
    ...orig,
    mollieIsGeconfigureerd: true,
    mollie: () =>
      ({ payments: { get: h.paymentsGet } }) as unknown as ReturnType<
        typeof orig.mollie
      >,
  };
});

import { POST } from "@/app/api/mollie/webhook/route";
import { entitlements, paymentAttempts } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * Terugbetalingen en chargebacks trekken toegang in.
 *
 * Waarom dit een eigen bestand is: Mollie kent geen status "refunded". Een
 * terugbetaalde betaling blijft `paid` en verandert alleen `amountRefunded` /
 * `amountChargedBack`. De webhook keek daar niet naar, dus het geld ging terug
 * en de cursus bleef openstaan — met een chargeback kostte dat ook nog €10.
 */

function webhookRequest(id = "tr_test_1"): Request {
  return new Request("https://example.test/api/mollie/webhook", {
    method: "POST",
    body: new URLSearchParams({ id }),
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}

/** Een betaling zoals payments.get() hem teruggeeft. */
function betaling(opties: {
  refunded?: string;
  chargedBack?: string;
  value?: string;
} = {}) {
  const value = opties.value ?? "49.00";
  return {
    status: "paid",
    amount: { value, currency: "EUR" },
    ...(opties.refunded ? { amountRefunded: { value: opties.refunded, currency: "EUR" } } : {}),
    ...(opties.chargedBack
      ? { amountChargedBack: { value: opties.chargedBack, currency: "EUR" } }
      : {}),
    metadata: { userId: "u1", courseSlug: "waardebeleggen" },
  };
}

async function poging(paymentId = "tr_test_1") {
  const rijen = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.molliePaymentId, paymentId));
  return rijen[0];
}

async function recht(courseSlug = "waardebeleggen") {
  const rijen = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.userId, "u1"));
  return rijen.find((r) => r.courseSlug === courseSlug);
}

/** Koop de cursus echt, langs de webhook, zodat de begintoestand klopt. */
async function koopCursus() {
  h.paymentsGet.mockResolvedValueOnce(betaling());
  await POST(webhookRequest());
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
  await db.insert(paymentAttempts).values({
    id: "poging-1",
    userId: "u1",
    courseSlug: "waardebeleggen",
    molliePaymentId: "tr_test_1",
    status: "pending",
    amountCents: 4900,
    currency: "EUR",
  });
});

describe("volledige terugbetaling", () => {
  it("trekt het recht in en zet de poging op refunded", async () => {
    await koopCursus();
    expect((await recht())?.status).toBe("actief");

    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "49.00" }));
    const res = await POST(webhookRequest());

    expect(res.status).toBe(200);
    expect((await poging()).status).toBe("refunded");

    const r = await recht();
    expect(r?.status).toBe("ingetrokken");
    expect(r?.revokedReason).toBe("refund");
    expect(r?.revokedAt).toBeInstanceOf(Date);
  });

  it("is idempotent — een tweede refund-webhook verandert niets meer", async () => {
    await koopCursus();
    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "49.00" }));
    await POST(webhookRequest());
    const eerst = await recht();

    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "49.00" }));
    await POST(webhookRequest());
    const daarna = await recht();

    expect(daarna?.revokedAt?.getTime()).toBe(eerst?.revokedAt?.getTime());
    expect((await poging()).status).toBe("refunded");
  });
});

describe("chargeback", () => {
  it("trekt in bij elk teruggeboekt bedrag, ook een gedeeltelijk", async () => {
    await koopCursus();

    h.paymentsGet.mockResolvedValueOnce(betaling({ chargedBack: "10.00" }));
    await POST(webhookRequest());

    const r = await recht();
    expect(r?.status).toBe("ingetrokken");
    expect(r?.revokedReason).toBe("chargeback");
  });
});

describe("gedeeltelijke terugbetaling", () => {
  it("laat de toegang staan — coulance pakt geen cursus af", async () => {
    await koopCursus();

    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "5.00" }));
    await POST(webhookRequest());

    expect((await recht())?.status).toBe("actief");
    expect((await poging()).status).toBe("paid");
  });
});

describe("de terugbetaling komt vóór de eerste verwerking binnen", () => {
  it("verleent nooit alsnog toegang voor een al terugbetaalde betaling", async () => {
    // Geen koopCursus(): de rij staat nog op pending, want Mollie's eerste
    // webhook is vertraagd of verloren gegaan. Wat binnenkomt is de refund.
    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "49.00" }));
    await POST(webhookRequest());

    expect((await poging()).status).toBe("refunded");
    expect(await recht()).toBeUndefined();

    // En als de oorspronkelijke paid-webhook alsnog arriveert, mag die de
    // cursus niet openzetten: er is geen pending-rij meer om te claimen.
    h.paymentsGet.mockResolvedValueOnce(betaling());
    await POST(webhookRequest());

    expect(await recht()).toBeUndefined();
    expect((await poging()).status).toBe("refunded");
    expect(h.bevestiging).not.toHaveBeenCalled();
  });
});

describe("heraankoop na terugbetaling", () => {
  it("blijft actief als een late webhook over de oude terugbetaling binnenkomt", async () => {
    await koopCursus();
    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "49.00" }));
    await POST(webhookRequest());
    expect((await recht())?.status).toBe("ingetrokken");

    // Tweede aankoop, eigen Mollie-id en eigen rij.
    await db.insert(paymentAttempts).values({
      id: "poging-2",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_test_2",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });
    h.paymentsGet.mockResolvedValueOnce(betaling());
    await POST(webhookRequest("tr_test_2"));
    expect((await recht())?.status).toBe("actief");

    // Nu komt Mollie nóg een keer terug op de oude, terugbetaalde betaling.
    // Die mag de nieuwe aankoop niet ongedaan maken: het recht hangt aan
    // poging-2, en de intrekking kijkt naar attempt_id.
    h.paymentsGet.mockResolvedValueOnce(betaling({ refunded: "49.00" }));
    await POST(webhookRequest("tr_test_1"));

    const r = await recht();
    expect(r?.status).toBe("actief");
    expect(r?.attemptId).toBe("poging-2");
  });
});
