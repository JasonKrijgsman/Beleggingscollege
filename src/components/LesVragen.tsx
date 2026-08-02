"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, MessageCircleQuestion } from "lucide-react";
import type { CourseAccent } from "@/content/types";
import { ACCENTS } from "@/lib/accent";

/**
 * "Vragen & antwoorden bij deze les" — redactioneel, geen helpdesk.
 *
 * Bewust géén "stel een vraag, Jason antwoordt binnenkort": dat wordt een
 * tweede baan en oogt als een klein, overvraagd eenmansbedrijf. In plaats
 * daarvan verzamelen we vragen stil, Jason kiest zélf welke een goed antwoord
 * verdienen, en beantwoorde vragen worden hier openbaar als een groeiende
 * mini-FAQ. Off-topic of persoonlijke-adviesvragen verschijnen nooit — die
 * wijst de moderatie af. Er is dus geen beloofde antwoordtermijn en geen
 * zichtbare wachtrij: wie iets instuurt, levert een suggestie, geen ticket.
 */

type Vraag = {
  id: string;
  naam: string;
  vraag: string;
  antwoord: string | null;
};

export default function LesVragen({
  courseSlug,
  lessonSlug,
  accent,
  ingelogd,
  zichtbaar,
}: {
  courseSlug: string;
  lessonSlug: string;
  accent: CourseAccent;
  ingelogd: boolean;
  zichtbaar: Vraag[];
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
        Vragen &amp; antwoorden bij deze les
      </div>

      {zichtbaar.length > 0 ? (
        <ul className="mt-4 space-y-5">
          {zichtbaar.map((v) => (
            <li key={v.id}>
              <p className="text-sm font-bold text-ink">{v.vraag}</p>
              {v.antwoord && (
                <div className={`mt-2 rounded-xl border-l-4 bg-mist/60 p-4 ${acc.border}`}>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
                    {v.antwoord}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-body">— Jason</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-body">
          Hier verzamel ik de vragen die deze les scherper maken, met antwoord.
          Zit je ergens mee? Laat het hieronder weten.
        </p>
      )}

      {/* Insturen: alleen ingelogd. Geen antwoordbelofte, geen wachtrij. */}
      {!ingelogd ? (
        <p className="mt-5 text-sm text-body">
          <Link
            href={`/inloggen?terug=/cursussen/${courseSlug}/les/${lessonSlug}`}
            className={`font-semibold underline ${acc.text}`}
          >
            Log in
          </Link>{" "}
          om zelf een vraag over deze les achter te laten.
        </p>
      ) : status === "klaar" ? (
        <p
          className="mt-5 flex items-start gap-2 rounded-xl bg-groen-50 px-4 py-3 text-sm font-semibold text-groen-800"
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Genoteerd, bedankt. Ik lees mee — de vragen die de les beter maken
          beantwoord ik hier, voor iedereen.
        </p>
      ) : (
        <form onSubmit={verstuur} className="mt-5">
          <label htmlFor={`vraag-${lessonSlug}`} className="text-sm font-bold text-ink">
            Iets onduidelijk? Stel je vraag over deze les
          </label>
          <p className="mt-1 text-xs leading-relaxed text-body">
            Niet elke vraag krijgt een persoonlijk antwoord, maar de beste komen
            hier bij de les te staan. Houd het bij déze les — en let op:
            persoonlijke beleggingsvragen (&ldquo;wat moet ik met mijn
            geld?&rdquo;) kunnen we niet beantwoorden. Wij zijn opleider, geen
            adviseur.
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
              {status === "bezig" ? "Bezig…" : "Stuur in"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
