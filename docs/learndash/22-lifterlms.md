# 22. LifterLMS: de directe concurrent, met winkel en lidmaatschappen in de gratis kern

> Dit hoofdstuk leest de **échte broncode van LifterLMS 10.1.0**, de gratis kern zoals die vandaag (5 augustus 2026) van wordpress.org komt. Licentie **GPLv3**, dus we mogen vrij citeren. Alle paden hieronder zijn relatief aan de pluginmap (`lifterlms/`). Versie uit de header van `lifterlms.php`: `Version: 10.1.0`, `Requires at least: 5.9`, `Tested up to: 7.0`, `Requires PHP: 7.4`.
>
> LifterLMS is de directste concurrent van LearnDash. Dit stuk beantwoordt **dezelfde acht vragen** als hoofdstuk 10 (datamodel, voortgang, toegang, betalingen) en hoofdstuk 11 (quizmotor), zodat je ze regel voor regel naast elkaar kunt leggen. LearnDash wordt hier niet opnieuw beschreven; waar het verschilt staat er een expliciete vergelijking.
>
> Eén ding vooraf, want het kleurt alles: **de gratis kern bevat het complete order-, transactie- en abonnementsmodel, maar geen enkele echte betaalprovider.** De enige geregistreerde gateway is `LLMS_Payment_Gateway_Manual` (handmatig/offline). Stripe en PayPal zijn betaalde add-ons uit privérepo's. De reputatie "e-commerce zit erin" klopt voor de administratie en niet voor het afrekenen.

---

## 1. Contentmodel

**Vier niveaus, allemaal WordPress-posttypes.** Geregistreerd in `includes/class.llms.post-types.php`:

| Post type | Rol | Publiek? |
|---|---|---|
| `course` | cursus | `public => true` |
| `section` | sectie (module) | intern, geen eigen URL |
| `lesson` | les | `public => true`, `publicly_queryable => true`, `exclude_from_search => true` |
| `llms_quiz` | quiz | `public => true`, `show_ui => false` |
| `llms_question` | vraag | **`public => false`, `publicly_queryable => false`** |
| `llms_membership` | lidmaatschap | `public => true` |
| `llms_access_plan` | prijsplan (het verkoopbare ding) | intern |
| `llms_order` / `llms_transaction` | bestelling en betaling | intern |
| `llms_certificate` / `llms_my_certificate` | sjabloon en uitgereikt exemplaar | zie §6 |
| `llms_achievement` / `llms_my_achievement` | idem voor prestaties | zie §6 |
| `llms_engagement` | de regel "als X, doe dan Y" | intern |
| `llms_coupon`, `llms_voucher` | korting en vouchers | intern |

**De hiërarchie zit in postmeta, niet in `post_parent`.** Een les draagt `_llms_parent_course` en `_llms_parent_section` plus een `_llms_order` binnen de sectie (`includes/models/model.llms.lesson.php`). `LLMS_Course::get_lessons()` bouwt de lijst daarom op als een lus: eerst de secties ophalen, dan **per sectie een `WP_Query`** naar de lessen. `get_lessons_count()` doet een aparte `WP_Query` op `meta_key = _llms_parent_course` met `posts_per_page => -1`.

**Lesinhoud staat in `post_content` van de les**, gewoon in `wp_posts`, ongewijzigd en onversleuteld. Precies zoals bij LearnDash. De bescherming zit uitsluitend in het renderen (§3).

Wat opvalt tegenover LearnDash: er is een expliciet **`llms_access_plan`-object tussen product en prijs**. Je verkoopt niet "de cursus", je verkoopt een plan dat naar de cursus wijst, met eigen prijs, sale-prijs, proefperiode, frequentie, looptijd en vervaldatum. Eén cursus kan meerdere plannen hebben (eenmalig €49, of €9/mnd, of gratis-met-account). Dat is een volwassener verkoopmodel dan LearnDash in de kern heeft.

> **Vergelijk met ons:** onze cursus ís de getypte data in `src/content/`, met één prijs uit `src/lib/pricing.ts` en de uitzondering via `course.price`. LifterLMS' access plan is precies de abstractie die wij zouden nodig hebben als College+ en losse verkoop op hetzelfde product moeten kunnen zitten.

---

## 2. Voortgangsopslag, en de test van de schaalclaim

### 2a. Waar het staat

LifterLMS legt bij activatie **tien eigen tabellen** aan (`includes/class.llms.install.php`, `get_schema()`, regel 424 en verder). De belangrijkste:

```sql
CREATE TABLE `{prefix}lifterlms_user_postmeta` (
  meta_id      bigint(20) NOT NULL auto_increment,
  user_id      bigint(20) NOT NULL,
  post_id      bigint(20) NOT NULL,
  meta_key     varchar(255) NULL,
  meta_value   longtext NULL,
  updated_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`meta_id`),
  KEY user_id (`user_id`),
  KEY post_id (`post_id`)
)
```

**Lees die naam goed.** Dit is `wp_lifterlms_user_postmeta`, een **eigen tabel**, niet WordPress' `wp_postmeta`. Hier staat alles wat een gebruiker met een post doet: `_is_complete`, `_completion_trigger`, `_status` (inschrijving), `_start_date`, `_enrollment_trigger`, `_favorite`. De andere negen tabellen: `lifterlms_quiz_attempts`, `lifterlms_events`, `lifterlms_events_open_sessions`, `lifterlms_sessions`, `lifterlms_lesson_time_sessions`, `lifterlms_notifications`, `lifterlms_vouchers_codes`, `lifterlms_voucher_code_redemptions`, `lifterlms_product_to_voucher`.

**Eén bron van waarheid, plus een cache die de rapportage leest.** De feiten (les af, ingeschreven ja/nee) staan uitsluitend in `lifterlms_user_postmeta`. Daarnaast schrijft `LLMS_Abstract_User_Data::set()` (`includes/abstracts/llms.abstract.user.data.php`) berekende percentages naar **gewone WordPress-usermeta**: `llms_course_{id}_progress`, `llms_overall_progress`, `llms_overall_grade`. Dat is een afgeleide cache, geen tweede boekhouding, en hij wordt actief leeggegooid bij een mutatie. Dat is netter dan LearnDash, waar het geserialiseerde usermeta-blob canoniek is en de activity-tabel een spiegel.

