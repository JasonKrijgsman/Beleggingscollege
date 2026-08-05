# 11 — Broncode: de quizmotor (WP Pro Quiz-fork)

*Deze notitie leest de échte broncode van LearnDash LMS **v4.6.0** (mei 2023), uit Jasons eigen licentie-archief. De actuele lijn is inmiddels 5.x, dus details kunnen zijn opgeschoven; alle regelnummers en klassenamen hieronder gelden voor 4.6.0. Geschreven 5 aug 2026. Waar `02-quizzen.md` de quizmotor uit de documentatie beschrijft, kijkt dit document naar wat de code zelf prijsgeeft — vooral over grading, dataopslag en de lijmlaag.*

Alles staat onder `includes/lib/wp-pro-quiz/` (paden hieronder zijn relatief aan `sfwd-lms/`). De lijmlaag die LearnDash eromheen bouwde staat in `includes/quiz/ld-quiz-pro.php` en `includes/quiz/ld-quiz-essays.php`.

---

## 1. De fork is versteende 2013-code

De motor is een **fork van WP Pro Quiz 0.28** van Julius Fischer ("xeno010"). De `readme.txt` van de fork is nooit bijgewerkt:

- `Stable tag: 0.28`, `Tested up to: 3.6.1` (WordPress 3.6.1 = augustus 2013).
- `wp-pro-quiz.php` draagt nog `Version: 0.28`, `Author: Julius Fischer`, en definieert `WPPROQUIZ_VERSION = '0.28'`.

LearnDash heeft die basis niet herschreven maar eromheen gewerkt. Sporen daarvan in de code:

- **MVC uit 2013**: strikte `WpProQuiz_<Laag>_<Naam>`-naamgeving, handgeschreven Model/Mapper/View/Controller-scheiding met een eigen `Mapper`-basisklasse — geen enkel modern PHP-framework, geen namespaces, geen autoloader-standaard (PSR-4). ~72 PHP-bestanden, ~22.000 regels.
- De `phpcs:disable`-regel bovenaan élk bestand (`WordPress.NamingConventions.ValidVariableName`, `...ValidFunctionName`, `PSR2.Classes.PropertyDeclaration.Underscore`) is een expliciete bekentenis: de code voldoet niet aan de WordPress-codestandaard en dat is met de hand onderdrukt in plaats van opgelost. `camelCase`-methodes (`checkAnswers`, `fetchAll`, `makeDataList`) en `$_underscore`-properties zijn overal.
- Wat LearnDash wél overal heeft aangeraakt: het **textdomain**. In de controllers komt `'wp-pro-quiz'` niet meer voor — alle 108 vertaalstrings gebruiken `'learndash'`. De vertaallaag is dus geherbrand, de architectuur niet.

> **Vergelijk met ons:** onze quizvragen zijn getypte `QuizQuestion`-data in `src/content/`, gecontroleerd tijdens de build — geen MVC-laag, geen eigen ORM, geen 2013-erfenis om omheen te werken.

---

## 2. Eigen databasetabellen — het volledige schema

De motor gebruikt **negen eigen tabellen**, los van WordPress' posts/postmeta. Het schema wordt aangelegd door `dbDelta()` in `lib/helper/WpProQuiz_Helper_DbUpgrade.php` (`databaseDelta()`), en migraties lopen via `upgradeDbV1()` … `upgradeDbV21()` — de teller staat op `WPPROQUIZ_DB_VERSION = 22`. Tabelnamen komen uit `LDLMS_DB::get_table_name( 'quiz_*' )`, wat resulteert in `wp_learndash_pro_quiz_*`.

**Twintig migratiestappen die je nog kunt lezen** zijn op zichzelf een fossielenlaag: V3 maakt de lock-tabel `DEFAULT CHARSET=latin1`, V7 hijst alles alsnog naar `utf8`, V16 dropt kolommen (`answer_json`, `correct_count`, `points_per_answer`) die V15 net had gemigreerd naar het nieuwe `answer_data`-model. Er zitten zelfs `upgradeFixDbV4()`/`upgradeFixDbV8()`-methodes in die een "WordPress SVN Bug" repareren waarbij kolommen niet werden aangemaakt.

### Kerntabellen en hun echte kolommen

