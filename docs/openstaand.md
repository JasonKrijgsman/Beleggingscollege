# Openstaand — de eerlijke stand van zaken

Laatst bijgewerkt: 3 augustus 2026.

Dit is de losse-eindjeslijst. Eén plek, zodat je niet de hele `docs/`-map hoeft door te
lezen om te weten wat er nog moet. De andere documenten beschrijven hóe iets werkt en
waaróm het zo is gekozen; dit document beschrijft wat er níét af is. **Spreekt een ander
document dit tegen, dan wint dit document** — de rest is onderbouwing, geen takenlijst.

**Onderhoudsregel:** streep hier af wat je doet. Een punt dat af is mag weg — daar is de
git-historie voor. Eén uitzondering, en die zie je hieronder veel: als de *reden* dat het
zo is opgelost ertoe doet, blijft er een doorgestreepte regel met die reden staan. Anders
bouwt de volgende het opnieuw, of "vereenvoudigt" hij het terug naar de kapotte versie.

De bevindingen hieronder komen uit een audit van 2 augustus 2026 waarin zes onafhankelijke
controles over de code, de documentatie, de live site, de juridische pagina's en de
databank zijn gehaald, en elke bevinding daarna door een tweede controleur is nagelopen.
96 bevindingen hielden stand, 7 sneuvelden. Die 7 staan onderaan, zodat niemand ze opnieuw
gaat uitzoeken.

Een onafhankelijke second opinion door OpenAI Codex staat in
[`docs/reviews/2026-08-02-codex-website-en-architectuurreview.md`](reviews/2026-08-02-codex-website-en-architectuurreview.md);
de tweede pass ná de cursusdag staat in
[`docs/reviews/2026-08-03-codex-repository-harmonisatie-en-synthese.md`](reviews/2026-08-03-codex-repository-harmonisatie-en-synthese.md).
Beide series zijn stuk voor stuk tegen de code geverifieerd — regelnummers gecontroleerd,
races nagelopen, de npm-audit opnieuw gedraaid — en met die details hieronder verwerkt; wat
uit de tweede ronde nog openstond staat in §6b. Die reviews leggen bewijs en afwegingen
vast; de nog uit te voeren punten blijven uitsluitend in dit document staan.

---

## 1. Bewust genomen risico's

Dit zijn geen vergissingen. Ze staan hier omdat ze bewust zijn aanvaard en omdat iemand
over een maand moet kunnen zien dat het een keuze was.

### Een teruggedraaide chargeback herstelt de toegang niet vanzelf

