# 20 — LearnPress: dezelfde acht vragen, een ander antwoord

> Dit hoofdstuk leest de **gratis wordpress.org-versie van LearnPress**, vandaag (5 aug 2026) gedownload en uitgepakt in een scratchmap. Licentie **GPLv3** (`readme.txt`), dus code mag hier vrij geciteerd worden. Alle paden zijn relatief aan de pluginmap `learnpress/`.
>
> **Welke versie precies, is zelf al een bevinding.** De plugin-header in `learnpress.php` zegt `Version: 4.2.7`, en dát is wat WordPress leest (`define( 'LEARNPRESS_VERSION', $plugin_info['Version'] )`, `inc/lp-constants.php:10`). Maar `readme.txt` zegt `Stable tag: 4.4.4`, `changelog.txt` stopt bij `4.2.6.8.2` (28 juni 2024), en in `inc/` staan `@since`-tags tot en met `4.3.2` en zelfs `4.7.0`. Drie versienummers in één zip die het niet met elkaar eens zijn, en de code is nieuwer dan de header beweert. Ik noem de plugin hieronder **4.2.7**, want dat is het nummer dat de code van zichzelf gebruikt.
>
> Dit hoofdstuk is geschreven om **naast hoofdstuk 10, 11 en 18 te liggen**. Ik herhaal LearnDash niet; waar het interessant wordt, staat er "vs. LearnDash". Waar het onze eigen keuzes raakt, staat er "vs. ons".

---

## 1. Contentmodel

**De reputatie klopt: LearnPress heeft wél eigen tabellen, en het zijn er veertien.** Ze staan als één array met `CREATE TABLE IF NOT EXISTS`-strings in `config/table/tables-v4.php`, aangelegd door `LP_Install` bij activatie. Namen komen uit `LP_Database` (`inc/Databases/class-lp-db.php`), telkens `$wpdb->prefix . 'learnpress_…'`:

`order_items`, `order_itemmeta`, `question_answers`, `question_answermeta`, `quiz_questions`, `sections`, `section_items`, `sessions`, `user_items`, `user_itemmeta`, `user_item_results`, `files`, `courses`, plus `thim_cache`.

Toch is dit **geen vervanging van WordPress, maar een aanvulling erop.** Er zijn vijf post types (`inc/lp-constants.php:36-40`):

```php
const LP_COURSE_CPT   = 'lp_course';
const LP_LESSON_CPT   = 'lp_lesson';
const LP_QUESTION_CPT = 'lp_question';
const LP_QUIZ_CPT     = 'lp_quiz';
const LP_ORDER_CPT    = 'lp_order';
```

De hiërarchie loopt dus dwars door beide werelden:

- **Cursus** = een `lp_course`-post.
- **Secties** = rijen in `learnpress_sections` (`section_id`, `section_name`, `section_course_id`, `section_order`). Géén post type. Dit is het niveau dat LearnDash niet als eigen ding heeft.
- **Sectie-items** = rijen in `learnpress_section_items` (`section_id`, `item_id`, `item_type`, `item_order`). Een pure koppeltabel.
- **Les / quiz** = `lp_lesson`- en `lp_quiz`-posts. **De lesinhoud staat gewoon in `wp_posts.post_content`.** Precies zoals bij LearnDash.
- **Vraag** = een `lp_question`-post; de koppeling quiz→vraag staat in `learnpress_quiz_questions` (`quiz_id`, `question_id`, `question_order`).
- **Antwoordopties** = rijen in `learnpress_question_answers`: `question_id`, `title`, `value varchar(32)`, `order`, `is_true varchar(3)`.

Dat laatste is het scherpste contrast met hoofdstuk 11. LearnDash bewaart alle antwoorden van een vraag als één `serialize()`'d array van `WpProQuiz_Model_AnswerTypes`-objecten in `quiz_question.answer_data`, met een reparatiefunctie eromheen omdat die vorm breekt. **LearnPress bewaart één rij per antwoordoptie, met de correctheid als losse kolom.** Dat is gewoon een genormaliseerd schema. Je kunt erop joinen, tellen en indexeren. Het is de saaie, juiste oplossing.

Kanttekening: `is_true` is een `varchar(3)` waar `'yes'` in staat, geen boolean. De vergelijking in `inc/question/class-lp-question-single-choice.php:57` is letterlijk `$data['is_true'] == 'yes'`. Werkt, maar het is een string die een vlag speelt.

### `learnpress_courses`: een read-model, en dat is nieuw

De veertiende tabel is de interessantste, want die is er pas sinds 4.2.6.9:

```sql
CREATE TABLE IF NOT EXISTS wp_learnpress_courses (
    ID bigint(20) unsigned NOT NULL,
    json LONGTEXT NOT NULL,
    price_to_sort FLOAT, is_sale int(1) default 0,
    post_author, post_date_gmt, post_content LONGTEXT,
    post_title, post_status, post_name, menu_order, lang,
    PRIMARY KEY (ID), KEY id_status (ID, post_status)
)
```

Dit is een **gematerialiseerde kopie van de cursus**: alle relevante postvelden plus het hele model als JSON-blob. `CourseModel::save()` (`inc/Models/CourseModel.php:780`) kloont zichzelf, gooit `post_content` eruit, `json_encode`t de rest en schrijft dat weg. De cursusoverzichtspagina leest daarna uit deze ene tabel in plaats van uit `wp_posts` + een handvol `wp_postmeta`-joins.

Dat is een expliciete ontsnapping aan de postmeta-hel, en het is een goed idee. Het is ook precies het patroon dat wij níét nodig hebben: onze catalogus is getypte TypeScript-data die tijdens de build al plat is. **LearnPress bouwt met een tabel wat wij al gratis hebben.** Het is de moeite waard te zien dat een volwassen WordPress-LMS uiteindelijk uitkomt bij "sla de content ook nog eens denormaliseerd op" om de leeskant leefbaar te houden.

De prijs is de gebruikelijke: twee bronnen die kunnen divergeren als de synchronisatie mist. `inc/handle-steps/` en `inc/Background/` bevatten de achtergrondtaken die de tabel bijwerken.

---

## 2. Voortgangsopslag

**Er is één bron van waarheid, en dat is `wp_learnpress_user_items`.** Geen usermeta-blob, geen spiegel voor rapportage, geen tweede administratie. Dat is het grootste enkele verschil met hoofdstuk 10.

