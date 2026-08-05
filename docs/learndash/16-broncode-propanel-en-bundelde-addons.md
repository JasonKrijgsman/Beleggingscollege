# LearnDash 5.1.8: ProPanel, Course Grid, Course Reviews en Commerce

Dit hoofdstuk analyseert LearnDash 5.1.8 uit Jasons eigen, actieve LearnDash-licentie. De peildatum is 5 augustus 2026. Het gaat om statische broncode-analyse: ik heb de PHP- en JavaScript-bestanden gelezen, maar de plug-in niet in een draaiende WordPress-installatie uitgevoerd. De paden hieronder zijn relatief aan `sfwd-lms/`.

De drie voormalige losse add-ons blijken in 5.1.8 geen gelijksoortige “apps”. ProPanel is een rapportagemodule met een oud maar uitgebreid AJAX-dashboard; Course Grid is vooral een query-, template- en presentatielaag; Course Reviews bouwt bijna volledig op WordPress-comments. Daarnaast heeft `src/Core/Models/Commerce/` een transactiemodel dat je niet moet verwarren met het verkoopbare cursus- of groepsproduct in `src/Core/Models/Product.php`.

## 1. Eerst de bundelgrens

Alle drie add-ons hebben in `src/Core/Modules/` een provider die de gebundelde code conditioneel laadt:

| Onderdeel | Provider | Gebundelde oude ingang |
|---|---|---|
| ProPanel / Reports | `src/Core/Modules/Reports/Provider.php` | `includes/reports/learndash_propanel.php` |
| Course Grid | `src/Core/Modules/Course_Grid/Provider.php` | `includes/course-grid/learndash_course_grid.php` |
| Course Reviews | `src/Core/Modules/Course_Reviews/Provider.php` | `includes/course-reviews/learndash-course-reviews.php` |

De providers kunnen via een constante, filter of instelling worden uitgeschakeld. De legacy-loaders deactiveren bovendien een apart geïnstalleerde oudere editie om dubbele class-declaraties en dubbele hooks te vermijden. LearnDash heeft de add-ons dus niet volledig herschreven voor de `src/`-laag, maar er een moderne laad- en integratielaag omheen gezet.

Bij Reports is die compatibiliteit extra zichtbaar. `src/Core/Modules/Reports/ProPanel2.php` herkent een los ProPanel vanaf `3.0.0-dev` als een andere generatie. De code die LearnDash 5.1.8 zelf meelevert, meldt in `includes/reports/learndash_propanel.php` versie `2.2.2`. Dit hoofdstuk beschrijft de gebundelde ProPanel 2-code, niet een eventueel los ProPanel 3.

> **Vergelijk met ons**
>
> Beleggingscollege heeft geen WordPress-compatibiliteitslaag nodig. De Next.js 15 App Router kan nieuwe beheerfuncties rechtstreeks uit servercode opbouwen. Het nuttige patroon om over te nemen is wél: één duidelijke module-ingang en één plek waar een onderdeel aan- of uitgaat. Een systeem dat eerst een oude plug-in deactiveert en daarna legacy-code includeert, lost voor onze schaal geen probleem op.

## 2. ProPanel: wat het werkelijk is

### 2.1 Geen enkelvoudig dashboardtype, maar een hybride

Op de vraag “is ProPanel een adminpagina, widget, Gutenberg-blok, React of PHP-template?” is het juiste antwoord: meerdere daarvan, maar niet als één React-app.

De samenstelling begint in `src/Core/Modules/Reports/Dashboard/Mapper.php`. `Mapper::map()` deelt het dashboard in twee kolommen:

- links, vier van twaalf kolommen: `Filtering`;
- rechts, acht van twaalf: `Overview` en `Activity` in de ene helft, `Progress_Chart` en `Reporting` in de andere helft.

De wrappers staan in `src/Core/Modules/Reports/Dashboard/Widgets/Filtering.php`, `Overview.php`, `Activity.php`, `Progress_Chart.php` en `Reporting.php`. Zij erven via de moduletypes van `ProPanel2_Widget` en brengen de oude widgetclasses onder in de nieuwe LearnDash-dashboardindeling.

De daadwerkelijke oude basisclass is `LearnDash_ProPanel_Widget` in `includes/reports/includes/class-ld-propanel-base-widget.php`. Die hangt aan `wp_dashboard_setup` en gebruikt `wp_add_dashboard_widget()`. De inhoud wordt pas na het openen geladen via de AJAX-actie `learndash_propanel_template`. De beveiliging bestaat uit de nonce-actie `ld-propanel` en een rollen-/capabilitycontrole voor administrator, group leader of de capability `propanel_widgets`.

Naast de WordPress-dashboardwidgets bestaat een volledige rapportageweergave. `includes/reports/includes/class-ld-propanel.php` registreert en rendert die met PHP-templates onder `includes/reports/templates/`. `src/Core/Modules/Reports/Legacy/Settings/Page.php` plaatst Reports ook in het LearnDash-beheer en biedt daar de exportbediening. De shortcodeclass `includes/reports/includes/class-ld-propanel-shortcodes.php` registreert zowel `[ld_propanel]` als `[ld_reports]`.

Er zijn óók dynamische Gutenberg-blokken. De basis staat in `includes/reports/includes/gutenberg/lib/class-learndash-propanel-gutenberg-block.php` en roept `register_block_type()` met een server-side `render_callback` aan. De blokken zijn:

- `ld-propanel/ld-propanel-filters`;
- `ld-propanel/ld-propanel-reporting`;
- `ld-propanel/ld-propanel-link`;
- `ld-propanel/ld-propanel-activity`;
- `ld-propanel/ld-propanel-progress-chart`;
- `ld-propanel/ld-propanel-overview`.

Hun PHP- en editorbronnen staan onder `includes/reports/includes/gutenberg/blocks/`. De gebouwde editorbundle is `includes/reports/includes/gutenberg/assets/js/index.js`. Bij het renderen vertaalt de basisclass blokattributen uiteindelijk naar `[ld_reports widget="…"]`. Gutenberg is hier dus vooral een invoer- en configuratieschil; de rapportage zelf blijft server-side PHP met AJAX.

