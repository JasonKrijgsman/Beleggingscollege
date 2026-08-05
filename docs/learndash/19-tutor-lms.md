# 19 — Tutor LMS: dezelfde acht vragen, een heel ander antwoord

> Dit hoofdstuk leest de **gratis wordpress.org-versie van Tutor LMS, v4.0.4** (Themeum), vandaag gedownload. De plugin staat onder **GPLv2 or later**, dus anders dan bij LearnDash mogen we hier vrij uit citeren. Geschreven **5 augustus 2026**. Alle bestandspaden zijn relatief aan de plugin-root (`tutor/`).
>
> De headerregels die ertoe doen: `Version: 4.0.4`, `Requires PHP: 7.4`, `Requires at least: 5.3`, `Tested up to: 7.0`, `Text Domain: tutor`.
>
> **Lees dit naast hoofdstuk 10, 11 en 18.** Ik beschrijf LearnDash hier niet opnieuw; ik beantwoord dezelfde acht vragen voor Tutor, zodat je de twee regel voor regel naast elkaar kunt leggen. Waar het raakt aan onze eigen keuzes staat er een korte "Vergelijk met ons".
>
> Eén ding vooraf, want het kleurt alles wat volgt: de gratis Tutor is **geen afgeknepen demo**. Er zit een complete eigen webshop in (winkelwagen, orders, kortingscodes, btw, PayPal, terugbetalingen, instructeursuitbetalingen). Wat er *niet* in zit is precies de didactische laag: certificaten, cijferlijst, e-mailautomatisering, drip, prerequisites. Dat is een prijsstrategie, geen technische grens, en je ziet hem terug in elk antwoord hieronder.

---

## 1. Contentmodel

Tutor gebruikt **WordPress-posttypes voor de structuur en eigen tabellen voor de quiz en de winkel**. Geen geserialiseerde stappen-blob zoals LearnDash' `ld_course_steps`.

De posttypes staan als één lijst in `classes/Config.php` (regel 84-97), elk achter een filter:

| Slug | Rol | Geregistreerd in |
|---|---|---|
| `courses` | cursus | `classes/Post_types.php:143` |
| `topics` | module, `public => false` | `:359` |
| `lesson` | les | `:280` |
| `tutor_quiz` | quiz | `:337` |
| `tutor_assignments` | opdracht (feature is Pro) | `:416` |
| `tutor_enrolled` | **inschrijving** | `:513` |

De hiërarchie is **twee niveaus diep via `post_parent`**: een `topics`-post hangt aan de cursus, en `lesson`/`tutor_quiz` hangen aan de topic. Je ziet het letterlijk in de join van `get_course_contents_by_id()` (`classes/Utils.php:6834`):

```sql
FROM {$wpdb->posts} topic
INNER JOIN {$wpdb->posts} items ON topic.ID = items.post_parent
WHERE topic.post_parent = %d AND items.post_status = 'publish'
```

**Lesinhoud leeft in `wp_posts.post_content` van de `lesson`-post.** Verder niets bijzonders: video in postmeta `_video`, bijlagen apart. Twee dingen die je moet weten:

- Het lesposttype is geregistreerd met `'public' => true` en `'publicly_queryable' => true`. Dat is bewust (permalinks), maar het betekent dat de rauwe lesinhoud een gewone, opvraagbare WordPress-post is. Zie §3.
- `'show_in_rest' => true` wordt **alleen** gezet als de optie `enable_gutenberg_course_edit` aanstaat (`Post_types.php:275-278`). Staat die aan, dan bedient WordPress' eigen `/wp-json/wp/v2/`-controller die lessen, en die kent de Tutor-toegangspoort niet.

De negende tot en met vijftiende tabel gaan over quiz en winkel. Alle vijftien worden aangelegd in één functie, `Tutor::create_database()` (`classes/Tutor.php:771-1057`), via `dbDelta()`:

`tutor_quiz_attempts`, `tutor_quiz_attempt_answers`, `tutor_quiz_questions`, `tutor_quiz_question_answers`, `tutor_earnings`, `tutor_withdraws`, `tutor_orders`, `tutor_ordermeta`, `tutor_order_items`, `tutor_coupons`, `tutor_coupon_applications`, `tutor_coupon_usages`, `tutor_carts`, `tutor_cart_items`, `tutor_customers`.

Wat daaraan opvalt en wat LearnDash niet doet: **echte foreign keys met `ON DELETE CASCADE`**.

```sql
CONSTRAINT fk_tutor_ordermeta_order_id FOREIGN KEY (order_id)
  REFERENCES {$wpdb->prefix}tutor_orders(id) ON DELETE CASCADE
```

Dat staat er zes keer (ordermeta, order_items, coupon_applications, coupon_usages ×2, carts, cart_items). Een WordPress-plugin die referentiële integriteit aan de database overlaat in plaats van aan PHP is zeldzaam. En `tutor_coupons` heeft een echte `UNIQUE KEY coupon_code`.

De quizvragen zijn genormaliseerd, niet geserialiseerd: `tutor_quiz_questions` (één rij per vraag) en `tutor_quiz_question_answers` (één rij per antwoordoptie, met `is_correct tinyint(4)`). Dat is een categorisch beter model dan LearnDash' `serialize()`-blob in `quiz_question.answer_data`, en er is dan ook geen `learndash_recount_serialized_bytes()`-achtige reparatiefunctie nodig. Alleen `question_settings` en `answer_settings` zijn nog geserialiseerde tekstkolommen.

> **Vergelijk met ons:** onze content is getypte TypeScript in `src/content/`, gecontroleerd tijdens de build. Tutor's model is het beste dat je binnen WordPress kunt bouwen zonder de posttabel te verlaten, maar het blijft runtime-data zonder schemacontrole.

---

## 2. Voortgangsopslag