**`quiz_master`** (de quiz zelf) — de dikste tabel, ~50 kolommen, vrijwel allemaal `tinyint(1)`-vlaggetjes voor gedrag: `result_grade_enabled`, `question_random`, `answer_random`, `time_limit int(11)`, `statistics_on`, `quiz_run_once` + `quiz_run_once_type`/`_cookie`/`_time` (retake-lock), `toplist_activated` + `toplist_data text`, `quiz_modus tinyint(3)`, `show_review_question`, `email_notification`, `start_only_registered_user`, `questions_per_page`, `prerequisite`. De hoeveelheid boolean-kolommen laat zien dat de configuratie in de tabelvorm zit, niet in een JSON-blob.

**`quiz_question`** (de vraag) — kolommen die ertoe doen:
- `answer_type varchar(50)` — het vraagtype als string (`single`, `multiple`, `sort_answer`, `matrix_sort_answer`, `cloze_answer`, `free_answer`, `assessment_answer`, `essay`).
- `answer_data longtext NOT NULL` — **hier zitten de antwoorden in, PHP-`serialize()`'d** (zie §3). Dit is de kern.
- `points int(11)`, `answer_points_activated tinyint(1)`, `answer_points_diff_modus_activated`, `disable_correct`, `correct_msg text`, `incorrect_msg text`, `tip_msg text`, `category_id`, `online tinyint(1)` (concept/gepubliceerd).

**`quiz_statistic_ref`** (één rij per quizpoging) — `statistic_ref_id` (PK, auto-increment), `quiz_id`, `quiz_post_id`, `course_post_id`, `user_id bigint(20)`, `create_time int(11)`, `is_old tinyint(1)`, `form_data text`. Dit is de "attempt header".

**`quiz_statistic`** (één rij per vraag binnen een poging) — PK is `(statistic_ref_id, question_id)`. Kolommen: `question_post_id`, `correct_count`, `incorrect_count`, `hint_count`, `points int(10)`, `question_time int(10)`, `answer_data text` (het antwoord van de gebruiker, JSON-encoded). Zo bewaart LearnDash per poging wélk antwoord de cursist gaf.

**`quiz_lock`** (retake-/statistiek-lock) — PK `(quiz_id, lock_ip, user_id, lock_type)`. `lock_type` is `TYPE_STATISTIC = 1` of `TYPE_QUIZ = 2` (`lib/model/WpProQuiz_Model_Lock.php`). `lock_date int(11)`. Zie §7.

**`quiz_toplist`** — ranglijst: `points`, `result float`, `name varchar(30)`, `email`, `ip varchar(100)`. **`quiz_prerequisite`** — `(prerequisite_quiz_id, quiz_id)`. **`quiz_template`** — herbruikbare instellingen als `data text`. **`quiz_form`** — extra invoervelden vóór de quiz (`fieldname`, `type`, `data mediumtext`). **`quiz_category`** — `category_id`, `category_name`.

> **Vergelijk met ons:** wij bewaren geen enkele quizconfiguratie in een database — de vraag ís de getypte data, en de individuele quizantwoorden van een cursist blijven bij ons zelfs alleen lokaal in de browser. LearnDash schrijft per vraag per poging een rij weg, inclusief het gegeven antwoord.

---

## 3. Hoe antwoorddata is opgeslagen: `serialize()` van `AnswerTypes`-objecten

De antwoorden van een vraag zijn een **PHP-geserialiseerde array van `WpProQuiz_Model_AnswerTypes`-objecten** in `quiz_question.answer_data`. Eén klasse dekt álle vraagtypes (`lib/model/WpProQuiz_Model_AnswerTypes.php`):

```
_answer (string)   _correct (bool)   _points (int)   _html (bool)
_sortString        _sortStringHtml   _graded         _gradingProgression   _gradedType
```

Een single/multiple-antwoord gebruikt `_answer`+`_correct`+`_points`; sorteren gebruikt `_sortString`; essay gebruikt `_graded`/`_gradingProgression`/`_gradedType`. Eén objecttype dat via ongebruikte velden alles moet dekken — typisch 2013.

- Opslaan: `WpProQuiz_Model_QuestionMapper::save()` schrijft `answer_data => $question->getAnswerData( true )`, waarbij `true` betekent `serialize()`.
- Lezen: `WpProQuiz_Model_Question::getAnswerData()` doet `@maybe_unserialize()` — en heeft een **defensieve reparatie** ingebouwd: `learndash_recount_serialized_bytes()` herstelt geserialiseerde strings waarvan de bytelengte niet meer klopt (na tekensetconversies of kopieerfouten), en herserialiseert ze terug de kolom in. Dat er zo'n functie nodig was, tekent de kwetsbaarheid van `serialize()`-in-een-tekstkolom.
- De migratie in `upgradeDbV15()` laat de historische omslag zien: dáár werd het oude `answer_json` (échte JSON) omgezet naar deze `serialize()`-vorm door per rij `WpProQuiz_Model_AnswerTypes`-objecten te bouwen en `serialize( $newData )` weg te schrijven.

