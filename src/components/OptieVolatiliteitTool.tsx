"use client";

import { useId, useMemo, useState } from "react";
import { Activity, TriangleAlert, Zap } from "lucide-react";
import { bsPrijs } from "@/lib/opties";

// Hoort bij de les "Vega en implied volatility" (cursus Volatiliteit & Spreads,
// accent petrol). Twee fictieve aandelen met exact dezelfde koers maar een
// totaal ander temperament laten zíén wat implied volatility met een
// optiepremie doet — inclusief de beruchte IV-crush na cijfers.

const KOERS = 42;
const STRIKE = 44;
const DAGEN = 45;

const IV_ZEEWIND = 0.18; // rustig nutsachtig aandeel
const IV_FLITSTECH = 0.55; // wilde groeier

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

/* Deterministische pseudo-toevalsgenerator (mulberry32): zelfde seed, zelfde
   koersgrafiek, bij elke bezoeker en elke render. Bewust geen Math.random. */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Zestig "handelsdagen" koershistorie, eindigend op precies EUR 42, met een
   dagbeweging die bij de volatiliteit van het aandeel past. */
function maakKoersPad(seed: number, dagBeweging: number): number[] {
  const volgende = mulberry32(seed);
  let koers = KOERS;
  const pad = [koers];
  for (let i = 0; i < 60; i++) {
    const schok = (volgende() + volgende() + volgende() - 1.5) / 1.5;
    koers *= 1 + schok * dagBeweging;
    pad.push(koers);
  }
  const correctie = KOERS / koers;
  return pad.map((k, i) => k * Math.pow(correctie, i / 60));
}

const PAD_ZEEWIND = maakKoersPad(20260803, 0.011); // ~18% op jaarbasis
const PAD_FLITSTECH = maakKoersPad(19870512, 0.034); // ~55% op jaarbasis

// Eén gedeelde y-schaal voor beide sparklines, anders lijkt rustig ook wild.
const ALLE_KOERSEN = [...PAD_ZEEWIND, ...PAD_FLITSTECH];
const Y_MIN = Math.min(...ALLE_KOERSEN) - 1;
const Y_MAX = Math.max(...ALLE_KOERSEN) + 1;

function premieContract(iv: number, spot = KOERS, dagen = DAGEN): number {
  return bsPrijs({ type: "call", spot, strike: STRIKE, dagen, iv }) * 100;
}

function Sparkline({ pad, kleur, label }: { pad: number[]; kleur: string; label: string }) {
  const B = 260;
  const H = 64;
  const naarX = (i: number) => (i / (pad.length - 1)) * B;
  const naarY = (k: number) => H - ((k - Y_MIN) / (Y_MAX - Y_MIN)) * H;
  const lijn = pad
    .map((k, i) => `${i === 0 ? "M" : "L"}${naarX(i).toFixed(1)},${naarY(k).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${B} ${H}`} role="img" aria-label={label} className="w-full">
      <line x1={0} y1={naarY(KOERS)} x2={B} y2={naarY(KOERS)} stroke="#e3e8f0" strokeWidth={1} />
      <path d={lijn} fill="none" stroke={kleur} strokeWidth={2} />
    </svg>
  );
}

type Aandeel = {
  naam: string;
  typering: string;
  iv: number;
  pad: number[];
  kleur: string;
};

const AANDELEN: Record<"zeewind" | "flitstech", Aandeel> = {
  zeewind: {
    naam: "Zeewind NV",
    typering: "rustige energieproducent",
    iv: IV_ZEEWIND,
    pad: PAD_ZEEWIND,
    kleur: "#0f7680",
  },
  flitstech: {
    naam: "FlitsTech NV",
    typering: "wilde chipontwerper",
    iv: IV_FLITSTECH,
    pad: PAD_FLITSTECH,
    kleur: "#ad430b",
  },
};