**Niet transactioneel.** `LLMS_Student::insert_completion_postmeta()` roept `llms_bulk_update_user_postmeta()` aan, wat simpelweg per sleutel een losse insert of update doet en een array met foutcodes teruggeeft. Geen transactie, geen unieke sleutel op `(user_id, post_id, meta_key)`. De uniciteit is een PHP-afspraak (de `$unique`-parameter), net als bij LearnDash.

**Een deel is bewust append-only.** `insert_enrollment_postmeta()` en `insert_status_postmeta()` roepen `llms_update_user_postmeta( …, $unique = false )` aan, dus **elke statuswijziging voegt een rij toe**. De huidige status is "de rij met de hoogste `updated_date`". Dat geeft je gratis een inschrijfhistorie, en het is de reden dat élke statuslezing een `ORDER BY updated_date DESC ... LIMIT 1` is (`LLMS_Student::get_enrollment_status()`, `includes/models/model.llms.student.php:566`).

### 2b. Wat één lesvoltooiing kost

`LLMS_Student::mark_complete()` → `update_completion_status()` (`model.llms.student.php:1755`). De keten:

1. Les op compleet zetten: twee rijen in `lifterlms_user_postmeta` (`_is_complete`, `_completion_trigger`).
2. **Cascade naar boven.** De sectie wordt herberekend met `get_progress( $section_id, 'section', false )`, dus zónder cache: die haalt alle lessen van de sectie op en doet **per les een aparte query** (`is_complete()` → `LLMS_Query_User_Postmeta`).
3. Is de sectie klaar, dan dezelfde behandeling voor de cursus: alle lessen van de cursus opnieuw, opnieuw één query per les.
4. En daarboven nog `course_track` per track, dat per cursus in de track `is_complete('course')` aanroept.

Voor een cursus van 40 lessen in 6 secties kost één afgevinkte les dus grofweg **een handvol `WP_Query`'s plus tientallen enkelrij-queries** op de eigen tabel. Bij ons is dat één statement met een delta.

### 2c. De claim uit hoofdstuk 7, getoetst

Hoofdstuk 7 zegt (uit secundaire bronnen): *"postmeta-datamodel schaalt slechter (±2.000 cursisten, daarna optimalisatie nodig)"*, met daarbij dat LearnDash beter schaalt omdat het een eigen tabel heeft. **Die claim moet worden vervangen.** Wat de code laat zien:

**Fout op het mechanisme.** LifterLMS stopt voortgang en inschrijving níét in `wp_postmeta`. Het heeft er tien eigen tabellen voor. Op het punt "eigen tabellen versus postmeta" maken LearnDash en LifterLMS dezelfde keuze. De verwarring komt vrijwel zeker door de tabelnáám `lifterlms_user_postmeta`, die klinkt als WordPress-postmeta en het niet is. Wat er wél in `wp_postmeta` belandt zijn de geaggregeerde cursuscijfers (`_llms_average_progress`, `_llms_average_grade`, `_llms_enrolled_students`) en de contentstructuur, niet het feitenlog.

**Richting klopt, om drie andere redenen:**

1. **De indexen zijn te dun voor de query's die erop draaien.** Alleen `KEY user_id` en `KEY post_id`, terwijl elke lezing `WHERE user_id = %d AND post_id = %d AND meta_key = %s ORDER BY updated_date DESC` is (`_llms_query_user_postmeta()`, `includes/functions/llms.functions.user.postmeta.php:231`). Geen samengestelde index, geen index op `meta_key`, geen index op `updated_date`. MySQL kan er één van de twee kolomindexen gebruiken en filtert de rest met de hand.
2. **Leesversterking.** Een voortgangsbalk voor een cursus van 40 lessen is 40 losse queries, niet één. Dat schaalt met de cursuslengte per paginaweergave, niet met het aantal cursisten, maar het vermenigvuldigt wel met gelijktijdige bezoekers.
3. **De rapportagequery is O(alle gebruikers).** `LLMS_Student_Query::prepare_query()` (`includes/class.llms.student.query.php:173`) selecteert **uit `wp_users`**, hangt er per rij een gecorreleerde subquery aan (`SELECT meta_value FROM …lifterlms_user_postmeta WHERE meta_key='_status' AND user_id = id … ORDER BY updated_date DESC LIMIT 1`) en filtert daarna met `HAVING status IS NOT NULL`. Een `HAVING` op een berekende kolom kan geen index gebruiken en laat zich niet met `LIMIT` afkappen: elke rij van de gebruikerstabel wordt gematerialiseerd, ook als je pagina 1 van 20 bekijkt. Dat is de query die traag wordt naarmate de site groeit, niet de voortgangsschrijf.

**En het getal?** LifterLMS noemt in zijn eigen code een grens, en die staat op **500, niet op 2.000**. In `includes/processors/class.llms.processor.course.data.php:290`:

```php
$this->throttle_max_students = apply_filters( 'llms_data_processor_course_data_throttle_count', 500, $this );
```

Boven de 500 ingeschreven cursisten in één cursus stopt LifterLMS met bij elke gebeurtenis de gemiddelden herberekenen en doet het dat nog hooguit eens per vier uur (`HOUR_IN_SECONDS * 4`). De herberekening zelf loopt dan als achtergrondproces in blokken van 100 cursisten (`per_page => 100`) via `deliciousbrains/wp-background-processing`, met een lock in postmeta (`_llms_temp_calc_data_lock`) tegen dubbel draaien.

**Verdict:** de claim is in zijn huidige formulering onjuist en moet worden herschreven. Niet "postmeta", maar: *een eigen tabel zonder samengestelde indexen, plus leesversterking per les, plus een rapportagequery die de hele gebruikerstabel materialiseert. LifterLMS ondervangt dat met throttling en batchverwerking vanaf een zelfgekozen drempel van 500 cursisten per cursus.* Dat is aantoonbaar zwakker dan LearnDash' activity-tabel met negen indexen, maar het is een indexerings- en query-probleem, geen datamodelkeuze, en LifterLMS heeft er een expliciet antwoord op.

---

## 3. Toegangscontrole

### 3a. Er is één bedoelde poort, en die kijkt naar de WordPress-query

`llms_page_restricted( $post_id, $user_id )` in `includes/functions/llms.functions.access.php:27` is de enige plek die beslist. Hij geeft een array terug:

