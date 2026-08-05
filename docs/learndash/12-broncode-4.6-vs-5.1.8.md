# 12 — Wat drie jaar en een hoofdversie deden: LearnDash 4.6.0 naast 5.1.8

> Onderdeel van de LearnDash-kennisbank. Geschreven **5 augustus 2026**.
>
> De hoofdstukken 09, 10 en 11 lazen de broncode van **v4.6.0 (31 mei 2023)** — de versie die Jason destijds kocht. Dit hoofdstuk zet daar **v5.1.8 (22 juli 2026)** naast, de actuele release, vers gedownload onder dezelfde licentie (geldig tot juni 2027). Beide bomen zijn Jasons eigen, betaalde kopieën. We analyseren ze, we herpubliceren ze niet: codefragmenten zijn kort en dienen als bewijs.
>
> **Waarom dit hoofdstuk bestaat.** 09/10/11 zeiden zelf al hardop dat ze een momentopname waren en dat de getallen "vrijwel zeker niet meer kloppen voor 5.x". Dat is nu geen aanname meer maar meetbaar. En het antwoord is verrassender dan "alles is veranderd": de dingen die 09/10/11 als *structureel* aanwezen — de quizmotor uit 2013, de geserialiseerde voortgang, de activity-tabel, de render-only bescherming — staan er bijna letterlijk nog. Wat wél explodeerde is de moderne laag eromheen.
>
> Twee mappen, twee metingen, dezelfde commando's op allebei. Waar een getal uit 09/10/11 komt en ik het anders meet, zeg ik dat erbij.
>
> Padden zijn relatief aan `sfwd-lms/`. Klassen, functies en featurenamen staan in het Engels zodat je ze terugvindt.

---

## 0. De maat, opnieuw gemeten

| | 4.6.0 (mei 2023) | 5.1.8 (jul 2026) | |
|---|---:|---:|---|
| Bestanden totaal | 2.324 | **4.282** | +84% |
| PHP-bestanden | 1.709 | **3.315** | +94% |
| Omvang (apparent size) | 32,9 MB | **58,7 MB** | +78% |
| `includes/` PHP-regels (incl. `lib/`) | 333.780 | 348.653 | +4% |
| `includes/` PHP-regels (excl. `lib/` + `licensing/`) | 204.629 | 238.332 | +16% |
| `src/` PHP-regels | 21.743 | **102.042** | **+369%** |
| `themes/` PHP-regels | 23.641 | 36.958 | +56% |
| `vendor-prefixed/` PHP-regels | 10.224 | **109.198** | +968% |
| PHP-ondergrens (`LEARNDASH_MIN_PHP_VERSION`) | 7.3 | **7.4** | |
| WordPress-ondergrens (plugin-header) | *niet vermeld* | **6.7** ("Tested up to: 7.0.2") | |

De 38 MB → 68 MB uit de opdracht zijn de uitgepakte mappen inclusief clusterslack op NTFS; de apparent size hierboven is de eerlijke maat. De verhouding is dezelfde.

---

# Deel A — de bevindingen van 4.6.0, opnieuw getoetst

## A1. De moderne `src/`-laag versus het legacy `includes/`

### Verdict: **CHANGED — en dit is de grootste verandering in de hele vergelijking.**

**De LOC-verhouding.** Hoofdstuk 09 zei "6,5% gemoderniseerd" — dat getal is `src/` gedeeld door `includes/` inclusief de meegeleverde libraries. Met exact diezelfde noemer:

| | 4.6.0 | 5.1.8 |
|---|---:|---:|
| `src/` PHP-bestanden | 224 | **764** |
| `src/Core` PHP-bestanden | 64 | **482** |
| `src/` regels | 21.743 | **102.042** |
| `src/` ÷ `includes/` (incl. lib) | **6,5%** | **29,3%** |
| `src/` ÷ (alle eigen code) | 8,7% | **27,0%** |

De moderne laag is bijna vervijfvoudigd in regels en verdrievoudigd als aandeel. Dat is een echte, doorgezette modernisering — geen etalage.

Maar let op de andere helft van het beeld: **`includes/` is niet gekrompen, hij groeide 16%** (eigen code, exclusief de bundled libs en de nieuwe licentiemap). Er wordt dus niet zozeer *verplaatst* als wel *bijgebouwd* — de oude wereld blijft groeien terwijl de nieuwe sneller groeit. `includes/class-ld-lms.php` ging van 5.353 naar **5.537 regels**; `SFWD_LMS` erft nog steeds van `Semper_Fi_Module` (`includes/class-ld-semper-fi-module.php`, **exact 2.124 regels, ongewijzigd**, mét de `str_getcsv()`-polyfill voor PHP 5.2 er nog in). De god-klasse en zijn voorouder uit All in One SEO Pack zijn dus **STILL TRUE**, in 2026, in een plugin die nu PHP 7.4 eist.

Ook de drie generaties modellen staan er alle drie nog: `includes/classes/class-ldlms-model-*.php` telt onveranderd **17** bestanden, `includes/models/` onveranderd **4**, en `src/Core/Models/` groeide van 20 naar **31** bestanden. De begraafplaats uit hoofdstuk 09 §2 is niet geruimd, er is een vleugel bij gebouwd.

### De "not stable"-banners

### Verdict: **CHANGED — vrijwel verdwenen.**

Hoofdstuk 09 telde **204 van de 224** `src/`-bestanden (91%) met de banner *"NOTICE: This code is currently under development and may not be stable…"*.

In 5.1.8: **62 van de 764 bestanden (8,1%)**. En ze zitten geconcentreerd, niet verspreid:

| Waar | Aantal |
|---|---:|
| `src/views/themes/breezy/` | 40 |
| `src/Core/Mappers/Steps/` | 6 |
| `src/Core/Template/Views/` | 5 |
| `src/Core/Template/Steps/` | 4 |
| `src/Core/Themes/Breezy/` | 2 |
| `Shortcodes/`, `Models/Exam.php`, `Factories/` | 5 |

Twee derde van de resterende banners hoort dus bij één ding: het **Breezy**-thema. De rest van `src/Core` — modellen, repositories, services, betalingen, MCP, licensing — draagt geen voorbehoud meer. LearnDash heeft zijn moderne laag stilzwijgend van "experiment" naar "product" gepromoveerd.

### De feature flag `LEARNDASH_ENABLE_IN_PROGRESS_FEATURES`

