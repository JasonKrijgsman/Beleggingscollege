# Website- en architectuurreview — OpenAI Codex

**Reviewer:** OpenAI Codex, hoofdagent `/root`  
**Datum:** 2 augustus 2026  
**Type:** onafhankelijke second opinion, zonder applicatiecode of dashboardinstellingen te wijzigen  
**Git-momentopname:** `ddb913659f1d9b9efa86c451dc6ff46f9668758f`  
**Canonieke actielijst:** [`docs/openstaand.md`](../openstaand.md)

## Korte conclusie

De gekozen basis is goed voor Jasons doel: een grotendeels hands-off website zonder
controle weg te geven. Dit is een **modulaire monoliet** in één repository, met beheerde
hosting, beheerde Postgres, één centrale toegangscontrole en cursusinhoud die aantoonbaar
niet naar de browser lekt. Een rewrite, microservices of pagebuilder zouden het beheer
moeilijker maken zonder nu een probleem op te lossen.

Wat ontbreekt is vooral een **operationele laag** rond de goede code: gescheiden
omgevingen die aantoonbaar zijn gecontroleerd, automatische tests vóór productie,
alarmering, een herstelpad voor mislukte mails en betalingen, en een klein beheerscherm
voor aankopen, terugbetalingen en mailstatus. Dat maakt de site hands-off. Een CMS lost
die operationele gaten niet op.

Mijn Payload-advies is na de tegenvraag aangescherpt: **Payload is een verdedigbare
toekomstkeuze en mag nu als gecontroleerde proef beginnen, maar niet als directe migratie
op `main`.** De huidige `getCourse()`/`catalogus()`-grens is al de fundering. Eerst moet
een versiecompatibiliteit worden gekozen en moeten de minimale vangrails bestaan. Daarna
is een verticale proef met één onkritisch contenttype de veiligste manier om Payload te
bewijzen.

## Wat er architectonisch goed staat

1. **De applicatie blijft van Jason.** Componenten, routes, prijslogica en data zijn
   TypeScript in Git; Vercel, Neon en Mollie zijn vervangbare beheerde diensten.
2. **Toegang heeft één eigenaar.** `src/lib/entitlements.ts` is de enige bron voor betaalde
   toegang. Dat is veel beter controleerbaar dan verspreide checks in pagina's.
3. **Betaalde inhoud heeft een harde servergrens.** `src/content/index.ts` importeert
   `server-only`; clientcomponenten krijgen beperkte view-modellen uit
   `src/content/view.ts`.
4. **De betaalroute vertrouwt de klant niet.** De prijs komt uit de eigen catalogus en de
   webhook haalt de status bij Mollie op en controleert bedrag en valuta.
5. **Database-sessies passen bij verkoop.** Toegang kan direct worden ingetrokken na
   terugbetaling of misbruik.
6. **De content is gestructureerd.** `Course → Module → Lesson → QuizQuestion` is al een
   bruikbaar schema voor een latere CMS-import; er hoeft geen pagebuilder-model bovenop.

## Bevindingen op volgorde van risico

Veel juridische en bedrijfsmatige blokkades staan al uitvoerig in
`docs/openstaand.md`. Hieronder staan de technische bevindingen die mijn prioritering
bepalen.

### P0 — vóór echte verkoop of marketing

| ID | Bevinding | Waarom dit eerst moet |
|---|---|---|
| CODEX-001 | **Sluit de Mollie-testwinkel of zet hem bewust om.** De publieke flow kan nu een `paid`-aankoop en recht op een cursus opleveren zonder echt geld. | Een demo-instelling is nu tegelijk een publieke autorisatieroute. |
| CODEX-002 | **Scheid de laptop van de primaire productiedatabase.** Vercel Production gebruikt de primaire Neon-resource. Voor Preview staat de Neon deployment action aan, zodat een Preview-deployment een geïsoleerde branch en tijdelijke connection string krijgt. In de Neon-console bestond tijdens deze audit nog geen actieve Preview-branch; alleen `main` was aanwezig. `.env.local` gebruikt echter exact het primaire endpoint van de Vercel-resource. | Preview-isolatie is geconfigureerd; lokaal werken, migreren of testen kan nog steeds echte klantdata raken. Maak een vaste Development-branch en zet uitsluitend die in `.env.local`. |
| CODEX-003 | **Zet een minimale CI-poort vóór productie.** Minimaal typecheck, build, dependency-audit en gerichte tests voor prijs, webhook, entitlement en XP-drift. | Elke push naar `main` gaat naar een winkel met echte accounts; nu controleert niets de ongeschreven veiligheidsregels. |
| CODEX-004 | **Maak orderbevestiging duurzaam en atomair.** Twee gelijktijdige webhookaanroepen kunnen beide `confirmationSentAt = null` zien en beide mailen. Mislukte mail heeft alleen een logregel. | De wettelijk belangrijke bevestiging mag niet afhankelijk zijn van handmatig loglezen. Gebruik een claim/outboxstatus, retries en een zichtbare foutstatus. |
| CODEX-005 | **Voeg alarmering en een herstelprocedure toe.** Uptime, webhookfouten, mailfouten, chargebacks en mislukte databasequeries hebben nu geen eigenaar of notificatie. | Hands-off betekent uitzonderingen automatisch melden, niet dat niemand kijkt. |
| CODEX-006 | **Maak terugbetaling en intrekking operationeel.** Een beheerder moet aankoopstatus, Mollie-id, mailstatus en toegang kunnen zien en gecontroleerd kunnen terugdraaien. | Dit is belangrijker voor dagelijks beheer dan een CMS: het voorkomt rechtstreeks klant- en geldproblemen. |