```php
array(
    'content_id'     => $post_id,
    'is_restricted'  => false,
    'reason'         => 'accessible',
    'restriction_id' => 0,
)
```

De redenen zijn benoemd (`sitewide_membership`, `membership`, `enrollment_lesson`, `enrollment_course`, `enrollment_membership`, `quiz`, `course_time_period`, `lesson_drip`, `lesson_prerequisite`, `course_prerequisite`, `course_track_prerequisite`), elk met een eigen helperfunctie in hetzelfde bestand. Dat is netter dan LearnDash: geen `@todo consolidate`, geen twee inschrijvingsrepresentaties. De kernvraag is uiteindelijk altijd `$student->is_enrolled( $restriction_id )`.

**Maar de poort leunt op templatecontext, niet op data.** Kijk naar de takken: `is_home()`, `is_search()`, `is_singular() && 'lesson' === $post_type`, `is_singular() && 'course' === …`. Buiten een singular hoofdquery valt de functie in de `else`-tak en geeft hij "accessible" terug. Dat is geen theorie: LifterLMS moet het zelf omzeilen om zijn eigen REST-afscherming te laten werken, in `includes/class.llms.template.loader.php` (`maybe_restrict_post_content()`):

```php
// Needed by `llms_page_restricted()` to work as expected.
$is_singular        = $query->is_singular;
$query->is_singular = true;
$page_restricted    = llms_page_restricted( get_the_ID() );
…
$query->is_singular = $is_singular;
```

Een autorisatiefunctie die je eerst moet voorliegen over de querystatus, is geen datapoort.

### 3b. Afdwinging is dubbel, en allebei render-tijd

1. **Templatewissel.** `LLMS_Template_Loader::template_loader()` haakt op `template_include` en laadt `single-no-access.php` in plaats van de lestemplate.
2. **Contentfilter.** `llms_get_post_content()` (`includes/functions/llms-functions-content.php:27`) haakt op `the_content` en zet voor een vergrendelde `lesson` of `llms_quiz` letterlijk `$content = ''`.

Voor een cursus of lidmaatschap wordt de content vervangen door de **verkooppagina** (`llms_get_post_sales_page_content()`), wat commercieel slim is en precies onze SEO-huisregel volgt: stuur niemand naar een dood slot maar toon wat hij kan kopen.

### 3c. Kan een filter het uitzetten? Ja, op minstens vier manieren

- `apply_filters( 'llms_page_restricted', $results, $post_id )` op élk returnpad. Eén callback die `is_restricted => false` teruggeeft, opent alles.
- `apply_filters( 'llms_force_php_template_loading', true )` in `maybe_force_php_template()`. **LifterLMS gebruikt dit zelf**: in `block_template_loader()` staat `add_filter( 'llms_force_php_template_loading', '__return_false' );`.
- `apply_filters( 'llms_get_post_content', $content, $post, $restrictions )` aan het eind van de contentfilter.
- `llms_can_user_bypass_restrictions()` en de rol-caps eromheen.

Dat is dezelfde structurele zwakte die hoofdstuk 17 bij LearnDash vond. Bij beide is contentbescherming een beleefde haak die opzij kan.

### 3d. Waar het wél data-niveau is

Twee plekken doen het beter, en het zijn precies de plekken waar de query-context ontbreekt:

- **De quiz-AJAX.** `LLMS_AJAX_Handler::verify_quiz_access()` (`includes/class.llms.ajax.handler.php:415`) doet `$student->is_enrolled( $course->get( 'id' ) )` rechtstreeks, plus een controle dat de quiz bij de opgegeven les hoort. De docblock zegt `@since 10.0.2` en noemt het doel: *"to prevent authorization bypass via user-controlled keys"*. Dit is dus een recent gedichte lek (zie §4c).
- **De REST-API.** De LMS-posttypes worden bewust **overgeslagen** door de REST-contentfilter (`get_content_restriction_skip_post_types()`, `@since 10.1.0`), omdat de meegeleverde `libraries/lifterlms-rest` het strenger doet: `LLMS_REST_Lessons_Controller::check_read_permission()` valt terug op `parent::check_update_permission()`, met de opmerking *"At the moment we grant lessons read permission only to who can edit lessons."* Lezen via REST vereist dus schrijfrechten. Bijkomend: `lesson` heeft geen `show_in_rest`, dus de WordPress-kern-REST publiceert lessen sowieso niet.

> **Vergelijk met ons:** `heeftToegangTot()` is `server-only`, kijkt naar de sessie en één rij in `entitlements`, en is niet filterbaar. Het verschil is niet dat wij strenger controleren, maar dat onze poort **vóór de data** zit en die van hen vóór de weergave. Hun quiz-AJAX en REST-laag zijn de twee plekken waar ze het ook zo doen, en dat is niet toevallig: daar bestaat het rendermoment niet.

---

## 4. Quizmotor

### 4a. Komen de juiste antwoorden in de browser? Nee

De keuzes worden gerenderd in `templates/quiz/questions/content-choice.php`, en het complete relevante deel is dit:

```php
<input id="choice-<?php echo esc_attr( $choice->get( 'id' ) ); ?>"
       name="question_<?php echo esc_attr( $question->get( 'id' ) ); ?>[]"
       type="<?php echo esc_attr( $input_type ); ?>"
       value="<?php echo esc_attr( $choice->get( 'id' ) ); ?>">
<label …><p class="llms-choice-text"><?php echo esc_html( $choice->get( 'choice' ) ); ?></p></label>
```

Alleen een keuze-id en de tekst. Geen `correct`, geen `points`, geen datablok met de sleutel. Dat is schoner dan LearnDash het oplost: die bouwt de juiste antwoorden wél op in het template en **strippt** ze er daarna weer uit in `WpProQuiz_View_FrontQuiz`. Hier worden ze nooit opgebouwd.

Bovendien krijgt de browser de vragen **één voor één** via AJAX (`quiz_get_question`, `quiz_answer_question`), niet als één set bij paginalaad. En `llms_question` is `public => false, publicly_queryable => false`, dus de vraagpost is niet los op te vragen.

### 4b. Nakijken gebeurt volledig server-side

De client stuurt alleen de gekozen keuze-id's. `LLMS_Quiz_Attempt::answer_question()` (`includes/models/model.llms.quiz.attempt.php:126`):

