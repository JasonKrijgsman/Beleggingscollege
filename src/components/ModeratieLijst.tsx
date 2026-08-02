"use client";

import { useState } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";

/**
 * De moderatiewachtrij. Per vraag: beantwoorden (maakt hem openbaar) of
 * afwijzen (stil verwijderen). De knop "Standaardantwoord" plakt de vaste
 * AFM-afwijzing in het antwoordveld — daarna nog aan te passen, en
 * beantwoorden met dat antwoord maakt de weigering zélf tot onderwijs.
 */

type WachtendeVraag = {
  id: string;
  naam: string;
  vraag: string;
  gesteldOp: string;
  lesTitel: string;
  cursusTitel: string;
  lesUrl: string;
};

export default function ModeratieLijst({
  vragen,
  standaardAntwoord,
}: {
  vragen: WachtendeVraag[];
  standaardAntwoord: string;
}) {
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});
  const [bezig, setBezig] = useState<string | null>(null);
  const [afgehandeld, setAfgehandeld] = useState<Record<string, string>>({});
  const [fout, setFout] = useState<Record<string, string>>({});

  async function stuur(id: string, actie: "beantwoord" | "afgewezen") {
    if (bezig) return;
    setBezig(id);
    setFout((f) => ({ ...f, [id]: "" }));
    try {
      const res = await fetch("/api/lesvragen/moderatie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, actie, antwoord: antwoorden[id] ?? "" }),
      });
      if (res.ok) {
        setAfgehandeld((a) => ({
          ...a,
          [id]: actie === "beantwoord" ? "Beantwoord en openbaar." : "Afgewezen.",
        }));
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setFout((f) => ({ ...f, [id]: data?.error ?? "Dat lukte niet." }));
      }
    } catch {
      setFout((f) => ({ ...f, [id]: "Netwerkfout — probeer opnieuw." }));
    } finally {
      setBezig(null);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {vragen.map((v) =>
        afgehandeld[v.id] ? (
          <p
            key={v.id}
            className="rounded-2xl border border-lijn bg-mist/60 px-5 py-4 text-sm font-semibold text-body"
            aria-live="polite"
          >
            {afgehandeld[v.id]}
          </p>
        ) : (
          <div key={v.id} className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs font-semibold text-body">
              <span>
                {v.naam || "Anoniem"} · {v.gesteldOp}
              </span>
              <a
                href={v.lesUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-brand-700"
              >
                {v.cursusTitel} — {v.lesTitel}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink">{v.vraag}</p>

            <label htmlFor={`antwoord-${v.id}`} className="sr-only">
              Antwoord
            </label>
            <textarea
              id={`antwoord-${v.id}`}
              value={antwoorden[v.id] ?? ""}
              onChange={(e) =>
                setAntwoorden((a) => ({ ...a, [v.id]: e.target.value }))
              }
              rows={4}
              maxLength={4000}
              placeholder="Je antwoord — verschijnt openbaar bij de les."
              className="mt-3 w-full rounded-xl border border-lijn bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => stuur(v.id, "beantwoord")}
                disabled={bezig === v.id || !(antwoorden[v.id] ?? "").trim()}
                className="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-mist disabled:text-body"
              >
                {bezig === v.id ? "Bezig…" : "Beantwoord & publiceer"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setAntwoorden((a) => ({ ...a, [v.id]: standaardAntwoord }))
                }
                className="flex items-center gap-1.5 rounded-full border border-lijn px-4 py-2 text-sm font-bold text-ink hover:bg-mist"
              >
                <ShieldAlert className="h-4 w-4 text-goud-600" aria-hidden="true" />
                Standaardantwoord (persoonlijk advies)
              </button>
              <button
                type="button"
                onClick={() => stuur(v.id, "afgewezen")}
                disabled={bezig === v.id}
                className="rounded-full border border-lijn px-4 py-2 text-sm font-bold text-body hover:bg-mist"
              >
                Wijs af
              </button>
              <span className="text-xs font-semibold text-red-600" aria-live="polite">
                {fout[v.id]}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
