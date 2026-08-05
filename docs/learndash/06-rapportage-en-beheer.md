# LearnDash 6 — Rapportage, beheer en operations

*Onderzoek: 5 aug 2026. Bronnen: officiële LearnDash-documentatie (die sinds de Liquid Web-consolidatie doorverwijst naar docs.nexcess.com en liquidweb.com/help-docs), developers.learndash.com, en waar nodig ecosysteempartijen (Uncanny Owl, GrassBlade, WP Fusion) — die laatste zijn als zodanig gemarkeerd.*

Dit document beschrijft hoe LearnDash rapportage en dagelijks beheer aanpakt: wat de kern laat zien, wat `ProPanel` toevoegt, hoe de onderliggende datalaag eruitziet, en wat het kost (in geld én onderhoud) om zo'n platform draaiend te houden. Twee dingen vooraf die je referentiekader bijstellen:

1. **De versienummering is doorgeschoven.** De onderzoeksvraag ging uit van "LearnDash 4.x actueel", maar **LearnDash 5.0 verscheen op 4 februari 2026** (met "Angie" agentic AI en een eigen MCP-server) en medio 2026 staat de teller op 5.1.x. De rapportage- en beheerfuncties hieronder stammen grotendeels uit de 4.x-lijn en bestaan nog steeds; waar 5.0 iets veranderde staat dat erbij.
2. **Het bedrijf achter LearnDash is in beweging.** LearnDash werd in september 2021 gekocht door de Liquid Web-groep (merk StellarWP, hostingdochter Nexcess). In 2026 is StellarWP als merk **opgeheven** en zijn de plugins direct onder "Liquid Web Software" gehangen. Facturen komen sindsdien van Liquid Web Software via software.liquidweb.com — vandaar dat een "Liquid Web Software renewal invoice" gewoon een LearnDash-licentieverlenging is (zie §10). Zelfs de supportdocs op learndash.com zijn 302-redirects naar docs.nexcess.com geworden.

---

## 1. Kernrapportage zonder ProPanel: wat je gratis-met-licentie krijgt

De rapportage die in de kernplugin zit is historisch dun geweest; sinds begin 2024 is de oude `ProPanel` (t/m versie 2.2.0) **in de kern opgenomen** als "Core Reports". Wat je daarmee hebt:

- **`Reports Overview` widget** — tellers: aantal studenten, aantal cursussen, openstaande `assignments`, openstaande `essays`; elk klikbaar naar detail.
- **`Activity` widget** — realtime activiteitenfeed: cursus gestart, les/topic/quiz afgerond, cursus voltooid. Admins zien alles; `Group Leaders` alleen hun eigen groepsleden. Let op: de gebeurtenis "Gained Course Access" (inschrijving) zit er **standaard niet in** en moet via een developer-setting aangezet worden.
- **`Report Filters` widget** — filteren op gebruiker, cursus, groep en datum, in elke combinatie, ook op voortgangsstatus (`Not Started` / `In Progress` / `Completed`).
- **`Progress Chart` widget** — verdeling Not Started / In Progress / Completed, plus een uitsplitsing van "in progress" in stappen van 20%.
- **`Reporting` widget** — voortgangsbalken per gebruiker per cursus, met percentage en (bij hover) het aantal afgeronde stappen.
- **CSV-export** — twee rapporten, ook zonder ProPanel: een **`Course Data` rapport** (voortgang per student, huidige les, wel/niet afgerond) en een **`Quiz Data` rapport** (scores, datum, geslaagd ja/nee). De export bevat alleen de op dat moment gefilterde data. Alles is ook als Gutenberg-block of shortcode op een front-end pagina te zetten.

**Bekende dunheid en scherpe randjes**, deels door LearnDash zelf gedocumenteerd:

- Gebruikers die toegang via een groep hebben verschijnen **niet** onder "Not Started" zonder maatwerk — een klassieke bron van "waar is mijn student?"-tickets.
- Speciale tekens in CSV-exports gaan stuk zonder codesnippet (encoding-probleem).
- Object caching op de host kan de export laten mislukken.
- Quiz-statistieken worden alleen vastgelegd als de `Quiz Statistics`-instelling per quiz aanstaat, en **niet met terugwerkende kracht**: data van vóór het aanzetten is niet aan gebruikers te koppelen.
- Alles is admin-gericht; er is geen rolgebonden rapportage buiten admin en `Group Leader`, en geen tijdreeks-analyse ("hoe deed cohort maart het t.o.v. april") in de kern.

