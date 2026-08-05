# LearnDash: engagement, gamification, certificaten & communicatie

*Onderzoek: 5 aug 2026. Bronnen: officiële LearnDash-supportdocumentatie (learndash.com/support, redirect naar docs.nexcess.com sinds de overname door Liquid Web/Nexcess), LearnDash-blog, developers.learndash.com, plus documentatie van de gangbare integratiepartners (GamiPress, BadgeOS, myCred, BuddyBoss, WooNinjas).*

Dit document beschrijft wat LearnDash 4.x doet aan leerling-engagement: certificaten, punten, gamification, e-mail/notificaties, Focus Mode, community-integraties en het leerlingdashboard. De rode draad: **LearnDash-core bevat verrassend weinig gamification** — vrijwel alles wat op engagement lijkt komt uit gratis first-party add-ons (`Achievements`, `Notifications`, `Certificate Builder`) of uit third-party plugins (GamiPress, BadgeOS, myCred, BuddyBoss). Dat is een bewuste architectuurkeuze: core doet cursusstructuur en toegang, de rest is opt-in.

---

## 1. Certificaten

### 1.1 Twee manieren om een certificaat te bouwen

**Klassiek (core):** een certificaat is een eigen posttype onder *LearnDash LMS > Certificates*. Je uploadt een achtergrondafbeelding als featured image en positioneert daaroverheen tekst en shortcodes in de WordPress-editor. Dit werkt, maar positioneren met de klassieke editor is berucht lastig — pixelwerk zonder WYSIWYG.

**`Certificate Builder` (gratis first-party add-on):** een blokgebaseerde bouwer op de Gutenberg-editor. Je klikt in het certificaatscherm op "Use Certificate Builder" en krijgt een visuele editor. Een achtergrondafbeelding uploaden is **verplicht** voordat je verder kunt — die vormt het fundament waar alle andere elementen op liggen. Je mag elk Gutenberg-blok gebruiken, plus vier dynamische LearnDash-blokken:

| Blok | Toont |
|---|---|
| `Course Info` | cursusspecifieke data: titel, voltooiingsdatum, punten |
| `Quiz Info` | quizdata: titel, score, tijdstip |
| `User Meta` | gebruikersgegevens: naam, login |
| `Groups Info` | groepsdata: titel, voltooiingsstatus, percentage |

Eigen fonts upload je via *LearnDash LMS > Certificates > Fonts*; fontstyling kan op de blokken Heading, User Meta, Course Info en Group Info.

Bekende valkuilen uit de officiële docs: een `Quiz Info`-blok op een cursuscertificaat (of andersom) rendert géén dynamische inhoud — het bloktype moet passen bij waar het certificaat aan hangt. En beeldoptimalisatieplugins kunnen de achtergrondafbeelding laten verdwijnen.

Bron: https://learndash.com/support/kb/add-ons/certificate-builder-add-on/certificate-builder-add-on/ (redirect: https://docs.nexcess.com/software/learndash/certificate-builder-add-on/)

### 1.2 Certificaat-shortcodes

Vier hoofdshortcodes leveren de dynamische inhoud (ook beschikbaar als blok; de volledige lijst staat in de admin onder *Certificates > Shortcodes*):

- **`[usermeta]`** — `field="first_name"`, `last_name`, `display_name`, `user_login`, `nickname`, `user_email`, `user_url`, `description`, `id`. Vrijwel elk certificaat gebruikt minimaal voor- en achternaam.
- **`[courseinfo]`** — `show="course_title"`, `course_price`, `course_url`, `enrolled_on`, `completed_on` (met eigen datumformattering), `user_course_points`, `course_points`, `cumulative_score`, `cumulative_percentage`, `cumulative_timespent`, `aggregate_score`, `aggregate_percentage`, `aggregate_points`. "Cumulative" middelt over alle quizzen in de cursus, "aggregate" telt op.
- **`[quizinfo]`** — `show="score"`, `percentage`, `points`, `total_points`, `count` (aantal vragen), `pass`, `timespent`, `timestamp`, `quiz_title`, `course_title`.
- **`[groupinfo]`** — `show="group_title"`, `group_url`, `enrolled_on`, `completed_on`, `percent_completed`, `user_group_status`.

