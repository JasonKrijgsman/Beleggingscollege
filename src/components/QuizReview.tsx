"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import type { CourseAccent, QuizQuestion } from "@/content/types";
import { ACCENTS } from "@/lib/accent";

/**
 * Terugkijken van je quizantwoorden nadat de les is afgerond. De vragen
 * komen als props binnen — dat mag, want dit staat uitsluitend op de
 * lespagina die al achter de toegangscontrole zit.
 *
 * De gekozen antwoorden staan lokaal (beste poging). Wie de les afrondde
 * vóór deze functie bestond heeft ze niet; dan tonen we dat eerlijk in
 * plaats van iets te verzinnen.
 */
export default function QuizReview({
  quiz,
  antwoorden,
  accent,
}: {
  quiz: QuizQuestion[];
  antwoorden?: number[];
  accent: CourseAccent;
}) {
  const acc = ACCENTS[accent];
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 rounded-2xl border border-lijn bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left text-sm font-bold text-ink hover:bg-mist/60"
      >
        Bekijk je antwoorden
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-lijn px-6 py-5">
          {!antwoorden || antwoorden.length === 0 ? (
            <p className="text-sm leading-relaxed text-body">
              Van deze les hebben we geen antwoorden bewaard — je rondde hem af
              voordat deze functie bestond, of op een ander apparaat. Maak de
              quiz opnieuw (zonder extra XP) en je antwoorden verschijnen hier.
            </p>
          ) : (
            <ol className="space-y-5">
              {quiz.map((q, i) => {
                const gekozen = antwoorden[i];
                const goed = gekozen === q.correctIndex;
                return (
                  <li key={i}>
                    <div className="flex items-start gap-2">
                      {goed ? (
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-groen-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                          aria-hidden="true"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">
                          {i + 1}. {q.question}
                        </p>
                        <p className="mt-1 text-sm text-body">
                          Jouw antwoord:{" "}
                          <span className={goed ? "font-semibold text-groen-700" : "font-semibold"}>
                            {q.options[gekozen] ?? "—"}
                          </span>
                          {goed ? (
                            <span className="text-groen-700"> (goed)</span>
                          ) : (
                            <>
                              {" "}
                              — juiste antwoord:{" "}
                              <span className={`font-semibold ${acc.text}`}>
                                {q.options[q.correctIndex]}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-body">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