De bezoekerskant gebruikt jQuery en losse bibliotheken, geen zelfstandig React-dashboard. `LearnDash_ProPanel::enqueue_scripts()` in `includes/reports/includes/class-ld-propanel.php` registreert onder meer:

- `includes/reports/dist/js/ld-propanel.js`, gebouwd uit `includes/reports/src/assets/js/ld-propanel.js`;
- `includes/reports/dist/vendor/Chart.js`;
- Flatpickr onder `includes/reports/dist/vendor/flatpickr/`;
- Select2 onder `includes/reports/dist/vendor/select2-jquery/`;
- `includes/reports/dist/css/ld-propanel.css`.

De feitelijke vorm is daarmee:

    Gutenberg/editor of WP-dashboard
                  ↓
       shortcode/widget-wrapper
                  ↓
        PHP-template + jQuery
                  ↓
        admin-ajax.php-endpoints
                  ↓
      WordPress- en LearnDash-data

Dat verklaart waarom dezelfde widget op meer dan één plek kan verschijnen zonder dat er een tweede rapportage-API bestaat.

> **Vergelijk met ons**
>
> Ons `/beheer` is nu een minimaal intern scherm voor klanten, betaalpogingen, rechten en vraagmoderatie; er is op dit moment géén rapportage-UI. Als we die bouwen, past een server component met kleine interactieve clientcomponenten beter bij Next.js 15 dan ProPanels stapeling van shortcode, PHP-template, jQuery en `admin-ajax.php`. Het wél bruikbare idee is de functionele opdeling: filter, kerngetallen, activiteit, voortgangsgrafiek en detailrapport. Voor tientallen tot honderden gebruikers hoeven die niet als vijf onafhankelijk uitbreidbare WordPress-widgets te bestaan.

### 2.2 De centrale rapportagequery is ruwe SQL

De belangrijkste datalaag is niet `WP_Query` en ook geen volledig aparte ProPanel-repository. De functie `learndash_reports_get_activity()` in `includes/ld-reports.php` bouwt met `global $wpdb` zelf SQL op.

De standaardargumenten bevatten onder meer `user_ids`, `post_ids`, `course_ids`, `group_ids`, `activity_types`, `activity_status`, datumgrenzen, titel-/naamzoekvelden, `per_page` (standaard 10), `paged` (standaard 1), `include_meta` (standaard `true`) en `return_count_only` (standaard `false`).

De kernquery vertrekt uit `LDLMS_DB::get_table_name( 'user_activity' )`, normaal `wp_learndash_user_activity`. Zij joint `wp_posts` voor de activiteitspost en `wp_users` voor de cursist. Als `include_meta` aanstaat, komt daar `wp_learndash_user_activity_meta` bij en wordt de metainhoud per activiteit met `GROUP_CONCAT` samengevoegd. Daardoor is ook een `GROUP BY activity_id` nodig.

Een representatief, bewust kort fragment van de vorm is:

    FROM wp_learndash_user_activity AS activity
    INNER JOIN wp_posts AS posts ON posts.ID = activity.post_id
    INNER JOIN wp_users AS users ON users.ID = activity.user_id

Zoeken op titel of naam gebruikt `LIKE` tegen `post_title` en `display_name`. Gewone filters worden als `IN (...)`-voorwaarden op ID-, type- en statuskolommen gezet. De standaardvolgorde is:

    GREATEST(activity_started, activity_completed) DESC

De status “niet gestart” is geen simpele nulwaarde. Daarvoor kan de query een `access`-activiteit nemen en met een gecorreleerde `NOT EXISTS` uitsluiten dat voor dezelfde `user_id` en `post_id` al een relevante leeractiviteit bestaat. Dat is correcter dan alleen naar één statusveld kijken, maar zwaarder.

De resultatenlijst gebruikt `LIMIT` en `OFFSET`. Voor aantallen wordt een afzonderlijke countquery opgebouwd met `SQL_CALC_FOUND_ROWS count(*)`; ik vond hier geen bijbehorende `SELECT FOUND_ROWS()`. De naam is dus misleidend: de teller komt uit de count zelf.

Deze query is uitgebreid haakbaar. Onder meer `learndash_get_activity_query_args`, `learndash_user_activity_query_fields`, `learndash_user_activity_query_joins`, `learndash_user_activity_query_where` en `learndash_user_activity_query_str` kunnen de opbouw veranderen. ProPanel gebruikt precies die hooks voor extra grafiekvoorwaarden. Dat is de LearnDash-rapportagelaag in deze versie: één centrale PHP-functie, maar daaronder handgeschreven WordPress-SQL.

### 2.3 Tabellen, kolommen en indexen

De aanleg van de tabellen staat in `includes/admin/classes-data-upgrades-actions/class-learndash-admin-data-upgrades-user-activity-db-table.php`.

`learndash_user_activity` bevat:

| Kolom | Rol |
|---|---|
| `activity_id` | primaire sleutel |
| `user_id` | cursist |
| `post_id` | les, topic, quiz, cursus of andere activiteitspost |
| `course_id` | bijbehorende cursus |
| `activity_type` | bijvoorbeeld `course`, `lesson`, `topic`, `quiz` of `access` |
| `activity_status` | statusvlag |
| `activity_started` | starttijd als integer |
| `activity_completed` | voltooiingstijd als integer |
| `activity_updated` | laatste wijziging als integer |

Naast de primaire sleutel maakt de migratie losse indexen op `user_id`, `post_id`, `course_id`, `activity_status`, `activity_type`, `activity_started`, `activity_completed` en `activity_updated`. Er staat geen samengestelde index op bijvoorbeeld `(course_id, activity_type, activity_status, user_id)`.

