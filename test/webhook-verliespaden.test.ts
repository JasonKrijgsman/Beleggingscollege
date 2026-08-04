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
 * De twee stille verliespaden uit de post-merge review van PR #42.
 *
 * Gemene deler: betaald geld dat zonder spoor zou verdwijnen omdat de webhook
 * 200 zegt terwijl er niets verwerkt is. Een 200 is hier onherroepelijk —
 * Mollie komt dan nooit meer terug. Een 500 is het tegenovergestelde: tot
 * tien herhalingen over 26 uur, en een foutregel in de logs zolang het duurt.
 * Deze tests pinnen vast dat beide paden LUID zijn in plaats van stil.
 */

function webhookRequest(id: string): Request {
  return new Request("https://example.test/api/mollie/webhook", {
    method: "POST",
    body: new URLSearchParams({ id }),
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}

function betaaldeBetaling(metadata: unknown = null) {
  return {
    status: "paid",
    amount: { value: "49.00", currency: "EUR" },
    metadata,
  };
}

async function rijVoor(paymentId: string) {
  const rijen = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.molliePaymentId, paymentId));
  return rijen[0];
}

async function rechten() {
  return db.select().from(entitlements);
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
});

describe("betaald geld op een afgesloten rij", () => {
  it("geeft 500 zodat Mollie herhaalt, en verleent niets", async () => {
    const fout = vi.spyOn(console, "error").mockImplementation(() => {});

    // De rij is ooit afgesloten (bijv. door de zelfherstelstap van de
    // checkout), maar Mollie meldt de betaling nu tóch als paid. Dat hoort
    // niet te kunnen — en juist daarom mag het geen stille 200 zijn.
    await db.insert(paymentAttempts).values({
      id: "poging-dicht",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_dicht",
      status: "expired",
      amountCents: 4900,
      currency: "EUR",
    });

    h.paymentsGet.mockResolvedValue(betaaldeBetaling());
    const res = await POST(webhookRequest("tr_dicht"));

    expect(res.status).toBe(500);
    expect((await rijVoor("tr_dicht")).status).toBe("expired");
    expect(await rechten()).toHaveLength(0);
    expect(h.bevestiging).not.toHaveBeenCalled();
    expect(fout).toHaveBeenCalledWith(
      expect.stringContaining("betaald geld op afgesloten rij")
    );
    fout.mockRestore();
  });
});

describe("reparatietak botst op de één-open-poging-index", () => {
  const metaB = {
    userId: "u1",
    courseSlug: "waardebeleggen",
    attemptId: "44444444-4444-4444-8444-444444444444",
    amountCents: 4900,
  };

  it("geeft 500 in plaats van de betaalde betaling stil te laten verdwijnen", async () => {
    const fout = vi.spyOn(console, "error").mockImplementation(() => {});
    const waarschuwing = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Er staat al een ándere pending poging voor dezelfde cursus. De insert
    // van de reparatietak botst daardoor op de partiële unique index. Vóór
    // deze fix slikte een ongerichte onConflictDoNothing dat stil weg:
    // betaald geld, geen rij, 200 — Mollie kwam nooit meer terug.
    await db.insert(paymentAttempts).values({
      id: "poging-open",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_open",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    h.paymentsGet.mockResolvedValue(betaaldeBetaling(metaB));
    const res = await POST(webhookRequest("tr_onbekend"));

    expect(res.status).toBe(500);
    expect(await rijVoor("tr_onbekend")).toBeUndefined();
    expect(await rechten()).toHaveLength(0);

    fout.mockRestore();
    waarschuwing.mockRestore();
  });

  it("slaagt bij de herhaalpoging zodra de openstaande rij is opgelost", async () => {
    const waarschuwing = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Zelfde beginsituatie, maar inmiddels is de blokkerende poging
    // afgesloten (verlopen bij Mollie, dus expired bij ons) — precies de
    // toestand waarin Mollie's herhaling binnenkomt.
    await db.insert(paymentAttempts).values({
      id: "poging-open",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_open",
      status: "expired",
      amountCents: 4900,
      currency: "EUR",
    });

    h.paymentsGet.mockResolvedValue(betaaldeBetaling(metaB));
    const res = await POST(webhookRequest("tr_onbekend"));

    expect(res.status).toBe(200);
    const rij = await rijVoor("tr_onbekend");
    expect(rij.status).toBe("paid");
    expect(rij.id).toBe(metaB.attemptId);
    const alle = await rechten();
    expect(alle).toHaveLength(1);
    expect(alle[0].status).toBe("actief");
    expect(alle[0].attemptId).toBe(metaB.attemptId);
    expect(h.bevestiging).toHaveBeenCalledTimes(1);

    waarschuwing.mockRestore();
  });

  it("blijft een no-op als een tweede webhook de rij al aanmaakte (gericht conflict)", async () => {
    const waarschuwing = vi.spyOn(console, "warn").mockImplementation(() => {});

    // De race die de onConflictDoNothing WÉL moet blijven vangen: hetzelfde
    // Mollie-id bestaat al. Gericht op mollie_payment_id gaat dat nog steeds
    // geluidloos goed — en de herverwerking is idempotent.
    await db.insert(paymentAttempts).values({
      id: metaB.attemptId,
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_onbekend",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    h.paymentsGet.mockResolvedValue(betaaldeBetaling(metaB));
    const res = await POST(webhookRequest("tr_onbekend"));

    expect(res.status).toBe(200);
    expect((await rijVoor("tr_onbekend")).status).toBe("paid");
    expect(await rechten()).toHaveLength(1);

    waarschuwing.mockRestore();
  });
});

describe("herhaalde paid-webhook en de bevestigingsmail", () => {
  it("geeft de mail bij elke herhaling een nieuwe kans — de poort blokkeert alleen refunded", async () => {
    // De mailpoort uit PR #42 (alleen sturen als de rij echt paid is) mag
    // een herhaalde webhook niet tegenhouden: stuurOrderbevestiging dedupet
    // zélf met een atomaire claim, en een eerder mislukte mail heeft de
    // herhaling juist nodig.
    await db.insert(paymentAttempts).values({
      id: "poging-1",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_1",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    h.paymentsGet.mockResolvedValue(betaaldeBetaling());
    await POST(webhookRequest("tr_1"));
    await POST(webhookRequest("tr_1"));

    expect(h.bevestiging).toHaveBeenCalledTimes(2);
  });
});