Bron: https://learndash.com/support/kb/core/certificates/certificate-shortcodes/

### 1.3 PDF-generatie

Certificaten worden **server-side als PDF gegenereerd met de meegeleverde TCPDF-bibliotheek** (sinds LD 3.2 een geüpgradede versie; de constante `LEARNDASH_TCPDF_LEGACY_LD322` en hooks als `learndash_tcpdf_init` en `learndash_certificate_params` bevestigen dit in de dev-docs). De PDF wordt **on demand** gerenderd bij het klikken op de downloadlink — er wordt geen bestand opgeslagen; de gegevens komen live uit de database. De preview in de Certificate Builder genereert daarom ook een PDF met échte data: de docs adviseren een testcursus aan te maken en te voltooien om een realistische preview te zien.

TCPDF is meteen ook de bron van de klassieke frustraties: het ondersteunt maar een deel van HTML/CSS, waardoor wat er in de editor staat niet 1-op-1 in de PDF verschijnt. De Certificate Builder bestaat grotendeels om die kloof te verkleinen.

Bron: https://developers.learndash.com/package/pdf/ · https://developers.learndash.com/constant/learndash_tcpdf_legacy_ld322/

### 1.4 Toekenningsregels

Een certificaat hang je aan één van drie objecten:

1. **Cursus** — uitgereikt bij cursusvoltooiing (alle lessen/topics/quizzen af).
2. **Quiz** — uitgereikt bij het halen van een quiz; in de quizinstellingen stel je een **drempelpercentage** in ("Certificate Awarded for" score), los van de slagingsdrempel.
3. **Groep** — uitgereikt wanneer alle cursussen in een groep zijn voltooid.

Het certificaat is dus een eigenschap van het leerobject, niet van de leerling; wie aan de voorwaarde voldoet krijgt de downloadlink te zien op de cursuspagina en in het profiel.

Bron: https://learndash.com/support/kb/core/uncategorized/certificates/ (redirect: https://docs.nexcess.com/software/learndash/certificates/)

### 1.5 Verificatie: níét in core

LearnDash heeft **geen ingebouwde certificaatverificatie** — geen publiek verifieerbare URL, geen certificaat-ID, geen register. Dat gat vult de third-party markt: bijvoorbeeld `LearnDash Certificate Verify & Share` van WooNinjas maakt een publieke verificatiepagina per certificaat, genereert een QR-code (via shortcode op het certificaat zelf) die naar die pagina linkt, en biedt één-klik-delen naar LinkedIn. Werkgevers kunnen dan verifiëren met alleen het certificaat-ID of de link, zonder admintoegang.

**Vergelijk met ons:** onze printbare certificaatpagina per cursus heeft hetzelfde gat — geen verificatie-URL — en de LearnDash-les is dat verificatie + LinkedIn-share de twee features zijn waar de markt om vroeg.

Bron: https://wooninjas.com/downloads/learndash-certificate-verify-share/

---

## 2. Course Points: gating vermomd als gamification

Core-LearnDash kent per cursus twee puntinstellingen (onder *Settings > Course Access*):

- **Awarded on Completion** — hoeveel punten voltooiing van deze cursus oplevert;
- **Required for Access** — hoeveel punten een leerling minimaal moet hebben om deze cursus te mogen openen (naast de gewone toegangsmodus).

Het klassieke voorbeeld uit de docs: elke beginnerscursus levert 50 punten op, de gevorderdencursus vereist er 100 — dus eerst twee beginnerscursussen afronden. Er zijn dev-functies als `learndash_check_user_course_points_access()` voor programmatische controle.

**Beoordeling: dit is primair een gating/prerequisite-mechanisme, geen gamification.** Er is in core geen puntenwinkel, geen leaderboard, geen level, geen zichtbare progressiebalk richting een puntendoel; het profiel-shortcode toont wel het puntentotaal, maar dat is het. De punten zijn een derde vorm van prerequisite naast "cursus X eerst afronden" en handmatige inschrijving. Pas de `Achievements`-add-on maakt punten echt gamification (zie §3) — en die heeft een **eigen, gescheiden puntensysteem**, wat verwarrend is: "course points" (core, gating) en "achievement points" (add-on, beloning) zijn twee verschillende tellers.

