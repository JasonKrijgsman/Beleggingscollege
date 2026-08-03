import type { CursusOutline } from "@/content/view";
import { BADGES, badgeById, type Badge, type ProgressSummary } from "./badges";
import { levelForXp } from "./levels";

/**
 * De spelregels van de voortgang, los van React en los van de klok.
 *
 * Alles hier is puur: zelfde invoer, zelfde uitvoer. De provider in
 * ./progress.tsx levert de omgeving (localStorage, de datum van vandaag, de
 * server-sync); de regels zelf staan hier zodat ze rechtstreeks te testen
 * zijn. De serverkant (src/lib/voortgang-server.ts) hanteert dezelfde
 * XP-regels maar rekent zelfstandig — vertrouw nooit een getal uit de browser.
 */

export type QuizOutcome = { correct: number; total: number };

export type ProgressState = {
  name: string;
  xp: number;
  completed: Record<string, string[]>; // cursusslug -> afgeronde lesslugs
  quizScores: Record<string, QuizOutcome>; // "cursus/les" -> beste score
  /** "cursus/les" -> gekozen optie-index per vraag, van de BESTE poging.
   *  Bewust optioneel (oudere opslag heeft dit niet) en bewust alleen
   *  lokaal: de server bewaart scores, niet de individuele keuzes. */
  quizAntwoorden?: Record<string, number[]>;
  streak: { current: number; best: number; lastDate: string };
  badges: string[];
};

export type CompletionResult = {
  xpGained: number;
  newBadges: Badge[];
  leveledUp: boolean;
  levelName: string;
  alreadyCompleted: boolean;
};

export const LEGE_VOORTGANG: ProgressState = {
  name: "",
  xp: 0,
  completed: {},
  quizScores: {},
  streak: { current: 0, best: 0, lastDate: "" },
  badges: [],
};

export function summarize(
  state: ProgressState,
  catalogus: CursusOutline[]
): ProgressSummary {
  const completedLessonSlugs = Object.entries(state.completed).flatMap(
    ([course, lessons]) => lessons.map((l) => `${course}/${l}`)
  );
  const coursesCompleted = catalogus.filter((c) => {
    const total = c.aantalLessen;
    const done = state.completed[c.slug]?.length ?? 0;
    return total > 0 && done >= total;
  }).length;
  const perfectQuizzes = Object.values(state.quizScores).filter(
    (q) => q.total > 0 && q.correct === q.total
  ).length;
  return {
    xp: state.xp,
    lessonsCompleted: completedLessonSlugs.length,
    coursesCompleted,
    totalCourses: catalogus.length,
    perfectQuizzes,
    streakCurrent: state.streak.current,
    completedLessonSlugs,
  };
}

export type LesInvoer = {
  courseSlug: string;
  lessonSlug: string;
  quiz: QuizOutcome;
  baseXp: number;
  antwoorden?: number[];
  /** Lokale kalenderdagen "JJJJ-MM-DD", aangeleverd door de aanroeper zodat
   *  deze module klokvrij blijft en de streakregels exact te testen zijn. */
  vandaag: string;
  gisteren: string;
};

/**
 * Eén afgeronde les verwerken. Dit is de volledige rekenkern van
 * `completeLesson()`: XP (herhaalde les = 0), quizbonus tot 25 XP, beste
 * quizscore bewaren, streak bijwerken, badges toekennen, level-up bepalen.
 */
export function pasLesToe(
  prev: ProgressState,
  invoer: LesInvoer,
  catalogus: CursusOutline[]
): { volgende: ProgressState; resultaat: CompletionResult } {
  const { courseSlug, lessonSlug, quiz, baseXp, antwoorden, vandaag, gisteren } =
    invoer;
  const already = prev.completed[courseSlug]?.includes(lessonSlug) ?? false;
  const quizBonus =
    quiz.total > 0 ? Math.round((quiz.correct / quiz.total) * 25) : 0;
  const xpGained = already ? 0 : baseXp + quizBonus;

  const completed = already
    ? prev.completed
    : {
        ...prev.completed,
        [courseSlug]: [...(prev.completed[courseSlug] ?? []), lessonSlug],
      };

  const key = `${courseSlug}/${lessonSlug}`;
  const oldScore = prev.quizScores[key];
  const isBetter =
    !oldScore ||
    quiz.correct / Math.max(1, quiz.total) >
      oldScore.correct / Math.max(1, oldScore.total);
  const quizScores = isBetter
    ? { ...prev.quizScores, [key]: quiz }
    : prev.quizScores;
  // Antwoorden horen bij de beste poging, net als de score.
  const quizAntwoorden =
    isBetter && antwoorden
      ? { ...(prev.quizAntwoorden ?? {}), [key]: antwoorden }
      : prev.quizAntwoorden;

  // De streak beweegt bij elke afgeronde les op een nieuwe dag, óók bij een
  // herhaalde les. Dat is hier bewust: uitgelogd telt "vandaag geleerd", niet
  // "vandaag iets nieuws geleerd". (De server beweegt de streak alleen bij een
  // nieuwe les; zie de kanttekening in docs/ci.md.)
  let streak = prev.streak;
  if (streak.lastDate !== vandaag) {
    const current = streak.lastDate === gisteren ? streak.current + 1 : 1;
    streak = {
      current,
      best: Math.max(current, streak.best),
      lastDate: vandaag,
    };
  }

  const beforeLevel = levelForXp(prev.xp).index;
  const xp = prev.xp + xpGained;
  const after = levelForXp(xp);

  const interim: ProgressState = {
    ...prev,
    xp,
    completed,
    quizScores,
    quizAntwoorden,
    streak,
  };
  const summary = summarize(interim, catalogus);
  const earnedNow = BADGES.filter((b) => b.when(summary)).map((b) => b.id);
  const newBadgeIds = earnedNow.filter((id) => !prev.badges.includes(id));
  const volgende: ProgressState = {
    ...interim,
    badges: [...prev.badges, ...newBadgeIds],
  };

  return {
    volgende,
    resultaat: {
      xpGained,
      newBadges: newBadgeIds
        .map((id) => badgeById(id))
        .filter((b): b is Badge => Boolean(b)),
      leveledUp: after.index > beforeLevel,
      levelName: after.level.name,
      alreadyCompleted: already,
    },
  };
}
