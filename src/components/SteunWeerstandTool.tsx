"use client";

import {
  useId,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  LineChart,
  Plus,
  RotateCcw,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

// Hoort bij de les "Trends, steun en weerstand" (cursus Technische Analyse, accent blauw).
// De cursist tekent zelf steun- en weerstandslijnen op een gesimuleerde koersgrafiek en
// krijgt directe feedback. De koersreeksen zijn deterministisch (mulberry32 met vaste
// seeds), zodat iedere cursist exact dezelfde oefening ziet — en de zones zitten er
// bewust in gebouwd: de koers ketst er meermaals op af.

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

/* Deterministische pseudorandom generator: zelfde seed → zelfde reeks,
   op elk apparaat. Daarom géén Math.random. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type OefeningConfig = {
  seed: number;
  start: number;
  /** De echte steun-/weerstandsniveaus die de cursist moet vinden. */
  niveaus: number[];
  /** Opeenvolgende koersdoelen; een doel dat gelijk is aan een niveau telt als raakpunt. */
  route: number[];
};

type Zone = { prijs: number; raakIndexen: number[] };

type Oefening = {
  punten: number[];
  zones: Zone[];
  minPrijs: number; // ondergrens van de prijsas (met wat lucht)
  maxPrijs: number;
  tolerantie: number; // ±1,5% van het prijsbereik
};

type Controle = {
  zones: { zone: Zone; gevonden: boolean }[];
  lijnen: { prijs: number; raak: boolean }[];
  gevonden: number;
  overbodig: number;
  score: number;
};

/* Drie oefeningen. De route laat de koers bewust meermaals afketsen op de
   niveaus (minimaal drie keer per zone — precies wat de les "bevestigd"
   noemt), met af en toe een vrij tussendoel of een doorbraak dwars door
   een zone heen, zoals op echte grafieken. */
const OEFENINGEN: OefeningConfig[] = [
  {
    seed: 20260801,
    start: 96,
    niveaus: [84, 108],
    route: [84, 99, 84, 108, 97, 108, 84, 108],
  },
  {
    seed: 20260802,
    start: 70,
    niveaus: [62, 78, 95],
    route: [78, 62, 78, 62, 95, 78, 95, 88, 95, 62],
  },
  {
    seed: 20260803,
    start: 158,
    niveaus: [140, 172, 196],
    route: [172, 140, 172, 196, 172, 196, 140, 181, 140, 196],
  },
];

function maakOefening(config: OefeningConfig): Oefening {
  const { seed, start, niveaus, route } = config;
  const willekeur = mulberry32(seed);
  const span = Math.max(...niveaus) - Math.min(...niveaus);

  const punten: number[] = [start];
  const raakIndexen = new Map<number, number[]>();
  for (const niveau of niveaus) raakIndexen.set(niveau, []);

  const totaal = 120;
  const basisStappen = Math.floor(totaal / route.length);
  const rest = totaal - basisStappen * route.length;

  let huidig = start;
  route.forEach((doelNiveau, been) => {
    const stappen = basisStappen + (been < rest ? 1 : 0);
    // Kleine jitter per raakpunt: een zone is nooit op de cent nauwkeurig.
    const doel = doelNiveau + (willekeur() - 0.5) * span * 0.012;
    for (let i = 1; i <= stappen; i++) {
      const t = i / stappen;
      const glad = t * t * (3 - 2 * t); // smoothstep: rustig vertrekken en aankomen
      const basis = huidig + (doel - huidig) * glad;
      const golf = Math.sin(Math.PI * t) * (willekeur() - 0.5) * span * 0.07;
      const ruis = i === stappen ? 0 : (willekeur() - 0.5) * span * 0.025;
      punten.push(basis + golf + ruis);
    }
    huidig = doel;
    const lijst = raakIndexen.get(doelNiveau);
    if (lijst) lijst.push(punten.length - 1);
  });

  const dataMin = Math.min(...punten);
  const dataMax = Math.max(...punten);
  const bereik = dataMax - dataMin;
  const lucht = bereik * 0.07;

  return {
    punten,
    zones: niveaus.map((prijs) => ({
      prijs,
      raakIndexen: raakIndexen.get(prijs) ?? [],
    })),
    minPrijs: dataMin - lucht,
    maxPrijs: dataMax + lucht,
    tolerantie: bereik * 0.015,
  };
}

