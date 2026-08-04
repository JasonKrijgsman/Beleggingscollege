import { beforeEach, describe, expect, it, vi } from "vitest";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

const h = vi.hoisted(() => ({
  paymentsCreate: vi.fn(),
  paymentsGet: vi.fn(),
  paymentsCancel: vi.fn(),
}));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/mollie", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mollie")>();
  return {
    ...orig,
    mollieIsGeconfigureerd: true,
    mollie: () =>
      ({
        payments: {
          create: h.paymentsCreate,
          get: h.paymentsGet,
          cancel: h.paymentsCancel,
        },
      }) as unknown as ReturnType<typeof orig.mollie>,
  };
});

import { POST } from "@/app/api/checkout/route";
import { auth } from "@/auth";
import { paymentAttempts } from "@/db/schema";
import {
  db,
  houdVast,
  leegAlleTabellen,
  maakGebruiker,
} from "./helpers/pglite-db";

/**
 * Eén openstaande betaling per cursus.
 *
 * Het gat: de "al gekocht?"-controle leest entitlements en maakt daarna pas
 * een betaling aan. Twee tabbladen zagen dus allebei niets en kregen allebei
 * een betaalbare link. Betaalde de klant ze allebei, dan leverde de tweede
 * niets op — entitlements is uniek op (user, course), dus die betaling
 * herwees alleen attempt_id. Dubbel afgeschreven, één cursus.
 *
 * De garantie zit in de partiële unique index uit migratie 0005; de checkout
 * maakt er alleen een nette ervaring van.
 */

const authMock = vi.mocked(auth);

function checkoutRequest(body: unknown): NextRequest {
  return new Request("https://example.test/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  }) as unknown as NextRequest;
}

const koop = () =>
  POST(checkoutRequest({ slug: "waardebeleggen", herroepingAkkoord: true }));

async function pendingRijen(userId = "u1") {
  return db
    .select()
    .from(paymentAttempts)
    .where(
      and(
        eq(paymentAttempts.userId, userId),
        eq(paymentAttempts.status, "pending")
      )
    );
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
  authMock.mockResolvedValue({ user: { id: "u1" } } as never);
  let n = 0;
  h.paymentsCreate.mockImplementation(async () => {
    n += 1;
    return {
      id: `tr_nieuw_${n}`,
      isCancelable: true,
      getCheckoutUrl: () => `https://mollie.test/checkout/${n}`,
    };
  });
});

describe("tweede poging terwijl de eerste nog openstaat", () => {
  it("hergebruikt de bestaande betaallink in plaats van een tweede te maken", async () => {
    const eerste = await koop();
    expect(eerste.status).toBe(200);
    expect(await eerste.json()).toMatchObject({
      checkoutUrl: "https://mollie.test/checkout/1",
    });

    // Het tweede tabblad: Mollie zegt dat de eerste betaling nog openstaat.
    h.paymentsGet.mockResolvedValueOnce({
      status: "open",
      getCheckoutUrl: () => "https://mollie.test/checkout/1",
    });

    const tweede = await koop();
    expect(tweede.status).toBe(200);
    expect(await tweede.json()).toMatchObject({
      checkoutUrl: "https://mollie.test/checkout/1",
      hergebruikt: true,
    });

    // En dat is het punt: er is géén tweede betaling gemaakt.
    expect(h.paymentsCreate).toHaveBeenCalledTimes(1);
    expect(await pendingRijen()).toHaveLength(1);
  });

  it("begint wél opnieuw als de vorige poging verlopen is", async () => {
    await koop();

    h.paymentsGet.mockResolvedValueOnce({
      status: "expired",
      getCheckoutUrl: () => null,
    });

    const tweede = await koop();
    expect(tweede.status).toBe(200);
    expect(await tweede.json()).toMatchObject({
      checkoutUrl: "https://mollie.test/checkout/2",
    });

    // De oude rij is afgesloten, niet verwijderd: bewijs blijft staan.
    const alle = await db.select().from(paymentAttempts);
    expect(alle).toHaveLength(2);
    expect(alle.find((r) => r.molliePaymentId === "tr_nieuw_1")?.status).toBe(
      "expired"
    );
    expect(await pendingRijen()).toHaveLength(1);
  });
});

describe("twee gelijktijdige verzoeken", () => {
  it("levert samen precies één openstaande poging op", async () => {
    // Houd de insert van het eerste verzoek vast, laat het tweede er volledig
    // langs, en geef het daarna vrij. Beide zijn dus door de "loopt er al
    // wat?"-controle heen voordat één van beide geschreven heeft — precies de
    // volgorde die twee betaalbare links opleverde.
    const slot = houdVast(/insert into "payment_attempts"/i);

    const eerste = koop();
    await slot.bereikt;

    const tweede = await koop();
    slot.laatLos();
    const eersteRes = await eerste;

    const statussen = [eersteRes.status, tweede.status].sort();
    // Eén van de twee wint; de ander krijgt de link van de winnaar (200) of
    // een nette 409. Wat er níét mag gebeuren staat hieronder.
    expect(statussen.every((s) => s === 200 || s === 409)).toBe(true);

    // De garantie: één openstaande poging, dus één betaalbare link.
    expect(await pendingRijen()).toHaveLength(1);

    // En de betaling die de verliezer bij Mollie had aangemaakt, blijft niet
    // betaalbaar rondzwerven.
    if (h.paymentsCreate.mock.calls.length > 1) {
      expect(h.paymentsCancel).toHaveBeenCalled();
    }
  });
});

describe("andere cursus", () => {
  it("blijft gewoon mogelijk naast een openstaande poging", async () => {
    await koop();

    const andere = await POST(
      checkoutRequest({ slug: "technische-analyse", herroepingAkkoord: true })
    );

    expect(andere.status).toBe(200);
    expect(await pendingRijen()).toHaveLength(2);
    expect(h.paymentsGet).not.toHaveBeenCalled();
  });
});
