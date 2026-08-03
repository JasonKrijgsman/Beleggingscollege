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
 * De Mollie-webhook: het publieke endpoint dat betaalpogingen op "paid" zet en
 * dan — atomair, in hetzelfde statement — het ordernummer en het entitlement
 * toekent. De twee regels die niet gebroken mogen worden (zie CLAUDE.md):
 * geloof niets uit de payload behalve het id, en controleer bedrag én valuta
 * tegen wat wij zelf hebben vastgelegd. Plus: hetzelfde webhook-bericht komt
 * gegarandeerd vaker binnen, dus alles moet idempotent zijn.
 *
 * De concurrency-scenario's (twee checkouts, checkout tegen webhook, dubbele
 * webhook, reparatietak, refund + heraankoop) staan in test/betaalmodel.test.ts.
 */

function webhookRequest(body: string | URLSearchParams): Request {
  return new Request("https://example.test/api/mollie/webhook", {
    method: "POST",
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}

function betaling(
  status: string,
  value = "49.00",
  currency = "EUR",
  metadata: unknown = { userId: "u1", courseSlug: "waardebeleggen" }
) {
  return { status, amount: { value, currency }, metadata };
}

async function pogingRij(paymentId: string) {
  const rijen = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.molliePaymentId, paymentId));
  return rijen[0];
}

async function recht(userId: string, courseSlug: string) {
  const rijen = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.userId, userId));
  return rijen.find((r) => r.courseSlug === courseSlug);
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

describe("betaald en correct", () => {
  it("zet de poging op paid, kent ordernummer en entitlement toe, stuurt de bevestiging", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid"));

    const res = await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect(res.status).toBe(200);

    const rij = await pogingRij("tr_test_1");
    expect(rij.status).toBe("paid");
    expect(rij.paidAt).toBeInstanceOf(Date);
    // I3: elke rij die paid bereikt heeft in dezelfde verwerking een nummer.
    expect(rij.orderNumber).toMatch(/^BC-\d{4}-\d{4}$/);
    // En het recht hangt aan precies deze order.
    const e = await recht("u1", "waardebeleggen");
    expect(e?.status).toBe("actief");
    expect(e?.attemptId).toBe("poging-1");
    expect(h.bevestiging).toHaveBeenCalledWith("tr_test_1");
  });

  it("is idempotent: dezelfde webhook nog een keer laat alles heel", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid"));

    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    const eersteKeer = await pogingRij("tr_test_1");

    const tweede = await POST(
      webhookRequest(new URLSearchParams({ id: "tr_test_1" }))
    );

    expect(tweede.status).toBe(200);
    const rijen = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.molliePaymentId, "tr_test_1"));
    expect(rijen).toHaveLength(1);
    expect(rijen[0].status).toBe("paid");
    // I5: ook de betaaldatum en het ordernummer blijven exact staan — dat is
    // de orderadministratie, en herhaalde webhooks mogen die niet raken.
    expect(rijen[0].paidAt).toEqual(eersteKeer.paidAt);
    expect(rijen[0].orderNumber).toBe(eersteKeer.orderNumber);
    // Er is ook maar één entitlement (I2), aan dezelfde order.
    const rechten = await db.select().from(entitlements);
    expect(rechten).toHaveLength(1);
    // De bevestiging wordt opnieuw aangeroepen; de functie zelf bewaakt met
    // een atomaire claim dat er maar één mail uitgaat (aparte tests).
    expect(h.bevestiging).toHaveBeenCalledTimes(2);
  });

  it("accepteert een betaling van méér dan het vastgelegde bedrag", async () => {
    // Huidig, bewust gedrag: de controle is `betaald < verwacht`, dus te veel
    // betaald keurt hij goed. Te weinig nooit.
    h.paymentsGet.mockResolvedValue(betaling("paid", "50.00"));
    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect((await pogingRij("tr_test_1")).status).toBe("paid");
  });
});

describe("bedrag- en valutacontrole (I6)", () => {
  it("te weinig betaald: status mismatch, geen entitlement, geen mail", async () => {
    // De aanval: een echte betaling van 1 euro doen en dat id hierheen sturen
    // om een cursus van 49 euro te ontgrendelen.
    h.paymentsGet.mockResolvedValue(betaling("paid", "1.00"));

    const res = await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect(res.status).toBe(200); // wel rustig 200: niets laten herhalen

    expect((await pogingRij("tr_test_1")).status).toBe("mismatch");
    expect(await recht("u1", "waardebeleggen")).toBeUndefined();
    expect(h.bevestiging).not.toHaveBeenCalled();
  });

  it("verkeerde valuta: status mismatch, ook al klopt het getal", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid", "49.00", "USD"));
    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect((await pogingRij("tr_test_1")).status).toBe("mismatch");
    expect(h.bevestiging).not.toHaveBeenCalled();
  });

  it("een mismatch blijft mismatch, ook als er daarna een correcte paid-webhook komt", async () => {
    // §2.2: er bestaat geen overgang mismatch -> paid. Een mens kijkt eerst.
    h.paymentsGet.mockResolvedValue(betaling("paid", "1.00"));
    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    h.paymentsGet.mockResolvedValue(betaling("paid"));
    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect((await pogingRij("tr_test_1")).status).toBe("mismatch");
    expect(await recht("u1", "waardebeleggen")).toBeUndefined();
  });
});

