"use client";

import { useId, useMemo, useState } from "react";
import { HandCoins, TriangleAlert } from "lucide-react";
import { bsPrijs } from "@/lib/opties";

// Hoort bij de les "De covered call" (cursus Beschermen & Verdienen, accent
// petrol). Je bezit 100 aandelen Zeewind NV, gekocht op EUR 42, en schrijft
// daar een call op. De simulator laat drie lijnen naast elkaar zien: alleen
// aandelen houden, de covered call, en — ter afschrikking — dezelfde call
// naakt schrijven zonder aandelen. De kern die de tool nét zo prominent
// toont als de ontvangen premie: boven de strike lever je je koerswinst in.

const KOOPPRIJS = 42;
const AANTAL = 100;
const IV = 0.25;
const LOOPTIJDEN = [30, 60, 90] as const;

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

/** Resultaat per 100 aandelen (heel contract), t.o.v. de koopprijs van 42. */
function resultaatAandelen(eindkoers: number): number {
  return (eindkoers - KOOPPRIJS) * AANTAL;
}
function resultaatCoveredCall(eindkoers: number, strike: number, premie: number): number {
  // Boven de strike worden de aandelen weggecalld op de strike: de
  // aandelenwinst is afgekapt, de premie houd je altijd.
  return (Math.min(eindkoers, strike) - KOOPPRIJS) * AANTAL + premie * AANTAL;
}
function resultaatNaakteCall(eindkoers: number, strike: number, premie: number): number {
  return (premie - Math.max(0, eindkoers - strike)) * AANTAL;
}

