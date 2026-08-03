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
import {
  LEGE_VOORTGANG,
  pasLesToe,
  summarize,
  type CompletionResult,
  type ProgressState,
  type QuizOutcome,
} from "./voortgang-regels";

// LET OP: dit bestand draait in de browser. Importeer hier nooit `@/content` —
// dat sleept alle lesteksten en quizantwoorden mee de bundel in. De catalogus
// komt binnen als prop, berekend op de server met `catalogus()` uit
// `@/content/view`. Het type hierboven is een `import type` en verdwijnt bij
// het compileren.
//
// De rekenregels zelf (XP, streak, badges) staan in ./voortgang-regels: puur
// en zonder React, zodat ze direct te testen zijn. Dit bestand doet alleen de
// omgeving: localStorage, de klok en de synchronisatie met de server.

export { summarize };
export type { CompletionResult, ProgressState, QuizOutcome };

const STORAGE_KEY = "beleggingscollege-voortgang-v1";

const EMPTY = LEGE_VOORTGANG;

function localDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
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
    baseXp: number,
    antwoorden?: number[]
  ) => CompletionResult;
  isLessonCompleted: (courseSlug: string, lessonSlug: string) => boolean;
  courseProgress: (courseSlug: string, totalLessons: number) => number; // 0..1
  resetAll: () => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({
  children,
  catalogus,
  ingelogd = false,
}: {
  children: React.ReactNode;
  catalogus: CursusOutline[];
  /** Door de layout (server) bepaald. Ingelogd = de database is de bron van
   *  waarheid; localStorage blijft het vangnet en de cache. */
  ingelogd?: boolean;
}) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let lokaal: ProgressState = EMPTY;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProgressState>;
        lokaal = {
          ...EMPTY,
          ...parsed,
          streak: { ...EMPTY.streak, ...(parsed.streak ?? {}) },
        };
      }
    } catch {
      // corrupte opslag: begin met een schone lei
    }
    setState(lokaal);
    setReady(true);

    if (!ingelogd) return;

    // Ingelogd: stuur de lokale historie op (de server vult alleen aan en
    // herrekent alle XP zelf) en neem het antwoord over als waarheid. Zo
    // reist voortgang mee naar elk apparaat waarop je met hetzelfde account
    // inlogt, en raakt niemand kwijt wat hij vóór het inloggen al deed.
    (async () => {
      try {
        const res = await fetch("/api/voortgang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ soort: "snapshot", snapshot: lokaal }),
        });
        if (!res.ok) return; // sessie net verlopen? localStorage werkt gewoon
        const data = (await res.json()) as { state?: ProgressState };
        if (data.state) {
          const vanServer: ProgressState = {
            ...EMPTY,
            ...data.state,
            streak: { ...EMPTY.streak, ...(data.state.streak ?? {}) },
            // De server bewaart geen individuele antwoorden; die blijven van
            // dit apparaat. Anders wist elke sync je terugkijk-historie.
            quizAntwoorden: lokaal.quizAntwoorden,
          };
          stateRef.current = vanServer;
          setState(vanServer);
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vanServer));
          } catch {
            // opslag vol: sessie werkt door in het geheugen
          }
        }
      } catch {
        // netwerk hapert: lokaal doorwerken, volgende paginalading opnieuw
      }
    })();
  }, [ingelogd]);

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
      baseXp: number,
      antwoorden?: number[]
    ): CompletionResult => {
      const { volgende, resultaat } = pasLesToe(
        stateRef.current,
        {
          courseSlug,
          lessonSlug,
          quiz,
          baseXp,
          antwoorden,
          vandaag: localDate(),
          gisteren: localDate(-1),
        },
        catalogus
      );
      persist(volgende);

      // Ingelogd: dezelfde les ook op de server bijschrijven. Bewust
      // fire-and-forget mét overname van het antwoord: de server herrekent
      // de XP uit de cursusinhoud en is daarmee de waarheid. Mislukt het
      // verzoek, dan blijft de lokale stand staan en repareert de
      // snapshot-import het bij de volgende paginalading.
      if (ingelogd) {
        fetch("/api/voortgang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            soort: "les",
            courseSlug,
            lessonSlug,
            correct: quiz.correct,
            total: quiz.total,
            dagLokaal: localDate(),
          }),
        })
          .then(async (res) => {
            if (!res.ok) return;
            const data = (await res.json()) as { state?: ProgressState };
            if (data.state) {
              persist({
                ...EMPTY,
                ...data.state,
                streak: { ...EMPTY.streak, ...(data.state.streak ?? {}) },
                quizAntwoorden: stateRef.current.quizAntwoorden,
              });
            }
          })
          .catch(() => {
            // netwerk hapert: lokaal is al bijgewerkt
          });
      }

      return resultaat;
    },
    [persist, catalogus, ingelogd]
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