describe("overige betalingsstatussen", () => {
  it.each(["failed", "expired", "canceled"])(
    "neemt eindstatus %s van Mollie over zonder mail",
    async (status) => {
      h.paymentsGet.mockResolvedValue(betaling(status));
      const res = await POST(
        webhookRequest(new URLSearchParams({ id: "tr_test_1" }))
      );
      expect(res.status).toBe(200);
      expect((await pogingRij("tr_test_1")).status).toBe(status);
      expect(h.bevestiging).not.toHaveBeenCalled();
    }
  );

  it.each(["failed", "expired", "canceled"])(
    "I5: een paid-rij verlaat paid nooit, ook niet via een late %s-webhook",
    async (status) => {
      h.paymentsGet.mockResolvedValue(betaling("paid"));
      await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));

      h.paymentsGet.mockResolvedValue(betaling(status));
      await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));

      const rij = await pogingRij("tr_test_1");
      expect(rij.status).toBe("paid");
      expect((await recht("u1", "waardebeleggen"))?.status).toBe("actief");
    }
  );
});

describe("de payload wordt niet geloofd", () => {
  it("negeert alles behalve het id: status uit de payload doet niets", async () => {
    // Een aanvaller POST "id=tr_test_1&status=paid". De route hoort de status
    // bij Mollie zelf op te halen; die zegt hier "open" — een tussenstand,
    // dus de poging blijft gewoon pending en er ontstaat géén toegang.
    h.paymentsGet.mockResolvedValue(betaling("open"));
    await POST(
      webhookRequest(new URLSearchParams({ id: "tr_test_1", status: "paid" }))
    );
    expect((await pogingRij("tr_test_1")).status).toBe("pending");
    expect(await recht("u1", "waardebeleggen")).toBeUndefined();
    expect(h.bevestiging).not.toHaveBeenCalled();
  });

  it("zonder geldig tr_-id: 200 en Mollie wordt niet eens gebeld", async () => {
    const zonderId = await POST(webhookRequest(new URLSearchParams({ x: "y" })));
    const verkeerdId = await POST(
      webhookRequest(new URLSearchParams({ id: "ord_123" }))
    );
    expect(zonderId.status).toBe(200);
    expect(verkeerdId.status).toBe(200);
    expect(h.paymentsGet).not.toHaveBeenCalled();
  });

  it("onparseerbare body: rustig 200", async () => {
    const res = await POST(
      new Request("https://example.test/api/mollie/webhook", {
        method: "POST",
        body: "geen-formulier",
        headers: { "content-type": "application/json" },
      })
    );
    expect(res.status).toBe(200);
  });

  it("onbekend payment-id zonder onze metadata: 200, geen rij, niets muteren", async () => {
    // Een echte Mollie-betaling die niet van onze checkout komt (geen
    // attemptId in de metadata): geen reparatie, geen rij.
    h.paymentsGet.mockResolvedValue(betaling("paid"));
    const res = await POST(
      webhookRequest(new URLSearchParams({ id: "tr_onbekend" }))
    );
    expect(res.status).toBe(200);
    expect(await pogingRij("tr_onbekend")).toBeUndefined();
    // De bestaande poging is onaangeroerd.
    expect((await pogingRij("tr_test_1")).status).toBe("pending");
  });
});

describe("fouten bij Mollie", () => {
  it("404/410 (verzonnen id): rustig 200, geen herhaalstorm", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    h.paymentsGet.mockRejectedValue(
      Object.assign(new Error("Not found"), { statusCode: 404 })
    );
    const res = await POST(
      webhookRequest(new URLSearchParams({ id: "tr_verzonnen" }))
    );
    expect(res.status).toBe(200);
    warn.mockRestore();
  });

  it("echte storing (bijv. 401 of netwerk): 500, zodat Mollie herhaalt", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    h.paymentsGet.mockRejectedValue(
      Object.assign(new Error("Unauthorized"), { statusCode: 401 })
    );
    const res = await POST(
      webhookRequest(new URLSearchParams({ id: "tr_test_1" }))
    );
    expect(res.status).toBe(500);
    // En de poging is niet stiekem veranderd.
    expect((await pogingRij("tr_test_1")).status).toBe("pending");
    error.mockRestore();
  });
});
