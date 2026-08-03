# Openstaand — de eerlijke stand van zaken

Laatst bijgewerkt: 3 augustus 2026.

Dit is de losse-eindjeslijst. Eén plek, zodat je niet door 3.000 regels documentatie
hoeft te zoeken om te weten wat er nog moet. De andere documenten beschrijven hóe iets
werkt; dit document beschrijft wat er níét af is.

**Onderhoudsregel:** streep hier af wat je doet. Een afgevinkt punt hoort hier weg, niet
te blijven staan als "gedaan" — daar is de git-historie voor.

De bevindingen hieronder komen uit een audit van 2 augustus 2026 waarin zes onafhankelijke
controles over de code, de documentatie, de live site, de juridische pagina's en de
databank zijn gehaald, en elke bevinding daarna door een tweede controleur is nagelopen.
96 bevindingen hielden stand, 7 sneuvelden. Die 7 staan onderaan, zodat niemand ze opnieuw
gaat uitzoeken.

Een onafhankelijke second opinion door OpenAI Codex staat in
[`docs/reviews/2026-08-02-codex-website-en-architectuurreview.md`](reviews/2026-08-02-codex-website-en-architectuurreview.md).
Die review legt bewijs en afwegingen vast; de nog uit te voeren punten blijven uitsluitend
in dit document staan. De Codex-punten zijn daarna stuk voor stuk tegen de code
geverifieerd — regelnummers gecontroleerd, races nagelopen, de npm-audit opnieuw
gedraaid — en met die details hieronder verwerkt.

---

## 1. Bewust genomen risico's

Dit zijn geen vergissingen. Ze staan hier omdat ze bewust zijn aanvaard en omdat iemand
over een maand moet kunnen zien dat het een keuze was.

### De test-key staat in productie en dat is een open deur

`MOLLIE_API_KEY` in Vercel begint met `test_`. Gevolg: **iedereen kan op dit moment een
cursus van € 49 gratis binnenhalen.** Niet in theorie — zo is de koopflow op 2 augustus
getest. Inloggen met Google, vinkje aan, afrekenen, bij Mollie "Paid" kiezen, klaar. De
webhook zet de aankoop op `paid` en de cursus gaat open, zonder dat er geld beweegt.

Op 2 augustus 2026 is besloten dit voorlopig zo te laten, omdat de site nog vrijwel geen
bezoekers heeft, niet in Search Console staat en er nergens naar gelinkt wordt, en omdat de
knop bruikbaar moet blijven om te demonstreren. Het risico is dus laag maar echt.

**Dit moet dicht vóór er ook maar iets van marketing gebeurt.** Twee manieren:
- De live-key erin (maar zie hoofdstuk 2 — dan moeten die dingen eerst af), of
- `MOLLIE_API_KEY` tijdelijk uit Vercel halen. De checkout geeft dan netjes 503
  "Betalen is nog niet ingeschakeld" en de knop doet niets meer.

### Er staat een testaankoop in de productiedatabase

De rij `waardebeleggen | paid | € 49` op Jasons eigen account komt uit betaling
`tr_hTh3aaeBX99fmiT2SjpUJ` en is nooit met echt geld betaald. Onschuldig, maar hij vervuilt
straks je eerste omzetcijfers. Opruimen met een `delete` op die rij.

---

## 2. Blokkerend vóór de eerste echte euro

Deze punten zijn niet "later netjes maken". Zonder deze dingen verkoop je iets wat je
juridisch niet mag verkopen, of kun je een geschil niet winnen.

- [ ] **Vercel Pro nemen ($20/mnd).** Het Hobby-plan verbiedt commercieel gebruik
      uitdrukkelijk, en de winkel staat al open. Prijs geverifieerd op vercel.com/pricing op
      2 aug 2026: $20 per maand per zitplaats, inclusief $20 aan verbruikstegoed — bij dit
      verkeer dus effectief een vast bedrag. Zie `docs/hosting-en-kosten.md`.
- [x] **Bevestiging op een duurzame gegevensdrager.** Gebouwd op 2 aug 2026 (commits `0a5ba8e`
      en `70a0621`): `src/lib/mail.ts`, `src/lib/mailteksten.ts`, `src/lib/orderbevestiging.ts`,
      afgevuurd vanuit de Mollie-webhook. Bevat wat de wet eist, mét de onderbouwing in
      `docs/juridisch-orderbevestiging.md`.
      **Staat bewust nog uit.** Verzendkeuze is Migadu (niet Resend) en we wachten op de
      verhuizing van de `.nl`, omdat er toch geen echt geld binnen kan komen. Ontsnappingsroute
      als Strato treuzelt, plus de hele afweging: `docs/e-mail-versturen.md`.
