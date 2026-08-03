import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Waarom Beleggingscollege bestaat: eerlijk, toegankelijk beleggingsonderwijs geworteld in de klassieke boeken. Geen goeroes, geen tips, geen rendementsbeloftes.",
  alternates: { canonical: "/over-ons" },
};

const BOEKEN = [
  {
    titel: "The Intelligent Investor",
    auteur: "Benjamin Graham (1949)",
    waarom:
      "De basis van waardebeleggen: Mr. Market, de veiligheidsmarge en het idee dat je mede-eigenaar wordt van een bedrijf.",
  },
  {
    titel: "The Little Book of Common Sense Investing",
    auteur: "John C. Bogle",
    waarom:
      "Waarom kosten en spreiding op de lange termijn zwaarder wegen dan het slimste idee van vandaag.",
  },
  {
    titel: "Common Stocks and Uncommon Profits",
    auteur: "Philip Fisher",
    waarom:
      "Hoe je kwaliteit van een bedrijf beoordeelt: management, groei en wat je niet in de cijfers terugvindt.",
  },
  {
    titel: "A Random Walk Down Wall Street",
    auteur: "Burton Malkiel",
    waarom:
      "Wat de wetenschap zegt over voorspellen, bubbels en de grenzen van je eigen kunnen.",
  },
  {
    titel: "The Psychology of Money",
    auteur: "Morgan Housel",
    waarom:
      "Beleggen gaat minder over rekenen dan over gedrag: geduld, angst en het vermogen om niets te doen.",
  },
];

const NIET = [
  "Geen koop- of verkooptips en geen signaaldienst. We vertellen je nooit welk aandeel je morgen moet kopen.",
  "Geen rendementsbeloftes. Wie je een percentage garandeert, verkoopt je iets anders dan kennis.",
  "Geen persoonlijk beleggingsadvies. We geven onderwijs; advies dat is afgestemd op jouw situatie hoort bij een adviseur onder toezicht van de AFM.",
  "Geen verborgen verdienmodel. Onze cursussen zijn waar we ons geld mee verdienen, punt.",
];

