import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { POST } from "@/app/api/voortgang/route";
import { auth } from "@/auth";
import { flatLessons, getCourse } from "@/content";
import { entitlements, lessonProgress, paymentAttempts } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De route-schil om voortgang-server heen. De rekenregels zelf staan in
 * test/voortgang-server.test.ts; hier bewaken we wat de HTTP-laag doet:
 * de sessiepoort, de TOEGANGSPOORT, kapotte verzoeken, en dat rommel in de
 * body de server nooit laat crashen (de client stuurt dit fire-and-forget).
 *
 * De toegangspoort is de kern van dit bestand. Zonder die controle kon
 * iedereen met een gratis account voortgang bijschrijven voor een betaalde
 * cursus, en zo XP, badges en een certificaat verzamelen voor materiaal dat
 * hij nooit gekocht heeft. Toegang wordt uitsluitend verleend via een
 * entitlement met status "actief" — nooit via de oude purchases-tabel.
 */

const authMock = vi.mocked(auth);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId } } : null) as never
  );
}

function verzoek(body: unknown): NextRequest {
  return new Request("https://example.test/api/voortgang", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json" },
  }) as unknown as NextRequest;
}

// De kalenderdag van de "gebruiker": de server accepteert maximaal twee dagen
// klokafwijking, dus de echte datum van nu is de enige die altijd geldig is.
const VANDAAG = new Date().toISOString().slice(0, 10);

const CURSUS = "beleggen-voor-beginners";
const LES = "waarom-beleggen";
// De verwachte XP komt uit de cursusinhoud zelf: de server begrenst een
// opgestuurde score op de échte quizlengte, dus dat doet de test ook.
const LES_DATA = flatLessons(getCourse(CURSUS)!).find(
  (x) => x.lesson.slug === LES
)!.lesson;
const LES_XP = LES_DATA.xp;
const QUIZ_LEN = LES_DATA.quiz.length;
const VOLLE_BONUS = QUIZ_LEN > 0 ? 25 : 0;

// Een écht betaalde cursus uit de catalogus, zodat de test meebeweegt als
// het aanbod verandert.
const BETAALD = "waardebeleggen";
const BETAALDE_LES = flatLessons(getCourse(BETAALD)!)[0].lesson;

let volgnummer = 0;

/** Toegang verlenen zoals de webhook dat doet: een betaalpoging plus een
 *  actief entitlement. Nooit via de dode purchases-tabel. */
async function koop(userId: string, courseSlug: string) {
  volgnummer += 1;
  const attemptId = `poging-${volgnummer}`;
  await db.insert(paymentAttempts).values({
    id: attemptId,
    userId,
    courseSlug,
    molliePaymentId: `tr_${volgnummer}`,
    status: "paid",
    amountCents: 4900,
    currency: "EUR",
  });
  await db.insert(entitlements).values({
    userId,
    courseSlug,
    status: "actief",
    attemptId,
  });
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
  zetSessie("u1");
});

describe("de sessiepoort", () => {
  it("zonder sessie: 401 en de database blijft leeg", async () => {
    zetSessie(null);
    const res = await POST(
      verzoek({ soort: "les", courseSlug: CURSUS, lessonSlug: LES })
    );
    expect(res.status).toBe(401);
    expect(await db.select().from(lessonProgress)).toHaveLength(0);
  });
});

describe("kapotte verzoeken", () => {
  it("onparseerbare JSON: 400, geen crash", async () => {
    expect((await POST(verzoek("geen-json"))).status).toBe(400);
  });

  it("een niet-object of onbekende soort: 400", async () => {
    expect((await POST(verzoek(null))).status).toBe(400);
    expect((await POST(verzoek({ soort: "iets-anders" }))).status).toBe(400);
  });

  it("soort 'les' zonder stringslugs: 400", async () => {
    const res = await POST(
      verzoek({ soort: "les", courseSlug: 42, lessonSlug: ["x"] })
    );
    expect(res.status).toBe(400);
  });
});

describe("soort 'les'", () => {
  it("een echte les: 200 en de herrekende voortgang komt terug", async () => {
    const res = await POST(
      verzoek({
        soort: "les",
        courseSlug: CURSUS,
        lessonSlug: LES,
        correct: QUIZ_LEN,
        total: QUIZ_LEN,
        dagLokaal: VANDAAG,
      })
    );
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.completed[CURSUS]).toEqual([LES]);
    // XP komt uit de cursusinhoud (les-XP + volle quizbonus),
    // niet uit wat de client beweert.
    expect(state.xp).toBe(LES_XP + VOLLE_BONUS);
  });

  it("rommel in de quizvelden wordt naar 0 gedwongen, geen crash", async () => {
    const res = await POST(
      verzoek({
        soort: "les",
        courseSlug: CURSUS,
        lessonSlug: LES,
        correct: "banaan",
        total: { evil: true },
        dagLokaal: VANDAAG,
      })
    );
    expect(res.status).toBe(200);
    const { state } = await res.json();
    // Les telt, maar zonder quizbonus.
    expect(state.completed[CURSUS]).toEqual([LES]);
    expect(state.xp).toBe(LES_XP);
  });

  it("een onbekende les of cursus: 400, en er wordt niets geschreven", async () => {
    // Een slug die we niet kennen is geen stille no-op maar een fout: er
    // klopt dan iets niet aan de aanroep, en dat hoort de client te merken.
    const res = await POST(
      verzoek({
        soort: "les",
        courseSlug: CURSUS,
        lessonSlug: "bestaat-niet",
        correct: 4,
        total: 4,
        dagLokaal: VANDAAG,
      })
    );
    expect(res.status).toBe(400);

    const res2 = await POST(
      verzoek({
        soort: "les",
        courseSlug: "bestaat-niet",
        lessonSlug: LES,
        correct: 4,
        total: 4,
        dagLokaal: VANDAAG,
      })
    );
    expect(res2.status).toBe(400);
    expect(await db.select().from(lessonProgress)).toHaveLength(0);
  });
});

