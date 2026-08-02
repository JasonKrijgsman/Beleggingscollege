"use client";

import { useId, useMemo, useState } from "react";
import { BookOpen, Scale, TriangleAlert } from "lucide-react";

// Hoort bij de les "De veiligheidsmarge" (cursus Waardebeleggen, accent navy).
// Sterk vereenvoudigde waardering in Graham-stijl: winst laten groeien,
// een terminale K/W kiezen, terugrekenen naar vandaag en er een
// veiligheidsmarge afhalen. Doel: het mechanisme zíén, niet aandelen taxeren.

function eur(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function pct(n: number): string {
  return `${n.toLocaleString("nl-NL", { maximumFractionDigits: 1 })}%`;
}

function klem(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/* Eén invoerregel: een echt <label>, een schuif en een nummerveld die
   dezelfde waarde delen. Het nummerveld hangt aan het label via htmlFor;
   de schuif via aria-labelledby, zodat beide zonder muis én met
   schermlezer bedienbaar zijn. */
function SchuifVeld({
  label,
  waarde,
  zetWaarde,
  min,
  max,
  stap,
  eenheid,
  hint,
  waarschuwing,
}: {
  label: string;
  waarde: number;
  zetWaarde: (n: number) => void;
  min: number;
  max: number;
  stap: number;
  eenheid?: string;
  hint?: string;
  waarschuwing?: string | null;
}) {
  const labelId = useId();
  const veldId = useId();
  // Tijdens het typen tonen we de ruwe tekst, zodat je bijv. even een leeg
  // veld kunt hebben; bij verlaten van het veld springt hij terug op de waarde.
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
          className="w-full flex-1 accent-navy-600"
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
            className="w-20 rounded-lg border border-lijn bg-white px-2 py-2 text-right text-sm font-bold text-ink focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
          {eenheid && (
            <span className="text-sm font-semibold text-body">{eenheid}</span>
          )}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-body">{hint}</p>}
      <div aria-live="polite">
        {waarschuwing && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-goud-600">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {waarschuwing}
          </p>
        )}
      </div>
    </div>
  );
}

function Balk({
  label,
  bedrag,
  maxBedrag,
  kleur,
}: {
  label: string;
  bedrag: number;
  maxBedrag: number;
  kleur: string;
}) {
  const breedte = Math.max(2, (bedrag / maxBedrag) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs font-semibold">
        <span className="text-body">{label}</span>
        <span className="text-ink">{eur(bedrag)}</span>
      </div>
      <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-mist">
        <div
          className={`h-full rounded-full ${kleur}`}
          style={{ width: `${breedte}%` }}
        />
      </div>
    </div>
  );
}

