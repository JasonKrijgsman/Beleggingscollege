# 15 — De Uncanny Toolkit: een telling van LearnDash's gaten

> Broncode-analyse van 5 augustus 2026. Bron: **Uncanny Toolkit for LearnDash, versie 3.8.0.3** (releasedatum 29 mei 2026 volgens de changelog), de **gratis** versie zoals die vandaag van wordpress.org komt. Pluginheader: `Requires at least: WP 5.8`, `Requires PHP: 7.4`, licentie GPLv3, auteur Uncanny Owl. De readme claimt **30.000+ actieve LearnDash-sites**.
>
> **Waarom dit hoofdstuk bestaat.** De andere hoofdstukken lezen LearnDash zoals LearnDash zichzelf beschrijft. Dit hoofdstuk leest iets anders: een verzameling van 16 gratis en ~35 betaalde modules die één bedrijf tien jaar lang heeft gebouwd omdát cursusexploitanten er telkens weer om vroegen. Het is daarmee **een telling van LearnDash's gaten zoals echte verkopers ze voelen** — niet zoals marketing ze beschrijft. Elke module is een klacht die vaak genoeg terugkwam om er code voor te schrijven.
>
> De vraag die dit hoofdstuk uiteindelijk beantwoordt staat onderaan: **welke van deze gaten hebben wij ook?**

---

## 1. Wat de Toolkit is, en hoe hij in elkaar zit

De Toolkit is geen plugin met één functie maar een **containerplugin met aan/uit-schakelaars**. Je installeert hem, je krijgt een beheerpagina (`admin.php?page=uncanny-toolkit`) met een raster van modulekaartjes, en je zet aan wat je nodig hebt. De pluginbeschrijving in de header is één zin: *"Extend LearnDash with a variety of complementary features"*.

### 1.1 De architectuur in vijf regels

Alles draait om vier bestanden in `src/`:

| Bestand | Rol |
|---|---|
| `config.php` (888 regels) | De **basisklasse** `Config`. Bevat de aan/uit-lijst, het instellingenmechanisme, de HTML-generator voor het instellingenformulier en een handvol padhelpers. Elke module erft hiervan. |
| `interfaces/required-functions.php` (343 bytes) | De interface `RequiredFunctions`. Dwingt precies twee statische methodes af: `get_details()` en `dependants_exist()`. |
| `boot.php` (540 regels) | De **starter**. Registreert een eigen SPL-autoloader, leest de lijst met actieve klassen en instantieert die. |
| `admin-menu.php` (34 kB) | De **beheerpagina**. Scant de map `classes/`, roept per klasse `get_details()` aan via reflectie en bouwt daaruit het modulerooster. |
| `classes/sample.php` (10 kB) | Een **lege voorbeeldmodule** die meegeleverd wordt in de release, volgestopt met commentaar dat uitlegt hoe je een module schrijft. |

Een module is dus letterlijk: één PHP-bestand in `src/classes/`, met een klasse die `Config` uitbreidt en `RequiredFunctions` implementeert.

### 1.2 Registratie gebeurt door de bestandsnaam, niet door een register

Dit is het opvallendste ontwerpbesluit, en tegelijk het broosste. Er is **geen manifest, geen registratielijst, geen `register_module()`-aanroep**. De koppeling tussen klasse en bestand is een naamconventie, twee kanten op:

```php
// boot.php — klasse → bestand
// MyClassName → my-class-name.php
$class_to_filename       = lcfirst( $class );
$split_class_to_filename = preg_split( '#([A-Z][^A-Z]*)#', $class_to_filename, 0, ... );
$file_name               = 'classes/' . strtolower( implode( '-', $split ) ) . '.php';
```

```php
// admin-menu.php — bestand → klasse
$class_name = str_replace( '.php', '', $file );      // 'learn-dash-resume'
$class_name = ucwords( str_replace( '-', ' ', $class_name ) );  // 'Learn Dash Resume'
$class_name = $name_space . '\\' . str_replace( ' ', '', $class_name ); // \LearnDashResume
```

Dat werkt, maar het betekent dat een hernoeming van een bestand een module stilzwijgend laat verdwijnen uit het rooster. Vergelijk met ons `src/components/lesson-tools.tsx`: daar is de registry een volledige `Record`, en een vergeten registratie **breekt de build**. Zij hebben die vangrail niet; PHP kan hem ook niet bieden.

### 1.3 De aan/uit-schakelaar is één WordPress-optie

De hele feature-flag-laag is één rij in `wp_options`:

```php
// config.php
public static function get_active_classes() {
    self::$available_plugins = get_option( 'uncanny_toolkit_active_classes', array() );
```

De AJAX-handler `ajax_activate_deactivate_module()` voegt de volledig gekwalificeerde klassenaam toe aan of haalt hem uit die array. `boot.php` instantieert vervolgens alléén wat in die lijst staat. Uit-staande modules kosten nul: hun bestand wordt niet eens geladen.

Drie details die het patroon compleet maken:

- **De vlag is de klassenaam zelf.** Geen id, geen enum — de string `uncanny_learndash_toolkit\LearnDashResume` ís de vlag. Elegant, en meteen de reden dat er in `boot.php` een lelijke reparatie staat voor installaties die backslashes uit databasewaarden strippen (`str_replace( 'toolkit', 'toolkit\\', $class )`).
- **Instellingen wonen per module in een eigen optie**, met de klassenaam (zonder namespace) als optienaam: `get_option( 'LoginRedirect' )`. De waarde is een array van `{name, value}`-paren. Dat is geen schema; het is een zak sleutel-waardeparen, en het lezen ervan gaat met een lineaire zoektocht in `get_settings_value()`.
- **Een module kan zichzelf onbruikbaar verklaren.** `dependants_exist()` geeft `true` terug óf een string zoals `'Plugin: LearnDash'`. Staat de afhankelijkheid er niet, dan vervangt het rooster de aan/uit-schakelaar door die tekst. Dat is een klein maar goed idee: **de feature-flag kent haar eigen randvoorwaarden en legt zelf uit waarom ze niet aan kan.**

### 1.4 Wat dit zegt over het ontwerpen van een feature-flag-systeem

Vijf dingen die de moeite waard zijn, los van WordPress:

