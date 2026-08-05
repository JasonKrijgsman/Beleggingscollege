# LearnDash: de quiz- en toetsmotor

*Onderzoek: 5 aug 2026. Onderdeel van de LearnDash-kennisbank voor Beleggingscollege.*

De quizmodule is het diepste subsysteem van LearnDash — en ook het oudste. Hij is niet door LearnDash zelf ontworpen maar overgenomen van het (inmiddels verlaten) WordPress-plugin **WP Pro Quiz**, dat rond 2013 in LearnDash is geïntegreerd en sindsdien wordt doorontwikkeld. Die afkomst zie je overal terug: in de eigen databasetabellen buiten het normale WordPress-postmodel, in de enorme hoeveelheid instellingen per quiz, en in de UI-klachten die de community er al jaren over heeft. Dit document beschrijft wat de motor kan (versie 4.x), met de exacte instellingsnamen, en eindigt met een eerlijk oordeel over wat er niet aan deugt.

Leeswijzer: LearnDash-instellingen staan in het Engels tussen backticks; alles wordt **per quiz** ingesteld, tenzij anders vermeld — er is nadrukkelijk géén globale plek om bijv. de slagingsdrempel voor alle quizzen tegelijk te zetten.

---

## 1. Architectuur en de WP Pro Quiz-erfenis

Anders dan cursussen, lessen en topics (gewone WordPress custom post types) leeft het quizsysteem grotendeels in **eigen databasetabellen** met het voorvoegsel `wp_learndash_pro_quiz_`: onder meer `_master` (quizconfiguratie), `_question`, `_category`, `_statistic` en `_statistic_ref` (afgelegde pogingen per vraag), `_toplist` (leaderboard), `_template`, `_prerequisite`, `_lock` (retake-vergrendeling) en `_form` (custom fields). Een quiz bestaat dus dubbel: als WordPress-post (voor de URL, de builder, de koppeling aan een cursus) én als rij in de pro-quiz-tabellen — een tweeledigheid die rechtstreeks uit de fork stamt en die export/import en maatwerk lastiger maakt dan bij de rest van LearnDash.

Bronnen: https://www.learndash.com/support/docs/developers/database-info/ ; https://developers.learndash.com/package/quiz/

> **Vergelijk met ons:** wij hebben precies het omgekeerde: quizvragen zijn typed data in de cursusbestanden (`QuizQuestion` met `correctIndex`), zonder aparte opslaglaag — één bron, geen synchronisatieprobleem.

## 2. Vraagtypen

LearnDash kent acht vraagtypen. Elke vraag heeft een `Question Title` (alleen intern), `Question Text` (de eigenlijke vraag, klassieke WordPress-editor), een verplicht puntenveld `Points to be Awarded` (standaard 1; hele getallen, decimalen én negatieve waarden toegestaan), een optionele `Question Category`, en optioneel een hint (`Activate hint for this question?` — verschijnt als knop onder de vraag). Antwoorden ondersteunen `Allow HTML`, media (`Add Media`) en herordenen via een `Move`-knop.

Bron: https://www.learndash.com/support/docs/core/quizzes/questions/ (redirect naar https://docs.nexcess.com/software/learndash/quiz-questions/)

### 2.1 `Single Choice`
Eén juist antwoord uit meerdere opties. Ondersteunt `Different points for each answer` (punten per antwoord in plaats van per vraag) en daarbovenop `Different points – modus 2 activate`, waarmee ook fóúte antwoorden punten (meestal negatieve) kunnen opleveren. Hiermee bouw je bijv. een risicoprofieltest waarin elk antwoord een andere waarde heeft.

### 2.2 `Multiple Choice`
Meerdere juiste antwoorden; de cursist moet ze **allemaal** aanvinken voor de punten — een gedeeltelijke selectie telt standaard als fout. Wil je partial credit, dan moet dat via `Different points for each answer`, eventueel met puntenaftrek voor foute vinkjes (`Subtract Points for Incorrect Answer`).

