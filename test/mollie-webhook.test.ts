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
import { purchases } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De Mollie-webhook: het publieke endpoint dat aankopen op "paid" zet. De twee
 * regels die niet gebroken mogen worden (zie CLAUDE.md): geloof niets uit de
 * payload behalve het id, en controleer bedrag én valuta tegen wat wij zelf
 * hebben vastgelegd. Plus: hetzelfde webhook-bericht komt gegarandeerd vaker
 * binnen, dus alles moet idempotent zijn.
 */

function webhookRequest(body: string | URLSearchParams): Request {
  return new Request("https://example.test/api/mollie/webhook", {
    method: "POST",
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}

function betaling(status: string, value = "49.00", currency = "EUR") {
  return { status, amount: { value, currency } };
}

async function aankoopRij(paymentId: string) {
  const rijen = await db
    .select()
    .from(purchases)
    .where(eq(purchases.molliePaymentId, paymentId));
  return rijen[0];
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
  await db.insert(purchases).values({
    userId: "u1",
    courseSlug: "waardebeleggen",
    molliePaymentId: "tr_test_1",
    status: "pending",
    amountCents: 4900,
    currency: "EUR",
  });
});

describe("betaald en correct", () => {
  it("zet de aankoop op paid en stuurt de orderbevestiging", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid"));

    const res = await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect(res.status).toBe(200);

    const rij = await aankoopRij("tr_test_1");
    expect(rij.status).toBe("paid");
    expect(rij.paidAt).toBeInstanceOf(Date);
    expect(h.bevestiging).toHaveBeenCalledWith("tr_test_1");
  });

  it("is idempotent: dezelfde webhook nog een keer laat alles heel", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid"));

    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    const eersteKeer = await aankoopRij("tr_test_1");

    const tweede = await POST(
      webhookRequest(new URLSearchParams({ id: "tr_test_1" }))
    );

    expect(tweede.status).toBe(200);
    const rijen = await db
      .select()
      .from(purchases)
      .where(eq(purchases.molliePaymentId, "tr_test_1"));
    expect(rijen).toHaveLength(1);
    expect(rijen[0].status).toBe("paid");
    // Ook de betaaldatum blijft exact staan: dat is de orderdatum op de
    // bevestiging, en herhaalde webhooks mogen die niet laten opschuiven.
    expect(rijen[0].paidAt).toEqual(eersteKeer.paidAt);
    // De bevestiging wordt opnieuw aangeroepen; de functie zelf bewaakt met
    // confirmationSentAt dat er maar één mail uitgaat (aparte test).
    expect(h.bevestiging).toHaveBeenCalledTimes(2);
  });

  it("accepteert een betaling van méér dan het vastgelegde bedrag", async () => {
    // Huidig, bewust gedrag: de controle is `betaald < verwacht`, dus te veel
    // betaald keurt hij goed. Te weinig nooit.
    h.paymentsGet.mockResolvedValue(betaling("paid", "50.00"));
    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect((await aankoopRij("tr_test_1")).status).toBe("paid");
  });
});

describe("bedrag- en valutacontrole", () => {
  it("te weinig betaald: status mismatch, geen toegang, geen mail", async () => {
    // De aanval: een echte betaling van 1 euro doen en dat id hierheen sturen
    // om een cursus van 49 euro te ontgrendelen.
    h.paymentsGet.mockResolvedValue(betaling("paid", "1.00"));

    const res = await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect(res.status).toBe(200); // wel rustig 200: niets laten herhalen

    expect((await aankoopRij("tr_test_1")).status).toBe("mismatch");
    expect(h.bevestiging).not.toHaveBeenCalled();
  });

  it("verkeerde valuta: status mismatch, ook al klopt het getal", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid", "49.00", "USD"));
    await POST(webhookRequest(new URLSearchParams({ id: "tr_test_1" })));
    expect((await aankoopRij("tr_test_1")).status).toBe("mismatch");
    expect(h.bevestiging).not.toHaveBeenCalled();
  });
});

describe("overige betalingsstatussen", () => {
  it.each(["failed", "expired", "canceled"])(
    "neemt status %s van Mollie over zonder mail",
    async (status) => {
      h.paymentsGet.mockResolvedValue(betaling(status));
      const res = await POST(
        webhookRequest(new URLSearchParams({ id: "tr_test_1" }))
      );
      expect(res.status).toBe(200);
      expect((await aankoopRij("tr_test_1")).status).toBe(status);
      expect(h.bevestiging).not.toHaveBeenCalled();
    }
  );
});

describe("de payload wordt niet geloofd", () => {
  it("negeert alles behalve het id: status uit de payload doet niets", async () => {
    // Een aanvaller POST "id=tr_test_1&status=paid". De route hoort de status
    // bij Mollie zelf op te halen; die zegt hier "open".
    h.paymentsGet.mockResolvedValue(betaling("open"));
    await POST(
      webhookRequest(new URLSearchParams({ id: "tr_test_1", status: "paid" }))
    );
    expect((await aankoopRij("tr_test_1")).status).toBe("open");
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

  it("onbekend payment-id met een echte Mollie-betaling: 200, niets muteren", async () => {
    h.paymentsGet.mockResolvedValue(betaling("paid"));
    const res = await POST(
      webhookRequest(new URLSearchParams({ id: "tr_onbekend" }))
    );
    expect(res.status).toBe(200);
    // De bestaande aankoop is onaangeroerd.
    expect((await aankoopRij("tr_test_1")).status).toBe("pending");
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
    // En de aankoop is niet stiekem veranderd.
    expect((await aankoopRij("tr_test_1")).status).toBe("pending");
    error.mockRestore();
  });
});
