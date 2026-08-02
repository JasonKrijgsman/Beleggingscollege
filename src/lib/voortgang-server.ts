import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { lessonProgress, userStats } from "@/db/schema";
import { activeCourses, courseLessonCount, getCourse } from "@/content";
import { BADGES } from "./badges";
import type { ProgressState, QuizOutcome } from "./progress";

/**
 * De serverkant van de voortgang. Vanaf hier is de database de bron van
 * waarheid voor wie is ingelogd; localStorage is het vangnet voor wie dat
 * niet is, en de plek waar een bestaande bezoeker zijn historie vandaan
 * meebrengt (eenmalige import).
 *
 * REGEL: vertrouw geen enkel getal uit de browser. De client stuurt alleen
 * WAT hij deed (welke les, welke quizscore, welke lokale kalenderdag); alle
 * XP wordt hier opnieuw uitgerekend uit de cursusinhoud. Anders zet iemand
 * met één fetch zijn XP op een miljoen — niet ernstig, maar wel precies het
 * soort vals spel dat een eerlijk platform niet moet belonen.
 */

const QUIZ_BONUS_MAX = 25;

function quizBonus(quiz: QuizOutcome): number {
  return quiz.total > 0
    ? Math.round((quiz.correct / quiz.total) * QUIZ_BONUS_MAX)
    : 0;
}

/** "JJJJ-MM-DD" — de kalenderdag van de GEBRUIKER, niet van de server.
 *  Een streak hoort te lopen op de dag die de cursist zelf beleeft. */