`learndash_user_activity_meta` bevat `activity_meta_id` als primaire sleutel, `activity_id`, `activity_meta_key` en `activity_meta_value`. De indexen zijn los op `activity_id` en op de eerste 191 tekens van `activity_meta_key`. Er is geen samengestelde `(activity_id, activity_meta_key)`-index en de `mediumtext`-waarde is niet geïndexeerd.

Die indexkeuze past bij losse lookups, maar minder goed bij de samengestelde vragen van ProPanel. Een filter op cursus + type + status + gebruiker kan hoogstens index merge of één selectieve index benutten; daarna moet MySQL verder filteren. `GREATEST(...)` maakt de sortering bovendien niet rechtstreeks afleesbaar uit één van de tijdindexen. `LIKE '%zoekterm%'`, `GROUP_CONCAT`, `GROUP BY` en de gecorreleerde `NOT EXISTS` kunnen tijdelijke tabellen, filesorts en grotere scans veroorzaken.

Dat is geen bewijs dat iedere query traag is. De daadwerkelijke keuze hangt af van aantallen, dataverdeling, MySQL-versie en bufferpool. Het is wel zichtbaar dat de tabellen niet specifiek zijn geïndexeerd voor de zwaarste gecombineerde rapportagepatronen.

> **Vergelijk met ons**
>
> `lesson_progress` heeft bij ons één rij per gebruiker, cursus en les, met de samengestelde primaire sleutel `(user_id, course_slug, lesson_slug)`. `user_stats` houdt de afgeleide XP- en streakstand per gebruiker bij. Dat is voor ons huidige voortgangspad eenvoudiger dan LearnDash’ polymorfe activiteitentabel plus key/value-meta.
>
> Een rapport “voortgang per cursus” vraagt bij ons waarschijnlijk wél om een extra index op `(course_slug, user_id)` of een gerichte aggregatie. Die keuze moeten we baseren op een echte query en `EXPLAIN ANALYZE`, niet op het klakkeloos kopiëren van alle losse LearnDash-indexen. Bij tientallen tot honderden gebruikers is een normale `GROUP BY course_slug` doorgaans al ruim voldoende.


### 2.4 Waar de tellers vandaan komen

Niet elke ProPaneltegel gebruikt `learndash_reports_get_activity()`. `includes/reports/includes/functions.php` bevat een mengvorm van LearnDash-functies, `WP_Query`, `WP_User_Query` en ruwe SQL.

De gebruikerstelling `ld_propanel_get_users_count()` wordt vijf minuten in de transient `propanel_users_count` bewaard. Voor open cursussen kan een `WP_User_Query` alle gebruiker-ID’s ophalen. Voor andere toegangstypen leest de code onder meer `wp_usermeta`-sleutels als:

- `_sfwd-course_progress`;
- `_sfwd-quizzes`;
- dynamische `course_{id}_access_from`;
- `course_completed_{id}`;
- `learndash_course_expired_{id}`;
- groepsgerelateerde meta.

De gevonden ID-lijsten worden in PHP samengevoegd en met `array_unique()` ontdubbeld. Dit is een belangrijk verschil met een enkele `COUNT(DISTINCT ...)`-query: het geheugenverbruik groeit mee met de tussentijdse lijsten.

De cursusteller gebruikt de bestaande LearnDash-telfunctie via `ld_propanel_count_post_type()`. Openstaande opdrachten en essays gebruiken wel `WP_Query`, met `posts_per_page = 1` omdat alleen `found_posts` nodig is. Een opdracht geldt als wachtend wanneer de approval-meta ontbreekt; essays gebruiken de poststatus `not_graded`.

De tellerlaag heeft dus geen uniforme opslag- of querystrategie. De vijfminutencache geldt voor het gebruikersaantal, niet automatisch voor alle widgetresultaten.

### 2.5 Activiteit, rapportagelijst en filters

`LearnDash_ProPanel_Activity` in `includes/reports/includes/class-ld-propanel-activity.php` vraagt activiteiten van de typen `course`, `quiz`, `lesson`, `topic` en `access` op. De lijst is gepagineerd en sorteert in deze context op `activity_updated DESC`. De pager biedt 5, 10, 15, 25, 35, 50, 75 of 100 rijen per pagina; die waarden komen uit `ld_propanel_get_pager_values()`.

De templates voegen bij rijen context toe. Voor cursusvoortgang wordt bijvoorbeeld ook `_sfwd-course_progress` uit gebruikersmeta gelezen. Dat kan per getoonde rij extra PHP- en metawerk veroorzaken. WordPress’ objectcache kan herhaalde meta-lookups binnen een request dempen, maar dit is geen expliciete ProPanel-querycache.

`LearnDash_ProPanel_Reporting` in `includes/reports/includes/class-ld-propanel-reporting.php` registreert de AJAX-actie `learndash_propanel_reporting_get_result_rows`. De filteronderdelen hebben eigen PHP-classes en templates onder:

- `includes/reports/templates/reporting-filters/courses/`;
- `includes/reports/templates/reporting-filters/groups/`;
- `includes/reports/templates/reporting-filters/users/`;
- `includes/reports/templates/reporting-filters/status/`.

De JavaScriptstatus wordt in `includes/reports/src/assets/js/ld-propanel.js` als `currentFilters` bijgehouden. Een filterwijziging leidt tot een nieuwe AJAX-aanvraag en server-side HTML, niet tot lokaal filteren van een vooraf opgehaalde dataset.

Bij grote gebruikersselecties probeert `ld_propanel_convert_fewer_users()` de SQL korter te maken. Zijn er meer geselecteerde gebruikers dan de helft van alle gebruikers, dan zet de functie de selectie om in de kleinere complementverzameling en gebruikt zij conceptueel `NOT IN`. Daarvoor worden eerst alle gebruiker-ID’s opgehaald en in PHP vergeleken. De optimalisatie verplaatst dus ook werk.

### 2.6 De voortgangsgrafiek doet meerdere countqueries

`LearnDash_ProPanel_Progress_Chart` in `includes/reports/includes/class-ld-propanel-progress-chart.php` registreert `wp_ajax_learndash_propanel_get_progress_charts_data`. Na nonce- en capabilitycontrole vraagt de handler drie onbegrensde tellingen op:

