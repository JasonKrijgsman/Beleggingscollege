"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Brain,
  Newspaper,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

// Hoort bij de les "Kuddegedrag, manie en paniek" (Beleggingspsychologie,
// accent paars). De cursist "belegt" EUR 10.000 en speelt een historisch
// geïnspireerde crash maand voor maand af, met koppen die de druk opvoeren en
// één grote rode verkoopknop. Aan het einde: wat kostte (of spaarde) je
// gedrag, vergeleken met blijven zitten en met de typische paniekverkoper.
//
// De koersreeksen zijn deterministisch (vaste seed): iedereen ziet exact
// dezelfde oefening. Ze zijn geïnspireerd op echte episodes maar het zijn
// leerreeksen, geen datasets — en al helemaal geen voorspelling.

const INLEG = 10_000;

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function pct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toLocaleString("nl-NL", {
    maximumFractionDigits: 1,
  })}%`;
}

/* Zelfde deterministische generator als in SteunWeerstandTool. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Kop = { maand: number; tekst: string };

type Scenario = {
  key: string;
  naam: string;
  duiding: string; // waar het patroon op geïnspireerd is
  seed: number;
  /** [maandindex, indexstand] — tussenliggende maanden worden vloeiend ingevuld */
  waypoints: [number, number][];
  koppen: Kop[];
  naschrift: string; // wat er ná het venster gebeurde (historische context)
};

const SCENARIOS: Scenario[] = [
  {
    key: "kredietcrisis",
    naam: "De lange val",
    duiding: "geïnspireerd op de kredietcrisis van 2008",
    seed: 20080915,
    waypoints: [
      [0, 100],
      [5, 104],
      [9, 96],
      [13, 84],
      [15, 88],
      [18, 70],
      [20, 58],
      [23, 52],
      [26, 46],
      [30, 58],
      [36, 66],
      [42, 74],
      [48, 82],
    ],
    koppen: [
      { maand: 8, tekst: "Zorgen over huizenmarkt groeien: 'Dit waait wel over', zeggen analisten" },
      { maand: 13, tekst: "Grote zakenbank in problemen — overheden overleggen in het weekend" },
      { maand: 19, tekst: "BEURZEN IN VRIJE VAL: grootste daling in decennia" },
      { maand: 24, tekst: "Econoom: 'Dit kan het einde van het financiële systeem zijn'" },
      { maand: 27, tekst: "Werkloosheid loopt hard op, consumenten houden de hand op de knip" },
      { maand: 33, tekst: "Voorzichtig herstel, maar experts waarschuwen voor een tweede dip" },
    ],
    naschrift:
      "In het echte 2008-scenario stond een brede wereldindex ongeveer vier jaar na de bodem weer op het oude niveau — inclusief herbelegd dividend eerder. Wie op de bodem verkocht, maakte het verlies definitief.",
  },
  {
    key: "flitscrash",
    naam: "De flitscrash",
    duiding: "geïnspireerd op de coronacrash van 2020",
    seed: 20200320,
    waypoints: [
      [0, 100],
      [3, 103],
      [4, 96],
      [5, 78],
      [6, 67],
      [8, 76],
      [11, 86],
      [15, 95],
      [20, 103],
      [24, 108],
    ],
    koppen: [
      { maand: 4, tekst: "Wereldwijde onzekerheid: beurzen kleuren dieprood" },
      { maand: 5, tekst: "HANDEL STILGELEGD: automatische noodrem op de beurs in werking" },
      { maand: 6, tekst: "'Verkoop nu het nog kan', klinkt het op sociale media" },
      { maand: 9, tekst: "Beurzen veren op — 'een dood-kat-stuiter', waarschuwen commentatoren" },
      { maand: 14, tekst: "Herstel zet door, maar niemand vertrouwt het helemaal" },
    ],
    naschrift:
      "In het echte 2020-scenario was de daling van ruim 30% in vijf weken een feit — en stond de index binnen een jaar op een nieuw record. Vrijwel niemand die uitstapte, stapte op tijd weer in.",
  },
  {
    key: "leegloop",
    naam: "De langzame leegloop",
    duiding: "geïnspireerd op het leeglopen van de internetzeepbel (2000–2003)",
    seed: 20000310,
    waypoints: [
      [0, 100],
      [4, 108],
      [7, 98],
      [10, 102],
      [14, 88],
      [18, 80],
      [24, 68],
      [28, 60],
      [33, 52],
      [36, 48],
      [40, 55],
      [46, 62],
      [48, 64],
    ],
    koppen: [
      { maand: 3, tekst: "'De nieuwe economie kent geen zwaartekracht', juicht het beursjournaal" },
      { maand: 9, tekst: "Even schrikken, maar kopers op de dip worden beloond — tot nu toe" },
      { maand: 16, tekst: "Winstwaarschuwingen stapelen zich op in de techsector" },
      { maand: 25, tekst: "Beleggers moegestreden: 'Elke opleving wordt verkocht'" },
      { maand: 34, tekst: "Niemand wil nog over aandelen praten op verjaardagen" },
    ],
    naschrift:
      "In het echte dotcom-scenario duurde de daling bijna drie jaar, met telkens oplevingen die hoop gaven. Juist dat trage leeglopen maakte volhouden zwaarder dan één scherpe klap — en breed gespreide beleggers stonden er jaren later wél weer bovenop, veel smalle techfondsen nooit.",
  },
];

function maakReeks(scenario: Scenario): number[] {
  const willekeur = mulberry32(scenario.seed);
  const laatste = scenario.waypoints[scenario.waypoints.length - 1][0];
  const reeks: number[] = [];
  for (let m = 0; m <= laatste; m++) {
    // Vind het omliggende waypoint-paar.
    let i = 0;
    while (scenario.waypoints[i + 1][0] < m) i++;
    const [m0, v0] = scenario.waypoints[i];
    const [m1, v1] = scenario.waypoints[i + 1];
    const t = m1 === m0 ? 0 : (m - m0) / (m1 - m0);
    const glad = t * t * (3 - 2 * t);
    const basis = v0 + (v1 - v0) * glad;
    const ruis = m === 0 || m === laatste ? 0 : (willekeur() - 0.5) * 2.4;
    reeks.push(Math.max(5, basis + ruis));
  }
  return reeks;
}

type Actie = { maand: number; type: "verkoop" | "instap"; stand: number };

export default function PaniekSimulatorTool() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [maand, setMaand] = useState(0);
  const [belegd, setBelegd] = useState(true);
  const [acties, setActies] = useState<Actie[]>([]);
  const [speelt, setSpeelt] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS[scenarioIndex];
  const reeks = useMemo(() => maakReeks(scenario), [scenario]);
  const laatste = reeks.length - 1;
  const klaar = maand >= laatste;

  // Waarde van jouw pot: door de reeks lopen en bij elke actie wisselen
  // tussen "beweegt mee" en "staat stil in cash".
  const berekenWaarde = (totMaand: number): number => {
    let waarde = INLEG;
    let inMarkt = true;
    let vorigeStand = reeks[0];
    for (let m = 1; m <= totMaand; m++) {
      const actieHier = acties.find((a) => a.maand === m);
      if (inMarkt) waarde *= reeks[m] / vorigeStand;
      if (actieHier) inMarkt = actieHier.type === "instap";
      vorigeStand = reeks[m];
    }
    return waarde;
  };

  const jouwWaarde = berekenWaarde(maand);
  const blijvenZitten = (INLEG * reeks[maand]) / reeks[0];

  // De typische paniekverkoper: verkoopt zodra de stand 25% onder de start
  // zakt en stapt pas weer in nadat de markt 30% van de bodem is opgeveerd.
  const paniekverkoper = useMemo(() => {
    let waarde = INLEG;
    let inMarkt = true;
    let bodem = reeks[0];
    for (let m = 1; m <= laatste; m++) {
      if (inMarkt) waarde *= reeks[m] / reeks[m - 1];
      bodem = Math.min(bodem, reeks[m]);
      if (inMarkt && reeks[m] <= reeks[0] * 0.75) inMarkt = false;
      else if (!inMarkt && reeks[m] >= bodem * 1.3) inMarkt = true;
    }
    return waarde;
  }, [reeks, laatste]);

  const actueleKop = [...scenario.koppen].reverse().find((k) => k.maand <= maand);

  const stop = () => {
    setSpeelt(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const speelAf = () => {
    if (klaar) return;
    setSpeelt(true);
    timerRef.current = setInterval(() => {
      setMaand((m) => {
        if (m >= laatste - 1) {
          stop();
          return laatste;
        }
        return m + 1;
      });
    }, 650);
  };

  useEffect(() => () => stop(), []);

  const herstart = (nieuweIndex?: number) => {
    stop();
    if (nieuweIndex !== undefined) setScenarioIndex(nieuweIndex);
    setMaand(0);
    setBelegd(true);
    setActies([]);
  };

  const verkoop = () => {
    if (!belegd || klaar) return;
    setBelegd(false);
    setActies((a) => [...a, { maand, type: "verkoop", stand: reeks[maand] }]);
  };
  const stapIn = () => {
    if (belegd || klaar) return;
    setBelegd(true);
    setActies((a) => [...a, { maand, type: "instap", stand: reeks[maand] }]);
  };

  // SVG
  const B = 640;
  const H = 260;
  const PAD = { l: 40, r: 12, t: 12, b: 22 };
  const maxStand = Math.max(...reeks) * 1.04;
  const minStand = Math.min(...reeks) * 0.92;
  const naarX = (m: number) => PAD.l + (m / laatste) * (B - PAD.l - PAD.r);
  const naarY = (stand: number) =>
    PAD.t + (1 - (stand - minStand) / (maxStand - minStand)) * (H - PAD.t - PAD.b);
  const pad = reeks
    .slice(0, maand + 1)
    .map((stand, m) => `${m === 0 ? "M" : "L"}${naarX(m).toFixed(1)},${naarY(stand).toFixed(1)}`)
    .join(" ");

  const rendementJij = ((jouwWaarde - INLEG) / INLEG) * 100;
  const rendementZitten = ((blijvenZitten - INLEG) / INLEG) * 100;

  return (
    <div className="my-8 rounded-2xl border-2 border-paars-200 bg-paars-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-paars-700">
        <Brain className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">De paniek-simulator</h3>
      <p className="mt-1 text-sm text-body">
        Je hebt {eur(INLEG)} belegd in een brede index. Speel de maanden af en
        voel de druk van de koppen. Je mág verkopen — daar is die grote knop
        voor. Aan het einde zie je wat je keuzes kostten of opleverden.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={i === scenarioIndex}
            onClick={() => herstart(i)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              i === scenarioIndex
                ? "border-paars-600 bg-paars-600 text-white"
                : "border-paars-200 bg-white text-paars-700 hover:bg-paars-50"
            }`}
          >
            {s.naam}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-body">
        {scenario.duiding} — leerreeks, geen echte data en geen voorspelling.
      </p>

      {/* Nieuwskop */}
      <div
        aria-live="polite"
        className="mt-4 flex min-h-[3.25rem] items-center gap-2 rounded-xl border border-paars-200 bg-white px-4 py-2.5"
      >
        <Newspaper className="h-4 w-4 shrink-0 text-paars-700" />
        <span className="text-sm font-semibold text-ink">
          {maand === 0
            ? "Maand 0 — een gewone beursdag. Druk op afspelen."
            : actueleKop
              ? actueleKop.tekst
              : "Rustig op de markten vandaag."}
        </span>
      </div>

      {/* Grafiek */}
      <div className="mt-3 rounded-xl border border-paars-200 bg-white p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label="Koersverloop van de index tot de huidige maand"
          className="w-full"
        >
          <line x1={PAD.l} y1={naarY(reeks[0])} x2={B - PAD.r} y2={naarY(reeks[0])} stroke="#e3e8f0" strokeDasharray="4 4" />
          <text x={PAD.l - 5} y={naarY(reeks[0]) + 3.5} textAnchor="end" fontSize={10} fill="#53565a">
            start
          </text>
          <path d={pad} fill="none" stroke="#6d3fc4" strokeWidth={2.5} />
          {acties.map((a) => (
            <g key={`${a.type}-${a.maand}`}>
              <circle
                cx={naarX(a.maand)}
                cy={naarY(a.stand)}
                r={5}
                fill={a.type === "verkoop" ? "#c2410c" : "#239a67"}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={naarX(a.maand)}
                y={naarY(a.stand) - 9}
                textAnchor="middle"
                fontSize={9}
                fontWeight={700}
                fill={a.type === "verkoop" ? "#c2410c" : "#239a67"}
              >
                {a.type === "verkoop" ? "verkocht" : "ingestapt"}
              </text>
            </g>
          ))}
          {maand > 0 && (
            <circle cx={naarX(maand)} cy={naarY(reeks[maand])} r={4.5} fill="#6d3fc4" stroke="#fff" strokeWidth={2} />
          )}
          <text x={B - PAD.r} y={H - 6} textAnchor="end" fontSize={10} fill="#53565a">
            maand {maand} van {laatste}
          </text>
        </svg>
      </div>

      {/* Bedieningsknoppen */}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-2">
          {!speelt ? (
            <button
              type="button"
              onClick={speelAf}
              disabled={klaar}
              className="inline-flex items-center gap-2 rounded-lg bg-paars-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-paars-700 disabled:opacity-40"
            >
              <Play className="h-4 w-4" />
              {maand === 0 ? "Speel af" : "Verder"}
            </button>
          ) : (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-2 rounded-lg border border-paars-200 bg-white px-4 py-2.5 text-sm font-semibold text-paars-700 transition hover:bg-paars-50"
            >
              <Pause className="h-4 w-4" />
              Pauze
            </button>
          )}
          <button
            type="button"
            onClick={() => herstart()}
            className="inline-flex items-center gap-2 rounded-lg border border-lijn bg-white px-3 py-2.5 text-sm font-semibold text-body transition hover:bg-mist"
          >
            <RotateCcw className="h-4 w-4" />
            Opnieuw
          </button>
        </div>
        <div>
          {belegd ? (
            <button
              type="button"
              onClick={verkoop}
              disabled={klaar || maand === 0}
              className="w-full rounded-lg bg-[#c2410c] px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#9a3412] disabled:opacity-40 sm:w-auto"
            >
              Verkoop alles
            </button>
          ) : (
            <button
              type="button"
              onClick={stapIn}
              disabled={klaar}
              className="w-full rounded-lg bg-groen-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-groen-700 disabled:opacity-40 sm:w-auto"
            >
              Stap weer in
            </button>
          )}
        </div>
      </div>

      {/* Stand van jouw pot */}
      <div aria-live="polite" className="mt-4 grid gap-3 text-center sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">Jouw pot</div>
          <div className={`mt-0.5 text-lg font-extrabold ${jouwWaarde >= INLEG ? "text-groen-700" : "text-[#c2410c]"}`}>
            {eur(jouwWaarde)}
          </div>
          <div className="text-[11px] text-body">
            {pct(rendementJij)} · {belegd ? "belegd" : "aan de zijlijn (cash)"}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">Blijven zitten</div>
          <div className={`mt-0.5 text-lg font-extrabold ${blijvenZitten >= INLEG ? "text-groen-700" : "text-[#c2410c]"}`}>
            {eur(blijvenZitten)}
          </div>
          <div className="text-[11px] text-body">{pct(rendementZitten)} · niets gedaan</div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">Typische paniekverkoper</div>
          <div className={`mt-0.5 text-lg font-extrabold ${klaar ? (paniekverkoper >= INLEG ? "text-groen-700" : "text-[#c2410c]") : "text-body"}`}>
            {klaar ? eur(paniekverkoper) : "— zichtbaar op het einde —"}
          </div>
          <div className="text-[11px] text-body">verkoopt op −25%, durft pas laat weer</div>
        </div>
      </div>

      {/* Eindscherm */}
      {klaar && (
        <div className="mt-4 rounded-xl border border-paars-200 bg-white p-4 sm:p-5" aria-live="polite">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-paars-700">
            <AlertTriangle className="h-4 w-4" />
            De afrekening
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-body">
            {acties.length === 0 ? (
              <>
                Je hebt de hele rit uitgezeten, óók toen de koppen schreeuwden.
                Dat is makkelijker in een oefening dan met echt geld — maar het
                is precies de spier die deze les traint.
              </>
            ) : jouwWaarde >= blijvenZitten ? (
              <>
                Jouw keuzes pakten in deze reeks {eur(jouwWaarde - blijvenZitten)}{" "}
                beter uit dan blijven zitten. Eerlijk moment: dat kán, net zoals
                een casino-avond goed kan aflopen. De vraag die telt is of je
                dit herhaalbaar denkt te kunnen — onderzoek naar echte
                beleggers laat structureel het omgekeerde zien.
              </>
            ) : (
              <>
                Jouw in- en uitstapmomenten kostten je{" "}
                {eur(blijvenZitten - jouwWaarde)} ten opzichte van simpelweg
                blijven zitten. Zo voelt de statistiek uit de les: het verlies
                zat niet in de crash, maar in het gemiste herstel.
              </>
            )}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body">{scenario.naschrift}</p>
        </div>
      )}

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze simulator ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Dit zijn leerreeksen geïnspireerd op echte episodes, geen datasets —
            en geschiedenis is geen voorspelling. De volgende crash lijkt
            nergens op de vorige.
          </li>
          <li>
            Echt geld voelt anders dan oefengeld: de druk die je hier mist, is
            precies waarom routines (les 7) belangrijker zijn dan voornemens.
          </li>
          <li>
            Soms was verkopen achteraf wél beter geweest. Het punt is niet dat
            verkopen altijd fout is — het punt is dat verkopen uit paniek, op
            het moment dat het pijn doet, structureel slecht uitpakt.
          </li>
          <li>Wij zijn een opleider, geen adviseur — dit is geen beleggingsadvies.</li>
        </ul>
      </div>
    </div>
  );
}
