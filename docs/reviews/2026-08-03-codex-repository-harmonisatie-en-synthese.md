# Repositorybrede harmonisatie- en synthesereview — OpenAI Codex

**Reviewer:** OpenAI Codex, hoofdagent `/root`  
**Datum:** 3 augustus 2026  
**Type:** volledige second pass over repository, documentatie, Git en actuele CI; alleen dit reviewdocument is toegevoegd  
**Canonieke actielijst:** [`docs/openstaand.md`](../openstaand.md)  
**Vorige review:** [2 augustus — website- en architectuurreview](./2026-08-02-codex-website-en-architectuurreview.md)

## Overdracht aan Claude

Dit document is voor Claude de **onderbouwde overdracht**, niet een tweede backlog en
niet een opdracht om alles blind uit te voeren. Verifieer bij hervatting eerst opnieuw
`git status`, `git worktree list`, `gh pr list` en de actuele `main`, omdat er tijdens
deze review meerdere andere sessies committen en mergen. Neem daarna alleen de
bevestigde, nog open punten op in `docs/openstaand.md`, met één eigenaar en één
acceptatiecheck per punt.

Codex heeft bewust **geen applicatiecode, bestaande documentatie, Git-branch, commit,
dashboardinstelling of productiegegeven gewijzigd**. Alleen dit bestand is nieuw.

## Korte conclusie

De fundering is aantoonbaar sterker dan gisteren: er is een strikte CI-poort, een
pre-pushcontrole, een schonere PR-werkwijze, servervoortgang, beheerinzage en een veel
grotere catalogus. De actuele `main` is groen in GitHub CI én Vercel. De belangrijkste
gaten zitten nu niet in de vormgeving, maar in **samenhang en toestand**:

1. `purchases` is tegelijk betaalpoging, orderhistorie en actuele toegang. Een retry of
   race kan daardoor een nog betaalbare Mollie-betaling onvindbaar maken, een net
   betaalde aankoop terug op `pending` zetten of bij een heraankoop oud mail- en
   orderbewijs hergebruiken.
2. Servervoortgang bestaat, maar schrijven en eerste import zijn niet transactioneel.
   Gelijktijdige requests kunnen XP verliezen of dubbeltellen, gedeeltelijke toestand
   achterlaten en betaalde voortgang zonder aankoop importeren.
3. De publieke en juridische teksten beschrijven op meerdere plaatsen nog de oude site:
   geen accounts, browser-only voortgang, twee losse toestemmingsvakjes, uitgestelde
   toegang en functies voor herroeping/terugbetaling die niet bestaan.
4. De repositorydocumentatie loopt sterk achter op de groei naar **9 actieve cursussen,
   69 lessen, 280 quizvragen, 622 minuten en 17 tooltoewijzingen**. Daardoor vertellen
   `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/architectuur.md`, `docs/ci.md`,
   `docs/plattegrond.md` en `docs/openstaand.md` niet meer hetzelfde verhaal.

Er is geen reden voor een rewrite of een tweede autorisatielaag. De juiste beweging is:
eerst de toestandsmodellen en publieke waarheid rechtzetten, daarna documentatie uit
dezelfde bronnen laten genereren of controleren.

## Momentopname en bewijs

Git veranderde tijdens de audit. Daarom zijn de onderzochte bomen expliciet vastgelegd:

- De hoofdwerkmap stond bij afronding op `9ba15c2` (`afronding-ci-docs`), een inmiddels
  gemergede PR-branch, met alleen `.claude/settings.local.json` als untracked bestand.
