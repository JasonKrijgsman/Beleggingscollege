"use client";

import { useId, useMemo, useState } from "react";
import { CheckCircle2, Table2, XCircle } from "lucide-react";
import { bsPrijs, type OptieType } from "@/lib/opties";

// Hoort bij de les "De optieketen lezen" (Opties Begrijpen, accent petrol).
// Een nagebouwd brokerscherm voor het fictieve aandeel Zeewind NV: calls
// links, puts rechts, strikes in het midden — zoals DEGIRO, LYNX of Saxo het
// tonen, maar dan zonder echt geld en zonder haast. De koersschuif herprijst
// de hele keten live, zodat je de in-the-moneygrens ziet verschuiven.
//
// Dit zijn géén echte koersen: de premies komen uit een theoretisch model met
// een vaste volatiliteitsglimlach, afgerond op EUR 0,05, met een bied-laat-
// spread die groeit naarmate een serie verder van de huidige koers ligt.

const STRIKES = [34, 36, 38, 40, 42, 44, 46, 48, 50];

const EXPIRATIES = [
  { label: "over 45 dagen", dagen: 45 },
  { label: "over 73 dagen", dagen: 73 },
  { label: "over 136 dagen", dagen: 136 },
] as const;

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* Vaste "glimlach": series verder van de koers krijgen een hogere IV. Zo
   gedragen de randen van de keten zich zoals op een echt scherm. */
function ivVoor(spot: number, strike: number): number {
  return 0.2 + (0.9 * Math.abs(strike - spot)) / spot / 10 + 0.004 * Math.abs(strike - spot);
}

function afronden(n: number, stap: number): number {
  return Math.round(n / stap) * stap;
}

type Serie = {
  strike: number;
  bied: number;
  laat: number;
  volume: number;
  openInterest: number;
  itm: boolean;
};

function maakSerie(
  type: OptieType,
  spot: number,
  strike: number,
  dagen: number
): Serie {
  const mid = bsPrijs({ type, spot, strike, dagen, iv: ivVoor(spot, strike) });
  // Spread: minimaal EUR 0,05, breder ver van de koers (minder handel).
  const spread = Math.max(0.05, 0.04 + 0.015 * Math.abs(strike - spot));
  const bied = Math.max(0, afronden(mid - spread / 2, 0.05));
  const laat = Math.max(bied + 0.05, afronden(mid + spread / 2, 0.05));
  // Volume en open interest: deterministisch, hoog rond de koers, laag aan de
  // randen — het patroon dat je op elk echt scherm terugziet.
  const afstand = Math.abs(strike - spot);
  const basis = Math.max(0, 9 - afstand);
  const volume = Math.round(basis * basis * 7 + ((strike * 13) % 11));
  const openInterest = Math.round(basis * basis * 41 + ((strike * 29) % 53) + 25);
  const itm = type === "call" ? strike < spot : strike > spot;
  return { strike, bied, laat, volume, openInterest, itm };
}

type CelKeuze = {
  kant: OptieType;
  strike: number;
  veld: "bied" | "laat";
};

type Opdracht = {
  vraag: string;
  controleer: (keuze: CelKeuze, spot: number) => boolean;
  uitlegGoed: string;
  uitlegFout: string;
};

const OPDRACHTEN: Opdracht[] = [
  {
    vraag: "Klik een prijs van de call die het dichtst bij at-the-money staat.",
    controleer: (keuze, spot) => {
      const dichtstbij = STRIKES.reduce((a, b) =>
        Math.abs(b - spot) < Math.abs(a - spot) ? b : a
      );
      return keuze.kant === "call" && keuze.strike === dichtstbij;
    },
    uitlegGoed:
      "Klopt: at-the-money is de serie waarvan de strike het dichtst bij de huidige koers ligt. Daar is de tijdswaarde het grootst en de handel het drukst.",
    uitlegFout:
      "Kijk naar de koers bovenaan en zoek de strike die er het dichtst bij ligt — dát is at-the-money. Schuif desnoods even met de koers en zie de grens meebewegen.",
  },
  {
    vraag: "Klik een prijs van de put die ongeveer EUR 2 in-the-money is.",
    controleer: (keuze, spot) => {
      if (keuze.kant !== "put") return false;
      const doel = STRIKES.reduce((a, b) =>
        Math.abs(b - spot - 2) < Math.abs(a - spot - 2) ? b : a
      );
      return keuze.strike === doel;
    },
    uitlegGoed:
      "Precies: een put is in-the-money als de strike bóven de koers ligt. Strike min koers is de intrinsieke waarde — hier ongeveer EUR 2.",
    uitlegFout:
      "Een put is in-the-money als de strike hóger is dan de koers (je mag duurder verkopen dan de markt). Zoek de strike die ongeveer EUR 2 boven de koers ligt.",
  },
  {
    vraag:
      "Je wilt de call met strike 44 nú kopen. Klik de prijs die je dan betaalt.",
    controleer: (keuze) =>
      keuze.kant === "call" && keuze.strike === 44 && keuze.veld === "laat",
    uitlegGoed:
      "Juist: kopen doe je tegen de laatprijs, verkopen tegen de biedprijs. Het verschil — de spread — steek je nooit in eigen zak; dat is een echte kostenpost.",
    uitlegFout:
      "Wie direct wil kopen betaalt de láátprijs (de vraagprijs van de verkoper). De biedprijs is wat je vángt als je verkoopt. Het verschil is de spread — en die betaal jij.",
  },
];