**Vergelijk met ons:** onze XP (50/les + quizbonus) lijkt qua getallen op LearnDash-course-points, maar wij gebruiken XP puur als voortgangsbeloning en nooit als slot op content — LearnDash doet in core precies het omgekeerde.

Bron: https://www.learndash.com/support/docs/core/courses/course-access/ (redirect: https://docs.nexcess.com/software/learndash/course-enrollment-mode/) · https://www.learndash.com/blog/3-ways-to-create-course-prerequisites-in-learndash/ · https://developers.learndash.com/function/learndash_check_user_course_points_access/

---

## 3. Gamification: core heeft (bijna) niets, de `Achievements`-add-on en derden vullen het

### 3.1 Wat core echt heeft

Weinig: course points (§2), quizpunten en -percentages, voortgangsbalken, en certificaten. Geen badges, geen levels, geen streaks, geen leaderboard. Alles daarbovenop is add-on-werk.

### 3.2 `LearnDash Achievements` (first-party, gratis — bestaat en is officieel)

Geverifieerd: de add-on bestaat, is van LearnDash zelf, gratis, en installeerbaar via *LearnDash LMS > Add-Ons*. Het is het antwoord van LearnDash op "waarom moet ik GamiPress installeren voor een badge".

**Triggers** (acties die een achievement toekennen), verdeeld in twee groepen:

- *WordPress:* registratie, inloggen, post aanmaken, reageren, postbezoeken, en **X dagen achtereen inloggen** (login-streak);
- *LearnDash:* inschrijving cursus/groep, voltooiing cursus/les/topic/groep, quiz gehaald/gezakt/voltooid/score boven drempel, opdracht geüpload/goedgekeurd, essay beoordeeld, **X cursussen of groepen voltooid**, **X badges of punten verdiend** (meta-achievements).

**Per achievement configureerbaar:** punten, hoe vaak hij kan triggeren, badge-afbeelding (eigen upload of preset). **Harde beperking uit de docs:** na publicatie zijn de trigger en het gekoppelde object **niet meer te wijzigen** — fout gekozen betekent opnieuw beginnen.

**Weergave:** shortcode/blok `[ld_achievements_leaderboard]` (ranglijst op punten, met parameters voor aantal gebruikers en puntenzichtbaarheid) en `[ld_my_achievements]` (eigen badges, titel bij hover, optioneel puntentotaal). Popup-notificaties bij het verdienen van een achievement, met instelbare duur, positie (7 opties), kleuren en RTL-ondersteuning.

**Punten uitgeven:** in cursussen met toegangsmodus *Buy Now* kun je een prijs in achievement-punten instellen — leerlingen "kopen" dan een cursus met verdiende punten. Dit is de enige plek waar achievement-punten besteedbaar zijn.

Admins kunnen punten handmatig bijstorten per gebruiker; groepsleiders zien de badges van hun groepsleden.

**Vergelijk met ons:** onze 10 badges + 8 levels + streaks zitten native in de client-engine; LearnDash heeft geen levels-equivalent — het dichtstbijzijnde zijn meta-achievements ("verdien X punten") en de ranks van third-party plugins.

Bron: https://learndash.com/support/kb/add-ons/achievements-add-on/achievements-add-on/ (redirect: https://docs.nexcess.com/software/learndash/achievements-add-on/) · https://www.learndash.com/ld-add-ons/learndash-achievements/

### 3.3 De standaard third-party stack: GamiPress, BadgeOS, myCred

Wie meer wil dan de Achievements-add-on pakt een van de drie generieke WordPress-gamificationplugins; alle drie hebben een gratis LearnDash-integratie die diep op LearnDash-events haakt:

- **GamiPress** (`GamiPress – LearnDash integration`): voegt activity-events toe voor inschrijven (elke/specifieke cursus), voltooien van cursus/les/topic/quiz, en quiz halen met minimaal X% score. Daarop bouw je punten (meerdere valuta's), achievements/badges en ranks (levels!). Een betaalde add-on zet GamiPress-triggers zelfs direct op de LearnDash-bewerkpagina's. Dit is anno 2026 de meest aanbevolen combinatie.
- **BadgeOS** (`BadgeOS LearnDash Integration`, gratis): badges, punten en ranks voor cursus-/les-/topic-/quiz-/opdracht- en groepsacties; sterk in "certification paths" (badge A + badge B ⇒ credential C) en open badges.
- **myCred** (integratie via o.a. WooNinjas): onbeperkte puntentypes met verdien- én inwisselregels, punten voor inschrijven/lessen/quizzen/opdrachten, badges via `[mycred_my_badges]`, en een apart leaderboard-product (`LearnDash myCred Leaderboard`).

De integraties zijn allemaal event-gedreven: LearnDash vuurt WordPress-hooks bij les-/quiz-/cursusgebeurtenissen en de gamificationplugin luistert. De diepte is dus goed — per specifiek object of generiek, met scoredrempels bij quizzen — maar de gamification blijft een losse laag met eigen UI, eigen data en eigen widgets naast LearnDash.

Bron: https://gamipress.com/add-ons/learndash-integration/ · https://wordpress.org/plugins/gamipress-learndash-integration/ · https://badgeos.org/docs/add-ons/badgeos-learndash-integration/ · https://docs.wooninjas.com/article/11-learndash-mycred-integration-overview

### 3.4 Streaks en dagelijkse gewoontes: vrijwel afwezig

**LearnDash-core heeft geen enkel streak- of daily-habit-mechanisme** — geen dagelijkse doelen, geen streakteller, geen reminder "je bent al 5 dagen bezig". Het enige officiële dat in de buurt komt is de trigger *"X dagen achtereen inloggen"* in de `Achievements`-add-on — een login-streak als eenmalige badge, geen doorlopende teller met verliesangst zoals Duolingo. Third parties vullen ook dit gat: WooNinjas' `LearnDash Goals` bouwt streaks, leerdoelen en tijdregistratie bovenop LearnDash. De indirecte route is een inactiviteitsmail via de `Notifications`-add-on (§4).

**Vergelijk met ons:** onze native streaks zijn dus iets dat LearnDash-gebruikers alleen via twee extra plugins benaderen — een reëel differentiatiepunt.

Bron: https://docs.nexcess.com/software/learndash/achievements-add-on/ · https://wooninjas.com/learndash-goals-guide/

---

## 4. E-mail en notificaties

### 4.1 Wat core zelf mailt

Onder *LearnDash LMS > Settings > Emails* zitten precies drie transactionele mails plus facturen:

1. **Course Purchase Success** — na aankoop van een cursus (via LearnDash's eigen checkout);
2. **Group Purchase Success** — idem voor een groep;
3. **New User Registration** — na registratie;
4. **Purchase Invoice** — een factuur/kwitantie als bijlage of mail, met instelbare bedrijfsgegevens, btw-nummer en logo, HTML of platte tekst.

Sender-naam en -adres zijn instelbaar (anders vallen ze terug op site-admin en sitetitel). Placeholders: `{user_login}`, `{first_name}`, `{last_name}`, `{display_name}`, `{user_email}`, `{post_title}`, `{post_url}`, `{site_title}`, `{site_url}`. Mails zijn per stuk aan/uit te zetten.

Daarnaast kent het **quiz-systeem** eigen e-mailnotificaties (erfenis van het ingebakken WP-Pro-Quiz): een mail naar de leerling met de uitslag en/of naar admin/groepsleider bij quizvoltooiing, met eigen sjablonen.

**Opvallend: core stuurt géén mail bij cursusvoltooiing, lesvoltooiing, inschrijving door een admin, of drip-vrijgave.** Alles wat op een leertraject-mail lijkt vereist de `Notifications`-add-on.

Bron: https://learndash.com/support/kb/core/uncategorized/emails/ (redirect: https://docs.nexcess.com/software/learndash/emails/) · https://learndash.com/support/kb/core/uncategorized/quiz-email-notifications/

### 4.2 `LearnDash Notifications` (first-party add-on, gratis)

Dit is de motor voor alle geautomatiseerde leerlingcommunicatie. Elke notificatie = trigger + (optionele) vertraging + ontvangers + onderwerp/bericht met shortcodes. De volledige triggerlijst uit de officiële docs:

- gebruiker schrijft zich in voor een **groep**
- gebruiker schrijft zich in voor een **cursus**
- gebruiker **voltooit een cursus**
- gebruiker **voltooit een les**
- een **geplande (drip) les komt beschikbaar**
- gebruiker **voltooit een topic**
- gebruiker **voltooit een quiz** / **haalt een quiz** / **zakt voor een quiz** / **dient een quiz in**
- **essay ingediend** / **essay beoordeeld**
- **opdracht geüpload** / **opdracht goedgekeurd**
- gebruiker heeft **X dagen niet ingelogd** (inactiviteitsreminder)
- **X dagen voor/na het verlopen van cursustoegang**
- cijfer handmatig toegevoegd (vereist de `Gradebook`-add-on)

Triggers zijn per specifieke cursus/les/topic/quiz óf "globaal" in te stellen. **Vertraging:** per notificatie een aantal dagen na de trigger (standaard 0 = direct) — daarmee bouw je "X dagen na inschrijving"-reeksen op de inschrijftrigger. **Ontvangers:** de leerling, diens groepsleider(s), alle site-admins en/of extra e-mailadressen (kommagescheiden). **Variabelen:** ±34 shortcodes in de trant van `[ld_notifications field="user" show="first_name"]` en `[ld_notifications field="course" show="title"]` — welke beschikbaar zijn hangt af van de gekozen trigger en staat onderaan het bewerkscherm.

**Beperkingen uit de docs:** vertraagde mails leunen op **WP-cron** — op een stille site gaan ze pas uit als er verkeer is, dus de aanbeveling is een echte server-cron. En bezorging staat of valt met SMTP: de docs adviseren expliciet een externe SMTP-dienst omdat "hosting servers are designed to host websites, not send email".

**Vergelijk met ons:** wij sturen nu alleen de orderbevestiging; LearnDash' triggerlijst is een bruikbare boodschappenlijst voor wat er ooit bij kan (voltooiingsmail met certificaatlink, drip-aankondiging, inactiviteitsreminder) — en het "delay op inschrijftrigger"-patroon is het eenvoudigste model voor onboardingreeksen.

Bron: https://learndash.com/support/kb/add-ons/notifications-add-on/notifications-2/ (redirect: https://docs.nexcess.com/software/learndash/notifications-2/) · https://www.learndash.com/ld-add-ons/learndash-notifications/

---

## 5. Focus Mode en de login/registratie-modal

**Focus Mode** (sinds LD 3.0, vereist het 3.0-template) is LearnDash' belangrijkste ingebouwde engagement-feature: een afleidingsvrije leeromgeving die het **thema van de site volledig vervangt** op les-, topic-, quiz- en opdrachtpagina's (cursuspagina's houden de themalayout). Weg zijn hoofdnavigatie, footer en sidebars; ervoor in de plaats komen een vaste zijbalk met de cursusnavigatie (sinds 4.1 links óf rechts), een voortgangsindicator bovenaan, Vorige/Volgende en "Mark Complete" altijd in beeld, en een profielmenu met Course Home/Logout (uitbreidbaar via het WP-menusysteem, maar submenus worden plat). Instelbaar: een eigen logo linksboven en de contentbreedte (768–1600px of full-width). Het expliciete doel in de docs: hogere retentie en hogere voltooiingspercentages.

**Login/registratie-modal:** sinds LD 3.0 (volwaardig sinds 3.6) heeft LearnDash een eigen overlay-modal voor inloggen en registreren — een bezoeker die op "Login" klikt blijft op de pagina in plaats van naar wp-login.php te gaan, en registratie + inschrijving + (bij gratis cursussen) direct starten lopen in één flow door. De docs presenteren dit nadrukkelijk als "geen third-party plugin meer nodig".

**Vergelijk met ons:** Focus Mode is conceptueel wat onze lespagina's al doen (les centraal, cursusnavigatie in een zijbalk); het interessante detail is dat LearnDash het als expliciete conversie-feature framet, met het logo als enige merkelement.

Bron: https://learndash.com/support/kb/core/settings/focus-mode/ (redirect: https://docs.nexcess.com/software/learndash/focus-mode/) · https://learndash.com/support/kb/core/settings/login-registration/

---

## 6. Community en sociaal: de bbPress/BuddyBoss-stack

Ook hier: **core heeft niets sociaals** — geen forum, geen berichten, geen reacties op lesniveau (WordPress-comments op lessen kunnen aan, maar dat is WordPress, geen LMS-feature). De standaardstack:

- **bbPress** (+ de LearnDash-bbPress-integratie): per cursus een publiek of privéforum, waarbij forumtoegang automatisch wordt verleend bij inschrijving. Lichtgewicht, alleen forums.
- **BuddyPress** (`BuddyPress for LearnDash`): sociale profielen en groepen; LearnDash-groepen koppelen aan BuddyPress-groepen.
- **BuddyBoss Platform** — de de-facto standaard voor serieuze cursuscommunity's: LearnDash-groepen syncen naar BuddyBoss Social Groups, zodat elke cursus of cohort een eigen besloten ruimte krijgt met activiteitenfeed, forum én privéberichten; cursisten in dezelfde cursus kunnen elkaar direct berichten sturen; elke cursus verschijnt in het BuddyBoss-ledenprofiel onder een Courses-tab. Daarbovenop: likes, mentions, notificaties, een mobiele app (BuddyBoss App, betaald).

Kanttekening uit de praktijkliteratuur: de LearnDash+BuddyBoss-stack is krachtig maar zwaar — veel plugins, veel onderhoud, en de community-UX blijft die van een sociaal netwerk naast de cursus in plaats van erin.

**Vergelijk met ons:** ons redactionele vragen-per-les-model is bewust het omgekeerde van deze stack — geen forum, geen realtime verwachtingen, wél context bij de les; LearnDash heeft daar geen equivalent voor.

Bron: https://buddyboss.com/integrations/learndash-lms/ · https://www.learndash.com/blog/buddypress-add-on-now-available/ · https://ldx.design/learndash-buddyboss/

---

## 7. Het leerlingdashboard: `[ld_profile]` en de course registry

LearnDash' out-of-the-box leerlingfrontend draait om het shortcode/blok **`[ld_profile]`**, dat je op een willekeurige pagina ("Mijn dashboard") zet. De leerling ziet daar:

- alle **ingeschreven cursussen** met voortgangsbalk en status;
- per cursus uitklapbaar de **quizresultaten** (score, percentage, datum, aantal pogingen);
- het eigen **puntentotaal** (course points);
- verdiende **certificaten** met downloadlinks (zowel cursus- als quizcertificaten);
- profielgegevens met bewerkmogelijkheid en avatar.

Parameters beperken wat er getoond wordt (aantal cursussen per pagina, wel/geen quizzen, wel/geen zoekveld enz.). Daarnaast bestaan `[ld_course_list]` (de cursuscatalogus/registry, met filters), `[ld_course_info]` (voortgang + punten van de ingelogde gebruiker) en `[ld_quiz_complete]`-achtige conditionele shortcodes.

**Wat de leerling níét ziet:** een frontend-overzicht van eigen **opdrachten en essays** ontbreekt — ingeleverde opdrachten zijn alleen zichtbaar op de lespagina waar ze zijn geüpload, en beoordeling gebeurt volledig in wp-admin. Ook hier vult de markt het gat (dashboard-plugins van o.a. Wbcom en WisdmLabs bouwen frontend-beheer van opdrachten, essays en quizpogingen).

Voor de docent/beheerder is er **`ProPanel`** (sinds LD 4.x inbegrepen bij de Plus/Pro-licenties, v3.0 herbouwd op blokken): vier dashboardwidgets — Overview (totalen), **Activity** (realtime activiteitenstroom: inschrijvingen, les-/topic-/quiz-/cursusvoltooiingen, met tijdstempel, filterbaar op cursus/gebruiker/groep, standaard 5 items per pagina), Reporting (CSV-export van voortgang en quizdata) en Chart. ProPanel 3.0 voegt frontend-reportblokken toe waarmee je meerdere rapportagedashboards bouwt (cursus-, leerling- en quizspecifiek). Let op: ProPanel is een **admin/docent-tool**, geen leerlingfeature — de activity-widgets zijn niet wat de cursist ziet.

**Vergelijk met ons:** ons /leerpad toont XP, levels, streaks en badges — rijker voor de leerling dan `[ld_profile]` — maar wij missen de beheerkant die ProPanel biedt (realtime wie-doet-wat en exporteerbare voortgang).

Bron: https://learndash.com/support/kb/core/uncategorized/user-profiles/ · https://www.learndash.com/support/docs/reporting/propanel/ (redirect: https://docs.nexcess.com/software/learndash/propanel/) · https://www.uncannyowl.com/knowledge-base/learndash-shortcodes/

---

## 8. Wat hiervan niet uit officiële bron te verifiëren was

- De exacte, volledige lijst van 34 notificatie-shortcodes staat niet integraal in de publieke docs; die verschijnt pas in het bewerkscherm na triggerkeuze.
- Waar core-course-points voor de leerling zichtbaar zijn buiten `[ld_profile]`/`[ld_course_info]` benoemen de docs niet expliciet.
- Of de core-registratiemail standaard aan of uit staat, laten de docs in het midden ("enable or disable certain email notifications").
- Aantallen ("13 triggers" in oudere bronnen vs. de 16+ die de actuele docs tonen) verschuiven per versie; de lijst in §4.2 volgt de huidige officiële documentatie.

---

## Bronnen

**Officieel (LearnDash / Nexcess-docs / dev-docs):**
- https://learndash.com/support/kb/add-ons/certificate-builder-add-on/certificate-builder-add-on/ → https://docs.nexcess.com/software/learndash/certificate-builder-add-on/
- https://learndash.com/support/kb/core/certificates/certificate-shortcodes/ → https://docs.nexcess.com/software/learndash/certificate-shortcodes/
- https://learndash.com/support/kb/core/uncategorized/certificates/ → https://docs.nexcess.com/software/learndash/certificates/
- https://developers.learndash.com/package/pdf/ · https://developers.learndash.com/constant/learndash_tcpdf_legacy_ld322/
- https://www.learndash.com/support/docs/core/courses/course-access/ → https://docs.nexcess.com/software/learndash/course-enrollment-mode/
- https://developers.learndash.com/function/learndash_check_user_course_points_access/
- https://learndash.com/support/kb/add-ons/achievements-add-on/achievements-add-on/ → https://docs.nexcess.com/software/learndash/achievements-add-on/
- https://www.learndash.com/ld-add-ons/learndash-achievements/
- https://learndash.com/support/kb/add-ons/notifications-add-on/notifications-2/ → https://docs.nexcess.com/software/learndash/notifications-2/
- https://www.learndash.com/ld-add-ons/learndash-notifications/
- https://learndash.com/support/kb/core/uncategorized/emails/ → https://docs.nexcess.com/software/learndash/emails/
- https://learndash.com/support/kb/core/uncategorized/quiz-email-notifications/
- https://learndash.com/support/kb/core/settings/focus-mode/ → https://docs.nexcess.com/software/learndash/focus-mode/
- https://learndash.com/support/kb/core/settings/login-registration/
- https://learndash.com/support/kb/core/uncategorized/user-profiles/
- https://www.learndash.com/support/docs/reporting/propanel/ → https://docs.nexcess.com/software/learndash/propanel/
- https://www.learndash.com/blog/3-ways-to-create-course-prerequisites-in-learndash/
- https://www.learndash.com/blog/buddypress-add-on-now-available/
- https://www.learndash.com/blog/automate-student-emails-with-the-learndash-notifications-add-on/

**Third-party (integraties en gaten in core):**
- https://gamipress.com/add-ons/learndash-integration/ · https://wordpress.org/plugins/gamipress-learndash-integration/
- https://badgeos.org/docs/add-ons/badgeos-learndash-integration/
- https://docs.wooninjas.com/article/11-learndash-mycred-integration-overview · https://docs.wooninjas.com/category/21-learndash-mycred-leaderboard
- https://wooninjas.com/downloads/learndash-certificate-verify-share/
- https://wooninjas.com/learndash-goals-guide/
- https://buddyboss.com/integrations/learndash-lms/ · https://ldx.design/learndash-buddyboss/
- https://www.uncannyowl.com/knowledge-base/learndash-shortcodes/
