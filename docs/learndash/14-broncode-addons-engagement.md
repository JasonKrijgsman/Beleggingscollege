# LearnDash-broncode: de engagement-add-ons (notificaties, gamification, certificaten)

*Broncode-analyse: 5 augustus 2026. Bron: de actuele 2026-releases van de officiële add-ons, gedownload met Jasons eigen LearnDash-licentie (geldig t/m juni 2027) en lokaal uitgepakt.*

| Add-on | Versie | Omvang uitgepakt | Waarom hij hier staat |
|---|---|---|---|
| `learndash-notifications` | 1.6.9.1 | 900 kB | De referentie-implementatie voor onze voltooiingsmail en inactiviteitsherinnering |
| `learndash-achievements` | 2.0.4 | 1,5 MB | Punten, badges, leaderboard en de enige streak die LearnDash kent |
| `learndash-certificate-builder` | 1.1.5 | 113 MB | Blokgebaseerde certificaten → PDF |
| `learndash-zapier` | 2.3.2 | 500 kB | Census van wat LearnDash zelf een noemenswaardige gebeurtenis vindt |

**Verhouding tot hoofdstuk 05.** Dat hoofdstuk beschrijft wat de documentatie *zegt*; dit hoofdstuk beschrijft wat de code *doet*. Waar ze botsen wint de code, en op één punt botsen ze hard: hoofdstuk 05 schrijft certificaat-PDF's toe aan TCPDF. Dat klopt voor core, maar de Certificate Builder gebruikt **mPDF 8.2.7** (§3). Verder is de documentatie op de belangrijkste punten te vaag: "vertraagde mails leunen op WP-cron" verbergt een mechaniek waar we echt iets van kunnen leren, en die staat hieronder uitgeschreven.

Alle padverwijzingen zijn relatief aan de map van de betreffende add-on. Codefragmenten zijn kort en illustratief — dit is proprietary code; we analyseren, we publiceren niet opnieuw.

---

## 1. `LearnDash Notifications` 1.6.9.1 — het planningsmechanisme

Dit is verreweg de relevantste add-on voor ons. Hij doet precies wat wij willen bouwen: een mail versturen bij een gebeurtenis, eventueel N tijdseenheden later, precies één keer.

### 1.1 Het gegevensmodel: notificatie = WordPress-post

Een notificatie is een post van het type **`ld-notification`** (`includes/post-type.php:66`). Alle instellingen zitten in postmeta; `src/notification.php` (class `LearnDash_Notification\Notification`) is het model dat die meta uitleest:

| Meta-key | Betekenis |
|---|---|
| `_ld_notifications_trigger` | Slug van de gebeurtenis (`complete_course`, `not_logged_in`, …) |
| `_ld_notifications_recipient` | Array met `user`, `group_leader`, `admin` |
| `_ld_notifications_bcc` | Extra adressen, kommagescheiden |
| `_ld_notifications_delay` + `_ld_notifications_delay_unit` | Vertraging + eenheid |
| `_ld_notifications_course_id` / `_lesson_id` / `_topic_id` / `_quiz_id` / `_group_id` | Waarop de trigger moet matchen; leeg/0 wordt genormaliseerd naar `'all'` |
| `_ld_notifications_conditions` | Extra voorwaarden (zie §1.6) |
| `_ld_notifications_not_logged_in_days` | X voor de inactiviteitstrigger |
| `_ld_notifications_send_only_once` | Alleen bij inactiviteit: één keer of herhaald |
| `_ld_notifications_course_expires_days` / `_after_days` | X voor de verloop-triggers |

De onderwerpregel is `post_title`, de mailtekst is `post_content`. De WordPress-editor is dus de mailsjablooneditor. **De vertraagseenheid is in code ruimer dan in de docs:** het model accepteert `days`, `hours`, `minutes` en `seconds` (`src/notification.php:168`), de admin-dropdown biedt alleen minuten/uren/dagen aan (`includes/meta-box.php:299`). De hele "delay in days" uit de documentatie is dus in werkelijkheid een `strtotime( "+$interval $unit" )`.

### 1.2 De triggerlijst zoals hij écht in de code staat

Twee lijsten, en ze lopen niet gelijk. De **labellijst** staat in `learndash_notifications_get_triggers()` (`includes/notification.php:1697`) en telt 17 sleutels; de **implementaties** worden geregistreerd in `learndash_notifications_include()` (`learndash-notifications.php`, rond regel 140) als 17 klassen die elk `listen()` krijgen aangeroepen:

| Slug | Klasse (`src/trigger/…`) | Haakt op |
|---|---|---|
| `enroll_group` | `Enroll_Group` | `ld_added_group_access` |
| `enroll_course` | `Enroll_Course` | `learndash_update_course_access`, `ld_added_group_access`, `ld_added_course_group_access` |
| `complete_course` | `Complete_Course` | `learndash_course_completed` |
| `complete_lesson` | `Complete_Lesson` | `learndash_lesson_completed` |
| `complete_topic` | `Complete_Topic` | `learndash_topic_completed` |
| `lesson_available` | `Drip_Lesson_Available` | eigen cron per les (§1.8) |
| `pass_quiz` / `fail_quiz` / `submit_quiz` / `complete_quiz` | `Quiz_Passed` / `Quiz_Failed` / `Quiz_Submitted` / `Quiz_Completed` | quizhaken |
| `submit_essay` / `essay_graded` | `Essay_Submitted` / `Essay_Graded` | essayhaken |
| `upload_assignment` / `approve_assignment` | `Assignment_Uploaded` / `Assignment_Approved` | opdrachthaken |
| `not_logged_in` | `User_Login_Track` | `wp_login` + `learndash_notifications_cron` |
| `course_expires` / `course_expires_after` | `Before_Course_Expire` / `After_Course_Expire` | `learndash_notifications_cron` |

De lijst is uitbreidbaar via het filter `learndash_notifications_triggers`. Alle triggerklassen erven van de abstracte `LearnDash_Notification\Trigger` (`src/trigger.php`, 963 regels) — dat is het interessante bestand.

### 1.3 De planning: één tabel, één cron-event per keer

**Tabel:** `{$wpdb->prefix}ld_notifications_delayed_emails`, aangemaakt in `learndash_notifications_create_db_table()` (`includes/database.php:16`). Kolommen: `id`, `title`, `message`, `recipient`, `shortcode_data`, `sent_on`, `bcc`. Geen enkele index behalve de primaire sleutel, en `sent_on` is een **`varchar(20)` met een UNIX-timestamp erin** — geen datetime-kolom.

**Bij het vuren van de trigger** wordt niet gemaild maar in de wachtrij gezet (`Trigger::queue_use_db()`, `src/trigger.php:769`):

