import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  ChevronDown,
  Mail,
  Rocket,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PRICING } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op de meestgestelde vragen over Beleggingscollege: beginnen, kosten, accounts, certificaten, opzeggen, terugbetaling en waarom dit onderwijs is en geen beleggingsadvies.",
  alternates: { canonical: "/veelgestelde-vragen" },
};

/**
 * Eén bron voor zowel de zichtbare accordeons als de FAQPage JSON-LD.
 * `antwoord` is bewust platte tekst (array van alinea's): Google leest dezelfde
 * woorden als de bezoeker. Een eventuele `link` is extra en staat niet in de
 * schema-tekst, zodat het antwoord ook zonder die link volledig is.
 */
type Vraag = {
  vraag: string;
  antwoord: string[];
  link?: { href: string; tekst: string };
};

type Groep = {
  titel: string;
  icon: LucideIcon;
  vragen: Vraag[];
};

const faqGroepen: Groep[] = [
  {
    titel: "Beginnen",
    icon: Rocket,
    vragen: [
      {
        vraag: "Hoe begin ik met een cursus?",
        antwoord: [
          "Je kiest een cursus en klikt op de eerste les. Meer is het niet: er is geen inschrijfformulier, geen wachtlijst en geen startdatum.",
          "De cursus Beleggen voor Beginners is gratis en compleet. Elke les lees je in een paar minuten en sluit je af met een korte quiz, zodat je meteen merkt of het blijft hangen.",
        ],
        link: {
          href: `/cursussen/${PRICING.gratisCursusSlug}`,
          tekst: "Start de gratis beginnerscursus",
        },
      },
      {
        vraag: "Heb ik voorkennis nodig?",
        antwoord: [
          "Nee. De beginnerscursus begint echt bij nul: wat is een aandeel, wat is een obligatie, hoe werkt rente op rente en waarom is spreiden zo belangrijk. Vaktermen leggen we uit op het moment dat ze voor het eerst voorbijkomen.",
          "Je hebt geen economische opleiding nodig en ook geen groot vermogen. Nieuwsgierigheid en een beetje geduld zijn genoeg.",
        ],
      },
      {
        vraag: "Moet ik een account maken?",
        antwoord: [
          "Voor de gratis beginnerscursus niet: die kun je meteen volgen zonder iets aan te maken. Wil je een betaalde cursus kopen, dan log je in met je Google-account. Dat is nodig om de cursus aan jou te kunnen koppelen, zodat je hem terugvindt.",
          "Zonder account blijft je voortgang — XP, badges, streak en quizscores — in je eigen browser. Dat heeft een keerzijde die je moet weten: die voortgang hoort dan bij dit apparaat én deze browser. Wis je je browsergegevens of stap je over op een andere computer, dan begin je daar met een schone lei.",
          "Log je in, dan bewaren we je voortgang op je account en reist hij mee naar elk apparaat waarop je inlogt. Wat er al in je browser stond, nemen we bij je eerste keer inloggen eenmalig over. Eén ding blijft lokaal: wélk antwoord je bij een quizvraag koos, zodat je het kunt terugkijken. Dat reist dus niet mee.",
        ],
      },
      {
        vraag: "Kan ik pauzeren en later verder gaan?",
        antwoord: [
          "Ja. Elke les die je afrondt wordt onthouden. Kom je een week of een maand later terug, dan zie je op je leerpad precies waar je gebleven bent — ingelogd op elk apparaat, uitgelogd in dezelfde browser.",
          "Er is geen tijdslimiet, geen huiswerk en geen inhaalschema. Twee lessen per week is prima; alles in één avond mag ook.",
        ],
        link: { href: "/leerpad", tekst: "Bekijk je leerpad" },
      },
      {
        vraag: "Op welke apparaten werkt het?",
        antwoord: [
          "Op alles met een moderne browser: telefoon, tablet, laptop of desktop, met Chrome, Safari, Firefox of Edge. Je hoeft niets te installeren, er is geen app en er zijn geen plug-ins nodig.",
          "Je hebt alleen internet nodig om de lessen te laden. Je certificaat kun je gewoon printen of als PDF opslaan.",
        ],
      },
    ],
  },
  {
    titel: "Kosten en betalen",
    icon: Wallet,
    vragen: [
      {
        vraag: "Wat kost het?",
        antwoord: [
          "Beleggen voor Beginners is gratis en blijft gratis. Geen proefperiode, geen creditcard, geen halve cursus die na les drie op slot gaat.",
          `Een verdiepende cursus koop je los voor eenmalig ${PRICING.losseCursus} (kortere cursussen €29). Daarmee heb je levenslang toegang tot die cursus — geen abonnement dat doorloopt, geen verlenging die je moet opzeggen.`,
          `College+, het abonnement van ${PRICING.abonnementMaand} per maand met toegang tot alle cursussen, is er nog niet. Dat wachten we af tot automatische incasso is goedgekeurd. Tot die tijd koop je cursussen los.`,
        ],
      },
      {
        vraag: "Hoe kan ik betalen?",
        antwoord: [
          "Het betalen loopt via Mollie, een Nederlandse betaaldienstverlener. Je kunt betalen met iDEAL, creditcard of debitcard, PayPal en Apple Pay.",
          "Je betaalgegevens gaan rechtstreeks naar Mollie. Wij zien en bewaren je kaart- of rekeninggegevens niet.",
        ],
      },
      {
        vraag: "Zijn er kortingen voor studenten of groepen?",
        antwoord: [
          "Er is nog geen vaste kortingsregeling. Studeer je, of wil je met een klas, vereniging of team samen aan de slag? Stuur dan een mail naar beheer@beleggingscollege.nl, dan kijken we wat mogelijk is.",
          "En vergeet niet: de complete beginnerscursus is sowieso gratis, voor iedereen.",
        ],
      },
      {
        vraag: "Kan ik opzeggen?",
        antwoord: [
          "College+ wordt maandelijks opzegbaar, zonder opzegtermijn en zonder jaarcontract. Je zegt zelf op in je account en je houdt toegang tot het einde van de maand die je al betaald hebt.",
          "Een losse cursus is geen abonnement. Je betaalt één keer en er valt dus ook niets op te zeggen: de cursus blijft van jou.",
        ],
      },
      {
        vraag: "Kan ik mijn geld terugkrijgen?",
        antwoord: [
          "Bij digitale producten heb je wettelijk veertien dagen bedenktijd, maar dat herroepingsrecht vervalt zodra je met jouw uitdrukkelijke toestemming direct begint met de cursus. Dat vragen we daarom expliciet bij het afrekenen, in gewone taal, zodat je weet waar je ja tegen zegt.",
          "In de praktijk doen we er niet moeilijk over. Blijkt een cursus echt niet te zijn wat je zocht, mail dan binnen veertien dagen naar beheer@beleggingscollege.nl. Zeker als je nog nauwelijks lessen hebt gedaan, komen we er samen uit.",
          "Twijfel je? Doe eerst de gratis beginnerscursus. Dan weet je precies hoe onze lessen zijn opgebouwd voordat je iets betaalt.",
        ],
      },
    ],
  },
  {
    titel: "Certificaat en voortgang",
    icon: Award,
    vragen: [
      {
        vraag: "Krijg ik een certificaat?",
        antwoord: [
          "Ja. Rond je alle lessen van een cursus af, dan kun je een certificaat op naam openen, printen of als PDF bewaren.",
          "We zijn er wel eerlijk over wat het is: een bewijs dat je de stof hebt doorlopen. Het is geen door de overheid of de AFM erkend diploma en geen beroepskwalificatie. De echte winst is dat je snapt waar je het over hebt.",
        ],
      },
      {
        vraag: "Wat zijn die XP, levels en badges?",
        antwoord: [
          "Een klein duwtje in de rug om door te gaan. Je verdient 50 XP voor elke afgeronde les en tot 25 XP bonus voor een goede quizscore. Zo klim je van Toeschouwer naar Meesterbelegger.",
          "Herhaal je een les, dan levert dat geen extra XP op. Herlezen mag altijd en is vaak juist slim; het gaat om je begrip, niet om je score.",
        ],
      },
      {
        vraag: "Wat als ik iets niet snap?",
        antwoord: [
          "Lees de les gerust nog een keer. De quiz laat na je antwoord zien waaróm iets goed of fout is, dus juist een fout antwoord is leerzaam.",
          "Kom je er echt niet uit, mail dan naar beheer@beleggingscollege.nl met de cursus en de naam van de les. We beantwoorden graag inhoudelijke vragen over de lesstof.",
        ],
      },
    ],
  },
  {
    titel: "Goed om te weten",
    icon: ShieldCheck,
    vragen: [
      {
        vraag: "Is dit beleggingsadvies?",
        antwoord: [
          "Nee. Beleggingscollege geeft onderwijs. We leggen uit hoe beleggen werkt en hoe je zelf een onderbouwde keuze maakt, maar we vertellen je niet wat je moet kopen of verkopen en we doen geen aanbevelingen over specifieke aandelen of fondsen.",
          "We kennen jouw persoonlijke situatie niet, dus alles wat je hier leest is algemene informatie. Wil je advies dat op jouw situatie is toegesneden, ga dan naar een adviseur met een vergunning.",
          "En het hoort erbij: beleggen brengt risico's met zich mee. Je kunt een deel van je inleg of je hele inleg verliezen, en resultaten uit het verleden zeggen niets over de toekomst.",
        ],
      },
      {
        vraag: "Waarop is de lesstof gebaseerd?",
        antwoord: [
          "Op de klassiekers. Denk aan het werk van Benjamin Graham over waardebeleggen en dat van John Bogle over indexbeleggen: ideeën die decennia meegaan en die door duizenden beleggers zijn getoetst.",
          "Wat je hier niet vindt: hete tips, hypes en beloftes over snel rijk worden. Beleggen is saai werk dat pas over jaren zijn waarde bewijst, en zo brengen we het ook.",
        ],
      },
      {
        vraag: "Wie zit erachter en hoe neem ik contact op?",
        antwoord: [
          "Beleggingscollege is een initiatief van Jason Krijgsman uit Den Haag, ingeschreven bij de KVK onder nummer 71856633 (voorheen Visual Future, in juni 2023 van naam veranderd).",
          "Er is nog geen chat of forum, dus e-mail is de snelste weg: beheer@beleggingscollege.nl. Vragen over de lesstof, een tikfout die je vond of een idee voor een cursus zijn allemaal welkom.",
        ],
      },
    ],
  },
];

