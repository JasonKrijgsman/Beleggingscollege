import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HeartHandshake,
  Mail,
  Undo2,
  Wallet,
  XCircle,
} from "lucide-react";
import { PRICING } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Herroepingsrecht en terugbetaling",
  description:
    "Hoe de wettelijke bedenktijd van 14 dagen werkt bij digitale cursussen, wanneer je dat recht verliest, hoe je herroept en hoe opzeggen van College+ werkt.",
  alternates: { canonical: "/herroepingsrecht" },
  robots: { index: false },
};

export default function HerroepingsrechtPage() {
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
        Herroepingsrecht en terugbetaling
      </h1>
      <p className="mt-3 leading-relaxed text-body">
        Deze pagina gaat over je geld en je vertrouwen, dus we schrijven hem
        zonder trucs. Hieronder staat precies wanneer je je aankoop ongedaan
        kunt maken, wanneer dat niet meer kan en waarom, hoe snel je je geld
        terugkrijgt en hoe je College+ opzegt. Als iets onduidelijk is, mail ons
        dan gewoon — we lossen het liever op dan dat we ons achter een regel
        verschuilen.
      </p>
      <p className="mt-3 text-sm text-body">Conceptversie 2 — 3 augustus 2026</p>

      <div className="mt-8 rounded-2xl border border-groen-200 bg-groen-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <CheckCircle2 className="h-5 w-5 text-groen-600" aria-hidden="true" />
          In het kort
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-body">
          <li>
            Bij een online aankoop heb je wettelijk{" "}
            <strong className="text-ink">14 dagen bedenktijd</strong>.
          </li>
          <li>
            Bij een losse cursus verklaar je bij het afrekenen met één vinkje
            dat je direct wilt beginnen én dat je daarmee afstand doet van je
            herroepingsrecht. Zonder dat vinkje kun je niet afrekenen — er komt
            dan geen koop tot stand.
          </li>
          <li>
            Bij <strong className="text-ink">College+</strong> kun je die
            bedenktijd niet wegtekenen: je hebt altijd 14 dagen.
          </li>
          <li>
            Herroepen doe je met één mail naar beheer@beleggingscollege.nl. Je
            hoeft geen reden op te geven.
          </li>
          <li>
            Terugbetaling binnen 14 dagen, via dezelfde betaalmethode, zonder
            kosten.
          </li>
        </ul>
      </div>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Clock className="h-6 w-6 text-brand-600" aria-hidden="true" />
        1. Wat de bedenktijd van 14 dagen inhoudt
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Koop je iets op afstand — dus online, zonder dat je het in een winkel
        hebt kunnen bekijken — dan geeft de wet je veertien dagen om je te
        bedenken. Je hoeft geen reden op te geven en je hoeft je niet te
        verantwoorden. De termijn begint op de dag dat je de overeenkomst sluit.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Bij digitale content zoals een online cursus zit er een uitzondering in
        de wet, en die leggen we hieronder eerlijk uit — inclusief het stukje
        dat in ons nadeel werkt.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        2. Losse cursus: wanneer je je bedenktijd verliest
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Een losse cursus ({PRICING.losseCursus} of €29 eenmalig) is digitale content
        die je meteen kunt beginnen. De wet staat toe dat het herroepingsrecht
        vervalt zodra de levering met jouw uitdrukkelijke toestemming is
        begonnen — maar alleen als je daar vooraf zelf, uitdrukkelijk, mee hebt
        ingestemd. Bij het afrekenen zie je daarom{" "}
        <strong className="text-ink">één vinkje</strong>, niet vooraf
        aangevinkt, met deze verklaring:
      </p>
      <div className="mt-4 flex gap-3 rounded-2xl border border-lijn bg-white p-5 shadow-card">
        <span
          className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-brand-300"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-body">
          <strong className="text-ink">
            &ldquo;Ja, ik wil direct beginnen met de cursus. Ik weet dat ik
            daarmee afstand doe van mijn recht om de koop binnen 14 dagen te
            herroepen, zodra ik toegang heb.&rdquo;
          </strong>
        </p>
      </div>
      <p className="mt-4 leading-relaxed text-body">
        In die ene verklaring zitten de twee dingen die de wet allebei
        verlangt: je <strong className="text-ink">uitdrukkelijke toestemming</strong>{" "}
        om meteen met leveren te beginnen, én je{" "}
        <strong className="text-ink">erkenning</strong> dat je daarmee je
        herroepingsrecht verliest zodra de levering is begonnen.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Vink je het aan, dan heb je direct na je betaling toegang en kun je de
        aankoop daarna niet meer herroepen. Vink je het niet aan, dan gaat het
        afrekenen niet door: we verkopen losse cursussen alleen mét directe
        toegang, dus zonder deze verklaring komt er geen koop tot stand en
        betaal je ook niets. In de bevestigingsmail herhalen we beide
        onderdelen van je verklaring apart — je verzoek om direct te beginnen
        en je erkenning dat je herroepingsrecht daarmee vervalt — zodat je
        zwart-op-wit hebt waarvoor je hebt gekozen.
      </p>
      <div className="mt-4 flex gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <HeartHandshake
          className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-body">
          <strong className="block text-ink">Onze eigen belofte daarbovenop</strong>
          Ook als je formeel geen herroepingsrecht meer hebt: heb je net
          gekocht, ben je nauwelijks begonnen en past de cursus toch niet bij
          je? Mail ons binnen veertien dagen. We kijken er redelijk naar en
          betalen in dat soort gevallen in de praktijk gewoon terug. Wij willen
          geen geld van iemand die er niets aan heeft.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        3. College+: hier kun je je bedenktijd niet verliezen
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        College+ ({PRICING.abonnementMaand} per maand) is geen los bestand maar
        een doorlopende dienst: je voortgang wordt bijgehouden, je krijgt
        toegang tot nieuwe cursussen en tot tools. Daarom geldt de uitzondering
        van punt 2 hier niet.
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          Je hebt <strong className="text-ink">altijd 14 dagen bedenktijd</strong>{" "}
          na het afsluiten van het abonnement. Dat recht kun je niet wegtekenen
          en wij kunnen het je niet ontnemen.
        </li>
        <li>
          Vraag je om directe toegang en herroep je daarna binnen die veertien
          dagen, dan mogen we een{" "}
          <strong className="text-ink">evenredig deel</strong> van de
          maandprijs in rekening brengen voor de dagen dat je toegang had. De
          rest krijg je terug.
        </li>
        <li>
          Herroep je binnen veertien dagen en had je nog geen toegang gevraagd,
          dan krijg je het volledige bedrag terug.
        </li>
      </ul>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Undo2 className="h-6 w-6 text-brand-600" aria-hidden="true" />
        4. Hoe je herroept
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Eén bericht is genoeg. Stuur binnen de bedenktijd een mail naar{" "}
        <a
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="mailto:beheer@beleggingscollege.nl"
        >
          beheer@beleggingscollege.nl
        </a>{" "}
        waarin je aangeeft dat je de overeenkomst wilt ontbinden. Handig om te
        vermelden: je naam, het e-mailadres van je bestelling, wat je hebt
        gekocht, je ordernummer en de datum van je aankoop. Een reden hoef je
        niet te geven, en we gaan je niet overhalen om te blijven.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Zodra de betaalde toegang live gaat, komt er ook een{" "}
        <strong className="text-ink">herroepingsknop</strong> in je account
        waarmee je de overeenkomst online kunt ontbinden. Je krijgt van je
        herroeping altijd direct een bevestiging per e-mail, met datum en
        tijdstip.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Wallet className="h-6 w-6 text-brand-600" aria-hidden="true" />
        5. Terugbetaling
      </h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          We betalen je{" "}
          <strong className="text-ink">
            binnen 14 dagen na ontvangst van je herroeping
          </strong>{" "}
          terug. Meestal veel sneller.
        </li>
        <li>
          Je krijgt het bedrag terug via{" "}
          <strong className="text-ink">dezelfde betaalmethode</strong> als
          waarmee je hebt betaald, tenzij we samen iets anders afspreken.
        </li>
        <li>
          Terugbetalen kost je niets. We rekenen geen administratie- of
          annuleringskosten.
        </li>
        <li>
          Bij herroeping vervalt je toegang tot het betaalde lesmateriaal. Je
          voortgang en eerder behaalde certificaten blijven gewoon in je account
          staan.
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        6. College+ opzeggen (iets anders dan herroepen)
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Herroepen doe je binnen veertien dagen na het afsluiten. Opzeggen kan
        daarna op elk moment, en werkt zo:
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-bold text-ink">
            <CheckCircle2 className="h-5 w-5 text-groen-600" aria-hidden="true" />
            Wat je mag verwachten
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-body">
            <li>Opzeggen wanneer je wilt, met één knop in je account.</li>
            <li>Geen minimumduur, geen opzegtermijn van maanden.</li>
            <li>
              Je houdt toegang tot het einde van de maand die je al hebt
              betaald.
            </li>
            <li>Daarna stopt de incasso automatisch.</li>
            <li>
              Je voortgang, XP, badges en certificaten blijven behouden. Kom je
              later terug, dan pak je de draad op waar je gebleven was.
            </li>
            <li>Je krijgt altijd een bevestiging per e-mail.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-bold text-ink">
            <XCircle className="h-5 w-5 text-body" aria-hidden="true" />
            Wat we eerlijk vooraf zeggen
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-body">
            <li>
              De maand die al is begonnen betalen we niet terug. Je hebt die
              periode nog wel volledig tot je beschikking.
            </li>
            <li>
              Na afloop van de betaalde periode vervalt je toegang tot de
              cursussen die alleen in College+ zitten.
            </li>
            <li>
              Cursussen die je los hebt gekocht, houd je gewoon — die staan los
              van je abonnement.
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-body">
        Zolang er nog geen account is, kun je opzeggen ook altijd per mail
        regelen. We sturen je nooit naar een telefoonnummer of een formulier dat
        we expres moeilijk vindbaar maken.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <FileText className="h-6 w-6 text-brand-600" aria-hidden="true" />
        7. Modelformulier voor herroeping
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Je bent niet verplicht dit formulier te gebruiken — een gewone mail
        werkt net zo goed. Wil je het toch netjes doen, dan kun je deze tekst
        overnemen.
      </p>
      <div className="mt-4 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <p className="text-sm leading-relaxed text-body">
          Aan: Beleggingscollege, beheer@beleggingscollege.nl
        </p>
        <p className="mt-4 text-sm leading-relaxed text-body">
          Ik/wij deel/delen u hierbij mede dat ik/wij onze overeenkomst
          betreffende de aankoop van de volgende dienst herroep/herroepen:
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-body">
          <li>Naam van de cursus of het abonnement: ______________________</li>
          <li>Besteld op / ontvangen op: ______________________</li>
          <li>Ordernummer: ______________________</li>
          <li>Naam consument: ______________________</li>
          <li>E-mailadres van de bestelling: ______________________</li>
          <li>Datum: ______________________</li>
        </ul>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        8. Buiten de termijn, maar toch niet tevreden?
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Mail ons. Serieus. Een cursus die je niets heeft opgeleverd, is voor ons
        geen geslaagde verkoop. We kijken naar je situatie en zoeken een
        oplossing die klopt: soms is dat terugbetalen, soms is dat je helpen met
        het stuk waar je vastloopt. Wat we niet doen, is je aan het lijntje
        houden.
      </p>

      <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-lijn bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-body">
            <strong className="block text-ink">Herroepen of gewoon een vraag?</strong>
            Eén mailtje is genoeg. Je krijgt binnen twee werkdagen antwoord.
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
        <Link className="font-semibold text-brand-700 hover:text-brand-800" href="/privacy">
          de privacyverklaring
        </Link>
        .
      </p>
    </div>
  );
}
