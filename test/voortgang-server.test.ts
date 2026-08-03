import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq, sql } from "drizzle-orm";

vi.mock("@/db", () => import("./helpers/pglite-db"));

import { getCourse } from "@/content";
import { lessonProgress, userStats } from "@/db/schema";
import {
  haalVoortgang,
  importeerSnapshot,
  verwerkLes,
} from "@/lib/voortgang-server";
import {
  db,
  houdVast,
  leegAlleTabellen,
  maakGebruiker,
} from "./helpers/pglite-db";

/**
 * De serverkant van de voortgang — voor ingelogde gebruikers de bron van
 * waarheid. De regel die hier alles draagt: vertrouw geen enkel getal uit de
 * browser; alle XP wordt op de server herrekend uit de cursusinhoud.
 */

// Echte cursusdata, zodat de tests meebewegen met de inhoud.
const CURSUS = getCourse("beleggen-voor-beginners")!;
const ALLE_LESSEN = CURSUS.modules.flatMap((m) => m.lessons);
const LES_1 = ALLE_LESSEN[0];
const LES_2 = ALLE_LESSEN[1];
const LES_3 = ALLE_LESSEN[2];

function dag(offsetDagen = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDagen);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const VANDAAG = dag();
const GISTEREN = dag(-1);

function bonus(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 25) : 0;
}

beforeEach(async () => {
  await leegAlleTabellen();
  await maakGebruiker("u1");
});

describe("verwerkLes — XP wordt op de server herrekend", () => {
  it("nieuwe les: XP uit de cursusinhoud plus quizbonus", async () => {
    const totaal = LES_1.quiz.length;
    const state = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: totaal, total: totaal },
      VANDAAG
    );
    expect(state.xp).toBe(LES_1.xp + bonus(totaal, totaal));
    expect(state.completed[CURSUS.slug]).toEqual([LES_1.slug]);
    expect(state.badges).toContain("eerste-les");
  });

  it("herhaalde les: geen tweede rij en geen tweede keer XP", async () => {
    const totaal = LES_1.quiz.length;
    const eerste = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: totaal },
      VANDAAG
    );
    const tweede = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: totaal },
      VANDAAG
    );
    expect(tweede.xp).toBe(eerste.xp);
    const rijen = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, "u1"));
    expect(rijen).toHaveLength(1);
  });

  it("herkansing met betere score: score bij, XP van destijds blijft staan", async () => {
    const totaal = LES_1.quiz.length;
    const eerste = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 1, total: totaal },
      VANDAAG
    );
    const beter = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: totaal, total: totaal },
      VANDAAG
    );
    expect(beter.quizScores[`${CURSUS.slug}/${LES_1.slug}`]).toEqual({
      correct: totaal,
      total: totaal,
    });
    expect(beter.xp).toBe(eerste.xp);
  });

  it("herkansing met slechtere score: de beste score blijft", async () => {
    const totaal = LES_1.quiz.length;
    await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: totaal, total: totaal },
      VANDAAG
    );
    const state = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: totaal },
      VANDAAG
    );
    expect(state.quizScores[`${CURSUS.slug}/${LES_1.slug}`]).toEqual({
      correct: totaal,
      total: totaal,
    });
  });

  it("verzonnen quizscores worden begrensd door de echte quizlengte", async () => {
    const state = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 999, total: 999 },
      VANDAAG
    );
    const totaal = LES_1.quiz.length;
    expect(state.quizScores[`${CURSUS.slug}/${LES_1.slug}`]).toEqual({
      correct: totaal,
      total: totaal,
    });
    expect(state.xp).toBe(LES_1.xp + bonus(totaal, totaal));
  });

  it("onbekende cursus of les: er verandert niets", async () => {
    const a = await verwerkLes(
      "u1",
      "bestaat-niet",
      "les",
      { correct: 1, total: 1 },
      VANDAAG
    );
    const b = await verwerkLes(
      "u1",
      CURSUS.slug,
      "bestaat-niet",
      { correct: 1, total: 1 },
      VANDAAG
    );
    expect(a.xp).toBe(0);
    expect(b.xp).toBe(0);
    expect(Object.keys(b.completed)).toHaveLength(0);
  });
});

