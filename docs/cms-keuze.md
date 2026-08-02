# CMS-keuze: Payload, geverifieerd

Laatst bijgewerkt: 2 augustus 2026. Beslissing genomen op Jasons ontwerpprincipe
"we bouwen voor schaal, niet voor hopelijk ooit schaal" — met elke claim geverifieerd
tegen bronnen van augustus 2026, niet tegen trainingskennis. Bronnen staan per punt in
het verificatierapport; de belangrijkste staan hieronder inline.

## Het besluit

**Payload CMS** wordt het thuis van de cursusinhoud zodra we content uit de
TypeScript-bestanden verhuizen. Niet Drupal, niet Strapi, niet Directus.

De beslissing is nu genomen, de verhuizing zelf nog niet gepland — zie
`docs/architectuur.md` voor de drempel waarop hij loont. Dat is bouwen voor schaal in
de juiste vorm: de grens vastleggen (alles leest content via `getCourse()` /
`catalogus()`), zodat de binnenkant verwisselbaar is op de dag dat het nodig is.

## Waarom Payload — geverifieerd, niet aangenomen

| Claim | Uitkomst |
|---|---|
| MIT-licentie, gratis zelf te hosten incl. admin, ook commercieel | **Klopt.** Enterprise-laag (~$10k/jr) bevat niets wat wij nodig hebben |
| Draait ín een bestaande Next.js App Router-app, admin op `/admin`, geen aparte server | **Klopt.** Vereist Node 20.9+ en Next ≥ 15.4.11 — wij draaien 15.5.22, dus goed |
| Werkt met Neon Postgres via Drizzle | **Klopt.** Neon heeft er een eigen officiële gids voor; pooled connection string is verplicht |
| TypeScript-types uit de content, drafts, versiegeschiedenis, localisatie | **Klopt.** `payload generate:types`; versies met diff en terugzetten zitten in de gratis kern |
| Media op Vercel Blob | **Klopt.** First-party adapter; centenwerk op onze schaal, Cloudflare R2 als goedkoper alternatief |
| Levend project | **Klopt.** v3.87.0 verscheen 31 juli 2026; release-cadans van 2–3 weken |

## De twee dingen die de verificatie corrigeerde

Dit is waarom we verifiëren voordat we beslissen — beide stonden anders in mijn
oorspronkelijke advies.

**1. Payload is sinds 17 juni 2025 van Figma.** De licentie is en blijft MIT (op
uitgebrachte code onherroepelijk), zelf hosten blijft gratis, en de release-cadans loopt
gewoon door. Maar Payload Cloud is dichtgezet voor nieuwe klanten en de roadmap beweegt
richting een "Figma CMS". Voor ons scenario (zelf hosten, in eigen app) verandert er
niets acuut — maar het is een koersrisico dat in de gaten gehouden moet worden. Mocht de
open-sourcelijn ooit verschralen, dan is de exit precies waarom de `getCourse()`-grens
bestaat: content eruit exporteren en een andere binnenkant kiezen raakt de rest van de
app niet.

**2. "Eigen Postgres-schema, dus geen botsing met onze migraties" was te optimistisch.**
De `schemaName`-optie staat in Payloads eigen documentatie als *experimental* en heeft
een bughistorie (schema- en enum-migratieproblemen, waarvan in 2026 nog issues open
staan). Bovendien voert Payload hoe dan ook zijn éigen migratiesysteem — je krijgt dus
twee migratiestelsels naast elkaar, wat er ook gebeurt.

**Daarom de aangescherpte regel: Payload krijgt een eigen dátabase, geen eigen schema.**
Neon laat meerdere databases in één project toe; Payload krijgt er een voor zichzelf,
met een eigen connection string. Onze Drizzle-migraties (accounts, aankopen, voortgang)
en die van Payload (content) kunnen elkaar dan letterlijk niet raken. Verder: Payloads
dev-push-modus uit in productie, en de pooled (-pooler) verbinding gebruiken — de gratis
Neon-laag staat maar 10 directe verbindingen toe.

## Wat er verder in de verwachtingen hoort

- **Cold starts**: het admin-paneel op Vercel serverless heeft gedocumenteerde koude
  starts van ~7 seconden; de gangbare oplossing is een keep-warm-cron. Voor één redacteur
  hinderlijk, geen blokkade.
- **Let bij het nalezen van kritiek op de datum**: veel vindbare klachten over "Payload op
  serverless" gaan over 1.x/2.x, toen Payload nog een Express-app was. Die zijn voor 3.x
  achterhaald.

## Waarom de rest afviel — stand augustus 2026

- **Strapi** — de core is netjes MIT, maar Strapi's eigen documentatie zegt expliciet dat
  de backend níét op Vercel hoort: hij eist een eigen, continu draaiende server. Strapi
  Cloud heeft geen gratis laag meer (goedkoopste plan $35/mnd per project). Dus: tweede
  systeem plus vaste kosten, precies wat we niet willen.
- **Directus** — wisselde in mei 2026 opnieuw van licentie (BSL 1.1 → "MSCL", met
  handhaving via registratiesleutels; gratis gebruik is nu een grant met
  registratieplicht, geen open-sourcelicentie). Twee licentiewijzigingen in een paar jaar
  is zelf het risicosignaal. Eist bovendien een eigen server.
- **Drupal** — vereist een volledige tweede stack (PHP 8.3+, webserver, database, eigen
  patchregime) naast de Next.js-app. De 2026-vernieuwingen (Drupal CMS 2.0, Canvas)
  richten zich op Drupals éigen front-end, niet op headless. Sterk product, verkeerde
  wereld.
- **Keystatic** — de eervolle tweede: MIT, aantoonbaar actief (laatste commits eind juli
  2026), content als bestanden in git met een bewerk-UI erop. Maar pre-1.0 (0.6.4) en
  door de makers zelf "experimental" genoemd. Als we ooit alleen "browser-bewerken op het
  huidige model" willen zonder database-stap, is dit de kandidaat.
- **Nieuwe spelers** — geen serieuze nieuwe Next.js-native OSS-CMS'en gevonden sinds
  2025. Puck is een page-builder-component (geen CMS), Outstatic een kleiner
  git-gebaseerd alternatief.

## Het verhuisplan, wanneer het zover is

1. Payload in de bestaande app installeren; **eigen Neon-database**, pooled verbinding,
   push-modus uit in productie.
2. Collections definiëren die `src/content/types.ts` spiegelen (Course → Module →
   Lesson → QuizQuestion, inclusief `tool`, `bookRefs`, `keyTakeaways`).
3. De drie cursussen eenmalig importeren met een script (de content ís al typed data —
   de import is triviaal).
4. `getCourse()` / `catalogus()` herimplementeren op Payloads Local API. **Niets anders
   verandert**: view-modellen, `heeftToegangTot()`, de server-only-regel en alle
   pagina's merken er niets van.
5. Media-adapter naar Vercel Blob (of R2 zodra volume telt).
6. De vaste regels blijven: **de CMS bewaart content en beslist nooit over toegang** —
   `heeftToegangTot()` blijft de enige poort; en client-componenten krijgen nog steeds
   uitsluitend view-modellen, nooit ruwe content.
