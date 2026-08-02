"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, MessageCircleQuestion } from "lucide-react";
import type { CourseAccent } from "@/content/types";
import { ACCENTS } from "@/lib/accent";

/**
 * "Vragen bij deze les" — de gekozen communityvorm (docs/ideeen.md).
 *
 * Alleen goedgekeurde én beantwoorde vragen zijn openbaar; eigen wachtende
 * vragen ziet alleen de vraagsteller. De AFM-verwachting staat vóór het
 * formulier, niet erachter: wie een persoonlijke beleggingsvraag wil stellen
 * hoort vooraf te weten dat die niet beantwoord kan worden.
 */

type Vraag = {
  id: string;
  naam: string;
  vraag: string;
  antwoord: string | null;
  datum: string; // al op de server als nl-NL tekst gezet
};

export default function LesVragen({
  courseSlug,
  lessonSlug,
  accent,
  zichtbaar,
  eigenWachtend,
}: {
  courseSlug: string;
  lessonSlug: string;
  accent: CourseAccent;
  zichtbaar: Vraag[];
  eigenWachtend: Vraag[];
}) {
  const acc = ACCENTS[accent];
  const [vraag, setVraag] = useState("");
  const [status, setStatus] = useState<"idle" | "bezig" | "klaar" | "fout">("idle");
  const [fout, setFout] = useState("");

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (status === "bezig") return;
    setStatus("bezig");
    setFout("");
    try {
      const res = await fetch("/api/lesvragen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, vraag }),
      });
      if (res.ok) {
        setStatus("klaar");
        setVraag("");
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setFout(data?.error ?? "Dat lukte niet — probeer het zo nog eens.");
        setStatus("fout");
      }
    } catch {
      setFout("Dat lukte niet — probeer het zo nog eens.");
      setStatus("fout");
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-lijn bg-white p-6 shadow-card">
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-body">
        <MessageCircleQuestion className={`h-4 w-4 ${acc.text}`} aria-hidden="true" />
        Vragen bij deze les
      </div>

      {zichtbaar.length > 0 ? (
        <ul className="mt-4 space-y-5">
          {zichtbaar.map((v) => (
            <li key={v.id}>
              <p className="text-sm font-bold text-ink">
                {v.naam || "Een cursist"}{" "}
                <span className="font-semibold text-body">vroeg:</span>{" "}
                {v.vraag}
              </p>
              {v.antwoord && (
                <div className={`mt-2 rounded-xl border-l-4 bg-mist/60 p-4 ${acc.border}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-body">
                    Jason antwoordt
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink">
                    {v.antwoord}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-body">
          Nog geen beantwoorde vragen bij deze les. Stel de eerste — daar is
          dit vak voor.
        </p>
      )}

      {eigenWachtend.length > 0 && (
        <div className="mt-5 space-y-2" aria-live="polite">
          {eigenWachtend.map((v) => (
            <p
              key={v.id}
              className="flex items-start gap-2 rounded-xl bg-goud-100/50 px-4 py-3 text-sm text-ink"
            >
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-goud-600" aria-hidden="true" />
              <span>
                <strong>Je vraag staat in de wachtrij:</strong> “{v.vraag}”
              </span>
            </p>
          ))}
        </div>
      )}

      {status === "klaar" ? (
        <p
          className="mt-5 flex items-start gap-2 rounded-xl bg-groen-50 px-4 py-3 text-sm font-semibold text-groen-800"
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Bedankt! Je vraag staat in de wachtrij. Jason leest en beantwoordt
          wekelijks; zodra je vraag beantwoord is, verschijnt hij hier.
        </p>
      ) : (
        <form onSubmit={verstuur} className="mt-5">
          <label htmlFor={`vraag-${lessonSlug}`} className="text-sm font-bold text-ink">
            Stel je vraag over deze les
          </label>
          <p className="mt-1 text-xs leading-relaxed text-body">
            Vragen over de lesstof beantwoordt Jason wekelijks, en de beste
            komen hier voor iedereen te staan. Persoonlijke beleggingsvragen
            (&ldquo;wat moet ik met mijn geld?&rdquo;) kunnen we niet
            beantwoorden — wij zijn opleider, geen adviseur.
          </p>
          <textarea
            id={`vraag-${lessonSlug}`}
            value={vraag}
            onChange={(e) => setVraag(e.target.value)}
            required
            minLength={10}
            maxLength={1000}
            rows={3}
            placeholder="Bijvoorbeeld: waarom telt de terminale K/W zo zwaar mee in de uitkomst?"
            className="mt-2 w-full rounded-xl border border-lijn bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-body" aria-live="polite">
              {fout}
            </p>
            <button
              type="submit"
              disabled={status === "bezig"}
              className="shrink-0 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-mist disabled:text-body"
            >
              {status === "bezig" ? "Bezig…" : "Verstuur vraag"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