```php
$sent_on = strtotime( "+$interval $unit" );
$args['notification_id'] = $model->post->ID;
$wpdb->insert( $table_name, [
    'recipient'      => maybe_serialize( $emails ),
    'shortcode_data' => maybe_serialize( $args ),   // user_id, course_id, lesson_id, notification_id …
    'sent_on'        => $sent_on,
    … ] );
```

Let op wat er in de rij staat: **id's, geen gerenderde tekst.** De kolommen `title`/`message` worden wel gevuld met de posttitel en -inhoud van dát moment, maar bij het verzenden worden ze in de moderne codepath genegeerd — `Trigger::send()` leest `$model->post->post_title` en `->post_content` opnieuw uit de database (`src/trigger.php:516-520`). Pas je de mailtekst aan terwijl er nog iets in de wachtrij staat, dan gaat de **nieuwe** tekst de deur uit.

**Vervolgens plant de add-on precies één WP-cron-event, voor de eerstvolgende rij.** Dat is het hele mechanisme:

```php
$queue = $this->get_next_queue();                     // SELECT * … ORDER BY sent_on ASC LIMIT 1
wp_clear_scheduled_hook( 'leanrdash_notifications_send_delayed_email' );
wp_schedule_single_event( (int) $queue->sent_on, 'leanrdash_notifications_send_delayed_email' );
```

(De typefout `leanrdash` staat écht in de haaknaam en is met een `cSpell:ignore`-commentaar bevroren omdat hij niet meer te wijzigen valt zonder bestaande geplande events te lozen. Instructief: een haaknaam is een publiek contract.)

**Bij het vuren** draait `Trigger::send_db_delayed_email()` (`src/trigger.php:625`). Elke geregistreerde triggerklasse hangt aan diezelfde haak, dus alle 17 worden aangeroepen; ze pakken allemaal dezelfde kop van de wachtrij op en de klasse waarvan de trigger niet matcht doet `return` (regel 661). Het is dus expliciet géén per-trigger-wachtrij maar één globale FIFO op `sent_on`, met een dispatcher die zichzelf uitselecteert. De verwerkingsvolgorde is:

1. Nog niet aan de beurt? Opnieuw plannen op `$queue->sent_on` en stoppen.
2. `shortcode_data` niet deserialiseerbaar → rij verwijderen, volgende plannen. (Anders blokkeert één corrupte rij de hele wachtrij — de kop is immers ook de planner.)
3. Notificatie-post verwijderd → rij verwijderen, volgende plannen.
4. Notificatie inmiddels op vertraging 0 gezet → rij verwijderen, volgende plannen.
5. `can_send_delayed_email()` (per subklasse) → nee: rij verwijderen, volgende plannen.
6. Verzenden, rij verwijderen, `after_email_sent()`, `reschedule_next()`.

**Eén rij per cron-run.** Er is geen batch: staan er tien mails op hetzelfde tijdstip, dan gaan ze pas de deur uit in tien opeenvolgende cron-runs — waarbij `reschedule_next()` telkens meteen het volgende event plant op een tijdstip in het verleden, zodat WP-cron het bij het eerstvolgende paginabezoek oppakt. Op een stille site betekent dat: tien bezoekers = tien mails. Dat is de echte reden achter het docs-advies "gebruik een echte server-cron".

### 1.4 Ontdubbeling: twee mechanismen naast elkaar

Dit is het antwoord op "hoe voorkomen ze dat iemand twee keer wordt gemaild", en het zijn er twee.

**(a) Een gebruikersmeta-vlag per (trigger, notificatie, object).** `Notification::is_sent()` / `mark_sent()` / `mark_unsent()` (`src/notification.php:284-321`) bouwen een meta-key op uit de meegegeven argumenten:

```php
$meta = 'ld_sent_notification_' . implode( '_', array_map( 'sanitize_title', $args ) );
```

In de praktijk levert dat keys op als `ld_sent_notification_enroll_course_1234_567` (trigger, notificatie-post-id, cursus-id). De waarde is een timestamp; `is_sent()` doet `filter_var(…, FILTER_VALIDATE_INT)`. Dit is dus per gebruiker een **rij in `wp_usermeta` per verzonden notificatie**, niet een centraal logboek.

Wanneer die vlag wordt gezet, verschilt per pad:
- direct verzenden: meteen na `send()` (bijv. `Complete_Course::monitor()`, regel 68);
- vertraagd verzenden: pas in `after_email_sent()` ná aflevering (regel 97-99).

En `Enroll_Course::monitor_course_access()` roept bij uitschrijving `mark_unsent()` aan (regel 57), zodat opnieuw inschrijven opnieuw een welkomstmail oplevert. Een bewuste keuze: de vlag is *geen* permanent "deze mens heeft dit ooit gehad", maar "deze mens heeft dit voor de huidige inschrijving gehad".

**(b) Rijen uit de wachtrij verwijderen als de aanleiding vervalt.** `includes/database.php` haakt op `learndash_update_course_access` en `deleted_user` en verwijdert geplande mails van uitgeschreven of verwijderde gebruikers. De WHERE-clausule is opmerkelijk lelijk: omdat `shortcode_data` een geserialiseerde PHP-array is, wordt er met een **regex over de geserialiseerde string** gezocht:

```php
$pattern = "$key\".{0,6}\"?$value(;|\"|\')";
$sql .= "shortcode_data REGEXP '$pattern'";
```

Dat is exact de prijs van "gooi een blob in een kolom": elke query erover is een string-scan zonder index. Voor ons de directe les — zie §1.11.

**Wat er níét is:** geen unique constraint op (gebruiker, notificatie, object) in de wachtrijtabel, en geen slot rond de verzendstap zelf. De ontdubbeling is de meta-vlag plus het feit dat er maar één cron-event tegelijk bestaat; twee gelijktijdige cron-runs die dezelfde kop oppakken zouden theoretisch dubbel kunnen versturen. De verouderde procedurele cron kende daar wél een bestandsslot voor (`learndash_notifications_lock_cron_process()`, `flock` op een bestand onder `wp-content/uploads/learndash/ld-notifications/`), maar dat pad is dood (§1.9).

### 1.5 Ontvangers uitrekenen

`Notification::gather_emails( $user_id, $course_id, $group_id )` (`src/notification.php:338`) bouwt de lijst op:

- begint met de kommalijst uit `_ld_notifications_bcc` (filterbaar via `learndash_notification_bcc`);
- `user` → het e-mailadres van de cursist;
- `group_leader` → groepsleiders van de groepen waarin *deze* gebruiker zit (de cursusgroepen worden expliciet gefilterd op lidmaatschap van de gebruiker, regel 364-368) én met een rolcheck op `group_leader`/`administrator`;
- `admin` → `get_users( ['role' => 'administrator'] )`, alle beheerders;
- daarna `array_unique`, `array_filter` en een `FILTER_VALIDATE_EMAIL` per adres, want de bcc-lijst is gebruikersinvoer;
- ten slotte het filter `learndash_notification_recipients_emails`.

**Er wordt per adres een aparte mail verstuurd** (`Trigger::send()` loopt over `$emails`), zodat ontvangers elkaars adres niet zien. Bcc is in de nieuwe codepath samengevoegd met de gewone ontvangers en de kolom `bcc` wordt leeg opgeslagen ("We don't need this anymore", `src/trigger.php:788`).

### 1.6 Variabelen (shortcodes) worden op verzendmoment opgelost

De mailtekst bevat shortcodes van de vorm `[ld_notifications field="user" show="first_name"]`. De resolutie loopt via een **globale variabele**:

1. `Notification::populate_shortcode_data( $args )` zet `$GLOBALS['ld_notifications_shortcode_data']` op de context-array (user_id, course_id, …, notification_id);
2. `Trigger::send()` roept `do_shortcode()` aan op titel en inhoud;
3. `learndash_notifications_shortcode_init()` (`includes/shortcode.php:30`) leest die globale en zoekt de gevraagde waarde op.

Ondersteunde velden: `user` (username, email, display_name, first_name, last_name, plus willekeurige usermeta als fallback), `group`, `course` (title, url, `completed_on` met eigen `format`, en de hele `cumulative_*`/`aggregate_*`-familie voor quizscores), `lesson`, `topic`, `quiz` (score, percentage, pass, timespent, timestamp, categories), `essay` (points_earned/points_total) en `assignment` (title, file_name, file_link, …). Bij de inactiviteitstrigger zit er in de context `course_ids` (meervoud) in plaats van `course_id`; de shortcode ondersteunt dan alleen `title` en `url` en plakt ze met komma's aan elkaar (regel 97-113).

Twee dingen die opvallen. Ten eerste: de globale wordt onderaan de shortcodefunctie ge-`unset`, maar omdat de functie hem via `global` heeft binnengehaald verwijdert dat alleen de lokale referentie — de globale blijft staan. Functioneel onschuldig, maar het verraadt dat dit pad ouder is dan de rest. Ten tweede, en dit is de echte ontwerpkeuze: **de wachtrij bewaart context-id's, geen gerenderde tekst.** Een mail die over drie dagen uitgaat toont de naam en de cursustitel van over drie dagen. Dat is een keuze met een keerzijde (de mail kan iets anders zeggen dan wat je bij het plannen zag), maar het maakt de wachtrijrijen klein en de mailteksten centraal bewerkbaar.

**Voorwaarden** (`Trigger::are_conditions_valid()`, `src/trigger.php:123`) zijn een tweede laag boven de trigger: "stuur deze mail alleen als de gebruiker óók cursus X af heeft" / "in groep Y zit" / "quiz Z níét heeft afgerond" (`incomplete_quiz` bestaat alleen als voorwaarde, niet als trigger). Alle voorwaarden moeten waar zijn (`in_array( false, $statuses, true )`), met een filter `learndash_notifications_are_conditions_valid` eromheen. Daarnaast checkt `are_triggering_objects_valid()` of het object waarop gevuurd is in de geselecteerde lijst zit, waarbij `'all'` en `0` alles doorlaten.

### 1.7 De inactiviteitsherinnering — precies wat wij willen bouwen

`src/trigger/user-login-track.php`, klasse `User_Login_Track`, trigger `not_logged_in`. Dit is géén wachtrij-mail maar een **poll**: hij hangt aan `learndash_notifications_cron`, dat bij activatie op `twicedaily` wordt gepland (`includes/activation.php:15`). Twee keer per dag dus, niet elk uur en niet elke minuut.

Wat `maybe_send_reminder()` doet:

1. `wp_login` schrijft bij elke login `_ld_notifications_last_login` = `time()` in de gebruikersmeta.
2. Per notificatiemodel wordt de doelgroep opgebouwd: alle gebruikers van de geselecteerde cursussen (of alle cursussen), waarbij mensen die de cursus **al hebben afgerond** of van wie de toegang is verlopen eruit worden gefilterd (`get_users_ids_from_course()`, regel 91-106). Wij zouden hetzelfde moeten doen: een voltooier hoort geen "je bent er even niet geweest" te krijgen.
3. Per gebruiker: als er al eerder gestuurd is (`_ld_notifications_last_login_notified_{notificatie-id}`) én `send_only_once` staat aan → overslaan.
4. Peilmoment = het laatste van (laatste login, laatste eerdere herinnering). Dat tweede maakt van een herhaalbare herinnering een cadans van X dagen ná de vorige mail in plaats van X dagen na de login.
5. **Sessies die blijven leven worden apart afgevangen.** Wie "Remember me" gebruikt, logt maandenlang niet opnieuw in maar is wél actief. De code haalt daarom de laatste rij uit `LDLMS_DB::get_table_name( 'user_activity' )` op (`get_last_activity()`, regel 267) en gebruikt `activity_updated` als die recenter is dan de login. Dit is de belangrijkste les uit dit bestand: **"laatste login" is een slechte proxy voor activiteit; je hebt een activiteitstijdstempel nodig.**
6. Is `strtotime("+X days", $peilmoment) <= time()`, dan wordt er verstuurd — één mail per gebruiker per notificatie, met álle betrokken cursussen samengevoegd in `course_ids` (expliciet becommentarieerd: "only 1 email per user per notification, not per course"). Groepsleiders krijgen een aparte mail met alleen hun eigen cursussen.

**Waarschuwing bij overnemen:** het `_ld_notifications_last_login_notified_{id}`-meta wordt in versie 1.6.9.1 wél *gelezen* (regel 127) maar nergens in de add-on *geschreven* — ik heb de hele repo doorzocht en er is precies één treffer. Zoals de code er staat, komt de "één keer"-rem dus nooit in werking en herhaalt de teller zich telkens vanaf de laatste login of activiteit; ook `only_one_time` heeft dan geen effect. Dit lijkt een regressie (het gedrag hangt af van code die er niet meer is), maar ik heb geen oudere versie naast me gelegd — **behandel dit als een waarneming, niet als een vaststaande bug**. Voor ons is het vooral een ontwerpwaarschuwing: de "al gestuurd"-vlag moet in hetzelfde statement worden geschreven als het versturen, anders is hij precies dit soort stille dode code.

