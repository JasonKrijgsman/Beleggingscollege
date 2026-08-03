"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Brain, CheckCircle2, RotateCcw } from "lucide-react";

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
// na drie maanden opnieuw kunt doen en de verschuiving ziet.

const OPSLAG_SLEUTEL = "beleggingscollege-biastest-v1";
const HERMETING_NA_DAGEN = 80;

type BiasKey =
  | "verliesaversie"
  | "overmoed"
  | "kuddegedrag"
  | "ankereffect"
  | "bevestiging"
  | "recency";

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

type Optie = { tekst: string; scores: Partial<Record<BiasKey, number>> };
type Vraag = { situatie: string; opties: Optie[] };

const VRAGEN: Vraag[] = [
  {
    situatie:
      "Je kocht een aandeel op EUR 50. Het staat nu op EUR 38 en het laatste kwartaalbericht was ronduit zwak. Wat doe je?",
    opties: [
      { tekst: "Ik beoordeel het bedrijf opnieuw alsof ik het vandaag niet bezit — en verkoop als ik het nu niet zou kopen.", scores: {} },
      { tekst: "Ik wacht tot ik quitte sta op EUR 50; daarna mag hij weg.", scores: { verliesaversie: 2, ankereffect: 1 } },
      { tekst: "Ik koop bij om mijn gemiddelde te verlagen, zonder verder onderzoek.", scores: { verliesaversie: 1, ankereffect: 1 } },
    ],
  },
  {
    situatie: "Je portefeuille staat na een onrustige maand 15% lager. Hoe ga je met je beleggingsapp om?",
    opties: [
      { tekst: "Zoals altijd: ik kijk op mijn vaste maandelijkse moment.", scores: {} },
      { tekst: "Ik kijk meerdere keren per dag, met een knoop in mijn maag.", scores: { verliesaversie: 2 } },
      { tekst: "Ik durf niet meer te kijken en vermijd de app al weken.", scores: { verliesaversie: 1 } },
    ],
  },
  {
    situatie:
      "Iemand biedt je een eerlijke muntworp aan: bij kop win je EUR 130, bij munt verlies je EUR 100. Doe je mee?",
    opties: [
      { tekst: "Ja — de verwachte uitkomst is positief.", scores: {} },
      { tekst: "Alleen als de winst minstens rond de EUR 250 ligt.", scores: { verliesaversie: 1 } },
      { tekst: "Nooit, ook niet bij EUR 300 winst: verliezen voelt te rot.", scores: { verliesaversie: 2 } },
    ],
  },
  {
    situatie: "Je eerste drie aandelen staan na een half jaar alle drie op winst. Wat denk je?",
    opties: [
      { tekst: "Ik check eerst wat de brede markt deed voordat ik er iets van vind.", scores: {} },
      { tekst: "Ik blijk hier talent voor te hebben — tijd om met grotere bedragen te werken.", scores: { overmoed: 2 } },
      { tekst: "Drie keer winst is geen toeval; mijn methode werkt duidelijk.", scores: { overmoed: 1, recency: 1 } },
    ],
  },
  {
    situatie:
      "Een vriend vraagt of jij zijn spaargeld wilt beleggen, 'want jij hebt er verstand van'. Wat doe je?",
    opties: [
      { tekst: "Ik leg uit dat kennis geen voorspelkracht is en wijs hem op een goede cursus of een simpele brede belegging — beslissen doet hij zelf.", scores: {} },
      { tekst: "Ik geef hem door wat ik zelf koop; dat gaat tot nu toe prima.", scores: { overmoed: 2 } },
      { tekst: "Ik beleg het voor hem, maar alleen een klein deel.", scores: { overmoed: 1 } },
    ],
  },
  {
    situatie: "Hoeveel tijd zit er meestal tussen 'dit aandeel lijkt me wat' en je koop?",
    opties: [
      { tekst: "Zo lang als mijn vaste checklist duurt — ook als dat weken is.", scores: {} },
      { tekst: "Een kwartier scrollen is genoeg; wie te lang nadenkt, mist de boot.", scores: { overmoed: 2, kuddegedrag: 1 } },
      { tekst: "Ik stel het vaak zó lang uit dat ik uiteindelijk nooit koop.", scores: { verliesaversie: 1 } },
    ],
  },
  {
    situatie:
      "Op een verjaardag praat iedereen over één aandeel dat dit jaar al is verdrievoudigd. Wat doe je maandag?",
    opties: [
      { tekst: "Niets — hooguit zet ik het op mijn onderzoekslijstje.", scores: {} },
      { tekst: "Een klein bedrag instappen: al die mensen kunnen het niet állemaal mis hebben.", scores: { kuddegedrag: 2 } },
      { tekst: "Ik ga er juist tegenin, want de meute heeft per definitie ongelijk.", scores: { kuddegedrag: 1, overmoed: 1 } },
    ],
  },
  {
    situatie:
      "De beurs daalt hard en in je omgeving verkoopt 'iedereen'. Het journaal opent er al drie dagen mee. Jij?",
    opties: [
      { tekst: "Ik volg het plan dat ik in rustige tijden heb opgeschreven.", scores: {} },
      { tekst: "Ik verkoop ook een deel — al die anderen weten misschien iets wat ik niet weet.", scores: { kuddegedrag: 2, verliesaversie: 1 } },
      { tekst: "Ik wacht af wat de markt morgen doet en beslis dan wel.", scores: { kuddegedrag: 1 } },
    ],
  },
  {
    situatie:
      "Een nieuw beleggingsthema is opeens overal: in het nieuws, op fora, bij collega's. De koersen rennen. Wat voel en doe je?",
    opties: [
      { tekst: "Ik herken de FOMO, laat het thema rijpen en toets het later aan mijn plan.", scores: {} },
      { tekst: "Meteen instappen — de trein vertrekt en ik sta nog op het perron.", scores: { kuddegedrag: 2, recency: 1 } },
      { tekst: "Een 'klein plukje' kopen, vooral om erbij te horen als het doorzet.", scores: { kuddegedrag: 1 } },
    ],
  },
  {
    situatie: "Een aandeel stond twee jaar geleden op EUR 80 en staat nu op EUR 40. Je eerste gedachte?",
    opties: [
      { tekst: "De oude koers zegt niets; ik onderzoek wat het bedrijf vandáág waard is.", scores: {} },
      { tekst: "Voor de helft van de oude prijs — dat is in elk geval goedkoop.", scores: { ankereffect: 2 } },
      { tekst: "Afblijven: wat gedaald is, blijft meestal dalen.", scores: { recency: 2 } },
    ],
  },
  {
    situatie:
      "Je kocht op EUR 60; het aandeel staat nu op EUR 75 maar de vooruitzichten zijn verslechterd. Wat doe je?",
    opties: [
      { tekst: "Ik beslis op de vooruitzichten — verkopen mag, ook al is EUR 100 nooit gehaald.", scores: {} },
      { tekst: "Ik wacht op de ronde EUR 100 die ik in mijn hoofd had.", scores: { ankereffect: 2 } },
      { tekst: "Ik verkoop pas als hij terugzakt tot mijn koopprijs van EUR 60.", scores: { ankereffect: 2, verliesaversie: 1 } },
    ],
  },
  {
    situatie: "Je hebt net een aandeel gekocht. Welke informatie zoek je de weken erna vooral op?",
    opties: [
      { tekst: "Bewust ook de sombere analyses en tegenargumenten.", scores: {} },
      { tekst: "Vooral de analisten en fora die positief zijn — die snappen het bedrijf tenminste.", scores: { bevestiging: 2 } },
      { tekst: "Ik lees alles, maar merk dat ik de positieve stukken onthoud en de rest vergeet.", scores: { bevestiging: 1 } },
    ],
  },
  {
    situatie:
      "Iemand plaatst een goed onderbouwd, kritisch stuk over je grootste positie. Wat doe je ermee?",
    opties: [
      { tekst: "Aandachtig lezen en punt voor punt naast mijn eigen verhaal leggen.", scores: {} },
      { tekst: "Wegklikken — zulke negativiteit maakt je maar onzeker.", scores: { bevestiging: 2 } },
      { tekst: "Direct in de comments mijn gelijk verdedigen, het stuk lees ik later wel.", scores: { bevestiging: 1, overmoed: 1 } },
    ],
  },
  {
    situatie: "De beurs deed de afgelopen twee jaar zo'n +15% per jaar. Wat verwacht je voor de komende jaren?",
    opties: [
      { tekst: "Ik reken met langjarige gemiddelden; uitschieters horen erbij, beide kanten op.", scores: {} },
      { tekst: "Rond de +15% — dit is gewoon het nieuwe normaal.", scores: { recency: 2 } },
      { tekst: "Een crash: het ging te lang te goed, dus die moet nu wel komen.", scores: { recency: 1 } },
    ],
  },
  {
    situatie: "Je kiest een beleggingsfonds. Waar kijk je het eerst naar?",
    opties: [
      { tekst: "Kosten, spreiding en hoe het fonds belegt — pas daarna naar rendement, over lange periodes.", scores: {} },
      { tekst: "De rendementslijstjes van het afgelopen jaar: de winnaar van nu.", scores: { recency: 2, kuddegedrag: 1 } },
      { tekst: "Het fonds dat vorig jaar het slechtst was — dat moet wel gaan herstellen.", scores: { recency: 1, ankereffect: 1 } },
    ],
  },
];