1. niet gestart;
2. bezig;
3. voltooid.

Daarvoor wordt `learndash_reports_get_activity()` gebruikt met `include_meta = false` en `return_count_only = true`. Als er minstens één “bezig”-resultaat is, volgen vijf extra tellingen voor de voortgangsbakken 0–20, 20–40, 40–60, 60–80 en 80–100 procent.

De grafiekclass haakt daarvoor extra joins en voorwaarden in de centrale rapportagequery. Zij koppelt `wp_postmeta` voor `_ld_course_steps_count` aan activitymeta voor `steps_completed`. De relevante berekening heeft deze korte vorm:

    activity_meta_value * 100.0 / postmeta_value >= ondergrens
    AND activity_meta_value * 100.0 / postmeta_value < bovengrens

De response wordt in het formaat voor Chart.js teruggegeven. Eén grafiekrefresh kan dus acht afzonderlijke countqueries opleveren, waarvan vijf joins op twee metatabellen en een berekening over tekstuele metawaarden bevatten. Er is in deze class geen transient voor de grafiek gevonden.

Dit is vermoedelijk het eerste onderdeel dat bij veel activiteit zichtbaar zwaar wordt: de lijst zelf heeft `LIMIT/OFFSET`, maar de tellers moeten alle passende rijen tellen en de procentbakken herhalen grotendeels hetzelfde werk.

> **Vergelijk met ons**
>
> Voor Beleggingscollege zou een voortgangsgrafiek niet acht losse tellingen nodig hebben. Eén Postgres-query kan `lesson_progress` per gebruiker en cursus groeperen en met `CASE` of `FILTER` alle bakken tegelijk tellen. Het totale aantal lessen komt uit onze server-only cursuscatalogus; die antwoorden en cursusinhoud blijven dus buiten de clientbundel. Pas als meten laat zien dat die query duur wordt, is een snapshot of extra aggregatietabel gerechtvaardigd. Bij onze huidige schaal is vijf minuten stale cache waarschijnlijk ingewikkelder dan de query zelf.

### 2.7 “Filter een selectie en mail die”: het hele pad

Dit pad is opvallend, omdat de interface de indruk van een bulktaak geeft terwijl de uitvoering volledig synchroon in één AJAX-request plaatsvindt.

#### Stap 1 — selectie in de browser

`includes/reports/src/assets/js/ld-propanel.js` houdt naast `currentFilters` een lijst `selectedUserIds` bij. Een aangevinkte rij voegt een gebruikers-ID toe. “Alles selecteren” loopt over de checkboxen in de huidige tabelweergave; selecties kunnen in de JavaScriptstatus blijven staan terwijl de rapportagelijst via AJAX wisselt.

Er zijn twee semantisch verschillende gevallen:

- bevat `selectedUserIds` waarden, dan worden alleen die expliciete ID’s verstuurd;
- is de lijst leeg, dan betekent dat server-side niet “niemand”, maar “alle gebruikers die aan het huidige filter voldoen”.

Als het gebruikersfilter precies één gebruiker bevat, kan de code die ene ID rechtstreeks als selectie nemen. “Geen selectie” is dus ambigu en zou in een eigen beheerinterface expliciet bevestigd moeten worden voordat het “iedereen in het filter” betekent.

#### Stap 2 — AJAX-verzoek

De browser post naar `admin-ajax.php` met:

| Veld | Betekenis |
|---|---|
| `action` | `learndash_propanel_email_users` |
| `user_ids` | komma-gescheiden expliciete selectie, mogelijk leeg |
| `subject` | onderwerp |
| `message` | bericht |
| `filters` | de huidige rapportagefilters |
| `nonce` | nonce voor de actie `ld-propanel` |

De live registratie staat in `LearnDash_ProPanel_Filtering::__construct()` in `includes/reports/includes/class-ld-propanel-filtering.php`:

    wp_ajax_learndash_propanel_email_users
        → LearnDash_ProPanel_Filtering::ajax_email_users()

In de oude Reporting-class bestaan vergelijkbare mailmethoden, maar ik vond de actieve WordPress-AJAX-hook bij `LearnDash_ProPanel_Filtering`. Dat voorkomt dat legacy-duplicatie ten onrechte als twee stappen wordt beschreven.

#### Stap 3 — autorisatie en ontvangers bepalen

`ajax_email_users()` verifieert de `ld-propanel`-nonce en controleert of de gebruiker administrator, group leader of bevoegd voor de ProPanelwidgets is.

Bij expliciete `user_ids` worden de waarden naar integers teruggebracht. Zonder expliciete ID’s laadt de handler de geposte filters, bouwt dezelfde activiteitquery als de rapportagelijst en loopt die in pagina’s van 100 af. Uit iedere pagina worden `user_id`-waarden verzameld; daarna maakt `array_unique()` de totale lijst uniek.

Er is hier dus wel paginering richting de database, maar geen streaming van ontvanger naar mailtransport. Vóór het mailen staat de volledige ontvangerslijst alsnog in PHP-geheugen.

#### Stap 4 — adressen en bericht samenstellen

`email_users()` verdeelt de ID-lijst standaard in groepen van 100. De grootte is aanpasbaar via `ld_propanel_email_users_batch_size`. Per groep volgt een ruwe query op `wp_users` om `user_email` voor de ID’s op te halen.

Vervolgens roept de code één keer `wp_mail()` per groep aan:

- `To` is het e-mailadres van de huidige beheerder;
- de geselecteerde cursisten komen in `Bcc`;
- de content type-header wordt HTML;
- `From` en `Reply-To` worden op het adres van de huidige beheerder gezet;
- `wpautop()` zet het ingevoerde bericht om naar alinea’s.

Vlak voor het versturen kan `ld_propanel_email_users_args` de argumenten aanpassen. Er zijn acties vóór en na de mailpoging, en `wp_mail_failed` wordt gebruikt om foutinformatie van WordPress op te vangen.