- [ ] **`src/lib/mail.ts` omzetten van de Resend-API naar Migadu SMTP.** De rest van de keten
      raakt dat niet; alleen die ene functie.
- [ ] **Twee gegevens die er nog niet zijn (KOR is beantwoord):**
      - ~~KOR?~~ **Beantwoord op 2 aug 2026: geen KOR.** De 21%-regel in de mail klopt dus.
      - **Vestigingsadres.** Jason wil zijn woonadres niet op internet. Onderzoek naar de
        opties (postbus, virtueel bedrijfsadres, adres van de boekhouder) loopt. Tot er
        gekozen is: het adres komt uit de omgevingsvariabele `BEDRIJF_ADRES` en staat bewust
        nérgens in de repo. **Schrijf het woonadres ook niet in documentatie.**
      - ~~Btw-identificatienummer~~ **Opgelost op 2 aug 2026: `NL004813328B30`.** Staat in de
        voettekst en in de orderbevestiging. **Let op:** Jason heeft twee nummers. Het
        omzetbelastingnummer (`214739879B02`) is afgeleid van zijn BSN en mag nergens
        gepubliceerd worden — niet in code, niet in een mail, niet in documentatie.
- [ ] **Btw-nummer nog invullen bij Mollie.** Het veld daar is leeg (gecontroleerd 2 aug 2026):
      Instellingen → Bedrijfsgegevens → Btw informatie.
- [ ] **Echte factuur.** Bij B2C is een volledige factuur níét wettelijk verplicht (art. 34c
      Wet OB geldt alleen B2B) — een bon volstaat. Maar `/voorwaarden` belooft er wél een, en
      die eigen toezegging bindt. Nummering is er nu (`purchases.order_number`), btw-uitsplitsing
      ook; bewijs van waar de klant zit nog niet.
- [ ] **Herkansing als de bevestigingsmail mislukt.** Nu wordt een mislukte verzending alleen
      naar de console gelogd. Omdat juist die mail bepaalt of het herroepingsrecht vervalt, is
      "hij ging niet weg en niemand weet het" het slechtst denkbare gat. Er hoort een
      herhaalpoging te zijn, of op zijn minst een waarschuwing naar Jason zelf.
      Let op: de code rekent erop dat een volgende webhook-aanroep het opnieuw probeert
      (`confirmationSentAt` blijft leeg bij falen), maar de webhook antwoordt ook na een
      mislukte mail gewoon 200 — Mollie herhaalt dan dus juist níét. Herstel hangt nu op een
      toevallige tweede aanroep.
- [ ] **Voorwaarden meesturen als tekst of bijlage.** Strikt genomen moeten de algemene
      voorwaarden mee op de duurzame gegevensdrager, niet alleen als link. De mail claimt nu
      geen bijlage (dat zou een onwaarheid zijn), maar het gat blijft.
- [ ] **Volgorde van uitvoeren en bevestigen.** De wet zegt "voordat de dienst wordt
      uitgevoerd". Bij ons gaat de cursus open zodra de webhook binnenkomt en vertrekt de mail
      daarna. Strikt gelezen is dat de verkeerde volgorde. In de praktijk schelen ze seconden,
      maar een jurist moet zeggen of dat volstaat.

### Twee juridische vragen die een mens moet beantwoorden

- [ ] **Is deze cursus "digitale inhoud" of een "dienst"?** Dat verschil is materieel. Bij
      digitale inhoud vervalt het ontbindingsrecht zodra de nakoming begint (art. 6:230p
      onderdeel g BW) — daar is de hele checkout op gebouwd. Bij een dienst vervalt het pas na
      vólledige nakoming (art. 6:230p onderdeel d BW), en dan klopt onze aanname niet. Een
      cursus met levenslange platformtoegang zit op de grens.
- [ ] **Btw-behandeling laten bevestigen door de boekhouder.** Reken níét op de
      onderwijsvrijstelling (art. 11 lid 1 onderdeel o Wet OB): voor online onderwijs eist de
      Belastingdienst interactie tussen docent en cursist, en die is er niet. Verkoop je boven
      € 10.000 per jaar aan consumenten in andere EU-landen, dan verschuift de btw naar het
      land van de afnemer, met aangifte via de One Stop Shop.
