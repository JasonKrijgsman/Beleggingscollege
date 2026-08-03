"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Brain, CheckCircle2, RotateCcw } from "lucide-react";
import {
  VRAGEN,
  berekenUitslag,
  parseUitslag,
  type BiasKey,
  type OpgeslagenUitslag,
} from "@/lib/biastest";

// Hoort bij de les "Ken je eigen neigingen" (Beleggingspsychologie, accent
// paars). Vijftien situatievragen — bewust géén zelfbeoordeling, want mensen
// schatten zichzelf goed in en handelen anders. Uitkomst: je drie sterkste
// neigingen van vandáág, elk met één concrete tegenmaatregel.
//
// Twee grenzen uit docs/productonderzoek.md, hier hard gemaakt:
// - Geen persoonlijkheidslabel ("jij bent de Voorzichtige Bouwer") — de
//   uitkomst is een momentopname van neigingen, geen etiket.
// - Geen risicoprofiel en geen portefeuilleverdeling — dat zou een
//   persoonlijke aanbeveling zijn, en dus beleggingsadvies.
//
// De uitslag wordt lokaal bewaard (alleen in jouw browser) zodat je de test
// na drie maanden opnieuw kunt doen en de verschuiving ziet. De vragen en
// het rekenwerk staan in src/lib/biastest.ts (getest in
// test/biastest.test.ts); hier staat alleen de weergave plus de uitleg en
// tegenmaatregel per neiging.

const OPSLAG_SLEUTEL = "beleggingscollege-biastest-v1";
const HERMETING_NA_DAGEN = 80;

const BIASSEN: Record<
  BiasKey,
  { naam: string; soort: "emotioneel" | "cognitief"; uitleg: string; tegenmaatregel: string }
> = {
  verliesaversie: {
    naam: "Verliesaversie",
    soort: "emotioneel",
    uitleg:
      "Verlies weegt bij jou extra zwaar: je houdt verliezers vast om maar niet te hoeven 'afrekenen', of je durft juist niet te beginnen.",
    tegenmaatregel:
      "Beoordeel elke positie met de vraag: \"zou ik dit aandeel vandaag opnieuw kopen?\" Zo niet, dan is je koopprijs geen reden om te blijven.",
  },
  overmoed: {
    naam: "Overmoed",
    soort: "emotioneel",
    uitleg:
      "Je schrijft succes snel toe aan eigen inzicht en trekt conclusies uit een korte reeks. Dat voelt goed en kost rendement — vooral via te veel handelen.",
    tegenmaatregel:
      "Houd een beleggingsdagboek: schrijf bij elke koop je verwachting en reden op, en leg het resultaat na een jaar naast een simpele indexbelegging.",
  },
  kuddegedrag: {
    naam: "Kuddegedrag",
    soort: "emotioneel",
    uitleg:
      "Wat iedereen doet, voelt veilig — kopen in euforie en verkopen in paniek zijn allebei kuddegedrag. FOMO is de moderne naam.",
    tegenmaatregel:
      "Voer een wachtregel in: nooit kopen of verkopen in dezelfde week waarin het idee ontstond. De kudde is dan meestal al verder gerend.",
  },
  ankereffect: {
    naam: "Ankereffect",
    soort: "cognitief",
    uitleg:
      "Oude getallen — je koopprijs, een oude topkoers — sturen je oordeel, terwijl de markt ze niet kent en er niets om geeft.",
    tegenmaatregel:
      "Dek bij het beoordelen van je portefeuille de kolom met koopprijzen af en vraag per positie alleen: wat is dit vandáág waard, en waarom?",
  },
  bevestiging: {
    naam: "Bevestigingsvooroordeel",
    soort: "cognitief",
    uitleg:
      "Na een beslissing zoek je vooral informatie die je gelijk bevestigt — 'onderzoek doen' wordt dan ongemerkt 'bevestiging zoeken'.",
    tegenmaatregel:
      "Zoek vóór elke koop actief het beste tégenargument en schrijf het in één zin op. Kun je het niet vinden, dan heb je nog niet echt gezocht.",
  },
  recency: {
    naam: "Recentheidseffect",
    soort: "cognitief",
    uitleg:
      "De laatste maanden voelen als het nieuwe normaal: na stijgingen verwacht je stijging, na dalingen daling. De lange geschiedenis verdwijnt uit beeld.",
    tegenmaatregel:
      "Toets elke verwachting aan minstens twintig jaar historie, en beoordeel je portefeuille per kwartaal in plaats van per dag.",
  },
};