Merk op: de vraagdéfinitie gebruikt `serialize()`, maar het gegeven ántwoord in `quiz_statistic.answer_data` gebruikt `json_encode()`. Twee serialisatievormen in dezelfde motor.

---

## 4. Client-side grading — en wat er écht mee gebeurt

Dit is het interessantste stuk voor ons, want wij graden ook client-side. Het antwoord is genuanceerder dan "de correcte antwoorden staan in de browser".

### 4a. Wat de browser bij het laden wél en níét krijgt

De frontend krijgt een `json`-object per vraag mee, gebouwd in het template `themes/legacy/templates/quiz/partials/show_quiz_questions_box.php`. Daar wordt per vraag `$json[id]['correct'][]` en `$json[id]['points'][]` opgebouwd — dús mét de juiste antwoorden. **Maar** vlak voordat dat naar de pagina gaat, strip `WpProQuiz_View_FrontQuiz.php` (rond regel 205) beide velden eruit:

```php
foreach ( $quizData['json'] as $key => $value ) {
    foreach ( array( 'points', 'correct' ) as $key2 ) {
        unset( $quizData['json'][ $key ][ $key2 ] );
    }
}
```

Wat de browser bij paginalaad krijgt in `json:` is dus per vraag alleen `type` en structuur, **niet welke optie juist is**. Dat is een bewuste verharding t.o.v. het originele wpProQuiz 0.28, dat wél volledig client-side naderekende uit ingebedde data.

### 4b. Per vraag: een server-side check via AJAX

Als de cursist een vraag inlevert, POST `wpProQuiz_front.js` (`checkQuestion()`, ~regel 2865) naar `admin-ajax.php`:

```
action: 'ld_adv_quiz_pro_ajax', func: 'checkAnswers',
data: { quizId, quiz, course_id, quiz_nonce, responses }
```

Server-side handelt `LD_QuizPro::checkAnswers()` (`includes/quiz/ld-quiz-pro.php`, regel 110) dit af. Het:
1. Verifieert de `quiz_nonce` (`sfwd-quiz-nonce-<quizpost>-<quizpro>-<user>`); faalt dat, dan `die()`.
2. Herbouwt de vraagdata server-side uit de mappers (dus uit de tabel, niet uit de payload).
3. Beoordeelt per vraagtype **op de server** of het antwoord goed is, berekent punten, en retourneert per vraag `{ c: correct, p: points, s: statistics, e: extra }`.
4. **Ondertekent** de uitkomst met twee WordPress-nonces: `p_nonce` over de tuple `(user, quizpro, quizpost, vraag-id, geserialiseerde punten)` en `a_nonce` over het antwoord (regels 864 en 881). Die nonces gaan met de response mee terug.

De browser toont daarna goed/fout via `markCorrectIncorrect()` — die de juiste opties leest uit `result.e.c`, dat de server **op dit moment** teruggeeft. De correcte antwoorden komen dus wél in de browser, maar pas nádat de server het antwoord heeft gezien en beoordeeld — niet als vooraf ingebedde sleutel.

### 4c. Bij afronden: de server vertrouwt de score niet, hij herrekent

Bij het afronden POST de JS (`sendCompletedQuiz()`, regel 2540) het hele `results`-object — inclusief per vraag `points`, `correct`, `data`, én de `p_nonce`/`a_nonce` — naar `action: 'wp_pro_quiz_completed_quiz'`. Dat komt binnen bij `WpProQuiz_Controller_Admin::completedQuiz()` (regel 253). Een commentaarregel legt het ontwerp expliciet uit:

> *"LD 2.4.3 - Change in logic. Instead of accepting the values for points, correct etc from JS we now pass the 'results' array on the complete quiz AJAX action. This now let's us verify the points, correct answers etc. as each have a unique nonce."*