function geldigeDag(d: unknown): string | null {
  if (typeof d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const t = new Date(`${d}T12:00:00Z`).getTime();
  // Maximaal twee dagen klokafwijking accepteren; anders is het geknoei.
  if (!Number.isFinite(t) || Math.abs(t - Date.now()) > 2 * 86400_000) {
    return null;
  }
  return d;
}

function vorigeDag(dag: string): string {
  const d = new Date(`${dag}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Bouw de client-vorm van de voortgang uit de databaserijen. */
export async function haalVoortgang(userId: string): Promise<ProgressState> {
  const [rijen, [stats]] = await Promise.all([
    db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId)),
    db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1),
  ]);

  const completed: Record<string, string[]> = {};
  const quizScores: Record<string, QuizOutcome> = {};
  for (const r of rijen) {
    (completed[r.courseSlug] ??= []).push(r.lessonSlug);
    quizScores[`${r.courseSlug}/${r.lessonSlug}`] = {
      correct: r.quizCorrect,
      total: r.quizTotal,
    };
  }

  return {
    name: stats?.displayName ?? "",
    xp: stats?.xp ?? 0,
    completed,
    quizScores,
    streak: {
      current: stats?.streakCurrent ?? 0,
      best: stats?.streakBest ?? 0,
      lastDate: stats?.streakLastDate ?? "",
    },
    badges: stats?.badges ?? [],
  };
}

/** Badges opnieuw beoordelen op basis van wat er ECHT in de database staat. */
async function beoordeelBadges(
  userId: string,
  state: ProgressState
): Promise<string[]> {
  const completedLessonSlugs = Object.entries(state.completed).flatMap(
    ([course, lessons]) => lessons.map((l) => `${course}/${l}`)
  );
  const coursesCompleted = activeCourses.filter((c) => {
    const total = courseLessonCount(c);
    const done = state.completed[c.slug]?.length ?? 0;
    return total > 0 && done >= total;
  }).length;
  const perfectQuizzes = Object.values(state.quizScores).filter(
    (q) => q.total > 0 && q.correct === q.total
  ).length;

  const summary = {
    xp: state.xp,
    lessonsCompleted: completedLessonSlugs.length,
    coursesCompleted,
    totalCourses: activeCourses.length,
    perfectQuizzes,
    streakCurrent: state.streak.current,
    completedLessonSlugs,
  };
  // Badges raak je nooit kwijt, ook niet als een cursus later groeit.
  const verdiend = BADGES.filter((b) => b.when(summary)).map((b) => b.id);
  return [...new Set([...state.badges, ...verdiend])];
}

/**
 * Eén afgeronde les verwerken. Idempotent: dezelfde les nog een keer levert
 * geen tweede rij en geen tweede keer XP op — hooguit een betere quizscore.
 */
export async function verwerkLes(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
  quiz: QuizOutcome,
  dagLokaal: unknown
): Promise<ProgressState> {
  const course = getCourse(courseSlug);
  const lesson = course?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.slug === lessonSlug);
  if (!course || !lesson) return haalVoortgang(userId);

  // Scores buiten het bereik van de quiz zijn per definitie verzonnen.
  const totaal = lesson.quiz.length;
  const schoon: QuizOutcome = {
    total: totaal,
    correct: Math.max(0, Math.min(totaal, Math.round(Number(quiz?.correct) || 0))),
  };

  const bestaand = await db
    .select({ correct: lessonProgress.quizCorrect, total: lessonProgress.quizTotal })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.courseSlug, courseSlug),
        eq(lessonProgress.lessonSlug, lessonSlug)
      )
    )
    .limit(1);

  if (bestaand.length === 0) {
    const xpAwarded = lesson.xp + quizBonus(schoon);
    await db.insert(lessonProgress).values({
      userId,
      courseSlug,
      lessonSlug,
      quizCorrect: schoon.correct,
      quizTotal: schoon.total,
      xpAwarded,
    });

    // Streak alleen bewegen bij een NIEUWE les, net als in de client.
    const dag = geldigeDag(dagLokaal);
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);
    let current = stats?.streakCurrent ?? 0;
    let best = stats?.streakBest ?? 0;
    let lastDate = stats?.streakLastDate ?? null;
    if (dag && lastDate !== dag) {
      current = lastDate === vorigeDag(dag) ? current + 1 : 1;
      best = Math.max(best, current);
      lastDate = dag;
    }

    await db
      .insert(userStats)
      .values({
        userId,
        xp: xpAwarded,
        streakCurrent: current,
        streakBest: best,
        streakLastDate: lastDate,
        badges: [],
      })
      .onConflictDoUpdate({
        target: userStats.userId,
        set: {
          xp: sql`${userStats.xp} + ${xpAwarded}`,
          streakCurrent: current,
          streakBest: best,
          streakLastDate: lastDate,
          updatedAt: new Date(),
        },
      });
  } else {
    const beter =
      schoon.correct / Math.max(1, schoon.total) >
      bestaand[0].correct / Math.max(1, bestaand[0].total);
    if (beter) {
      // Betere score bewaren; de XP van destijds blijft staan (herhaalde les
      // geeft geen nieuwe XP — dezelfde regel als aan de clientkant).
      await db
        .update(lessonProgress)
        .set({ quizCorrect: schoon.correct, quizTotal: schoon.total })
        .where(
          and(
            eq(lessonProgress.userId, userId),
            eq(lessonProgress.courseSlug, courseSlug),
            eq(lessonProgress.lessonSlug, lessonSlug)
          )
        );
    }
  }

  const state = await haalVoortgang(userId);
  const badges = await beoordeelBadges(userId, state);
  if (
    badges.length !== state.badges.length ||
    badges.some((b) => !state.badges.includes(b))
  ) {
    await db
      .update(userStats)
      .set({ badges, updatedAt: new Date() })
      .where(eq(userStats.userId, userId));
    state.badges = badges;
  }
  return state;
}

/**
 * Eenmalige import van de localStorage-historie van vóór het inloggen.
 *
 * Alleen AANVULLEN: lessen die de server al kent blijven ongemoeid. XP wordt
 * volledig herrekend uit de cursusinhoud — de teller uit de browser gaat
 * bewust de prullenbak in. De streak nemen we wél over (met een plafond):
 * die valt niet te verifiëren, maar er hangt niets aan vast behalve trots,
 * en iemand zijn opgebouwde reeks afpakken bij het inloggen is precies de
 * verkeerde eerste indruk.
 */
export async function importeerSnapshot(
  userId: string,
  snapshot: unknown
): Promise<ProgressState> {
  const s = (snapshot ?? {}) as Partial<ProgressState>;

  const completed =
    s.completed && typeof s.completed === "object" ? s.completed : {};
  for (const [courseSlug, lessons] of Object.entries(completed)) {
    const course = getCourse(courseSlug);
    if (!course || !Array.isArray(lessons)) continue;
    const alleLessen = course.modules.flatMap((m) => m.lessons);
    for (const lessonSlug of lessons) {
      const lesson = alleLessen.find((l) => l.slug === lessonSlug);
      if (!lesson) continue;
      const score = s.quizScores?.[`${courseSlug}/${lessonSlug}`];
      const totaal = lesson.quiz.length;
      const schoon: QuizOutcome = {
        total: totaal,
        correct: Math.max(
          0,
          Math.min(totaal, Math.round(Number(score?.correct) || 0))
        ),
      };
      await db
        .insert(lessonProgress)
        .values({
          userId,
          courseSlug,
          lessonSlug,
          quizCorrect: schoon.correct,
          quizTotal: schoon.total,
          xpAwarded: lesson.xp + quizBonus(schoon),
        })
        .onConflictDoNothing();
    }
  }

  // XP = de som van wat er nu echt aan rijen staat.
  const [{ somXp }] = await db
    .select({ somXp: sql<number>`coalesce(sum(${lessonProgress.xpAwarded}), 0)::int` })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));

  const PLAFOND = 3650; // tien jaar elke dag — daarboven is het geen streak meer
  const clientStreak = s.streak ?? { current: 0, best: 0, lastDate: "" };
  const current = Math.max(0, Math.min(PLAFOND, Math.round(Number(clientStreak.current) || 0)));
  const best = Math.max(current, Math.min(PLAFOND, Math.round(Number(clientStreak.best) || 0)));
  const lastDate = geldigeDag(clientStreak.lastDate);

  const naam =
    typeof s.name === "string" ? s.name.trim().slice(0, 60) : "";

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  await db
    .insert(userStats)
    .values({
      userId,
      xp: somXp,
      streakCurrent: current,
      streakBest: best,
      streakLastDate: lastDate,
      badges: [],
      displayName: naam || null,
    })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: {
        xp: somXp,
        // Neem de gunstigste van beide werelden; nooit iets afpakken.
        streakCurrent: Math.max(stats?.streakCurrent ?? 0, current),
        streakBest: Math.max(stats?.streakBest ?? 0, best),
        streakLastDate: lastDate ?? stats?.streakLastDate ?? null,
        displayName: stats?.displayName ?? (naam || null),
        updatedAt: new Date(),
      },
    });

  const state = await haalVoortgang(userId);
  const badges = await beoordeelBadges(userId, state);
  await db
    .update(userStats)
    .set({ badges, updatedAt: new Date() })
    .where(eq(userStats.userId, userId));
  state.badges = badges;
  return state;
}
