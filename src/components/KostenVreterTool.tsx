"use client";

import { useId, useMemo, useState } from "react";
import { Globe } from "lucide-react";

// Hoort bij de les "De kosten-vreter" (Indexbeleggen & ETF's, accent
// leisteen). Twee identieke beleggingen, één verschil: de jaarlijkse kosten.
// De cursist schuift aan de kosten en ziet dertig jaar groei opgegeten
// worden — het punt van Bogle in één grafiek.

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function klem(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/* Zelfde invoerpatroon als de andere tools: label + schuif + nummerveld. */
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
    if (ruw.trim() !== "" && Number.isFinite(n)) zetWaarde(klem(n, min, max));
  };

  return (
    <div>
      <label id={labelId} htmlFor={veldId} className="block text-sm font-semibold text-body">
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
          className="w-full flex-1 accent-leisteen-600"
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
            className="w-20 rounded-lg border border-lijn bg-white px-2 py-2 text-right text-sm font-bold text-ink focus:border-leisteen-400 focus:outline-none focus:ring-2 focus:ring-leisteen-200"
          />
          {eenheid && <span className="text-sm font-semibold text-body">{eenheid}</span>}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-body">{hint}</p>}
    </div>
  );
}

/** Vermogensopbouw met maandinleg, netto jaarrendement = bruto − kosten. */
function verloop(
  maandinleg: number,
  jaren: number,
  brutoPct: number,
  kostenPct: number
): number[] {
  const netto = (brutoPct - kostenPct) / 100;
  const groeiPerMaand = Math.pow(1 + netto, 1 / 12);
  const punten: number[] = [0];
  let waarde = 0;
  for (let m = 1; m <= jaren * 12; m++) {
    waarde = waarde * groeiPerMaand + maandinleg;
    if (m % 12 === 0) punten.push(waarde);
  }
  return punten;
}