```php
$question = llms_get_post( $question_id );
$graded   = $question->grade( $answer );
$questions[ $key ]['answer']  = $answer;
$questions[ $key ]['correct'] = $graded;
$questions[ $key ]['earned']  = llms_parse_bool( $graded ) ? $questions[ $key ]['points'] : 0;
```

`LLMS_Question::grade()` (`includes/models/model.llms.question.php`) vergelijkt de gesorteerde inzending met `get_correct_choice()`, of bij invulvragen met `get_conditional_correct_value()` (standaard hoofdletterongevoelig, `llms_quiz_grading_case_sensitive`).

Bij afronding rekent `calculate_grade()` het cijfer uit de eigen administratie:

```php
$grade     = llms()->grades()->round( $this->get_count( 'earned' ) * $this->calculate_point_weight() );
$min_grade = $quiz ? $quiz->get( 'passing_percent' ) : 100;
$this->set( 'grade', $grade );
$status = ( $min_grade <= $grade ) ? 'pass' : 'fail';
```

**Er valt hier niets te hercontroleren, want de score is nooit door de client aangeraakt.** Dat is het antwoord op de vraag die hoofdstuk 11 stelde: LearnDash lost het probleem op met ondertekende nonces (`p_nonce`/`a_nonce`) omdat zijn JS wél punten meestuurt; LifterLMS heeft het probleem simpelweg niet. Het ontwerp is een generatie eenvoudiger en even veilig.

### 4c. Waar het wél mis kon gaan: de attempt key

Een poging wordt geadresseerd met een `attempt_key`. Die is **geen geheim**: `LLMS_Quiz_Attempt::get_key()` doet `LLMS_Hasher::hash( $this->get( 'id' ) )`, en `LLMS_Hasher` is een omkeerbare Hashids-achtige obfuscatie met vaste "golden primes" in `includes/class.llms.hasher.php`. Iedereen kan de sleutel van elk poging-id uitrekenen. Tot **10.0.2** kon je daarmee vragen ophalen en beantwoorden zonder de inschrijvingscontrole; sindsdien staat `verify_quiz_access()` ervoor. Een keurig voorbeeld van "een id versleutelen is geen autorisatie".

### 4d. Opslag van antwoorden

De hele poging leeft in één rij van `lifterlms_quiz_attempts`, met de vragen als **PHP-`serialize()` in een `longtext`**:

```php
public function set_questions( $questions = array(), $save = false ) {
    return $this->set( 'questions', serialize( $questions ), $save );
}
```

Dus per poging worden vraag-id, gegeven antwoord, goed/fout en verdiende punten bewaard. Zelfde antipatroon als LearnDash' `answer_data`, alleen in één kolom in plaats van twee tabellen. Indexen: `KEY student_id`, `KEY quiz_id`. Verder heeft de tabel `can_be_resumed` en `current_question_id`, dus een afgebroken poging kan hervat worden, wat LearnDash niet kan.

> **Vergelijk met ons:** onze antwoorden verlaten de browser nooit en er is geen slaagpoort. Het gat uit `docs/openstaand.md` §6 (wie `correct = total` post pakt de bonus) bestaat bij LifterLMS niet, en wel om de goedkoopste denkbare reden: de score wordt nergens gepost. Dat is exact het ontwerp dat hoofdstuk 18 punt 2 ons aanraadt, en het bewijst dat je er geen HMAC-machinerie voor nodig hebt.

---

## 5. Betalingen en inschrijving

### 5a. Wat er in de gratis kern zit, en wat niet

**Wel:** access plans, orders (`llms_order` met een echte statusmachine), transacties (`llms_transaction`), abonnementen met frequentie/looptijd/proefperiode, kortingsbonnen (`llms_coupon`), vouchers met inwisselcodes en een eigen tabel, terugbetalingsadministratie inclusief gedeeltelijke bedragen, retry-schema's voor mislukte incasso's, aankoopbevestigingen, en een volledige lidmaatschapslaag die cursussen doorgeeft.

**Niet:** één enkele werkende betaalprovider. `LLMS_Payment_Gateways::add_core_gateways()` registreert precies één klasse:

```php
public function add_core_gateways( $gateways ) {
    $gateways[] = 'LLMS_Payment_Gateway_Manual';
    return $gateways;
}
```

Een zoektocht naar `stripe` of `paypal` in de hele distributie levert twee JPG's op in `assets/images/addons/`. De abstracte `LLMS_Payment_Gateway` definieert het contract (`handle_pending_order()` is abstract, `handle_recurring_transaction()`, `process_refund()`), en `AGENTS.md` bevestigt dat Stripe, Authorize.Net en de rest uit **private** repo's komen.

> Dit is de eerlijke lezing van "e-commerce in de gratis kern": je krijgt de complete boekhouding gratis en betaalt voor de kassa.

### 5b. Van aankoop naar toegang

De keten (`includes/class-llms-order-generator.php` en `includes/controllers/class.llms.controller.orders.php`):

1. Checkout post `llms_plan_id` plus klantgegevens, met nonce (`_llms_checkout_nonce`, actie `create_pending_order`).
2. `validate_plan()` haalt het plan als post op, controleert `'llms_access_plan' === $plan->get('type')` en `llms_check_access_plan_purchasable()`.
3. `LLMS_Order::init( $user_data, $plan, $gateway, $coupon )` **fotografeert de prijs uit het plan** in de order: `original_total`, `total`, `sale_price`, `trial_total`, en `$this->set( 'currency', get_lifterlms_currency() )`.
4. De gateway verwerkt (of, bij manual, markeert direct betaald bij een €0-plan).
5. Een geslaagde transactie → `transaction_succeeded()` → orderstatus `llms-completed` (eenmalig) of `llms-active` (abonnement).
6. Die status vuurt `lifterlms_order_status_completed` → `complete_order()` → `$order->start_access()` en dan:

```php
llms_enroll_student( $user_id, $product_id, 'order_' . $order_id );
```

**Het bedrag komt nooit uit het verzoek.** Alleen `llms_plan_id` doet dat, en dat is een catalogus-id. Onze regel 1 ("de prijs komt uit onze eigen catalogus") wordt hier structureel afgedwongen door het access-plan-model.

