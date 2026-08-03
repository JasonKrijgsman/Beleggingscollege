import "server-only";
import { eq, sql, type SQL } from "drizzle-orm";
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
 *
 * TWEEDE REGEL: of iemand een cursus MAG bijschrijven wordt hier niet
 * beoordeeld. Dat doet `heeftToegangTot()` in src/lib/entitlements.ts, de
 * enige toegangspoort, in de route hierboven. Deze module rekent alleen.
 *
 * DERDE REGEL: elke schrijfronde is ÉÉN SQL-statement. Zie de uitleg bij
 * `verwerkLes()` — met twee statements kan een gelijktijdig verzoek er
 * tussendoor glippen en XP verdubbelen of kwijtraken.
 */

/**
 * Het onwrikbare verband tussen de twee voortgangstabellen:
 *
 *   user_stats.xp = SUM(lesson_progress.xp_awarded) van diezelfde gebruiker
 *
 * Elke schrijver hieronder houdt dat overeind door XP nooit absoluut te
 * zetten maar altijd op te tellen bij wat er in de rij staat (`s.xp + delta`),
 * waarbij `delta` uitsluitend uit de RETURNING van de les-insert komt. Een
 * tweede, gelijktijdige afronding van dezelfde les levert daar nul rijen op,
 * en dus nul XP — ook als beide verzoeken op hetzelfde moment binnenkomen.
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
 *
 * WAAROM ÉÉN STATEMENT
 *
 * Dit stond hier eerst als "kijken of de les er al is → rij bijschrijven →
 * losse stats-upsert". Drie statements zonder transactie, en dus twee gaten:
 * twee gelijktijdige afrondingen van dezelfde les zagen allebei "nog niet
 * afgerond", waarna de tweede insert op de primaire sleutel klapte (een 500
 * voor de cursist) óf — bij een andere volgorde — de XP dubbel werd geteld.
 *
 * Een transactie eromheen kán niet: de neon-http-driver van productie
 * ondersteunt geen interactieve transacties ("No transactions support in
 * neon-http driver"), en db.batch() kan de RETURNING van het ene statement
 * niet in het volgende gebruiken. Eén statement met data-modifying CTE's is
 * in Postgres per definitie atomair en draait identiek op neon-http en op de
 * PGlite van de tests — dezelfde oplossing als in de Mollie-webhook.
 *
 * De stappen:
 *  1. nieuw      — de les bijschrijven, ON CONFLICT DO NOTHING. Levert de
 *                  toegekende XP terug, of niets als de les er al was. Dit is
 *                  de enige bron van de XP-delta, en daarmee de garantie dat
 *                  een herhaling nul XP oplevert.
 *  2. verbeterd  — bestond de les al, dan alleen een betere quizscore
 *                  bewaren. De XP van destijds blijft staan.
 *  3. basis      — de XP-som zoals die vóór dit statement in de tabel stond
 *                  (CTE's delen één snapshot, dus `nieuw` telt hier niet mee).
 *  4. bijgewerkt — bestaat er al een statsrij, dan optellen: `xp + delta`.
 *                  Een gelijktijdige schrijver wacht op de rijvergrendeling en
 *                  telt daarna op bij de nieuwe waarde; niemand raakt XP kwijt.
 *  5. de INSERT  — alleen als er nog geen statsrij was. De ON CONFLICT-tak
 *                  vangt de race af waarin een ander verzoek die rij net
 *                  aanmaakte; ook daar wordt opgeteld, nooit overschreven.
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
  const xpNieuw = lesson.xp + quizBonus(schoon);

  // De streak beweegt alleen bij een NIEUWE les, net als in de client.
  const dag = geldigeDag(dagLokaal);
  const vorige = dag ? vorigeDag(dag) : null;
  // Waarden voor een gebruiker die nog helemaal geen statsrij heeft.
  const startStreak = dag ? 1 : 0;

  // De nieuwe streakstand voor wie al een rij heeft. Twee keer nodig (voor
  // `current` én voor `best`), dus één keer opgeschreven en hergebruikt.
  const nieuweStreak = sql`
    CASE WHEN ${dag}::text IS NOT NULL
              AND coalesce(s.streak_last_date, '') <> ${dag}::text
         THEN CASE WHEN s.streak_last_date = ${vorige}::text
                   THEN s.streak_current + 1 ELSE 1 END
         ELSE s.streak_current END`;

  await db.execute(sql`
    WITH nieuw AS (
      INSERT INTO lesson_progress
        (user_id, course_slug, lesson_slug, quiz_correct, quiz_total, xp_awarded)
      VALUES (${userId}, ${courseSlug}, ${lessonSlug},
              ${schoon.correct}::int, ${schoon.total}::int, ${xpNieuw}::int)
      ON CONFLICT (user_id, course_slug, lesson_slug) DO NOTHING
      RETURNING xp_awarded
    ),
    verbeterd AS (
      UPDATE lesson_progress
      SET quiz_correct = ${schoon.correct}::int, quiz_total = ${schoon.total}::int
      WHERE user_id = ${userId}
        AND course_slug = ${courseSlug}
        AND lesson_slug = ${lessonSlug}
        AND NOT EXISTS (SELECT 1 FROM nieuw)
        AND ${schoon.correct}::numeric / greatest(1, ${schoon.total}::int)
            > quiz_correct::numeric / greatest(1, quiz_total)
      RETURNING 1
    ),
    basis AS (
      SELECT coalesce(sum(xp_awarded), 0)::int AS som
      FROM lesson_progress WHERE user_id = ${userId}
    ),
    bijgewerkt AS (
      UPDATE user_stats s
      SET xp = s.xp + n.xp_awarded,
          streak_current = ${nieuweStreak},
          streak_best = greatest(s.streak_best, ${nieuweStreak}),
          streak_last_date = coalesce(${dag}::text, s.streak_last_date),
          updated_at = now()
      FROM nieuw n
      WHERE s.user_id = ${userId}
      RETURNING 1
    )
    INSERT INTO user_stats
      (user_id, xp, streak_current, streak_best, streak_last_date, badges, updated_at)
    SELECT ${userId}::text, b.som + n.xp_awarded,
           ${startStreak}::int, ${startStreak}::int, ${dag}::text,
           '{}'::text[], now()
    FROM nieuw n, basis b
    WHERE NOT EXISTS (SELECT 1 FROM bijgewerkt)
    ON CONFLICT (user_id) DO UPDATE SET
      xp = user_stats.xp + excluded.xp,
      streak_current = greatest(user_stats.streak_current, excluded.streak_current),
      streak_best = greatest(user_stats.streak_best, excluded.streak_best),
      streak_last_date = coalesce(excluded.streak_last_date, user_stats.streak_last_date),
      updated_at = now()
  `);

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
 *
 * Toegang wordt hier NIET beoordeeld: de route heeft het snapshot al
 * teruggesnoeid tot de cursussen waar deze gebruiker recht op heeft.
 *
 * Ook dit is één statement, om dezelfde reden als bij `verwerkLes()`. Het
 * oude "rij voor rij invoegen → som ophalen → som wegschrijven" zette XP
 * absoluut; kwam er tussen het optellen en het wegschrijven een afgeronde
 * les binnen, dan werd die stilletjes overschreven. Nu telt ook de import
 * alleen de eigen delta op bij wat er staat.
 */