- [ ] **Een werkende weg om een herroeping af te handelen.** Terugbetalen trekt de toegang
      nu niet in; er is geen knop en geen procedure. De wettelijke termijn is 14 dagen.
- [ ] **Juridische pagina's door een jurist.** `/voorwaarden`, `/privacy` en
      `/herroepingsrecht` zijn door mij geschreven, niet door een jurist. Ze staan op
      noindex. De feitelijke onjuistheden zijn er op 2 aug uit (zie commit `7fd4082`),
      maar dat maakt ze nog niet juridisch getoetst.

---

## 3. Twee gaten die op 2 augustus gedicht zijn

Vermeld omdat ze allebei stil waren, allebei een tijd hebben opengestaan en allebei
kunnen terugkomen als iemand niet weet waaróm de oplossing is zoals hij is.

**De hele betaalde catalogus stond in een publiek JS-bestand.** 197 kB, 21 lessen, 88
quizantwoorden inclusief `correctIndex`, op te halen zonder in te loggen. De oorzaak was
niet het doorgeven van props — dat was al afgedekt — maar een `import`. Een module met
`"use client"` die `@/content` importeert sleept de complete modulegraaf mee de bundel in,
ook als hij er maar één getal uit nodig heeft. Opgelost door de catalogus op de server te
berekenen en door te geven, en door `import "server-only"` boven in `@/content` te zetten
zodat de build faalt als iemand het opnieuw probeert. Commit `7e79728`.

**De site verkocht terwijl vier pagina's zeiden dat dat niet kon.** De FAQ meldde "er is
nog geen inlog" en "betaalde toegang is nog niet live" naast een werkende koopknop, en
voerde die onwaarheden ook als FAQPage-markup aan Google. Commit `7fd4082`.

---

## 4. Wat een betalende klant nu níét krijgt

- [x] ~~Voortgang die met je meereist~~ **Gebouwd 2 aug 2026** (`src/lib/voortgang-server.ts`,
      `POST /api/voortgang`). Ingelogd is de database de bron van waarheid; bij de eerste
      login wordt de localStorage-historie eenmalig geïmporteerd. **Alle XP wordt op de
      server herrekend uit de cursusinhoud** — de teller uit de browser gaat bewust de
      prullenbak in, anders zet iemand met één fetch zijn XP op een miljoen.
      Nog te doen: uitgelogd blijft `localStorage` leidend, en de individuele quizantwoorden
      (voor het terugkijken) staan alleen lokaal — die reizen dus níét mee.
- [x] ~~Zijn quizresultaten~~ **Gebouwd 2 aug 2026** (`src/components/QuizReview.tsx`).
      Na afronding zijn je antwoorden terug te kijken naast de juiste, met uitleg.
- [ ] **Een bevestiging, bon of factuur.** Zie hoofdstuk 2 — gebouwd, wacht op verzending.
- [x] ~~Een overzicht van wat hij bezit~~ Gedeeltelijk: een gekochte cursus toont nu een
      gouden "Van jou" in de catalogus en "Deze cursus is van jou — levenslang" in de hero,
      in plaats van het prijskaartje. Een echt "mijn cursussen"-ingangspunt buiten `/account`
      ontbreekt nog.

## 4b. Waarde voor je geld — de kern van het probleem

Een betaalde cursus was tekst plus een meerkeuzequiz; dat geeft YouTube gratis weg. Op
2 aug 2026 kreeg elke betaalde cursus daarom een eigen interactieve tool:
`IntrinsiekeWaardeTool` (Waardebeleggen) en `SteunWeerstandTool` (Technische Analyse).

Dat is een begin, geen oplossing. De hele betaalde catalogus is nog altijd ~100 minuten.
Zolang dat zo is heeft een abonnement geen inhoudelijke grond — zie `docs/ideeen.md` en
`docs/wat-de-winkel-mist.md`.

## 5. Certificaten deugen niet

- Iedereen kan er in een minuut een aanmaken voor een cursus die hij nooit gekocht heeft:
  er is geen servercontrole.
- Er staat geen verificatiecode op en er is niets om hem tegen na te kijken.
- De tekst beloofde "alle quizzen behaald", terwijl de quiz geen ondergrens kent — nul goed
  telt ook als afgerond. Op 2 aug afgezwakt naar "doorlopen", maar de echte keuze staat nog
  open: óf een slaagdrempel invoeren, óf accepteren dat het een deelnamebewijs is.