```sql
CREATE TABLE IF NOT EXISTS wp_learnpress_user_items (
    user_item_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    user_id      bigint(20) unsigned DEFAULT 0,
    item_id      bigint(20) unsigned DEFAULT 0,
    start_time   datetime NULL, end_time datetime NULL,
    item_type    varchar(45),          -- lp_course | lp_lesson | lp_quiz
    status       varchar(45),          -- purchased|enrolled|finished|started|completed
    graduation   varchar(20) NULL,     -- in-progress|passed|failed
    access_level int(3) DEFAULT 50,
    ref_id       bigint(20) unsigned DEFAULT 0,   -- het order-id
    ref_type     varchar(45),                     -- lp_order
    parent_id    bigint(20) unsigned DEFAULT 0,   -- de user_item van de cursus
    PRIMARY KEY (user_item_id),
    KEY parent_id, KEY user_id, KEY item_id, KEY item_type, KEY ref_id, KEY ref_type, KEY status
)
```

Eén rijvorm dekt inschrijving, lesvoortgang en quizpogingen tegelijk. De cursusrij is de ouder, lessen en quizzen hangen eraan met `parent_id`. Bijzonderheden per rij staan in `learnpress_user_itemmeta` (bijvoorbeeld het aantal retakes), en het bevroren eindresultaat van een quiz of cursus als JSON in `learnpress_user_item_results`.

**`ref_id` en `ref_type` wijzen naar het order dat de toegang gaf.** Dat is precies het veld dat hoofdstuk 18 punt 1 ons aanraadt te bouwen (een `bron` op `entitlements`): LearnPress heeft het al. Alleen is het één ref, geen referentietelling, dus het lost het College+-scenario niet volledig op.

### Voortgang is afgeleid, niet opgeslagen

`UserCourseModel::calculate_course_results()` (`inc/Models/UserItems/UserCourseModel.php:227`) berekent het percentage bij opvraging: `count_items()` uit de cursus tegen `count_items_completed()`, een `COUNT`-query over `learnpress_user_items`. Er is geen `completed`/`total`-cachekolom die kan verlopen. Wél twee lagen cache eromheen (`LP_Cache::cache_load_first()` per request, en de `thim_cache`-tabel), en zodra de cursus af is, wordt het resultaat één keer bevroren in `lp_user_item_results` en verder daaruit gelezen.

> **vs. LearnDash:** daar is `_sfwd-course_progress` een geserialiseerd usermeta-blob met alle cursussen van een gebruiker erin, plus een `learndash_user_activity`-tabel als rapportagespiegel, plus een losse `course_completed_{id}`-metakey. Drie plaatsen na elkaar geschreven zonder transactie. LearnPress schrijft één rij en telt de rest uit. **Dit is het duidelijkst betere ontwerp van de twee.**

### Schrijven is niet transactioneel, en dat is hier goedkoper

Er is geen enkele echte transactie in de plugin. `START TRANSACTION` komt precies één keer voor, in `inc/class-lp-debug.php:84`, een debughulpje. Alles daarbuiten is losse `$wpdb`-calls.

Het verschil met LearnDash is dat er veel minder te desynchroniseren valt. Een les afronden is één `UPDATE` op één rij: `UserLessonModel::set_complete()` (`inc/Models/UserItems/UserLessonModel.php`) zet `status`, `end_time` en `graduation` en roept `save()`. Daarna alleen nog hooks. Er is geen tweede tabel die mee moet.

Wat wél ontbreekt: **er is geen unieke sleutel op `(user_id, item_id, item_type)`**, alleen zeven losse enkelkolomse indexen. Twee gelijktijdige requests kunnen twee inschrijvingsrijen maken. LearnPress vangt dat niet af maar leeft ermee: overal in de code wordt `get_last_user_course()` gebruikt, en die doet letterlijk `ORDER BY user_item_id DESC LIMIT 1` (`inc/Databases/class-lp-user-items-db.php:406-430`). Deels is dat opzet (een retake of herhaalde aankoop maakt bewust een nieuwe rij), maar het betekent ook dat de database geen enkele invariant bewaakt en dat "de" inschrijving in feite "de nieuwste rij" is.

> **vs. ons:** onze `entitlements` heeft één rij per gebruiker per cursus mét constraint, en `verwerkLes()` telt een delta op in één statement met CTE's. LearnPress heeft de betere *vorm* (één tabel, afgeleide voortgang) en de zwakkere *garanties* (geen unieke sleutel, geen transactie). Onze combinatie is beter dan beide.

---

## 3. Toegangscontrole

**Ja, er is één poortfunctie, en die wordt bovendien op méér plaatsen aangeroepen dan bij LearnDash.**

De kern is `LP_User::can_view_content_course( int $course_id )` in `inc/user/class-lp-user.php:19`. Hij geeft geen boolean terug maar een `LP_Model_User_Can_View_Course_Item` met een `->flag` en een `->key` die vertelt wáárom het niet mag (`LP_BLOCK_COURSE_FINISHED`, `LP_BLOCK_COURSE_DURATION_EXPIRE`, `LP_BLOCK_COURSE_PURCHASE`). De beslisvolgorde:

1. Admin of auteur van de cursus → true.
2. `$course->is_no_required_enroll()` → true (cursus staat open voor iedereen).
3. Niet ingelogd → false.
4. Cursus gepubliceerd én `has_enrolled_or_finished()` → true, tenzij de cursus af is en de instelling "blokkeer na afronding" aanstaat, of de cursusduur verlopen is.
5. Status `purchased` maar nog niet `enrolled` → **false** met key `LP_BLOCK_COURSE_PURCHASE`.

Bovenop die cursuspoort ligt `can_view_item()` (regel 100), die precies één ding toevoegt: is dit item als preview gemarkeerd, dan mag het toch. Netjes gescheiden.

Er zijn twee zusterfuncties die dezelfde rol spelen op andere momenten: `can_enroll_course()` (regel 276, weigert onder meer met `course_is_not_purchased` als de cursus niet gratis is en niet gekocht) en `UserQuizModel::check_can_start()` (`inc/Models/UserItems/UserQuizModel.php:221`, weigert met `not_errol_course` als er geen lopende inschrijving is). Drie functies, drie momenten, geen duplicaten van elkaar.