Sinds 4 aug 2026 trekt de webhook toegang in bij elke chargeback (PR #42). Wint wíj́
daarna het geschil bij de bank — het geld komt terug naar ons — dan blijft het recht op
`ingetrokken` staan: Mollie meldt een chargeback-terugdraaiing niet op een manier die
wij verwerken. Bewust zo gelaten: het komt vrijwel nooit voor, een heraankoop
reactiveert het recht netjes, en handmatig herstellen kan zodra `/beheer` een
intrek/herstel-knop heeft (§4). Tot die tijd: rij opzoeken, `entitlements.status` terug
naar `actief`, `revoked_at`/`revoked_reason` leegmaken.

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

De aankoop `waardebeleggen | paid | € 49` op Jasons eigen account komt uit betaling
`tr_hTh3aaeBX99fmiT2SjpUJ` en is nooit met echt geld betaald. Onschuldig, maar hij vervuilt
straks je eerste omzetcijfers.

**Eén `delete` is sinds migratie `0004` niet meer genoeg.** Die migratie heeft elke
`purchases`-rij gekopieerd naar `payment_attempts` (met hetzelfde id) en elke betaalde rij
bovendien naar een `entitlements`-rij met status `actief`. Er staan dus drie rijen, en
juist de laatste is degene die de toegang geeft — wie alleen `purchases` opruimt verandert
niets. Opruimen gaat in deze volgorde, vanwege de foreign key
`entitlements.attempt_id → payment_attempts.id`:

1. de `entitlements`-rij (of markeer hem als `ingetrokken`, dan blijft het spoor staan),
2. de `payment_attempts`-rij,
3. de `purchases`-rij, zolang die tabel er nog staat.

De tellerstand in `order_counters` rolt daar níét door terug, en dat is goed: een gat in de
ordernummers is beter dan een nummer dat twee keer wordt uitgegeven.

**Doe dit met beleid zodra er echte kopers zijn** — een blinde `delete` op `entitlements`
trekt betaalde toegang in.

**Er is op 5 aug 2026 een tweede testaankoop bijgekomen** (Introductie Technische
Analyse, testmodus-iDEAL, op Jasons Gmail-account): de bewuste end-to-end-test van het
mailkanaal door de nieuwe betaalketen. Die test slaagde — zie `docs/e-mail-versturen.md` —
maar de rijen staan er dus wél, en deze aankoop heeft bovendien **ordernummer
`BC-2026-0001`** geconsumeerd. De eerste échte verkoop wordt daardoor `BC-2026-0002` of
later; noteer bij het opruimen dat het gat in de reeks een testorder was.

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
      **WERKT sinds 5 aug 2026.** De SMTP-variabelen staan in Vercel, en een
      testmodus-aankoop leverde de bevestiging af in de Gmail-inbox met spf/dkim/dmarc
      alle drie pass; DMARC staat sindsdien weer op `p=reject`. De hele afweging en het
      bewijs staan in `docs/e-mail-versturen.md`.
- [x] ~~**`src/lib/mail.ts` omzetten van de Resend-API naar Migadu SMTP.**~~ **Gedaan 3 aug
      2026.** Via nodemailer (exact 8.0.11 — Auth.js accepteert geen 9). De rest van de keten
      is inderdaad niet aangeraakt: die roept alleen `verstuurMail()` aan.
- [ ] **Twee gegevens die er nog niet zijn (KOR is beantwoord):**
      - ~~KOR?~~ **Beantwoord op 2 aug 2026: geen KOR.** De 21%-regel in de mail klopt dus.
      - **Vestigingsadres — besloten op 5 aug 2026: het woonadres.** Jason heeft de opties
        gewogen (postbus telt juridisch niet als geografisch adres; een virtueel
        bedrijfsadres kost €20–60/mnd tegen nul omzet) en gekozen voor het woonadres — dat
        staat als vestigingsadres van de eenmanszaak toch al openbaar in het
        Handelsregister. De juridische pagina's en het modelformulier renderen het adres
        sinds deze commit uit `BEDRIJF_ADRES` (met "Den Haag, Nederland" als terugval
        zolang de variabele leeg is). **Wat nog moet: de variabele vullen in Vercel
        (Production + Preview) en redeployen.** Het adres blijft bewust nérgens in de repo
        staan — alleen in de omgevingsvariabele. **Schrijf het woonadres ook niet in
        documentatie.** Heroverweeg een huuradres zodra er structurele omzet is.
      - ~~Btw-identificatienummer~~ **Opgelost op 2 aug 2026: `NL004813328B30`.** Staat in de
        voettekst en in de orderbevestiging. **Let op:** Jason heeft twee nummers. Het
        omzetbelastingnummer (afgeleid van zijn BSN, staat bewust niet in de repo) mag nergens
        gepubliceerd worden — niet in code, niet in een mail, niet in documentatie.
- [ ] **Btw-nummer nog invullen bij Mollie.** Het veld daar is leeg (gecontroleerd 2 aug 2026):
      Instellingen → Bedrijfsgegevens → Btw informatie.
- [ ] **Echte factuur.** Bij B2C is een volledige factuur níét wettelijk verplicht (art. 34c
      Wet OB geldt alleen B2B) — een bon volstaat. Maar `/voorwaarden` belooft er wél een, en
      die eigen toezegging bindt. Nummering is er nu (`payment_attempts.order_number`, atomair
      uitgedeeld via `order_counters`), btw-uitsplitsing ook; bewijs van waar de klant zit
      nog niet.
- [ ] **Herkansing als de bevestigingsmail mislukt.** Nu wordt een mislukte verzending alleen
      naar de console gelogd. Omdat juist die mail bepaalt of het herroepingsrecht vervalt, is
      "hij ging niet weg en niemand weet het" het slechtst denkbare gat. Er hoort een
      herhaalpoging te zijn, of op zijn minst een waarschuwing naar Jason zelf.
      Let op: de code rekent erop dat een volgende webhook-aanroep het opnieuw probeert — bij
      een aantoonbaar mislukte verzending wordt de claim op `confirmationClaimedAt` netjes
      teruggegeven, juist zodat dat kán. Maar de webhook antwoordt ook na een mislukte mail
      gewoon 200, en Mollie herhaalt dan dus juist níét. Herstel hangt nu op een toevallige
      tweede aanroep. Wat wél zichtbaar blijft: een rij met `confirmationClaimedAt` gezet en
      `confirmationSentAt` leeg betekent "geclaimd, maar nooit verstuurd" — dat is precies
      wat een monitoringronde moet naslaan.
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

## 4b. Waarde voor je geld — flink verschoven op 3 aug 2026

Een betaalde cursus was tekst plus een meerkeuzequiz; dat geeft YouTube gratis weg. Op
2 aug 2026 kreeg elke betaalde cursus daarom een eigen interactieve tool
(`IntrinsiekeWaardeTool`, `SteunWeerstandTool`).

Op 3 aug 2026 is de betaalde catalogus in één dag gegroeid van ~100 naar ~540 minuten
(8 betaalde cursussen, 60 betaalde lessen): de optieladder, Hefboomproducten,
Beleggingspsychologie en Indexbeleggen & ETF's, met samen twaalf nieuwe tools. Zie `docs/opties-curriculum.md`,
`docs/volgende-cursussen.md` en `docs/cursusfabriek.md` (het recept).

**Opvolgpunten die deze uitbreiding zelf heeft geopend:**

- [ ] **Jason heeft de zes nieuwe cursusteksten nog niet zelf gelezen.** Ze zijn door
      agents geschreven op het huisstijl-anker, feiten geverifieerd, maar het is zíjn naam
      en zíjn merk — proeflezen vóór de eerste marketing.
- [ ] **De test-key-open-deur (hoofdstuk 1) bewaakt nu acht betaalde cursussen** in
      plaats van twee. Zelfde risico, grotere etalage.
- [ ] **De €29-laag (Hefboomproducten) breekt het "één prijs"-principe** uit
      `docs/prijsstrategie.md` §1.2 — bewust herbevestigen of terugdraaien.
- [ ] **De lespagina-bundel groeide ~40 kB** doordat de toolregistry
      (`src/components/lesson-tools.tsx`) alle tools statisch importeert; dynamic imports
      zijn de voor de hand liggende optimalisatie.
- [x] ~~De sitemap-vraag uit §7 is groter geworden~~ **Opgelost op 3 aug 2026**: betaalde
      les-URL's worden niet meer aangediend. Zie §7.

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

- [x] ~~**De "we wachten nog op de bevestiging"-pagina ververst zichzelf niet.**~~ **Gedaan
      op 5 aug 2026.** `src/components/GekochtStatusPoller.tsx` ververst de pending-tak zelf
      elke ~4 s en stopt na 2 minuten met de bestaande knop als terugval. Het verversen gaat
      via `router.refresh()`, dus de bestaande server-component met `heeftToegangTot()` blijft
      de enige toegangspoort — er is bewust géén tweede statusroute bijgekomen. De stopgrens
      zit in de pure `src/lib/gekocht-polling.ts` en is vastgepind in
      `test/gekocht-polling.test.ts`; de knop is een echte link naar dezelfde pagina zodat hij
      ook zónder JavaScript werkt (volledige herlaadbeurt).
- [ ] **Het omzetbelastingnummer staat nog in de git-historie, en dat reist mee.** Het
      BSN-afgeleide nummer stond letterlijk in `CLAUDE.md`, `AGENTS.md`,
      `docs/e-mail-versturen.md` en dit document; op 3 aug 2026 is het er met commit
      `d760378` (PR #14) uitgehaald. **De werkmap is daarmee schoon, de historie niet** —
      één `git show` op die commit haalt het terug. Zolang de repo privé is, is dat een
      beheerst risico. **Vóór archiveren, publiceren of het toevoegen van een medewerker
      moet de historie herschreven worden.**

      **Op 3 aug 2026 is dit twee keer geoefend en één keer half uitgevoerd; alles behalve
      de laatste duw is bewezen.** De herschreven spiegel klopte exact: 154 commits erin en
      eruit, 191 treffers naar 0, en de boom-hash van `main` bleef byte-identiek — de
      inhoud van vandaag verandert dus niet, alleen de hashes. De push zélf uploadde alle
      1089 objecten zonder morren en strandde puur op de branch protection. Wie het afmaakt
      hoeft niets opnieuw uit te zoeken:

      1. `pip install git-filter-repo` (Python 3 is aanwezig). Kloon met `--mirror` vanaf
         GitHub — niet lokaal, anders mis je branches.
      2. **Zoek het nummer niet automatisch op.** In de historie staan **vijf** verschillende
         strings van de vorm `[0-9]{9}B[0-9]{2}`; "pak de eerste match" pakt de verkeerde.
         Het doelnummer begint met `214` en is als enige van de vijf al níét meer in de
         werkboom te vinden — gebruik dat als controle. Zet het nummer in geen enkel
         bestand dat je bewaart.
      3. `git filter-repo --replace-text <bestand> --force`. **Let op: filter-repo gooit de
         remote `origin` weg** (met opzet, zodat je niet per ongeluk de verkeerde repo
         herschrijft). Daarna dus `git remote add origin …` vóór je pusht.
      4. **Drie instellingen blokkeren de push, niet één.** In Settings → Branches → `main`
         moeten tijdelijk uit: *Require status checks to pass* (want strict-mode eist een
         groene CI-run op précies die commit, en een force-push van historie krijgt er nooit
         een), *Do not allow bypassing the above settings*, en *Allow force pushes* moet
         juist áán. Herstel daarna alle drie — de stand vóóraf was: vereiste check `CI`,
         strict aan, admins inbegrepen, force-push uit, verwijderen uit, geen review-eis.
      5. Ná afloop: **iedereen moet opnieuw klonen** (alle hashes veranderen, dus ook elke
         worktree is ongeldig), en de **±19 verwijzingen naar commit-hashes in `docs/` en
         `CLAUDE.md` worden dode links**. Repareer die met de map die filter-repo achterlaat
         in `.git/filter-repo/commit-map` (oud → nieuw).

      Doe het pas als er **geen open PR's en geen andere branches dan `main`** zijn, en er
      geen tweede sessie aan het werk is: elke niet-gemergde branch wordt onbruikbaar. Dat
      venster was op 3 aug de schaarste factor, niet het werk zelf.
- [ ] **Neon zit op 10/10 branches en dat gaat de volgende preview breken.** Geconstateerd
      3 aug 2026: de console meldt "Branch limit reached" (gratis laag = 10). Negen daarvan
      zijn `preview/…`-branches die de Vercel-integratie per preview-deployment aanmaakt, en
      acht horen bij PR's die allang gemerged zijn — `bugbot-werkafspraak`,
      `ontwerp-betaalmodel`, `publieke-teksten-kloppen`, `betaalmodel-splitsing`,
      `twitter-kaart`, `sitewide-review-metadata`, `openstaand-6b-bijwerken` en
      `claude/test-coverage`. Ze worden **niet** automatisch opgeruimd als de PR sluit.
      Weggooien is veilig: het zijn wegwerpkopieën van `main` en de integratie maakt een
      nieuwe aan zodra er weer een preview nodig is. Let op de samenhang met het punt
      hieronder: zodra Preview een eigen vaste branch krijgt, hoort daar meteen een
      afspraak bij over wie de tijdelijke opruimt, anders loopt het opnieuw vol.
      (De databases `neondb` en `umami` staan allebei op `main` en raken dit niet.)
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
      typecheck, ESLint mét toegankelijkheidsregels, Vitest-tests voor de geldpaden (het
      aantal groeit mee met de catalogus — draai `npm run controle` voor de stand),
      productiebuild en bundel-lekcontrole, lokaal reproduceerbaar met
      `npm ci && npm run controle`, zonder één geheim. Sindsdien is main ook écht een
      slagboom: branch protection met vereiste check "CI" óók voor admins, strict-mode,
      auto-merge aan, en een alarm-job die een issue opent als main toch rood wordt.
      Bewijs en beperkingen: `docs/ci.md`.) Wat nog open staat:
      - Tests voor terugbetaling bestaan niet, want terugbetalen zelf bestaat nog niet
        (zie het herroepingspunt in hoofdstuk 2).
      - Een handvol bestaande lint-warnings (ongebruikte variabelen) in bestanden die op
        het bouwmoment door parallelle sessies bewerkt werden; zie `docs/ci.md`.
      - Opruimen van de restanten van de sessiebotsingen van 3 aug: losse lokale branches
        (waaronder `ci-testfundament`, met commit `585f282` waarin twee sessies door
        elkaar heen werkten), één stash, de al gemergde remote branches en de achtergebleven
        worktrees onder `.claude/worktrees/`. Alles is gemerged of overbodig, dus weggooien
        is veilig — maar **kijk zelf met `git branch`, `git stash list` en
        `git worktree list` wat er nu staat**: die lijst schuift per sessie op, en een
        opgeschreven opsomming was hier al een keer verouderd. Let op dat er een worktree
        `locked` kan staan, en dat deze restanten lokaal zijn: ze reizen niet mee het
        archief in.
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
      niet op, maar wie de URL heeft ziet het interne stijllab — en sinds 3 aug óók
      `/lab/opties`: alle vijftien interactieve lestools uit betaalde cursussen, gratis
      te bedienen. Geen lesinhoud en dus geen lek, maar wel een bewuste keuze om te
      herbevestigen zodra er echt verkocht wordt.
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
- [ ] **Voortgang: de toegangscontrole is er, twee andere serverregels nog niet.**
      ~~Geen aankoopcontrole vóór het schrijven van betaalde cursusvoortgang~~ **gedicht op
      3 aug 2026 (PR #32)**: `POST /api/voortgang` weigert nu met 403 wat je niet bezit en
      met 400 wat niet bestaat, en de snapshotimport snoeit tot gratis + gekochte cursussen.
      `heeftToegangTot()` bleef daarbij de enige poort. Wat blijft staan:
      - **De quizscore is maar half serverwaarheid.** `total` komt uit de catalogus
        (`lesson.quiz.length`, dus dat kan de client niet opblazen); alléén `correct` komt
        uit het verzoek en wordt geklemd op `0..total` (`verwerkLes()` in
        `src/lib/voortgang-server.ts`). De gegeven antwoorden reizen nooit mee, dus de
        server kán ze niet nakijken — en daarmee is `correct = total` met één fetch te
        posten. Dat levert de volle quizbonus (tot 25 XP per les) én de foutloos-badge op.
        Er lekt geen lesinhoud, maar badges en certificaten worden er waardeloos van.
        Echt dichtzetten betekent de antwoorden meesturen en op de server nakijken. Zie
        CODEX-105.
      - **"Voortgang wissen" wist bij een ingelogde gebruiker alleen de lokale cache.** Er is
        geen server-delete en de import is bewust alleen-aanvullend, dus na de volgende
        paginalading staat alles er weer — terwijl de knop zegt "Dit kan niet ongedaan
        worden gemaakt". Dat is nu dus een onwaarheid in de UI, en daarmee een merkprobleem
        én een AVG-punt (recht op verwijdering).
- [x] ~~**Ordermail heeft een race en achterhaalde tekst.**~~ **Gedicht op 3 aug 2026.**
      Er is nu een atomaire claim: `UPDATE payment_attempts SET confirmation_claimed_at …
      WHERE confirmation_claimed_at IS NULL … RETURNING`, en wie geen rij terugkrijgt
      verstuurt niets. Blijkt de mail aantoonbaar níét weg, dan wordt de claim teruggegeven
      zodat een volgende webhook het opnieuw probeert; alleen een crash tússen claim en
      verzending laat "geclaimd zonder verstuurd" achter — precies wat de monitoringronde
      hierboven moet naslaan. `confirmationSentAt` is sindsdien alleen nog het bewijs dát
      er verstuurd is. De mailtekst is ook bijgewerkt: die zegt nu dat aankoop én voortgang
      allebei aan het account hangen. Zie CODEX-004 en CODEX-106.
- [x] ~~**Ordernummers kunnen botsen, gaten krijgen of buiten de administratie vallen.**~~
      **Vervallen met PR #22.** `geefOrdernummer()` bestaat niet meer — geen tellen-en-
      proberen, geen kale `catch {}`, geen `Date.now()`-terugval die een nummer mailt dat
      in de administratie niet bestaat. Het nummer komt nu atomair uit `order_counters`,
      binnen hetzelfde statement dat de betaling op `paid` zet (`verwerkBetaald()` in de
      webhook). `orderbevestiging.ts` verzint niets meer en weigert te mailen als er geen
      nummer staat.
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
- [ ] **Content-Security-Policy ontbreekt nog** (de rest van CODEX-109 is af). Frame-,
      content-type-, referrer- en permissions-beleid staan sinds 3 aug 2026 in
      `next.config.ts` en zijn op de gebouwde site geverifieerd. HSTS zet Vercel zelf al.
      Wat overblijft is de CSP, en die moet apart ontworpen worden rond Google (inloggen),
      Mollie (afrekenen) en een eventuele Payload-preview — een haastige CSP breekt precies
      de twee paden waar geld en toegang aan hangen. `payment=()` staat om dezelfde reden
      bewust níét in de Permissions-Policy. Zie CODEX-109.

## 6b. Uit de Codex-harmonisatiereview van 3 aug 2026 — nog niet elders belegd

De tweede Codex-review (`docs/reviews/2026-08-03-codex-repository-harmonisatie-en-synthese.md`)
vond ruim tien punten; het meeste stond al hierboven of is inmiddels gedicht. Dit zijn de
bevestigde, nog níét elders belegde punten, gereconcilieerd tegen de actuele `main` en waar
mogelijk in de code nagekeken. De review zelf is de onderbouwing; hier één eigenaar en één
acceptatiecheck per punt.

- [x] ~~P0 — Betaalpoging, order en toegang zitten in één `purchases`-rij~~ **Gedaan op
      3 aug 2026 (PR #22).** `purchases` is gesplitst in `payment_attempts` (append-only, één
      rij per Mollie-id), `entitlements` (één recht per gebruiker/cursus — het enige dat
      `heeftToegangTot()` leest) en `order_counters` (atomaire, doorlopende ordernummers).
      Alle §2.2-overgangen zitten nu als voorwaarde ín de UPDATE, dus geen enkele query kan
      een `paid`- of `mismatch`-rij nog overschrijven. Ontwerp: `docs/ontwerp-betaalmodel.md`.
      Migratie `0004` is eerst op een Neon-branch gerepeteerd en daarna op productie gedraaid;
      de tellingen klopten vóór én na de deploy en de live site bevestigde dat de toegang
      behouden bleef.
      **Let op bij de neon-http-driver:** `db.transaction()` bestaat daar niet (hij gooit),
      terwijl het in de PGlite-tests wél werkt. De paid-verwerking is daarom één SQL-statement
      met data-modifying CTE's — zie `verwerkBetaald()` in de webhook. Niet "vereenvoudigen"
      naar losse statements.
      **Resteert:** de contract-stap — `DROP TABLE purchases` in een eigen migratie, pas als
      `/beheer` aantoonbaar hetzelfde toont en er een volledige testaankoop doorheen is.
      Terugrollen kan tot dan met `scripts/rollback-betaalmodel.sql`.
- [x] ~~P0 — Publieke/juridische teksten beschrijven nog de oude site~~ **Gedaan.**
      `/herroepingsrecht` en `/privacy` op 3 aug (PR #18); `/veelgestelde-vragen` en
      `/voorwaarden` §7 op 3 aug in de reviewronde daarna — die twee waren over het hoofd
      gezien en zeiden nog letterlijk "niet op onze servers", "staat op de planning" en
      "zolang er nog geen accounts zijn". Ze beschrijven nu allebei de echte situatie:
      uitgelogd browser, ingelogd account, quizantwoorden blijven lokaal.
      **Resteert:** de mailtekst-variant (staat bij "Ordermail") en het laten toetsen van de
      consent-flow door een jurist. Een echte claimmatrix als document is er nog niet — de
      vier pagina's zijn stuk voor stuk tegen de code nagelopen.
- [x] ~~P1 — Servervoortgang is niet transactioneel~~ **Gedaan op 3 aug 2026 (PR #32).**
      `verwerkLes()` en `importeerSnapshot()` zijn elk één SQL-statement met data-modifying
      CTE's — hetzelfde patroon als `verwerkBetaald()` in de webhook, en om dezelfde reden:
      `db.transaction()` bestáát niet op de neon-http-driver (hij gooit), terwijl het in de
      PGlite-tests wél werkt. XP wordt nooit meer absoluut gezet, alleen opgehoogd met de
      delta uit de lesinsert, zodat `user_stats.xp = SUM(lesson_progress.xp_awarded)` uit de
      vorm van het statement volgt in plaats van uit een aanname (die laatste stap kwam uit
      een Bugbot-bevinding op de PR).
      **Bewijs dat de racetests écht racen:** `houdVast()` in `test/helpers/pglite-db.ts`
      houdt het eerste passende statement vast tot een ander verzoek er dwars doorheen is.
      Zonder die klem slaagden 4 van de 5 naïeve `Promise.all`-races óók tegen de kapotte
      code; mét de klem falen er 3 van de 6 tegen de oude implementatie. Wie hier later aan
      werkt: schrijf de test eerst zo dat hij tegen de oude code faalt.
- [x] ~~P1 — Zichtbare prijs en schema.org-prijs komen niet uit één bron~~ **Gedaan op
      3 aug 2026 (PR #17).** `schemaOrgPrijs()` in `src/lib/prijs.ts` leidt de geadverteerde
      prijs af uit dezelfde `prijsInCenten()` die de checkout afrekent; de afwijkende
      `€14,99`-fallback is weg, en bij een onbekende prijs verschijnt er géén `Offer` in
      plaats van een verkeerde. `test/prijs.test.ts` bewaakt voor élke koopbare cursus dat
      adverteren en afrekenen niet meer uit elkaar kunnen lopen.
- [x] ~~P1 — Vraag- en nieuwsbrieflifecycle vóór schaal~~ **Grotendeels gedaan op 3 aug 2026
      (PR #30).** De limiet van drie wachtende vragen zit nu ín één `INSERT … SELECT … WHERE
      (SELECT count(*) …) < 3` (de race is eerst gereproduceerd, daarna gedicht);
      nieuwsbriefinschrijving reactiveert een uitgeschreven adres via `onConflictDoUpdate`
      met `setWhere: isNotNull(unsubscribedAt)`, zodat een nog actieve inschrijving
      onaangeroerd blijft en het oorspronkelijke toestemmingsbewijs niet opschuift; beide
      publieke schrijfroutes hebben een ratelimiet (`src/lib/ratelimiet.ts`, 10 per 15 min,
      op gebruikers-id resp. IP).
      **Wat er bewust níét in zit, en dus openstaat:**
      - Geen dubbele opt-in: token, bevestigingsmail, uitschrijflink en het bewijs daarvan
        moeten er nog komen vóór de eerste nieuwsbriefmail de deur uit gaat.
      - De ratelimiet is in-memory en dus **per instance** — een snelheidsdrempel, geen
        garantie. Echt begrenzen vraagt gedeelde staat (database of KV).
      - Onder READ COMMITTED kunnen twee exact gelijktijdige vragen in theorie allebei nog
        ruimte zien. Kosten: één extra vraag in de moderatiewachtrij. Dichttimmeren vraagt
        een lock of SERIALIZABLE, en dat is die prijs hier niet waard.
- [x] ~~P1 — De nieuwste tools hebben geen eigen tests, en één heeft een bug~~ **Gedaan op
      3 aug 2026 (PR #20).** De `acties.find()`-bug in de paniek-simulator is gerepareerd
      (alle acties van een maand tellen nu mee, in volgorde), en de rekenkern van de drie
      nieuwste tools is uit de componenten gehaald naar pure modules (`src/lib/paniek.ts`,
      `kostenvreter.ts`, `biastest.ts`) met 43 tests op onafhankelijk narekende fixtures,
      inclusief grenswaarden en corrupte opslag.

## 6c. Uit de site-review van 3 aug 2026 (buitenkant, uitgelogd bekeken)

Een review van de live site als bezoeker, niet van de code. Twee bevindingen zijn in
dezelfde ronde gerepareerd en staan hier alleen genoemd zodat ze niet opnieuw worden
uitgezocht: **cursus- en blogpagina's deelden zonder afbeelding** (een eigen `openGraph`-blok
in `generateMetadata` vervángt dat van de root-layout, inclusief de afbeelding uit
`opengraph-image.tsx`) en **de heroknop op een betaalde cursus stuurde niet-kopers naar het
slotscherm**. Beide zijn gedicht; de 404 heeft nu ook een eigen titel en de homepage
Organization-/WebSite-markup.

Wat de review verder opleverde en nog openstaat:

- [ ] **De meting is gebouwd maar staat nog uit.** Umami, zelf gehost, cookieloos:
      `src/lib/analytics.ts` + `src/components/Analytics.tsx`, gemount in de root-layout.
      Zolang `NEXT_PUBLIC_UMAMI_URL` en `NEXT_PUBLIC_UMAMI_WEBSITE_ID` niet allebei gevuld
      zijn, laadt er geen script en gaat er geen verzoek uit; `test/analytics.test.ts` pint
      dat vast. De privacyverklaring is bijgewerkt (§10 hieronder ook) en beschrijft nu wat
      er gemeten wordt en waarom er geen banner nodig is.
      **De opzet is op 3 aug 2026 half afgemaakt en daar blijven staan.** Klaar: de
      Neon-database `umami`, het Vercel-project `umami` (kloon van `umami-software/umami`,
      repo `JasonKrijgsman/umami`) en zijn twee variabelen — de build meldde "Database
      version check successful", dus de verbinding klopt. Nog te doen: het domein
      `stats.beleggingscollege.com` aan het project hangen, de CNAME in Cloudflare
      (**grijze wolk**), het
      standaardwachtwoord `admin`/`umami` wijzigen, de website in Umami aanmaken en het
      website-id in het site-project zetten. De actuele afvinklijst staat bovenaan
      `docs/analytics.md`; werk die bij in plaats van hier.
      Dit vraagt Jasons login (passkeys), dus een agent kan het niet alleen afmaken.
      **Niet vergeten:** de onderbouwing "geen toestemming nodig onder art. 11.7a Tw" is van
      ons, niet van een jurist. Neem dit mee in de toetsing die al openstaat voor de drie
      juridische pagina's (hoofdstuk 2).
- [ ] **Gebeurtenissen, niet alleen paginaweergaven.** De trechter die er echt toe doet —
      les 1 afgerond, cursuspagina bereikt, vinkje aan en tóch afgehaakt — vraagt om
      expliciete `umami.track(...)`-aanroepen. Bewust nog niet gebouwd: eerst zien of de
      basis klopt.
- [ ] **Het e-mailveld staat alleen aan het eind van de trechter.** `EmailCapture` bestaat
      en staat op twee plekken: de certificaatpagina van elke cursus en `/leerpad` zodra
      alles is afgerond. Een bezoeker die de gratis cursus níét uitloopt komt het dus nooit
      tegen, en op de homepage en de gratis cursuspagina staat helemaal niets. De gratis
      cursus van negen lessen is het beste lokmiddel dat er is en levert daardoor vrijwel
      geen adressen op — terwijl juist dat de lanceerlijst voor College+ zou moeten zijn.
      (Aanmelden zelf kan pas écht als de dubbele opt-in uit §6b er is.)
- [ ] **Inloggen kan alleen met Google.** Geen e-mail/wachtwoord, geen magic link, geen
      Apple. Voor een publiek dat je juist op privacy binnenhaalt is dat een wrange drempel,
      en het is de enige weg naar een betaalde cursus.
- [ ] **Geen enkele vorm van sociale bewijskracht.** Bewust geen verzonnen reviews (zie §10,
      dat blijft), maar er is ook niets echts: geen aantal cursisten, geen voorbeeld van een
      certificaat, geen citaat van een proeflezer. Bij €49 van een onbekende aanbieder is dit
      waarschijnlijk de grootste ontbrekende conversiefactor. Eerlijke opties die geen
      verzinsel zijn: "X mensen rondden de gratis cursus af" (zodra dat een eerlijk getal is)
      of een afbeelding van het echte certificaat.
- [ ] **Nul afbeeldingen op de hele site.** Geen enkele `<img>`. Voor een cursus over
      candlestickpatronen en grafieken lezen is dat een lastige verkoop: je ziet vooraf niet
      hoe een les eruitziet. (De interactieve tools tekenen wél grafieken — maar pas ná de
      koop.)
- [ ] **`/leerpad` weet niet wat je bezit, en dat lekt op twee plekken.** De pagina is een
      `"use client"`-component zonder serverkant, dus ze kent alleen voortgang, geen
      aankopen. Gevolg: alle negen cursussen staan onder "Mijn cursussen", ook de acht die
      je niet bezit, allemaal op 0%. De aanbeveling "ga verder waar je was gebleven" viel om
      dezelfde reden terug op de héle catalogus; die is op 3 aug afgevangen door in dat geval
      alleen naar gratis cursussen te wijzen — een pleister, geen oplossing, want wie een
      betaalde cursus kocht maar nog niet begon wordt nu naar de gratis cursus gestuurd.
      De echte oplossing is een serverwrapper die de gekochte slugs meegeeft; die is er
      tóch nodig voor de eigen titel/description/noindex uit §7. Doe die twee samen, en
      splits de lijst dan meteen in "Jouw cursussen" en "Verder leren". Hangt samen met het
      ontbrekende bezitsoverzicht in §4.
- [ ] **Het btw-identificatienummer staat op twee plekken los van elkaar.**
      `src/components/SiteFooter.tsx` heeft `NL004813328B30` hard in de tekst, terwijl
      `BEDRIJF.btwNummer` in `src/lib/mailteksten.ts` uit `BEDRIJF_BTW_NUMMER` komt en zonder
      die variabele `[btw-nummer nog niet ingevuld]` in de orderbevestiging zet. Voettekst en
      mail kunnen dus verschillende dingen zeggen. Bewust niet in deze ronde aangeraakt: het
      grenst aan de regel dat het omzetbelastingnummer nérgens gepubliceerd mag worden, dus
      dit hoort met aandacht en niet als bijvangst.
- [ ] **Geen RSS-feed op de blog**, en er staat één artikel. Zolang dat zo is, is de hele
      vindbaarheid afhankelijk van negen cursuspagina's en negen gratis lessen.

## 7. Vindbaarheid

- [ ] **`beleggingscollege.nl` geeft 404** (gecontroleerd 3 aug 2026, eind van de dag). De oude
      WordPress-site mét de drie verzonnen testimonials is dus wég — dat deel is opgelost — maar
      de apex wijst nog naar Strato (`81.169.145.93`, Apache) en daar staat niets meer. Netto is
      dat een verslechtering: vanochtend stond er nog íets, nu een foutpagina. En dat is het
      adres in onze voettekst, op elk certificaat en in de drie juridische pagina's als het
      adres van de verkoper — we sturen klanten dus naar een dode pagina.
      **Kleinste fix zolang de providerwissel hangt (§8):** de DNS staat al bij Cloudflare, dus
      de A/AAAA van de apex kunnen nú al naar Vercel wijzen en `beleggingscollege.nl` als domein
      aan het site-project worden gehangen. Dat vraagt de verhuiscode niet — die is alleen nodig
      om weg te komen bij Strato als registrar.
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
      begintoestand vóór Google's eerste crawl; de sitemap zelf gaf HTTP 200 met 32 URL's
      (stand 2 aug, vier cursussen — inmiddels 25, zie §7). Staat die status er over een
      paar dagen nog, dán is er wél iets aan de hand.
- [x] ~~`www.beleggingscollege.com` bestaat niet~~ **Gedaan 2 aug 2026.** Toegevoegd in Vercel
      als **308 permanente redirect** naar het hoofddomein, met een CNAME `www` →
      `6d87ec9bdcf67bce.vercel-dns-017.com` in Cloudflare (DNS only). Geverifieerd: 308.
- [ ] **Geen redirects voor de oude WooCommerce `/product/`-URL's** en vier andere
      geïndexeerde WordPress-pagina's; die geven nu 404.
- [ ] **`/leerpad` heeft geen eigen titel, description of `noindex`** — hij erft alles van
      de homepage. `robots.ts` blokkeert alleen het crawlen, en dat houdt indexering via
      links niet tegen. De pagina is een `"use client"`-component en kan zelf geen metadata
      exporteren; er moet dus een `layout.tsx` of serverwrapper omheen.
- [x] ~~De sitemap bevat ook alle betaalde les-URL's~~ **Besloten en gedaan op 3 aug 2026.**
      Alleen lessen van gratis cursussen worden nog aangediend; het slotscherm heeft geen
      zelfstandige publieke waarde. De URL's blijven werken (geen redirect nodig, er
      verdwijnt niets), we dienen ze alleen niet meer in. Sitemap ging van 85 naar 25 URL's.
      `test/sitemap.test.ts` bewaakt nu beide kanten: gratis lessen erin, betaalde eruit,
      cursusdetailpagina's van betaalde cursussen juist wél erin.

## 8. Domein en e-mail

- **DNSSEC is eraf en de naamservers zijn omgezet (3 aug 2026).** Het DS-record (keytag 43361)
  is verdwenen bij de registry — gecontroleerd via `ns1.dns.nl`, 1.1.1.1 en 8.8.8.8 — en
  Strato's eigen paneel meldt nu "DNSSEC: Niet actief". Daarmee kwam het NS-formulier vrij en
  staan `joan.ns.cloudflare.com` / `rene.ns.cloudflare.com` ingevuld; Strato bevestigde
  "De NS-records zijn opgeslagen". Wat er nog moet: wachten tot de delegatie doorwerkt, dan
  Cloudflare laten verifiëren, Migadu → Rerun Checks, en dan pas de Providerwissel.
- [ ] **De verhuiscode is het enige dat nog ontbreekt.** De Providerwissel-wizard faalde op
      3 aug twee keer op de bevestigingsstap ("Er is een fout opgetreden"), zonder aanwijsbare
      oorzaak: DNSSEC uit, Domain Guard uit, delegatie geland. Er wordt niets half toegepast.
      Opnieuw proberen; blijft het falen, dan een supportticket met de Info-ID's uit
      `docs/domain-migration-plan.md`. **Zonder code geen transfer naar Porkbun — en Porkbun
      pikt niets vanzelf op.** Geen haast: het domein loopt tot 20-08-2027.
- [x] ~~**`beheer@beleggingscollege.nl` bestaat nog niet bij Migadu.**~~ **Aangemaakt 3 aug
      2026.** Naam "Beleggingscollege", mag verzenden én ontvangen, IMAP/POP3/ManageSieve aan,
      verloopt nooit. Daarnaast staat er nog een ongebruikte `admin@` (postmaster, automatisch
      aangemaakt bij het toevoegen van het domein) — die doet niets en mag blijven staan.
- [ ] **De verzendgegevens staan nog niet in Vercel.** `MAIL_SMTP_GEBRUIKER`
      (= `beheer@beleggingscollege.nl`) en `MAIL_SMTP_WACHTWOORD` in Production + Preview,
      daarna opnieuw deployen. Zolang ze leeg zijn logt de app een waarschuwing en gaat er geen
      bevestiging de deur uit; de aankoop werkt wel gewoon door. **Test daarna één echte
      bestelling** vóór je DMARC terugzet van `quarantine` naar `reject` — dat is precies de
      volgorde die voorkomt dat een fout stil in een weigering eindigt.
- [ ] **Zet DMARC terug op `p=reject`** in de Cloudflare-zone, zodra verzenden bewezen werkt.
      Het staat nu bewust op `quarantine` (met een comment bij het record dat dat tijdelijk is).
- [ ] **De `.nl` serveert nu de oude WordPress-site.** De A-records in Cloudflare wijzen nog
      naar `81.169.145.93` bij Strato. Dat was bewust zo tijdens de verhuizing, maar het
      betekent dat het adres in onze eigen voettekst en op elk certificaat de site met de drie
      verzonnen testimonials laat zien — precies waarom deze verhuizing haast had. Domein
      toevoegen in Vercel, A/CNAME omzetten, `NEXT_PUBLIC_SITE_URL` naar de `.nl` en een
      permanente redirect `.com` → `.nl`. Dit hoeft **niet** op de verhuiscode te wachten.
      **Volledig stappenplan met de valkuilen: `docs/nl-als-hoofddomein.md`.**
- **Let op bij de Providerwissel:** Strato waarschuwt op de NS-pagina dat "STRATO
  e-mailfuncties bij gebruik van eigen nameservers niet beschikbaar zijn voor dit domein".
  De aanname in `docs/domain-migration-plan.md` dat je de Strato-postbus door de
  naamserverwissel heen levend houdt door de MX te kopiëren, klopt dus niet — en de
  Cloudflare-zone wijst sowieso al naar Migadu. Jason heeft op 3 aug bevestigd dat de inhoud
  van die postbussen gemist kan worden.
- **De e-mail draait sinds 3 aug 2026 bij Migadu.** De oude Strato-postbussen (`beheer@`,
  `info@`) zijn met de naamserverwissel vervallen; Jason heeft bevestigd dat die inhoud gemist
  kon worden. De MX wijst nu naar `aspmx1`/`aspmx2.migadu.com` en de nieuwe `beheer@` ontvangt.
- [ ] **Er kijkt nog steeds niemand in die postbus.** Op `/contact` staat "antwoord binnen twee
      werkdagen", en `/herroepingsrecht` en `/privacy` noemen dit adres voor respectievelijk
      ontbinding en AVG-verzoeken. Bij Migadu staat **Forwarding op Inactive**, dus binnenkomende
      post blijft daar liggen tot iemand inlogt. Zet de postbus op je telefoon (IMAP staat aan)
      of zet doorsturen aan. Dit is nu urgenter dan het was: dit adres is straks óók de afzender
      van elke orderbevestiging, dus antwoorden van klanten komen hier binnen.

## 9. De documentatie spreekt zichzelf tegen

- [x] ~~**`AGENTS.md` is een verouderde kopie van `CLAUDE.md`**~~ **Structureel opgelost op
      3 aug 2026.** Het verschil zat niet in details maar in de dingen die er het meest toe
      doen: AGENTS.md zei nog dat lesvoortgang "nog altijd in localStorage" leeft en
      beschreef nog het oude `purchases`-model — het voortgangspad en het geldpad.
      AGENTS.md bevat nu **alleen regels** (niet naar main pushen, geen geheimen,
      `heeftToegangTot()` is de enige poort, `@/content` is server-only, Nederlands, claims
      moeten waar zijn) plus een verwijzing hierheen. Regels verouderen niet elke dag,
      toestand wel. De hard rules staan er bewust wél letterlijk in: leest een tool alleen
      dat bestand en negeert het de verwijzing, dan kan het nog steeds geen schade doen.
      **Waarom niet "we werken ze samen bij":** dat wás de afspraak en die is gesneuveld.
      Twee sessies op dezelfde dag schreven zelfs tegengestelde instructies — de een dat
      beide bestanden dezelfde productwaarheid moeten dragen, de ander dat AGENTS.md leeg
      moet blijven. Dat is rechtgetrokken; laat het niet terugkeren.

- `docs/prijsstrategie.md` noemt drie dingen "blokkerend voor de eerste transactie" die
  niet gebouwd zijn, terwijl `CLAUDE.md` en `docs/betalingen-mollie.md` de checkout als af
  presenteren met alleen de key nog te wisselen. Wie alleen `CLAUDE.md` leest, zet de
  live-key erin in de veronderstelling dat dat de laatste stap was.
- `docs/implementatie-accounts-betalen.md` (1.619 regels) is half achterhaald: het
  auth-hoofdstuk schrijft Prisma, JWT en wachtwoordinloggen voor, waarvan niets gebouwd is,
  en spreekt zijn eigen database-hoofdstuk tegen.
- [x] ~~`README.md` beschrijft een product dat niet meer bestaat~~ **Bijgewerkt 3 aug 2026**,
  en in de archiefronde daarna herschreven tot een echte instap: wat het is, hoe je het
  draait, wat de poort naar `main` is, welke drie valkuilen je moet kennen en welke
  documenten je met een korrel zout leest.
- **Dit soort drift is de regel, niet de uitzondering.** Het patroon is elke keer hetzelfde:
  de code verandert, `CLAUDE.md` gaat mee, en de documenten die de *onderbouwing* dragen
  blijven staan met de oude tabelnaam of het oude aantal erin. Vandaar de regel bovenaan dit
  document: bij tegenspraak wint deze lijst.
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
    kanttekening-component + contentveld in `src/content/types.ts`, en de
    Resolve-montagestraat (pas ná de eerste vijf handmatige video's — automatiseer
    niet wat je nog niet begrijpt).
    (De "Vragen bij deze les"-tabel, API-route en moderatiescherm zijn op 3 aug 2026
    gebouwd en staan live — zie `src/lib/lesvragen.ts` en `/beheer/vragen`.)
  De klok telt hier mee: het archief wordt pas onkopieerbaar door tijd, dus elke maand
  eerder beginnen is voorsprong die niet in te halen is.

## 10. Onderzocht en in orde — niet opnieuw uitzoeken

- **De cursusinhoud is schoon** op auteursrecht en op de AFM-grens. Geen
  rendementsbeloftes, geen persoonlijk advies, geen overgeschreven boekteksten.
- **Er is geen verzonnen social proof** op de nieuwe site.
- **Geen cookiebanner nodig** — er zijn geen trackingcookies. De bezoekmeting die op
  3 aug 2026 is gebouwd (Umami, zelf gehost) zet géén cookies en schrijft niets naar de
  browser, dus die verandert hier niets aan: cookieloze statistiek zonder profilering valt
  onder de uitzondering van art. 11.7a Telecommunicatiewet. Zie `docs/analytics.md` voor de
  redenering en de grens. Gaan we ooit iets meten dat wél op het apparaat leest of schrijft,
  dan is een banner alsnog verplicht.
- **Bezoekers-IP's gaan niet naar Google voor het lettertype.** `next/font/google` host het
  lettertype bij de bouw zelf; de pagina doet nul verzoeken naar Google's fontservers.
  Google ziet je alleen bij het inloggen, en dat staat in de privacyverklaring.
- **Het betaalpad zelf is degelijk gebouwd:** de prijs komt uit onze eigen catalogus, de
  webhook gelooft niets uit de payload behalve het id en controleert bedrag én valuta, en
  `heeftToegangTot()` is aantoonbaar de enige toegangspoort. Betaalde pagina's renderen per
  verzoek met `private, no-cache, no-store`.
- **Geen enkel geheim staat in de werkmap.** Geen API-keys, geen wachtwoorden, geen
  `.env`-bestanden. **Maar de historie is níét schoon — zie het punt hieronder.**

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
