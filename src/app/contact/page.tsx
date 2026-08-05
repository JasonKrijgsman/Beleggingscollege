import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock,
  GraduationCap,
  Handshake,
  Mail,
  MapPin,
  Megaphone,
  ShieldAlert,
  Wrench,
} from "lucide-react";

const EMAIL = "beheer@beleggingscollege.nl";
const MAILTO = `mailto:${EMAIL}?subject=Vraag%20via%20beleggingscollege.nl`;

/** Zie de toelichting in voorwaarden/page.tsx: adres uit de omgeving, nooit
 *  uit de repo; leeg telt als niet gezet. */
const ADRES = process.env.BEDRIJF_ADRES || null;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Een vraag over een cursus, een technisch probleem of een samenwerking? Mail Beleggingscollege op beheer@beleggingscollege.nl — je krijgt binnen twee werkdagen antwoord van een echt mens.",
  alternates: { canonical: "/contact" },
};

const ONDERWERPEN = [
  {
    icon: GraduationCap,
    kleur: "bg-brand-100 text-brand-700",
    titel: "Vragen over cursussen",
    tekst:
      "Snap je een les of quizvraag niet, of twijfel je welke cursus bij je past? Stuur je vraag door, dan denken we mee. Noem er even bij welke les het betreft.",
  },
  {
    icon: Wrench,
    kleur: "bg-navy-50 text-navy-700",
    titel: "Technische problemen",
    tekst:
      "Voortgang kwijt, quiz die niet laadt, certificaat dat niet wil printen? Vermeld welk apparaat en welke browser je gebruikt en de link van de pagina — dan vinden we het sneller.",
  },
  {
    icon: Handshake,
    kleur: "bg-groen-100 text-groen-700",
    titel: "Samenwerking",
    tekst:
      "Ben je auteur, docent of bouw je zelf aan financiële educatie? We staan open voor gastlessen, contentsamenwerking en het samen ontwikkelen van cursussen.",
  },
  {
    icon: Megaphone,
    kleur: "bg-paars-50 text-paars-700",
    titel: "Pers en media",
    tekst:
      "Journalist of maker van een podcast? Vraag gerust achtergrondinformatie of een interview aan over beleggingseducatie in Nederland.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Contact</h1>
      <p className="mt-4 leading-relaxed text-body">
        Loop je vast in een les, werkt er iets niet, of wil je gewoon even
        sparren over onze aanpak? Mail ons. Achter Beleggingscollege zit geen
        callcenter, maar de maker zelf — je krijgt dus antwoord van degene die
        de cursussen geschreven heeft.
      </p>

      {/* Primaire actie */}
      <div className="mt-8 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <h2 className="text-2xl font-bold text-ink">Stuur een e-mail</h2>
        <p className="mt-2 leading-relaxed text-body">
          We werken bewust zonder contactformulier: mail komt direct bij ons
          binnen, jij houdt je eigen bericht in je verzonden items en we hoeven
          geen gegevens van je op te slaan die we niet nodig hebben.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={MAILTO}
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-brand-700"
          >
            <Mail className="h-4 w-4" />
            Mail {EMAIL}
          </a>
          <Link
            href="/veelgestelde-vragen"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy-600 px-6 py-2.5 text-sm font-bold text-navy-700 transition-colors hover:bg-navy-50"
          >
            Bekijk eerst de veelgestelde vragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-body">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span>
            <strong className="text-ink">Binnen twee werkdagen antwoord.</strong>{" "}
            Duurt het langer, dan is je bericht ergens blijven hangen — stuur het
            gerust nog een keer. Geen automatische bevestigingsmail dus, maar wel
            een echte reactie.
          </span>
        </p>
      </div>

      {/* Waarvoor wel */}
      <h2 className="mt-12 text-2xl font-bold text-ink">
        Waarvoor je ons kunt mailen
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {ONDERWERPEN.map((o) => (
          <div
            key={o.titel}
            className="rounded-2xl border border-lijn bg-white p-6 shadow-card"
          >
            <div className={`inline-flex rounded-xl p-3 ${o.kleur}`}>
              <o.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">{o.titel}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{o.tekst}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 leading-relaxed text-body">
        Staat jouw vraag hier niet tussen? Mail hem alsnog. Een korte,
        eerlijke &quot;dit weten we niet&quot; krijg je liever van ons dan geen
        antwoord.
      </p>

      {/* Waarvoor niet */}
      <h2 className="mt-12 text-2xl font-bold text-ink">
        Waarvoor we je bewust niet helpen
      </h2>
      <div className="mt-6 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <div className="inline-flex rounded-xl bg-goud-100 p-3 text-goud-600">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink">
          Geen persoonlijk beleggingsadvies, geen tips over specifieke aandelen
        </h3>
        <p className="mt-3 leading-relaxed text-body">
          Vragen als &quot;wat moet ik nu kopen?&quot;, &quot;is dit aandeel een
          goed idee?&quot; of &quot;hoe zou jij mijn spaargeld beleggen?&quot;
          beantwoorden we niet. Niet omdat we je niet willen helpen, maar om drie
          redenen:
        </p>
        <ul className="mt-4 space-y-3 text-body">
          <li className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            <span className="leading-relaxed">
              <strong className="text-ink">We kennen jouw situatie niet.</strong>{" "}
              Goed advies hangt af van je inkomen, schulden, buffer, doelen,
              horizon en hoe je reageert als de koersen dertig procent zakken.
              Zonder dat volledige plaatje is elk antwoord een gok — en gokken
              met andermans geld doen we niet.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            <span className="leading-relaxed">
              <strong className="text-ink">
                Beleggingsadvies is gereguleerd werk.
              </strong>{" "}
              Wie in Nederland persoonlijk beleggingsadvies geeft, heeft daar een
              vergunning voor nodig. Beleggingscollege is een opleider, geen
              adviseur of vermogensbeheerder. Die grens bewaken we streng, in jouw
              belang.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            <span className="leading-relaxed">
              <strong className="text-ink">
                Van tips word je afhankelijk, van kennis zelfstandig.
              </strong>{" "}
              Een tip is één keer goed of fout. Begrijpen waaróm iets een goede of
              slechte belegging kan zijn, helpt je de rest van je leven. Dat is
              precies wat we je in de cursussen leren.
            </span>
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-body">
          Wat we wél graag doen: uitleggen hoe je zo&apos;n vraag zelf aanpakt,
          welke les of welk boek erover gaat, en welke afwegingen professionals
          daarbij maken. Heb je echt persoonlijk advies nodig, ga dan naar een
          onafhankelijk financieel adviseur met een AFM-vergunning.
        </p>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-body">
        Beleggen brengt risico&apos;s met zich mee; je kunt een deel van je inleg
        of je hele inleg verliezen. Alles op Beleggingscollege is educatie en
        algemene informatie, nooit een aanbeveling om iets te kopen of verkopen.
      </p>

      {/* Bedrijfsgegevens */}
      <h2 className="mt-12 text-2xl font-bold text-ink">Onze gegevens</h2>
      <div className="mt-6 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <dl className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div>
              <dt className="text-sm font-semibold text-body">Bedrijfsnaam</dt>
              <dd className="font-bold text-ink">Beleggingscollege</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div>
              <dt className="text-sm font-semibold text-body">KVK-nummer</dt>
              <dd className="font-bold text-ink">71856633</dd>
              <dd className="text-sm leading-relaxed text-body">
                Tot juni 2023 ingeschreven onder de naam Visual Future — zelfde
                onderneming, nieuwe naam.
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div>
              <dt className="text-sm font-semibold text-body">
                {ADRES ? "Vestigingsadres" : "Vestigingsplaats"}
              </dt>
              <dd className="font-bold text-ink">
                {ADRES ?? "Den Haag, Nederland"}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div>
              <dt className="text-sm font-semibold text-body">E-mail</dt>
              <dd className="font-bold">
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-600"
                >
                  {EMAIL}
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Slot */}
      <div className="mt-10 rounded-2xl border border-lijn bg-mist p-6">
        <h2 className="text-2xl font-bold text-ink">Sneller geholpen?</h2>
        <p className="mt-2 leading-relaxed text-body">
          De meeste vragen over prijzen, toegang, certificaten en hoe onze
          cursussen werken staan al beantwoord bij de veelgestelde vragen. Even
          kijken scheelt je twee werkdagen wachten.
        </p>
        <Link
          href="/veelgestelde-vragen"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-groen-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-groen-700"
        >
          Naar de veelgestelde vragen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