- Sinds 2 aug staat er wél servervoortgang in de database, maar de certificaatpagina kijkt
  er niet naar: de controle zit volledig in de client (localStorage, vrij te bewerken) en
  de pagina wordt zelfs vooraf gebouwd voor álle cursussen, ook de betaalde. De richting
  voor betaalde cursussen: uitgifte op de server na controle van aankoop én voltooiing,
  met een onveranderlijk verificatie-id op het document. Zie CODEX-108.

## 6. Techniek en bedrijfsvoering

- [ ] **De laptop gebruikt nog de primaire productiedatabase.** Gecontroleerd in Jasons
      Chrome en de Neon-console: Production gebruikt de primaire Neon-branch. Voor Preview
      is isolatie geconfigureerd via de Neon deployment action, die per Preview-deployment
      een tijdelijke branch en connection string maakt; op het controlemoment bestond alleen
      `main`, dus er was geen actieve Preview-branch. Maar `.env.local` bevat exact het primaire
      endpoint uit Vercel. Maak één vaste Neon Development-branch en zet uitsluitend die
      lokaal; laat scripts en migraties weigeren als ze per ongeluk tegen productie draaien.
      Zie CODEX-002 in de Codex-review.
      Twee kanttekeningen: previewbranches zijn kopieën en bevatten dus persoonsgegevens
      zodra er echte klanten zijn (waarschuwing uit `docs/implementatie-accounts-betalen.md`),
      en méér databases (aparte voor gebruikers, cursussen, certificaten) of een
      datalakehouse is op deze schaal niet aan de orde — één Postgres met per omgeving een
      eigen branch ís de professionele opzet.
- [ ] **Geen monitoring, geen alarmering.** Elke storing hierboven verloopt geruisloos:
      je hoort het pas van een klant. Alle fouten in webhook en mail zijn `console.error`
      in Vercels vluchtige logboeken. (De foutpagina's zijn er inmiddels wél:
      Nederlandstalige `error.tsx` en `global-error.tsx` sinds commit `729e0cd` — alleen
      is de digest-code die ze tonen nergens terug te zoeken.) Minimaal nodig: het
      tienregelige zelfmailtje uit `docs/wat-de-winkel-mist.md` §5 bij mismatch-betalingen,
      blijven hangen `pending`-aankopen en mislukte bevestigingsmails; een periodieke
      opruimronde (cron) die verweesde `pending`-rijen bij Mollie naslaat; en een
      gedocumenteerde, één keer echt geoefende restore van de Neon-database — de gratis
      laag kan maar 6 uur terug in de tijd. Zie CODEX-005.
- [ ] **CI-restpunten** (CODEX-003 is verder af: gebouwd 3 aug 2026 en gemerged via PR #3 —
      typecheck, ESLint mét toegankelijkheidsregels, 121 Vitest-tests voor de geldpaden,
      productiebuild en bundel-lekcontrole, lokaal reproduceerbaar met
      `npm ci && npm run controle`, zonder één geheim. Sindsdien is main ook écht een
      slagboom: branch protection met vereiste check "CI" óók voor admins, strict-mode,
      auto-merge aan, en een alarm-job die een issue opent als main toch rood wordt.
      Bewijs en beperkingen: `docs/ci.md`.) Wat nog open staat:
      - Tests voor terugbetaling bestaan niet, want terugbetalen zelf bestaat nog niet
        (zie het herroepingspunt in hoofdstuk 2).
      - Vijf bestaande lint-warnings (ongebruikte variabelen) in bestanden die op het
        bouwmoment door parallelle sessies bewerkt werden; zie `docs/ci.md`.
      - Opruimen van de restanten van de sessiebotsing van 3 aug (alles al gemerged of
        overbodig, dus weggooien is veilig): de branches `ci-poort` (eerdere smallere
        poging, in alles overtroffen) en `ci-testfundament` (bevat commit `585f282`
        waarin twee sessies door elkaar heen werkten), de stash "WIP on ci-testfundament"
        op de hoofdcheckout (bevat alleen restjes die elders al geland zijn), de al
        gemergde remote branches en de worktree `.claude/worktrees/ci-fundament`.
      Bijvangst, exact vastgepind in tests maar nog een productkeuze: client en server
      tellen de streak verschillend bij herhaalde lessen (`docs/ci.md` punt 2).