### 1.8 Drip- en verloopmails: twee andere planningspatronen

Ter contrast, want de add-on gebruikt drie verschillende patronen naast elkaar:

- **`Drip_Lesson_Available`** (688 regels, veruit het grootste triggerbestand) plant een **eigen `wp_schedule_single_event` per les**, met de les-id als cron-argument, op het moment dat de les vrijkomt. Bij het opnieuw opslaan van een les wordt het bestaande event opgeruimd en opnieuw gepland; `ensure_cron_queued()` hangt aan `learndash_notifications_cron` als vangnet voor events die verloren zijn gegaan. Dit is het patroon "één cron-item per te plannen ding" — leesbaarder, maar het vult wel `wp_options` met cron-items.
- **`Before_Course_Expire` / `After_Course_Expire`** zijn weer polls op `learndash_notifications_cron`: doorloop alle cursussen met `expire_access`, alle gebruikers daarin, sla voltooiers en al-verlopenen over, controleer `is_sent()`, vergelijk `ld_course_access_expires_on()` met vandaag + X dagen, verstuur, `mark_sent()`. Ontdubbeling hier is dus puur de usermeta-vlag. Er zit ook een `ld_notifications_init`-optie in als antidateer-rem: cursussen waarvan de vervaldatum vóór de installatie van de add-on lag krijgen geen inhaalmail.

### 1.9 Dode code in 1.6.9.1 — kijk uit wat je overneemt

De add-on bevat twee complete generaties naast elkaar. De oude, procedurele generatie in `includes/notification.php` (2354 regels) en `includes/cron.php` bevat `learndash_notifications_send_delayed_emails()` (batch: alles met `sent_on` tussen een uur geleden en nu), `learndash_notifications_resend_missed_delayed_emails()` (alles ouder dan een uur, als inhaalslag), `learndash_notifications_not_logged_in()` en het bestandsslot rond de cron.

**Die functies worden nergens meer aangeroepen.** In `includes/cron.php` staan de drie `add_action`/`add_filter`-regels die ze zouden aanhaken (regels 47, 74, 85) **uitgecommentarieerd**, en er is geen tweede registratiepunt. Wat wél leeft is de haak `learndash_notifications_cron` zelf — die wordt bij activatie op `twicedaily` gepland en de moderne triggerklassen hangen eraan. Concreet gevolg: de "elke minuut"-cron en de uur-inhaalslag uit oudere versies bestaan niet meer; alles loopt via het per-item geplande `leanrdash_notifications_send_delayed_email`.

Ook `learndash_notifications_delete_delayed_emails()` (opruimen van rijen ouder dan twee uur) heeft nog een docblock dat zegt "Fired in cron.php" maar wordt door niets meer aangeroepen. Het opruimen gebeurt nu in `send_db_delayed_email()` zelf, per verwerkte rij.

### 1.10 Fouten, logging en afmelden

- **Verzenden gaat via `learndash_emails_send()`** (LearnDash-core) met `content_type: text/html`. De retourwaarde wordt gebruikt voor `do_action( 'learndash_notifications_email_sent' | '…_email_failed' )`, maar **een mislukte mail leidt niet tot opnieuw proberen**: de wachtrijrij wordt hoe dan ook verwijderd (`src/trigger.php:701-702`). Een mail die niet aankomt, is weg. Dit sluit aan bij onze eigen regel dat `verstuurMail()` nooit gooit — maar zij hebben ook geen tweede kans ingebouwd, en dat is een keuze die je bewust moet maken.
- Tijdens het verzenden wordt tijdelijk aan `wp_mail_failed` gehaakt om de foutmelding te loggen (`debug_email_fail()`).
- **Logging** loopt via LearnDash' eigen `Learndash_Logger` (`Trigger::log()`), met de triggerlabel als categorie; `src/Notifications/Logger.php` registreert het kanaal. Er is een status-scherm (`includes/admin/class-status-page.php`) dat een optie `learndash_notifications_status` toont met `cron_setup` en `last_run` — die wordt alleen bijgewerkt wanneer er daadwerkelijk een vertraagde mail is afgeleverd.
- **Afmelden zit erin.** `LD_Notifications_Subscription_Manager` (`includes/subscription-manager.php`) plakt via het filter `learndash_notifications_email_content` een afmeldregel onder élke notificatiemail, met een link naar een virtuele pagina (`/learndash-notifications-subscription`, alleen voor ingelogden). De voorkeuren staan als array in de usermeta `learndash_notifications_subscription`, per triggerslug 0/1, en `Trigger::send()` slaat een ontvanger over als de vlag voor die trigger op 0 staat (`src/trigger.php:543-547`). Dat is per *soort* mail, niet globaal — precies het model dat je wilt als je onderscheid maakt tussen transactioneel en aanmoedigend.

### 1.11 Wat wij hiervan overnemen (en wat niet)

Onze situatie: Next.js op Vercel met Neon/Postgres en Migadu-SMTP; nu alleen een orderbevestiging. Concreet ontwerp voor de voltooiingsmail en de inactiviteitsherinnering, met LearnDash als vertrekpunt:

1. **Aparte tabel voor geplande mail, met echte kolommen.** Neem hun scheiding trigger→wachtrij→verzender over, maar niet hun blob: waar zij `shortcode_data` serialiseren en er met `REGEXP` doorheen zoeken, hebben wij gewoon `user_id`, `course_slug`, `soort`, `verstuur_na timestamptz` als kolommen. Dat is dezelfde functionaliteit met een index erop.
2. **Ontdubbeling hoort in de vorm van het statement, niet in een aparte vlag.** LearnDash heeft twee losse mechanismen (usermeta-vlag + rij verwijderen) en één daarvan is in 1.6.9.1 kapot gegaan zonder dat iets faalde. Bij ons hoort dat één partiële unique index te zijn — precies zoals `payment_attempts` `WHERE status = 'pending'` al doet — plus een `INSERT … ON CONFLICT DO NOTHING`. Onze CLAUDE.md-regel over data-modifying CTE's op neon-http geldt hier één op één: schrijf claim-en-verstuur als één statement, zodat de invariant uit de vorm volgt.
3. **Bewaar id's, geen gerenderde tekst.** Dat deel van hun ontwerp is goed: de mailtekst leeft in de code, de wachtrij bevat alleen context.
4. **Cron: wij hebben Vercel Cron, dus geen WP-cron-ellende** — geen "één rij per paginabezoek", geen bezoekersafhankelijkheid. Één route die per run een bátch afwerkt (LearnDash doet er één per run; dat is een WP-cron-noodgreep, geen deugd).
5. **Voor de inactiviteitsherinnering: meet activiteit, niet login.** Wij hebben `lesson_progress` en `user_stats` — daar staat een echt activiteitstijdstempel in. Dat is hun `user_activity`-vangnet, maar dan zonder omweg. Filter net als zij mensen eruit die de cursus al af hebben.
6. **Afmelden per soort mail, vanaf dag één.** Een orderbevestiging is verplicht en mag niet afmeldbaar zijn; een aanmoedigingsmail moet dat wél zijn. Hun usermeta-per-trigger-model vertaalt zich bij ons naar een kolom of tabel per gebruiker per mailsoort. Dit raakt ook `/privacy` en de mailteksten — bij dit merk een productvereiste, geen nettigheid.
7. **Niet overnemen:** de trigger-dispatcher waarbij 17 klassen aan dezelfde haak hangen en 16 ervan meteen teruggeven; de geserialiseerde blob; het stil weggooien van een mislukte mail zonder één herkansing.

