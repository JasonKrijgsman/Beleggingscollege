"use client";

import { useState } from "react";
import { Check, CircleHelp, X } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import type { CourseAccent } from "@/content/types";
import { ACCENTS } from "@/lib/accent";

type Props = {
  quiz: QuizQuestion[];
  accent: CourseAccent;
  onFinished: (correct: number) => void;
};

export default function QuizBlock({ quiz, accent, onFinished }: Props) {
  const acc = ACCENTS[accent];
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = quiz[qIndex];
  const isLast = qIndex === quiz.length - 1;
  const wasCorrect = checked && selected === q.correctIndex;

  function check() {
    if (selected === null) return;
    setChecked(true);
    if (selected === q.correctIndex) setCorrectCount((c) => c + 1);
  }

  function nextQuestion() {
    if (isLast) {
      onFinished(correctCount);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }

  return (
    <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <CircleHelp className={`h-5 w-5 ${acc.text}`} />
          Test je kennis
        </div>
        <div className="flex items-center gap-1.5">
          {quiz.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i < qIndex
                  ? "bg-groen-500"
                  : i === qIndex
                    ? acc.bar
                    : "bg-lijn"
              }`}
            />
          ))}
          <span className="ml-2 text-xs font-semibold text-body">
            {qIndex + 1}/{quiz.length}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold leading-snug text-ink">{q.question}</h3>

      <div className="mt-4 space-y-2.5">
        {q.options.map((opt, i) => {
          let style =
            "border-lijn bg-white hover:border-brand-300 hover:bg-brand-50/50";
          if (checked) {
            if (i === q.correctIndex) {
              style = "border-groen-500 bg-groen-50";
            } else if (i === selected) {
              style = "border-red-400 bg-red-50";
            } else {
              style = "border-lijn bg-white opacity-60";
            }
          } else if (i === selected) {
            style = "border-brand-500 bg-brand-50 ring-2 ring-brand-200";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={checked}
              onClick={() => setSelected(i)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold text-ink transition-all ${style}`}
            >
              <span>{opt}</span>
              {checked && i === q.correctIndex && (
                <Check className="h-5 w-5 shrink-0 text-groen-600" />
              )}
              {checked && i === selected && i !== q.correctIndex && (
                <X className="h-5 w-5 shrink-0 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {checked && (
        <div
          className={`anim-fade-up mt-4 rounded-xl p-4 text-sm leading-relaxed ${
            wasCorrect
              ? "bg-groen-50 text-groen-800"
              : "bg-goud-100/60 text-ink"
          }`}
        >
          <span className="font-bold">
            {wasCorrect ? "Goed! " : "Helaas. "}
          </span>
          {q.explanation}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        {!checked ? (
          <button
            type="button"
            onClick={check}
            disabled={selected === null}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              selected === null
                ? "cursor-not-allowed bg-mist text-body"
                : `${acc.solid} shadow-sm`
            }`}
          >
            Controleer
          </button>
        ) : (
          <button
            type="button"
            onClick={nextQuestion}
            className={`rounded-full px-6 py-2.5 text-sm font-bold shadow-sm ${acc.solid}`}
          >
            {isLast ? "Bekijk resultaat" : "Volgende vraag"}
          </button>
        )}
      </div>
    </div>
  );
}
