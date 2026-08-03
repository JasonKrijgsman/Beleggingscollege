import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Ban,
  Building2,
  Copyright,
  CreditCard,
  GraduationCap,
  Infinity as InfinityIcon,
  Mail,
  RefreshCw,
  Scale,
} from "lucide-react";
import { PRICING } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description:
    "De algemene voorwaarden van Beleggingscollege: waar de overeenkomst over gaat, prijzen, betaling, opzeggen, intellectueel eigendom en waarom wij onderwijs geven en geen beleggingsadvies.",
  alternates: { canonical: "/voorwaarden" },
  robots: { index: false },
};

export default function VoorwaardenPage() {
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
        Algemene voorwaarden
      </h1>
      <p className="mt-3 leading-relaxed text-body">
        We hebben geprobeerd deze voorwaarden te schrijven zoals we ook lesgeven:
        in gewone taal, zonder verstopte bepalingen. Kom je iets tegen dat je
        niet begrijpt of niet eerlijk vindt, mail ons dan — dat willen we weten.
      </p>
      <p className="mt-3 text-sm text-body">Conceptversie 1 — 2 augustus 2026</p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Building2 className="h-6 w-6 text-brand-600" aria-hidden="true" />
        1. Wie we zijn
      </h2>
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
          Op vragen en klachten reageren we binnen veertien dagen, meestal
          binnen twee werkdagen.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        2. Waar deze voorwaarden over gaan
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Deze voorwaarden gelden voor het gebruik van beleggingscollege.nl en
        voor elke overeenkomst die je met ons sluit over toegang tot ons online
        cursusmateriaal. Wat je koopt is toegang tot lesmateriaal: teksten,
        video&apos;s, quizzen, tools en certificaten. Je koopt geen persoonlijke
        begeleiding, geen advies en geen resultaat.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Onze cursussen zijn bedoeld voor consumenten van achttien jaar en ouder.
        Ben je jonger, dan mag je meelezen met toestemming van je ouders of
        verzorgers, maar een betaalde overeenkomst sluit je niet zelf.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <GraduationCap className="h-6 w-6 text-brand-600" aria-hidden="true" />
        3. Wat je bij ons kunt krijgen
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h3 className="font-bold text-ink">Gratis cursus</h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Beleggen voor Beginners is gratis en blijft gratis. Geen betaling,
            geen verplichtingen.
          </p>
        </div>
        <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h3 className="font-bold text-ink">Losse cursus</h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            de prijs die bij de cursus staat ({PRICING.losseCursus} of €29)
            eenmalig, inclusief btw. Levenslange toegang
            tot die ene cursus — zie punt 4.
          </p>
        </div>
        <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h3 className="font-bold text-ink">College+</h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            {PRICING.abonnementMaand} per maand, inclusief btw. Toegang tot
            alles zolang je abonnement loopt. Maandelijks opzegbaar.
          </p>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-body">
        Losse cursussen kun je op dit moment kopen; alles wat hier over betaling
        en herroeping staat, geldt dus vanaf nu. College+ is er nog niet — de
        bepalingen over het abonnement en het opzeggen daarvan gelden pas zodra
        je je er daadwerkelijk op kunt abonneren.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <InfinityIcon className="h-6 w-6 text-brand-600" aria-hidden="true" />
        4. Wat &quot;levenslange toegang&quot; precies betekent
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Koop je een losse cursus, dan houd je toegang tot die cursus zonder dat
        je nog een keer hoeft te betalen — zolang Beleggingscollege bestaat en
        de cursus aanbiedt. Dat is de eerlijke lezing van het woord
        &quot;levenslang&quot;: wij kunnen niet beloven dat een website er over
        dertig jaar nog is.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Besluiten we een cursus definitief uit de lucht te halen, dan melden we
        dat minstens drie maanden van tevoren aan iedereen die hem heeft
        gekocht, en zorgen we dat je het lesmateriaal in die periode kunt
        downloaden of afdrukken. Updates en verbeteringen aan een cursus die je
        hebt gekocht, krijg je er zonder bijbetaling bij.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Bij College+ geldt iets anders: je hebt toegang tot alle cursussen
        zolang je abonnement loopt. Stopt het abonnement, dan stopt de toegang
        tot het lesmateriaal. Je voortgang en de certificaten die je al hebt
        behaald, blijven behouden.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <CreditCard className="h-6 w-6 text-brand-600" aria-hidden="true" />
        5. Prijzen, btw en betaling
      </h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          Alle prijzen op de site zijn consumentenprijzen{" "}
          <strong className="text-ink">inclusief 21% btw</strong>. Wat je ziet
          staan, is wat je betaalt: er komen geen administratiekosten,
          transactiekosten of andere onvermijdbare kosten bij.
        </li>
        <li>
          Je ontvangt per betaling een factuur waarop de btw apart staat
          vermeld.
        </li>
        <li>
          Betalen doe je via{" "}
          <strong className="text-ink">Mollie</strong>, onze betaaldienst:
          iDEAL, creditcard of debitcard, PayPal en Apple Pay. Je vult je
          betaalgegevens in bij Mollie; wij zien je volledige bank- of
          kaartgegevens niet.
        </li>
        <li>
          Toegang krijg je zodra de betaling bij ons bevestigd is. Lukt een
          betaling voor College+ niet, dan proberen we het opnieuw en laten we
          je dat weten; blijft betaling uit, dan kunnen we de toegang
          opschorten tot het weer in orde is.
        </li>
        <li>
          We mogen onze prijzen aanpassen voor nieuwe klanten. Voor een lopend
          College+ abonnement melden we een prijswijziging minstens één maand
          van tevoren, zodat je kunt opzeggen als je het er niet mee eens bent.
          Een cursus die je al hebt gekocht, wordt nooit met terugwerkende
          kracht duurder.
        </li>
      </ul>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <RefreshCw className="h-6 w-6 text-brand-600" aria-hidden="true" />
        6. Looptijd en opzeggen van College+
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        College+ is een abonnement dat je maandelijks kunt opzeggen, conform de
        Nederlandse regels voor stilzwijgende verlenging (de Wet van Dam). In
        het kort:
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          Het maandabonnement heeft geen minimumduur en loopt door tot je
          opzegt.
        </li>
        <li>
          Zou je ooit een abonnement met een langere eerste periode afsluiten,
          dan is dat na afloop van die eerste periode altijd maandelijks
          opzegbaar, met een opzegtermijn van maximaal één maand.
        </li>
        <li>
          Wat je online afsluit, kun je ook online opzeggen: één knop in je
          account, geen telefoontje, geen aangetekende brief, geen
          opzegformulier dat we lastig vindbaar maken. Je krijgt direct een
          bevestiging per e-mail.
        </li>
        <li>
          Na opzegging houd je toegang tot het einde van de periode die je al
          hebt betaald. Daarna stopt de incasso automatisch.
        </li>
      </ul>
      <p className="mt-4 leading-relaxed text-body">
        Hoe terugbetaling en de wettelijke bedenktijd werken, lees je op{" "}
        <Link
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="/herroepingsrecht"
        >
          herroepingsrecht en terugbetaling
        </Link>
        .
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        7. Je account en je toegang
      </h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
        <li>
          Je account is persoonlijk. Deel je inloggegevens niet en geef je
          toegang niet door aan anderen.
        </li>
        <li>
          Ben je ingelogd, dan bewaren we je voortgang op je account en reist
          hij mee naar elk apparaat. Volg je een cursus zonder in te loggen,
          dan staat je voortgang alleen in je eigen browser: wis je die
          gegevens, dan is hij weg en kunnen wij hem niet herstellen. Zie de{" "}
          <Link
            className="font-semibold text-brand-700 hover:text-brand-800"
            href="/privacy"
          >
            privacyverklaring
          </Link>
          .
        </li>
        <li>
          Merken we dat één account door meerdere mensen wordt gebruikt of dat
          lesmateriaal wordt verspreid, dan nemen we eerst contact met je op. In
          ernstige of herhaalde gevallen kunnen we de toegang beëindigen.
        </li>
      </ul>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Copyright className="h-6 w-6 text-brand-600" aria-hidden="true" />
        8. Intellectueel eigendom
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Alle lesteksten, video&apos;s, illustraties, quizzen, tools en het
        ontwerp van de site zijn van Beleggingscollege en beschermd door het
        auteursrecht. Je koopt een persoonlijk, niet-overdraagbaar recht om het
        materiaal te gebruiken om zelf te leren.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Dat betekent: je mag lesmateriaal downloaden of printen voor eigen
        gebruik, je mag stukjes citeren met bronvermelding, en je mag er in je
        eigen woorden over vertellen. Wat niet mag: het materiaal doorverkopen,
        publiceren, in een eigen cursus verwerken, in een besloten groep of op
        een filesharing-dienst delen, of je toegang met anderen delen.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Boeken die we in de cursussen bespreken, zijn het werk van hun eigen
        auteurs en uitgevers. Wij vatten samen, leggen uit en verwijzen ernaar —
        we verspreiden ze niet.
      </p>

      <div className="mt-12 rounded-2xl border-2 border-navy-200 bg-navy-50 p-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <Ban className="h-6 w-6 text-navy-600" aria-hidden="true" />
          9. Onderwijs, geen beleggingsadvies
        </h2>
        <p className="mt-3 leading-relaxed text-body">
          Dit is de belangrijkste bepaling van deze voorwaarden, dus we zetten
          hem niet in de kleine lettertjes.
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-body">
          <li>
            <strong className="text-ink">
              Beleggingscollege geeft onderwijs, geen beleggingsadvies.
            </strong>{" "}
            We leggen uit hoe beleggen werkt, wat klassieke boeken erover
            zeggen en hoe je zelf leert nadenken. We bevelen nooit een specifiek
            aandeel, fonds, ETF, crypto of ander financieel instrument aan, en
            we geven geen advies dat is afgestemd op jouw persoonlijke situatie.
          </li>
          <li>
            <strong className="text-ink">
              We staan niet als beleggingsadviseur onder toezicht van de AFM
            </strong>{" "}
            en hebben daarvoor geen vergunning. Die hebben we ook niet nodig,
            juist omdat we geen advies geven. Wil je persoonlijk advies, ga dan
            naar een adviseur die daar wél een vergunning voor heeft.
          </li>
          <li>
            <strong className="text-ink">
              Jij blijft zelf verantwoordelijk voor je beleggingsbeslissingen.
            </strong>{" "}
            Wat je met de kennis uit onze cursussen doet, is jouw keuze en jouw
            verantwoordelijkheid.
          </li>
          <li>
            <strong className="text-ink">Beleggen kent risico&apos;s.</strong>{" "}
            Koersen bewegen op en neer, rendementen uit het verleden zeggen
            niets over de toekomst, en je kunt een deel van je inleg of je hele
            inleg verliezen. Wij beloven geen rendement, geen winst en geen
            resultaat.
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-body">
          Rekenvoorbeelden, tools en cijfers in de cursussen zijn illustraties
          om een principe uit te leggen. Ze zijn geen voorspelling en geen
          aanbeveling.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        10. Beschikbaarheid en wijzigingen
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        We doen ons best de site altijd bereikbaar te houden, maar we kunnen
        geen ononderbroken beschikbaarheid garanderen: onderhoud, storingen bij
        onze hostingpartij of overmacht kunnen ertoe leiden dat de site
        tijdelijk niet werkt. We mogen cursussen verbeteren, uitbreiden of
        actualiseren. Zo&apos;n wijziging mag de kern van wat je hebt gekocht
        niet uithollen.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">11. Aansprakelijkheid</h2>
      <p className="mt-3 leading-relaxed text-body">
        We stellen ons materiaal met zorg samen, maar we kunnen niet garanderen
        dat het altijd volledig, actueel of foutloos is. Voor schade die je
        lijdt doordat je op basis van onze cursussen beleggingsbeslissingen
        neemt, zijn wij niet aansprakelijk — zie punt 9. Voor het overige is
        onze aansprakelijkheid beperkt tot het bedrag dat je in de twaalf
        maanden voorafgaand aan de schade aan ons hebt betaald.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        Deze beperkingen gelden niet bij opzet of bewuste roekeloosheid van onze
        kant, en niet voor zover dwingend consumentenrecht ze verbiedt. Je
        wettelijke rechten als consument blijven altijd onverkort gelden.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        12. Klachten en geschillen
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Ben je ergens niet tevreden over, mail dan naar{" "}
        <a
          className="font-semibold text-brand-700 hover:text-brand-800"
          href="mailto:beheer@beleggingscollege.nl"
        >
          beheer@beleggingscollege.nl
        </a>
        . We reageren binnen veertien dagen met een inhoudelijk antwoord of, als
        we meer tijd nodig hebben, met een bericht wanneer je dat antwoord kunt
        verwachten. Komen we er samen niet uit, dan kun je je geschil ook
        voorleggen aan de bevoegde Nederlandse rechter.
      </p>

      <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold text-ink">
        <Scale className="h-6 w-6 text-brand-600" aria-hidden="true" />
        13. Toepasselijk recht en wijzigingen
      </h2>
      <p className="mt-3 leading-relaxed text-body">
        Op deze voorwaarden en op alle overeenkomsten met Beleggingscollege is
        Nederlands recht van toepassing. Woon je in een ander EU-land, dan
        behoud je de bescherming van het dwingende consumentenrecht van je eigen
        land.
      </p>
      <p className="mt-3 leading-relaxed text-body">
        We kunnen deze voorwaarden aanpassen, bijvoorbeeld als de dienst
        verandert of als de wet dat vraagt. Voor een lopend abonnement melden we
        een wijziging minstens één maand van tevoren; ben je het er niet mee
        eens, dan kun je opzeggen. Op een aankoop die je al hebt gedaan, blijven
        de voorwaarden gelden zoals ze op dat moment luidden.
      </p>

      <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-lijn bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-body">
            <strong className="block text-ink">Iets onduidelijk?</strong>
            Stel je vraag gerust — liever vooraf dan achteraf.
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
        <Link className="font-semibold text-brand-700 hover:text-brand-800" href="/privacy">
          de privacyverklaring
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
