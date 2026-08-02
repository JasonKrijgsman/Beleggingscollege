// Dit bestand bevat álle lesteksten en álle quizantwoorden. Het mag daarom
// nooit in een browserbundel terechtkomen: een module met "use client" die dit
// importeert sleept de complete betaalde catalogus mee, ook als hij er maar één
// getal uit gebruikt. Dat is precies wat er gebeurd is — 21 lessen en 88
// antwoorden stonden in een publiek JS-bestand.
//
// `server-only` laat de build falen zodra dat opnieuw dreigt te gebeuren.
// Heeft een client component cursusgegevens nodig, gebruik dan `catalogus()`
// of `samenvatting()` uit ./view en geef het resultaat door als prop.
import "server-only";

import type { Course, Lesson, Module } from "./types";
import beleggenVoorBeginners from "./courses/beleggen-voor-beginners";
import waardebeleggen from "./courses/waardebeleggen";
import technischeAnalyse from "./courses/technische-analyse";
import beleggingspsychologie from "./courses/beleggingspsychologie";

export const courses: Course[] = [
  beleggenVoorBeginners,
  waardebeleggen,
  technischeAnalyse,
  beleggingspsychologie,
].sort((a, b) => a.order - b.order);

export const activeCourses = courses.filter((c) => !c.comingSoon);

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export type FlatLesson = { module: Module; lesson: Lesson; index: number };

export function flatLessons(course: Course): FlatLesson[] {
  const out: FlatLesson[] = [];
  let i = 0;
  for (const m of course.modules) {
    for (const l of m.lessons) {
      out.push({ module: m, lesson: l, index: i++ });
    }
  }
  return out;
}

export function courseLessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function courseDurationMin(course: Course): number {
  return course.modules.reduce(
    (n, m) => n + m.lessons.reduce((s, l) => s + l.durationMin, 0),
    0
  );
}

export function courseXpTotal(course: Course): number {
  return course.modules.reduce(
    (n, m) => n + m.lessons.reduce((s, l) => s + l.xp, 0),
    0
  );
}

export function totalQuizQuestions(course: Course): number {
  return course.modules.reduce(
    (n, m) => n + m.lessons.reduce((s, l) => s + l.quiz.length, 0),
    0
  );
}

export type LessonContext = FlatLesson & {
  prev: FlatLesson | null;
  next: FlatLesson | null;
  total: number;
};

export function getLessonContext(
  course: Course,
  lessonSlug: string
): LessonContext | null {
  const all = flatLessons(course);
  const idx = all.findIndex((x) => x.lesson.slug === lessonSlug);
  if (idx === -1) return null;
  return {
    ...all[idx],
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx + 1 < all.length ? all[idx + 1] : null,
    total: all.length,
  };
}