describe("verwerkLes — streak", () => {
  it("eerste les start op 1; een tweede nieuwe les dezelfde dag blijft 1", async () => {
    const eerste = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: LES_1.quiz.length },
      VANDAAG
    );
    expect(eerste.streak).toMatchObject({ current: 1, best: 1 });

    const tweede = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_2.slug,
      { correct: 0, total: LES_2.quiz.length },
      VANDAAG
    );
    expect(tweede.streak).toMatchObject({ current: 1, best: 1 });
  });

  it("gisteren en vandaag geleerd: streak 2", async () => {
    await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: LES_1.quiz.length },
      GISTEREN
    );
    const state = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_2.slug,
      { correct: 0, total: LES_2.quiz.length },
      VANDAAG
    );
    expect(state.streak).toMatchObject({ current: 2, best: 2 });
  });

  it("een HERHAALDE les beweegt de serverstreak niet (anders dan de client)", async () => {
    await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: LES_1.quiz.length },
      GISTEREN
    );
    const herhaald = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: LES_1.quiz.length },
      VANDAAG
    );
    expect(herhaald.streak).toMatchObject({ current: 1 });
    expect(herhaald.streak.lastDate).toBe(GISTEREN);
  });

  it("een dag uit de toekomst of het verre verleden wordt geweigerd", async () => {
    const state = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 0, total: LES_1.quiz.length },
      "2020-01-01"
    );
    expect(state.streak).toMatchObject({ current: 0, best: 0 });

    // Een vast ver-toekomstig jaartal, geen dag(+3): bij extreme tijdzones
    // schuurt een kleine offset langs de 48-uursgrens en wordt de test flaky.
    // Zonder deze case zou de symmetrische Math.abs-controle kunnen
    // degraderen tot alleen-verleden zonder dat een test het merkt — met
    // één fetch per dag valt een streak dan vooruit te boeren.
    const state2 = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_2.slug,
      { correct: 0, total: LES_2.quiz.length },
      "2099-01-01"
    );
    expect(state2.streak).toMatchObject({ current: 0, best: 0 });

    const state3 = await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_3.slug,
      { correct: 0, total: LES_3.quiz.length },
      "geen-datum"
    );
    expect(state3.streak).toMatchObject({ current: 0, best: 0 });
  });
});

describe("importeerSnapshot — de teller uit de browser gaat de prullenbak in", () => {
  it("herrekent XP uit de inhoud en negeert het opgestuurde totaal", async () => {
    const totaal = LES_1.quiz.length;
    const state = await importeerSnapshot("u1", {
      xp: 1_000_000, // de leugen
      completed: { [CURSUS.slug]: [LES_1.slug] },
      quizScores: {
        [`${CURSUS.slug}/${LES_1.slug}`]: { correct: totaal, total: totaal },
      },
    });
    expect(state.xp).toBe(LES_1.xp + bonus(totaal, totaal));
    expect(state.badges).toContain("eerste-les");
  });

  it("slaat onbekende cursussen en lessen over", async () => {
    const state = await importeerSnapshot("u1", {
      completed: {
        "bestaat-niet": ["les-x"],
        [CURSUS.slug]: ["bestaat-niet", LES_1.slug],
      },
    });
    expect(state.completed[CURSUS.slug]).toEqual([LES_1.slug]);
    expect(state.completed["bestaat-niet"]).toBeUndefined();
  });

  it("vult alleen aan: wat de server al weet blijft ongemoeid", async () => {
    const totaal = LES_1.quiz.length;
    // De server kent de les al met een lage score...
    await verwerkLes(
      "u1",
      CURSUS.slug,
      LES_1.slug,
      { correct: 1, total: totaal },
      VANDAAG
    );
    // ...en de browser komt met een "betere" historie voor dezelfde les.
    const state = await importeerSnapshot("u1", {
      completed: { [CURSUS.slug]: [LES_1.slug] },
      quizScores: {
        [`${CURSUS.slug}/${LES_1.slug}`]: { correct: totaal, total: totaal },
      },
    });
    expect(state.quizScores[`${CURSUS.slug}/${LES_1.slug}`]).toEqual({
      correct: 1,
      total: totaal,
    });
  });

  it("neemt de streak over, maar begrensd en nooit iets afpakken", async () => {
    const eerste = await importeerSnapshot("u1", {
      streak: { current: 99999, best: 99999, lastDate: VANDAAG },
    });
    expect(eerste.streak.current).toBe(3650);
    expect(eerste.streak.best).toBe(3650);

    // Een verzonnen datum (ver in de toekomst) komt niet door de importpoort.
    const nep = await importeerSnapshot("u1", {
      streak: { current: 5, best: 5, lastDate: "2099-01-01" },
    });
    expect(nep.streak.lastDate).toBe(VANDAAG);

    // Een tweede import met een lagere streak pakt niets af.
    const tweede = await importeerSnapshot("u1", {
      streak: { current: 2, best: 2, lastDate: VANDAAG },
    });
    expect(tweede.streak.current).toBe(3650);
  });

  it("een kapot of leeg snapshot is onschadelijk", async () => {
    const state = await importeerSnapshot("u1", null);
    expect(state.xp).toBe(0);
    const state2 = await importeerSnapshot("u1", {
      completed: "geen-object",
      streak: "geen-object",
    });
    expect(state2.xp).toBe(0);
  });
});

