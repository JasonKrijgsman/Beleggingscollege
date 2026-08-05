# LearnDash 9 — Architectuur en engineeringpraktijk, gelezen in de broncode

> Onderdeel van de LearnDash-kennisbank (5 aug 2026). De hoofdstukken 01–08 zijn gebouwd op de officiële documentatie: wat LearnDash *zegt* dat het kan. Dit hoofdstuk leest de **broncode** van `sfwd-lms` **versie 4.6.0 (release 31 mei 2023)**, uit Jasons eigen licentiearchief — een geldige, betaalde kopie waar we niets van herpubliceren, alleen uit leren.
>
> ⚠️ **Inmiddels is 5.1.8 opgehaald en ernaast gelegd — lees `12-broncode-4.6-vs-5.1.8.md` erbij.** Dit hoofdstuk werd van alle het zwaarst geraakt: "de herschrijving is 6,5% klaar" is achterhaald (het is 29,3%, en de "not stable"-banners zakten van 91% naar 8%). De *patronen* die hieronder staan — de god-klasse, de `Semper_Fi_Module`-erfenis, drie modelgeneraties naast elkaar, de filter/actie-verhouding, "we verwijderen niets, we verplaatsen" — staan alle nog overeind en zijn eerder sterker geworden.
>
> **Dit is een momentopname en die is oud.** 4.6.0 is de laatste versie die in het archief zit; de actuele lijn is 5.x (sinds feb 2026). Alles hieronder beschrijft dus de plugin zoals hij er in mei 2023 uitzag, midden in een verbouwing die inmiddels drie jaar verder is. Getallen die je hier leest — bestandstellingen, hooktellingen — kloppen exact voor 4.6.0 en vrijwel zeker niet meer voor 5.x. Wat wél overdraagbaar is: de *patronen*, en hoe een volwassen commerciële codebase zichzelf incrementeel moderniseert.
>
> Featurenamen, klassen en functies staan in het Engels zodat je ze terugvindt. Codefragmenten zijn kort en illustratief — dit is propriëtaire code, we analyseren hem, we drukken hem niet af.

## 0. De maat van het ding

Zodat je weet waar we het over hebben:

| | Aantal |
|---|---|
| Bestanden totaal | 2.324 |
| PHP-bestanden totaal | 1.709 |
| PHP-regels totaal | ~393.000 |
| PHP-bestanden **eigen code** (excl. `includes/lib/`, `vendor*/`) | ~1.010 |
| PHP-regels **eigen code** | ~252.000 (`includes/` 206.289 + `src/` 21.743 + `themes/` 23.641) |
| Meegeleverde libraries in `includes/lib/` | 7 bibliotheken, ~127.000 regels |
| Globale `learndash_*`/`ld_*`/`sfwd_*` functies | ~678 unieke |
| Klassedeclaraties | ~956 |
| Assets (JS/CSS/afbeeldingen) | 12 MB |

De grootste eigen bestanden: `includes/class-ld-lms.php` (5.353 regels), `includes/ld-groups.php` (2.945), `themes/ld30/includes/helpers.php` (2.944), `includes/course/ld-course-progress.php` (2.904). Ter kalibratie: onze hele Next.js-codebase past ruim binnen die eerste vier bestanden.

*Vergelijk met ons:* onze `src/` telt een fractie hiervan, en dat is niet armoede maar het verschil tussen één winkel en een platform dat elke denkbare LMS-configuratie moet ondersteunen.

## 1. Bootstrap: hoe de plugin start

Het hoofdbestand `sfwd_lms.php` is opvallend **klein — 217 regels**. Het doet vijf dingen en verder niets:

