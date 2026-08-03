import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

const h = vi.hoisted(() => ({ paymentsCreate: vi.fn() }));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/mollie", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mollie")>();
  return {
    ...orig,
    mollieIsGeconfigureerd: true,
    mollie: () =>
      ({ payments: { create: h.paymentsCreate } }) as unknown as ReturnType<
        typeof orig.mollie
      >,
  };
});

import { POST } from "@/app/api/checkout/route";
import { auth } from "@/auth";
import { prijsInCenten } from "@/lib/prijs";
import { entitlements, paymentAttempts } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De checkout: hier moet de regel "de prijs komt uit onze eigen catalogus,
 * nooit uit het verzoek" aantoonbaar gelden, tot en met het exacte bedrag dat
 * naar Mollie gaat. Sinds de betaalmodel-splitsing is elke poging bovendien
 * een eigen, append-only rij in payment_attempts.
 */

const authMock = vi.mocked(auth);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId } } : null) as never
  );
}

function checkoutRequest(body: unknown): NextRequest {
  return new Request("https://example.test/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  }) as unknown as NextRequest;
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
  zetSessie("u1");
  h.paymentsCreate.mockResolvedValue({
    id: "tr_nieuw_1",
    getCheckoutUrl: () => "https://mollie.test/checkout/1",
  });
});

describe("catalogusprijs -> exact bedrag bij Mollie", () => {
  it("waardebeleggen (€49) wordt exact EUR 49.00", async () => {
    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      checkoutUrl: "https://mollie.test/checkout/1",
    });

    expect(h.paymentsCreate).toHaveBeenCalledTimes(1);
    const aanmaak = h.paymentsCreate.mock.calls[0][0];
    expect(aanmaak.amount).toEqual({ currency: "EUR", value: "49.00" });

    // En wat wij vastleggen is hetzelfde bedrag, in centen.
    const rijen = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.userId, "u1"));
    expect(rijen).toHaveLength(1);
    expect(rijen[0].amountCents).toBe(4900);
    expect(rijen[0].currency).toBe("EUR");
    expect(rijen[0].status).toBe("pending");
    expect(rijen[0].molliePaymentId).toBe("tr_nieuw_1");
    expect(rijen[0].withdrawalWaivedAt).toBeInstanceOf(Date);

    // De metadata draagt onze eigen sleutel + het bedrag: daarmee kan de
    // webhook-reparatietak een verloren insert reconstrueren (I1).
    expect(aanmaak.metadata).toEqual({
      userId: "u1",
      courseSlug: "waardebeleggen",
      attemptId: rijen[0].id,
      amountCents: 4900,
    });
  });

  it("een prijs of bedrag in het verzoek wordt volledig genegeerd", async () => {
    const res = await POST(
      checkoutRequest({
        slug: "waardebeleggen",
        herroepingAkkoord: true,
        // Alles hieronder is de aanval: de klant "stelt een prijs voor".
        price: "€0,01",
        amount: { currency: "EUR", value: "0.01" },
        amountCents: 1,
      })
    );
    expect(res.status).toBe(200);
    expect(h.paymentsCreate.mock.calls[0][0].amount).toEqual({
      currency: "EUR",
      value: "49.00",
    });
    expect(h.paymentsCreate.mock.calls[0][0].metadata.amountCents).toBe(4900);
  });
});