- [ ] **Chargeback.** Komt er een terugboeking, dan houdt de klant zijn toegang, kost het
      € 10 en ziet niemand het.
- [ ] **Kwetsbaarheden in de afhankelijkheden, en niets dat dat ooit zou melden.** Herteld
      op 2 aug: drie hoog (twee in postcss, één in sharp — allebei pakketten die Next zelf
      bundelt) plus een paar middelzware, waaronder esbuild via drizzle-kit (raakt alleen
      de dev-machine). Praktische blootstelling is klein: er is geen vreemde CSS of
      beeldupload en `next/image` wordt nergens gebruikt. **Draai níét `npm audit fix`** —
      dat stelt serieus een downgrade naar Next 9.3.3 voor. De echte route: Next binnen
      v15 bijwerken zodra de patches gebundeld zijn, en vóór het einde van Next 15's
      onderhoudsperiode (±oktober 2026, nextjs.org/support-policy) een geteste migratie
      naar Next 16 inplannen. Zie CODEX-110.
- [ ] **De prijs wordt met een regex uit een weergavetekst ("€49") gepeuterd** —
      `prijsInCenten()`, sinds 3 aug 2026 als pure functie in `src/lib/prijs.ts` (de
      checkout-route gebruikt hem vandaar). Werkt, maar breekt zodra iemand er een punt of
      komma anders in zet ("€1.234,56" zou stilletjes € 1,23 worden). De prijs hoort een
      getal in centen te zijn, met de tekst als afgeleide — niet andersom. Sinds de
      CI-branch bewaakt `test/prijs.test.ts` wel dat elke catalogusprijs het eenvoudige
      formaat houdt, dus de zwakte kan niet meer stil toeslaan. Zie CODEX-107.
- [ ] **`/lab` staat publiek** (HTTP 200). Wel `noindex, nofollow`, dus Google neemt hem
      niet op, maar wie de URL heeft ziet het interne stijllab.
- [ ] **`auth()` in de root-layout maakt ook publieke marketingpagina's dynamisch.** De live
      homepage antwoordt daardoor met `private, no-cache, no-store` en iedere bezoeker kan de
      database wekken. Isoleer sessie-afhankelijke UI en controleer daarna caching en
      Neon-wakeups. Zie CODEX-101 in de Codex-review.
      Let op bij het oplossen: de aanroep in `layout.tsx` weghalen is niet genoeg —
      `AuthKnop` doet in dezelfde schil een twééde `auth()`-aanroep, en `ProgressProvider`
      krijgt zijn `ingelogd`-vlag van de layout. Die twee moeten client-side of in Suspense.
- [ ] **De mobiele header loopt horizontaal uit.** Bij een viewport van 390px was het
      document 492px breed. De oorzaak zit in `SiteHeader.tsx`: het volledige logo staat op
      `shrink-0`, en logo, "Start gratis"-knop en mobiele navigatie delen één rij zonder
      wrap. Maak een echt mobiel menu of verberg secundaire elementen en test
      320/375/390px. Zie CODEX-103.
- [ ] **Voortgang mist twee serverregels.** `POST /api/voortgang` controleert geen aankoop
      voordat betaalde cursusvoortgang wordt geschreven (`heeftToegangTot()` wordt in dat
      pad nergens aangeroepen), en de quizscore komt van de client en wordt alleen
      begrensd — de antwoorden zelf gaan nooit mee, dus de foutloos-badge en de quizbonus
      (tot 25 XP per les) zijn met één fetch te claimen. Er lekt geen lesinhoud, maar
      badges en certificaten worden er waardeloos van. Daarnaast wist “Voortgang wissen”
      bij een ingelogde gebruiker alleen de lokale cache: er is geen server-delete en de
      import is bewust alleen-aanvullend, dus na de volgende paginalading staat alles er
      weer — terwijl de knop juist "Dit kan niet ongedaan worden gemaakt" zegt. Zie
      CODEX-104 en CODEX-105.
