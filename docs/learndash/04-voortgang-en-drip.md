# LearnDash: voortgang, drip-content en leerpadstructuur

*Onderzoek: 5 aug 2026. Bronnen: officiële LearnDash-supportdocumentatie (learndash.com/support/kb — deze URL's redirecten sinds de StellarWP/Liquid Web-overname naar docs.nexcess.com, dat is dezelfde officiële documentatie), LearnDash Academy, developers.learndash.com en het officiële blog. Waar een detail alleen uit derdenbronnen komt, staat dat erbij.*

Dit document beschrijft hoe LearnDash 4.x de voortgang van een cursist stuurt, opslaat en toont: lineaire versus vrije navigatie, vereisten tussen cursussen, drip-feed van lessen, de poorten die een les op slot houden (timer, video, opdracht, quiz), de "Mark Complete"-mechaniek, de opslag van voortgang, hervatten, statussen, navigatie en certificaten. Rapportage komt hier alleen oppervlakkig langs; diepe rapportage is een apart document.

---

## 1. Lineair versus vrij: `Course Progression`

LearnDash kent per cursus twee voortgangsmodi, ingesteld op de cursus onder **Settings** (sectie met navigatie-instellingen van de cursus):

- **`Linear`** (standaard) — de cursist moet elke stap in volgorde afronden. Overslaan of vooruitspringen kan niet: een stap wordt pas toegankelijk als de vorige stap op "complete" staat. De cursist moet op elke les/topic expliciet op **`Mark Complete`** klikken om verder te mogen. Alle poorten hieronder (timer, video, opdracht, quiz-slaagdrempel) grijpen op dit moment in: ze bepalen *wanneer* die knop beschikbaar of effectief is.
- **`Free form`** — de cursist mag vrij door alle stappen bladeren en ze in willekeurige volgorde bekijken en afronden.

Twee regels die in béíde modi gelden:

1. **Geneste afronding**: zitten er stappen ín een stap (les → topics, of les → quiz), dan moeten die substappen eerst af voordat de bovenliggende les zelf als afgerond kan gelden. Ook in `Free form` kun je een les dus niet afvinken zolang de topics eronder open staan.
2. **Achteraf lessen toevoegen of verwijderen** verandert niets voor wie de cursus al had afgerond: die houdt de status "completed".

De officiële doc vermeldt daarnaast dat lineaire progressie niet wordt afgedwongen wanneer de `Course Access Mode` op `Open` staat (open cursussen volgen dan feitelijk vrije toegang).

> **Vergelijk met ons:** Beleggingscollege is in de praktijk "linear-ish free form" — de lessenlijst suggereert een volgorde, maar er is geen harde poort; iedereen mag elke (ontgrendelde) les openen. LearnDash laat die keuze per cursus maken.

Bron: https://www.learndash.com/support/docs/core/courses/course-progression/ (→ https://docs.nexcess.com/software/learndash/course-progression/)

---

## 2. Toegangspoorten tussen cursussen: `Course Prerequisites` en `Course Points`

Beide staan in de cursusinstellingen onder toegang/enrollment (**Course Access Settings**), en werken bovenop de `Course Access Mode` (`Open`, `Free`, `Buy Now`, `Recurring`, `Closed`).

### `Course Prerequisites`

Je wijst één of meer andere cursussen aan die eerst afgerond moeten zijn:

- **`Any Selected`** (standaard) — één van de geselecteerde cursussen afronden volstaat.
- **`All Selected`** — álle geselecteerde cursussen moeten af zijn.

Een cursist die de vereisten mist krijgt bij het openen van de cursus te zien welke cursus(sen) er nog ontbreken.

### `Course Points` als toegangsmunt

Een puntensysteem op cursusniveau, los van quiz- of opdrachtpunten:

- **`Awarded on Completion`** — hoeveel punten het afronden van déze cursus oplevert.
- **`Required for Access`** — hoeveel punten een cursist verzameld moet hebben om deze cursus überhaupt te mogen starten.

Samen vormt dat een impliciet leerpad: instapcursussen leveren punten op, gevorderde cursussen vragen ze. Het is een drempel ("heb je genoeg?"), geen betaling — punten worden niet uitgegeven of afgeschreven, alleen geteld.

> **Vergelijk met ons:** onze XP heeft dezelfde motivatierol als `Course Points`, maar wij gebruiken XP nergens als toegangspoort; toegang is bij ons puur `heeftToegangTot()` (gratis of gekocht).

Bron: https://www.learndash.com/support/docs/core/courses/course-access/ (→ https://docs.nexcess.com/software/learndash/course-enrollment-mode/)

---

## 3. Drip-feed: `Lesson Release Schedule`

Drip zit ingebouwd in de core (geen extra plugin nodig) en staat per les onder **Settings → Lesson Access Settings → Lesson Release Schedule**, met drie opties:

- **`Immediately`** (standaard) — de les is direct beschikbaar zodra iemand ingeschreven is.
- **`Enrollment-based`** — de les komt X dagen ná inschrijving beschikbaar. Let op de definitie: **"1 day" betekent 24 uur na het inschrijfmoment, niet "de volgende kalenderdag"**. Elke cursist heeft dus zijn eigen, persoonlijke ontgrendeldatum.
- **`Specific date`** — de les komt op een gekozen kalenderdatum beschikbaar, voor iedereen tegelijk (cohort-stijl; hiermee bouw je "elke maandag een nieuwe les").

Aanvullende regels:

- **Topics erven het schema van hun les**: topics die aan een geplande les hangen volgen automatisch dezelfde releasedatum; losse topics kun je apart plannen. Ook **quizzen hebben een eigen `Quiz Release Schedule`** met dezelfde drie opties (zie §7).
- **`Sample Lesson`** (zelfde instellingenblok) is het omgekeerde van drip: de les wordt openbaar zichtbaar voor iedereen, ook niet-ingeschrevenen — LearnDash' variant van onze gratis proefles.

**Wat ziet de cursist bij een nog vergrendelde les?** De officiële doc beschrijft dit niet expliciet; volgens meerdere derdenbronnen (o.a. Wooninjas' drip-gids) toont de cursusinhoudslijst bij de vergrendelde les de datum waarop hij beschikbaar komt — bij `Enrollment-based` per cursist uitgerekend. Behandel de exacte weergave/formulering als niet uit officiële bron geverifieerd.

**E-mail bij ontgrendeling** zit níét in de core. Daarvoor is de officiële **`LearnDash Notifications`-add-on** (gratis bij de licentie), met als trigger letterlijk **"A scheduled lesson is available to user"**. Het oudere officiële blog beschreef hetzelfde via Zapier, maar de add-on is de kanonieke route. Zie §11 voor de overige triggers.

> **Vergelijk met ons:** wij hebben bewust geen drip — alles staat direct open na aankoop. LearnDash' les is vooral dat drip een *release-schema op de les* is, geen apart systeem, en dat de vergrendelde les zichtbaar blijft mét datum (verwachtingsmanagement in plaats van een kaal slotje).

Bronnen: https://learndash.com/support/kb/core/lessons/lesson-access/ (→ https://docs.nexcess.com/software/learndash/lesson-access/), https://learndash.com/support/kb/resources/faqs/do-i-need-a-plugin-to-do-drip-feeding/ (→ https://docs.nexcess.com/software/learndash/drip-feeding/), https://www.learndash.com/blog/how-to-automatically-send-emails-when-your-lessons-become-available/, https://wooninjas.com/how-to-drip-feed-learndash-course-content/ (derdenbron)

---

## 4. Tijdslot op een les: `Forced Lesson Timer`

Per les of topic, onder **Settings → Display and Content Options**:

- Toggle **`Forced Lesson Timer`** aan en vul een minimumtijd in in `HH:MM:SS`-formaat (bijv. `00:15:00` voor 15 minuten).
- De cursist moet die tijd op de pagina doorbrengen; de aftellende timer verschijnt **onder de `Mark Complete`-knop**, die pas werkt als de tijd om is.

**Belangrijke beperking:** per les/topic kan maar **één** van deze drie poorten actief zijn: `Video Progression`, `Assignment Uploads` óf `Forced Lesson Timer`. De ene aanzetten schakelt de andere uit. Een les met verplichte video én verplichte opdracht bestaat in core-LearnDash dus niet.

Bron: https://learndash.com/support/kb/core/lessons/lesson-display-content/ (→ https://docs.nexcess.com/software/learndash/lesson-display-content/)

---

## 5. Videopoort: `Video Progression`

Ook onder **Display and Content Options**, voor lessen én topics. De cursist moet de video volledig bekijken voordat de stap afgerond kan worden.

- **`Video URL`** accepteert een kale watch-URL (YouTube/Vimeo), `<iframe>`-embedcode of `[video]`/`[embed]`-shortcodes. Ondersteunde bronnen: YouTube, Vimeo, Wistia, Bunny.net, Spotlightr, Presto Player, Amazon S3 en lokale uploads uit de WordPress-mediabibliotheek.
- **Weergavemoment** (bij stappen met substappen):
  - **`Before completed sub-steps`** (standaard) — video staat er meteen en moet volledig bekeken zijn vóórdat de cursist bij de topics/quizzen van de les kan.
  - **`After completing sub-steps`** — de video verschijnt pas nadat alle substappen af zijn (video als afsluiter).
- **`Autostart`** — video start automatisch bij het laden; browsers dwingen dan gedempt afspelen af, en de gebruiker kan autoplay alsnog blokkeren. Bij `Autostart` worden de bedieningsknoppen standaard verborgen.
- **`Video Controls Display`** — toont play/pauze/volume/ondertiteling alsnog (alleen YouTube en lokale video's).
- **`Video Pause on Window Unfocused`** — pauzeert de video zodra de cursist naar een ander venster/tabblad wisselt (anti-"video op de achtergrond laten lopen").
- **`Video Resume`** — onthoudt via browsercookies waar de kijker gebleven was en speelt vanaf daar verder.
- **Afrondingsopties** (alleen in de `After completing sub-steps`-stand):
  - **auto-afronding** (`Lesson/Topic Auto-completion`) — de stap wordt automatisch op complete gezet zodra de video uit is;
  - **`Completion Delay`** — vertraging in seconden tussen video-einde en het automatisch afronden (standaard 0);
  - een optie om de **`Mark Complete`-knop tóch te tonen** naast de auto-afronding.
- **Valkuil bij testen:** de videologica (auto-afronding, delay, verborgen knop) wordt overgeslagen als je bent ingelogd als Administrator met de optie **`Bypass Course Limits`** aan — als admin "werkt het niet", terwijl het voor cursisten wél werkt.

Bron: https://learndash.com/support/kb/core/lessons/video-progression/ (→ https://docs.nexcess.com/software/learndash/video-progression/)

---

## 6. Opdrachtpoort: `Assignment Uploads`

Derde poortvariant onder **Display and Content Options**: de cursist moet een bestand inleveren bij de les of topic.

- **`File Extensions`** — toegestane extensies, kommagescheiden zonder punt (`doc, pdf, jpg`); leeg = alles toegestaan.
- **Bestandsgrootte** — maximum, bijv. `5M`.
- **`Points`** — toggle om punten aan de opdracht te hangen plus het puntenaantal. Bij handmatige beoordeling kan de beoordelaar de toegekende punten achteraf onbeperkt aanpassen.
- **`Grading Type`**:
  - **`Auto-approve`** (standaard) — inleveren = goedgekeurd, volle punten, les kan meteen afgerond worden.
  - **`Manually approve`** — een admin of Group Leader moet de opdracht goedkeuren, en **de les kan niet worden afgerond zolang de opdracht niet is goedgekeurd**. In een lineaire cursus staat de hele voortgang dus stil tot iemand beoordeelt.
- Bij handmatige beoordeling verschijnen extra opties: **`Limit Number of Uploads`** (maximum aantal inzendingen) en **`Allow File Deletion`** (cursist mag eigen inzending verwijderen zolang die niet is goedgekeurd).
- Beheer: ingeleverde opdrachten staan als eigen posttype onder **LearnDash LMS → Assignments**, waar je ze bekijkt, becommentarieert, goedkeurt en punten toekent.

Bronnen: https://docs.nexcess.com/software/learndash/lesson-display-content/, https://www.learndash.com/support/docs/core/assignments/ (Enable/Manage Assignments)

---

## 7. Quizpoort: `Passing Score` en hertoetsen

Quizinstellingen, per quiz (niet globaal instelbaar), onder **Quiz Access & Progression**:

- **`Passing Score`** — percentage 0–100 dat gehaald moet worden voordat de quiz als afgerond telt. **Op `0` mag de cursist altijd door, ongeacht score.** Bij een hogere drempel blokkeert een onvoldoende de voortgang: in een lineaire cursus komt de cursist niet verder tot de score gehaald is (of tot een admin/Group Leader de stap handmatig op complete zet).
- **Zakken = opnieuw proberen.** Standaard mag een cursist onbeperkt herkansen. **`Restrict Quiz Retakes`** begrenst dat: **`Number of Retries Allowed`** (bijv. 5), toe te passen op alle gebruikers, alleen ingelogde of alleen anonieme gebruikers; anonieme herkansingen kunnen optioneel via een cookie worden bijgehouden. Wat er gebeurt als iemand door zijn pogingen heen is zónder te slagen, documenteert LearnDash niet expliciet — in de praktijk zit de cursist dan vast tot een beheerder ingrijpt (niet officieel geverifieerd).
- **`Quiz Prerequisites`** — andere quizzen die eerst afgerond moeten zijn; wie te vroeg komt krijgt te zien welke quiz er nog mist.
- **`Quiz Release Schedule`** — zelfde drip-opties als lessen: `Immediately` / `Enrollment-based` / `Specific date`.
- **`Registered Users Only`** — quiz alleen voor ingelogde gebruikers (relevant bij `Open`-cursussen of losse quiz-shortcodes).
- Certificaatdrempel is een aparte knop, zie §12.

> **Vergelijk met ons:** bij ons kán een quiz nooit blokkeren — hij bepaalt alleen de XP-bonus en de foutloos-badge; `completeLesson()` accepteert elke score. LearnDash koppelt slagen expliciet aan mógen doorgaan.

Bron: https://learndash.com/support/kb/core/uncategorized/quiz-access-progression/ (→ https://docs.nexcess.com/software/learndash/quiz-access-progression/)

---

## 8. `Mark Complete`: de enige muterende knop, en de admin-overrides

De **`Mark Complete`**-knop is in LearnDash hét muterende pad voor voortgang: hij zet de huidige stap op complete, werkt de cursusvoortgang bij en stuurt de cursist door naar de volgende stap. Alle poorten (timer, video, opdracht, quiz) doen niets anders dan deze knop tegenhouden, verbergen of automatiseren.

Admin-kant — alles vanuit het gewone WordPress-gebruikersprofiel (**Users → Edit user**):

- Sectie met ingeschreven cursussen, per cursus: naam, status (`Not Started` / `In Progress` / `Completed`) en "Completed steps (X van Y)".
- **`Details`** klapt de cursus uit tot les-/topic-/quizniveau met **checkboxes per stap**: aan- of afvinken en **`Update Profile`** klikken past de voortgang direct aan. Zo markeer je stappen (of een hele cursus) handmatig compleet, of maak je ze juist weer ongedaan.
- **`Set Enrollment Date`** — de inschrijfdatum per cursus is aanpasbaar (verschuift dus ook `Enrollment-based` dripdata). Niet mogelijk voor wie via een Group is ingeschreven.
- Quizpogingen staan onder "You have taken the following quizzes" met per poging **`Remove`** (verwijdert de poging en maakt herkansen mogelijk), **`Edit`** en **`Statistics`**.
- **`Permanently delete data`** — wist álle LearnDash-data van die gebruiker, onomkeerbaar.
- Volledig **resetten van voortgang** per cursus is geen core-functie maar de aparte add-on **`LearnDash Progress Reset`** (of maatwerk/derden).
- Rapportage-instap: LearnDash levert basis-CSV-exports van cursusvoortgang en quizresultaten (**Course Progress**-rapport); serieuze rapportage loopt via ProPanel/Reports — apart document.

Bronnen: https://learndash.com/support/kb/core/users/user-management/ (→ https://docs.nexcess.com/software/learndash/user-management/), https://developers.learndash.com/function/learndash_process_user_course_progress_update/

---

## 9. Opslag van voortgang, cursusafronding en hervatten

### Waar de voortgang staat

LearnDash schrijft voortgang dubbel weg (bewust, om historische redenen):

1. **Usermeta** — key **`_sfwd-course_progress`**: één geserialiseerd PHP-array per gebruiker met per cursus de afgeronde lessen/topics en een afrondingsindicator. Dit is het oude, leidende pad voor de UI. Daarnaast per afgeronde cursus een aparte key **`course_completed_{course_id}`** met de afrondingstimestamp.
2. **Eigen tabellen** — **`wp_learndash_user_activity`** en **`wp_learndash_user_activity_meta`**: per activiteit een rij met `user_id`, `post_id`, `activity_type` (`course` / `lesson` / `topic` / `quiz`) en **started/completed-timestamps**. Dit voedt de rapportage en is de richting waar LearnDash naartoe beweegt; de eigen docs zeggen dat de afhankelijkheid van het usermeta-array op termijn verdwijnt.

Bij het afronden van een les worden beide bijgewerkt. Wie migreert of rapporteert moet dus met twee representaties rekening houden die uit elkaar kúnnen lopen.

**Cursusafronding** = alle stappen van de cursus staan op complete; dan krijgt de cursus status `Completed`, wordt de completion-timestamp gezet en vuren completion-hooks (certificaat, notificaties, punten uit §2).

> **Vergelijk met ons:** dit is het spiegelbeeld van onze keuze — wij begonnen bij localStorage en syncen sinds 2 aug 2026 naar `lesson_progress`/`user_stats` op de server; LearnDash begon server-side in usermeta en migreert naar echte tabellen. Beide eindigen op hetzelfde punt: een rij per (gebruiker, stap) met timestamps.

### Hervatten: `Course Resume`

- LearnDash onthoudt per cursus de **laatst bezochte stap** ("last known step", via o.a. `learndash_user_course_last_step`).
- De cursuspagina toont een **Resume-knop** en er is een shortcode **`[ld_course_resume]`** om elders een "ga verder waar je was"-link te renderen.
- De resume-logica **filtert stappen weg die (nog) niet zichtbaar zijn** voor de gebruiker, zodat je nooit op een gedripte of concept-stap landt; een changelog-fix bevestigt dat dit vroeger 404's kon geven.

Bronnen: https://learndash.com/support/kb/resources/faqs/database-info/, https://developers.learndash.com/function/learndash_update_user_activity/, https://developers.learndash.com/function/learndash_user_course_last_step/, https://developers.learndash.com/function/ld_course_resume_shortcode/

---

## 10. Statussen en cursistgerichte navigatie

### Statussen

Elke (gebruiker, cursus)-combinatie heeft één van drie statussen: **`Not Started`**, **`In Progress`**, **`Completed`**. Die verschijnen overal consistent: op cursusoverzichten (Course Grid), in het `[ld_profile]`-profiel van de cursist, in de admin op het gebruikersprofiel en in rapporten. `In Progress` betekent: minstens één stap gezet, nog niet alles af.

### Navigatie voor de cursist

- **Course Content-tabel** op de cursuspagina: de volledige boom van lessen → topics → quizzen, met per stap een voortgangsvinkje, uitklapbare lessen en (bij drip) de beschikbaarheidsdatum; erboven een voortgangsbalk met percentage.
- **Previous/Next-navigatie** op elke les/topic; in lineaire modus brengt "Next" je alleen verder als de huidige stap af is.
- **Breadcrumbs** (cursus → les → topic) in de LearnDash 3.0+-templates, zodat de cursist altijd terug kan naar het bovenliggende niveau.
- **`Focus Mode`** (sinds LD 3.0, per site aan te zetten; werkt niet met het Legacy-template) is de distractievrije leeromgeving voor lessen, topics, quizzen en assignments: site-navigatie, footer en sidebars verdwijnen, en daarvoor in de plaats: **cursusnavigatie permanent in een zijbalk-tray** (sinds 4.1.0 links óf rechts te zetten), **voortgang permanent bovenin**, **Previous/Next bovenin**, en de **`Mark Complete`-knop altijd zichtbaar bovenin**. Instelbaar: contentbreedte (Default 960px / Narrow / Wide / Extra-wide / Full-width), een eigen logo linksboven en een klein profielmenu (standaard "Course Home" en "Logout", uitbreidbaar via WordPress Menus).

> **Vergelijk met ons:** onze lespagina is feitelijk permanent "Focus Mode" (geen site-chrome, lessenlijst in de zijbalk, vorige/volgende onderaan); LearnDash moest dit als aparte modus toevoegen omdat het in willekeurige WordPress-themes draait.

Bronnen: https://docs.nexcess.com/software/learndash/focus-mode/, https://docs.nexcess.com/software/learndash/user-management/, https://docs.nexcess.com/software/learndash/course-progression/

---

## 11. Mail bij voortgangsgebeurtenissen: `LearnDash Notifications`

De officiële Notifications-add-on hangt e-mails aan voortgangstriggers; per notificatie kies je ontvangers (cursist, Group Leader, admin, losse adressen) en een vertraging in dagen (standaard 0). Triggers (v1.6.0+), relevant voor dit document:

- "User enrolls into a course" / "User enrolls into a group"
- **"A scheduled lesson is available to user"** — dé drip-notificatie (§3)
- "User completes a lesson" / "…topic" / "…course"
- "User completes a quiz", "User passes a quiz", "User fails a quiz", "User submits a quiz"
- "An assignment is uploaded" / "An assignment is approved" — sluit de lus van §6
- "An essay has been submitted" / "An essay question has been graded"
- "User hasn't logged in for 'X' days", "'X' days before course expires", "'X' days after a course expires"

Bron: https://learndash.com/support/kb/add-ons/notifications-add-on/notifications-2/ (→ https://docs.nexcess.com/software/learndash/notifications-2/)

---

## 12. Certificaten bij afronding

Certificaten zijn een eigen posttype (opgemaakt met shortcodes voor naam, cursus, datum, score) en worden op twee manieren uitgereikt, altijd als downloadbare PDF:

1. **Cursuscertificaat** — gekoppeld aan een cursus, uitgereikt zodra de cursus op `Completed` staat.
2. **Quizcertificaat** — gekoppeld aan een quiz, met een **eigen drempel ("Certificate Awarded for"-percentage) die mag afwijken van de `Passing Score`**: bijv. slagen bij 70%, maar het certificaat pas bij 90%. Zo kan iemand de cursus halen zonder het certificaat te verdienen.

> **Vergelijk met ons:** ons certificaat verschijnt bij 100% afgeronde lessen zonder scoredrempel; LearnDash' gescheiden "slagen"- en "certificaat"-drempel is een elegante middenweg als we het certificaat ooit zwaarder willen maken.

Bronnen: https://learndash.com/support/kb/core/uncategorized/certificates/, https://academy.learndash.com/topics/assigning-certificates-to-quizzes-and-courses/

---

## Niet geverifieerd / open einden

- De **exacte tekst/opmaak die een cursist ziet bij een vergrendelde drip-les** staat niet in de officiële docs; "datum naast de les in de contentlijst" komt uit derdenbronnen (§3).
- Wat er gebeurt als een cursist **door zijn quiz-herkansingen heen is zonder te slagen** is niet officieel gedocumenteerd (§7).
- De claim dat lineaire progressie niet geldt bij `Course Access Mode: Open` komt uit één officiële docpagina en is niet tegen een live installatie getest (§1).
- Setting-labels kunnen per 4.x-minorversie licht verschuiven; de docs op docs.nexcess.com volgen de actuele versie.

## Bronnen

Officieel (learndash.com-URL's redirecten naar docs.nexcess.com, zelfde documentatie):

- Course Progression — https://www.learndash.com/support/docs/core/courses/course-progression/
- Course Access Settings / Enrollment Mode — https://www.learndash.com/support/docs/core/courses/course-access/
- Lesson Access Settings (drip, sample lesson) — https://learndash.com/support/kb/core/lessons/lesson-access/
- Drip-feeding FAQ — https://learndash.com/support/kb/resources/faqs/do-i-need-a-plugin-to-do-drip-feeding/
- Lesson Display & Content (timer, video, assignments) — https://learndash.com/support/kb/core/lessons/lesson-display-content/
- Video Progression — https://learndash.com/support/kb/core/lessons/video-progression/
- Assignments — https://www.learndash.com/support/docs/core/assignments/
- Quiz Access & Progression — https://learndash.com/support/kb/core/uncategorized/quiz-access-progression/
- User Management (voortgang bewerken) — https://learndash.com/support/kb/core/users/user-management/
- Database Info — https://learndash.com/support/kb/resources/faqs/database-info/
- Focus Mode — https://docs.nexcess.com/software/learndash/focus-mode/
- Notifications Add-On — https://learndash.com/support/kb/add-ons/notifications-add-on/notifications-2/
- Certificates — https://learndash.com/support/kb/core/uncategorized/certificates/
- Blog: e-mails bij vrijgekomen lessen — https://www.learndash.com/blog/how-to-automatically-send-emails-when-your-lessons-become-available/
- Dev docs: `learndash_update_user_activity`, `learndash_user_course_last_step`, `ld_course_resume_shortcode`, `learndash_process_user_course_progress_update` — https://developers.learndash.com/

Derden (alleen gebruikt waar hierboven gemarkeerd):

- Wooninjas, drip-feed gids — https://wooninjas.com/how-to-drip-feed-learndash-course-content/
- LearnDash Academy, Progression & Restriction Settings — https://academy.learndash.com/topics/progression-restriction-settings/
