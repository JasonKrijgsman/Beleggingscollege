"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { CheckCircle2, Circle, SlidersHorizontal } from "lucide-react";
import { bsGreeks, bsPrijs, intrinsiekeWaarde, type OptieType } from "@/lib/opties";

// Hoort bij de les "De Grieken samen" (cursus Volatiliteit & Spreads, accent
// petrol). Eén optie op Zeewind NV, drie schuiven, vier meters: de Grieken
// zijn geen tentamenstof maar de metertjes op je dashboard. Draaien en kijken
// leert hier meer dan formules stampen.

const STRIKE = 42;

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getal(n: number, decimalen: number): string {
  return n.toLocaleString("nl-NL", {
    minimumFractionDigits: decimalen,
    maximumFractionDigits: decimalen,
  });
}

function klem(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/* Zelfde patroon als elders: label + schuif + nummerveld die één waarde delen. */
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
          {eenheid && <span className="text-sm font-semibold text-body">{eenheid}</span>}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-body">{hint}</p>}
    </div>
  );
}

/* Horizontale meter: balk met vulgraad + waarde, bewust geen wijzerplaat. */
function Meter({
  naam,
  uitleg,
  waardeTekst,
  vulling,
  negatief = false,
}: {
  naam: string;
  uitleg: string;
  waardeTekst: string;
  vulling: number; // 0..1
  negatief?: boolean;
}) {
  const breedte = Math.max(1.5, klem(vulling, 0, 1) * 100);
  return (
    <div className="rounded-xl border border-petrol-200 bg-white p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-ink">{naam}</span>
        <span
          className={`text-sm font-extrabold ${negatief ? "text-oranje-700" : "text-petrol-700"}`}
        >
          {waardeTekst}
        </span>
      </div>
      <div
        className="mt-2 h-3 w-full overflow-hidden rounded-full bg-mist"
        role="img"
        aria-label={`${naam}: ${waardeTekst}`}
      >
        <div
          className={`h-full rounded-full ${negatief ? "bg-oranje-600" : "bg-petrol-600"}`}
          style={{ width: `${breedte}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-body">{uitleg}</p>
    </div>
  );
}

type OpdrachtId = "delta" | "gamma" | "tijdswaarde";

const OPDRACHTEN: { id: OpdrachtId; titel: string; hint: string }[] = [
  {
    id: "delta",
    titel: "Maak delta ongeveer 0,50",
    hint: "Waar moet de koers staan ten opzichte van de strike?",
  },
  {
    id: "gamma",
    titel: "Vind waar gamma het hoogst is",
    hint: "Zoek de combinatie van koers-dicht-bij-de-strike en weinig dagen.",
  },
  {
    id: "tijdswaarde",
    titel: "Laat de tijdswaarde bijna verdampen",
    hint: "Weinig dagen én een lage IV — kijk wat theta ondertussen doet.",
  },
];

export default function OptieGreeksTool() {
  const [type, setType] = useState<OptieType>("call");
  const [spot, setSpot] = useState(42);
  const [dagen, setDagen] = useState(45);
  const [ivPct, setIvPct] = useState(25);
  const [behaald, setBehaald] = useState<Set<OpdrachtId>>(new Set());

  const iv = ivPct / 100;
  const invoer = useMemo(
    () => ({ type, spot, strike: STRIKE, dagen, iv }),
    [type, spot, dagen, iv]
  );
  const premie = useMemo(() => bsPrijs(invoer), [invoer]);
  const greeks = useMemo(() => bsGreeks(invoer), [invoer]);
  const intrinsiek = intrinsiekeWaarde(type, spot, STRIKE);
  const tijdswaarde = Math.max(0, premie - intrinsiek);

  // Auto-detectie van de micro-opdrachten. Eenmaal behaald blijft behaald:
  // het is een speeltuin, geen examen dat je opnieuw kunt zakken.
  const deltaGehaald = Math.abs(greeks.delta) >= 0.45 && Math.abs(greeks.delta) <= 0.55;
  const gammaGehaald = greeks.gamma >= 0.15 && dagen <= 15;
  const tijdswaardeGehaald = dagen <= 5 && tijdswaarde < 0.1;

  useEffect(() => {
    const nieuw: OpdrachtId[] = [];
    if (deltaGehaald) nieuw.push("delta");
    if (gammaGehaald) nieuw.push("gamma");
    if (tijdswaardeGehaald) nieuw.push("tijdswaarde");
    if (nieuw.some((id) => !behaald.has(id))) {
      setBehaald((huidig) => new Set([...huidig, ...nieuw]));
    }
  }, [deltaGehaald, gammaGehaald, tijdswaardeGehaald, behaald]);

  const nuActief: Record<OpdrachtId, boolean> = {
    delta: deltaGehaald,
    gamma: gammaGehaald,
    tijdswaarde: tijdswaardeGehaald,
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <SlidersHorizontal className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">Greeks-speeltuin</h3>
      <p className="mt-1 text-sm text-body">
        Eén {type} op het fictieve aandeel Zeewind NV, strike {eur(STRIKE)}. De
        Grieken zijn geen tentamenstof — het zijn de metertjes op je dashboard.
        Draai aan de drie knoppen en kijk wat er met de meters gebeurt; dat
        gevoel is waar deze les om draait.
      </p>

      {/* Call/put-keuze */}
      <div className="mt-4 flex overflow-hidden self-start rounded-lg border border-lijn text-sm font-semibold w-fit">
        {(["call", "put"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={`px-4 py-2 transition ${
              type === t ? "bg-petrol-600 text-white" : "bg-white text-body hover:bg-petrol-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* De drie knoppen */}
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <SchuifVeld
          label="Koers Zeewind NV"
          waarde={spot}
          zetWaarde={setSpot}
          min={30}
          max={55}
          stap={0.5}
          eenheid="€"
        />
        <SchuifVeld
          label="Dagen tot expiratie"
          waarde={dagen}
          zetWaarde={setDagen}
          min={1}
          max={90}
          stap={1}
          eenheid="dgn"
        />
        <SchuifVeld
          label="Implied volatility"
          waarde={ivPct}
          zetWaarde={setIvPct}
          min={10}
          max={60}
          stap={1}
          eenheid="%"
        />
      </div>

      {/* Premie + de vier meters */}
      <div aria-live="polite" className="mt-6">
        <div className="rounded-xl border border-petrol-200 bg-white p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wide text-body">
            Theoretische premie per contract (×100)
          </div>
          <div className="mt-1 text-2xl font-extrabold text-petrol-700">{eur(premie * 100)}</div>
          <div className="mt-0.5 text-xs text-body">
            waarvan {eur(intrinsiek * 100)} intrinsiek en {eur(tijdswaarde * 100)} tijdswaarde
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Meter
            naam="Delta"
            waardeTekst={getal(greeks.delta, 2)}
            vulling={Math.abs(greeks.delta)}
            uitleg={
              type === "call"
                ? "Hoeveel de premie ruwweg meebeweegt per euro koersstijging. Géén letterlijke kans dat de optie in the money eindigt — hooguit een grove vingerwijzing."
                : "Hoeveel de premie ruwweg meebeweegt per euro koersstijging; bij een put negatief. Géén letterlijke kans op in the money eindigen — hooguit een grove vingerwijzing."
            }
          />
          <Meter
            naam="Gamma"
            waardeTekst={getal(greeks.gamma, 3)}
            vulling={greeks.gamma / 0.3}
            uitleg="Hoe snel delta zélf verandert als de koers beweegt. Hoog gamma = een zenuwachtige delta."
          />
          <Meter
            naam="Vega"
            waardeTekst={`${eur(greeks.vega * 100)} per %-punt IV`}
            vulling={(greeks.vega * 100) / 10}
            uitleg="Wat één procentpunt meer of minder IV met het contract doet (×100)."
          />
          <Meter
            naam="Theta"
            waardeTekst={`${eur(greeks.theta * 100)} per dag`}
            vulling={Math.abs(greeks.theta * 100) / 30}
            negatief={greeks.theta < 0}
            uitleg="Wat één verstreken dag met het contract doet (×100). Voor de koper vrijwel altijd negatief: tijd lekt weg, elke dag."
          />
        </div>
      </div>

      {/* Micro-opdrachten */}
      <div className="mt-6 rounded-xl border border-petrol-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-700">
          Drie kleine opdrachten
        </h4>
        <p className="mt-1 text-xs text-body">
          Ze vinken zichzelf af zodra je de juiste stand vindt — er is geen
          foute volgorde en niets om te onthouden.
        </p>
        <ul className="mt-3 space-y-2.5">
          {OPDRACHTEN.map((opdracht) => {
            const klaar = behaald.has(opdracht.id);
            return (
              <li key={opdracht.id} className="flex items-start gap-2.5">
                {klaar ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-groen-500" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-lijn" />
                )}
                <div className="text-sm">
                  <span className={`font-semibold ${klaar ? "text-groen-700" : "text-ink"}`}>
                    {opdracht.titel}
                  </span>
                  {klaar && nuActief[opdracht.id] && (
                    <span className="ml-2 text-xs font-bold text-groen-700">— nu te zien!</span>
                  )}
                  {!klaar && <p className="mt-0.5 text-xs text-body">{opdracht.hint}</p>}
                  {klaar && opdracht.id === "delta" && (
                    <p className="mt-0.5 text-xs text-body">
                      Precies rond de strike, met nog wat tijd op de klok: de
                      markt houdt het op fifty-fifty méébewegen.
                    </p>
                  )}
                  {klaar && opdracht.id === "gamma" && (
                    <p className="mt-0.5 text-xs text-body">
                      Vlak bij de strike en vlak voor expiratie is delta het
                      zenuwachtigst: één euro koersbeweging kan de optie van
                      bijna-waardeloos naar bijna-zeker duwen.
                    </p>
                  )}
                  {klaar && opdracht.id === "tijdswaarde" && (
                    <p className="mt-0.5 text-xs text-body">
                      Vlak voor expiratie is er bijna geen tijd meer om te
                      verkopen — de premie zakt terug naar de intrinsieke
                      waarde en theta heeft niets meer om weg te tikken.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze speeltuin ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            De Grieken zijn momentopnamen: zodra koers, tijd of IV beweegt,
            staan alle meters anders. Ze voorspellen niets — ze beschrijven het
            nú.
          </li>
          <li>
            Delta wordt vaak naverteld als &quot;kans op in the money&quot;.
            Dat is een ezelsbrug, geen waarheid: de echte kans hangt af van
            aannames die dit model bewust simpel houdt.
          </li>
          <li>
            We rekenen met één vaste IV en rente nul; echte marktprijzen wijken
            daar altijd wat van af.
          </li>
          <li>
            Zeewind NV bestaat niet. Dit is een leerinstrument, geen
            handelsscherm — en geen beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
