import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/auth";
import { entitlements, paymentAttempts } from "@/db/schema";
import { gekochteCursussen, heeftToegangTot } from "@/lib/entitlements";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * heeftToegangTot() is de enige toegangspoort tot betaalde cursussen. Deze
 * tests draaien tegen een echte (in-memory) Postgres met het echte schema,
 * zodat ook de where-clausule zelf — en niet een nagespeelde versie ervan —
 * bewijst dat alleen een entitlement met status "actief" toegang geeft. Een
 * betaalpoging, wélke status die ook heeft, geeft uit zichzelf nooit toegang:
 * dat recht ontstaat pas als de webhook-verwerking het entitlement verleent.
 */

const authMock = vi.mocked(auth);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId } } : null) as never
  );
}

let volgnummer = 0;

/** Een betaalpoging zonder entitlement — bewijst dat pogingen niets openen. */
async function poging(userId: string, courseSlug: string, status: string) {
  volgnummer += 1;
  const id = `poging-${volgnummer}`;
  await db.insert(paymentAttempts).values({
    id,
    userId,
    courseSlug,
    molliePaymentId: `tr_${volgnummer}`,
    status,
    amountCents: 4900,
    currency: "EUR",
  });
  return id;
}

/** De volledige uitkomst van een betaalde order: poging + actief recht. */
async function koop(
  userId: string,
  courseSlug: string,
  entitlementStatus: "actief" | "ingetrokken" = "actief"
) {
  const attemptId = await poging(userId, courseSlug, "paid");
  await db.insert(entitlements).values({
    userId,
    courseSlug,
    status: entitlementStatus,
    attemptId,
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

  it.each(["pending", "paid", "failed", "expired", "canceled", "mismatch", "refunded"])(
    "een betaalpoging met status %s geeft zonder entitlement géén toegang",
    async (status) => {
      // Ook "paid" niet: de poging is administratie, het recht is de poort.
      // De webhook verleent die twee altijd samen (in één statement).
      await maakGebruiker("u1");
      await poging("u1", "waardebeleggen", status);
      zetSessie("u1");
      expect(await heeftToegangTot("waardebeleggen")).toBe(false);
    }
  );

  it("entitlement met status actief: toegang", async () => {
    await maakGebruiker("u1");
    await koop("u1", "waardebeleggen");
    zetSessie("u1");
    expect(await heeftToegangTot("waardebeleggen")).toBe(true);
  });

  it("ingetrokken entitlement (refund/misbruik): geen toegang meer", async () => {
    await maakGebruiker("u1");
    await koop("u1", "waardebeleggen", "ingetrokken");
    zetSessie("u1");
    expect(await heeftToegangTot("waardebeleggen")).toBe(false);
  });

  it("een gekochte cursus geldt alleen voor díe cursus", async () => {
    await maakGebruiker("u1");
    await koop("u1", "waardebeleggen");
    zetSessie("u1");
    expect(await heeftToegangTot("technische-analyse")).toBe(false);
  });

  it("de aankoop van een ander geeft jou niets", async () => {
    await maakGebruiker("u1");
    await maakGebruiker("u2");
    await koop("u1", "waardebeleggen");
    zetSessie("u2");
    expect(await heeftToegangTot("waardebeleggen")).toBe(false);
  });
});

describe("gekochteCursussen", () => {
  it("zonder sessie: leeg", async () => {
    expect(await gekochteCursussen()).toEqual([]);
  });

  it("alleen de actieve rechten van de ingelogde gebruiker", async () => {
    await maakGebruiker("u1");
    await maakGebruiker("u2");
    await koop("u1", "waardebeleggen");
    await poging("u1", "technische-analyse", "pending");
    await koop("u1", "opties-begrijpen", "ingetrokken");
    await koop("u2", "technische-analyse");
    zetSessie("u1");
    expect(await gekochteCursussen()).toEqual(["waardebeleggen"]);
  });
});