/**
 * De schrijfkant onder gelijktijdigheid.
 *
 * De invariant die alles draagt:
 *
 *     user_stats.xp = SUM(lesson_progress.xp_awarded)
 *
 * Die hield het niet toen dit nog drie losse statements waren ("kijken of de
 * les er al is → rij bijschrijven → stats bijwerken"). Twee gelijktijdige
 * afrondingen van dezelfde les zagen allebei "nog niet afgerond", en de
 * tweede insert klapte op de primaire sleutel: een 500 voor de cursist. En
 * de snapshot-import zette XP absoluut, dus een les die er tussen het
 * optellen en het wegschrijven bij kwam werd stilletjes overschreven.
 *
 * `houdVast()` maakt precies die volgordes reproduceerbaar: het eerste
 * statement dat op het patroon past blijft staan, het andere verzoek loopt
 * er volledig langs, en pas daarna gaat het door. Zonder die haak slaagt
 * een racetest toevallig en bewijst hij niets.
 */
async function xpKlopt(userId: string): Promise<{ stats: number; som: number }> {
  const [{ som }] = await db
    .select({
      som: sql<number>`coalesce(sum(${lessonProgress.xpAwarded}), 0)::int`,
    })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));
  const [rij] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);
  return { stats: rij?.xp ?? 0, som: Number(som) };
}

/** Het patroon dat zowel het oude losse statement als het huidige
 *  CTE-statement raakt: de plek waar de lesrij wordt bijgeschreven. */
const LESRIJ_SCHRIJVEN = /insert\s+into\s+"?lesson_progress"?/i;
/** Idem voor de statsrij — in het huidige statement zit die in dezelfde CTE. */
const STATSRIJ_SCHRIJVEN = /insert\s+into\s+"?user_stats"?/i;

