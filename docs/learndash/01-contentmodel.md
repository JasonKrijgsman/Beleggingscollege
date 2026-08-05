# LearnDash 1 — Contentmodel en cursusbouw

> Onderdeel van de LearnDash-kennisbank (onderzoek 5 aug 2026, LearnDash 4.x). Dit document beschrijft **hoe LearnDash cursusinhoud modelleert en hoe je er cursussen in bouwt**: de hiërarchie, de Course Builder, `Shared Course Steps`, de WordPress-posttypes eronder, de instellingenpagina's, `Focus Mode`, videolessen, `Assignments`, certificaten, sjablonen/AI, klonen/import-export en het hernoemen van terminologie. Engagement (punten, badges, quizdetails) staat in een ander document; hier komen quizzes en certificaten alleen langs als *contenttype*.
>
> Bronvermelding: de officiële kennisbank op `learndash.com/support/kb/` stuurt sinds de overname door StellarWP/Liquid Web een 302-redirect naar `docs.nexcess.com` — beide domeinen serveren dezelfde officiële documentatie. In de bronnenlijst staan de Nexcess-URL's omdat die direct laden.

## 1. De hiërarchie: Course → Lesson → Topic → Quiz

LearnDash kent een vaste, maximaal drie lagen diepe contentboom, met quizzes als vierde element dat op meerdere niveaus kan aanhaken:

```
Course
├── Section Heading        (optioneel: tekstueel tussenkopje, géén content)
├── Lesson
│   ├── Topic              (optioneel, alleen ónder een lesson)
│   │   └── Quiz           (topic-quiz)
│   └── Quiz               (lesson-quiz)
└── Quiz                   (course-/eindquiz — in de builder "FINAL QUIZZES")
```

- **`Course`** is de container: inschrijving, prijs, toegang en voortgang hangen allemaal aan de course.
- **`Lesson`** is de primaire contenteenheid. Een course zonder lessons kan, maar is leeg.
- **`Topic`** is een optioneel sub-niveau ónder een lesson. De regel is hard: *"Topics must be added to lessons. You cannot have a course with only topics."* Een topic erft automatisch het publicatieschema (drip-planning) van zijn parent-lesson. Topics kunnen inhoudelijk alles wat lessons kunnen (tekst, video, materials, `Video Progression`, `Assignment Uploads`, minimumtijd, planning) — met één uitzondering: alleen een lesson kan als **sample content** (gratis voorproefje) worden gemarkeerd, een topic niet.
- **`Quiz`** kan op drie plekken hangen: onder een topic, onder een lesson, of direct onder de course als eindtoets (de Course Builder toont die laatste categorie apart onderaan als "FINAL QUIZZES").
- **`Section Headings`** zijn een vierde bouwsteen in de builder: pure tekstkoppen tussen lessons ("hoofdstukken"), zonder eigen pagina of content — puur visuele structuur op de cursuspagina.
- **`Assignments`** zijn geen stap in de boom maar een upload-functie die je per lesson of topic aanzet (zie §9); de ingeleverde bestanden worden wel als eigen posttype opgeslagen.

### Waarom twee niveaus (lessons én topics)?

De officiële documentatie motiveert topics als "one additional level of organization": lessons voor de grove indeling, topics om een omvangrijke lesson op te knippen in behapbare stukjes zonder de lessonlijst onoverzichtelijk te maken. Simpele cursussen gebruiken alleen lessons; het topic-niveau is er voor cursussen waar één lesson anders te lang zou worden. In de praktijk (en in vrijwel elke LearnDash-tutorial) is dit ook een voortgangs-truc: elke topic heeft een eigen "Mark Complete", dus meer topics = meer afvinkmomenten = zichtbaardere voortgang.

De keerzijde die je in reviews en supportforums terugziet: twee niveaus plus section headings plus quizzes op drie plekken maakt de auteurskeuze ("wordt dit een lesson of een topic?") en de navigatie complexer, en veel sites gebruiken het topic-niveau simpelweg nooit.