**Wordt bedrag en valuta hercontroleerd tegen de catalogus?** In de gratis kern is dat een niet-vraag: de manual gateway verplaatst geen geld, dus er komt geen bedrag terug om te vergelijken. Het contract van de abstracte gateway kent ook geen verplichte `verify_amount()`-stap; wat de Stripe-add-on doet, kan ik niet lezen. **Dit is het enige punt waarop ik LifterLMS niet kan beoordelen**, en dat is een eerlijker antwoord dan een gunstige aanname.

### 5c. Intrekken bij terugbetaling en mislukte incasso: hier is LifterLMS beter dan LearnDash

Dit is het scherpste verschil van het hele hoofdstuk. `LLMS_Controller_Orders::__construct()` hangt **elke negatieve orderstatus** aan dezelfde afhandeling:

```php
add_action( 'lifterlms_order_status_refunded',       array( $this, 'error_order' ), 10, 1 );
add_action( 'lifterlms_order_status_cancelled',      array( $this, 'error_order' ), 10, 1 );
add_action( 'lifterlms_order_status_expired',        array( $this, 'error_order' ), 10, 1 );
add_action( 'lifterlms_order_status_failed',         array( $this, 'error_order' ), 10, 1 );
add_action( 'lifterlms_order_status_on-hold',        array( $this, 'error_order' ), 10, 1 );
add_action( 'lifterlms_order_status_trash',          array( $this, 'error_order' ), 10, 1 );
add_action( 'lifterlms_order_status_pending-cancel', array( $this, 'pending_cancel_order' ), 10, 1 );
```

en `error_order()` eindigt op:

```php
llms_unenroll_student( $order->get( 'user_id' ), $order->get( 'product_id' ), $status, 'order_' . $order->get( 'id' ) );
```

waarbij `$status` `cancelled` wordt bij terugbetaling/annulering/on-hold/trash en `expired` bij verlopen/mislukt. Mislukte incasso loopt via `transaction_failed()`: kan de order opnieuw geprobeerd worden, dan `maybe_schedule_retry()`, anders `llms-failed` en dus intrekken. `expire_access()` op `llms_access_plan_expiration` trekt in als de looptijd van het plan afloopt.

**Vergelijk expliciet met LearnDash.** Daar zit de intrekking in de gateway-keten: Stripe-abonnementsgebeurtenissen (`invoice.payment_failed`, `customer.subscription.deleted`) trekken toegang in, een losse refund van een eenmalige aankoop deed dat in 4.6.0 niet, en de PayPal-IPN-keten trekt sinds 4.20.1 in bij een bedrag- of valutaverschil. LearnDash regelt intrekking dus **per gateway**; LifterLMS regelt het **één keer, op de orderstatus**, en elke gateway die de status correct zet erft het gedrag. Dat is aantoonbaar het betere ontwerp, en het is precies de vorm die wij ook hebben (status → recht), alleen dan met meer statussen.

**Twee details die je moet kennen voor je dit kopieert:**

1. **De intrekking is gebonden aan de reden van inschrijving.** `LLMS_Student::unenroll( $product_id, $trigger, $new_status )` trekt alleen in als `get_enrollment_trigger( $product_id ) === $trigger`. Iemand die via een lidmaatschap toegang heeft, verliest die niet als een losse order wordt teruggeboekt. **Dit is exact het "`bron` op `entitlements`"-advies uit hoofdstuk 18 punt 1, en het staat hier in de gratis kern.** Let wel op de beperking: `_enrollment_trigger` wordt append-only geschreven en de láátste rij wint, dus het is "laatst geldende reden", geen referentieteller. Twee gelijktijdige redenen (los gekocht én lid) worden niet allebei bijgehouden, en dat is precies het scenario waar hoofdstuk 13 een teller voor aanraadde.
2. **Een gedeeltelijke terugbetaling trekt óók in.** `LLMS_Transaction::record_refund()` zet onvoorwaardelijk `$this->set( 'status', 'llms-txn-refunded' )`, ook bij een deelbedrag, en dat cascadeert naar orderstatus `llms-refunded` en dus naar uitschrijven. Bij ons is de tegenovergestelde keuze bewust gemaakt (gedeeltelijke terugbetaling laat de cursus staan). Als je hun statusmachine overneemt, neem dan niet dit stukje over.

---

## 6. Engagement

De reputatie klopt, met één belangrijke correctie: **er is geen puntensysteem, geen level en geen streak.** Zoeken op `streak` in `includes/` en `templates/` levert nul treffers. Wat er wel is, is een generieke engagement-motor.

### 6a. De engagement-motor: één regeltabel voor alles

`llms_engagement` is een posttype dat zegt: *als trigger X plaatsvindt (eventueel bij post Y), lever dan engagement Z, na N dagen.* De triggers staan in `LLMS_Engagements::get_trigger_hooks()`:

```
lifterlms_access_plan_purchased, lifterlms_course_completed, lifterlms_course_track_completed,
lifterlms_lesson_completed, lifterlms_product_purchased, lifterlms_quiz_completed,
lifterlms_quiz_failed, lifterlms_quiz_passed, lifterlms_section_completed,
lifterlms_user_registered, llms_rest_student_registered,
llms_user_added_to_membership_level, llms_user_enrolled_in_course
```

De drie afleveringen: `handle_email`, `handle_achievement`, `handle_certificate` (`LLMS_Engagement_Handler`). Een vertraging wordt gepland met **`as_schedule_single_action()`**, dus via **Action Scheduler** (`woocommerce/action-scheduler` 3.5.4 in `vendor/`), met een groep-id per engagement zodat `unschedule_delayed_engagements()` bij het verwijderen van de regel netjes opruimt.

> Dat is de belangrijkste technische vondst van dit hoofdstuk voor engagement. LearnDash' Notifications-add-on plant één cron-event voor alleen de eerstvolgende rij en probeert een mislukte verzending nooit opnieuw (hoofdstuk 14, en hoofdstuk 18 punt 21 zegt terecht: niet overnemen). LifterLMS gebruikt de industriestandaard-wachtrij uit WooCommerce, met retries, groepen en een beheerscherm. Dit is de vorm die hoofdstuk 18 punt 6 zoekt.

### 6b. Certificaten en prestaties: uitgereikte exemplaren zijn echte records