### 2.3 `Free Choice`
De cursist typt het antwoord in een invoerveld; hoofdletters zijn irrelevant. Je geeft één of meer goedgekeurde antwoorden op (één per regel); per antwoord kun je een puntwaarde meegeven in het formaat `antwoord|punten`.

### 2.4 `Sorting Choice`
Sleep een reeks antwoorden in de juiste volgorde; de volgorde in de backend ís het juiste antwoord. Alleen punten per vraag — geen partial credit voor "bijna goed" gesorteerd.

### 2.5 `Matrix Sorting Choice`
Matchen: links statische `Criterion`-items, rechts sleepbare `Sort elements` die de cursist naar het juiste criterium sleept. Eén-op-één-koppelingen, elk sorteerelement moet uniek zijn; de kolombreedte van de criteria is instelbaar in procenten, en criteria mogen afbeeldingen zijn.

### 2.6 `Fill in the Blank` (cloze)
Gaten in een lopende tekst. Syntax: het juiste antwoord tussen accolades — `{antwoord}`; meerdere goedgekeurde varianten per gat met blokhaken — `{[variant1][variant2]}`; punten per gat via een pipe — `{[antwoord|2]}` (standaard 1 punt per gat). Alle gaten moeten goed zijn voor de volle score, tenzij je met `Different points for each answer` per gat scoort. Hoofdletterongevoelig.

### 2.7 `Assessment (Survey)`
Een schaalvraag (Likert): de hele schaal tussen accolades, elke optie tussen blokhaken — `{[1][2][3][4][5]}`. De eerste optie is 1 punt en elke volgende telt op; er is dus geen goed of fout, alleen een positie op de schaal. Bedoeld voor enquêtes en zelfbeoordeling. `Different points for each answer` wordt bij dit type níét ondersteund.

### 2.8 `Essay / Open Answer`
Vrije tekst (`Text Box`) óf een bestandsupload (`Upload`) als antwoord. Nakijken is handmatig of automatisch, via drie standen (zie §6). Negatieve punten worden bij essays niet ondersteund. Uitgebreid in §6.

> **Vergelijk met ons:** wij doen bewust alleen multiple choice met één juist antwoord — het equivalent van `Single Choice` zonder puntenvarianten. LearnDash laat zien wat de volgende logische stappen zouden zijn (cloze, sorteren, schaalvragen voor een risicoprofiel), maar ook hoeveel scoringscomplexiteit elk extra type meebrengt.

## 3. Quizinstellingen: toegang en voortgang

Bron: https://learndash.com/support/kb/core/uncategorized/quiz-access-progression/

- **`Associated Course` / `Associated Lesson`** — koppelt de quiz aan een cursus, les of topic; de quiz verschijnt dan in de Course Builder van die cursus.
- **`Quiz Release Schedule`** — beschikbaarheid: `Immediately`, X dagen na inschrijving, of op een vaste datum.
- **`Quiz Prerequisites`** — één of meer ándere quizzen die eerst afgerond moeten zijn voordat deze quiz start (dit is het "quiz pas na X"-mechanisme).
- **`Registered Users Only`** — alleen ingelogde gebruikers mogen de quiz maken. Uit betekent: ook anonieme bezoekers kunnen hem doen (retakes worden dan via cookies bijgehouden — makkelijk te omzeilen).
- **`Passing Score`** — het percentage (0–100) waarbij de quiz als gehaald telt; onder de drempel komt de cursist de cursus niet verder in. `0` = altijd door, ongeacht score.
- **`Quiz Certificate`** — certificaat bij afronden, met een **eigen** scoredrempel die mag afwijken van de `Passing Score` (zie §8).
- **`Enable Quiz Saving`** — voortgang binnen een quiz bewaren en later hervatten, met een instelbaar autosave-interval.
- **`Quiz Retakes`** (in de UI ook "Restrict quiz retakes") — standaard onbeperkt herkansen; ingeschakeld beperk je het tot N pogingen, met een subinstelling op wíé de beperking slaat (o.a. alleen geregistreerde gebruikers). Bij anonieme gebruikers loopt de telling via een browsercookie.
- **`Question Completion`** — verplicht álle vragen te beantwoorden; de quiz kan pas ingeleverd worden als alles is ingevuld.
- **`Time Limit`** — tijdslimiet in HH:MM:SS; bij het verstrijken wordt de quiz automatisch ingeleverd en tellen onbeantwoorde vragen als 0 punten.