### Waar de poort wordt aangeroepen, en waarom dat telt

Dit is het punt waar LearnPress LearnDash voorbijstreeft. De aanroepen staan niet alleen in templates:

- `templates/single-course/content-item.php:21-22` — het renderpad, met `single-course/content-protected.php` als slotscherm.
- `inc/rest-api/v1/frontend/class-lp-rest-lazy-load-controller.php:296-308` — de curriculumlijst die per AJAX wordt nageladen.
- `inc/jwt/rest-api/version1/class-lp-rest-lessons-v1-controller.php:122-126` en `…-quiz-v1-controller.php:159-163` — de mobiele API, die bij een `false`-vlag simpelweg stopt.
- `inc/jwt/rest-api/version1/class-lp-rest-section-items-v1-controller.php:185-189` — `content.raw` en `content.rendered` worden **alleen gevuld als `$can_view_item->flag`**.

> **vs. LearnDash:** daar zit de bescherming in `SFWD_LMS::template_content()`, een `the_content`-filter. Elk pad dat dat filter mist, lekt de les. LearnPress roept dezelfde predicaatfunctie aan in het renderpad **en** in de REST-controllers, en beslist per veld wat het invult. Dat is het verschil tussen "bescherming bij het tonen" en "bescherming bij het uitleveren".

Er is nog een tweede hardening die LearnDash niet heeft: `LP_Page_Controller::set_link_item_course_default_wp_to_page_404()` (`inc/class-lp-page-controller.php:810`) forceert een **404 op de directe permalink** van een `lp_lesson`, `lp_quiz` of `lp_question` voor iedereen die geen admin of auteur is. En `lp_lesson` en `lp_question` registreren `'show_in_rest' => learn_press_user_maybe_is_a_teacher()`, dus de kern-WP-REST-route voor die post types bestaat alleen voor docenten.

### Maar: alles is met een filter uit te zetten

Elke beslissing eindigt in een `apply_filters`, en die filters geven het beslisobject zelf terug:

```php
return apply_filters( 'learnpress/course/can-view-content', $view, $this->get_id(), $course );
return apply_filters( 'learnpress/course/item/can-view', $view, $item, $this );
return apply_filters( 'learn-press/user/can-enroll-course', $output, $course, $return_bool, $this );
return apply_filters( 'learn-press/can-start-quiz', $can_start, … );
```

Eén regel in een thema of plugin (`add_filter( 'learnpress/course/can-view-content', fn($v) => tap($v, fn($x) => $x->flag = true) )`) zet de hele betaalmuur uit. Dat is exact dezelfde zwakte die hoofdstuk 17 bij LearnDash vond met `learndash_template_preprocess_filter`, en het is exact wat punt 28 van hoofdstuk 18 ons afraadt. Het is bij LearnPress niet erger, maar ook geen haar beter.

En er is één instelling die de poort volledig omzeilt: `no_required_enroll` op de cursus. Dan neemt `LP_Course_No_Required_Enroll` het over en beoordeelt zelfs quizzen voor niet-ingelogde bezoekers.

### Eén gat dat ik wel gevonden heb

`POST /wp-json/lp/v1/users/hint-answer` (`inc/rest-api/v1/frontend/class-lp-rest-users-controller.php:64-72`, callback op regel 392):

```php
public function hint_answer( $request ) {
    $question_id = $request['question_id'];
    $question    = learn_press_get_question( $question_id );
    return rest_ensure_response( array( 'hint' => $question->get_hint() ) );
}
```

`permission_callback` is `'__return_true'` en de callback controleert helemaal niets: geen login, geen inschrijving, geen cursus. Iedereen kan anoniem de hint van elke vraag van elke betaalde quiz ophalen door het vraag-id te raden. Het is een klein lek (een hint, niet het antwoord), maar het is er wel, en het is één regel `if` van gedicht.

Wat je hier óók ziet: in dezelfde routetabel staat vier keer de weggecommentarieerde regel `// 'permission_callback' => array( $this, 'check_admin_permission' ),` boven `'permission_callback' => '__return_true',`. De methode `check_admin_permission()` bestaat nog op regel 129 en wordt nergens meer gebruikt. Iemand heeft de poort er ooit uitgehaald en de deur open laten staan; bij `start-quiz`, `submit-quiz` en `check-answer` doen de callbacks hun eigen controle, bij `hint-answer` niet.

**Wat ik expliciet níét kon bevestigen** (en waar ik eerst in trapte): de vier `__return_true`-routes op `lp/v1/admin/tools`, waaronder `clean-tables`, zijn géén open destructieve endpoints. `LP_Admin_Core_API::__construct()` (`inc/rest-api/class-lp-admin-core-api.php:12`) doet `if ( ! LP_Helper::isRestApiLP() || ! current_user_can( 'administrator' ) ) return;` — de hele adminroutetabel wordt voor niet-admins niet eens geregistreerd. Slordige laagverdeling, geen lek. Dit is precies het soort claim dat hoofdstuk 18 ons leerde na te lopen voordat je hem opschrijft.

---

## 4. Quizmotor

Vier deelvragen, en het antwoord is over de hele linie goed.

### 4a. Komen de juiste antwoorden in de browser? Nee.

`learn_press_rest_prepare_user_questions()` (`inc/user/lp-user-functions.php:1658`) bouwt per vraag titel, type, punten, content en opties op, en geeft de opties door aan `learn_press_get_question_options_for_js()` (`inc/lp-template-functions.php:1406`). Daar staat de strip:

```php
$exclude_option_key = array( 'question_id', 'order' );
if ( ! $args['include_is_true'] ) {
    $exclude_option_key[] = 'is_true';
}
```

En `include_is_true` is bij het starten van een quiz `false`: in `start_quiz()` wordt `checked_questions` leeg meegegeven en `quiz_status` bewust niet gezet, zodat `$with_true_or_false` uitkomt op false. De browser krijgt de vraagtekst en de opties, zonder welke optie juist is.