Twee lagen, en dat is het goede idee: `llms_certificate` is het **sjabloon**, `llms_my_certificate` is het **uitgereikte exemplaar** als eigen post, met eigen inhoud die op het moment van uitreiking is samengevoegd (`merge_content()`). Hetzelfde voor `llms_achievement` / `llms_my_achievement`. Gevolgen die wij zouden willen:

- **Een doorlopend certificaatnummer.** `sequential_id`, met `update_sequential_id()` en een formatteringsfilter `llms_certificate_sequential_id_format` (voorvoegsel, opvulling). Merge-tag `{sequential_id}`.
- **Deelbaarheid per certificaat.** `is_sharing_enabled()` leest `allow_sharing`; `can_user_view()` is `can_user_manage() || is_sharing_enabled()`. Een certificaat heeft dus een publieke URL zodra de eigenaar dat wil, en anders niet. Dat is de kern van hoofdstuk 18 punt 7 (verificatiepagina), en het kost hen één booleaanse meta.
- **Er is géén PDF-generator in de kern.** Geen TCPDF, geen mPDF, geen dompdf. Certificaten zijn HTML met afmetingen, marges, oriëntatie en lettertypen, bedoeld om te printen. Dat is exact onze eigen keuze (`/cursussen/[slug]/certificaat` is printbaar). PDF is bij LifterLMS een betaalde add-on.
- **Synchronisatie sjabloon → uitgereikt.** `LLMS_Processor_Certificate_Sync` en `LLMS_Processor_Achievement_Sync` kunnen een tekstcorrectie in het sjabloon doorschrijven naar reeds uitgereikte exemplaren, als achtergrondtaak. Dat is de "id's in plaats van uitgeschreven tekst"-les uit hoofdstuk 18 punt 6, hier opgelost als migratie.

### 6c. Notificaties en mail

`lifterlms_notifications` is een eigen tabel met `status`, `type`, `subscriber`, `trigger_id`. Zestien meldingscontrollers in `includes/notifications/controllers/`, elk met een "basic" (op het scherm) en "email" variant, onder andere: `student.welcome`, `enrollment`, `lesson.complete`, `section.complete`, `course.complete`, `course.track.complete`, `quiz.passed`, `quiz.failed`, `quiz.graded`, `purchase.receipt`, `manual.payment.due`, `payment.retry`, `upcoming.payment.reminder`, `subscription.cancelled`, `achievement.earned`, `certificate.earned`.

**LearnDash-kern stuurt geen cursusvoltooiingsmail** (hoofdstuk 5 en 14: dat gat repareert hun eigen add-on). LifterLMS heeft er een, plus een aankoopbevestiging, plus een herinnering vóór de volgende incasso, plus een retry-melding. Dit is waar de reputatie "sterkst in engagement" verdiend is.

### 6d. Gedrag meten

Twee tabellen die LearnDash niet heeft:

- `lifterlms_events` + `lifterlms_events_open_sessions`: een gebeurtenissenlog met `actor_id`, `object_type`, `object_id`, `event_type`, `event_action`. `LLMS_Sessions` sluit inactieve sessies via een cron elke vijf minuten, met een inactiviteitsvenster van 30 minuten (`llms_idle_session_timeout`), en sluit er per run maximaal 50.
- `lifterlms_lesson_time_sessions` (nieuw in 10.1.0): tijd-op-les via heartbeats, met `accumulated_seconds`, `heartbeat_count` en **`flagged_gaps`**. Er zit een plafond op wat één heartbeat mag bijschrijven (`llms_lesson_time_max_credit_per_heartbeat`, standaard 300 seconden bij een interval van 30). Dit voedt de `minimum_time`-instelling per les. Merk op: deze tabel heeft wél samengestelde indexen (`idx_user_lesson`, `idx_user_open`), wat laat zien dat de nieuwere code beter geïndexeerd is dan de oude.

> **Vergelijk met ons:** wij hebben XP, levels, streaks en badges native, en dat heeft LifterLMS niet. Zij hebben de aflever-infrastructuur (wachtrij, sjabloon-versus-exemplaar, doorlopend nummer, deelbaarheid) die wij niet hebben. Dat is een eerlijke ruil en verklaart waarom hun engagement "sterker" heet: het is breder, niet leuker.

---

## 7. Architectuur

**Versie 10.1.0**, GPLv3, PHP ≥ 7.4, WordPress ≥ 5.9.

**Omvang** (gemeten in de gedistribueerde map, `vendor/` uitgesloten):

| | Bestanden | Regels PHP |
|---|---|---|
| `includes/` | 630 | 141.764 |
| `templates/` | 173 | 8.573 |
| `libraries/` (meegeleverde eigen pakketten) | 132 | 29.206 |
| **Totaal PHP zonder `vendor/`** | **842** | **~184.800** |

Plus 156 JS-bestanden in `assets/js/`. Ter oriëntatie: LearnDash 4.6.0's quizmotor alleen al was ~22.000 regels in 72 bestanden, dus dit is een codebase van vergelijkbare orde.

**Naamgeving en autoloading.** `composer.json` declareert PSR-4 (`"LLMS\\": "includes"`), maar dat is grotendeels aspiratie: er zijn **acht** bestanden met een `namespace`, allemaal database-upgraderoutines (`LLMS\Updates\Version_6_0_0` enzovoort). De rest is `LLMS_`-geprefixte klassen die door `includes/class-llms-loader.php` met de hand worden ingeladen. Bestandsnamen lopen door elkaar: `class.llms.student.php` (oud, punten) naast `class-llms-events-core.php` (nieuw, streepjes), en `AGENTS.md` erkent dat expliciet: *"Older files in `includes/models/` use a dot-separated `model.llms.<name>.php` legacy pattern; new files should use the hyphenated form."*

**Geen dependency injection.** Singletons (`llms()`, `LLMS_Trait_Singleton`), statische fabrieken (`llms_get_post()`), en globalen. `$wpdb` wordt overal direct gebruikt. Wel netjes: er is een abstracte querylaag (`LLMS_Abstract_Database_Query`, `LLMS_Abstract_Database_Store`) en de meeste SQL loopt door `$wpdb->prepare()`, met `phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared`-uitzonderingen waar clausules worden samengesteld.