### Verdict: **CHANGED — de poort staat open, de constante leeft nog voor precies één ding.**

`learndash-features-constants.php` is **byte-identiek**: nog steeds twee constanten, allebei `false`, met dezelfde "development purposes only"-kop.

Maar de root-provider is onherkenbaar. In 4.6.0 registreerde `src/Core/Provider.php` twee providers en viel daarna terug achter de flag. In 5.1.8 registreert hij zeven providers **onvoorwaardelijk**:

```php
$this->container->register( Libraries\Provider::class );
$this->register_actions();
$this->container->register( Licensing\Provider::class );
$this->container->register( Settings\Provider::class );
$this->container->register( Modules\Provider::class );
$this->container->register( Infrastructure\Provider::class );
$this->container->register( Themes\Provider::class );
$this->container->register( Mcp\Provider::class );
Version_Tracker::sync_version( … );
```

Geen `if`, geen `return`. De hele constante komt in de plugin nog op **exact twee regels** voor buiten zijn definitie, allebei in `src/Core/Themes/Breezy/Provider.php` (regels 123–124 en 131–132) — Breezy is dus het énige dat nog achter de vlag zit.

In plaats daarvan is er een **nieuw, zichtbaar mechanisme**: `src/Core/Modules/Experiments/` (Experiment, Experiments, Action_Item, Provider). Experimenten staan in de optie `learndash_experiments`, standaard leeg = uit, en de sitebeheerder zet ze zelf aan in een scherm. Dat is een echte opt-in-laag in plaats van een constante die je in `wp-config.php` moet hacken.

*Voor ons:* dit is precies de stap die wij nog niet gezet hebben. Onze `/lab`-pagina's zijn de constante-variant; een expliciete, zichtbare "dit is experimenteel, zet aan als je wilt"-laag hebben wij niet.

---

## A2. De quizmotor: nog steeds WP Pro Quiz 0.28 uit 2013?

### Verdict: **STILL TRUE. Vrijwel ongewijzigd.**

Dit is de meest opvallende continuïteit in de hele vergelijking. `includes/lib/wp-pro-quiz/` staat er nog, en de fossiele markers zijn intact:

| Bewijs | 4.6.0 | 5.1.8 |
|---|---|---|
| `readme.txt` → `Stable tag` | `0.28` | **`0.28`** |
| `readme.txt` → `Tested up to` | `3.6.1` (WP, aug 2013) | **`3.6.1`** |
| `wp-pro-quiz.php` → `Version:` | `0.28` | **`0.28`** |
| `wp-pro-quiz.php` → `Author:` | `Julius Fischer` | **`Julius Fischer`** |
| `WPPROQUIZ_VERSION` | `'0.28'` | `'0.29'` |
| PHP-bestanden | 72 | 73 |
| PHP-regels | 21.948 | 23.380 (+6,5%) |
| Laatste migratiestap | `upgradeDbV21` | `upgradeDbV22` |

Drie jaar leverde **één** nieuwe databasemigratie en 1.400 regels op. De readme is nooit aangeraakt; de interne versieconstante ging naar 0.29 terwijl de plugin-header op 0.28 bleef staan — die twee lopen nu zelfs uit elkaar.

**De nonce-ondertekende scoreverificatie uit hoofdstuk 11 §4c leeft.** `WpProQuiz_Controller_Admin::completedQuiz()` verifieert nog steeds `p_nonce` (punten) en `a_nonce` (antwoorden) en nult de waarden bij een ongeldige handtekening — alleen de regelnummers schoven op:

| | 4.6.0 | 5.1.8 |
|---|---:|---:|
| `p_nonce` aanwezig-check | 338 | 355 |
| `wp_verify_nonce( p_nonce )` | 352 | 369 |
| `a_nonce` aanwezig-check | 384 | 415 |
| `wp_verify_nonce( a_nonce )` | 410 | 441 |

Ook de strip-stap uit §4a is er nog — `WpProQuiz_View_FrontQuiz.php` haalt `points` en `correct` uit de ingebedde JSON voordat de pagina naar de browser gaat (regels 243–245; in 4.6.0 was dat 206–207, en de variabele heette toen `$quizData` in plaats van `$quiz_data`). En `answer_data` gaat nog altijd door `serialize()` in `WpProQuiz_Model_QuestionMapper::save()`.

**Conclusie: hoofdstuk 11 mag ongewijzigd blijven staan.** Alleen de regelnummers zijn achterhaald; elke inhoudelijke bevinding houdt stand.

---

## A3. Voortgangsopslag: nog steeds de geserialiseerde usermeta?

### Verdict: **STILL TRUE. Geen enkel spoor van een migratie naar tabellen.**

`includes/classes/class-ldlms-model-user-course-progress.php` heeft de meta-key nog hardgecodeerd:

```php
private $progress_meta_key = '_sfwd-course_progress';
```

(regel 36 in 4.6.0, regel 39 in 5.1.8 — de enige wijziging is dat er drie regels boven zijn bijgekomen.) Het aantal bestanden dat de key aanraakt ging van 14 naar 15; `_sfwd-quizzes` van 22 naar 24. De boomstructuur met `lessons` / `topics` / `completed` / `total` / `last_id` staat nog beschreven in dezelfde docblock.

Er zijn **geen nieuwe tabellen** (zie A4) en **geen data-upgrade** die voortgang naar een relationele vorm brengt. De activity-tabel is nog steeds de spiegel, de usermeta-blob nog steeds de bron.

*Voor ons:* de vergelijking uit hoofdstuk 10 §2 blijft dus geldig. Onze `lesson_progress`-tabel met een rij per (gebruiker, les) en een atomaire delta in één statement is nog altijd het andere ontwerp — de marktleider heeft die stap in drie jaar niet gezet.

---

## A4. De activity-tabel: unieke sleutel? 2038?

### Verdict: **STILL TRUE, en wel op de sterkst mogelijke manier: het bestand is byte-identiek.**

```
diff learndash-src/…/class-learndash-admin-data-upgrades-user-activity-db-table.php \
     learndash-src-518/…/class-learndash-admin-data-upgrades-user-activity-db-table.php
→ IDENTICAL
```

Dus onveranderd:

- **Géén `UNIQUE(user_id, course_id, post_id, activity_type)`** — negen losse indexen, en de uniciteit blijft een PHP-afspraak. Het commentaar dat dat viertal "Unique key part 1..4/4" noemt staat er nog steeds zonder dat de sleutel bestaat.
- **`activity_started` / `activity_completed` / `activity_updated` zijn nog steeds `int(11) unsigned`** — het 2038-probleem is niet aangeraakt, terwijl de id-kolommen gewoon `bigint(20)` zijn.
- De historische `ALTER TABLE`-patches uit 2.3.0.4 en 2.5.0 staan er nog bij.

Ook `includes/class-ldlms-db.php` registreert nog dezelfde twee tabellen onder dezelfde sleutels. De negen `wp_learndash_pro_quiz_*`-tabellen zijn er ook nog. **Nul nieuwe tabellen in drie jaar** — het hele nieuwe Commerce-model (orders, abonnementen, kaarten) leeft in postmeta op het `sfwd-transactions`-posttype.

---

## A5. Toegangscontrole: één poort, render-time?

### Verdict: **GEMENGD — de poort staat er nog, de "consolidate"-TODO is GONE, en er is één echte verharding bij.**

**De poort: STILL TRUE.** `includes/course/ld-course-user-functions.php` bevat nog steeds:

- `sfwd_lms_has_access()` — regel 75 → **regel 61**
- `sfwd_lms_has_access_fn()` — regel 99 → **regel 85**

**De docblock: GONE.** In 4.6.0 stond boven `ld_course_check_user_access()` letterlijk:

```php
 * @todo  duplicate function, exists in other places
 *        check it's use and consolidate
```

Die functie staat in 5.1.8 niet meer in `ld-course-user-functions.php`. Hij is verhuisd naar `includes/deprecated/5.0.0/functions.php:315`, en de `@todo` is vervangen door een besluit:

```php
 * @deprecated 5.0.0 Use `Product::user_has_access` instead.
```

De opruiming waar de TODO om vroeg is dus in 5.0.0 daadwerkelijk uitgevoerd: `Product::user_has_access` is nu de aangewezen route, en de dubbele wrapper is netjes afgeschoten in plaats van blijven staan. Dat is een reëel verschil met wat hoofdstuk 10 §4 beschreef.

**De render-only bescherming: STILL TRUE.** `includes/class-ld-cpt-instance.php` haakt nog steeds op:

```php
add_filter( 'the_content', array( $this, 'template_content' ), LEARNDASH_FILTER_PRIORITY_THE_CONTENT );
```

(regel 192 → regel 196). De lespost blijft een gepubliceerde WordPress-post; de bescherming zit in het filter. Elk pad dat `the_content` mist, toont de inhoud. Hoofdstuk 10 §4 "Render-only afdwinging" blijft dus overeind.

**Wat er wél bij kwam: échte bestandsbescherming.** `src/Core/Infrastructure/File_Protection/` (`@since 4.10.3`) is nieuw en beschermt vier upload-paden op schijfniveau in plaats van bij het renderen:

```php
'uploads_learndash_assignments' => 'learndash/assignments',
'uploads_learndash_essays'      => 'learndash/essays',
'uploads_assignments'           => 'assignments', // Legacy path (before 4.10.3).
'uploads_essays'                => 'essays',      // Legacy path (before 4.10.3).
```

`Path_Protection_Handler::init()` beveiligt die mappen, `File_Download_Handler::download()` levert bestanden daarna via PHP uit. Dat is het patroon dat *wel* data-time autorisatie is — maar het geldt alleen voor geüploade opdrachten en essays, niet voor lesinhoud.

---

## A6. Betalingen: bedrag/valuta hercontroleren, en trekt een refund toegang in?

### Verdict bedrag/valuta: **STILL TRUE — nog steeds geen hercontrole.**
### Verdict refund: **CHANGED, maar alleen in de nieuwe PayPal Checkout-keten.**

**Stripe is nagenoeg onveranderd.** `includes/payments/gateways/class-learndash-stripe-gateway.php` groeide van 1.536 naar 1.844 regels, maar de kern staat er hetzelfde:

- Nog steeds de **id-only server-side ophaal**: `$event = $this->api->events->retrieve( $event['id'] );` (regel 957 → **1170**). Onze eigen regel "geloof niets uit de payload behalve het id" blijft dus bevestigd door de marktleider.
- Nog steeds **geen HMAC-signatuurcheck** en nog steeds **geen vergelijking van `amount_total` / `currency` tegen de catalogusprijs** voordat toegang wordt verleend.
- Nieuw is een expliciete lijst van te verwerken events (`PROCESSABLE_WEBHOOK_EVENTS`) plus een filter `learndash_stripe_webhook_event_processable`. De lijst luidt:

  ```php
  checkout.session.completed
  invoice.payment_succeeded
  invoice.payment_failed
  customer.subscription.deleted
  coupon.deleted
  ```

  **Er staat geen enkel refund-event in.** Bij Stripe trekt een terugbetaling van een losse aankoop dus nog steeds geen toegang in — precies zoals in 4.6.0.

**PayPal is wél vernieuwd, en substantieel.** Naast de oude IPN-gateway staat nu een complete tweede keten in `src/Core/Modules/Payments/Gateways/Paypal/` (onboarding, kaartvaulting, orders, abonnementen). Die webhook (`Endpoints/Payments/Webhook.php`, `@since 4.25.0`) doet twee dingen die 4.6.0 niet deed:

1. **Handtekeningverificatie bij de bron.** Het endpoint is bewust publiek (`protected string $permission_required = '';`) met de motivering erbij: *"PayPal calls this endpoint unauthenticated. The request is instead verified by verify_webhook_signature()."* Die roept PayPal's eigen `v1/notifications/verify-webhook-signature` aan. Dat is een echte stap vooruit op de oude IPN-postback.
2. **Terugbetaling trekt toegang in.** Vier eventtypes vallen samen in één tak (regels 138–162):

   ```php
   case 'PAYMENT.ORDER.CANCELLED':
   case 'PAYMENT.CAPTURE.DENIED':
   case 'PAYMENT.CAPTURE.REFUNDED':
   case 'PAYMENT.CAPTURE.REVERSED':
       …
       $gateway->process_failed_payment(
           $custom_data['user_id'],
           $custom_data['product_ids'],
           Cancellation_Reason::REFUNDED()->getValue()
       );
   ```

   Er is zelfs een eigen enum voor de reden: `src/Core/Enums/Commerce/Cancellation_Reason.php`, met een leesbare tekst *"%s canceled because of a refund"*.

