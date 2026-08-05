# Beleggingscollege

> **Dit bestand is de productwaarheid. `AGENTS.md` bevat alleen regels en verwijst hierheen — zet daar geen feiten over de code in.** Dat is niet stijl maar een reparatie: tot 3 aug 2026 was AGENTS.md een tweede kopie, en die liep 74 regels achter met nog het oude `purchases`-model en de bewering dat voortgang alleen in localStorage leefde. Precies het geldpad en het voortgangspad, precies de dingen die schade doen als een agent ze verkeerd heeft. "We werken ze wel samen bij" was al de afspraak, en die is gesneuveld — daarom staat er nu niets meer in dat kán verouderen.

Nederlands e-learningplatform voor beleggingsonderwijs (beleggingscollege.nl). Missie: eerlijk, toegankelijk beleggingsonderwijs geworteld in klassieke boeken — géén get-rich-quick. Merkstem: Nederlands, je/jij-vorm, vriendelijk-professioneel, reassurance-first.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`), lucide-react icons.
- Cursusinhoud is typed data (`src/content/`). Accounts en aankopen staan in Postgres (Neon + Drizzle). **Lesvoortgang synct sinds 2 aug 2026 naar de server voor ingelogde gebruikers** (`src/lib/voortgang-server.ts`, `POST /api/voortgang`; de tabellen `lesson_progress` en `user_stats` zijn dus wél in gebruik). Uitgelogd blijft localStorage leidend, en de individuele quizantwoorden staan alleen lokaal. **Die route controleert sinds 3 aug 2026 toegang** (`heeftToegangTot()`; 403 zonder recht, 400 bij een onbekende les, en de snapshotimport snoeit tot gratis + gekochte cursussen) — de UI is geen autorisatie. Let op wat er nog wél open staat: `total` komt uit de catalogus en `correct` uit de client (geklemd op 0..total), dus wie `correct = total` post pakt de quizbonus én de foutloos-badge zonder één vraag te beantwoorden — de antwoorden zelf reizen nooit mee (`docs/openstaand.md` §6).
- Dev server: `npm run dev` (poort 3000). Build: `npm run build`.
- **`docs/openstaand.md` is de lijst met alles wat nog niet af is.** Lees die vóór je iets belooft of live zet.

### Één onderwerp, één document — anders loopt het uit elkaar

Dit is hier al vier keer misgegaan en het kost elke keer iemand een uur: de FAQ die zei dat voortgang alleen in de browser leefde nadat die naar de server ging, de voorwaarden die "zolang er nog geen accounts zijn" bleven zeggen, `AGENTS.md` dat 74 regels achterliep op dit bestand, en dit bestand dat "wacht op DNSSEC bij Strato" doorgaf terwijl dat al klaar was.

De regel die dat voorkomt: **schrijf een stand van zaken op één plek en verwijs er verder alleen naar.** Wat mag je wél herhalen? Regels — die verouderen niet elke dag. Wat niet? Toestand: wat werkt, wat blokkeert, wat af is.

- Domeinverhuizing → `docs/domain-migration-plan.md`
- E-mail → `docs/e-mail-versturen.md`
- Bezoekmeting → `docs/analytics.md`
- Betalingen → `docs/betalingen-mollie.md`
- Alles wat nog niet af is → `docs/openstaand.md`
- `AGENTS.md` bevat sinds 3 aug 2026 **alleen regels** en verwijst hierheen. Zet er geen toestand meer in.

Verander je iets aan het product, loop dan na of de **publieke teksten** nog kloppen (`/privacy`, `/voorwaarden`, `/veelgestelde-vragen`, `/over-ons`, `/herroepingsrecht` en de mailteksten). Bij dit merk is dat geen nettigheid maar een productvereiste.

## Architectuur

- `src/content/types.ts` — contentschema (Course → Module → Lesson → QuizQuestion). Nieuwe cursus = nieuw bestand in `src/content/courses/` + import in `src/content/index.ts`. **Het volledige recept (agents, tools, verificatie, PR-flow) staat in `docs/cursusfabriek.md`** — zo zijn op 3 aug 2026 zes cursussen gebouwd; de prioriteiten voor de volgende staan in `docs/volgende-cursussen.md`.
- **Catalogus sinds 3 aug 2026: 9 cursussen (orders 1–9), waarvan 8 betaald** — gratis beginnerscursus; Waardebeleggen, Technische Analyse, Beleggingspsychologie, de optieladder (Opties Begrijpen / Beschermen & Verdienen / Volatiliteit & Spreads), Indexbeleggen & ETF's (elk €49) en Hefboomproducten (€29 — de enige afwijkende prijs; het besluit daarover staat nog open in `docs/openstaand.md` §4b). Onderbouwing opties/hefboom: `docs/opties-curriculum.md`.
- `src/components/lesson-tools.tsx` — registry van alle interactieve lestools (volledige `Record`: een vergeten registratie breekt de build). Optierekenwerk: `src/lib/opties.ts` (puur, bundelveilig). Interne QA-pagina met álle tools zonder aankoop: `/lab/opties` (noindex).
- `src/lib/progress.tsx` — gamification-engine (client): XP, levels, streaks, badges, quizscores; persistentie in localStorage key `beleggingscollege-voortgang-v1`. `completeLesson()` is het enige muterende pad.
- `src/lib/levels.ts` (8 levels: Toeschouwer → Meesterbelegger), `src/lib/badges.ts` (10 badges met predicaten), `src/lib/accent.ts` (kleurvarianten per cursus).
- `src/lib/pricing.ts` — bron voor de prijzen zoals ze op de site **staan**: losse cursus €49 eenmalig (uitzondering: Hefboomproducten €29 via `course.price`), College+ €14,99/mnd (€149/jr). Onderbouwing: `docs/prijsstrategie.md`. Let op: wat er daadwerkelijk wordt afgerekend komt uit `prijsInCenten()` in `src/lib/prijs.ts` (aangeroepen door de checkout), dat de weergavetekst met een regex terugrekent naar centen. Wijzig je hier een prijs, controleer dan dat die conversie meeloopt — `test/prijs.test.ts` bewaakt het formaat.
- `src/lib/site.ts` — `SITE_URL`, leest `NEXT_PUBLIC_SITE_URL`, standaard `https://beleggingscollege.com`. Canonicals, sitemap, robots, Open Graph en schema.org lezen hier allemaal uit. Bij de verhuizing gaat het meeste dus vanzelf mee — maar níét alles: het e-mailadres, de teksten in de voettekst en het certificaat noemen de `.nl` los in de code. Grep op `beleggingscollege.` vóór je de knop omzet.
- `src/content/blog.ts` — blogartikelen als data. Nieuw artikel = blok toevoegen aan `posts`; overzicht, artikelpagina, sitemap en SEO volgen vanzelf.
- Pages: `/` (marketing), `/cursussen`, `/cursussen/[slug]`, `/cursussen/[slug]/les/[les]`, `/cursussen/[slug]/gekocht` (terugkeerpagina van Mollie), `/cursussen/[slug]/certificaat` (printbaar), `/leerpad` (dashboard), `/account`, `/inloggen`, `/blog` + `/blog/[slug]`, `/over-ons`, `/veelgestelde-vragen`, `/contact`, `/privacy`, `/voorwaarden`, `/herroepingsrecht` (die laatste drie zijn **concepten** en staan op noindex tot een jurist ernaar kijkt), `/lab` + `/lab/opties` (intern stijllab en tool-QA, noindex), `/beheer` + `/beheer/vragen` (intern beheerscherm, noindex, alleen voor `ADMIN_EMAILS`). **Het volledige, gegenereerde overzicht staat in `docs/plattegrond.md`** (`npm run plattegrond`) — die telling loopt niet achter zoals deze opsomming kan doen.
- XP-regels: 50 XP per les + quizbonus tot 25 XP; herhaalde les = 0 XP.