Wat er concreet gebeurt (regels 327–435):
- Voor elke vraag herbouwt de server de `points_str`/`response_str` uit de meegestuurde waarden en checkt `wp_verify_nonce()` tegen exact dezelfde nonce als bij `checkAnswers`. **Klopt de handtekening niet — omdat iemand `points`/`correct` heeft zitten sleutelen — dan worden `points`, `correct` en `possiblePoints` op 0 gezet** (en `possiblePoints` teruggezet op de waarde uit de vraag). Antwoorddata zonder geldige `a_nonce` wordt geleegd.
- Daarna telt de server `total_awarded_points`, `total_correct` en `total_possible_points` **zelf** op uit de (nu geverifieerde) per-vraag-waarden, en overschrijft `comp.points` en `comp.correctQuestions` (regels 422–423).
- Het eindpercentage wordt server-side herrekend; wijkt de client-waarde af, dan wint de herrekening (regels 430–435): *"Recalculated result value … will be used."*

**Het antwoord op onze vraag** — verifieert de marktleider de score server-side, of slaat hij blind op? Hij verifieert. Niet door bij afronding alles opnieuw te graden vanaf nul, maar door bij elke tussentijdse check een **ondertekend bewijs** (WP-nonce als HMAC-achtige handtekening) af te geven en dat bij afronding te controleren. Een geknoeide payload verliest zijn punten. Het is echte server-side autoriteit, netjes verpakt.

Twee kanttekeningen die de code óók laat zien:
- WordPress-nonces zijn **24 uur geldig en niet single-use**. Binnen dat venster is een geldig-ondertekend `(vraag, punten)`-paar herbruikbaar. Voor scorefraude helpt dat niet (je kunt de handtekening niet vervalsen), maar het is geen anti-replay.
- `timespent`, `quizStartTimestamp` en `quizEndTimestamp` komen ongetekend uit de client (`wp_pro_quiz_completed()`, regels 1171/1297) en worden alleen voor statistiek gebruikt — geen poort hangt eraan.

> **Vergelijk met ons:** bij Beleggingscollege reizen de antwoorden nooit naar de server en er is geen slaagpoort — de quizscore geeft alleen een XP-bonus. De aanval die LearnDash met nonces afdekt (score opblazen) bestaat bij ons deels wél: `docs/openstaand.md` §6 beschrijft dat wie `correct = total` POST naar `/api/voortgang` de quizbonus pakt zonder een vraag te beantwoorden. LearnDash' nonce-ondertekening is precies het mechanisme dat dat gat dicht — het verschil is dat hun uitkomst een certificaat/voortgang ontgrendelt en die van ons alleen punten.

---

## 5. De statistiekpijplijn

Na een geldige afronding roept `WpProQuiz_Controller_Quiz::completedQuiz()` (regel 913) `WpProQuiz_Controller_Statistics::save()` aan. Die:

1. Bouwt via `makeDataList()` per vraag een `WpProQuiz_Model_Statistic`-object. **Hier zit een tweede klem**: `if ( (int) $v['points'] > (int) $q['points'] ) $v['points'] = $q['points'];` en negatieve punten worden op 0 gezet — dus zelfs als de nonce-check gefaald zou hebben, kan een vraag nooit méér punten opleveren dan de vraag waard is.
2. Schrijft één `quiz_statistic_ref`-rij (de poging-header) plus per vraag een `quiz_statistic`-rij.

De wegschrijf zelf (`WpProQuiz_Model_StatisticRefMapper::statisticSave()`, regel 300) is verhelderend: de ref-rij gaat via `$wpdb->insert()`, maar de per-vraag-rijen worden **met de hand tot één `INSERT INTO … VALUES (…), (…)`-string aan elkaar geplakt** en in één `$wpdb->query()` weggeschreven. Individuele waarden gaan wel door `$wpdb->prepare('%s', …)` (regel 352), maar de VALUES-lijst wordt string-geconcateneerd — geen nette parameterbinding over het geheel. Werkt, maar het is precies het soort 2013-patroon dat een moderne codebase niet meer zou schrijven.

---

## 6. De lijmlaag: dubbele boekhouding

LearnDash houdt **twee parallelle administraties** bij, en dat is de kern van de fork-integratie:

- **De pro-quiz-tabellen** (`quiz_statistic*`) — de motorstatistiek, per vraag.
- **WordPress `usermeta`** — `LD_QuizPro::wp_pro_quiz_completed()` (regel 1161) bouwt een `$quizdata`-array (`score`, `count`, `pass`, `percentage`, `points`, `total_points`, `pro_quizid`, `course`, `lesson`, `timespent`, `has_graded`, `statistic_ref_id`, `quiz_key`, …) en `update_user_meta( $user_id, '_sfwd-quizzes', … )`. Dít is wat het LearnDash-dashboard leest, niet de pro-quiz-tabellen.