---

## 2. `LearnDash Achievements` 2.0.4 — punten, badges, streak, leaderboard

### 2.1 Opslag: één eigen tabel plus een posttype

- **Sjablonen** (de badge-definities) zijn posts van het type **`ld-achievement`** (`includes/class-post-type.php`). Instellingen in postmeta: `trigger`, `points`, `occurrences`, `course_id`/`lesson_id`/`topic_id`/`quiz_id`/`group_id`, `user_group`, `percentage` (voor `quiz_score_above`), `achievement_message`, en voor de nieuwe triggers `days`, `courses_count`, `groups_count`, `trigger_badges_count`, `trigger_points_count`.
- **Toekenningen** staan in een eigen tabel **`{$wpdb->prefix}ld_achievements`** (`includes/class-database.php:68`):

```sql
id INT UNSIGNED AUTO_INCREMENT, user_id INT UNSIGNED, post_id INT UNSIGNED,
`trigger` VARCHAR(30), points INT DEFAULT 0, created_at TIMESTAMP, PRIMARY KEY (id)
```

Ook hier: **geen index op `user_id`, geen unique constraint.** Elke toekenning is een aparte rij; een badge die je drie keer verdient staat er drie keer in. De `points` worden ten tijde van toekenning uit het sjabloon gekopieerd naar de rij — een prijswijziging achteraf verandert dus niet wat er al is uitgedeeld. Dat is een goede keuze en dezelfde die wij bij bedragen maken.

- **Puntensaldo** (`Database::get_user_points()`) is een `SUM(points)` over die tabel, beperkt tot achievements waarvan het sjabloon nog gepubliceerd is, **min** de usermeta `achievements_points_used` (uitgegeven bij het "kopen" van een cursus met punten) **plus** de usermeta `learndash_achievements_extra_points` (handmatige bijstortingen door een beheerder). Drie bronnen dus in één getal.

### 2.2 Triggerregistratie: ook hier twee generaties

De **oude generatie** is één statische klasse `LearnDash\Achievements\Trigger` (`includes/class-trigger.php`) die in `init()` alle haken tegelijk registreert en per haak `Achievement::create_new( $trigger, $user_id, … )` aanroept. Zestien triggers, verdeeld in WordPress (`register`, `log_in`, `add_post`, `add_comment`, `visit_post`, `post_visited`) en LearnDash (`enroll_group`, `enroll_course`, `complete_course`, `complete_lesson`, `complete_topic`, `pass_quiz`, `fail_quiz`, `complete_quiz`, `quiz_score_above`, `upload_assignment`, `assignment_approved`, `essay_graded`) — de canonieke lijst staat in `Achievement::get_triggers()` (`includes/class-achievement.php:652`).

De **nieuwe generatie** (v2.0.0) is netjes objectgericht: `src/App/Triggers/Provider.php` haalt een lijst klassen op via het filter `learndash_achievements_trigger_classes`, controleert dat ze de abstracte `Trigger` uitbreiden, registreert ze als singleton in de DI-container en roept `register_hooks()` aan. Drie klassen zitten erin: `Consecutive_Login`, `Complete_Courses_Groups_Count`, `Earn_Badges_Points_Count`. Elke nieuwe trigger doet twee dingen: haken op zijn gebeurtenis, én haken op het filter **`learndash_achievements_trigger_action_is_valid`** om zijn eigen voorwaarde te toetsen. Dat is een nette uitbreidingsgrens — de kern hoeft niets van de nieuwe trigger te weten.

### 2.3 Het toekenningspad en de idempotentie

`Achievement::create_new()` (`includes/class-achievement.php:317`) haalt alle sjablonen voor de trigger op (met `wp_cache`), en loopt ze langs:

1. filter `learndash_achievements_trigger_action_is_valid` → nee: overslaan;
2. objectfilters: past `course_id`/`lesson_id`/`topic_id`/`quiz_id`/`group_id` van het sjabloon bij de gebeurtenis? (`'all'` en leeg laten alles door);
3. bij `quiz_score_above`: percentage vergelijken met de sjablooninstelling — waarbij het quizresultaat via een **statische property** `Achievement::$temp_data` wordt doorgegeven (regel 289 in `class-trigger.php`, gelezen op regel 421). Werkt, maar het is een globale in vermomming;
4. optionele groepscheck (`user_group`);
5. **de idempotentie:** `occurrences` uit het sjabloon versus `get_occurrences( $template_id, $user_id )` — en dat laatste is een live `SELECT COUNT(*) FROM …ld_achievements WHERE post_id = %d AND user_id = %d`. Is het aantal bereikt, dan wordt niets toegekend. `occurrences = 0` betekent onbeperkt.

Dus: **de idempotentie is een tel-query op de toekenningstabel, geen constraint.** Er zit een klassieke race in — twee gelijktijdige verzoeken tellen allebei 0 en voegen allebei toe — die in de praktijk niet opvalt omdat een cursist niet twee keer tegelijk een les afrondt. Het is precies de fout die wij bij `entitlements` bewust níét gemaakt hebben: daar is het één rij per gebruiker per cursus met een uniciteitsregel eronder.

Na opslag vuren `ld_{trigger}_achievement_after_save` en het nieuwe `learndash_achievements_after_create_achievement` (9 argumenten), en wordt een popup-item bijgeschreven in de usermeta **`ld_achievements_notifications`**: een array met titel, bericht en badge-afbeelding. De frontend leest die bij het laden van de pagina uit `wp_localize_script`, toont ze met de meegeleverde noty-bibliotheek, en roept dan de AJAX-actie `ld_achievement_delete_queue` aan om de meta leeg te gooien. **Die AJAX-actie is geregistreerd voor zowel `wp_ajax_` als `wp_ajax_nopriv_` en neemt de `user_id` uit de POST zonder nonce of capability-check** (`class-achievement.php:69-73` en `563-566`) — wie een POST stuurt kan dus andermans wachtrij wissen. Onschadelijk qua data (het zijn alleen popups), maar wel een aanwijzing van hoe oud dit stuk code is.

