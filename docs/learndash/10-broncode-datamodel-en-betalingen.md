# LearnDash broncode: datamodel, voortgangsmotor, toegang & betalingen

> Deze notitie analyseert de **échte plugincode van LearnDash v4.6.0 (mei 2023)**, uitgepakt uit Jasons eigen licentiearchief (`sfwd-lms/`). De huidige generatie is 5.x, dus details kunnen verschoven zijn — maar het fundament (usermeta-voortgang, de activity-tabellen, `sfwd_lms_has_access()`, de gateway-webhooks) is al jaren stabiel en herkenbaar in latere releases. Geschreven 5 aug 2026. Bestandspaden zijn relatief aan `sfwd-lms/`. Codefragmenten zijn kort en dienen als bewijs — dit is propriëtaire code, dus we analyseren en herpubliceren niet.
>
> Dit stuk vult de op documentatie gebaseerde kennisbank (`01`–`08`) aan met wat alleen de code prijsgeeft. Waar het raakt aan onze eigen keuzes staat er een korte "Vergelijk met ons".

---

## 1. Het echte databaseschema

LearnDash voegt aan het WordPress-schema **twee eigen tabellen** toe (naast de `wp_pro_quiz_*`-tabellen, die een ander topic zijn). De `CREATE TABLE` staat in `includes/admin/classes-data-upgrades-actions/class-learndash-admin-data-upgrades-user-activity-db-table.php`, uitgevoerd via `dbDelta()` bij activatie/upgrade — **niet** bij elke deploy, maar bij een versiewissel met `is_admin()`.

### `{prefix}learndash_user_activity`

```
activity_id        bigint(20) unsigned  PK AUTO_INCREMENT
user_id            bigint(20) unsigned  DEFAULT 0   KEY
post_id            bigint(20) unsigned  DEFAULT 0   KEY
course_id          bigint(20) unsigned  DEFAULT 0   KEY
activity_type      varchar(50)          NULL        KEY   ('course','lesson','topic','quiz','access')
activity_status    tinyint(1) unsigned  NULL        KEY   (1=voltooid, 0=bezig, NULL=niet gestart)
activity_started   int(11) unsigned     NULL        KEY   (unix timestamp)
activity_completed int(11) unsigned     NULL        KEY
activity_updated   int(11) unsigned     NULL        KEY
```

### `{prefix}learndash_user_activity_meta`

```
activity_meta_id    bigint(20) unsigned  PK AUTO_INCREMENT
activity_id         bigint(20) unsigned  DEFAULT 0   KEY
activity_meta_key   varchar(255)         NULL        KEY (191)   (prefix-index, want 255 > 191 utf8mb4 limit)
activity_meta_value mediumtext
```

Wat de code hier verraadt:

- **Prefixes zijn draaibaar.** `LDLMS_DB::get_table_name()` (`includes/class-ldlms-db.php`) bouwt de naam op als `$wpdb->prefix . 'learndash_' . …`. De tabelnaam is dus niet hard `wp_learndash_user_activity` — hij hangt aan de WP-tabelprefix én een sub-prefix, beide filterbaar (`learndash_table_prefix`). Een migratiescript dat de naam hardcodeert breekt op een multisite of custom prefix.
- **Bijna elke kolom heeft een losse index — negen stuks op één tabel.** Dat is een bewuste ruil: snelle rapportagequery's op elke as (per gebruiker, per cursus, per type, per tijdstip), betaald met tragere writes en een dikke tabel. Bij duizenden gebruikers is dit de tabel die het grootst wordt.
- **Alleen enkelvoudige indexen, geen samengestelde unieke sleutel.** Er is géén `UNIQUE(user_id, course_id, post_id, activity_type)`, terwijl de commentaarcode dat viertal wél "Unique key part 1..4/4" noemt. De uniciteit wordt dus **in PHP** afgedwongen (zie §3), niet door de database. Twee gelijktijdige requests kunnen in principe twee activity-rijen voor dezelfde stap maken — de db houdt dat niet tegen.
- **Timestamps zijn `int(11) unsigned`** — het klassieke 2038-probleem, en `int` niet `bigint` zoals de id's.
- Er zit een historische patch in: v2.3.0.4 zette `activity_status` DEFAULT van `0` naar `NULL` met een losse `ALTER TABLE`, omdat `dbDelta()` een gewijzigde default niet oppakt. En een 2.5.0-patch herstelt het `AUTO_INCREMENT`-attribuut dat bij sommige installaties verdween — code die de db repareert omdat `dbDelta` onbetrouwbaar bleek.