#### Stap 5 — synchroon resultaat

Er wordt geen cronjob, Action Scheduler-taak of blijvende wachtrij aangemaakt. De handler loopt alle batches af vóór het AJAX-request klaar is. Bij een mislukte batch stopt het pad en retourneert het een fout. Er is geen ingebouwde retry per ontvanger of batch.

Daaruit volgen vijf praktische grenzen:

1. **Requesttijd.** Duizend ontvangers zijn bij batches van 100 al tien opeenvolgende `wp_mail()`-aanroepen, bovenop het bepalen en ophalen van ontvangers.
2. **Geheugen.** Alle unieke gebruiker-ID’s blijven in één request aanwezig.
3. **Providerlimieten.** Een mailprovider kan grenzen stellen aan Bcc-aantallen, verzendsnelheid, envelope recipients of dagquota.
4. **Afleverbaarheid.** Eén Bcc-mail aan honderd adressen is iets anders dan honderd individueel geadresseerde, gepersonaliseerde mails.
5. **Betekenis van succes.** `wp_mail() === true` betekent dat WordPress’ mailtransport het bericht accepteerde, niet dat ieder adres het ontving.

Ook de getoonde successcore vraagt nuance. De code telt de unieke gebruikersselectie; als adressen ontbreken, dubbel zijn of later door de provider worden geweigerd, is dat niet hetzelfde als het aantal werkelijk bezorgde mails.

> **Vergelijk met ons**
>
> Dit bulkmailpad moeten we niet nabouwen in een Next.js-request. Voor tientallen gebruikers kan een expliciete beheerdersactie technisch synchroon werken, maar time-outs, dubbele verzending na een retry en onduidelijke feedback zijn dan nog steeds reële fouten. Als Beleggingscollege ooit filtermail toevoegt, hoort de selectie als bevroren ontvangersset in Postgres, gevolgd door een idempotente achtergrondtaak met status per batch of ontvanger. Tot die functie bestaat, mogen publieke of interne teksten niet suggereren dat `/beheer` al rapportagemails kan sturen.
>
> Voor een eerste, kleinschalige versie is “CSV downloaden en in het bestaande mailsysteem gebruiken” waarschijnlijk eerlijker en veiliger dan een halve mailcampagnetool bouwen.


### 2.8 CSV-export: andere architectuur dan mail

De CSV-knoppen in Reports leunen op de algemene LearnDash-datareports, met name:

- `includes/admin/class-learndash-admin-settings-data-reports.php`;
- `includes/admin/classes-data-reports-actions/class-learndash-admin-data-reports-user-courses.php`;
- `includes/admin/classes-data-reports-actions/class-learndash-admin-data-reports-user-quizzes.php`;
- `includes/admin/class-learndash-admin-background-export.php`.

De beheeractie loopt via `wp_ajax_learndash-data-reports`. De nonce is rapport- en gebruikersspecifiek en heeft de vorm `learndash-data-reports-{slug}-{current_user_id}`.

Sinds de in de broncode genoemde wijziging voor 5.1.6 gebruikt deze export `Learndash_Admin_Background_Export` en Action Scheduler. De taaknaam is `learndash_report_export_run_chunk`, in de groep `reports-export`. Een taak verwerkt standaard 100 gebruikers; `learndash_report_user_activity_export_chunk_size` kan dat aanpassen. Na een chunk wordt de volgende taak ingepland totdat de vaste lijst gebruiker-ID’s op is.

De status staat, afhankelijk van `LEARNDASH_TRANSIENT_CACHE_STORAGE`, in een option of bestand onder een sleutel in de vorm `learndash_reports_{transient_key}`. De volledige `users_ids`-lijst blijft onderdeel van die status en een numerieke offset schuift op. LearnDash kiest bewust niet voor het telkens afknippen en opnieuw opslaan van een steeds kleinere array.

De CSV wordt tijdens elke chunk aan een bestand toegevoegd onder de LearnDash-reportmap in uploads. De generatie is dus:

    querychunk → rijen in geheugen → append naar CSV → volgende taak

Dat is achtergrondverwerking naar schijf, geen streamingresponse naar de browser. Pas wanneer het bestand klaar is, opent de downloadhandler het bestand en schrijft blokken van 8 KiB met `fread()` naar de HTTP-response. “Streaming” is daarom alleen juist voor de uiteindelijke download, niet voor het maken van het rapport.

Belangrijke uitbreidingspunten zijn:

- `learndash_data_reports_headers` voor kolommen;
- `learndash_csv_object` en `learndash_csv_data` voor de CSV-opbouw;
- `learndash_report_filename` voor de bestandsnaam;
- `learndash_csv_download_headers` vlak voor de downloadheaders;
- `learndash_csv_download_after_headers` direct daarna.

`LearnDash_ProPanel_Activity` gebruikt `learndash_data_reports_headers` om de cursus-CSV uit te breiden.

#### Kolommen van de cursus-CSV

De basisexport heeft negen kolommen:

1. `user_id`;
2. `name`;
3. `email`;
4. `course_id`;
5. `course_title`;
6. `steps_completed`;
7. `steps_total`;
8. `course_completed`;
9. `course_completed_on`.

ProPanel voegt zes kolommen toe:

10. `course_started_on`;
11. `course_total_time_on`;
12. `course_last_step_id`;
13. `course_last_step_type`;
14. `course_last_step_title`;
15. `last_login_date`.

`course_updated_on` staat als uitgeschakelde/commented code in de bron en is dus geen werkelijke kolom in deze versie.

#### Kolommen van de quiz-CSV

De quizexport heeft vijftien kolommen:

1. `user_id`;
2. `name`;
3. `email`;
4. `quiz_id`;
5. `quiz_title`;
6. `score`;
7. `total`;
8. `date`;
9. `points`;
10. `points_total`;
11. `percentage`;
12. `time_spent`;
13. `passed`;
14. `course_id`;
15. `course_title`.

