# Samenwerken met andere sessies

Laatst bijgewerkt: 3 augustus 2026.

Aan dit project werken regelmatig **meerdere agentsessies tegelijk**. Op 3 augustus 2026
verschoof `main` op één dag ongeveer tien keer, door minstens vier sessies naast elkaar.
Dat is geen uitzondering die je kunt negeren; het is de normale toestand hier, en het
breekt aannames die in een repo met één schrijver altijd kloppen.

Dit document verzamelt wat dat kost en hoe je eromheen werkt. Het is geen stijlkwestie:
elk punt hieronder heeft die dag echt tijd gekost of bijna werk vernietigd.

## De gedeelde werkmap is niet van jou

`C:\Users\jason\CodingProjects\Beleggingscollege` wordt door élke sessie gebruikt. Op één
dag stond die checkout achtereenvolgens op `ci-testfundament`, `sitewide-review-…`,
`analytics-umami`, `neon-branchlimiet` en `agents-md-tegenstrijdigheid` — telkens omdat een
andere sessie van branch wisselde. Twee gevolgen:

- **Werk nooit rechtstreeks in de gedeelde werkmap.** Maak een worktree:
  `git worktree add .claude/worktrees/<naam> -b <branch> origin/main`. Dan kan een andere
  sessie niet onder je vandaan van branch wisselen.
- **Vertrouw `git status` in de hoofdmap niet als jouw toestand.** Wat daar staat is
  waarschijnlijk van iemand anders. Kom je ongecommitte wijzigingen tegen die niet van jou
  zijn: **laat ze staan.** Ze horen bij een sessie die nog loopt.
- `git checkout` van een branch die al in een andere worktree hangt, faalt met
  `already checked out at …`. Dat is de bescherming die werkt, geen fout in jouw aanpak.

## Kijk eerst wat er al loopt

`gh pr list` vóór je aan iets begint dat meerdere bestanden raakt. Overlapt een open PR met
jouw scope, leg het aan Jason voor in plaats van ernaast te bouwen. Op 3 augustus zijn twee
keer twee sessies aan hetzelfde punt begonnen; één keer bleek de betere oplossing van de
ánder te komen (zie hieronder bij AGENTS.md).

## CI toetst de samenvoeging, niet jouw branch

Dit is de valkuil die het vaakst toesloeg. **Groen bij jou is geen groen na de merge.**
GitHub draait CI op de merge van jouw branch mét `main`. Terwijl jij bouwde kan een andere
sessie tests hebben toegevoegd die jouw wijziging raken.

Concreet gebeurd: een branch met de betaalmodel-splitsing was lokaal groen op 228 tests;
in de samenvoeging faalde hij, omdat een parallelle sessie tests had toegevoegd die toegang
verleenden via de oude `purchases`-tabel — precies wat die branch verving. De tests waren
niet fout en de branch was niet fout; alleen de combinatie bestond nog nergens.

Dus: **verwacht dat je na een merge van `main` nog iets moet repareren**, en reserveer daar
tijd voor in plaats van te denken dat je klaar bent zodra je eigen poort groen is.

## Auto-merge werkt de branch niet zelf bij

Main staat op strict-mode: een PR moet up-to-date zijn met `main` voordat hij mag mergen.
`gh pr merge --auto --squash` wacht netjes op CI, maar **haalt `main` niet naar binnen**.
Blijft een PR op `BEHIND` staan, dan blijft hij daar eeuwig staan. Draai dan
`gh pr update-branch <nr>` (of merge `origin/main` in je branch) en laat auto-merge het
daarna afmaken.

## `git branch --no-merged` liegt hier

Alles wordt **squash-gemerged**. Daardoor is de commit van je branch nooit een voorouder
van `main`, ook al zit de volledige inhoud erin. `git branch --no-merged main` toont dus
tientallen branches die allang binnen zijn, en `git diff main <branch>` toont verschillen
in beide richtingen — óók alleen maar omdat `main` verder is gelopen.