> **Vergelijk met ons:** onze voortgang leeft in `lesson_progress` + `user_stats` met echte constraints en atomaire CTE-updates; LearnDash leunt op negen losse indexen zonder unieke sleutel en dwingt uniciteit in applicatiecode af.

---

## 2. De `_sfwd-course_progress` usermeta — de eigenlijke bron van waarheid

De activity-tabellen zijn grotendeels een *rapportagespiegel*. De **canonieke voortgang** staat in één usermeta-record per gebruiker: `_sfwd-course_progress`. De klasse eromheen is `LDLMS_Model_User_Course_Progress` (`includes/classes/class-ldlms-model-user-course-progress.php`), meta-key hardgecodeerd op regel 36.

### Vorm van het geserialiseerde array

Het is één (PHP-geserialiseerd) array met **alle cursussen van de gebruiker als top-level keys**:

```php
[ $course_id => [
    'lessons' => [ $lesson_id => 1, … ],          // 1 = voltooid
    'topics'  => [ $lesson_id => [ $topic_id => 1, … ] ],
    'completed' => 12,                             // aantal voltooide stappen (cache)
    'total'     => 18,                             // aantal stappen in de cursus (cache)
    'last_id'   => 987,                            // laatst geziene stap
  ], … ]
```

Quizzen staan **niet** in dit array — die leven in `_sfwd-quizzes` usermeta en in de activity-tabel. `completed`/`total` zijn afgeleide cachevelden die bij elke mutatie worden herschreven.

### Hoe cursusvoltooiing wordt berekend — en waarom het duur is

De klasse bouwt bij het laden **meerdere "views"** van dezelfde data op (`load_course_progress()`):
- `legacy` — de boomstructuur hierboven;
- `co` (completion order) en `l` (linear) — platte lijsten met sleutels als `sfwd-lessons:123 => 1`, makkelijker om "is de vorige stap af?" te bepalen;
- `summary` — `completed`/`total`/`status`.

`build_course_progress_completed_count()` **loopt over alle stappen** en telt de voltooide. Cruciaal: voor elke quiz-stap roept het `learndash_user_quiz_has_completed()` aan, en het controleert `learndash_has_global_quizzes()` + `learndash_is_all_global_quizzes_complete()`. Dat is een **per-stap lus met database-lookups erin**, opnieuw uitgevoerd zodra de voortgang "unloaded" is. En unloaded raakt hij snel: de klasse haakt in `added_user_meta`/`updated_user_meta` (regel 83-84) om zichzelf leeg te gooien zodra het usermeta-record verandert — ook door een extern proces.

De "totaal aantal stappen" komt uit `learndash_get_course_steps_count()` → `learndash_course_get_steps_count()`, dat leunt op de post-meta `ld_course_steps` en `_ld_course_steps_count` (`includes/classes/class-ldlms-model-course-steps.php`). Die worden via een **dirty-flag mechanisme** (`ld_course_steps_dirty`) herberekend. Zolang niemand de cursusstructuur wijzigt is de telling goedkoop; wél is de hele stappenstructuur óók een geserialiseerd post-meta blob dat volledig herbouwd wordt zodra de flag staat.