- [ ] **Ordermail heeft een race en achterhaalde tekst.** Gelijktijdige webhooks kunnen
      allebei mailen vóór `confirmationSentAt` gezet is — de controle in
      `src/lib/orderbevestiging.ts` is lezen-dan-doen, zonder atomische claim
      (`UPDATE … WHERE confirmation_sent_at IS NULL`). De mail zegt bovendien nog dat
      voortgang uitsluitend in de browser leeft (`src/lib/mailteksten.ts:105`), wat sinds
      de serversynchronisatie onwaar is — juist voor kopers, die per definitie ingelogd
      zijn. Maak verzending claim/outbox-gestuurd en werk de tekst bij. Zie CODEX-004 en
      CODEX-106.
- [ ] **Ordernummers kunnen botsen, gaten krijgen of buiten de administratie vallen.**
      `geefOrdernummer()` in `src/lib/orderbevestiging.ts` telt rijen en probeert +1: bij
      gelijktijdigheid redt de unique-index de uniciteit, maar de hertelling na een botsing
      slaat een nummer over — tegen de eigen doorlopende-nummering-eis in. De kale
      `catch {}` behandelt ook gewone databasefouten als botsingen, en de terugvaloptie
      mailt een nummer op basis van `Date.now()` dat nooit in de database wordt opgeslagen:
      de klant krijgt dan een ordernummer dat in de administratie niet bestaat.
- [x] ~~Eerst een klein beheerscherm, dan pas een CMS~~ **Het alleen-lezen deel bestaat
      sinds 3 aug 2026**: `/beheer` toont klanten, aankopen, entitlements, betaal- en
      mailstatus, en zoekt op e-mailadres of Mollie-id. Toegang via `ADMIN_EMAILS`
      (kommagescheiden; zonder die variabele is niemand beheerder), voor ieder ander is
      de pagina een 404.
- [ ] **Beheeracties ontbreken nog.** Een bevestiging opnieuw sturen, toegang intrekken
      of herstellen, een terugbetaling verwerken en vastleggen, en een AVG-verzoek
      (export of verwijdering) afhandelen kan nog niet vanuit `/beheer` — dat vraagt om
      muterende acties mét beheerdersautorisatie en een audittrail. Tot die tijd blijft
      daarvoor de databaseconsole nodig. Zie CODEX-006.
- [ ] **Algemene browserbeveiligingsheaders ontbreken.** Ontwerp minimaal frame-,
      content-type-, referrer- en permissions-beleid; ontwerp CSP apart rond Google,
      Mollie en een eventuele Payload-preview. Zie CODEX-109.

## 7. Vindbaarheid

- [ ] **De oude WordPress-site draait nog op beleggingscollege.nl**, met de drie verzonnen
      testimonials die uit de nieuwe site zijn gehaald, en met aanbod dat niet meer bestaat.
      Dat is het adres dat in je eigen footer en op elk certificaat staat.
- [x] ~~Geen OG-afbeelding en geen favicon~~ **Gedaan 2 aug 2026.** `src/app/icon.svg`,
      `apple-icon.tsx` en `opengraph-image.tsx` — die laatste twee worden bij de build als PNG
      gegenereerd. Wijzig je `LogoMark` in `src/components/Logo.tsx`, pas dan `icon.svg` mee
      aan; het favicon hoort hetzelfde beeldmerk te zijn.
- [x] ~~Geen Search Console~~ **Gedaan 2 aug 2026.** Domeinproperty `beleggingscollege.com`
      geverifieerd via een TXT-record in Cloudflare
      (`google-site-verification=aMcoxNotYTImcSrnGJDcEpWoCKFN1WFQhhiubh5ty_8` — **laat dat
      record staan**, anders vervalt de verificatie). Sitemap ingediend. Bewust géén
      OAuth-koppeling tussen Google en Cloudflare gemaakt: dat geeft Google blijvende
      DNS-toegang voor een eenmalige controle.
      Let op: de sitemapstatus stond direct na indienen op "Kan niet ophalen". Dat is de
      begintoestand vóór Google's eerste crawl; de sitemap zelf geeft HTTP 200 met 32 URL's.
      Staat dat er over een paar dagen nog, dán is er wél iets aan de hand.
- [x] ~~`www.beleggingscollege.com` bestaat niet~~ **Gedaan 2 aug 2026.** Toegevoegd in Vercel
      als **308 permanente redirect** naar het hoofddomein, met een CNAME `www` →
      `6d87ec9bdcf67bce.vercel-dns-017.com` in Cloudflare (DNS only). Geverifieerd: 308.
- [ ] **Geen redirects voor de oude WooCommerce `/product/`-URL's** en vier andere
      geïndexeerde WordPress-pagina's; die geven nu 404.