/* Een prettige stapgrootte voor de rasterlijnen op de prijsas. */
function mooieStap(bereik: number): number {
  const kandidaten = [1, 2, 2.5, 5, 10, 20, 25, 50];
  const ruwe = bereik / 6;
  for (const k of kandidaten) if (k >= ruwe) return k;
  return 100;
}

const MAX_LIJNEN = 4;

// Tekenvlak van de grafiek (viewBox-eenheden; schaalt mee met de breedte).
const W = 560;
const H = 340;
const PAD_L = 46;
const PAD_R = 10;
const PAD_T = 12;
const PAD_B = 14;

export default function SteunWeerstandTool() {
  const [oefeningIndex, setOefeningIndex] = useState(0);
  const [lijnen, setLijnen] = useState<number[]>([]);
  const [invoerTekst, setInvoerTekst] = useState("");
  const [melding, setMelding] = useState<string | null>(null);
  const [controle, setControle] = useState<Controle | null>(null);
  const invoerId = useId();
  const invoerHintId = useId();

  const oefening = useMemo(
    () => maakOefening(OEFENINGEN[oefeningIndex]),
    [oefeningIndex]
  );

  /* Toppen en bodems (uiterste binnen een venster van ±4 punten). Wie nét
     naast zo'n omkeerpunt tikt, krijgt zijn lijn erop vastgeklikt — zo werkt
     de oefening ook met een vingerdikke aanraking op een telefoon. */
  const extremen = useMemo(() => {
    const p = oefening.punten;
    const venster = 4;
    const uit: number[] = [];
    for (let i = venster; i < p.length - venster; i++) {
      let top = true;
      let bodem = true;
      for (let j = i - venster; j <= i + venster; j++) {
        if (p[j] > p[i]) top = false;
        if (p[j] < p[i]) bodem = false;
      }
      if (top || bodem) uit.push(p[i]);
    }
    return uit;
  }, [oefening]);

  const naarX = (index: number) =>
    PAD_L + (index / (oefening.punten.length - 1)) * (W - PAD_L - PAD_R);
  const naarY = (prijs: number) =>
    PAD_T +
    ((oefening.maxPrijs - prijs) / (oefening.maxPrijs - oefening.minPrijs)) *
      (H - PAD_T - PAD_B);
  const yNaarPrijs = (yView: number) =>
    oefening.maxPrijs -
    ((yView - PAD_T) / (H - PAD_T - PAD_B)) *
      (oefening.maxPrijs - oefening.minPrijs);

  const koersPad = oefening.punten
    .map((p, i) => `${i === 0 ? "M" : "L"}${naarX(i).toFixed(1)},${naarY(p).toFixed(1)}`)
    .join(" ");

  const rasterPrijzen = useMemo(() => {
    const stap = mooieStap(oefening.maxPrijs - oefening.minPrijs);
    const eerste = Math.ceil(oefening.minPrijs / stap) * stap;
    const uit: number[] = [];
    for (let k = 0; eerste + k * stap <= oefening.maxPrijs; k++) {
      uit.push(eerste + k * stap);
    }
    return uit;
  }, [oefening]);

  // Nette invoergrenzen voor het prijsveld.
  const ondergrens = Math.ceil(oefening.minPrijs);
  const bovengrens = Math.floor(oefening.maxPrijs);

  const snapNaarExtreem = (prijs: number): number => {
    const straal = (oefening.maxPrijs - oefening.minPrijs) * 0.025;
    let beste = prijs;
    let besteAfstand = straal;
    for (const extreem of extremen) {
      const afstand = Math.abs(extreem - prijs);
      if (afstand < besteAfstand) {
        beste = extreem;
        besteAfstand = afstand;
      }
    }
    return beste;
  };

  const voegLijnToe = (prijs: number): boolean => {
    const afgerond = Math.round(prijs * 100) / 100;
    if (lijnen.length >= MAX_LIJNEN) {
      setMelding(
        `Je kunt maximaal ${MAX_LIJNEN} lijnen leggen — verwijder er eerst één.`
      );
      return false;
    }
    if (lijnen.some((l) => Math.abs(l - afgerond) <= oefening.tolerantie)) {
      setMelding("Er ligt al een lijn vlak bij deze prijs — kies een ander niveau.");
      return false;
    }
    // Gesorteerd van hoog naar laag, zodat de lijst leest zoals de grafiek.
    setLijnen([...lijnen, afgerond].sort((a, b) => b - a));
    setMelding(`Lijn gelegd op ${eur(afgerond)}.`);
    return true;
  };

  const verwijderLijn = (index: number) => {
    const prijs = lijnen[index];
    setLijnen(lijnen.filter((_, i) => i !== index));
    setMelding(`Lijn op ${eur(prijs)} verwijderd.`);
  };

  const klikOpGrafiek = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (controle) {
      setMelding(
        "Je hebt deze oefening al gecontroleerd — kies ‘Opnieuw’ om verder te oefenen."
      );
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.height === 0) return;
    const yView = ((e.clientY - rect.top) / rect.height) * H;
    const prijs = klem(yNaarPrijs(yView), oefening.minPrijs, oefening.maxPrijs);
    voegLijnToe(snapNaarExtreem(prijs));
  };

  const verwerkInvoer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (controle) return;
    const ruw = invoerTekst.trim();
    const n = Number(ruw.replace(",", "."));
    if (ruw === "" || !Number.isFinite(n)) {
      setMelding("Vul eerst een prijs in, bijvoorbeeld 84,50.");
      return;
    }
    if (n < ondergrens || n > bovengrens) {
      setMelding(
        `Kies een prijs binnen de grafiek: tussen ${eur(ondergrens)} en ${eur(bovengrens)}.`
      );
      return;
    }
    if (voegLijnToe(n)) setInvoerTekst("");
  };

  const controleer = () => {
    const zoneResultaten = oefening.zones
      .map((zone) => ({
        zone,
        gevonden: lijnen.some(
          (l) => Math.abs(l - zone.prijs) <= oefening.tolerantie
        ),
      }))
      .sort((a, b) => b.zone.prijs - a.zone.prijs);
    const lijnResultaten = lijnen.map((prijs) => ({
      prijs,
      raak: oefening.zones.some(
        (z) => Math.abs(prijs - z.prijs) <= oefening.tolerantie
      ),
    }));
    const gevonden = zoneResultaten.filter((z) => z.gevonden).length;
    const overbodig = lijnResultaten.filter((l) => !l.raak).length;
    const score = Math.max(
      0,
      Math.round((gevonden / oefening.zones.length) * 100) - overbodig * 15
    );
    setControle({
      zones: zoneResultaten,
      lijnen: lijnResultaten,
      gevonden,
      overbodig,
      score,
    });
    setMelding(null);
  };

  const opnieuw = () => {
    setLijnen([]);
    setInvoerTekst("");
    setControle(null);
    setMelding("Oefening leeggemaakt — teken je lijnen opnieuw.");
  };

  const volgendeOefening = () => {
    setOefeningIndex((i) => (i + 1) % OEFENINGEN.length);
    setLijnen([]);
    setInvoerTekst("");
    setControle(null);
    setMelding(null);
  };

  const scoreBoodschap = (c: Controle): string => {
    if (c.gevonden === c.zones.length && c.overbodig === 0) {
      return "Sterk werk: alle zones gevonden, zonder overbodige lijnen.";
    }
    if (c.gevonden === c.zones.length) {
      return "Alle zones gevonden. Je had er wel een paar lijnen naast — minder lijnen is vaak sterker.";
    }
    if (c.gevonden > 0) {
      return `Je hebt ${c.gevonden} van de ${c.zones.length} zones te pakken. Bekijk de gekleurde banden en probeer het gerust opnieuw.`;
    }
    return "Nog geen zones geraakt — heel normaal in het begin. Zoek de prijzen waar de koers meermaals omkeert en probeer het opnieuw.";
  };

  const lijnKleur = (prijs: number): { kleur: string; streep?: string } => {
    if (!controle) return { kleur: "#0072ce", streep: "7 5" };
    const resultaat = controle.lijnen.find((l) => l.prijs === prijs);
    return resultaat?.raak
      ? { kleur: "#006546" }
      : { kleur: "#9aa2ad", streep: "5 4" };
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-brand-200 bg-brand-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-700">
        <LineChart className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">
        Teken zelf steun en weerstand
      </h3>
      <p className="mt-1 text-sm text-body">
        In deze gesimuleerde koersgrafiek zitten twee of drie zones verstopt
        waar de koers telkens op afketst. Tik of klik op de grafiek om daar een
        lijn te leggen (maximaal {MAX_LIJNEN}) — tik je nét naast een top of
        bodem, dan klikt je lijn daarop vast. Liever typen? Dat kan met het
        prijsveld onder de grafiek. Rustig zoeken mag: je kunt niets
        kapotmaken.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
          Oefening {oefeningIndex + 1} van {OEFENINGEN.length}
        </span>
        <button
          type="button"
          onClick={volgendeOefening}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          Volgende oefening
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-brand-200 bg-white p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full cursor-crosshair select-none"
          role="img"
          aria-label={`Koersgrafiek van oefening ${oefeningIndex + 1}, met prijzen tussen ongeveer ${eur(ondergrens)} en ${eur(bovengrens)}. Klikken op de grafiek legt een lijn; zonder muis gebruik je het prijsveld onder de grafiek.`}
          onClick={klikOpGrafiek}
        >
          {/* Rasterlijnen met prijslabels */}
          {rasterPrijzen.map((prijs) => (
            <g key={prijs}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={naarY(prijs)}
                y2={naarY(prijs)}
                stroke="#e3e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD_L - 6}
                y={naarY(prijs) + 3.5}
                textAnchor="end"
                fontSize="10"
                fill="#53565a"
              >
                €{" "}
                {prijs.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}
              </text>
            </g>
          ))}

          {/* Na de controle: de echte zones als gekleurde banden */}
          {controle &&
            controle.zones.map(({ zone, gevonden }) => {
              const bandBoven = naarY(zone.prijs + oefening.tolerantie);
              const bandOnder = naarY(zone.prijs - oefening.tolerantie);
              const kleur = gevonden ? "#239a67" : "#dda221";
              return (
                <g key={zone.prijs}>
                  <rect
                    x={PAD_L}
                    y={bandBoven}
                    width={W - PAD_L - PAD_R}
                    height={bandOnder - bandBoven}
                    fill={kleur}
                    opacity="0.18"
                  />
                  <line
                    x1={PAD_L}
                    x2={W - PAD_R}
                    y1={naarY(zone.prijs)}
                    y2={naarY(zone.prijs)}
                    stroke={kleur}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                  <text
                    x={W - PAD_R - 4}
                    y={Math.max(PAD_T + 9, bandBoven - 4)}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="700"
                    fill={gevonden ? "#00573d" : "#b98214"}
                  >
                    {zone.raakIndexen.length}× afgeketst
                  </text>
                </g>
              );
            })}

          {/* De koerslijn */}
          <path
            d={koersPad}
            fill="none"
            stroke="#005cab"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Na de controle: stippen op de punten waar de koers de zone raakte */}
          {controle &&
            controle.zones.map(({ zone, gevonden }) =>
              zone.raakIndexen.map((index) => (
                <circle
                  key={`${zone.prijs}-${index}`}
                  cx={naarX(index)}
                  cy={naarY(oefening.punten[index])}
                  r="3.5"
                  fill={gevonden ? "#00573d" : "#b98214"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))
            )}

          {/* De lijnen van de cursist */}
          {lijnen.map((prijs) => {
            const { kleur, streep } = lijnKleur(prijs);
            return (
              <g key={prijs}>
                <line
                  x1={PAD_L}
                  x2={W - PAD_R}
                  y1={naarY(prijs)}
                  y2={naarY(prijs)}
                  stroke={kleur}
                  strokeWidth="2"
                  strokeDasharray={streep}
                />
                <text
                  x={PAD_L + 4}
                  y={naarY(prijs) - 4}
                  fontSize="9"
                  fontWeight="700"
                  fill={kleur}
                >
                  {eur(prijs)}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-body">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-5 rounded bg-brand-700" /> Koers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-brand-600" />{" "}
            Jouw lijn
          </span>
          {controle && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-5 rounded bg-groen-600" />{" "}
                Raak
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-[#9aa2ad]" />{" "}
                Overbodig
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-5 rounded bg-groen-500/25" />{" "}
                Gevonden zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-5 rounded bg-goud-400/30" />{" "}
                Gemiste zone
              </span>
            </>
          )}
        </div>
      </div>

      {/* Meldingen (toegevoegd, verwijderd, foutje) — ook voor schermlezers */}
      <p aria-live="polite" className="mt-2 min-h-5 text-xs font-semibold text-body">
        {melding}
      </p>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {/* Het lijstje met lijnen: dit is meteen de toetsenbordroute om te verwijderen */}
        <div className="rounded-xl border border-brand-200 bg-white p-4">
          <h4 className="text-sm font-bold uppercase tracking-wide text-brand-700">
            Jouw lijnen ({lijnen.length} van {MAX_LIJNEN})
          </h4>
          {lijnen.length === 0 ? (
            <p className="mt-2 text-sm text-body">
              Nog geen lijnen. Tik op de grafiek of gebruik het prijsveld
              hiernaast.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {lijnen.map((prijs, index) => (
                <li
                  key={prijs}
                  className="flex items-center justify-between gap-3 rounded-lg bg-mist px-3 py-2"
                >
                  <span className="text-sm font-bold text-ink">{eur(prijs)}</span>
                  <button
                    type="button"
                    onClick={() => verwijderLijn(index)}
                    disabled={controle !== null}
                    aria-label={`Verwijder de lijn op ${eur(prijs)}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-body transition hover:bg-brand-100 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lijn toevoegen op een getypte prijs — voor wie niet klikt of tikt */}
        <form
          onSubmit={verwerkInvoer}
          className="rounded-xl border border-brand-200 bg-white p-4"
        >
          <label
            htmlFor={invoerId}
            className="block text-sm font-semibold text-body"
          >
            Lijn toevoegen op prijs (in euro&apos;s)
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              id={invoerId}
              type="text"
              inputMode="decimal"
              value={invoerTekst}
              onChange={(e) => setInvoerTekst(e.target.value)}
              disabled={controle !== null}
              placeholder="bijv. 84,50"
              aria-describedby={invoerHintId}
              className="w-28 rounded-lg border border-lijn bg-white px-3 py-2.5 text-sm font-bold text-ink placeholder:font-normal placeholder:text-body/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={controle !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Lijn toevoegen
            </button>
          </div>
          <p id={invoerHintId} className="mt-2 text-xs text-body">
            Kies een prijs tussen {eur(ondergrens)} en {eur(bovengrens)}. Een
            komma als decimaalteken is prima.
          </p>
        </form>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={controleer}
          disabled={lijnen.length === 0 || controle !== null}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Controleer mijn lijnen
        </button>
        <button
          type="button"
          onClick={opnieuw}
          className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          <RotateCcw className="h-4 w-4" />
          Opnieuw
        </button>
      </div>

      {/* Het resultaat, in een aria-live-regio zodat schermlezers het horen */}
      <div aria-live="polite">
        {controle && (
          <div className="mt-5 rounded-xl border border-brand-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-bold uppercase tracking-wide text-brand-700">
                Jouw resultaat
              </h4>
              <span className="rounded-full bg-goud-100 px-3 py-1 text-sm font-extrabold text-goud-600">
                {controle.score} van 100 punten
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">
              {scoreBoodschap(controle)}
            </p>
            <p className="mt-1 text-xs text-body">
              We rekenen met een marge van ±1,5% van het prijsbereik (hier zo&apos;n{" "}
              {eur(oefening.tolerantie)}): zones zijn nou eenmaal geen lijnen op
              de cent. Elke gevonden zone telt mee; elke overbodige lijn kost 15
              punten.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wide text-body">
                  De echte zones
                </h5>
                <ul className="mt-2 space-y-2">
                  {controle.zones.map(({ zone, gevonden }) => (
                    <li key={zone.prijs} className="flex items-start gap-2 text-sm">
                      {gevonden ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-groen-600" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-goud-600" />
                      )}
                      <span className="text-body">
                        <span className="font-bold text-ink">
                          Zone rond {eur(zone.prijs)}
                        </span>{" "}
                        — {gevonden ? "gevonden" : "gemist"}. De koers ketste er{" "}
                        {zone.raakIndexen.length}× op af; dáárom is dit een
                        zone.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wide text-body">
                  Jouw lijnen
                </h5>
                <ul className="mt-2 space-y-2">
                  {controle.lijnen.map((lijn) => (
                    <li key={lijn.prijs} className="flex items-start gap-2 text-sm">
                      {lijn.raak ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-groen-600" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-body" />
                      )}
                      <span className="text-body">
                        <span className="font-bold text-ink">{eur(lijn.prijs)}</span>{" "}
                        — {lijn.raak ? "raak" : "overbodig: hier ligt geen zone"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Eerlijk over de grenzen van deze oefening. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar deze oefening ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            Deze koersen zijn gesimuleerd en de zones zijn er bewust in
            gebouwd. Op echte grafieken is de ruis groter en zie je zones vaak
            pas achteraf duidelijk.
          </li>
          <li>
            Een zone herkennen is geen voorspelling: steun kan morgen alsnog
            breken. Vraag daarom om bevestiging (slotkoers, volume, terugtest)
            vóór je op een niveau handelt — precies zoals de les zegt.
          </li>
          <li>
            De wetenschappelijke kritiek op technische analyse blijft gelden:
            er is geen bewijs dat je met patronen als deze structureel de markt
            verslaat.
          </li>
          <li>
            Wij zijn een opleider, geen adviseur — niets in deze oefening is
            beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