### 2.4 De streak: `Consecutive_Login`

`src/App/Triggers/Consecutive_Login.php` — dit is het dichtste dat LearnDash bij onze streaks komt, en het is verrassend mager.

- **Haak:** `set_logged_in_cookie` (niet `wp_login`), zodat ook een sessie die met een cookie wordt hersteld meetelt.
- **Toestand:** één usermeta-teller `learndash_consecutive_days_login`, plus de core-meta `learndash-last-login`.
- **Logica** (`handle_user_achievement()`):
  - was de laatste login **gisteren** (`gmdate('Y-m-d', $last) === gmdate('Y-m-d', strtotime('yesterday'))`)? → teller +1 en `Achievement::create_new('consecutive_login', …)`;
  - anders → teller op 0, en klaar. Met één uitzondering: als de laatste login vandáág was, wordt de teller *niet* gereset, zodat meerdere logins op één dag niets kapotmaken.
- **De voorwaarde** zit in `validate_trigger_action()`: de sjablooninstelling `days`, waarbij 0 "geen limiet" betekent, en anders:

```php
return $consecutive_days_user <= $consecutive_days_setting;
```

Dat is `<=`, niet `>=`. En de klassendocblock bevestigt het letterlijk: *"If user consecutive days login count is equal or less than the setting, trigger the achievement."* De badge wordt dus toegekend op elke dag van de reeks tót en met X, in plaats van pas op dag X. Ik heb geen manier om te bepalen of dat bedoeld is (in combinatie met `occurrences = 1` gedraagt het zich wél als "één badge voor wie een reeks begint"), maar het is niet wat de UI-tekst *"User has logged in for X consecutive days"* belooft. **Behandel dit als een waarneming; ik heb het niet draaiend getest.**

Twee harde beperkingen die je moet zien:

1. **De teller wordt alleen bijgewerkt bij inloggen.** Wie op dag 5 niet inlogt, ziet zijn teller pas op dag 6 op 0 springen — er is geen achtergrondproces dat een gebroken reeks opmerkt. Er is dus ook geen enkele plek waar "je streak staat op 5" betrouwbaar te tonen valt zonder eerst opnieuw in te loggen.
2. **`learndash-last-login` wordt in deze klasse alleen bij de allereerste login geschreven** (regel 170-172); daarna leunt hij op core om die meta te onderhouden. Een afhankelijkheid buiten de add-on.

**Vergelijk met ons.** Onze streaks (`src/lib/progress.tsx`) tellen *leeractiviteit* per dag, niet logins, en ze lopen door in de UI zonder dat de gebruiker iets hoeft te doen. Dat is inhoudelijk een ander en beter product: LearnDash beloont "kom langs", wij belonen "leer iets". Wel is hún opslag (één integer in gebruikersopslag, bijgewerkt op het moment van de gebeurtenis) exact wat wij al doen — de vraag is niet of het model klopt maar wat je meet. Wat we van hen kunnen lenen is de "meerdere keren op dezelfde dag mag de reeks niet breken"-regel, expliciet als aparte tak.

### 2.5 Leaderboard en weergave

`[ld_achievements_leaderboard number="10" show_points="false"]` (`includes/class-shortcode.php:53`) draait één GROUP BY:

```sql
SELECT COUNT(user_id) AS total, user_id,
       GROUP_CONCAT(post_id SEPARATOR ',') AS post_ids, SUM(points) AS total_points
FROM {prefix}ld_achievements
WHERE post_id IN (SELECT ID FROM {prefix}posts WHERE post_status='publish' AND post_type='ld-achievement')
GROUP BY user_id ORDER BY total_points DESC LIMIT %d
```

Daarna wordt per rij per badge-id een `get_post()` gedaan om de plaatjes op te halen — een N+1 binnen de lus. Het resultaat gaat in `wp_cache` onder de sleutel `leaderboard_v2_{number}` met **`HOUR_IN_SECONDS`**. Zonder persistente objectcache (Redis/Memcached) is `wp_cache` per verzoek, dus die query draait op zo'n site bij elk paginabezoek opnieuw. Op een tabel zonder index op `user_id`. Dat schaalt niet, en dat is de tweede plek waar deze add-on zijn leeftijd toont. `[ld_my_achievements]` doet hetzelfde per gebruiker.

Losse onderdelen die het vermelden waard zijn: `includes/class-course-point.php` regelt "koop een cursus met punten" (aftrekken via `achievements_points_used`) en er zit een `src/App/Modules/Payments/Gateway.php` in die zich als betaalmethode registreert. `Earn_Badges_Points_Count` is een meta-trigger die op `learndash_achievements_after_create_achievement` haakt en zichzelf expliciet uitsluit om oneindige recursie te vermijden (`if ( $trigger === $this->get_key() ) return;`).

**Vergelijk met ons.** Wij hebben 50 XP per les + quizbonus tot 25, acht levels en tien badges met predicaten; LearnDash heeft punten per achievement en géén levels — het dichtstbijzijnde is `Earn_Badges_Points_Count` ("verdien X punten ⇒ nog een badge"). Onze badges zijn *predicaten over de toestand* (`src/lib/badges.ts`), die van hen zijn *rijen in een gebeurtenistabel*. Beide werken, maar hun model heeft één voordeel dat wij niet hebben: er staat een tijdstempel bij elke toekenning, dus "wanneer verdiende ik dit" en een leaderboard zijn triviaal. Wil je dat ooit, dan is een append-only `badge_awards`-tabel de weg — en dan mét de unique constraint die zij niet hebben.

---

## 3. `LearnDash Certificate Builder` 1.1.5 — waarom 113 MB, en hoe de PDF ontstaat

### 3.1 Waarom hij zo groot is

De opgave noemde 53 MB (de download); uitgepakt is het op deze schijf **113 MB**. De verdeling:

```
95 MB  vendor-prefixed/   (mPDF 8.2.7, namespace-prefixed naar LearnDash\Certificate_Builder\Mpdf)
18 MB  external/          (dezelfde bibliotheken nog eens, onvoorbewerkt)
223 kB src/
```