const alleVragen = faqGroepen.flatMap((groep) => groep.vragen);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: alleVragen.map((v) => ({
    "@type": "Question",
    name: v.vraag,
    acceptedAnswer: {
      "@type": "Answer",
      text: v.antwoord.join(" "),
    },
  })),
};

export default function VeelgesteldeVragenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-extrabold text-ink">
          Veelgestelde vragen
        </h1>
        <p className="mt-3 leading-relaxed text-body">
          Hieronder staan de vragen die we het vaakst krijgen, met eerlijke
          antwoorden — ook waar het antwoord &quot;nog niet&quot; is. Staat jouw
          vraag er niet bij? Mail gerust.
        </p>

        <div className="mt-12 space-y-12">
          {faqGroepen.map((groep) => {
            const Icon = groep.icon;
            return (
              <section key={groep.titel}>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-ink">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {groep.titel}
                </h2>

                <div className="mt-5 space-y-3">
                  {groep.vragen.map((v) => (
                    <details
                      key={v.vraag}
                      className="group rounded-2xl border border-lijn bg-white shadow-card transition-colors open:border-brand-200 hover:border-brand-200"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 font-semibold text-ink transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 group-open:bg-brand-50 [&::-webkit-details-marker]:hidden">
                        <span>{v.vraag}</span>
                        <ChevronDown
                          className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="space-y-3 border-t border-lijn px-6 py-5">
                        {v.antwoord.map((alinea) => (
                          <p key={alinea} className="leading-relaxed text-body">
                            {alinea}
                          </p>
                        ))}
                        {v.link && (
                          <p className="pt-1">
                            <Link
                              href={v.link.href}
                              className="text-sm font-semibold text-brand-600 underline-offset-4 hover:text-brand-700 hover:underline"
                            >
                              {v.link.tekst} →
                            </Link>
                          </p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-14 rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-groen-50 text-groen-600">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            Nog een vraag?
          </h2>
          <p className="mt-4 leading-relaxed text-body">
            Mail naar{" "}
            <a
              href="mailto:beheer@beleggingscollege.nl"
              className="font-semibold text-brand-600 underline-offset-4 hover:text-brand-700 hover:underline"
            >
              beheer@beleggingscollege.nl
            </a>
            . We lezen alles zelf en antwoorden meestal binnen een paar dagen.
            Vragen over de lesstof zijn altijd welkom; vragen over jouw eigen
            portefeuille kunnen we niet beantwoorden, want dat zou persoonlijk
            beleggingsadvies zijn.
          </p>
          <p className="mt-4 leading-relaxed text-body">
            Liever eerst zelf rondkijken?{" "}
            <Link
              href="/cursussen"
              className="font-semibold text-brand-600 underline-offset-4 hover:text-brand-700 hover:underline"
            >
              Bekijk alle cursussen
            </Link>{" "}
            of begin meteen met de gratis beginnerscursus.
          </p>
        </div>
      </div>
    </>
  );
}
