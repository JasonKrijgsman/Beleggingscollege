"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Timer } from "lucide-react";
import { bsGreeks, bsPrijs } from "@/lib/opties";

// Hoort bij de les "Theta en gamma" (cursus Volatiliteit & Spreads, accent
// petrol). Twee calls op het fictieve aandeel Zeewind NV (koers vast op
// EUR 42, IV 25%): één at-the-money (strike 42) en één verder
// out-of-the-money (strike 48). De cursist sleept "vandaag" over de
// tijdas — die loopt van 90 dagen links naar 0 rechts — en ziet de waarde
// niet-lineair wegsmelten. Daaronder: theta per dag als staafjes, die in de
// laatste twee weken exploderen.

const SPOT = 42;
const IV = 0.25;
const STRIKE_ATM = 42;
const STRIKE_OTM = 48;
const MAX_DAGEN = 90;

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

function waardeBij(strike: number, dagen: number): number {
  return bsPrijs({ type: "call", spot: SPOT, strike, dagen, iv: IV });
}

function thetaPerDag(strike: number, dagen: number): number {
  return bsGreeks({ type: "call", spot: SPOT, strike, dagen, iv: IV }).theta;
}

export default function OptieTijdvervalTool() {
  const [dagen, setDagen] = useState(60);
  const [sleept, setSleept] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const schuifId = useId();

  // Beide waardecurves over de hele tijdas, eenmalig — spot en IV staan vast.
  const curves = useMemo(() => {
    const atm: { dagen: number; waarde: number }[] = [];
    const otm: { dagen: number; waarde: number }[] = [];
    let max = 0;
    for (let d = MAX_DAGEN; d >= 0; d--) {
      const wAtm = waardeBij(STRIKE_ATM, d);
      const wOtm = waardeBij(STRIKE_OTM, d);
      atm.push({ dagen: d, waarde: wAtm });
      otm.push({ dagen: d, waarde: wOtm });
      if (wAtm > max) max = wAtm;
      if (wOtm > max) max = wOtm;
    }
    return { atm, otm, max };
  }, []);

  // Theta-staafjes per dag (dag 90 t/m 1; op dag 0 is er niets meer te
  // vervallen). We tonen de absolute waarde: hoeveel er die dag wegsmelt.
  const thetas = useMemo(() => {
    const rijen: { dagen: number; atm: number; otm: number }[] = [];
    let max = 0;
    for (let d = MAX_DAGEN; d >= 1; d--) {
      const a = Math.abs(thetaPerDag(STRIKE_ATM, d));
      const o = Math.abs(thetaPerDag(STRIKE_OTM, d));
      rijen.push({ dagen: d, atm: a, otm: o });
      if (a > max) max = a;
      if (o > max) max = o;
    }
    return { rijen, max };
  }, []);

  const waardeAtm = waardeBij(STRIKE_ATM, dagen);
  const waardeOtm = waardeBij(STRIKE_OTM, dagen);
  const thetaAtm = dagen >= 1 ? thetaPerDag(STRIKE_ATM, dagen) : 0;
  const thetaOtm = dagen >= 1 ? thetaPerDag(STRIKE_OTM, dagen) : 0;

  // --- SVG-coördinaten -----------------------------------------------------
  // De tijdas loopt van 90 dagen (links) naar 0 (rechts): vandaag schuift
  // naar expiratie toe, zoals je het ook beleeft.
  const B = 640;
  const H = 260;
  const HB = 150; // hoogte theta-staafgrafiek
  const PAD = { l: 46, r: 14, b: 26, t: 12 };
  const plotB = B - PAD.l - PAD.r;

  const naarX = (d: number) => PAD.l + ((MAX_DAGEN - d) / MAX_DAGEN) * plotB;
  const naarY = (w: number) =>
    PAD.t + (1 - w / (curves.max * 1.08)) * (H - PAD.t - PAD.b);
  const naarYTheta = (t: number) =>
    PAD.t + (1 - t / (thetas.max * 1.08)) * (HB - PAD.t - PAD.b);

  const pad = (punten: { dagen: number; waarde: number }[]) =>
    punten
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${naarX(p.dagen).toFixed(1)},${naarY(p.waarde).toFixed(1)}`
      )
      .join(" ");

  // --- Slepen op de grafiek ------------------------------------------------
  const dagenVanPointer = (e: React.PointerEvent<SVGSVGElement>): number => {
    const svg = svgRef.current;
    if (!svg) return dagen;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * B;
    const frac = klem((x - PAD.l) / plotB, 0, 1);
    return Math.round(MAX_DAGEN - frac * MAX_DAGEN);
  };

  const bijPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setSleept(true);
    setDagen(dagenVanPointer(e));
  };
  const bijPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (sleept) setDagen(dagenVanPointer(e));
  };
  const bijPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setSleept(false);
  };

  const dagLabels = [90, 75, 60, 45, 30, 15, 0];
  const laatsteTweeWekenX = naarX(14);

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <Timer className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">
        Tijdverval: kijk je optie smelten
      </h3>
      <p className="mt-1 text-sm text-body">
        Twee calls op het fictieve aandeel Zeewind NV, koers vast op {eur(SPOT)}
        : één at-the-money (strike {eur(STRIKE_ATM)}) en één out-of-the-money
        (strike {eur(STRIKE_OTM)}). Sleep de &ldquo;vandaag&rdquo;-lijn naar
        rechts — richting expiratie — en zie de waarde wegsmelten. Niet
        gelijkmatig: het smelten versnelt.
      </p>

      {/* Waardegrafiek met sleepbare vandaag-lijn */}
      <div className="mt-5 rounded-xl border border-petrol-200 bg-white p-3 sm:p-4">
        <h4 className="px-1 text-sm font-bold uppercase tracking-wide text-petrol-700">
          Optiewaarde terwijl de tijd verstrijkt
        </h4>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label={`Waarde van twee calls op Zeewind NV naarmate expiratie nadert; vandaag staat op ${dagen} dagen voor expiratie. Gebruik de schuif onder de grafiek om vandaag te verplaatsen.`}
          className={`mt-2 w-full ${sleept ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ touchAction: "none" }}
          onPointerDown={bijPointerDown}
          onPointerMove={bijPointerMove}
          onPointerUp={bijPointerUp}
          onPointerCancel={bijPointerUp}
        >
          {/* de laatste twee weken licht gemarkeerd */}
          <rect
            x={laatsteTweeWekenX}
            y={PAD.t}
            width={naarX(0) - laatsteTweeWekenX}
            height={H - PAD.t - PAD.b}
            fill="#fdf3d7"
            opacity={0.6}
          />
          {/* hulplijnen + y-labels */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line
                x1={PAD.l}
                y1={naarY(curves.max * 1.08 * f)}
                x2={B - PAD.r}
                y2={naarY(curves.max * 1.08 * f)}
                stroke="#e3e8f0"
                strokeWidth={1}
              />
              <text
                x={PAD.l - 6}
                y={naarY(curves.max * 1.08 * f) + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="#53565a"
              >
                {(curves.max * 1.08 * f).toLocaleString("nl-NL", {
                  maximumFractionDigits: 1,
                })}
              </text>
            </g>
          ))}
          <line
            x1={PAD.l}
            y1={naarY(0)}
            x2={B - PAD.r}
            y2={naarY(0)}
            stroke="#9aa2ad"
            strokeWidth={1}
          />
          {/* x-labels: van 90 links naar 0 rechts */}
          {dagLabels.map((d) => (
            <text
              key={d}
              x={naarX(d)}
              y={H - 8}
              textAnchor="middle"
              fontSize={10}
              fill="#53565a"
            >
              {d}
            </text>
          ))}
          {/* de twee waardelijnen */}
          <path d={pad(curves.atm)} fill="none" stroke="#0f7680" strokeWidth={2.5} />
          <path
            d={pad(curves.otm)}
            fill="none"
            stroke="#45b2b4"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          {/* vandaag-lijn met greep */}
          <line
            x1={naarX(dagen)}
            y1={PAD.t}
            x2={naarX(dagen)}
            y2={H - PAD.b}
            stroke="#b98214"
            strokeWidth={2}
          />
          <circle
            cx={naarX(dagen)}
            cy={naarY(waardeAtm)}
            r={5}
            fill="#0f7680"
            stroke="#fff"
            strokeWidth={2}
          />
          <circle
            cx={naarX(dagen)}
            cy={naarY(waardeOtm)}
            r={5}
            fill="#45b2b4"
            stroke="#fff"
            strokeWidth={2}
          />
          <g transform={`translate(${naarX(dagen)}, ${PAD.t})`}>
            <rect
              x={-32}
              y={0}
              width={64}
              height={16}
              rx={8}
              fill="#b98214"
            />
            <text
              x={0}
              y={11.5}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#fff"
            >
              vandaag
            </text>
          </g>
        </svg>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-body">
          <span>
            Horizontaal: dagen tot expiratie (90 links → 0 rechts, vandaag
            schuift naar expiratie) · verticaal: optiewaarde in € per aandeel
          </span>
          <span className="font-semibold text-goud-600">
            geel vlak = laatste twee weken
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs font-semibold">
          <span className="text-petrol-700">— call strike 42 (at-the-money)</span>
          <span className="text-petrol-400">- - call strike 48 (out-of-the-money)</span>
        </div>

        {/* Schuif als toegankelijk alternatief voor het slepen */}
        <div className="mt-3 border-t border-lijn pt-3">
          <label htmlFor={schuifId} className="block text-xs font-semibold text-body">
            Vandaag verplaatsen (dagen tot expiratie)
          </label>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              id={schuifId}
              type="range"
              min={0}
              max={MAX_DAGEN}
              step={1}
              value={MAX_DAGEN - dagen}
              onChange={(e) => setDagen(MAX_DAGEN - Number(e.target.value))}
              className="w-full flex-1 accent-petrol-600"
            />
            <span className="w-24 shrink-0 text-right text-sm font-bold text-ink">
              {dagen} {dagen === 1 ? "dag" : "dagen"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-body">
            Schuiven naar rechts = dichter bij expiratie, net als in de grafiek.
          </p>
        </div>
      </div>

      {/* Uitlezing op de vandaag-lijn */}
      <div aria-live="polite" className="mt-4 grid gap-3 text-center sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Waarde ATM-call (strike 42)
          </div>
          <div className="mt-1 text-lg font-extrabold text-petrol-700">
            {eur(waardeAtm * 100)}
          </div>
          <div className="text-[11px] text-body">per contract (×100)</div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Waarde OTM-call (strike 48)
          </div>
          <div className="mt-1 text-lg font-extrabold text-petrol-500">
            {eur(waardeOtm * 100)}
          </div>
          <div className="text-[11px] text-body">per contract (×100)</div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Theta per dag, op vandaag
          </div>
          <div className="mt-1 text-lg font-extrabold text-oranje-700">
            {dagen >= 1 ? eur(thetaAtm * 100) : "—"}
          </div>
          <div className="text-[11px] text-body">
            ATM, per contract · OTM: {dagen >= 1 ? eur(thetaOtm * 100) : "—"}
          </div>
        </div>
      </div>

      {/* Theta-staafgrafiek */}
      <div className="mt-4 rounded-xl border border-petrol-200 bg-white p-3 sm:p-4">
        <h4 className="px-1 text-sm font-bold uppercase tracking-wide text-petrol-700">
          Hoeveel smelt er per dag? (theta, in € per contract)
        </h4>
        <svg
          viewBox={`0 0 ${B} ${HB}`}
          role="img"
          aria-label="Staafgrafiek van het dagelijkse tijdverval per resterende dag; de staven worden veel hoger in de laatste twee weken"
          className="mt-2 w-full"
        >
          <rect
            x={laatsteTweeWekenX}
            y={PAD.t}
            width={naarX(0) - laatsteTweeWekenX}
            height={HB - PAD.t - PAD.b}
            fill="#fdf3d7"
            opacity={0.6}
          />
          <line
            x1={PAD.l}
            y1={HB - PAD.b}
            x2={B - PAD.r}
            y2={HB - PAD.b}
            stroke="#9aa2ad"
            strokeWidth={1}
          />
          {[0.5, 1].map((f) => (
            <text
              key={f}
              x={PAD.l - 6}
              y={naarYTheta(thetas.max * 1.08 * f) + 3.5}
              textAnchor="end"
              fontSize={10}
              fill="#53565a"
            >
              {(thetas.max * 1.08 * f * 100).toLocaleString("nl-NL", {
                maximumFractionDigits: 0,
              })}
            </text>
          ))}
          {thetas.rijen.map((rij) => {
            const x = naarX(rij.dagen);
            const brede = (plotB / MAX_DAGEN) * 0.82;
            const isVandaag = rij.dagen === dagen;
            return (
              <g key={rij.dagen}>
                <rect
                  x={x - brede / 2}
                  y={naarYTheta(rij.atm)}
                  width={brede}
                  height={HB - PAD.b - naarYTheta(rij.atm)}
                  fill={isVandaag ? "#b98214" : "#0f7680"}
                  opacity={isVandaag ? 1 : 0.75}
                />
              </g>
            );
          })}
          {dagLabels.map((d) => (
            <text
              key={d}
              x={naarX(d)}
              y={HB - 8}
              textAnchor="middle"
              fontSize={10}
              fill="#53565a"
            >
              {d}
            </text>
          ))}
        </svg>
        <p className="mt-1 px-1 text-[11px] text-body">
          Staven: dagelijks tijdverval van de ATM-call (strike 42); de gouden
          staaf is vandaag. In de laatste twee weken exploderen ze — daar is
          elke dag wachten het duurst.
        </p>
      </div>

      {/* De kern van de les */}
      <div className="mt-4 rounded-xl bg-petrol-100/60 p-4 text-sm text-body">
        <strong className="text-ink">Wat je hier ziet:</strong> de laatste 30
        dagen zijn voor de kóper de duurste — het verval versnelt richting
        expiratie. Precies daarom schrijven premieverkopers graag korte
        looptijden (zij vangen het snelste verval) en kopen optiekopers liever
        wat langer, zodat hun gelijk de tijd krijgt. Eén eerlijke nuance: die
        klassieke versnellende curve geldt voor de at-the-money-optie. De
        out-of-the-money-lijn (strike 48) gedraagt zich anders — haar verval
        piekt eerder en dooft tegen het einde juist uit, omdat er dan simpelweg
        weinig hoop meer te verdampen valt. Daarom staan er twee lijnen in de
        grafiek.
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze verkenner ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            De koers staat hier stil op {eur(SPOT)} en de volatiliteit op 25% —
            in het echt bewegen die elke dag mee en overstemmen ze het
            tijdverval soms volledig.
          </li>
          <li>
            Theta komt uit het Black-Scholes-model; vlak voor expiratie is dat
            een benadering, geen belofte.
          </li>
          <li>
            Zeewind NV bestaat niet. Leerdoel is het vervalpatroon herkennen,
            niet een handelsmoment kiezen — en dit is geen beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