Bijna-misser die het vermelden waard is: `$questionData['object'] = $question` zet het complete `LP_Question`-object in de respons. Dat lekt niets, omdat alle eigenschappen van `LP_Abstract_Object_Data` `protected` zijn en `json_encode` er dus `{}` van maakt. Maar het is puur geluk in de vorm van een zichtbaarheidsmodifier: één toekomstige `public $answers` en de sleutel ligt op straat. Dit is exact de valkuil uit onze eigen CLAUDE.md ("props naar client components komen in de HTML terecht"), alleen dan in PHP.

### 4b. Wordt er server-side nagekeken? Volledig.

Twee routes, beide in `inc/rest-api/v1/frontend/class-lp-rest-users-controller.php`:

- `check-answer` (regel 403) voor tussentijdse controle: haalt de inschrijving op (`$user->get_course_data()`, gooit bij ontbreken), roept `$user_quiz->instant_check_question( $question_id, $answered )` aan, en geeft pas dán de juiste opties terug.
- `submit-quiz` (regel 280) bij afronden: haalt de inschrijving op, en roept `$user_quiz->calculate_quiz_result( $answered )` aan.

Het nakijken zelf zit in de vraagklassen, die uit `learnpress_question_answers` lezen (`inc/question/class-lp-question-single-choice.php:50`, `…-multi-choice.php:54`, `…-true-or-false.php`, `…-fill-in-blanks.php`). Bij multiple choice moet elk vinkje kloppen, anders is de hele vraag fout.

### 4c. Wordt een ingestuurde score gehercontroleerd? Die vraag stelt zich niet.

**Dit is de kern, en het is het elegantste antwoord van de twee platforms.** De client stuurt bij `submit-quiz` uitsluitend `answered` (de gekozen opties), `item_id`, `course_id` en `time_spend`. **Er reist nooit een score, een puntentotaal of een correct-vlag van browser naar server.** De server berekent `user_mark`, `question_correct`, `result` en `pass` volledig zelf uit de vragen in de database.

LearnDash lost hetzelfde probleem op met WordPress-nonces als handtekening over `(vraag, punten)`, gecontroleerd bij afronding, met een terugval naar nul punten als de handtekening niet klopt (hoofdstuk 11 §4c). Dat is knap werk, maar het is machinerie die alleen nodig is omdat hun client wél punten meestuurt. **LearnPress heeft dat probleem wegontworpen in plaats van opgelost.** Er is niets te ondertekenen als er niets te vertrouwen valt.

Voor ons is dat de belangrijkste zin van dit hele hoofdstuk. `docs/openstaand.md` §6 beschrijft dat wie `correct = total` post naar `/api/voortgang` de quizbonus en de foutloos-badge pakt zonder één vraag te beantwoorden. Hoofdstuk 18 punt 2 adviseerde al de LearnDash-route. **LearnPress laat zien dat de LearnPress-route de goedkopere is:** stuur de gekozen indexen, laat de server nakijken, en er valt niets meer te vervalsen. Geen HMAC, geen nonce-levensduur, geen replayvenster.

### 4d. Wat er wél ongecontroleerd binnenkomt

`$time_spend` komt uit de request en wordt zonder controle gebruikt:

```php
$start_time = $user_quiz->get_start_time()->getTimestamp();
$user_quiz->set_end_time( $start_time + $time_spend );
```

De starttijd is server-geregistreerd, dus de echte verstreken tijd is bekend, maar wordt niet gebruikt. Een quiz met tijdslimiet is daarmee client-side te rekken. Bij LearnDash is `timespent` ook ongetekend, maar daar hangt er expliciet geen poort aan; hier hangt de tijdslimiet er wél aan. Kleine, echte zwakte.

En een detail dat op ons eigen principe wrijft: het gegeven antwoord van elke vraag wordt bewaard, als JSON in `learnpress_user_item_results.result`. Dat is een bewuste keuze aan hun kant (review van je eigen quiz achteraf, `_lp_review`), maar het is precies wat wij niet doen.

---

## 5. Betalingen en inschrijving

### Hoe een aankoop toegang wordt

De keten is kort en volledig in de kern aanwezig, zonder WooCommerce: winkelwagen → `LP_Checkout` → `lp_order`-post → statuswissel → inschrijving.

1. `LP_Cart::calculate_totals()` (`inc/cart/class-lp-cart.php:233`) rekent het totaal uit met **`$course->get_price()`, dus uit de catalogus.** De regel "de prijs komt nooit uit het verzoek" wordt hier gerespecteerd; uit de request komt alleen het cursus-id en de hoeveelheid.
2. `LP_Checkout::create_order()` (`inc/class-lp-checkout.php:237`) maakt een `lp_order` met status `pending` en schrijft de regels naar `learnpress_order_items`.
3. De gateway verwerkt en zet het order op `completed`.
4. `LP_User_Factory::update_user_items()` hangt aan `learn-press/order/status-changed` (`inc/user/class-lp-user-factory.php:37`) en vertaalt de statuswissel naar rijen in `learnpress_user_items`.

Dat vierde punt is het hele toegangsmechanisme, en het is één plek. Netjes.

### Wordt bedrag en valuta gecontroleerd? Bij PayPal IPN: nee, en het is slechter dan LearnDash

Er is één betaalgateway in de gratis kern (plus "offline" en "none"): PayPal, in `inc/gateways/paypal/class-lp-gateway-paypal.php`. Twee paden.

**Het klassieke IPN-pad** (`check_webhook_callback()`, regel 155):

```php
$verify = $paypal->validate_ipn();
if ( $verify ) {
    if ( isset( $_POST['custom'] ) ) {
        $data_order = LP_Helper::json_decode( LP_Helper::sanitize_params_submitted( $_POST['custom'] ) );
        $order_id   = $data_order->order_id;
        $lp_order   = learn_press_get_order( $order_id );
        $lp_order->update_status( LP_ORDER_COMPLETED );
    }
}
```

`validate_ipn()` (regel 201) doet de klassieke postback naar PayPal en accepteert bij het antwoord `VERIFIED`. Dat is alles. Er wordt **niet** gecontroleerd:

- `receiver_email` / `business` tegen het eigen PayPal-adres;
- `payment_status === 'Completed'`;
- `txn_type` tegen een whitelist;
- `mc_gross` tegen de orderprijs;
- `mc_currency` tegen de eigen valuta.

