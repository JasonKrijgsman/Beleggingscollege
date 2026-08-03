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
import type { CursusDetail } from "@/content/view";
import { ACCENTS } from "@/lib/accent";
import { PRICING } from "@/lib/pricing";
import { useProgress } from "@/lib/progress";
import CourseIcon from "./CourseIcon";

export default function CourseDetail({
  course,
  koopSlot,
  inBezit = false,
}: {
  course: CursusDetail;
  /** Server component met de koopknop; als slot doorgegeven zodat de sessie
   *  en de aankoopstatus op de server blijven. */
  koopSlot?: React.ReactNode;
  /** Door de server bepaald: deze bezoeker heeft de cursus gekocht. Dan tonen
   *  we trots bezit in plaats van een prijskaartje. */
  inBezit?: boolean;
}) {
  const acc = ACCENTS[course.accent];
  // Mag deze bezoeker de lessen openen? Let op: dit is géén autorisatie —
  // heeftToegangTot() op de server blijft de enige poort. Dit bepaalt
  // alleen wat we hier tónen, zodat we niemand naar een slot sturen.
  const mag = course.free || inBezit;
  const { isLessonCompleted, courseProgress, ready } = useProgress();
  const total = course.aantalLessen;
  const progress = ready ? courseProgress(course.slug, total) : 0;
  const done = Math.round(progress * total);
  const isComplete = total > 0 && progress >= 1;

  const all = course.modules.flatMap((m) => m.lessen.map((lesson) => ({ lesson })));
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
                {inBezit
                  ? "In jouw bezit"
                  : course.free
                    ? "Gratis"
                    : `${course.price ?? PRICING.losseCursus} eenmalig`}
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
                <Clock className="h-4 w-4" /> ±{course.duurMinuten}{" "}
                minuten
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> {course.totaalXp} XP te
                verdienen
              </span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              {/* Wie de cursus (nog) niet heeft, moet hier geen knop krijgen
                  die op het slotscherm uitkomt: dat is precies de trucdoos
                  waar dit merk zich tegen afzet. Voor hen wijst de knop naar
                  het curriculum, zodat ze zien wát ze kopen; de koopknop
                  ernaast blijft de enige weg naar afrekenen. */}
              {mag ? (
                continueTarget && (
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
                )
              ) : (
                <a
                  href="#curriculum"
                  className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-ink shadow-lg transition-transform hover:scale-105"
                >
                  <BookOpen className="h-4 w-4" />
                  Bekijk het curriculum
                </a>
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
            {!course.free && inBezit && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-goud-500/20 px-4 py-2 text-sm font-bold text-goud-300 ring-1 ring-goud-500/40">
                <Award className="h-4 w-4" aria-hidden="true" />
                Deze cursus is van jou — levenslang. Veel plezier ermee.
              </p>
            )}
            {!course.free && !inBezit && (
              <p className="mt-4 text-sm text-white/70">
                {course.price ?? PRICING.losseCursus} eenmalig — daarna
                levenslang toegang. Of volg deze cursus samen met alle andere
                voor {PRICING.abonnementMaand} per maand met College+.
              </p>
            )}
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
            {koopSlot}
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
      <section
        id="curriculum"
        className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6"
      >
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
                {mod.lessen.map((lesson, li) => {
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
                        {/* Een slotje vóórdat je klikt is eerlijker dan een
                            slotscherm erna. */}
                        {completed ? (
                          <Check className="h-4 w-4" />
                        ) : mag ? (
                          li + 1
                        ) : (
                          <Lock className="h-3.5 w-3.5" aria-label="Vergrendeld" />
                        )}
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
                          {lesson.durationMin} min · {lesson.aantalQuizvragen}{" "}
                          quizvragen · {lesson.xp} XP
                        </span>
                      </span>
                      {/* "Volgende" belooft dat je verder kunt; dat klopt
                          alleen als de cursus voor je open staat. */}
                      {isNext && mag && (
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