En binnen mPDF: **`vendor-prefixed/mpdf/mpdf/ttfonts/` is 88 MB, 83 lettertypebestanden.** De grootste drie zijn `Sun-ExtA.ttf` (22 MB), `Sun-ExtB.ttf` (17 MB) en `UnBatang_0613.ttf` (6,7 MB) — CJK-fonts. De add-on is dus voor ~78% Chinees, Japans en Koreaans schrift dat vrijwel geen enkele gebruiker aanraakt. Dat de bibliotheek er twee keer in zit (`external/` als origineel, `vendor-prefixed/` als de versie waarvan de namespaces zijn hernoemd om botsingen met andere plugins te voorkomen) verdubbelt de rest.

Voor ons is dat vooral een goede herinnering dat een PDF-bibliotheek zwaar is. Onze printbare certificaatpagina die de browser laat printen kost 0 kB aan afhankelijkheden — dat is geen armoede, dat is de goedkoopste versie van dit probleem.

### 3.2 Niet TCPDF maar mPDF — en hoe de renderpijplijn loopt

`src/component/class-pdf.php` instantieert `Mpdf` met marges op 0, `default_font = freeserif`, en een `tempDir` in `wp-content/uploads/learndash-certificate-builder/mpdf/` (`src/traits/io.php`). Zelf geüploade fonts komen uit de optie van `Fonts_Manager` en worden als extra fontmap toegevoegd; `backupSubsFont = ['freesans']` vangt corrupte fonts op.

De aanhaking op core is slim en minimaal (`src/controller/class-certificate-builder.php:213`):

```php
$blocks = parse_blocks( $post->post_content );
if ( 'learndash/ld-certificate-builder' === $blocks[0]['blockName'] ) {
    add_action( 'learndash_tcpdf_init', [ $this, 'generate_pdf' ] );
}
```

Oftewel: **de add-on kaapt core's TCPDF-haak.** Bevat het certificaat als eerste blok het builder-blok, dan neemt mPDF het over; anders blijft core's TCPDF-pad gewoon werken. Zo staan het klassieke en het blokgebaseerde certificaat naast elkaar zonder migratie. `generate_pdf()` valideert daarna certificaat-post, toegekende post en gebruiker (elk met `wp_die` bij een mismatch) en geeft de geparste blokken door aan `PDF::serve()`.

`src/component/pdf/class-pdf-content.php` bouwt de HTML op:

- pagina-instellingen komen uit de attributen van het wrapper-blok: `pageSize` (alleen `A4` of `Letter`), `pageOrientation` (`L`/`P`, standaard liggend);
- de achtergrondafbeelding wordt via `get_attached_file()` als lokaal pad gepakt (met `wp_get_attachment_image_url()` als terugval) en als `background-image` op `body` gezet, met `background-image-resize: 6` en `background-image-resolution: from-image`. **Ontbreekt de achtergrond, dan `wp_die()`** — dat is de codebasis achter de docs-eis dat een achtergrondafbeelding verplicht is;
- per blok wordt een klasse afgeleid uit de bloknaam (`str_replace('/', '_', ucwords($blockName, '/'))` → `learndash/ld-courseinfo` wordt `Learndash_Ld_Courseinfo`), met `Fallback` als de klasse niet bestaat. De implementaties staan in `src/component/pdf/blocks/`: `Core_Heading`, `Core_Paragraph`, `Core_Columns`, `Core_Spacer`, plus de vier LearnDash-blokken `Ld_Usermeta`, `Ld_Courseinfo`, `Ld_Quizinfo`, `Ld_Groupinfo`;
- de stijl wordt apart opgebouwd (`class-style-builder.php`) en als twee `HEADER_CSS`-blokken aan mPDF gevoerd (eerst `src/component/pdf/style.css` met de Gutenberg-basisstijlen, dan de per-blok berekende stijlen), waarna de HTML als één `<div id="wrap">` volgt.

### 3.3 Dynamische velden: opgelost op het moment van renderen

De LearnDash-blokken doen géén eigen dataophaling. `Learndash_Ld_Courseinfo::run()` is zes regels: vul de `course_id`-attribuut aan met de cursus waarvoor het certificaat wordt gegenereerd, maak er een `WP_Block` van en roep **`$block->render()`** aan — de gewone server-side render-callback van het blok, dezelfde die de webweergave zou gebruiken. De uitvoer wordt in een `<div>` met het blok-id gewikkeld zodat de stijlbouwer hem kan positioneren.

Dat verklaart meteen de valkuil uit hoofdstuk 05: een `Quiz Info`-blok op een cursuscertificaat rendert leeg, omdat het blok zijn context (`quiz_id`) niet aangereikt krijgt. Het is geen speciale regel, het is gewoon een blok dat zonder context niets te tonen heeft.

### 3.4 Wordt er iets bewaard? Nee.

`PDF::serve()` eindigt met `$this->mpdf->Output( $pdf_name, Destination::INLINE )` — de PDF gaat rechtstreeks naar de browser. De enige dingen die op schijf staan zijn mPDF's tijdelijke werkmap en de geüploade gebruikersfonts. **Er is geen cache, geen opgeslagen PDF, geen certificaatregister.** Elke download rendert opnieuw, met live data. Er is wel een filter `learndash_certificate_builder_pdf_output_mode` waarmee je op `F`/`FD` kunt zetten om alsnog naar schijf te schrijven, maar dat is niets standaard.

De bestandsnaam wordt gebouwd als `{user_login} {course_title} {certificate_title} {sitenaam}.pdf`; de preview in de editor (`generate_preview_pdf()`, achter `current_user_can('edit_post')`) heet simpelweg `preview.pdf`.

**Vergelijk met ons.** Onze printbare certificaatpagina heeft precies dezelfde eigenschappen — niets opgeslagen, alles live — en dus hetzelfde gat: geen verificatie-URL, geen certificaat-id. LearnDash lost dat ook niet op, in geen van beide paden. Als we ooit verificatie willen, is het goede nieuws dat we er geen PDF-pijplijn voor nodig hebben: een certificaat-id met een publieke `/certificaat/{id}`-pagina is genoeg, en dat is bij ons goedkoper te bouwen dan bij hen.

---

## 4. `LearnDash Zapier` 2.3.2 — de census van "noemenswaardige gebeurtenis"

Kort, want de waarde zit in de lijst, niet in de code.