Dit is het punt waar Tutor het scherpst afwijkt van LearnDash. **Er is geen spiegel en geen cache-veld.** Voortgang is nergens opgeteld opgeslagen; hij wordt bij elk verzoek opnieuw berekend uit drie primaire bronnen.

### Waar het staat

- **Les af** = één usermeta-rij per les: `_tutor_completed_lesson_id_{lesson_id}` met een tijdstempel als waarde. Schrijven doet `LessonModel::mark_lesson_complete()` (`models/LessonModel.php:145`), één regel:
  ```php
  update_user_meta( $user_id, '_tutor_completed_lesson_id_' . $post_id, tutor_time() );
  ```
  Lezen doet `Utils::is_completed_lesson()` (`classes/Utils.php:1850`), spiegelbeeldig.
- **Quiz af** = een rij in `tutor_quiz_attempts` met `attempt_status != 'attempt_started'`.
- **Opdracht af** = een `comments`-rij (Pro-feature, maar de telling zit in de gratis code).
- **Cursus af** = een rij in **`wp_comments`** met `comment_type = 'course_completed'` en `comment_agent = 'TutorLMSPlugin'`, geschreven door `CourseModel::mark_course_as_completed()` (`models/CourseModel.php:426`). De `comment_content` is een 16-tekens hash die dient als certificaat-identificatie; de code draait een `do/while` om te garanderen dat die hash uniek is.
- **Videopositie** is de enige geserialiseerde blob: usermeta `_lesson_reading_info`, een array `[lesson_id][key] => value` (`LessonModel:104-133`).

De comments-tabel als voltooiingslogboek is eigenaardig maar niet dom: je krijgt gratis een tijdstempel, een user_id, een post_id en een index. De prijs is dat cursusvoltooiingen tussen echte reacties staan, en dat elke plugin die "verwijder alle spam-reacties" doet potentieel je diploma's opruimt.

### Één bron van waarheid, en dat is de kernwinst

`get_course_completed_percent()` (`Utils.php:808`) telt bij elke aanroep opnieuw:

1. `get_completed_lesson_count_by_course()` bouwt de lijst meta-keys (`_tutor_completed_lesson_id_{id}` voor elke les in de cursus) en doet één `COUNT` op `usermeta` met een `IN`-clausule;
2. één `SELECT count(DISTINCT quiz_id)` op `tutor_quiz_attempts`;
3. een lus over de opdrachten.

Er is **geen `completed`/`total`-cacheveld** zoals LearnDash dat in `_sfwd-course_progress` bijhoudt. Dat betekent: geen invalidatieprobleem, geen spiegel die kan wegdrijven, geen "voortgang staat op 11 van 12 maar alle lessen zijn af". De prijs staat in dezelfde functie: drie tot vier query's per paginaweergave, gedempt door `TutorCache` (`cache/TutorCache.php`), een **per-request** array-cache. Dus per verzoek goedkoop, per verzoek opnieuw duur.

### Transacties

Voortgangsschrijfacties zijn **niet** transactioneel, maar dat maakt hier minder uit dan bij LearnDash, want er is per gebeurtenis maar één schrijfactie. Eén les afvinken = één `update_user_meta`. Eén cursus afronden = één `$wpdb->insert` in `comments`. Er zijn geen twee plaatsen die uit elkaar kunnen lopen.

Waar Tutor wél echte transacties gebruikt is de winkel: `OrderModel::create_order()` (`models/OrderModel.php:397`) draait `START TRANSACTION` / `COMMIT` / `ROLLBACK` rond de order plus zijn regels. Datzelfde patroon staat in `Instructor.php`, `Student.php` en `QuizBuilder.php`. Dat is meer transactiediscipline dan LearnDash op enig punt laat zien.

**Eén echt gat.** `mark_course_as_completed()` doet geen enkele "bestaat dit al"-controle voordat hij insert. De bescherming zit in de aanroepers: `can_autocomplete_course()` (`CourseModel.php:825`) checkt eerst `is_completed_course()`. Dat is een controle-daarna-schrijf zonder unieke sleutel, dus twee gelijktijdige verzoeken kunnen twee `course_completed`-rijen opleveren. Er is geen `UNIQUE(comment_post_ID, user_id, comment_type)` die dat tegenhoudt. Zelfde klasse fout als LearnDash' ontbrekende unique key op `learndash_user_activity`, alleen op een andere tabel.

En dan het lelijkste detail: **de autocomplete-schrijfactie staat in een templatebestand.** `templates/single/common/header.php:33` en `templates/learning-area/index.php:88`:

```php
if ( CourseModel::can_autocomplete_course( $course_id, $user_id ) ) {
    CourseModel::mark_course_as_completed( $course_id, $user_id );
```

Een view die de database muteert, in twee bestanden die een theme mag overschrijven. Overschrijf je `header.php` in je child theme (wat de hele templatemap uitnodigt), dan verdwijnt automatische cursusvoltooiing zonder foutmelding.

> **Vergelijk met ons:** wij hebben één muterend pad (`completeLesson()` → `verwerkLes()`) dat de delta atomair optelt, en `total` komt uit de catalogus zonder query. Tutor heeft de betere *garantie* (niets om te desynchroniseren) en de slechtere *plaats* (twee templatebestanden schrijven naar de database).

---

## 3. Toegangscontrole

**Kort antwoord: nee, er is geen enkele poort. Er zijn er drie, ze zijn het niet eens, en de hele bescherming kan met één filter uitgezet worden.**

### De drie poorten

**a. `Utils::has_enrolled_content_access( $content, $object_id, $user_id )`** (`classes/Utils.php:7599`). Dit is de functie die het meeste lijkt op `heeftToegangTot()`. Hij is dun en leesbaar:

```php
if ( EnrollmentModel::is_enrolled( $course_id, $user_id )
     || $this->has_user_course_content_access( $user_id, $course_id ) ) {
    return true;
}
```

