"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Award,
  BookOpen,
  Flame,
  GraduationCap,
  Lock,
  Play,
  Zap,
} from "lucide-react";
import { ACCENTS } from "@/lib/accent";
import { BADGES } from "@/lib/badges";
import { levelForXp, LEVELS } from "@/lib/levels";
import { summarize, useProgress } from "@/lib/progress";
import CourseIcon from "@/components/CourseIcon";
import EmailCapture from "@/components/EmailCapture";

function NameGreeting() {
  const { state, setName, ready } = useProgress();
  const [draft, setDraft] = useState("");
  if (!ready) return <div className="h-10" />;
  if (state.name) {
    return (
      <h1 className="text-4xl font-extrabold text-ink">
        Hoi {state.name} 👋
      </h1>
    );
  }
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-ink">Mijn leerpad</h1>
      <form
        className="mt-4 flex max-w-sm gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) setName(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Hoe mogen we je noemen?"
          className="w-full rounded-full border border-lijn bg-white px-4 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
        >
          Opslaan
        </button>
      </form>
    </div>
  );
}

export default function LeerpadPage() {
  const {
    state,
    ready,
    catalogus: activeCourses,
    courseProgress,
    isLessonCompleted,
    resetAll,
  } = useProgress();
  const summary = summarize(state, activeCourses);
  const { level, next, progress: levelProgress } = levelForXp(state.xp);

  // Volgende aanbevolen les: eerste niet-afgeronde les in cursusvolgorde,
  // met voorrang voor cursussen waar je al aan begonnen bent.
  const started = activeCourses.filter((c) => {
    const p = courseProgress(c.slug, c.aantalLessen);
    return p > 0 && p < 1;
  });
  // Ben je nog nergens begonnen, wijs dan alleen naar wat je ook echt kunt
  // openen. Deze pagina draait in de browser en weet niet wat je gekocht hebt,
  // dus viel de aanbeveling terug op de héle catalogus — en zo stuur je iemand
  // naar een slotscherm. Een cursus waar je al middenin zit heb je per
  // definitie open, dus die tak is veilig. Zolang deze pagina geen serverkant
  // heeft is "gratis" de enige veilige aanname; zie docs/openstaand.md §6c.
  const candidates =
    started.length > 0 ? started : activeCourses.filter((c) => c.free);
  let nextUp: { courseTitle: string; href: string; lessonTitle: string; accent: keyof typeof ACCENTS } | null = null;
  for (const c of candidates) {
    const open = c.lessen.find((les) => !isLessonCompleted(c.slug, les.slug));
    if (open) {
      nextUp = {
        courseTitle: c.title,
        lessonTitle: open.title,
        href: `/cursussen/${c.slug}/les/${open.slug}`,
        accent: c.accent,
      };
      break;
    }
  }

  const completedCourses = activeCourses.filter(
    (c) => c.aantalLessen > 0 && courseProgress(c.slug, c.aantalLessen) >= 1
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <NameGreeting />

      {/* Statistieken */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-lijn bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-body">
            <Zap className="h-4 w-4 text-goud-500" /> Ervaring
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink">
            {state.xp.toLocaleString("nl-NL")} XP
          </div>
          <div className="mt-1 text-sm font-semibold text-body">
            Level: {level.name}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-700"
              style={{ width: `${Math.round(levelProgress * 100)}%` }}
            />
          </div>
          {next && (
            <div className="mt-1.5 text-xs font-semibold text-body">
              Nog {(next.minXp - state.xp).toLocaleString("nl-NL")} XP tot{" "}
              {next.name}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-lijn bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-body">
            <Flame className="h-4 w-4 text-goud-500" /> Streak
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink">
            {state.streak.current}{" "}
            <span className="text-base font-bold text-body">
              {state.streak.current === 1 ? "dag" : "dagen"}
            </span>
          </div>
          <div className="mt-1 text-sm font-semibold text-body">
            Record: {state.streak.best}{" "}
            {state.streak.best === 1 ? "dag" : "dagen"}
          </div>
        </div>
        <div className="rounded-2xl border border-lijn bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-body">
            <BookOpen className="h-4 w-4 text-brand-600" /> Lessen
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink">
            {summary.lessonsCompleted}
          </div>
          <div className="mt-1 text-sm font-semibold text-body">
            van {activeCourses.reduce((n, c) => n + c.aantalLessen, 0)}{" "}
            afgerond
          </div>
        </div>
        <div className="rounded-2xl border border-lijn bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-body">
            <Award className="h-4 w-4 text-goud-500" /> Badges
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink">
            {state.badges.length}
            <span className="text-base font-bold text-body">
              {" "}
              / {BADGES.length}
            </span>
          </div>
          <div className="mt-1 text-sm font-semibold text-body">verzameld</div>
        </div>
      </div>

      {/* Ga verder */}
      {ready && nextUp && (
        <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-brand-800 p-7 text-white shadow-pop">
          <div className="text-xs font-bold uppercase tracking-wider text-white/70">
            {summary.lessonsCompleted === 0
              ? "Begin hier"
              : "Ga verder waar je was gebleven"}
          </div>
          <div className="mt-2 text-2xl font-extrabold">
            {nextUp.lessonTitle}
          </div>
          <div className="mt-1 text-sm font-semibold text-white/80">
            {nextUp.courseTitle}
          </div>
          <Link
            href={nextUp.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" /> Naar de les
          </Link>
        </div>
      )}
      {ready && !nextUp && summary.lessonsCompleted > 0 && (
        <div className="mt-10 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-groen-900 to-groen-600 p-7 text-white shadow-pop">
            <div className="text-2xl font-extrabold">
              Alles afgerond — meesterlijk! 🎓
            </div>
            <p className="mt-1 text-sm font-semibold text-white/85">
              Nieuwe cursussen zijn in de maak. Tot die tijd: herhaal gerust een
              les of bekijk je certificaten hieronder.
            </p>
          </div>
          <EmailCapture bron="leerpad/alles-afgerond" />
        </div>
      )}

      {/* Cursusvoortgang */}
      <h2 className="mt-12 text-2xl font-extrabold text-ink">Mijn cursussen</h2>
      <div className="mt-5 space-y-3">
        {activeCourses.map((c) => {
          const total = c.aantalLessen;
          const p = ready ? courseProgress(c.slug, total) : 0;
          const acc = ACCENTS[c.accent];
          return (
            <Link
              key={c.slug}
              href={`/cursussen/${c.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-lijn bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop"
            >
              <span className={`rounded-xl p-2.5 ${acc.iconBox}`}>
                <CourseIcon icon={c.icon} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ink">
                  {c.title}
                </span>
                <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-mist">
                  <span
                    className={`block h-full rounded-full transition-all duration-700 ${acc.bar}`}
                    style={{ width: `${Math.round(p * 100)}%` }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-sm font-extrabold text-ink">
                {Math.round(p * 100)}%
              </span>
            </Link>
          );
        })}
      </div>

      {/* Certificaten */}
      {completedCourses.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-extrabold text-ink">
            Mijn certificaten
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {completedCourses.map((c) => (
              <Link
                key={c.slug}
                href={`/cursussen/${c.slug}/certificaat`}
                className="flex items-center gap-4 rounded-2xl border-2 border-goud-300 bg-goud-100/40 p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop"
              >
                <GraduationCap className="h-8 w-8 shrink-0 text-goud-600" />
                <span className="flex-1 text-sm font-bold text-ink">
                  {c.title}
                </span>
                <span className="text-xs font-bold text-goud-600">
                  Bekijk →
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Badges */}
      <h2 className="mt-12 text-2xl font-extrabold text-ink">Badges</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BADGES.map((b) => {
          const earned = state.badges.includes(b.id);
          return (
            <div
              key={b.id}
              title={b.description}
              className={`rounded-2xl border p-4 text-center transition-all ${
                earned
                  ? "border-goud-300 bg-white shadow-card"
                  : "border-lijn bg-mist opacity-60"
              }`}
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                  earned ? "bg-goud-100 text-goud-600" : "bg-lijn text-body"
                }`}
              >
                {earned ? (
                  <b.icon className="h-6 w-6" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </div>
              <div className="mt-2 text-sm font-bold text-ink">{b.name}</div>
              <div className="mt-0.5 text-xs leading-snug text-body">
                {b.description}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Weet je zeker dat je alle voortgang wilt wissen? Dit kan niet ongedaan worden gemaakt."
              )
            ) {
              resetAll();
            }
          }}
          className="text-xs font-semibold text-body underline-offset-2 hover:text-red-600 hover:underline"
        >
          Voortgang wissen
        </button>
      </div>
    </div>
  );
}
