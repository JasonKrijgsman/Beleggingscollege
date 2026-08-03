import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/auth";
import { purchases } from "@/db/schema";
import { gekochteCursussen, heeftToegangTot } from "@/lib/entitlements";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * heeftToegangTot() is de enige toegangspoort tot betaalde cursussen. Deze
 * tests draaien tegen een echte (in-memory) Postgres met het echte schema,
 * zodat ook de where-clausule zelf — en niet een nagespeelde versie ervan —
 * bewijst dat alleen `status = 'paid'` toegang geeft.
 */

const authMock = vi.mocked(auth);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId } } : null) as never
  );
}

async function koop(
  userId: string,
  courseSlug: string,
  status: string,
  paymentId: string
) {
  await db.insert(purchases).values({
    userId,
    courseSlug,
    molliePaymentId: paymentId,
    status,
    amountCents: 4900,
    currency: "EUR",
  });
}

beforeEach(async () => {
  await leegAlleTabellen();
  zetSessie(null);
});

describe("heeftToegangTot", () => {
  it("gratis cursus: iedereen, ook zonder account", async () => {
    zetSessie(null);
    expect(await heeftToegangTot("beleggen-voor-beginners")).toBe(true);
  });

  it("onbekende cursus: niemand", async () => {
    zetSessie("u1");
    expect(await heeftToegangTot("bestaat-niet")).toBe(false);
  });

  it("betaalde cursus zonder sessie: nee", async () => {
    expect(await heeftToegangTot("waardebeleggen")).toBe(false);
  });

  it("ingelogd maar niets gekocht: nee", async () => {
    await maakGebruiker("u1");
    zetSessie("u1");
    expect(await heeftToegangTot("waardebeleggen")).toBe(false);
  });

  it("aankoop met status pending: nog geen toegang", async () => {
    await maakGebruiker("u1");
    await koop("u1", "waardebeleggen", "pending", "tr_pending_1");
    zetSessie("u1");
    expect(await heeftToegangTot("waardebeleggen")).toBe(false);
  });

  it.each(["failed", "expired", "canceled", "mismatch", "refunded"])(
    "aankoop met status %s: geen toegang",
    async (status) => {
      await maakGebruiker("u1");
      await koop("u1", "waardebeleggen", status, `tr_${status}_1`);
      zetSessie("u1");
      expect(await heeftToegangTot("waardebeleggen")).toBe(false);
    }
  );

  it("aankoop met status paid: toegang", async () => {
    await maakGebruiker("u1");
    await koop("u1", "waardebeleggen", "paid", "tr_paid_1");
    zetSessie("u1");
    expect(await heeftToegangTot("waardebeleggen")).toBe(true);
  });

  it("een betaalde aankoop geldt alleen voor díe cursus", async () => {
    await maakGebruiker("u1");
    await koop("u1", "waardebeleggen", "paid", "tr_paid_2");
    zetSessie("u1");
    expect(await heeftToegangTot("technische-analyse")).toBe(false);
  });

  it("de aankoop van een ander geeft jou niets", async () => {
    await maakGebruiker("u1");
    await maakGebruiker("u2");
    await koop("u1", "waardebeleggen", "paid", "tr_paid_3");
    zetSessie("u2");
    expect(await heeftToegangTot("waardebeleggen")).toBe(false);
  });
});

describe("gekochteCursussen", () => {
  it("zonder sessie: leeg", async () => {
    expect(await gekochteCursussen()).toEqual([]);
  });

  it("alleen de betaalde aankopen van de ingelogde gebruiker", async () => {
    await maakGebruiker("u1");
    await maakGebruiker("u2");
    await koop("u1", "waardebeleggen", "paid", "tr_a");
    await koop("u1", "technische-analyse", "pending", "tr_b");
    await koop("u2", "technische-analyse", "paid", "tr_c");
    zetSessie("u1");
    expect(await gekochteCursussen()).toEqual(["waardebeleggen"]);
  });
});