Negen aanroepen in de hele plugin. De onderliggende `EnrollmentModel::is_enrolled()` (`models/EnrollmentModel.php:171`) doet één query op `wp_posts`: `post_type = 'tutor_enrolled' AND post_parent = {course} AND post_author = {user} AND post_status = 'completed'`. **Inschrijving is dus een post, en toegang is het bestaan van die post met status `completed`.** Dat is bijna precies onze `entitlements`-rij met status `actief`, alleen dan in de posttabel.

**b. `CourseModel::has_course_content_access( array $args )`** (`models/CourseModel.php:1507`). Dit is sinds 4.0 de poort voor de nieuwe "learning area", en hij wordt aangeroepen **vanuit een templatebestand** (`templates/learning-area/index.php:106`). Hij beslist per posttype en valt intern soms terug op poort a.

**c. `QuizModel::has_quiz_access( $quiz_id, $course_id, $wp_die )`** (`models/QuizModel.php:1742`), die `wp_die()` doet als het niet mag.

### Waar ze het oneens zijn

Alle drie kennen een "openbare cursus"-uitzondering op basis van de postmeta `_tutor_is_public_course`, maar ze passen hem verschillend toe:

| Plek | Voorwaarde voor gratis toegang |
|---|---|
| `Template::load_single_lesson_template` (`Template.php:243`) | `is_public` **én** `! is_course_purchasable()` |
| `CourseModel::has_course_content_access` (`:1531`) | `is_public` alleen |
| `QuizModel::has_quiz_access` (`:1747`) | `Course_List::is_public()` alleen, vóór elke andere check |
| `Lesson::tutor_render_lesson_content` (`Lesson.php:646`) | `is_public` alleen |

Zet een **betaalde** cursus op "public" en de legacy lespagina blijft op slot, terwijl de quiz, de AJAX-lesrenderer en de nieuwe learning area hem vrijgeven. Dat is geen theoretisch verschil, dat zijn vier codepaden die dezelfde vraag anders beantwoorden. LearnDash had één bedoelde poort met een `consolidate`-TODO; Tutor heeft er drie zonder TODO.

### Hoe betaalde content feitelijk beschermd wordt

**Niet met een `the_content`-filter zoals LearnDash, en niet op queryniveau. Tutor wisselt het hele template om.** In `classes/Template.php`:

```php
add_filter( 'template_include', array( $this, 'load_single_course_template' ), 99 );
add_filter( 'tutor_single_content_template', array( $this, 'load_single_lesson_template' ), 99, 2 );
add_filter( 'template_include', array( $this, 'load_learning_template' ) );
```

en dan in `load_single_lesson_template()` (regel 229-238):

```php
if ( is_user_logged_in() ) {
    $has_content_access = tutor_utils()->has_enrolled_content_access( 'lesson' );
    $template = $has_content_access
        ? tutor_get_template( 'single-lesson' )
        : tutor_get_template( 'single.lesson.required-enroll' );
} else {
    $template = tutor_get_template( 'login' );
}
```

Dit is een graad beter dan LearnDash' render-tijdfilter: er wordt geen content geladen en daarna weggeknipt, er wordt een ánder bestand ingeladen dat de content nooit aanraakt. Maar het blijft **presentatielaag-autorisatie**. De lespost staat gepubliceerd en `publicly_queryable` in de database, en elk pad dat `template_include` niet doorloopt, ziet hem gewoon.

### Kan een plugin of filter de bescherming uitzetten?

**Ja, op minstens drie manieren, waarvan de eerste alles in één klap uitschakelt.**

1. **De hele Template-klasse is optioneel.** Regels 47-50, letterlijk het eerste wat de constructor doet:
   ```php
   $template_override = apply_filters( 'tutor_lms_should_template_override', true );
   if ( ! $template_override ) {
       return;
   }
   ```
   Geeft één plugin `false` terug op dat filter, dan worden **geen van de `template_include`-hooks geregistreerd**. Er is geen tweede lijn: `add_filter( 'the_content', ... )` staat in Tutor alleen voor het dashboard (`convert_static_page_to_template`), niet voor lessen. Het thema rendert dan zijn eigen `single-lesson.php` of `single.php`, en dat toont `the_content()` van een gepubliceerde post. De volledige lesinhoud, aan iedereen. Het filter bestaat voor paginabouwers zoals Oxygen; het commentaar erboven zegt dat ook. Precies de valkuil die hoofdstuk 18 punt 28 bij LearnDash beschreef, hier in een grovere vorm: bij LearnDash zet je één filter uit, hier zet je de hele beschermingslaag uit.
2. **Elke poort heeft zijn eigen escape.** `apply_filters( 'tutor_course_content_access', $has_access, $args )` (`CourseModel.php:1553`), `apply_filters( 'tutor_is_enrolled', $get_enrolled_info, ... )` (`EnrollmentModel.php:221`), `apply_filters( 'tutor_lesson_template', $template )` (`Template.php:247`), `apply_filters( 'tutor_is_lesson_post_type', true, $post_type )` (`:221`). Stuk voor stuk beleefd opzij te zetten.
3. **De REST-route.** Staat `enable_gutenberg_course_edit` aan, dan is `lesson` `show_in_rest`, en WordPress' eigen posts-controller serveert gepubliceerde posts aan iedereen. Tutor's eigen REST-API (`classes/RestAPI.php`, namespace `tutor/v1`) is wél afgeschermd, met een API-key/secret via Basic auth (`restapi/RestAuth.php:305`), maar boven de generieke permissiecheck staat `@todo will remove and prevent by capability where needed` (`RestAPI.php:125`).

> **Vergelijk met ons:** `heeftToegangTot()` is `server-only`, er is geen filter die hem omzeilt, en de build faalt als iemand `@/content` de browserbundel in sleept. Dat verschil is niet stilistisch. Bij Tutor is de grens een afspraak tussen plugins; bij ons is het een grens die de compiler afdwingt.

---