> **Vergelijk met ons:** wij kennen geen slagingsdrempel — elke quiz mag "gehaald" worden met elke score, en de beloning is een XP-bonus (tot 25) plus de foutloos-badge. LearnDash's model is poortwachter (niet verder zonder X%); het onze is aanmoediging. Dat verschil is een productkeuze, geen technisch gat.

## 4. Quizinstellingen: weergave en inhoud

Bron: https://www.learndash.com/support/docs/core/quizzes/quiz-display/ (redirect naar https://docs.nexcess.com/software/learndash/quiz-display/)

- **`Quiz Materials`** — downloadbaar aanvullend materiaal (pdf's e.d.) in een eigen tabblad.
- **`Autostart`** — quiz start direct bij het laden van de pagina; standaard uit, dan is er een `Start Quiz`-knop.
- **`Question Display`** — het kernonderscheid: *one question at a time* (met `Next`-knop) of *all questions at once* op één pagina, optioneel met paginering. Bij één-per-keer kies je bovendien wanneer het resultaat zichtbaar wordt: pas aan het eind (met optionele `Back`-knop), of **direct na elk ingeleverd antwoord**.
- Losse aan/uit-schakelaars: **`Point Value`** (puntwaarde in de hoek van de vraag), **`Question Category`** (categorie boven de vraag), **`Question Position`** ("Question 1 of 10"), **`Question Numbering`**, **`Number Answers`** (nummers vóór de antwoordopties), **`Quiz Title`**.
- **`Question Overview Table`** — het "review box": een interactieve tabel met alle vraagnummers en hun status (beantwoord / gemarkeerd om te herzien), waarmee de cursist vóór het inleveren kan springen en controleren.
- **`Sort by Category`** — vragen gegroepeerd per categorie tonen.
- **`Randomize Order`** — vragen in willekeurige volgorde, met de optie om slechts een **deelverzameling** te tonen (X van de Y vragen — de simpelste vorm van "trek N vragen uit een pool", zie §5).
- **`Randomize Answers`** — antwoordopties husselen, bij de typen waar dat kan.

## 5. Vragenbank, gedeelde vragen en willekeurige selectie

Bronnen: https://learndash.com/support/kb/core/quizzes/quiz-builder/ ; https://www.learndash.com/support/docs/core/quizzes/global-settings/ ; https://www.learndash.com/blog/new-quiz-builder-reusable-questions-and-status-of-3-0/

- De **Quiz Builder** (standaard aan; uit te zetten in de globale quizinstellingen) is de drag-and-drop-interface op de quizpagina: nieuwe vragen inline aanmaken (`+ New Question`), of bestaande vragen uit de zijbalk (`Questions`-box, doorzoekbaar op titel) toevoegen — los via `Add`, in bulk via checkboxes + `Add Selected`, of door ze op een positie te slepen. Vraagcategorieën kun je in de builder zelf níét beheren; `Different points for each answer` is er niet voor Assessment- en Essay-vragen.
- **`Shared Quiz Questions`** (globale instelling) — hiermee wordt elke vraag herbruikbaar over meerdere quizzen: één centrale vragenvoorraad in plaats van vragen die vastzitten aan hun quiz. **Waarschuwing uit de officiële docs:** eenmaal aan moet je dit niet zomaar meer uitzetten — vragen die aan meerdere quizzen hangen, verliezen bij het uitschakelen die koppeling.
- **Willekeurig N uit een pool** kan native alleen grofweg: `Randomize Order` + subset toont X willekeurige vragen uit het totaal van de quiz. **Per categorie trekken** ("5 uit categorie A, 3 uit categorie B") kan LearnDash **niet** uit zichzelf — daarvoor bestaat een ecosysteem van add-ons (o.a. "Multi Question Categories" van WooNinjas, "Enhanced Quiz for LearnDash"). Dat een basale LMS-functie als categoriegebaseerde random selectie een betaalde add-on vergt, is een veelgehoord kritiekpunt.
- Vraagcategorieën zelf zijn native (dropdown op de vraag, beheer via de `Question Taxonomies`-instellingen) en voeden ook de categorie-uitsplitsing in statistieken en resultaten.

## 6. Essayvragen: het nakijkproces

Bronnen: https://learndash.com/support/kb/core/quizzes/essays/ (redirect naar https://docs.nexcess.com/software/learndash/essays/) ; https://www.learndash.com/blog/essay-questions-and-assignment-points/

Per essayvraag kies je één van drie afhandelingen:

1. **`Not Graded, No Points Awarded`** — het essay wacht op beoordeling; de quizuitslag toont de cursist zolang **"Pending"**. Haalt de cursist door het ontbrekende essay de `Passing Score` niet, dan zit de cursusvoortgang op slot tot er is nagekeken.
2. **`Not Graded, Full Points Awarded`** — volle punten alvast toegekend (cursist kan door), status blijft `Not Graded`; de beheerder kan later alsnog beoordelen en de punten bijstellen.
3. **`Graded, Full Points Awarded`** — automatisch als beoordeeld gemarkeerd mét volle punten; feitelijk een "moeite tellen"-vraag.

Nakijken gebeurt onder **LearnDash LMS → Quizzes → tab `Submitted Essays`**: een lijst van alle ingezonden essays, filterbaar op status (`Graded`/`Not Graded`, ongegradeerd roze gemarkeerd) en op cursus, les of quiz. Twee routes:

- **Snel, vanuit de lijst:** punten invullen en op `Approve` klikken — maar eenmaal zo beoordeeld kun je het vanuit déze weergave niet meer aanpassen.
- **Flexibel, per essay:** essaytitel openen → in de zijbalk `Essay Grading Status` wisselen tussen `Graded`/`Not Graded`, punten aanpassen, `Update`. Hier kan alles later nog worden herzien.

Bij `Upload`-essays download je het bestand via de sectie `Essay Upload`. Feedback aan de cursist loopt — typisch WordPress — via het **commentaarsysteem** op de essaypagina (`Discussion` → `Allow Comments` → `Add Comment`). Zodra een pending essay is nagekeken en de cursist daarmee alsnog boven de drempel komt, wordt de cursusvoortgang automatisch vrijgegeven.

## 7. Rapportage en statistieken

Bronnen: https://learndash.com/support/kb/core/users/user-data/ ; https://wisdmlabs.com/blog/learndash-quiz-statistics/ ; https://academy.learndash.com/topics/administrative-data-handling/

- **`Quiz Statistics`** moet per quiz aanstaan (sectie `Administrative and Data Handling Settings`), anders wordt er **niets** vastgelegd — antwoorden van cursisten bestaan dan simpelweg niet in de database. Er hoort een `Statistics IP-lock` bij om herhaalde anonieme inzendingen vanaf hetzelfde IP te beperken.
- **Beheerderszicht:** bij de quiz kies je `Statistics` in het actiemenu. Je ziet per gebruiker elke poging (datum, score, totaalscore, rang, bestede tijd) en kunt doorklikken naar de **individuele antwoorden per vraag**, plus een uitsplitsing per vraagcategorie.
- **Cursistzicht:** op de profiel-/accountpagina staat per gemaakte quiz een papiericoon (kolom `Statistics`) waarmee de cursist eigen eerdere pogingen en antwoorden terugkijkt, inclusief essays.
- **Export:** native exporteren Administrator en Group Leader twee CSV-rapporten — `User Course Data` en `User Quiz Data` (scores, percentages, tijd per poging). Per-vráág-analyse over alle cursisten heen ("hoeveel procent had vraag 3 goed?") zit **niet** in de kale plugin; daarvoor is ProPanel (inmiddels bij de hogere licenties inbegrepen) of een rapportage-add-on nodig.
- Aparte instellingen in dezelfde sectie: **`Email Notifications`** (mail naar beheerder en/of cursist bij afronden, met resultaat), **`Browser Cookie Answer Protection`** (tussentijdse antwoorden in een cookie zodat een onderbroken quiz niet alles kwijt is), **`Custom Fields`** (extra formuliervelden vóór de start of vóór het inleveren — bijv. naam/e-mail bij anonieme quizzen; vereist dat `Quiz Statistics` aanstaat), en **quiz-`Templates`** (instellingen van een bestaande quiz opslaan en hergebruiken voor nieuwe quizzen — scheelt veel, gegeven hoevéél instellingen er per quiz zijn).

> **Vergelijk met ons:** dit is de grootste structurele afstand. Bij ons reizen quizantwoorden nooit naar de server — alleen `correct`/`total` — dus per-vraag-statistiek ("welke vraag begrijpen mensen niet?") is bij ons per definitie onmogelijk. LearnDash laat zien wat je daarvoor terugkrijgt én wat het kost: opslag per antwoord, een privacyverhaal en een hele beheer-UI.

## 8. Resultaatpagina en certificaten

Bronnen: https://learndash.com/support/kb/core/quizzes/quiz-results/ ; https://academy.learndash.com/topics/assigning-certificates-to-quizzes-and-courses/

De resultaatpagina is opgebouwd uit schakelbare onderdelen:

- **`Result Messages` ("Graduation"-tekst)** — eigen boodschappen per scoreband, tot **100 niveaus** met elk een minimumscore ("0–50%: bekijk les 3 opnieuw", "90%+: uitstekend"). Dit is het oude WP Pro Quiz-"graduation"-mechanisme.
- **`Restart Quiz Button`**, **`Average Score`** (jouw score afgezet tegen alle deelnemers), **`Category Score`** (uitsplitsing per vraagcategorie), **`Overall Score`**, **`Number of Correct Answers`**, **`Time Spent`**.
- **`Custom Answer Feedback`** — bepaalt de nabespreking: groene/rode markering van goed/fout, een eigen `Correct`/`Incorrect answer message` per vraag, en de **`View Questions Button`** waarmee de cursist na afloop alle vragen mét de eigen antwoorden terugziet. Wil je juist een examen waarbij de juiste antwoorden geheim blijven (tegen doorspelen bij herkansingen), dan zet je dit alles uit — het is een keuze per quiz.
- Ook dit alles per quiz; niets hiervan is globaal te zetten.

**Certificaten** kent LearnDash op twee niveaus, met verschillende logica:

- **Cursuscertificaat** — op afronding van de hele cursus (alles afgevinkt).
- **Quizcertificaat** — op het halen van een **`Certificate Awarded for`-drempel** op één quiz. Die drempel staat lós van de `Passing Score`: je kunt de quiz laten halen op 70% maar het certificaat pas op 90% geven — slagen en excelleren zijn twee verschillende poorten. Certificaten zelf zijn een aparte builder (PDF met shortcodes voor naam, score, datum).

> **Vergelijk met ons:** ons certificaat hangt aan cursusafronding, niet aan een quizscore — vergelijkbaar met LearnDash's cursuscertificaat. De gescheiden drempels (halen ≠ certificaat) zijn een idee dat goedkoop te lenen is als we ooit een "met lof"-variant willen.

## 9. `Challenge Exams` (nieuw in 4.0)

Bron: https://www.learndash.com/support/docs/core/courses/challenge-exams/ (redirect naar https://docs.nexcess.com/software/learndash/challenge-exams/)

Sinds LearnDash 4.0: een vrijstellingstoets ("test-out"). Onder **LearnDash LMS → Challenge Exams** bouw je een examen dat vóór de cursus staat; wie slaagt, krijgt de hele cursus automatisch als voltooid gemarkeerd. Opvallend is hoe bewust **beperkt** dit is gehouden — het is een aparte, moderne (Gutenberg-blok)implementatie naast de oude quizmotor, niet erbovenop:

- Alleen twee vraagtypen: `Single` en `Multiple`.
- **Alles moet goed**: geen deelscore, geen drempelpercentage.
- Eén challenge exam per cursus; alleen aan het begin, niet halverwege.
- Na één poging kan de gebruiker niet opnieuw zonder ingrijpen van een beheerder.
- Eigen slaag-/faalboodschappen met per uitkomst een eigen redirect-URL; nabespreking met groene/rode markering.

Dat LearnDash voor deze nieuwe functie de WP Pro Quiz-motor links liet liggen, zegt veel over hoe men er intern zelf naar kijkt.

## 10. Front-end gedrag

- De quiz rendert via LearnDash's actieve template (sinds 3.0 het "LearnDash 3.0"/LD30-thema; het legacy-template bestaat nog). De vraagweergave zelf komt uit de WP Pro Quiz-laag (eigen JS en CSS, `learndash.quiz.front.css`), wat styling op maat lastiger maakt dan bij de rest van het thema.
- Standaardverloop: quizpagina met beschrijving en materialen → `Start Quiz`-knop (tenzij `Autostart`) → vragen (één per keer of alles ineens, met optionele `Question Overview Table` om te springen en te controleren) → `Quiz Summary`/inleveren → resultaatpagina met de onderdelen uit §8 → optioneel `View Questions` voor de nabespreking, certificaatdownloadknop, leaderboard.
- **Leaderboard** (per quiz aan te zetten): instellingen `Who can apply` (wie mag zijn score op het bord zetten), `Multiple applications per user` en `Automatic user entry`. Scores van beheerders blijven standaard buiten leaderboard en rapportages, tenzij expliciet aangezet in de algemene instellingen. Weergave op de resultaatpagina of elders via een shortcode. Bron: https://learndash.com/support/kb/core/quizzes/quiz-leaderboard/
- Belangrijk om te weten: het nakijken gebeurt client-side in de WP Pro Quiz-JavaScript en het resultaat wordt daarna via AJAX opgeslagen — de juiste antwoorden zijn dus in de paginabron/het JS-verkeer te vinden voor wie zoekt. Voor high-stakes toetsing is LearnDash daarmee (net als wij) niet geschikt zonder extra maatregelen.

## 11. Pijnpunten — het eerlijke verhaal

Deels community-signaal, niet allemaal hard verifieerbaar; als richting wel consistent over meerdere bronnen (Trustpilot-/Capterra-reviews, WordPress.org-forums, agencyblogs van o.a. WisdmLabs en Uncanny Owl):

1. **De WP Pro Quiz-erfenis is de rode draad.** Eigen tabellen, eigen UI-conventies, eigen front-end-JS — het quizsysteem voelt als een plugin ín de plugin. LearnDash's eigen keuze om Challenge Exams er volledig náást te bouwen (§9) bevestigt dat.
2. **Instellingenoverdaad zonder globale defaults.** Tientallen toggles, allemaal per quiz; de docs zeggen letterlijk dat vrijwel niets globaal kan. Quiz-templates zijn de pleister, geen genezing. Reviews beschrijven "meer tijd kwijt aan de interface dan aan de inhoud".
3. **Scoring is krachtig maar cryptisch.** `Different points`, "modus 2", punten-per-gat via `{[antwoord|2]}`-syntax in een tekstveld — expressief, maar foutgevoelig en zonder validatie-UI.
4. **Multiple choice zonder native partial credit** (alles-of-niets tenzij je het puntensysteem handmatig ombouwt) verrast veel gebruikers.
5. **Statistiek die stil uitstaat.** `Quiz Statistics` staat niet vanzelf aan; wie het vergeet, ontdekt pas later dat er niets is vastgelegd. En echte per-vraag-analyse over de hele populatie vergt alsnog ProPanel of een add-on.
6. **Basisfuncties als betaalde add-on**: random trekken per categorie, geavanceerde quizrapportages, front-end quiz maken — het zit in het ecosysteem (WooNinjas, WisdmLabs, Uncanny Owl), niet in de kern.
7. **Styling en URL-structuur**: de quiz-front-end is berucht lastig te themen, en de geneste permalinks (`/cursus/les/topic/quiz/`) worden in reviews als SEO-onvriendelijk lang genoemd.

**De les voor ons** is tweeledig. Positief: de featureset is een compleet menu van wat een toetsmotor kán — scorebanden met eigen feedback (`Result Messages`), gescheiden drempels voor halen en certificaat, de review-tabel vóór inleveren, essay-workflow met pending-status. Negatief: het laat zien wat er gebeurt als elke functie een instelling wordt en de datamodellen van twee generaties naast elkaar blijven bestaan. Onze bewuste smalheid (één vraagtype, één quiz per les, client-side, XP in plaats van slagingsdrempel) is tegen deze achtergrond een positie, geen achterstand — zolang we de dingen die we er níét bij hebben (per-vraag-inzicht, serverzijdige integriteit) als bekende, bewuste gaten blijven behandelen (`docs/openstaand.md` §6).

---

## Bronnen

Officiële LearnDash-documentatie (learndash.com/support redirect sinds de Liquid Web/Nexcess-overname deels naar docs.nexcess.com; inhoud is de officiële kennisbank):

- Vraagtypen: https://www.learndash.com/support/docs/core/quizzes/questions/ → https://docs.nexcess.com/software/learndash/quiz-questions/
- Toegang & voortgang: https://learndash.com/support/kb/core/uncategorized/quiz-access-progression/
- Weergave & inhoud: https://www.learndash.com/support/docs/core/quizzes/quiz-display/ → https://docs.nexcess.com/software/learndash/quiz-display/
- Resultaatpagina: https://learndash.com/support/kb/core/quizzes/quiz-results/
- Quiz Builder: https://learndash.com/support/kb/core/quizzes/quiz-builder/
- Globale quizinstellingen (incl. `Shared Quiz Questions`-waarschuwing): https://www.learndash.com/support/docs/core/quizzes/global-settings/
- Essays beheren en nakijken: https://learndash.com/support/kb/core/quizzes/essays/ → https://docs.nexcess.com/software/learndash/essays/
- Leaderboard: https://learndash.com/support/kb/core/quizzes/quiz-leaderboard/
- Challenge Exams: https://www.learndash.com/support/docs/core/courses/challenge-exams/ → https://docs.nexcess.com/software/learndash/challenge-exams/
- Custom fields: https://www.learndash.com/support/docs/core/quizzes/quiz-custom-fields/
- E-mailnotificaties: https://learndash.com/support/kb/core/uncategorized/quiz-email-notifications/
- User data & export: https://learndash.com/support/kb/core/users/user-data/
- Databasetabellen: https://www.learndash.com/support/docs/developers/database-info/
- Dev-docs quizpakket (WP Pro Quiz-klassen): https://developers.learndash.com/package/quiz/
- Certificaten (Academy): https://academy.learndash.com/topics/assigning-certificates-to-quizzes-and-courses/
- Administrative & Data Handling (Academy): https://academy.learndash.com/topics/administrative-data-handling/
- Blog — herbruikbare vragen/Quiz Builder (herkomst gedeelde vragen): https://www.learndash.com/blog/new-quiz-builder-reusable-questions-and-status-of-3-0/
- Blog — essaypunten: https://www.learndash.com/blog/essay-questions-and-assignment-points/

Secundair (ecosysteem en kritiek; niet-officieel, als zodanig gebruikt):

- Quizstatistieken in de praktijk: https://wisdmlabs.com/blog/learndash-quiz-statistics/ en https://wisdmlabs.com/blog/export-learndash-quiz-results/
- Random per categorie (add-on): https://wooninjas.com/randomized-learndash-quiz/
- Reviews/pijnpunten: Capterra (https://www.capterra.com/p/130248/LearnDash/reviews/), Trustpilot (https://uk.trustpilot.com/review/learndash.com), Ruzuku-review 2026 (https://www.ruzuku.com/learn/articles/is-learndash-any-good)