export default function KostenVreterTool() {
  const [maandinleg, setMaandinleg] = useState(200);
  const [jaren, setJaren] = useState(30);
  const [bruto, setBruto] = useState(7);
  const [kostenGoedkoop, setKostenGoedkoop] = useState(0.2);
  const [kostenDuur, setKostenDuur] = useState(1.5);

  const { goedkoop, duur, zonder } = useMemo(
    () => ({
      goedkoop: verloop(maandinleg, jaren, bruto, kostenGoedkoop),
      duur: verloop(maandinleg, jaren, bruto, kostenDuur),
      zonder: verloop(maandinleg, jaren, bruto, 0),
    }),
    [maandinleg, jaren, bruto, kostenGoedkoop, kostenDuur]
  );

  const eindGoedkoop = goedkoop[goedkoop.length - 1];
  const eindDuur = duur[duur.length - 1];
  const eindZonder = zonder[zonder.length - 1];
  const totaleInleg = maandinleg * 12 * jaren;
  const verschil = eindGoedkoop - eindDuur;
  const opgegetenDuur = eindZonder - eindDuur;
  const brutoGroei = eindZonder - totaleInleg;
  const opgegetenAandeel =
    brutoGroei > 0 ? Math.round((opgegetenDuur / brutoGroei) * 100) : 0;

  // SVG
  const B = 640;
  const H = 300;
  const PAD = { l: 8, r: 8, t: 14, b: 24 };
  const maxY = eindZonder * 1.04;
  const naarX = (jaar: number) => PAD.l + (jaar / jaren) * (B - PAD.l - PAD.r);
  const naarY = (w: number) => PAD.t + (1 - w / maxY) * (H - PAD.t - PAD.b);
  const lijn = (reeks: number[]) =>
    reeks.map((w, j) => `${j === 0 ? "M" : "L"}${naarX(j).toFixed(1)},${naarY(w).toFixed(1)}`).join(" ");
  // Het opgegeten gebied: tussen de goedkope en de dure lijn.
  const vlak =
    lijn(goedkoop) +
    " " +
    [...duur]
      .reverse()
      .map((w, i) => `L${naarX(jaren - i).toFixed(1)},${naarY(w).toFixed(1)}`)
      .join(" ") +
    " Z";

  return (
    <div className="my-8 rounded-2xl border-2 border-leisteen-200 bg-leisteen-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-leisteen-700">
        <Globe className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">De kosten-vreter</h3>
      <p className="mt-1 text-sm text-body">
        Twee keer precies dezelfde belegging, met één verschil: de jaarlijkse
        kosten. Schuif aan de percentages en kijk wat er na {jaren} jaar van je
        rendement over is. Kosten ogen klein — ze werken alleen elk jaar, op
        een steeds groter bedrag.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SchuifVeld
          label="Maandelijkse inleg"
          waarde={maandinleg}
          zetWaarde={setMaandinleg}
          min={25}
          max={1000}
          stap={25}
          eenheid="€"
        />
        <SchuifVeld label="Aantal jaren" waarde={jaren} zetWaarde={setJaren} min={5} max={40} stap={1} eenheid="jaar" />
        <SchuifVeld
          label="Verwacht bruto rendement per jaar"
          waarde={bruto}
          zetWaarde={setBruto}
          min={3}
          max={10}
          stap={0.5}
          eenheid="%"
          hint="Wereldwijde aandelen deden historisch gemiddeld zo'n 7% per jaar — een gemiddelde uit het verleden, geen belofte."
        />
        <div className="grid gap-5">
          <SchuifVeld
            label="Kosten goedkoop indexfonds"
            waarde={kostenGoedkoop}
            zetWaarde={setKostenGoedkoop}
            min={0.05}
            max={0.5}
            stap={0.05}
            eenheid="%"
          />
          <SchuifVeld
            label="Kosten duur (actief) fonds"
            waarde={kostenDuur}
            zetWaarde={setKostenDuur}
            min={0.5}
            max={2.5}
            stap={0.1}
            eenheid="%"
          />
        </div>
      </div>

      {/* Grafiek */}
      <div className="mt-5 rounded-xl border border-leisteen-200 bg-white p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${B} ${H}`}
          role="img"
          aria-label="Vermogensgroei met goedkope en dure kosten naast elkaar"
          className="w-full"
        >
          <path d={vlak} fill="#fdd0a8" opacity={0.55} />
          <path d={lijn(zonder)} fill="none" stroke="#a8c0d0" strokeWidth={1.5} strokeDasharray="4 4" />
          <path d={lijn(goedkoop)} fill="none" stroke="#446981" strokeWidth={2.5} />
          <path d={lijn(duur)} fill="none" stroke="#ad430b" strokeWidth={2.5} />
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <text
              key={f}
              x={naarX(Math.round(jaren * f))}
              y={H - 6}
              textAnchor="middle"
              fontSize={10}
              fill="#53565a"
            >
              jaar {Math.round(jaren * f)}
            </text>
          ))}
        </svg>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-body">
          <span className="font-semibold text-leisteen-700">— goedkoop ({kostenGoedkoop.toLocaleString("nl-NL")}%)</span>
          <span className="font-semibold text-oranje-700">— duur ({kostenDuur.toLocaleString("nl-NL")}%)</span>
          <span>- - zonder kosten (theoretisch)</span>
          <span className="font-semibold text-oranje-700">oranje vlak = wat het verschil je kost</span>
        </div>
      </div>

      <div aria-live="polite" className="mt-4 grid gap-3 text-center sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">Totaal ingelegd</div>
          <div className="mt-0.5 text-lg font-extrabold text-ink">{eur(totaleInleg)}</div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Eindbedrag goedkoop
          </div>
          <div className="mt-0.5 text-lg font-extrabold text-leisteen-700">{eur(eindGoedkoop)}</div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">Eindbedrag duur</div>
          <div className="mt-0.5 text-lg font-extrabold text-oranje-700">{eur(eindDuur)}</div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">Het verschil</div>
          <div className="mt-0.5 text-lg font-extrabold text-oranje-700">{eur(verschil)}</div>
          <div className="text-[11px] text-body">naar de kosten, niet naar jou</div>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-leisteen-100/60 p-4 text-sm leading-relaxed text-ink">
        Bij het dure fonds gaat over {jaren} jaar in totaal{" "}
        <strong>{eur(opgegetenDuur)}</strong> van je theoretische groei op aan
        kosten — dat is <strong>{opgegetenAandeel}%</strong> van alles wat de
        markt bruto voor je verdiende bóven je inleg. De verkoper van het
        fonds krijgt zijn deel elk jaar, gegarandeerd; jij draagt al het
        risico.
      </p>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze rekensom ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Het rendement is een aanname en beweegt in het echt elk jaar; de
            kosten staan wél elk jaar vast. Dat verschil — zeker versus
            onzeker — is precies het punt van deze les.
          </li>
          <li>
            We rekenen kosten hier als vast percentage per jaar; in het echt
            komen er nog transactiekosten en spread bij, en die vallen bij
            veel handelen hoger uit.
          </li>
          <li>
            Een duur fonds kán beter presteren dan de index. De les uit de
            cijfers is dat je vooraf niet kunt weten welk fonds dat wordt —
            de kosten weet je wel vooraf.
          </li>
          <li>Wij zijn een opleider, geen adviseur — dit is geen beleggingsadvies.</li>
        </ul>
      </div>
    </div>
  );
}