## 4. Quizmotor

Hier draait de vergelijking om, en op een manier die je niet verwacht. **Tutor is strenger dan LearnDash op de score en veel losser op de antwoorden.**

### Worden de juiste antwoorden naar de browser gestuurd?

**Ja. Onvoorwaardelijk, op elke quizpoging, alleen hex-gecodeerd.**

Onderaan `templates/learning-area/quiz/attempt.php` (regel 411-413) staat:

```php
<script type="application/octet-stream" id="tutor-quiz-context">
	<?php echo esc_html( bin2hex( wp_json_encode( $quiz_answers ) ) ); ?>
</script>
```

En `$quiz_answers` is hierboven, op regel 72-85, gevuld met de `answer_id`'s waarvoor `is_correct` waar is, voor elke true/false-, single-choice- en multiple-choice-vraag in de poging:

```php
$reveal_question_types = array( 'true_false', 'single_choice', 'multiple_choice' );
foreach ( $questions as $question ) {
    if ( ! in_array( $question->question_type, $reveal_question_types, true ) ) continue;
    $answers = QuizModel::get_answers_by_quiz_question( $question->question_id );
    foreach ( $answers as $answer ) {
        if ( ! empty( $answer->is_correct ) ) { $quiz_answers[] = $answer->answer_id; }
    }
}
```

Let op wat er **niet** staat: er is geen `if ( $enable_answer_reveal )` om dit blok heen, en ook niet om het script-element. De instelling stuurt alleen of de JavaScript de gegevens *gebruikt* (`getRevealAnswerIds()` in `assets/js/tutor-learning-area.js`, dat de hex terugleest met `String.fromCharCode(parseInt(x, 16))`). De gegevens staan er hoe dan ook.

`bin2hex()` is geen versleuteling, het is een andere schrijfwijze. Eén regel in de console van de browser en je hebt de sleutel van de hele toets in handen.

Dit is de exacte tegenpool van LearnDash. Daar strip `WpProQuiz_View_FrontQuiz` `correct` en `points` bewust uit de ingebedde json vóórdat de pagina de deur uit gaat (hoofdstuk 11, §4a) en beoordeelt de server elk antwoord via een AJAX-heenreis. Tutor stuurt ze mee en verstopt ze.

### Is de beoordeling server-side?

**Volledig, en zonder enige uitzondering.** `Quiz::manage_attempt_answers()` (`classes/Quiz.php:751-1004`) is de enige plek waar een antwoord goed of fout wordt. Voor elk vraagtype haalt de server de waarheid uit de tabel:

```php
$is_answer_was_correct = (bool) $wpdb->get_var( $wpdb->prepare(
    "SELECT is_correct FROM {$wpdb->prefix}tutor_quiz_question_answers WHERE answer_id = %d",
    $answers
) );
```

Multiple choice vergelijkt de ingezonden set met `SELECT answer_id ... WHERE is_correct = 1` via een `array_diff` plus een telling; fill-in-the-blank vergelijkt hoofdletterongevoelig met `answer_two_gap_match`; ordening en matching vergelijken de geserialiseerde volgorde met `ORDER BY answer_order ASC`. Open vragen en korte antwoorden krijgen `is_correct = null` en zetten de poging op `review_required`.

En dan de zin die het hele verschil met LearnDash maakt (regel 952):

```php
$question_mark = $is_answer_was_correct ? $question->question_mark : 0;
$total_marks  += $question_mark;
```

**De behaalde punten komen uit de vragentabel, niet uit het verzoek.** De client stuurt uitsluitend gekozen `answer_id`'s. Er is dus geen ingezonden score om te verifiëren, en daarom heeft Tutor **geen nonce-ondertekening zoals LearnDash' `p_nonce`/`a_nonce` nodig** en heeft hij die ook niet. Waar LearnDash een handtekeningmechanisme bouwde om een client-berekende score achteraf te kunnen wantrouwen, heeft Tutor die score simpelweg nooit gevraagd. Dat is het eenvoudigere en het sterkere ontwerp.

De poort eromheen: `tutor_quiz_attempt_submit()` (`:705`) eist ingelogd zijn, `tutor_utils()->checking_nonce()`, `validate_attempt( $attempt_id, $user_id )` (de poging moet van deze gebruiker zijn) en `QuizModel::has_quiz_access( $quiz_id )`.

### Wordt de score opnieuw gecontroleerd? En waar zit dan wél het gat?

De teller is onaantastbaar. **De noemer niet.** Regel 767-794:

```php
$question_ids = tutor_utils()->avalue_dot( 'quiz_question_ids', $attempt_answer );
...
$query = $wpdb->prepare( "SELECT SUM(question_mark) FROM {$wpdb->prefix}tutor_quiz_questions
                          WHERE 1 = %d AND question_id IN({$question_ids_string});", 1 );
$total_question_marks = $wpdb->get_var( $query );
$wpdb->update( $wpdb->prefix . 'tutor_quiz_attempts',
               array( 'total_marks' => $total_question_marks ), array( 'attempt_id' => $attempt_id ) );
```

`quiz_question_ids` komt uit de payload. In het formulier is het een verborgen veld (`templates/learning-area/quiz/attempt.php:108`, en in de legacy-variant letterlijk `<input type='hidden' name='attempt[..][quiz_question_ids][]' ...>` in `templates/single/quiz/parts/question.php:81`). Het maximum van de poging wordt dus bepaald door wat de browser zegt dat de vragen waren.

Slaag/zak volgt daaruit: `QuizModel::prepare_attempt_result()` (`:1643`) vergelijkt `calculate_attempt_earned_percentage( $attempt )` met de `passing_grade`. Wie één vraag goed beantwoordt en alleen díé vraag-id meestuurt in `quiz_question_ids`, haalt 100 procent. Er zit geen controle in dat de ingezonden id's de vragen van deze quiz zijn, laat staan álle vragen van deze poging.