**Architectuur.** Eén endpoint, geen REST-API: `includes/class-api.php:64` luistert op `init` naar `?learndash-integration=zapier` en leest het JSON-lichaam. Authenticatie is één gedeelde sleutel (`learndash_zapier_api_key`, gegenereerd als `strtoupper(substr(str_shuffle(md5(home_url().time())), 0, 20))` — 20 hex-tekens uit een geschudde MD5, dus zwakker dan de lengte suggereert), vergeleken met een gewone string-vergelijking. Abonnementen (webhook-URL's) staan als één array in de **optie `learndash_zapier_hook_subscriptions`**; er is geen tabel.

**Uitgaande gebeurtenissen** (`init_trigger_*`, met de LearnDash-haak ernaast):

| Zapier-trigger | LearnDash-haak |
|---|---|
| `enrolled_into_course` | `learndash_update_course_access` (+ via groep: `ld_added_group_access`, `ld_added_course_group_access`) |
| `enrolled_into_group` | `ld_added_group_access` |
| `course_completed` | `learndash_course_completed` (prioriteit 20, ná het opslaan van de voltooiingstijd) |
| `group_completed` | `learndash_group_completed` |
| `lesson_completed` | `learndash_lesson_completed` |
| `topic_completed` | `learndash_topic_completed` |
| `quiz_completed` / `quiz_passed` / `quiz_failed` | `learndash_quiz_submitted` (de splitsing naar passed/failed gebeurt bij het abonneren, niet bij het vuren) |
| `essay_submitted` | `learndash_new_essay_submitted` |

Dat is de complete lijst: **acht soorten, allemaal voortgang en inschrijving.** Er gaat niets uit over betalingen, over certificaten (behalve als link in de payload) of over inactiviteit. LearnDash beschouwt "iemand is verder gekomen" als de enige noemenswaardige gebeurtenis.

**Payloadvorm.** Genest, objecten per entiteit. `course_completed` verstuurt:

```
user, course, progress, course_info,
course_started_on, course_completed_on, course_certificate_link
```

Elke sleutel gaat door `get_response()`, dat de WordPress-objecten afvlakt. `send_trigger()` doet één ding voor de veiligheid: `unset( $payload['user']->user_pass )` — de wachtwoordhash wordt eruit gehaald vlak vóór verzending, wat betekent dat het volledige `WP_User`-object anders gewoon meeging. De verzending is een `wp_remote_post` met JSON, **zonder foutafhandeling en zonder retry**: het antwoord wordt in een variabele gezet die nergens wordt gebruikt.

**Filters** bij het abonneren: per abonnement mogen `courses_ids`, `groups_ids`, `lessons_ids`, `topics_ids`, `quizzes_ids` mee, die in `init_trigger()` als whitelist werken. En er wordt ontdubbeld op webhook-URL, zodat dezelfde Zap niet twee keer wordt aangeroepen.

**Inkomende acties** (`init_action()`): `enroll_into_course`, `remove_from_course`, `add_to_group`, `remove_from_group` — meer niet, en de eerste en derde maken desnoods een nieuwe gebruiker aan met `wp_generate_password()`.

**Vergelijk met ons.** Deze lijst is bruikbaar als toetssteen voor onze eigen domeingebeurtenissen. Wij hebben er drie die er echt toe doen (betaling geslaagd, les voltooid, cursus voltooid) en LearnDash bevestigt dat je met die laatste twee al bijna alle automatisering aankunt. Het patroon "één statement per gebeurtenis, gefilterd op abonnement" is voor ons overkill zolang er één ontvanger is (onszelf), maar de vorm van hun `course_completed`-payload — gebruiker, cursus, voortgang, starttijd, eindtijd, certificaatlink — is precies de set die onze voltooiingsmail nodig heeft.

---

## 5. Wat dit bij elkaar voor ons betekent

1. **De voltooiingsmail is klein werk en kan direct.** Wij hebben de gebeurtenis al (`verwerkLes()` weet wanneer de laatste les af is), de mailketen staat, en LearnDash laat zien dat je voor de directe variant geen wachtrij nodig hebt: gebeurtenis → ontvangers uitrekenen → versturen → vlag zetten. Het enige dat je van hun ontwerp echt moet overnemen is dat de "verstuurd"-vlag in hetzelfde statement staat als het versturen.
2. **De inactiviteitsherinnering vraagt wél een wachtrij plus een cron.** Model: een tabel met echte kolommen, een partiële unique index als ontdubbeling, een Vercel Cron-route die per run een batch afwerkt, en als peilmoment ons eigen activiteitstijdstempel in plaats van een login. Filter voltooiers eruit, net als zij.
3. **Afmelden per mailsoort hoort in het eerste ontwerp**, niet erna. Hun `learndash_notifications_subscription`-model per trigger is het juiste grofheidsniveau.
4. **Onze gamification is inhoudelijk verder dan die van LearnDash**, niet architectonisch. Zij hebben een gebeurtenistabel met tijdstempels die wij niet hebben (leaderboard en "wanneer verdiende ik dit" zijn bij hen triviaal); wij hebben levels, activiteitsgebaseerde streaks en predicaatbadges die zij niet hebben. Willen we ooit een leaderboard, dan is de goedkoopste weg een append-only toekenningstabel — mét de unique constraint die zij vergaten.
5. **De certificaatvergelijking valt in ons voordeel uit.** Zij betalen 88 MB aan fonts voor een PDF die niemand bewaart; wij printen een pagina. Het echte gat is bij beiden hetzelfde: verificatie. Dat is bij ons een middag werk en bij hen een third-party product.

---

## 6. Onzekerheden bij deze analyse

- **Ik heb niets gedraaid.** Dit is statische lezing van de broncode; er stond geen WordPress met LearnDash naast. Waar ik "wordt nooit aangeroepen" of "lijkt een regressie" schrijf, is dat gebaseerd op een volledige grep over de add-on-map (exclusief `vendor/`), niet op een test.
- **De niet-geschreven `_ld_notifications_last_login_notified_*`-meta** (§1.7) en de `<=`-vergelijking in `Consecutive_Login` (§2.4) zijn de twee bevindingen waar ik het minst zeker over ben. Beide zijn intern consistent met de docblocks in dezelfde bestanden, maar een gedragstest zou dit in tien minuten sluitend maken.
- **Ik heb geen oudere versies vergeleken.** Uitspraken over "dit was vroeger anders" leun ik uitsluitend op `@since`-annotaties en uitgecommentarieerde code in de bestanden zelf.
- **Interactie met LearnDash-core is niet nagetrokken.** Verschillende paden leunen op core-functies (`learndash_emails_send()`, `learndash-last-login`, de `user_activity`-tabel, `learndash_tcpdf_init`) waarvan ik het gedrag uit de naam en de aanroepende code afleid.
- **De 113 MB versus de 53 MB uit de opdracht** is waarschijnlijk uitgepakt-versus-archief, mogelijk in combinatie met de clustergrootte van deze schijf. De verhoudingen binnen de map (ttfonts domineert, bibliotheek zit er twee keer in) staan los van die vraag.
- **`learndash-integrity`, `ld-tec` en de andere add-ons in dezelfde map** zijn niet bekeken; die kunnen gedrag van deze vier beïnvloeden op een echte installatie.