Voor de lijstweergave wordt een rolgebonden gebruikersselectie in delen doorsneden; de standaardchunk daar is 500 via `learndash_report_activity_list_view_chunk_size`. Dat is een andere instelling dan de 100 gebruikers per achtergronduitschrijving.

CSV is daarmee het schaalbaarste ProPanelpad van de drie zware handelingen: het blokkeert geen enkel lang browserrequest en het eindbestand wordt in kleine stukken gedownload. De grens verdwijnt niet. De volledige ID-lijst en exportstatus moeten worden bewaard, iedere chunk materialiseert rijen, en Action Scheduler moet door WordPress-cron of een echte runner regelmatig worden geleegd.

### 2.9 Waar ProPanel schaalt — en waar niet

Er staat geen harde grens als “maximaal 5.000 gebruikers” in de code. Wel zijn de faalvormen zichtbaar:

| Onderdeel | Bescherming | Waarschijnlijke grens |
|---|---|---|
| Activiteitenlijst | `LIMIT/OFFSET` en instelbare paginagrootte | hoge offsets; zware joins, zoekactie en sortering blijven |
| Gebruikersteller | vijf minuten transient | cachemiss bouwt nog steeds grote ID-lijsten |
| Grafiek | countqueries zonder resultset | tot acht volledige tellingen; meta-joins en rekenvoorwaarden |
| Filterselectie | selectie soms omgezet naar kleinere `NOT IN` | eerst alle gebruikers in PHP nodig |
| Mail | batches van 100 | synchroon request, Bcc/providerlimieten, geen retry |
| CSV | Action Scheduler, chunks van 100, append naar bestand | runnerdoorvoer, status/ID-lijst en duur van alle chunks |
| Zoekfilters | server-side query | `LIKE` en niet-passende indexen bij grote tabellen |

Ik vond behalve de vijfminuten-transient voor het gebruikersaantal geen ProPanel-brede cache voor activiteitresultaten of grafiekbakken. WordPress kan zelf post-, user- en metacaches hebben, en een site kan een persistente objectcache toevoegen, maar dat verandert de centrale SQL en zijn cardinaliteit niet.

De meest waarschijnlijke kantelvolgorde is:

1. grafiek- en filterrequests worden merkbaar traag als `learndash_user_activity` groot wordt;
2. synchroon mailen raakt request- of providerlimieten;
3. zeer grote exports lopen lang door of blijven achter wanneer Action Scheduler niet betrouwbaar wordt uitgevoerd;
4. hoge paginanummers worden duur door `OFFSET`.

Voor harde conclusies zijn databasegrootte en `EXPLAIN` nodig. De code laat wel zien dat “er is paginering” niet hetzelfde is als “het schaalt”: tellerqueries, selectieopbouw en grafiekberekeningen zijn niet gepagineerd.

> **Vergelijk met ons**
>
> Op onze schaal van tientallen tot honderden gebruikers is het niet zinvol om vooraf een generieke rapportagecache, widgetframework of exportscheduler te bouwen. Een eerste `/beheer/rapportage` kan drie server-side queries hebben: actieve gebruikers, afgeronde lessen per cursus en recente activiteit. Gebruik `lesson_progress.completed_at` voor tijdreeksen, de samengestelde les-identiteit voor unieke afrondingen en `user_stats` alleen voor de al bewust gedénormaliseerde XP- en streakstand.
>
> Wel meteen doen: filters valideren, exportkolommen expliciet vastleggen, toegang tot beheer server-side bewaken en grote exports als bestandstaak modelleren zodra ze werkelijk groot worden. Niet doen: acht bijna gelijke countqueries of een polymorfe key/value-activiteitentabel invoeren omdat LearnDash die door zijn veel bredere productmodel nodig heeft.


## 3. Course Grid

### 3.1 Eén renderer achter shortcode en blok

`LearnDash\Core\Modules\Course_Grid\Provider` laadt via `src/Core/Modules/Course_Grid/Legacy/Loader.php` de gebundelde ingang `includes/course-grid/learndash_course_grid.php`. De centrale `LearnDash\Course_Grid`-singleton bouwt Security, Skins, AJAX, Shortcodes, Blocks en Compatibility op.

`includes/course-grid/includes/class-shortcodes.php` registreert `[learndash_course_grid]` via `Shortcodes\LearnDash_Course_Grid` en `[learndash_course_grid_filter]` via de filterclass. Daarboven zitten de dynamische Gutenberg-blokken `learndash/ld-course-grid` en `learndash/ld-course-grid-filter`. De blockbase staat in `includes/course-grid/includes/lib/class-learndash-gutenberg-block.php`; de slugs staan onder `includes/course-grid/includes/gutenberg/blocks/`. De gebouwde editorbundle is `includes/course-grid/includes/gutenberg/assets/js/index.js`. Server-side worden blokattributen weer shortcode-attributen: het blok is geen tweede catalogusengine.

### 3.2 WP_Query, maar met voorwerk in PHP

`Shortcodes\LearnDash_Course_Grid::render()` valideert attributen, laadt de gekozen skin, roept `Utilities::build_posts_query_args()` aan en voert een gewone `WP_Query` uit. Standaard verschijnen negen items, op ID aflopend. De querybuilder in `includes/course-grid/includes/class-utilities.php` levert onder meer `post_type`, `post_status=publish`, paginering, sortering, `tax_query` en `post__in`. `learndash_course_grid_query_args` kan dat aanpassen.

Voor “ingeschreven” bouwt de code eerst een ID-verzameling met onder meer `learndash_user_get_enrolled_courses()` en groepscursussen. Voortgangsfilters kunnen `learndash_reports_get_activity()` gebruiken. Voor “niet ingeschreven” worden product-ID’s per prijstype opgehaald en wordt de ingeschreven set er in PHP afgetrokken. Een `group_id`-filter doorsnijdt de set met `Group::find()->get_courses()`. De zichtbare posts komen dus uit `WP_Query`, maar toegang en filters leveren geregeld vooraf gematerialiseerde ID-arrays.