Dat is dus het spiegelbeeld van ons eigen openstaande punt (`docs/openstaand.md` §6): bij ons komt `total` uit de catalogus en `correct` uit de client; bij Tutor komt `correct` uit de database en `total` uit de client. Beide systemen hebben één helft server-authoritatief en één helft niet. Alleen: bij ons kost dat een XP-bonus en een badge, bij Tutor ontgrendelt het een cursuscertificaat.

Twee dingen die Tutor wél goed doet en die het noemen waard zijn: de antwoordvolgorde wordt server-side geschud met `ORDER BY RAND()` (`QuizModel::get_answers_by_quiz_question`, `:935`), dus de juiste volgorde lekt niet via de DOM-volgorde; en `is_correct` komt in geen van de zeven vraagtemplates in `templates/learning-area/quiz/questions/` in de HTML terecht (in de legacy-templates wordt hij in een lokale variabele `$quiz_answers` gezet die nergens meer gebruikt wordt, dode code zonder lek).

Per poging worden `attempt_ip` en per vraag het gegeven antwoord bewaard (`tutor_quiz_attempt_answers.given_answer`). Tutor bewaart dus meer over de cursist dan LearnDash, en veel meer dan wij.

> **Vergelijk met ons:** wij graden client-side en sturen alleen een telling. Tutor's `manage_attempt_answers()` is precies de vorm die hoofdstuk 18 punt 2 ons aanraadt: de client stuurt de gekozen indexen, de server kijkt na tegen data die hij zelf al heeft. Bij ons is dat nog goedkoper dan bij hen, want onze vragen staan al achter `server-only` in `src/content`. Neem de vorm over, en neem hun fout niet over: de noemer komt uit de catalogus, nooit uit het verzoek.

---

## 5. Betalingen en inschrijving

De gratis Tutor heeft **vier verkoopmodellen naast elkaar** (`monetize_by`): de eigen Tutor-webshop, WooCommerce (`classes/WooCommerce.php`), Easy Digital Downloads (`classes/TutorEDD.php`) en Paid Memberships Pro (via addon). Hier beschrijf ik de eigen shop, want die is nieuw sinds 3.0 en het meest vergelijkbaar met onze Mollie-keten.

### Van aankoop naar toegang

De prijs komt uit onze eigen catalogus, en dat is hier goed geregeld. `CheckoutController::prepare_items()` (`ecommerce/CheckoutController.php:266-291`):

```php
$course_price  = tutor_utils()->get_raw_course_price( $item_id );
$regular_price = $course_price->regular_price;
$sale_price    = $course_price->sale_price;
```

De klant stuurt item-id's, geen bedragen. Kortingscodes worden server-side toegepast als een gecontroleerde transformatie op die prijs, precies zoals hoofdstuk 18 punt 14 het formuleert. De order wordt in een echte transactie weggeschreven (`OrderModel::create_order()`).

De webhook is een publieke REST-route: `tutor/v1/ecommerce-webhook/{payment_method}` met `'permission_callback' => '__return_true'` (`ecommerce/PaymentHandler.php:42-50`). Publiek is correct, want de authenticiteit komt uit de handtekening. Voor PayPal doet `Api::webhook_signature_validation()` (`ecommerce/PaymentGateways/Paypal/src/Payments/Paypal/Api.php:146`) een serverzijdige oproep naar PayPal's `/v1/notifications/verify-webhook-signature` met de vijf `PAYPAL-*`-headers en het geconfigureerde `webhook_id`, en accepteert alleen `verification_status === 'SUCCESS'`. Dat is de tegenhanger van onze "geloof niets uit de payload behalve het id" en van LearnDash' `events->retrieve`: even sterk, andere techniek.

Daarna gaat het via `do_action( 'tutor_order_payment_updated', $res )` naar `HooksHandler::handle_payment_updated_webhook()` (`ecommerce/HooksHandler.php:188`) en vervolgens `manage_earnings_and_enrollments()` (`:329`), die per orderregel de `tutor_enrolled`-post op `completed` zet of er een aanmaakt via `EnrollmentModel::do_enroll()`.

Netjes detail dat wij ook hebben: `do_enroll()` zet zélf de status op `pending` als de cursus betaald is (`EnrollmentModel.php:93-95`), ongeacht wie hem aanroept. De gratis-inschrijfroute `Course::enroll_now()` (`classes/Course.php:2122`) draagt een openhartige `TODO: need to check purchase information` op regel 2139 en doet dus geen eigen prijscontrole; dat de gebruiker daar geen betaalde cursus mee ontgrendelt, komt puur doordat `do_enroll` de status op `pending` zet. De verdediging staat op de goede plek, maar er staat maar één laag.

### Wordt bedrag en valuta gecontroleerd tegen de catalogusprijs?

**Nee.** `Paypal::setReturnData()` (`Paypal.php:241-262`) bouwt het retourobject op uit de webhook-payload:

```php
$returnData->id             = $transactionInfo->custom_id;   // ons order-id
$returnData->payment_status = $statusMap[ $transactionInfo->status ];
$returnData->transaction_id = $transactionInfo->id;
$returnData->fees           = ...->paypal_fee->value ?? null;
$returnData->earnings       = ...->net_amount->value ?? null;
```

Het betaalde bedrag en de valuta staan in dezelfde `resource`, maar worden nergens vergeleken met `tutor_orders.total_price` of met de ingestelde winkelvaluta. `handle_payment_updated_webhook()` zet de order op `paid` en `completed` zodra de status dat zegt.

Dat is verdedigbaar zolang PayPal het bedrag server-side uit de order haalt (net als bij Stripe in LearnDash, waar de hercontrole ook ontbreekt en dat geen gat is). Maar het is minder dan wat LearnDash sinds 4.20.1 in de PayPal-keten doet, waar `mc_gross` en `mc_currency` wél tegen de vastgelegde prijs worden gezet en er bij verschil `revoke_access()` volgt (hoofdstuk 17). **Op dit specifieke punt is Tutor zwakker dan de marktleider, en zwakker dan wij.**