## Accounts, database en toegang

**Live sinds 2 augustus 2026.** Inloggen met Google werkt op productie; er staan echte gebruikers, sessies en gekoppelde providers in de database.

- **Neon-database draait** (PostgreSQL 17, regio Frankfurt); de tabellen zijn aangemaakt via `npx drizzle-kit migrate`. De SQL staat in `drizzle/` en hoort mee de repo in. **Schrijf hier geen aantal op** — dat verouderde al bij de tweede migratie; de actuele set staat in `src/db/schema.ts`.
- **Een merge zet je migratie NIET op productie.** Er is geen migratiestap in `next build`, in Vercel of in CI — `npm run build` draait alleen de build. Een PR met een nieuw bestand in `drizzle/` deployt dus code die een kolom of index verwacht die er niet is. Dat ging op 4 aug 2026 bijna mis: PR #42 was gemerged en live, en de partiële unique index bestond nog niet. **Draai hem zelf, met de dírecte verbinding** (de pooler kan een migratie niet aan — `drizzle.config.ts` pakt daarom `DATABASE_URL_UNPOOLED`):

  ```bash
  npx drizzle-kit migrate
  ```

  En controleer daarna dat het er echt staat (`pg_indexes`, `drizzle.__drizzle_migrations`) in plaats van de uitvoer te geloven. Wat je bouwt moet dat overleven: tot de migratie draait, loopt productie op de oude vorm. Een index die er nog niet is, is stil — code die erop leunt faalt niet, hij beschermt alleen nog niets.
