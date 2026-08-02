"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CursusOutline } from "@/content/view";
import { BADGES, badgeById, type Badge, type ProgressSummary } from "./badges";
import { levelForXp } from "./levels";

// LET OP: dit bestand draait in de browser. Importeer hier nooit `@/content` —
// dat sleept alle lesteksten en quizantwoorden mee de bundel in. De catalogus
// komt binnen als prop, berekend op de server met `catalogus()` uit
// `@/content/view`. Het type hierboven is een `import type` en verdwijnt bij
// het compileren.

export type QuizOutcome = { correct: number; total: number };

export type ProgressState = {
  name: string;
  xp: number;
  completed: Record<string, string[]>; // cursusslug -> afgeronde lesslugs
  quizScores: Record<string, QuizOutcome>; // "cursus/les" -> beste score
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

const STORAGE_KEY = "beleggingscollege-voortgang-v1";

const EMPTY: ProgressState = {
  name: "",
  xp: 0,
  completed: {},
  quizScores: {},
  streak: { current: 0, best: 0, lastDate: "" },
  badges: [],
};

function localDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

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

type ProgressApi = {
  state: ProgressState;
  ready: boolean;
  /** Cursussen zonder lesinhoud, aangeleverd door de server. */
  catalogus: CursusOutline[];
  setName: (name: string) => void;
  completeLesson: (
    courseSlug: string,
    lessonSlug: string,
    quiz: QuizOutcome,
    baseXp: number
  ) => CompletionResult;
  isLessonCompleted: (courseSlug: string, lessonSlug: string) => boolean;
  courseProgress: (courseSlug: string, totalLessons: number) => number; // 0..1
  resetAll: () => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({
  children,
  catalogus,
}: {
  children: React.ReactNode;
  catalogus: CursusOutline[];
}) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProgressState>;
        setState({
          ...EMPTY,
          ...parsed,
          streak: { ...EMPTY.streak, ...(parsed.streak ?? {}) },
        });
      }
    } catch {
      // corrupte opslag: begin met een schone lei
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: ProgressState) => {
    stateRef.current = next;
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // opslag vol of geblokkeerd: voortgang leeft dan alleen in deze sessie
    }
  }, []);

  const setName = useCallback(
    (name: string) => persist({ ...stateRef.current, name: name.trim() }),
    [persist]
  );

  const completeLesson = useCallback(
    (
      courseSlug: string,
      lessonSlug: string,
      quiz: QuizOutcome,
      baseXp: number
    ): CompletionResult => {
      const prev = stateRef.current;
      const already =
        prev.completed[courseSlug]?.includes(lessonSlug) ?? false;
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

      const today = localDate();
      const yesterday = localDate(-1);
      let streak = prev.streak;
      if (streak.lastDate !== today) {
        const current = streak.lastDate === yesterday ? streak.current + 1 : 1;
        streak = {
          current,
          best: Math.max(current, streak.best),
          lastDate: today,
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
        streak,
      };
      const summary = summarize(interim, catalogus);
      const earnedNow = BADGES.filter((b) => b.when(summary)).map((b) => b.id);
      const newBadgeIds = earnedNow.filter((id) => !prev.badges.includes(id));
      const next: ProgressState = {
        ...interim,
        badges: [...prev.badges, ...newBadgeIds],
      };
      persist(next);

      return {
        xpGained,
        newBadges: newBadgeIds
          .map((id) => badgeById(id))
          .filter((b): b is Badge => Boolean(b)),
        leveledUp: after.index > beforeLevel,
        levelName: after.level.name,
        alreadyCompleted: already,
      };
    },
    [persist, catalogus]
  );

  const isLessonCompleted = useCallback(
    (courseSlug: string, lessonSlug: string) =>
      stateRef.current.completed[courseSlug]?.includes(lessonSlug) ?? false,
    []
  );

  const courseProgress = useCallback(
    (courseSlug: string, totalLessons: number) => {
      if (totalLessons <= 0) return 0;
      const done = stateRef.current.completed[courseSlug]?.length ?? 0;
      return Math.min(1, done / totalLessons);
    },
    []
  );

  const resetAll = useCallback(() => persist(EMPTY), [persist]);

  const api: ProgressApi = {
    state,
    ready,
    catalogus,
    setName,
    completeLesson,
    isLessonCompleted,
    courseProgress,
    resetAll,
  };

  return (
    <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress moet binnen een ProgressProvider staan");
  }
  return ctx;
}