1. **Eén lijst met actieve dingen, en niets laden wat niet in die lijst staat.** Geen "geladen maar inactief"-toestand, dus geen halfdode code die toch hooks registreert. (Zie §5 voor de plek waar ze deze regel zelf breken.)
2. **De module beschrijft zichzelf** — titel, omschrijving, categorie, pictogram, documentatielink, instellingen — in één functie (`get_details()`). De beheerpagina weet niets van modules; ze vraagt het ze. Dat is de reden dat het toevoegen van een module echt één bestand is.
3. **Instellingen zijn data, geen HTML.** Een module levert een array `[{type: 'checkbox', label: …, option_name: …}]`, en `Config::settings_output()` maakt daar het formulier van. Zeven veldtypes (`html`, `text`, `number`, `color`, `textarea`, `checkbox`, `radio`, `select`) dekken 16 modules af — inclusief eentje met 66 instellingen.
4. **Voorwaardelijke velden zitten in de data**, niet in maatwerk-JavaScript: een veld met `show_if` krijgt de klasse `row-hide` en een `data-show-if`-attribuut, en één generiek script doet de rest.
5. **De boilerplate wordt meegeleverd als werkende code.** `sample.php` is geen documentatie *over* het patroon; het is het patroon, met alle varianten uitgeschreven (`$class_icon` wordt er vier keer achter elkaar overschreven om alle vier de pictogramsoorten te tonen). Slordig als code, uitstekend als sjabloon. Ons equivalent is `docs/cursusfabriek.md` — hetzelfde idee, andere vorm.

---

## 2. De volledige inventaris van de gratis versie (16 modules)

Alle 16 modules die in `src/classes/` staan (`sample.php` niet meegerekend), gegroepeerd op thema. De kolom **"welk gat dicht dit"** is mijn oordeel op basis van wat de code doet, tenzij anders vermeld.

### 2.1 Voortgang en cursusnavigatie — 3 modules

| Module (klasse) | Wat het doet | Welk gat in LearnDash dicht dit |
|---|---|---|
| **Resume Button** (`LearnDashResume`) | Onthoudt de laatst bezochte cursus/les/topic per gebruiker en levert vier shortcodes voor een "Hervatten"-knop, globaal of per cursus. | LearnDash weet wél waar je gebleven bent, maar **biedt geen knop om erheen te gaan**. Voortgang is een percentage, geen plek. Zie §3.1. |
| **Topics Autocomplete Lessons (Legacy)** (`MarkLessonsComplete`) | Zet een les op afgerond zodra alle topics én quizzen eronder afgerond zijn, en stuurt de leerling door naar de volgende stap. | **Voltooiing rolt in LearnDash niet omhoog.** Alle topics afvinken maakt de les niet af; de leerling moet terug naar de les klikken en daar nóg eens op "Mark Complete" drukken. Zie §3.2. |
| **Quiz completion advances to next step** (`QuizCompletionRedirect`) | Herschrijft de doorstuur-URL na "Klik hier om verder te gaan" op de quizuitslag, zodat je in de volgende stap landt in plaats van terug bij de les. | Na een quiz zet LearnDash je **terug op de les waar je vandaan kwam**. De leerling denkt dat hij vastzit. Zie §3.3. |

### 2.2 Toegang en inschrijving — 2 modules

| Module | Wat het doet | Welk gat |
|---|---|---|
| **Not Enrolled Redirect** (`RedirectNotEnrolled`) | Voegt per cursus een veld "Not enrolled Redirect URL" toe; niet-ingeschreven bezoekers (en uitgelogden) worden daarheen gestuurd in plaats van de cursuspagina te zien. | LearnDash toont niet-kopers de **cursuspagina met een slotje**, niet een verkooppagina. Wie zijn eigen verkooppagina heeft, kan er niet naartoe sturen. Zie §3.4. |
| **Show Or Hide Content** (`ShowHideContent`) | Shortcode `[uo_show for="loggedin|loggedout"]…[/uo_show]`. | Er is **geen ingebouwde manier om één alinea alleen aan ingelogden te tonen**. Vooral gebruikt bij `Open`-cursussen, waar LearnDash geen enkele afscherming doet. |

### 2.3 Inloggen, registreren en menu's — 4 modules