> **Vergelijk met ons:** wij lezen `total` uit de catalogus (statische data, geen db-query) en tellen `completed` als delta op in één SQL-statement. LearnDash herberekent bij elke invalidatie de volledige som met een lus die per quiz-stap de database raadpleegt.

---

## 3. Mark-complete: wat één lesvoltooiing precies schrijft

Serverkant begint bij `learndash_mark_complete_process()` (`includes/course/ld-course-progress.php:378`), gehaakt op de generieke `wp`-actie. Het leest `$_POST['sfwd_mark_complete']` (een nonce), `$_POST['post']`, optioneel `$_POST['course_id']` en `$_POST['userid']`, en verifieert de nonce `sfwd_mark_complete_{userid}_{postid}`. Slaagt dat, dan roept het `learndash_process_mark_complete()` aan (regel 722).

Let op: **`userid` komt uit de POST-body** en de nonce bindt hem eraan, maar er is geen extra check dat het de ingelogde gebruiker is — de nonce-binding is de enige beveiliging.

Eén lesvoltooiing zet in gang (`learndash_process_mark_complete`):

1. **Toegangs-/progressiepoorten eerst** (in `learndash_mark_complete()`, dat de knop rendert): `sfwd_lms_has_access()`, `learndash_is_course_prerequities_completed()`, `learndash_check_user_course_points_access()`, en of alle stap-quizzen af zijn. Dit is renderlogica — de eigenlijke schrijfactie zit in de process-functie.
2. **Usermeta bijwerken**: `$course_progress['lessons'][$postid] = 1`, daarna `completed` = `learndash_course_get_completed_steps()` (de dure lus) en `total` = stappenaantal, plus `last_id`. Weggeschreven via `learndash_user_set_course_progress()` → `update_user_meta('_sfwd-course_progress', …)`.
3. **Course-completed usermeta**: is `completed >= total`, dan `add_user_meta( 'course_completed_'.$course_id, time(), true )`; anders `delete_user_meta(...)`. Deze losse meta-key is wat §7 (punten) later scant.
4. **Activity-tabel**: `learndash_activity_complete_lesson()` schrijft/updatet een rij, en de bijbehorende course-activity krijgt meta `steps_completed` en `steps_last_id` via `learndash_activity_update_meta_set()`. Een aparte course-activity-rij wordt op status gezet.
5. **Hooks**: `do_action('learndash_lesson_completed', …)`, en bij een cursusafronding `learndash_before_course_completed` / `learndash_course_completed`. Dit zijn de haken waar certificaten, e-mails, punten en notificaties aan hangen.

Dus: **één les afvinken raakt minstens twee opslagplaatsen** (usermeta-blob + activity-tabel + activity-meta) plus een aparte `course_completed_*` meta, en vuurt meerdere actions. De functie eindigt met een hard `$return = true` (commentaar "LEARNDASH-5883") — de teruggavewaarde is dus betekenisloos als succesindicator.

> **Vergelijk met ons:** onze `verwerkLes()` telt de delta atomair in één statement en synct server-side; LearnDash schrijft naar drie plaatsen na elkaar zonder transactie (WordPress/`$wpdb` kent hier geen transactiegrens), dus een halve schrijf laat de spiegel en de bron uit elkaar lopen.

---

## 4. Toegangscontrole: hoeveel codepaden beslissen echt?

De centrale functie is `sfwd_lms_has_access()` (`includes/course/ld-course-user-functions.php:75`), een dunne wrapper met filter rond `sfwd_lms_has_access_fn()` (regel 99). Dat is **wél de bedoelde single gate** — maar de code zelf geeft toe dat het niet zo netjes is: de docblock boven `ld_course_check_user_access()` zegt letterlijk *"duplicate function, exists in other places — check its use and consolidate"*. Er zijn dus wrappers (`ld_course_check_user_access`, `Product::user_has_access`) die er allemaal naartoe leiden, maar geen garantie dat elk consumerend stuk via deze poort gaat.

