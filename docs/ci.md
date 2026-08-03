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

## Wat de tests afdekken (±140 tests, `test/` — het aantal groeit mee met de catalogus doordat de content-invarianten per cursus en per vraag draaien)

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
uit `src/content/courses/`, vers uit de bron gelezen (vrijwel alle — vragen
korter dan 20 tekens of met een backslash-escape matchen na minificatie niet
betrouwbaar en worden overgeslagen — een cursusbestand dat helemáál geen
naalden meer oplevert laat het script luid falen). Idee: de HTML controleren
was precies de fout waardoor het importlek van augustus 2026 maandenlang
onzichtbaar bleef; de bundel is de waarheid.

**Let op: de oude handmatige grep (`grep -rl "correctIndex"`, tot 3 aug het
voorschrift in CLAUDE.md) geeft inmiddels een vals alarm.** QuizBlock en QuizReview lezen
`q.correctIndex` client-side om de quiz van de geopende les na te kijken; die
property-toegang staat legitiem in de chunk van de lespagina. De data zelf
(`correctIndex:` in een object-literal) hoort daar nooit te staan. De
controle is geverifieerd in beide richtingen: een geplante lek-chunk geeft
exit 1, de echte build exit 0.

## Zelf tests toevoegen — de drie patronen

Nieuwe tests horen in `test/*.test.ts` en draaien automatisch mee. De
niet-vanzelfsprekende stukken, af te kijken uit de bestaande bestanden:

- **Databasetest:** begin het bestand met
  `vi.mock("@/db", () => import("./helpers/pglite-db"));` en gebruik
  `leegAlleTabellen()` + `maakGebruiker()` uit die helper in `beforeEach`.
  Elk testbestand krijgt automatisch zijn eigen verse PGlite met de echte
  migraties; binnen een bestand maakt `leegAlleTabellen()` schoon schip.
- **Mollie/auth/mail mocken:** het `vi.hoisted`-patroon bovenin
  `test/mollie-webhook.test.ts` — vi.mock wordt gehoist, dus gewone
  variabelen in de factory geven een "cannot access before initialization".
- **`server-only` en JSX** regelt `vitest.config.mts` al: het pakket is een
  stub, en JSX compileert via de `oxc`-optie (Vitest 4 bundelt Vite 8 /
  Rolldown — het oude `esbuild`-veld wordt stil genegeerd; dáár zoeken als
  een `.tsx`-import ooit "invalid JS syntax" geeft).

## Twee losse gereedschappen naast de poort (sinds 3 aug 2026)

Beide draaien bewust NIET in `npm run controle` of CI — het zijn
instrumenten voor de ontwikkelaar, geen slagbomen:

- **`npm run test:coverage`** — dezelfde testrun, met een dekkingsrapport
  (terminal + `coverage/index.html`). Zonder drempels: componenten draaien
  in de browser en scoren hier terecht laag. Waar je op let is `src/lib` en
  `src/app/api` — dáár hoort de dekking hoog, en een nieuw bestand op 0%
  in die mappen is een gat (zo werd `src/lib/opties.ts` gevonden).
- **`npm run test:e2e`** — de Playwright-rooktest (`e2e/rooktest.spec.ts`)
  tegen een echte productieserver (`next start`, poort 3100): homepage,
  catalogus, een gratis les inclusief volledig doorgeklikte quiz, en de
  controle dat een betaalde les voor een anonieme bezoeker dicht zit én
  geen lesinhoud in de HTML lekt. Bouwt zelf als er geen `.next` ligt;
  geen database of geheimen nodig (zie `playwright.config.ts`). Eerste
  keer: `npx playwright install chromium`.

### De poort wordt van twee kanten getest — en waarom niet allebei in de browser

De rooktest bewijst dat een betaalde les **dicht** zit voor een anonieme
bezoeker. Het spiegelbeeld — dat hij ook echt **open** gaat voor wie betaald
heeft — staat in `test/lespagina.test.ts`, en dat is bewust géén browsertest.