**Uitbreidbaarheid**: 201 `do_action()` en **918 `apply_filters()`** in `includes/`. Dat is de hoofdreden dat §3 zo veel ontsnappingsluiken heeft: filterbaarheid is hier een ontwerpwaarde, ook op autorisatiepaden.

**REST-API zit in de doos**, wat LearnDash niet heeft: `libraries/lifterlms-rest/` levert `/wp-json/llms/v1/` met controllers voor courses, sections, lessons, memberships, access plans, enrollments, students, student progress, instructors, plus **API-keys met eigen authenticatie** (`class-llms-rest-authentication.php`) en **webhooks**. Er zit ook al een `abilities/`-map in (`class-llms-rest-abilities.php`, `class-llms-rest-ability-factory.php`), de WordPress 7.0 Abilities API die MCP voedt. Verder meegeleverd: `lifterlms-blocks` (Gutenberg), `lifterlms-cli` (`wp llms …`), `lifterlms-helper`.

**Tests en buildconfig zitten níét in de zip.** `composer.json` sluit ze expliciet uit via `archive.exclude`: `tests`, `src`, `packages`, `node_modules`, `gulpfile.js`, `*.config.js`, `CHANGELOG.md`. In de repo bestaan ze wel (`tests/phpunit/`, `tests/e2e/` met Playwright) en `composer.json` heeft `scripts.tests` naar PHPUnit plus `lifterlms/lifterlms-tests` en `lifterlms/lifterlms-cs` als dev-dependencies. Runtime-dependencies zijn er precies drie: `composer/installers`, `deliciousbrains/wp-background-processing` 1.0.2 en `woocommerce/action-scheduler` 3.5.4.

**Deprecatieschuld**: 127 treffers op `_deprecated_function`, `_deprecated_hook` of `@deprecated` in `includes/`, plus een heel bestand `includes/functions/llms-functions-deprecated.php` en 23 versiegebonden updatebestanden in `includes/functions/updates/`. Dat is beheerste schuld: het beleid staat in `AGENTS.md` (*"Append, do not reorder. Deprecate, do not replace silently."*) en elke deprecatie draagt een `@since`.

### 7b. De verrassing in de zip: LifterLMS levert AI-agentinstructies mee

In de gedistribueerde plugin staan `AGENTS.md` (181 regels) en `CLAUDE.md`. Dat laatste bestand is één regel lang:

```
@AGENTS.md
```

Precies het patroon dat wij zelf gebruiken. Uit `AGENTS.md`, de sectie "Verification Discipline":

> *"LifterLMS is a mature codebase. Training data on it is often stale. … 1. Code is canonical. Before claiming a function, hook, filter, or class exists, grep `includes/` for it. … 3. Do not fabricate URLs. … 4. Customer assertions are unverified until grepped."*

En een directive over hoe een agent een live site mag aanraken:

> *"when operating against a live LifterLMS site, prefer `wp llms` (with shell access) or the MCP server / REST API (without) over direct database writes or hand-rolled REST clients. The provided interfaces encode access controls, hooks, and side effects that direct writes bypass."*

Er wordt een `gocodebox/lifterlms-mcp` genoemd, gebouwd op de REST-API. Dat is het beeld van waar het WordPress-ecosysteem in 2026 staat: een LMS-leverancier levert zijn agent-onboarding mee in de plugin-zip, inclusief een eerlijke `TODO for the LifterLMS team` over een ontbrekende lijst van uitgefaseerde add-ons.

---

## 8. Beter en slechter dan LearnDash

### Het duidelijkste voordeel: intrekken van toegang is één regel voor alle gateways

LifterLMS heeft één statusmachine op de order, en **elke** negatieve uitkomst (terugbetaald, geannuleerd, verlopen, mislukt, on-hold, verwijderd, plan-verval, mislukte incasso zonder retry) loopt door dezelfde `error_order()` naar `llms_unenroll_student()`. Daar bovenop is de intrekking **gebonden aan de reden van inschrijving**, zodat een lidmaatschap niet sneuvelt door een teruggeboekte losse order.

Bij LearnDash zit intrekking in de gateway-implementaties: het Stripe-pad reageert op abonnementsgebeurtenissen, het PayPal-pad roept sinds 4.20.1 `revoke_access()` aan bij een bedrag/valuta-verschil, en een losse refund liet in 4.6.0 de toegang staan. Elke nieuwe gateway moet het gedrag opnieuw implementeren. Bij LifterLMS erft elke gateway het gratis, want hij hoeft alleen de orderstatus goed te zetten. Dat is niet "meer features", dat is een betere plek voor dezelfde regel.

**Bewijs:** `includes/controllers/class.llms.controller.orders.php` regels 63 t/m 74 (de zeven `add_action`-registraties) en regel 180 t/m 229 (`error_order()`), tegenover `includes/payments/gateways/class-learndash-stripe-gateway.php` en `…-paypal-ipn-gateway.php` bij LearnDash.

### De duidelijkste zwakte: de toegangspoort denkt in pagina's, niet in data

`llms_page_restricted()` beslist op basis van `is_singular()`, `is_home()` en `is_search()`. Dat is niet af te doen als stijl: LifterLMS moet zijn eigen functie **voorliegen** om REST-antwoorden af te schermen (`$query->is_singular = true;` in `LLMS_Template_Loader::maybe_restrict_post_content()`), en de gaten die dit oplevert zijn ook echt gevallen: `verify_quiz_access()` is er pas sinds 10.0.2, ná een authorization bypass via de raadbare `attempt_key`. Daar komt bovenop dat de uitkomst via `llms_page_restricted`, `llms_force_php_template_loading` en `llms_get_post_content` te overrulen is, en dat LifterLMS de tweede zelf uitzet in zijn blokthema-pad.

LearnDash heeft hier hetzelfde grondprobleem (render-only bescherming via `the_content`), maar `sfwd_lms_has_access()` is tenminste een pure functie van gebruiker en cursus: hij vraagt niet aan WordPress welke pagina er toevallig getoond wordt.

### Kort, de rest van de balans