1. Twee autoloaders binnenhalen: `vendor/autoload.php` (Composer) en `vendor-prefixed/autoload.php` (Strauss, zie §3).
2. De versie- en padconstanten definiëren, dan `learndash-scalar-constants.php` (31 kB, **77 `define()`'s**) includen.
3. Drie losse `plugins_loaded`-handlers registreren, elk met een eigen prioriteit.
4. Activatie/deactivatie-hooks.
5. Twee publieke helperfuncties: `learndash_register_provider()` en `learndash_extra_autoloading()`.

Die prioriteiten zijn de hele laadvolgorde, en ze zijn expliciet uitgeschreven:

```php
add_action( 'plugins_loaded', /* Action Scheduler */, -10 );
add_action( 'plugins_loaded', /* Container + Telemetry + DB */, 0 );
add_action( 'plugins_loaded', /* learndash-includes.php … */, 0 );
```

Action Scheduler eerst (die moet er zijn vóór iets een taak plant), dan de DI-container en de StellarWP-pakketten, dan pas de klassieke `require_once`-lawine. Die laatste sluit af met `do_action( 'learndash_files_included' )` — nieuw in 4.6.0, en precies het haakje waarop `SFWD_LMS` zijn service provider registreert.

`learndash-includes.php` is de klassieke laag: **472 regels met 75 `require_once`-statements**, in vaste volgorde, met een commentaarblok boven elke regel. Geen autoloading, geen conditionele laadstrategie — alles wordt altijd ingeladen. Dat is traag maar volstrekt voorspelbaar, en het is waarom LearnDash zonder problemen 678 globale functies kan hebben die overal beschikbaar zijn.

### `SFWD_LMS`: de god-klasse en zijn afkomst

`includes/class-ld-lms.php`, 5.353 regels, en de klassedeclaratie verklapt tien jaar geschiedenis:

```php
class SFWD_LMS extends Semper_Fi_Module {
```

`Semper_Fi_Module` (`includes/class-ld-semper-fi-module.php`, 2.124 regels, 37 methoden) is een **abstracte modulebasisklasse afkomstig uit All in One SEO Pack**, oorspronkelijk van Semper Fi Web Design — het framework waarop LearnDash in 2012 begon. Hij zit er in 2023 nog steeds in, met een `@codingStandardsIgnoreStart` over de hele klasse en bovenaan een polyfill voor `str_getcsv()` "omdat `$escape` pas in PHP 5.3 kwam". In een plugin die PHP 7.3 als minimum eist (`LEARNDASH_MIN_PHP_VERSION`).

De constructor van `SFWD_LMS` is de kern van de architectuur: ~90 regels die 25+ hooks registreren, een handvol admin-klassen instantiëren achter `if ( is_admin() )`, en de rest uitstellen naar `init`. Alle globale toestand komt uit `trigger_actions()` op `init` prioriteit 1, dat zes `do_action()`'s achter elkaar afvuurt — `learndash_init`, `learndash_settings_sections_fields_init`, `learndash_settings_sections_init`, `learndash_settings_pages_init`, `learndash_themes_load`, `learndash_loaded`. Dát is de uitbreidingsvolgorde waar het hele add-on-ecosysteem op inhaakt: elke add-on weet precies op welk moment hij zijn settings mag registreren.

*Vergelijk met ons:* wij hebben geen bootstrap-fase omdat Next.js modules laadt wanneer ze geïmporteerd worden. De prijs die LearnDash betaalt voor uitbreidbaarheid — een expliciet gefaseerde opstart die je nooit mag breken — is precies wat wij niet hoeven te betalen omdat wij geen derden bedienen.

## 2. De twee lagen: `includes/` versus `src/`

Dit is het interessantste wat de code laat zien en wat de documentatie nergens noemt.

| | `includes/` (legacy) | `src/` (modern) |
|---|---|---|
| PHP-bestanden | 1.197 | 224 (waarvan 64 in `src/Core`, 153 views) |
| PHP-regels | 333.780 | 21.743 |
| Namespaces | **6 bestanden** (excl. bundled libs) | alle |
| Autoloading | nee, handmatige `require_once` | PSR-4 via Composer |
| Naamgeving | `class-ld-lms.php`, `LearnDash_Settings_Metabox` | `Course.php`, `LearnDash\Core\Models\Course` |
| Typering | vrijwel geen | return types, param types, PHPStan-annotaties |
| Bestandsnaamconventie | WordPress (`class-*.php`, kebab-case) | PSR-4 (StudlyCase) |

`src/Core` is **6,5% van de eigen PHP-regels**. Na twee jaar moderniseren (de laag begint bij 4.5.0, medio 2022) is 93,5% van de code nog de oude wereld. Dat is geen falen — het is hoe een incrementele modernisering er in het echt uitziet.

### Hoe de twee lagen elkaar aanraken

Ze raken elkaar op precies drie plekken, en dat is met opzet:

1. **`src/Core/Autoloader.php`** — een eigen autoloader die klassen zónder namespace (de `src/deprecated/*.php`-shims) op naam aan een pad koppelt, zodat oude klassenamen blijven werken. Wordt aangeroepen door `learndash_extra_autoloading()`.
2. **`learndash_files_included`** — de nieuwe actie waarop `App::register( Provider::class )` draait, ná de legacy-includes.
3. **`src/Core/Template/Template.php`** importeert gewoon `SFWD_LMS` en gebruikt diens `get_template()` voor de override-lookup. De nieuwe laag hergebruikt de oude motor in plaats van hem te dupliceren.

### DI-container: echt aanwezig, echt bescheiden gebruikt

`src/Core/Container.php` implementeert `StellarWP\ContainerContract\ContainerInterface` en wrapt `lucatume\DI52\Container` — met `bind()`, `singleton()`, `get()`, `has()`, en `__call()` als doorgeefluik voor de rest. `src/Core/App.php` is de service locator eromheen.

Maar kijk wat er in 4.6.0 daadwerkelijk in de container zit. De root `Provider::register()` is elf regels effectieve code:

```php
$this->container->register( AI\Provider::class );
$this->container->register( Payments\Provider::class );

if ( ! defined( 'LEARNDASH_ENABLE_IN_PROGRESS_FEATURES' ) || ! LEARNDASH_ENABLE_IN_PROGRESS_FEATURES ) {
    return;
}
```

Twee providers voor productie (AI en Payments), en al het andere zit achter een feature flag die standaard uit staat. `learndash-features-constants.php` bestaat uit exact twee constanten — `LEARNDASH_ENABLE_IN_PROGRESS_FEATURES` en `LEARNDASH_ENABLE_FEATURE_BREEZY_TEMPLATE` — beide `false`, met de kop: "for development purposes only and should not be used on production sites".

En dan het eerlijkste signaal in de hele codebase: **204 van de 224 bestanden in `src/`** dragen bovenaan letterlijk deze banner:

> NOTICE: This code is currently under development and may not be stable. Its functionality, behavior, and interfaces may change at any time without notice. Please refrain from using it in production or other critical systems.

Ze verschepen de nieuwe laag mee in elke release, maar geven er geen stabiliteitsgarantie op. Dat is de manier waarop je een herschrijving uitrolt zonder je backwards-compatibility-belofte te breken: de code is er, hij draait deels, maar hij is contractueel nog niet "echt".

*Vergelijk met ons:* wij doen hetzelfde met andere middelen — `LEARNDASH_ENABLE_IN_PROGRESS_FEATURES` is hun equivalent van onze noindex-`/lab`-pagina's en van de manier waarop `docs/openstaand.md` een half afgemaakt pad expliciet als open markeert. Het patroon is: laat onaf werk zichtbaar meereizen, maar zeg er hardop bij dat het onaf is.

### De begraafplaats van modellen: drie generaties tegelijk

Zoek "model" in deze codebase en je vindt drie complete abstractielagen die naast elkaar leven:

1. **`includes/classes/class-ldlms-model-*.php`** — 16 klassen (`LDLMS_Model_Course`, `LDLMS_Model_Quiz`, `LDLMS_Model_User_Course_Progress`, …) plus `LDLMS_Factory_Post`/`LDLMS_Factory_User`. De 3.x-generatie.
2. **`includes/models/class-learndash-model.php`** + `Learndash_Product_Model` + `Learndash_Transaction_Model` — de 4.5-generatie.
3. **`src/Core/Models/*`** — `Course`, `Lesson`, `Topic`, `Quiz`, `Group`, `Exam`, `Product`, `Transaction`, `User`, `Instructor`, met traits (`Has_Quizzes`, `Has_Materials`), interfaces en een `Model` die van `StellarWP\Models\Model` erft. De 4.6-generatie.

Generatie 2 is in 4.6.0 netjes afgeschoten: `src/deprecated/Learndash_Model.php` roept `_deprecated_file()` aan en de klasse erft nu gewoon van de nieuwe `LearnDash\Core\Models\Post`. Generatie 1 staat er nog volledig bij, ongemarkeerd.

Dat is de duurste les uit dit hoofdstuk: **elke abstractielaag die je bouwt en niet afmaakt, moet je voor altijd blijven meedragen.** LearnDash draagt er twee.

## 3. Wat er meekomt: `vendor/`, `vendor-prefixed/`, `includes/lib/`, `mu-plugins/`, `plugins/`

### Strauss, en waarom `vendor/` leeg is

`vendor/` bevat de Composer-metadata en de README's — maar de PHP-bronbestanden van `lucatume/di52`, `stellarwp/db`, `stellarwp/models`, `stellarwp/telemetry` en `psr/container` zijn eruit gestript. Wat er wél nog in `vendor/composer/autoload_psr4.php` staat, is één regel die er echt toe doet:

```php
'LearnDash\\Core\\' => array( $baseDir . '/src/Core' ),
```

Dat is de PSR-4-registratie van de eigen moderne laag. De rest van de autoload-map wijst naar bestanden die niet meer bestaan.

De echte code staat in `vendor-prefixed/` (93 bestanden, 10.224 regels), verwerkt door **Strauss** — de tool die elke klasse hernoemt naar `StellarWP\Learndash\…`. Vandaar de imports in het hoofdbestand:

```php
use StellarWP\Learndash\lucatume\DI52\ContainerException;
use StellarWP\Learndash\StellarWP\Telemetry\Config;
use StellarWP\Learndash\StellarWP\DB\DB;
```

Waarom dit moet: WordPress heeft geen dependency-isolatie. Twintig plugins op één site delen één PHP-proces en één klassenamespace. Als twee plugins verschillende versies van dezelfde library meebrengen, wint degene die het eerst laadt en crasht de ander. Prefixing is de enige uitweg. De prijs is een dubbele autoloader en een `vendor/`-map die er half leeg bij ligt.

*Vergelijk met ons:* `node_modules` en `package-lock.json` lossen dit probleem op een manier op die wij als vanzelfsprekend beschouwen. LearnDash bouwt zijn eigen `node_modules` na met een hernoemingstool. Dat is het beste argument dat ik ken voor het ontwerpbesluit om buiten WordPress te blijven.

**Wat StellarWP meelevert** (de gemeenschappelijke infrastructuurlaag van de hele StellarWP-portfolio, zie hoofdstuk 7): `di52` (DI-container), `container-contract` (de interface), `db` (query builder bovenop `$wpdb`), `models` (base model), `telemetry` (opt-in gebruiksstatistiek, met `Config::set_stellar_slug( 'learndash' )` in de bootstrap).

### `includes/lib/`: 127.000 regels vreemde code, ongeprefixed

| Bibliotheek | Bestanden | Regels | Versie |
|---|---|---|---|
| TCPDF | 78 | 61.477 | 6.6.2 |
| wp-pro-quiz | 72 | 21.948 | fork, geen upstream |
| stripe-php | 228 | 18.960 | 7.107.0 |
| action-scheduler | 81 | 12.038 | (WooCommerce) |
| razorpay-php | 100 | 10.096 | 2.8.5 |
| parsecsv-for-php | 7 | 1.744 | |
| paypal | 3 | 1.211 | |

TCPDF alleen al — de PDF-generator voor certificaten en facturen — is **een kwart van de hele plugin in regels**, waarvan 18.447 regels puur fontdata. Elke LearnDash-installatie ter wereld sleept die mee, ook als er nooit een certificaat wordt gegenereerd.

`wp-pro-quiz` verdient een aparte vermelding: dit is de gevorkte quiz-plugin uit 2014 waar de hele quizmotor nog steeds op draait. Je ziet hem doorlekken tot in de settings-API — `learndash_get_setting()` valt voor de setting `statisticsOn` terug op `new WpProQuiz_Model_QuizMapper()`. Hoofdstuk 02 concludeerde uit de documentatie dat LearnDash zijn eigen quizmotor niet vertrouwde toen ze Challenge Exams bouwden; de broncode bevestigt dat met tien custom databasetabellen (`wp_learndash_pro_quiz_master`, `_question`, `_statistic`, `_toplist`, …) die in `includes/class-ldlms-db.php` nog altijd onder de sectie `'wpproquiz'` staan.

### `mu-plugins/` en `plugins/`: een plugin die andere plugins installeert

Dit is het vreemdste dat ik heb gevonden. In de plugin zitten twee submappen die géén PHP-code zijn maar **ZIP-bestanden**:

- `mu-plugins/learndash-hub.zip` (1,7 MB) — de licentiemanager.
- `plugins/kadence-starter-templates.zip` (254 kB) — de Kadence-thema-templates voor de Design Wizard.

`mu-plugins/setup.php` pakt de eerste bij activatie uit naar een tijdelijke map, draait `install.php` eruit, en roept dan `activate_plugin( 'learndash-hub/learndash-hub.php', … )` aan. Bij multisite kopieert hetzelfde bestand `learndash-multisite.php` naar `WPMU_PLUGIN_DIR` — de must-use-map, waar plugins staan die de sitebeheerder niet kan deactiveren.

De plugin installeert dus bij activatie stilzwijgend twee andere plugins, waarvan één op een plek die je niet kunt uitzetten. Dat is een verdedigbaar besluit voor licentiehandhaving en het is niet verstopt (het staat gewoon in `setup.php`), maar het is wel iets dat je uit de documentatie nooit zou weten.

*Vergelijk met ons:* de vraag "wat draait er eigenlijk op mijn server" is bij ons te beantwoorden met `package.json` en een blik op Vercel. Bij LearnDash niet.

## 4. Instellingen: het `_sfwd-*`-model en het framework eromheen

Hoofdstuk 01 beschreef hoe de settingschermen er voor de gebruiker uitzien. De code laat zien hoe ze werken, en het is niet wat je zou verwachten.

### De opslag: één geserialiseerde array per post, plus losse spiegels

`includes/settings/settings-functions.php` (376 regels) bevat de twee functies waar alles doorheen gaat: `learndash_get_setting()` en `learndash_update_setting()`. De kern is één regel:

```php
$meta = get_post_meta( $post->ID, '_' . $post->post_type, true );
```

De meta key is de posttype-slug met een underscore ervoor. Voor een cursus is dat `_sfwd-courses`, voor een les `_sfwd-lessons`, voor een quiz `_sfwd-quiz`. De waarde is één geserialiseerde array, en de sleutels binnen die array zijn nogmaals geprefixt met de posttype-slug: `sfwd-courses_course_price`, `sfwd-courses_course_prerequisite_enabled`, enzovoort.

Naast die array schrijft `learndash_update_setting()` **een reeks losse postmeta-spiegels** voor precies die velden waarop gequeried of gesorteerd moet worden: `course_id`, `course_access_list`, `course_points`, `_ld_price_type`, `course_price_billing_t3`, `course_price_billing_p3`, `course_trial_duration_t1/p1`. Dat is de klassieke oplossing voor het klassieke probleem: je kunt niet zoeken in een geserialiseerde array met SQL, dus de velden die je nodig hebt in een `meta_query` krijgen hun eigen rij. De invariant "array en spiegel lopen niet uit elkaar" leunt volledig op het feit dat iedereen door deze ene functie schrijft.

Gebruikersvoortgang gaat hetzelfde: `_sfwd-course_progress` en `_sfwd-quizzes` als geserialiseerde **usermeta** — één array per gebruiker met alle cursussen erin. In `includes/admin/ld-admin.php` staat de reset-actie als kale `DELETE FROM wp_usermeta WHERE meta_key='_sfwd-course_progress'`.

*Vergelijk met ons:* onze `lesson_progress` is een tabel met een rij per (gebruiker, les) en `verwerkLes()` telt een delta op in één statement. Dat is niet omdat wij slimmer zijn, maar omdat wij Postgres hebben en zij een key-value-store met een `LONGTEXT`-kolom. Hun keuze verklaart wel waarom LearnDash-rapportages op schaal traag zijn (hoofdstuk 06) — je kunt geen index leggen op een veld in een geserialiseerde array.

### Het framework: vijf basisklassen, 165 subklassen

| Laag | Basisklasse | Bestand | Regels | Subklassen |
|---|---|---|---|---|
| Instellingenpagina | `LearnDash_Settings_Page` | `class-ld-settings-pages.php` | 1.031 | 26 |
| Instellingensectie | `LearnDash_Settings_Section` | `class-ld-settings-sections.php` | 1.253 | 58 |
| Veld | `LearnDash_Settings_Fields` | `class-ld-settings-fields.php` | 899 | 25 |
| Metabox | `LearnDash_Settings_Metabox` | `class-ld-settings-metaboxes.php` | 1.018 | 23 |
| Shortcode-sectie | `LearnDash_Shortcodes_Section` | `class-ld-shortcodes-sections.php` | — | 33 |

Elke subklasse is een constructor die declaratief zijn eigen scherm beschrijft: op welk posttype (`settings_screen_id`), onder welke sleutel (`settings_metabox_key`), met welk label, en dan de velddefinities. Sections schrijven naar de options-tabel (`update_option( $this->setting_option_key, … )`), metaboxes naar postmeta via `learndash_update_setting()`.

### `settings_fields_map`: de truc waarmee je nooit hoeft te migreren

Dit is het slimste patroon in de hele codebase. Elke metabox bevat een `settings_fields_map` die **de interne veld-ID koppelt aan de opgeslagen (legacy) sleutel**. Uit `class-ld-settings-metabox-course-access-settings.php`:

```php
'course_price_type_paynow_price'      => 'course_price',
'course_price_type_subscribe_price'   => 'course_price',
'course_price_type_closed_price'      => 'course_price',
```

Drie velden in de UI — het prijsveld bij "Buy Now", bij "Recurring" en bij "Closed" — schrijven alle drie naar dezelfde opgeslagen sleutel `course_price`. De UI mag herstructureren, hernoemen en opsplitsen zonder dat er ooit één rij in de database verandert. Ook `course_price_type_closed_custom_button_label` → `custom_button_label` is zo'n vertaling: de opgeslagen naam is uit 2013, de getoonde naam uit 2019.

Dit is backwards compatibility als expliciete datastructuur in plaats van als goede bedoeling. De prijs die je ervoor betaalt is dat de databasenamen nooit meer iets betekenen — wie de `wp_postmeta` van een LearnDash-site openslaat, kan zonder deze map niet lezen wat er staat.

*Vergelijk met ons:* onze `settings_fields_map` heet `prijsInCenten()` in `src/lib/prijs.ts` — een weergavetekst die met een regex terug wordt gerekend naar centen. Hetzelfde mechanisme (presentatievorm ≠ opslagvorm), maar wij hebben het per ongeluk, zij met opzet. Van de twee is die van hen de veiligere, want expliciet en getest per veld.

## 5. Templates: drie generaties override-logica in één functie

### Waar de templates staan

- `themes/legacy/` — 59 PHP-bestanden, de 2.x-look.
- `themes/ld30/` — 96 PHP-bestanden, de standaard sinds 3.0 (`LEARNDASH_DEFAULT_THEME`).
- `src/views/themes/breezy/` — 153 bestanden, de vierde generatie, achter een uitgeschakelde feature flag.

Registratie loopt via `themes/class-ld-themes-register.php` (`LearnDash_Theme_Register`), met `LearnDash_Theme_Register_LD30` en `_Legacy` als subklassen. Elk thema declareert zijn `theme_key`, `theme_template_dir` en of het selecteerbaar is.

### De lookup: precies vier plekken, in vaste volgorde

`SFWD_LMS::get_template_paths()` bouwt de zoeklijst, `SFWD_LMS::get_template()` loopt hem af:

1. **Het WordPress-thema van de klant**, via `locate_template( 'learndash/<theme_key>/<bestand>' )` — dus `wp-content/themes/jouwthema/learndash/ld30/course.php`. Child theme wint van parent theme, want dat regelt `locate_template()`.
2. **`LEARNDASH_TEMPLATES_DIR`**, als die constante gedefinieerd is — een override-map buiten het thema, voor mensen die hun templates niet aan een thema willen koppelen.
3. **De templatemap van het actieve LearnDash-thema** (`themes/ld30/templates/`).
4. **De legacy-map als terugval**, wanneer het actieve thema níét legacy is. Elke ld30-template heeft dus een vangnet in `themes/legacy/`.

Daarbovenop nog twee eigenaardigheden. Voor `.js`/`.css` wordt automatisch naar `.min.js` gezocht tenzij `LEARNDASH_SCRIPT_DEBUG` aan staat — de template-lookup dubbelt als asset-resolver. En als `foo.php` niet bestaat maar `foo/` wel een map is, wordt de zoekterm `foo/index.php`; zo kun je één template opsplitsen in een map met partials zonder de aanroepende code aan te raken.

Drie filters zitten in het pad: `learndash_template_filename` (voordat er gezocht wordt), `learndash_template` (na de lookup, mag het gevonden pad vervangen) en `ld_template_args_<naam>` (mag de doorgegeven variabelen wijzigen). Elk van die drie is genoeg om een template volledig te kapen zonder een bestand te kopiëren.

De rendering zelf is `extract( $args ); ob_start(); include $filepath;` — met, en dit is eerlijk van ze, een comment dat je in weinig commerciële codebases ziet:

```php
extract( $args ); // phpcs:ignore ... -- Bad idea, but better keep it for now.
```

### Hook-dichtheid als productbeslissing

Tel de `do_action`/`apply_filters` in de templatemappen:

- `themes/ld30/` — **465**
- `themes/legacy/` — **57**

Achtvoudig verschil. `themes/ld30/templates/modules/login-modal.php` alleen al bevat er 29. Dat is geen toeval maar het centrale ontwerpbesluit van de 3.0-herschrijving: **elk zichtbaar element krijgt een `_before` en een `_after`**, zodat een add-on iets kan invoegen zonder de template te overschrijven. Wie de template kopieert, mist voortaan alle upstream-fixes; wie een hook gebruikt niet. LearnDash heeft die keuze zo makkelijk mogelijk gemaakt.

*Vergelijk met ons:* onze equivalent van een override is een React-component vervangen, en onze equivalent van 465 hooks bestaat niet — omdat er niemand is die erop moet inhaken. Dat is de directe winst van één-partij-zijn.

## 6. De hook-oppervlakte

Alleen eigen code, bundled libraries niet meegeteld:

| | Aanroepen | Unieke namen (letterlijk) |
|---|---|---|
| `do_action` | 495 | 372 |
| `apply_filters` | 1.339 | 624 |
| `add_action` | 587 | — |
| `add_filter` | 330 | — |

Plus ~58 hooknamen die dynamisch worden samengesteld (`'learndash_settings_section_save_fields_' . $key`, `'ld_template_args_' . $name`), dus het echte aantal aangrijpingspunten ligt hoger — in de duizenden zodra je per settings-sectie en per template één variant telt.

**Bijna drie filters op elke actie.** Dat is de verhouding die het ecosysteem verklaart: LearnDash-add-ons veranderen vooral *waarden* (prijzen, labels, toegangsbesluiten, query-argumenten), niet zozeer *gedrag*. Elke functie die iets beslist, laat die beslissing eerst langs een filter gaan.

De levenscyclus-events waar het ecosysteem daadwerkelijk op leeft, zitten in `includes/course/ld-course-progress.php` op de regels 940, 962 en 985:

- `learndash_lesson_completed`
- `learndash_topic_completed`
- `learndash_course_completed`

Alle drie krijgen één associatieve array mee (`user`, `course`, `progress`, `course_completed`) in plaats van losse parameters — het patroon waarmee je later velden kunt toevoegen zonder de signatuur te breken. Daarnaast `learndash_before_course_completed` (waarop LearnDash zelf de afrondtijd wegschrijft), `learndash_quiz_completed`, `learndash_quiz_submitted`, `learndash_group_completed`, `learndash_assignment_uploaded`, `learndash_assignment_approved`, `learndash_transaction_created`, `learndash_update_course_access`, `learndash_user_course_access_expired` en de zes `ld_added_*_access`/`ld_removed_*_access`-paren voor groepstoegang.

Dat is de complete lijst waar GamiPress, Uncanny Automator, WP Fusion, Zapier-bruggen en elke certificaat-add-on op draaien. **Twintig events, en daar hangt een markt van honderden producten aan.** Dat is hoofdstuk 07's conclusie, nu in cijfers.

*Vergelijk met ons:* onze `completeLesson()` in `src/lib/progress.tsx` is het enige muterende pad, precies zoals hun `learndash_process_mark_complete()`. Het verschil is dat wij daar geen event uit publiceren, omdat er niemand luistert. Zou dat ooit veranderen, dan is hun vorm — één array-payload, een `_before` naast de hoofdactie — de vorm die je wilt.

## 7. REST API

`includes/rest-api/` telt 49 controllerbestanden, strikt gesplitst:

- **v1** — 21 controllers, namespace `ldlms/v1` (sinds 2.4.5, 2017).
- **v2** — 28 controllers, namespace `ldlms/v2`.

De namespace-opbouw is één regel in de basiscontroller: `$this->namespace = trailingslashit( LEARNDASH_REST_API_NAMESPACE ) . $this->version;` met `protected $version = 'v2';`. Versionering is dus een klasse-eigenschap, niet een routeparameter — v1 en v2 zijn twee complete, onafhankelijke boomstructuren die naast elkaar geregistreerd worden. Beide worden nog steeds geladen en geregistreerd (29 controllers met `'register_routes' => true` in de loader); v1 is nergens gemarkeerd als deprecated.

De klassenhiërarchie is consequent:

```
WP_REST_Posts_Controller  ← LD_REST_Posts_Controller_V2  ← Courses, Lessons, Topics, Quizzes,
                                                            Groups, Essays, Exams, Assignments,
                                                            Questions, Users_Courses, …
WP_REST_Users_Controller  ← LD_REST_Users_Controller_V2  ← Groups_Users, Groups_Leaders, Courses_Users
WP_REST_Controller        ← Echo, Price_Types, Progress_Status, Question_Types,
                            Quiz_Form_Entries, Quiz_Statistics
```

Ze erven dus van WordPress' eigen `WP_REST_Posts_Controller` in plaats van van `WP_REST_Controller` — dat levert schema, paginering, `_fields`, `context` en de standaard-queryparameters gratis op, en betekent dat elke LearnDash-resource zich gedraagt als een gewone WordPress-post-endpoint. `Echo_Controller` bestaat in beide versies als diagnostisch endpoint. `Quiz_Statistics_Controller_V2` implementeert daarnaast `Iterator`, wat er in een REST-controller opvallend uitziet.

Conventies die overal terugkomen: één bestand per controller, bestandsnaam `class-ld-rest-<resource>-controller.php`, klassenaam met `_V1`/`_V2`-suffix, en op elke klassedeclaratie een `phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound` omdat `LD_REST_` de WordPress-prefixregel niet haalt.

Aan/uit loopt via `LearnDash_REST_API::enabled()`, dat drie voorwaarden combineert: de constante `LEARNDASH_REST_API_ENABLED`, een instelling in de sectie `LearnDash_Settings_Section_General_REST_API`, en het filter `learndash_rest_api_enabled` — die laatste kan het per posttype nog terugdraaien.

*Vergelijk met ons:* onze `POST /api/voortgang` is één route-handler met een expliciete toegangscheck. LearnDash heeft 49 controllers omdat hun API een productfeature is (integraties, mobiele apps, Zapier). Wat wel overdraagbaar is: hun versionering-als-klasse-eigenschap. Als wij ooit `/api/v2/` nodig hebben, is een tweede map naast de eerste goedkoper dan conditionals in bestaande handlers.

## 8. Engineeringpraktijk: wat de tellingen verraden

### Documentatie: uitzonderlijk

| Annotatie | Aantal |
|---|---|
| `@param` | 11.278 |
| `@since` | 7.671 |
| `@return` | 4.185 |
| `@deprecated` | 351 |

Vrijwel elke functie, methode, klasse-eigenschap én constante heeft een docblock, en vrijwel elke docblock heeft een `@since` met een precieze versie. Dat is niet cosmetisch: `@since 2.1.0` op een functie vertelt een add-on-bouwer of hij hem mag gebruiken zonder een minimumversie te eisen. Ook elke `do_action`/`apply_filters` heeft een docblock met parameterbeschrijving erboven — dat is wat de hookdocumentatie op hun site voedt.

Dit is de duidelijkste engineeringkwaliteit in de hele codebase, en het is precies de kwaliteit die je nodig hebt als je product een platform voor derden is.

### De begraafplaats: netjes aangeharkt

`includes/deprecated/` is per versie ingedeeld — 18 mappen van `2.3.0` tot `4.6.0`, samen 19 bestanden en 2.966 regels. De grootste zijn `4.5.0/` (866 regels) en `3.4.0/` (730). Er staan **236 aanroepen van `_deprecated_function()`** in de codebase, plus `_deprecated_file()` in de `src/deprecated/`-shims.

De oudste map is `2.3.0` — code uit 2016, in 2023 nog steeds meegeleverd. Zeven jaar backwards compatibility voor functies die vrijwel niemand meer aanroept. Dat is wat "we breken je site niet" in de praktijk kost: ~3.000 regels dode code, permanent.

En let op de vorm: ze **verwijderen niets, ze verplaatsen**. Een afgeschoten functie gaat naar de map van de versie waarin hij afgeschoten werd, blijft werken, en roept `_deprecated_function()` aan zodat de sitebeheerder het in zijn debug log ziet. Dat is een migratiepad in plaats van een breuk.

### "Legacy" als expliciet woord

Slechts **twee** paden dragen het woord in hun naam: `includes/course/ld-course-functions-legacy.php` (1.708 regels) en `themes/legacy/`. Daarnaast staat het in constanten: `LEARNDASH_LEGACY_THEME`, `LEARNDASH_COURSE_FUNCTIONS_LEGACY`, `LEARNDASH_GUTENBERG_CONTENT_PARSE_LEGACY`, `LEARNDASH_QUIZ_EXPORT_LEGACY` — allemaal schakelaars waarmee je terug kunt naar het oude gedrag. Legacy is bij LearnDash geen scheldwoord maar een configuratie-optie.

Het woord "legacy" komt ook terug in de settings zelf: elke `settings_fields_map` heeft letterlijk de commentaarregels `// New fields.` en `// Legacy fields.`.

### i18n: streng, en met een eigen draai

| | Aantal |
|---|---|
| `esc_html__()` / `esc_attr__()` / `esc_html_x()` / `esc_attr_x()` | 5.159 |
| kale `__()` | 795 |
| `// translators:`-comments | 2.503 |
| gebruik van `'learndash'` textdomain | 7.127 |
| `learndash_get_custom_label()`-aanroepen | 1.156 |

De verhouding escaped:kaal is ongeveer 6,5:1 — escaping en vertaling zijn hier één handeling, wat de juiste gewoonte is. 2.503 `translators:`-comments betekent dat vrijwel elke `sprintf`-placeholder is uitgelegd voor de vertaler.

Maar het interessantste is `learndash_get_custom_label()`, 1.156 keer aangeroepen. Dat is de **hernoembare-terminologie**-feature uit hoofdstuk 01 (Course → "Module", Lesson → "Hoofdstuk"), en in de code betekent hij dat je nooit het woord "Course" letterlijk mag typen:

```php
$this->settings_section_label = sprintf(
    // translators: placeholder: Course.
    esc_html_x( '%s Access Settings', 'placeholder: Course', 'learndash' ),
    learndash_get_custom_label( 'course' )
);
```

Elke zichtbare string die een contenttype noemt, is een `sprintf` met een runtime-label erin. Dat is een discipline die je in de hele codebase moet volhouden — één vergeten plek en de klant die zijn cursussen "modules" noemt, ziet ineens "Course". 1.156 keer volgehouden.

Verscheept wordt er overigens maar één taalbestand: `languages/learndash.pot`. Vertalingen komen via translate.wordpress.org / de Hub, niet uit de plugin-ZIP.

*Vergelijk met ons:* wij hebben geen i18n-laag omdat wij eentalig Nederlands zijn, en dat scheelt ons letterlijk duizenden `sprintf`-aanroepen. Maar hun custom-label-patroon is wel de nette oplossing voor het probleem "de klant noemt het anders" — en dat is precies het probleem dat wij zouden krijgen als er ooit een tweede merk op dezelfde codebase draait.

### Schuld die zichtbaar wordt gelaten

| | Aantal |
|---|---|
| `phpcs:ignore` | 1.837 |
| `TODO` (alle vormen) | 135 |
| `@todo` | 41 |
| `FIXME` | 2 |

1.837 phpcs-uitzonderingen op ~252.000 regels eigen code is één per 137 regels. Dat betekent: **er draait een linter, hij is streng, en waar hij overruled wordt staat het genoteerd** — vaak mét reden ("Bad idea, but better keep it for now", "I don't think we'll refactor it in the nearest feature"). Dat is oneindig veel beter dan de linter uitzetten.

135 TODO's op deze omvang is laag. 2 FIXME's is bijna verdacht laag — wat waarschijnlijk betekent dat het woord hier niet in de huisstijl zit, niet dat er niets kapot is.

Er zit **PHPStan** op: `@phpstan-ignore-next-line -- type overridden intentionally.` in `App.php`, en `@phpstan-ignore-line`-annotaties bij de feature-flag-constanten. Ook typed docblocks in de moderne laag (`@var string[][]`, `@return ($echo is false ? string : void )` — dat laatste is conditional-return-syntax, tamelijk geavanceerd).

Wel: **`declare( strict_types )` staat nergens**, in geen enkel bestand. En hoewel `src/Core` 397 return-type-declaraties heeft, blijft de rest ongetypeerd.

### Geen tests. Nergens.

Dit is de meest opvallende afwezigheid: **in de distributie zit geen enkel testbestand, geen `phpunit.xml`, geen `composer.json` op plugin-niveau, geen `.editorconfig`, geen CI-configuratie.** Wat er wél is, zijn de meegeleverde `stellarwp/db` en `stellarwp/models` met hun `codeception.dist.yml` — de StellarWP-libraries hebben zichtbaar wél een testopstelling, LearnDash zelf niet zichtbaar.

**Wees hier eerlijk over de onzekerheid:** dit is een distributie-ZIP, geen repository-checkout. Testbestanden, build-config en dev-dependencies worden bijna altijd uit een release-artefact gestript. Dat LearnDash geen tests *verscheept* bewijst niet dat LearnDash geen tests *heeft*. Wat je er wél uit mag afleiden: er is geen manier waarop een klant, een consultant of een add-on-bouwer de plugin kan testen tegen zijn eigen aanpassingen. Voor een product waarvan het hele verdienmodel op uitbreidbaarheid rust, is dat een echte lacune.

### Assets: ongecomprimeerd meegeleverd

7,4 MB JavaScript, waarvan `assets/js/builder/dist/builder.js` in zijn eentje 2,3 MB is — **naast** `builder.min.js` van 527 kB. Ook `setup-wizard/dist/js/index.js` (1,9 MB) en `header.js` (1,5 MB) staan er in onverkleinde vorm bij. Van de 115 JS-bestanden zijn er 28 geminificeerd; sourcemaps zijn er nul. De onverkleinde bestanden zijn er waarschijnlijk voor `LEARNDASH_SCRIPT_DEBUG`, dat in de template-lookup een `.min`-suffix overslaat — maar het betekent wel dat elke installatie ~4 MB dubbele JavaScript op schijf heeft.

## 9. Wat de code zegt dat de docs niet zeggen

1. **Er wordt al drie jaar herschreven, en de herschrijving is 6,5% klaar.** `src/Core` bestaat sinds 4.5.0 met een DI-container, PSR-4, modellen, service providers — alles wat je van moderne PHP verwacht. En 93,5% van de eigen code staat nog in `includes/` met handmatige `require_once`. De documentatie noemt de nieuwe laag nergens, en dat is consequent: 204 van de 224 bestanden dragen een "not stable, may change without notice"-banner. Ze verschepen hun toekomst mee zonder hem te beloven.

2. **De echte moat is niet de plugin, het is één regel per beslissing.** 1.339 `apply_filters` tegen 495 `do_action` — bijna drie filters per actie. Dat is de reden dat er een add-on-markt bestaat: je hoeft LearnDash's gedrag niet te vervangen, je hoeft alleen zijn antwoorden te veranderen. En de lijst waar het écht op draait is klein: ~20 levenscyclus-events, waarvan `learndash_course_completed` en zijn twee broertjes de belangrijkste zijn.

3. **Backwards compatibility is hier een datastructuur, geen intentie.** `settings_fields_map` vertaalt elke UI-veldnaam naar zijn opslagnaam uit 2013 — drie verschillende prijsvelden schrijven naar dezelfde `course_price`. Achttien versiemappen in `includes/deprecated/` en 236 `_deprecated_function()`-aanroepen doen hetzelfde voor de API. Ze breken nooit iets; ze verplaatsen het en laten een briefje achter. Dat is duur (~3.000 regels dode code, databasenamen die niets meer betekenen) en het is waarschijnlijk waarom ze nog bestaan.

4. **De WordPress-belasting is echt, en zichtbaar in bestandsstructuur.** `vendor-prefixed/` bestaat alleen omdat WordPress geen dependency-isolatie kent en Strauss elke library moet hernoemen naar `StellarWP\Learndash\…`. `includes/lib/` bestaat alleen omdat je Composer niet mag aannemen: 127.000 regels vreemde code plat meegeleverd, TCPDF alleen al een kwart van de plugin. En `mu-plugins/setup.php` installeert bij activatie stilzwijgend twee andere plugins, waarvan één in de must-use-map. Dit is allemaal onvermijdelijk bínnen WordPress, en het is het beste technische argument voor het besluit om erbuiten te blijven.

5. **De god-klasse is nooit weggegaan, en zijn voorouder ook niet.** `SFWD_LMS` is 5.353 regels en erft van `Semper_Fi_Module` — een modulebasisklasse afkomstig uit All in One SEO Pack, met een `str_getcsv()`-polyfill voor PHP 5.2, in een plugin die PHP 7.3 eist. Er zijn ondertussen drie complete modellagen (`LDLMS_Model_*`, `Learndash_*_Model`, `LearnDash\Core\Models\*`), waarvan er één netjes is afgeschoten en één er gewoon nog bij staat.

6. **De documentatiediscipline is de beste kwaliteit die ze hebben.** 11.278 `@param`, 7.671 `@since`, 2.503 `translators:`-comments, een docblock boven vrijwel elke hook. Voor een product waarvan het ecosysteem het verdienmodel is, is dat geen nettigheid maar infrastructuur. 1.837 `phpcs:ignore`-regels met redenen erbij horen daarbij: de linter staat aan en waar hij overruled wordt, staat het genoteerd.

7. **En de zichtbare lacune is testbaarheid.** Geen testbestand, geen `phpunit.xml`, geen build-config in de distributie — terwijl de meegeleverde StellarWP-libraries wél hun Codeception-config meesturen.

## Onzekerheden, eerlijk benoemd

- **Dit is een distributie-ZIP, geen repository.** Tests, CI-config, `composer.json`, `package.json` en linterconfiguratie worden standaard uit een release gestript. Uit hun afwezigheid volgt dat je als *klant* niets kunt testen — niet dat LearnDash intern niet test. Ik heb geen bewijs voor of tegen dat laatste.
- **Alles hier is 4.6.0 uit mei 2023.** LearnDash staat inmiddels op 5.x. De richting van de verbouwing (`src/Core` groeit, `includes/` krimpt) is drie jaar verder; de verhouding 6,5% / 93,5% is vrijwel zeker verschoven. Het `Breezy`-thema stond in 4.6.0 achter een uitgeschakelde flag en is inmiddels waarschijnlijk uitgerold — ik heb dat niet geverifieerd.
- **De hooktellingen zijn statisch geteld** met patronen op letterlijke stringnamen. ~58 hooks worden dynamisch samengesteld (`'…_' . $key`) en tellen als één naam mee; het feitelijke aantal aangrijpingspunten ligt dus hoger dan 372 + 624. Ook zijn hooks uit `includes/lib/` (vooral Action Scheduler) bewust buiten de eigen telling gehouden.
- **De LOC-tellingen zijn kale regels**, inclusief commentaar en witregels. Met ~11.000 `@param`-regels aan docblocks is het aandeel commentaar hier substantieel; "252.000 regels eigen code" is dus geen 252.000 regels logica.
- **Ik heb `learndash-hub.zip` en `kadence-starter-templates.zip` niet uitgepakt.** Wat daarin zit (samen ~2 MB) is uit deze analyse weggebleven; ik beschrijf alleen wat `mu-plugins/setup.php` er zichtbaar mee doet.
- **`assets/` is niet inhoudelijk geanalyseerd** — 12 MB JS/CSS/afbeeldingen, waaronder de React-gebaseerde Course Builder en Setup Wizard. Dat is een eigen frontendcodebase die hier alleen als omvang voorkomt.
- Het onderscheid tussen "in de container geregistreerd" en "in productie actief" berust op het lezen van `Provider::register()` en de feature-constanten. Een add-on of de Hub kan providers bijregistreren die ik niet zie.