- GitHub `main` stond bij de laatste controle op
  `e6a239d9e01671641f0070242d5f31c5ca02aac9` (PR #11, Indexbeleggen).
- De nieuwste `main`-bestandsboom heeft tree-hash
  `113912c159e57aa33c423fb335d796812d26dca8`. Die is lokaal exact gelijk aan de
  geïnspecteerde worktree-commit `15264e9`; de review van de nieuwste cursus en tools is
  dus niet op een oudere boom gedaan.
- Op 3 augustus rond 11:05 CEST waren de CI-run van `main` en de uiteindelijke
  Vercel-deployment groen. De Vercel-preview van PR #11 stond eerder rood, maar de
  productie-deployment van de mergecommit slaagde.

Lokale kwaliteitsstraat op de toenmalige hoofdwerkmap, met productie-DB, Mollie en
uitgaande mail in het proces uitgeschakeld:

- TypeScript: geslaagd.
- ESLint: 0 fouten, 8 waarschuwingen.
- Vitest: 12 bestanden, 133 tests geslaagd.
- Next-productiebuild: geslaagd.
- Bundelcontrole: 55 chunks, 213 geëxtraheerde quizvragen, geen `correctIndex:` of
  quizvraaglek gevonden.

De CI op de nieuwste `main` rapporteerde daarna:

- 12 testbestanden, 138 tests geslaagd;
- 8 lintwaarschuwingen;
- 52 chunks en 277 geëxtraheerde quizvragen zonder lek.

Het verschil tussen 280 inhoudelijke quizvragen en 277 bundel-naalden komt door de
minimumlengte in de extractor; documenteer dat als testdetail en niet als catalogusaantal.

`npm audit` op de actuele lockfile meldde **3 hoge en 5 middelhoge** kwetsbaarheden, via
de geïnstalleerde Next/PostCSS/Sharp-lijn en Drizzle Kit/esbuild. De automatische
fixvoorstellen zijn ongeschikte major downgrades. Er is niets automatisch gefixt.

## Wat goed staat en behouden moet blijven

- `src/content/index.ts` is `server-only`; de CI controleert aanvullend de publieke
  chunks op quizinhoud. Dat is de juiste dubbele bescherming tegen cursuslekken.
- `src/lib/entitlements.ts` blijft de enige eigenaar van toegang. Voeg geen tweede
  aankoopcheck toe in pagina's of clientcode.
- Checkout bepaalt de prijs uit de eigen catalogus. De webhook vertrouwt uit de payload
  alleen het payment-id en vraagt status en bedrag bij Mollie op.
- De webhook bewaart `paidAt` bij herhaalde `paid`-webhooks stabiel.
- Database-sessies, de scheiding tussen Edge-authconfig en databasecode, exact gepinde
  Auth/Drizzle-versies en de placeholder voor builds zonder DB zijn bewuste, goede
  keuzes.
- Geen verzonnen testimonials, geen rendementsbelofte en duidelijke grenzen rond
  beleggingsadvies blijven harde productvereisten.
- CI, strict branch protection en de pre-pushhook zijn nu echte vangrails. Houd tests
  klein genoeg dat deze poort bruikbaar blijft.

## Prioriteit P0 — vóór echt geld of actieve verkoopbevordering

### 1. Splits betaalpoging, orderhistorie en toegang

**Wat ontbreekt**

`src/app/api/checkout/route.ts:59-111` leest eerst één rij per gebruiker/cursus, maakt
vervolgens buiten de database een Mollie-betaling en overschrijft daarna diezelfde rij
met het nieuwe payment-id en `pending`. `src/db/schema.ts:100-145` dwingt één rij per
gebruiker/cursus af. Daarmee zijn drie verschillende begrippen samengevoegd:

- een concrete betaalpoging met één Mollie-id;
- een administratieve order en het bijbehorende bewijs;
- het actuele recht om cursusinhoud te openen.

**Waarom dit kritiek is**

- Twee gelijktijdige checkouts maken twee betaalbare Mollie-links; alleen de laatst
  opgeslagen id blijft vindbaar. Betaalt de klant de eerste link, dan antwoordt de
  webhook `200 OK` op een onbekende betaling en krijgt de klant ondanks echt geld geen
  toegang.
- Tussen de eerste `select` en de latere upsert kan een webhook de bestaande rij op
  `paid` zetten. De checkout zet diezelfde rij daarna terug op `pending` en trekt dus
  toegang in.
- Falen van de database ná `payments.create()` laat een betaalbare, maar lokaal
  onbekende betaling achter.
- Een retry overschrijft ook een `mismatch`, oude `pending` of andere auditwaardige
  poging, waardoor reconciliatie moeilijker wordt.
- Een heraankoop na toekomstige refund hergebruikt `confirmationSentAt`, `orderNumber`
  en mogelijk andere oude toestand, omdat de upsert die velden niet wist. Dan kan een
  nieuwe betaling zonder nieuwe bevestiging of nieuw orderbewijs eindigen.
- `createdAt` verandert niet bij een retry; beheer kan daardoor een verse poging direct
  als uren of dagen oud tonen.

**Te harmoniseren richting**

Maak betaalpogingen/orders onveranderlijk genoeg om iedere Mollie-id terug te vinden en
beheer toegang als afgeleide of aparte toestand. Een mogelijke grens is:

- één entitlement/aankooprecht per gebruiker en cursus;
- één of meer order- of payment-attempt-rijen, elk met eigen Mollie-id, bedrag,
  toestemming, status, ordernummer en mailtoestand;
- expliciete, voorwaardelijke statusovergangen; nooit een `paid` of nog betaalbare
  poging stil overschrijven.

De precieze tabellen zijn een ontwerpbesluit. Houd `heeftToegangTot()` wel de enige
publieke toegangspoort.

**Checks vóór uitvoering**

1. Lees op productie uitsluitend tellend/geaggregeerd welke statussen en nulvelden nu
   bestaan; leg een herstelbare migratie en rollback vast.
2. Maak eerst tests met gecontroleerde vertragingen voor twee gelijktijdige checkouts,
   checkout versus webhook en twee gelijktijdige webhooks.
3. Test expliciet: betalen via de oudste link na een retry, databasefout na Mollie-create,
   mismatch gevolgd door retry, refund gevolgd door heraankoop en dubbele browser-tabs.
4. Bewijs als invarianten: elke gemaakte Mollie-id blijft reconcilieerbaar; maximaal één
   actief recht per gebruiker/cursus; betaald geld kan niet zonder zichtbare order
   eindigen; elke nieuwe verkoop krijgt nieuw order- en mailbewijs.
5. Test migratie op een Neon Development/Preview-branch, niet op de productiedatabase
   vanaf de laptop.

### 2. Maak één publieke en juridische waarheid

**Wat niet meer klopt**

- `src/app/herroepingsrecht/page.tsx` zegt dat de checkout twee aparte vakjes toont en
  dat kopen zonder afstandsverklaring mogelijk is met toegang na veertien dagen. De
  echte `src/components/KoopKnop.tsx` heeft één gecombineerd verplicht vakje en de API
  weigert checkout zonder toestemming.
- Die pagina zegt ook dat betaalde toegang nog niet actief is en verwijst naar een
  toekomstige herroepingsknop. Toegang is live; zo'n knop en refundketen bestaan niet.
- `src/app/privacy/page.tsx` zegt op meerdere plaatsen dat accounts/betalingen toekomst
  zijn en voortgang alleen lokaal blijft. Ingelogde voortgang wordt inmiddels in Neon
  geschreven.
- `src/app/veelgestelde-vragen/page.tsx` en `src/lib/mailteksten.ts` herhalen de
  browser-only-claim.
- De voorwaarden beloven een factuur; de factuurfunctie bestaat niet. Contact belooft
  antwoord binnen twee werkdagen terwijl de mailbox volgens `docs/openstaand.md` niet
  operationeel wordt bewaakt.
- De privacytekst beschrijft `lesson_questions` niet volledig: vraagsnapshot van de
  voornaam, moderatiestatus, eventuele openbare publicatie, bewaartermijn en
  verwijdering. Ook de nieuwsbriefstatus, consent-IP, bevestiging, uitschrijving en
  herinschrijving zijn nog geen af productproces.

**Waarom dit kritiek is**

Dit zijn geen cosmetische verschillen. Ze bepalen toestemming, bedenktijd, AVG-uitleg,
klantverwachting en het bewijs dat bij een geschil nodig is. `noindex` maakt een publiek
bereikbare juridische pagina niet vrijblijvend.

**Checks vóór uitvoering**

1. Maak een claimmatrix met per belofte: pagina/mail, echte UI/API/databasehandeling,
   operationele eigenaar en bewijs.
2. Laat een jurist de definitieve herroepingsflow en het ene versus twee vakjes
   beoordelen; laat een boekhouder/fiscalist factuur- en nummeringstekst bevestigen.
3. Doorloop in een Preview één volledige aankoop met screenshots en opgeslagen
   toestemmingsvelden; test ook weigeren, verlopen betaling, herroeping en refund.
4. Maak een feitelijke datainventaris voor privacy: accounts, providers, sessies,
   aankopen, voortgang, vragen, nieuwsbrief, logging en bewaartermijnen.
5. Zet alleen beloften live die operationeel waargemaakt en gemonitord worden.

### 3. Houd de bestaande commerciële stoplichten hard

De volgende punten staan al terecht in `docs/openstaand.md` en moeten niet als nieuwe
bevindingen worden gedupliceerd:

- Mollie gebruikt nog een `test_`-key;
- Vercel Pro is nodig vóór commerciële inzet;
- vestigingsadres, juridische review, werkende uitgaande mail met juiste SPF/DKIM/DMARC,
  facturatie/btw en een refund/intrekkingspad zijn niet afgerond;
- monitoring en een eigenaar voor storingen, mails, betalingen en chargebacks ontbreken.

Controleer deze status in de echte dashboards en met een end-to-endproef. Een vinkje in
een document is geen vervanging voor bewijs. Zet de live-key pas om als alle poorten
tegelijk groen zijn.

### 4. Triageer dependencies; gebruik geen automatische auditfix

De lockfile heeft op 3 augustus 8 gemelde kwetsbaarheden. Een auditmelding bewijst niet
automatisch dat de productieroute exploiteerbaar is, maar moet wel eigenaar, context en
deadline krijgen.

**Checks vóór uitvoering**

- splits `npm audit --omit=dev` en de volledige ontwikkelaudit;
- lees de primaire advisories en bepaal of de geraakte PostCSS/Sharp/esbuild-paden in
  productie of alleen tijdens build/dev bereikbaar zijn;
- controleer een veilige Next-patch binnen de exact gepinde Auth.js/Drizzle-combinatie;
- voer upgrade, migraties, auth, checkout, afbeeldingen, build en Vercel Preview op een
  aparte branch uit;
- laat CI auditresultaten rapporteren met een bewuste drempel en uitzonderingslog.

Voer **geen** `npm audit fix` of brede frameworkupgrade uit op basis van het voorgestelde
major-downgradeadvies.

### 5. Voeg een inhoudelijke releasepoort toe voor de snel gegroeide catalogus

De nieuwste `main` bevat negen actieve cursussen: één gratis en acht betaalde. De
betaalde catalogus is niet meer circa 100 minuten, maar circa **541 minuten**. Alleen op
3 augustus landden onder meer Beleggingspsychologie en Indexbeleggen met drie grote
nieuwe interactieve tools.

De generieke contenttests bewijzen schema en bundelgrens, niet de financiële of
psychologische juistheid van 280 vragen en tientallen actuele claims.

**Checks vóór verdere marketing**

- redactionele proeflezing per cursus door een tweede mens;
- voor actuele cijfers (“tegenwoordig”, percentages, herstelduur, fondskosten) een
  primaire bron en peildatum vastleggen; tijdloze uitleg scheiden van veranderlijke
  marktfeiten;
- rekenvoorbeelden en tools testen op grenswaarden, afronding, negatieve/gelijke
  rendementen, kleine schermen, toetsenbord, screenreader en reduced motion;
- vastleggen wat een educatieve zelftest wel en niet meet. De biastest is geen
  gevalideerd psychometrisch instrument en mag niet als risicoprofiel of advies worden
  gelezen;
- bij slugs die database-identiteit zijn: unieke course/module/lesson-slugs en orders
  testen en voor elke wijziging een data-/redirectmigratie eisen.

## Prioriteit P1 — betrouwbaarheid en één bron van waarheid

### 6. Maak voortgang transactioneel en autoriseer beide schrijfpaden

`src/lib/voortgang-server.ts:117-205` doet eerst een `select`, daarna een lesson-insert
en daarna een aparte stats-upsert. `importeerSnapshot()` op regels 241-329 schrijft
lessen, telt vervolgens XP en overschrijft stats. Er is geen transactie of seriële claim.

Mogelijke gevolgen:

- twee gelijktijdige afrondingen van dezelfde les botsen op de unieke index en één
  request kan 500 geven;
- een fout tussen lesson-insert en stats-update laat gedeeltelijke toestand achter;
- snapshotimport en lesafronding kunnen elkaars XP overschrijven of dubbel optellen;
- snapshotimport accepteert betaalde cursus-slugs zonder entitlement;
- server en client hanteren niet overal dezelfde streakregel;
- een onbekende les levert stil de bestaande toestand terug in plaats van een
  integratiefout;
- `resetAll()` en latere `setName()` zijn alleen lokaal, zodat gewiste voortgang of een
  gewijzigde naam bij de volgende sync kan terugkomen;
- de provider wordt bruikbaar voordat de eerste async sync volledig klaar is en
  fire-and-forget-responses kunnen uit volgorde terugkomen.

**Te harmoniseren richting**

- Eén servercommando per afgeronde les, transactioneel en idempotent.
- Zowel normale lesafronding als snapshotimport controleren entitlement.
- Maak `user_stats.xp` aantoonbaar afgeleid van lesson rows, of definieer één atomair
  mutatiepad; niet beide zonder invariant.
- Splits “huidige staat ophalen” van “eenmalige legacy-import” en markeer een voltooide
  migratie.
- Definieer reset, naam, streak en out-of-ordergedrag één keer voor client en server.

**Checks vóór uitvoering**

Gebruik tests met barriers/parallelle promises voor dezelfde les, verschillende lessen
en snapshot versus les. Controleer steeds:

`user_stats.xp = SUM(lesson_progress.xp_awarded)`

Test daarnaast betaalde import zonder aankoop, herhaalde import, corrupte localStorage,
offline/online overgang, server-reset en antwoorden die in omgekeerde volgorde arriveren.

### 7. Maak ordermail en ordernummer een herstelbaar proces

Dit staat deels al in `docs/openstaand.md`, maar hoort samen met het betaalmodel te
worden opgelost:

- `src/lib/orderbevestiging.ts` leest `confirmationSentAt`, verstuurt en markeert pas
  daarna. Twee workers kunnen beide mailen; een geslaagde mail gevolgd door DB-fout
  wordt later opnieuw verstuurd.
- Mislukte mail heeft geen duurzame foutstatus, pogingsteller, provider-id of
  herstelscherm.
- Ordernummering telt rijen en probeert het volgende nummer. Dat is concurrencygevoelig
  en gebruikt het jaar van uitvoering/`createdAt`, wat bij een pending betaling over een
  jaargrens niet noodzakelijk gelijk is aan de betaaldatum.

Kies een claim/outbox/ledgerpatroon met atomische toewijzing, retrybeleid en zichtbare
status. Test dubbele webhooks, workercrash vóór en na SMTP-acceptatie, jaarwisseling,
handmatige retry en herstel na providerstoring. Laat de fiscale eis rond nummering en
eventuele gaten door een deskundige bevestigen; leg die niet alleen in een codecomment
vast.

### 8. Maak certificaten servergestuurd of noem ze expliciet niet-verifieerbaar

De huidige certificaatpagina vertrouwt clientvoortgang, een lokaal wijzigbare naam en de
datum van het moment waarop iemand de pagina opent. Daardoor kan een bezoeker een
certificaat namaken en verandert de “uitgiftedatum” bij opnieuw printen.

Beslis eerst of dit een deelnamebewijs of een toetscertificaat is. Voor een
verifieerbaar bewijs zijn minimaal entitlement, actuele afrondingsset, een onveranderlijk
`issuedAt`, opgeslagen naam/versie en een niet-radenbare verificatie-id nodig. Test geen
aankoop, onvoltooide cursus, refund, later toegevoegde les, naamscorrectie en herdruk.

### 9. Isoleer auth uit publieke rendering, maar ontwerp Q&A-caching eerst

De root-layout en `AuthKnop` vragen beide een sessie op; cursus- en lesroutes doen daar
extra auth/entitlement-reads bovenop. Daardoor zijn vrijwel alle marketingpagina's
dynamisch en wordt Neon onnodig gewekt.

Consolideer sessiegebruik en isoleer persoonlijke UI, maar zet niet simpelweg caching
aan. Gratis lessen hebben statische params terwijl zichtbare lesvragen uit de database
komen. Zodra auth uit de renderboom verdwijnt, kan Q&A zonder expliciet ontwerp tot de
volgende deploy bevriezen. Kies eerst een dynamische Q&A-island of gecontroleerde
revalidatie na moderatie en meet daarna cacheheaders, databasequeries, TTFB en
zichtbaarheid van een nieuw antwoord.

### 10. Laat alle prijsrepresentaties uit één numerieke bron komen

Checkout rekent centen terug uit `course.price`-weergavetekst. Schema.org gebruikt in
`src/app/cursussen/[slug]/page.tsx:64-69` bij een ontbrekende prijs een fallback van
`€14,99`, terwijl checkout voor een losse cursus op €49 uitkomt. Een toekomstige cursus
kan zo een andere prijs adverteren dan afrekenen.

Bewaar centen als bron, formatteer daaruit zichtbare tekst én structured data en test
catalogus, cursuskaart, detailpagina, checkout, Molliebedrag, ordermail en schema.org
tegen dezelfde fixture. Houd College+ en losse cursus als verschillende producten.

### 11. Rond vraag- en nieuwsbrieflifecycle af vóór schaal

- `lesson_questions` belooft in de schemacomment “Jason antwoordt wekelijks”, terwijl
  de echte producttekst bewust geen termijn belooft. Verwijder de interne fictieve SLA.
- De limiet van drie wachtende vragen is `count` gevolgd door `insert` en dus
  concurrencygevoelig. Moderatie retourneert `ok: true` als nul rijen zijn aangepast.
- Er zijn geen gerichte endpoint-/autorisatietests voor vragen en moderatie.
- Nieuwsbriefinschrijving gebruikt `onConflictDoNothing()`. Een uitgeschreven adres kan
  zo niet herinschrijven en een oude onbevestigde inschrijving krijgt geen nieuwe
  toestemming of toekomstige bevestigingsflow.
- Beide publieke schrijfroutes missen een expliciet misbruik-/ratelimitbeleid.

Ontwerp token, vervaldatum, resend, confirm, unsubscribe, resubscribe, auditbewijs en
retentie vóór de eerste nieuwsbriefmail. Test beheerder/niet-beheerder, twee gelijktijdige
vragen, al behandelde id, verwijderde account, dubbel aanmelden en herinschrijven.

### 12. Test de drie nieuwste tools als productlogica

De nieuwe tools hebben veel clientlogica maar geen eigen unit- of browsertests.

Concrete fout om eerst vast te leggen: `PaniekSimulatorTool.tsx:191-200` gebruikt
`acties.find()` per maand. Een gebruiker kan in dezelfde gepauzeerde maand verkopen en
weer instappen; de tweede actie staat in de UI-lijst, maar de berekening verwerkt alleen
de eerste. De getoonde beleggingsstatus en het berekende vermogen kunnen dan
uiteenlopen.

Voor `KostenVreterTool` moeten de samengestelde groei, timing van maandinleg,
kostenverschil en uitleg bij grenswaarden met onafhankelijke rekenfixtures worden
vergeleken. Voor `BiasTestTool` moeten opslagversie, corrupte data, gelijke scores,
datum/tijdzone en de niet-gevalideerde aard van de score worden getest.

### 13. Maak lintwaarschuwingen weer betekenisvol

De actuele acht waarschuwingen bevatten opruimwerk, maar ook React-hookwaarschuwingen in
`GedektSchrijvenTool` en `OptiePayoffTool`. Onderzoek die eerst op stale berekeningen;
negeer ze niet als cosmetisch. Ruim daarna de rest op en laat CI óf op nul waarschuwingen
falen, óf gebruik een expliciete tijdelijke baseline met eigenaar en einddatum.

## Documentatie harmoniseren

Voer dit als één gecontroleerde documentatiesprint uit **ná** synchronisatie met de
actuele `main`. Gebruik waar mogelijk berekende feiten in plaats van handmatige aantallen.

| Bestand | Wat aanpassen | Waarom / vereiste check |
|---|---|---|
| `docs/openstaand.md` | Verwijder afgehandelde `[x]`-historie volgens de eigen onderhoudsregel; voeg alleen bevestigde open punten uit deze review toe; vervang circa 100 minuten/twee tools, verlopen datums en gemergede branchverwijzingen. | Dit blijft de enige backlog. Controleer elk punt tegen code, GitHub én dashboard; verplaats historie naar review/changelog. |
| `AGENTS.md` | Servervoortgang is live; tabellen zijn niet meer ongebruikt. Er is geen middlewarebestand. OG-afbeelding en Search Console zijn gedaan. Catalogus/roadmap zijn veranderd. | Dit bestand stuurt toekomstige agents; een onjuiste architectuurregel veroorzaakt nieuwe fouten. Vergelijk regel voor regel met code. |
| `CLAUDE.md` | Synchroniseer dezelfde actuele feiten, nieuwe cursussen, SEO-status en mailkeuze/-fase met `AGENTS.md`. | Twee agentinstructies mogen geen verschillende werkelijkheid opleggen. Houd tool-specifieke werkafspraken apart, productfeiten gelijk. |
| `README.md` | Vervang 3 cursussen/21 lessen/88 vragen/local-only/één calculator door een korte actuele product- en stackbeschrijving. | README is nu een historische snapshot vermomd als introductie. Laat aantallen genereren of vermeld geen vluchtige totalen. |
| `docs/architectuur.md` | Werk routes, API's, contentomvang, tools, servervoortgang, CI, mailstatus, auth-calls en beheer bij. | Het document noemt onder meer circa 2.700 contentregels, vier API-routes, drie tools en geen CI. Verifieer met `rg --files`, route-inventaris en buildoutput. |
| `docs/ci.md` | Vervang vaste 121 tests en 85/88 bundelnaalden. Actuele `main`: 138 tests, 277 van 280 lange quizvragen, 8 waarschuwingen. Leg uit welk getal productfeit en welk getal testimplementatie is. | Hardcoded aantallen waren binnen uren verouderd. Genereer een samenvatting of koppel aantallen aan commit+datum. |
| `docs/plattegrond.md` + `scripts/plattegrond.mjs` | Verbeter eerst de detectie: nieuwsbrief heeft optionele auth, moderatie en `/beheer/vragen` zijn beheerdergebonden, layout-auth maakt routes dynamisch. Regenerate daarna. | De huidige regexkaart presenteert security- en rendersemantiek onjuist. Test generatoruitvoer tegen een handmatige routefixture. |
| `docs/wat-de-winkel-mist.md`, `docs/productonderzoek.md`, oude implementatiegidsen | Zet bovenaan een duidelijke datum/status: historisch onderzoek, deels ingehaald, actuele acties in `openstaand.md`. Herschrijf bewijs niet stil. | Behoud besluitgeschiedenis zonder oude huidige-tijdclaims als waarheid te laten lezen. |
| `docs/reviews/README.md` | Voeg deze review toe wanneer Claude de overdracht verwerkt. | Vindbaarheid, zonder de review tot backlog te maken. |

Maak daarnaast één kleine repositorycheck voor invarianten die niet mogen verouderen:

- unieke course-slugs en course-orders;
- unieke module- en lesson-slugs binnen hun juiste scope;
- iedere actieve betaalde cursus heeft een numerieke catalogusprijs;
- iedere `LessonTool` heeft exact één renderer en geldige accent/iconmapping;
- gegenereerde catalogusgetallen en routekaart zijn schoon of bewust bijgewerkt;
- geen `.nl`/`.com`, oud mailproviderwoord of browser-only-voortgangsclaim buiten een
  expliciet historische context.

## Git harmoniseren en opruimen

### Feiten bij afronding

- PR's #1 tot en met #11 waren gemerged; er was geen open PR.
- De hoofdwerkmap stond nog op de gemergede branch `afronding-ci-docs`, niet op lokale
  `main`. De lokale `main` liep achter op GitHub `main`.
- Er waren twee extra worktrees: `ci-fundament` op `ci-alarm-rode-main` en
  `opties-curriculum` op `indexbeleggen`.
- Meerdere lokale en remote featurebranches bleven bestaan na squash/merge.
- `.claude/settings.local.json` was untracked. De inhoud is machinegebonden
  permissieconfiguratie en hoort alleen na een bewuste keuze in Git; waarschijnlijk is
  negeren verstandiger dan committen.
- De tree van de `indexbeleggen`-worktree was exact gelijk aan de nieuwste gemergede
  `main`, maar dat zegt niets over andere branches met unieke commits.

### Veilige opruimvolgorde

1. Stop of identificeer eerst alle actieve Claude/Codex-processen; verwijder nooit een
   worktree waar nog een sessie in werkt.
2. Bewaar of verplaats dit reviewbestand naar een nieuwe branch vanaf actuele `main`
   voordat de huidige gemergede branch wordt opgeruimd.
3. Controleer in **elke** worktree `git status --short`, untracked bestanden en lokale
   wijzigingen.
4. Voer daarna pas `git fetch --prune` uit en fast-forward lokale `main`; forceer niets.
5. Koppel branches aan hun PR en vergelijk tree/patch/unikale commits. Door squashmerges
   is “niet ancestor van main” op zichzelf geen bewijs dat werk nog nodig is. Gebruik
   PR-status, `git cherry`, `git diff`, tree-hashes en handmatige inspectie samen.
6. Verwijder alleen aantoonbaar patch-equivalente branches en ongebruikte worktrees.
   Archiveer of branch unieke commits eerst.
7. Beslis of GitHub gemergede headbranches automatisch mag verwijderen en leg de
   werkafspraak vast.

**Niet doen:** `git reset --hard`, worktrees geforceerd verwijderen, untracked config
weggooien of branches batchgewijs wissen zolang een andere sessie actief kan zijn.

### Mergepoort harmoniseren

Strict branch protection blokkeert op de eigen CI, maar PR #11 kon mergen terwijl de
Vercel-previewstatus rood was; de latere productie-deployment was gelukkig groen.
Beslis expliciet of een werkende Preview onderdeel van de merge-eis is. Zo ja, maak de
Vercel-check vereist of voeg een aantoonbare handmatige poort toe. Test eerst hoe de
status zich gedraagt bij geannuleerde/overgeslagen previews, zodat een externe storing
niet zonder herstelpad alle merges blokkeert.

## Nog ontbrekende controles in de teststrategie

De huidige 138 tests zijn waardevol, maar hun dekking is vooral pure regels en gemockte
happy paths. Voeg gericht toe, niet alleen meer testaantallen:

1. **Concurrency/invarianten:** checkout, webhook, mailclaim, ordernummer,
   lesafronding en snapshotimport.
2. **Route-autorisatie:** vragen stellen, vragen modereren, nieuwsbrief, voortgang en
   beheerpagina's met geen sessie, verkeerde gebruiker en beheerder.
3. **Database-integratie:** transacties en unieke constraints met PGlite/echte Preview-
   Postgres, inclusief migratie en rollback.
4. **Browserkritiek:** 320/375/390px header, kooptoestemming, auth-returnpad,
   Mollie-return, les-Q&A, alle interactieve tools, toetsenbord en reduced motion.
5. **Publieke claimtests:** prijs en belangrijkste mail/juridische feiten uit één
   fixture of claimmatrix; geen oude “alleen browser”-tekst.
6. **Contentinvarianten:** slugs/orders, niet-lege secties, duur/XP, toolrenderer,
   boekreferenties en expliciete bron/peildatum voor veranderlijke cijfers.
7. **Certificaat:** aankoop, volledige afronding, uitgifte, herdruk en refund.
8. **Security:** headers/CSP na compatibiliteitsontwerp, publieke webhook-abuse,
   rate limits, secret scan en hersteltest van databasebackups.

## Aanbevolen uitvoeringsvolgorde voor Claude

1. Synchroniseer veilig met actuele `main` en verwerk deze review als review-PR; maak
   eerst geen productwijziging.
2. Reconcileer `docs/openstaand.md`: verwijder opgelost werk, corrigeer feiten en voeg
   de nieuwe P0/P1-punten met acceptatiecriteria toe.
3. Maak twee ontwerpnotities vóór code: (a) order/payment-attempt/entitlement-model en
   migratie, (b) voortgangstransactie/import/reset-invariant.
4. Schrijf de concurrency- en migratietests eerst; implementeer beide modellen in
   afzonderlijke PR's en Preview-databases.
5. Maak vervolgens de juridische/publieke claimmatrix en pas teksten pas aan na
   juridische en operationele bevestiging.
6. Harmoniseer agentinstructies en huidige architectuurdocs; archiveer historische
   documenten met banners en genereer vluchtige feiten.
7. Test en review de nieuwe cursussen/tools inhoudelijk en toegankelijk.
8. Ruim pas als laatste branches/worktrees op, wanneer alle sessies gesloten en unieke
   wijzigingen aantoonbaar veilig zijn.

## Expliciet niet doen

- Geen Mollie-live-key activeren omdat CI groen is; de commerciële en juridische
  stoplichten zijn afzonderlijk.
- Geen tweede entitlementcheck introduceren buiten `heeftToegangTot()`.
- Geen `npm audit fix`, frameworkmajor of Auth/Drizzle-upgrade zonder compatibiliteits- en
  migratietest.
- Geen juridische toezegging schrijven vóór proces, eigenaar en bewijs bestaan.
- Geen publieke pagina's cachebaar maken vóór de live Q&A-dynamiek is ontworpen.
- Geen betaal- en voortgangsmigratie in één groot deploymoment combineren.
- Geen gemergede branches/worktrees opruimen zolang de gedeelde werkmap door andere
  sessies wordt gebruikt.
- Nooit het private omzetbelastingnummer publiceren; alleen het openbare
  btw-identificatienummer hoort in publieke stukken.

## Eindbeoordeling

| Dimensie | Stand | Kern |
|---|---:|---|
| Architectuur | 4/5 | Goede monoliet, servergrens en één toegangsowner; toestandsmodellen moeten meegroeien. |
| Security/privacy | 3/5 | Sterke content- en entitlementgrenzen; privacytekst, certificaat, abusebeleid en dependencytriage lopen achter. |
| Correctheid/betrouwbaarheid | 2/5 | Payment- en progress-concurrency kunnen klantgeld/toegang/XP verkeerd laten eindigen. |
| Testen/release | 3,5/5 | CI en 138 tests zijn een grote stap; integratie, concurrency, browser en toolmath ontbreken. |
| Onderhoudbaarheid | 3/5 | TypeScript-content en centrale helpers zijn goed; grote bestanden en dubbel bijgehouden feiten verhogen drift. |
| Documentatie | 2/5 | Veel waardevolle kennis, maar canonieke en historische waarheid zijn onvoldoende gescheiden. |
| Operationeel hands-off | 2/5 | Beheerinzage bestaat; mail/refund/monitoring/reconciliatie hebben nog geen duurzame lus. |

De eerstvolgende kwaliteitswinst komt niet van nog een cursus of CMS, maar van een
betalingsledger die geen geld kan verliezen, transactionele voortgang, juridisch
waarheidsgetrouwe copy en documentatie die automatisch met de code meebeweegt.
