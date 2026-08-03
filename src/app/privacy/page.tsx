import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  Database,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Hoe Beleggingscollege met je gegevens omgaat: wat we verwerken, waarom, hoe lang we het bewaren en welke rechten je hebt onder de AVG.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {/* Conceptmelding — weghalen zodra een jurist de tekst heeft goedgekeurd */}
      <div className="flex gap-3 rounded-2xl border border-goud-300 bg-goud-100 p-5">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-goud-600"
          aria-hidden="true"
        />
        <div className="text-sm leading-relaxed text-ink">
          <strong className="block font-bold">
            Concept — nog niet juridisch getoetst
          </strong>
          <p className="mt-1">
            Dit is een werkversie die nog door een jurist gecontroleerd moet
            worden voordat Beleggingscollege betalingen accepteert. Er kunnen
            geen rechten aan deze tekst worden ontleend zolang deze melding
            hier staat.
          </p>
        </div>
      </div>

      <h1 className="mt-10 text-4xl font-extrabold text-ink">
        Privacyverklaring
      </h1>
      <p className="mt-3 leading-relaxed text-body">
        We houden dit zo kort en zo eerlijk mogelijk. Volg je de gratis cursus
        zonder in te loggen, dan blijft je voortgang in je eigen browser en
        verwerken we vrijwel niets. Log je in, dan bewaren we je voortgang in
        onze database, gekoppeld aan je account. We volgen je niet en we
        verkopen nooit gegevens door. Hieronder lees je precies wat we in beide
        situaties verwerken.
      </p>
      <p className="mt-3 text-sm text-body">Conceptversie 2 — 3 augustus 2026</p>

      <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
          In het kort
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-body">
          <li>
            Niet ingelogd? Dan staan je voortgang, XP en badges alleen in de
            opslag van je eigen browser en kunnen wij er niet bij. Ingelogd?
            Dan bewaren we ze op je account, zodat je op elk apparaat verder
            kunt. Je individuele quizantwoorden blijven in beide gevallen
            alleen in je browser.
          </li>
          <li>
            Geen trackingcookies, geen advertentiecookies, geen profilering.
          </li>
          <li>
            Log je in of koop je een cursus, dan verwerken we daarnaast je
            naam, e-mailadres en bestelgegevens. Betalingen lopen via Mollie;
            wij zien nooit je volledige bank- of kaartgegevens.
          </li>
          <li>Wij verkopen of verhuren je gegevens nooit aan derden.</li>
        </ul>
      </div>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Building2 className="h-6 w-6 text-brand-600" aria-hidden="true" />
        1. Wie is verantwoordelijk voor je gegevens?
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Beleggingscollege is de verwerkingsverantwoordelijke in de zin van de
        Algemene verordening gegevensbescherming (AVG).
      </p>
      <div className="mt-4 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <dl className="grid gap-x-8 gap-y-3 text-sm leading-relaxed text-body sm:grid-cols-[10rem_1fr]">
          <dt className="font-bold text-ink">Naam</dt>
          <dd>Beleggingscollege (voorheen Visual Future, naam gewijzigd in juni 2023)</dd>
          <dt className="font-bold text-ink">KVK-nummer</dt>
          <dd>71856633</dd>
          <dt className="font-bold text-ink">Eigenaar</dt>
          <dd>Jason Krijgsman</dd>
          <dt className="font-bold text-ink">Vestigingsplaats</dt>
          <dd>Den Haag, Nederland</dd>
          <dt className="font-bold text-ink">E-mail</dt>
          <dd>
            <a
              className="font-semibold text-brand-700 hover:text-brand-800"
              href="mailto:beheer@beleggingscollege.nl"
            >
              beheer@beleggingscollege.nl
            </a>
          </dd>
          <dt className="font-bold text-ink">Website</dt>
          <dd>beleggingscollege.nl</dd>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-body">
          We zijn niet verplicht een functionaris voor gegevensbescherming aan
          te stellen en hebben die dus niet. Vragen over privacy stel je direct
          via het e-mailadres hierboven.
        </p>
      </div>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Database className="h-6 w-6 text-brand-600" aria-hidden="true" />
        2. Wat we nu verwerken
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        De gratis beginnerscursus kun je volledig volgen zonder account. Dan
        verwerken we alleen de technische logs hieronder. Log je in of koop je
        een cursus, dan komt daar bij wat in hoofdstuk 3 staat.
      </p>

      <h3 className="mt-6 text-lg font-bold text-ink">
        Niet ingelogd: je voortgang staat in je eigen browser
      </h3>
      <p className="mt-2 leading-relaxed text-body">
        Zolang je niet bent ingelogd, slaan we welke lessen je hebt afgerond,
        je XP, je level, je streak, je badges en je quizscores op in de lokale
        opslag (localStorage) van je browser, onder de sleutel{" "}
        <span className="rounded bg-mist px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
          beleggingscollege-voortgang-v1
        </span>
        . Die gegevens blijven dan op jouw apparaat, worden niet naar ons of
        naar iemand anders verstuurd, en wij kunnen ze niet inzien. Wis je je
        browsergegevens, dan is je voortgang weg — ook voor ons is die dan niet
        te herstellen. Gebruik je een ander apparaat of een andere browser, dan
        begin je daar met een schone lei. Log je later in, dan neemt de site de
        voortgang uit je browser eenmalig mee naar je account (zie hoofdstuk
        3).
      </p>

      <h3 className="mt-6 text-lg font-bold text-ink">Technische logs</h3>
      <p className="mt-2 leading-relaxed text-body">
        Onze hostingpartij legt bij elk bezoek standaard technische gegevens
        vast, zoals je IP-adres, het opgevraagde adres, tijdstip en
        browsertype. Dat is nodig om de site te laten werken, storingen op te
        sporen en misbruik te blokkeren. We gebruiken die logs niet om je te
        volgen of om profielen op te bouwen.
      </p>

      <h3 className="mt-6 text-lg font-bold text-ink">
        E-mail die je ons stuurt
      </h3>
      <p className="mt-2 leading-relaxed text-body">
        Stuur je ons een bericht, dan verwerken we je e-mailadres en de inhoud
        van je bericht om je te kunnen antwoorden.
      </p>

      <h3 className="mt-6 text-lg font-bold text-ink">
        Cookies en meetsoftware
      </h3>
      <p className="mt-2 leading-relaxed text-body">
        We plaatsen geen trackingcookies en geen advertentiecookies, en we
        gebruiken geen advertentienetwerken. De lokale opslag die we gebruiken
        is puur functioneel: zonder die opslag kunnen we je voortgang niet
        onthouden. Daarvoor is geen toestemmingsbanner vereist. Zetten we later
        wél meetsoftware in, dan vragen we daar vooraf toestemming voor en
        passen we deze verklaring aan.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <CreditCard className="h-6 w-6 text-brand-600" aria-hidden="true" />
        3. Wat we verwerken als je inlogt of iets koopt
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Inloggen en losse cursussen kopen werken. Doe je dat, dan verwerken we
        de gegevens hieronder.
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          <strong className="text-ink">Accountgegevens:</strong> inloggen gaat
          uitsluitend via je Google-account. Wij vragen bij Google alleen je
          naam, je e-mailadres en je profielfoto op — meer niet. Een wachtwoord
          leggen wij dus nergens vast; dat houd je bij Google. Van die koppeling
          bewaren we de technische sleutels die nodig zijn om je sessie te laten
          werken.
        </li>
        <li>
          <strong className="text-ink">Bewijs van je akkoord:</strong> koop je
          een cursus, dan leggen we vast op welk moment je akkoord ging met het
          direct starten (en daarmee met het opgeven van je herroepingsrecht),
          welke versie van die tekst je zag, en het IP-adres van dat moment. Dat
          doen we omdat we bij een geschil moeten kunnen aantonen wat je precies
          hebt geaccepteerd. Dit bewaren we tot dertien maanden na de aankoop.
        </li>
        <li>
          <strong className="text-ink">Betaalgegevens:</strong> betalingen lopen
          via Mollie B.V. (iDEAL, creditcard/debitcard, PayPal en Apple Pay).
          Je vult je betaalgegevens in bij Mollie, niet bij ons. Mollie treedt
          daarbij op als verwerker en wij ontvangen alleen wat we nodig hebben
          om je bestelling af te handelen: het bedrag, de datum, de status van
          de betaling, de gebruikte betaalmethode en een betaalreferentie. Je
          volledige bankrekening- of kaartnummer krijgen wij niet te zien.
        </li>
        <li>
          <strong className="text-ink">Bestelgegevens:</strong> welke cursus je
          hebt gekocht, wanneer, voor welk bedrag en met welke status. Deze
          gegevens moeten we voor de belastingdienst zeven jaar bewaren, ook als
          je je account laat verwijderen.
        </li>
        <li>
          <strong className="text-ink">Voortgangsgegevens:</strong> ben je
          ingelogd, dan bewaren we welke lessen je hebt afgerond, je XP, je
          streak, je badges en je quizscores (het aantal goed per quiz) in onze
          database, gekoppeld aan je account. Zo reist je voortgang mee naar
          elk apparaat waarop je inlogt. Bij je eerste keer inloggen nemen we
          de voortgang die al in je browser stond eenmalig mee. Je individuele
          quizantwoorden — wélk antwoord je bij een vraag koos — bewaren we
          niet op de server; die blijven alleen in je browser.
        </li>
        <li>
          <strong className="text-ink">Nieuwsbrief:</strong> alleen als je je
          daar zelf voor aanmeldt. Elke e-mail bevat een afmeldlink.
        </li>
      </ul>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Scale className="h-6 w-6 text-brand-600" aria-hidden="true" />
        4. Waarom we dit mogen verwerken (grondslagen)
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-lijn">
              <th className="py-3 pr-4 font-bold text-ink">Gegevens</th>
              <th className="py-3 pr-4 font-bold text-ink">Doel</th>
              <th className="py-3 font-bold text-ink">Grondslag</th>
            </tr>
          </thead>
          <tbody className="align-top leading-relaxed text-body">
            <tr className="border-b border-lijn">
              <td className="py-3 pr-4">
                Voortgang in je browser (niet ingelogd)
              </td>
              <td className="py-3 pr-4">De cursus laten werken</td>
              <td className="py-3">
                Blijft op je apparaat; wij verwerken die gegevens niet
              </td>
            </tr>
            <tr className="border-b border-lijn">
              <td className="py-3 pr-4">Technische logs</td>
              <td className="py-3 pr-4">Beveiliging en beschikbaarheid</td>
              <td className="py-3">Gerechtvaardigd belang</td>
            </tr>
            <tr className="border-b border-lijn">
              <td className="py-3 pr-4">
                Account- en voortgangsgegevens (ingelogd)
              </td>
              <td className="py-3 pr-4">
                Toegang geven tot wat je hebt gekocht en je voortgang laten
                meereizen
              </td>
              <td className="py-3">Uitvoering van de overeenkomst</td>
            </tr>
            <tr className="border-b border-lijn">
              <td className="py-3 pr-4">Betaal- en bestelgegevens</td>
              <td className="py-3 pr-4">Betaling afhandelen</td>
              <td className="py-3">Uitvoering van de overeenkomst</td>
            </tr>
            <tr className="border-b border-lijn">
              <td className="py-3 pr-4">Facturen en boekhouding</td>
              <td className="py-3 pr-4">Fiscale administratie</td>
              <td className="py-3">Wettelijke verplichting</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Nieuwsbrief</td>
              <td className="py-3 pr-4">Je op de hoogte houden</td>
              <td className="py-3">Toestemming (altijd in te trekken)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">5. Hoe lang we het bewaren</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          <strong className="text-ink">Voortgang in je browser:</strong> tot je
          je browsergegevens wist. Jij hebt hier de knop, niet wij. Voortgang
          op je account valt onder de accountgegevens hieronder.
        </li>
        <li>
          <strong className="text-ink">Technische logs:</strong> kort, in de
          regel niet langer dan enkele maanden.
        </li>
        <li>
          <strong className="text-ink">Accountgegevens:</strong> zolang je
          account bestaat. Zeg je op en vraag je om verwijdering, dan wissen we
          je account; wat we wettelijk moeten bewaren blijft staan.
        </li>
        <li>
          <strong className="text-ink">Facturen en betaalgegevens:</strong>{" "}
          zeven jaar, vanwege de fiscale bewaarplicht.
        </li>
        <li>
          <strong className="text-ink">E-mailcorrespondentie:</strong> zolang
          dat nodig is om je vraag af te handelen en daarna maximaal twee jaar.
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        6. Met wie we gegevens delen
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        We delen niets meer dan nodig, en alleen met partijen die ons helpen de
        dienst te leveren. Met elk van hen sluiten we een
        verwerkersovereenkomst. We verkopen je gegevens nooit door en we
        gebruiken ze niet voor advertenties van derden.
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          <strong className="text-ink">Google Ireland Ltd.</strong> — inloggen.
          Google weet daardoor dát je hier inlogt. Wij vragen alleen je naam,
          e-mailadres en profielfoto op.
        </li>
        <li>
          <strong className="text-ink">Mollie B.V.</strong> (Amsterdam) —
          afhandeling van betalingen.
        </li>
        <li>
          <strong className="text-ink">Vercel Inc.</strong> — hosting van de
          website, inclusief de technische logs.
        </li>
        <li>
          <strong className="text-ink">Neon Inc.</strong> — de database waarin
          je account en je aankopen staan. Die database draait in Frankfurt,
          binnen de EU.
        </li>
        <li>
          <strong className="text-ink">STRATO AG</strong> — het e-mailverkeer
          naar en van beheer@beleggingscollege.nl.
        </li>
        <li>
          <strong className="text-ink">Onze boekhouder en de Belastingdienst</strong>{" "}
          — voor zover dat wettelijk verplicht is.
        </li>
      </ul>
      <p className="mt-4 leading-relaxed text-body">
        We proberen verwerking binnen de Europese Economische Ruimte te houden.
        Wordt er toch buiten de EER verwerkt, dan gebeurt dat op basis van een
        adequaatheidsbesluit of de standaardcontractbepalingen van de Europese
        Commissie.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <UserCheck className="h-6 w-6 text-brand-600" aria-hidden="true" />
        7. Je rechten
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Onder de AVG heb je een aantal rechten. Je hoeft geen reden op te geven
        en het kost je niets.
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          <strong className="text-ink">Inzage</strong> — opvragen welke
          gegevens we van je hebben.
        </li>
        <li>
          <strong className="text-ink">Correctie</strong> — onjuiste gegevens
          laten aanpassen.
        </li>
        <li>
          <strong className="text-ink">Verwijdering</strong> — je gegevens
          laten wissen, behalve wat we wettelijk moeten bewaren.
        </li>
        <li>
          <strong className="text-ink">Beperking</strong> — de verwerking
          tijdelijk laten stilleggen, bijvoorbeeld als je de juistheid betwist.
        </li>
        <li>
          <strong className="text-ink">Dataportabiliteit</strong> — je gegevens
          in een gangbaar bestandsformaat ontvangen om ze mee te nemen.
        </li>
        <li>
          <strong className="text-ink">Bezwaar</strong> — bezwaar maken tegen
          verwerking op grond van een gerechtvaardigd belang.
        </li>
        <li>
          <strong className="text-ink">Toestemming intrekken</strong> — voor
          alles waar je toestemming voor gaf, zoals de nieuwsbrief. Dat raakt
          niet aan wat daarvoor al is verwerkt.
        </li>
      </ul>
      <p className="mt-4 leading-relaxed text-body">
        Mail je verzoek naar{" "}
        <a
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="mailto:beheer@beleggingscollege.nl"
        >
          beheer@beleggingscollege.nl
        </a>
        . We reageren binnen een maand. Om te voorkomen dat we gegevens aan de
        verkeerde persoon geven, kunnen we je vragen je verzoek te sturen
        vanaf het e-mailadres van je account. Zolang je geen account hebt,
        beheer je je voortgang trouwens zelf: wis je de gegevens van deze site
        in je browser, dan is alles weg.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Lock className="h-6 w-6 text-brand-600" aria-hidden="true" />
        8. Beveiliging
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        De site draait volledig over een versleutelde verbinding (https).
        Wachtwoorden slaan we niet op — inloggen gaat via je Google-account.
        Toegang tot gegevens is beperkt tot wie die nodig heeft, en
        betaalgegevens worden door Mollie afgehandeld in plaats van door ons. Geen enkel systeem is
        honderd procent veilig; merk je iets wat niet klopt, laat het ons dan
        weten via{" "}
        <a
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="mailto:beheer@beleggingscollege.nl"
        >
          beheer@beleggingscollege.nl
        </a>
        .
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        9. Klacht indienen bij de Autoriteit Persoonsgegevens
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Kom je er met ons niet uit, dan heb je het recht een klacht in te
        dienen bij de Nederlandse toezichthouder, de Autoriteit
        Persoonsgegevens, via{" "}
        <a
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="https://www.autoriteitpersoonsgegevens.nl"
          rel="noopener noreferrer"
          target="_blank"
        >
          autoriteitpersoonsgegevens.nl
        </a>
        . We stellen het op prijs als je het eerst bij ons probeert — meestal is
        het gewoon opgelost met een mailtje.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        10. Wijzigingen in deze verklaring
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Verandert de manier waarop we gegevens verwerken — zoals toen je
        voortgang met je account mee ging reizen — dan passen we deze
        verklaring aan en
        vermelden we hier een nieuwe datum. Bij ingrijpende wijzigingen laten we
        het je weten als je een account hebt.
      </p>

      <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-lijn bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-body">
            <strong className="block text-ink">Nog een vraag over privacy?</strong>
            Mail gerust — je krijgt gewoon antwoord van een mens.
          </p>
        </div>
        <a
          className="shrink-0 rounded-xl bg-brand-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-brand-700"
          href="mailto:beheer@beleggingscollege.nl"
        >
          beheer@beleggingscollege.nl
        </a>
      </div>

      <p className="mt-8 text-sm text-body">
        Zie ook{" "}
        <Link className="font-semibold text-brand-700 hover:text-brand-800" href="/voorwaarden">
          de algemene voorwaarden
        </Link>{" "}
        en{" "}
        <Link
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="/herroepingsrecht"
        >
          herroepingsrecht en terugbetaling
        </Link>
        .
      </p>
    </div>
  );
}