- **Omgevingsvariabelen staan in Vercel** (Production + Preview): `AUTH_SECRET` (een ándere dan lokaal — een lek op de laptop mag geen productiesessies raken), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, plus alles wat de Neon-integratie zelf injecteert. Lokaal staat hetzelfde in `.env.local` (nooit committen; zie `.env.example`).
- `NEXT_PUBLIC_SITE_URL` staat bewust **niet** in Vercel: `NEXT_PUBLIC_`-variabelen worden in de browserbundel gebakken, dus die als "Sensitive" markeren is schijnveiligheid. De code valt terug op `https://beleggingscollege.com`. Bij de verhuizing naar de `.nl` alsnog toevoegen, als gewone (niet-gevoelige) variabele.
- Google OAuth: alleen de scopes `openid`, `email`, `profile` — daarmee is Google's volledige verificatietraject niet nodig. Alle vier de redirect-URI's (localhost, `.com`, `.nl`, `www.nl`) staan al geregistreerd, dus de domeinverhuizing vraagt daar geen actie.

- **Neon** = gehoste Postgres (serverless, schaalt naar nul, gratis laag, regio Frankfurt — **regio is achteraf niet te wijzigen**). **Drizzle** = ORM: queries in TypeScript in plaats van SQL-strings, met typecontrole tijdens de build.
- **Waarom niet SQLite:** dat is een bestand op schijf, en Vercel heeft geen blijvend bestandssysteem — elke instance krijgt zijn eigen kopie en elke deploy wist hem. Waarom niet Supabase: die pauzeert gratis projecten na een week inactiviteit, onacceptabel voor betalende klanten. Vercel Postgres bestaat niet meer (in 2024 naar Neon verhuisd). Zelf hosten op de NAS kan technisch, maar dan wordt de thuisverbinding de beschikbaarheid van de webshop.
- `src/db/schema.ts` — Auth.js-tabellen (exact zoals de adapter ze verwacht) + `payment_attempts` (append-only, één rij per Mollie-betaling), `entitlements` (één recht per gebruiker per cursus), `order_counters` (doorlopende ordernummers per jaar), `lesson_progress`, `user_stats`. Het oude `purchases` staat er nog stil bij tot de contract-migratie; het ontwerp achter de splitsing is `docs/ontwerp-betaalmodel.md`.
- `src/auth.ts` / `src/auth.config.ts` — gesplitst zodat er ooit edge-middleware bíj kan (die kan geen database laden). **Let op: er is op dit moment géén `middleware.ts` in de repo** — de nette redirect voor uitgelogde bezoekers doet `/account` zelf met `redirect()`. **Database-sessies, geen JWT**: alleen zo kun je toegang direct intrekken na terugbetaling of misbruik.
- **`src/lib/entitlements.ts` is de enige plek die bepaalt of iemand een betaalde cursus mag zien.** `server-only`, kijkt uitsluitend naar de sessie en een rij in `entitlements` met status `actief`. Middleware is géén autorisatie (Auth.js waarschuwt daar expliciet voor) — die doet alleen een nette redirect.
- Versies staan **exact gepind**: Auth.js v5 is na 2,5 jaar nog steeds beta en Drizzle 1.0-rc breekt auth-adapters. Niet upgraden zonder testen.
- Valkuil in `src/db/index.ts`: de verbinding wordt opgezet met een placeholder-URL als `DATABASE_URL` ontbreekt, anders faalt `next build`. Lui initialiseren via een Proxy kán niet — de Drizzle-adapter inspecteert het db-object en faalt met "Unsupported database type".
- **`db.transaction()` bestáát niet op de neon-http-driver.** Hij gooit "No transactions support in neon-http driver" — maar in de tests draait PGlite, en dáár werkt hij wél. Een transactie schrijven is dus precies het soort fout die groen is in CI en pas op productie omvalt. `db.batch()` helpt niet: dat kan de `RETURNING` van het ene statement niet aan het volgende voeren. Moet iets atomair? Schrijf het als **één statement met data-modifying CTE's**. Voorbeelden staan in `verwerkBetaald()` (`src/app/api/mollie/webhook/route.ts`) en in `verwerkLes()`/`importeerSnapshot()` (`src/lib/voortgang-server.ts`) — beide tellen bewust alleen een delta op in plaats van een absolute waarde te zetten, zodat de invariant uit de vorm van het statement volgt.
- `src/lib/ratelimiet.ts` — vaste-vensterlimiet (10 per 15 min) voor de publieke schrijfroutes `POST /api/lesvragen` (op gebruikers-id) en `POST /api/nieuwsbrief` (op IP). **In-memory, dus per instance**: een snelheidsdrempel, geen garantie. Wie een echte limiet wil, heeft gedeelde staat nodig.
- Volledige implementatiegids met geverifieerde versies en codevoorbeelden: `docs/implementatie-accounts-betalen.md`.

