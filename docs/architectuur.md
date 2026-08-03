# Architectuur van Beleggingscollege

*Laatst bijgewerkt: 3 augustus 2026, na de betaalmodelsplitsing (PR #22) en de harding van de voortgangssync (PR #32) — de kaart is toen opnieuw regel voor regel tegen de code gelegd. Dit document beschrijft wat er werkelijk in de code staat, niet wat er ooit gepland was. Waar de werkelijkheid afwijkt van eerdere documentatie (zoals CLAUDE.md of docs/plattegrond.md) staat dat er eerlijk bij.*

*Bewuste keuze in dit document: **zo min mogelijk bevroren getallen**. Regelaantallen, testaantallen en tabeltellingen verouderen binnen dagen en gaan dan liegen — dat is precies wat een archief onbetrouwbaar maakt. Waar een getal echt iets toevoegt staat er een datum bij; verder verwijzen we naar het commando dat het actuele getal geeft.*

---

## 1. Wat er nu staat

### Eerst het misverstand uit de wereld

Je hebt gezegd: "alles laadt frontend, en dat voelt onveilig." Dat was ooit waar — de allereerste versie van de site was volledig statisch en alle cursusinhoud zat in de bestanden die de browser binnenhaalde. Maar dat is niet meer zo, en op precies de punten waar het om geld en content gaat is het inmiddels **aantoonbaar andersom**. Drie bewijzen uit de code zelf:

1. **De betaalde lesinhoud kán niet meer in de browser belanden.** Bovenin `src/content/index.ts` — het bestand waar alle cursussen doorheen gaan — staat de regel `import "server-only"`. Dat is geen afspraak of commentaar, maar een technische slagboom: zodra een stukje browser-code dit bestand probeert te gebruiken, weigert de site te bouwen. Die slagboom is geplaatst nadat het één keer wél misging (commit `7e79728`: de complete catalogus, 21 lessen en 88 quizantwoorden, stond toen als 197 kB publiek JavaScript-bestand online). Dat lek is structureel dichtgezet, niet met een pleister.

2. **Alle beslissingen waar iets aan te stelen valt, vallen op de server.** Of jij een les mag zien (`src/lib/entitlements.ts`), wat een cursus kost (`/api/checkout`), of een betaling echt is binnengekomen (`/api/mollie/webhook`) en hoeveel XP je verdient als je ingelogd bent (`src/lib/voortgang-server.ts`) — dat rekent allemaal de server uit, in Vercels datacenter. De browser stuurt alleen "dit heb ik gedaan", nooit "dit heb ik verdiend".

3. **Je sessie (het bewijs dat jij ingelogd bent) staat in de database, niet in de browser.** Dat betekent dat toegang direct intrekbaar is — na een terugbetaling of misbruik trek je één databaserij weg en de deur is dicht.

Wat er **wél** in de browser draait, en terecht: de quiz-interactie, de confetti, de vijftien interactieve lestools (stand 3 aug 2026 — dataloos, alleen formules en fictieve voorbeelden), en de voortgang van anonieme bezoekers (in localStorage, een opslagvakje in de browser zelf). Allemaal dingen waar niets aan te stelen valt.

Twee eerlijke kanttekeningen, zodat dit document geen reclamefolder wordt:

- **Het certificaat is nog wél volledig client-side.** Iedereen kan in een minuut een certificaat printen voor een cursus die hij nooit kocht — de pagina controleert alleen de lokale voortgang in de eigen browser. Dit staat genoteerd in `docs/openstaand.md` (hoofdstuk 5) en schuurt met de eerlijkheidsbelofte van het merk zodra certificaten waarde suggereren.
- **In de omgekeerde richting: er is nu eerder te wéinig statisch dan te veel.** De root-layout vraagt op élke pagina de sessie op, waardoor bijna alles per bezoek opnieuw gerenderd wordt. Alleen de vier routes met een eigen `generateStaticParams` worden nog vooraf gebouwd (blogartikelen, certificaten, de bedankpagina en de lessen van de gratis cursus); álle gewone marketingpagina's — inclusief de homepage en `/over-ons` — staan in de build als "server-rendered on demand". Geen veiligheidsprobleem (server-rendering ís de veilige kant), wel een prestatie- en kostendetail; zie hoofdstuk 3, scenario 2. De actuele verdeling lees je onderaan `npm run build`, in de legenda ●/○/ƒ.

### De kaart in gewone taal

De site is een **modulair monoliet**: één programma, in één repo, maar binnenin netjes opgedeeld in lagen met duidelijke grenzen. Zo ziet de stapel eruit:

```
BROWSER (bij de bezoeker thuis)
│  Interactie & weergave — niets waardevols te halen
│  • Quiz-interactie, confetti, rekentools (LessonRunner, QuizBlock, tools)
│  • Voortgang anonieme bezoekers (localStorage)
│  • Koopknop (stuurt alléén: "ik wil cursus X" — nooit een prijs)
╞══════════════════ de grens die alles beschermt ══════════════════
│
SERVER (Vercel, per verzoek)
│  ┌────────────────────────────────────────────────────────────┐
│  │ Pagina's (src/app) — bouwen HTML, nemen zelf geen besluiten│
│  │ API-routes (src/app/api) — de enige schrijfpaden:          │
│  │   /api/checkout · /api/mollie/webhook · /api/voortgang     │
│  │   /api/nieuwsbrief · /api/lesvragen (+ moderatie)          │
│  └──────────────────────┬─────────────────────────────────────┘
│  ┌──────────────────────┴─────────────────────────────────────┐
│  │ Spelregels (src/lib, server-only):                         │
│  │   entitlements.ts  — DE toegangspoort (enige plek!)        │
│  │   voortgang-server.ts — herrekent XP, gelooft de client niet│
│  │   mollie.ts / orderbevestiging.ts / mail.ts — betalen & mail│
│  └──────────────────────┬─────────────────────────────────────┘
│  ┌──────────────────────┴─────────────────────────────────────┐
│  │ Content (src/content, server-only):                        │
│  │   alle lesteksten + quizantwoorden — verlaten de server    │
│  │   alleen ná de toegangscheck, als gerenderde HTML          │
│  │   view.ts — de veilige uittreksels (titels, tellingen,     │
│  │   prijzen) die de browser wél mag zien                     │
│  └────────────────────────────────────────────────────────────┘
│
DATABASE (Neon Postgres, Frankfurt)
│  gebruikers & sessies (Auth.js) · payment_attempts (append-only
│  betaaladministratie) · entitlements (DÉ bron van waarheid voor
│  toegang) · order_counters · lesson_progress · user_stats ·
│  lesson_questions · newsletter_signups · purchases (oud, dood
│  gewicht tot de contract-migratie)
│  De actuele set staat in src/db/schema.ts, de SQL in drizzle/.
│
EXTERN:  Google (login) · Mollie (betalen) · Migadu SMTP (mail, nog uit)
```

En de drie kernstromen door die lagen heen:

```
STROOM 1 — Betaalde les bekijken
browser vraagt les op → server laadt les (blijft daar!)
  → heeftToegangTot()? ──nee──► LesVergrendeld (alleen titel + prijs)
                       ──ja───► les als HTML + quiz naar de browser

STROOM 2 — Aankoop
KoopKnop → POST /api/checkout {cursus, herroeping-akkoord}  [géén prijs!]
  → server: prijs uit eigen catalogus, NIEUWE rij 'pending' in
    payment_attempts (append-only — elke poging is een eigen rij)
  → bezoeker naar Mollie → betaalt → Mollie belt onze webhook: "tr_…"
  → webhook haalt status zélf op, checkt bedrag + valuta
  → klopt: één statement zet de poging op 'paid', deelt het
    ordernummer uit én verleent het entitlement 'actief'
  → pas dát entitlement opent de deur; daarna de orderbevestiging

STROOM 3 — Voortgang
quiz af → localStorage (werkt altijd, ook anoniem)
  → indien ingelogd: POST /api/voortgang {wat ik deed}  [géén XP-getal!]
  → server checkt eerst heeftToegangTot() (403 zonder recht),
    zoekt de les op, herrekent XP zelf, schrijft idempotent weg
  → stuurt de échte stand terug; browser neemt die over als waarheid
```

Het patroon dat drie keer terugkomt: **de browser meldt, de server beslist.** De koopknop stuurt geen prijs, de quiz stuurt geen XP, en de webhook gelooft van Mollie alleen het betalingsnummer. Alles wat waarde heeft wordt aan de serverkant opnieuw uitgerekend of opgezocht.

---

## 2. De modules

Je vroeg je af of dit één grote kluwen wordt — een "god-object" waar alles aan alles hangt. Het eerlijke antwoord: de belangrijkste grenzen bestaan al en worden nageleefd, een paar grenzen bestaan alleen als afspraak, en twee plekken schuren. Hieronder per module: wat hij is, en de ene regel die hem gezond houdt.

### Content — `src/content/`
Alle lesteksten, quizvragen én juiste antwoorden als getypte data (Course → Module → Lesson → QuizQuestion). Circa 8.600 regels cursusinhoud plus de blog (stand 3 aug 2026: 9 cursussen, 69 lessen, 280 quizvragen).
**De regel: content is server-only, zonder uitzondering.** De `import "server-only"` bovenin `index.ts` dwingt dit technisch af — de build breekt bij overtreding. Dit is de best bewaakte grens van het hele systeem, en dat is terecht: hier ging het al eens mis.

### View-modellen — `src/content/view.ts`
De veilige uittreksels van een cursus die de browser wél mag zien: titels, tellingen, prijzen — met opzet géén lesinhoud en géén antwoorden.
**De regel: geef een client component nooit een `Course`, altijd een view-model.** Alles wat je als "prop" aan browser-code geeft, belandt in de HTML die iedereen kan bekijken. Deze grens is een afspraak (vastgelegd in CLAUDE.md), geen slagboom — een nieuwe ontwikkelaar kan hem per ongeluk overtreden zonder dat iets breekt. Zie hoofdstuk 4 voor de goedkope vangrail.

### Toegang — `src/lib/entitlements.ts`
Een handvol regels die één vraag beantwoorden: mag deze bezoeker deze cursus zien? Gratis cursus → ja. Anders: is er een sessie én een rij in `entitlements` met status `actief`?

**Sinds 3 augustus 2026 (PR #22) is dat een ándere tabel dan hiervoor.** Het oude model had één `purchases`-rij die tegelijk betaalpoging, order én toegangsrecht was; die drie zijn nu uit elkaar getrokken (zie `docs/ontwerp-betaalmodel.md`). De praktische consequentie die je moet onthouden: **een betaalpoging met status `paid` geeft uit zichzelf géén toegang.** Het recht ontstaat pas als de webhook-verwerking het entitlement verleent — en dat gebeurt in hetzelfde statement, dus de twee kunnen niet uit elkaar lopen. `test/entitlements.test.ts` pint dit expliciet af door élke betaalpoging-status langs te lopen, `paid` incluis, en te bewijzen dat de deur dicht blijft.

**De regel: alléén entitlements beslist over toegang.** Geverifieerd met grep: vijf bestanden raadplegen hem — de lespagina, de cursuspagina, `/api/lesvragen`, `/api/voortgang` (zowel per les als bij het snoeien van een geïmporteerde snapshot) en de bedankpagina `/cursussen/[slug]/gekocht` — en nergens staat een tweede, afwijkende check. Hertel met `grep -rn "heeftToegangTot" src/`. Dit is de gezondste grens in de codebase — houd dat zo. Wie ooit een tweede check toevoegt "voor de zekerheid", creëert twee waarheden die uit elkaar gaan lopen. Ook de dedupe in de checkout ("je hebt deze cursus al") leest `entitlements`, maar staat er expliciet bij dat het géén tweede poort is.

### Betalingen — `/api/checkout`, `/api/mollie/webhook`, `src/lib/mollie.ts`
**De regels (uit CLAUDE.md, en aantoonbaar nageleefd): de prijs komt uit onze eigen catalogus, nooit uit het verzoek — en de webhook gelooft niets uit de payload behalve het id.** De webhook haalt de status zelf bij Mollie op, vergelijkt bedrag én valuta met de eigen administratie (afwijking → status `mismatch`, geen toegang) en kan veilig tien keer aangeroepen worden zonder dubbele gevolgen.

*Hoe die idempotentie er sinds PR #22 uitziet, en waarom dat geen transactie is:* de paid-verwerking is **één `db.execute()` met data-modifying CTE's** — de pending-rij vergrendelen, de jaarteller ophogen, de poging op `paid` zetten mét ordernummer, en het entitlement verlenen. Niet omdat dat mooier is, maar omdat **`db.transaction()` op de productiedriver gooit**: neon-http kent geen interactieve transacties. In de tests draait PGlite, en dáár werkt `db.transaction()` wél — dus een transactie schrijven is precies het soort fout die groen door CI komt en pas op productie omvalt. `db.batch()` helpt niet, want dat kan de `RETURNING` van het ene statement niet aan het volgende voeren, en het ordernummer hángt van de tellerstand af. Eén statement is in Postgres per definitie atomair, dus er is zelfs geen crashvenster tussen claim, teller en entitlement.

*Wat hier schuurt:* de prijs leeft in de catalogus als weergavetekst ("€49") en wordt in de checkout met een tekstbewerking teruggerekend naar centen. Eén creatieve komma en de checkout rekent verkeerd. Dit hoort andersom: het getal in centen is de bron, de tekst de afgeleide. Genoteerd in `docs/openstaand.md` hoofdstuk 6.

### Voortgang — `src/lib/progress.tsx` (browser) + `src/lib/voortgang-server.ts` (server)
De gamification: XP, levels, streaks, badges. De browserkant is het vangnet voor anonieme bezoekers; de serverkant is de waarheid voor ingelogde gebruikers en herrekent álles zelf — quizscores worden begrensd op het echte aantal vragen, de streak-dag wordt gevalideerd, en bij de eerste login gaat de XP-teller uit de browser bewust de prullenbak in (alleen de gedane lessen tellen).
**De regel: de client stuurt wat er gebeurde, de server bepaalt wat het waard is.**

*Sinds 3 augustus 2026 (PR #32) staat er ook een poort vóór:* `POST /api/voortgang` roept eerst `heeftToegangTot()` aan. Zonder recht een 403, bij een onbekende les een 400, en een geïmporteerde snapshot uit localStorage wordt gesnoeid tot gratis + gekochte cursussen. Daarvóór kon een uitgelogde-en-daarna-ingelogde bezoeker XP en badges verzamelen voor materiaal dat hij nooit mocht zien — geen contentlek (de tekst zat nog steeds achter de poort), wél een gat in de administratie. In dezelfde ronde zijn de schrijfacties atomair gemaakt: `verwerkLes()` en `importeerSnapshot()` zijn nu ook één statement met CTE's die een **delta** optellen in plaats van een absolute waarde te zetten, zodat de invariant uit de vorm van het statement volgt en niet uit de volgorde van losse queries.

*Wat hier schuurt — dit is je terechtste god-object-zorg:* deze module bestaat twee keer. Beide bestanden implementeren dezelfde XP-formule, quizbonus, streak- en badge-logica (de serverkant is met de CTE-omzetting fors gegroeid en inmiddels het langste van de twee). Dat is deels onvermijdelijk (anonieme bezoekers hebben geen server), maar niets dwingt de tweeling gelijk te blijven. Wijzig je de bonus op één plek, dan ziet een ingelogde gebruiker eerst het ene getal en na de synchronisatie een ander. Dit is de meest waarschijnlijke plek voor stille drift, en de belangrijkste kandidaat voor een test die beide kanten naast elkaar legt (hoofdstuk 4). Er is er inmiddels één per kant (`voortgang-regels.test.ts`, `voortgang-server.test.ts`, `voortgang.route.test.ts`), maar nog geen die ze náást elkaar legt.

*En wat er nog wél open staat:* de quizscore komt van de client. De server begrenst hem op het echte aantal vragen, maar wie het verzoek zelf opstelt kan de quizbonus met één fetch claimen. Genoteerd in `docs/openstaand.md` §6.

### Mail & orderbevestiging — `src/lib/mail.ts`, `orderbevestiging.ts`, `mailteksten.ts`
De wettelijk verplichte aankoopbevestiging, met doorlopend ordernummer (BC-2026-0001) en vastgelegd herroepingsbewijs (tijdstip, IP, voorwaardenversie). Het nummer wordt niet los verzonnen maar atomair uitgedeeld uit `order_counters`, binnen hetzelfde statement dat de betaling op `paid` zet — dus élke betaalde poging heeft een nummer, ook als de mail daarna mislukt.
**De regels: de mailfunctie gooit nooit een fout** (een haperende mailserver mag de betaalverwerking niet laten herhalen) **en er gaat maximaal één bevestiging per aankoop de deur uit.** Dat tweede doet een atomaire claim op `payment_attempts.confirmationClaimedAt`: alleen wie die `UPDATE … WHERE confirmationClaimedAt IS NULL` wint, mag versturen. Blijkt de mail aantoonbaar niet weg, dan wordt de claim teruggegeven zodat een volgende webhookaanroep het opnieuw probeert. `confirmationSentAt` is daarna alleen nog het bewijs dát er verstuurd is.

**Verzenden staat nog uit — en niet meer om de reden die hier ooit stond.** Resend is als keuze teruggedraaid; `src/lib/mail.ts` praat sinds 3 aug 2026 via nodemailer met Migadu SMTP. Het staat uit omdat `MAIL_SMTP_GEBRUIKER` en `MAIL_SMTP_WACHTWOORD` nog leeg zijn — een bewuste stille faal. Zie `docs/e-mail-versturen.md`.

### Grenzen die er (nog) niet zijn
Voor de volledigheid, want een eerlijke kaart toont ook de gaten: het **certificaat** heeft geen server-grens (iedereen kan er een printen), de **prijs-als-tekst** overschrijdt de grens tussen "weergave" en "rekenwaarde", en de **grote interactieve tools** (`SteunWeerstandTool.tsx`, 756 regels; `IntrinsiekeWaardeTool.tsx`, 431 regels) mengen berekening en weergave in één bestand zonder tests. Geen van drie is een god-object — het zijn afgebakende, benoembare tekortkomingen, en dat is precies het verschil met een kluwen.

Eén module die er wél is maar in geen enkel diagram past: **`src/lib/ratelimiet.ts`**, sinds 3 aug 2026. Een vast venster (10 per 15 minuten) vóór `POST /api/lesvragen` (op gebruikers-id) en `POST /api/nieuwsbrief` (op IP). Wees eerlijk over wat het is: de teller staat in het geheugen van één serverless-instantie, dus het is een drempel tegen iemand die één formulier zit te hameren, géén garantie tegen een verdeelde aanval. Een echte limiet vraagt gedeelde staat (database of Redis) en dat is een grotere beslissing dan deze twee routes rechtvaardigen — de databasekant heeft bovendien zijn eigen regels (maximaal drie openstaande vragen per gebruiker, één rij per e-mailadres).

Eén documentatie-oneffenheid tot slot, en die is inmiddels half opgelost: CLAUDE.md wekte de indruk dat er middleware bestaat die uitgelogde bezoekers netjes doorstuurt. Die middleware bestaat niet (geverifieerd: geen `middleware.ts`, ook niet onder `src/`); `/account` regelt zijn eigen redirect met `redirect()`. CLAUDE.md zegt dat inmiddels zelf met zoveel woorden. **AGENTS.md heeft de oude formulering nog** — dat bestand loopt sowieso achter op CLAUDE.md; gebruik het niet voor het geld- of voortgangspad.

---

## 3. Wat knelt wanneer

We hebben de architectuur onder druk gezet met zes groeiscenario's. Per scenario: wat er knelt, en — belangrijker — wanneer het écht een probleem wordt. De samenvatting vooraf: **vijf van de zes scenario's vragen nu niets**, en het zesde (samenwerking) vraagt een middag.

### Scenario 1: tien keer zoveel cursusinhoud (30 cursussen, 200+ lessen)
**Technisch knelt er vrijwel niets.** De inhoud zit uitsluitend in de serverbundel, dus de browser merkt er niets van; TypeScript compileert ook 25.000 regels data in seconden. **Wat wél knelt is het redactieproces**: elke tekstwijziging is nu een commit die direct naar productie deployt, en jij — de inhoudelijke man — kunt niet zelfstandig bij je eigen lesteksten. Bij 200 lessen wordt elke typefout een programmeursklus. Tweede aandachtspunt: de slugs (de namen in de URL, zoals `waardebeleggen`) zijn de identiteit van aankopen en voortgang in de database — wie een slug hernoemt, onterft stilletjes ieders toegang.
**Drempel:** voor de machine nooit; voor jou als redacteur nu al voelbaar. De tussenstap is geen CMS maar lesteksten als platte bestanden (MDX/JSON) achter hetzelfde server-only-laadpunt — dan kun jij tekst bewerken terwijl de hele beveiliging ongewijzigd blijft.

### Scenario 2: duizend betalende gebruikers
**De architectuur schaalt hier moeiteloos overheen.** De databaseverbinding werkt per los verzoek (neon-http), dus het klassieke serverless-probleem van uitgeputte verbindingen bestaat hier niet. Rekensom: duizend klanten produceren orde tienduizend queries per dag — verwaarloosbaar voor Postgres. **Wat wél knelt:** (a) de gratis Neon-laag heeft een plafond aan rekenuren, en omdat élke paginalading de database wekt (die `auth()` in de root-layout) raak je dát plafond het eerst; (b) drie randvoorwaarden uit `docs/openstaand.md` worden bij duizend klanten van slordigheid tot gevaar: laptop en productie delen één database-adres, er is geen monitoring (een stille webhookstoring = betalende klanten zonder toegang, en niemand die het ziet), en er staat nog een test-betaalsleutel in Vercel.
**Drempel:** rekenuren worden tastbaar ergens tussen honderden en duizend dagelijkse bezoekers; de oplossing is een betaald Neon-plan (~€20/mnd), geen verbouwing. Monitoring en het gedeelde database-adres worden een probleem bij de eerste storing of vergissing — en dat moment kies je niet zelf.

### Scenario 3: een mobiele app
**Er ontbreekt geen architectuur, er ontbreken twee concrete stukken**: een login-route voor apps (Auth.js werkt met browser-cookies) en een JSON-endpoint dat een les teruggeeft (lessen bestaan nu alleen als gerenderde HTML). Het goede nieuws: de moeilijke scheiding is al gemaakt — de lesinhoud ís al een portabele datastructuur en alle spelregels zijn pure servermodules zonder weergave-code erin. Zie hoofdstuk 5.
**Drempel:** pas op de dag dat de app er echt komt. Niets van de huidige opzet hoeft dan weggegooid.

### Scenario 4: een tweede ontwikkelaar of parallelle AI-sessie
**Dit scenario is op 3 aug 2026 werkelijkheid geworden — en de vangrail is diezelfde dag gebouwd.** Er draaiden meerdere parallelle AI-sessies tegelijk, en sindsdien geldt: `main` is beschermd (vereiste check "CI", ook voor admins, strict-mode), mergen kan alleen via een PR met groene CI (typecheck, lint, de volledige testsuite, productiebuild en de bundel-lekcontrole — zie `docs/ci.md`), en elke push draait lokaal eerst de tests via de pre-push-hook. Wil je weten wat de poort nú afdekt: `npm ci && npm run controle` reproduceert hem één op één. Wat er ná die vangrail nog open staat: beide werkers praten met dezelfde productiedatabase (zie hoofdstuk 6-punt in `docs/openstaand.md`), en de voortgangs-tweeling uit hoofdstuk 2 blijft de plek waar een tweede ontwikkelaar er één aanpast en de ander vergeet. Werkafspraak uit de praktijk: bouw in een eigen git-worktree, nooit in de gedeelde checkout (`docs/cursusfabriek.md`, valkuilen).

### Scenario 5: video- of beeldrijke lessen
Het contentschema kent nog geen media-veld, en video hoort principieel niet bij Vercel (de bandbreedtebundel is er met video in dagen doorheen). Belangrijker: betaalde video vraagt dezelfde discipline als betaalde tekst — een video-adres dat eenmaal in de HTML staat is deelbaar. De oplossing is een videoplatform met kort geldige, ondertekende afspeel-adressen, uitgegeven op precies de plek waar nu `heeftToegangTot()` staat. **De poort bestaat al; er hoeft alleen een tweede soort inhoud achter.**
**Drempel:** de dag dat de eerste videoles gepland wordt — dan is het één à twee dagen bouwen, geen verbouwing.

### Scenario 6: de AI-studiecoach
De architectuur heeft hier al een natuurlijke plek voor: een API-route die de lescontext server-side laadt (dat mág daar) en vóór elk antwoord de toegangspoort raadpleegt — exact het patroon van de lespagina. **Wat er wél vanaf dag één bij moet: kostenbeheersing.** Dit wordt het eerste onderdeel waar elke gebruikersactie jou direct geld kost, en er is nu nul infrastructuur voor verbruikslimieten. En de systeeminstructie mag nooit quizantwoorden bevatten van vragen die de gebruiker nog niet maakte — hetzelfde lek als destijds, maar dan via het model.
**Drempel:** niets blokkeert de coach, maar op de dag van livegang moeten drie dingen áf zijn (verbruikslimiet per gebruiker, maandplafond op modelkosten, toegangscheck in de route). Die volgorde is niet onderhandelbaar.

---

## 4. Wat we nu doen — en wat bewust niet

### Nu doen (goedkoop, uren geen weken)

*Stand 3 augustus 2026, eind van de dag: punt 2 en punt 3 zijn gebouwd (de CI-poort met branch protection en pre-push-hook, plus tests op de prijs-terugrekening, de bedrag/valuta-controle en beide voortgangskanten). De rest staat nog open; `docs/openstaand.md` is de leidende lijst.*

1. **Een Neon-databasebranch voor de laptop.** Neon kan gratis kopieën van de database maken; zet die in `.env.local`, en de laptop werkt nooit meer op productiedata. Een kwartier werk, lost het engste punt uit `docs/openstaand.md` op.
2. **Branch protection op `main` + één GitHub Action** die de typecheck en `next build` draait vóór elke merge. De build vangt nu al de gevaarlijkste fout (browser-code die content importeert) — dat wil je vóór de samenvoeging weten, niet erna in productie. Vercel geeft elke branch toch al gratis een preview-adres.
3. **Een handvol tests op precies de plekken waar geld of vertrouwen aan hangt:** de prijs-terugrekening in de checkout, de bedrag/valuta-controle in de webhook, en één test die de XP-berekening van de browser- en serverkant naast elkaar legt — die laatste dwingt de tweeling uit hoofdstuk 2 gelijk te blijven.
4. **Een gratis uptime-monitor plus webhookfouten die mailen.** De foutmelding in de webhook gaat nu naar een logboek dat niemand leest.
5. **Twee regels vastleggen in CLAUDE.md:** slugs zijn onveranderlijke identifiers (hernoemen = redirect, want aankopen en voortgang hangen eraan), en video wordt nooit vanaf Vercel geserveerd — afspeeladressen voor betaalde video komen uit dezelfde plek als de toegangscheck.
6. **`auth()` uit de root-layout halen** (laat de login-knop zelf de sessie ophalen), zodat marketingpagina's weer voorafgebouwd worden. Scheelt Neon-rekenuren op elke anonieme paginalading én maakt de site sneller.
7. **En vóór de eerste echte verkoop, buiten dit document maar te belangrijk om weg te laten:** de live-betaalsleutel in Vercel en het Vercel Pro-plan (het gratis plan verbiedt commercieel gebruik).

### Bewust níét doen

- **Geen microservices, geen aparte backend.** Aparte diensten lossen een probleem op dat jij niet hebt: tientallen ontwikkelaars die elkaar in de weg zitten. Jij hebt één product en (hooguit) twee werkers; opknippen zou elke wijziging over meerdere repo's en deployments uitsmeren en elke fout moeilijker vindbaar maken.
- **Geen CMS (contentbeheersysteem).** Het redactieprobleem is echt, maar de oplossing is de tussenstap uit scenario 1 (platte tekstbestanden achter hetzelfde beveiligde laadpunt), niet een extra systeem met eigen hosting, eigen loginlaag en een publieke API waar quizantwoorden doorheen kunnen lekken.
- **Geen Kubernetes, geen eigen servers, geen Docker-orkestratie.** Vercel en Neon doen precies dit werk al, inclusief schalen, en de druktest laat zien dat duizend klanten hier ruim in passen.
- **Geen API-laag "vast voor de app".** Bouwen voor een app die niet bestaat is verspilling; hoofdstuk 5 beschrijft de drie gewoontes die de optie gratis openhouden.
- **Geen tweede toegangscheck, nergens, nooit.** Eén poort die klopt is veiliger dan twee poorten die uit elkaar groeien.

**Waarom een modulair monoliet in één repo hier het juiste antwoord is:** alles wat je aan veiligheid nodig hebt zit in grenzen bínnen de code (server-only content, één toegangspoort, view-modellen), en die grenzen zijn goedkoper te bewaken dan netwerkgrenzen tussen losse systemen. De druktest bevestigt het: geen van de zes scenario's — ook niet tien keer de content of duizend klanten — vraagt om opknippen. Wat de scenario's wél vragen is discipline op de bestaande grenzen, en dat is precies wat de punten hierboven regelen.

---

## 5. De app van later

De wens voor een mobiele app verandert vandaag bijna niets — mits drie gewoontes standhouden:

1. **Spelregels horen in `src/lib` en `src/content`, nooit in pagina-bestanden.** Een pagina is weergave; een app kan geen webpagina hergebruiken, maar wél elke servermodule die erachter zit. Dit gaat nu al goed — vasthouden.
2. **Lesinhoud blijft een datastructuur, nooit losse opmaak in een pagina.** Het contentschema in `types.ts` (secties, alinea's, opsommingen, quizvragen) is nu het interne contract en kan later één-op-één het app-contract worden: een toekomstig `GET /api/lessen/[slug]` dat de bestaande toegangspoort hergebruikt en de les als JSON teruggeeft is een middag werk, geen herbouw.
3. **De voortgangs-API is al app-klaar in de geest:** de client stuurt wát er gebeurde, de server rekent. Er mist alleen een GET-variant (de leesfunctie bestaat al server-side; de route is ~10 regels) — die kan bij gelegenheid, hoeft niet nu.

Twee dingen die wél nieuw gebouwd moeten worden op de dag zelf: een login-route voor apps (de huidige sessies werken via browser-cookies; een native app heeft een token-mechanisme nodig, en Auth.js heeft daar geen kant-en-klaar verhaal voor) — en één beslissing die geen code is maar zwaarder weegt dan alle code samen: digitale content verkopen in een iOS-app betekent Apple's betaalregels, met commissie op elke verkoop. Dat gesprek hoort vóór de eerste regel app-code.

**De kern:** de moeilijke scheiding — regels los van weergave, content als data, één toegangspoort — is al gemaakt. De app van later is een extra voordeur op een huis dat er al op gebouwd is.

---

*Bronnen: de code zelf (paden hierboven), `docs/openstaand.md` (openstaande punten, eerlijk genoteerd), `docs/betalingen-mollie.md` (betaalketen en risico's), `docs/ontwerp-betaalmodel.md` (de onderbouwing van de splitsing, uitgevoerd op 3 aug 2026), `docs/ci.md` (de poort), `docs/plattegrond.md` (paginakaart).*

*Twee bekende afwijkingen in `docs/plattegrond.md`, zodat je er niet op struikelt: hij rapporteert "statisch" voor pagina's die de build per verzoek rendert (zolang `auth()` in de root-layout staat), en de kolom bij de API-routes leidt "vereist sessie" af uit de enkele aanwezigheid van een `auth(`-aanroep. Daardoor staat `/api/lesvragen/moderatie` er als "publiek" terwijl die route iedereen zonder beheerdersrecht met een 404 wegstuurt, en `/api/nieuwsbrief` als "vereist sessie" terwijl die route bewust anoniem is (de sessie dient er alleen om een herinschrijving te mogen honoreren). Het document mag niet met de hand bijgewerkt worden — het wordt gegenereerd — dus de echte fix zit in `scripts/plattegrond.mjs`. Genoteerd, nog niet gedaan.*
