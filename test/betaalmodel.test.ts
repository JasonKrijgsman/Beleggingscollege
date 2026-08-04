import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

const h = vi.hoisted(() => ({
  paymentsCreate: vi.fn(),
  paymentsGet: vi.fn(),
  verstuurMail: vi.fn(),
}));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/mail", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mail")>();
  return { ...orig, mailIsGeconfigureerd: true, verstuurMail: h.verstuurMail };
});
vi.mock("@/lib/mollie", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mollie")>();
  return {
    ...orig,
    mollieIsGeconfigureerd: true,
    mollie: () =>
      ({
        payments: { create: h.paymentsCreate, get: h.paymentsGet },
      }) as unknown as ReturnType<typeof orig.mollie>,
  };
});

import { POST as checkoutPOST } from "@/app/api/checkout/route";
import { POST as webhookPOST } from "@/app/api/mollie/webhook/route";
import { auth } from "@/auth";
import { entitlements, orderCounters, paymentAttempts } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De vijf verplichte concurrency-tests uit docs/ontwerp-betaalmodel.md §5,
 * elk gekoppeld aan de invarianten uit §4 (I1 t/m I6), plus de jaargrens-test
 * voor de ordernummering. De races worden gecontroleerd geïnterleaved met
 * uitgestelde promises op de gemockte Mollie-client: we laten
 * payments.create/get hangen tot de test het sein geeft, en schuiven de
 * andere kant er precies tussen. PGlite voert de voorwaardelijke UPDATEs en
 * unieke indexen daarbij écht uit.
 */

const authMock = vi.mocked(auth);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId } } : null) as never
  );
}

function checkoutRequest(slug: string): NextRequest {
  return new Request("https://example.test/api/checkout", {
    method: "POST",
    body: JSON.stringify({ slug, herroepingAkkoord: true }),
    headers: { "content-type": "application/json" },
  }) as unknown as NextRequest;
}

function webhookRequest(paymentId: string): Request {
  return new Request("https://example.test/api/mollie/webhook", {
    method: "POST",
    body: new URLSearchParams({ id: paymentId }),
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}

/** Een promise die de test zelf op het gewenste moment vrijgeeft. */
function uitgesteld<T>() {
  let vrijgeven!: (v: T) => void;
  const promise = new Promise<T>((res) => {
    vrijgeven = res;
  });
  return { promise, vrijgeven };
}

function mollieBetaling(
  paymentId: string,
  metadata: unknown,
  status = "paid",
  value = "49.00",
  currency = "EUR"
) {
  return { id: paymentId, status, amount: { value, currency }, metadata };
}

function checkoutAntwoord(paymentId: string) {
  return {
    id: paymentId,
    getCheckoutUrl: () => `https://mollie.test/checkout/${paymentId}`,
  };
}

async function alleRijen() {
  return db.select().from(paymentAttempts).orderBy(paymentAttempts.createdAt);
}

async function rijVoor(paymentId: string) {
  const rijen = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.molliePaymentId, paymentId));
  return rijen[0];
}

