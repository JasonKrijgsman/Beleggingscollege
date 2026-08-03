# CI en tests — het hek vóór het betaalpad

Laatst bijgewerkt: 3 augustus 2026.

Elke push naar `main` deployt automatisch naar productie. Dit document beschrijft
het hek dat daarvoor staat: welke controles er draaien, waarom ze geen enkel
geheim nodig hebben, en wat er bewust (nog) níét is.

## Eén commando

```bash
npm ci
npm run controle
```

Dat is alles wat een verse checkout nodig heeft. `controle` draait achter
elkaar: `typecheck` (tsc --noEmit), `lint` (ESLint), `test` (Vitest),
`build` (next build) en `controleer:bundel` (de lekcontrole hieronder).
GitHub Actions (`.github/workflows/ci.yml`) draait exact dezelfde stappen bij
elke pull request en elke push naar `main`, op Node 22 met `npm ci`.

Losse commando's: `npm run typecheck`, `npm run lint`, `npm run test`
(of `test:watch`), `npm run controleer:bundel` (vereist een verse build).

## Geen geheimen, geen echte database — bewust

De hele pijplijn draait zonder één omgevingsvariabele. Dat is geverifieerd
(3 aug 2026) in een werkmap zonder `.env.local`: alle stappen slaagden.

- **Database:** de tests draaien tegen **PGlite**, een in-memory Postgres, met
  de échte migraties uit `drizzle/` (zie `test/helpers/pglite-db.ts`). De
  where-clausules, unieke indexen en onConflict-regels worden dus echt
  uitgevoerd — er wordt geen SQL nagespeeld. `next build` zelf werkt zonder
  `DATABASE_URL` door de placeholder in `src/db/index.ts`.
- **Mollie, Auth.js en mail** worden per test gemockt; `server-only` is in
  Vitest een lege stub (`test/stubs/server-only.ts`) — in productie blijft het
  echte pakket de importgrens bewaken.

Heeft een stap ooit "toch even een echte key" nodig, dan is dat een
ontwerpfout in die stap.

## Wat de tests afdekken (121 tests, `test/`)

| Gebied | Bestand(en) |
| --- | --- |
| Catalogusprijs → exact bedrag bij Mollie, "prijs nooit uit het verzoek" | `prijs.test.ts`, `checkout.route.test.ts` |
| Webhook: bedrag- én valutacontrole, idempotentie (incl. stabiele `paidAt`), payload wordt niet geloofd, dichte winkel zonder key | `mollie-webhook.test.ts`, `orderbevestiging.test.ts`, `mollie-niet-geconfigureerd.test.ts` |
| Toegang: alleen ingelogd mét `purchases.status = 'paid'` | `entitlements.test.ts` |
| XP-regels, herhaalde lessen, streak, badges — client én server | `voortgang-regels.test.ts`, `voortgang-server.test.ts`, `levels.test.ts` |
| Open redirect `/inloggen?terug=` (CODEX-102, opgelost) | `veilig-pad.test.ts`, `inloggen-terug.test.ts` |
| Server/client-contentgrens: geen lesinhoud in view-modellen | `content-grens.test.ts` |

Drie kleine refactors maakten dit testbaar, alle drie gedragsbehoudend:
`prijsInCenten()` verhuisde naar `src/lib/prijs.ts` (routebestanden mogen
niets extra exporteren), de rekenkern van `completeLesson()` naar
`src/lib/voortgang-regels.ts` (puur, klokvrij), en de nieuwe
`veiligTerugPad()` in `src/lib/veilig-pad.ts` dicht de open redirect — dat
laatste is de enige gedragswijziging, met regressietests op validator- én
paginaniveau.

## De bundel-lekcontrole

`scripts/controleer-bundel.mjs` doorzoekt ná de build álle publieke JS-chunks
(`.next/static/chunks/`) op twee dingen: de datavorm van het antwoordveld
(`correctIndex:` én de JSON-variant `"correctIndex":`) en de quizvraag-zinnen
uit `src/content/courses/`, vers uit de bron gelezen (85 van de 88; vragen
korter dan 20 tekens of met een backslash-escape matchen na minificatie niet
betrouwbaar en worden overgeslagen — een cursusbestand dat helemáál geen
naalden meer oplevert laat het script luid falen). Idee: de HTML controleren
was precies de fout waardoor het importlek van augustus 2026 maandenlang
onzichtbaar bleef; de bundel is de waarheid.

**Let op: de oude handmatige grep uit CLAUDE.md (`grep -rl "correctIndex"`)
geeft inmiddels een vals alarm.** QuizBlock en QuizReview lezen
`q.correctIndex` client-side om de quiz van de geopende les na te kijken; die
property-toegang staat legitiem in de chunk van de lespagina. De data zelf
(`correctIndex:` in een object-literal) hoort daar nooit te staan. De
controle is geverifieerd in beide richtingen: een geplante lek-chunk geeft
exit 1, de echte build exit 0.

## Bewuste beperkingen — lees dit vóór je erop leunt

1. **CI is een struikeldraad, nog geen slagboom.** Vercel deployt bij elke
   push naar `main`, óók als de workflow rood wordt. Pas met branch
   protection (require status check "CI" + alleen via PR's) wordt dit een
   echt hek. Dat is een GitHub-instelling, geen code, en staat nog open in
   `docs/openstaand.md`.
2. **Vijf bestaande lint-warnings** (ongebruikte variabelen in
   `scripts/plattegrond.mjs`, `src/app/cursussen/[slug]/page.tsx`,
   `src/app/leerpad/page.tsx`, `src/components/lab/SceneStad.tsx`) zijn
   bewust blijven staan: die bestanden waren op het moment van bouwen in
   bewerking door parallelle sessies. Errors laten CI falen; warnings niet.
3. **Client en server tellen de streak verschillend.** De client houdt de
   streak in leven bij élke afgeronde les op een nieuwe dag (ook een
   herhaalde); de server alleen bij een níéuwe les. Beide gedragingen zijn nu
   exact vastgepind in tests; welke van de twee de bedoeling is, is een
   productkeuze die nog gemaakt moet worden.
4. **CODEX-107 blijft open:** de prijs wordt nog steeds met een regex uit de
   weergavetekst gerekend. Wel bewaakt een catalogustest nu dat elke prijs
   het eenvoudige formaat houdt, zodat de bekende duizendtallen-zwakte niet
   stil kan toeslaan.

## Uitslag van de verificatierun (3 aug 2026)

Verse worktree op `ci-fundament`, `npm ci`, geen `.env.local`:
`npm run controle` → exit 0. Typecheck schoon; lint 0 errors (5 bekende
warnings); **121 tests, 12 bestanden, alles groen** (~4 s); productiebuild
compleet; bundelcontrole "52 chunks doorzocht op `correctIndex:` en 85
quizvragen; niets gevonden". De branch is daarna nog door een adversariële
review gehaald (16 agents, elke bevinding door een scepticus geverifieerd,
inclusief mutation testing op de datumcontrole); de zeven bevestigde
bevindingen zijn verwerkt en de poort is opnieuw groen gedraaid.