*Vergelijk met ons: wij hebben `lesson_progress` en `user_stats` in Postgres maar nog nul rapportage-UI — LearnDash laat zien dat de eerste vier widgets (tellers, activiteitenfeed, filter, voortgangsbalk) al 80% van de beheervraag dekken.*

Bronnen: https://docs.nexcess.com/software/learndash/core-reporting/ · https://docs.nexcess.com/software/learndash/user-data/ · https://ldx.design/learndash-reporting/

## 2. ProPanel 3.0: het betaalde rapportagedashboard

`ProPanel` was jarenlang dé betaalde rapportage-add-on. Begin 2024 is hij gesplitst: het oude ProPanel (≤2.2.0) ging gratis de kern in (§1), en **ProPanel 3.0** werd een herschreven, opnieuw betaalde add-on (prijspeil bij lancering: $99/$199/$399 per jaar naar sitetal; legacy-klanten hielden het oude via de kern). Het is dus niet "bundled in higher tiers" van de hoofdlicentie — de hoofdtiers verschillen alleen in aantal sites, en ProPanel 3.0 koop je los. Wat het toevoegt boven de kern:

- **Dashboards als Gutenberg-blocks**: je bouwt zelf meerdere rapportagedashboards (per cursus, per leerling, per quiz). De plugin maakt automatisch een "ProPanel Dashboard"-pagina en een "Student Quiz Results"-pagina aan.
- **Counter- en omzetblokken**: totale omzet, omzet per cursus met vergelijkende metriek, aantal cursussen, inschrijvingen, openstaande assignments.
- **Inschrijvings- en tijdanalyse**: dagelijkse inschrijvingstrends, tijd besteed per cursus **met detectie van idle time** — iets wat wij met alleen "les afgevinkt" niet weten.
- **Voltooiings- en slagingspercentages**: per cursus, per quiz, pass/fail per leerling; voortgangsgrafieken gestapeld of naast elkaar.
- **Inactieve-leerling-detectie** per tijdvak — de churn-lijst.
- **`Email` tab op de filterwidget**: eerst filteren (groep, cursus, gebruiker, status, datumbereik), dan die selectie direct mailen vanuit het dashboard. Dit is het "email enrolled users"-verhaal: geen aparte mailinglijst, maar een query die je aanschrijft.
- **Export** van vrijwel elk blok naar CSV/Excel, altijd van de gefilterde selectie.
- **`Exclude Settings`**: specifieke cursussen, rollen of gebruikers uit álle rapporten houden (testaccounts, admins).
- **Assignment-/essay-tellers** die naar de nakijkwachtrij linken (de wachtrij zelf is kernfunctionaliteit, §8).

Operationeel detail dat LearnDash zelf publiceert: ProPanel cachet de eerste load, en de **servereisen schalen met gebruikersaantal** — richtlijn 1 core/1 GB RAM tot 1.500 gebruikers, 2 cores/4 GB en 1 GB PHP memory limit bij 7.000+. Een rapportagedashboard is bij hen dus expliciet een capaciteitsvraag.

Bronnen: https://docs.nexcess.com/software/learndash/propanel/ · https://www.learndash.com/propanel-by-learndash/ · https://ldx.design/learndash-propanel/ (review, extern)

## 3. De datalaag: waar de rapportagedata echt woont

Dit is voor ons het leerzaamste deel, omdat LearnDash hier een dubbele boekhouding voert:

- **Bron van waarheid voor voortgang is usermeta**: het geserialiseerde veld `_sfwd-course_progress` in `wp_usermeta` bepaalt daadwerkelijk wat een gebruiker mag/heeft afgerond.
- **Rapportage leest uit een aparte activiteitentabel**: `wp_learndash_user_activity` (kolommen o.a. `activity_id`, `user_id`, `post_id`, `activity_type`, `activity_status`, `activity_started`, `activity_completed`, `activity_updated`, met indexen op de logische kolommen) plus `wp_learndash_user_activity_meta` (key/value per activiteit). Bij elke lesafronding wordt **beide** bijgewerkt.
- **Quizstatistieken staan in wéér een aparte familie tabellen**, geërfd van de opgekochte WP-Pro-Quiz-plugin (`wp_learndash_pro_quiz_*`, o.a. `..._statistic` per beantwoorde vraag) — vandaar dat quizrapportage in LearnDash altijd een beetje "een ander systeem" voelt.