async function rechtVoor(userId: string, courseSlug: string) {
  const rijen = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.userId, userId));
  return rijen.find((r) => r.courseSlug === courseSlug);
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1", "koper@test.local");
  zetSessie("u1");
  h.verstuurMail.mockResolvedValue({ verstuurd: true, id: "mail-1" });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("1. twee gelijktijdige checkouts (scenario 1 — I1, I2, I3)", () => {
  /**
   * DEZE TEST IS OMGEDRAAID IN MIGRATIE 0005 — lees dit voor je hem "herstelt".
   *
   * Hij eiste eerst [200, 200] en twee openstaande rijen: twee betaalbare
   * links naast elkaar, want de splitsing van PR #22 ging erover dat béíde
   * vindbaar bleven (geen wees meer). Dat loste de onvindbare order op, maar
   * liet het duurdere gat open: de klant kón ze allebei betalen, en omdat
   * entitlements uniek is op (user, course) leverde de tweede betaling geen
   * extra recht op — alleen een tweede afschrijving.
   *
   * Sinds 0005 laat een partiële unique index nog maar één pending poging per
   * (gebruiker, cursus) toe. Wat I1 beschermde blijft overeind en wordt
   * hieronder nog steeds getest: een betaling die bij Mollie bestaat, moet aan
   * onze kant altijd terug te vinden zijn.
   */
  it("levert samen precies één betaalbare link op", async () => {
    const eerste = uitgesteld<unknown>();
    const tweede = uitgesteld<unknown>();
    h.paymentsCreate
      .mockReturnValueOnce(eerste.promise)
      .mockReturnValueOnce(tweede.promise);

    // Twee tabbladen: beide passeren de dedupe-select (geen van beide ziet
    // een entitlement) en hangen dan allebei in payments.create.
    const posts = [
      checkoutPOST(checkoutRequest("waardebeleggen")),
      checkoutPOST(checkoutRequest("waardebeleggen")),
    ];
    await vi.waitFor(() => expect(h.paymentsCreate).toHaveBeenCalledTimes(2));

    // De verliezer vraagt de winnaar op om diens link terug te kunnen geven.
    h.paymentsGet.mockResolvedValue(
      mollieBetaling("tr_A", { userId: "u1", courseSlug: "waardebeleggen" })
    );
    eerste.vrijgeven(checkoutAntwoord("tr_A"));
    tweede.vrijgeven(checkoutAntwoord("tr_B"));
    const antwoorden = await Promise.all(posts);

    // Eén van de twee wint. De ander krijgt óf dezelfde link (200) óf een
    // nette 409 — nooit een tweede betaalbare link.
    for (const a of antwoorden) expect([200, 409]).toContain(a.status);

    const openstaand = (await alleRijen()).filter(
      (r) => r.status === "pending"
    );
    expect(openstaand).toHaveLength(1);
  });

  it("houdt elke betaling die bij Mollie bestaat vindbaar (I1, I2, I3)", async () => {
    // De kern van I1, los van hoe de rijen ontstaan zijn: staat er een rij,
    // dan is de betaling een volwaardige order zodra hij betaald wordt. We
    // zetten de rij hier direct neer — zo dekt de test ook rijen van vóór
    // 0005 en die van de reparatietak.
    await db.insert(paymentAttempts).values({
      id: "33333333-3333-4333-8333-333333333333",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_A",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    h.paymentsGet.mockResolvedValue(
      mollieBetaling("tr_A", { userId: "u1", courseSlug: "waardebeleggen" })
    );
    const res = await webhookPOST(webhookRequest("tr_A"));
    expect(res.status).toBe(200);

    // I3: de betaalde poging is een zichtbare order met nummer …
    const a = await rijVoor("tr_A");
    expect(a.status).toBe("paid");
    expect(a.orderNumber).toMatch(/^BC-\d{4}-0001$/);
    // … en I2: precies één actief recht, hangend aan die order.
    const rechten = await db.select().from(entitlements);
    expect(rechten).toHaveLength(1);
    expect(rechten[0].status).toBe("actief");
    expect(rechten[0].attemptId).toBe(a.id);
  });
});

describe("2. checkout tegen webhook (scenario 2 — I1, I5)", () => {
  it("een checkout die dwars door de paid-webhook heen loopt kan de toegang niet meer terugdraaien", async () => {
    // Er staat al een pending poging (tr_A) van een eerdere klik.
    await db.insert(paymentAttempts).values({
      id: "11111111-1111-4111-8111-111111111111",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_A",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    // De ongeduldige tweede klik. Sinds 0005 ziet de checkout de openstaande
    // poging en vraagt Mollie wat die nog waard is, in plaats van meteen een
    // tweede betaling te maken. We laten dat ophalen hangen, zodat de webhook
    // er precies doorheen kan lopen.
    const hangend = uitgesteld<unknown>();
    h.paymentsGet.mockReturnValueOnce(
      hangend.promise as ReturnType<typeof h.paymentsGet>
    );
    const post = checkoutPOST(checkoutRequest("waardebeleggen"));
    await vi.waitFor(() => expect(h.paymentsGet).toHaveBeenCalledTimes(1));

    // … en precies dáár landt de paid-webhook voor tr_A.
    h.paymentsGet.mockResolvedValue(
      mollieBetaling("tr_A", { userId: "u1", courseSlug: "waardebeleggen" })
    );
    await webhookPOST(webhookRequest("tr_A"));
    expect((await rechtVoor("u1", "waardebeleggen"))?.status).toBe("actief");

    // Nu pas rondt de checkout af: de betaling die hij opvroeg blijkt betaald.
    hangend.vrijgeven(
      mollieBetaling("tr_A", { userId: "u1", courseSlug: "waardebeleggen" })
    );
    const antwoord = await post;

    // I5: geen enkele rij heeft paid verlaten, en het recht staat er nog. Dat
    // is wat deze test bewaakt — een late checkout mag toegang nooit
    // terugdraaien.
    expect((await rijVoor("tr_A")).status).toBe("paid");
    expect((await rechtVoor("u1", "waardebeleggen"))?.status).toBe("actief");

    // En hij heeft er geen tweede betaalbare link naast gezet.
    expect(antwoord.status).toBe(409);
    expect(h.paymentsCreate).not.toHaveBeenCalled();
    expect(await alleRijen()).toHaveLength(1);
  });
});

describe("3. dubbele webhook voor dezelfde betaling (§2.4 — I4, I5)", () => {
  it("precies één claim wint: één ordernummer, één mail, paidAt stabiel", async () => {
    await db.insert(paymentAttempts).values({
      id: "22222222-2222-4222-8222-222222222222",
      userId: "u1",
      courseSlug: "waardebeleggen",
      molliePaymentId: "tr_C",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });

    // Twee webhook-aanroepen tegelijk; beide hangen in payments.get zodat ze
    // allebei pas ná elkaars binnenkomst aan de database beginnen.
    const eerste = uitgesteld<unknown>();
    const tweede = uitgesteld<unknown>();
    h.paymentsGet
      .mockReturnValueOnce(eerste.promise)
      .mockReturnValueOnce(tweede.promise);
    const posts = [webhookPOST(webhookRequest("tr_C")), webhookPOST(webhookRequest("tr_C"))];
    await vi.waitFor(() => expect(h.paymentsGet).toHaveBeenCalledTimes(2));

    const betaling = mollieBetaling("tr_C", {
      userId: "u1",
      courseSlug: "waardebeleggen",
    });
    eerste.vrijgeven(betaling);
    tweede.vrijgeven(betaling);
    const antwoorden = await Promise.all(posts);
    expect(antwoorden.map((a) => a.status)).toEqual([200, 200]);

    // I4: één order, één nummer, één mail — de claim wint er maar één.
    const rij = await rijVoor("tr_C");
    expect(rij.status).toBe("paid");
    expect(rij.orderNumber).toMatch(/-0001$/);
    expect(h.verstuurMail).toHaveBeenCalledTimes(1);
    const tellers = await db.select().from(orderCounters);
    expect(tellers).toEqual([{ jaar: rij.paidAt!.getFullYear(), laatste: 1 }]);

    // I5: een derde, late webhook verandert niets meer — ook paidAt niet.
    const paidAtEerste = rij.paidAt;
    await webhookPOST(webhookRequest("tr_C"));
    const daarna = await rijVoor("tr_C");
    expect(daarna.paidAt).toEqual(paidAtEerste);
    expect(daarna.orderNumber).toBe(rij.orderNumber);
    expect(h.verstuurMail).toHaveBeenCalledTimes(1);
  });
});

describe("4. databasefout ná payments.create (scenario 3 — I1, I3)", () => {
  it("de reparatietak maakt de verloren rij aan uit onze eigen metadata en verwerkt normaal", async () => {
    const fout = vi.spyOn(console, "error").mockImplementation(() => {});
    const waarschuwing = vi.spyOn(console, "warn").mockImplementation(() => {});

    // De betaling ontstaat bij Mollie, maar onze insert faalt (Neon-hik).
    h.paymentsCreate.mockResolvedValue(checkoutAntwoord("tr_D"));
    const insertSpy = vi.spyOn(db, "insert").mockImplementationOnce(() => {
      throw new Error("Neon-hik");
    });
    await expect(
      checkoutPOST(checkoutRequest("waardebeleggen"))
    ).rejects.toThrow("Neon-hik");
    insertSpy.mockRestore();
    expect(await alleRijen()).toHaveLength(0);

    // De betaling draagt wél onze metadata (dat schreef de checkout er vóór
    // de crash al in — inclusief het attemptId en het bedrag).
    const metadata = h.paymentsCreate.mock.calls[0][0].metadata;
    expect(metadata.attemptId).toMatch(/^[0-9a-f-]{36}$/);

    // De paid-webhook voor het "onbekende" id: de reparatietak leest de
    // metadata uit ons éígen payments.get()-antwoord en maakt de rij alsnog.
    h.paymentsGet.mockResolvedValue(mollieBetaling("tr_D", metadata));
    const res = await webhookPOST(webhookRequest("tr_D"));
    expect(res.status).toBe(200);

    // I1 + I3: het id is weer reconcilieerbaar en de betaling is een
    // volwaardige order met nummer, recht en bevestiging.
    const rij = await rijVoor("tr_D");
    expect(rij.id).toBe(metadata.attemptId);
    expect(rij.status).toBe("paid");
    expect(rij.amountCents).toBe(4900);
    expect(rij.orderNumber).toMatch(/-0001$/);
    expect((await rechtVoor("u1", "waardebeleggen"))?.status).toBe("actief");
    expect(h.verstuurMail).toHaveBeenCalledTimes(1);

    fout.mockRestore();
    waarschuwing.mockRestore();
  });

  it("een vreemde betaling zónder onze metadata krijgt 200 en geen rij", async () => {
    h.paymentsGet.mockResolvedValue(
      mollieBetaling("tr_vreemd", { iets: "anders" })
    );
    const res = await webhookPOST(webhookRequest("tr_vreemd"));
    expect(res.status).toBe(200);
    expect(await alleRijen()).toHaveLength(0);
    expect(await db.select().from(entitlements)).toHaveLength(0);
  });
});

describe("5. refund gevolgd door heraankoop (scenario 5 — I1, I2, I4)", () => {
  it("nieuwe order, nieuw nummer, nieuwe bevestiging; het recht reactiveert; rij A blijft staan", async () => {
    // Eerste verkoop, volledig door de echte flow heen.
    h.paymentsCreate.mockResolvedValueOnce(checkoutAntwoord("tr_E"));
    expect((await checkoutPOST(checkoutRequest("waardebeleggen"))).status).toBe(200);
    h.paymentsGet.mockResolvedValue(
      mollieBetaling("tr_E", { userId: "u1", courseSlug: "waardebeleggen" })
    );
    await webhookPOST(webhookRequest("tr_E"));

    const orderA = await rijVoor("tr_E");
    expect(orderA.status).toBe("paid");
    expect(h.verstuurMail).toHaveBeenCalledTimes(1);

    // De refund (toekomstige refund-webhook/beheeractie, hier met de hand,
    // met exact de overgangen uit §2.2): paid -> refunded plus intrekking.
    await db
      .update(paymentAttempts)
      .set({ status: "refunded" })
      .where(eq(paymentAttempts.id, orderA.id));
    await db
      .update(entitlements)
      .set({
        status: "ingetrokken",
        revokedAt: new Date(),
        revokedReason: "refund",
      })
      .where(eq(entitlements.userId, "u1"));

    // De heraankoop: dedupe ziet geen actief recht en laat hem door.
    h.paymentsCreate.mockResolvedValueOnce(checkoutAntwoord("tr_F"));
    expect((await checkoutPOST(checkoutRequest("waardebeleggen"))).status).toBe(200);
    h.paymentsGet.mockResolvedValue(
      mollieBetaling("tr_F", { userId: "u1", courseSlug: "waardebeleggen" })
    );
    await webhookPOST(webhookRequest("tr_F"));

    // I4: eigen nummer, eigen bevestiging — niets geërfd van order A.
    const orderB = await rijVoor("tr_F");
    expect(orderB.status).toBe("paid");
    expect(orderB.orderNumber).not.toBe(orderA.orderNumber);
    expect(orderB.confirmationSentAt).toBeInstanceOf(Date);
    expect(h.verstuurMail).toHaveBeenCalledTimes(2);

    // I2: nog steeds één recht per gebruiker per cursus, gereactiveerd en
    // hangend aan de níéuwe order.
    const rechten = await db.select().from(entitlements);
    expect(rechten).toHaveLength(1);
    expect(rechten[0].status).toBe("actief");
    expect(rechten[0].attemptId).toBe(orderB.id);
    expect(rechten[0].revokedAt).toBeNull();
    expect(rechten[0].revokedReason).toBeNull();

    // I1: rij A staat er onaangeroerd bij, met haar eigen nummer en bewijs.
    const orderANa = await rijVoor("tr_E");
    expect(orderANa.status).toBe("refunded");
    expect(orderANa.orderNumber).toBe(orderA.orderNumber);
    expect(orderANa.paidAt).toEqual(orderA.paidAt);
  });
});

describe("ordernummers over een jaargrens (§5, slot)", () => {
  it("begint per jaar opnieuw op 0001, zonder gat in het oude jaar, en telt binnen een jaar door", async () => {
    // Alleen de klok van Date faken; PGlite en vi.waitFor blijven echt.
    vi.useFakeTimers({ toFake: ["Date"] });

    const koop = async (paymentId: string, slug: string) => {
      h.paymentsCreate.mockResolvedValueOnce(checkoutAntwoord(paymentId));
      expect((await checkoutPOST(checkoutRequest(slug))).status).toBe(200);
      h.paymentsGet.mockResolvedValue(
        mollieBetaling(paymentId, { userId: "u1", courseSlug: slug })
      );
      expect((await webhookPOST(webhookRequest(paymentId))).status).toBe(200);
      return (await rijVoor(paymentId)).orderNumber;
    };

    // 31 december, midden op de dag (geen lokale-tijd-verrassingen).
    vi.setSystemTime(new Date("2026-12-31T12:00:00Z"));
    expect(await koop("tr_dec", "waardebeleggen")).toBe("BC-2026-0001");

    // Over de jaargrens: de reeks begint opnieuw …
    vi.setSystemTime(new Date("2027-01-05T12:00:00Z"));
    expect(await koop("tr_jan", "technische-analyse")).toBe("BC-2027-0001");
    // … telt binnen het nieuwe jaar gewoon door …
    expect(await koop("tr_jan2", "opties-begrijpen")).toBe("BC-2027-0002");

    // … en in het oude jaar is geen gat gevallen: de teller staat nog op 1.
    const tellers = await db
      .select()
      .from(orderCounters)
      .orderBy(orderCounters.jaar);
    expect(tellers).toEqual([
      { jaar: 2026, laatste: 1 },
      { jaar: 2027, laatste: 2 },
    ]);
  });
});