### P1 — eerstvolgende technische sprint

| ID | Bevinding | Aanbevolen richting |
|---|---|---|
| CODEX-101 | `auth()` staat in de root-layout, waardoor ook marketingpagina's per verzoek sessie/databasewerk doen en live `private, no-cache, no-store` teruggeven. | Isoleer sessie-afhankelijke UI zodat publieke pagina's cachebaar blijven; meet daarna Neon-wakeups en responstijd. |
| CODEX-102 | `/inloggen?terug=...` gaat ongewijzigd naar `redirect()` en Auth.js `redirectTo`. | Accepteer alleen een interne padnaam die met één `/` begint; val anders terug op `/leerpad`. Dit voorkomt een open redirect. |
| CODEX-103 | De mobiele header is breder dan een 390px viewport (gemeten documentbreedte 492px). Logo, CTA, auth en twee navigatielinks staan tegelijk in één rij. | Maak een echt mobiel menu of verberg secundaire elementen onder een breakpoint. Test 320, 375 en 390px. |
| CODEX-104 | `POST /api/voortgang` controleert de gebruiker maar niet of die de betaalde cursus bezit. De server begrenst de opgegeven score, maar kan niet bewijzen hoeveel antwoorden juist waren. | Controleer entitlement vóór voortgang op betaalde cursussen en laat de server quizantwoorden beoordelen of behandel XP/certificaat expliciet als niet-verifieerbare gamification. |
| CODEX-105 | “Voortgang wissen” wist alleen de lokale state; bij een ingelogde gebruiker keert de serverstate terug. | Ofwel een echte server-delete met extra bevestiging bouwen, of de knop voor ingelogde gebruikers hernoemen/verbergen. |
| CODEX-106 | De ordermail zegt nog dat voortgang alleen in de browser staat, terwijl server-synchronisatie inmiddels gebouwd is. | Kopie bijwerken en een regressietest op de belangrijkste mailclaims toevoegen. |
| CODEX-107 | De checkout rekent centen terug uit een weergavetekst met regex. | Bewaar `priceCents` als getal; genereer de Nederlandse weergavetekst daarvan. |
| CODEX-108 | Certificaten hebben geen servercontrole, slaagdrempel of verifieerbare id. | Kies bewust tussen deelnamebewijs en toetscertificaat; controleer aankoop en afronding op de server. |
| CODEX-109 | Er zijn geen algemene browserbeveiligingsheaders geconfigureerd en Next toont `X-Powered-By`. | Voeg na compatibiliteitstests ten minste frame-, content-type-, referrer- en permissions-beleid toe; ontwerp CSP apart vanwege Auth/Mollie/Payload preview. |
| CODEX-110 | De dependency-audit gaf op 2 augustus drie hoge en één middelhoge melding, via de geïnstalleerde Next-lijn en onderliggende pakketten. | Laat CI dit melden en plan een geteste Next-upgrade; gebruik niet blind de door `npm audit fix` voorgestelde major downgrade. |

### P2 — product, vertrouwen en vindbaarheid

- Bied één representatieve voorbeeldles of duidelijke preview van de betaalde ervaring.
- Voeg echte menselijke geloofwaardigheid toe: een recente foto, relevante ervaring,
  inhoudelijk reviewproces en heldere grenzen van de opleiding. Geen verzonnen reviews.
- Maak de koopbelofte operationeel concreet: hoe snel antwoord, hoe terugbetaling werkt,
  wat “levenslang” praktisch betekent en wat de cursist precies krijgt.
- Meet minimaal de funnel `cursus bekeken → checkout gestart → betaling afgerond → eerste
  les → cursus afgerond`. Kies privacyvriendelijke, proportionele meting en pas de
  privacy/cookiekeuze aan zodra tracking werkelijk wordt toegevoegd.
