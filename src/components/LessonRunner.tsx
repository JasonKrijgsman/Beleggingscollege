"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  GraduationCap,
  PartyPopper,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { CourseAccent, QuizQuestion } from "@/content/types";
import { ACCENTS } from "@/lib/accent";
import {
  useProgress,
  type CompletionResult,
} from "@/lib/progress";
import QuizBlock from "./QuizBlock";
import Confetti from "./Confetti";

type Props = {
  courseSlug: string;
  courseTitle: string;
  courseTotalLessons: number;
  lessonSlug: string;
  lessonXp: number;
  quiz: QuizQuestion[];
  accent: CourseAccent;
  nextHref: string | null;
  nextTitle: string | null;
  courseHref: string;
  certHref: string;
};

function XpCounter({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target <= 0) return;
    const steps = 30;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setValue(Math.round((step / steps) * target));
      if (step >= steps) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [target]);
  return <span>{value}</span>;
}

export default function LessonRunner(props: Props) {
  const acc = ACCENTS[props.accent];
  const { completeLesson, isLessonCompleted, courseProgress, ready } =
    useProgress();
  const [result, setResult] = useState<CompletionResult | null>(null);
  const [score, setScore] = useState(0);

  const alreadyDone = ready && isLessonCompleted(props.courseSlug, props.lessonSlug);
  const courseDone =
    result !== null &&
    courseProgress(props.courseSlug, props.courseTotalLessons) >= 1;

  function handleFinished(correct: number) {
    const r = completeLesson(
      props.courseSlug,
      props.lessonSlug,
      { correct, total: props.quiz.length },
      props.lessonXp
    );
    setScore(correct);
    setResult(r);
  }

  return (
    <div>
      {alreadyDone && !result && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-groen-50 px-4 py-3 text-sm font-semibold text-groen-800">
          <BadgeCheck className="h-5 w-5" />
          Je hebt deze les al afgerond. Je kunt de quiz opnieuw maken (zonder
          extra XP).
        </div>
      )}

      {!result && (
        <QuizBlock
          quiz={props.quiz}
          accent={props.accent}
          onFinished={handleFinished}
        />
      )}

      {result && (
        <>
          {result.xpGained > 0 && <Confetti />}
          <div className="anim-pop-in rounded-3xl border border-lijn bg-white p-8 text-center shadow-pop">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white ${acc.solid.split(" ")[0]}`}
            >
              {courseDone ? (
                <GraduationCap className="h-8 w-8" />
              ) : (
                <PartyPopper className="h-8 w-8" />
              )}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-ink">
              {courseDone ? "Cursus afgerond!" : "Les afgerond!"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-body">
              Quizscore: {score} van {props.quiz.length} goed
            </p>

            {result.xpGained > 0 ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-goud-100 px-5 py-2.5 text-lg font-extrabold text-goud-600">
                <Zap className="h-5 w-5" fill="currentColor" />+
                <XpCounter target={result.xpGained} /> XP
              </div>
            ) : (
              <p className="mt-5 text-sm text-body">
                Al eerder afgerond — geen extra XP, wel respect.
              </p>
            )}

            {result.leveledUp && (
              <div className="anim-fade-up mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
                <TrendingUp className="h-5 w-5" />
                Level omhoog! Je bent nu <strong>{result.levelName}</strong>
              </div>
            )}

            {result.newBadges.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-body">
                  Nieuwe badge{result.newBadges.length > 1 ? "s" : ""}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {result.newBadges.map((b) => (
                    <span
                      key={b.id}
                      className="anim-pop-in flex items-center gap-1.5 rounded-full border border-goud-300 bg-goud-100/70 px-3.5 py-1.5 text-sm font-bold text-ink"
                      title={b.description}
                    >
                      <b.icon className="h-4 w-4 text-goud-600" />
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {courseDone && (
                <Link
                  href={props.certHref}
                  className="flex items-center gap-2 rounded-full bg-goud-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-goud-600"
                >
                  <Award className="h-4 w-4" /> Bekijk je certificaat
                </Link>
              )}
              {props.nextHref && !courseDone && (
                <Link
                  href={props.nextHref}
                  className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-sm ${acc.solid}`}
                >
                  Volgende les: {props.nextTitle}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href={props.courseHref}
                className="rounded-full border border-lijn bg-white px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-mist"
              >
                Terug naar {props.courseTitle}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
