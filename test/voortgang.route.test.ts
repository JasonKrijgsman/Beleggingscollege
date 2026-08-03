import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { POST } from "@/app/api/voortgang/route";
import { auth } from "@/auth";
import { flatLessons, getCourse } from "@/content";
import { lessonProgress } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De route-schil om voortgang-server heen. De rekenregels zelf staan in
 * test/voortgang-server.test.ts; hier bewaken we wat de HTTP-laag doet:
 * de sessiepoort, kapotte verzoeken, en dat rommel in de body de server
 * nooit laat crashen (de client stuurt dit fire-and-forget).
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

  it("een onbekende les: 200 met ongewijzigde (lege) voortgang", async () => {
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
    expect(res.status).toBe(200);
    const { state } = await res.json();
    expect(state.xp).toBe(0);
    expect(await db.select().from(lessonProgress)).toHaveLength(0);
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
});