Voor de browserversie zou de draaiende server een échte database nodig hebben
(de Neon-driver praat over HTTP, PGlite draait in-process) plus een geldige
sessiecookie. De enige manier om die werelden te laten raken is een testluik
in `src/db/index.ts` — precies het bestand waar CLAUDE.md voor waarschuwt en
waar authenticatie, aankopen en voortgang samenkomen. Dat risico weegt niet op
tegen wat het extra bewijst.

`test/lespagina.test.ts` toetst daarom het server component zelf, mét de echte
`heeftToegangTot` en echte aankooprijen in PGlite; alleen de sessie is nep.
Gedekt: koper ziet de volledige les, en op slot bij uitgelogd, ingelogd zonder
aankoop, een aankoop van een ándere cursus, een aankoop van iemand anders, en
elke niet-`paid` status. Wat er níét in zit is of de browser het vervolgens
schildert — dat dekt de rooktest af op de gratis les, die dezelfde component
en dezelfde `LessonRunner` gebruikt.

Beide richtingen zijn met mutatietests geverifieerd: een poort die iedereen
weigert laat de kopertest omvallen, een poort die iedereen doorlaat laat de
zeven slot-tests omvallen.

## De slagboom (sinds 3 aug 2026) en zijn restrisico

Main is beschermd: vereiste status check **"CI"**, óók voor admins, mét
strict-mode (een PR moet up-to-date zijn met main vóór de merge, dus de
combinatie van parallelle PR's is altijd getest). Auto-merge staat aan:
`gh pr merge --auto --squash` direct na het openen, en de PR merget
zichzelf zodra CI groen is. Direct naar main pushen wordt geweigerd.

Restrisico: Vercel deployt de merge-commit meteen, nog vóór de
post-merge-run op main klaar is. Door strict-mode is die run een herhaling
van wat al groen was, dus dit is vrijwel altijd theoretisch — maar wordt
main tóch rood, dan opent de `alarm`-job in de workflow automatisch een
GitHub-issue met commit en run-link, zodat het nooit stil blijft.

## Bewuste beperkingen — lees dit vóór je erop leunt

1. **Een handvol bestaande lint-warnings** (ongebruikte variabelen in o.a.
   `scripts/plattegrond.mjs`, `src/app/cursussen/[slug]/page.tsx`,
   `src/app/leerpad/page.tsx`, `src/components/lab/SceneStad.tsx`) is
   bewust blijven staan: die bestanden waren op het moment van bouwen in
   bewerking door parallelle sessies. Errors laten CI falen; warnings niet —
   controleer bij nieuwe code dus zélf `npm run lint`, anders groeit de stapel
   stilletjes (dat gebeurde op 3 aug met twee hook-warnings in nieuwe tools;
   die zijn inmiddels opgelost).
2. **Client en server tellen de streak verschillend.** De client houdt de
   streak in leven bij élke afgeronde les op een nieuwe dag (ook een
   herhaalde); de server alleen bij een níéuwe les. Beide gedragingen zijn nu
   exact vastgepind in tests; welke van de twee de bedoeling is, is een
   productkeuze die nog gemaakt moet worden.
3. **CODEX-107 blijft open:** de prijs wordt nog steeds met een regex uit de
   weergavetekst gerekend. Wel bewaakt een catalogustest nu dat elke prijs
   het eenvoudige formaat houdt, zodat de bekende duizendtallen-zwakte niet
   stil kan toeslaan.

## Uitslag van de verificatierun (3 aug 2026)

Verse worktree op `ci-fundament`, `npm ci`, geen `.env.local`:
`npm run controle` → exit 0. Typecheck schoon; lint 0 errors (een handvol
bekende warnings); **alle tests groen** (12 bestanden, ~4 s; 121 op het
bouwmoment, het aantal groeit mee met de catalogus); productiebuild
compleet; bundelcontrole vond niets (aantallen chunks/vragen groeien mee). De branch is daarna nog door een adversariële
review gehaald (16 agents, elke bevinding door een scepticus geverifieerd,
inclusief mutation testing op de datumcontrole); de zeven bevestigde
bevindingen zijn verwerkt en de poort is opnieuw groen gedraaid.