Het order-id komt uit `$_POST['custom']`, dat wil zeggen uit de IPN-payload. `VERIFIED` bewijst alleen dat PayPal het bericht verstuurde, niet dat het aan **deze** verkoper gericht was. Dat is precies de aanval waar PayPal's eigen IPN-documentatie voor waarschuwt, en waar LearnDash sinds jaar en dag `ipn_validate_receiver_data()` voor heeft (hoofdstuk 10 §6). Bovendien: zonder `payment_status`-check zet ook een `Pending` of `Reversed` IPN het order op `completed`.

**Het nieuwere REST-pad** (`use_paypal_rest`, standaard aan) is beter: `capture_payment_for_order()` (regel 447) doet zelf een server-side `POST /v2/checkout/orders/{id}/capture` met de eigen access token, eist HTTP 201 en `status === 'COMPLETED'`, en haalt het order-id uit **PayPal's eigen antwoord** (`purchase_units[0]->payments->captures[0]->custom_id`), niet uit de browser. Dat is dezelfde "geloof niets behalve het id"-vorm die wij bij Mollie hanteren. Alleen wordt ook hier het **gecaptureerde bedrag niet tegen het order vergeleken**.

> **vs. ons:** onze Mollie-webhook haalt de status zelf op én controleert bedrag en valuta tegen wat wij hadden vastgelegd, atomair met het verlenen van het entitlement. **Hier zijn wij aantoonbaar strenger, en niet marginaal.** Hoofdstuk 18 corrigeerde onze zelffelicitatie tegenover LearnDash terecht; tegenover LearnPress staat die claim gewoon overeind.

### Terugbetalingen: er is geen terugbetaling

De orderstatussen zijn `pending`, `processing`, `completed`, `cancelled`, `failed` (`inc/lp-constants.php:86-90`). **Er bestaat geen `refunded`.** Een terugbetaling is bij LearnPress dus per definitie handwerk: een beheerder zet het order terug op `cancelled` of `failed`.

Wat er dan gebeurt, is heftiger dan intrekken. `_update_user_item_order_pending()` (`inc/user/class-lp-user-factory.php:86`) draait alleen als de oude status `completed` was, en doet dan:

```php
$lp_user_items_db->delete_user_items_old( $user_id, $course_id );
```

Die functie (`inc/Databases/class-lp-user-items-db.php:665`) verzamelt alle `user_item_id`'s van die gebruiker voor die cursus en roept `$course->delete_user_item_and_result( $user_course_ids )` aan: **een harde DELETE van de inschrijving, alle lesvoortgang en alle quizresultaten.**

Dat is de directe consequentie van het mooie ontwerp uit §2. Omdat toegang en voortgang dezelfde rijen zijn, kun je het ene niet intrekken zonder het andere te vernietigen. Iemand die na drie maanden om een terugbetaling van één cursus vraagt en later terugkomt, begint bij nul, zonder dat er ergens een spoor van zijn geschiedenis over is. Er is geen archief, geen soft delete, geen statuswaarde `revoked`.

> **Onze les hieruit is scherper dan "doe het niet".** Wij houden `entitlements` (recht) en `lesson_progress` (voortgang) al in gescheiden tabellen. Dit hoofdstuk laat zien waaróm dat de moeite waard is: bij ons kan een terugbetaling het recht op `ingetrokken` zetten zonder één les aan te raken. Die scheiding voelt als extra werk tot je ziet wat de samenvoeging kost.

### Abonnementen

Niet in de kern. Er is geen recurring, geen `subscription`, geen verlooplogica anders dan `timestamp_remaining_duration()` (een cursusduur per inschrijving). Abonnementen komen uit de betaalde `learnpress-paid-membership-pro`- of `learnpress-woo-payment`-add-on. Wat er dan bij het aflopen van een abonnement met de voortgang gebeurt, valt buiten deze zip.

---

## 6. Engagement

Kort, want het antwoord is grotendeels "nee":

