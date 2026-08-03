import { describe, expect, it } from "vitest";
import type { CursusOutline } from "@/content/view";
import {
  LEGE_VOORTGANG,
  pasLesToe,
  summarize,
  type ProgressState,
} from "@/lib/voortgang-regels";

/**
 * De client-rekenkern: XP, herhaalde lessen, quizbonus, streak en badges.
 * Dit zijn de regels die completeLesson() in de browser toepast; de server
 * (test/voortgang-server.test.ts) rekent zelfstandig en is voor ingelogde
 * gebruikers de waarheid.
 */

const VANDAAG = "2026-08-03";
const GISTEREN = "2026-08-02";
const DAGEN = { vandaag: VANDAAG, gisteren: GISTEREN };

function outline(
  slug: string,
  aantalLessen: number,
  lessen: string[]
): CursusOutline {
  return {
    slug,
    title: slug,
    subtitle: "",
    description: "",
    level: "Beginner",
    accent: "blauw",
    icon: "sprout",
    aantalLessen,
    duurMinuten: 10 * aantalLessen,
    totaalXp: 50 * aantalLessen,
    lessen: lessen.map((l) => ({
      slug: l,
      title: l,
      durationMin: 10,
      aantalQuizvragen: 4,
      xp: 50,
    })),
  };
}

const CATALOGUS = [outline("cursus-a", 2, ["les-1", "les-2"])];

function vers(): ProgressState {
  return structuredClone(LEGE_VOORTGANG);
}

describe("pasLesToe — XP", () => {
  it("nieuwe les: basis-XP plus quizbonus naar rato, tot 25", () => {
    const { volgende, resultaat } = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 3, total: 4 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    // 50 + afgerond(3/4 * 25) = 50 + 19
    expect(resultaat.xpGained).toBe(69);
    expect(resultaat.alreadyCompleted).toBe(false);
    expect(volgende.xp).toBe(69);
    expect(volgende.completed["cursus-a"]).toEqual(["les-1"]);
  });

  it("foutloze quiz geeft de volle bonus van 25", () => {
    const { resultaat } = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 4, total: 4 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(resultaat.xpGained).toBe(75);
  });

  it("les zonder quiz geeft alleen de basis-XP", () => {
    const { resultaat } = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(resultaat.xpGained).toBe(50);
  });

  it("herhaalde les geeft 0 XP — de kernregel", () => {
    const eerste = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 4, total: 4 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    const tweede = pasLesToe(
      eerste.volgende,
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 4, total: 4 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(tweede.resultaat.xpGained).toBe(0);
    expect(tweede.resultaat.alreadyCompleted).toBe(true);
    expect(tweede.volgende.xp).toBe(eerste.volgende.xp);
    // En de les staat niet dubbel in de afgeronde lijst.
    expect(tweede.volgende.completed["cursus-a"]).toEqual(["les-1"]);
  });
});

describe("pasLesToe — beste quizscore", () => {
  it("bewaart een betere score en de bijbehorende antwoorden", () => {
    const eerste = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 1, total: 4 },
        baseXp: 50,
        antwoorden: [0, 0, 0, 0],
        ...DAGEN,
      },
      CATALOGUS
    );
    const beter = pasLesToe(
      eerste.volgende,
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 3, total: 4 },
        baseXp: 50,
        antwoorden: [1, 2, 3, 0],
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(beter.volgende.quizScores["cursus-a/les-1"]).toEqual({
      correct: 3,
      total: 4,
    });
    expect(beter.volgende.quizAntwoorden?.["cursus-a/les-1"]).toEqual([
      1, 2, 3, 0,
    ]);
  });

  it("een slechtere herkansing verlaagt de score en de antwoorden niet", () => {
    const eerste = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 4, total: 4 },
        baseXp: 50,
        antwoorden: [1, 1, 1, 1],
        ...DAGEN,
      },
      CATALOGUS
    );
    const slechter = pasLesToe(
      eerste.volgende,
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 1, total: 4 },
        baseXp: 50,
        antwoorden: [0, 0, 0, 0],
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(slechter.volgende.quizScores["cursus-a/les-1"]).toEqual({
      correct: 4,
      total: 4,
    });
    expect(slechter.volgende.quizAntwoorden?.["cursus-a/les-1"]).toEqual([
      1, 1, 1, 1,
    ]);
  });
});

