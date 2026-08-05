# 17. De laatste zes add-ons, plus een adversariële verificatiepassage

*Geschreven op 5 augustus 2026.* Dit hoofdstuk analyseert de **huidige releases** uit Jasons eigen LearnDash-licentie (geldig tot juni 2027): LearnDash core **5.1.8** en de add-ons zoals ze nu te downloaden zijn. Twee delen:

- **Deel 1** behandelt de zes add-ons waar nog niemand naar gekeken had. Hoofdstuk 13 dekte commerce, hoofdstuk 14 dekte engagement; dit zijn de overgeblevenen: migratie, Gravity Forms, bbPress, Elementor, The Events Calendar en meertaligheid.
- **Deel 2** is een verificatiepassage. Ik heb de zwaarste claims uit hoofdstuk 10, 11 en 13 opnieuw tegen de broncode gelegd met de opdracht om ze te *falsifiëren*. Eén claim sneuvelt, en het is een belangrijke.

Alle paden in dit hoofdstuk zijn compleet vanaf een van deze twee wortels:

- add-ons: `C:\Users\jason\AppData\Local\Temp\claude\C--Users-jason-CodingProjects-Beleggingscollege\8ad15e87-c98c-4764-93cf-dfc4ede04964\scratchpad\addons\`
- core 5.1.8: `C:\Users\jason\AppData\Local\Temp\claude\C--Users-jason-CodingProjects-Beleggingscollege\8ad15e87-c98c-4764-93cf-dfc4ede04964\scratchpad\learndash-src-518\sfwd-lms\`

Om te voorkomen dat het onleesbaar wordt schrijf ik daarna alleen het pad ná die wortel, altijd compleet vanaf de plugin- of core-map. De versies die ik gelezen heb, uit de plugin-headers:

| Add-on | Map | Versie |
| --- | --- | --- |
| Migration | `learndash-migration/` | 1.1.1 |
| Gravity Forms | `learndash-gravity-forms/` | 2.1.3 |
| bbPress | `learndash-bbpress/` | 2.2.5 |
| Elementor | `learndash-elementor/` | 1.0.11 |
| The Events Calendar | `ld-tec/` | 1.0.3 |
| Multilingual | `ld-multilingual/` | 1.0.0 |

Die laatste kolom is al informatie: je kijkt naar zes add-ons waarvan de nieuwste (migratie) en de oudste (meertaligheid) technisch uit twee verschillende decennia komen. Dat is precies het patroon dat deel 1 blootlegt.

---

## Deel 1 — de zes onontgonnen add-ons

### 1.1 Migration 1.1.1 — de eerlijkste add-on van het stel, en de leerzaamste

Dit is de interessantste van de zes, dus hij krijgt de meeste ruimte. De add-on importeert cursussen uit vier andere LMS'en die in dezelfde WordPress-installatie draaien: **LearnPress, LifterLMS, Sensei LMS en Tutor LMS** (`learndash-migration/src/App/Integrations/`, één klasse per systeem bovenop `Integrations/Base.php`).

Belangrijk om meteen goed te hebben: dit is **geen migratie tussen sites**. Bron en doel zijn dezelfde WordPress-database. De add-on leest de posts van het andere LMS en schrijft er nieuwe LearnDash-posts naast. De oude cursus blijft staan.

#### Hoe hij inhaakt

De architectuur is de nette kant van LearnDash 5.x en het loont om te zien waarom. `learndash-migration/src/App/AJAX/Migrate.php` erft van `LearnDash\Core\Modules\AJAX\Request_Handler` — een basisklasse in core (`src/Core/Modules/AJAX/Request_Handler.php`) die de bewaking zelf regelt:

```php
public function handle_request(): void {
    $this->check_user_capability();
    $this->verify_nonce();
    $this->set_up_request();
```

`check_user_capability()` eist `LEARNDASH_ADMIN_CAPABILITY_CHECK` en `verify_nonce()` controleert `$_REQUEST['nonce']` tegen de actienaam; bij twijfel `wp_send_json_error( ..., 401 )`. De add-on hoeft daar zelf niets voor te doen behalve `set_up_request()`, `process()` en `prepare_response()` implementeren. Dat is een echte, stabiel bedoelde naad — en zoals je verderop ziet is dit de enige van de zes add-ons die hem gebruikt.

Verder inhaken doet hij via drie eigen filters (`Integrations/Base.php`): `learndash_migration_format_settings`, `learndash_migration_format_meta` en `learndash_migration_new_course_url`. Netjes gedocumenteerd, met de integratie meegegeven als derde argument, zodat een filter kan controleren op welk bronsysteem hij zit.

#### Wat hij mapt

Post types, uit de constructors van de vier integraties:

| LearnDash | LearnPress | LifterLMS | Sensei | Tutor |
| --- | --- | --- | --- | --- |
| `course` | `lp_course` | `course` | `course` | `courses` |
| `lesson` | `lp_lesson` | `lesson` | `lesson` | `topics` |
| `topic` | — | — | — | `lesson` |
| `quiz` | `lp_quiz` | `llms_quiz` | `quiz` | `tutor_quiz` |
| `question` | `lp_question` | `llms_question` | `question` | — |
| `certificate` | — | — | — | — |
| `group` | — | — | — | — |
| `assignment` | — | — | — | — |

Let op de Tutor-kolom: Tutor's `topics` zijn LearnDash-*lessen* en Tutor's `lesson` is een LearnDash-*topic*. Dat is correct — de niveaus heten in beide systemen anders — maar het betekent dat je na een Tutor-migratie een andere boomstructuur hebt dan je gewend was. En Tutor's vragen hebben geen post type (`'question' => null`): die staan in eigen tabellen en worden via directe queries opgehaald.

De veldmapping is opvallend dun. Compleet, alle vier de systemen bij elkaar:

| Bron | Bronveld | LearnDash-instelling |
| --- | --- | --- |
| LearnPress | `_lp_price` | `course_price` |
| LearnPress | `_lp_max_students` | `course_seats_limit` |
| LearnPress | `_lp_retake_count` | `repeats` |
| Tutor | `_tutor_course_settings` → `maximum_students` | `course_seats_limit` |
| Tutor | `_tutor_is_public_course` | `course_price_type` = `open` |
| Sensei | `_quiz_passmark` | `passingpercentage` (**komt niet aan, zie hieronder**) |
| Sensei | `_random_question_order` | `questionRandom` (**idem**) |

Dat is de hele lijst. LifterLMS mapt **niets**: in `learndash-migration/src/App/Integrations/LifterLMS.php` (regels 63–77) zijn zowel `mapped_setting_keys` als `mapped_meta_keys` vijf lege arrays.

#### Wat er verloren gaat

Dit is de vraag die telt, en het antwoord is: meer dan je zou denken. De leverancier is er zelf eerlijk over — `learndash-migration/readme.txt` regel 23 belooft niets meer dan *"Migrate a course and its lessons, topics, quizzes, questions, and answers."* De code houdt zich precies aan die belofte en niet aan een letter meer.

**1. Geen enkele gebruiker, inschrijving of voortgang.** Er is geen regel code in de add-on die `learndash_user_activity`, `ld_update_course_access`, of een quizpoging aanraakt. Je verhuist de cursus; je cursisten blijven achter bij het oude LMS. Voor een winkel met betalende klanten is dat de duurste regel van dit hoofdstuk.

**2. Geen certificaten, geen groepen, geen opdrachten.** Zie de `null`-rijen in de tabel hierboven. `mapped_post_types` is voor alle vier de systemen `'certificate' => null, 'group' => null, 'assignment' => null`.

**3. Geen post meta, door constructie.** `mapped_meta_keys` is bij álle vier de integraties volledig leeg. De lus in `Integrations/Base.php:427` kan dus nooit iets vinden. Wat er wél wordt weggeschreven zijn drie zelfgemaakte sleutels (`Base.php:444-453`):

```php
$extra_meta = [ '_ld_migration_imported_from' => [ $this->key ] ];
if ( isset( $object->post ) && $object->post instanceof WP_Post ) {
    $extra_meta['_ld_migration_source_post_id'] = [ $object->post->ID ];
    $extra_meta['_thumbnail_id']                = [ get_post_meta( $object->post->ID, '_thumbnail_id', true ) ];
```

Die `instanceof WP_Post`-voorwaarde is subtiel en belangrijk. Voor de cursus is `$object->post` de echte `WP_Post` uit de bron, dus die houdt zijn uitgelichte afbeelding en zijn herkomst-id. Voor lessen, topics en quizzes bouwen de `format_*`-methodes een **nieuw `stdClass`** met alleen `post_title`, `post_content` en `post_type` (bijvoorbeeld `LearnPress.php:120-123`). Die tak wordt dus nooit gehaald: **lessen en topics verliezen hun uitgelichte afbeelding en hun spoor naar de bron.**

**4. Taxonomieën en categorieën: niet gevonden, dus niet overgezet.** Er is geen `wp_set_object_terms()` of `wp_set_post_terms()` in de add-on. Cursuscategorieën, tags en labels blijven achter.

**5. Bijna alle quizinstellingen.** Dit is de mooiste vondst. `learndash-migration/src/App/Repository.php:177-189` maakt het WP Pro Quiz-object aan door de legacy-controller aan te roepen met een **nagemaakt `$_POST`-blok**:

```php
$pro_quiz = new \WpProQuiz_Controller_Quiz();
$pro_quiz->route(
    [ 'action' => 'addUpdateQuiz', 'quizId' => 0, 'post_id' => $quiz_id ],
    [ 'form' => [], 'post_ID' => $quiz_id, 'timeLimit' => $quiz->settings['time_limit'][0] ?? 0 ]
);
```

`'form' => []` is het hele quizformulier, leeg. Álles behalve de tijdslimiet komt dus op de WP Pro Quiz-standaardwaarde te staan: slaagpercentage, aantal herkansingen, vraagvolgorde, hints, resultaatweergave. Bij LearnPress overleeft `repeats` nog omdat dat via de LearnDash-instellingenlaag loopt in plaats van via dit blok.

**6. En bij Sensei sneuvelt het slaagpercentage door een verkeerde sleutel.** `SenseiLMS.php:62-71` hangt `_quiz_passmark` en `_random_question_order` onder `'question'`, maar dat zijn meta van de *quiz*-post. `format_settings()` zoekt op de post type-sleutel van het object dat het formatteert, en `format_quiz()` (`SenseiLMS.php:185`) formatteert een quiz — dus de lookup gaat naar `mapped_setting_keys['quiz']`, en die is leeg. De mapping bestaat, hij doet niets, en er komt geen waarschuwing. Een Sensei-quiz met slaagdrempel 80% komt binnen op de LearnDash-standaard.

**7. Vraagtypes worden platgeslagen naar een gok.** Elke integratie heeft een `format_question_type()` met een `default`-tak. LifterLMS is de meest agressieve (`LifterLMS.php:541-552`):

```php
case 'choice':
case 'picture_choice':
default:
    $type = static::$question_type_key_multiple_choice;
```

Alles wat geen `true_false` is wordt multiple choice. Een LifterLMS-sorteervraag of een open vraag komt er dus uit als meerkeuze — met de oorspronkelijke antwoorden erin, maar in een vorm die de vraag niet meer stelt. LearnPress, Sensei en Tutor vallen terug op `single`. Sensei is hier het gulst: die mapt `gap-fill` naar cloze en `single-line`/`multi-line`/`file-upload` naar essay.

**8. Geen deduplicatie.** `_ld_migration_source_post_id` wordt geschreven en **nergens gelezen** — ik heb op beide migratie-metasleutels gezocht in de hele add-on en de enige treffers zijn de twee schrijfregels in `Base.php`. Twee keer op de knop drukken geeft twee cursussen. Dat is verdedigbaar (het is een handmatige actie in een beheerscherm), maar het is niet wat een gebruiker verwacht van iets dat "migratie" heet.

**9. En het loopt synchroon in één AJAX-verzoek.** `AJAX/Migrate.php:95` doet `migrate_course()` voor de complete cursus in één keer — alle lessen, topics, quizzes, vragen en antwoorden. Bij een cursus van enige omvang is dat een PHP-timeout, en er is geen wederopstartpunt. Vergelijk dat met de WooCommerce-add-on uit hoofdstuk 13, die zijn retroactieve tool wél in batches van 100 doet.

#### Wat het onthult over de naden

Twee dingen tegelijk, en dat is het punt.

Aan de bovenkant gebruikt deze add-on de moderne LearnDash-SDK: een DI-container (`LearnDash\Core\App`), DTO's met validatie, `Request_Handler` met capability- en nonce-poort, `Utilities\Sanitize::array()`. Dat zijn stabiel bedoelde uitbreidpunten en ze werken.

Aan de onderkant moet hij door de achterdeur naar binnen. `Repository.php` roept `WpProQuiz_Controller_Quiz::route()` aan met een verzonnen requestarray — een private, uit 2013 geërfde controller die ontworpen is om een adminformulier te verwerken, niet om geprogrammeerd te worden aangeroepen. En de GUID-reparatie in `Repository.php:239-253` is expliciet gekopieerde core-code, met de bronvermelding in het commentaar:

```php
// Update guid to follow LD format. Taken from Learndash_Admin_Metabox_Quiz_Builder::learndash_builder_selector_step_new().
$wpdb->update( $wpdb->posts, [ 'guid' => ... ], [ 'ID' => $question_id ] );
```

Dat is een rauwe SQL-update op `wp_posts` vanuit een add-on, omdat er geen functie is die "maak een LearnDash-vraag" doet. De conclusie: **LearnDash heeft een nette naad voor het inkomende verzoek en geen enkele naad voor het aanmaken van quizinhoud.** Wie dat laatste wil, moet doen wat het adminscherm doet — inclusief de rommel.

Nog één ding dat je moet weten als je hier ooit iets aan bouwt: er zit een latente fout in `Base.php:429-430`. De bewaking kijkt naar `mapped_setting_keys[$type]` en de test daarna naar `mapped_meta_keys[$type]`:

```php
isset( $this->mapped_setting_keys[ $type ] )
&& in_array( $key, array_keys( $this->mapped_meta_keys[ $type ] ), true )
```

Vandaag doet dat niets, omdat alle meta-maps leeg zijn. Zodra iemand een metasleutel toevoegt voor een type dat níét in `mapped_setting_keys` staat — bij LearnPress zijn dat lesson, topic en question — wordt die stil overgeslagen. Copy-paste tussen `format_settings()` en `format_meta()`, één woord niet meegewijzigd.

### 1.2 Gravity Forms 2.1.3 — inschrijven op een formulierinzending

**Wat hij doet:** je koppelt LearnDash-cursussen en -groepen aan een Gravity Forms-formulier. Wie het formulier invult (of de bijbehorende betaling afrondt, of het abonnement start) krijgt toegang. Drie bestanden, één klasse, geen autoloading.

**Hoe hij inhaakt:** volledig aan de Gravity Forms-kant (`learndash-gravity-forms/learndash_gravityforms.php:32-46`) — `gform_userregistration_feed_settings_fields`, `gform_user_registered`, `gform_user_updated`, `gform_post_payment_completed`, `gform_post_payment_refunded`, `gform_post_subscription_started`, `gform_subscription_canceled`. Aan de LearnDash-kant hooked hij nergens: hij *roept* alleen `ld_update_course_access()` en `ld_update_group_access()` aan (regels 529, 533, 544, 552).

**Wat het onthult.** Dit is het archetype van de oude generatie, en het is instructief hoeveel er misgaat als je alleen die twee functies gebruikt:

- **Geen referentieteller.** Terugbetalen roept dezelfde `process_feed()` aan met `$remove = true`, dus wie dezelfde cursus ook via een groep of een tweede formulier heeft, verliest hem alsnog. Hoofdstuk 13 beschreef de teller in de WooCommerce-add-on als de nette oplossing; die kennis is hier niet aangekomen.
- **Geen bedrag- of valutacontrole.** Er is aan de LearnDash-kant ook geen prijs om tegen te controleren: welke cursus je krijgt volgt uit de formulierconfiguratie, niet uit wat er betaald is.
- **Hardgecodeerde post type-slugs.** Regel 657: `'post_type' => 'groups'` in plaats van `learndash_get_post_type_slug( 'group' )`. En op de regel eronder `'status' => 'publish'` — dat is geen `WP_Query`-argument (het heet `post_status`), dus die filter doet niets en de keuzelijst toont ook concepten en verwijderde groepen.
- **Dode code naar een verdwenen plugin.** `list_accesslevels()` (regel 673) roept `learndash_plus_get_levels()` aan, een functie die in core 5.1.8 niet bestaat — ik heb er in de hele broncode en in alle add-ons op gezocht. Het is netjes ingepakt in `function_exists()`, dus het valt niet om; het is een fossiel van "LearnDash Plus" dat niemand heeft opgeruimd.

De naad die hier zichtbaar wordt is de belangrijkste van het hele hoofdstuk: **`ld_update_course_access()` is de universele voordeur, en hij is te dom voor de taak.** Hij weet niet waaróm iemand toegang krijgt, dus hij kan ook niet bepalen of het intrekken van één bron de toegang moet weghalen. Elke integratie die het goed doet, bouwt daar zelf een boekhouding bovenop — en elke integratie doet dat anders.

### 1.3 bbPress 2.2.5 — forumtoegang aan cursusinschrijving hangen

**Wat hij doet:** je koppelt een bbPress-forum aan cursussen en groepen; alleen ingeschreven cursisten mogen het forum zien of erin posten.

**Hoe hij inhaakt** (`learndash-bbpress/includes/functions.php`): zes bbPress-filters (`bbp_current_user_can_publish_topics`, `bbp_current_user_can_publish_replies`, `bbp_get_user_subscribe_link`, `bbp_get_user_favorites_link`, `bbp_user_can_view_forum`, `bbp_get_forum_title`) en precies één LearnDash-hook — en die ene is interessant:

```php
add_action( 'learndash_update_course_access', 'ld_bbp_assign_role', 10, 4 );
```

Dat is een **gebeurtenis bij toegangswijziging** ($user_id, $course_id, $access_list, $remove). Hier wordt hij gebruikt om een nieuwe cursist de bbPress-rol `bbp_participant` te geven. Dat is een echte, stabiel bedoelde naad, en het is er een die wij niet hebben: bij Beleggingscollege verandert toegang binnen `verwerkBetaald()` zonder dat er iets mee gebeurt waar andere code op kan reageren.

De autorisatie zelf is netjes: `learndash_bbpress_user_has_forum_access()` gebruikt `sfwd_lms_has_access()` (regels 294 en 300) — dus de officiële poort, niet een eigen reconstructie.

**Wat er wringt:**

- **Een filter die output echoot.** `ld_restrict_forum_access()` (`functions.php:66-68`) doet `echo apply_filters( 'ld_forum_access_restricted_message', $content, $forum_id )` midden in een `bbp_user_can_view_forum`-filter. Een filter hoort een waarde terug te geven; wat hij hier doet is HTML uitspugen op het moment dat bbPress de vraag stelt, waar dat in de pagina ook uitkomt. Bovendien wordt `$message_without_access` ongeëscaped uit post meta geëchood.
- **Een Engelse stringvervanging in de titel.** `ld_bbp_forum_title()` doet `str_replace( 'Private:', '', $title )` om bbPress' dubbele "Private:"-prefix weg te halen. Op een Nederlandse site doet dat niets — en het sloopt wél elke forumtitel waar het woord "Private:" legitiem in staat.
- **Een verdwaalde import.** Regel 4 van `functions.php` is `use Mpdf\Tag\P;`. Een IDE heeft daar een autocomplete-ongeluk gehad met de mPDF-bibliotheek uit de certificaat-add-on. Onschuldig, maar het vertelt je wat over het reviewproces.
- **`ld_save_associated_object()`** leest `$_POST` zonder `isset()`-bewaking en zonder autosave-guard.

### 1.4 Elementor 1.0.11 — en de reden dat je dit hoofdstuk-10-verhaal moet lezen

**Wat hij doet:** hij maakt LearnDash-onderdelen beschikbaar als Elementor-widgets (Course Content, Course Infobar, Course Progress, Course/Lesson/Topic/Quiz List, Login, Profile, Certificate, Video, Payment Buttons) en registreert vier Elementor-*documenttypes* zodat je de cursus-, les-, topic- en quizpagina volledig in Elementor kunt ontwerpen.

**Hoe hij inhaakt:** `learndash-elementor/src/App/Plugin.php:55` hangt aan `elementor/widgets/register`, en `src/App/Widgets.php:53-73` registreert de widgets — voorwaardelijk, afhankelijk van het documenttype waar je in zit.

Hoe komt een widget aan cursusdata? Niet via de LearnDash-API. **Hij bouwt een shortcode-string en laat die uitvoeren.** `src/App/Widgets/Course_Progress.php:118-126`:

```php
$shortcode_params_str = '[' . $this->shortcode_slug . $shortcode_params_str . ']';
echo do_shortcode( $shortcode_params_str );
```

Alle widgets doen dit (`Course_List.php:474`, `Lesson_List.php:431`, `Login.php:332`, en zo verder). Dat is slimmer dan het eruitziet: de shortcode is een gedocumenteerde, stabiele naad, en door hem te gebruiken erft de widget automatisch de toegangscontrole en de templating van core. De prijs is dat je alles door een string moet duwen: de widgetinstellingen worden per stuk door `esc_attr()` gehaald en aan elkaar geplakt.

**En hier zit de vondst die deel 2 kleur geeft.** `src/App/Documents/Base.php:37` hangt aan een officiële core-filter en zet daarmee de contentbescherming van LearnDash **uit**:

```php
add_filter( 'learndash_template_preprocess_filter', array( $this, 'learndash_template_preprocess_filter' ), 30, 2 );
```

Op een enkelvoudige cursuspagina retourneert die callback `false` (regels 60–69; voor cursusstappen alleen als Focus Mode uit staat). In core doet dat dit (`includes/class-ld-cpt-instance.php:322-324`):

```php
if ( ! apply_filters( 'learndash_template_preprocess_filter', true, get_the_id() ) ) {
    return $content;
}
```

`template_content()` geeft dan de **ruwe post-content** terug, ongefilterd. De hele slotscherm-logica wordt overgeslagen. De Elementor-add-on bouwt daarna zijn eigen versie terug: `src/App/Widgets.php:87-134` filtert `elementor/widget/render_content` en leegt de widget als de vorige stap niet is afgerond, op basis van twee handmatige lijsten (`$checked_widgets` en een via `learndash_elementor_not_completed_step_allowed_widgets` filterbare `$allowed_widgets`).

Dat werkt voor de dertien widgets die in die lijst staan. Het werkt niet voor een widget die er niet in staat — die van een andere plugin bijvoorbeeld, of een eigen widget van de sitebouwer. **De bescherming is dus niet alleen render-time, hij is ook opt-outable via een gedocumenteerde filter, en de leverancier gebruikt die filter zelf.**

Verder: `learndash-elementor/src/functions/course.php` is aantoonbaar gekopieerde core-renderlogica (het commentaar op regel 431 en omstreken verwijst naar `includes/class-ld-cpt-instance.php` als startpunt), en de map `learndash-elementor/src/deprecated/` plus de losse bestanden in `learndash-elementor/elementor-widgets/` zijn een complete tweede, oudere kopie van dezelfde widgets. 114 bestanden, waarvan een flink deel dubbel.

### 1.5 ld-tec 1.0.3 — evenementtickets als toegangsbewijs

**Wat hij doet:** koppelt The Events Calendar (met Event Tickets / Tickets Commerce) aan LearnDash. Je koppelt cursussen of groepen aan een evenement; wie een ticket koopt en de order op `completed` komt, wordt ingeschreven. Daarnaast kan de virtuele-evenement-embed (de Zoom-link, de stream) beperkt worden tot LearnDash-cursisten.

**Hoe hij inhaakt:** aan de TEC-kant via ordermetadata en statusovergangen (`ld-tec/includes/class-integration.php:520` `order_status_transition()`), aan de LearnDash-kant via directe aanroepen plus een eigen toegangsboekhouding.

**Wat het onthult:**

- **De teller uit de WooCommerce-add-on is letterlijk overgenomen, inclusief de naam.** De usermeta-sleutel is `_learndash_woocommerce_enrolled_objects_access_counter` (`class-integration.php:206`, `238`, `260`, `275`) — in een add-on die niets met WooCommerce te maken heeft. Het is geen botsing (de WooCommerce-add-on gebruikt `..._enrolled_courses_access_counter`), maar het is wel het bewijs dat er geen gedeelde bibliotheek is: het patroon reist via copy-paste van repo naar repo, met naam en al.
- **De ontdubbeling gaat via een samengestelde sleutel**: `toggle_user_access_by_event_id()` (regel 179) geeft `$order_id . '-' . $ticket_id` door als bronidentificatie. Dat is een verstandige oplossing voor "één order, vijf tickets, drie cursussen".
- **Een typefout met een spatie erin.** Regel 549: `if ( $new_status::SLUG === 'completed' && $old_status::SLUG !== 'completed ' )`. Die trailing space maakt de tweede voorwaarde altijd waar, dus de conditie is in de praktijk alleen `$new === 'completed'`. Een `completed` → `completed`-overgang verleent dus opnieuw. Onschuldig omdat de teller herhaalde sleutels aankan, maar het is een echte fout die niemand heeft gezien.
- **Een incomplete nonce-controle.** Regel 453: `if ( isset( $_POST['learndash_tec_nonce'] ) && ! wp_verify_nonce( ... ) ) return;`. Ontbreekt het veld helemaal, dan passeert de bewaking. Wat het hier redt is de `current_user_can( 'edit_tribe_events', $post_id )` op de regel eronder — de capability-check doet het werk dat de nonce-check had moeten doen.
- **En de virtuele-content-check omzeilt de officiële poort.** `show_virtual_content()` (regel 753) gebruikt `ld_get_mycourses()` en `learndash_get_users_group_ids()` in plaats van `sfwd_lms_has_access()`:

```php
$enrolled_courses = ld_get_mycourses( $user->ID );
$enrolled_groups  = learndash_get_users_group_ids( $user->ID );
```

Dat is een lijst van *inschrijvingen*, niet van *geldige toegang* — verlopen toegang zit er nog in. En met de instelling `'any'` is de test simpelweg `count( $enrolled_objects ) > 0`: wie in wélke cursus dan ook zit, mag de stream van élk zo geconfigureerd evenement zien. Dit is precies de tweede poort waar onze eigen regel (`heeftToegangTot()` is de enige poort) tegen waarschuwt, en hier zie je waarom: de tweede poort is altijd de zwakkere.

### 1.6 ld-multilingual 1.0.0 — vier bestanden, en wat die kleinte verraadt

**Wat hij doet:** hij zorgt dat LearnDash-URL's en de infobalk-data meebewegen met WPML of Polylang. Dat is alles.

**Hoe hij inhaakt** (`ld-multilingual/ld-multilingual.php:57-59`): precies drie core-filters.

```php
add_filter( 'learndash_header_data', ... );
add_filter( 'learndash_permalinks_nested_urls', ... );
add_filter( 'learndash_post_type_rewrite_slug', ... );
```

Daarnaast definieert hij drie eigen filters (`ld_multilingual_providers_get_current_language_code`, `..._get_all_language_codes`, `..._get_post_type_slug_translation`) als providerabstractie, met per plugin een klasse in `ld-multilingual/providers/`.

**Wat de kleinte zegt.** Twee dingen. Ten eerste: LearnDash' idee van meertaligheid is een **slug- en permalinkprobleem**. Er is geen enkele hook over vertaalde cursusstructuren, over voortgang die je in twee talen deelt, of over quizzen die in de ene taal zijn afgerond en in de andere niet. Dat is geen luiheid maar een keuze: de vertaalplugins bezitten de post-relaties, LearnDash bezit alleen de URL's die eromheen zitten.

Ten tweede: **de Polylang-ondersteuning is stuk, en al zes jaar.** Twee onafhankelijke fouten in vier bestanden.

`ld-multilingual/providers/ld-multilingual-provider-Polylang.php:62` registreert de verkeerde klasse:

```php
LD_Multilingual_Provider_WPML::add_provider_instance( 'polylang' );
```

`add_provider_instance()` gebruikt `get_called_class()` (`ld-multilingual.php:201`), dus op een Polylang-site wordt onder de sleutel `polylang` een **WPML-provider** geïnstantieerd. Die vraagt de talen op via `apply_filters( 'wpml_active_languages', null, '' )` — een filter die Polylang niet kent, dus het antwoord is `null`.

En zelfs als dat goed was gegaan: Polylangs eigen `get_all_language_codes()` (regels 52-55) is `return;`. Een methode die volgens de basisklasse een array hoort te geven, geeft niets.

Voor ons is dit vooral een waarschuwing over hoe je een leverancier leest. Deze add-on staat in de LearnDash-catalogus als officiële add-on. Hij is versie 1.0.0, hij heeft een fout die elke Polylang-gebruiker meteen zou merken, en dat betekent dat er zes jaar lang niemand met Polylang deze add-on productief heeft gebruikt — of dat er niemand was om het aan te melden. Beide zijn informatie over hoe diep de ondersteuning van de randgevallen gaat.

### 1.7 Synthese: het naadpatroon over de zes heen

Zes add-ons, één patroon in vijf lagen. Van stabiel naar noodgreep:

1. **De moderne SDK (stabiel, en nieuw).** `LearnDash\Core\Modules\AJAX\Request_Handler` met capability- en nonce-poort, de DI-container `LearnDash\Core\App`, DTO's, `Utilities\Sanitize`. Bestaat sinds core 4.8 en wordt door precies één van de zes gebruikt: de migratie-add-on. Dit is waar LearnDash naartoe gaat.
2. **Gedocumenteerde filters en shortcodes (stabiel, en oud).** `sfwd_lms_has_access()`, `learndash_update_course_access`, `learndash_template_preprocess_filter`, `learndash_header_data`, en de shortcodes waar Elementor volledig op leunt. Dit is de werkelijke API. Het is een verzameling in plaats van een ontwerp, maar het houdt.
3. **De domme voordeur.** `ld_update_course_access()` / `ld_update_group_access()`. Iedereen gebruikt hem en niemand kan ermee volstaan, omdat hij niet weet waarom toegang bestaat. Gevolg: **vier verschillende zelfgebouwde referentieboekhoudingen** in serialized usermeta (WooCommerce, MemberPress, PMPro, en nu ld-tec), en één add-on die er helemaal geen heeft (Gravity Forms). Dit is het duidelijkste ontbrekende stuk in LearnDash' extensiemodel.
4. **Copy-paste als distributiemechanisme.** De TEC-add-on draagt een metasleutel met `woocommerce` in de naam. De Elementor-add-on draagt gekopieerde core-renderlogica. De migratie-add-on kopieert een `$wpdb->update` uit een adminmetabox en zegt dat ook in het commentaar. Waar geen bibliotheek is, reist de code met de fouten mee.
5. **De achterdeur.** `new \WpProQuiz_Controller_Quiz()` met een nagemaakt `$_POST`-blok, en directe `$wpdb`-writes op `wp_posts`. Dat gebeurt precies daar waar er geen naad is: **het aanmaken en configureren van quizinhoud.** Dat is geen toeval — het is het stuk van LearnDash dat uit wpProQuiz komt en nooit een API heeft gekregen.

De les voor Beleggingscollege zit in punt 3, en het is een concrete: **maak van "waarom heeft deze gebruiker toegang" een expliciet gegeven, niet een gevolg.** Wij hebben dat vandaag goed opgelost door één rij in `entitlements` per gebruiker per cursus met een bron erbij — maar we hebben nog geen gebeurtenis die afgaat als toegang verandert. Dat is precies wat de bbPress-add-on in LearnDash wél kan gebruiken (`learndash_update_course_access`), en het is de haak die je nodig hebt op de dag dat een aankoop ook een mail, een badge of een groepsrecht moet triggeren.

---

## Deel 2 — verificatiepassage: zes claims opnieuw getoetst

De opdracht was falsifiëren, niet bevestigen. Eén claim gaat om, en het is de universele claim uit hoofdstuk 10 — precies zoals verwacht: een claim met "GEEN ENKELE" erin heeft maar één tegenvoorbeeld nodig.

### Claim 1 — CONFIRMED (en sterker dan hoofdstuk 11 zelf beweert)

> *Hoofdstuk 11, §4c en conclusie 3: de quizmotor kijkt server-side na en ondertekent de uitkomst met nonces (`p_nonce` / `a_nonce`), die bij inzending opnieuw worden geverifieerd.*

Hoofdstuk 11 is tegen 4.6.0 geschreven en waarschuwt daar zelf voor. In **5.1.8** staat het er nog, met verschoven regelnummers.

Genereren, `includes/quiz/ld-quiz-pro.php:946` en `:963` (was 864/881 in 4.6.0):

```php
$answers_nonce = wp_create_nonce( 'ld_quiz_anonce' . $user_id . '_' . $id . '_' . $quiz_post_id . '_' . $r_idx . '_' . $response_str );
$points_nonce  = wp_create_nonce( 'ld_quiz_pnonce' . $user_id . '_' . $id . '_' . $quiz_post_id . '_' . $r_idx . '_' . $points_str );
```

Verifiëren, `includes/lib/wp-pro-quiz/lib/controller/WpProQuiz_Controller_Admin.php:368-369` (punten) en `:440-441` (antwoorden):

```php
$points_nonce = 'ld_quiz_pnonce' . $user_id . '_' . $id . '_' . $quiz_post_id . '_' . $r_idx . '_' . $points_str;
if ( ! wp_verify_nonce( $result['p_nonce'], $points_nonce ) ) {
```

Faalt de controle, dan worden punten en antwoorddata geleegd. De tuple in de nonce-actie is exact wat hoofdstuk 11 beschrijft: gebruiker, WP Pro Quiz-id, quizpost-id, vraagindex en de geserialiseerde punten- respectievelijk antwoordstring. **CONFIRMED.**

### Claim 2 — CONFIRMED, met één nuance die hoofdstuk 11 niet kon weten

> *Hoofdstuk 11, §4a en conclusie 2: de correcte antwoorden staan níét vooraf in de browser; `correct` en `points` worden uit het ingebedde `json`-object gestript.*

Ik heb geprobeerd dit te breken op twee manieren, en het houdt beide keren.

**Eerst de stripcode zelf.** Hoofdstuk 11 verwijst naar het *legacy*-template. Maar de meeste sites draaien ld30, en dat heeft een eigen template (`themes/ld30/templates/quiz/partials/show_quiz_questions_box.php`). De strip zit niet in het template maar in de gedeelde view, `includes/lib/wp-pro-quiz/lib/view/WpProQuiz_View_FrontQuiz.php:243-246`:

```php
foreach ( $quiz_data['json'] as $key => $value ) {
    foreach ( array( 'points', 'correct' ) as $key2 ) {
        unset( $quiz_data['json'][ $key ][ $key2 ] );
```

Beide thema's leveren hun `json` via `showQuizBox()` aan diezelfde view, dus de strip dekt ld30 óók. Dat is een versteviging van hoofdstuk 11, niet een correctie.

**Dan de aanval die had kunnen werken.** Die strip is een **blacklist op sleutelnaam**. Een vraagtype dat antwoordinformatie onder een dérde sleutel wegschrijft, glipt erdoor. In het ld30-template staat precies zo'n regel (`show_quiz_questions_box.php:489`):

```php
$json[ $question->getId() ] = array_merge( $json[ $question->getId() ], $question_answer_data );
```

Ik heb `learndash_question_free_get_answer_data()` erop nagekeken (`includes/lib/wp-pro-quiz/wp-pro-quiz.php:470-515`): die vult uitsluitend `$question_data['correct'][]` en `$question_data['points'][]`. Ook de cloze- en assessment-takken (`show_quiz_questions_box.php:549`, `:562`, `:565`) schrijven alleen naar `correct` en `points`. Alle zes de plekken die antwoordinformatie in `$json` zetten, gebruiken dus de twee gestripte sleutels. Het gat bestáát, maar niemand valt erin.

**CONFIRMED**, met de aantekening dat dit een blacklist is en geen structurele garantie: een nieuw vraagtype dat zijn sleutel anders noemt, publiceert de antwoorden op de pagina zonder dat er iets faalt. Als iemand ooit een LearnDash-vraagtype bouwt, is dit de eerste plek om te kijken.

En één losse eindje uit hoofdstuk 11 (§7, "ik heb niet nagezocht of LearnDash `nonce_life` filtert") kan ik nu dichtmaken: **nee**. Er is geen enkele `'nonce_life'`-treffer in de hele core 5.1.8. De standaard WordPress-levensduur geldt, dus de anti-replay-observatie in hoofdstuk 11 blijft staan.

### Claim 3 — CONFIRMED, en scherper dan hoofdstuk 10 het stelt

> *Hoofdstuk 10, §"Toegang en drip zijn render-only": contentbescherming is een `the_content`-filter; elk pad dat dat filter mist, lekt de lesinhoud.*

`includes/class-ld-cpt-instance.php:196` registreert het filter, `:247` is `template_content()`, en die roept `sfwd_lms_has_access()` aan en vervangt de content. Dat staat er nog precies zo in 5.1.8.

Maar hier valt iets méér te zeggen dan hoofdstuk 10 doet, en het maakt de claim erger in plaats van minder waar. Op regel 322 zit een officiële uitknop:

```php
if ( ! apply_filters( 'learndash_template_preprocess_filter', true, get_the_id() ) ) {
    return $content;
}
```

Retourneert iemand `false`, dan geeft `template_content()` de **ruwe post-content** terug. Geen slotscherm, geen access-check. En dat is geen theoretisch risico: de officiële Elementor-add-on doet het zelf op elke enkelvoudige cursuspagina (`learndash-elementor/src/App/Documents/Base.php:52-73`, zie §1.4), en bouwt de bescherming daarna handmatig terug met een widget-allowlist.

Daarnaast valt op dat `template_content()` alleen wordt geregistreerd als `! is_admin()` én `$this->template_redirect === true` (regel 192-197), en dat er sinds 4.20.0.2 een REST-uitzondering in zit (regel 264-291) die de "verberg content op overzichtspagina's"-tak overslaat bij een REST-verzoek.

**CONFIRMED.** Voorstel voor hoofdstuk 10: de formulering "elk pad dat dit filter mist" mag krachtiger — het is niet alleen *missen*, het is *uitzetten met één filter*, en de leverancier levert daar zelf een voorbeeld van mee.

### Claim 4 — WRONG. Dit moet in hoofdstuk 10 gecorrigeerd worden

> *Hoofdstuk 10, regel 11, 186, 188 en conclusie 5: "géén enkele gateway hercontroleert bedrag en valuta vóór het toekennen van toegang"; specifiek over PayPal IPN: "het betaalde bedrag (`mc_gross`) wordt gelogd en op niet-leeg getoetst, maar niet vergeleken met de cursusprijs. De valuta wordt niet tegen de catalogus gezet."*

**Dat is in 5.1.8 onjuist.** De PayPal IPN-gateway doet exact wat de claim ontkent.

Bij het renderen van de betaalknop legt `generate_user_purchase_hash()` (`includes/payments/gateways/class-learndash-paypal-ipn-gateway.php:825-845`) een verwachtingsblok vast in een transient, met onder meer `paid_price`, `currency_code`, `learndash_version` en de volledige `pricing_info`. Bij de IPN-notificatie controleert `verify_user_purchase_hash()` (`:885`) eerst de nonce en dan dit (`:937-955`):

```php
if ( ! isset( $this->user_hash['currency_code'] )
    || ! isset( $this->transaction_data['mc_currency'] )
    || $this->user_hash['currency_code'] !== $this->transaction_data['mc_currency'] ) {
```

Gevolgd door `validate_price_paid_by_user()` (`:999`), die `mc_gross` vergelijkt met de vastgelegde prijs (`:1021`) en bij abonnementen ook nog `mc_amount1` (proefprijs), `mc_amount3` (abonnementsprijs), de proefperiode, de periodelengte en `recur_times`.

En het gevolg bij een mismatch is niet alleen "geen toegang" maar actief intrekken (`:634-646`):

```php
if ( ! $this->verify_user_purchase_hash() ) {
    $this->products = ...;
    $this->revoke_access();
    $this->delete_user_purchase_hash();
```

De `@since 4.20.1`-tags erbij vertellen precies wat er gebeurd is: **de claim was waar voor 4.6.0 en is door LearnDash zelf gerepareerd in 4.20.1.** Er zit zelfs een terugvalpad in voor oude, nog openstaande betalingen (`:931`: is `learndash_version` niet in de hash gezet, dan sla de extra controles over) én een architectuurwijziging in hetzelfde commentaar: sinds 4.20.1 wordt er niet meer ingeschreven op de return-URL maar alleen op de IPN, "because we don't have enough data to validate the transaction in the return-success action".

**Wat er in plaats daarvan waar is** — dit is wat hoofdstuk 10 zou moeten zeggen:

| Gateway (5.1.8) | Bedrag/valuta-hercontrole | Hoe |
| --- | --- | --- |
| PayPal IPN | **ja** | server-side vastgelegde hash in transient; valuta + bedrag + proef- en abonnementsvelden; mismatch trekt toegang in |
| Stripe | nee, en **niet nodig** | de Checkout-sessie wordt server-side gemaakt uit `Product::find( $_POST['post_id'] )` met de catalogusprijs (`class-learndash-stripe-gateway.php:296`, `:1434-1460`); het bedrag reist nooit door de browser |
| Razorpay | nee, en niet nodig | zelfde model: order server-side aangemaakt met de eigen prijs, webhook met `verifyWebhookSignature()` (`class-learndash-razorpay-gateway.php:1409`) |

De juiste, niet-falsifieerbare formulering van het inzicht is dus: **LearnDash controleert bedrag en valuta daar waar het bedrag door de klant heen gaat (het klassieke PayPal-formulier), en niet daar waar het bedrag de browser nooit ziet.** Dat is verdedigbaar ontwerp, geen gat. Onze eigen Mollie-regel ("controleer bedrag én valuta tegen wat wij hadden vastgelegd") is daarmee niet strenger dan de marktleider — hij is gelijk aan wat de marktleider doet op het pad waar het uitmaakt.

Concreet aan te passen in `10-broncode-datamodel-en-betalingen.md`: de waarschuwingsregel bovenaan (regel 11, die zegt dat dit in 5.1.8 nog steeds waar is), §"Prijs- en bedragverificatie — het gat" (regels 186–190) en conclusie 5 (regel 221).

### Claim 5 — CONFIRMED, met een gat dat hoofdstuk 13 niet noemt

> *Hoofdstuk 13, §2.3 en de tabel: de WooCommerce-integratie trekt bij gedeeltelijke terugbetaling toegang in, en dan alleen voor de terugbetaalde regelitems.*

De code doet dat, `learndash-woocommerce/includes/class-learndash-woocommerce.php:750-760`:

```php
if ( $order->get_status() !== 'refunded' && ! empty( $products ) ) {
    self::remove_course_access( $order_id, null, $products );
} elseif ( $order->get_status() === 'refunded' && ! empty( $used_refunds ) ) {
    self::remove_course_access( $order_id );
}
```

En `remove_course_access()` (`:660`) gebruikt die `$products` als filter: `if ( empty( $products ) ) { $products = $order->get_items(); }`, waarna hij per product `_related_course` en `_related_group` opzoekt. Bij een gedeeltelijke terugbetaling worden dus alleen de cursussen achter de terugbetaalde regels ingetrokken. **CONFIRMED.**

Twee correcties op de details eromheen:

**De teller is geen teller.** Hoofdstuk 13 noemt het "een referentieteller op order-id". Het is geen getal maar een **verzameling bron-order-id's** per cursus (`decrement_course_access_counter()`, `:2019-2038`): decrementeren betekent `array_keys( $courses[$course_id], $order_id )` en die posities `unset()`en, en toegang gaat pas weg als de lijst leeg is. Dat is inhoudelijk hetzelfde idee en toevallig idempotent (een order-id verwijderen dat er niet meer in zit is een no-op), maar het is een set en geen counter. Wel opmerkelijk: het is een read-modify-write op serialized usermeta, dus twee gelijktijdige webhooks kunnen elkaars wijziging overschrijven.

**En het gat dat hoofdstuk 13 mist:** `$products` komt uit `$refund->get_items()`. Een WooCommerce-terugbetaling die je invoert als **bedrag zonder regelitems** — in de praktijk de makkelijkste manier om iemand deels terug te betalen — levert een leeg `get_items()`. `$products` blijft leeg, de orderstatus blijft `completed`, en dan is **geen van beide takken waar**: er wordt niets ingetrokken. De regel is dus preciezer "trekt in per terugbetaald regelitem, en doet niets bij een terugbetaling zonder regelitems".

Voor ons is dat trouwens een geruststelling bij ons eigen besluit (gedeeltelijke terugbetaling laat de cursus staan): de kloof met WooCommerce is kleiner dan hoofdstuk 13 suggereert, want in het meest voorkomende gedeeltelijke geval doet WooCommerce hetzelfde als wij.

### Claim 6 — CONFIRMED

> *Hoofdstuk 13, §4.2: SamCart's webhook slaat de sleutelcontrole over als er geen sleutel geconfigureerd is.*

Letterlijk, `learndash-samcart/includes/class-samcart-integration.php:23-31`:

```php
if (
    ! empty( $secret_key )
    && ( ! isset( $_GET['secret_key'] )
        || sanitize_text_field( wp_unslash( $_GET['secret_key'] ) ) !== $secret_key )
) {
    return;
}
```

Is `$secret_key` leeg, dan is de hele voorwaarde onwaar en loopt de verwerking dóór — inclusief het aanmaken van een WordPress-gebruiker uit `customer['email']` en het verlenen van cursustoegang. `get_secret_key()` (`learndash-samcart/learndash-samcart.php:169-172`) leest gewoon de instelling en heeft **geen standaardwaarde en geen generator**: een verse installatie heeft dus een lege sleutel. **CONFIRMED.**

Eén verzachtende omstandigheid die hoofdstuk 13 nog niet kon vermelden: versie 1.1.0.1 heeft er een adminwaarschuwing bij gebouwd (`learndash-samcart/includes/admin/settings/class-ld-settings-section-samcart-settings.php:109` `missing_secret_key_notice()`, `@since 1.1.0.1`), die op LearnDash-beheerpagina's, de pluginpagina en de updatepagina meldt dat de sleutel ontbreekt. Ze weten het dus. Ze hebben gekozen voor nagen in plaats van weigeren — waarschijnlijk om bestaande installaties niet te breken, wat precies de reden is dat dit soort gaten blijft bestaan.

### Bonusbevinding: de refund-observatie uit hoofdstuk 10 houdt óók

Nu ik toch in de gateways zat: hoofdstuk 10 conclusie 5 zegt ook *"een refund van een losse aankoop trekt in deze versie geen toegang in"*. Dat blijft in 5.1.8 waar, en harder dan je zou verwachten: **het woord "refund" komt in de hele map `includes/payments/` niet voor.** Stripe abonneert op vijf events (`class-learndash-stripe-gateway.php:66-77`: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`, `coupon.deleted`) — geen `charge.refunded`, geen `charge.dispute.created`. Razorpay heeft alleen `order.paid` en negen abonnementsevents. PayPal IPN kent naast de gewone types alleen `subscr_cancel`, `subscr_eot` en `subscr_failed`. De enige plek waar toegang wordt ingetrokken is de mislukte hashvalidatie uit claim 4.

Dat is opvallend, omdat de commerce-add-ons uit hoofdstuk 13 het wél doen. Wie via de ingebouwde gateways verkoopt en geld terugbetaalt, moet de inschrijving met de hand weghalen.

---

## Samenvatting van de oordelen

| # | Claim | Oordeel |
| --- | --- | --- |
| 1 | hfst 11: server-side nakijken + `p_nonce`/`a_nonce`-ondertekening, opnieuw geverifieerd bij inzending | **CONFIRMED** in 5.1.8 (regels verschoven naar 946/963 en 368/440) |
| 2 | hfst 11: correcte antwoorden staan niet vooraf in de browser | **CONFIRMED**, en ook voor het ld30-thema; nuance: de strip is een blacklist op sleutelnaam |
| 3 | hfst 10: contentbescherming is een `the_content`-filter | **CONFIRMED**, en erger dan beschreven: `learndash_template_preprocess_filter` zet hem uit, en de Elementor-add-on doet dat |
| 4 | hfst 10: géén enkele gateway hercontroleert bedrag/valuta | **WRONG** — PayPal IPN doet het sinds 4.20.1, inclusief intrekken bij mismatch. Stripe/Razorpay hoeven het niet omdat het bedrag server-side wordt gezet |
| 5 | hfst 13: WooCommerce trekt in per terugbetaald regelitem | **CONFIRMED**; de "teller" is een set van order-id's, en een terugbetaling zónder regelitems trekt niets in |
| 6 | hfst 13: SamCart slaat de sleutelcontrole over zonder geconfigureerde sleutel | **CONFIRMED**; sinds 1.1.0.1 wél een adminwaarschuwing, geen weigering |

Eén claim moet dus gecorrigeerd worden, en het is geen detail: hoofdstuk 10 verwijt LearnDash op drie plekken een gat dat de leverancier zelf al gedicht heeft. Het onderliggende inzicht blijft overeind — bedrag en valuta hercontroleren is de juiste regel — maar de bewering dat wij daarin strenger zijn dan de marktleider, is niet meer waar.

---

## Verantwoording en grenzen

- Alles hierboven is statische codelezing van 5.1.8 en de huidige add-onreleases. Ik heb niets uitgevoerd, geen WordPress opgestart en geen betaling of migratie getest.
- Bij claim 4 leun ik op de `@since 4.20.1`-annotaties voor de bewering dat de controle er in 4.6.0 nog niet was; ik had 4.6.0 niet naast me liggen om dat direct te zien.
- Bij de migratie-add-on heb ik de vier integratieklassen, `Base.php`, `Repository.php` en de AJAX-laag gelezen, niet alle 68 bestanden. De DTO's en het beheerscherm heb ik alleen doorgekeken.
- Van de Elementor-add-on heb ik de widgetregistratie, de documentklassen en de rendermethodes gelezen. De 114 bestanden bevatten een complete verouderde tweede kopie; daar ben ik niet regel voor regel doorgegaan.
- De constatering dat ld-tec's virtuele-contentcheck verlopen inschrijvingen doorlaat, volgt uit wat `ld_get_mycourses()` retourneert volgens core. Ik heb het gedrag niet in een levende installatie gemeten.
