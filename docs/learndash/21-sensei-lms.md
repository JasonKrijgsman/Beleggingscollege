# 21 — Sensei LMS van binnen: het WordPress-LMS van Automattic

> Gelezen op **5 augustus 2026**: de gratis versie van [wordpress.org](https://wordpress.org/plugins/sensei-lms/), **versie 4.26.2**, uitgebracht op 29 juli 2026. Licentie **GPLv2 or later**, auteur **Automattic** (het bedrijf achter WordPress.com, WooCommerce en Jetpack). Omdat het GPL is, mag hier vrij uit geciteerd worden; de fragmenten zijn kort gehouden en dienen als bewijs. Alle bestandspaden zijn relatief aan de pluginmap `sensei-lms/`.
>
> **Lees dit naast hoofdstuk 10 (datamodel, voortgang, toegang, betalingen), 11 (quizmotor) en 18 (de conclusies).** Dit hoofdstuk beantwoordt exact dezelfde vragen voor Sensei, in dezelfde volgorde, zodat de twee regel voor regel te vergelijken zijn. LearnDash wordt hier niet opnieuw beschreven; waar het nodig is staat er alleen een verwijzing.
>
> Waarom Sensei interessant is: het is gebouwd door Automattic, en Automattic gebruikt het zelf voor de interne trainingen van het bedrijf (dat staat letterlijk in `readme.txt`). De verwachting vooraf was "WordPress-core-idiomatisch, dus voortgang in de commentaartabel". Die verwachting klopt, maar het verhaal eronder is interessanter dan het cliché.

---

## 1. Contentmodel

### 1.1 Zes post types, zeven taxonomieën

Alles staat in `includes/class-sensei-posttypes.php`, geregistreerd op `init`.

| Post type | `public` | `show_in_rest` | Rol |
|---|---|---|---|
| `course` | ja | ja (`courses`) | de cursus |
| `lesson` | ja | **ja** (`lessons`, `Sensei_REST_API_Lessons_Controller`) | de les, inhoud in `post_content` |
| `quiz` | ja | nee | lege containerpost, `'supports' => array( '' )` |
| `question` | **nee** | ja (`questions`) | één vraag, met het antwoord in postmeta |
| `multiple_question` | nee | nee | plaatshouder voor "N willekeurige vragen uit categorie X" |
| `sensei_message` | ja | ja (`sensei-messages`) | privébericht cursist naar docent |

De `quiz`-post is het duidelijkste teken van hoe dit model in elkaar zit: hij ondersteunt geen titel en geen editor, en krijgt zelfs `'capabilities' => array( 'edit_published_posts' => 'do_not_allow' )`. Hij bestaat alleen om vragen aan te hangen.

Taxonomieën: `module` (hiërarchisch, gedeeld door `course` én `lesson`), `course-category`, `question-type`, `question-category`, `lesson-tag`, `quiz-type` (vestigiaal) en `sensei_learner`. Die laatste is geen inhoudelijke taxonomie maar de **inschrijvingsadministratie**, zie §3.

**Modules zijn dus een taxonomie, geen post type.** Dat is een fundamenteel andere keuze dan LearnDash' Topic-als-post-type: een module is bij Sensei een term die zowel aan de cursus als aan de les hangt, en de volgorde binnen de module zit in postmeta.

### 1.2 De hiërarchie is postmeta plus taxonomie, niet `post_parent`

- **Cursus naar les**: postmeta `_lesson_course` op de *les*. Volgorde: `_order_{$course_id}` op de les, plus een CSV `_lesson_order` op de cursus. Binnen een module: `_order_module_{$module_id}`.
- **Les naar quiz**: hier houdt Sensei **twee** koppelingen tegelijk bij, `post_parent` van de quiz *en* wederzijdse meta `_quiz_lesson` en `_lesson_quiz`. `Sensei_Quiz::get_lesson_id()` leest `post_parent`, andere code leest `_quiz_lesson`. Twee waarheden over dezelfde relatie, allebei onderhouden.
- **Quiz naar vraag**: veel-op-veel via niet-unieke meta `_quiz_id` op de vraag (met `$unique = false`, dus een vraag kan in meerdere quizzen zitten), plus een array `_question_order` op de quiz, plus per quiz een **dynamisch genoemde** meta-sleutel op de vraag: `_quiz_question_order{$quiz_id}`. Dat laatste is een bekende schaalwrat: elke quiz waarin een vraag voorkomt voegt een nieuwe meta-sleutelnaam toe aan de postmeta-tabel.

### 1.3 Blokken zijn de weergave, niet de opslag

Dit is het beste stuk van het contentmodel en het is precies andersom dan je bij een Gutenberg-first plugin zou verwachten.

De lesinhoud zit in `post_content` als blokken (er zijn 40 blokmappen onder `includes/blocks/`, samen 67 PHP-bestanden en ruim 7.000 regels). Maar de **cursusstructuur** zit níét in blokken. `Sensei_Course_Structure` (`includes/class-sensei-course-structure.php`) is de enige bron van waarheid en leest en schrijft uitsluitend taxonomietermen en postmeta. Het `sensei-lms/course-outline`-blok bevraagt die structuur bij het renderen en legt er alleen presentatie-attributen overheen:

```php
$structure = Sensei_Course_Structure::instance( $post->ID )->get( $context );
$this->add_block_attributes( $structure );
```

Gevolg: het blok uit de editor gooien verwijdert de cursusstructuur niet. Vergelijk dat met platformen waar de structuur ín de blokmarkup leeft en een verkeerde plakactie een cursus sloopt.

### 1.4 Vraagtypen en waar het antwoord staat

Zes typen, als termen in de taxonomie `question-type` (`includes/class-sensei-question.php`):

```php
'multiple-choice' => __( 'Multiple Choice', 'sensei-lms' ),
'boolean'         => __( 'True/False', 'sensei-lms' ),
'gap-fill'        => __( 'Gap Fill', 'sensei-lms' ),
'single-line'     => __( 'Single Line', 'sensei-lms' ),
'multi-line'      => __( 'Multi Line', 'sensei-lms' ),
'file-upload'     => __( 'File Upload', 'sensei-lms' ),
```

Het antwoord staat in postmeta op de vraagpost: `_question_right_answer`, `_question_wrong_answers`, `_question_grade`, `_answer_feedback`, `_random_order`. Geen eigen tabellen, geen `serialize()`-blob met objecten erin. `gap-fill` propt drie velden in één string met `||` als scheidingsteken, wat lelijk is maar leesbaar blijft.

Quizinstellingen zijn postmeta op de quiz: `_quiz_passmark`, `_quiz_grade_type` (`auto` of `manual`), `_pass_required`, `_enable_quiz_reset`, `_show_questions`, `_random_question_order`.

> **Vergelijk met ons:** onze cursus is één getypt TypeScript-bestand dat de build controleert. Sensei's model is een graaf van losse posts, verbonden door meta-sleutels waarvan er één (`_quiz_question_order{$id}`) per quiz een nieuwe naam krijgt. Wat Sensei wél goed doet en wij ook doen: de structuur is data, niet opmaak.

---

## 2. Voortgangsopslag

### 2.1 De commentaartabel: bevestigd, en het is nog steeds de standaard

De historische claim klopt. Voortgang zijn rijen in `wp_comments` met een eigen `comment_type`, geschreven door `Sensei_Utils::sensei_log_activity()` (`includes/class-sensei-utils.php:50`):

```php
$data = array(
    'comment_post_ID'  => intval( $args['post_id'] ),
    'comment_type'     => esc_attr( $args['type'] ),
    'user_id'          => intval( $args['user_id'] ),
    'comment_approved' => ! empty( $args['status'] ) ? esc_html( $args['status'] ) : 'log',
);
```

Twee types doen het werk: **`sensei_course_status`** en **`sensei_lesson_status`**. De lesrij is tegelijk de lesvoortgang, de quizvoortgang én de quizinzending.

Let op waar de status landt: in **`comment_approved`**, de kolom die WordPress gebruikt voor `1` / `0` / `spam` / `trash`. Sensei zet daar `in-progress`, `complete`, `ungraded`, `graded`, `passed`, `failed` in. Dat de tabel niet voor dit doel gemaakt is, blijkt uit de reparatie die ze ernaast moesten zetten (`includes/class-sensei-utils.php:2129`): een filter dat met `str_replace` in het SQL-fragment van `WP_Comment_Query` snijdt om de eigen statuswaarden er weer uit te krijgen:

```php
$pieces['where'] = str_replace( array( "( comment_approved = '0' OR comment_approved = '1' ) AND", ... ), '', $pieces['where'] );
```

Alles wat geen status is, staat in `wp_commentmeta`: op de cursusrij `start`, `percent` en `complete` (het aantal afgeronde lessen en het percentage, gedenormaliseerd en bij elke lesafronding herschreven), op de lesrij `start`, `grade`, `quiz_answers`, `questions_asked`, `quiz_grades`, `quiz_answers_feedback`. De antwoorden van een cursist zijn één geserialiseerd array in één meta-rij, gelezen en teruggeschreven bij elke wijziging.

### 2.2 Er is een moderne tabelbackend, maar hij staat uit

Sinds 4.16.1 (15 augustus 2023) zit er een compleet tweede opslagmodel in de plugin, "High-Performance Progress Storage" (HPPS). Het schema staat in `includes/internal/installer/class-schema.php` en is aantoonbaar beter ontworpen dan wat LearnDash heeft:

```sql
CREATE TABLE {$wpdb->prefix}sensei_lms_progress (
	id bigint UNSIGNED NOT NULL AUTO_INCREMENT,
	post_id bigint UNSIGNED NOT NULL,
	user_id bigint UNSIGNED NOT NULL,
	parent_post_id bigint UNSIGNED,
	type varchar(20) NOT NULL,
	status varchar(20) NOT NULL,
	started_at datetime, completed_at datetime,
	created_at datetime NOT NULL, updated_at datetime NOT NULL,
	PRIMARY KEY  (id),
	UNIQUE KEY user_progress (post_id, user_id, type),
	KEY status (status)
)
```

Plus `sensei_lms_quiz_submissions` (`UNIQUE KEY (quiz_id, user_id)`), `sensei_lms_quiz_answers` (`UNIQUE KEY (submission_id, question_id)`) en `sensei_lms_quiz_grades` (`UNIQUE KEY (answer_id, question_id)`). Eén polymorfe voortgangstabel, gediscrimineerd op `type`, met **echte unieke sleutels** en `datetime` in plaats van `int(11)`-timestamps.

**Maar: het staat standaard uit, en het heet in de interface letterlijk experimenteel** (`includes/internal/services/class-progress-storage-settings.php`):

```php
public const COMMENTS_STORAGE = 'comments';
public const TABLES_STORAGE   = 'custom_tables';
...
self::TABLES_STORAGE => __( 'High-Performance progress storage (experimental)', 'sensei-lms' ),
```

```php
public static function get_current_repository(): string {
    return Sensei()->settings->settings['experimental_progress_storage_repository'] ?? self::COMMENTS_STORAGE;
}
```

De instelling zelf zit bovendien achter een feature flag (`experimental_features_ui`), en de tabellen worden pas aangemaakt als de vlag aan staat. Op een verse installatie in augustus 2026 bestaan ze niet. **Bijna drie jaar experimenteel.**

### 2.3 Eén bron of een spiegel? Alle drie, en dat is de sterke kant

De overgang is gebouwd als een strangler fig, en dat is netjes gedaan. Elke domeinlaag heeft vier repository-implementaties achter één interface (`includes/internal/student-progress/{course,lesson,quiz}-progress/repositories/`):

```php
public function create(): Lesson_Progress_Repository_Interface {
    if ( ! $this->tables_enabled ) { return new Comments_Based_Lesson_Progress_Repository(); }
    if ( ! $this->read_tables ) {
        return new Comment_Reading_Aggregate_Lesson_Progress_Repository( $comments, $tables );
    }
    return new Table_Reading_Aggregate_Lesson_Progress_Repository( $comments, $tables );
}
```

Drie standen: alleen commentaren, dubbel schrijven en uit commentaren lezen, dubbel schrijven en uit tabellen lezen. De migratie zelf loopt in batches over Action Scheduler, houdt zijn positie bij in de optie `sensei_migrated_progress_last_comment_id`, en er zijn losse validatieklassen die achteraf controleren of beide kanten overeenkomen. Dat is precies hoe je zoiets doet.

### 2.4 Transactioneel? Nee. Nergens.

Een zoektocht door de hele `includes/`-boom naar `START TRANSACTION`, `COMMIT`, `ROLLBACK`, `FOR UPDATE` en `GET_LOCK` levert **nul treffers** op. De enige transactiemachinerie in de plugin zit in `vendor/woocommerce/action-scheduler`, en dat is externe code.

Concreet betekent dat:

- In de dubbelschrijfstand gaan de commentaarschrijf en de tabelschrijf los van elkaar. Valt er iets tussenuit, dan lopen de twee backends stil uit elkaar; er is geen compensatie in `create()` of `save()`.
- `sensei_log_activity()` doet een `SELECT` op `(comment_post_ID, user_id, comment_type)` en daarna een `INSERT`. Klassieke check-then-act zonder slot, en op `wp_comments` bestaat geen unieke sleutel die het opvangt. De commentaargebaseerde repository *verwacht* dubbele rijen: hij sorteert een array en pakt de eerste.
- `Sensei_Quiz::save_user_answers()` doet eerst `delete_all()` op de cijfers en de antwoorden en maakt daarna per vraag een nieuwe rij. Halverwege afgebroken betekent: antwoorden weg.

> **Vergelijk met ons:** wij tellen delta's op in één statement met data-modifying CTE's, juist omdat `neon-http` geen transacties kan. Sensei heeft transacties tot zijn beschikking en gebruikt ze niet. In de tabelbackend vangt de `UNIQUE KEY` de race alsnog af; in de commentaarbackend, die standaard aan staat, vangt niets hem af.

---

## 3. Toegangscontrole

### 3.1 Er is één poortfunctie, en die is klein en leesbaar

`sensei_can_user_view_lesson()` in `includes/sensei-functions.php:129`. De hele beslissing past op één scherm:

```php
$can_user_view_lesson = $login_not_required
                        || $user_has_all_access
                        || ( $user_can_view_course_content && $pre_requisite_complete )
                        || $is_preview_lesson;
```

Daaronder zit `Sensei_Course::can_access_course_content()` (`includes/class-sensei-course.php:586`), dat op zijn beurt terugvalt op `is_user_enrolled()`. Er is geen `@todo consolidate` in de broncode zoals bij LearnDash, en de aanroepende kant is consistent: alle Learning-Mode-blokken (`class-course-content.php`, `class-lesson-actions.php`, `class-quiz-content.php`, `class-lesson-video.php`), het `take-quiz`-blok en het `complete-lesson`-blok roepen dezelfde functie aan.

### 3.2 Inschrijving: providers stemmen, en dat is het beste idee in deze plugin

Dit is het onderdeel waar Sensei duidelijk verder is dan LearnDash, en het beantwoordt precies de vraag die punt 1 van hoofdstuk 18 stelt.

Toegang is niet één vlaggetje maar de uitkomst van een **stemming onder providers** (`includes/enrolment/`, sinds 3.0.0 / april 2020):

```php
foreach ( $this->get_course_enrolment_providers() as $enrolment_provider_id => $enrolment_provider ) {
    $provider_results[ $enrolment_provider_id ] = $enrolment_provider->is_enrolled( $user_id, $this->course_id );
}
```

En de telling is expliciet "wie dan ook mag ja zeggen" (`class-sensei-course-enrolment-provider-results.php:101`):

```php
// If one provider is allowing enrolment, they are enrolled in the course.
if ( in_array( true, $provider_results, true ) ) {
    return true;
}
```

In de gratis versie is er precies één provider: `Sensei_Course_Manual_Enrolment_Provider` met id `manual`. WooCommerce, groepen en abonnementen registreren zich in Sensei Pro via de filter `sensei_course_enrolment_providers`.

Drie dingen die het ontwerp compleet maken:

1. **De uitkomst wordt gecachet in usermeta**, samen met een **versiehash** die de cache automatisch ongeldig maakt zodra er iets aan de providers verandert (`class-sensei-course-enrolment.php:433`):

   ```php
   $hash_components[] = $enrolment_manager->get_site_salt();
   $hash_components[] = $enrolment_manager->get_enrolment_provider_versions_hash();
   $hash_components[] = $this->get_course_enrolment_salt();
   return md5( implode( '-', $hash_components ) );
   ```

   Elke provider heeft een eigen `get_version()`. Verandert een provider zijn logica, dan verandert de hash, en elke opgeslagen uitslag is in één klap verlopen. Er is een cursus-salt om één cursus te herberekenen en een site-salt om alles te herberekenen.

2. **De uiteindelijke status wordt óók platgeslagen naar de taxonomie `sensei_learner`**, één term per gebruiker, gezet op de cursuspost:

   ```php
   $save_result = wp_set_post_terms( $this->course_id, [ intval( $term->term_id ) ], Sensei_PostTypes::LEARNER_TAXONOMY_NAME, true );
   ```

   Daarmee is "welke cursussen heeft deze gebruiker" en "wie zit er in cursus X" een gewone `WP_Query`, zonder de usermeta-scan die LearnDash nodig heeft.

3. **Er is een audit-logboek**: `Sensei_Enrolment_Provider_Journal_Store` legt vast wanneer welke provider van mening veranderde. Als een klant belt met "mijn cursus is weg", kun je terugkijken welke reden wegviel.

Intrekken is het spiegelbeeld: `withdraw_learner()` zet de providerstatus op false en triggert een herberekening. Er zijn achtergrondtaken (`Sensei_Enrolment_Job_Scheduler`, `Sensei_Enrolment_Course_Calculation_Job`, `Sensei_Enrolment_Learner_Calculation_Job`) die hele cursussen of hele gebruikers opnieuw doorrekenen.

### 3.3 Kan een filter de poort uitzetten? Ja, vier keer, en er is ook een instelling

Ja, en Sensei is er opvallend eerlijk over. Vier filters kunnen de uitkomst overschrijven:

- `sensei_can_user_view_lesson` (de eindbeslissing, met sinds 4.24.2 een `$checks`-array erbij zodat een filter kan zien waaróp geweigerd is)
- `sensei_can_access_course_content`
- `sensei_user_all_access`
- `sensei_is_enrolled`, en die laatste heeft de eerlijkste docblock van de hele plugin:

  ```php
  /**
   * Allow complete side-stepping of enrolment handling in Sensei.
   * This will have some other side-effects. ...
   */
  $is_enrolled = apply_filters( 'sensei_is_enrolled', null, $user_id, $this->course_id, $check_cache );
  ```

Daarnaast is er een **site-brede instelling** `access_permission` (uitgelezen via `sensei_is_login_required()`, zelf ook filterbaar). Staat die uit, dan is `$login_not_required` waar en heeft **iedereen toegang tot alle lesinhoud**, ongeacht inschrijving. Dat is bewust ("open cursussen"), maar het is één vinkje tussen een betaalde bibliotheek en een publieke.

### 3.4 De echte zwakte: de bescherming zit in de template, niet in de data

Net als bij LearnDash blijft de les een gewone gepubliceerde WordPress-post en staat de volledige inhoud onbeschermd in `wp_posts`. Alleen zit de poort bij Sensei niet in een `the_content`-filter maar **in het sjabloon zelf** (`templates/single-lesson.php`):

```php
if ( sensei_can_user_view_lesson() ) {
    the_content();
} else {
    ?><p><?php echo wp_kses_post( get_the_excerpt() ); ?></p><?php
}
```

Dat is nog kwetsbaarder dan een filter, want een filter draait overal waar `the_content` langskomt en een sjabloon alleen op zijn eigen pagina. Sensei heeft dat zelf gemerkt en de RSS-route apart dichtgezet (`includes/class-sensei.php:1294`):

```php
public function maybe_remove_feed_content( $content ) {
    if ( 'lesson' === get_post_type() && ! sensei_can_user_view_lesson( get_the_ID(), get_current_user_id() ) ) {
        return '';
    }
    return $content;
}
```

Eén pleister per lek. En daar zit een gat dat ik niet dicht zie: het post type `lesson` wordt geregistreerd met `'show_in_rest' => true, 'rest_base' => 'lessons'`, en `Sensei_REST_API_Lessons_Controller` erft van `WP_REST_Posts_Controller` **zonder `get_item_permissions_check()` of `prepare_item_for_response()` te overschrijven**. Er is nergens een `rest_prepare_lesson`-filter. Op code-niveau gelezen betekent dat: `/wp-json/wp/v2/lessons` geeft de `content.rendered` van gepubliceerde lessen aan iedereen. Zie de onzekerheden onderaan: dit is uit de code afgeleid, niet in een draaiende installatie gemeten.

De eígen REST-laag is wél netjes: alle 37 endpoints in `includes/rest-api/` hebben een echte `permission_callback`, geen enkele `__return_true`, en de quizcontroller is docentonly:

```php
return current_user_can( get_post_type_object( 'lesson' )->cap->edit_post, $lesson->ID ) || current_user_can( 'manage_options' );
```

Proefjes zijn per les een vinkje: postmeta `_lesson_preview`, uitgelezen door `Sensei_Utils::is_preview_lesson()`, en een proefles zet ook de prerequisite-eis opzij.

---

## 4. Quizmotor

### 4.1 Krijgt de browser de juiste antwoorden? Nee, en er is geen quiz-app om ze aan te geven

De quiz is een **gewoon HTML-formulier**, server-gerenderd door PHP-sjablonen in `templates/single-quiz/` (zeven bestanden, één per vraagtype plus paginering). Er is geen React-quiz, geen JSON-payload met vragen, geen AJAX-heen-en-weer per vraag. `templates/single-quiz/question-type-multiple-choice.php` in zijn geheel is een `<ul>` met inputs:

```php
<input type="<?php echo esc_attr( $option['type'] ); ?>"
       name="<?php echo esc_attr( 'sensei_question[' . $question_data['ID'] . ']' ); ?>[]"
       value="<?php echo esc_attr( $option['answer'] ); ?>" ... />
```

De `value` is de antwoordtekst zelf, niet een index. Nergens staat welke optie juist is.

Één nuance die je moet kennen: `Sensei_Question::get_template_data()` laadt `$data['question_right_answer']` wél in de sjabloondata, bij elke render. De sjablonen printen het niet, en de CSS-klasse `right_answer` wordt pas toegekend als de quiz nagekeken is en de cursist niet meer opnieuw mag (`includes/class-sensei-question.php:1418`). Maar het juiste antwoord ligt dus binnen handbereik van elk sjabloon, en sjablonen zijn in WordPress door het thema te overschrijven. Dat is dezelfde soort valkuil als onze "props komen in de HTML terecht": één verkeerde regel en het staat op straat. Bij ons dwingt de build het af (`server-only`); bij Sensei is het een afspraak.

### 4.2 Nakijken gebeurt volledig op de server, uit de ruwe antwoorden

De inzending is een POST van het hele formulier, met nonce (`woothemes_sensei_complete_quiz_nonce`, geverifieerd in `user_quiz_submit_listener()`; ook resetten en pagineren hebben elk hun eigen nonce). Daarna, in `Sensei_Quiz::submit_answers_for_grading()`:

```php
// Save Quiz Answers for grading, the save function also calls the sensei_start_lesson.
self::save_user_answers( $quiz_answers, $files, $lesson_id, $user_id );

// Grade quiz.
$grade = Sensei_Grading::grade_quiz_auto( $quiz_id, $quiz_answers, 0, $quiz_grade_type );
```

Het cijfer wordt berekend uit de ingestuurde antwoorden en de vraagmeta, op de server. Daarna beslist de server of de les afgerond is:

```php
if ( 'on' === $pass_required ) {
    if ( $quiz_pass_percentage <= $grade ) {
        $lesson_progress->complete();
        $quiz_progress->pass();
    } else {
        $quiz_progress->fail();
    }
}
```

### 4.3 Wordt een ingestuurde score gecontroleerd? Die vraag stelt zich niet

**Er is geen ingestuurde score.** De client stuurt alleen de gekozen antwoorden. Er is dus niets te ondertekenen, geen `p_nonce` of `a_nonce` zoals in de LearnDash-keten, en ook niets te vervalsen: de enige manier om een hoger cijfer te krijgen is betere antwoorden insturen.

Dat is het simpelste denkbare antwoord op het probleem dat hoofdstuk 11 bij LearnDash uitgebreid beschrijft, en het is bovendien het antwoord dat hoofdstuk 18 (punt 2) voor ons zelf voorstelt. Sensei bewijst dat de nonce-machinerie van LearnDash een gevolg is van hun architectuurkeuze (per vraag nakijken via AJAX, dus tussenresultaten die terug moeten), niet van het probleem zelf.

Automatisch nagekeken worden alleen `multiple-choice`, `boolean` en `gap-fill` (filterbaar via `sensei_autogradable_question_types`). `single-line`, `multi-line` en `file-upload` gaan naar de handmatige nakijkstand: de quiz krijgt status `ungraded` en de les schuift niet op tot een docent hem nakijkt op `/wp-admin` (`Sensei_Grading_User_Quiz`). Staat `_quiz_grade_type` op `manual`, dan gaat álles langs de docent.

Aanwezig in de gratis versie: slaagpercentage (`_quiz_passmark`), verplicht slagen (`_pass_required`), opnieuw proberen (`_enable_quiz_reset`), een limiet op het aantal getoonde vragen (`_show_questions`), willekeurige volgorde (`_random_question_order`), vraagcategorieën als vragenbank (via `multiple_question`). **Niet** aanwezig: een timer (dat is Sensei Pro, aldus `readme.txt`).

### 4.4 Waar het antwoord van de cursist landt

In de standaardstand: als geserialiseerd array in commentmeta `quiz_answers` op de lesstatus-rij, met de waarden zelf base64-gecodeerd (`includes/class-sensei-quiz.php:760`):

```php
$prepared_answers[ $question_id ] = base64_encode( maybe_serialize( $answer ) );
```

Cijfers per vraag in `quiz_grades`, feedback in `quiz_answers_feedback`, de gestelde vragen als CSV in `questions_asked`. In de tabelstand: één rij per antwoord in `sensei_lms_quiz_answers` en één per cijfer in `sensei_lms_quiz_grades`.

> **Vergelijk met ons:** onze antwoorden reizen helemaal niet en worden nergens bewaard. Sensei bewaart ze per vraag per cursist, wat een didactisch voordeel is (je ziet welke vraag niemand snapt, punt 12 van hoofdstuk 18) en een privacylast.

---

## 5. Betalingen en inschrijving

### 5.1 De gratis versie kan geen geld aannemen. Punt.

Er zit **geen enkele betaalcode** in deze plugin. Geen gateway, geen bedrag, geen valuta, geen webhook, geen ordermodel. `vendor/woocommerce/` bevat alleen `action-scheduler`, de takenwachtrij, niet WooCommerce zelf.

Wat er nog wél staat is een schil van vroeger. `_course_woocommerce_product` wordt op vier plaatsen uitgelezen, maar drie ervan zijn gebruiksstatistiek, en de twee functionele zitten achter:

```php
if ( class_exists( 'Sensei_WC' ) && Sensei_WC::is_woocommerce_active() ) {
    $wc_post_id = get_post_meta( intval( $course->ID ), '_course_woocommerce_product', true );
    ...
}
```

`Sensei_WC` bestaat nergens in deze zip. De klasse leeft in Sensei Pro (voorheen "WooCommerce Paid Courses"). En zelfs als hij er is, bepaalt hij alleen wélke knop je ziet; de toegang loopt via de enrolment-provider.

De verkoopfunctionaliteit staat in `readme.txt` netjes opgesomd onder "Discover the power of Sensei Pro": WooCommerce-integratie met Subscriptions, Payments, Memberships en Affiliates, content drip, groepen en cohorten, toegangsperiodes, conditional content, quiztimer. In de beheerschermen zit een bijpassende taak (`includes/admin/home/tasks/task/class-sensei-home-task-sell-course-with-woocommerce.php`).

### 5.2 Hoe een aankoop toegang wordt, in vorm

Ook al zit de betaling in Pro, de **inhaakvorm** staat in de gratis kern en is het interessantste deel voor ons. Een betaalintegratie registreert een `Sensei_Course_Enrolment_Provider_Interface` via de filter `sensei_course_enrolment_providers`. Zo'n provider implementeert vier dingen: `get_id()`, `get_name()`, `get_version()` en `is_enrolled( $user_id, $course_id )`.

Dat draait de verantwoordelijkheid om ten opzichte van LearnDash. Daar *schrijft* de gateway een inschrijving weg (`ld_update_course_access()`), en moet elke intrekking apart bedacht worden. Hier *beantwoordt* de gateway een vraag, en de kern beslist. Een terugbetaling hoeft dus alleen de eigen bron aan te passen: de eerstvolgende herberekening ziet vanzelf dat de reden weg is. Twee redenen tegelijk (los gekocht én een abonnement) botsen niet, want de stemming is een OR.

Dat is exact het probleem dat hoofdstuk 18 punt 1 voor ons voorspelt (opzeggen van College+ trekt stil een los gekochte cursus in), en Sensei's model is de nette oplossing ervan.

### 5.3 Bedrag- en valutacontrole

**Niet aanwezig, en dat kan ook niet**, want er is geen betaling in deze plugin. Er valt over de gratis versie dus niets te zeggen over de vergelijking met onze Mollie-regel; dat oordeel hoort bij Sensei Pro en dat is geen open source. Ik noem het hier expliciet zodat niemand het als "geen controle, dus zwak" noteert. Het is "buiten scope", niet "ontbrekend".

---

## 6. Engagement

Kort samengevat: **Sensei-kern doet aan communicatie en niet aan beloning.**

**Certificaten: niet in de kern.** Een grep op "certificate" in `includes/` levert twee treffers op, beide in de installatiewizard en de e-mailvoorbeeldweergave, allebei verwijzend naar de losse gratis plugin *Sensei LMS Certificates* op wordpress.org. Zelfde patroon als bij LearnDash, alleen is de add-on hier gratis in plaats van betaald.

**Gamification: helemaal niets.** Nul treffers op `streak`, `leaderboard` en `gamification`; `badge` levert alleen UI-elementen op. Er zijn geen punten, geen levels, geen reeksen. Dat is een bewust smalle kern, geen omissie: Automattic verwijst voor dit soort dingen naar het WordPress-ecosysteem.

**E-mailautomatisering: verrassend compleet, en dit is het sterkste engagement-onderdeel.** `includes/internal/emails/` is een volwaardig systeem:

- Een eigen post type **`sensei_email`**, zodat elke mail een post is die je **in de blokeditor bewerkt**, met patronen (`patterns/`) en een aparte paginasjabloon-repository.
- Veertien generatoren in `includes/internal/emails/generators/`, één per gebeurtenis: `Course_Completed`, `Course_Welcome`, `Course_Created`, `Quiz_Graded`, `Student_Completes_Course`, `Student_Completes_Lesson`, `Student_Starts_Course`, `Student_Submits_Quiz`, `Student_Sends_Message`, `Student_Message_Reply`, `Teacher_Message_Reply`, `New_Course_Assigned` en twee hulpklassen.
- Een `Email_Sender` die per ontvanger `wp_mail()` aanroept met tijdelijk overschreven `wp_mail_from` en `wp_mail_from_name`, een `Email_Preview`, een `Email_Seeder` die de standaardteksten aanmaakt, en `Email_Subscription` plus `Email_User_Profile_Settings` voor afmelden per maaltype.
- Daarnáást staat het oude systeem er nog (`includes/class-sensei-emails.php` plus negen `class-sensei-email-*.php`) en een MailPoet-koppeling (`includes/mailpoet/`).

Twee eerlijke kanttekeningen: er is **geen wachtrij**, `wp_mail()` wordt synchroon aangeroepen tijdens het verzoek en er is geen herkansing bij mislukking. En de dubbele generatie (oud plus nieuw systeem) is dezelfde soort schuld als elders.

**Berichten:** het post type `sensei_message` is een privé-berichtenkanaal van cursist naar docent (`includes/class-sensei-messages.php`), met een eigen REST-controller. Geen forum, geen community: één-op-één en redactioneel, wat dichter bij onze "Vragen & antwoorden bij de les" ligt dan bij bbPress.

**Video:** `includes/course-video/` levert per cursus `sensei_course_video_required`, `sensei_course_video_autocomplete` en `sensei_course_video_autopause`, dus verplicht uitkijken, automatisch afronden en pauzeren bij tabwissel, gratis in de kern. Precies de categorie waar de Uncanny Toolkit voor LearnDash betaalde modules voor verkoopt (hoofdstuk 15).

**Learning Mode:** `includes/course-theme/` plus het meegeleverde blokthema `themes/sensei-course-theme/` geven een afleidingsvrije leeromgeving met eigen sjablonen. Gratis, en het equivalent van LearnDash' Focus Mode.

---

## 7. Architectuur

**Versie uit de header:** `Version: 4.26.2`, `Requires at least: 6.8`, `Requires PHP: 7.4`, `Author: Automattic`, `License: GPLv2 or later`.

### 7.1 Omvang

| Onderdeel | Bestanden | Regels PHP |
|---|---|---|
| Alles, inclusief `vendor/` | 930 | ~167.000 |
| Alles behalve `vendor/` | 618 | ~140.000 |
| `vendor/` (Action Scheduler + scoper) | 195 | 26.904 |
| **52 klassieke `includes/class-sensei-*.php`** | 52 | **48.761** (35% van de eigen PHP) |
| **`includes/internal/` (modern, namespaced)** | 156 | **24.305** (17%) |
| `includes/blocks/` | 67 | 7.002 |
| `includes/rest-api/` | 21 | 6.399 |
| `templates/` | 53 | 4.115 |
| `assets/` | 923 bestanden, 16 MB | 540 JS-bestanden, ~66.000 regels |

De dikste bestanden zijn de oude reuzen: `class-sensei-lesson.php` (5.527 regels), `class-sensei-course.php` (4.728), `class-sensei-utils.php` (3.209), `class-sensei-modules.php` (2.897), `class-sensei-quiz.php` (2.599).

Dus dezelfde tweedeling als bij LearnDash (`src/` naast legacy), maar met een gunstiger verhouding en, belangrijker, met een **duidelijker grens**: het moderne deel zit onder één namespace en heeft één doel.

### 7.2 Namespaces, PSR-4, DI

Er is een `Sensei\`-namespace, en die is consequent gebruikt in het nieuwe werk: `Sensei\Internal\Student_Progress\*`, `Sensei\Internal\Quiz_Submission\*`, `Sensei\Internal\Emails\*`, `Sensei\Internal\Services`, `Sensei\Internal\Migration`, `Sensei\Blocks\Course_Theme`, `Sensei\WPML`, `Sensei\Clock`. De oude helft is globaal en prefixed (`Sensei_Course`, `Sensei_Utils`).

Autoloading loopt niet via Composer PSR-4 maar via een eigen `includes/class-sensei-autoloader.php` op WordPress' bestandsnaamconventie (`class-sensei-foo.php`), met een aparte `class-sensei-autoloader-bundle.php`. Composer wordt alleen gebruikt om `vendor/` te scopen (`vendor/scoper-autoload.php`).

**Er is geen DI-container.** Geen `Container`, geen `ServiceProvider`. Alles hangt aan de globale singleton `Sensei()` (`Sensei_Main::instance()`), en de repositories worden daar met de hand in elkaar gezet in `includes/class-sensei.php` rond regel 765. De factories nemen wél hun afhankelijkheden via de constructor aan, dus de nieuwe laag is testbaar; de bedrading eromheen is dat niet.

### 7.3 REST API

Eén namespace: **`sensei-internal/v1`**. De naam is de documentatie: dit is geen publieke API maar de achterkant van de eigen beheerschermen, en de klassen dragen `@internal`-docblocks. 21 controllers, 37 endpoints, allemaal met een echte `permission_callback`.

Dat is een bewuste, verdedigbare keuze en het tegenovergestelde van LearnDash' hook-als-slotgracht: Sensei belooft niets aan derden op REST-niveau, dus kan het vrij verbouwen. Voor een integrator is dat lastiger; voor de codebase gezonder.

### 7.4 Wat er níét in de zip zit

Geen `tests/`, geen `phpunit.xml`, geen `composer.json`, geen `package.json`, geen `.eslintrc`, geen webpack- of `phpcs`-configuratie. De distributie bevat uitsluitend gebouwde bestanden: `assets/dist/`, `templates/`, `includes/`, `lang/`, `sample-data/`. Dat is precies zoals het hoort voor een wordpress.org-plugin en het is netter dan menig concurrent die zijn hele buildomgeving meelevert.

De ontwikkelkant is er wel, maar dan op GitHub: `CONTRIBUTING.md` verwijst naar `github.com/Automattic/sensei`, met een wiki over de ontwikkelomgeving, een issue tracker en een PR-flow. In de changelog van 4.26.2 heeft elke regel een publieke PR-link. (Kleine menselijke noot: in `CONTRIBUTING.md` staat "Automattician? Read more at: PCYsg-15ed-p2", een intern P2-nummer dat gewoon in de publieke release is meegereisd.)

### 7.5 Deprecation-schuld

178 aanroepen van `_deprecated_function` verspreid over 58 bestanden, plus 30 `_doing_it_wrong`. De changelog telt 203 versies en loopt terug tot `1.0.0 - 2013-01-21`, met in de laatste regels nog `woothemes-sensei.php`: dit was oorspronkelijk een WooThemes-product, van vóór de Automattic-overname. Dertien jaar geschiedenis, met de bijbehorende laag afgeschreven functies.

De schuld is wel *gemarkeerd*, met versienummers erbij (`_deprecated_function( __METHOD__, '4.19.2', ... )`). Dat is beter dan stilzwijgend laten staan.

### 7.6 Wat wel en niet naar Automattic-normen ruikt

**Wel:**
- Een publieke GitHub-repo met issue tracker en CONTRIBUTING, een changelog met PR-links per regel, en `@since`-tags overal.
- Gestructureerde hook-documentatie in een eigen formaat (`@hook`, `@param {type}`, `@return {type}`), wat betekent dat er een generator overheen loopt.
- Een expliciete feature-flag-klasse (`Sensei_Feature_Flags`) met verschillende defaults per omgeving, en gebruiksstatistiek als opt-in (`Sensei_Usage_Tracking`).
- Een `Clock`-interface met een injecteerbare implementatie, puur om tijd testbaar te maken. Dat vind je niet in een doorsnee WordPress-plugin.
- De repository-, factory- en migratie-opzet uit §2.3 is echt goed werk.
- `uninstall.php` plus `Sensei_Data_Cleaner`: de plugin ruimt zichzelf op.

**Niet:**
- Bestanden van 5.500 regels.
- Status van een domeinmodel in `comment_approved`, met een SQL-`str_replace` als reparatie.
- Nul transacties, terwijl er wel dubbel wordt geschreven.
- Een migratie die na bijna drie jaar nog "experimenteel" heet.
- En het eerlijkste signaal van allemaal: **4.26.2 is een beveiligingsrelease met elf securityfixes tegelijk**, en lees waar ze over gaan:

  > *Only allow enrolled students to mark a course as complete.*
  > *Check quiz ownership in the legacy quiz-editor actions before applying changes.*
  > *Ensure manual quiz grading submissions respect lesson ownership.*
  > *Scope the Reports CSV export to the current teacher's own courses, lessons and learners.*
  > *Ensure quiz resets are only allowed when retakes are enabled for the quiz.*

  Dat zijn ontbrekende autorisatiecontroles in bestaande paden, in 2026, in een plugin uit 2013. Positief: ze zijn gevonden, in één klap gerepareerd en publiek gedocumenteerd. Negatief: elk van deze regels is een plek waar de UI de autorisatie was. Precies waar onze eigen CLAUDE.md voor waarschuwt.

---

## 8. Beter en slechter dan LearnDash

### Het duidelijkste voordeel: toegang is één poort met meerdere redenen, en de kern beslist

LearnDash heeft één *bedoelde* poort met een "consolidate"-TODO in de code, twee inschrijfvoorstellingen (de legacy `course_access_list`-blob en de per-gebruiker `course_{id}_access_from` meta) en een parallel groepspad; toegang verlenen is iets dat de gateway *schrijft*, en intrekken moet elke integratie apart bedenken (hoofdstuk 10 §4 en §6, hoofdstuk 13).

Sensei heeft `sensei_can_user_view_lesson()` als enige poort, en daarachter een providerregister waarin elke reden voor toegang zichzelf aanmeldt en alleen een vraag beantwoordt. De uitkomst is gecachet met een versiehash die zichzelf ongeldig maakt als een provider verandert, platgeslagen naar een taxonomie zodat "wie zit er in cursus X" één query is, en er is een journaal dat bijhoudt wanneer welke reden wegviel. Voor een platform dat ooit een abonnement naast losse verkoop zet, is dit het referentieontwerp. En het bewijs dat het werkt is negatief maar sterk: er staat in de gratis kern geen enkele betaalcode, en tóch is het volledig duidelijk hoe een aankoop toegang wordt.

### De duidelijkste zwakte: de voortgang zit nog steeds in `wp_comments`, en de uitweg staat al bijna drie jaar uit

Het schema van de vervanging is er (§2.2), het is beter dan dat van LearnDash (echte `UNIQUE KEY`s, `datetime` in plaats van `int(11)`), de migratie is netjes gebouwd met batches en validatie, en de repository-abstractie is voorbeeldig. En toch: op een verse installatie van 4.26.2 op 5 augustus 2026 draait alles op de commentaartabel, met de status in `comment_approved`, met percentages en antwoorden als geserialiseerde blobs in `wp_commentmeta`, met een check-then-act zonder slot en zonder unieke sleutel, en zonder één transactie in de hele plugin. De tabellen worden niet eens aangemaakt.

Bij LearnDash is de dubbele boekhouding een *ontwerp* (usermeta als bron, activity-tabel als spiegel). Bij Sensei is het een *migratie die stilstaat*: ze weten wat goed is, hebben het gebouwd, en durven het niet aan te zetten. Dat is in zekere zin een eerlijker probleem, maar het maakt de standaardinstallatie niet beter.

---

## Wat wij hiervan zouden lenen

1. **Een `bron` op `entitlements`, in de vorm van Sensei's providers.** Dit staat al als punt 1 in hoofdstuk 18, maar Sensei geeft er nu een concreet ontwerp bij dat beter is dan de referentietellers uit hoofdstuk 13. Niet "tel hoeveel redenen er zijn" maar: **elke bron beantwoordt een vraag, de poort telt de ja's, en de uitkomst is afgeleid.** Bij ons zou dat betekenen dat `entitlements` een rij per (gebruiker, cursus, bron) krijgt en `heeftToegangTot()` een OR doet, in plaats van één rij die twee betekenissen moet dragen. Opzeggen van College+ raakt dan per constructie niet de los gekochte cursus. Doe dit vóór de eerste abonnee.

2. **Een versiestempel op afgeleide toegang, zodat cache verlopen in plaats van vergeten wordt.** Sensei's `md5( site_salt + provider_versions_hash + course_salt )` is een klein idee met een groot effect: verandert de logica, dan zijn alle opgeslagen uitkomsten in één klap ongeldig, zonder dat iemand een invalidatie hoeft te bedenken. Zodra wij ergens toegang of voortgang gaan cachen, is dit de vorm. Het is ook de generieke oplossing voor punt 23 van hoofdstuk 18 ("afgeleide staat die je opslaat, moet je invalideren").

3. **Een logboek van toegangsveranderingen.** `Sensei_Enrolment_Provider_Journal_Store` is een klein tabelletje met een groot supportrendement: als iemand mailt "mijn cursus is weg", kun je zien welke reden wanneer wegviel. Wij hebben `payment_attempts` append-only staan; hetzelfde principe op toegang toepassen kost weinig en beantwoordt de vraag die je anders niet kúnt beantwoorden.

4. **De bevestiging dat de eenvoudige quizoplossing de juiste is.** Sensei stuurt geen score mee, dus hoeft er niets ondertekend te worden. Dat maakt het voorstel uit hoofdstuk 18 punt 2 concreter én goedkoper: wij hoeven LearnDash' nonce-machinerie niet na te bouwen, alleen te stoppen met `correct` uit de client te geloven. De client stuurt de gekozen indexen, `src/content` staat al server-side, de server telt na. Sensei is het bestaansbewijs.

5. **De e-mail als bewerkbare inhoud in plaats van als code.** Het post type `sensei_email` met blokeditor plus een generator per gebeurtenis is de nette scheiding tussen "wanneer wordt er gemaild" en "wat staat erin". Als wij toe zijn aan een tweede of derde transactionele mail (voltooiingsmail, inactiviteitsmail), is dít de grens om te trekken: gebeurtenis in code, tekst als data, en de verzendwachtrij ertussen die Sensei juist níét heeft.

**Wat we uitdrukkelijk niet overnemen:** een tweede opslagvorm naast de eerste laten staan tot iemand durft te schakelen. Sensei's aggregate-repositories zijn technisch mooi, maar het resultaat is dat bijna drie jaar lang niemand de goede backend gebruikt. Als wij ooit een opslagvorm vervangen: schakelen met een datum, niet met een vinkje.

---

## Onzekerheden

- **De REST-bevinding in §3.4 is uit de code afgeleid, niet gemeten.** Ik heb `register_post_type( 'lesson', ... 'show_in_rest' => true )` gelezen, de controller nagelopen op overschreven permissie- en preparatiemethodes (die er niet zijn) en gezocht naar een `rest_prepare_lesson`-filter (die er niet is). Ik heb geen WordPress-installatie gedraaid om `/wp-json/wp/v2/lessons/<id>` als anonieme bezoeker op te halen. WordPress-core of een andere Sensei-haak kan dit alsnog afvangen. **Behandel dit als een sterke aanwijzing, niet als een bewezen lek**, en dat is precies het foutpatroon uit hoofdstuk 18: een conclusie uit één bron doortrekken naar een situatie die je niet hebt getoetst.
- **Ik heb alleen de gratis wordpress.org-versie gelezen.** Alles over betalingen, groepen, drip, toegangsperiodes, conditional content en de quiztimer komt uit `readme.txt` en uit de vorm van de haken in de kern, niet uit Pro-code. Sensei Pro is niet open source; wat daar gebeurt met bedrag- en valutacontrole is onbekend en mag niet worden ingevuld.
- **De "geen transacties"-uitspraak is een grep, geen audit.** Ik heb gezocht op `START TRANSACTION`, `COMMIT`, `ROLLBACK`, `FOR UPDATE` en `GET_LOCK` in `includes/`. Een atomair effect dat langs een andere weg bereikt wordt (een `INSERT ... ON DUPLICATE KEY`, een enkel `UPDATE` met een `WHERE`-voorwaarde) heb ik niet uitputtend geïnventariseerd; de `UNIQUE KEY`s in het HPPS-schema doen daar hun deel.
- **Ik heb de happy path gevolgd.** Randgevallen zijn niet uitgekamd: de gastgebruiker (`Sensei_Guest_User`), de tijdelijke gebruiker (`Sensei_Temporary_User`), de preview-gebruiker (`Sensei_Preview_User`), het docentenmodel met meerdere auteurs (`Sensei_Teacher`), de import- en exportketen (`includes/data-port/`) en de WPML-laag zijn alleen oppervlakkig bekeken. Vooral de gast- en tijdelijke-gebruikerspaden raken toegang en verdienen apart onderzoek voordat je hier iets uit overneemt.
- **Regelnummers gelden voor 4.26.2** (29 juli 2026). De klassenamen en meta-sleutels zijn stabieler dan de nummers.
- **De omvangcijfers zijn geteld, niet geschat**, maar de "regels PHP" tellen commentaar en lege regels mee. De verhouding 35% oud tegen 17% nieuw is dus indicatief voor de vorm van de codebase, niet voor de hoeveelheid gedrag.