De koppeling tussen beide werelden:
- Elke pro-quiz heeft een `id` (de motor) én een WordPress-`sfwd-quiz`-post-id. `learndash_get_quiz_id_by_pro_quiz_id()` maakt de brug; de post bewaart de pro-id in meta.
- **Twee hooks, twee lagen.** De motor vuurt `do_action( 'wp_pro_quiz_completed_quiz', $statistic_ref_id )` (het 2013-signaal). LearnDash hangt daar `LD_QuizPro::wp_pro_quiz_completed()` aan, en die vuurt op zijn beurt het moderne `do_action( 'learndash_quiz_completed', $quizdata, $user )` — dát is de hook waar de rest van LearnDash (voortgang, certificaten, notificaties, add-ons) op luistert. De naam `wp_pro_quiz_completed_quiz` vs `learndash_quiz_completed` markeert letterlijk de grens tussen de geërfde motor en de eromheen gebouwde LMS.
- In dezelfde functie doet LearnDash het echte LMS-werk: `learndash_process_mark_complete()` voor les/topic/cursus (als het slaagpercentage gehaald is), en het bepalen of álle quizzes van een cursus af zijn.

> **Vergelijk met ons:** wij hebben één voortgangspad (`completeLesson()` in `src/lib/progress.tsx`, server-sync via `src/lib/voortgang-server.ts`) en geen brug tussen twee id-ruimtes of twee opslagvormen. LearnDash' dubbele boekhouding is de prijs van een 2013-motor levend houden binnen een moderne LMS.

---

## 7. Retake- en locklogica

Twee onafhankelijke mechanismen, afhankelijk van of de bezoeker is ingelogd (`WpProQuiz_Controller_Quiz::completedQuiz()`, regels 959–1092):

- **Anoniem (user_id 0): cookie + IP-lock.** Een cookie `wpProQuiz_lock` bevat JSON met per quiz een `{ time, count }`. Bij afronden verhoogt de teller; boven het toegestane aantal `repeats` volgt een lock. Daarnaast een rij in `quiz_lock` op `(quiz_id, lock_ip, user_id=0, TYPE_QUIZ)`. Beide zijn triviaal te omzeilen (cookie wissen, IP wisselen) — het is een drempel, geen poort.
- **Ingelogd: tellen in `usermeta`.** De code telt in `_sfwd-quizzes` hoe vaak deze gebruiker de quiz voor deze cursus al deed en vergelijkt met `learndash_quiz_get_repeats()`. Admins kunnen dit passeren via `learndash_prerequities_bypass`.
- **Statistiek-lock** is een aparte `lock_type` (`TYPE_STATISTIC`, timervenster `statistics_ip_lock` minuten) die dubbel wegschrijven van statistiek binnen korte tijd tegenhoudt.

De `deleteOldLock()`-aanroep ruimt locks ouder dan 7 dagen (`60*60*24*7`) op bij elke afronding — er is geen aparte cron.

---

## 8. Essay-afhandeling

Het `essay`-type is het enige dat níét automatisch scoort. Paddetails (`includes/quiz/ld-quiz-essays.php`):

- Essays zijn een **eigen WordPress custom post type** `sfwd-essays` (`learndash_register_essay_post_type()`), met eigen poststatussen `not_graded` en `graded` (`register_post_status`).
- Bij inleveren maakt `learndash_add_new_essay_response()` een `sfwd-essays`-post. De inhoud gaat door `wp_kses()` met `post`-toegestane HTML — netjes gesaneerd. Uploadvarianten krijgen `See upload below.` als placeholder.
- De grading-progressie zit in het `AnswerTypes`-object (`_gradingProgression`: `not-graded-none` / `not-graded-full` / `graded-full`; `_gradedType`: `text` / `upload`).
- **Gevolg voor cursusvoortgang**: als een quiz een niet-automatisch beoordeelde essay bevat, houdt `wp_pro_quiz_completed()` het `learndash_quiz_completed`-signaal expres tegen (`$send_quiz_completed = false`, regels 1370–1378) tot de essay handmatig op `graded` staat. De cursus schuift dus niet vooruit op een onbeoordeelde open vraag. Docent-grading zelf loopt via het admin-scherm (`class-learndash-admin-essay-edit.php`, nonce `learndash-essay-grading-nonce`).