### Domeinwissel raakt dit alles níét

Accounts, aankopen en voortgang hangen aan gebruikers-id's, niet aan een URL. Bij de verhuizing naar de `.nl` verandert alleen: `NEXT_PUBLIC_SITE_URL`, een redirect `.com` → `.nl`, en — als die er niet al staat — de callback-URL in Google Cloud Console. **Zet daarom bij het aanmaken van de Google-client meteen álle redirect-URI's erin** (`.com`, `.nl` en localhost); dan hoeft daar later niets aan te gebeuren.

## Merk (uit 2023-archief "Website Resources Collection.docx")

- Primair blauw `#0072CE` (Pantone 285C), secundair groen `#006546` (349C), logo-navy `#0033A0`, bodytekst `#53565A`, goud-accent voor gamification.
- Font: Open Sans. Origineel logo: `public/logo.svg` (en NAS: `Visual Future\Websites\Beleggingscollege\Background Images\Logos\Used\`).
- Volledig archief: `C:\Users\jason\SynologyDrive\Work Documents\Visual Future\Websites\Beleggingscollege\`.

## Domein & hosting

**De site staat LIVE op https://beleggingscollege.com** (sinds 2 aug 2026).

- **Code**: GitHub `JasonKrijgsman/Beleggingscollege`, branch `main`.
- **Werkwijze (sinds 3 aug 2026): werk op een branch en merge via een PR met groene CI — direct naar `main` pushen wordt geweigerd.** Main is beschermd (vereiste check "CI", ook voor admins, strict-mode: de PR moet up-to-date zijn met main) omdat elke merge naar productie deployt. Auto-merge staat aan: open de PR en draai meteen `gh pr merge --auto --squash`, dan merget hij zichzelf zodra CI groen is. Wordt main tóch een keer rood, dan opent de workflow zelf een issue. Lokaal reproduceer je de hele poort met `npm ci && npm run controle`; zie `docs/ci.md`. Begin je aan werk dat meerdere bestanden raakt, kijk dan eerst met `gh pr list` wat er al in de maak is; overlapt een open PR met jouw scope, leg het aan Jason voor in plaats van ernaast te bouwen.
- **Er werken hier vaak meerdere sessies tegelijk — `docs/samenwerken-met-andere-sessies.md` legt uit wat dat breekt.** Kort: werk nooit in de gedeelde werkmap maar in een eigen worktree (een andere sessie wisselt anders onder je vandaan van branch); CI toetst de sámenvoeging met `main`, dus groen bij jou is nog geen groen na de merge; `git branch --no-merged` liegt omdat alles squash-gemergd wordt (kijk naar de PR-status); en auto-merge haalt `main` niet zelf binnen — bij `BEHIND` draai je `gh pr update-branch`.
- **Cursor Bugbot staat aan in handmatige modus** (sinds 3 aug 2026): je mag zelf een extra review aanvragen door op de PR de reactie `bugbot run` te plaatsen. Gebruik je oordeel — niet spammen omdat het kan. Vuistregel: **wél** bij PR's die geld-, toegangs- of concurrencypaden raken (checkout, Mollie-webhook, entitlements, voortgang-server, moderatie) of bij een groot nieuw stuk logica; **níét** bij docs-, tekst- of commentwijzigingen en triviale fixes — daar is CI genoeg. Eén run per PR-versie; verwerk eerst de bevindingen voordat je opnieuw vraagt. Bugbot is een extra paar ogen, geen vervanger van de vereiste groene CI.
- **Hosting**: Vercel, team "Visual Future", project `beleggingscollege`. **Elke push naar `main` deployt automatisch**; elke branch krijgt een preview-URL. Login: accounts@jasonkrijgsman.com (wachtwoordloos + passkeys, bewust geen SSO).
- **`beleggingscollege.com`** — registrar Cloudflare (betaald t/m nov 2027), DNS bij Cloudflare, CNAME `@` → `6d87ec9bdcf67bce.vercel-dns-017.com`, **DNS only (grijze wolk)**. Dit is tijdelijk het canonieke adres.
- **`beleggingscollege.nl`** — **`docs/domain-migration-plan.md` is de enige bron over de stand van die verhuizing. Lees dat document; herhaal de stand hier niet.** Dit bestand heeft die stand twee keer overleefd en gaf op 3 aug 2026 nog "wacht op DNSSEC bij Strato" door terwijl dat al een halve dag klaar was — iemand is daardoor opnieuw gaan uitzoeken wat al bekend was. Wat op 3 aug 2026 (avond) waar was: DNSSEC eraf, naamservers bij Cloudflare, Migadu actief, en wat er nog blokkeert is de **providerwissel bij Strato**, niet het DNS. Verandert dat, werk dan het migratieplan bij — niet deze regel.
- **De `.nl` geeft op dit moment 404** (Apache bij Strato, `81.169.145.93`): de oude WordPress-site is weg, de records wijzen nog naar Strato. Dat adres staat wél in onze voettekst, op elk certificaat en in de drie juridische pagina's als het adres van de verkoper. Zolang dat zo is, verwijzen we klanten naar een dode pagina. Het stappenplan staat in `docs/nl-als-hoofddomein.md`.
- **Zodra de .nl verhuisd is**: `NEXT_PUBLIC_SITE_URL` in Vercel op `https://beleggingscollege.nl` zetten en een permanente redirect `.com` → `.nl` toevoegen. Verder hoeft er niets in de code.
- **Kosten en de Vercel-valkuil rond commercieel gebruik**: `docs/hosting-en-kosten.md`. Kort: Vercel Hobby is alleen voor niet-commercieel gebruik; zodra er betaald kan worden is Pro (~$20/mnd) verplicht.
- Gered materiaal van de oude WordPress-site: `docs/salvage/`.
- Jasons eigen ideeën (gebouwd, nog niet gebouwd, afgevallen): `docs/ideeen.md`. Wat de winkel nog mist en waarom: `docs/wat-de-winkel-mist.md`.
- **Architectuur en schaal**: `docs/architectuur.md` (de kaart, modules en drempels), `docs/plattegrond.md` (autogegenereerd routeoverzicht — `npm run plattegrond` na elke nieuwe pagina), `docs/cms-keuze.md` (Payload, geverifieerd; verhuizing nog niet gepland). Ontwerpprincipe van Jason: **schaal zit in grenzen, niet in massa** — elke module heeft een stabiele interface (`getCourse()`, `heeftToegangTot()`, `verstuurMail()`), binnenkanten zijn verwisselbaar.
- **College+ en de AI-studiecoach**: het besluit staat in `docs/college-plus-concept.md` — de oefenlaag draagt het abonnement, niet de bibliotheek; lanceervoorwaarden staan erin. Onderliggend onderzoek: `docs/productonderzoek.md`.
- **Menselijke, niet-door-AI-te-kopiëren elementen** (Jasons onderscheid): `docs/menselijke-elementen.md` — top 7 gerangschikt op onderscheidend vermogen per uur van Jason, inclusief de Resolve-videoketen. **"Vragen & antwoorden bij de les" is hiervan het eerste gebouwde stuk** (3 aug 2026): REDACTIONEEL, geen helpdesk. Cursisten sturen (ingelogd) een vraag in; geen beloofde termijn, geen zichtbare wachtrij. Jason kiest zélf wat hij beantwoordt; beantwoorde vragen worden openbaar als groeiende mini-FAQ. `src/lib/lesvragen.ts` is de modulegrens, moderatie op `/beheer/vragen` achter dezelfde poort als `/beheer`: `beheerSessie()` in `src/lib/beheer.ts`, gestuurd door `ADMIN_EMAILS` met `BEHEER_EMAILS` als terugval (geen apart admin-account — het is wélk ingelogd Google-account mag modereren). Bewust géén algemeen forum en géén AI-coach hier (zie `docs/ideeen.md`). De AFM-standaardafwijzing zit als knop in de moderatie.

## SEO-huisregels

- **Nooit een URL/slug wijzigen of verwijderen zonder permanente redirect** toe te voegen in `next.config.ts` (redirects van de oude WordPress-site staan daar al). URL's zijn de SEO-waarde.
- Elke pagina heeft een eigen `<title>` + meta description (via `generateMetadata`); nieuwe pagina's ook.
- Aanwezig: sitemap (`src/app/sitemap.ts`), robots (`src/app/robots.ts`, blokkeert /leerpad + certificaten), Open Graph-defaults (layout), canonicals per pagina, schema.org Course-markup (cursusdetailpagina). Certificaatpagina's zijn noindex.
- Canonicals volgen `SITE_URL` (nu .com). Zodra de .nl live is: variabele omzetten én `.com` permanent naar `.nl` redirecten, anders concurreren twee identieke sites met elkaar.
- **Een eigen `openGraph`-blok in `generateMetadata` vervángt dat van de root-layout, inclusief de afbeelding uit `opengraph-image.tsx`.** Zet je er een neer, haal de afbeelding dan expliciet bij de ouder op (`(await parent).openGraph?.images`) — anders deelt die pagina zonder kaart. Precies zo ging het mis op de cursus- en blogpagina's, hersteld 3 aug 2026.
- **De sitemap bevat alleen lessen van gratis cursussen.** Een vergrendelde les toont een uitgelogde crawler alleen het slotscherm; die dienen we niet aan. `test/sitemap.test.ts` bewaakt beide kanten.
- **Stuur niemand naar een pagina die voor hem op slot zit.** Een betaalde cursuspagina toont niet-kopers het curriculum in plaats van een "start"-knop, en de lessenlijst een slotje vóór de klik. `heeftToegangTot()` blijft de autorisatie; dit gaat alleen over wat je tóónt.

## Bezoekmeting

**Gebouwd op 3 aug 2026, staat nog uit.** Umami, zelf gehost als tweede Vercel-project met een eigen Neon-database — géén Google Analytics en geen gehoste statistiekdienst, want dat zou een verwerker toevoegen aan een site die zich juist op privacy verkoopt. Cookieloos, geen profielen, respecteert Do Not Track; daarom blijft de site zónder cookiebanner.

- `src/lib/analytics.ts` bepaalt als enige óf er gemeten wordt; `src/components/Analytics.tsx` rendert het script, of niets.
- **Leeg = echt uit.** Zonder `NEXT_PUBLIC_UMAMI_URL` én `NEXT_PUBLIC_UMAMI_WEBSITE_ID` laadt er geen script en gaat er geen verzoek uit. `test/analytics.test.ts` pint dat vast.
- De instantie opzetten kan een agent niet afmaken (Vercel werkt met passkeys). Stappen, afwegingen en de juridische grens: `docs/analytics.md`.
- **Niet op veggie.** `*.jasonkrijgsman.com` wijst naar `192.168.2.15`, dus de homelab is voor bezoekers onbereikbaar. Zie `docs/analytics.md`.

## Eerlijkheid is een productvereiste, geen sfeer

Dit merk verkoopt zichzelf als de eerlijke tegenhanger van get-rich-quick-aanbieders. Dat legt echte beperkingen op:

- **Geen verzonnen social proof.** De drie testimonials van de oude site zijn verwijderd toen bleek dat die site nul bestellingen had; ze zijn vervangen door de boekenkast-sectie. Zet geen reviews terug die niet echt zijn — het is ook misleidende reclame zodra je verkoopt.
- **Geen claims die je niet kunt waarmaken.** De badge op College+ zegt "Onze aanbeveling", niet "Meest gekozen" — dat laatste weten we pas als mensen kiezen.
- **Geen rendementsbeloftes, geen persoonlijk beleggingsadvies.** Wij zijn opleider, geen AFM-vergunninghouder. Dit hoort ook expliciet in de voorwaarden en op /contact te staan.
- Cursusinhoud benoemt de grenzen van elke methode (bijv. de wetenschappelijke kritiek op technische analyse). Houd dat zo.

## Betalingen

- **Losse cursussen kopen wérkt** — op 2 aug 2026 end-to-end getest op de live site: koopknop → Mollie → webhook → les ontgrendelt. Bewijs en testmatrix in `docs/betalingen-mollie.md`. **Let op dat die test over het oude `purchases`-model liep**: het gesplitste model landde pas op 3 aug (PR #22). Wat er ná de migratie geverifieerd is, is de migratie zelf (tellingen vóór en na, en dat bestaande toegang behouden bleef) — een volledige testaankoop dóór de nieuwe keten staat nog open en is de voorwaarde voor de contract-stap, zie `docs/openstaand.md` §6b.
- **De keten loopt sinds PR #22 langs twee tabellen.** De webhook zet de betaalpoging op `paid` én verleent in hetzelfde statement een entitlement met status `actief`; dát laatste ontgrendelt de les. Het betaalmodel staat in `docs/ontwerp-betaalmodel.md`.
- **Geld terug trekt toegang in, en er is nog maar één betaalbare link per cursus** (PR #42 en #44, 4 aug 2026). Twee dingen die je moet weten voor je hier iets aanraakt:
  - **Mollie kent geen status `refunded`.** Een terugbetaalde betaling blijft gewoon `paid`; wat verandert zijn `amountRefunded` en `amountChargedBack`. Wie alleen naar `payment.status` kijkt, ziet een terugbetaling nóóit — precies waardoor toegang bleef staan nadat het geld terug was. Ingetrokken wordt er bij elke chargeback en bij volledige terugbetaling; een gedeeltelijke terugbetaling laat de cursus bewust staan.
  - **Een tweede checkout maakt geen tweede betaallink meer.** Een partiële unique index (`WHERE status = 'pending'`) laat één openstaande poging per gebruiker per cursus toe. Dat **keert een eerder bewust besluit om** — §5 scenario 1 van `docs/ontwerp-betaalmodel.md` noemde twee links ooit de gewenste uitkomst. Lees daar invariant **I1b** vóór je dit "herstelt".
- **Er staat nu een `test_`-key in Vercel.** De winkel lijkt dus open, maar niemand kan echt betalen. Vervang `MOLLIE_API_KEY` door de live-key vóór de eerste verkoop, en deploy daarna opnieuw.
- Mollie-account is live-klaar (KYC afgerond in 2023, bankrekening geverifieerd, profiel Online). iDEAL, kaarten, PayPal en Apple Pay staan actief; SEPA-incasso is 2 aug 2026 aangevraagd en wacht nog op goedkeuring — dat blokkeert alleen het abonnement, niet de losse verkoop.
- **MOI-risico (€65), tarieven en verplichte tegenmaatregelen: `docs/betalingen-mollie.md`.** Lees dat vóór er aan het abonnement gebouwd wordt.
- API-keys horen in omgevingsvariabelen, **nooit** in de repo.

### Twee regels die niet gebroken mogen worden

1. **De prijs komt uit onze eigen catalogus, nooit uit het verzoek.** Anders bepaalt de klant wat hij betaalt.
2. **De webhook gelooft niets uit de payload behalve het id.** Mollie stuurt alleen `id=tr_…`; het endpoint is publiek, dus de status halen we zelf op en we controleren bedrag én valuta tegen wat wij hadden vastgelegd.

## E-mail

**Stand: de code is af, de postbus bestaat, en er gaat nog niets de deur uit — dat laatste hangt op twee omgevingsvariabelen.** Volledige onderbouwing in `docs/e-mail-versturen.md`.

- **Verzenden en ontvangen zijn twee losse dingen.** Een postbus ontvangt; transactionele mail versturen we via een server of API en dat heeft géén postbus nodig. Dit wachtte dus nooit op Strato — een misvatting die ons een tijd heeft opgehouden.
- **Gekozen: Migadu**, niet Resend. Jason betaalt er al voor (draait voor bliep.org en jasonkrijgsman.com) en de post van dit domein gaat er na de verhuizing sowieso heen. We geven daarmee bezorglogboeken en bounce-webhooks op; bij nul tot enkele verkopen per maand is dat een prima ruil.
- **Correctie die je moet kennen:** transactionele mail is níét in strijd met Migadu's voorwaarden. Die verbieden spam en niet-toegestemde mailinglijsten; een orderbevestiging is geen van beide. Het obstakel is dat Migadu een domein pas activeert als de MX ernaartoe wijst.
- **Dit wachtte op de verhuizing van de `.nl`; dat is voorbij.** Migadu is actief sinds 3 aug 2026 en de postbus `beheer@beleggingscollege.nl` bestaat. Wat er nog ontbreekt zijn de twee SMTP-variabelen in Vercel. De actuele stand staat in `docs/e-mail-versturen.md` en `docs/openstaand.md` — **niet hier**; dezelfde valkuil als bij het domein hierboven.
- **Valkuil die stil misging (inmiddels gedicht, 3 aug 2026):** het domein publiceerde `p=reject` zónder SPF, waardoor élke mail van een nieuwe verzender geweigerd zou worden — niet in spam, geweigerd. SPF, alle drie de DKIM-CNAME's en DMARC staan er nu, en DMARC staat **bewust tijdelijk op `p=quarantine`**. De volgorde die dat gat dichthoudt: eerst één echte bestelling testen, dán DMARC terug naar `p=reject`. Zet hem niet terug voordat verzenden bewezen werkt.
- `src/lib/mail.ts` praat sinds 3 aug 2026 via nodemailer met Migadu SMTP (`smtp.migadu.com`, poort 465, gebruikersnaam = het volledige mailadres). De rest van de keten (`orderbevestiging.ts`, `mailteksten.ts`, de webhook) is daarbij niet aangeraakt: die roepen alleen `verstuurMail()` aan. **nodemailer staat exact op 8.0.11** omdat Auth.js een peer dependency heeft op `^7 || ^8`; 9 breekt de installatie.
- `verstuurMail()` **gooit nooit**: hij draait in de Mollie-webhook nadat de aankoop al op `paid` staat, en een mislukte mail mag daar geen 500 van maken (Mollie herhaalt dan tien keer over 26 uur).
- De atomaire claim op `payment_attempts.confirmationClaimedAt` voorkomt tien identieke mails bij herhaalde webhooks; `confirmationSentAt` is het bewijs dát de verplichte bevestiging is verstuurd.

### Bedrijfsgegevens: één btw-nummer is openbaar, het andere nooit

- **`NL004813328B30`** is het **btw-identificatienummer**. Openbaar, hoort in de voettekst (art. 3:15d BW) en in de orderbevestiging. Staat er.
- Het **omzetbelastingnummer** (afgeleid van Jasons BSN) staat bewust **niet in de repo** — het exacte nummer hoort in geen enkel bestand. Publiceer het **nooit**: niet in code, niet in een mail, niet in documentatie. Nodig? Haal het buiten de repo op.
- Vestigingsadres en btw-nummer komen uit de omgevingsvariabelen `BEDRIJF_ADRES` en `BEDRIJF_BTW_NUMMER`, en staan bewust niet in de repo. Op 5 aug 2026 is besloten het woonadres te gebruiken (het staat toch al openbaar in het Handelsregister) — maar alléén via de omgevingsvariabele: schrijf het adres nooit in code of documentatie. Stand en onderbouwing: `docs/openstaand.md`.
- **Geen kleineondernemersregeling** (bevestigd 2 aug 2026), dus de 21%-regel in de bevestiging klopt.

## Toegang tot betaalde content

`heeftToegangTot()` in `src/lib/entitlements.ts` is de **enige** toegangspoort — voeg geen tweede check elders toe, dan lopen ze uit elkaar.

Drie valkuilen die we al een keer in productie hebben gehad. Alle drie waren stil.

- **Props naar client components komen in de HTML terecht.** Geef daarom nooit een `Course` door; gebruik de view-modellen in `src/content/view.ts`. Zo lekten ooit alle lesteksten én de quizantwoorden (`correctIndex`) mee in de publieke cursuspagina.
- **Imports lekken net zo hard als props — en dat is de gemenere van de twee.** Een module met `"use client"` die `@/content` importeert, sleept de complete modulegraaf mee de browserbundel in, ook als hij er alleen een lestelling uit gebruikt. Zo stonden 21 lessen en 88 quizantwoorden in een publiek JS-bestand van 197 kB, terwijl de HTML schoon was en de propkant al was dichtgezet. **`@/content` heeft daarom `import "server-only"`**: de build faalt nu zodra iemand dit opnieuw doet. Heeft een client component cursusgegevens nodig, gebruik dan `catalogus()` uit `view.ts` op de server en geef het resultaat door. Types importeren mag wél, maar uitsluitend met `import type` — dat verdwijnt bij het compileren.
- **Betaalde lespagina's mogen niet vooraf gebouwd worden.** `generateStaticParams` levert alleen de gratis cursus; de rest rendert per verzoek. Anders bevriest de toegangscheck tijdens de bouw — zonder sessie — en zien kopers voor altijd het slot.

**Controleer een lek nooit alleen in de HTML.** Dat was de fout waardoor de tweede valkuil maandenlang onopgemerkt bleef: de pagina zag er schoon uit. Haal de bundel er ook bij:

```bash
npm run build && npm run controleer:bundel
```

(Niet meer met een kale `grep correctIndex`: QuizBlock leest `q.correctIndex` legitiem client-side om de quiz van de geopende les na te kijken, dus dat woord stáát in de chunks en de grep geeft vals alarm. Het script zoekt op de datavorm `correctIndex:` én op de quizvragen zelf; het draait ook in CI.)

## Roadmap (v2+)

Abonnement College+ (wacht op SEPA), bevestigingsmail na aankoop, facturen/btw, terugbetalingen, AI-studiecoach, risicoprofiel-tool. Volgende cursussen (prioriteitsvolgorde en onderbouwing in `docs/volgende-cursussen.md`): Portefeuillebouw & Risicobeheer, Pensioen & vermogensopbouw NL, Jaarverslagen Lezen. Beleggingspsychologie en Indexbeleggen zijn op 3 aug 2026 gebouwd en live.
