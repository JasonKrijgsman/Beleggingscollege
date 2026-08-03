// De vijftien situatievragen en het rekenwerk van de biastest
// (Beleggingspsychologie). Puur, zonder "use client" en zonder
// @/content-import — de vragen en scores staan sowieso client-side, dus dit
// bestand mag veilig in de browserbundel. De uitlegteksten en
// tegenmaatregelen per neiging horen bij de weergave en staan in
// BiasTestTool.tsx.

export type BiasKey =
  | "verliesaversie"
  | "overmoed"
  | "kuddegedrag"
  | "ankereffect"
  | "bevestiging"
  | "recency";

export type BiasOptie = { tekst: string; scores: Partial<Record<BiasKey, number>> };
export type BiasVraag = { situatie: string; opties: BiasOptie[] };

export const VRAGEN: BiasVraag[] = [
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

const LEGE_TELLING: Record<BiasKey, number> = {
  verliesaversie: 0, overmoed: 0, kuddegedrag: 0,
  ankereffect: 0, bevestiging: 0, recency: 0,
};

/** Hoogst haalbare score per neiging, om eerlijk te kunnen normaliseren. */
export function maxScores(vragen: BiasVraag[] = VRAGEN): Record<BiasKey, number> {
  const max = { ...LEGE_TELLING };
  for (const vraag of vragen) {
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
}

export type BiasUitslag = {
  percentages: Record<BiasKey, number>;
  volgorde: BiasKey[];
};

/**
 * Scoort een afgeronde test: telt per neiging de punten van de gekozen
 * opties op en normaliseert naar 0–100% van het hoogst haalbare. De
 * volgorde loopt van sterkste naar zwakste neiging.
 */
export function berekenUitslag(
  antwoorden: number[],
  vragen: BiasVraag[] = VRAGEN
): BiasUitslag {
  const max = maxScores(vragen);
  const punten = { ...LEGE_TELLING };
  antwoorden.forEach((optieIndex, i) => {
    const scores = vragen[i].opties[optieIndex].scores;
    for (const [bias, p] of Object.entries(scores) as [BiasKey, number][]) {
      punten[bias] += p;
    }
  });
  const percentages = Object.fromEntries(
    (Object.keys(punten) as BiasKey[]).map((bias) => [
      bias,
      max[bias] > 0 ? Math.round((punten[bias] / max[bias]) * 100) : 0,
    ])
  ) as Record<BiasKey, number>;
  const volgorde = (Object.keys(percentages) as BiasKey[]).sort(
    (a, b) => percentages[b] - percentages[a]
  );
  return { percentages, volgorde };
}

export type OpgeslagenUitslag = { datum: string; percentages: Record<BiasKey, number> };

/**
 * Leest een eerder opgeslagen uitslag terug uit de ruwe localStorage-tekst.
 * Alles wat niet klopt — kapotte JSON, verkeerde vorm, niet-numerieke
 * percentages — levert null op: dan doe je de test gewoon zonder hermeting.
 * Een oudere uitslag waarin een neiging ontbreekt mag wél; de weergave
 * slaat de vergelijking voor die neiging dan gewoon over.
 */
export function parseUitslag(ruw: string | null): OpgeslagenUitslag | null {
  if (!ruw) return null;
  let data: unknown;
  try {
    data = JSON.parse(ruw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const { datum, percentages } = data as { datum?: unknown; percentages?: unknown };
  if (typeof datum !== "string" || datum === "") return null;
  if (typeof percentages !== "object" || percentages === null) return null;
  for (const waarde of Object.values(percentages)) {
    if (typeof waarde !== "number" || !Number.isFinite(waarde)) return null;
  }
  return { datum, percentages: percentages as Record<BiasKey, number> };
}
