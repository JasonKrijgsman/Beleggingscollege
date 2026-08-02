"use client";

import { useId, useMemo, useState } from "react";
import { Hourglass, Lightbulb } from "lucide-react";
import { bsPrijs, intrinsiekeWaarde, type OptieType } from "@/lib/opties";

// Hoort bij de les "Intrinsieke waarde en tijdswaarde" (cursus Opties
// Begrijpen, accent petrol). Eén optie op het fictieve aandeel Zeewind NV,
// strike EUR 42. De cursist schuift met de koers en de resterende looptijd
// en ziet de premie uiteenvallen in twee delen: wat de optie nú bij
// uitoefening waard is (intrinsiek, navy) en wat je betaalt voor de tijd
// die nog rest (tijdswaarde, goud). De goudlaag verdampt altijd.

const STRIKE = 42;
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

/* Zelfde invoerpatroon als de andere lestools: een echt <label>, een schuif
   en een nummerveld die dezelfde waarde delen, beide bedienbaar zonder muis. */
function SchuifVeld({
  label,
  waarde,
  zetWaarde,
  min,
  max,
  stap,
  eenheid,
  hint,
}: {
  label: string;
  waarde: number;
  zetWaarde: (n: number) => void;
  min: number;
  max: number;
  stap: number;
  eenheid?: string;
  hint?: string;
}) {
  const labelId = useId();
  const veldId = useId();
  const [tekst, setTekst] = useState<string | null>(null);

  const verwerkTekst = (ruw: string) => {
    setTekst(ruw);
    const n = Number(ruw.replace(",", "."));
    if (ruw.trim() !== "" && Number.isFinite(n)) {
      zetWaarde(klem(n, min, max));
    }
  };

  return (
    <div>
      <label
        id={labelId}
        htmlFor={veldId}
        className="block text-sm font-semibold text-body"
      >
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          aria-labelledby={labelId}
          min={min}
          max={max}
          step={stap}
          value={waarde}
          onChange={(e) => {
            setTekst(null);
            zetWaarde(Number(e.target.value));
          }}
          className="w-full flex-1 accent-petrol-600"
        />
        <div className="flex shrink-0 items-center gap-1.5">
          <input
            id={veldId}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={stap}
            value={tekst ?? String(waarde)}
            onChange={(e) => verwerkTekst(e.target.value)}
            onBlur={() => setTekst(null)}
            className="w-20 rounded-lg border border-lijn bg-white px-2 py-2 text-right text-sm font-bold text-ink focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-200"
          />
          {eenheid && (
            <span className="text-sm font-semibold text-body">{eenheid}</span>
          )}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-body">{hint}</p>}
    </div>
  );
}