De beslislogica in `sfwd_lms_has_access_fn()`, in volgorde:

1. Geen course-id te vinden → **true** (het is geen beschermde content).
2. Course bestaat niet → false.
3. `learndash_can_user_autoenroll_courses()` (admin/bypass) → true.
4. `learndash_is_sample()` (preview-les) → true.
5. `course_price_type === 'open'` → true; `'paynow'` met lege prijs → true; leeg `course_join` → true.
6. Niet ingelogd → false.
7. Anders: **usermeta-key `course_{course_id}_access_from`** bestaat **óf** groepslidmaatschap (`learndash_user_group_enrolled_to_course()`) → dan checkt het verval (`ld_course_access_expired()`) en geeft `!expired` terug.

### Hoe inschrijving wordt opgeslagen

Twee modellen, geschakeld door `learndash_use_legacy_course_access_list()` (default **legacy = true** tot een data-upgrade `course-access-lists-convert` is gedraaid):

- **Legacy**: een `course_access_list` in de **cursus**-postmeta — een lijst met user-id's als string. Slecht schaalbaar (elke inschrijving muteert één gedeelde blob).
- **Modern**: per gebruiker de usermeta `course_{course_id}_access_from` met een unix-timestamp. Dit is de facto de inschrijving. Grofweg: het bestaan van die key = toegang.

Inschrijven/uitschrijven loopt via `ld_update_course_access($user_id, $course_id, $remove)` (regel 490). Die schrijft de `_access_from` usermeta, spiegelt een `access`-activity-rij, en **wist een transient** `learndash_user_courses_{user_id}` — die transient is een cache van "welke cursussen heeft deze gebruiker", en die kan dus verouderen als iemand buiten deze functie om de meta aanraakt.

Groepstoegang is een **tweede pad**: lidmaatschap van een groep verleent alle cursussen in die groep, opgeslossen los van `_access_from`. Toegang kan dus uit twee bronnen komen (directe enrollment of groep), wat elke telling "hoeveel mensen hebben cursus X" complex maakt.

> **Vergelijk met ons:** `heeftToegangTot()` is de enige poort, `server-only`, kijkt naar sessie + één `entitlements`-rij met status `actief`. LearnDash heeft één *bedoelde* poort met een expliciete "consolideer dit"-TODO, twee enrollment-representaties (legacy list vs. per-user meta), en een parallel groepspad.

### Render-only afdwinging — het belangrijkste inzicht

De toegangscheck beschermt de **weergave**, niet de post. Lessen/cursussen blijven gewoon gepubliceerde WordPress-posts. De bescherming zit in een `the_content`-filter: `SFWD_LMS::template_content()` (`includes/class-ld-cpt-instance.php`) roept `sfwd_lms_has_access()` aan en **vervangt de content** door een slotscherm/prerequisite-boodschap als het niet mag. De ruwe `post_content` staat wel in de database en wordt door WP geladen — alleen bij het renderen weggefilterd.

Concreet betekent dit: elk pad dat content oplevert **zonder** door dit filter te gaan (een REST-endpoint, een verkeerd geschreven shortcode, een export, `the_content` met verkeerde prioriteit) lekt de lesinhoud. De autorisatie is dus render-tijd, niet data-tijd.

> **Vergelijk met ons:** wij bouwen betaalde lespagina's per-request (geen `generateStaticParams`) en geven nooit een `Course`-object aan client components — de toegangscheck zit vóór de data, niet vóór de weergave. LearnDash's model is precies het patroon waar wij expliciet tegen waken.

---

## 5. Drip / beschikbaar-op-datum

`ld_lesson_access_from()` (`includes/course/ld-course-user-functions.php:611`) berekent wanneer een les beschikbaar wordt. Twee mechanismen:

- **Relatief** (`visible_after`, in dagen): `course_access_from + visible_after * 86400`. De "course access from" is de `course_{id}_access_from`-timestamp — dus drip telt vanaf inschrijfmoment, per gebruiker.
- **Absoluut** (`visible_after_specific_date`): een vaste datum voor iedereen.

Afdwinging is **render-only**, net als toegang. `lesson_visible_after()` (regel 701) haakt op het `learndash_content`-filter met prioriteit 1 en **vervangt de lescontent** door een "nog niet beschikbaar"-template als `time() < lesson_access_from`. Er is geen aparte datab arrière of scheduled task — het is puur een vergelijking op het moment dat de pagina wordt opgebouwd. Zet iemand een cron/REST-pad op dat het `learndash_content`-filter mist, dan is de drip er niet.

Admins/bypass-gebruikers slaan alles over via `learndash_prerequities_bypass` (de tikfout "prerequities" zit letterlijk in de filternaam en staat overal in de code).

---

## 6. Betalingen: hoe een geslaagde betaling inschrijving wordt

De ingebouwde gateways in v4.6.0 (`includes/payments/gateways/`): **Stripe** (Connect), **PayPal IPN** en **Razorpay**. De oude losse Stripe-Connect-klasse is nu een deprecated stub die naar `src/deprecated/` doorverwijst. Gemeenschappelijke basis: `class-learndash-payment-gateway.php` (abstract).

Het inschrijfmoment is voor álle gateways hetzelfde: `add_access_to_products()` (regel 842) → per product `$product->enroll($user)` → `ld_update_course_access()` (voor cursussen) of `ld_update_group_access()` (voor groepen). Precies dezelfde functie als handmatige inschrijving. Daarnaast maakt het een **Transaction** post (`sfwd-transactions` CPT) via `learndash_transaction_create()`, met een parent-transaction ("Order #123") en per product een child — de post-meta bevat gateway, prijsinfo-DTO en het gateway-transactie-id.

### Stripe-webhook: hoe robuust is de verificatie?

`Learndash_Stripe_Gateway::process_webhook()` (regel 444) → `validate_webhook_event_or_fail()` (regel 909). De kern:

1. Leest de ruwe payload van `php://input`, JSON-decode.
2. Pakt **alleen het `id`-veld** uit de payload en doet `$this->api->events->retrieve( $event['id'] )` — het **haalt het echte event opnieuw op bij Stripe** met de secret key, en werkt verder alléén met dát object.

Dit is precies onze webhook-regel: *"geloof niets uit de payload behalve het id."* LearnDash doet géén HMAC-signatuurcheck (`Webhook::constructEvent` met endpoint-secret), maar bereikt equivalente zekerheid door het event server-side terug te halen — een vervalste payload met een verzonnen id faalt bij `events->retrieve`, en een echt id levert de authentieke data. Verstandig.

Bij `checkout.session.completed` verleent het toegang en registreert de transactie. Producten worden bepaald door `setup_products_or_fail()` (regel 852): **het post-id komt uit `metadata['post_id']`** van de line items — metadata die LearnDash zélf bij het aanmaken van de checkout-sessie heeft gezet.

### Prijs- en bedragverificatie — het gat

Hier wijkt LearnDash af van onze strengste regel. De **prijs wordt server-side vastgesteld bij het aanmaken van de sessie** (`setup_payment()` → `create_payment_session($product)`, met het bedrag uit `$product->get_pricing()`), dus de klant kan de prijs niet in het verzoek bepalen — dat deel is goed, en `setup_payment()` verifieert een nonce ("Cheating?").

Maar de **webhook zelf vergelijkt `amount_total`/`currency` niet opnieuw tegen de cataloguswaarde** voordat toegang wordt verleend. Zodra er een authentiek `checkout.session.completed`-event is met een product-id in de metadata, volgt inschrijving. Het vertrouwt erop dat wat het bij sessie-creatie instelde ongewijzigd terugkomt. In de praktijk is dat via Stripe redelijk veilig (de sessie is server-gemaakt en onveranderlijk), maar het is een zwakkere invariant dan expliciet bedrag+valuta hercontroleren.

