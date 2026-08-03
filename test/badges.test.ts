import { describe, expect, it } from "vitest";
import { BADGES, badgeById, type ProgressSummary } from "@/lib/badges";
import { flatLessons, getCourse } from "@/content";

/**
 * Alle tien badgepredicaten, tabelgestuurd: één samenvatting die de badge nét
 * verdient en één die er nét onder blijft. Plus de verraderlijkste valkuil:
 * "achtste-wereldwonder" wijst met een hardgecodeerde slug naar één specifieke
 * les. Wordt die les ooit hernoemd, dan is de badge stilletjes onhaalbaar —
 * de test hieronder laat dat hardop knallen.
 */

function samenvatting(deels: Partial<ProgressSummary> = {}): ProgressSummary {
  return {
    xp: 0,
    lessonsCompleted: 0,
    coursesCompleted: 0,
    totalCourses: 9,
    perfectQuizzes: 0,
    streakCurrent: 0,
    completedLessonSlugs: [],
    ...deels,
  };
}

// [badge-id, samenvatting die hem verdient, samenvatting nét eronder]
const GEVALLEN: Array<[string, Partial<ProgressSummary>, Partial<ProgressSummary>]> = [
  ["eerste-les", { lessonsCompleted: 1 }, { lessonsCompleted: 0 }],
  ["op-dreef", { lessonsCompleted: 5 }, { lessonsCompleted: 4 }],
  ["studiebol", { lessonsCompleted: 10 }, { lessonsCompleted: 9 }],
  ["foutloos", { perfectQuizzes: 1 }, { perfectQuizzes: 0 }],
  ["perfectionist", { perfectQuizzes: 5 }, { perfectQuizzes: 4 }],
  ["warmgedraaid", { streakCurrent: 3 }, { streakCurrent: 2 }],
  ["ijzeren-discipline", { streakCurrent: 7 }, { streakCurrent: 6 }],
  [
    "achtste-wereldwonder",
    { completedLessonSlugs: ["beleggen-voor-beginners/rente-op-rente"] },
    { completedLessonSlugs: ["beleggen-voor-beginners/waarom-beleggen"] },
  ],
  ["cum-laude", { coursesCompleted: 1 }, { coursesCompleted: 0 }],
  ["summa-cum-laude", { coursesCompleted: 9, totalCourses: 9 }, { coursesCompleted: 8, totalCourses: 9 }],
];

describe("badgepredicaten", () => {
  it("de tabel dekt élke badge — een nieuwe badge zonder test valt hier om", () => {
    expect(GEVALLEN.map(([id]) => id).sort()).toEqual(
      BADGES.map((b) => b.id).sort()
    );
  });

  it.each(GEVALLEN)("%s: verdiend op de grens, niet eronder", (id, wel, niet) => {
    const badge = badgeById(id);
    expect(badge).toBeDefined();
    expect(badge!.when(samenvatting(wel))).toBe(true);
    expect(badge!.when(samenvatting(niet))).toBe(false);
  });

  it("summa-cum-laude vraagt om minstens één cursus (geen badge bij een lege catalogus)", () => {
    expect(
      badgeById("summa-cum-laude")!.when(
        samenvatting({ coursesCompleted: 0, totalCourses: 0 })
      )
    ).toBe(false);
  });
});

describe("verankering in de catalogus", () => {
  it("de les waar 'achtste-wereldwonder' naar wijst bestaat echt (hernoem-tripwire)", () => {
    // De badge test op de letterlijke slug "beleggen-voor-beginners/rente-op-rente".
    // Hernoemt iemand die les, dan blijft de badge voor altijd onhaalbaar zonder
    // dat iets anders stukgaat — behalve deze test.
    const cursus = getCourse("beleggen-voor-beginners");
    expect(cursus).toBeDefined();
    const slugs = flatLessons(cursus!).map((x) => x.lesson.slug);
    expect(slugs).toContain("rente-op-rente");
  });

  it("badge-id's zijn uniek en badgeById vindt ze allemaal", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(badgeById(id)?.id).toBe(id);
    expect(badgeById("bestaat-niet")).toBeUndefined();
  });
});