export async function importeerSnapshot(
  userId: string,
  snapshot: unknown
): Promise<ProgressState> {
  const s = (snapshot ?? {}) as Partial<ProgressState>;

  const completed =
    s.completed && typeof s.completed === "object" ? s.completed : {};

  // Eerst de rijen samenstellen uit de échte cursusinhoud: onbekende
  // cursussen en lessen vallen af, quizscores worden begrensd, XP wordt
  // herrekend. Een dubbele vermelding telt maar één keer.
  const rijen: SQL[] = [];
  const gezien = new Set<string>();
  for (const [courseSlug, lessons] of Object.entries(completed)) {
    const course = getCourse(courseSlug);
    if (!course || !Array.isArray(lessons)) continue;
    const alleLessen = course.modules.flatMap((m) => m.lessons);
    for (const lessonSlug of lessons) {
      const lesson = alleLessen.find((l) => l.slug === lessonSlug);
      if (!lesson) continue;
      const sleutel = `${courseSlug}/${lessonSlug}`;
      if (gezien.has(sleutel)) continue;
      gezien.add(sleutel);
      const score = s.quizScores?.[sleutel];
      const totaal = lesson.quiz.length;
      const schoon: QuizOutcome = {
        total: totaal,
        correct: Math.max(
          0,
          Math.min(totaal, Math.round(Number(score?.correct) || 0))
        ),
      };
      rijen.push(sql`(${userId}, ${courseSlug}, ${lessonSlug},
        ${schoon.correct}::int, ${schoon.total}::int,
        ${lesson.xp + quizBonus(schoon)}::int)`);
    }
  }

  // Zonder rijen moet het statement er toch staan (de streak en de naam
  // worden ook dan overgenomen); een bron die nul rijen oplevert doet dat.
  const bron = rijen.length
    ? sql`VALUES ${sql.join(rijen, sql`, `)}`
    : sql`SELECT ${userId}::text, ''::text, ''::text, 0::int, 0::int, 0::int WHERE false`;

  const PLAFOND = 3650; // tien jaar elke dag — daarboven is het geen streak meer
  const clientStreak = s.streak ?? { current: 0, best: 0, lastDate: "" };
  const current = Math.max(0, Math.min(PLAFOND, Math.round(Number(clientStreak.current) || 0)));
  const best = Math.max(current, Math.min(PLAFOND, Math.round(Number(clientStreak.best) || 0)));
  const lastDate = geldigeDag(clientStreak.lastDate);

  const naam =
    typeof s.name === "string" ? s.name.trim().slice(0, 60) : "";

  await db.execute(sql`
    WITH ingevoerd AS (
      INSERT INTO lesson_progress
        (user_id, course_slug, lesson_slug, quiz_correct, quiz_total, xp_awarded)
      ${bron}
      ON CONFLICT (user_id, course_slug, lesson_slug) DO NOTHING
      RETURNING xp_awarded
    ),
    delta AS (
      SELECT coalesce(sum(xp_awarded), 0)::int AS xp FROM ingevoerd
    ),
    basis AS (
      SELECT coalesce(sum(xp_awarded), 0)::int AS som
      FROM lesson_progress WHERE user_id = ${userId}
    ),
    bijgewerkt AS (
      UPDATE user_stats s
      SET xp = s.xp + d.xp,
          -- Neem de gunstigste van beide werelden; nooit iets afpakken.
          streak_current = greatest(s.streak_current, ${current}::int),
          streak_best = greatest(s.streak_best, ${best}::int),
          streak_last_date = coalesce(${lastDate}::text, s.streak_last_date),
          display_name = coalesce(s.display_name, ${naam || null}::text),
          updated_at = now()
      FROM delta d
      WHERE s.user_id = ${userId}
      RETURNING 1
    )
    INSERT INTO user_stats
      (user_id, xp, streak_current, streak_best, streak_last_date,
       badges, display_name, updated_at)
    SELECT ${userId}::text, b.som + d.xp,
           ${current}::int, ${best}::int, ${lastDate}::text,
           '{}'::text[], ${naam || null}::text, now()
    FROM basis b, delta d
    WHERE NOT EXISTS (SELECT 1 FROM bijgewerkt)
    ON CONFLICT (user_id) DO UPDATE SET
      xp = user_stats.xp + excluded.xp,
      streak_current = greatest(user_stats.streak_current, excluded.streak_current),
      streak_best = greatest(user_stats.streak_best, excluded.streak_best),
      streak_last_date = coalesce(excluded.streak_last_date, user_stats.streak_last_date),
      display_name = coalesce(user_stats.display_name, excluded.display_name),
      updated_at = now()
  `);

  const state = await haalVoortgang(userId);
  const badges = await beoordeelBadges(userId, state);
  await db
    .update(userStats)
    .set({ badges, updatedAt: new Date() })
    .where(eq(userStats.userId, userId));
  state.badges = badges;
  return state;
}