function leesVorige(): OpgeslagenUitslag | null {
  try {
    return parseUitslag(localStorage.getItem(OPSLAG_SLEUTEL));
  } catch {
    // Opslag kan uit staan; dan is er gewoon geen vorige meting.
    return null;
  }
}

export default function BiasTestTool() {
  const [antwoorden, setAntwoorden] = useState<number[]>([]);
  const [vorige, setVorige] = useState<OpgeslagenUitslag | null>(null);
  const [klaarMetOpslaan, setKlaarMetOpslaan] = useState(false);

  useEffect(() => {
    setVorige(leesVorige());
  }, []);

  const vraagIndex = antwoorden.length;
  const klaar = vraagIndex >= VRAGEN.length;

  const uitslag = useMemo(
    () => (klaar ? berekenUitslag(antwoorden) : null),
    [klaar, antwoorden]
  );

  // Uitslag één keer opslaan zodra de test af is (de vórige blijft in beeld
  // voor de vergelijking; pas daarna overschrijven we hem).
  useEffect(() => {
    if (!uitslag || klaarMetOpslaan) return;
    try {
      localStorage.setItem(
        OPSLAG_SLEUTEL,
        JSON.stringify({
          datum: new Date().toISOString().slice(0, 10),
          percentages: uitslag.percentages,
        } satisfies OpgeslagenUitslag)
      );
    } catch {
      // Opslag kan uit staan; de test werkt dan gewoon zonder hermeting.
    }
    setKlaarMetOpslaan(true);
  }, [uitslag, klaarMetOpslaan]);

  const dagenSindsVorige = vorige
    ? Math.floor((Date.now() - new Date(vorige.datum).getTime()) / 86_400_000)
    : null;

  const opnieuw = () => {
    setVorige(leesVorige());
    setAntwoorden([]);
    setKlaarMetOpslaan(false);
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-paars-200 bg-paars-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-paars-700">
        <Brain className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">De biastest</h3>
      <p className="mt-1 text-sm text-body">
        Vijftien situaties, geen goede of foute antwoorden voor een cijfer —
        kies wat je écht zou doen, niet wat je hoort te doen. Je krijgt je drie
        sterkste neigingen van vandaag terug, elk met één concrete
        tegenmaatregel. Geen etiket: over drie maanden kan de uitkomst anders
        zijn, en dat is precies waarom je hem dan opnieuw doet.
      </p>

      {vorige && !klaar && dagenSindsVorige !== null && (
        <div className="mt-3 rounded-xl border border-paars-200 bg-white px-4 py-3 text-sm text-body">
          Je deed deze test eerder, op {vorige.datum} ({dagenSindsVorige} dagen
          geleden).{" "}
          {dagenSindsVorige >= HERMETING_NA_DAGEN
            ? "Tijd voor je hermeting — na afloop zie je wat er verschoven is."
            : `De hermeting is zinvol vanaf zo'n drie maanden; eerder mag natuurlijk ook.`}
        </div>
      )}

      {!klaar ? (
        <div className="mt-4 rounded-xl border border-paars-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold text-body">
            <span className="uppercase tracking-wide text-paars-700">
              Situatie {vraagIndex + 1} van {VRAGEN.length}
            </span>
            <span>{Math.round((vraagIndex / VRAGEN.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-paars-600 transition-all"
              style={{ width: `${(vraagIndex / VRAGEN.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm font-semibold leading-relaxed text-ink">
            {VRAGEN[vraagIndex].situatie}
          </p>
          <div className="mt-3 space-y-2">
            {VRAGEN[vraagIndex].opties.map((optie, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAntwoorden((a) => [...a, i])}
                className="flex w-full items-start gap-2.5 rounded-lg border border-lijn bg-white px-4 py-3 text-left text-sm leading-relaxed text-body transition hover:border-paars-400 hover:bg-paars-50 focus:outline-none focus:ring-2 focus:ring-paars-300"
              >
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-paars-400" />
                {optie.tekst}
              </button>
            ))}
          </div>
          {vraagIndex > 0 && (
            <button
              type="button"
              onClick={() => setAntwoorden((a) => a.slice(0, -1))}
              className="mt-3 text-xs font-semibold text-body underline-offset-2 hover:underline"
            >
              Vorige situatie
            </button>
          )}
        </div>
      ) : (
        uitslag && (
          <div aria-live="polite">
            <div className="mt-4 rounded-xl border border-paars-200 bg-white p-4 sm:p-5">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-paars-700">
                <CheckCircle2 className="h-4 w-4" />
                Jouw drie sterkste neigingen — vandaag
              </h4>
              <div className="mt-4 space-y-4">
                {uitslag.volgorde.slice(0, 3).map((bias, plek) => {
                  const info = BIASSEN[bias];
                  const nu = uitslag.percentages[bias];
                  const eerder = vorige?.percentages?.[bias];
                  return (
                    <div key={bias} className="rounded-lg border border-lijn p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paars-100 text-xs font-bold text-paars-700">
                          {plek + 1}
                        </span>
                        <span className="text-sm font-bold text-ink">{info.naam}</span>
                        <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-semibold text-body">
                          {info.soort === "emotioneel" ? "emotioneel — die vóél je" : "cognitief — die dénk je"}
                        </span>
                        <span className="ml-auto text-sm font-extrabold text-paars-700">{nu}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-mist">
                        <div className="h-full rounded-full bg-paars-600" style={{ width: `${nu}%` }} />
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-body">{info.uitleg}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink">
                        <span className="font-bold text-paars-700">Tegenmaatregel: </span>
                        {info.tegenmaatregel}
                      </p>
                      {eerder !== undefined && dagenSindsVorige !== null && dagenSindsVorige >= 1 && (
                        <p className="mt-1.5 text-xs font-semibold text-body">
                          Vorige meting ({vorige!.datum}): {eerder}% —{" "}
                          {nu === eerder
                            ? "onveranderd."
                            : nu > eerder
                              ? `${nu - eerder} punt(en) sterker geworden.`
                              : `${eerder - nu} punt(en) afgenomen.`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-semibold text-body">
                  Alle zes de neigingen bekijken
                </summary>
                <div className="mt-3 space-y-2">
                  {uitslag.volgorde.map((bias) => (
                    <div key={bias} className="flex items-center gap-3 text-xs">
                      <span className="w-44 shrink-0 font-semibold text-body">{BIASSEN[bias].naam}</span>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
                        <div className="h-full rounded-full bg-paars-400" style={{ width: `${uitslag.percentages[bias]}%` }} />
                      </div>
                      <span className="w-10 shrink-0 text-right font-bold text-ink">
                        {uitslag.percentages[bias]}%
                      </span>
                    </div>
                  ))}
                </div>
              </details>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={opnieuw}
                  className="inline-flex items-center gap-2 rounded-lg border border-paars-200 bg-white px-3 py-2 text-xs font-semibold text-paars-700 transition hover:bg-paars-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Opnieuw doen
                </button>
                <span className="text-xs text-body">
                  Zet een herinnering over drie maanden — de hermeting is het
                  echte meetmoment. Je uitslag staat alleen in deze browser.
                </span>
              </div>
            </div>
          </div>
        )
      )}

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze test ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Dit is een momentopname van neigingen, geen persoonlijkheidstest en
            geen etiket. Stress, slaap en een dalende beurs verschuiven de
            uitkomst — dáárom meet je over drie maanden opnieuw.
          </li>
          <li>
            Je neigingen kennen maakt je er niet immuun voor; zelfs Kahneman
            zei dat over zichzelf. De tegenmaatregelen zijn routines, geen
            wilskracht — dat verschil is de kern van les 7.
          </li>
          <li>
            Dit is nadrukkelijk géén risicoprofiel: de uitkomst zegt niets over
            welke beleggingen of verdeling bij je passen, en we doen daar
            bewust geen uitspraak over.
          </li>
          <li>Wij zijn een opleider, geen adviseur — dit is geen beleggingsadvies.</li>
        </ul>
      </div>
    </div>
  );
}
