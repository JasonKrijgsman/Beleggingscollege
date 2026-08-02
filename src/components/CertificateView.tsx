"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { LogoMark } from "./Logo";
import { useProgress } from "@/lib/progress";

type Props = {
  courseSlug: string;
  courseTitle: string;
  courseSubtitle: string;
  totalLessons: number;
  totalXp: number;
};

export default function CertificateView(props: Props) {
  const { state, ready, courseProgress, setName } = useProgress();
  const [draft, setDraft] = useState("");
  const complete =
    ready && courseProgress(props.courseSlug, props.totalLessons) >= 1;

  if (!ready) return <div className="py-32" />;

  if (!complete) {
    const pct = Math.round(
      courseProgress(props.courseSlug, props.totalLessons) * 100
    );
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold text-ink">
          Nog even doorleren 📚
        </h1>
        <p className="mt-3 leading-relaxed text-body">
          Je certificaat voor <strong>{props.courseTitle}</strong> wordt
          uitgereikt zodra je alle {props.totalLessons} lessen hebt afgerond. Je
          staat nu op {pct}%.
        </p>
        <Link
          href={`/cursussen/${props.courseSlug}`}
          className="mt-7 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Naar de cursus
        </Link>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href={`/cursussen/${props.courseSlug}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-body hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Terug naar de cursus
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-navy-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
        >
          <Printer className="h-4 w-4" /> Afdrukken of opslaan als PDF
        </button>
      </div>

      {!state.name && (
        <form
          className="no-print mb-6 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) setName(draft);
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Je naam voor op het certificaat"
            className="w-full rounded-full border border-lijn bg-white px-4 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            Zet op certificaat
          </button>
        </form>
      )}

      <div className="print-page rounded-md border-[3px] border-navy-600 bg-white p-2 shadow-pop">
        <div className="border border-goud-500 px-8 py-14 text-center sm:px-16">
          <div className="flex justify-center">
            <LogoMark className="h-14 w-14" />
          </div>
          <div className="mt-5 text-xs font-bold uppercase tracking-[0.35em] text-navy-600">
            Beleggingscollege
          </div>
          <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-wide text-ink sm:text-4xl">
            Certificaat van afronding
          </h1>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-body">
            Hierbij wordt verklaard dat
          </p>
          <div
            className="mt-3 text-4xl italic text-navy-600"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {state.name || "Naam invullen hierboven"}
          </div>
          <div className="mx-auto mt-3 h-px w-64 bg-lijn" />
          <p className="mt-6 text-sm leading-relaxed text-body">
            met succes de volledige cursus
          </p>
          <div className="mt-2 text-2xl font-extrabold text-ink">
            {props.courseTitle}
          </div>
          <div className="text-sm font-semibold text-body">
            {props.courseSubtitle}
          </div>
          <p className="mt-4 text-sm text-body">
            heeft doorlopen — {props.totalLessons} lessen met bijbehorende
            quizzen, {props.totalXp.toLocaleString("nl-NL")}+ XP verdiend.
          </p>
          <div className="mt-12 flex items-end justify-between text-left">
            <div>
              <div className="text-sm font-bold text-ink">{today}</div>
              <div className="mt-1 h-px w-40 bg-lijn" />
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-body">
                Datum
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-xl italic text-navy-600"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Beleggingscollege
              </div>
              <div className="mt-1 h-px w-40 bg-lijn" />
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-body">
                beleggingscollege.nl
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