describe("de toegangspoort", () => {
  it("betaalde cursus zonder aankoop: 403, en de database blijft leeg", async () => {
    const res = await POST(
      verzoek({
        soort: "les",
        courseSlug: BETAALD,
        lessonSlug: BETAALDE_LES.slug,
        correct: BETAALDE_LES.quiz.length,
        total: BETAALDE_LES.quiz.length,
        dagLokaal: VANDAAG,
      })
    );
    expect(res.status).toBe(403);
    expect(await db.select().from(lessonProgress)).toHaveLength(0);
  });

  it("betaalde cursus mét actief entitlement: gewoon 200", async () => {
    await koop("u1", BETAALD);
    const res = await POST(
      verzoek({
        soort: "les",
        courseSlug: BETAALD,
        lessonSlug: BETAALDE_LES.slug,
        correct: BETAALDE_LES.quiz.length,
        total: BETAALDE_LES.quiz.length,
        dagLokaal: VANDAAG,
      })
    );
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.completed[BETAALD]).toEqual([BETAALDE_LES.slug]);
    expect(state.xp).toBe(BETAALDE_LES.xp + (BETAALDE_LES.quiz.length > 0 ? 25 : 0));
  });

  it("de aankoop van een ander opent niets", async () => {
    await maakGebruiker("u2");
    await koop("u2", BETAALD);
    const res = await POST(
      verzoek({
        soort: "les",
        courseSlug: BETAALD,
        lessonSlug: BETAALDE_LES.slug,
        dagLokaal: VANDAAG,
      })
    );
    expect(res.status).toBe(403);
    expect(await db.select().from(lessonProgress)).toHaveLength(0);
  });

  it("de gratis cursus heeft geen entitlement nodig", async () => {
    const res = await POST(
      verzoek({ soort: "les", courseSlug: CURSUS, lessonSlug: LES, dagLokaal: VANDAAG })
    );
    expect(res.status).toBe(200);
    expect(await db.select().from(lessonProgress)).toHaveLength(1);
  });
});

describe("soort 'snapshot'", () => {
  it("importeert localStorage-historie en herrekent de XP zelf", async () => {
    const res = await POST(
      verzoek({
        soort: "snapshot",
        snapshot: {
          xp: 1_000_000, // de aanval: een verzonnen totaal
          completed: { [CURSUS]: [LES] },
          quizScores: {
            [`${CURSUS}/${LES}`]: { correct: QUIZ_LEN, total: QUIZ_LEN },
          },
          streak: { current: 1, best: 1, lastDate: VANDAAG },
          badges: [],
        },
      })
    );
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.completed[CURSUS]).toEqual([LES]);
    expect(state.xp).toBe(LES_XP + VOLLE_BONUS); // en dus niet 1.000.000
  });

  it("een kapot snapshot is onschadelijk: 200 met lege voortgang", async () => {
    const res = await POST(verzoek({ soort: "snapshot", snapshot: "rommel" }));
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.xp).toBe(0);
  });

  it("niet-gekochte cursussen vallen eruit; gratis en gekochte blijven", async () => {
    await koop("u1", BETAALD);
    const NIET_GEKOCHT = "technische-analyse";
    const ANDERE_LES = flatLessons(getCourse(NIET_GEKOCHT)!)[0].lesson;

    const res = await POST(
      verzoek({
        soort: "snapshot",
        snapshot: {
          completed: {
            [CURSUS]: [LES],
            [BETAALD]: [BETAALDE_LES.slug],
            [NIET_GEKOCHT]: [ANDERE_LES.slug],
          },
          streak: { current: 1, best: 1, lastDate: VANDAAG },
        },
      })
    );

    // Eén verouderde of nooit gekochte slug laat de rest van de historie
    // niet sneuvelen: die valt stil af, de rest komt gewoon binnen.
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.completed[CURSUS]).toEqual([LES]);
    expect(state.completed[BETAALD]).toEqual([BETAALDE_LES.slug]);
    expect(state.completed[NIET_GEKOCHT]).toBeUndefined();

    const rijen = await db.select().from(lessonProgress);
    expect(rijen.map((r) => r.courseSlug).sort()).toEqual(
      [CURSUS, BETAALD].sort()
    );
    // En de XP telt de geweigerde cursus dus ook niet mee. Zonder
    // quizScores in het snapshot is er geen bonus: alleen de les-XP.
    expect(state.xp).toBe(LES_XP + BETAALDE_LES.xp);
  });

  it("een ingetrokken entitlement (terugbetaling) telt niet meer mee", async () => {
    await koop("u1", BETAALD);
    await db
      .update(entitlements)
      .set({ status: "ingetrokken" })
      .where(eq(entitlements.userId, "u1"));

    const res = await POST(
      verzoek({
        soort: "snapshot",
        snapshot: { completed: { [BETAALD]: [BETAALDE_LES.slug] } },
      })
    );
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.xp).toBe(0);
    expect(await db.select().from(lessonProgress)).toHaveLength(0);
  });
});