| Module | Wat het doet | Welk gat |
|---|---|---|
| **Front End Login** (`FrontendLoginPlus`) — **4.140 regels, 133 kB, 66 instellingen** | Volledig eigen inlogformulier op de voorkant: shortcode + modaal venster, AJAX, wachtwoordherstel, wachtwoordsterkte, registratielink, reCAPTCHA én Cloudflare Turnstile, handmatige accountgoedkeuring ("verify/unverify" als bulkactie op de gebruikerslijst), 2FA-koppeling met WP 2FA, blokkade van `wp-login.php`, eigen mailteksten. | WordPress' eigen `wp-login.php` is **zichtbaar WordPress**, staat op een vast adres, is een bekend botdoelwit en past bij geen enkel cursusthema. Dit is met afstand de grootste module — zie §3.5 voor wat dat betekent. |
| **Log In/Log Out Redirects** (`LoginRedirect`) | Doorstuur-URL na inloggen en na uitloggen, voor alle niet-beheerders. Plus — veelzeggend — een instelling **"Redirect Priority"** (standaard 999). | WordPress stuurt na inloggen standaard naar `/wp-admin/`, het laatste wat een cursist moet zien. Zie §3.6 over die prioriteitsinstelling. |
| **Log In/Log Out Links** (`LoginLogoutMenu`) | Voegt Inloggen/Uitloggen/Registreren toe als echte menu-items (met eigen metabox bij Menu's) en als shortcodes; het label wisselt mee met de inlogstatus. | WordPress-menu's zijn **statisch**: er is geen ingebouwd menu-item dat "Inloggen" of "Uitloggen" toont afhankelijk van wie er kijkt. |
| **Menu Item Visibility** (`MenuItemVisibility`) | Per menu-item aanvinken: alleen tonen aan ingelogden / uitgelogden. Doet dat met een eigen `Walker_Nav_Menu_Edit` en een filter op `wp_get_nav_menu_items`. | Zelfde gat, andere kant: **menu-items kennen geen zichtbaarheidsvoorwaarde**. |

### 2.4 Certificaten — 2 modules

| Module | Wat het doet | Welk gat |
|---|---|---|
| **Show Certificates** (`ShowCertificatesShortcode`) | Shortcode die alle verdiende certificaten (cursus, quiz én groep) toont, nieuwste bovenaan. | Een cursist kan zijn certificaten **alleen terugvinden via de cursus waar ze bij horen**. Er is geen "mijn certificaten"-overzicht. Veelzeggend detail: de module moet daarvoor álle cursussen van de gebruiker doorlopen en per cursus vragen of er een certificaat aan hangt (een N+1-lus), want er is nergens een index van uitgereikte certificaten. |
| **Certificate Widget** (`WidgetCert`) | Hetzelfde, maar als WordPress-widget voor een zijbalk. Erft van `WP_Widget`, niet van `Config` — de enige module die uit het patroon valt. | Zelfde gat; ander plaatsingsmechanisme. Dat er twéé modules nodig zijn voor één functie is puur WordPress-erfenis (shortcode-wereld vs. widget-wereld). |

### 2.5 Beheer en support — 3 modules

| Module | Wat het doet | Welk gat |
|---|---|---|
| **User Switching** (`UserSwitching`) | "Inloggen als" een andere gebruiker en veilig terugschakelen. Dit is een **meegeleverde kopie van John Blackbourns bekende User Switching-plugin** (50 kB in `includes/`), met een dun laagje eromheen dat de knop ook in LearnDash's Focus Mode toont. | Supportvraag nummer één bij elk cursusplatform is *"bij mij zie ik iets anders"*. Zonder dit moet je de klant om zijn wachtwoord vragen. Dat ze hiervoor een externe plugin **integraal insluiten** in plaats van ernaar te verwijzen, zegt hoe onmisbaar ze het vinden. |
| **Disable Emails** (`DisableEmails`) | Blokkeert alle uitgaande WordPress-mail zolang de module aanstaat, met een waarschuwing in de adminbalk. Vervangt `PHPMailer` door een mock-object. | **Een kopie van een productiesite mailt vrolijk echte klanten.** Er is geen test-modus in WordPress of LearnDash. Dit is een staging-veiligheidsgordel. |
| **Groups in User Profiles** (`LearndashGroupUserProfile`) | Toont in het WordPress-gebruikersprofiel bij welke LearnDash-groepen iemand hoort. | Groepslidmaatschap is in LearnDash **alleen vanuit de groep zichtbaar**, niet vanuit de gebruiker. Bij een supportvraag "waarom ziet deze klant cursus X" moet je alle groepen langs. |

### 2.6 Presentatie — 2 modules

| Module | Wat het doet | Welk gat |
|---|---|---|
| **Breadcrumbs** (`Breadcrumbs`) | Kruimelpad dat de cursushiërarchie kent (Home › Dashboard › Cursus › Les › Topic), als shortcode, met koppeling naar Yoast (`wpseo_breadcrumb_output`) en LearnDash's eigen `learndash_breadcrumbs`-filter. Respecteert de custom labels van LearnDash. | Cursus → les → topic is een **echte hiërarchie die WordPress-thema's niet kennen**: die zien vier losse custom post types. Zonder kruimelpad weet de leerling niet waar hij is. |
| **Hide Admin Bar** (`HideAdminBar`) | Verbergt de zwarte WordPress-balk per rol. Genereert zijn instellingen dynamisch uit `$wp_roles` en **laat rollen met `manage_options` bewust weg** uit de lijst. | De adminbalk verraadt dat je site WordPress is en biedt cursisten links waar ze niets te zoeken hebben. Nette vondst: je kunt hem niet per ongeluk voor jezelf uitzetten. |

**Telling:** 6 modules zijn LearnDash-specifiek (`category: learndash`), 10 zijn generiek WordPress. Dat is op zichzelf een bevinding: **ruim de helft van "de ontbrekende instellingen van LearnDash" is eigenlijk ontbrekende WordPress.** Wie zelf bouwt, heeft die tien al.

---

## 3. De zes modules die ons wél iets leren — in de code

### 3.1 Resume Button: hervatten is geen voortgang, maar een aanwijzer

**Het probleem.** LearnDash weet welke stappen je afgerond hebt (`_sfwd-course_progress`, zie hoofdstuk 10), maar niet waar je *was*. Op een cursuspagina staat een percentage en een lijst; er is geen "ga verder".

**Hoe ze het opgelost hebben** — en dit is de kern:

```php
// classes/learn-dash-resume.php
add_action( 'wp_head', array( __CLASS__, 'find_last_known_learndash_page' ) );

public static function find_last_known_learndash_page() {
    if ( is_singular( $learn_dash_post_types ) ) {
        update_user_meta( $user->ID, 'learndash_last_known_page', $step_id . ',' . $step_course_id );
        if ( 'sfwd-courses' !== $post->post_type ) {
            update_user_meta( $user->ID, 'learndash_last_known_course_' . $step_course_id, $step_id );
        }
    }
}
```

Dat is het. **Elke paginaweergave van een cursus, les, topic, quiz, certificaat of opdracht schrijft naar de database**, in `wp_head`. Twee rijen per bezoek: één globale aanwijzer en één per cursus.

**Wat het ze kostte:**

- **Een schrijfactie per paginaweergave.** Op een site met paginacache betekent dit bovendien dat de pagina niet gecachet kán worden voor ingelogden — een van de vaste kostenposten uit hoofdstuk 06 §9.
- **Eén `user_meta`-rij per cursus per gebruiker**, met een sleutel waar het cursus-id in zit (`learndash_last_known_course_412`). Onopzoekbaar en ongeïndexeerd; je kunt er nooit een vraag over stellen als "welke leerlingen zijn blijven steken in module 3".
- **Drie aparte invalidatie-hooks.** Omdat de aanwijzer los staat van de voortgang kan hij naar iets wijzen dat niet meer bestaat. Ze haken daarom op het resetformulier (`reset_resume_data`), op LearnDash' eigen "verwijder gebruikersdata" (`learndash_delete_user_data`) én op de activiteitenlog om te zien of iemands voortgang op nul is gezet (`reset_resume_data_by_learndash_activity`). Dat is een lesje in gedenormaliseerde staat: **je betaalt de rekening niet bij het schrijven, maar bij elke gebeurtenis die je aanname ongeldig maakt.**
- **Twee verschillende definities van "hervatten"** in één module: de globale shortcode gebruikt `learndash_last_known_page`, de cursus-shortcode `learndash_last_known_course_<id>`. Ze deelt de renderlogica niet — die staat twee keer bijna identiek in het bestand (regels 184–281 en 312–455). Klassieke copy-paste-schuld.

**De les voor ons.** Hoofdstuk 08 §2.4 noemde "ga verder waar je was" al als kandidaat, met de opmerking dat wij de data al hebben. Deze code scherpt dat aan in ons voordeel: **zij moesten een aanwijzer bijhouden omdat hun voortgang geen ordening kent.** Onze `lesson_progress` plus de vaste volgorde in `src/content/` maakt "de eerste niet-afgeronde les" een pure functie van bestaande gegevens — geen extra schrijfactie, geen invalidatie, geen tweede waarheid. Wie dit bij ons bouwt en daarvoor een `laatstBezochteLes`-kolom wil toevoegen, kiest hun ontwerp inclusief hun rekening.

Nuance: "laatst bezocht" en "eerste niet-afgeronde" zijn niet hetzelfde. Wie een les overslaat en verderop leest, wordt door de berekende variant teruggestuurd. Dat is een productkeuze, geen technische; en het onze past beter bij een aanmoedigend merk dan bij een poortwachter.

### 3.2 Topics Autocomplete Lessons: voltooiing rolt niet omhoog

**Het probleem, en het is een schokkende.** In LearnDash maakt het afronden van alle topics onder een les die les **niet** af. De cursist moet terugklikken naar de lespagina en daar apart op "Mark Complete" drukken. Deze module haakt op `learndash_topic_completed` en doet dat werk.

**Wat het ze kostte — vier dingen die er niet mooi uitzien:**

1. **Ze moesten een LearnDash-kernfunctie kopiëren.** Het bestand bevat `learndash_lesson_topics_completed()` met het commentaar *"Modified Learndash function for adding user id support"* — de originele functie werkt alleen op de ingelogde gebruiker. Zodra je iets voor een *andere* gebruiker wilt doen (en dat wil je, bij automatisering), is de kern-API onbruikbaar en fork je hem. Elke LearnDash-update kan dit stuk stil laten afwijken.
2. **De doorverwijzing moet naar de `shutdown`-hook**, met dit commentaar: *"The do_action topic completed runs before the activity log is updated."* Hun eigen event vuurt vóórdat de staat waar het event over gaat is weggeschreven. Ze wachten dus tot het einde van het verzoek voordat ze mogen vertrouwen op wat ze net zelf veroorzaakt hebben. Vergelijk met onze atomaire CTE's, waar de gebeurtenis en de staat per definitie dezelfde transactie zijn.
3. **Een lege functie als event-doorgeefluik:**
   ```php
   // Adding Lesson completed dummy filter so that BadgeOS ( or any other plugin ) hooking in to
   // learndash_lesson_completed can run here.
   add_filter( 'learndash_lesson_completed', array( __CLASS__, 'learndash_lesson_completed_filter' ) );
   ```
   `learndash_lesson_completed_filter()` is letterlijk `{}`. Ze registreren een lege functie alleen om een event te laten bestaan waar andermans gamification-plugin op kan haken. Dat is het hooks-ecosysteem uit hoofdstuk 07 §4 van zijn onaantrekkelijke kant.
4. **Een dubbele lus met een fout erin.** `check_lesson_complete()` loopt voor elke quiz in de les door álle quizpogingen van de gebruiker; de `else`-tak duwt een quiz in `quiz_list_left` bij elke niet-matchende poging. Een quiz die je *wél* gehaald hebt kan daardoor in de lijst "nog te doen" belanden. Dat het niet misgaat, komt door een tweede controle verderop (`learndash_is_quiz_notcomplete`) die de foute lijst opvangt. **Een verdedigende hercontrole redt hier een verkeerde berekening** — prima vangnet, slecht ontwerp om op te leunen.

De module heet inmiddels **"(Legacy)"**: de Pro-versie heeft er drie opvolgers voor (autocomplete bij bezoek, bij quizuitslag, bij nakijken). Zie §4.

**De les voor ons.** Wij hebben dit gat per constructie niet: `completeLesson()` is het enige muterende pad en er zit geen tussenniveau tussen les en cursus dat afzonderlijk afgevinkt moet worden. Onze `Course → Module → Lesson` heeft één afrondbaar niveau (de les); LearnDash heeft er drie (topic, les, cursus) die elk apart bevestigd willen worden. **De hiërarchie diep maken kost je een rolluik-probleem** — goed om te weten als er ooit sublessen bedacht worden.

### 3.3 Quiz completion advances to next step: doodlopende weg na de quiz

Kleine module, scherp probleem. LearnDash zet je na een quiz **terug op de les waar de quiz bij hoorde**. De cursist ziet de les die hij net af heeft en concludeert dat hij vastzit.

De oplossing is netjes gedaan en verdient een compliment: ze haken op het filter `learndash_course_step_completion_url` (prioriteit 99) en **doen niets tenzij alle signalen kloppen** — de query-parameter `quiz_redirect` moet gezet zijn, het `quiz_id` in de URL moet gelijk zijn aan dat in het filter, het post type moet echt `sfwd-quiz` zijn, en het `quiz_type` moet `lesson` zijn (want voor cursusbrede quizzen doet LearnDash het al goed). Pas dan berekenen ze de volgende stap: nog een quiz in deze stap? → volgende stap? → anders de volgende les, en zonodig wordt de bovenliggende les onderweg afgerond.

**Wat we hiervan meenemen:** dit is hoe je een gedraging van een ander systeem overschrijft zonder het te breken — **vier goedkope condities die je vroeg laten teruggeven wat je kreeg** (`return $default_url`), en alleen ingrijpen als je zeker weet dat je naar het juiste geval kijkt. Dat patroon is los van WordPress bruikbaar, en het is hoe je een filter schrijft die een update overleeft.

Voor ons is het gat zelf niet van toepassing: onze quiz zit ín de les en de les heeft haar eigen afrondknop met navigatie. Wél relevant als bevestiging: **na een afgeronde quiz hoort de leerling vooruit te kijken, niet achteruit.** Dat is een controlepunt voor onze lespagina.

### 3.4 Not Enrolled Redirect: de cursuspagina is geen verkooppagina

De cursuspagina van LearnDash toont niet-kopers het curriculum met slotjes. Wie een echte verkooppagina heeft (met verhaal, prijs, garantie), wil daar naartoe sturen. Dat kan niet, dus deze module.

Twee dingen uit de code zijn de moeite:

```php
if ( ! sfwd_lms_has_access( $post->ID, get_current_user_id() )
     && null === learndash_user_group_enrolled_to_course_from( $user->ID, $post->ID, true ) ) {
```

**Er zijn twee toegangsbronnen die je allebei apart moet vragen** — directe inschrijving en groepslidmaatschap. Precies de versplintering die hoofdstuk 10 al vaststelde en waar wij één functie (`heeftToegangTot()`) tegenover zetten. Hier zie je de kosten aan de gebruikerskant: elke integratie moet beide onthouden, en wie er één vergeet, stuurt betalende klanten naar de verkooppagina.

En:

```php
if ( apply_filters( 'uncanny_toolkit_not_enrolled_redirect_nocache', false, $post->ID, 0 ) ) {
    nocache_headers();
}
```

Een filter dat je aan moet zetten om te voorkómen dat een paginacache de doorverwijzing van gebruiker A aan gebruiker B serveert. Standaard **uit**. Dat is een toegangsbeslissing die achter een prestatie-instelling verstopt zit — het soort stille fout waar hoofdstuk 08 §1 al over ging.

**Voor ons:** wij lossen dit per constructie op (`/cursussen/[slug]` toont niet-kopers het curriculum plus koopknop, en de SEO-huisregel "stuur niemand naar een pagina die voor hem op slot zit" staat in `CLAUDE.md`). Wat de module wél blootlegt is een vraag die wij nog niet gesteld hebben: **wat ziet een uitgelogde bezoeker die een directe link naar een betaalde les krijgt?** Bij ons het slotscherm — dat is bewust en goed. Maar of dat slotscherm ook echt naar de verkooppagina leidt, is een detail dat bij LearnDash-exploitanten dus vaak genoeg misging om er een module voor te schrijven.

### 3.5 Front End Login: de grootste module is een inlogformulier

Dit is het meest verrassende cijfer uit de hele plugin. **Van de 16 gratis modules is er één die 4.140 regels beslaat, 133 kB weegt en 66 instellingen heeft.** Alle andere vijftien samen zijn kleiner. Het is geen leerfunctie, geen rapportage, geen cursuslogica — het is een inlogscherm.

Wat er allemaal in zit: eigen formulier als shortcode én als modaal venster, AJAX-verzending, wachtwoord vergeten met eigen teksten, instelbare wachtwoordsterkte, registratielink, reCAPTCHA (v2/v3), Cloudflare Turnstile als tweede optie, handmatige accountgoedkeuring met "Verify/Unverify" als bulkactie op de gebruikerslijst en een goedkeuringsmail, koppeling met de WP 2FA-plugin via haar REST API, blokkade van het originele `wp-login.php`, en per-veld instelbare labels en foutmeldingen (dáár zitten de 66 instellingen).

**Wat dit vertelt over de markt:** het inlogscherm is voor een cursusverkoper geen technisch detail maar de eerste indruk, een spamdoelwit én een merkkwestie. WordPress levert daar iets voor dat er onmiskenbaar uitziet als WordPress. De hoeveelheid code die hier tegenaan gegooid is, is het bewijs dat exploitanten dit belangrijk genoeg vinden om het te vervangen.

**Voor ons is dit vrijwel volledig ruis** — en dat is een prettig soort ruis. Wij hebben Google OAuth via Auth.js met database-sessies: geen wachtwoorden, dus geen wachtwoordherstel, geen sterkte-instelling, geen brute-force-oppervlak, geen CAPTCHA, geen 2FA-vraagstuk, geen eigen registratieformulier. Eén van de zwaarste posten in het LearnDash-ecosysteem hebben wij weggeontworpen door geen wachtwoorden te hebben. Dat is het vermelden waard bij elke toekomstige discussie over "moeten we ook e-mail+wachtwoord aanbieden".

De enige twee ideeën die het overwegen waard blijven: **handmatige accountgoedkeuring** (voor ons niet nodig — betaling ís de goedkeuring) en de gedachte dat **inlog- en registratieteksten merkteksten zijn**. Dat laatste hebben we al: onze `/inloggen` is een eigen pagina.

### 3.6 Log In/Log Out Redirects: en de instelling die alles verraadt

De module zelf is triviaal: stuur niet-beheerders na inloggen naar een URL, en na uitloggen naar een andere. Het gat is bekend — WordPress stuurt standaard naar `/wp-admin/`, en LearnDash heeft geen leerlingdashboard om naartoe te sturen (dat is een Pro-module, `Course Dashboard`, zie §4).

Maar er is een derde instelling, en die is het echte artefact:

```php
array(
    'type'        => 'text',
    'label'       => esc_html__( 'Redirect Priority', 'uncanny-learndash-toolkit' ),
    'option_name' => 'redirect_priority',
    'placeholder' => '999'
),
```

**Ze hebben de prioriteit van een WordPress-hook als klantinstelling in de gebruikersinterface gezet**, met standaard 999 ("bijna laatste"). Dat betekent: er vechten zoveel plugins om `login_redirect` dat er geen vaste volgorde te kiezen valt, en de eindgebruiker moet zelf maar experimenteren tot zijn doorverwijzing wint. Daarnaast staan er nog twee filters (`uo_do_login_redirect`, `uo_do_logout_redirect`) om de hele module vanuit code uit te zetten.

Dat is de meest compacte samenvatting van de prijs van een open plugin-ecosysteem die ik in deze codebase gevonden heb: **als iedereen alles mag overschrijven, wordt "wie wint" een instelling.** Hoofdstuk 08 §4.1 noemt hooks als LearnDash' echte moat; dit is de andere kant van diezelfde munt. Onze redirects zijn functieaanroepen met één definitie — saai, en dat is precies de bedoeling.

---

## 4. Wat Pro toevoegt: de commercieel waardevolst geachte gaten

De gratis plugin bevat een **hardgecodeerde lijst van 30 Pro-modules** (`AdminMenu::get_psuedo_pro_modules()`) die als grijze, niet-aanzetbare kaartjes in het rooster verschijnen met de tekst *"This module requires Uncanny Toolkit Pro"*. De readme noemt er 34 bij naam en claimt er "momenteel 35". Dit is dus letterlijk een verkooplijst — en daarmee de scherpste indicatie van **welke gaten Uncanny Owl commercieel het meest waard vindt**.

Thematisch geordend:

| Thema | Pro-modules | Wat dit over de markt zegt |
|---|---|---|
| **Autocomplete (7 modules)** | Autocomplete Lessons & Topics (bij bezoek) + varianten voor Gravity Forms, Fluent Forms, Formidable, WPForms, quizuitslagpagina en handmatig nagekeken quiz | Verreweg de grootste categorie. De vraag "markeer dit automatisch als afgerond" komt in **zeven verschillende aanleidingen** terug. De omschrijving van de quizuitslag-variant verklapt de echte pijn: *"so users that forget to click 'Click here to continue' don't get stuck in a course"*. **Verplichte handmatige afvinkacties laten cursisten vastlopen** — dat is de duurste ontwerpfout in dit hele ecosysteem. |
| **B2B / groepen (7)** | Group Registration (eigen inschrijf-URL per groep), Group Expiration (+ herinneringsmails), Group Login Redirect, Group Logo/List, Drip Lessons by Group, Drip Topics by Group, Group Forums met bbPress, Improved Group Leader Interface (afgeschreven) | De op één na grootste categorie, en precies het terrein uit hoofdstuk 03 §4 / 08 §2.7. Alles wat een zakelijke klant nodig heeft — zelf-inschrijving, verlooptermijnen, eigen huisstijl, gedeeltelijke vrijgave per cohort — ontbreekt in LearnDash-core. |
| **Certificaten (5)** | Email Course/Quiz/Group Certificates, Download Certificates in Bulk, Certificate Preview | LearnDash **mailt het certificaat niet** en bewaart geen PDF. Bevestigt hoofdstuk 08 §2.3 vanuit een tweede richting. `Certificate Preview` (bekijken zonder de editor te verlaten) is een pure ontwerp-ergernis. |
| **Front-end overzichten (5)** | Course Dashboard, Enhanced Course Grid, Enhanced Lesson/Topic Grid, Learner Transcript, Lazy Loading Course Navigation | **Er is geen leerlingdashboard.** Vier van de vijf bestaan om lijsten met cursussen op de voorkant te krijgen; de vijfde omdat LearnDash' eigen navigatiewidget bij veel lessen de pagina traag maakt. |
| **Voortgang & tijd (3)** | Reset Progress Button, Simple Course Timer (incl. inactiviteitsdetectie en quiz-blokkade op minimale tijd), Days Until Course Expiry | Een cursist kan **zijn eigen voortgang niet resetten** om een cursus opnieuw te doen. Bestede tijd wordt niet gemeten (relevant voor accreditatie/PE-punten). |
| **Beheer & data (4)** | Import Users (CSV, incl. cursus- en groepstoewijzing), Duplicate Pages & Posts (*"This plugin handles quiz duplication properly"*), Enhanced LearnDash CSV Reports, Restrict Page Access | Massa-inschrijving is er niet. Die opmerking bij dupliceren is een rechtstreekse verwijzing naar het probleem uit hoofdstuk 01 §11: **klonen laat quizinstellingen vallen**. Een betaalde module om een bug in de kern te omzeilen. |
| **Overig (2)** | Single Page Courses (microlearning zonder lessen), Sample Lesson Label, Lesson/Topic/Quiz Table Colors (beide "legacy") | Het contentmodel is te star voor een cursus van één pagina — je moet een niveau *afpellen* en dat is een betaalde module. |

**De conclusie uit deze verdeling.** Zeven van de ~35 Pro-modules gaan over automatisch afronden en zeven over groepen. Als je die twee clusters weglaat, blijft er nauwelijks een Pro-plugin over. **De twee gaten waar echt geld in zit zijn dus: "laat de cursist niet vastlopen op een knop" en "verkoop aan bedrijven".** Dat komt precies overeen met de twee onderwerpen die hoofdstuk 08 al aanwees (§2.7 B2B) — met dit verschil, dat de autocomplete-categorie er in onze synthese nog niet stond, simpelweg omdat wij het probleem niet hebben.

---

## 5. Code: wat te stelen, wat te vermijden

**Stelen:**

- **`get_details()` als zelfbeschrijving.** Eén functie per module die alles teruggeeft wat een beheerscherm nodig heeft. Het beheerscherm kent geen enkele module bij naam. Als `/beheer` ooit modulair wordt, is dit de vorm.
- **`dependants_exist()`.** Een feature die zelf weet waarom ze niet aan kan, en dat als tekst teruggeeft in plaats van als `false`. Een uitgeschakelde knop met de reden ernaast scheelt een supportmail.
- **Instellingen als data, formulier als generator.** Zeven veldtypes dekken 66 instellingen van de grootste module. Wij hebben dit gat nog niet (onze instellingen zijn omgevingsvariabelen en code), maar zodra `/beheer` echte knoppen krijgt is dit het patroon.
- **Vroeg teruggeven in een override.** `QuizCompletionRedirect` (§3.3): vier goedkope condities, elk met `return $default_url`. Zo schrijf je code die andermans gedrag aanpast zonder het te breken.
- **De verdedigende hercontrole.** Dat `learndash_is_quiz_notcomplete` een verkeerd samengestelde lijst opvangt (§3.2) is toeval, maar het patroon niet: **controleer vlak voor de actie opnieuw, met de gezaghebbende bron.** Dat is wat onze `heeftToegangTot()` in de lespagina ook doet.
- **Uit is écht uit.** Een uitgeschakelde module wordt niet geladen. Wij hebben dezelfde regel bij de bezoekmeting: leeg = geen script, geen verzoek (`test/analytics.test.ts` pint dat vast).

**Vermijden:**

- **Registratie via bestandsnaamconventie.** Werkt tot iemand hernoemt; dan verdwijnt de module zonder foutmelding. Onze `Record` in `lesson-tools.tsx` breekt de build — dat is de juiste kant om op te falen.
- **Het rooster instantieert elke module om haar naam te weten.** In `get_class_details()` staat letterlijk `$class_name = get_class( new $class_name() );` — voor **alle** modules, ook de uitgeschakelde. De constructors doen (in dit ontwerp) alleen `add_action('plugins_loaded', …)`, en die haak is op dat moment al gevuurd, dus het valt mee. Maar het is een instantiëring met bijwerkingen om metadata te lezen, precies de regel uit het vorige lijstje omgekeerd. Reflectie had gekund zonder `new`.
- **Instellingen als ongeordende zak paren.** `[{name, value}, …]` in één optie, uitgelezen met een lus. Geen schema, geen types, geen defaults op één plek — `get_settings_value()` heeft daarom een `'%placeholder%'`-truc nodig om standaardwaarden uit de formulierdefinitie terug te halen. Dit is wat je krijgt als de opslagvorm de formuliervorm volgt in plaats van andersom.
- **Ontsnappen bij het uitvoeren in plaats van bij het opslaan.** Het instellingenformulier echoot `$label`, `$description` en `$inner_html` ongefilterd; `$modal_id` en `$option_name` gaan onbewerkt in attributen. Alleen beheerders komen erbij, dus de impact is klein, maar het patroon "later ontsnappen we wel" is precies hoe WordPress-plugins CVE's oplopen.
- **Vier shortcodes voor één functie** (`uo-learndash-resume`, `uo_learndash_resume`, `uo_learndash_resume_link`, `uo_course_resume`), omdat de naamgeving ooit veranderde en de oude naam nooit weg mag. Dezelfde blijvende belasting als de typefout in de haaknaam uit hoofdstuk 14: **een publieke interface die je niet mag hernoemen, betaal je voor altijd.**
- **Dezelfde renderlogica twee keer in één bestand** (§3.1). Voorspelbaar gevolg: de ene variant respecteert het attribuut `show_name="no"` en de andere niet.

**Hoe ze niet omvallen bij een LearnDash-update:** met terughoudendheid, niet met techniek. De modules haken bijna allemaal op `plugins_loaded`, controleren eerst `global $learndash_post_types` en gebruiken waar mogelijk officiële functies. Waar dat niet kan valt het op: `function_exists( 'learndash_get_step_permalink' )` met een terugval op `get_permalink()`, en `function_exists( 'learndash_lesson_hasassignments' ) ? … : 'lesson_hasassignments'` — twee generaties API's naast elkaar in één regel. En één keer gaat het echt fout: die gekopieerde kernfunctie in §3.2, die stil kan gaan afwijken. **De echte bescherming is dat ze weinig aanraken**, niet dat ze een abstractielaag hebben.

---

## 6. Het gratis plugin is óók een meetinstrument

Dit hoort erbij, want het verklaart hoe de telling die dit hoofdstuk leest tot stand komt.

- **`src/reports/` stuurt een periodiek rapport naar `api.uncannyowl.com/toolkit/reports`**, met per site: welke modules aan staan, welke uit, welke wel/niet bruikbaar zijn, of Pro geïnstalleerd is, de licentiestatus en -sleutel, en de LearnDash-versie. Ondertekend met een HMAC over de tijdstempel en een **in de pluginbron hardgecodeerde API-sleutel** (`UNCANNY_API_KEY`) — wat betekent dat iedereen die het bestand opent geldige rapporten kan sturen; het is een authenticiteitsgebaar, geen authenticatie. Er is een instelling om het uit te zetten (`ToolkitReportSetting::is_enabled()`).
- **`src/notifications/` haalt marketingberichten op** uit `https://notifs-cdn.uncannyowl.com/wp-content/notifications.json` en toont ze in het beheerscherm.
- **`src/uncanny-one-click-installer/`** installeert andere Uncanny-plugins met één klik vanuit dit beheerscherm — Uncanny Automator voorop.
- **`src/learndash-plugins-page/`** hangt een "LearnDash Plugins"-pagina in het menu die andere Uncanny-producten aanprijst, met de plaatjes van hun eigen CDN.
- Plus: een "Upgrade to Pro"-link in de pluginlijst, een gekleurd menu-item, 30 grijze Pro-kaartjes in het rooster, en een reviewverzoek dat na 10 dagen verschijnt.

**Wat dit betekent voor de lezing van dit hoofdstuk.** De vraag "welke gaten voelen exploitanten?" is bij Uncanny Owl geen aanname maar telemetrie: ze zien over 30.000 sites welke modules aangezet worden. Dat maakt de inventaris in §2 en de Pro-lijst in §4 **een gemeten prioriteitenlijst, niet een geraden lijst** — de belangrijkste reden om deze plugin überhaupt te lezen.

En het is een bedrijfsmodel om op te merken: de gratis plugin is tegelijk product, marktonderzoek, distributiekanaal en advertentieruimte. Wij hebben geen equivalent en willen dat ook niet — maar het onderliggende idee (**meten welke functie mensen daadwerkelijk aanzetten voordat je de volgende bouwt**) is dezelfde redenering waarom onze bezoekmeting bestaat.

---

## 7. Welke van deze gaten hebben wij ook?

De eerlijke afrekening. Ons uitgangspunt: `Course → Module → Lesson` als getypte content, één quiz per les, XP/levels/streaks/badges, `entitlements` als enige toegangspoort, een minimaal `/beheer`, **geen** hervat-knop, **geen** rapportageschermen, **geen** drip, **geen** B2B.

### 7.1 Gaten die wij óók hebben

| Hun module | Ons gat | Oordeel |
|---|---|---|
| **Resume Button** | We hebben geen "ga verder waar je was", niet op `/leerpad` en niet op de cursuspagina. | **Echt gat, en het goedkoopste dat er is.** Anders dan zij hoeven wij niets te bewaren: de eerste niet-afgeronde les is af te leiden uit `lesson_progress` + de volgorde in `src/content/`. Bevestigt hoofdstuk 08 §2.4, en scherpt het aan: bouw het als berekening, niet als kolom. |
| **Show Certificates / Certificate Widget** | Ons certificaat is te bereiken via de cursus; er is geen "mijn certificaten"-overzicht op `/leerpad` of `/account`. | **Klein gat.** Bij één of twee certificaten per cursist niet urgent; het wordt zichtbaar zodra iemand drie cursussen afrondt. Combineerbaar met de verificatie-URL uit hoofdstuk 08 §2.3. |
| **Course Dashboard / Enhanced Course Grid** (Pro) | Wij hebben `/leerpad` — dus dit gat is gedicht. Maar hún vijf modules hiervoor tonen wél wat een dashboard moet kunnen: doorklikken naar de exacte les, quizuitslagen, certificaten. | **Half gedicht.** De vraag is niet of we een dashboard hebben maar of `/leerpad` naar de juiste plek doorklikt. Zie de hervat-knop. |
| **Reset Progress Button** (Pro) | Een cursist kan bij ons zijn voortgang niet resetten om een cursus opnieuw te doen. | **Gat, laag geprioriteerd** — en bij ons ingewikkelder dan bij hen, want resetten raakt XP en badges. Onze XP-regel ("herhaalde les = 0 XP") maakt overdoen al mogelijk zonder reset; alleen de voltooiingsstatus blijft staan. Waarschijnlijk een niet-probleem. |
| **Simple Course Timer** (Pro) | Wij meten geen bestede tijd, niet per les en niet per cursus. | **Bewust gat.** Relevant voor accreditatie (PE-punten), niet voor B2C-beleggingsonderwijs. Niet bouwen tot iemand erom vraagt. |
| **Import Users** (Pro) | Geen massa-aanmaak van accounts. | **Gat dat pas bestaat bij B2B.** Zie hoofdstuk 08 §2.7: niet bouwen tot de eerste werkgever mailt. |
| **Enhanced CSV Reports** (Pro) | Wij hebben geen enkele export. | **Gat.** Hoort bij de minimale beheerset uit hoofdstuk 08 §2.2; CSV-export stond daar al in het lijstje. |
| **Handmatige voortgangscorrectie** (impliciet: `User Switching` + de Pro-reset) | Wij hebben geen knop om "deze les staat ten onrechte niet op afgerond" te repareren. | **Echt gat**, al vastgesteld in hoofdstuk 08 §2.2 en hier bevestigd vanuit een tweede hoek: zij hebben er twee modules voor nodig (inloggen-als + resetten). Voor ons is het één beheeractie op `lesson_progress`. |
| **Group Registration / Group Expiration / Group Logo** (Pro, 7 stuks) | Geen B2B, geen groepen, geen seats. | **Bekend, bewust uitgesteld.** Deze zeven modules zijn wél de beste specificatie van wat "groepen" concreet moet kunnen als het zover komt: zelf-inschrijving via een unieke URL, verlooptermijn met herinneringsmail, eigen logo op de inschrijfpagina. |
| **Drip Lessons/Topics by Group** (Pro) | Geen drip. | **Bewust geen gat** (hoofdstuk 08 §3: alles staat direct open na aankoop, dat is een verkoopargument). Alleen relevant bij een cohortproduct. |
| **Email Course Certificates** (Pro) | Wij mailen het certificaat niet na afronding. | **Gat, en nu haalbaar** — sinds 5 aug 2026 kan de site mailen. Hoofdstuk 08 §2.1 zet de voltooiingsmail al op nummer één; dit bevestigt dat het certificaat daarin hoort. |

### 7.2 Gaten die wij per constructie niet hebben

Dit is de langste categorie, en dat is goed nieuws — al is de eerlijke lezing: veel hiervan zijn geen prestaties van ons, maar afwezige WordPress-problemen.

| Hun module | Waarom wij het niet nodig hebben |
|---|---|
| **Topics Autocomplete Lessons** | Wij hebben één afrondbaar niveau (de les) in plaats van drie. Voltooiing hoeft nergens omhoog te rollen. `completeLesson()` is het enige muterende pad. |
| **Quiz completion advances to next step** | De quiz zit ín de les; de lespagina heeft haar eigen "volgende les"-navigatie. Er is geen tussenscherm om op vast te lopen. |
| **Front End Login** (4.140 regels!) | Google OAuth met database-sessies. Geen wachtwoorden ⇒ geen herstel, geen sterkte-instelling, geen CAPTCHA, geen 2FA-vraagstuk, geen eigen registratieformulier, geen brute-force-oppervlak. **De grootste module in dit hele ecosysteem is voor ons volledig weggeontworpen.** |
| **Log In/Log Out Redirects + de "Redirect Priority"-instelling** | Onze redirects zijn functieaanroepen met één definitie. Er is geen prioriteitenrace omdat er geen tweede partij is die mag meeschrijven. |
| **Log In/Log Out Links + Menu Item Visibility** | React rendert de navigatie op basis van de sessie. Voorwaardelijke menu-items zijn een `if`. |
| **Breadcrumbs** | Onze routes *zijn* de hiërarchie (`/cursussen/[slug]/les/[les]`), en de lespagina toont de context permanent — LearnDash moest daar `Focus Mode` voor uitvinden (hoofdstuk 08 §1). |
| **Hide Admin Bar** | Er is geen adminbalk. |
| **Show Or Hide Content** | Server components met een sessie; conditionele weergave is de standaardmanier van werken. |
| **Disable Emails** | `verstuurMail()` is één modulegrens en de SMTP-variabelen staan per omgeving. Een preview-deploy zonder die variabelen mailt niet — hetzelfde principe als "leeg = uit" bij de bezoekmeting. Wél een controlepunt: **preview-omgevingen mogen die variabelen nooit erven.** |
| **Groups in User Profiles** | `entitlements` is per gebruiker per cursus opvraagbaar; er is geen tweede toegangsbron die je apart moet nazoeken. Precies het punt uit hoofdstuk 10. |
| **Duplicate Pages & Posts** | Content is getypte data in git. Een cursus kopiëren is een bestand kopiëren; er kan niets "stil wegvallen" zoals bij hun quizduplicatie. |
| **Restrict Page Access** | `heeftToegangTot()` is de enige poort en zit op de server. |
| **Not Enrolled Redirect** | De cursuspagina *is* de verkooppagina voor niet-kopers. |
| **Lazy Loading Course Navigation** | Onze cursussen zijn tientallen lessen, geen honderden, en de lijst komt uit getypte data zonder database-queries. |
| **Single Page Courses** | Ons contentmodel dwingt geen tussenlagen af waar niets in hoeft. |
| **Lesson/Topic/Quiz Table Colors** | Tailwind-tokens in `globals.css`. |

### 7.3 Ruis: WordPress-problemen die ons niet aangaan

`User Switching` (nuttig idee, maar bij ons zou "inloggen als klant" een privacybesluit zijn dat we niet nemen — we hebben liever een leesbaar beheerscherm dan een impersonatieknop), `Certificate Widget` (widgets bestaan bij ons niet), `Sample Lesson Label`, `Improved Group Leader Interface`, `Certificate Preview`, `Group Forums met bbPress` (bewust afgevallen, `docs/ideeen.md`), en de hele autocomplete-familie-op-formulierinzending (Gravity/Fluent/Formidable/WPForms — vier modules die alleen bestaan omdat WordPress vier concurrerende formulierplugins heeft).

### 7.4 Wat ik hiervan zou onthouden

Als je de 16 gratis en ~35 betaalde modules terugbrengt tot één zin: **cursusexploitanten bouwen bij wat er tussen de lessen gebeurt, niet wat er ín de lessen gebeurt.** Geen enkele module verbetert content, quizzen of didactiek. Ze gaan allemaal over aankomen (inloggen, doorverwijzen), doorlopen (hervatten, automatisch afronden, niet vastlopen), terugvinden (dashboards, certificaten, kruimelpaden) en beheren (inloggen-als, importeren, exporteren). **Dat is de plek waar cursisten weglekken**, en het is precies het gebied waar wij het minste hebben nagedacht — onze aandacht ging naar content, betalen en toegang.

De concrete boodschappenlijst die dit hoofdstuk aan hoofdstuk 08 toevoegt, in volgorde van (waarde ÷ kosten):

1. **Hervat-knop** op `/leerpad` en de cursuspagina — als berekening, niet als opgeslagen aanwijzer (§3.1). Stond al in 08 §2.4; hier hard bevestigd én goedkoper gemaakt.
2. **Certificaat in de voltooiingsmail** (§4, certificaten-cluster). Sluit aan bij 08 §2.1.
3. **Handmatige voortgangscorrectie** in `/beheer` (§7.1). Stond in 08 §2.2, hier bevestigd vanuit hun supportgereedschap.
4. **"Mijn certificaten"-overzicht** op `/account` (§2.4).
5. **CSV-export** in `/beheer` (§4, beheer-cluster).

En één ding om niet te doen: geen tweede opslagplaats voor "waar was ik". Dat is de enige echte val in dit hoofdstuk.

---

## 8. Onzekerheden en waar ik heb geïnterpreteerd

Eerlijk gemarkeerd, zodat een volgende lezer weet wat gemeten is en wat geredeneerd:

- **De kolom "welk gat dicht dit" is mijn oordeel.** Uncanny Owl schrijft nergens op "dit bestaat omdat LearnDash X niet doet". Ik heb dat afgeleid uit wat de code doet plus wat de hoofdstukken 01–14 over LearnDash-core vaststellen. Waar hun eigen omschrijving het motief prijsgeeft (de "don't get stuck in a course"-tekst bij de quizuitslag-autocomplete) heb ik dat geciteerd.
- **De Pro-modules zijn niet gelezen.** Alleen de teaserlijst in de gratis plugin (30 items) en de readme (34 met naam, "momenteel 35"). Wat die modules technisch doen, weet ik niet; ik beoordeel alleen wat hun *bestaan* zegt.
- **De claim "30.000+ sites" komt uit hun eigen readme** en is niet geverifieerd.
- **Bij de telemetrie beschrijf ik wat de code verstuurt**, niet wat er met de gegevens gebeurt. Dat de inventaris daarmee "gemeten" is (§6) is een gevolgtrekking: ze verzamelen het, dus ze kunnen het weten. Of de Pro-lijst ook echt op die data gestuurd wordt, weet ik niet.
- **De fout in `check_lesson_complete()`** (§3.2) heb ik uit de code afgeleid, niet uitgevoerd. Dat het in de praktijk goed gaat door de latere `learndash_is_quiz_notcomplete`-controle is eveneens redenering, geen test.
- **"De grootste module in dit ecosysteem hebben wij weggeontworpen"** (§3.5, §7.2) is een vergelijking tussen ongelijke dingen: hún module lost óók merk- en spamproblemen op die wij bij Google neerleggen. Wat waar blijft: wij hebben geen wachtwoordoppervlak.
- **De datering "29 mei 2026"** komt uit de changelog en de bestandstijdstempels in de zip; de pluginheader zelf noemt alleen versie 3.8.0.3.