De skins staan onder `includes/course-grid/templates/skins/`: `grid`, `list`, `masonry` en `legacy-v1`. Cards staan onder `templates/cards/` als `grid-1` tot en met `grid-3` en `list-1`/`list-2`. Paginatie kent een knop- en infinitevariant. `Utilities::get_template()` zoekt eerst in het thema onder `learndash/course-grid/` en valt terug op de bundeltemplate.

`includes/course-grid/includes/class-ajax.php` registreert publieke en ingelogde acties `ld_cg_load_more` en `ld_cg_apply_filter`, beide met nonce `ld_cg_load_posts`. De server reconstrueert de query en retourneert JSON met cards en paginatie.

Het prijsfilter is de schaalval: bij min/max-prijs zet de code `posts_per_page=-1`, haalt alle passende cursussen of groepen op, vraagt per item de prijs op, filtert in PHP en past pas daarna `array_slice()` toe. De UI is dan gepagineerd, het serverwerk niet.

Ik vond geen cache voor de hele gridquery of gerenderde cards. WordPress’ normale caches blijven gelden. Alleen `learndash_course_grid_count_students()` krijgt specifiek een uur objectcache in groep `ld_cg`. Grote `post__in`-lijsten en prijsfiltering zullen eerder knellen dan de templates.

> **Vergelijk met ons**
>
> Onze catalogus komt uit `@/content` en blijft `server-only`, zodat cursusinhoud en quizantwoorden niet in de clientbundel belanden. Voor een klein aanbod is Course Grids database- en skinlaag overkill. Bruikbaar zijn één canonieke renderer en deelbare URL-filters. Filteren kan bij ons server-side over veilige catalogusmetadata; pas bij een werkelijk groot aanbod is een aparte zoekindex zinvol.

## 4. Course Reviews

### 4.1 Comments als datamodel

Course Reviews maakt geen eigen tabel. Een hoofdreview is een rij in `wp_comments` met `comment_post_ID` als cursus-ID en `comment_type=ld_review`. `rating` en `review_title` staan in `wp_commentmeta`. De module wordt geladen via `src/Core/Modules/Course_Reviews/Provider.php` en `Legacy/Loader.php`; de functionele code staat onder `includes/course-reviews/`.

Het formulier `includes/course-reviews/src/views/reviews-form.php` en `includes/course-reviews/dist/scripts.js` posten met een WordPress REST-nonce naar:

    POST learndashCourseReviews/v1/addReview/{course_id}

De route staat in `includes/course-reviews/core/class-learndash-course-reviews-rest.php`. De permission callback gebruikt `learndash_course_reviews_user_has_started_course()`: de gebruiker moet ingelogd zijn en `learndash_course_progress(..., array => true)` moet niet-lege `completed`-voortgang opleveren. `sfwd_lms_has_access()` wordt wel berekend en aan een filter meegegeven, maar alleen toegang hebben is standaard niet genoeg.

Het formulier verdwijnt wanneer `learndash_course_reviews_get_user_review()` al een review vindt. In de REST-permission- en invoegroute vond ik geen tweede duplicaatcontrole. De normale UI voorkomt dus een tweede review; een rechtstreeks, correct geautoriseerd REST-verzoek lijkt dat niet te doen. `learndash_course_reviews_add_review()` roept `wp_allow_comment()` en `wp_insert_comment()` aan en schrijft daarna de twee metavelden.

### 4.2 Moderatie, gemiddelde en uitvoer

De invoegargumenten zetten `comment_approved=true`. De code controleert of `wp_allow_comment()` een `WP_Error` teruggeeft, maar schrijft een gewone moderation-, spam- of trashstatus niet zichtbaar terug naar `comment_approved`. Mijn broncodelezing is daarom dat de normale REST-route direct goedkeurt. Dit is een control-flowafleiding; een runtimefilter kan het gedrag wijzigen.

Na invoegen zijn het gewone WordPress-comments. Beheerders kunnen ze via Comments goedkeuren, afkeuren, als spam markeren of verwijderen. `includes/course-reviews/core/admin/class-learndash-course-reviews-comment-edit.php` voegt een ratingmetabox met noncecontrole toe. De walker kan een pendingstatus tonen als een review langs een ander pad pending is gemaakt of later is afgekeurd.

`learndash_course_reviews_get_average_review_score()` haalt alle goedgekeurde `ld_review`-ID’s op, leest per comment `rating` en berekent het rekenkundig gemiddelde. Ik vond geen postmeta-aggregaat of transient. Ook de reviewlijst haalt alle goedgekeurde reviews op; in de view vond ik geen paginering. WordPress-objectcache kan reads dempen, maar functioneel blijven gemiddelde en lijst lineair in het aantal reviews.

`LearnDash_Course_Reviews_Loader::add_reviews_tab()` voegt via `learndash_content_tabs` de tab toe als de cursusinstelling reviews toestaat. De moderne metabox staat in `src/Core/Modules/Course_Reviews/Admin/Metabox.php`, met legacyfallback `rbm_ld_reviews_show_reviews=y`. De views staan onder `includes/course-reviews/src/views/`; `learndash_course_reviews_locate_template()` ondersteunt thema-overrides onder `learndash-course-reviews/`.

> **Vergelijk met ons**
>
> Beleggingscollege heeft vraagmoderatie in `/beheer`, geen reviews. Als reviews later echt gewenst zijn, is een Postgres-tabel met een unieke `(user_id, course_slug)`, status `pending/approved/rejected` en ratingcheck 1–5 veiliger dan alleen het formulier verbergen. Bij onze schaal kan `AVG()` over goedgekeurde rijen on the fly. En eerst komt de productkeuze: een sterrenwidget is geen reden om schaarse of verzonnen social proof te tonen.

## 5. Commerce in `src/`

### 5.1 Twee verschillende `Product`-modellen