describe("wie en wat er niet doorheen mag", () => {
  it("zonder sessie: 401 en Mollie wordt niet gebeld", async () => {
    zetSessie(null);
    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(401);
    expect(h.paymentsCreate).not.toHaveBeenCalled();
  });

  it("onbekende cursus: 404", async () => {
    const res = await POST(
      checkoutRequest({ slug: "bestaat-niet", herroepingAkkoord: true })
    );
    expect(res.status).toBe(404);
  });

  it("gratis cursus: 400, die is niet te koop", async () => {
    const res = await POST(
      checkoutRequest({
        slug: "beleggen-voor-beginners",
        herroepingAkkoord: true,
      })
    );
    expect(res.status).toBe(400);
    expect(h.paymentsCreate).not.toHaveBeenCalled();
  });

  it("comingSoon-cursus is niet te koop (prijsInCenten weigert)", () => {
    // Sinds Beleggingspsychologie af is, heeft de catalogus geen comingSoon-
    // cursus meer om tegenaan te testen. De regel zelf blijft: de poort zit in
    // prijsInCenten (null -> 400 in de route, zelfde pad als de gratis cursus
    // hierboven), dus die toetsen we met een synthetisch exemplaar.
    expect(
      prijsInCenten({ free: false, comingSoon: true, price: "€49" })
    ).toBeNull();
  });

  it("zonder herroepingsakkoord: 400 en geen betaling", async () => {
    const res = await POST(checkoutRequest({ slug: "waardebeleggen" }));
    expect(res.status).toBe(400);
    expect(h.paymentsCreate).not.toHaveBeenCalled();
  });

  it("al gekocht (actief entitlement): 409 en geen tweede betaling", async () => {
    await db.insert(paymentAttempts).values({
      id: "poging-bestaand",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_bestaand",
      status: "paid",
      amountCents: 4900,
      currency: "EUR",
    });
    await db.insert(entitlements).values({
      userId: "u1",
      courseSlug: "waardebeleggen",
      status: "actief",
      attemptId: "poging-bestaand",
    });
    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ alGekocht: true });
    expect(h.paymentsCreate).not.toHaveBeenCalled();
  });

  it("een ingetrokken entitlement (na refund) blokkeert een heraankoop níét", async () => {
    await db.insert(paymentAttempts).values({
      id: "poging-refund",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_refund",
      status: "refunded",
      amountCents: 4900,
      currency: "EUR",
    });
    await db.insert(entitlements).values({
      userId: "u1",
      courseSlug: "waardebeleggen",
      status: "ingetrokken",
      attemptId: "poging-refund",
      revokedAt: new Date(),
      revokedReason: "refund",
    });
    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(200);
    expect(h.paymentsCreate).toHaveBeenCalledTimes(1);
  });

  it("kapotte JSON: 404 (onbekende cursus), geen crash", async () => {
    const res = await POST(
      new Request("https://example.test/api/checkout", {
        method: "POST",
        body: "geen-json",
        headers: { "content-type": "application/json" },
      }) as unknown as NextRequest
    );
    expect(res.status).toBe(404);
  });
});

describe("herhaalde pogingen", () => {
  it("na een eerdere mislukte poging: een NIEUWE rij ernaast, de oude blijft als historie staan", async () => {
    await db.insert(paymentAttempts).values({
      id: "poging-oud",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_oud",
      status: "failed",
      amountCents: 4900,
      currency: "EUR",
    });

    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(200);

    // Append-only (I1): het oude Mollie-id blijft vindbaar, ongewijzigd.
    const rijen = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.userId, "u1"))
      .orderBy(paymentAttempts.createdAt);
    expect(rijen).toHaveLength(2);
    const oud = rijen.find((r) => r.molliePaymentId === "tr_oud");
    const nieuw = rijen.find((r) => r.molliePaymentId === "tr_nieuw_1");
    expect(oud?.status).toBe("failed");
    expect(nieuw?.status).toBe("pending");
  });

  it("ook een mismatch-rij (bewijs) blijft staan bij een nieuwe poging", async () => {
    // Scenario 4 uit docs/ontwerp-betaalmodel.md: een retry mag het spoor van
    // een bedragafwijking nooit wissen.
    await db.insert(paymentAttempts).values({
      id: "poging-mismatch",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_mismatch",
      status: "mismatch",
      amountCents: 4900,
      currency: "EUR",
    });

    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(200);

    const bewijs = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.molliePaymentId, "tr_mismatch"));
    expect(bewijs).toHaveLength(1);
    expect(bewijs[0].status).toBe("mismatch");
  });

  it("Mollie zonder betaallink: 502", async () => {
    h.paymentsCreate.mockResolvedValue({
      id: "tr_zonder_url",
      getCheckoutUrl: () => null,
    });
    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(502);
  });
});
