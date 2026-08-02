"use client";

import { useId, useMemo, useState } from "react";
import {
  LineChart,
  Plus,
  RotateCcw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  bsPrijs,
  breakEvens,
  payoffCombinatie,
  type OptieBeen,
  type OptieType,
  type Richting,
} from "@/lib/opties";

// Eén component, twee gedaantes:
//  - mode="enkel"  (les "De vier posities", Opties Begrijpen): één positie,
//    het hockeystick-diagram leren lezen.
//  - mode="bouwer" (Beschermen & Verdienen, Volatiliteit & Spreads): tot vier
//    poten combineren, met presets voor de strategieën uit de les.
// Fictief aandeel: Zeewind NV, koers EUR 42. De premies worden vooringevuld
// met een theoretische prijs (Black-Scholes, IV 25%, 60 dagen) zodat de
// verhoudingen kloppen, maar blijven aanpasbaar — de les is het diagram,
// niet het prijsmodel.

const SPOT = 42;
const DAGEN = 60;
const IV = 0.25;

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function klem(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function theoretischePremie(type: OptieType, strike: number): number {
  return Math.max(
    0.05,
    Math.round(bsPrijs({ type, spot: SPOT, strike, dagen: DAGEN, iv: IV }) * 20) / 20
  );
}

function maakBeen(type: OptieType, richting: Richting, strike: number): OptieBeen {
  return { type, richting, strike, premie: theoretischePremie(type, strike) };
}

type Preset = {
  naam: string;
  uitleg: string;
  benen: OptieBeen[];
  metAandelen?: boolean;
};

const PRESETS: Preset[] = [
  {
    naam: "Call spread",
    uitleg: "Koop een call, schrijf een hogere: begrensde winst, begrensd verlies.",
    benen: [maakBeen("call", "koop", 42), maakBeen("call", "schrijf", 46)],
  },
  {
    naam: "Put spread",
    uitleg: "Koop een put, schrijf een lagere: dalen met een vangnet eronder.",
    benen: [maakBeen("put", "koop", 42), maakBeen("put", "schrijf", 38)],
  },
  {
    naam: "Straddle",
    uitleg: "Koop call én put op dezelfde strike: je rekent op beweging, welke kant dan ook.",
    benen: [maakBeen("call", "koop", 42), maakBeen("put", "koop", 42)],
  },
  {
    naam: "Strangle",
    uitleg: "Zelfde idee als de straddle, maar goedkoper én met meer benodigde beweging.",
    benen: [maakBeen("call", "koop", 46), maakBeen("put", "koop", 38)],
  },
  {
    naam: "Iron condor",
    uitleg: "Twee geschreven spreads: premie vangen zolang de koers binnen de bandbreedte blijft.",
    benen: [
      maakBeen("put", "koop", 34),
      maakBeen("put", "schrijf", 38),
      maakBeen("call", "schrijf", 46),
      maakBeen("call", "koop", 50),
    ],
  },
  {
    naam: "Covered call",
    uitleg: "100 aandelen plus een geschreven call: premie in ruil voor je opwaarts potentieel.",
    benen: [maakBeen("call", "schrijf", 46)],
    metAandelen: true,
  },
  {
    naam: "Collar",
    uitleg: "Aandelen, een beschermende put en een geschreven call die de put betaalt.",
    benen: [maakBeen("put", "koop", 38), maakBeen("call", "schrijf", 46)],
    metAandelen: true,
  },
];

/* Heeft de combinatie een kant waar het verlies buiten de grafiek doorloopt?
   Boven: netto geschreven calls die niet door aandelen gedekt zijn — echt
   onbegrensd. Onder: netto geschreven puts — begrensd op koers nul, maar dat
   is voor een particulier alsnog een enorm bedrag, dus hetzelfde label. */
function openRisico(benen: OptieBeen[], metAandelen: boolean): {
  onder: boolean;
  boven: boolean;
} {
  let nettoCalls = 0; // + gekocht, − geschreven
  let nettoPuts = 0;
  for (const been of benen) {
    const teken = been.richting === "koop" ? 1 : -1;
    if (been.type === "call") nettoCalls += teken * (been.aantal ?? 1);
    else nettoPuts += teken * (been.aantal ?? 1);
  }
  if (metAandelen) nettoCalls += 1; // 100 aandelen dekken één geschreven call
  return { boven: nettoCalls < 0, onder: nettoPuts < 0 };
}

function BeenRegel({
  been,
  index,
  opWijzig,
  opVerwijder,
  kanVerwijderen,
}: {
  been: OptieBeen;
  index: number;
  opWijzig: (index: number, been: OptieBeen) => void;
  opVerwijder: (index: number) => void;
  kanVerwijderen: boolean;
}) {
  const strikeId = useId();
  const premieId = useId();
  const kleur =
    been.richting === "koop" ? "text-petrol-700" : "text-oranje-700";

  return (
    <div className="rounded-xl border border-petrol-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${kleur}`}>
          Poot {index + 1}
        </span>
        <div className="flex overflow-hidden rounded-lg border border-lijn text-xs font-semibold">
          {(["call", "put"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={been.type === t}
              onClick={() =>
                opWijzig(index, {
                  ...been,
                  type: t,
                  premie: theoretischePremie(t, been.strike),
                })
              }
              className={`px-3 py-1.5 transition ${
                been.type === t
                  ? "bg-petrol-600 text-white"
                  : "bg-white text-body hover:bg-petrol-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-lijn text-xs font-semibold">
          {(
            [
              ["koop", "gekocht"],
              ["schrijf", "geschreven"],
            ] as const
          ).map(([r, label]) => (
            <button
              key={r}
              type="button"
              aria-pressed={been.richting === r}
              onClick={() => opWijzig(index, { ...been, richting: r })}
              className={`px-3 py-1.5 transition ${
                been.richting === r
                  ? "bg-petrol-600 text-white"
                  : "bg-white text-body hover:bg-petrol-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {kanVerwijderen && (
          <button
            type="button"
            onClick={() => opVerwijder(index)}
            aria-label={`Poot ${index + 1} verwijderen`}
            className="ml-auto rounded-lg p-1.5 text-body transition hover:bg-mist hover:text-ink"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={strikeId} className="block text-xs font-semibold text-body">
            Uitoefenprijs (strike)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              aria-label={`Strike poot ${index + 1}`}
              min={26}
              max={58}
              step={1}
              value={been.strike}
              onChange={(e) => {
                const strike = Number(e.target.value);
                opWijzig(index, {
                  ...been,
                  strike,
                  premie: theoretischePremie(been.type, strike),
                });
              }}
              className="w-full flex-1 accent-petrol-600"
            />
            <input
              id={strikeId}
              type="number"
              min={26}
              max={58}
              step={1}
              value={been.strike}
              onChange={(e) => {
                const strike = klem(Number(e.target.value), 26, 58);
                if (Number.isFinite(strike))
                  opWijzig(index, {
                    ...been,
                    strike,
                    premie: theoretischePremie(been.type, strike),
                  });
              }}
              className="w-16 rounded-lg border border-lijn bg-white px-2 py-1.5 text-right text-xs font-bold text-ink focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-200"
            />
          </div>
        </div>
        <div>
          <label htmlFor={premieId} className="block text-xs font-semibold text-body">
            Premie per aandeel
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              aria-label={`Premie poot ${index + 1}`}
              min={0.05}
              max={8}
              step={0.05}
              value={been.premie}
              onChange={(e) =>
                opWijzig(index, { ...been, premie: Number(e.target.value) })
              }
              className="w-full flex-1 accent-petrol-600"
            />
            <input
              id={premieId}
              type="number"
              min={0.05}
              max={8}
              step={0.05}
              value={been.premie}
              onChange={(e) => {
                const premie = klem(Number(e.target.value), 0.05, 8);
                if (Number.isFinite(premie)) opWijzig(index, { ...been, premie });
              }}
              className="w-16 rounded-lg border border-lijn bg-white px-2 py-1.5 text-right text-xs font-bold text-ink focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-200"
            />
          </div>
          <p className="mt-1 text-[11px] text-body">
            Vooringevuld met een theoretische premie; schuif gerust.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OptiePayoffTool({
  mode = "enkel",
}: {
  mode?: "enkel" | "bouwer";
}) {
  const [benen, setBenen] = useState<OptieBeen[]>([maakBeen("call", "koop", 42)]);
  const [metAandelen, setMetAandelen] = useState(false);
  const [eindkoers, setEindkoers] = useState(SPOT);
  const [presetNaam, setPresetNaam] = useState<string | null>(null);
  const eindkoersId = useId();

  const wijzigBeen = (index: number, been: OptieBeen) => {
    setPresetNaam(null);
    setBenen((huidig) => huidig.map((b, i) => (i === index ? been : b)));
  };
  const verwijderBeen = (index: number) => {
    setPresetNaam(null);
    setBenen((huidig) => huidig.filter((_, i) => i !== index));
  };
  const voegBeenToe = () => {
    setPresetNaam(null);
    setBenen((huidig) =>
      huidig.length >= 4 ? huidig : [...huidig, maakBeen("call", "koop", 42)]
    );
  };
  const kiesPreset = (preset: Preset) => {
    // Presets vervangen de hele staat — half aangepaste poten laten staan
    // levert alleen verwarring op.
    setBenen(preset.benen.map((b) => ({ ...b })));
    setMetAandelen(Boolean(preset.metAandelen));
    setPresetNaam(preset.naam);
  };
  const herstel = () => {
    setBenen([maakBeen("call", "koop", 42)]);
    setMetAandelen(false);
    setPresetNaam(null);
    setEindkoers(SPOT);
  };

  const aandelen = metAandelen ? { aantal: 100, koopprijs: SPOT } : undefined;

  const grafiek = useMemo(() => {
    const van = 24;
    const tot = 60;
    const stappen = 144;
    const punten: { koers: number; winst: number }[] = [];
    for (let i = 0; i <= stappen; i++) {
      const koers = van + ((tot - van) * i) / stappen;
      punten.push({ koers, winst: payoffCombinatie(benen, koers, aandelen) });
    }
    const winsten = punten.map((p) => p.winst);
    // Symmetrische, afgekapte y-as: onbeperkt verlies loopt visueel "van de
    // grafiek af" en krijgt een tekstlabel in plaats van een oneindige as.
    const grootste = Math.max(4, ...winsten.map((w) => Math.abs(w)));
    const yMax = Math.min(grootste, 15);
    const be = breakEvens(benen, van, tot, aandelen);
    return { van, tot, punten, yMax, be };
  }, [benen, aandelen]);

  const resultaatBijEindkoers = payoffCombinatie(benen, eindkoers, aandelen);
  const nettoPremie = benen.reduce(
    (n, b) => n + (b.richting === "koop" ? -b.premie : b.premie) * (b.aantal ?? 1),
    0
  );
  const risico = openRisico(benen, metAandelen);

  // SVG-coördinaten
  const B = 640;
  const H = 300;
  const PAD = { l: 46, r: 14, b: 26, t: 10 };
  const naarX = (koers: number) =>
    PAD.l + ((koers - grafiek.van) / (grafiek.tot - grafiek.van)) * (B - PAD.l - PAD.r);
  const naarY = (winst: number) =>
    PAD.t +
    (1 - (klem(winst, -grafiek.yMax, grafiek.yMax) + grafiek.yMax) / (2 * grafiek.yMax)) *
      (H - PAD.t - PAD.b);

  const lijnPad = grafiek.punten
    .map((p, i) => `${i === 0 ? "M" : "L"}${naarX(p.koers).toFixed(1)},${naarY(p.winst).toFixed(1)}`)
    .join(" ");

  const isBouwer = mode === "bouwer";
  const been = benen[0];

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <LineChart className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">
        {isBouwer ? "Bouw je strategie" : "Het uitbetalingsdiagram"}
      </h3>
      <p className="mt-1 text-sm text-body">
        {isBouwer
          ? "Combineer maximaal vier poten (en eventueel 100 aandelen Zeewind NV à EUR 42) en zie wat de combinatie op expiratie oplevert. Strategieën zijn geen aparte magie — het zijn optelsommen van de bouwstenen die je al kent."
          : "Kies een positie op het fictieve aandeel Zeewind NV (koers EUR 42) en zie wat hij op expiratie waard is bij elke eindkoers. Sleep de schuiven en let op de knik bij de uitoefenprijs."}
      </p>

      {isBouwer && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wide text-body">
            Presets uit de les
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.naam}
                type="button"
                title={preset.uitleg}
                aria-pressed={presetNaam === preset.naam}
                onClick={() => kiesPreset(preset)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  presetNaam === preset.naam
                    ? "border-petrol-600 bg-petrol-600 text-white"
                    : "border-petrol-200 bg-white text-petrol-700 hover:bg-petrol-50"
                }`}
              >
                {preset.naam}
              </button>
            ))}
            <button
              type="button"
              onClick={herstel}
              className="rounded-lg border border-lijn bg-white px-3 py-1.5 text-xs font-semibold text-body transition hover:bg-mist"
            >
              <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
              Begin opnieuw
            </button>
          </div>
          {presetNaam && (
            <p className="mt-2 text-xs text-body">
              {PRESETS.find((p) => p.naam === presetNaam)?.uitleg}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {benen.map((b, i) => (
          <BeenRegel
            key={i}
            been={b}
            index={i}
            opWijzig={wijzigBeen}
            opVerwijder={verwijderBeen}
            kanVerwijderen={isBouwer && benen.length > 1}
          />
        ))}
        {isBouwer && (
          <div className="flex flex-wrap items-center gap-3">
            {benen.length < 4 && (
              <button
                type="button"
                onClick={voegBeenToe}
                className="inline-flex items-center gap-1.5 rounded-lg border border-petrol-200 bg-white px-3 py-2 text-xs font-semibold text-petrol-700 transition hover:bg-petrol-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Poot toevoegen
              </button>
            )}
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-body">
              <input
                type="checkbox"
                checked={metAandelen}
                onChange={(e) => {
                  setPresetNaam(null);
                  setMetAandelen(e.target.checked);
                }}
                className="h-4 w-4 accent-petrol-600"
              />
              Ik bezit 100 aandelen Zeewind NV (gekocht op {eur(SPOT)})
            </label>
          </div>
        )}
      </div>

      {/* Het diagram */}
      <div className="mt-5 rounded-xl border border-petrol-200 bg-white p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label="Uitbetalingsdiagram: winst of verlies op expiratie per eindkoers"
          className="w-full"
        >
          {/* winst-/verliesvlakken */}
          <rect
            x={PAD.l}
            y={PAD.t}
            width={B - PAD.l - PAD.r}
            height={naarY(0) - PAD.t}
            fill="#effaf4"
          />
          <rect
            x={PAD.l}
            y={naarY(0)}
            width={B - PAD.l - PAD.r}
            height={H - PAD.b - naarY(0)}
            fill="#fdf1f1"
          />
          {/* nullijn en aslabels */}
          <line
            x1={PAD.l}
            y1={naarY(0)}
            x2={B - PAD.r}
            y2={naarY(0)}
            stroke="#9aa2ad"
            strokeWidth={1}
          />
          {[-grafiek.yMax, -grafiek.yMax / 2, grafiek.yMax / 2, grafiek.yMax].map(
            (w) => (
              <g key={w}>
                <line
                  x1={PAD.l}
                  y1={naarY(w)}
                  x2={B - PAD.r}
                  y2={naarY(w)}
                  stroke="#e3e8f0"
                  strokeWidth={1}
                />
                <text
                  x={PAD.l - 6}
                  y={naarY(w) + 3.5}
                  textAnchor="end"
                  fontSize={10}
                  fill="#53565a"
                >
                  {w > 0 ? "+" : ""}
                  {Math.round(w)}
                </text>
              </g>
            )
          )}
          {[28, 34, 40, 46, 52, 58].map((koers) => (
            <text
              key={koers}
              x={naarX(koers)}
              y={H - 8}
              textAnchor="middle"
              fontSize={10}
              fill="#53565a"
            >
              {koers}
            </text>
          ))}
          {/* huidige koers */}
          <line
            x1={naarX(SPOT)}
            y1={PAD.t}
            x2={naarX(SPOT)}
            y2={H - PAD.b}
            stroke="#0f7680"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.5}
          />
          {/* breakevens */}
          {grafiek.be.map((koers) => (
            <g key={koers}>
              <line
                x1={naarX(koers)}
                y1={PAD.t}
                x2={naarX(koers)}
                y2={H - PAD.b}
                stroke="#b98214"
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
              <text
                x={naarX(koers)}
                y={PAD.t + 10}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#b98214"
              >
                {koers.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}
              </text>
            </g>
          ))}
          {/* de payoff-lijn */}
          <path d={lijnPad} fill="none" stroke="#0f7680" strokeWidth={2.5} />
          {/* marker op de gekozen eindkoers */}
          <circle
            cx={naarX(eindkoers)}
            cy={naarY(resultaatBijEindkoers)}
            r={5}
            fill={resultaatBijEindkoers >= 0 ? "#239a67" : "#c2410c"}
            stroke="#fff"
            strokeWidth={2}
          />
        </svg>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-body">
          <span>Horizontaal: eindkoers Zeewind NV · verticaal: winst/verlies per aandeel</span>
          <span className="font-semibold text-goud-600">— — breakeven</span>
        </div>
      </div>

      {/* Eindkoers-schuif + uitkomst */}
      <div className="mt-4 rounded-xl border border-petrol-200 bg-white p-4">
        <label htmlFor={eindkoersId} className="block text-sm font-semibold text-body">
          Stel: de koers staat op expiratie op…
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id={eindkoersId}
            type="range"
            min={24}
            max={60}
            step={0.5}
            value={eindkoers}
            onChange={(e) => setEindkoers(Number(e.target.value))}
            className="w-full flex-1 accent-petrol-600"
          />
          <span className="w-20 shrink-0 text-right text-sm font-bold text-ink">
            {eur(eindkoers)}
          </span>
        </div>
        <div aria-live="polite" className="mt-3 grid gap-3 text-center sm:grid-cols-3">
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-body">
              Netto premie nu
            </div>
            <div className="mt-0.5 text-lg font-extrabold text-ink">
              {nettoPremie >= 0 ? "+" : ""}
              {eur(nettoPremie * 100)}
            </div>
            <div className="text-[11px] text-body">
              {nettoPremie >= 0 ? "je ontvangt (credit)" : "je betaalt (debet)"} · per contract van 100
            </div>
          </div>
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-body">
              Resultaat bij {eur(eindkoers)}
            </div>
            <div
              className={`mt-0.5 text-lg font-extrabold ${
                resultaatBijEindkoers >= 0 ? "text-groen-700" : "text-oranje-700"
              }`}
            >
              {resultaatBijEindkoers >= 0 ? "+" : ""}
              {eur(resultaatBijEindkoers * 100)}
            </div>
            <div className="text-[11px] text-body">
              per contract{metAandelen ? " incl. aandelen" : ""} (×100)
            </div>
          </div>
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-body">
              Breakeven
            </div>
            <div className="mt-0.5 text-lg font-extrabold text-goud-600">
              {grafiek.be.length === 0
                ? "—"
                : grafiek.be.map((b) => eur(b)).join(" en ")}
            </div>
            <div className="text-[11px] text-body">
              {grafiek.be.length > 1 ? "twee kantelpunten" : "kantelpunt"}
            </div>
          </div>
        </div>
        {(risico.boven || risico.onder) && (
          <p className="mt-3 flex items-start gap-1.5 text-xs font-semibold text-oranje-700">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Let op: deze combinatie bevat een geschreven poot zonder dekking —
            het verlies loopt {risico.boven && risico.onder ? "aan beide kanten" : risico.boven ? "bij stijging" : "bij daling"}{" "}
            buiten de grafiek gewoon door. Je broker vraagt hiervoor onderpand (marge).
          </p>
        )}
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar dit diagram ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Dit is de waarde <em>op expiratie</em>. Tussentijds telt ook
            tijdswaarde mee, dus de lijn die je broker vandaag toont ligt er
            anders bij dan deze knikken.
          </li>
          <li>
            Transactiekosten en de bied-laatspread zijn hier weggelaten; in het
            echt maken die elke uitkomst een stukje slechter.
          </li>
          <li>
            Zeewind NV bestaat niet en de premies zijn theoretisch. Leerdoel is
            de vorm van het diagram, geen echte handel — en dit is geen
            beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