> **Vergelijk met ons:** Beleggingscollege heeft Course → Module → Lesson, waarbij Module puur groepering is (vergelijkbaar met LearnDash's `Section Headings` + het feit dat onze lessen niet dieper nesten). Wij hebben bewust één quiz per les en geen apart topic-niveau — LearnDash laat zien wat het derde niveau kost aan complexiteit en oplevert aan afvinkmomenten.

## 2. WordPress-architectuur: alles is een custom post type

LearnDash registreert zijn content als WordPress custom post types (CPT's). De registratienamen (van belang zodra je met de database, REST API of thema's werkt):

| Contenttype | Post type |
|---|---|
| Course | `sfwd-courses` |
| Lesson | `sfwd-lessons` |
| Topic | `sfwd-topic` |
| Quiz | `sfwd-quiz` |
| Certificate | `sfwd-certificates` |
| Assignment (ingeleverd bestand) | `sfwd-assignment` |

(Het prefix `sfwd` stamt van de oorspronkelijke maker, "Smart Fish Web Design"-tijdperk; het is nooit gewijzigd vanwege backwards compatibility.) Groups, Essays en Coupons zijn latere CPT's; de zes hierboven zijn de kern van het contentmodel. De registratie loopt via de centrale klasse `SFWD_LMS` en is aan te passen met het filter `learndash_post_args` ([developers.learndash.com](https://developers.learndash.com/hook/learndash_post_args/)). De CPT's kunnen aan de gewone WordPress-categorieën en -tags gehangen worden, plus eigen LearnDash-taxonomieën (o.a. `ld_course_category`/`ld_course_tag`).

**Wat die architectuur koopt:** elke les is een gewone WordPress-post — dus gratis meeliften op de editor (Gutenberg of elke page builder), revisies, publicatiestatus en -planning, permalinks, zoekfunctie, media, gebruikersrechten, en het complete plugin-ecosysteem (SEO-plugins, vertaalplugins, page builders zien lessen "gewoon" als posts).

**Wat het kost:** de *relaties* tussen die posts passen niet in het WordPress-postmodel. Course-stap-associaties, volgorde en instellingen leven in postmeta en aparte tabellen, en de betekenis van een URL hangt af van instellingen (zie `Shared Course Steps`, §4). Vandaar de reeks waarschuwingen in de eigen documentatie: gebruik géén generieke duplicatie-plugins (die kopiëren de post maar slopen de stap-associaties), wijzig associaties alléén via de Course Builder, en zet `Shared Course Steps` niet zomaar uit. De data zit verspreid over posts, postmeta, usermeta (voortgang) en eigen tabellen — het bekende WordPress-patroon: flexibel, maar zonder afgedwongen integriteit.

> **Vergelijk met ons:** wij hebben het omgekeerde: content als getypte TypeScript-data in `src/content/`, waar de compiler de structuur afdwingt en een kapotte verwijzing de build breekt. Geen editor-UI, wel gegarandeerde integriteit.

## 3. De `Course Builder`

De Course Builder is het visuele drag-and-drop-scherm waarin je een complete cursus structureert (tab "Builder" op de course-editpagina, of de "Builder"-link in de courselijst). Kernpunten uit de officiële documentatie:

- **Overzicht bovenaan:** totaal aantal stappen (lessons + topics + quizzes samen), een `Undo`-link voor de laatste wijziging, en `Expand All` / `Collapse All`.
- **Inline aanmaken:** nieuwe stappen maak je rechtstreeks in de builder via "New Lesson", "New Topic", "New Quiz" en "New Section Heading" — je typt alleen een titel; de inhoud vul je later via de reguliere editor. Alles wat je zo aanmaakt wordt bij opslaan direct **gepubliceerd** (status "Public") — een bekende valkuil: halffabricaten staan meteen live als de cursus zelf zichtbaar is.
- **Bestaande stappen hergebruiken:** een zijbalk toont bestaande lessons/topics/quizzes (recente items, met zoekveld en "View All"), toe te voegen per stuk ("Add"), in bulk ("Add Selected") of via drag-and-drop. Dit vereist dat `Shared Course Steps` aanstaat (§4).
- **Herordenen:** elk item heeft een sleepgreep (zes puntjes); section headings en lessons hebben daarnaast op/neer-pijltjes (topics en quizzes niet).
- **Bewerken en verwijderen:** titel inline aanpassen (klik, typ, Enter); "Edit" opent de volledige editor; "Remove" haalt een stap alleen **uit deze cursus** — de post zelf blijft bestaan.
- De builder staat standaard aan (globale instelling onder LearnDash LMS → Courses → Settings). Staat hij aan, dan **negeert LearnDash de "Custom Lesson Order"-instellingen** (§5): de buildervolgorde is dan de waarheid.

## 4. `Shared Course Steps`: één les in meerdere cursussen

Globale toggle (LearnDash LMS → Courses → Settings → "Global Course Management and Display Settings"; vereist dat de Course Builder aanstaat). Hiermee kan één lesson/topic/quiz in meerdere cursussen tegelijk zitten; een wijziging in de stap werkt door in **alle** cursussen die hem gebruiken (wil je een afwijkende variant, dan moet je de stap klonen, §12).

De twee vragen die er echt toe doen — URL en voortgang — beantwoordt de documentatie expliciet:

- **URL's worden genest.** Met de feature aan verandert de permalinkstructuur van vlak (`/topic/naam/`) naar genest: `/courses/cursusnaam/lessons/lesnaam/topic/topicnaam/`. Dezelfde gedeelde stap heeft dus **per cursus een eigen URL** — de cursuscontext zit in het pad. De "kale" URL zonder cursuscontext (`/lessons/lesnaam/`) blijft bestaan maar is alleen voor administrators toegankelijk.
- **Voortgang is altijd per cursus.** *"Progress is always tracked per course, even when steps are shared"*: wie een gedeelde quiz in cursus A afrondt, heeft hem in cursus B nog niet af. Delen is dus content-deduplicatie, geen voortgangs-deduplicatie.
- **Primaire vs. secundaire associatie:** stappen die vóór het aanzetten al aan een cursus hingen houden die als enige *primary* cursus; alles wat je daarna via de builder toevoegt is een *secondary* associatie (meerdere mogelijk). In de editor toont een view-only "Associated Content"-box de relaties, met een Course Switcher; wijzigen kan uitsluitend via de Course Builder.
- **Eenmaal aan = feitelijk permanent:** uitzetten breekt de associaties tussen gedeelde stappen en hun cursussen. De documentatie waarschuwt daar nadrukkelijk voor.

> **Vergelijk met ons:** wij hebben geen gedeelde lessen en onze cursus-URL bevat de cursusslug al (`/cursussen/[slug]/les/[les]`), dus dit probleem bestaat bij ons niet. Interessant is vooral het besluit dat LearnDash hier nam: hergebruik van content, maar voortgang strikt per cursus — het alternatief (voortgang meeteleen) zou toegang tot cursus B via cursus A laten weglekken.

## 5. Cursusinstellingen: `Course Display & Content Settings`

Per cursus (tab "Settings" op de course-editpagina) regel je onder meer:

- **`Course Materials`** — een vrij HTML-veld voor aanvullend materiaal (downloads, links), getoond in een eigen tab op de cursuspagina. Let op: materials zijn **zichtbaar voor iedereen, ook niet-ingeschrevenen**; wil je ze afschermen dan moet je zelf de `[student]`-shortcode in het veld gebruiken. Lessons en topics hebben elk hun eigen materials-veld met dezelfde openbaarheid.
- **`Course Certificate`** — dropdown die één certificaat aan de cursus koppelt; uitgereikt zodra alle verplichte stappen af zijn, met een "Download Certificate"-knop op de cursuspagina.
- **`Course Content`-zichtbaarheid** — "Always Visible" (standaard: iedereen ziet de les-/topiclijst, ook uitgelogd) of "Only Visible to Enrollees" (niet-kopers zien "You don't currently have access to this content").
- **`Custom Pagination`** — per cursus de globale paginering (standaard 20 items, 0 = uit) overschrijven, met aparte aantallen voor lessons per pagina en topics per pagina; werkt door in de contenttabel én de navigatiewidget.
- **`Custom Lesson Order`** — sorteren op Date (standaard), Title of Menu Order, oplopend/aflopend; topics volgen dezelfde logica binnen hun lesson. **Alleen actief als de Course Builder uitstaat** — met de builder aan is de sleepvolgorde leidend.
- **`Challenge Exam`** — een toets waarmee een cursist de hele cursus kan "wegtoetsen": slagen markeert de cursus direct als voltooid.
- **`Course Completion Page`** — waarheen de cursist wordt gestuurd na afronding (globale standaard, per cursus te overschrijven).

(De toegangsmodi zelf — Open/Free/Buy Now/Recurring/Closed — en voortgangsregels als "Linear vs. Free flow" horen bij het toegangs-/engagementdocument, niet hier.)

## 6. `Focus Mode`: de afleidingsvrije leeromgeving

Sinds LearnDash 3.0; globale toggle onder LearnDash LMS → Settings → General → "Design & Content Elements". Vereist het "LearnDash 3.0"-template (niet het Legacy-template). Werkt op **lessons, topics, quizzes en assignments**; de cursuspagina zelf houdt de normale thema-layout.

Wat Focus Mode doet: het vervangt de thema-layout van de lespagina volledig. Weg zijn de hoofdnavigatie van de site, de footer en eventuele sidebars. Daarvoor in de plaats, altijd zichtbaar:

- een **uitklapbare cursusnavigatie-zijbalk** (de hele boom, met vinkjes per afgeronde stap);
- de **voortgangsindicator** bovenaan;
- **Vorige/Volgende**-navigatie bovenaan;
- de **`Mark Complete`-knop** bovenaan;
- een **avatar-dropdown** (Gravatar) met standaard "Course Home" en "Logout" — uitbreidbaar via een eigen WordPress-menu op de locatie "LearnDash: Focus Mode Dropdown" (let op: submenus worden plat weergegeven; hiërarchie wordt niet ondersteund).

Configureerbaar (alles in de globale General Settings, niet per cursus):

- **Logo-upload** — verschijnt linksboven op alle Focus Mode-pagina's (rechtsboven bij RTL-talen) en onder de login-/registratieformulieren.
- **Contentbreedte** — Default (960px), Narrow (768px), Wide (1180px), Extra-wide (1600px) of Full-width.
- **Zijbalkpositie** — links of rechts (sinds 4.1.0).
- **Kleuren** (van het 3.0-template, gelden ook buiten Focus Mode): "Accent Color" (knoppen, links), "Progress Color" (voortgangsbalken, certificaat-elementen) en "Notifications / Warnings". Meer dan deze drie kleurinstellingen biedt core niet; verder maatwerk gaat via CSS.

Het gedrag van de `Mark Complete`-knop zelf (verbergen, vertragen, automatisch) wordt niet in Focus Mode geregeld maar per les via `Video Progression` (§7) en timer-instellingen ("Minimum time to complete").

> **Vergelijk met ons:** onze lespagina ís al een dedicated leerscherm — wij hebben geen thema om te "ontsnappen". Het interessante aan Focus Mode is de opsomming van wat LearnDash blijkbaar essentieel vindt om áltijd in beeld te houden: boomnavigatie met vinkjes, voortgang, en de afrondknop.

## 7. Videolessen: `Video Progression`

Per lesson of topic in te schakelen (instellingen zijn voor beide identiek): de cursist moet de video **volledig bekijken** voordat de stap als voltooid kan gelden. De video verschijnt standaard boven de pagina-inhoud; met de shortcode `[ld_video]` plaats je hem elders op de pagina.

**Ondersteunde bronnen:** YouTube, Vimeo (vereist publieke video's/Showcase), Wistia, Bunny.net (alleen als HLS-playlist-URL), Spotlightr, Presto Player (aparte plugin), Amazon S3, en lokale uploads uit de WordPress-mediabibliotheek.

**Instellingen per les/topic:**

- **Display Timing** — "Before completed sub-steps" (standaard: eerst de hele video, dan pas toegang tot onderliggende topics/quizzes) of "After completing sub-steps" (video verschijnt pas als de sub-stappen af zijn).
- **Autocomplete** — markeert de lesson/topic automatisch als voltooid zodra de video uit is.
- **Completion delay** — configureerbaar aantal seconden tussen video-einde en automatische voltooiing (standaard 0).
- **Mark Complete-knop** — bij autocomplete standaard verborgen; optioneel toch tonen.
- **Autostart** — video start automatisch (gedempt, wegens browserbeleid).
- **Video Controls Display** — bedieningselementen tonen; **alleen voor YouTube en lokaal gehoste video's**.
- **Pause on Window Unfocus** — pauzeert zodra de kijker naar een ander venster wisselt.
- **Video Resume** — hervat op de laatst bekeken positie, over pagina-reloads heen.

**Hoe het bijhoudt:** de kijkstatus leeft in **browsercookies** (klasse `Learndash_Course_Video` bouwt per video een cookiesleutel; cookies moeten dus aanstaan). Dat betekent ook: de "heb je de video echt gekeken"-controle is client-side — een andere browser of gewiste cookies reset de kijkstatus, en de servervoortgang verandert pas bij de completion zelf. Voor administrators met "Bypass Course Limits" aan wordt de hele progressielogica overgeslagen (handig om te weten bij het testen: je ziet dan niet wat een cursist ziet).

> **Vergelijk met ons:** wij hebben nog geen video, maar dit is de referentie-featureset zodra de Resolve-keten (zie `docs/menselijke-elementen.md` in de hoofdrepo) video's oplevert. De cookie-aanpak laat ook zien waar de goedkope weg eindigt: echte kijkverificatie zou server-side events vereisen, en zelfs LearnDash doet dat niet.

## 8. `Assignments`: inleveropdrachten als stap-functie

Per lesson of per topic aan te zetten ("Assignment Uploads"-toggle in de Display & Content-instellingen; identiek voor beide). De cursist krijgt dan een uploadveld op de les-/topicpagina; de lesson/topic kan pas voltooid worden als aan de assignment-voorwaarden is voldaan.

- **Bestandsrestricties:** toegestane extensies als kommagescheiden lijst zonder punt (bijv. `doc, pdf, jpg`; leeg = alles toegestaan) en een maximale bestandsgrootte (bijv. `5M`; de laagste waarde van deze instelling en de hostinglimiet wint).
- **Punten:** optioneel; met punten aan geef je op hoeveel punten een inzending waard is. De cursist ziet per assignment hoeveel punten zijn toegekend.
- **Goedkeuring:** "Auto-approve" (standaard: inzending direct geaccepteerd, punten automatisch) of handmatig — dan moet een admin of `Group Leader` de inzending goedkeuren vóórdat de lesson/topic kan worden afgerond. Bij handmatige goedkeuring komen er extra opties bij: maximum aantal uploads per cursist en of de cursist een bestand vóór goedkeuring nog mag verwijderen.
- **Beheer:** ingeleverde bestanden zijn eigen posts (`sfwd-assignment`) onder LearnDash LMS → Assignments, met goedkeuren/punten toekennen/commentaar als beheeracties.

> **Vergelijk met ons:** wij hebben bewust geen inleveropdrachten (geen beloofde nakijkcapaciteit — zelfde redenering als bij de redactionele lesvragen). Noteer wel het patroon: LearnDash koppelt "handmatig werk van de docent" expliciet aan een blokkerende voltooiingsvoorwaarde, en dat schaalt alleen met `Group Leaders` als extra nakijkers.

## 9. Certificaten als contenttype (kort)

Certificaten zijn een eigen posttype (`sfwd-certificates`) dat je aan een course, quiz of group koppelt. Twee bouwmanieren:

- **Klassiek:** een achtergrondafbeelding (PDF-formaat) plus tekst met shortcodes.
- **`Certificate Builder`** (add-on, inbegrepen bij de licentie): certificaten opmaken in de gewone blokkeneditor, met LearnDash-blokken voor dynamische velden.

De dynamische data komt uit vier shortcode-families (ook als blocks beschikbaar): `[usermeta]` (bijv. `[usermeta field="first_name"]` / `last_name` voor de naam van de cursist), `[courseinfo]` (o.a. voltooiingsdatum, cursustitel — werkt alléén op certificaten die aan een course hangen), `[quizinfo]` (score, percentage — alléén bij quiz-certificaten) en `[groupinfo]`. Uitreiking en verdere engagement-mechanica: zie het engagement-document.

## 10. Sjablonen, LearnDash Cloud en AI

- **Core bevat geen starter-cursussen.** Wat de plugin sinds 4.x wél heeft is de **`Course Outline Builder`** ("Create Course Outline from AI", knop rechtsboven op LearnDash LMS → Courses): op basis van cursustitel, aantal lessen en een omschrijving genereert hij **alleen lestitels** — geen lesinhoud. Belangrijk detail: dit draait op een **eigen OpenAI-API-key** die je zelf moet aanmaken en betalen; LearnDash levert geen AI-tegoed mee.
- **LearnDash Cloud** (het gehoste SaaS-aanbod) is een beheerde WordPress-site met LearnDash voorgeïnstalleerd, en dáár zitten de sjablonen: bij onboarding kies je een starter-template per niche, inclusief AI-gegenereerde teksten en afbeeldingen, plus ProPanel (rapportage) en SSL inbegrepen.
- Daarnaast bestaat er een ecosysteem van thema-templates (Astra, Kadence) — dat zijn site-designs, geen cursusinhoud.

## 11. Klonen en import/export (core)

- **`Cloning`** (sinds LearnDash 4.2, core): hover over een course/lesson/topic/quiz in de beheerlijst en kies klonen; de kopie heet "Copy of …". De documentatie noemt dit nadrukkelijk de **enige aanbevolen** manier — generieke duplicatie-plugins beschadigen stap-associaties en quizinstellingen. Beperkingen om te kennen: met `Shared Course Steps` aan kopieert het klonen van een course **alleen de course zelf, niet de stappen** (die worden immers gedeeld); het klonen van een losse lesson/topic neemt onderliggende topics/quizzes **niet** mee; en de documentatie waarschuwt dat sommige quizinstellingen bij het klonen verloren kunnen gaan — na klonen instellingen nalopen.
- **`Import/Export`** (sinds LearnDash 4.3, core; LearnDash LMS → Settings → Advanced → Import/Export): exporteert de LearnDash-content van een site als bestand, alles of per posttype (courses, lessons, topics, quizzes, …), en importeert dat op een andere site. Beperking: **geen export van één individuele cursus** — de selectie is per posttype, niet per course. Wie dat wil, zit op third-party plugins.

## 12. Terminologie hernoemen: `Custom Labels`

LearnDash LMS → Settings → Advanced → Custom Labels. Hier vervang je sitebreed de woorden "Course(s)", "Lesson(s)", "Topic(s)" en "Quiz(zes)" (elk enkelvoud en meervoud apart), plus een handvol knopteksten (o.a. de "Mark Complete"-knop). De wijziging werkt overal door: wp-admin én front-end, voor beheerders én cursisten. Belangrijke grens: **URL's veranderen niet mee** — de permalink-slugs (`/courses/`, `/lessons/`, …) pas je apart aan in de permalink-instellingen. Voor een Nederlandstalige site is dit dus hoe "Course/Lesson" overal "Cursus/Les" wordt zonder vertaalbestanden aan te raken.

> **Vergelijk met ons:** wij schrijven gewoon Nederlandse teksten; een vertaallaag over Engelse kernbegrippen hebben we niet nodig. Maar het bestaan van deze feature zegt iets over de markt: "academy", "module", "unit" — elke onderwijsclub wil zijn eigen woorden, en LearnDash maakte daar een instelling van in plaats van een fork.

## Niet geverifieerd

- De exacte huidige lijst LearnDash-taxonomieën en de volledige set CPT's náást de kerntabel in §2 (groups/essays/coupons) is uit secundaire bronnen en eigen kennis; de officiële docs sommen ze niet op één pagina op.
- Of de `Course Outline Builder` in 2026 nog steeds uitsluitend lestitels genereert (geen lesinhoud) is gebaseerd op de docs zoals gelezen op 5 aug 2026; LearnDash bouwt hier actief aan door.
- De herkomstverklaring van het `sfwd`-prefix is breed herhaalde ecosysteemkennis, geen officiële bron.

## Bronnen

Officiële documentatie (learndash.com/support/kb redirect → docs.nexcess.com; zelfde inhoud):

- Course Builder — https://docs.nexcess.com/software/learndash/course-builder/
- Shared Course Steps — https://docs.nexcess.com/software/learndash/shared-course-steps/
- Course Display & Content Settings — https://docs.nexcess.com/software/learndash/course-display-content-settings/
- Topics — https://docs.nexcess.com/software/learndash/topics/
- Focus Mode — https://docs.nexcess.com/software/learndash/focus-mode/
- General Settings (template, kleuren, Focus Mode-breedte/zijbalk, logo, paginering) — https://docs.nexcess.com/software/learndash/general-settings/
- Video Progression — https://learndash.com/support/kb/core/lessons/video-progression/
- Assignments — https://learndash.com/support/kb/core/assignments/assignments/ en https://learndash.com/support/kb/core/uncategorized/enable-assignments/
- Cloning — https://learndash.com/support/kb/core/settings/cloning/
- Import/Export (Advanced Options) — https://learndash.com/support/kb/core/settings/advanced-options/ en aankondiging https://www.learndash.com/blog/whats-new-in-learndash-import-export-is-here/
- Course Outline Builder (AI) — https://learndash.com/support/kb/core/courses/course-outline-builder/
- Custom Labels — https://www.learndash.com/support/docs/core/settings/custom-labels/ en FAQ https://www.learndash.com/support/docs/faqs/rename-learndash-labels/
- Certificate Builder add-on — https://docs.nexcess.com/software/learndash/certificate-builder-add-on/
- Certificate-shortcodes — https://learndash.com/support/kb/core/uncategorized/certificate-shortcodes/
- LearnDash Cloud — https://learndash.com/support/kb/non-knowledgebase/uncategorized/learndash-lms-cloud/

Ontwikkelaarsdocumentatie en secundair:

- CPT-registratie: `learndash_post_args`-filter — https://developers.learndash.com/hook/learndash_post_args/ ; klasse `SFWD_LMS` — https://developers.learndash.com/class/sfwd_lms/
- Video-cookiemechanisme: `Learndash_Course_Video::build_video_cookie_key` — https://developers.learndash.com/method/learndash_course_video/build_video_cookie_key/
- CPT-namenoverzicht (secundair) — https://thelearndash.com/what-is-the-name-of-the-learndash-custom-post-type/