export default function OptieTijdswaardeTool() {
  const [type, setType] = useState<OptieType>("call");
  // Start bewust out-of-the-money: dan zie je het moment waarop de
  // intrinsieke waarde "aanspringt" zodra je de strike passeert.
  const [spot, setSpot] = useState(38);
  const [dagen, setDagen] = useState(45);

  const { premie, intrinsiek, tijdswaarde } = useMemo(() => {
    const premie = bsPrijs({ type, spot, strike: STRIKE, dagen, iv: IV });
    const intrinsiek = intrinsiekeWaarde(type, spot, STRIKE);
    return { premie, intrinsiek, tijdswaarde: Math.max(0, premie - intrinsiek) };
  }, [type, spot, dagen]);

  // Tijdswaarde over het hele koersbereik bij de gekozen looptijd — de
  // bult die precies op de strike piekt.
  const curve = useMemo(() => {
    const van = 30;
    const tot = 55;
    const stappen = 100;
    const punten: { koers: number; tw: number }[] = [];
    let max = 0;
    for (let i = 0; i <= stappen; i++) {
      const koers = van + ((tot - van) * i) / stappen;
      const tw = Math.max(
        0,
        bsPrijs({ type, spot: koers, strike: STRIKE, dagen, iv: IV }) -
          intrinsiekeWaarde(type, koers, STRIKE)
      );
      punten.push({ koers, tw });
      if (tw > max) max = tw;
    }
    return { van, tot, punten, max: Math.max(0.5, max) };
  }, [type, dagen]);

  // Vaste schaal voor de gestapelde balk, zodat hij niet "meegroeit" en je
  // de verhouding tussen de twee delen echt ziet verschuiven.
  const balkMax = 14;
  const overStrike = intrinsiek > 0;

  // SVG-coördinaten voor het tijdswaarde-grafiekje
  const B = 640;
  const H = 220;
  const PAD = { l: 44, r: 14, b: 26, t: 12 };
  const naarX = (koers: number) =>
    PAD.l + ((koers - curve.van) / (curve.tot - curve.van)) * (B - PAD.l - PAD.r);
  const naarY = (tw: number) =>
    PAD.t + (1 - tw / (curve.max * 1.1)) * (H - PAD.t - PAD.b);
  const lijnPad = curve.punten
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${naarX(p.koers).toFixed(1)},${naarY(p.tw).toFixed(1)}`
    )
    .join(" ");

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <Hourglass className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">
        Intrinsiek vs. tijdswaarde: waar betaal je voor?
      </h3>
      <p className="mt-1 text-sm text-body">
        Een optiepremie bestaat altijd uit twee delen. Schuif met de koers van
        het fictieve aandeel Zeewind NV en met de resterende looptijd, en zie
        hoe een {type === "call" ? "call" : "put"} met strike {eur(STRIKE)}{" "}
        uiteenvalt in intrinsieke waarde (wat uitoefenen nú oplevert) en
        tijdswaarde (wat je betaalt voor de kans dat het nog beter wordt).
      </p>

      {/* call/put-keuze */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-semibold text-body">Optietype:</span>
        <div className="flex overflow-hidden rounded-lg border border-lijn text-sm font-semibold">
          {(["call", "put"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`px-4 py-2 transition ${
                type === t
                  ? "bg-petrol-600 text-white"
                  : "bg-white text-body hover:bg-petrol-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SchuifVeld
          label="Koers Zeewind NV"
          waarde={spot}
          zetWaarde={setSpot}
          min={30}
          max={55}
          stap={0.5}
          eenheid="€"
          hint={`De strike staat vast op ${eur(STRIKE)} — schuif er eens overheen.`}
        />
        <SchuifVeld
          label="Dagen tot expiratie"
          waarde={dagen}
          zetWaarde={setDagen}
          min={1}
          max={90}
          stap={1}
          eenheid="dgn"
          hint="Minder dagen = minder tijdswaarde. Kijk wat er bij 1 dag overblijft."
        />
      </div>

      {/* De gestapelde balk: premie = intrinsiek + tijdswaarde */}
      <div aria-live="polite" className="mt-6 rounded-xl border border-petrol-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-700">
            De premie, uit elkaar getrokken
          </h4>
          <span className="text-sm font-extrabold text-ink">
            totaal {eur(premie)} per aandeel · {eur(premie * 100)} per contract
          </span>
        </div>
        <div className="mt-3 h-7 w-full overflow-hidden rounded-full bg-mist">
          <div className="flex h-full">
            <div
              className="h-full bg-navy-600 transition-all duration-200"
              style={{ width: `${(klem(intrinsiek, 0, balkMax) / balkMax) * 100}%` }}
            />
            <div
              className="h-full bg-goud-400 transition-all duration-200"
              style={{ width: `${(klem(tijdswaarde, 0, balkMax) / balkMax) * 100}%` }}
            />
          </div>
        </div>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm bg-navy-600" />
            <span className="text-body">
              Intrinsieke waarde:{" "}
              <strong className="text-ink">{eur(intrinsiek)}</strong>
              {intrinsiek === 0 && " — nul, de optie is out-of-the-money"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm bg-goud-400" />
            <span className="text-body">
              Tijdswaarde: <strong className="text-ink">{eur(tijdswaarde)}</strong>{" "}
              — dit deel verdampt richting expiratie
            </span>
          </div>
        </div>
        {overStrike && (
          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-petrol-50 p-3 text-sm font-semibold text-petrol-700">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
            Kijk: de intrinsieke waarde begint pas te groeien{" "}
            {type === "call" ? "voorbij" : "onder"} de strike van {eur(STRIKE)}
            , en de tijdswaarde piekt er precies bovenop. Daar is de spanning —
            en dus de prijs van hoop — het grootst.
          </p>
        )}
      </div>

      {/* Tijdswaarde-bult over het koersbereik */}
      <div className="mt-4 rounded-xl border border-petrol-200 bg-white p-3 sm:p-4">
        <h4 className="px-1 text-sm font-bold uppercase tracking-wide text-petrol-700">
          Tijdswaarde per koers, bij {dagen} {dagen === 1 ? "dag" : "dagen"} looptijd
        </h4>
        <svg
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label={`Tijdswaarde van de ${type} per koers van Zeewind NV; de bult piekt rond de strike van 42 euro`}
          className="mt-2 w-full"
        >
          {/* horizontale hulplijnen */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD.l}
              y1={naarY(curve.max * 1.1 * f)}
              x2={B - PAD.r}
              y2={naarY(curve.max * 1.1 * f)}
              stroke="#e3e8f0"
              strokeWidth={1}
            />
          ))}
          {/* nullijn */}
          <line
            x1={PAD.l}
            y1={naarY(0)}
            x2={B - PAD.r}
            y2={naarY(0)}
            stroke="#9aa2ad"
            strokeWidth={1}
          />
          {/* y-aslabels */}
          {[0, 0.5, 1].map((f) => (
            <text
              key={f}
              x={PAD.l - 6}
              y={naarY(curve.max * 1.1 * f) + 3.5}
              textAnchor="end"
              fontSize={10}
              fill="#53565a"
            >
              {(curve.max * 1.1 * f).toLocaleString("nl-NL", {
                maximumFractionDigits: 1,
              })}
            </text>
          ))}
          {/* x-aslabels */}
          {[30, 35, 40, 45, 50, 55].map((koers) => (
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
          {/* strike-lijn */}
          <line
            x1={naarX(STRIKE)}
            y1={PAD.t}
            x2={naarX(STRIKE)}
            y2={H - PAD.b}
            stroke="#b98214"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text
            x={naarX(STRIKE)}
            y={PAD.t + 10}
            textAnchor="middle"
            fontSize={10}
            fontWeight={700}
            fill="#b98214"
          >
            strike {STRIKE}
          </text>
          {/* de tijdswaardecurve */}
          <path d={lijnPad} fill="none" stroke="#dda221" strokeWidth={2.5} />
          {/* marker op de huidige koers */}
          <line
            x1={naarX(spot)}
            y1={naarY(tijdswaarde)}
            x2={naarX(spot)}
            y2={H - PAD.b}
            stroke="#0f7680"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.6}
          />
          <circle
            cx={naarX(spot)}
            cy={naarY(tijdswaarde)}
            r={5}
            fill="#0f7680"
            stroke="#fff"
            strokeWidth={2}
          />
        </svg>
        <p className="mt-1 px-1 text-[11px] text-body">
          Horizontaal: koers Zeewind NV · verticaal: tijdswaarde in € per
          aandeel. De bult piekt at-the-money: precies op de strike is de
          onzekerheid — en dus de tijdswaarde — maximaal.
        </p>
      </div>

      {/* De kern van de les */}
      <div className="mt-4 rounded-xl bg-petrol-100/60 p-4 text-sm text-body">
        <strong className="text-ink">Wat je hier ziet:</strong> je betaalt bij
        een optie altijd voor twéé dingen. Het navy deel krijg je alleen als de
        koers meewerkt; het gouden deel verlies je hoe dan ook — elke dag een
        beetje, en het is precies nul op expiratie. Eerlijk is eerlijk:
        &ldquo;tijdswaarde&rdquo; is een verzamelnaam — er zit ook de verwachte
        beweeglijkheid (volatiliteit) van het aandeel in. Hoe wilder de markt
        het aandeel inschat, hoe dikker de goudlaag.
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze ontleding ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            De premies komen uit een theoretisch model (Black-Scholes) met een
            vaste volatiliteit van 25%. Echte optieprijzen wijken daarvan af,
            juist omdat de markt de volatiliteit continu bijstelt.
          </li>
          <li>
            Rente en dividend zijn hier op nul gezet; die verschuiven de
            verhouding in het echt een klein beetje.
          </li>
          <li>
            Zeewind NV bestaat niet. Leerdoel is de opbouw van een premie zíén,
            geen echte optie waarderen — en dit is geen beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