| | In de gratis kern? |
|---|---|
| Certificaten | **Nee.** Geen `LP_Certificate`, geen post type, geen template, en geen enkele PDF-bibliotheek in de zip (`tcpdf`/`mpdf`/`dompdf` komen nergens voor). Alleen compatibiliteitscommentaar dat verraadt dat de add-on ooit haakjes overschreef, zoals `inc/cart/class-lp-cart.php:288`. Betaalde add-on `learnpress-certificates`. |
| Gamification | **Nee, en niet eens een aanzet.** Geen punten, XP, levels, streaks, badges, ranglijsten. `templates/loop/course/badge-featured.php` is een cosmetisch "Featured"-lintje. In `readme.txt` staat "BadgeOS" onder ROADMAP, ongebouwd. Punten komen uit `learnpress-mycred`. |
| Transactionele mail | **Ja.** 21 klassen onder `inc/emails/` (admin/student/instructor/guest), geregistreerd in `LP_Emails::register_emails()`, getriggerd door de hardgecodeerde map in `inc/emails/class-lp-email-hooks.php`. |
| Geplande mail (drip, herinnering, inactiviteit) | **Nee.** Elke trigger is een orderstatus- of inschrijvingsovergang. Er bestaat geen tijdgestuurde mail. `learnpress-content-drip` is een add-on. |
| Verzendwachtrij | **Nee.** `LP_Email_Hooks::handle_send_email_on_background()` doet per mail één `wp_remote_post()` naar de eigen `admin-post.php`, waarna `wp_mail()` synchroon draait (`inc/emails/class-lp-email.php:788`). Geen tabel, geen retry, geen ontdubbeling. Mislukt de loopback, dan is de mail weg. Grappig genoeg zit de échte wachtrijbibliotheek (DeliciousBrains' `wp-background-process`, mét cron-healthcheck) wél in `inc/libraries/`, maar wordt hij voor mail niet gebruikt. |
| "Ga verder waar je was" | **Ja**, en goed gebouwd. REST-route `lp/v1/courses/continue-course` (`inc/rest-api/v1/frontend/class-lp-rest-courses-controller.php:655`) slaat **geen aanwijzer op**, maar loopt het curriculum af en geeft de eerste niet-afgeronde stap terug. Dat is exact wat hoofdstuk 18 punt 3 en punt 23 ons aanraden: berekenen, niet opslaan. Uncanny doet het bij LearnDash fout, LearnPress doet het hier goed. |
| Cursusreviews / sterren | **Nee.** Wat er staat is `SingleCourseTemplate::html_feature_review()` (`inc/TemplateHooks/Course/SingleCourseTemplate.php:487`): één door de beheerder zelf ingetypte quote uit postmeta `_lp_featured_review`, met **vijf hardgecodeerde sterren** eromheen. Geen berekend gemiddelde, geen inzendingen. Voor ons merk is dat precies het soort verzonnen social proof dat we hebben weggehaald; goed om te weten dat het hier in de kern zit. Echte reviews komen uit `learnpress-course-review`. |

**Het verdienmodel is zichtbaar in de code, niet alleen in de marketing.** `LP_Manager_Addons` (`inc/class-lp-manager-addons.php`) haalt de catalogus als JSON van `learnpress.github.io/learnpress/version-addons.json`; gratis add-ons komen van wordpress.org, betaalde van `updates.thimpress.com/thim-addon-market/download-addon` tegen een `purchase_code`, met een `active-site`-callback en een notitie die 60 dagen voor het aflopen van je licentie begint te zeuren (`inc/admin/views/admin-notices/addons-purchased-extend.php`). Daarnaast staat er in `inc/background-process/class-lp-background-query-items.php` nog een oudere, hardgecodeerde lijst van zestien premium-slugs plus een Envato-API-call met een ingebakken bearer token om ThimPress-thema's te upsellen.

---

## 7. Architectuur

**Omvang** (gemeten, exclusief `vendor/`): 1.431 bestanden, 950 PHP-bestanden, **153.126 regels PHP**. Daarnaast 328 JS-bestanden, 46 CSS, en een `assets/`-map van 15 MB. De grootste bestanden zijn nog altijd de proceduretrommels: `inc/lp-core-functions.php` 3.285 regels, `inc/admin/lp-admin-functions.php` 2.222, `inc/user/lp-user-functions.php` 2.097.

**Namespaces en autoloading: halverwege een verhuizing, al jaren.** Er draaien twee autoloaders naast elkaar. `inc/class-lp-autoloader.php` is een handgeschreven `spl_autoload_register` die klassenamen lowercase't naar `class-lp-foo.php` en de map vervolgens met regels als "begint het met `lp_gateway_` dan `inc/gateways/…`" raadt (inclusief een `__autoload()`-registratie uit het PHP 5-tijdperk). Daarnaast is er echte PSR-4, maar exact één regel ervan: `vendor/composer/autoload_psr4.php` mapt `LearnPress\` op `inc/`.

Van de 696 PHP-bestanden in `inc/` heeft **227 (ongeveer een derde) een `namespace`**; 251 heten nog `class-lp-*.php`, en er zijn 328 globale `learn_press_*`/`lp_*`-functies. De naamruimten met gewicht zijn `LearnPress\Gutenberg` (76 bestanden), `LearnPress\ExternalPlugin` (45), `TemplateHooks` (31) en `Models` (25).

De grens loopt dwars door mappen heen. `inc/Databases/` bevat PSR-4-klassen (`DataBase.php`, `UserItemsDB.php`) én achttien `class-lp-*-db.php`-bestanden. `inc/Models/` bevat het nieuwe `CourseModel` én een legacy `class-lp-rest-response.php`. En één bestand mist de boot volledig: `inc/TemplateHooks/Admin/AI/AdminAICloseWarningTemplate.php` declareert `namespace learnpress\inc\TemplateHooks\Admin\AI;`, wat niet op de PSR-4-prefix past en dus door Composer niet geladen kán worden.

**Parallelle implementaties, allebei in gebruik.** Er is een oude `LP_Course extends LP_Abstract_Course` (`inc/course/abstract-course.php`, 1.465 regels) én een nieuwe `LearnPress\Models\CourseModel`. Ongeveer 190 aanroepplekken gebruiken het oude pad, ongeveer 80 het nieuwe. Dezelfde splitsing bij `inc/curds/` (acht CURD-klassen achter `interface-curd.php`) tegenover `inc/Models/` + `inc/Databases/`, waarbij de CURDs nog steeds live worden aangeroepen. Je ziet dat ook in de code die ik hierboven las: `submit_quiz` werkt met het oude `LP_User_Item_Quiz`, `start_quiz` met het nieuwe `UserQuizModel`, in dezelfde controller.

**DI-container: die is er niet.** Geen container, geen service providers, geen constructor-injectie. De wiring is singletons en globals: een trait `inc/Helpers/Singleton.php` die 34 klassen gebruiken, 336 aanroepen van `instance()`/`getInstance()` in `inc/`, en tot slot `$GLOBALS['LearnPress'] = LearnPress::instance();` onderaan `learnpress.php`. `inc/Services/` bevat twee klassen (`CourseService`, `OpenAiService`) en ook die zijn singletons.

**REST API: twee stacks, geen v2.** Stack A is `inc/rest-api/` met namespace **`lp/v1`** (frontend) en `lp/v1/admin`. Stack B is `inc/jwt/rest-api/` met namespace **`learnpress/v1`**, de mobiele/JWT-API, acht controllers. Twee volledig gescheiden implementaties van "de LearnPress REST API", met verschillende basisklassen en verschillende URL's, allebei meegeleverd.

De permission-callbacks zijn wisselend van kwaliteit, en de wisseling is leerzaam:
- `lp/v1/lazy-load`: `course-progress` en `items-progress` gebruiken `function () { return is_user_logged_in(); }`, `course-curriculum` is `__return_true` (publieke leesroute). Verdedigbaar.
- `lp/v1/users`: vier keer `__return_true` met de echte check ernaast weggecommentarieerd; drie van de vier callbacks doen het zelf goed, `hint-answer` niet (zie §3).
- `lp/v1/load_content_via_ajax`: een generieke `class:method`-RPC-route met `__return_true`, afgeschermd door een allowlist die **standaard leeg is** (`apply_filters( 'lp/rest/ajax/allow_callback', [] )`). Dichtgetimmerd, maar de vorm ("elke methode is aanroepbaar tenzij") is de verkeerde kant op ontworpen.

**AJAX: ook twee systemen.** `inc/class-lp-ajax.php` registreert zeven acties met vlaggen in de string (`'checkout:nopriv'`, `'request-become-a-teacher:nonce'`) via een eigen dispatcher in `class-lp-request-handler.php`. **Nonce-controle is daar opt-in**: alleen de acties met `:nonce` krijgen automatisch een controle, en dat is er precies één van de zeven. De andere doen het zelf, of niet. Het nieuwere `inc/Ajax/` (namespace `LearnPress\Ajax`) doet het beter: `AbstractAjax::catch_lp_ajax()` controleert een `wp_rest`-nonce plus de referer, en dispatcht dan op methodenaam.

**Wat er in de gedistribueerde zip zit aan build- en testspul: niets bruikbaars, en één rommelspoor.** Geen `composer.json`, geen `package.json`, geen lockfile, geen `phpunit.xml`, geen `tests/`, geen `.github/`, geen webpack/gulp-config, geen `.map`-bestanden. **Er is dus geen enkele automatische test in deze release**, en geen manier om te zien of ze bestaan.

`vendor/` is een lege huls: elf bestanden, 83 KB, alleen `autoload.php` en `vendor/composer/`. Er zijn nul packagemappen. Toch declareert `vendor/composer/installed.json` nog vijf packages, allemaal `"dev_requirement": true`: PHP_CodeSniffer 3.8.0, WPCS 3.0.1, PHPCSUtils, PHPCSExtra en de dealerdirect-installer. De root staat op `dev-develop` met `"dev": true`, en de classmap wijst naar veertig PHPCS-klassebestanden die niet meegeleverd zijn. **De release is dus gebouwd met een dev-Composer-autoloader**, met een classmap naar bestanden die er niet zijn. Runtime hangt LearnPress nergens van af (de JWT-bibliotheek is met de hand naar `inc/jwt/` gekopieerd als `LP\Firebase\JWT`).

Daarnaast zit `assets/src/` (7,4 MB ongebouwde bronnen) gewoon in de distributie naast `assets/js/` en `assets/css/`, en van veel bundels worden zowel `foo.js` als `foo.min.js` meegeleverd. Ruwweg de helft van de 15 MB assets hoort niet in een release.

**Deprecatieschuld.** `inc/lp-deprecated.php` is **1.106 regels** met ongeveer 92 functiedefinities, allemaal shims naar `learn_press_get_template()`. Ze dragen géén `@deprecated`-tag en roepen géén `_deprecated_function()` aan: het is stille levende code. Daarnaast staan er 240 `@deprecated`-tags in 55 bestanden en 133 aanroepen van `_deprecated_function()`. De versiespreiding laat zien dat er wel gemarkeerd maar nooit opgeruimd wordt: 28 stuks uit 4.1.6.9, 26 uit 4.1.7.2, 26 uit 4.1.7.3, 28 uit 4.2.0, allemaal nog aanwezig.

**PHP-niveau.** Header: `Requires at least: 6.0`, `Requires PHP: 7.0`. En de code houdt zich daaraan tot op het bot: nul `declare(strict_types=1)`, nul enums, nul `match`, nul getypeerde properties, nul constructor property promotion, nul arrow functions. Wat er wél is: 858 return-types en `??` in 189 bestanden, en die zitten vrijwel allemaal in de nieuwe namespaced laag. De moderniteit is dus reëel maar bewust beperkt tot wat op PHP 7.0 draait.

---

## 8. Beter en slechter dan LearnDash

De marktreputatie is "goedkope instap, wisselvallige kwaliteit". Tegen de code gehouden klopt de tweede helft, maar niet op de plek waar je hem verwacht. **De architectuur is op de belangrijkste punten beter doordacht dan die van de marktleider; het is de afwerking die wisselvallig is.**

### Duidelijk beter: het datamodel voor voortgang en toegang

Eén tabel, `learnpress_user_items`, is de enige bron van waarheid voor inschrijving én voortgang, met de reden van toegang erin (`ref_id`/`ref_type`) en het voortgangspercentage afgeleid uit een `COUNT` in plaats van uit een cachekolom. Daar staat bij LearnDash tegenover: een geserialiseerd `_sfwd-course_progress`-usermeta-blob met alle cursussen van een gebruiker erin, een `learndash_user_activity`-spiegel met negen indexen, een aparte `course_completed_{id}`-metakey, een `_sfwd-quizzes`-blob voor quizzen, twee id-ruimtes met een brugfunctie ertussen, en een hertelling die per quizstap de database raadpleegt zodra de meta-cache invalideert.

Dat is geen kwestie van smaak. Het is het verschil tussen één schrijfactie en drie, en tussen één plek waar de waarheid staat en vier plaatsen die uit elkaar kunnen lopen. **De goedkope plugin heeft hier het schone model en de dure plugin de vijftien jaar aangroei.**

Twee dingen versterken dat beeld nog. Genormaliseerde antwoordopties (één rij, `is_true` als kolom) tegenover een `serialize()`'d objectarray met een byte-lengte-reparatiefunctie eromheen. En de quizmotor die geen score van de client accepteert (§4c) en daarmee de hele nonce-machinerie van LearnDash overbodig maakt.

### Duidelijk slechter: de betaalketen

`LP_Gateway_Paypal::check_webhook_callback()` accepteert elke IPN die PayPal met `VERIFIED` beantwoordt, leest het te completeren order-id uit `$_POST['custom']`, en controleert ontvanger noch betaalstatus noch bedrag noch valuta. LearnDash controleert in dezelfde situatie `receiver_email`/`business`, `txn_type`, `payment_status`, en sinds 4.20.1 ook `mc_gross` en `mc_currency`, met `revoke_access()` bij afwijking. Dat is niet "iets minder streng", dat is het verschil tussen wel en geen ontvangercontrole op een postback die iedereen kan uitlokken.

Daar bovenop: er is **geen orderstatus `refunded`**, dus terugbetalen is per definitie handwerk, en het handwerk dat er is (`cancelled`) roept `delete_user_items_old()` aan en **wist de complete leergeschiedenis van die cursus**. Toegang intrekken en voortgang vernietigen zijn hier hetzelfde ding.

Dat is de prijs van het mooie datamodel uit de vorige alinea, en het is een goede illustratie dat een elegante normalisatie een productbeslissing afdwingt die je misschien niet wilde nemen.

### Wat "wisselvallige kwaliteit" écht betekent hier

Niet: slordige logica. Wel: **een codebase die drie migraties tegelijk halverwege heeft.** Twee autoloaders, twee REST-stacks met verschillende namespaces, twee AJAX-systemen, twee cursusmodellen die allebei in productie worden aangeroepen (soms in dezelfde controller), 1.106 regels ongemarkeerde deprecatieshims, 240 `@deprecated`-tags waarvan de oudste vier minorversies oud is, een release met een dev-Composer-autoloader en 7,4 MB ongebouwde bronnen, drie versienummers in één zip die het oneens zijn, en nul tests in de distributie.

En dan de kleine dingen die uit precies die toestand voortkomen: een `permission_callback` die vier keer is weggecommentarieerd waarna drie callbacks het zelf oplossen en de vierde niet (`hint-answer`), een filternaam `lp/page-controller/` die halverwege is afgekapt, en `'object' => $question` in een API-respons dat alleen niets lekt omdat de properties toevallig `protected` zijn.

**De conclusie is dus niet "cheap entry, uneven quality" maar iets nuttigers: goede ontwerpbeslissingen, matige uitvoeringsdiscipline.** Dat is een ander soort risico dan bij LearnDash, waar de discipline redelijk is maar het fundament vastligt in vijftien jaar achterwaartse compatibiliteit.

---

## Wat wij hiervan zouden lenen

1. **De serverzijdige quizscore, in de LearnPress-vorm en niet de LearnDash-vorm.** Hoofdstuk 18 punt 2 staat al op de lijst; dit hoofdstuk maakt hem goedkoper. Stuur alleen de gekozen indexen naar `/api/voortgang`, laat de server nakijken tegen `src/content` (dat al `server-only` is) en vergeet de antwoorden meteen. Dan is `correct` geen invoer meer maar een uitkomst, en is er niets te ondertekenen. Sluit `docs/openstaand.md` §6 in één keer, zonder HMAC en zonder opslag.
2. **Houd recht en voortgang gescheiden, en schrijf op waaróm.** LearnPress bewijst per ongeluk wat die scheiding waard is: één DELETE bij intrekken wist daar de leergeschiedenis. Wij hebben de scheiding al; de les is dat een terugbetaling bij ons een statuswissel op `entitlements` moet zijn en nooit een verwijdering, en dat `entitlements` een reden hoort te dragen (hun `ref_id`/`ref_type` is precies dat, en punt 1 van hoofdstuk 18 vroeg er al om).
3. **"Ga verder waar je was" berekenen, niet opslaan.** Hun `continue-course`-route loopt het curriculum af en geeft de eerste niet-afgeronde stap terug. Nul nieuwe kolommen, nul invalidatie. Dat bevestigt hoofdstuk 18 punt 3 met een tweede onafhankelijke implementatie, en weerlegt Uncanny's aanpak.
4. **Geen tweede weg naar de content, en de REST-laag telt mee.** Hun sterkste punt is dat dezelfde poortfunctie ook in de API-controllers staat, en dat `content.raw` en `content.rendered` alleen worden gevuld als de vlag true is. Bij ons vertaalt dat zich naar: elke nieuwe API-route die lesdata teruggeeft, gaat door `heeftToegangTot()` vóór de data wordt opgehaald, niet erna. En hun tweede hardening is het overwegen waard: de directe permalink van een beschermd item geeft een 404 in plaats van iets halfs.
5. **Eén nuance over onze Mollie-regel, ter archivering.** Hoofdstuk 18 corrigeerde ons terecht dat wij tegenover LearnDash *gelijkwaardig* zijn, niet strenger. Tegenover LearnPress zijn we wél strenger, en dat is geen zelffelicitatie maar een gegeven om te onthouden: de bedrag-en-valutacontrole is geen overbodige rite, want er zijn echte LMS'en in productie die hem niet doen.

---

## Onzekerheden

- **Het versienummer is niet vast te stellen.** Header 4.2.7, `readme.txt` 4.4.4, changelog tot 4.2.6.8.2, `@since`-tags tot 4.3.2 en 4.7.0. Ik heb 4.2.7 aangehouden omdat `LEARNPRESS_VERSION` daaruit komt, maar dat betekent dat sommige regelnummers en klassenamen hieronder bij een andere download net anders kunnen liggen. Behandel dit als "de wordpress.org-zip van 5 aug 2026", niet als "LearnPress 4.2.7".
- **Ik heb de happy path gevolgd.** Guest checkout, `no_required_enroll`-cursussen (waar `LP_Course_No_Required_Enroll` een compleet parallel quizpad heeft, inclusief beoordeling voor niet-ingelogde bezoekers), retakes, herhaalde aankoop en de `access_level`-kolom heb ik niet uitputtend nagelopen. Vooral het `no_required_enroll`-pad verdient eigen aandacht als iemand hier ooit op wil bouwen.
- **De PayPal-bevinding is uit codelezing, niet uit een test.** Ik heb geen IPN nagebootst. Wat ik hard kan maken is wat de functie wél en níét controleert; of er in de praktijk nog een laag boven zit (bijvoorbeeld in een add-on of via de standaardinstelling `use_paypal_rest = 'yes'`, waardoor het IPN-pad bij een verse installatie helemaal niet draait) heb ik niet uitgeprobeerd. Die standaardwaarde dempt het risico aanzienlijk; hij haalt de code niet weg.
- **Ik heb de betaalde add-ons niet gezien.** Certificaten, gamification, drip, abonnementen en reviews zitten allemaal buiten deze zip. Elke uitspraak in §6 gaat over de gratis kern, en de reputatie van LearnPress hangt voor een deel juist aan wat die add-ons doen.
- **Twee eigen bijna-fouten die ik heb rechtgezet en die het vermelden waard zijn.** Ik las eerst vier `__return_true`-routes op `lp/v1/admin/tools` als open destructieve endpoints; ze worden niet eens geregistreerd voor niet-admins. En `'object' => $question` in de quizrespons zag eruit als een antwoordlek tot ik de zichtbaarheid van de properties naliep. Beide claims waren precies het soort dat hoofdstuk 18 aanwijst: een patroon herkennen en de conclusie erbij verzinnen. De rest van dit hoofdstuk is met dezelfde argwaan geschreven, maar ik heb niet alles twee keer kunnen doen.
- **De prestatie-uitspraken zijn afgeleid uit de codevorm** (queryvorm, indexen, cachelagen), niet uit meting op een echte dataset.