> **Vergelijk met ons:** wij hebben geen open (door mensen te beoordelen) vragen in de quizmotor; onze "menselijke laag" is de redactionele "Vragen & antwoorden bij de les", niet een gescoorde essay die voortgang blokkeert.

---

## 9. Wat de fork goed en slecht doet

**Goed:**
- **Server-side score-autoriteit via nonce-ondertekening** (§4c) is een doordacht, robuust ontwerp dat je niet zou verwachten in code met een 2013-hart. Punten worden geklemd op het maximum van de vraag (§5), zowel via de nonce-route als los daarvan.
- **Nonce-gepoorte AJAX**: elke publieke quiz-AJAX (`checkAnswers`, `completedQuiz`, `loadData`) verifieert de `sfwd-quiz-nonce`; zonder geldige nonce `die()`.
- **Essay-inhoud gaat door `wp_kses()`**; SQL in de mappers gebruikt overwegend `$wpdb->prepare()`.

**Slecht / verouderd:**
- **`serialize()` in een `longtext`-kolom** voor antwoorddefinities is fragiel — zo fragiel dat er een `learndash_recount_serialized_bytes()`-reparatiefunctie omheen moest (§3).
- **Handmatig aan elkaar geplakte multi-row `INSERT`** in `statisticSave()` (§5) i.p.v. volledige parameterbinding.
- **Twee serialisatievormen** (`serialize()` voor de vraag, `json_encode()` voor het antwoord) in dezelfde motor.
- **`@`-error-suppression** op `maybe_unserialize`/`json_encode` verbergt fouten in plaats van ze af te handelen.
- **20 met de hand geschreven migratiestappen** met SVN-bug-workarounds erin — de databaseversie loopt tot 22 en de geschiedenis is nooit opgeschoond.
- De hele laag draait op onderdrukte codestandaard-waarschuwingen (§1).

---

## Wat de code zegt dat de docs niet zeggen

1. **De quizmotor is letterlijk WP Pro Quiz 0.28 uit 2013** — versie, auteur en "tested up to WP 3.6.1" staan onaangeroerd in de fork. De documentatie presenteert een moderne quizengine; de code is een geconserveerd fossiel met een LMS eromheen.
2. **Correcte antwoorden staan níét vooraf in de browser.** De docs suggereren client-side grading; de code strip `correct`/`points` uit de ingebedde `json` (§4a) en beoordeelt elk antwoord server-side via een AJAX-round-trip.
3. **De score wordt server-side geverifieerd met ondertekende nonces, niet blind opgeslagen** (§4c) — precies het antwoord op onze vraag, en het gat dat ons eigen `/api/voortgang` (`docs/openstaand.md` §6) nog openlaat.
4. **Er is een dubbele boekhouding**: pro-quiz-tabellen én `_sfwd-quizzes` usermeta, gekoppeld via twee id-ruimtes en twee hooks (`wp_pro_quiz_completed_quiz` → `learndash_quiz_completed`). Het dashboard leest de usermeta, niet de motortabellen.
5. **Retake-locks zijn cosmetisch voor anonieme bezoekers** (cookie + IP), en de statistiek-wegschrijf gebruikt string-geconcateneerde SQL.

### Onzekerheden

- Dit is **v4.6.0**; in 5.x kunnen de regelnummers, de nonce-details en zelfs de opslagvorm (`serialize()` → mogelijk anders) zijn verschoven. Alle regelverwijzingen zijn tegen 4.6.0 gecontroleerd, niet tegen actueel.
- De WordPress-nonce fungeert hier als handtekening; ik heb niet gemeten of er edge-cases zijn waarin `checkAnswers` een `p_nonce` afgeeft en `completedQuiz` die door een andere `$user_id`-context (bijv. sessieverloop tussen check en afronding) alsnog afwijst — de code veronderstelt dezelfde gebruiker gedurende de poging.
- De `themes/legacy`-templatevariant is hier gelezen; `themes/ld30` kan de `json`-opbouw op onderdelen anders doen (ik heb de strip-stap in de gedeelde `WpProQuiz_View_FrontQuiz` geverifieerd, niet elke themevariant van het questions-box-template).
- Ik heb de nonce-geldigheid (24u, niet single-use) uit WordPress-kennis afgeleid, niet uit LearnDash-code — LearnDash kan `nonce_life` filteren; dat heb ik niet nagezocht.