export default function OptieVolatiliteitTool() {
  const [gekozen, setGekozen] = useState<"zeewind" | "flitstech">("flitstech");
  const [ivPct, setIvPct] = useState(Math.round(IV_FLITSTECH * 100));
  const [toonCrush, setToonCrush] = useState(false);
  const ivId = useId();

  const kiesAandeel = (sleutel: "zeewind" | "flitstech") => {
    setGekozen(sleutel);
    setIvPct(Math.round(AANDELEN[sleutel].iv * 100));
  };

  const aandeel = AANDELEN[gekozen];
  const premieBasis = useMemo(() => premieContract(aandeel.iv), [aandeel.iv]);
  const premieNu = useMemo(() => premieContract(ivPct / 100), [ivPct]);
  const verschil = premieNu - premieBasis;

  // IV-crush: FlitsTech publiceert winstcijfers. De koers stijgt 2%, maar de
  // onzekerheid is eruit: IV zakt van 55% naar 25% en er is een dag voorbij.
  const crushVoor = useMemo(() => premieContract(IV_FLITSTECH, KOERS, DAGEN), []);
  const crushNa = useMemo(() => premieContract(0.25, KOERS * 1.02, DAGEN - 1), []);
  const crushVerlies = crushNa - crushVoor;

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <Activity className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">Volatiliteits-verkenner</h3>
      <p className="mt-1 text-sm text-body">
        Twee fictieve aandelen, allebei op precies {eur(KOERS)}. Toch kost
        dezelfde calloptie op het ene aandeel een veelvoud van die op het
        andere. Het verschil zit niet in de koers, maar in hoe hard de markt
        verwácht dat de koers gaat bewegen — de implied volatility (IV).
      </p>

      {/* Twee aandelen naast elkaar: zelfde koers, ander temperament. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {(Object.keys(AANDELEN) as ("zeewind" | "flitstech")[]).map((sleutel) => {
          const a = AANDELEN[sleutel];
          return (
            <div key={sleutel} className="rounded-xl border border-petrol-200 bg-white p-4">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-ink">{a.naam}</div>
                  <div className="text-xs text-body">{a.typering}</div>
                </div>
                <div className="text-sm font-extrabold text-ink">{eur(KOERS)}</div>
              </div>
              <div className="mt-3">
                <Sparkline
                  pad={a.pad}
                  kleur={a.kleur}
                  label={`Koersverloop ${a.naam} over de laatste zestig dagen: ${
                    a.iv === IV_ZEEWIND ? "kalm en vlak" : "grillig met grote uitslagen"
                  }`}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-body">
                  IV {Math.round(a.iv * 100)}%
                </span>
                <span className="text-body">
                  call {eur(STRIKE)}, {DAGEN} dagen
                </span>
              </div>
              <div className="mt-1 text-lg font-extrabold text-petrol-700">
                {eur(premieContract(a.iv))}
                <span className="ml-1 text-xs font-semibold text-body">per contract (×100)</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-body">
        Zelfde koers, zelfde strike, zelfde looptijd — en toch betaal je voor de
        FlitsTech-call ruwweg{" "}
        <strong className="text-ink">
          {(premieContract(IV_FLITSTECH) / premieContract(IV_ZEEWIND)).toLocaleString("nl-NL", {
            maximumFractionDigits: 1,
          })}
          × zoveel
        </strong>
        . De premie is de prijs van verwachte beweging, welke kant op dan ook.
      </p>

      {/* IV-schuif: premie beweegt, koers doet niets. */}
      <div className="mt-6 rounded-xl border border-petrol-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-700">
          Draai zelf aan de IV
        </h4>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(Object.keys(AANDELEN) as ("zeewind" | "flitstech")[]).map((sleutel) => (
            <button
              key={sleutel}
              type="button"
              aria-pressed={gekozen === sleutel}
              onClick={() => kiesAandeel(sleutel)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                gekozen === sleutel
                  ? "border-petrol-600 bg-petrol-600 text-white"
                  : "border-petrol-200 bg-white text-petrol-700 hover:bg-petrol-50"
              }`}
            >
              {AANDELEN[sleutel].naam}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor={ivId} className="block text-sm font-semibold text-body">
            Implied volatility van de call op {aandeel.naam}
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              aria-label={`Implied volatility ${aandeel.naam}`}
              min={10}
              max={70}
              step={1}
              value={ivPct}
              onChange={(e) => setIvPct(Number(e.target.value))}
              className="w-full flex-1 accent-petrol-600"
            />
            <div className="flex shrink-0 items-center gap-1.5">
              <input
                id={ivId}
                type="number"
                inputMode="numeric"
                min={10}
                max={70}
                step={1}
                value={ivPct}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) setIvPct(klem(Math.round(n), 10, 70));
                }}
                className="w-16 rounded-lg border border-lijn bg-white px-2 py-1.5 text-right text-sm font-bold text-ink focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-200"
              />
              <span className="text-sm font-semibold text-body">%</span>
            </div>
          </div>
        </div>
        <div aria-live="polite" className="mt-4 grid gap-3 text-center sm:grid-cols-3">
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-body">
              Koers {aandeel.naam}
            </div>
            <div className="mt-0.5 text-lg font-extrabold text-ink">{eur(KOERS)}</div>
            <div className="text-[11px] text-body">doet ondertussen níéts</div>
          </div>
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-body">
              Premie bij IV {ivPct}%
            </div>
            <div className="mt-0.5 text-lg font-extrabold text-petrol-700">{eur(premieNu)}</div>
            <div className="text-[11px] text-body">per contract (×100)</div>
          </div>
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-body">
              Verschil met IV {Math.round(aandeel.iv * 100)}%
            </div>
            <div
              className={`mt-0.5 text-lg font-extrabold ${
                verschil >= 0 ? "text-groen-700" : "text-oranje-700"
              }`}
            >
              {verschil >= 0 ? "+" : ""}
              {eur(verschil)}
            </div>
            <div className="text-[11px] text-body">alleen door de IV</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-body">
          Dit is het hele punt: de optiepremie kan flink bewegen terwijl het
          aandeel stilstaat. Wie een optie koopt, koopt dus ongemerkt ook een
          standpunt over volatiliteit — of je dat nu wilt of niet.
        </p>
      </div>

      {/* Het IV-crush-scenario. */}
      <div className="mt-6 rounded-xl border border-petrol-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-700">
          Scenario: winstcijfers morgen
        </h4>
        <p className="mt-2 text-sm text-body">
          FlitsTech NV komt morgen met winstcijfers. Je koopt vandaag de call{" "}
          {eur(STRIKE)} — de IV staat door de spanning op 55%. De cijfers vallen
          mee: de koers stijgt 2%. Goed nieuws voor jouw call, toch?
        </p>
        <button
          type="button"
          aria-expanded={toonCrush}
          onClick={() => setToonCrush((t) => !t)}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-petrol-200 bg-white px-4 py-2.5 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-50 focus:outline-none focus:ring-2 focus:ring-petrol-300"
        >
          <Zap className="h-4 w-4" />
          {toonCrush ? "Verberg de afloop" : "Laat zien wat er gebeurt"}
        </button>
        <div aria-live="polite">
          {toonCrush && (
            <div className="mt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-lijn bg-mist p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-body">
                    Vandaag, vóór de cijfers
                  </div>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-body">Koers</dt>
                      <dd className="font-semibold text-ink">{eur(KOERS)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-body">IV</dt>
                      <dd className="font-semibold text-ink">55%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-body">Jouw call (×100)</dt>
                      <dd className="font-extrabold text-petrol-700">{eur(crushVoor)}</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-lg border border-oranje-200 bg-oranje-50 p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-oranje-700">
                    Morgen, ná de cijfers
                  </div>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-body">Koers</dt>
                      <dd className="font-semibold text-groen-700">
                        {eur(KOERS * 1.02)} (+2%)
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-body">IV</dt>
                      <dd className="font-semibold text-ink">25% — de spanning is eruit</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-body">Jouw call (×100)</dt>
                      <dd className="font-extrabold text-oranje-700">{eur(crushNa)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-sm font-semibold text-oranje-700">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Het aandeel steeg, en toch verloor je call {eur(-crushVerlies)}:
                van {eur(crushVoor)} naar {eur(crushNa)}.
              </p>
              <p className="mt-2 text-sm text-body">
                Dit heet de <strong className="text-ink">IV-crush</strong>. De
                hoge premie van gisteren was grotendeels betaalde spanning:
                niemand wist welke kant het op zou schieten. Zodra de cijfers er
                zijn, verdampt die onzekerheid — en de premie die ervoor stond
                verdampt mee. De 2% koerswinst legde het af tegen 30
                procentpunten verdwenen IV. Wie vóór cijfers opties koopt,
                handelt dus vooral in volatiliteit, niet in richting.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze verkenner ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            IV is geen voorspelling van de ríchting maar van de beweging, en
            zelfs dat zit er geregeld naast: de markt over- en onderschat
            volatiliteit voortdurend.
          </li>
          <li>
            In het echt heeft elke strike en looptijd zijn eigen IV (de
            &quot;skew&quot;); hier rekenen we met één getal per aandeel.
          </li>
          <li>
            Zeewind NV en FlitsTech NV bestaan niet; de premies zijn
            theoretische Black-Scholes-prijzen zonder spread en kosten.
          </li>
          <li>
            Dit is een leerinstrument, geen handelsstrategie — en geen
            beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
