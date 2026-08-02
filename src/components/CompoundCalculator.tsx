"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

type YearPoint = { year: number; invested: number; value: number };

function project(
  start: number,
  monthly: number,
  annualPct: number,
  years: number
): YearPoint[] {
  const monthlyRate = Math.pow(1 + annualPct / 100, 1 / 12) - 1;
  const points: YearPoint[] = [{ year: 0, invested: start, value: start }];
  let value = start;
  let invested = start;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = value * (1 + monthlyRate) + monthly;
      invested += monthly;
    }
    points.push({ year: y, invested, value });
  }
  return points;
}

export default function CompoundCalculator() {
  const [start, setStart] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(25);

  const points = useMemo(
    () => project(start, monthly, rate, years),
    [start, monthly, rate, years]
  );
  const last = points[points.length - 1];
  const growth = last.value - last.invested;

  // SVG-grafiek
  const W = 560;
  const H = 220;
  const PAD = 8;
  const maxV = Math.max(last.value, 1);
  const x = (year: number) => PAD + (year / Math.max(1, years)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / maxV) * (H - PAD * 2);
  const valuePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(" ");
  const investedPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(p.invested).toFixed(1)}`)
    .join(" ");
  const areaPath = `${valuePath} L${x(years).toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`;

  const sliders: {
    label: string;
    value: number;
    set: (n: number) => void;
    min: number;
    max: number;
    step: number;
    format: (n: number) => string;
  }[] = [
    { label: "Startbedrag", value: start, set: setStart, min: 0, max: 25000, step: 250, format: eur },
    { label: "Maandelijkse inleg", value: monthly, set: setMonthly, min: 0, max: 1000, step: 25, format: eur },
    { label: "Verwacht rendement per jaar", value: rate, set: setRate, min: 0, max: 12, step: 0.5, format: (n) => `${n.toLocaleString("nl-NL")}%` },
    { label: "Aantal jaren", value: years, set: setYears, min: 1, max: 40, step: 1, format: (n) => `${n} jaar` },
  ];

  return (
    <div className="my-8 rounded-2xl border-2 border-groen-200 bg-groen-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-groen-700">
        <Calculator className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">Rente-op-rente-rekenmachine</h3>
      <p className="mt-1 text-sm text-body">
        Schuif en zie wat tijd met geld doet. Ter referentie: wereldwijde
        aandelen leverden historisch gemiddeld zo&apos;n 7% per jaar op — maar
        dat is een gemiddelde uit het verleden, geen belofte voor de toekomst.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {sliders.map((s) => (
          <label key={s.label} className="block">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-body">{s.label}</span>
              <span className="font-bold text-ink">{s.format(s.value)}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-2 w-full accent-groen-600"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-groen-200 bg-white p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs>
            <linearGradient id="groeivlak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#239a67" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#239a67" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#groeivlak)" />
          <path d={investedPath} fill="none" stroke="#9aa2ad" strokeWidth="2" strokeDasharray="5 4" />
          <path d={valuePath} fill="none" stroke="#006546" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-body">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-5 rounded bg-groen-600" /> Waarde
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-[#9aa2ad]" /> Ingelegd
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-center sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-body">
            Totaal ingelegd
          </div>
          <div className="mt-1 text-xl font-extrabold text-ink">
            {eur(last.invested)}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-body">
            Eindwaarde
          </div>
          <div className="mt-1 text-xl font-extrabold text-groen-700">
            {eur(last.value)}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-body">
            Groei door rendement
          </div>
          <div className="mt-1 text-xl font-extrabold text-goud-600">
            {eur(growth)}
          </div>
        </div>
      </div>
    </div>
  );
}
