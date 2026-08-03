# De cursusfabriek — het recept waarmee de cursussen van 3 aug 2026 zijn gebouwd

Op 3 augustus 2026 groeide de catalogus in één dag van vier naar negen cursussen
(de optieladder, Hefboomproducten, Beleggingspsychologie als echte cursus in
plaats van teaser, Indexbeleggen & ETF's), met twaalf nieuwe interactieve tools
(vijftien totaal). Dit document is het recept, zodat cursus tien niet opnieuw
uitgevonden hoeft te worden. De prioriteitenlijst voor wat er ná komt:
`docs/volgende-cursussen.md`.

## Het stappenplan

1. **Branch vanaf verse `origin/main`** in een eigen worktree
   (`.claude/worktrees/…`) — nooit in de gedeelde checkout; zie de
   parallelle-sessies-les onderaan.
2. **Plumbing eerst** (alles in kleine, mechanische edits):
   - `src/content/types.ts`: nieuwe `LessonTool`-waarde(n), eventueel nieuwe
     `CourseAccent` en `CourseIcon`.
   - Nieuwe accentkleur? Volledige schaal (50–950) in `src/app/globals.css`
     @theme + een blok in `src/lib/accent.ts` + (bij nieuw icoon) een regel in
     `src/components/CourseIcon.tsx`. Bestaande accenten: blauw, groen, navy,
     paars, petrol (optieladder), oranje (hefboom/waarschuwing), leisteen
     (indexbeleggen).
   - `src/components/lesson-tools.tsx` is een **volledige `Record`**: een
     nieuwe `LessonTool`-waarde zonder registratie breekt de build — expres.
3. **Content via een agent, met een strak briefje.** Wat aantoonbaar werkt:
   - Stijlanker: laat de agent `src/content/courses/waardebeleggen.ts` volledig
     lezen en de vorm exact spiegelen (`import type { Course } … export default`).
   - Leg vast in de brief: slug/titel/level/accent/icoon/prijs/order, de
     volledige module- en lesstructuur mét lesslugs en toolplaatsing,
     durationMin 8–10, xp 50, quiz 4 vragen met gevarieerde correctIndex,
     boekankers met eerlijke leesgewicht-notities, en de merkregels
     (je/jij, EUR-notatie, verliesscenario in elk rekenvoorbeeld, "opleider
     geen adviseur", geen rendementsbeloftes, geen fonds-/tickernamen als
     aanbeveling, fiscaliteit alleen met peildatum).
   - Grote bestanden (~1000 regels) in stukken laten schrijven: eerst Write
     met module 1, daarna Edit-appends. Laat de agent zelf `tsc` en `vitest`
     draaien.
   - De agent schrijft alléén het cursusbestand; `src/content/index.ts` wire
     je zelf (import + array).
4. **Tools** zijn losse client components (`"use client"`), Nederlandse
   identifiers, en houden zich aan vaste conventies:
   - Wrapper `my-8 rounded-2xl border-2 border-<accent>-200 bg-<accent>-50/50`
     met de "Probeer het zelf"-kicker; SchuifVeld-patroon (label + schuif +
     nummerveld, aria-gekoppeld); `aria-live` op uitkomstblokken.
   - **Deterministisch en dataloos**: fictieve onderliggenden (Zeewind NV
     ± EUR 42, index NLX ± 900), vaste seeds (mulberry32), nooit echte tickers
     of live data. Optierekenwerk zit in `src/lib/opties.ts` (puur,
     bundelveilig) — niet opnieuw implementeren.
   - **Nooit `@/content` importeren** (server-only; de build faalt, en dat is
     de bedoeling — zie het bundellek-hoofdstuk in CLAUDE.md).
   - Elke tool eindigt met een eerlijk "Waar dit … ophoudt"-blok inclusief
     "geen beleggingsadvies".
   - Registreer de tool in `lesson-tools.tsx` én op `/lab/opties`
     (`src/app/lab/opties/page.tsx`) — de interne QA-pagina waar alle tools
     zonder aankoop te testen zijn.
5. **Verificatie:** in één keer met `npm run controle` (typecheck, lint,
   tests, build én bundelcontrole — exact wat CI draait, zie `docs/ci.md`),
   plus visueel op `/lab/opties` en de cursuspagina (dev server, zie
   valkuilen). Vergeet lint niet: op 3 aug slipten er twee hook-warnings
   doorheen omdat alleen vitest/build/bundel gedraaid werd.
6. **Shippen:** commit op de branch, `gh pr create`, direct
   `gh pr merge --auto --squash` — de PR merget zichzelf zodra CI groen is en
   elke merge naar main deployt naar productie. Main is beschermd; direct
   pushen wordt geweigerd. Is de branch "BEHIND", merge dan eerst
   `origin/main` erin en push opnieuw.

## Valkuilen die op 3 augustus echt geld/tijd kostten

- **Draai nooit `npm run build` terwijl de dev-server in dezelfde map leeft**:
  ze delen `.next` en de dev-server crasht daarna met
  "Cannot find module './vendor-chunks/…'". Herstel: server stoppen, `.next`
  weggooien, opnieuw starten.
- **Een branchwissel onder een draaiende dev-server** laat de pagina stil zijn
  hydratie verliezen: alles rendert, niets klikt. Zelfde herstel.
- **Twee sessies, één werkmap** heeft die dag twee keer ongecommit werk
  gewist. Bouw altijd in een eigen worktree; de gedeelde checkout is van
  niemand.
- **Elke `git push` draait lokaal eerst `npm test`** via `.githooks/pre-push`
  (geactiveerd door het `prepare`-script in package.json). Faalt je push op
  iets test-achtigs, kijk dáár; `git push --no-verify` is de nooduitgang.
- **`git worktree add` + `npm ci` + `.env.local` kopiëren** is de startritus
  van een verse worktree (het env-bestand is gitignored en verhuist niet mee).
  Let op: `.env.local` wijst naar de productiedatabase — lezen prima, niets
  muteren, geen testaankopen.
- De prijs komt uit `course.price` ("€49"/"€29") en wordt door
  `prijsTekstNaarCenten()` geparseerd; simpele bedragen werken, exotische
  formaten niet — `test/prijs.test.ts` bewaakt het.
- Screenshotchecks van tekst in hoofdletters: CSS `uppercase` verandert ook
  `innerText`, dus vergelijk case-insensitief.

## Wat een nieuwe cursus minimaal meebrengt (de lat van 3 aug)

Eén interactieve tool (liever twee), boekankers per les, quiz met uitleg die
onderwijst, een eerlijkheidsles ("waar deze methode ophoudt") en — waar het
onderwerp riskant is — het Hefboomproducten-stramien: leer de machine,
inclusief waarom de meeste gebruikers verliezen. Kale leestekst à €49 is de
lat van 2025, niet die van nu.