### Wordt toegang ingetrokken bij terugbetaling?

**Automatisch niet.** Dit is de scherpste vondst van dit hoofdstuk. In `Paypal::verifyAndCreateOrderData()` (`:206-217`) staat het uitgecommentarieerd in de broncode:

```php
case self::PAYMENT_CAPTURE_REFUNDED:
    // $this->orderID = $paymentData->resource->custom_id;
    // return static::processRefund($paymentData);
    return new \stdClass();
```

Een terugbetaling die PayPal meldt, doet dus letterlijk niets. `processRefund()` bestaat, maar wordt vanuit de webhook niet aangeroepen.

Terugbetalen is in plaats daarvan een **handmatige beheerdershandeling**, en het intrekken van toegang is daarbij een **aparte, opt-in keuze** (`HooksHandler.php:345-357`):

```php
if ( 'backend_refund' === Input::post( 'context' ) && User::is_admin() ) {
    if ( EnrollmentModel::STATUS_COMPLETED === $order->enrollment->status
         && Input::has( 'is_remove_enrolment', Input::POST_REQUEST ) ) {
        $remove_enrollment = Input::post( 'is_remove_enrolment', false, Input::TYPE_BOOL );
        $enrollment_status = $remove_enrollment ? EnrollmentModel::STATUS_CANCEL : EnrollmentModel::STATUS_COMPLETED;
    }
}
```

Vergeet de beheerder dat vinkje, dan houdt de klant zijn cursus. Een chargeback via de webhook wordt helemaal niet als zodanig herkend. Dit is exact de bug die wij in PR #42/#44 hebben gedicht, alleen dan in de gratis versie van een plugin met naar eigen zeggen meer dan honderdduizend installaties.

Abonnementsverval is niet te beoordelen: `subscription` is een Pro-addon, de gratis code slaat de afhandeling er expliciet voor over (`HooksHandler.php:379-387`).

> **Vergelijk met ons:** onze Mollie-webhook haalt de betaling zelf op, toetst bedrag én valuta tegen wat we hadden vastgelegd, en verleent het entitlement atomair in hetzelfde statement. Bij terugbetaling en chargeback trekken we automatisch in. Op de keten koop-naar-toegang doet Tutor het net zo goed als wij; op de keten geld-terug-naar-toegang-weg doet hij het slechter dan LearnDash 5.1.8 en veel slechter dan wij.

---

## 6. Engagement: wat zit erin en wat kost geld

Dit is de scherpste breuklijn in de plugin. `classes/Addons.php:236-350` somt **27 addons** op, allemaal Pro (`tutor-pro/addons/{name}/{name}.php`, regel 165). De lijst is het beste overzicht van wat de gratis versie mist.

**In de gratis versie:**

| Onderdeel | Waar |
|---|---|
| Vragen en antwoorden per cursus | `classes/Q_And_A.php` |
| Aankondigingen | `classes/Announcements.php` |
| Cursusreviews met sterren | `classes/Reviews.php` |
| Order-e-mails: geplaatst en bijgewerkt, naar klant, docent en beheerder | `ecommerce/EmailController.php`, zes templates in `templates/email/` |
| Een e-mailwachtrij met batchverzending | `EmailController::enqueue_email()` (`:103`) |
| Volledige webshop: winkelwagen, kortingscodes, btw, klantgegevens, orderactiviteitenlog | `ecommerce/` |
| Instructeursverdiensten en uitbetalingsverzoeken | `tutor_earnings`, `tutor_withdraws` |
| GDPR-module: consent, logs, exportverzoeken | `GDPR/` |

**Achter de betaalmuur:** certificaten (`tutor-certificate`), cijferlijst (`gradebook`), e-mailautomatisering voor cursusgebeurtenissen (`tutor-email`), notificaties (`tutor-notifications`), drip (`content-drip`), prerequisites (`tutor-prerequisites`), opdrachten (`tutor-assignments`), abonnementen (`subscription`), cursusbundels (`course-bundle`), gratis proeflessen (`tutor-course-preview`), rapportage (`tutor-report`), Zoom, Google Meet, Google Classroom, H5P, BuddyPress, WooCommerce Subscriptions, PMPro.

**Gamification bestaat niet, in geen van beide versies.** Ik heb gegrepd op streak, badge, leaderboard, XP en punten: de enige treffers zijn UI-componenten (`components/Badge.php`, een statuslabel) en icoonnamen. Geen punten, geen niveaus, geen reeksen, geen prestaties. Voor gamification verwijst het Tutor-ecosysteem naar GamiPress, net zoals LearnDash dat doet.

Wat wel opvalt: **de gratis Tutor stuurt uit zichzelf transactionele e-mail** (order geplaatst, order bijgewerkt), met een wachtrij en batchverzending. LearnDash-core stuurt niet eens een voltooiingsmail; dat gat repareert daar een add-on (hoofdstuk 18 punt 4). Op dit punt is de gratis Tutor royaler dan de betaalde LearnDash.

---

## 7. Architectuur

**Omvang.** 1.762 bestanden, waarvan 861 PHP, samen ongeveer **169.300 regels PHP**. Verdeling van de PHP-bestanden: `templates/` 280, `ecommerce/` 224, `views/` 124, `includes/` 71, `classes/` 61, `components/` 35, `models/` 16, `GDPR/` 11, `helpers/` 9, `restapi/` 9, `migrations/` 6, `cache/` 4, `traits/` 1. Daarnaast 842 asset-bestanden (gebouwde CSS/JS, iconen, fonts).

**Namespaces en PSR-4: ja, echt.** `vendor/composer/autoload_psr4.php` mapt tien namespaces:

```
Tutor\Traits\ → traits/          Tutor\PaymentGateways\ → ecommerce/PaymentGateways/
Tutor\Models\ → models/          Tutor\Migrations\      → migrations/
Tutor\Helpers\ → helpers/        Tutor\GDPR\            → GDPR/
Tutor\Ecommerce\ → ecommerce/    Tutor\Components\      → components/
Tutor\Cache\ → cache/            TUTOR\                 → classes/
```

Dat `TUTOR\` in hoofdletters naast `Tutor\` in CamelCase staat is de historische naad: `classes/` is de oude wereld, alles daaromheen is sinds 3.x bijgebouwd. Vergeleken met LearnDash' WP Pro Quiz-fork (geen namespaces, geen autoloadstandaard, `phpcs:disable` bovenaan elk bestand) is dit een generatie verder.

**DI-container: ja, en een echte.** `classes/Container.php` (sinds 3.7.0) doet `bind`, `singleton`, `instance`, `make` en **autowiring via `ReflectionClass`**, met constructor-parameterresolutie en `isDefaultValueAvailable()`-terugval. Alle staat is `static`, dus het is één globale container en niet injecteerbaar, maar het is meer dan LearnDash of de meeste WordPress-plugins hebben.

**UI-componenten.** `components/` bevat een vloeiende PHP-componentbibliotheek: `Button::make()->label( __( 'Next' ) )->size( Size::LARGE )->attr( '@click', 'goNext()' )->render()`. Dat is een serieuze poging tot een designsysteem binnen PHP-templates. De frontend gebruikt Alpine.js (`x-data`, `x-bind`, `@submit.prevent`), niet jQuery.

**REST API.** Twee stuks, netjes gescheiden. De publieke content-API (`classes/RestAPI.php`, namespace `tutor/v1`, controllers in `restapi/`) is afgeschermd met een API-key/secret via Basic auth. De webhookroute (`ecommerce/PaymentHandler.php`) is publiek en leunt op de gatewayhandtekening.

**Migraties.** Twee systemen naast elkaar. `classes/Upgrader.php` is de klassieke `version_compare`-ladder (`upgrade_to_1_3_1`, `upgrade_to_2_6_0`, `upgrade_to_3_0_0`, `upgrade_to_3_7_1`, `upgrade_to_3_8_0`, `upgrade_to_3_8_2`). `migrations/` is nieuwer (3.8.0) en draait geplande batchmigraties via cron met een `BatchProcessor` en `Contracts/BulkProcessor` en `SingleProcessor`. Dat tweede systeem is een net stuk werk.

**Wat er níét in de distributie zit:** geen `composer.json` in de root, geen `package.json`, geen `phpunit.xml`, **geen enkele test**, geen source maps, geen `assets/src/` (de gebouwde JS bevat wel `// CONCATENATED MODULE: ./assets/src/js/frontend/...`-commentaar, dus de TypeScript-bron bestaat, hij wordt alleen niet meegeleverd). Er wordt dus zonder testsuite gedistribueerd. Wat er wél in zit is een complete `vendor/`-boom onder `ecommerce/PaymentGateways/Paypal/`, met **Guzzle 7.11, brick/math, brick/money, PSR-7/17/18 en symfony/polyfill-php80**, niet geprefixt. Een tweede plugin met een andere Guzzle op dezelfde site is een klassiek conflict.

**Schuldposten.** `classes/Utils.php` is **10.380 regels** in één klasse: `has_enrolled_content_access`, `get_course_completed_percent`, `is_completed_lesson`, `is_course_purchasable` en honderden andere methodes wonen daar naast elkaar. Het is het godobject van deze codebase en het is precies de plek waar de drie toegangspoorten uit §3 uit elkaar zijn gegroeid. Verder: **448 `phpcs:disable`- of `phpcs:ignore`-regels** (LearnDash zette ze bovenaan élk bestand van de quizfork; Tutor doet het per blok, wat eerlijker is maar nog steeds veel), **25 `@deprecated`-markeringen** en **nul `_deprecated_function()`-aanroepen**, dus verouderde functies waarschuwen niet en worden ook niet weggehaald. Losse `date()` in plaats van `gmdate()` met `//phpcs:ignore` ernaast. En het `@todo will remove` boven de REST-permissiecheck.

---

## 8. Eén ding duidelijk beter, één ding duidelijk slechter

### Beter: de quizbeoordeling, doordat er niets te verifiëren valt

LearnDash bouwde een handtekeningmechanisme om een client-berekende score te kunnen wantrouwen: `checkAnswers` geeft per vraag een `p_nonce` over `(user, quiz, vraag, punten)` af, en `completedQuiz` verifieert die en nulstelt punten waarvan de handtekening niet klopt (hoofdstuk 11, §4c). Dat is knap, maar het is machinerie die alleen nodig is omdat de score de reis naar de browser en terug maakt.

Tutor heeft die reis geschrapt. De client stuurt `answer_id`'s, de server leest `is_correct` en `question_mark` uit `tutor_quiz_question_answers` en `tutor_quiz_questions`, en de score ontstaat pas op de server (`Quiz.php:952`). Er is geen ingezonden score, dus geen handtekening, geen nonce-levensduur, geen replay-venster van 24 uur, en geen "wat als de gebruikerscontext tussen check en afronding verschuift". Dat is niet alleen veiliger, het is **minder code die minder kan breken**. Dat het bijbehorende datamodel genormaliseerd is (een rij per antwoord met een boolean) in plaats van een `serialize()`-blob in een `longtext` maakt het compleet: geen reparatiefunctie voor kapotte bytelengtes nodig.

### Slechter: er is geen enkele toegangspoort, en de hele beschermingslaag heeft een uitknop

LearnDash' `sfwd_lms_has_access()` had een `consolidate`-TODO in de broncode, en dat noemden wij in hoofdstuk 10 een minpunt. Tutor is daar meetbaar slechter aan toe:

1. **Drie poorten** (`Utils::has_enrolled_content_access`, `CourseModel::has_course_content_access`, `QuizModel::has_quiz_access`) die de openbare-cursusuitzondering **aantoonbaar verschillend** toepassen: de legacy lespagina eist `is_public && ! is_course_purchasable`, de nieuwe learning area, de quizpoort en de AJAX-lesrenderer nemen genoegen met `is_public` alleen. Vier codepaden, twee antwoorden.
2. **De belangrijkste poort wordt vanuit een templatebestand aangeroepen** (`templates/learning-area/index.php:106`), in een map die themes bedoeld overschrijven.
3. **De hele laag is uit te zetten met één filter.** `apply_filters( 'tutor_lms_should_template_override', true )` in de constructor van `Template` (regel 47); geeft iets `false` terug, dan wordt géén van de `template_include`-hooks geregistreerd en is er geen `the_content`-vangnet voor lessen. Bij LearnDash zet je met `learndash_template_preprocess_filter` één filter opzij; hier zet je de complete bescherming in één keer uit, en de lessen zijn gepubliceerde, `publicly_queryable` posts.

Daar bovenop, en het is dezelfde familie fout: de correcte antwoorden gaan onvoorwaardelijk als `bin2hex` mee de pagina op (§4), terwijl LearnDash ze er bewust uit strip. Tutor beschermt de *score* uitstekend en de *inhoud* slecht.

---

## Wat wij hiervan zouden lenen

1. **De vorm van `manage_attempt_answers()` voor onze serverzijdige quizscore.** Hoofdstuk 18 punt 2 staat al op de lijst, en Tutor laat de eenvoudigste uitvoering zien: de client stuurt gekozen indexen, de server kijkt na tegen data die hij al heeft, geen handtekening, geen opslag van antwoorden. Neem daarbij hun fout níét over: **`total` komt uit de catalogus, nooit uit het verzoek.** Bij hen zit precies daar het gat.
2. **Foreign keys met `ON DELETE CASCADE` waar wij ze nog niet hebben.** Tutor zet ze op `ordermeta`, `order_items`, `cart_items` en de coupontabellen; wij hebben `entitlements`, `payment_attempts` en `lesson_progress`. De vraag is concreet: wat gebeurt er bij ons als een gebruiker wordt verwijderd? Bij hen zorgt de database ervoor; bij ons is dat een aanname.
3. **De `_tutor_is_public_course`-les, en dan als waarschuwing.** Wij overwegen één gratis proefles per betaalde cursus (hoofdstuk 18 punt 8). Tutor bewijst waar dat misgaat: één vlag die op vier plekken anders wordt gelezen. Bouwen wij dat, dan hoort de proeflesuitzondering **binnen** `heeftToegangTot()` te zitten en nergens anders, met een test die vastlegt dat een betaalde cursus met een proefles níét in zijn geheel opengaat.
4. **De atomaire orderschrijf als ijkpunt voor onze bevestigingsclaim.** `OrderModel::create_order()` doet order plus regels in één transactie. Wij kunnen geen transactie gebruiken (neon-http), maar de invariant is dezelfde en ons antwoord is beter: data-modifying CTE's. Waard om ergens vast te leggen dat wij hier bewust een andere techniek voor hetzelfde doel gebruiken.
5. **De negatieve les over templates die schrijven.** `templates/single/common/header.php` en `templates/learning-area/index.php` muteren de database vanuit een view. Wij hebben daar structureel geen last van door de server/client-scheiding van Next.js, maar de generalisatie geldt wel voor ons: houd het muterende pad op één plek (`completeLesson()` is dat nu) en laat een renderpad nooit schrijven, ook niet "even snel".

---

## Onzekerheden

- Dit is **v4.0.4 van de gratis wordpress.org-versie**. Alles wat Tutor Pro doet (certificaten, drip, abonnementen, gradebook, e-mailautomatisering, opdrachten) heb ik niet gezien; die 27 addons kunnen gaten dichten die ik hier als gaten beschrijf. In het bijzonder: abonnementsverval en gedeeltelijke terugbetalingen worden expliciet doorgeschoven naar een Pro-controller die ik niet kon lezen.
- **Ik heb niets gedraaid.** Er staat geen WordPress-installatie achter deze analyse. De claim dat `show_in_rest` op lessen de inhoud aan anonieme bezoekers serveert, volgt uit hoe WordPress' eigen posts-controller gepubliceerde posts behandelt en is **niet in een browser bevestigd**. Behandel hem als "waarschijnlijk, verifieer voor je hem citeert". Hetzelfde geldt voor de aanval op `quiz_question_ids`: het codepad is eenduidig, maar ik heb geen poging ingediend.
- De bewering dat het script-element met de gehexte antwoorden **onvoorwaardelijk** wordt uitgestuurd, heb ik gecontroleerd door de conditionals in `templates/learning-area/quiz/attempt.php` na te lopen (de laatste sluit op regel 360, het script staat op 411). Wat ik niet heb nagelopen is of een thema of Pro-addon dit template vervangt door een variant zonder die regel.
- Ik heb de **gelukkige route** gevolgd: enkele cursus, PayPal, eigen webshop. WooCommerce, EDD en Paid Memberships Pro als verkoopkanaal heb ik alleen bestaan-en-plaats vastgesteld, niet doorgelopen. WooCommerce is in de praktijk waarschijnlijk het meest gebruikte pad en kan andere eigenschappen hebben, ook op terugbetalingen.
- De prestatie-uitspraken (drie tot vier query's per voortgangsberekening, `TutorCache` als per-request cache) komen uit de vorm van de code, niet uit een profiler op een echte dataset.
- Ik heb **niet** gecontroleerd of Themeum de hier beschreven punten inmiddels in een 4.0.5 of hoger heeft gerepareerd. Alles hierboven geldt voor de zip zoals die vandaag, 5 augustus 2026, van wordpress.org kwam.