/** Hoogst haalbare score per neiging, om eerlijk te kunnen normaliseren. */
const MAX_SCORES: Record<BiasKey, number> = (() => {
  const max: Record<BiasKey, number> = {
    verliesaversie: 0, overmoed: 0, kuddegedrag: 0,
    ankereffect: 0, bevestiging: 0, recency: 0,
  };
  for (const vraag of VRAGEN) {
    const hoogstePerBias: Partial<Record<BiasKey, number>> = {};
    for (const optie of vraag.opties) {
      for (const [bias, punten] of Object.entries(optie.scores) as [BiasKey, number][]) {
        hoogstePerBias[bias] = Math.max(hoogstePerBias[bias] ?? 0, punten);
      }
    }
    for (const [bias, punten] of Object.entries(hoogstePerBias) as [BiasKey, number][]) {
      max[bias] += punten;
    }
  }
  return max;
})();

type OpgeslagenUitslag = { datum: string; percentages: Record<BiasKey, number> };

function leesVorige(): OpgeslagenUitslag | null {
  try {
    const ruw = localStorage.getItem(OPSLAG_SLEUTEL);
    if (!ruw) return null;
    const data = JSON.parse(ruw) as OpgeslagenUitslag;
    return data?.datum && data?.percentages ? data : null;
  } catch {
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

  const uitslag = useMemo(() => {
    if (!klaar) return null;
    const punten: Record<BiasKey, number> = {
      verliesaversie: 0, overmoed: 0, kuddegedrag: 0,
      ankereffect: 0, bevestiging: 0, recency: 0,
    };
    antwoorden.forEach((optieIndex, i) => {
      const scores = VRAGEN[i].opties[optieIndex].scores;
      for (const [bias, p] of Object.entries(scores) as [BiasKey, number][]) {
        punten[bias] += p;
      }
    });
    const percentages = Object.fromEntries(
      (Object.keys(punten) as BiasKey[]).map((bias) => [
        bias,
        Math.round((punten[bias] / MAX_SCORES[bias]) * 100),
      ])
    ) as Record<BiasKey, number>;
    const volgorde = (Object.keys(percentages) as BiasKey[]).sort(
      (a, b) => percentages[b] - percentages[a]
    );
    return { percentages, volgorde };
  }, [klaar, antwoorden]);

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
