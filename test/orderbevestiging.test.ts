import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

const h = vi.hoisted(() => ({ verstuurMail: vi.fn() }));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/lib/mail", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mail")>();
  return { ...orig, mailIsGeconfigureerd: true, verstuurMail: h.verstuurMail };
});

import { paymentAttempts, users } from "@/db/schema";
import { stuurOrderbevestiging } from "@/lib/orderbevestiging";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De orderbevestiging is het sluitstuk van de webhook-idempotentie: Mollie
 * roept de webhook gegarandeerd vaker aan, en de atomaire claim op de
 * attempt-rij (confirmationClaimedAt) is de enige reden dat de klant daar
 * niet tien identieke mails van krijgt. Het ordernummer zelf wordt hier niet
 * meer toegekend — dat doet de paid-verwerking in de webhook, atomair; die
 * nummering wordt in test/betaalmodel.test.ts bewezen.
 */

let volgnummer = 0;

async function maakOrder(
  overrides: Partial<typeof paymentAttempts.$inferInsert> = {}
) {
  volgnummer += 1;
  await db.insert(paymentAttempts).values({
    id: `order-${volgnummer}`,
    userId: "u1",
    courseSlug: "waardebeleggen",
    molliePaymentId: "tr_mail_1",
    status: "paid",
    amountCents: 4900,
    currency: "EUR",
    paidAt: new Date(),
    orderNumber: `BC-2026-${String(volgnummer).padStart(4, "0")}`,
    ...overrides,
  });
}

async function rij(paymentId = "tr_mail_1") {
  const rijen = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.molliePaymentId, paymentId));
  return rijen[0];
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1", "koper@test.local");
  h.verstuurMail.mockResolvedValue({ verstuurd: true, id: "mail-1" });
});

describe("stuurOrderbevestiging", () => {
  it("verstuurt één bevestiging en legt claim én verzending vast", async () => {
    await maakOrder();
    await stuurOrderbevestiging("tr_mail_1");

    expect(h.verstuurMail).toHaveBeenCalledTimes(1);
    expect(h.verstuurMail.mock.calls[0][0].aan).toBe("koper@test.local");
    // Het toegekende ordernummer staat in de mail zelf.
    expect(h.verstuurMail.mock.calls[0][0].tekst).toContain("BC-2026-0001");

    const order = await rij();
    expect(order.confirmationClaimedAt).toBeInstanceOf(Date);
    expect(order.confirmationSentAt).toBeInstanceOf(Date);
  });

  it("stuurt bij een tweede aanroep GEEN tweede mail (webhook-idempotentie)", async () => {
    await maakOrder();
    await stuurOrderbevestiging("tr_mail_1");
    await stuurOrderbevestiging("tr_mail_1");
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).toHaveBeenCalledTimes(1);
  });

  it("stuurt niets voor een poging die niet op paid staat", async () => {
    await maakOrder({ status: "pending", orderNumber: null });
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).not.toHaveBeenCalled();
    expect((await rij()).confirmationSentAt).toBeNull();
  });

  it("stuurt niets voor een onbekend payment-id en gooit ook niet", async () => {
    await expect(stuurOrderbevestiging("tr_bestaat_niet")).resolves.toBeUndefined();
    expect(h.verstuurMail).not.toHaveBeenCalled();
  });

  it("paid zonder ordernummer (rij van vóór de migratie): geen mail, wel een luide log", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await maakOrder({ orderNumber: null });
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("mislukt de mail, dan gaat de claim terug zodat een volgende poging het opnieuw probeert", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await maakOrder();
    h.verstuurMail.mockResolvedValue({ verstuurd: false, reden: "smtp 500" });

    await stuurOrderbevestiging("tr_mail_1");
    expect((await rij()).confirmationSentAt).toBeNull();
    expect((await rij()).confirmationClaimedAt).toBeNull();

    // De volgende webhook-aanroep probeert het dan wél opnieuw.
    h.verstuurMail.mockResolvedValue({ verstuurd: true, id: "mail-2" });
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).toHaveBeenCalledTimes(2);
    expect((await rij()).confirmationSentAt).toBeInstanceOf(Date);
    error.mockRestore();
  });

  it("een blijvende claim zonder verzending (crash) blokkeert een herhaalde webhook", async () => {
    // §2.4: crasht de winnaar tussen claim en verzending, dan blijft de claim
    // staan en mailt niemand vanzelf opnieuw — dat is zichtbaar als "geclaimd
    // zonder verstuurd" en is werk voor de monitoringronde, geen stille
    // dubbele mail.
    await maakOrder({ confirmationClaimedAt: new Date() });
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).not.toHaveBeenCalled();
    expect((await rij()).confirmationSentAt).toBeNull();
  });

  it("zonder e-mailadres: geen mail, geen crash, geen vinkje", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await leegAlleTabellen();
    await db.insert(users).values({ id: "u2", name: "Zonder Mail", email: null });
    await maakOrder({ userId: "u2", molliePaymentId: "tr_mail_2" });

    await stuurOrderbevestiging("tr_mail_2");
    expect(h.verstuurMail).not.toHaveBeenCalled();
    expect((await rij("tr_mail_2")).confirmationSentAt).toBeNull();
    error.mockRestore();
  });

  it("een gooiende mailfunctie laat de webhook-keten niet vallen", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await maakOrder();
    h.verstuurMail.mockRejectedValue(new Error("netwerk weg"));
    await expect(stuurOrderbevestiging("tr_mail_1")).resolves.toBeUndefined();
    expect((await rij()).confirmationSentAt).toBeNull();
    error.mockRestore();
  });
});