Wil je weten of er werk verloren dreigt te gaan, kijk dan naar de **PR-status**
(`gh pr list --state all`), niet naar de branchtopologie. Staat de PR op `MERGED`, dan zit
de inhoud in `main`, punt.

## Een regel die je nú opschrijft, bereikt lopende sessies niet

`CLAUDE.md` wordt bij het starten van een sessie ingelezen. Schrijf je er halverwege de dag
een nieuwe werkafspraak in, dan zien sessies die al draaien die afspraak **niet** — die
werken met de versie van hun starttijd. Verwacht dus een naloop, en lees "die andere sessie
volgt de regel niet" niet als onwil: waarschijnlijk heeft hij hem nooit gezien.

## Soms is de oplossing van de ander beter

`AGENTS.md` liep 74 regels achter op `CLAUDE.md` en beschreef het geldpad en het
voortgangspad verkeerd. Twee sessies pakten dat tegelijk op. De ene wilde de twee bestanden
gelijktrekken; de andere haalde de kopie wég en maakte er een verwijzing plus regels van.
Dat tweede ruimt de hele klasse fouten op in plaats van één exemplaar — dus is dat gebleven,
en is het gelijktrek-werk weggegooid.

Kom je bij een merge-conflict een oplossing tegen die beter is dan de jouwe: neem die over.
Maar lees hem wel na — in datzelfde conflict stond in `main` óók een regel over DMARC die
inmiddels achterhaald was, en die moest juist uit de eigen branch komen. **Niet blind
"theirs", niet blind "ours".**

## Gedeelde infrastructuur loopt vol

Twee dingen raken op omdat iedereen ze gebruikt:

- **Neon-branches (gratis laag = 10).** Elke preview-deployment maakt er één; ze worden
  **niet** opgeruimd als de PR sluit. Op 3 augustus stond het twee keer op 10/10, en dan
  faalt élke preview-deployment met "Branch limit reached" — een rode Vercel-check die niets
  met jouw code te maken heeft. Vereiste check is `CI`, dus het blokkeert de merge niet,
  maar het kost je wel een half uur als je denkt dat je iets kapot hebt gemaakt.
- **Worktrees en lokale branches.** Die stapelen zich op. Opruimen mag, maar controleer
  eerst `git status` in élke worktree en laat er met rust wat van een lopende sessie is.

## Agents aansturen: vier dingen die misgingen

- **Subagents kunnen halverwege omvallen** (bijvoorbeeld op een uitgaveplafond van het
  model). Drie reviewers vielen zo weg terwijl de bouwer wél klaar was. Controleer of je
  review daadwerkelijk heeft gedraaid voordat je zijn oordeel als bewijs gebruikt.
- **Laat agents teruggeven, niet schrijven**, tenzij ze een eigen worktree hebben. Eén keer
  schreef een agent zelf een document en overschreef de opslagstap daarna het echte
  bestand.
- **Een agent kan onbedoeld iets authenticeren.** Een diagnose met `npx vercel inspect`
  startte een device-login die is voltooid; er staat sindsdien een Vercel-CLI-sessie op de
  laptop. Meld dat soort neveneffecten expliciet in plaats van ze te laten ontdekken.
- **Geef agents de valkuilen mee, niet alleen de opdracht.** Zonder de waarschuwing over
  `db.transaction()` op de neon-http-driver had elke agent die fout opnieuw gemaakt — hij
  is groen in de tests en valt pas op productie om.

## Waar je begint

1. `CLAUDE.md` — hoe het product en de code in elkaar zitten.
2. `docs/openstaand.md` — wat er níét af is, inclusief bewust aanvaarde risico's.
3. `docs/ci.md` — de poort, en hoe je hem lokaal reproduceert (`npm ci && npm run controle`).
4. Dit document — hoe je dat doet zonder een andere sessie in de weg te lopen.