describe("pasLesToe — streak", () => {
  const les = (prev: ProgressState, lessonSlug: string) =>
    pasLesToe(
      prev,
      {
        courseSlug: "cursus-a",
        lessonSlug,
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );

  it("eerste les ooit start een streak van 1", () => {
    const { volgende } = les(vers(), "les-1");
    expect(volgende.streak).toEqual({
      current: 1,
      best: 1,
      lastDate: VANDAAG,
    });
  });

  it("gisteren geleerd: de streak loopt door", () => {
    const prev = vers();
    prev.streak = { current: 3, best: 3, lastDate: GISTEREN };
    const { volgende } = les(prev, "les-1");
    expect(volgende.streak).toEqual({
      current: 4,
      best: 4,
      lastDate: VANDAAG,
    });
  });

  it("een gat in de dagen zet de streak terug naar 1, maar best blijft", () => {
    const prev = vers();
    prev.streak = { current: 6, best: 6, lastDate: "2026-07-20" };
    const { volgende } = les(prev, "les-1");
    expect(volgende.streak).toEqual({
      current: 1,
      best: 6,
      lastDate: VANDAAG,
    });
  });

  it("tweede les op dezelfde dag verandert de streak niet", () => {
    const eerste = les(vers(), "les-1");
    const tweede = les(eerste.volgende, "les-2");
    expect(tweede.volgende.streak).toEqual(eerste.volgende.streak);
  });

  it("ook een HERHAALDE les houdt de streak in leven (bewust; de server niet)", () => {
    // Uitgelogd telt "vandaag geleerd", niet "vandaag iets nieuws geleerd".
    // De server beweegt de streak alleen bij een nieuwe les — die divergentie
    // is gedocumenteerd in docs/ci.md en hier vastgepind.
    const prev = vers();
    prev.completed = { "cursus-a": ["les-1"] };
    prev.streak = { current: 2, best: 2, lastDate: GISTEREN };
    const { volgende, resultaat } = les(prev, "les-1");
    expect(resultaat.xpGained).toBe(0);
    expect(volgende.streak.current).toBe(3);
  });
});

describe("pasLesToe — levels en badges", () => {
  it("meldt een level-up zodra de XP een grens passeert", () => {
    const prev = vers();
    prev.xp = 99; // grens Toeschouwer -> Spaarder ligt op 100
    const { resultaat } = pasLesToe(
      prev,
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(resultaat.leveledUp).toBe(true);
    expect(resultaat.levelName).toBe("Spaarder");
  });

  it("kent eerste-les en foutloos toe bij een perfecte eerste les", () => {
    const { volgende, resultaat } = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 4, total: 4 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    const ids = resultaat.newBadges.map((b) => b.id);
    expect(ids).toContain("eerste-les");
    expect(ids).toContain("foutloos");
    expect(volgende.badges).toEqual(expect.arrayContaining(["eerste-les"]));
  });

  it("kent cum laude toe zodra alle lessen van de cursus af zijn", () => {
    const eerste = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    const tweede = pasLesToe(
      eerste.volgende,
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-2",
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(tweede.resultaat.newBadges.map((b) => b.id)).toContain("cum-laude");
  });

  it("kent een badge nooit twee keer toe", () => {
    const eerste = pasLesToe(
      vers(),
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-1",
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    const tweede = pasLesToe(
      eerste.volgende,
      {
        courseSlug: "cursus-a",
        lessonSlug: "les-2",
        quiz: { correct: 0, total: 0 },
        baseXp: 50,
        ...DAGEN,
      },
      CATALOGUS
    );
    expect(tweede.resultaat.newBadges.map((b) => b.id)).not.toContain(
      "eerste-les"
    );
    const alle = tweede.volgende.badges;
    expect(new Set(alle).size).toBe(alle.length);
  });
});

describe("summarize", () => {
  it("telt lessen, afgeronde cursussen en perfecte quizzen", () => {
    const state = vers();
    state.completed = { "cursus-a": ["les-1", "les-2"] };
    state.quizScores = {
      "cursus-a/les-1": { correct: 4, total: 4 },
      "cursus-a/les-2": { correct: 2, total: 4 },
    };
    state.xp = 123;
    state.streak = { current: 2, best: 5, lastDate: VANDAAG };

    const s = summarize(state, CATALOGUS);
    expect(s.lessonsCompleted).toBe(2);
    expect(s.coursesCompleted).toBe(1);
    expect(s.totalCourses).toBe(1);
    expect(s.perfectQuizzes).toBe(1);
    expect(s.xp).toBe(123);
    expect(s.streakCurrent).toBe(2);
    expect(s.completedLessonSlugs).toEqual([
      "cursus-a/les-1",
      "cursus-a/les-2",
    ]);
  });
});