De consequentie zie je terug in het beheerscherm `Data Upgrades` (§9): als usermeta en activiteitentabel uit de pas lopen, moet de beheerder ze handmatig hersynchroniseren. Dubbele boekhouding zonder afdwingbare consistentie = een beheerknop die "repareer mijn data" heet.

*Vergelijk met ons: wij schrijven voortgang atomair in één statement (CTE's in `voortgang-server.ts`) precies om deze klasse drift te vermijden — LearnDash is het waarschuwende voorbeeld.*

**REST API v2** (`/wp-json/ldlms/v2/`): jarenlang beta, door LearnDash inmiddels "production-ready" genoemd (paginering en datumafhandeling gefixt; 5.0 voegde velden als `enrolled_at_gmt` en `date_started_gmt` toe en 5.1.6.1 was een securitypatch op de API). Endpoints die integrators gebruiken: `users/<id>/course-progress` (+ `/steps`), `users/<id>/quiz-progress`, `quiz-statistics` en `quiz-statistics-questions`, `courses/<id>/users`, `groups` met `group-users`/`group-leaders`/`group-courses`, `assignments`, `essays`. Auth: WordPress-cookie + nonce (of application passwords). Sinds 5.0 is er bovendien een officiële **MCP-server** (`@stellarwp/learndash-mcp-server`) die deze data aan AI-agents ontsluit.

Wie er op deze laag bouwt: **WP Fusion** synct inschrijvingen, voortgang en quizscores bidirectioneel met CRM's (tags bij start/afronding, importeren + inschrijven op basis van CRM-tags), **Uncanny Owl** (Tin Canny-rapportage en de Toolkit, §4/§9), en losse rapportageplugins zoals Wisdm Reports die de activiteitentabel uitlezen.

Bronnen: https://developers.learndash.com/rest-api/v2/ · https://docs.nexcess.com/software/learndash/developers/ · https://developers.learndash.com/function/learndash_update_user_activity/ · https://wpfusion.com/documentation/learning-management/learndash/

## 4. SCORM, xAPI en H5P: niet native, wel een gevestigd gat-in-de-markt

LearnDash ondersteunt SCORM en xAPI **niet native**, in twee richtingen: je kunt SCORM-pakketten niet zonder hulp afspelen/tracken, én content die je ín LearnDash bouwt is niet SCORM-compliant te exporteren. De officiële docs verwijzen expliciet naar twee commerciële derden:

- **`Tin Canny Reporting for LearnDash`** (Uncanny Owl) — uploadt SCORM 1.2/2004- en xAPI-modules (Storyline, Captivate, iSpring, H5P), legt elke interactie als xAPI-statement vast in een **eigen LRS binnen WordPress** (geen externe Learning Record Store nodig), en levert vier rapportviews (Course, User, Tin Can, xAPI Quiz) met CSV/XLSX-export. Feitelijk: de complete "SCORM-cloud light" als WordPress-plugin.
- **`GrassBlade xAPI Companion`** — zelfde gat, andere insteek: koppelt aan een externe LRS (GrassBlade LRS heeft directe LearnDash-integratie) en kan een les/topic/quiz automatisch afvinken zodra de externe content een `completed`-statement stuurt.

**H5P**: er is geen directe LearnDash–H5P-integratie. H5P-content in een quizpagina schrijft wel de score naar de LearnDash-quizrapporten, maar per-vraag-responses krijg je alleen via GrassBlade LRS of Tin Canny. Gratis alternatief zonder tracking: "Topic Progression Using Storyline/Captivate for LearnDash".

*Vergelijk met ons: wij hebben geen SCORM-erfenis en willen die ook niet — maar het patroon "elke leerinteractie als append-only statement" is precies ons `payment_attempts`-model toegepast op leren.*

Bronnen: https://docs.nexcess.com/software/learndash/scorm-xapi/ · https://www.uncannyowl.com/knowledge-base/tin-can-report/ · https://www.nextsoftwaresolutions.com/h5p-integration/

## 5. Gebruikersbeheer: inschrijven, voortgang bijwerken, wissen

Alles loopt via het standaard WordPress-gebruikersprofiel, uitgebreid met LearnDash-secties:

- **Inschrijven/uitschrijven**: op het profiel twee kolommen (beschikbare vs. ingeschreven cursussen) met pijltjes; idem voor groepen. Direct effectief bij opslaan. Ingeschreven gebruikers krijgen de WordPress-rol `Subscriber`.
- **`Course Info`-sectie**: per gebruiker de cursussen met inschrijfdatum, status en voortgang; cursuspunten zijn handmatig aanpasbaar; de **inschrijfdatum is handmatig te wijzigen** (relevant omdat cursusverloop daaraan hangt).
- **Voortgang bewerken**: een admin kan per les/topic/quiz een vinkje aan- of uitzetten — handmatig markeren als (in)compleet. Quizdata is per gebruiker te verwijderen om een herkansing mogelijk te maken.
- **Alles wissen**: een optie "Permanently delete data" verwijdert alle LearnDash-data van een gebruiker, onomkeerbaar.
- **GDPR**: LearnDash haakt in op de ingebouwde WordPress-tools `Export Personal Data` en `Erase Personal Data` (menu Tools). Ontwerpkeuze die dat makkelijk maakt: voortgangsdata bevat **geen persoonsgegevens** — alleen user-id's en post-id's van cursussen/lessen/quizzes; e-mail en naam leven uitsluitend in het WordPress-gebruikersrecord.
- **Voortgang resetten is géén kernfunctie.** Voor "reset deze cursus voor deze groep per 1 januari" heb je een add-on nodig (Wooninjas `LearnDash Progress Reset`, Uncanny's `Reset Progress Button`, of code via `learndash_delete_course_progress()`). De Wooninjas-variant doet bulk-reset via CSV, planning (per kwartaal/jaar) en — netjes — een **audit-log per reset** (wie, wanneer, wie geraakt, hoeveel records).

*Vergelijk met ons: "voortgang van een klant handmatig kunnen corrigeren" is bij LearnDash dagelijkse support-realiteit — ons /beheer kan nu alleen vragen modereren, en het eerste supportverzoek "mijn les staat niet op afgerond" hebben wij nog geen knop voor.*

Bronnen: https://docs.nexcess.com/software/learndash/user-management/ · https://www.learndash.com/blog/learndash-gdpr-related-update-now-available/ (redirect, claim bevestigd via zoekresultaten) · https://wooninjas.com/the-complete-guide-to-resetting-student-progress-in-learndash/

## 6. `Group Leader`: gedelegeerd beheer als productfeature

De rol `Group Leader` is LearnDash' antwoord op B2B: een bedrijf koopt een groep zetels en krijgt één persoon die zijn eigen mensen kan beheren zonder ooit wp-admin-rechten op de rest van de site te hebben.

- **Scope**: een Group Leader ziet in alle rapportagewidgets uitsluitend leden van zijn eigen groep(en). Zelfde widgets, gefilterde data.
- **`Group Administration`-pagina**: gebruikerslijst, per gebruiker een `Report`-link (voortgang + groepspunten, met de mogelijkheid extra cursuspunten toe te kennen), en export van de `Course Data`- en `Quiz Data`-CSV's voor de eigen groep.
- **`Email Group`**: knop boven de gebruikerslijst — onderwerp, bericht, verzenden naar de hele groep.
- **Nakijken**: assignments en essays van eigen groepsleden verschijnen in de wachtrij van de Group Leader; die mag ze beoordelen en goedkeuren (§8).
- Er zijn instelbare capability-niveaus (Basic t/m beheer van groepen/gebruikers aanmaken); de details staan in "Group Leader Capabilities".

Bronnen: https://docs.nexcess.com/software/learndash/group-administration/ · https://learndash.com/support/kb/core/uncategorized/group-leader-capabilities/

## 7. Nakijkwachtrijen: `Assignments` en `Essays`

Twee gescheiden wachtrijen, zelfde patroon:

- **Assignments** (bestandsuploads bij een les/topic): verschijnen onder het `Assignments`-menu; een admin of Group Leader moet handmatig goedkeuren, en **de les kan niet worden afgerond zolang de assignment niet is goedgekeurd** — de wachtrij is dus een blokkerende poort in de leerroute, geen vrijblijvend lijstje.
- **Essays** (open quizvragen): LearnDash LMS > Quizzes > tab `Submitted Essays`, alle inzendingen van alle gebruikers, filterbaar op `Graded`/`Not Graded` en op cursus/les/quiz. Nakijken = punten invullen + `Approve`; status springt van Not Graded naar Graded. Feedback gaat via gewone WordPress-comments op de essay-post ("Allow comments" aanzetten).
- ProPanel/kernrapportage toont de tellers "pending assignments/essays" prominent op het overzicht — nakijkachterstand is een eersteklas metriek.
- Wie meer wil (cijferschalen, uitgebreide feedback, front-end nakijken) zit weer bij add-ons: Wooninjas `Assignments Grading`, Uncanny's front-end assignment management.

Bronnen: https://learndash.com/support/kb/core/quizzes/essays/ · https://learndash.com/support/kb/core/assignments/enable-assignments/ · https://www.uncannyowl.com/knowledge-base/front-end-learndash-assignment-management/

## 8. Bulkoperaties, `Data Upgrades` en migratie

- **`Data Upgrades`** (LearnDash LMS > Settings > Advanced): beheerknoppen als "Upgrade User Course Data" en "Upgrade User Quiz Data", die de voortgang uit `wp_usermeta` naar de activiteitentabel (over)kopiëren — nodig voor rapportage en ProPanel na migraties of oude installaties, met een voortgangsbalk die je niet mag onderbreken. Dit scherm bestaat *omdat* de datalaag dubbel is (§3).
- **Cursus-import/export zit in de kern** sinds LearnDash 4.3 (2022): cursussen, lessen, topics, quizzes en instellingen als pakket exporteren en elders importeren. **Gebruikers en hun voortgang zitten daar niet in.**
- **Gebruikersimport is add-on-terrein**: Uncanny `Toolkit Pro` importeert/updatet gebruikers via CSV inclusief cursus- en groepsinschrijving en custom usermeta; de kern kan alleen rapportage-CSV's exporteren (§1), geen gebruikers importeren.
- **Migratiepijn**: voortgang migreren tussen sites is het erkende zere punt — content verhuist makkelijk, maar `_sfwd-course_progress`-usermeta + activiteitentabel + pro-quiz-tabellen consistent overzetten niet; bureaus beschrijven dit steevast als maatwerk (zie bijv. AppPresser's migratieverslag). Wie LearnDash verlaat of samenvoegt, betaalt hier.

Bronnen: https://learndash.com/support/kb/core/settings/advanced-options/ · https://www.uncannyowl.com/knowledge-base/import-learndash-users/ · https://apppresser.com/custom-learndash-migration/

## 9. Onderhoud & ops-realiteit

**Release-cadans en changelogs.** Frequent en gedocumenteerd: publieke release notes (learndash.releasenotes.io en de changelogpagina) met meerdere kern-releases per jaar plus losse add-on-releases (bijv. Notifications 1.6.8 op 1 juni en 1.6.9 op 22 juli 2026). De 4.x-lijn liep tot eind 2025 (4.25.x; daarin werd o.a. de Course Reviews-add-on de kern in getrokken — een patroon: add-ons worden kernfeatures), 5.0 kwam 4 februari 2026, en er verschijnen sindsdien geregeld 5.1.x-patches, waaronder security-releases op de REST API. Changelog-kwaliteit is behoorlijk: per release een lijst fixes/features, al zijn de beschrijvingen soms summier.

**Licentie- en supportmodel.** Jaarlijkse abonnementen; de drie hoofdtiers verschillen **alleen in aantal sites**, niet in features (prijsopgaven van derden lopen uiteen — $199/$399/$799 en $259/$399/$599 circuleren beide; niet uit officiële bron te verifiëren zonder ingelogde prijspagina, dus behandel exacte bedragen als indicatief). Verloopt de licentie, dan blijft de plugin draaien maar stoppen updates en support. Sinds 4.18.0 zit licentiebeheer in de kernplugin zelf. **Na de StellarWP-opheffing (2026)**: facturatie en licentiebeheer via software.liquidweb.com, facturen op naam van "Liquid Web Software" — dus een *Liquid Web Software renewal invoice* is de jaarlijkse verlenging van zo'n plugin-licentie (LearnDash, GiveWP, SolidWP, Kadence of The Events Calendar). Cruciale kleine letter uit de consolidatie: **laat je je abonnement verlopen, dan ben je je legacy-prijs kwijt** en moet je een nieuw Liquid Web Software-plan kopen; voor niet-voortgezette producten is april 2027 genoemd als einde van gegarandeerde security-patches.

**Performance op schaal.** Het bekendste operationele pijnpunt. Gedocumenteerde patronen:

- WordPress' autoload-mechanisme (`wp_options` volledig in het geheugen bij elk request) plus plugins die per-gebruiker-data autoloaden is dé klassieke oorzaak van trage dashboards; tientallen MB's autoload = seconden per request.
- Uncanny Owl publiceerde een casus ("How we made LearnDash 75 times faster") over een grote site: admin-profielpagina's, quizlijsten en quiz-submissions liepen tegen **150+ seconden en tienduizenden queries** aan zodra cursussen richting 100, quizzes boven 1.000 en 100+ gelijktijdige gebruikers gingen; de `Course Info`-sectie loopt per profiel álle inschrijvingen langs.
- Community-ervaring: 75–150 gelijktijdige gebruikers is op gewone hosting al spannend; 340+ vergt duur managed spul. LearnDash' eigen ProPanel-servereisen (§2) bevestigen dat beeld.
- Standaardadvies uit het ecosysteem voor serieuze rapportage: eigen SQL-tabellen met eigen indexen — precies wat LearnDash met de activiteitentabel half heeft gedaan.

**Hosting.** Typisch advies: managed WordPress-hosting met object caching, ruime PHP memory limit en cache-uitzonderingen voor ingelogde lespagina's (LearnDash-pagina's zijn per gebruiker verschillend en dus slecht page-cachebaar). **LearnDash Cloud / StellarSites Learning** is het eigen gehoste antwoord: WordPress + LearnDash voorgeïnstalleerd op Nexcess-infrastructuur, met SSL, dagelijkse backups, security-monitoring, Kadence en Solid Security erbij, en support die zowel hosting als LearnDash kent — gericht op cursusmakers zonder technische wil.

*Vergelijk met ons: dit hele hoofdstuk is het bedrag dat wij níét betalen door serverless + Neon te draaien — maar het licentieverhaal is ook een waarschuwing over wat er gebeurt als je kernfunctionaliteit least van een bedrijf dat van eigenaar en merk wisselt.*

Bronnen: https://learndash.releasenotes.io/ · https://www.learndash.com/changelog/ · https://docs.nexcess.com/software/learndash/learndash-licensing-and-management/ · https://www.liquidweb.com/help-docs/software/learndash/references/billing/ · https://www.wpbeginner.com/news/stellarwp-is-no-more-whats-changing-for-givewp-learndash-solidwp-and-your-site/ · https://www.uncannyowl.com/how-we-made-learndash-75-times-faster/ · https://www.learndash.com/stellarsites-learning-hosting-offer/

## 10. Multisite en staging/dev

- **Multisite**: officieel "Multisite-ready" — installeren en activeren in een netwerk wordt ondersteund, met een eigen mu-plugin (`learndash-multisite.php`) en netwerkbrede licentie-invoer onder Network Admin. Advies is activeren per subsite in plaats van netwerkbreed, en **elke subsite waarop de plugin actief is telt als site voor de licentie**. Cursusdata deelt niet automatisch tussen subsites.
- **Staging/dev telt niet mee**: URL's als `localhost`, `*.dev`, `*.local`, `dev.*` en `staging.*` zijn gewhitelist en tellen niet tegen het sitemaximum — je hebt dus geen hogere tier nodig "omdat je ook een staging hebt". (Deze whitelist-formulering komt deels via Uncanny Owl's FAQ over hetzelfde licentiesysteem; de strekking — staging gratis — wordt door LearnDash-supportantwoorden bevestigd, maar de exacte patroonlijst is niet in de officiële docs teruggevonden. Onzeker detail, zo behandelen.)

Bronnen: https://developers.learndash.com/files/mu-plugins_learndash-multisite-php/ · https://docs.nexcess.com/software/learndash/learndash-licensing-and-management/ · https://www.uncannyowl.com/plugin-frequently-asked-questions/

---

## Wat hieruit voor Beleggingscollege het onthouden waard is

1. **De minimale rapportageset is klein en bekend**: vier tellers, een activiteitenfeed, een filter en een voortgangsbalk-per-gebruiker, alles exporteerbaar naar CSV. Dat is een haalbare eerste versie van een /beheer-rapportagepagina bovenop `lesson_progress` en `user_stats`.
2. **"Filter → mail die selectie"** (ProPanel's Email-tab) is het meest kopieerwaardige beheeridee: inactieve-kopers mailen zonder aparte lijstinfrastructuur.
3. **Dubbele boekhouding wreekt zich**: usermeta als waarheid + activiteitentabel voor rapportage dwong LearnDash tot een permanente "Data Upgrades"-reparatieknop. Eén schrijfpad, rapportage op dezelfde bron — houden zo.
4. **Handmatige voortgangscorrectie is een supportvereiste**, geen luxe: per gebruiker een stap aan/uit kunnen zetten en quizdata kunnen wissen voor een herkansing.
5. **GDPR wordt triviaal** als voortgangsdata alleen id's bevat en persoonsgegevens op één plek leven — dat doen wij al goed; de export/erase-haak ontbreekt nog.

## Bronnen (volledig)

**Officieel (LearnDash / Liquid Web / Nexcess):**
- https://docs.nexcess.com/software/learndash/core-reporting/ — kernrapportage (redirect-doel van learndash.com/support/kb/core/reports/reporting-2/)
- https://docs.nexcess.com/software/learndash/propanel/ — ProPanel
- https://docs.nexcess.com/software/learndash/user-data/ — Course/Quiz Data-exports, quizstatistieken
- https://docs.nexcess.com/software/learndash/user-management/ — inschrijven, voortgang bewerken, data wissen
- https://docs.nexcess.com/software/learndash/scorm-xapi/ — SCORM/xAPI-standpunt
- https://docs.nexcess.com/software/learndash/group-administration/ — Group Administration
- https://learndash.com/support/kb/core/uncategorized/group-leader-capabilities/ — Group Leader-capabilities
- https://learndash.com/support/kb/core/quizzes/essays/ — essays nakijken
- https://learndash.com/support/kb/core/assignments/enable-assignments/ — assignments
- https://learndash.com/support/kb/core/settings/advanced-options/ — Data Upgrades
- https://docs.nexcess.com/software/learndash/developers/ — datalaag, REST API, MCP-server
- https://docs.nexcess.com/software/learndash/learndash-licensing-and-management/ — licenties
- https://www.liquidweb.com/help-docs/software/learndash/references/billing/ — facturatie/verlenging
- https://developers.learndash.com/rest-api/v2/ — REST API v2
- https://learndash.releasenotes.io/ en https://www.learndash.com/changelog/ — releases
- https://www.learndash.com/propanel-by-learndash/ — ProPanel-productpagina
- https://www.learndash.com/stellarsites-learning-hosting-offer/ — gehoste variant

**Ecosysteem/derden (als zodanig wegen):**
- https://www.uncannyowl.com/knowledge-base/tin-can-report/ · https://www.uncannyowl.com/knowledge-base/import-learndash-users/ · https://www.uncannyowl.com/how-we-made-learndash-75-times-faster/ · https://www.uncannyowl.com/plugin-frequently-asked-questions/
- https://wpfusion.com/documentation/learning-management/learndash/
- https://www.nextsoftwaresolutions.com/h5p-integration/ (GrassBlade)
- https://wooninjas.com/the-complete-guide-to-resetting-student-progress-in-learndash/
- https://apppresser.com/custom-learndash-migration/
- https://ldx.design/learndash-propanel/ · https://ldx.design/learndash-reporting/
- https://www.wpbeginner.com/news/stellarwp-is-no-more-whats-changing-for-givewp-learndash-solidwp-and-your-site/ — StellarWP-opheffing
- https://lmscrafter.com/learndash-5-0-review/ — LearnDash 5.0-overzicht (prijzen aldaar indicatief)