export default function OptieKetenTool() {
  const [spot, setSpot] = useState(42);
  const [expIndex, setExpIndex] = useState(0);
  const [opdrachtIndex, setOpdrachtIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    goed: boolean;
    tekst: string;
  } | null>(null);
  const [klaar, setKlaar] = useState(false);
  const spotId = useId();

  const dagen = EXPIRATIES[expIndex].dagen;

  const keten = useMemo(
    () =>
      STRIKES.map((strike) => ({
        call: maakSerie("call", spot, strike, dagen),
        put: maakSerie("put", spot, strike, dagen),
      })),
    [spot, dagen]
  );

  const kiesCel = (keuze: CelKeuze) => {
    if (klaar) return;
    const opdracht = OPDRACHTEN[opdrachtIndex];
    const goed = opdracht.controleer(keuze, spot);
    setFeedback({
      goed,
      tekst: goed ? opdracht.uitlegGoed : opdracht.uitlegFout,
    });
    if (goed) {
      if (opdrachtIndex + 1 < OPDRACHTEN.length) {
        setOpdrachtIndex(opdrachtIndex + 1);
      } else {
        setKlaar(true);
      }
    }
  };

  const opnieuw = () => {
    setOpdrachtIndex(0);
    setFeedback(null);
    setKlaar(false);
  };

  const celKnop = (
    kant: OptieType,
    serie: Serie,
    veld: "bied" | "laat"
  ) => (
    <button
      type="button"
      onClick={() => kiesCel({ kant, strike: serie.strike, veld })}
      className="w-full rounded px-1.5 py-1 text-right tabular-nums transition hover:bg-petrol-100 focus:outline-none focus:ring-2 focus:ring-petrol-300"
    >
      {serie[veld].toLocaleString("nl-NL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </button>
  );

  return (
    <div className="my-8 rounded-2xl border-2 border-petrol-200 bg-petrol-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-700">
        <Table2 className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">De optieketen, zonder haast</h3>
      <p className="mt-1 text-sm text-body">
        Zo ziet het scherm eruit dat je bij een broker te zien krijgt: calls
        links, puts rechts, strikes in het midden. Dit zijn oefenkoersen van
        het fictieve aandeel Zeewind NV — schuif met de koers en zie de hele
        keten meebewegen.
      </p>

      {/* Koers en expiratie */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={spotId} className="block text-sm font-semibold text-body">
            Koers Zeewind NV
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id={spotId}
              type="range"
              min={36}
              max={48}
              step={0.5}
              value={spot}
              onChange={(e) => setSpot(Number(e.target.value))}
              className="w-full flex-1 accent-petrol-600"
            />
            <span className="w-20 shrink-0 text-right text-sm font-extrabold text-ink">
              {eur(spot)}
            </span>
          </div>
        </div>
        <div>
          <span className="block text-sm font-semibold text-body">Expiratie</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPIRATIES.map((exp, i) => (
              <button
                key={exp.dagen}
                type="button"
                aria-pressed={i === expIndex}
                onClick={() => setExpIndex(i)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  i === expIndex
                    ? "border-petrol-600 bg-petrol-600 text-white"
                    : "border-petrol-200 bg-white text-petrol-700 hover:bg-petrol-50"
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-body">
            Verder weg = meer tijdswaarde = hogere premies. Vergelijk gerust.
          </p>
        </div>
      </div>

      {/* De opdracht */}
      <div className="mt-4 rounded-xl border border-petrol-200 bg-white p-4" aria-live="polite">
        {klaar ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-groen-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Alle drie de opdrachten goed — je leest nu een optieketen.
            </p>
            <button
              type="button"
              onClick={opnieuw}
              className="rounded-lg border border-petrol-200 bg-white px-3 py-1.5 text-xs font-semibold text-petrol-700 transition hover:bg-petrol-50"
            >
              Nog een keer oefenen
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs font-bold uppercase tracking-wide text-petrol-700">
              Opdracht {opdrachtIndex + 1} van {OPDRACHTEN.length}
            </div>
            <p className="mt-1 text-sm font-semibold text-ink">
              {OPDRACHTEN[opdrachtIndex].vraag}
            </p>
          </>
        )}
        {feedback && !klaar && (
          <p
            className={`mt-2 flex items-start gap-1.5 text-sm ${
              feedback.goed ? "text-groen-700" : "text-body"
            }`}
          >
            {feedback.goed ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-groen-700" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-oranje-700" />
            )}
            {feedback.tekst}
          </p>
        )}
        {feedback && klaar && (
          <p className="mt-2 text-sm text-body">{feedback.tekst}</p>
        )}
      </div>

      {/* De keten zelf */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-petrol-200 bg-white">
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-lijn text-[11px] uppercase tracking-wide text-body">
              <th colSpan={4} className="bg-petrol-50/60 py-2 font-bold text-petrol-700">
                Calls
              </th>
              <th className="py-2 font-bold text-ink">Strike</th>
              <th colSpan={4} className="bg-petrol-50/60 py-2 font-bold text-petrol-700">
                Puts
              </th>
            </tr>
            <tr className="border-b border-lijn text-[11px] text-body">
              <th className="px-2 py-1.5 text-right font-semibold">Volume</th>
              <th className="px-2 py-1.5 text-right font-semibold">OI</th>
              <th className="px-2 py-1.5 text-right font-semibold">Bied</th>
              <th className="px-2 py-1.5 text-right font-semibold">Laat</th>
              <th className="px-2 py-1.5 text-center font-semibold" />
              <th className="px-2 py-1.5 text-right font-semibold">Bied</th>
              <th className="px-2 py-1.5 text-right font-semibold">Laat</th>
              <th className="px-2 py-1.5 text-right font-semibold">Volume</th>
              <th className="px-2 py-1.5 text-right font-semibold">OI</th>
            </tr>
          </thead>
          <tbody>
            {keten.map(({ call, put }) => (
              <tr key={call.strike} className="border-b border-lijn/60 last:border-0">
                <td className={`px-2 py-0.5 text-right tabular-nums text-body ${call.itm ? "bg-petrol-50/70" : ""}`}>
                  {call.volume.toLocaleString("nl-NL")}
                </td>
                <td className={`px-2 py-0.5 text-right tabular-nums text-body ${call.itm ? "bg-petrol-50/70" : ""}`}>
                  {call.openInterest.toLocaleString("nl-NL")}
                </td>
                <td className={`px-1 py-0.5 font-semibold text-ink ${call.itm ? "bg-petrol-50/70" : ""}`}>
                  {celKnop("call", call, "bied")}
                </td>
                <td className={`px-1 py-0.5 font-semibold text-ink ${call.itm ? "bg-petrol-50/70" : ""}`}>
                  {celKnop("call", call, "laat")}
                </td>
                <td className="bg-mist px-2 py-0.5 text-center text-sm font-extrabold text-ink">
                  {call.strike}
                </td>
                <td className={`px-1 py-0.5 font-semibold text-ink ${put.itm ? "bg-petrol-50/70" : ""}`}>
                  {celKnop("put", put, "bied")}
                </td>
                <td className={`px-1 py-0.5 font-semibold text-ink ${put.itm ? "bg-petrol-50/70" : ""}`}>
                  {celKnop("put", put, "laat")}
                </td>
                <td className={`px-2 py-0.5 text-right tabular-nums text-body ${put.itm ? "bg-petrol-50/70" : ""}`}>
                  {put.volume.toLocaleString("nl-NL")}
                </td>
                <td className={`px-2 py-0.5 text-right tabular-nums text-body ${put.itm ? "bg-petrol-50/70" : ""}`}>
                  {put.openInterest.toLocaleString("nl-NL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-body">
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-petrol-50 align-middle ring-1 ring-petrol-200" />
          gekleurde rijen zijn in-the-money
        </span>
        <span>OI = open interest (openstaande contracten)</span>
        <span className="font-semibold">
          Onthoud: premie × 100 = wat één contract echt kost. De call 44 laat{" "}
          {eur(keten.find((r) => r.call.strike === 44)?.call.laat ?? 0)} betekent{" "}
          {eur((keten.find((r) => r.call.strike === 44)?.call.laat ?? 0) * 100)} per contract.
        </span>
      </div>

      {/* Eerlijk over de grenzen. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar dit oefenscherm ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Dit zijn theoretische oefenkoersen, geen marktdata. Echte premies
            wijken af en bewegen de hele dag.
          </li>
          <li>
            Op een echt scherm zie je vaak méér kolommen (delta, IV, laatste
            prijs). Het leespatroon blijft hetzelfde: kant kiezen, strike
            zoeken, bied en laat vergelijken.
          </li>
          <li>
            Bij weinig volume en open interest is de spread breder en handel je
            duurder — dat patroon zit ook in dit oefenscherm.
          </li>
          <li>Wij zijn een opleider, geen adviseur — dit is geen beleggingsadvies.</li>
        </ul>
      </div>
    </div>
  );
}