export default function OverOnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">
        Over Beleggingscollege
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-body">
        Beleggen is voor veel mensen een gesloten wereld: vol jargon,
        tegenstrijdige tips en verhalen over iemand die rijk werd met iets waar
        jij nog nooit van had gehoord. Beleggingscollege bestaat om die wereld
        open te breken — met onderwijs in plaats van beloftes.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">Waarom we bestaan</h2>
      <p className="mt-3 leading-relaxed text-body">
        Zoek online naar informatie over beleggen en je zit binnen twee klikken
        bij iemand die je vertelt hoe je snel rijk wordt. De toon is altijd
        hetzelfde: haast, geheimen en een cursus die vandaag toevallig in de
        aanbieding is. Wie het rustig en eerlijk uitgelegd wil krijgen, blijft
        met lege handen achter.
      </p>
      <p className="mt-4 leading-relaxed text-body">
        Daar zit het gat dat we vullen. Financiële educatie zou net zo gewoon
        moeten zijn als leren autorijden: je leert de regels, je leert de
        risico&apos;s, je oefent — en daarna beslis je zelf. Toegankelijk voor
        wie nog nooit een effectenrekening heeft geopend, en eerlijk genoeg om
        te zeggen wat we niet weten.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        Geworteld in de klassieke boeken
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        We bedenken het wiel niet opnieuw. Het beste dat ooit over beleggen is
        geschreven, staat al tientallen jaren in boeken die zich door meerdere
        crashes heen bewezen hebben. Onze lessen vertalen dat werk naar
        begrijpelijk Nederlands, met voorbeelden van deze tijd.
      </p>
      <div className="mt-6 space-y-3">
        {BOEKEN.map((b) => (
          <div
            key={b.titel}
            className="rounded-2xl border border-lijn bg-white p-6 shadow-card"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <h3 className="font-bold text-ink">{b.titel}</h3>
                <p className="text-sm font-semibold text-body">{b.auteur}</p>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {b.waarom}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 leading-relaxed text-body">
        Bij elke les vermelden we waar een idee vandaan komt, zodat je het zelf
        kunt nalezen. Onderwijs zonder bronnen is gewoon een mening.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        Hoe het platform werkt
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Je leert in korte lessen die je in een kwartier uitleest, elk met een
        quiz om te checken of het echt is blijven hangen. Daarna beloont het
        platform je: XP per afgeronde les, levels van Toeschouwer tot
        Meesterbelegger, badges voor mijlpalen en een streak voor elke dag dat
        je terugkomt. Rond je een cursus af, dan krijg je een certificaat.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Sparkles,
            kleur: "bg-brand-100 text-brand-700",
            titel: "Korte lessen",
            tekst: "Eén onderwerp per les, met een quiz als afsluiter.",
          },
          {
            icon: Award,
            kleur: "bg-goud-100 text-goud-600",
            titel: "XP en badges",
            tekst: "Discipline belonen werkt beter dan jezelf dwingen.",
          },
          {
            icon: GraduationCap,
            kleur: "bg-groen-100 text-groen-700",
            titel: "Certificaat",
            tekst: "Bewijs dat je de stof echt hebt doorgewerkt.",
          },
        ].map((f) => (
          <div
            key={f.titel}
            className="rounded-2xl border border-lijn bg-white p-6 shadow-card"
          >
            <span className={`inline-flex rounded-xl p-2.5 ${f.kleur}`}>
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-bold text-ink">{f.titel}</h3>
            <p className="mt-1 text-sm leading-relaxed text-body">{f.tekst}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 leading-relaxed text-body">
        Je begint zonder account en zonder iets te installeren: je voortgang
        blijft dan in je eigen browser. Log je in, dan reist hij mee naar elk
        apparaat. De cursus Beleggen voor Beginners is en blijft gratis.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">Wie erachter zit</h2>
      <div className="mt-4 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <p className="leading-relaxed text-body">
          Beleggingscollege is het werk van Jason Krijgsman, ondernemer uit Den
          Haag. Het idee loopt al mee sinds 2016: eerst als losse aantekeningen
          en uitleg voor vrienden die wilden beginnen met beleggen, later als
          plan voor een echt platform.
        </p>
        <p className="mt-4 leading-relaxed text-body">
          Geen vermogensbeheerder en geen bekende naam uit de financiële wereld
          dus, maar een autodidact: iemand die het vak jarenlang uit boeken,
          jaarverslagen en zijn eigen fouten heeft geleerd, en die daarbij vooral
          merkte hoe slecht dat proces is uitgelegd. Dat is precies waarom de
          lessen klinken zoals ze klinken: geduldig, zonder show, en met de
          twijfels erbij.
        </p>
        <p className="mt-4 leading-relaxed text-body">
          Het bedrijf staat bij de KvK ingeschreven onder nummer 71856633. Het
          heette eerder Visual Future en draagt sinds juni 2023 de naam
          Beleggingscollege.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        Waar we niet voor staan
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Net zo belangrijk als wat we doen, is wat we bewust niet doen:
      </p>
      <ul className="mt-5 space-y-3">
        {NIET.map((n) => (
          <li
            key={n}
            className="flex items-start gap-3 rounded-2xl border border-lijn bg-white p-5 shadow-card"
          >
            <X className="mt-0.5 h-5 w-5 shrink-0 text-paars-600" />
            <span className="text-sm leading-relaxed text-body">{n}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-mist p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-groen-600" />
        <p className="text-sm leading-relaxed text-body">
          Beleggen brengt risico&apos;s met zich mee: je kunt (een deel van) je
          inleg verliezen. Wat je hier leert, is bedoeld om je eigen keuzes beter
          te begrijpen — de keuze zelf blijft altijd van jou.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">Begin gewoon</h2>
      <p className="mt-3 leading-relaxed text-body">
        Je hoeft niets te beslissen om te beginnen. Doe de gratis
        beginnerscursus, kijk of onze manier van uitleggen bij je past, en ga
        pas verder als het klikt. Sluit je vandaag bij ons aan en zet een eerste
        stap — in je eigen tempo.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/cursussen/beleggen-voor-beginners"
          className="rounded-full bg-groen-600 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-groen-700"
        >
          Start de gratis cursus
        </Link>
        <Link
          href="/cursussen"
          className="rounded-full border border-lijn bg-white px-7 py-3 text-sm font-bold text-ink transition-colors hover:bg-mist"
        >
          Bekijk alle cursussen
        </Link>
      </div>

      <div className="mt-14 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink">
          Bedrijfsgegevens
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-ink">Naam</dt>
            <dd className="text-body">Beleggingscollege</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">KVK-nummer</dt>
            <dd className="text-body">71856633</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Vestigingsplaats</dt>
            <dd className="text-body">Den Haag</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">E-mail</dt>
            <dd className="text-body">
              <a
                className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
                href="mailto:beheer@beleggingscollege.nl"
              >
                <Mail className="h-4 w-4" />
                beheer@beleggingscollege.nl
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