describe("gelijktijdigheid — user_stats.xp = SUM(lesson_progress.xp_awarded)", () => {
  it("twee afrondingen van dezelfde les die elkaar kruisen: geen fout, XP één keer", async () => {
    const totaal = LES_1.quiz.length;
    const quiz = { correct: totaal, total: totaal };

    // A wordt stilgezet vlak vóór het schrijven van de lesrij...
    const haak = houdVast(LESRIJ_SCHRIJVEN);
    const a = verwerkLes("u1", CURSUS.slug, LES_1.slug, quiz, VANDAAG);
    await haak.bereikt;
    // ...B rondt dezelfde les ondertussen volledig af...
    await verwerkLes("u1", CURSUS.slug, LES_1.slug, quiz, VANDAAG);
    // ...en pas dan mag A verder. Dit is exact de volgorde die vroeger een
    // 500 opleverde (dubbele sleutel) of de XP verdubbelde.
    haak.laatLos();
    await expect(a).resolves.toBeDefined();

    const rijen = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, "u1"));
    expect(rijen).toHaveLength(1);

    const { stats, som } = await xpKlopt("u1");
    expect(stats).toBe(som);
    expect(stats).toBe(LES_1.xp + bonus(totaal, totaal));
  });

  it("twee verschillende lessen die elkaar kruisen: alle XP komt aan", async () => {
    const haak = houdVast(LESRIJ_SCHRIJVEN);
    const a = verwerkLes("u1", CURSUS.slug, LES_1.slug, { correct: 0, total: LES_1.quiz.length }, VANDAAG);
    await haak.bereikt;
    await verwerkLes("u1", CURSUS.slug, LES_2.slug, { correct: 0, total: LES_2.quiz.length }, VANDAAG);
    haak.laatLos();
    await a;

    const { stats, som } = await xpKlopt("u1");
    expect(stats).toBe(som);
    expect(stats).toBe(LES_1.xp + LES_2.xp);
    // En de streak is er niet twee keer vandoor gegaan: één dag is één dag.
    const state = await haalVoortgang("u1");
    expect(state.streak).toMatchObject({ current: 1, best: 1 });
  });

  it("een snapshot-import die een afgeronde les kruist: niemand raakt XP kwijt", async () => {
    // Het gevaarlijke geval van vroeger: de import telde de XP-som op vóórdat
    // de les erbij kwam en schreef die daarna absoluut weg. De les was dan
    // wél afgerond, maar de XP ervan verdampte.
    const totaal = LES_1.quiz.length;

    const haak = houdVast(STATSRIJ_SCHRIJVEN);
    const importeren = importeerSnapshot("u1", {
      completed: { [CURSUS.slug]: [LES_2.slug, LES_3.slug] },
      streak: { current: 4, best: 7, lastDate: VANDAAG },
    });
    await haak.bereikt;
    await verwerkLes("u1", CURSUS.slug, LES_1.slug, { correct: totaal, total: totaal }, VANDAAG);
    haak.laatLos();
    await importeren;

    const { stats, som } = await xpKlopt("u1");
    expect(stats).toBe(som);
    expect(stats).toBe(LES_1.xp + bonus(totaal, totaal) + LES_2.xp + LES_3.xp);
  });

  it("dezelfde les via snapshot én via afronding, kruisend: telt één keer", async () => {
    const totaal = LES_1.quiz.length;

    const haak = houdVast(LESRIJ_SCHRIJVEN);
    const importeren = importeerSnapshot("u1", {
      completed: { [CURSUS.slug]: [LES_1.slug] },
    });
    await haak.bereikt;
    await verwerkLes("u1", CURSUS.slug, LES_1.slug, { correct: totaal, total: totaal }, VANDAAG);
    haak.laatLos();
    await expect(importeren).resolves.toBeDefined();

    const rijen = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, "u1"));
    expect(rijen).toHaveLength(1);

    const { stats, som } = await xpKlopt("u1");
    expect(stats).toBe(som);
    expect(stats).toBe(LES_1.xp + bonus(totaal, totaal));
  });

  it("twee kruisende snapshot-imports met dezelfde inhoud: geen dubbele XP", async () => {
    const snapshot = {
      completed: { [CURSUS.slug]: [LES_1.slug, LES_2.slug] },
      streak: { current: 3, best: 3, lastDate: VANDAAG },
    };

    const haak = houdVast(STATSRIJ_SCHRIJVEN);
    const eerste = importeerSnapshot("u1", snapshot);
    await haak.bereikt;
    await importeerSnapshot("u1", snapshot);
    haak.laatLos();
    await eerste;

    const { stats, som } = await xpKlopt("u1");
    expect(stats).toBe(som);
    expect(stats).toBe(LES_1.xp + LES_2.xp);
  });

  it("een hele reeks tegelijk: de invariant overleeft ook zonder regie", async () => {
    await Promise.all([
      ...[LES_1, LES_2, LES_3].map((les) =>
        verwerkLes("u1", CURSUS.slug, les.slug, { correct: 0, total: les.quiz.length }, VANDAAG)
      ),
      importeerSnapshot("u1", {
        completed: { [CURSUS.slug]: [LES_1.slug, LES_2.slug, LES_3.slug] },
      }),
    ]);

    const { stats, som } = await xpKlopt("u1");
    expect(stats).toBe(som);
    expect(stats).toBe(LES_1.xp + LES_2.xp + LES_3.xp);
  });
});

describe("haalVoortgang", () => {
  it("een onbekende gebruiker krijgt een lege, complete voortgang", async () => {
    const state = await haalVoortgang("bestaat-niet");
    expect(state).toEqual({
      name: "",
      xp: 0,
      completed: {},
      quizScores: {},
      streak: { current: 0, best: 0, lastDate: "" },
      badges: [],
    });
  });
});
