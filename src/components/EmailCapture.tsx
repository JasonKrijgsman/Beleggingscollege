"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

/**
 * Aanmeldvak voor de nieuwsbrief, bedoeld voor het moment van afronding —
 * als iemand net iets bereikt heeft en de goodwill piekt. Nooit als popup
 * bij binnenkomst; dat is precies de opdringerigheid waar dit merk zich
 * tegen afzet.
 *
 * De belofte is smal en waar: bericht bij een nieuwe cursus of een nieuw
 * artikel, geen ander gebruik, altijd uitschrijfbaar. Beloof hier nooit
 * meer dan dat.
 */
export default function EmailCapture({ bron }: { bron: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "bezig" | "klaar" | "fout">(
    "idle"
  );
  const [fout, setFout] = useState("");

  async function meldAan(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "bezig") return;
    setStatus("bezig");
    setFout("");
    try {
      const res = await fetch("/api/nieuwsbrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), bron }),
      });
      if (res.ok) {
        setStatus("klaar");
        return;
      }
      // De route schrijft zelf een nette reden (te snel achter elkaar, geen
      // geldig adres). Die tonen we; anders staat iemand die de ratelimiet
      // raakt zijn e-mailadres na te lopen terwijl daar niets mis mee is.
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setFout(
        data?.error ?? "Dat lukte niet — controleer het adres en probeer het nog eens."
      );
      setStatus("fout");
    } catch {
      setFout("Dat lukte niet — controleer je verbinding en probeer het nog eens.");
      setStatus("fout");
    }
  }

  if (status === "klaar") {
    return (
      <div
        className="rounded-2xl border border-groen-600/30 bg-groen-50 p-5 text-left"
        aria-live="polite"
      >
        <p className="flex items-start gap-2 text-sm font-semibold text-groen-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Aangemeld. Je hoort van ons zodra er een nieuwe cursus of een nieuw
          artikel is — en verder niet.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={meldAan}
      className="rounded-2xl border border-lijn bg-white p-5 text-left shadow-card"
    >
      <p className="flex items-center gap-2 text-sm font-bold text-ink">
        <Mail className="h-4 w-4 text-brand-600" aria-hidden="true" />
        Weten wanneer er een nieuwe cursus is?
      </p>
      <p className="mt-1 text-sm leading-relaxed text-body">
        Laat je e-mailadres achter en je krijgt bericht bij een nieuwe cursus
        of een nieuw artikel. Meer sturen we niet, en uitschrijven kan altijd.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`email-${bron}`}>
          Je e-mailadres
        </label>
        <input
          id={`email-${bron}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jij@voorbeeld.nl"
          className="w-full rounded-full border border-lijn bg-white px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={status === "bezig"}
          className="shrink-0 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-mist disabled:text-body"
        >
          {status === "bezig" ? "Bezig…" : "Houd me op de hoogte"}
        </button>
      </div>
      {status === "fout" && (
        <p className="mt-2 text-xs font-semibold text-body" aria-live="polite">
          {fout}
        </p>
      )}
      <p className="mt-2 text-xs text-body">
        Zie ook onze{" "}
        <a href="/privacy" className="underline hover:text-brand-700">
          privacyverklaring
        </a>
        .
      </p>
    </form>
  );
}