export default function IntrinsiekeWaardeTool() {
  const [winst, setWinst] = useState(2);
  const [groei, setGroei] = useState(5);
  const [jaren, setJaren] = useState(5);
  const [rendement, setRendement] = useState(8);
  const [kw, setKw] = useState(12);
  const [marge, setMarge] = useState(30);
  const [koersTekst, setKoersTekst] = useState("");
  const koersId = useId();

  const vulVoorbeeld = () => {
    // Stroopwafel NV, het fictieve bedrijf uit de les.
    setWinst(2.5);
    setGroei(6);
    setJaren(10);
    setRendement(10);
    setKw(12);
    setMarge(30);
    setKoersTekst("40");
  };

  const berekening = useMemo(() => {
    const eindwinst = winst * Math.pow(1 + groei / 100, jaren);
    const koersToekomst = eindwinst * kw;
    const waardeNu = koersToekomst / Math.pow(1 + rendement / 100, jaren);
    const koopgrens = waardeNu * (1 - marge / 100);
    return { eindwinst, koersToekomst, waardeNu, koopgrens };
  }, [winst, groei, jaren, rendement, kw, marge]);

  const koers = useMemo(() => {
    const n = Number(koersTekst.replace(",", "."));
    return koersTekst.trim() !== "" && Number.isFinite(n) && n > 0 ? n : null;
  }, [koersTekst]);

  const { eindwinst, koersToekomst, waardeNu, koopgrens } = berekening;
  const feitelijkeMarge = koers !== null ? (1 - koers / waardeNu) * 100 : null;
  const isKoopje = koers !== null && koers <= koopgrens;
  const maxBedrag = Math.max(waardeNu, koopgrens, koers ?? 0) * 1.05;

  const stappen: { titel: string; uitleg: string }[] = [
    {
      titel: "Laat de winst groeien",
      uitleg: `${eur(winst)} winst per aandeel groeit ${pct(groei)} per jaar, ${jaren} jaar lang → ${eur(eindwinst)} winst per aandeel.`,
    },
    {
      titel: "Plak er een waardering op",
      uitleg: `${eur(eindwinst)} × terminale K/W van ${kw.toLocaleString("nl-NL")} = ${eur(koersToekomst)} verwachte koers over ${jaren} jaar.`,
    },
    {
      titel: "Reken terug naar vandaag",
      uitleg: `${eur(koersToekomst)} gedeeld door (1 + ${pct(rendement)})^${jaren} = ${eur(waardeNu)} geschatte waarde nú. Zo verreken je dat jij ${pct(rendement)} per jaar wílt verdienen op je geld.`,
    },
    {
      titel: "Haal de veiligheidsmarge eraf",
      uitleg: `${eur(waardeNu)} × (1 − ${pct(marge)}) = ${eur(koopgrens)}. Onder die grens is je schatting er ${pct(marge)} naast mag zitten zonder dat je te veel betaalde.`,
    },
  ];

  return (
    <div className="my-8 rounded-2xl border-2 border-navy-200 bg-navy-50/50 p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-700">
        <Scale className="h-4 w-4" />
        Probeer het zelf
      </div>
      <h3 className="text-xl font-bold text-ink">
        Intrinsieke waarde en veiligheidsmarge
      </h3>
      <p className="mt-1 text-sm text-body">
        Vul in wat jíj redelijk vindt en zie stap voor stap wat een aandeel dan
        waard zou zijn — en waarom je er bewust minder voor biedt. De uitkomst
        is zo goed of slecht als je aannames; juist daarom bestaat de marge.
      </p>

      <button
        type="button"
        onClick={vulVoorbeeld}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-navy-300"
      >
        <BookOpen className="h-4 w-4" />
        Vul het voorbeeld uit de les in (Stroopwafel NV)
      </button>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SchuifVeld
          label="Winst per aandeel nu"
          waarde={winst}
          zetWaarde={setWinst}
          min={0.1}
          max={50}
          stap={0.1}
          eenheid="€"
        />
        <SchuifVeld
          label="Verwachte winstgroei per jaar"
          waarde={groei}
          zetWaarde={setGroei}
          min={0}
          max={15}
          stap={0.5}
          eenheid="%"
          waarschuwing={
            groei > 10
              ? "Hoge groei jaren volhouden is zeldzamer dan je denkt."
              : null
          }
        />
        <SchuifVeld
          label="Jaren vooruit"
          waarde={jaren}
          zetWaarde={setJaren}
          min={3}
          max={10}
          stap={1}
          eenheid="jaar"
        />
        <SchuifVeld
          label="Gewenst rendement per jaar (discontovoet)"
          waarde={rendement}
          zetWaarde={setRendement}
          min={6}
          max={15}
          stap={0.5}
          eenheid="%"
        />
        <SchuifVeld
          label="Terminale koers-winstverhouding (K/W)"
          waarde={kw}
          zetWaarde={setKw}
          min={5}
          max={25}
          stap={1}
          eenheid="×"
          hint="Standaard 12: bewust aan de voorzichtige kant. De hoge waarderingen van vandaag zijn geen garantie voor over tien jaar."
        />
        <SchuifVeld
          label="Veiligheidsmarge"
          waarde={marge}
          zetWaarde={setMarge}
          min={10}
          max={50}
          stap={1}
          eenheid="%"
        />
        <div className="sm:col-span-2">
          <label
            htmlFor={koersId}
            className="block text-sm font-semibold text-body"
          >
            Huidige beurskoers (optioneel)
          </label>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-sm font-semibold text-body">€</span>
            <input
              id={koersId}
              type="text"
              inputMode="decimal"
              value={koersTekst}
              onChange={(e) => setKoersTekst(e.target.value)}
              placeholder="bijv. 40,00"
              className="w-32 rounded-lg border border-lijn bg-white px-3 py-2 text-sm font-bold text-ink placeholder:font-normal placeholder:text-body/60 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-200"
            />
          </div>
          <p className="mt-1.5 text-xs text-body">
            Vul een koers in en je ziet hoe die zich verhoudt tot jouw
            geschatte waarde en koopgrens.
          </p>
        </div>
      </div>

      {/* De rekenstappen, opengeklapt — het mechanisme is de les. */}
      <div className="mt-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold uppercase tracking-wide text-navy-700">
          Zo rekenen we
        </h4>
        <ol className="mt-3 space-y-3">
          {stappen.map((stap, i) => (
            <li key={stap.titel} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                {i + 1}
              </span>
              <div className="text-sm">
                <span className="font-semibold text-ink">{stap.titel}.</span>{" "}
                <span className="text-body">{stap.uitleg}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div aria-live="polite">
        <div className="mt-4 grid gap-3 text-center sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-body">
              Geschatte waarde per aandeel
            </div>
            <div className="mt-1 text-xl font-extrabold text-navy-700">
              {eur(waardeNu)}
            </div>
          </div>
          <div className="rounded-xl bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-body">
              Maximale koopprijs bij {pct(marge)} marge
            </div>
            <div className="mt-1 text-xl font-extrabold text-goud-600">
              {eur(koopgrens)}
            </div>
          </div>
        </div>

        {koers !== null && feitelijkeMarge !== null && (
          <div className="mt-4 rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
            <h4 className="text-sm font-bold uppercase tracking-wide text-navy-700">
              Koers naast waarde
            </h4>
            <div className="mt-3 space-y-3">
              <Balk
                label="Geschatte waarde"
                bedrag={waardeNu}
                maxBedrag={maxBedrag}
                kleur="bg-navy-600"
              />
              <Balk
                label={`Koopgrens (marge ${pct(marge)})`}
                bedrag={koopgrens}
                maxBedrag={maxBedrag}
                kleur="bg-goud-400"
              />
              <Balk
                label="Huidige koers"
                bedrag={koers}
                maxBedrag={maxBedrag}
                kleur={isKoopje ? "bg-groen-500" : "bg-[#9aa2ad]"}
              />
            </div>
            {isKoopje ? (
              <p className="mt-4 text-sm font-semibold text-groen-700">
                De koers ligt onder je koopgrens. Feitelijke marge:{" "}
                {pct(feitelijkeMarge)} onder de geschatte waarde — ruimer dan
                de {pct(marge)} die je zelf vroeg.
              </p>
            ) : feitelijkeMarge > 0 ? (
              <p className="mt-4 text-sm font-semibold text-body">
                De koers ligt {pct(feitelijkeMarge)} onder de geschatte waarde
                — minder dan de {pct(marge)} marge die je zelf vroeg. Niet
                fout, alleen minder buffer voor als je aannames tegenvallen.
              </p>
            ) : (
              <p className="mt-4 text-sm font-semibold text-body">
                De koers ligt {pct(-feitelijkeMarge)} bóven je geschatte
                waarde. Dat maakt het geen slecht bedrijf — het is volgens
                jouw aannames alleen geen koopje.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Eerlijk over de grenzen van dit model. */}
      <div className="mt-6 rounded-xl border border-lijn bg-white p-4 sm:p-5">
        <h4 className="text-sm font-bold text-ink">Waar dit model ophoudt</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            De aannames bepalen de uitkomst volledig: schuif de groei of de
            K/W een beetje en de waarde verschuift flink. Dat is geen fout van
            de tool — dat ís precies waarom de veiligheidsmarge bestaat.
          </li>
          <li>
            Dit is een leerinstrument om het mechanisme te snappen, geen
            koopsignaal en geen taxatie van een echt aandeel.
          </li>
          <li>
            Echte analisten rekenen met vrije kasstromen in plaats van winst,
            en toetsen elke aanname aan jaarverslagen.
          </li>
          <li>
            Wij zijn een opleider, geen adviseur — niets in deze tool is
            beleggingsadvies.
          </li>
        </ul>
      </div>
    </div>
  );
}