### PayPal IPN: aanzienlijk dunner

`class-learndash-paypal-ipn-gateway.php`. De verificatie leunt op de klassieke `IpnListener::processIpn()` (postback naar PayPal, `includes/lib/paypal/ipnlistener.php`). Daarna:
- **Wél** gecontroleerd: `txn_type` in een whitelist, `payment_status === 'completed'`, `mc_gross` niet leeg, geldig `payer_email`, en cruciaal `ipn_validate_receiver_data()` — `receiver_email`/`business` moet gelijk zijn aan de geconfigureerde `paypal_email` (anders "IPN with invalid receiver/business email"). Dat voorkomt dat een IPN voor een andere verkoper toegang verleent.
- **Niet** gecontroleerd: het betaalde bedrag (`mc_gross`) wordt gelogd en op niet-leeg getoetst, maar **niet vergeleken met de cursusprijs**. En de gebruiker wordt afgeleid uit `$_POST['custom']` (een user-id) of anders uit `payer_email` — waarbij een onbekend account gewoon **wordt aangemaakt** (`find_or_create_user`). De valuta wordt niet tegen de catalogus gezet.

Dus PayPal IPN verifieert *afzender* en *status*, maar niet *bedrag=prijs* of *valuta*. Iemand die te weinig betaalt maar een geldige "completed"-IPN naar de juiste ontvanger genereert, wordt ingeschreven.

> **Vergelijk met ons:** onze Mollie-webhook haalt de status zelf op (id-only, zoals Stripe hier) én controleert **bedrag en valuta** tegen wat wij hadden vastgelegd, in de gateway-laag, atomair met het verlenen van het entitlement. LearnDash doet de id-only-ophaal goed bij Stripe, maar laat de bedrag/valuta-hercontrole bij álle drie de gateways achterwege.

### Terugbetalingen

In deze versie is de webhook-afhandeling gericht op verlenen (`checkout.session.completed`, `invoice.payment_succeeded`) en op abonnementen (`invoice.payment_failed` en `customer.subscription.deleted` → `remove_access_to_products`). Een **losse refund van een eenmalige aankoop** trekt in deze code geen cursustoegang in — alleen abonnementsgebeurtenissen doen dat. (Vergelijk: bij ons was precies dít de bug die we dichtten — een `paid`-betaling die terugbetaald werd bleef toegang geven; wij trekken nu in bij chargeback en volledige terugbetaling.)

---

## 7. Cursuspunten & prerequisites in code