- Test vóór meer content vijf echte beginners op navigatie, vertrouwen, koopbesluit en
  eerste les. Dat geeft meer besluitinformatie dan extra visuele polish.
- Zet betaalde les-URL's niet automatisch in de sitemap als de zoekresultaatpagina alleen
  een slot toont; geef `/leerpad` eigen metadata en houd redirects bij elke slugwijziging.

## Payload nu toevoegen: baten en kosten

### Waarom “nu” rationeel kan zijn

Payload sluit inhoudelijk goed aan op de gewenste werkwijze:

- een echte browser-editor zonder pagina's te slepen;
- drafts, versiegeschiedenis, diff en terugzetten;
- getypeerde collections en gegenereerde TypeScript-types;
- een admin-paneel in dezelfde Next.js-repository;
- lokale server-API, zodat cursusinhoud niet via een los extern CMS hoeft te reizen;
- later rollen voor een tweede redacteur, planning, media en preview.

Als Jason nu al regelmatig tekst wil wijzigen zonder een code-agent of als de catalogus
de komende maanden hard groeit, is dit geen theoretische behoefte. Dan voorkomt vroeg
modelleren een tweede ronde handmatig contentbeheer.

### De concrete nadelen in deze repository

1. **De geïnstalleerde Next-versie wordt op dit moment niet officieel ondersteund.** De
   app draait `next@15.5.22`. De actuele Payload-installatiepagina noemt specifieke
   reeksen `15.2.x`, `15.3.x`, `15.4.x` of `16.2.6+`; `15.5.x` staat er niet tussen.
   Eerst moet dus bewust worden gekozen tussen pinnen op een ondersteunde 15.4-versie en
   een geteste upgrade naar Next 16. “Payload installeren” is daardoor ook een
   frameworkmigratie.
2. **De bestaande grens is logisch goed, maar technisch niet plug-and-play.** `getCourse()`
   is nu een synchrone arraylookup en heeft ten minste veertien aanroepen in
   entitlement, checkout, voortgang, mails, metadata en pagina's. Een databasequery is
   asynchroon. Ook `activeCourses`, sitemapgeneratie en server-XP-herberekening lezen
   direct uit de module. De claim in `docs/cms-keuze.md` dat “niets anders verandert” is
   daarom te optimistisch.
3. **Er komen twee databases en twee migratiestelsels.** Dat is veiliger dan Payload en
   accounttabellen in hetzelfde schema, maar het betekent ook twee connection strings,
   twee sets migraties, twee restore-tests en aparte Preview/Development-isolatie.
4. **Publiceren wordt een runtime- en cacheprobleem.** Nu zit content in de build en is een
   commit de publicatie. Met Payload moeten caching, invalidatie, drafts, previews en het
   gedrag bij CMS-database-uitval expliciet worden ontworpen.
5. **Er komt een tweede authenticatie- en autorisatievlak.** Payloads Local API slaat
   access control standaard over (`overrideAccess: true`). Dat kan prima zijn voor
   vertrouwde servercode, maar een onbedoeld endpoint of previewpad kan daarmee concepten
   of quizantwoorden blootleggen. Adminrollen, publieke REST/GraphQL-routes en veldselectie
   moeten dus getest beleid krijgen.
6. **Zelf hosten geeft controle, niet automatisch minder beheer.** Jason wordt eigenaar
   van Payload-upgrades, migraties, adminbeveiliging, koude starts, mediastorage en
   restore-oefeningen. Dat is een redelijke prijs als de editor echt gebruikt wordt, maar
   verspilling zolang alle wijzigingen toch door een ontwikkelagent gaan.
7. **Meer versies kosten opslag.** Payload bewaart bij versiebeheer volledige
   documentversies in extra tabellen. Stel daarom een bewuste retentie in.

### Mijn besluit

Ik zou Payload **niet afwijzen** en ook niet wachten tot honderden lessen. Ik zou het nu
behandelen als een **reversibele architectuurproef**, met drie poorten:

1. **Vangrails (eerst):** omgevingsisolatie bewijzen, CI laten draaien, Mollie-testtoegang
   sluiten vóór verkeer, backups/restore benoemen en kritieke fouten laten alarmeren.
2. **Verticale Payload-proef:** op een branch en Preview, met eigen Development/Preview
   contentdatabase. Kies eerst een ondersteunde Next-versie. Migreer alleen de blog of één
   gratis cursus. Gebruik de Local API uitsluitend server-side, test dat drafts en
   quizantwoorden niet publiek zijn, en bewijs export, backup, caching en preview.
3. **Go/no-go:** pas na een groene build, securitytest, rollback en een week echt
   redactiewerk de betaalde cursussen migreren. Componenten, routes, prijzen,
   `heeftToegangTot()` en aankopen blijven buiten het CMS en onder Git-controle.

