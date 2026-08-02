"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Lock,
  Play,
  Quote,
  Zap,
} from "lucide-react";
import type { Course } from "@/content/types";
import {
  courseDurationMin,
  courseLessonCount,
  courseXpTotal,
  flatLessons,
} from "@/content";
import { ACCENTS } from "@/lib/accent";
import { useProgress } from "@/lib/progress";
import CourseIcon from "./CourseIcon";

export default function CourseDetail({ course }: { course: Course }) {
  const acc = ACCENTS[course.accent];
  const { isLessonCompleted, courseProgress, ready } = useProgress();
  const total = courseLessonCount(course);
  const progress = ready ? courseProgress(course.slug, total) : 0;
  const done = Math.round(progress * total);
  const isComplete = total > 0 && progress >= 1;

  const all = flatLessons(course);
  const firstOpen = all.find(
    (x) => !isLessonCompleted(course.slug, x.lesson.slug)
  );
  const continueTarget = firstOpen ?? all[0];

  if (course.comingSoon) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className={`mx-auto inline-flex rounded-2xl p-4 ${acc.iconBox}`}>
          <CourseIcon icon={course.icon} className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-4xl font-extrabold text-ink">{course.title}</h1>
        <p className="mt-2 text-lg font-semibold text-body">{course.subtitle}</p>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-body">
          {course.description}
        </p>
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-lijn bg-white p-6 text-left shadow-card">
          <div className="text-sm font-bold uppercase tracking-wider text-body">
            Wat je gaat leren
          </div>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            {course.learnPoints.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check className={`mt-0.5 h-4 w-4 shrink-0 ${acc.text}`} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist px-5 py-2.5 text-sm font-bold text-body">
          <Lock className="h-4 w-4" /> Binnenkort beschikbaar — onderdeel van
          College+
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Cursushero */}
      <section
        className={`bg-gradient-to-br ${acc.gradient} text-white`}
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-white/15 p-2.5">
                <CourseIcon icon={course.icon} className="h-6 w-6" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                {course.level} ·{" "}
                {course.free ? "Gratis" : course.price ?? "College+"}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">
              {course.title}
            </h1>
            <p className="mt-2 text-xl font-semibold text-white/85">
              {course.subtitle}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
              {course.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/80">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {total} lessen
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> ±{courseDurationMin(course)}{" "}
                minuten
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> {courseXpTotal(course)} XP te
                verdienen
              </span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              {continueTarget && (
                <Link
                  href={`/cursussen/${course.slug}/les/${continueTarget.lesson.slug}`}
                  className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-ink shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="h-4 w-4" />
                  {done === 0
                    ? "Start de cursus"
                    : isComplete
                      ? "Bekijk de lessen opnieuw"
                      : "Ga verder met leren"}
                </Link>
              )}
              {isComplete && (
                <Link
                  href={`/cursussen/${course.slug}/certificaat`}
                  className="flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  <Award className="h-4 w-4" /> Je certificaat
                </Link>
              )}
            </div>
            {ready && done > 0 && (
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-xs font-semibold text-white/80">
                  <span>
                    {done} van {total} lessen afgerond
                  </span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-wider text-white/70">
                Wat je leert
              </div>
              <ul className="mt-3 space-y-2.5 text-sm font-semibold">
                {course.learnPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-groen-300" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            {course.heroQuote && (
              <figure className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <Quote className="h-5 w-5 text-white/50" />
                <blockquote className="mt-2 text-sm italic leading-relaxed text-white/90">
                  {course.heroQuote.text}
                </blockquote>
                <figcaption className="mt-2 text-xs font-bold text-white/60">
                  — {course.heroQuote.source}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold text-ink">Het curriculum</h2>
        <div className="mt-6 space-y-8">
          {course.modules.map((mod, mi) => (
            <div key={mod.slug}>
              <div className="mb-3 flex items-baseline gap-3">
                <span className={`text-sm font-extrabold ${acc.text}`}>
                  Module {mi + 1}
                </span>
                <h3 className="text-lg font-bold text-ink">{mod.title}</h3>
              </div>
              <p className="mb-4 text-sm text-body">{mod.description}</p>
              <div className="overflow-hidden rounded-2xl border border-lijn bg-white shadow-card">
                {mod.lessons.map((lesson, li) => {
                  const completed =
                    ready && isLessonCompleted(course.slug, lesson.slug);
                  const isNext =
                    firstOpen?.lesson.slug === lesson.slug && !completed;
                  return (
                    <Link
                      key={lesson.slug}
                      href={`/cursussen/${course.slug}/les/${lesson.slug}`}
                      className={`flex items-center gap-4 border-b border-lijn px-5 py-4 transition-colors last:border-0 hover:bg-mist ${
                        isNext ? "bg-brand-50/60" : ""
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                          completed
                            ? "bg-groen-600 text-white"
                            : isNext
                              ? "bg-brand-600 text-white"
                              : "bg-mist text-body"
                        }`}
                      >
                        {completed ? <Check className="h-4 w-4" /> : li + 1}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block text-sm font-bold ${
                            completed ? "text-body" : "text-ink"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold text-body">
                          {lesson.durationMin} min · {lesson.quiz.length}{" "}
                          quizvragen · {lesson.xp} XP
                        </span>
                      </span>
                      {isNext && (
                        <span className="hidden rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white sm:block">
                          Volgende
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0 text-body" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