- [ ] **`/leerpad` heeft geen eigen titel, description of `noindex`** — hij erft alles van
      de homepage. `robots.ts` blokkeert alleen het crawlen, en dat houdt indexering via
      links niet tegen. De pagina is een `"use client"`-component en kan zelf geen metadata
      exporteren; er moet dus een `layout.tsx` of serverwrapper omheen.
- [ ] **De sitemap bevat ook alle betaalde les-URL's.** Bepaal bewust of een zoekmachine een
      vergrendelde lespagina moet indexeren; haal ze eruit als de indexeerbare pagina geen
      zelfstandige publieke waarde heeft. (Nu krijgt een uitgelogde crawler daar het
      slotscherm: dunne pagina's, zónder `noindex` en mét lestitel en intro als metadata —
      `src/app/sitemap.ts` neemt álle lessen van alle niet-comingSoon-cursussen op.)

## 8. Domein en e-mail

- **De verhuizing zit niet vast, hij loopt.** In het Strato-paneel staat onder
  Domeinen → beleggingscollege.nl → DNS → DNSSEC letterlijk "DNSSEC: Wordt gedeactiveerd".
  Er is geen knop om iets te versnellen. Het DS-record (keytag 43361) staat nog bij de
  registry; gecontroleerd via vier onafhankelijke resolvers. Zodra
  `Resolve-DnsName -Name beleggingscollege.nl -Type DS -Server 1.1.1.1` niets meer
  teruggeeft, kan de naamserverwissel door.
- **De e-mail werkt gewoon.** `beheer@beleggingscollege.nl` bestaat als postbus bij Strato
  en bevat mail; `info@` ook. Uitgaande post wordt door Strato met DKIM ondertekend
  (`strato-dkim-0002`, `strato-dkim-0003`), dus de DMARC-regel op `p=reject` slaagt ondanks
  het ontbrekende SPF-record. Migadu meldt "No mails can reach us" — dat gaat over Migadu,
  niet over het adres.
- [ ] **Er kijkt alleen niemand in die postbus.** Op `/contact` staat "antwoord binnen twee
      werkdagen", en `/herroepingsrecht` en `/privacy` noemen dit adres voor respectievelijk
      ontbinding en AVG-verzoeken. Zet hem op je telefoon of laat hem doorsturen.
- [ ] **Bij de verhuizing eerst de bestaande postbussen exporteren**, dan pas de records uit
      `docs/migadu-records.txt` in Cloudflare zetten. Andersom ben je de inhoud kwijt.

## 9. De documentatie spreekt zichzelf tegen

- `docs/prijsstrategie.md` noemt drie dingen "blokkerend voor de eerste transactie" die
  niet gebouwd zijn, terwijl `CLAUDE.md` en `docs/betalingen-mollie.md` de checkout als af
  presenteren met alleen de key nog te wisselen. Wie alleen `CLAUDE.md` leest, zet de
  live-key erin in de veronderstelling dat dat de laatste stap was.
- `docs/implementatie-accounts-betalen.md` (1.619 regels) is half achterhaald: het
  auth-hoofdstuk schrijft Prisma, JWT en wachtwoordinloggen voor, waarvan niets gebouwd is,
  en spreekt zijn eigen database-hoofdstuk tegen.
- Tien gedateerde uitspraken in zes documenten verwijzen naar "3 augustus 2026", een dag
  die nog niet geweest is.
- `CLAUDE.md` zei tot voor kort dat er geen backend of database is.
- `README.md` beschrijft een product dat niet meer bestaat.
- `docs/cms-keuze.md` zegt dat Payload de geïnstalleerde `next@15.5.22` ondersteunt omdat
  de eis “Next ≥ 15.4.11” zou zijn. De actuele officiële matrix noemt alleen specifieke
  `15.2.x`, `15.3.x`, `15.4.x`-reeksen of `16.2.6+`; `15.5.x` ontbreekt. Vóór een proef moet
  dus bewust een ondersteunde Next-versie worden gekozen.
- Hetzelfde document noemt de Payload-migratie “triviaal” en zegt dat buiten
  `getCourse()`/`catalogus()` niets verandert. `getCourse()` is nu synchroon en heeft ten
  minste veertien aanroepen in entitlement, checkout, voortgang, mails, metadata en
  pagina's; databasequeries zijn asynchroon. Voeg caching, invalidatie, drafts en het
  gedrag bij CMS-uitval aan het verhuisplan toe.