Dit levert precies de gewenste middenweg: **de content kan hands-off via een normale
editor, terwijl vormgeving, beveiliging en bedrijfslogica volledig van Jason blijven.**

## Het gewenste beheerbeeld

| Soort wijziging | Beste eigenaar en gereedschap |
|---|---|
| Lestekst, blog, afbeelding, draft | Payload, na de proef |
| Layout, component, design tokens | Git + preview + CI |
| Prijs, checkout, entitlement, webhook | Applicatiecode + tests, nooit CMS |
| Klant helpen, mail opnieuw sturen, terugbetaling/intrekking | Klein intern operations-scherm |
| Storing, webhookfout, dependencyrisico | Automatische melding met duidelijke eigenaar |
| Databaseherstel | Beheerde backups plus periodieke restore-test |

## Aanbevolen vervolgvolgorde

1. Database- en Vercel-omgevingen in Jasons eigen browser verifiëren en de uitkomst in
   dit document plus `docs/openstaand.md` zetten.
2. De P0-vangrails afronden; dit is een kleine veiligheids- en beheerfase, geen rewrite.
3. Voor Payload een korte ADR maken met de gekozen Next-versie, databases per omgeving,
   API-beleid, cache-invalidatie, mediaopslag, backup/export en rollback.
4. De verticale proef uitvoeren zonder betaalde cursusinhoud te verplaatsen.
5. Jason laat zelf twee of drie echte contentwijzigingen uitvoeren. Alleen doorgaan als
   dat aantoonbaar prettiger is dan het huidige Git-proces.
6. Daarna pas bredere contentmigratie en nieuwe productfunctionaliteit plannen.

## Verificatiestatus en bronnen

**Lokaal geverifieerd:** code, documentatie, build-/TypeScript-resultaten uit de audit,
mobiele liveweergave, HTTP-gedrag, dependencyversies en het lokale Neon-endpoint. Er zijn
door deze review geen applicatiebestanden of externe instellingen gewijzigd.

**Vercel/Neon geverifieerd in Jasons eigen Chrome:** Vercel heeft via de Marketplace
automatisch de Neon-resource `beleggingscollege-db` geprovisioneerd. Daar was geen vooraf
handmatig aangemaakt Neon-account voor nodig. De Neon-console is nu geactiveerd met
`accounts@jasonkrijgsman.com`, binnen de automatisch aangemaakte organisatie
`Vercel: Visual Future`. De console toont voor dit project momenteel precies één branch:
`main`. Vercel blijft intussen de plek waar de resource, projectkoppeling en geïnjecteerde
secrets worden beheerd.

| Omgeving | Neon-branch/database | Status |
|---|---|---|
| Local (`.env.local`) | Primaire branch, database `neondb` | **Deelt productie**; lokaal endpoint is gelijk aan het primaire endpoint in Vercel |
| Vercel Production | Primaire branch, database `neondb` | Correct voor productie |
| Vercel Preview | Tijdelijke branch per Preview-deployment | **Isolatie geconfigureerd** via `Actions: Neon`; tijdens de audit was geen Preview-branch actief |
| Vercel Development | Geen Vercel-resourcekoppeling | CLI-omgeving bestaat, maar heeft geen eigen Neon-branch via deze koppeling |

De regel “Production and Preview” naast `DATABASE_URL` betekent alleen dat de resource in
beide Vercel-omgevingen beschikbaar is. Het bewijs voor Preview-isolatie is de ingeschakelde
Neon deployment action: die maakt bij een Preview-deployment een copy-on-write branch en
levert voor die deployment vervangende databasevariabelen. De nog uit te voeren actie is
daarom kleiner en preciezer: maak één vaste Neon Development-branch en laat
`.env.local` daarnaar wijzen. Dat de console nu alleen `main` toont, is dus niet in strijd
met de configuratie: er was op het controlemoment geen actieve Preview-branch.

Belangrijkste primaire bronnen voor de Payload-afweging:

- [Payload — Installation en ondersteunde Next.js-versies](https://payloadcms.com/docs/getting-started/installation)
- [Payload — Local API en `overrideAccess`](https://payloadcms.com/docs/local-api/access-control)
- [Payload — Postgres en migraties](https://payloadcms.com/docs/database/postgres)
- [Payload — Versions](https://payloadcms.com/docs/versions/overview)
- [Payload — Drafts](https://payloadcms.com/docs/versions/drafts)
- [Payload — Deployment](https://payloadcms.com/docs/production/deployment)
- [Vercel — Neon Marketplace met automatische accountprovisioning](https://vercel.com/changelog/neon-now-available-on-vercel-marketplace)
- [Neon — geïsoleerde branch per Vercel Preview-deployment](https://neon.com/blog/neon-vercel-native-integration)