**Maar het bedrag wordt ook hier niet gecontroleerd.** `Payment_Gateway::process_successful_single_payment()` (`src/Core/Modules/Payments/Gateways/Paypal/Payment_Gateway.php:517`) haalt de producten op via `reference_id`, roept `add_access_to_products()` aan en boekt daarna de transactie. Nergens in dat pad wordt het gecaptureerde bedrag of de valuta tegen `$product->get_price()` gelegd. De invariant blijft: *wat wij bij het aanmaken van de sessie instelden, komt ongewijzigd terug.*

*Voor ons:* onze Mollie-webhook doet beide dingen — id-only ophalen **én** bedrag+valuta hercontroleren, atomair met het verlenen van het entitlement. Op dat tweede punt zijn wij na drie jaar nog steeds strenger dan LearnDash. En onze intrekking bij chargeback + volledige terugbetaling (PR #42/#44) heeft nu wél een tegenhanger bij LearnDash — bij één van de twee grote gateways.

**Bijvangst: een compleet nieuw Commerce-subsysteem.** `src/Core/Modules/Payments/` bevat nu ~80 bestanden: `Orders/` (admin listing, edit, delete, send invoice), `Subscriptions/` (Handler, Processor, Scheduler, Retry_Scheduler, Retry_Email_Trigger, Logger), vier dunning-mails (`Initial_Payment_Failed`, `Second_Attempt_Failed`, `Final_Attempt_Coming_Up`, `Payment_Failed_Access_Revoked`) en een migratiepad `Paypal_Standard → Paypal Checkout` inclusief achtergrondverwerking. Bijbehorende modellen: `src/Core/Models/Commerce/{Order,Subscription,Charge,Card,One_Time_Payment,Product}.php`.

---

## A7. Deprecatieschuld

### Verdict: **CHANGED — flink gegroeid, en precies volgens hetzelfde recept.**

| | 4.6.0 | 5.1.8 |
|---|---:|---:|
| `_deprecated_function()`-aanroepen | 236 | **386** |
| `_deprecated_file()`-aanroepen | 13 | **23** |
| `_deprecated_hook()`-aanroepen | 0 | **1** |
| Versiemappen in `includes/deprecated/` | 18 | **24** |
| Bestanden in `includes/deprecated/` | 19 | **25** |
| Regels in `includes/deprecated/` | 2.966 | **6.588** |
| Bestanden in `src/deprecated/` | 7 | **15** |
| `@deprecated`-annotaties | 346 | **569** |

Nieuwe versiemappen: `4.7.0.1`, `4.11.0`, `4.17.0`, `4.18.0`, `4.20.1.1`, `5.0.0`. **De oudste map is nog steeds `2.3.0`** — code uit 2016, in 2026 nog altijd meegeleverd. Tien jaar backwards compatibility, nu 6.588 regels dode code in plaats van 2.966.

Het patroon uit hoofdstuk 09 (§8: "ze verwijderen niets, ze verplaatsen") is dus niet alleen bevestigd maar in de major-release volgehouden: **zelfs bij de sprong van 4.x naar 5.0 is er niets weggegooid.** Er kwam alleen een `5.0.0/`-map bij. Voor een hoofdversiewissel is dat opmerkelijk — de meeste projecten gebruiken juist het major-nummer om schoon te vegen.

---

## A8. Tests en build-config in de gedistribueerde ZIP

### Verdict: **STILL TRUE — en de release is nu nóg strakker gestript.**

Beide bomen bevatten:

- geen `phpunit.xml`, geen `codeception*.yml`, geen `phpstan.neon`, geen `.phpcs.xml`
- geen `composer.json` of `package.json` op pluginniveau
- geen `.editorconfig`, geen CI-configuratie
- **nul** mappen die `tests`, `test` of `__tests__` heten (buiten `vendor`/`includes/lib`)

Eén ding is wél veranderd, en het gaat de verkeerde kant op voor een lezer: hoofdstuk 09 merkte op dat de meegeleverde `stellarwp/db` en `stellarwp/models` hun `codeception.dist.yml` wél meestuurden. **Dat klopt niet meer.** Het aantal `composer.json`-bestanden in de hele boom ging van **6 naar 0**; de StellarWP-libraries komen nu via `vendor-prefixed/` binnen zonder enige metadata. De release is dus consequenter gestript — je ziet nu helemaal geen testopstelling meer, van niemand.

**De onzekerheid uit hoofdstuk 09 blijft staan en wordt hier herhaald:** dit is een distributie-ZIP, geen repository-checkout. Dat LearnDash geen tests verscheept, bewijst niet dat LearnDash niet test. Wat je er wél uit mag afleiden is precies wat 09 al zei: een klant, consultant of add-on-bouwer heeft geen manier om de plugin tegen zijn eigen aanpassingen te toetsen.

---

## A9. De losse tellers uit hoofdstuk 09, opnieuw

Ter volledigheid, zelfde patronen, beide bomen, eigen code (`includes/` + `src/` + `themes/`):

| | 4.6.0 | 5.1.8 |
|---|---:|---:|
| `do_action(` | 551 | 623 |
| `apply_filters(` | 1.455 | 1.839 |
| filters per actie | 2,6 | **3,0** |
| `phpcs:ignore` | 1.837 | 2.034 |
| `@since` | 7.671 | **12.611** |
| `learndash_get_custom_label` | 1.156 | **2.169** |
| bestanden met `declare( strict_types` | **0** | **13** |
| REST-controllers in `includes/rest-api/` | 48 | 48 |
| `sfwd_lms.php` regels | 216 | 269 |
| `require_once` in `learndash-includes.php` | 75 | 74 |

Twee dingen springen eruit. **De v1/v2-REST-laag is volledig bevroren** — exact 48 controllers, geen enkele erbij, geen enkele afgeschoten; de vernieuwing gebeurt in een compleet nieuwe namespace (zie B). En **`declare( strict_types )` is eindelijk ergens verschenen**, maar in 13 van 3.315 PHP-bestanden — dat is 0,4%, dus meer een intentieverklaring dan een praktijk.

De hook-oppervlakte groeide met ~13% en de verhouding filters:acties liep op van 2,6 naar 3,0. De moat uit hoofdstuk 09 §9 punt 2 wordt dus eerder breder dan smaller.

---

# Deel B — wat er écht nieuw is in 5.x

## B1. "Angie" en de MCP-server — kleiner en slimmer dan het klinkt

Eerst een correctie die je moet kennen: **Angie is niet van LearnDash.** Angie is de AI-agent-SDK van **Elementor**. Wat LearnDash bouwde, is een **MCP-server die zichzelf in Angie inplugt**. LearnDash levert dus geen model, geen API-sleutel en geen chatvenster voor dit stuk — alleen gereedschap dat de agent van iemand anders mag gebruiken.

**De PHP-kant is minuscuul: twee bestanden.**

- `src/Core/Mcp/Provider.php` (`@since 5.0.0`) — bindt één singleton en hangt hem op `init`.
- `src/Core/Mcp/Asset_Loader.php` — registreert één script.

De hele koppeling zit in die tweede:

```php
private const ANGIE_HANDLE = 'ld-mcp-angie';
…
Asset::add( self::ANGIE_HANDLE, 'angie.js' )
    ->set_dependencies( 'angie-app' )
    ->set_path( 'src/assets/dist/js/mcp/', false )
    ->add_localize_script( 'LearnDashMcpServerOptions', [ 'adminUrl' => admin_url() ] )
    ->set_condition(
        static fn(): bool => defined( 'ANGIE_VERSION' ) && current_user_can( 'use_angie' )
    )
    ->register();
```

Twee voorwaarden: de Angie-plugin moet aanwezig zijn (`ANGIE_VERSION`) én de gebruiker moet de capability `use_angie` hebben. Zonder Elementor's Angie gebeurt er niets.

**De JS-kant is 337 kB** (`src/assets/dist/js/mcp/angie.js`, afhankelijkheid `wp-api-fetch`). Dat is een volledige MCP-serverimplementatie die **in de browser** draait. De server heet `LearnDash`, id `learndash-mcp`, en registreert **exact twee tools**:

| Tool | Wat hij doet |
|---|---|
| `get-learndash-api-info` | levert het endpoint-manifest met samenvattingen |
| `make-learndash-api-request` | voert een REST-aanroep uit (GET/POST/PUT/PATCH/DELETE) |

Er zit een uitgeschreven systeeminstructie bij die de agent een verplichte volgorde oplegt: manifest ophalen → **eerst het `href`-detail van het endpoint ophalen** → pas dan de echte aanroep. Letterlijk uit de bundel:

> *"⚠️ CRITICAL: Never guess at parameters — always fetch the `href` endpoint details first to understand the complete schema. This applies to ALL HTTP methods including GET."*

En een waarschuwing die je alleen schrijft als je het hebt zien misgaan:

> *"⚠️ MUST assign lessons/topics to courses using /sfwd-courses/{id}/steps endpoint. Without proper structure assignment, courses are NON-FUNCTIONAL."*

De opgesomde mogelijkheden beslaan cursussen (incl. prijzen, prerequisites, toegangsverval), groepen, lessen/topics, cursusstructuur, opdrachten, inschrijvingen en groepsbeheer.

**Hoe het aan de serverkant hangt.** De agent praat niet met een aparte AI-backend, maar met de gewone WordPress-REST-API via `wp-api-fetch` — dus met de rechten van de ingelogde beheerder, in diens eigen browsersessie. Er is geen aparte sleutel en geen uitgaande verbinding naar een LearnDash-server. Wat er wél nieuw voor gebouwd is:

- Een **nieuwe REST-namespace `learndash/v1`** (`src/Core/Modules/REST/V1/Contracts/Endpoint.php:34`), naast — niet in plaats van — de bestaande `ldlms/v1` en `ldlms/v2`.
- Het manifest zelf: `src/Core/Modules/REST/V1/Endpoints/Manifest/Manifest.php`, gevoed door `Manifest/Manifest_Generator.php` en `Manifest/Ref_Replacer.php`.
- Een complete **OpenAPI-documentatielaag**: `src/Core/Modules/REST/Documentation_Migration/OpenAPI/` met per resource een Endpoint- en een Schema-klasse (Courses, Groups, Lessons, Topics, Quizzes, Users, Assignments, Essays, Exams, …). Dát is waar de manifest-samenvattingen vandaan komen.
- Een **experimentele poort op headerniveau**. `Contracts\Endpoint` heeft `protected bool $experimental = true;` en:

  ```php
  if ( 'allow' !== strtolower( … $request->get_header( 'Learndash-Experimental-Rest-Api' ) ) ) {
      return new WP_Error( 'rest_not_allowed', …, [ 'status' => 403 ] );
  }
  ```

  Zonder die header krijg je 403. De PayPal-webhook is de expliciete uitzondering — met de reden erbij in de docblock: *"PayPal can't send the special LD header."*

*Voor ons:* dit is een interessant patroon los van AI. Zij versionneren hun API-vernieuwing niet met `v3` maar met **een nieuwe namespace plus een opt-in-header**, zodat de nieuwe endpoints publiek meereizen zonder dat iemand er per ongeluk op gaat leunen. Dat is goedkoper dan een tweede map naast de eerste (wat hoofdstuk 09 §7 als overdraagbaar aanwees) en het geeft je een terugweg.

## B2. LearnDash' eigen AI: OpenAI, met de sleutel van de sitebeheerder

Los van Angie/MCP heeft LearnDash een eigen AI-laag, en die is in drie jaar van twee bestanden naar 31 gegroeid.

**Eén service, één provider, één model.** `src/Core/Services/ChatGPT.php`:

- endpoint `https://api.openai.com/v1/chat/completions`, aangeroepen met `wp_remote_request()`
- `private const MODEL = 'gpt-3.5-turbo'`, `MODEL_MAX_CONTEXT_WINDOW_TOKENS = 16385`
- temperature 0.9 en top_p 0.7 als defaults, met een filter `learndash_service_chatgpt_model_max_context_window_tokens`

Dat is in juli 2026 een opvallend oud model om als enige constante in te bakken.

**De sleutel is die van de klant.** `src/Core/Modules/AI/Provider.php`:

```php
$options        = get_option( 'learndash_ai_integrations' );
$openai_api_key = is_array( $options ) && ! empty( $options['openai_api_key'] ) ? $options['openai_api_key'] : '';
$this->container->when( ChatGPT::class )->needs( '$api_key' )->give( $openai_api_key );
```

De sitebeheerder plakt zijn eigen OpenAI-sleutel in `LearnDash_Settings_Section_AI_Integrations`, of laat hem opslaan door de Virtual Instructor-setupwizard (`AI/Virtual_Instructor/AJAX/Process_Setup_Wizard.php:144`). LearnDash zit dus niet tussen de klant en OpenAI in — geen doorverkoop, geen eigen quota, maar ook geen kostenbeheersing voor de klant.

Eén structureel detail dat je moet weten voordat je dit patroon kopieert: de sleutel wordt op twee plaatsen aan een adminscherm meegegeven als scriptvariabele (`AI/Course_Outline.php:237` en `AI/Quiz_Creation/View.php:390`, allebei `'api_key' => $this->chatgpt->get_api_key()`). De sleutel bereikt dus de browser van de beheerder. Dat is een ontwerpkeuze, geen bevinding — maar het is precies het soort keuze dat wij bij het bouwen van de studiecoach níét willen maken.

**Vier oppervlakken.**

| Feature | Bestanden | Stand |
|---|---|---|
| **Course Outline** (cursusopzet genereren) | `AI/Course_Outline.php` | bestond al in 4.6.0 |
| **Quiz Creation** (quiz uit lesmateriaal) | `AI/Quiz_Creation.php` + `Quiz_Creation/{Parser,Repository,View}` + 6 DTO's | nieuw |
| **ChatGPT Summarizer** | `AI/ChatGPT_Summarizer.php` | nieuw |
| **Virtual Instructor** (AI-tutor in de les) | `AI/Virtual_Instructor/` — 18 bestanden | nieuw, experimenteel |

**Virtual Instructor** is het grootste stuk en verdient uitleg, omdat het precies onze College+-vraag raakt. Het is:

- Een **nieuw posttype `ld-virt-instructor`** (`LDLMS_Post_Types::VIRTUAL_INSTRUCTOR`) — je maakt een instructeur aan als content, met een eigen `custom_instruction` (systeemprompt), en koppelt hem aan cursussen of groepen.
- Een **frontend-chat** met AJAX-endpoints `Chat_Init`, `Chat_Input`, `Chat_Send`, een `Chat_Session` die de geschiedenis naar `ChatGPT::send_command()` voert, en `Chat_Message` als model.
- Met een **expliciete resolutievolgorde** in `Virtual_Instructor/Repository::get_by_course_id()`: cursusspecifiek → groepsspecifiek → globaal-per-groep → globaal. Vier niveaus, in die volgorde, met de eerste treffer die wint.
- **Achter de experimentenvlag.** `Virtual_Instructor/Experiment.php` registreert zich als experiment `virtual_instructor`; `Experiment::is_enabled()` kijkt naar de optie `learndash_experiments`, standaard leeg. In het scherm staan twee knoppen: "Give Feedback" (een Google Form) en "Learn More" (`go.learndash.com/viexperiment`).

*Voor ons:* dit is de marktleider die exact het ding bouwt dat in `docs/college-plus-concept.md` staat — en hem na drie jaar nog steeds als *experiment* aanbiedt, met een feedbackformulier eraan geplakt, op gpt-3.5-turbo, met de sleutel van de klant. Dat is geen bewijs dat het niet werkt, maar het is wel een sterk signaal dat ze er zelf nog geen productbelofte op durven te zetten. Onze eigen redenering — "de oefenlaag draagt het abonnement, niet de bibliotheek" — wordt hier eerder bevestigd dan weerlegd: LearnDash durft het niet als kernfeature te verkopen.

## B3. Nieuwe mappen, nieuwe subsystemen, gebundelde add-ons

**Nieuw in de hoofdmap:** `LICENSE`, `auth-email.php`, `auth-token.php`. Die laatste twee zijn geen code maar één regel `return '…';` — de licentiesleutel en het e-mailadres worden **in de download zelf gebakken**. `includes/licensing/src/traits/license.php` (regels 61–84) leest ze als de licentie nog niet in de database staat, en verwijdert ze bij deactivering (regels 200–205). Het `src/Core/Libraries/Harbor/Addon_Legacy_Licenses.php` doet hetzelfde voor add-ons. *Praktisch gevolg: een LearnDash-ZIP is persoonlijk. Deel hem niet, en zet hem niet in een publieke repo — de token staat erin.*

**Nieuw in `src/Core/`** (naast het bestaande Models / Modules / Payments / Template / Themes): `API`, `Collections`, `Enums`, `Factories`, `Infrastructure`, `Libraries`, `Licensing`, `Mappers`, `Mcp`, `Repositories`, `Services`, `Settings`, `Shortcodes`, `Utilities`, `Validations`, `Version_Tracker.php`. Dat is de complete gereedschapskist van een moderne PHP-applicatie, in drie jaar naast de oude wereld neergezet.

**Nieuw in `src/`:** `admin_views/` met **109** PHP-templates — de nieuwe beheerschermen (dashboards, orders, abonnementen, experimenten, licentie) draaien op de moderne view-laag in plaats van op de `LearnDash_Settings_*`-klassen.

**Nieuw in `src/Core/Modules/`:** `AJAX`, `Admin` (Banner, Header, Migrations), `Course_Grid`, `Course_Reviews`, `Customizer`, `Experiments`, `Extras`, `Licensing`, `Payments`, `Quiz`, `REST`, `Registration`, `Reports`, `Support`.

**Drie commerciële add-ons zitten nu in de doos.** Dit is misschien wel de belangrijkste productverandering:

| Nieuwe map in `includes/` | Wat het was | Bestanden |
|---|---|---:|
| `reports/` | **ProPanel** (`Plugin Name: LearnDash LMS - ProPanel`, `Version: 2.2.2`) — losse betaalde rapportage-add-on | 212 |
| `course-grid/` | **Course Grid** — losse betaalde add-on | 73 |
| `course-reviews/` | **Course Reviews** — losse betaalde add-on | 17 |
| `licensing/` | **learndash-hub**, `HUB_VERSION = '1.3.2'` — was een ZIP in `mu-plugins/` | 12 MB |

De Hub verdient een aparte noot omdat hoofdstuk 09 §3 er expliciet over ging. **`mu-plugins/learndash-hub.zip` is weg.** `mu-plugins/setup.php` is van 2.239 naar 940 bytes gekrompen en doet nu nog exact één ding: bij multisite `learndash-multisite.php` naar `WPMU_PLUGIN_DIR` kopiëren. De licentiemanager wordt niet meer stilzwijgend als aparte plugin geïnstalleerd — hij is gewoon onderdeel van de plugin geworden. **Dat is een van de eigenaardigheden uit hoofdstuk 09 die is opgelost.** (`plugins/kadence-starter-templates.zip` staat er nog, byte-identiek.)

**Nieuwe databasetabellen: nul.** Zie A4.
**Nieuwe posttypes: één.** `LDLMS_Post_Types` ging van 12 naar 13 constanten; `VIRTUAL_INSTRUCTOR => 'ld-virt-instructor'` is de enige toevoeging. Alle andere nieuwe concepten (orders, abonnementen, kaarten) leunen op bestaande posttypes en postmeta.

## B4. Afhankelijkheden: Strauss won, en `includes/lib/` verloor

De grootste hygiëneverbetering in de hele vergelijking zit hier.

| | 4.6.0 | 5.1.8 |
|---|---:|---:|
| `vendor-prefixed/` PHP-bestanden | 93 | **1.019** |
| `vendor-prefixed/` regels | 10.224 | **109.198** |
| Pakketten in `vendor/composer/installed.json` | 5 | **26** |
| `includes/lib/` bibliotheken | 7 | **5** |

**`stripe-php` (228 bestanden) en `razorpay-php` (100 bestanden) zijn uit `includes/lib/` verdwenen en als `stripe/stripe-php` en `razorpay/razorpay` in `vendor-prefixed/` opgedoken.** Dat is precies het probleem dat hoofdstuk 09 §3 beschreef: ongeprefixte vreemde code die botst zodra een andere plugin dezelfde library meebrengt. Twee van de zwaarste kandidaten zijn nu Strauss-geprefixt. Wat er in `includes/lib/` overblijft:

| Bibliotheek | 4.6.0 | 5.1.8 |
|---|---:|---:|
| TCPDF | 78 bestanden / 61.477 regels | 77 / 61.421 |
| wp-pro-quiz | 72 / 21.948 | 73 / 23.380 |
| action-scheduler | 81 / 12.038 | 82 / 13.431 |
| parsecsv-for-php | 7 / 1.744 | 7 / 1.744 |
| paypal (IPN listener) | 3 / 1.211 | 3 / 1.225 |
| ~~stripe-php~~ | 228 / 18.960 | — |
| ~~razorpay-php~~ | 100 / 10.096 | — |

TCPDF is nog steeds ~61.000 regels ongeprefixte PDF-generator die elke installatie meesleept, of je nu ooit een certificaat maakt of niet.

**Nieuwe StellarWP-bibliotheken** (bovenop `container-contract`, `db`, `models`, `telemetry`): `admin-notices`, `arrays`, `assets`, `field-conditions`, `harbor`, `licensing-api-client`, `licensing-api-client-wordpress`, `superglobals`, `validation`. De gedeelde infrastructuurlaag van de StellarWP-portfolio (hoofdstuk 07) is dus fors uitgebreid — `assets` verklaart de nieuwe `Asset::add(…)`-syntax die je overal in `src/` ziet, `harbor` is de licentiekoppeling.

**Nieuwe derde partijen, allemaal geprefixt:** `nyholm/psr7`, `psr/http-client`, `psr/http-factory`, `psr/http-message` (een echte PSR-7/18-HTTP-laag), `rmccue/requests`, `myclabs/php-enum` (vandaar `Cancellation_Reason::REFUNDED()`), `scssphp/scssphp` (SCSS compileren op de server — dat is de Breezy/Customizer-laag), `ssnepenthe/color-utils`, `trustedlogin/client` (ondersteuning die tijdelijk namens jou mag inloggen).

`vendor/` is in beide versies gestript tot alleen autoload-metadata; in 5.1.8 zelfs zonder de README's en `composer.json`-bestanden die er in 4.6.0 nog bij zaten.

## B5. Waar die 30 MB nu echt in zit

Gemeten met `du --apparent-size`, per map:

| Map | 4.6.0 | 5.1.8 | Verschil |
|---|---:|---:|---:|
| `includes/` | 14,4 MB | 27,0 MB | **+12,6** |
| `vendor-prefixed/` | 0,3 MB | 7,4 MB | **+7,1** |
| `src/` | 1,3 MB | 4,6 MB | +3,3 |
| `assets/` | 10,5 MB | 12,8 MB | +2,3 |
| `themes/` | 1,9 MB | 3,0 MB | +1,1 |
| `languages/` | 0,9 MB | 1,4 MB | +0,5 |
| `plugins/` | 0,2 MB | 0,2 MB | 0 |
| `vendor/` | 0,9 MB | 0,6 MB | −0,3 |
| `mu-plugins/` | 1,6 MB | 0,04 MB | **−1,6** |
| **Totaal** | **32,9 MB** | **58,7 MB** | **+25,8** |

Binnen `includes/`:

| | 4.6.0 | 5.1.8 |
|---|---:|---:|
| `licensing/` | — | **11,8 MB** |
| `lib/` | 7,3 MB | 5,6 MB |
| `settings/` | 1,8 MB | 1,9 MB |
| `reports/` | — | 1,5 MB |
| `admin/` | 1,3 MB | 1,4 MB |
| `course-grid/` | — | 0,6 MB |

En dan de pointe. Van die 11,8 MB in `includes/licensing/` zit **11,6 MB in `assets/`**, en daarvan is **9,6 MB vier bestanden**:

```
includes/licensing/assets/css/fontawesome.css           2,4 MB
includes/licensing/assets/css/fontawesome.min.css       2,4 MB
includes/licensing/assets/css/fontawesome-rtl.css       2,4 MB
includes/licensing/assets/css/fontawesome.min-rtl.css   2,4 MB
```

Plus 1,1 MB aan Font Awesome-fontbestanden (`.eot`, `.ttf`, `.woff`, …) ernaast.

**Ruim een derde van de totale groei van de plugin — 9,6 van de 25,8 MB — is vier kopieën van Font Awesome in de adminschermen van de licentiemanager.** Niet AI, niet Commerce, niet de moderne laag. In 4.6.0 zat datzelfde spul in `learndash-hub.zip` (1,7 MB *gecomprimeerd*, en pas bij activatie uitgepakt); nu reist het ongecomprimeerd mee in elke download en op elke installatie.

De rest van de groei is wél inhoudelijk: `vendor-prefixed` (+7,1) is Stripe en Razorpay die van elders kwamen plus de nieuwe StellarWP-laag, `src/` (+3,3) is de moderne code en de MCP-bundel, `assets/images` ging van 2,1 naar 3,8 MB.

---

## Wat dit betekent voor onze kennisbank

**De grote bevindingen van 4.6.0 hebben het overleefd.** Dat is de kern. Van de acht getoetste punten zijn er vier ongewijzigd (quizmotor, voortgangsopslag, activity-schema, geen tests), twee gedeeltelijk veranderd (toegangscontrole, betalingen) en twee wezenlijk veranderd (de `src/`-laag, de deprecatieschuld). Er is niets omgevallen.

**Welke hoofdstukken een kanttekening nodig hebben:**

- **09 (architectuur)** — het zwaarst geraakt. De kernbewering "de herschrijving is 6,5% klaar" is achterhaald: het is 29,3%, en de "not stable"-banners zijn van 91% naar 8% gegaan. Ook achterhaald: de bewering dat de StellarWP-libs hun testconfig meesturen (dat doen ze niet meer), en de `mu-plugins/learndash-hub.zip`-eigenaardigheid (die is opgelost — de Hub zit nu gewoon in de plugin). Wat wél overeind blijft en zelfs sterker is geworden: de god-klasse, de `Semper_Fi_Module`-erfenis, de drie modelgeneraties, de docblockdiscipline, de filter/actie-verhouding, en het "we verwijderen niets, we verplaatsen"-patroon.
- **10 (datamodel en betalingen)** — twee correcties. De `@todo duplicate function … consolidate` bestaat niet meer; die opruiming is in 5.0.0 uitgevoerd en `Product::user_has_access` is nu de aangewezen route. En "een refund trekt geen toegang in" moet worden: *bij Stripe niet, bij de nieuwe PayPal Checkout-keten wél.* De rest van het hoofdstuk — twee bronnen van waarheid, render-only bescherming, geen unieke sleutel, geen bedragcontrole in de webhook — is ongewijzigd waar.
- **11 (quizmotor)** — **geen inhoudelijke correctie nodig.** Alleen de regelnummers zijn verschoven (ik heb de zes belangrijkste hierboven bijgewerkt) en `WPPROQUIZ_VERSION` staat op 0.29 terwijl de readme en de plugin-header nog 0.28 zeggen. Dit hoofdstuk is drie jaar later nog steeds accuraat, wat op zichzelf de conclusie van dat hoofdstuk bewijst.
- **02 (quizzen)** en **03 (toegang en verkoop)** — inhoudelijk niet geraakt, maar de featurelijst is verouderd: Course Grid, Course Reviews en ProPanel zijn geen losse add-ons meer.
- **07 (ecosysteem en markt)** — de StellarWP-infrastructuurlaag is fors uitgebreid, en het feit dat drie betaalde add-ons in de kern zijn opgenomen is marktrelevant.
- **08 (lessen voor Beleggingscollege)** — één toevoeging waard: de marktleider bouwde onze AI-studiecoach (Virtual Instructor) en durft hem na drie jaar nog steeds alleen als opt-in-experiment aan te bieden.

**Wat wij hieruit meenemen, kort:**

1. ~~**Onze webhookregel blijft strenger.**~~ ⚠️ **Deze conclusie is in de verificatieronde onderuitgehaald — zie hoofdstuk 17.** LearnDash haalt het event id-only op (goed, en nog steeds ons patroon), maar het is níét waar dat geen enkele gateway bedrag en valuta hercontroleert: de PayPal-keten doet dat sinds 4.20.1 wél, inclusief `revoke_access()` bij verschil. Bij Stripe/Razorpay ontbreekt het omdat het bedrag daar nooit langs de klant komt. Onze regel is dus **gelijkwaardig**, niet strenger — en blijft precies zoals hij is.
2. **Hun experimenten-laag is beter dan onze `/lab`-pagina's.** Een zichtbare opt-in met een naam, beschrijving en feedbacklink is een nettere vorm dan een noindex-pagina die je moet kennen.
3. **Hun REST-vernieuwing gebeurt via een nieuwe namespace plus een opt-in-header, niet via een `v3`.** Dat is goedkoper dan wat hoofdstuk 09 §7 aanbeval en het geeft je een terugweg.
4. **Een gebakken licentietoken in de download** is een reden om LearnDash-ZIP's nooit ergens te delen of te committen.

## Onzekerheden, eerlijk benoemd

- **Beide bomen zijn distributie-ZIP's, geen repository-checkouts.** Alles wat ik over tests, build-config en dev-tooling zeg, gaat over wat er *verscheept* wordt. Het zegt niets over hoe LearnDash intern werkt.
- **LOC-tellingen zijn kale regels**, inclusief commentaar en witregels. Met 12.611 `@since`-annotaties in 5.1.8 is het aandeel docblock hier substantieel; "102.042 regels `src/`" is geen 102.042 regels logica.
- **De banner-telling (204→62) is een tekstmatch op één zin.** Als LearnDash de formulering ergens heeft aangepast, tel ik dat bestand niet mee en is 62 een ondergrens. Ik heb de gevonden banners steekproefsgewijs op identieke formulering gecontroleerd, niet allemaal.
- **`angie.js` is geminificeerd.** Toolnamen, de systeeminstructie en de servernaam heb ik uit de bundel gelezen; ik heb de MCP-server niet gedraaid en niet met Angie erbij getest. De twee toolnamen zijn samengesteld uit template-literals (`get-${Ra}-api-info` met `Ra = "learndash"`) — ik heb `Ra` in dezelfde bundel teruggevonden, maar het blijft een leesbewering, geen runtime-observatie.
- **Ik heb `plugins/kadence-starter-templates.zip` niet uitgepakt**, net als in hoofdstuk 09.
- **Het betaalpad is op de happy path getraceerd.** Ik heb de Stripe-abonnementstakken en de PayPal Standard→Checkout-migratie niet regel voor regel gevolgd; het is mogelijk dat er in een tak die ik niet las alsnog een bedragcontrole zit. Wat ik wél zeker weet: in de hoofdroute naar `add_access_to_products()` staat er geen.
- **Hoofdstuk 09's telling `learndash_get_custom_label` (1.156) reproduceer ik exact** met het kale patroon, maar mijn eerdere telling met haakje gaf 494. Vergelijk tellingen dus alleen binnen dit hoofdstuk, waar beide bomen met hetzelfde commando gemeten zijn — niet tussen hoofdstukken door.
- **De datum van 5.1.8 leid ik af uit de bestandsdatums (22 juli 2026) en de plugin-header**, niet uit een officiële releasenotitie.
- **`src/assets/`, `assets/` en de nieuwe adminschermen zijn niet inhoudelijk geanalyseerd** — 12,8 MB JS/CSS/afbeeldingen komt hier alleen als omvang voor.
