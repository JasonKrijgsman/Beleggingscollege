"use client";

import { useId, useMemo, useState } from "react";
import { Gauge, TriangleAlert } from "lucide-react";

// Hoort bij de les "De hefboom" (cursus Hefboomproducten, accent oranje).
// Fictieve index NLX op 900 punten, inleg EUR 1.000, drie voertuigen naast
// elkaar: gewoon indexbeleggen, een turbo long en een CFD. De kern van de les
// zit in scenario twee: de index dipt en herstelt, de indexbelegger eindigt
// in de plus — maar de turbo met hoge hefboom raakte onderweg de knock-out
// en is alles kwijt. De machine uitgelegd; de getallen doen het woord.

const START = 900; // beginstand NLX
const INLEG = 1000; // EUR
const DAGEN = 60;
const FINANCIERING_PER_DAG = 0.0001; // 0,01% per dag, × hefboom × inleg (CFD)

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function punten(n: number): string {
  return `${n.toLocaleString("nl-NL", { maximumFractionDigits: 1 })} punten`;
}

function pct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toLocaleString("nl-NL", { maximumFractionDigits: 1 })}%`;
}

function klem(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/* Deterministische koerspaden: vaste formules, geen toeval. De kleine golf
   wordt aan de uiteinden gecorrigeerd zodat elk pad exact op zijn beloofde
   eindstand uitkomt. */
function maakPad(basis: (d: number) => number, golf: (d: number) => number): number[] {
  const g0 = golf(0);
  const g60 = golf(DAGEN);
  const pad: number[] = [];
  for (let d = 0; d <= DAGEN; d++) {
    const gecorrigeerd = golf(d) - g0 - ((g60 - g0) * d) / DAGEN;
    pad.push(START * (1 + basis(d) + gecorrigeerd));
  }
  return pad;
}

const PAD_RUSTIG = maakPad(
  (d) => (0.06 * d) / DAGEN,
  (d) => 0.008 * Math.sin(d / 3.1) + 0.005 * Math.sin(d / 7.3 + 1)
);

// De sleutel van de les: eerst een dip van zo'n −9%, daarna herstel naar +4%.
const PAD_DIP = maakPad(
  (d) =>
    d <= 18
      ? -0.088 * ((1 - Math.cos((Math.PI * d) / 18)) / 2)
      : -0.088 + 0.128 * ((1 - Math.cos((Math.PI * (d - 18)) / 42)) / 2),
  (d) => 0.003 * Math.sin(d / 2.3)
);

const PAD_DALING = maakPad(
  (d) => (-0.12 * d) / DAGEN,
  (d) => 0.004 * Math.sin(d / 3.3)
);

type ScenarioId = "rustig" | "dip" | "daling";

const SCENARIOS: { id: ScenarioId; naam: string; uitleg: string; pad: number[] }[] = [
  {
    id: "rustig",
    naam: "Rustig omhoog (+6%)",
    uitleg: "De index kabbelt met kleine dipjes naar +6%.",
    pad: PAD_RUSTIG,
  },
  {
    id: "dip",
    naam: "Eerst een dip, dan herstel (+4%)",
    uitleg: "De index zakt eerst zo'n 9%, herstelt daarna en eindigt op +4%.",
    pad: PAD_DIP,
  },
  {
    id: "daling",
    naam: "Gestaag omlaag (−12%)",
    uitleg: "De index glijdt zestig dagen lang af naar −12%.",
    pad: PAD_DALING,
  },
];

function financieringsniveau(hefboom: number): number {
  return START * (1 - 1 / hefboom);
}

function knockoutNiveau(hefboom: number): number {
  return financieringsniveau(hefboom) * 1.02;
}

type TurboUitkomst =
  | { geknockt: true; dag: number; eindwaarde: 0 }
  | { geknockt: false; eindwaarde: number };

function turboUitkomst(pad: number[], hefboom: number): TurboUitkomst {
  const f = financieringsniveau(hefboom);
  const ko = knockoutNiveau(hefboom);
  const aantal = INLEG / (START - f); // turboprijs = index − financieringsniveau
  for (let d = 0; d < pad.length; d++) {
    if (pad[d] <= ko) return { geknockt: true, dag: d, eindwaarde: 0 };
  }
  return { geknockt: false, eindwaarde: aantal * (pad[pad.length - 1] - f) };
}

type CfdUitkomst =
  | { gesloten: true; dag: number; eindwaarde: 0 }
  | { gesloten: false; eindwaarde: number; koersresultaat: number; financiering: number };

function cfdUitkomst(pad: number[], hefboom: number): CfdUitkomst {
  for (let d = 0; d < pad.length; d++) {
    const koersresultaat = INLEG * hefboom * (pad[d] / START - 1);
    const financiering = INLEG * FINANCIERING_PER_DAG * hefboom * d;
    if (INLEG + koersresultaat - financiering <= 0) {
      return { gesloten: true, dag: d, eindwaarde: 0 };
    }
  }
  const eind = pad[pad.length - 1];
  const koersresultaat = INLEG * hefboom * (eind / START - 1);
  const financiering = INLEG * FINANCIERING_PER_DAG * hefboom * DAGEN;
  return {
    gesloten: false,
    eindwaarde: INLEG + koersresultaat - financiering,
    koersresultaat,
    financiering,
  };
}

function indexUitkomst(pad: number[]): number {
  return (INLEG * pad[pad.length - 1]) / START;
}

export default function HefboomSimulatorTool() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("dip");
  const [hefboom, setHefboom] = useState(5);
  const hefboomId = useId();
  const hefboomLabelId = useId();

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const pad = scenario.pad;

  const f = financieringsniveau(hefboom);
  const ko = knockoutNiveau(hefboom);
  const turbo = useMemo(() => turboUitkomst(pad, hefboom), [pad, hefboom]);
  const cfd = useMemo(() => cfdUitkomst(pad, hefboom), [pad, hefboom]);
  const indexWaarde = indexUitkomst(pad);
  const eindstand = pad[pad.length - 1];
  const hersteldeNaKnock = turbo.geknockt && eindstand > ko;

  const vergelijking = useMemo(
    () =>
      [2, 5, 10].map((h) => ({
        hefboom: h,
        turbo: turboUitkomst(pad, h),
        cfd: cfdUitkomst(pad, h),
      })),
    [pad]
  );

  // SVG-coördinaten
  const B = 640;
  const H = 300;
  const PAD_SVG = { l: 50, r: 14, b: 26, t: 12 };
  const yMin = Math.min(...pad, ko) - 15;
  const yMax = Math.max(...pad) + 15;
  const naarX = (dag: number) => PAD_SVG.l + (dag / DAGEN) * (B - PAD_SVG.l - PAD_SVG.r);
  const naarY = (stand: number) =>
    PAD_SVG.t + (1 - (stand - yMin) / (yMax - yMin)) * (H - PAD_SVG.t - PAD_SVG.b);
  const lijnPad = pad
    .map((stand, d) => `${d === 0 ? "M" : "L"}${naarX(d).toFixed(1)},${naarY(stand).toFixed(1)}`)
    .join(" ");
  const yTicks = [0, 1, 2, 3].map((i) => Math.round(yMin + ((yMax - yMin) * i) / 3));

  return (
    <div className="my-8 rounded-2xl border-2 border-oranje-200 bg-oranje-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-oranje-700">
        <Gauge className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">Hefboom-simulator</h3>
      <p className="mt-1 text-sm text-body">
        Je belegt {eur(INLEG)} in de fictieve index NLX (stand: 900 punten).
        Kies een koersverloop en een hefboom, en vergelijk drie manieren om
        dezelfde {eur(INLEG)} in te zetten: gewoon in de index, via een turbo
        long, en via een CFD. Zelfde markt, drie totaal verschillende
        uitkomsten — dat verschil is de hefboom.
      </p>

      {/* Scenario-keuze */}
      <div className="mt-5">
        <div className="text-xs font-bold uppercase tracking-wide text-body">
          Kies het koersverloop (60 dagen)
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={scenarioId === s.id}
              onClick={() => setScenarioId(s.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                scenarioId === s.id
                  ? "border-oranje-600 bg-oranje-600 text-white"
                  : "border-oranje-200 bg-white text-oranje-700 hover:bg-oranje-50"
              }`}
            >
              {s.naam}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-body">{scenario.uitleg}</p>
      </div>

      {/* Hefboom-schuif */}
      <div className="mt-5">
        <label
          id={hefboomLabelId}
          htmlFor={hefboomId}
          className="block text-sm font-semibold text-body"
        >
          Hefboom (voor de turbo én de CFD)
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            aria-labelledby={hefboomLabelId}
            min={2}
            max={10}
            step={1}
            value={hefboom}
            onChange={(e) => setHefboom(Number(e.target.value))}
            className="w-full flex-1 accent-oranje-600"
          />
          <div className="flex shrink-0 items-center gap-1.5">
            <input
              id={hefboomId}
              type="number"
              inputMode="numeric"
              min={2}
              max={10}
              step={1}
              value={hefboom}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) setHefboom(klem(Math.round(n), 2, 10));
              }}
              className="w-16 rounded-lg border border-lijn bg-white px-2 py-2 text-right text-sm font-bold text-ink focus:border-oranje-400 focus:outline-none focus:ring-2 focus:ring-oranje-200"
            />
            <span className="text-sm font-semibold text-body">×</span>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-body">
          Turbo: financieringsniveau {punten(f)} (de uitgever legt dat deel
          bij), knock-out rond {punten(ko)} — dat is{" "}
          {pct(((ko - START) / START) * 100)} vanaf de huidige stand. Raakt de
          index dat niveau, dan wordt de turbo direct beëindigd.
        </p>
      </div>

      {/* De grafiek */}
      <div className="mt-5 rounded-xl border border-oranje-200 bg-white p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label={`Koersverloop NLX, scenario ${scenario.naam}, met de knock-out van de turbo als rode lijn op ${punten(ko)}`}
          className="w-full"
        >
          {yTicks.map((stand) => (
            <g key={stand}>
              <line
                x1={PAD_SVG.l}
                y1={naarY(stand)}
                x2={B - PAD_SVG.r}
                y2={naarY(stand)}
                stroke="#e3e8f0"
                strokeWidth={1}
              />
              <text
                x={PAD_SVG.l - 6}
                y={naarY(stand) + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="#53565a"
              >
                {stand}
              </text>
            </g>
          ))}
          {[0, 15, 30, 45, 60].map((dag) => (
            <text
              key={dag}
              x={naarX(dag)}
              y={H - 8}
              textAnchor="middle"
              fontSize={10}
              fill="#53565a"
            >
              dag {dag}
            </text>
          ))}
          {/* startstand */}
          <line
            x1={PAD_SVG.l}
            y1={naarY(START)}
            x2={B - PAD_SVG.r}
            y2={naarY(START)}
            stroke="#9aa2ad"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          {/* knock-outniveau van de turbo */}
          <line
            x1={PAD_SVG.l}
            y1={naarY(ko)}
            x2={B - PAD_SVG.r}
            y2={naarY(ko)}
            stroke="#dc2626"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text
            x={B - PAD_SVG.r - 4}
            y={naarY(ko) - 5}
            textAnchor="end"
            fontSize={10}
            fontWeight={700}
            fill="#dc2626"
          >
            knock-out turbo ({Math.round(ko)})
          </text>
          {/* het indexpad */}
          <path d={lijnPad} fill="none" stroke="#53565a" strokeWidth={2.5} />
          {/* markering van de knock-outdag */}
          {turbo.geknockt && (
            <g>
              <circle
                cx={naarX(turbo.dag)}
                cy={naarY(pad[turbo.dag])}
                r={5}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={naarX(turbo.dag)}
                y={naarY(pad[turbo.dag]) + 18}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#dc2626"
              >
                uitgeknockt (dag {turbo.dag})
              </text>
            </g>
          )}
        </svg>
        <div className="mt-1 text-[11px] text-body">
          Horizontaal: dagen · verticaal: indexstand NLX · gestippeld grijs:
          startstand 900 · rood: knock-outniveau van de turbo bij hefboom{" "}
          {hefboom}×
        </div>
      </div>

      {/* De drie uitkomsten */}
      <div aria-live="polite" className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-lijn bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Indexbelegging (geen hefboom)
          </div>
          <div
            className={`mt-1 text-xl font-extrabold ${
              indexWaarde >= INLEG ? "text-groen-700" : "text-oranje-700"
            }`}
          >
            {eur(indexWaarde)}
          </div>
          <p className="mt-1 text-xs text-body">
            De index eindigt op {pct(((eindstand - START) / START) * 100)}, jouw{" "}
            {eur(INLEG)} beweegt één-op-één mee. Een tussentijdse dip doet
            pijn, maar gooit je er niet uit.
          </p>
        </div>
        <div
          className={`rounded-xl border p-4 ${
            turbo.geknockt ? "border-oranje-200 bg-oranje-50" : "border-lijn bg-white"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Turbo long, hefboom {hefboom}×
          </div>
          {turbo.geknockt ? (
            <>
              <div className="mt-1 text-xl font-extrabold text-oranje-700">{eur(0)}</div>
              <p className="mt-1 text-xs font-semibold text-oranje-700">
                Uitgeknockt op dag {turbo.dag}
                {hersteldeNaKnock ? " — ook al herstelde de koers daarna" : ""}.
              </p>
              <p className="mt-1 text-xs text-body">
                De index raakte het knock-outniveau van {punten(ko)} en de
                turbo werd direct beëindigd. Wat de index daarná deed, telt
                voor jou niet meer mee.
              </p>
            </>
          ) : (
            <>
              <div
                className={`mt-1 text-xl font-extrabold ${
                  turbo.eindwaarde >= INLEG ? "text-groen-700" : "text-oranje-700"
                }`}
              >
                {eur(turbo.eindwaarde)}
              </div>
              <p className="mt-1 text-xs text-body">
                De knock-out van {punten(ko)} werd nergens geraakt, dus de
                hefboom werkte de hele rit: elke procent van de index telde
                ruwweg {hefboom}× door.
              </p>
            </>
          )}
        </div>
        <div
          className={`rounded-xl border p-4 ${
            cfd.gesloten ? "border-oranje-200 bg-oranje-50" : "border-lijn bg-white"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            CFD, hefboom {hefboom}×
          </div>
          {cfd.gesloten ? (
            <>
              <div className="mt-1 text-xl font-extrabold text-oranje-700">{eur(0)}</div>
              <p className="mt-1 text-xs font-semibold text-oranje-700">
                Positie gesloten op dag {cfd.dag} (margin call).
              </p>
              <p className="mt-1 text-xs text-body">
                Het verlies at je hele inleg op; je broker sloot de positie
                voordat je onder nul kon zakken.
              </p>
            </>
          ) : (
            <>
              <div
                className={`mt-1 text-xl font-extrabold ${
                  cfd.eindwaarde >= INLEG ? "text-groen-700" : "text-oranje-700"
                }`}
              >
                {eur(cfd.eindwaarde)}
              </div>
              <p className="mt-1 text-xs text-body">
                Koersresultaat {cfd.koersresultaat >= 0 ? "+" : ""}
                {eur(cfd.koersresultaat)}, mín {eur(cfd.financiering)}{" "}
                financieringskosten (0,01% per dag × hefboom). Geen knock-out,
                wel een kostenkraan die elke dag doordruppelt.
              </p>
            </>
          )}
        </div>
      </div>

      {scenarioId === "dip" && turbo.geknockt && (
        <p className="mt-3 flex items-start gap-1.5 text-sm font-semibold text-oranje-700">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Dit is dé les van de hefboom: de indexbelegger zat dezelfde dip uit en
          eindigde op {eur(indexWaarde)} — de turbo was op dag {turbo.dag} al
          definitief {eur(0)} waard. Gelijk hebben over de richting was niet
          genoeg; je moest ook de tussenweg overleven.
        </p>
      )}

      {/* Wat als je een andere hefboom had gekozen? */}
      <div className="mt-6 rounded-xl border border-oranje-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold uppercase tracking-wide text-oranje-700">
          Wat als je een andere hefboom had gekozen?
        </h4>
        <p className="mt-1 text-xs text-body">
          Zelfde koersverloop ({scenario.naam.toLowerCase()}), zelfde inleg van{" "}
          {eur(INLEG)} — alleen de hefboom verschilt.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-lijn text-xs font-bold uppercase tracking-wide text-body">
                <th className="py-2 pr-3">Hefboom</th>
                <th className="py-2 pr-3">Turbo long</th>
                <th className="py-2">CFD (na kosten)</th>
              </tr>
            </thead>
            <tbody>
              {vergelijking.map((rij) => (
                <tr key={rij.hefboom} className="border-b border-lijn/60 last:border-0">
                  <td className="py-2.5 pr-3 font-bold text-ink">{rij.hefboom}×</td>
                  <td className="py-2.5 pr-3">
                    {rij.turbo.geknockt ? (
                      <span className="font-semibold text-oranje-700">
                        uitgeknockt op dag {rij.turbo.dag} → {eur(0)}
                      </span>
                    ) : (
                      <span
                        className={`font-semibold ${
                          rij.turbo.eindwaarde >= INLEG ? "text-groen-700" : "text-ink"
                        }`}
                      >
                        {eur(rij.turbo.eindwaarde)}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5">
                    {rij.cfd.gesloten ? (
                      <span className="font-semibold text-oranje-700">
                        margin call op dag {rij.cfd.dag} → {eur(0)}
                      </span>
                    ) : (
                      <span
                        className={`font-semibold ${
                          rij.cfd.eindwaarde >= INLEG ? "text-groen-700" : "text-ink"
                        }`}
                      >
                        {eur(rij.cfd.eindwaarde)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-body">
          Een hogere hefboom vergroot niet alleen de uitslag — hij verkleint
          ook de buffer tot de knock-out. Meer hefboom is dus niet
          &quot;dezelfde belegging, maar sneller&quot;; het is een andere
          belegging met een kortere lont.
        </p>
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze simulator ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Echte turbo&apos;s en CFD&apos;s hebben daarbovenop spreads,
            gap-risico (een opening onder de knock-out) en de prijsstelling van
            de uitgever. In de praktijk pakken de uitkomsten dus wat slechter
            uit dan hier.
          </li>
          <li>
            Bij een echte turbo krijg je na een knock-out soms een kleine
            restwaarde terug; wij rekenen met nul, zoals het vaak genoeg ook
            echt afloopt.
          </li>
          <li>
            De NLX bestaat niet en de drie koerspaden zijn bedachte
            lesvoorbeelden — echte markten kennen oneindig veel varianten.
          </li>
          <li>
            Dit is een leermodel om de machine te snappen, geen aanrader vóór
            of tegen hefboomproducten — en geen beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
