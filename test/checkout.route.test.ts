import { beforeEach, describe, expect, it, vi } from "vitest";
import { and, eq } from "drizzle-orm";
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
import {
  db,
  houdVast,
  leegAlleTabellen,
  maakGebruiker,
} from "./helpers/pglite-db";

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

/**
 * Dubbele-afschrijving (priority-actions.md P0 #2). Twee tabbladen mogen niet
 * allebei een betaallink krijgen: de tweede afschrijving pakt geld en levert
 * niets, want het entitlement is al uniek per (gebruiker, cursus) — en er is
 * geen terugbetaalroute. Twee sloten sluiten dit: een dedupe-controle vóór
 * Mollie (het rustige geval) en een partiële unieke index op de pending-rij
 * (de echte race).
 */
describe("dubbele afschrijving — hooguit één lopende betaling per cursus", () => {
  it("een lopende (pending) betaling blokkeert een tweede checkout: 409, Mollie wordt niet gebeld", async () => {
    await db.insert(paymentAttempts).values({
      id: "poging-lopend",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_lopend",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ lopendeBetaling: true });
    expect(h.paymentsCreate).not.toHaveBeenCalled();

    // Er is geen tweede rij bij gekomen.
    const rijen = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.userId, "u1"));
    expect(rijen).toHaveLength(1);
  });

  it("een pending betaling voor een ándere cursus blokkeert deze niet", async () => {
    await db.insert(paymentAttempts).values({
      id: "poging-andere-cursus",
      userId: "u1",
      courseSlug: "technische-analyse",
      molliePaymentId: "tr_andere",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    const res = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    expect(res.status).toBe(200);
    expect(h.paymentsCreate).toHaveBeenCalledTimes(1);
  });

  it("twee gelijktijdige checkouts die de controle allebei passeren: precies één betaling, de ander 409", async () => {
    // Elke Mollie-aanmaak een eigen id, zodat de tweede insert botst op de
    // (gebruiker, cursus)-index en niet toevallig op het Mollie-id.
    let n = 0;
    h.paymentsCreate.mockImplementation(async () => {
      const i = ++n;
      return { id: `tr_race_${i}`, getCheckoutUrl: () => `https://mollie.test/checkout/${i}` };
    });

    // A wordt stilgezet vlak vóór het schrijven van zijn pending-rij; B loopt er
    // dan volledig langs. B's dedupe-controle ziet nog geen pending (A's insert
    // hangt), dus B maakt een betaling én zijn rij. Pas dan mag A verder: A's
    // insert botst op de partiële unieke index en geeft niets terug → 409.
    const haak = houdVast(/insert\s+into\s+"?payment_attempts"?/i);
    const a = POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    await haak.bereikt;
    const bRes = await POST(
      checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true })
    );
    haak.laatLos();
    const aRes = await a;

    // Eén 200 en één 409, ongeacht welke van de twee won.
    expect([aRes.status, bRes.status].sort()).toEqual([200, 409]);

    // Beide riepen Mollie aan (de controle liet ze allebei door), maar er staat
    // precies één pending-rij: de index liet de tweede afschrijving niet toe.
    expect(h.paymentsCreate).toHaveBeenCalledTimes(2);
    const pending = await db
      .select()
      .from(paymentAttempts)
      .where(
        and(
          eq(paymentAttempts.userId, "u1"),
          eq(paymentAttempts.status, "pending")
        )
      );
    expect(pending).toHaveLength(1);
  });

  it("de database weigert twee pending-rijen voor dezelfde cursus rechtstreeks (de index zelf)", async () => {
    await db.insert(paymentAttempts).values({
      id: "pending-1",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_p1",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    await expect(
      db.insert(paymentAttempts).values({
        id: "pending-2",
        userId: "u1",
        courseSlug: "waardebeleggen",
        molliePaymentId: "tr_p2",
        status: "pending",
        amountCents: 4900,
        currency: "EUR",
      })
    ).rejects.toThrow();

    // Maar een tweede NIET-pending rij (bijv. een verlopen poging) mag wél:
    // append-only historie blijft mogelijk.
    await expect(
      db.insert(paymentAttempts).values({
        id: "verlopen-1",
        userId: "u1",
        courseSlug: "waardebeleggen",
        molliePaymentId: "tr_v1",
        status: "expired",
        amountCents: 4900,
        currency: "EUR",
      })
    ).resolves.toBeDefined();
  });
});
