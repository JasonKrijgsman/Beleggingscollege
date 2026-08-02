"use client";

import Link from "next/link";
import { BookOpen, Clock, Lock, Zap } from "lucide-react";
import type { Course } from "@/content/types";
import {
  courseDurationMin,
  courseLessonCount,
  courseXpTotal,
} from "@/content";
import { ACCENTS } from "@/lib/accent";
import { useProgress } from "@/lib/progress";
import CourseIcon from "./CourseIcon";

export default function CourseCard({ course }: { course: Course }) {
  const acc = ACCENTS[course.accent];
  const { courseProgress, ready } = useProgress();
  const total = courseLessonCount(course);
  const progress = ready ? courseProgress(course.slug, total) : 0;
  const pct = Math.round(progress * 100);

  const body = (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card transition-all ${
        course.comingSoon
          ? "border-lijn opacity-90"
          : "border-lijn hover:-translate-y-1 hover:shadow-pop"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl p-3 ${acc.iconBox}`}>
          <CourseIcon icon={course.icon} className="h-7 w-7" />
        </div>
        {course.comingSoon ? (
          <span className="flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-bold text-body">
            <Lock className="h-3 w-3" /> Binnenkort
          </span>
        ) : course.free ? (
          <span className="rounded-full bg-groen-50 px-3 py-1 text-xs font-bold text-groen-700">
            Gratis
          </span>
        ) : (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${acc.soft}`}>
            {course.price}
          </span>
        )}
      </div>

      <span className={`text-xs font-bold uppercase tracking-wider ${acc.text}`}>
        {course.level}
      </span>
      <h3 className="mt-1 text-lg font-bold leading-snug text-ink">
        {course.title}
      </h3>
      <p className="mt-0.5 text-sm font-semibold text-body">{course.subtitle}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-body">
        {course.description}
      </p>

      {!course.comingSoon && (
        <>
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-body">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> {total} lessen
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> ±{courseDurationMin(course)} min
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-goud-500" />{" "}
              {courseXpTotal(course)} XP
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-body">
              <span>{pct > 0 ? `${pct}% afgerond` : "Nog niet gestart"}</span>
              {pct === 100 && <span className="text-groen-700">Certificaat ✓</span>}
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
              <div
                className={`h-full rounded-full transition-all duration-700 ${acc.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (course.comingSoon) return body;
  return (
    <Link href={`/cursussen/${course.slug}`} className="block h-full">
      {body}
    </Link>
  );
}
