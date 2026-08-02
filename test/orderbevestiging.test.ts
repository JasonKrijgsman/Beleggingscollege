import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

const h = vi.hoisted(() => ({ verstuurMail: vi.fn() }));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/lib/mail", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mail")>();
  return { ...orig, mailIsGeconfigureerd: true, verstuurMail: h.verstuurMail };
});

import { purchases, users } from "@/db/schema";
import { stuurOrderbevestiging } from "@/lib/orderbevestiging";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De orderbevestiging is het sluitstuk van de webhook-idempotentie: Mollie
 * roept de webhook gegarandeerd vaker aan, en confirmationSentAt is de enige
 * reden dat de klant daar niet tien identieke mails van krijgt.
 */

async function maakAankoop(overrides: Partial<typeof purchases.$inferInsert> = {}) {
  await db.insert(purchases).values({
    userId: "u1",
    courseSlug: "waardebeleggen",
    molliePaymentId: "tr_mail_1",
    status: "paid",
    amountCents: 4900,
    currency: "EUR",
    paidAt: new Date(),
    ...overrides,
  });
}

async function rij(paymentId = "tr_mail_1") {
  const rijen = await db
    .select()
    .from(purchases)
    .where(eq(purchases.molliePaymentId, paymentId));
  return rijen[0];
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1", "koper@test.local");
  h.verstuurMail.mockResolvedValue({ verstuurd: true, id: "mail-1" });
});

describe("stuurOrderbevestiging", () => {
  it("verstuurt één bevestiging en legt dat vast", async () => {
    await maakAankoop();
    await stuurOrderbevestiging("tr_mail_1");

    expect(h.verstuurMail).toHaveBeenCalledTimes(1);
    expect(h.verstuurMail.mock.calls[0][0].aan).toBe("koper@test.local");

    const aankoop = await rij();
    expect(aankoop.confirmationSentAt).toBeInstanceOf(Date);
    // Het ordernummer volgt het patroon BC-<jaar>-<volgnummer>.
    expect(aankoop.orderNumber).toMatch(/^BC-\d{4}-\d{4}$/);
  });

  it("stuurt bij een tweede aanroep GEEN tweede mail (webhook-idempotentie)", async () => {
    await maakAankoop();
    await stuurOrderbevestiging("tr_mail_1");
    await stuurOrderbevestiging("tr_mail_1");
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).toHaveBeenCalledTimes(1);
  });

  it("stuurt niets voor een aankoop die niet op paid staat", async () => {
    await maakAankoop({ status: "pending" });
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).not.toHaveBeenCalled();
    expect((await rij()).confirmationSentAt).toBeNull();
  });

  it("stuurt niets voor een onbekend payment-id en gooit ook niet", async () => {
    await expect(stuurOrderbevestiging("tr_bestaat_niet")).resolves.toBeUndefined();
    expect(h.verstuurMail).not.toHaveBeenCalled();
  });

  it("mislukt de mail, dan blijft confirmationSentAt leeg zodat een volgende poging het opnieuw probeert", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await maakAankoop();
    h.verstuurMail.mockResolvedValue({ verstuurd: false, reden: "resend 500" });

    await stuurOrderbevestiging("tr_mail_1");
    expect((await rij()).confirmationSentAt).toBeNull();

    // De volgende webhook-aanroep probeert het dan wél opnieuw.
    h.verstuurMail.mockResolvedValue({ verstuurd: true, id: "mail-2" });
    await stuurOrderbevestiging("tr_mail_1");
    expect(h.verstuurMail).toHaveBeenCalledTimes(2);
    expect((await rij()).confirmationSentAt).toBeInstanceOf(Date);
    error.mockRestore();
  });

  it("zonder e-mailadres: geen mail, geen crash, geen vinkje", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await leegAlleTabellen();
    await db.insert(users).values({ id: "u2", name: "Zonder Mail", email: null });
    await maakAankoop({ userId: "u2", molliePaymentId: "tr_mail_2" });

    await stuurOrderbevestiging("tr_mail_2");
    expect(h.verstuurMail).not.toHaveBeenCalled();
    expect((await rij("tr_mail_2")).confirmationSentAt).toBeNull();
    error.mockRestore();
  });

  it("een gooiende mailfunctie laat de webhook-keten niet vallen", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await maakAankoop();
    h.verstuurMail.mockRejectedValue(new Error("netwerk weg"));
    await expect(stuurOrderbevestiging("tr_mail_1")).resolves.toBeUndefined();
    expect((await rij()).confirmationSentAt).toBeNull();
    error.mockRestore();
  });
});