`LearnDash\Core\Models\Product` in `src/Core/Models/Product.php` is het verkoopbare en toegankelijke object: een WordPress-cursus of -groep. Het kent prijstype `open`, `free`, `paynow`, `subscribe` of `closed`, prijs/trial, beschikbaarheidsdata, seats, aankoopgeschiktheid en `enroll()`, `unenroll()` en `user_has_access()`.

`LearnDash\Core\Models\Commerce\Product` in `src/Core/Models/Commerce/Product.php` is iets anders: een abstract transactiemodel dat van `Transaction` erft. Het wordt `Commerce\Subscription` of `Commerce\One_Time_Payment`, bewaart status, annulering en statushistorie en heeft géén `user_has_access()`. `src/Core/Mappers/Models/Commerce_Product_Mapper.php` kiest op basis van het prijstype van het kernproduct tussen die twee.

Docblocks noemen voor delen van dit subsysteem `@since 4.25.0`. Het zit in de 5.1.8-boom, maar is niet volledig pas met 5.1 ontstaan.

### 5.2 Transacties en gateways

`src/Core/Models/Transaction.php` beschrijft de transactionpost-hiërarchie:

    Order
      ├─ One_Time_Payment
      └─ Subscription
           └─ Charge

`Order` is de semantische bovenlaag; `Charge` is een concrete afschrijving met status, bedrag en trialvlag. `Subscription` bewaart onder meer token, betaalmethode, volgende betaaldatum, expiry en annulering. `Transaction::get_product()` resolveert het gekoppelde ID weer als `LearnDash\Core\Models\Product::find()`.

`src/Core/Modules/Payments/Provider.php` registreert Orders, Gateways, Subscriptions en e-mails. `src/Core/Modules/Payments/Gateways/Provider.php` brengt Stripe, nieuw PayPal en PayPal Standard-migratie samen. De abstracte basis heeft nog de legacynaam `Learndash_Payment_Gateway` en staat in `includes/payments/gateways/class-learndash-payment-gateway.php`.

Concrete gateways leveren onder meer:

    get_name()
    configure()
    is_ready()
    setup_payment()
    process_webhook()

De basis regelt registry, actieve configuratie, betaalbuttons, setup-AJAX, webhooks op `wp_loaded`, logging, transactieregistratie en enroll/unenroll. `includes/payments/gateways/init.php` laadt oudere implementaties zoals PayPal IPN, Stripe Connect en Razorpay. `src/Core/Modules/Payments/Gateways/Paypal/Payment_Gateway.php` is de nieuwere PayPalclass, maar erft nog steeds van dezelfde basis en voegt REST-, client-, webhook- en tokenlogica toe.

### 5.3 `Product::user_has_access()` blijft op legacytoegang leunen

De methode staat op `LearnDash\Core\Models\Product`, niet op `Commerce\Product`. Zij controleert eerst start- en einddatum en delegeert dan:

- cursus: `sfwd_lms_has_access( $post_id, $user_id )`;
- groep: `learndash_is_user_in_group( $user_id, $group_id )`.

`learndash_model_product_user_has_access` kan het resultaat filteren. De moderne methode is dus een objectgeoriënteerde policywrapper rond de oude toegangspoorten, geen vervangende opslaglaag.

Bij een geslaagde betaling roept de gatewaybasis `add_access_to_products()` aan. Het kernproduct gebruikt `enroll()` en komt uit bij `ld_update_course_access()` of `ld_update_group_access()`; intrekken loopt via `unenroll()` en dezelfde functies in verwijdermodus.

    gateway/webhook
        ↓
    Order + Commerce-transacties
        ↓
    Core Product::enroll() / ::unenroll()
        ↓
    legacy inschrijving
        ↓
    Product::user_has_access()
        ↓
    sfwd_lms_has_access() / learndash_is_user_in_group()

De paginavraag controleert dus niet telkens rechtstreeks de `Commerce\Product`-status. Betaling vertaalt status naar inschrijving; toegang leest die inschrijving. Daardoor moet webhookverwerking correct en idempotent zijn.

> **Vergelijk met ons**
>
> Bij ons registreert `payment_attempts` pogingen en geeft `entitlements` het recht. `heeftToegangTot()` in `src/lib/entitlements.ts` blijft de enige toegangspoort; “paid” of een UI-slotje is niet zelf autorisatie. Bruikbaar uit LearnDash zijn gatewaynormalisatie en statushistorie. De transactionposthiërarchie is voor onze aantallen onnodig: unieke provider-ID’s, idempotente webhooks en een apart entitlement zijn eenvoudiger te auditen.

## 6. Onzekerheden en grenzen

Ik heb de relevante PHP-bronnen, JavaScriptbronnen, gebouwde bundelingangen, templates, tabelmigratie en providers gelezen, maar LearnDash niet gestart. Ik heb dus geen echte MySQL-`EXPLAIN`-plannen of responstijden, mailbezorging, Action Scheduler-doorloop of interactief browsergedrag gemeten. Een installatie kan bovendien filters, thema-overrides, persistente objectcache, een eigen cronrunner of een andere mailprovider toevoegen.

De schaalgrenzen zijn daarom kwalitatief. Dat de grafiek tot acht tellingen uitvoert, mail synchroon in batches loopt en Course Grid bij prijsfiltering alle posts materialiseert, volgt uit de control flow. Bij welk aantal rijen dat merkbaar fout gaat, kan alleen een productieachtige dataset uitwijzen.

De reviewconclusies zijn eveneens gelezen-maar-niet-gedraaid: `comment_approved` staat vooraf op waar en een niet-foutstatus van `wp_allow_comment()` wordt niet zichtbaar overgenomen; de REST-route heeft geen zichtbare duplicaatcontrole. Een runtimehook kan beide uitkomsten veranderen.

Ik vond geen ProPanel-brede querycache, gridresultaatcache of gecachet reviewgemiddelde. Dat betekent “niet aangetroffen in de onderzochte 5.1.8-paden”, niet dat externe WordPress-caching onmogelijk is. De gebundelde Reports-code is ProPanel 2.2.2; een los ProPanel 3 is een andere generatie en zat niet als implementatie in deze bronboom.