## 9b. Lopend op 2 aug 2026 — voor wie dit later oppakt

- [x] ~~Menselijke elementen-onderzoek~~ **Geland op 2 aug 2026: `docs/menselijke-elementen.md`.**
  De stand van deze draad, in drie sporen:
  - **Besloten en vastgelegd:** de top 7 (introvideo's, fotografie, post uit Den Haag,
    College Live, kwartaal-dagboek, leesclub, pers via VIDM), de afwijzingen mét reden
    (podcast, NRTO-keurmerk — eist €150.000 jaaromzet, algemeen forum), de forumrichting
    vragen-per-les (`docs/ideeen.md`), en de Resolve-keten. Jason bezit Resolve **Studio**,
    dus de scripting-API en het volledige AI-gereedschap zijn er al.
  - **Wacht op Jason (buiten het scherm):** de kanttekening-avond (één pen, één zitting,
    gratis cursus eerst), de gecombineerde foto-/videodag, en de bestelling van
    bedankkaarten + certificaatpapier (~€70–140).
  - **Wacht op bouwwerk (klaar om te starten zodra Jason het zegt):** het
    kanttekening-component + contentveld in `src/content/types.ts`, de "Vragen bij deze les"-tabel,
    API-route en moderatiescherm, en de Resolve-montagestraat (pas ná de eerste vijf
    handmatige video's — automatiseer niet wat je nog niet begrijpt).
  De klok telt hier mee: het archief wordt pas onkopieerbaar door tijd, dus elke maand
  eerder beginnen is voorsprong die niet in te halen is.

## 10. Onderzocht en in orde — niet opnieuw uitzoeken

- **De cursusinhoud is schoon** op auteursrecht en op de AFM-grens. Geen
  rendementsbeloftes, geen persoonlijk advies, geen overgeschreven boekteksten.
- **Er is geen verzonnen social proof** op de nieuwe site.
- **Geen cookiebanner nodig** — er is geen analytics en er zijn geen trackingcookies. Dat
  geldt alleen zolang dat zo blijft.
- **Bezoekers-IP's gaan niet naar Google voor het lettertype.** `next/font/google` host het
  lettertype bij de bouw zelf; de pagina doet nul verzoeken naar Google's fontservers.
  Google ziet je alleen bij het inloggen, en dat staat in de privacyverklaring.
- **Het betaalpad zelf is degelijk gebouwd:** de prijs komt uit onze eigen catalogus, de
  webhook gelooft niets uit de payload behalve het id en controleert bedrag én valuta, en
  `heeftToegangTot()` is aantoonbaar de enige toegangspoort. Betaalde pagina's renderen per
  verzoek met `private, no-cache, no-store`.
- **Geen enkel geheim staat in de repo of in de git-historie.**

## 11. Afgevallen bij verificatie — niet achterna jagen

Deze zijn door een tweede controleur onderuitgehaald: `docs/migadu-records.txt` zou
onvolledig zijn (is inmiddels bijgewerkt), drie ongebruikte exports, een dode
`generateStaticParams`, de streak die bij herhaalde lessen zou oplopen, het recht op
verwijdering dat van een verhuizende postbus zou afhangen, de teasercursus in de sitemap,
en de blogpost met een datum van morgen.

Uit de adversariële review van de CI-branch (3 aug, zestien agents) sneuvelden ook een
paar bevindingen — niet opnieuw uitzoeken: `prijsInCenten()` zonder `!course`-guard is
bewust (de checkout-route 404't onbekende slugs al vóór de aanroep); een lege
`?terug=` die op `/leerpad` uitkomt is bedoeld gedrag en getest; en het
"JSON-vorm-lek" in de bundelcontrole heeft vandaag geen begaanbaar pad — de extra
naald `"correctIndex":` zit er desondanks in als verharding.

Ook gezien maar niet reproduceerbaar: `npm run build` faalde in de nacht van 2 op 3 aug
tweemaal met dezelfde prerender-fout (digest `2686592030`) op de export van de gratis les
`waarom-beleggen`, en slaagde daarna zonder enige codewijziging volledig (36/36 pagina's,
gezonde route-tabel). Vermoedelijke oorzaak: twee agentsessies plus een dev-server die
tegelijk in dezelfde werkmap en `.next` bezig waren. Komt de fout terug in een build die
alléén draait, dán is er echt iets.
