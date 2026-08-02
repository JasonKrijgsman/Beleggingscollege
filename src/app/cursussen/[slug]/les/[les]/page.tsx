import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  BookMarked,
  Clock,
  Lightbulb,
  ListChecks,
  Zap,
} from "lucide-react";
import { courses, flatLessons, getCourse, getLessonContext, courseLessonCount } from "@/content";
import { ACCENTS } from "@/lib/accent";
import LessonRunner from "@/components/LessonRunner";
import CompoundCalculator from "@/components/CompoundCalculator";

export function generateStaticParams() {
  return courses.flatMap((c) =>
    flatLessons(c).map((x) => ({ slug: c.slug, les: x.lesson.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; les: string }>;
}): Promise<Metadata> {
  const { slug, les } = await params;
  const course = getCourse(slug);
  const ctx = course ? getLessonContext(course, les) : null;
  if (!course || !ctx) return {};
  return {
    title: `${ctx.lesson.title} · ${course.title}`,
    description: ctx.lesson.intro,
    alternates: { canonical: `/cursussen/${slug}/les/${les}` },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; les: string }>;
}) {
  const { slug, les } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const ctx = getLessonContext(course, les);
  if (!ctx) notFound();

  const acc = ACCENTS[course.accent];
  const { lesson, module: mod } = ctx;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Broodkruimel */}
      <nav className="mb-6 flex items-center gap-2 text-sm font-semibold text-body">
        <Link
          href={`/cursussen/${course.slug}`}
          className="flex items-center gap-1.5 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {course.title}
        </Link>
        <span>·</span>
        <span>{mod.title}</span>
      </nav>

      <header>
        <div className="flex items-center gap-3 text-xs font-bold text-body">
          <span className={`rounded-full px-3 py-1 ${acc.soft}`}>
            Les {ctx.index + 1} van {ctx.total}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {lesson.durationMin} min
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-goud-500" /> {lesson.xp} XP
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-body">{lesson.intro}</p>
      </header>

      <div className="mt-8 space-y-8">
        {lesson.sections.map((section, si) => (
          <section key={si}>
            <h2 className="text-xl font-bold text-ink">{section.heading}</h2>
            <div className="mt-3 space-y-3.5 leading-relaxed text-body">
              {section.paragraphs.map((p, pi) => (
                <p key={pi}>{p}</p>
              ))}
            </div>
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-3.5 space-y-2 leading-relaxed text-body">
                {section.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-2.5">
                    <span
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${acc.bar}`}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {section.example && (
              <div
                className={`mt-4 rounded-xl border-l-4 bg-white p-5 shadow-card ${acc.border}`}
              >
                <div
                  className={`flex items-center gap-2 text-sm font-bold ${acc.text}`}
                >
                  <Lightbulb className="h-4 w-4" />
                  {section.example.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {section.example.body}
                </p>
              </div>
            )}
          </section>
        ))}
      </div>

      {lesson.tool === "rente-op-rente" && <CompoundCalculator />}

      {lesson.bookRefs && lesson.bookRefs.length > 0 && (
        <aside className="mt-10 rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-body">
            <BookMarked className={`h-4 w-4 ${acc.text}`} />
            Uit de boekenkast
          </div>
          <div className="mt-4 space-y-4">
            {lesson.bookRefs.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div
                  className={`flex h-14 w-10 shrink-0 items-center justify-center rounded-md text-white shadow ${acc.bar}`}
                >
                  <BookMarked className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">
                    {b.title}
                    {b.year ? ` (${b.year})` : ""}
                  </div>
                  <div className="text-xs font-semibold text-body">
                    {b.author}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-body">
                    {b.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      <aside className="mt-8 rounded-2xl bg-navy-950 p-6 text-white">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/70">
          <ListChecks className="h-4 w-4" />
          Onthoud dit
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          {lesson.keyTakeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-goud-400" />
              {t}
            </li>
          ))}
        </ul>
      </aside>

      <div className="mt-10">
        <LessonRunner
          courseSlug={course.slug}
          courseTitle={course.title}
          courseTotalLessons={courseLessonCount(course)}
          lessonSlug={lesson.slug}
          lessonXp={lesson.xp}
          quiz={lesson.quiz}
          accent={course.accent}
          nextHref={
            ctx.next
              ? `/cursussen/${course.slug}/les/${ctx.next.lesson.slug}`
              : null
          }
          nextTitle={ctx.next ? ctx.next.lesson.title : null}
          courseHref={`/cursussen/${course.slug}`}
          certHref={`/cursussen/${course.slug}/certificaat`}
        />
      </div>

      <nav className="mt-8 flex items-center justify-between text-sm font-semibold">
        {ctx.prev ? (
          <Link
            href={`/cursussen/${course.slug}/les/${ctx.prev.lesson.slug}`}
            className="flex items-center gap-1.5 text-body hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> {ctx.prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {ctx.next && (
          <Link
            href={`/cursussen/${course.slug}/les/${ctx.next.lesson.slug}`}
            className="flex items-center gap-1.5 text-body hover:text-brand-700"
          >
            {ctx.next.lesson.title}{" "}
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        )}
      </nav>
    </article>
  );
}