| | LifterLMS 10.1.0 | LearnDash 5.x |
|---|---|---|
| Voortgangsopslag | eigen tabel, canoniek, usermeta-cache eroverheen | geserialiseerd usermeta canoniek + activity-tabel als spiegel |
| Indexen op de voortgangstabel | 2 enkelkolomse | 9 enkelkolomse, geen unieke sleutel |
| Quizgrading | volledig server-side, score reist nooit mee | server-side met nonce-ondertekende tussenresultaten |
| Correcte antwoorden in de HTML | nooit opgebouwd | opgebouwd en er weer uit gestript |
| Verkoopmodel | access plans, abonnementen, vouchers, kortingen in de kern | via WooCommerce/Stripe-add-ons |
| Betaalprovider in gratis kern | geen (alleen handmatig) | n.v.t. (LearnDash is sowieso betaald) |
| Mail bij cursusvoltooiing | in de kern | add-on |
| Wachtrij voor uitgestelde mail | Action Scheduler | eigen cron-event, één rij per run |
| REST-API | meegeleverd, met API-keys en webhooks | niet in de kern |
| Namespaces / PSR-4 | gedeclareerd, 8 bestanden gebruiken het | geen |

---

## Wat wij hiervan zouden lenen

Vier dingen, in volgorde van waarde gedeeld door bouwkosten. Twee ervan bevestigen een advies dat al in hoofdstuk 18 stond; dat maakt ze sterker, niet overbodig.

1. **De reden van toekenning op `entitlements`, precies zoals `_enrollment_trigger` (§5c).** Hoofdstuk 18 punt 1 raadde dit al aan op grond van LearnDash-add-ons. Nu blijkt de directe concurrent het **in de gratis kern** te hebben, met de intrekking eraan gekoppeld (`unenroll()` doet niets als de reden niet klopt). Neem de vorm over, maar **niet** hun beperking: zij houden alleen de laatst geschreven reden bij, dus twee gelijktijdige redenen (los gekocht én College+) verdwijnen tegen elkaar weg. Wij hebben een echte kolom en kunnen een set of teller bijhouden. Dit is nog steeds het eerste dat vóór de eerste abonnee moet gebeuren.

2. **De statusmachine als enige plek waar toegang wordt ingetrokken (§5c).** Wij hebben nu de intrekking bij chargeback en volledige terugbetaling in de Mollie-webhook zitten. Het patroon van LifterLMS is beter: de webhook zet alleen de *status* van de betaalpoging, en één plek vertaalt "elke terminale negatieve status" naar "recht intrekken". Dan hoeft een tweede betaalmethode of een handmatige annulering vanuit `/beheer` dat gedrag niet opnieuw te implementeren. Neem hun keuze rond gedeeltelijke terugbetaling **niet** over: die is bij hen onbedoeld hard.

3. **Certificaatsjabloon en uitgereikt certificaat scheiden, met een doorlopend nummer en een deelvlag (§6b).** Dit is drie kleine dingen in één beweging. Ons certificaat wordt nu bij elk bezoek uit de huidige content opgebouwd; een uitgereikt exemplaar als eigen rij geeft ons (a) een verifieerbaar nummer, (b) een bewijs dát en wannéér het is verdiend, onafhankelijk van latere tekstwijzigingen, en (c) een publieke deel-URL die de eigenaar zelf aanzet. Dat dekt hoofdstuk 18 punten 7 en 10 samen. Hun sync-processor is het antwoord op het bezwaar "maar dan lopen oude certificaten achter op tekstcorrecties".

4. **Eén gratis proefles per betaalde cursus, en verkooppagina in plaats van slotscherm (§1, §3b).** LifterLMS heeft `$lesson->is_free()` als eerste tak in de toegangspoort, en vervangt vergrendelde cursusinhoud door `llms_get_post_sales_page_content()` in plaats van door een slot. Dat is hoofdstuk 18 punt 8 plus onze eigen SEO-huisregel ("stuur niemand naar een pagina die op slot zit"), en het kost bij ons één veld op `Lesson` en één tak in de lespagina.

**En wat we bewust níét overnemen:** de vier filterhaken waarmee hun toegangscontrole uit te zetten is, de per-les-query in de voortgangsberekening, en het idee dat een geobfusceerd id (`LLMS_Hasher`) een autorisatiemiddel is.

---

## Onzekerheden

- **Dit is de gratis kern, en de belangrijkste betaalcode zit er niet in.** Of de Stripe-add-on bedrag en valuta hercontroleert tegen het access plan kan ik niet vaststellen: die repo is privé. Mijn conclusie in §5 gaat over de *structuur* (prijs komt uit de catalogus, intrekking hangt aan de orderstatus), niet over de gateway-verificatie zelf. Behandel elke vergelijking met onze Mollie-regel op dat punt als onbeantwoord, niet als gunstig.
- **De prestatie-uitspraken in §2 komen uit de codevorm** (indexdefinities, lussen, de vorm van de rapportagequery) en uit LifterLMS' eigen throttle-constante, **niet uit een `EXPLAIN` op een echte dataset**. Het getal 500 is hun grens voor het herberekenen van cursusgemiddelden; het is geen gemeten omslagpunt voor de hele installatie, en ik heb het niet tegen 2.000 kunnen afzetten met echte data. Wat ik met zekerheid zeg is dat het mechanisme in de claim van hoofdstuk 7 ("postmeta") niet klopt.
- **Ik heb het gelukkige pad gevolgd.** Niet uitputtend nagelopen: de lidmaatschapscascade (`remove_membership_level()` bij het intrekken van een lidmaatschap), voucher-inwisseling, de `pending-cancel`-status, proefperiodes met kortingsbonnen, en het gedrag bij een gedeeltelijke terugbetaling gevolgd door een tweede.
- **De block-editor-kant is niet gelezen.** `libraries/lifterlms-blocks` en `blocks/` heb ik alleen als aanwezigheid vastgesteld. Als daar een tweede renderpad voor lesinhoud in zit, kan dat een extra ontsnappingsroute langs §3 zijn; ik weet het niet.
- **De REST-API heb ik alleen op leesrechten voor lessen gecontroleerd** (`check_read_permission` → schrijfrecht vereist). De endpoints voor `students-progress` en `enrollments` heb ik niet op autorisatie doorgelicht, en dat zijn nu juist de schrijfpaden.
- **Regelnummers gelden voor 10.1.0.** Deze codebase beweegt snel (`verify_quiz_access` is van 10.0.2, `get_content_restriction_skip_post_types` en de lesson-time-tabel van 10.1.0), dus behandel dit als een momentopname van 5 augustus 2026.