- **Prerequisites**: `learndash_is_course_prerequities_completed()` (`includes/course/ld-course-functions.php`, de tikfout zit in de functienaam) leest de cursus-setting `course_prerequisite` (een lijst cursus-id's) plus een compare-modus (ALL/ANY). Afgedwongen op render-tijd in `template_content()` en in de mark-complete-poort. Géén datab, puur een check-bij-tonen.
- **Cursuspunten**: `learndash_check_user_course_points_access()` (regel 497) vergelijkt `learndash_get_user_course_points($user_id)` met de vereiste `course_points_access` van de cursus. En `learndash_get_user_course_points()` (`includes/ld-users.php:1134`) is een **opvallende query**: een subquery over `wp_usermeta` die alle `course_completed_%`-keys pakt, de course-id's eruit `REPLACE`-t, en dan in `wp_postmeta` de `course_points`-waarden optelt. Een string-parse van meta-keys als join-sleutel — werkt, maar is fragiel en niet indexeerbaar. Bij een gebruiker met veel voltooide cursussen is dit een merkbare query, en hij draait bij elke toegangscheck op een punten-gated cursus.

---

## 8. Prestatiepatronen die de code verraadt

- **N+1 rond stappen en quizzen**: `build_course_progress_completed_count()` en `learndash_course_get_completed_steps()` lopen per stap en doen per quiz-stap een completion-lookup. Voor een cursus met veel quizzen, herhaald bij elke meta-invalidatie.
- **Meta-invalidatie is agressief**: de progress-klasse gooit zichzelf leeg bij élke `updated_user_meta` op de key, ook door externe processen — makkelijk om per request meermaals de volledige heropbouw te triggeren.
- **Geserialiseerde blobs als hotspots**: `_sfwd-course_progress` (alle cursussen van een gebruiker in één rij) en `ld_course_steps` (hele cursusstructuur in één post-meta) worden in hun geheel gelezen/geschreven. Bij een gebruiker met veel cursussen groeit het ene blob; bij een grote cursus het andere.
- **Transient-caches die kunnen verouderen**: `learndash_user_courses_{user_id}` en de dirty-flag op stappen zijn point-in-time caches zonder harde invalidatie-garantie buiten de eigen functies om.
- **De activity-tabel is de rapportagemotor** en betaalt schrijfsnelheid voor negen indexen; dat is de bekende plek waar grote LearnDash-installaties (ProPanel-rapportages) traag worden.

---

## Wat de code zegt dat de docs niet zeggen

1. **Er zijn twee bronnen van voortgangswaarheid**, niet één: het `_sfwd-course_progress` usermeta-blob (canoniek) én de `learndash_user_activity`-tabel (spiegel voor rapportage). Ze worden na elkaar geschreven zonder transactie — ze kúnnen uiteenlopen. De docs presenteren voortgang als één ding.
2. **Toegang en drip zijn render-only.** De post-content staat onbeschermd in de database; alleen het `the_content`/`learndash_content`-filter vervangt hem. Elk pad dat die filters mist, lekt betaalde inhoud. De docs zeggen "les is vergrendeld", de code zegt "les wordt bij het tonen weggefilterd".
3. **De single access gate heeft een `TODO: consolidate` in de broncode** en er zijn twee enrollment-representaties (legacy `course_access_list` blob vs. per-user `course_{id}_access_from` meta) plus een parallel groepspad. Het is minder één-poort dan de docs suggereren.
4. **Uniciteit van activity-rijen is een PHP-afspraak, geen db-constraint** — er is geen unieke sleutel op `(user_id, course_id, post_id, activity_type)`.
5. **Betaalverificatie is asymmetrisch.** Stripe doet id-only server-side ophalen (goed, gelijk aan onze regel), maar géén enkele gateway hercontroleert bedrag+valuta tegen de catalogus in de webhook; PayPal IPN verifieert afzender en status maar niet het bedrag. Een refund van een losse aankoop trekt in deze versie geen toegang in.
6. **`course_completed_{course_id}` losse usermeta** is de feitelijke "cursus af"-vlag én de join-sleutel voor de puntenberekening — een detail dat nergens in de featuredocs staat maar bepalend is voor certificaten en punten.

### Onzekerheden

- Dit is **v4.6.0**; 5.x kan de gateway-webhooks (met name signatuurchecks) en de progress-opslag hebben aangescherpt. Behandel de betaal-bevindingen als "zo was het in mei 2023", niet als "zo is LearnDash".
- Ik heb de **happy path** getraceerd. Edge cases (gedeeltelijke refunds, subscription-proration, multisite-prefixes, de `course-access-lists-convert` data-upgrade halverwege) zijn niet uitputtend gevolgd.
- Of er buiten `sfwd_lms_has_access()` om nog toegangschecks bestaan in add-ons of REST-controllers heb ik niet volledig uitgekamd — de kernpaden lopen er wel doorheen, maar de "consolidate"-TODO in de code suggereert dat het historisch niet overal zo was.
- De prestatieclaims zijn afgeleid uit de codevorm (lussen, blob-lezingen, index-telling), niet uit een profiler op een echte dataset.