export default function GedektSchrijvenTool() {
  const [strike, setStrike] = useState(46);
  const [looptijd, setLooptijd] = useState<(typeof LOOPTIJDEN)[number]>(60);
  const [eindkoers, setEindkoers] = useState(42);
  const strikeId = useId();
  const eindkoersId = useId();

  // Ontvangen premie per aandeel: theoretische prijs, afgerond op 5 cent
  // zodat het als een echte optieprijs oogt. Deterministisch.
  const premie = useMemo(
    () =>
      Math.max(
        0.05,
        Math.round(
          bsPrijs({ type: "call", spot: KOOPPRIJS, strike, dagen: looptijd, iv: IV }) * 20
        ) / 20
      ),
    [strike, looptijd]
  );

  const grafiek = useMemo(() => {
    const van = 30;
    const tot = 60;
    const stappen = 120;
    const aandelen: { koers: number; w: number }[] = [];
    const covered: { koers: number; w: number }[] = [];
    const naakt: { koers: number; w: number }[] = [];
    for (let i = 0; i <= stappen; i++) {
      const koers = van + ((tot - van) * i) / stappen;
      aandelen.push({ koers, w: resultaatAandelen(koers) });
      covered.push({ koers, w: resultaatCoveredCall(koers, strike, premie) });
      naakt.push({ koers, w: resultaatNaakteCall(koers, strike, premie) });
    }
    const alles = [...aandelen, ...covered, ...naakt].map((p) => p.w);
    return {
      van,
      tot,
      aandelen,
      covered,
      naakt,
      yMin: Math.min(...alles) * 1.05,
      yMax: Math.max(...alles) * 1.08,
    };
  }, [strike, premie]);

  const bijEind = {
    aandelen: resultaatAandelen(eindkoers),
    covered: resultaatCoveredCall(eindkoers, strike, premie),
    naakt: resultaatNaakteCall(eindkoers, strike, premie),
  };
  const bovenStrike = eindkoers > strike;
  // Vanaf deze koers had "alleen aandelen" méér opgeleverd dan de covered
  // call: de strike plus de ontvangen premie.
  const spijtgrens = strike + premie;
  const gemist = bijEind.aandelen - bijEind.covered;

  // --- SVG-coördinaten -----------------------------------------------------
  const B = 640;
  const H = 300;
  const PAD = { l: 54, r: 14, b: 26, t: 12 };
  const naarX = (koers: number) =>
    PAD.l + ((koers - grafiek.van) / (grafiek.tot - grafiek.van)) * (B - PAD.l - PAD.r);
  const naarY = (w: number) =>
    PAD.t +
    (1 - (w - grafiek.yMin) / (grafiek.yMax - grafiek.yMin)) * (H - PAD.t - PAD.b);
  const pad = (punten: { koers: number; w: number }[]) =>
    punten
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${naarX(p.koers).toFixed(1)},${naarY(p.w).toFixed(1)}`
      )
      .join(" ");

  // Het "weggegeven" gebied: tussen de aandelenlijn en de covered-call-lijn,
  // vanaf de spijtgrens. Dit hoort net zo op te vallen als de premie.
  // Bewust geen useMemo: het is goedkoop stringwerk en naarX/naarY wisselen
  // toch elke render.
  const gemistVlak = (() => {
    if (spijtgrens >= grafiek.tot) return null;
    const boven = grafiek.aandelen.filter((p) => p.koers >= spijtgrens);
    const onder = grafiek.covered.filter((p) => p.koers >= spijtgrens).reverse();
    if (boven.length < 2) return null;
    return [...boven, ...onder]
      .map((p) => `${naarX(p.koers).toFixed(1)},${naarY(p.w).toFixed(1)}`)
      .join(" ");
  })();

  const yLabels = useMemo(() => {
    const labels: number[] = [];
    const stap = 500;
    for (
      let w = Math.ceil(grafiek.yMin / stap) * stap;
      w <= grafiek.yMax;
      w += stap
    ) {
      labels.push(w);
    }
    return labels;
  }, [grafiek.yMin, grafiek.yMax]);

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <HandCoins className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">Gedekt schrijven-simulator</h3>
      <p className="mt-1 text-sm text-body">
        Je bezit 100 aandelen Zeewind NV, gekocht op {eur(KOOPPRIJS)}. Je
        schrijft er een call op: je ontvangt direct premie, maar belooft je
        aandelen te verkopen op de strike als de koers daarboven eindigt. Kies
        een strike en een looptijd, en kijk éérst wat je krijgt — en daarna net
        zo goed wat je weggeeft.
      </p>

      {/* Invoer: strike en looptijd */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={strikeId} className="block text-sm font-semibold text-body">
            Strike van de geschreven call
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              aria-label="Strike van de geschreven call"
              min={44}
              max={52}
              step={1}
              value={strike}
              onChange={(e) => setStrike(Number(e.target.value))}
              className="w-full flex-1 accent-petrol-600"
            />
            <div className="flex shrink-0 items-center gap-1.5">
              <input
                id={strikeId}
                type="number"
                inputMode="numeric"
                min={44}
                max={52}
                step={1}
                value={strike}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) setStrike(klem(Math.round(n), 44, 52));
                }}
                className="w-20 rounded-lg border border-lijn bg-white px-2 py-2 text-right text-sm font-bold text-ink focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-200"
              />
              <span className="text-sm font-semibold text-body">€</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-body">
            Verder boven de koers = minder premie, maar meer ruimte voor
            koerswinst vóór je wordt weggecalld.
          </p>
        </div>
        <div>
          <span className="block text-sm font-semibold text-body">Looptijd</span>
          <div className="mt-2 flex overflow-hidden rounded-lg border border-lijn text-sm font-semibold">
            {LOOPTIJDEN.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={looptijd === d}
                onClick={() => setLooptijd(d)}
                className={`flex-1 px-4 py-2 transition ${
                  looptijd === d
                    ? "bg-petrol-600 text-white"
                    : "bg-white text-body hover:bg-petrol-50"
                }`}
              >
                {d} dgn
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-body">
            Langer lopen = meer premie, maar ook langer vastzitten aan je
            belofte.
          </p>
        </div>
      </div>

      {/* Kasboekje */}
      <div aria-live="polite" className="mt-5 rounded-xl border border-petrol-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-700">
          Je kasboekje bij het openen
        </h4>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-body">100 aandelen Zeewind NV à {eur(KOOPPRIJS)}</dt>
            <dd className="font-bold text-ink">{eur(KOOPPRIJS * AANTAL)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-body">
              Ontvangen premie ({eur(premie)} per aandeel × 100)
            </dt>
            <dd className="font-bold text-groen-700">+{eur(premie * AANTAL)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2 border-t border-lijn pt-2">
            <dt className="font-semibold text-ink">Totaal in positie</dt>
            <dd className="font-extrabold text-ink">
              {eur(KOOPPRIJS * AANTAL + premie * AANTAL)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 flex items-start gap-1.5 text-xs font-semibold text-oranje-700">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Die premie is geen gratis inkomen: je hebt er je opwaarts potentieel
          boven {eur(strike)} voor verkocht. Wat dat kost zie je hieronder.
        </p>
      </div>

      {/* Payoff-diagram met drie lijnen */}
      <div className="mt-4 rounded-xl border border-petrol-200 bg-white p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label="Resultaat op expiratie per eindkoers: alleen aandelen, covered call, en een naakte geschreven call ter vergelijking"
          className="w-full"
        >
          {/* hulplijnen + y-labels */}
          {yLabels.map((w) => (
            <g key={w}>
              <line
                x1={PAD.l}
                y1={naarY(w)}
                x2={B - PAD.r}
                y2={naarY(w)}
                stroke={w === 0 ? "#9aa2ad" : "#e3e8f0"}
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
                {w.toLocaleString("nl-NL")}
              </text>
            </g>
          ))}
          {[30, 35, 40, 45, 50, 55, 60].map((koers) => (
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
          {/* het weggegeven gebied boven de spijtgrens */}
          {gemistVlak && <polygon points={gemistVlak} fill="#fdd0a8" opacity={0.55} />}
          {/* strike-lijn met weggecalld-label */}
          <line
            x1={naarX(strike)}
            y1={PAD.t}
            x2={naarX(strike)}
            y2={H - PAD.b}
            stroke="#b98214"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text
            x={naarX(strike) + 4}
            y={PAD.t + 10}
            textAnchor="start"
            fontSize={10}
            fontWeight={700}
            fill="#b98214"
          >
            vanaf hier weggecalld op {eur(strike)}
          </text>
          {gemistVlak && (
            <text
              x={naarX(Math.min(grafiek.tot - 1, spijtgrens + (grafiek.tot - spijtgrens) / 2))}
              y={naarY(resultaatAandelen(spijtgrens + (grafiek.tot - spijtgrens) / 2)) - 8}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#ad430b"
            >
              dit geef je weg
            </text>
          )}
          {/* de drie lijnen: naakt dun oranje, aandelen blauw, covered dik petrol */}
          <path
            d={pad(grafiek.naakt)}
            fill="none"
            stroke="#ee6c12"
            strokeWidth={1.5}
            strokeDasharray="3 4"
          />
          <path d={pad(grafiek.aandelen)} fill="none" stroke="#0033a0" strokeWidth={2} />
          <path d={pad(grafiek.covered)} fill="none" stroke="#0f7680" strokeWidth={3.5} />
          {/* markers op de gekozen eindkoers */}
          <line
            x1={naarX(eindkoers)}
            y1={PAD.t}
            x2={naarX(eindkoers)}
            y2={H - PAD.b}
            stroke="#53565a"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.5}
          />
          <circle cx={naarX(eindkoers)} cy={naarY(bijEind.naakt)} r={4} fill="#ee6c12" stroke="#fff" strokeWidth={1.5} />
          <circle cx={naarX(eindkoers)} cy={naarY(bijEind.aandelen)} r={4} fill="#0033a0" stroke="#fff" strokeWidth={1.5} />
          <circle cx={naarX(eindkoers)} cy={naarY(bijEind.covered)} r={5} fill="#0f7680" stroke="#fff" strokeWidth={2} />
        </svg>
        <div className="mt-1 px-1 text-[11px] text-body">
          Horizontaal: eindkoers Zeewind NV op expiratie · verticaal: resultaat
          in € per 100 aandelen, t.o.v. je koopprijs van {eur(KOOPPRIJS)}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs font-semibold">
          <span className="text-navy-600">— alleen aandelen houden</span>
          <span className="text-petrol-700">━ covered call (aandelen + geschreven call)</span>
          <span className="text-oranje-500">- - alleen de call schrijven, zónder aandelen</span>
        </div>
        <p className="mt-2 px-1 text-xs text-body">
          Die dunne oranje lijn staat er ter contrast: een <em>naakte</em>{" "}
          geschreven call is een compleet ander dier — geen aandelen die je
          verlies dempen, en het verlies loopt bij stijging onbeperkt door.
        </p>
      </div>

      {/* Eindkoers-schuif + afrekening */}
      <div className="mt-4 rounded-xl border border-petrol-200 bg-white p-4 sm:p-5">
        <label htmlFor={eindkoersId} className="block text-sm font-semibold text-body">
          Stel: Zeewind NV staat op expiratie op…
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id={eindkoersId}
            type="range"
            min={30}
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

        <div aria-live="polite">
          <div className="mt-3 grid gap-3 text-center sm:grid-cols-3">
            <div className="rounded-lg bg-mist p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-body">
                Alleen aandelen
              </div>
              <div
                className={`mt-0.5 text-lg font-extrabold ${
                  bijEind.aandelen >= 0 ? "text-groen-700" : "text-oranje-700"
                }`}
              >
                {bijEind.aandelen >= 0 ? "+" : ""}
                {eur(bijEind.aandelen)}
              </div>
              <div className="text-[11px] text-body">per 100 aandelen</div>
            </div>
            <div className="rounded-lg border-2 border-petrol-200 bg-petrol-50 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-petrol-700">
                Covered call
              </div>
              <div
                className={`mt-0.5 text-lg font-extrabold ${
                  bijEind.covered >= 0 ? "text-groen-700" : "text-oranje-700"
                }`}
              >
                {bijEind.covered >= 0 ? "+" : ""}
                {eur(bijEind.covered)}
              </div>
              <div className="text-[11px] text-body">per 100 aandelen + premie</div>
            </div>
            <div className="rounded-lg bg-mist p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-body">
                Naakte call (ter contrast)
              </div>
              <div
                className={`mt-0.5 text-lg font-extrabold ${
                  bijEind.naakt >= 0 ? "text-groen-700" : "text-oranje-700"
                }`}
              >
                {bijEind.naakt >= 0 ? "+" : ""}
                {eur(bijEind.naakt)}
              </div>
              <div className="text-[11px] text-body">per contract (×100)</div>
            </div>
          </div>

          {/* De afrekening boven de strike */}
          {bovenStrike ? (
            <div className="mt-3 rounded-lg bg-goud-100 p-3 text-sm text-body">
              <strong className="text-ink">
                Je aandelen worden weggecalld op {eur(strike)}.
              </strong>{" "}
              De afrekening bij een eindkoers van {eur(eindkoers)}:
              aandelenresultaat afgekapt op ({eur(strike)} − {eur(KOOPPRIJS)}) ×
              100 = {eur((strike - KOOPPRIJS) * AANTAL)}, plus{" "}
              {eur(premie * AANTAL)} premie = {eur(bijEind.covered)} totaal.
              {gemist > 0 ? (
                <span className="mt-1 block font-semibold text-oranje-700">
                  Wie de aandelen gewoon had gehouden, had {eur(bijEind.aandelen)}{" "}
                  verdiend — je laat dus {eur(gemist)} liggen. Dát is de echte
                  prijs van de premie.
                </span>
              ) : (
                <span className="mt-1 block font-semibold text-groen-700">
                  Tot een eindkoers van {eur(spijtgrens)} blijft de covered call
                  hier nog vóór liggen op alleen aandelen, dankzij de premie.
                </span>
              )}
            </div>
          ) : (
            <p className="mt-3 rounded-lg bg-mist p-3 text-sm text-body">
              Onder de strike verloopt de call waardeloos: je houdt je aandelen
              én de premie van {eur(premie * AANTAL)}. De covered call ligt hier
              altijd {eur(premie * AANTAL)} vóór op alleen aandelen houden — de
              premie dempt een daling, maar heft haar niet op.
            </p>
          )}
        </div>
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze simulator ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            De premie is geen gratis inkomen. Je verkoopt je opwaarts
            potentieel — in de jaren dat het aandeel hard stijgt, kost de
            covered call je precies de winst waarvoor je aandelen kocht.
          </li>
          <li>
            De premie komt uit een theoretisch model (vaste volatiliteit 25%);
            echte premies wijken af. Transactiekosten, dividend en belasting
            zijn weggelaten en maken elke uitkomst een stukje slechter.
          </li>
          <li>
            Vroegtijdige uitoefening kan: bij Amerikaanse opties kun je vóór
            expiratie al weggecalld worden, zeker rond dividenddata.
          </li>
          <li>
            Zeewind NV bestaat niet. Leerdoel is de ruil begrijpen — premie nu
            tegen winstkans straks — geen strategie-aanbeveling, en dit is geen
            beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
