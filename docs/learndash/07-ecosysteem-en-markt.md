# 07 — Ecosysteem, architectuur, prijzen en marktpositie

> Onderzoek van 5 aug 2026. Dit hoofdstuk beschrijft het bedrijf achter LearnDash, wat het kost (en wat jij er al die jaren voor betaalde), het add-on-ecosysteem, de technische architectuur zoals een ontwikkelaar die aantreft, en waar LearnDash staat tegenover concurrenten — inclusief de vraag wanneer zelf bouwen (zoals ons Next.js-platform) de betere keuze is.

Belangrijk om vooraf te weten: **de grond onder dit product is in 2026 flink verschoven.** Op 22 april 2026 hief moederbedrijf Liquid Web het merk StellarWP op en werd learndash.com een doorverwijzing naar liquidweb.com. LearnDash zelf bestaat nog en wordt naar eigen zeggen doorontwikkeld, maar het team is uitgedund en de prijsstructuur is opnieuw op de schop gegaan. Alles hieronder is de stand van augustus 2026; waar bronnen elkaar tegenspreken staat dat erbij.

---

## 1. Het bedrijf: van solo-plugin tot private-equity-consolidatie

### De onafhankelijke jaren (2012–2021)

- LearnDash begon in **2012 als e-learningblog van Justin Ferriman** (samen met Kloe Ferriman); de plugin zelf lanceerde in **2013**. Het bedrijf bleef bootstrapped — geen investeerders — en groeide uit tot de de-facto standaard voor "serieuze" LMS-sites op WordPress, met klanten als universiteiten en Fortune 500-trainingsafdelingen in de marketing.
- Het product heette intern altijd `sfwd-lms` — een overblijfsel van Ferrimans oorspronkelijke bedrijfsnaam (die afkorting kom je tot op vandaag overal in de code tegen, zie §5).

### De verkoop aan Liquid Web (2021)

- Op **20 september 2021** kocht **Liquid Web** (hostingbedrijf, in handen van private-equityfirma Madison Dearborn) LearnDash en hing het onder zijn softwaremerk **StellarWP**, naast The Events Calendar, GiveWP, Kadence WP, SolidWP (iThemes) en Restrict Content Pro. Ferriman bleef kort als adviseur; **Chris Lema** werd general manager. Overnamesom niet bekendgemaakt.
- Wat er na de overname veranderde, is een patroon dat je vaker ziet bij PE-consolidatie:
  1. **Prijsverhogingen** (2022, zie §2) en een complexere prijsstructuur.
  2. **Een cloud-duw**: in 2022 lanceerde LearnDash **LearnDash Cloud**, een gehoste variant op eigen (Nexcess-)infrastructuur — abonnementsomzet in plaats van licentiesomzet (zie §7).
  3. **Add-on-acquisities**: in 2023 nam LearnDash meerdere populaire third-party-add-ons van WisdmLabs over (o.a. `Instructor Role`, `Group Registration`, `Ratings, Reviews & Feedback`) en maakte er first-party "premium add-ons" van.
  4. **Cross-selling** met andere StellarWP-producten (MemberDash — een hernoemde vork van WP Courseware-concurrent Memberships — The Events Calendar, Kadence).

### De StellarWP-afbouw (2025–2026) — de context waarin jij je licentie opzegde

- **Begin 2025**: eerste ontslagronde bij StellarWP (~5% van de organisatie).
- **Oktober/november 2025** (bronnen verschillen over de exacte maand): grote ontslagronde, **~36 mensen, circa 25% van het StellarWP-team**, onder wie de LearnDash-productowner. Rond dezelfde tijd vertrokken sleutel­figuren als Kadence-oprichter Benjamin Ritner en GiveWP-medeoprichter Matt Cromwell; medeoprichter Devin Walker sprak publiekelijk over "profits over people".
- **22 april 2026**: Liquid Web kondigt aan het StellarWP-portfolio (±10 producten) terug te brengen tot **vier kernproducten: Kadence, LearnDash, The Events Calendar en Give**. MemberDash verdwijnt als los product en wordt in LearnDash gevouwen; SolidWP, Iconic en Restrict Content Pro gaan op in Kadence.
- **12 mei 2026**: learndash.com en de andere merkdomeinen gaan doorverwijzen naar liquidweb.com; het klantportaal verhuist naar software.liquidweb.com. De uitrol verliep rommelig — kapotte logins voor lifetime-licentiehouders, verdwenen documentatie en changelogs, SEO-waarde van jaren weggegooid — en kreeg forse kritiek uit de WordPress-gemeenschap.
- **Toezeggingen**: Liquid Web zegt "actief te blijven investeren" in de vier kernproducten en garandeert **kritieke beveiligingspatches tot ten minste april 2027**. Een gepubliceerde roadmap per product of add-on is er medio 2026 niet.

**Wat dit voor jouw licentie betekent:** je 1-site-licentie (gekocht juni 2023, opgezegd 5 aug 2026, actief tot 9 juni 2027) valt precies binnen de patch-garantieperiode. Bestaande licenties blijven geldig en behouden hun prijs zolang ze doorlopen; wie opzegt en later terug wil, komt in de nieuwe (duurdere, feature-gated) structuur terecht — zie §2. De Liquid Web/Nexcess-verlenging die daarnaast liep is de hostingtak van hetzelfde moederbedrijf; dat is een apart contract, geen onderdeel van de plugin-licentie.

Bronnen: [PR-bericht overname](https://www.liquidweb.com/press-releases/liquid-web-acquires-learndash/), [The WP Minute-interview Ferriman/Lema](https://thewpminute.com/justin-ferriman-chris-lema-on-liquid-web-acquiring-learndash/), [MemberPress: "The StellarWP Collapse, Explained"](https://memberpress.com/blog/what-happened-to-learndash-stellarwp-collapse/), [WisdmLabs-briefing over de wind-down](https://wisdmlabs.com/blog/learndash-news-after-the-stellarwp-wind-down-a-calm-fact-first-briefing-on-what-changed-and-what-did-not/), [The Repository over de rommelige uitrol](https://www.therepository.email/liquid-web-retires-stellarwp-in-botched-rollout-drawing-backlash-from-customers-and-community) (403 bij ophalen; samenvatting via zoekresultaten).

---

## 2. Prijzen en edities

LearnDash heeft sinds 2021 **drie generaties prijsstructuur** gehad. Jouw licentie zit in de middelste.

### Generatie 1 — "legacy" (tot 12 juli 2022)

| Plan | Prijs/jaar | Sites | ProPanel |
|---|---|---|---|
| Basic | $159 | 1 | nee |
| Plus | $189 | 10 | **inbegrepen** |
| Pro | $329 | 25 | **inbegrepen** |

Na protest tegen de verhoging beloofde LearnDash op 21 november 2022: **legacy-prijzen blijven voor altijd gelden zolang het abonnement actief blijft**.

### Generatie 2 — per aantal sites (juli 2022 – ±2026); **dit is wat jij kocht**

| Plan | Prijs/jaar | Opmerking |
|---|---|---|
| 1 site | **$199** | jouw tier; met btw kwam dat op ~$240/jaar |
| 10 sites | $399 | |
| Onbeperkt | $799 | verving het oude 25-sites-plan |

- Alle tiers hadden **dezelfde features**; je betaalde alleen voor het aantal sites. Geen transactiekosten, onbeperkte cursisten en cursussen.
- **ProPanel zat er níét bij** en kostte los extra — bronnen in 2025/2026 noemen $139–$199/jaar, dus reken op die orde van grootte. De overige premium add-ons (Notes, Gradebook, Groups Plus …) kostten elk ± $49/jaar.
- 15 dagen niet-goed-geld-terug; verlenging jaarlijks.

Ter perspectief: drie jaar licentie (2023–2026) ≈ $720 excl. btw, voor een plugin waar uiteindelijk nooit een site mee gebouwd is. Dat is overigens géén uitzonderlijk verhaal — het "shelfware"-percentage bij jaarlicentie-plugins is hoog; LearnDash rekent er in zijn verlengingsmodel op.

### Generatie 3 — feature-gated tiers (2026, na de consolidatie)

De actuele pagina op liquidweb.com/software/learndash (aug 2026) toont geen site-aantallen meer maar **functionaliteitstrappen**:

| Plan | Prijs/jaar | Wat erbij komt |
|---|---|---|
| Essentials | **$259** | course builder, quizzen, memberships/abonnementen (MemberDash zit er nu in), Stripe/PayPal, video progression, Focus Mode, certificaten, notificaties |
| Pro | **$399** | + AI Course Outline & Quiz Builder, **ProPanel** (rapportage), weighted grading, report cards, student notes, groepen/cohorten |
| Elite | **$599** | + multi-instructor, `Instructor Role`, frontend course creation, ratings & reviews, group course management |

- Let op de beweging: wat in generatie 2 een los betaalde add-on was (ProPanel, Instructor Role, Notes, Ratings & Reviews) is nu **de reden om een duurdere tier te nemen**. Het instapniveau werd $60/jaar duurder, maar kreeg wel MemberDash-functionaliteit cadeau.
- 48-uurs demo (alleen e-mail, geen creditcard); "cancel any time"; geen kosten per cursist.
- Bestaande klanten behouden hun oude prijs zolang het abonnement doorloopt; bij verlenging na de omschakeling moet je je oude featureset zelf mappen op een nieuwe tier.

Bronnen: [ldx.design over legacy pricing](https://ldx.design/learndash-legacy-pricing/), [ldx.design prijsuitleg](https://ldx.design/learndash-pricing-explained/), [liquidweb.com/software/learndash](https://www.liquidweb.com/software/learndash/#pricing), [FatLab prijsanalyse](https://fatlabwebsupport.com/blog/website-support/learndash-pricing/), [SchoolMaker prijsvergelijking](https://www.schoolmaker.com/blog/learndash-pricing).

### De verborgen kosten (waarom "$199/jaar" nooit het hele verhaal was)

Onafhankelijke analyses rekenen consequent voor dat de licentie het kleinste deel van de totale kosten is: fatsoenlijke WordPress-hosting ($240–$2.400/jaar), een thema ($50–$200), premium add-ons ($49–$199/jaar per stuk), implementatie door een bureau ($2.000–$15.000+ in jaar één) en doorlopend onderhoud/updates ($1.200–$6.000/jaar). Dat onderhoudsbedrag is geen bangmakerij: een LearnDash-site is al snel WordPress + LearnDash + WooCommerce + 10–20 plugins die elk maandelijks updaten en elkaar kunnen breken. Bron: [FatLab](https://fatlabwebsupport.com/blog/website-support/learndash-pricing/), [WisdmLabs](https://wisdmlabs.com/blog/learndash-course-building-real-pricing/).

---

## 3. Officiële add-ons: wat first-party is

De licentie ontgrendelt een add-onmenu (`LearnDash LMS → Add-ons`). Grofweg drie categorieën (stand aug 2026; onder generatie 3 verschuift "premium" naar "hogere tier"):

**Gratis bij de licentie (integraties en uitbreidingen):**

- `Notifications` — e-mailnotificaties op triggers (inschrijving, voltooiing, quizresultaat, "niet ingelogd sinds X dagen").
- `Course Grid` — responsieve cursusoverzichten (shortcode/blok).
- `Certificate Builder` — certificaten bouwen in Gutenberg.
- `Zapier` — triggers naar 5.000+ externe apps.
- E-commerce: `WooCommerce`, `Easy Digital Downloads`, `Stripe` (directe integratie), `2Checkout`, `SamCart`, `ThriveCart`.
- Memberships: `MemberDash`, `MemberPress`, `Paid Memberships Pro`, `Restrict Content Pro`.
- Overig: `Gravity Forms`, `The Events Calendar`, `Event Espresso`, `bbPress`, `Elementor`, `Multilingual` (WPML/Polylang-compat), `Achievements` (badges/punten), `Migration` (import uit andere LMS'en), `Integrity` (hotlink/kopieerbescherming).

**Premium add-ons (los betaald onder generatie 2, tier-gebonden onder generatie 3):**

- `ProPanel` — rapportagedashboard (zie hoofdstuk 06).
- `Instructor Role` — multi-instructeur met eigen dashboard (ex-WisdmLabs).
- `Group Registration` / `Groups Plus` / `Groups Management` — B2B-verkoop van groepszitplaatsen (ex-WisdmLabs).
- `Notes` — aantekeningen per les voor cursisten.
- `Gradebook` — cijferadministratie over cursussen heen.
- `Ratings, Reviews & Feedback` — cursusreviews (ex-WisdmLabs).

Opvallend voor ons: **veel van wat wij als kernfunctionaliteit zien (notificatiemails, reviews, rapportage) is bij LearnDash een add-on** — deels historisch gegroeid, deels bewust upsell-ontwerp. De les: een kaal LMS-hart met een add-onlaag houdt de kern klein, maar verschuift integratie- en onderhoudslast naar de klant.

Bronnen: [Add-ons-overzicht (support-kb)](https://learndash.com/support/kb/add-ons/uncategorized/add-ons-overview/), [learndash.com/add-ons](https://www.learndash.com/add-ons/), [ProPanel-kb](https://learndash.com/support/kb/add-ons/propanel/propanel/).

---

## 4. Het third-party-ecosysteem — de echte gracht

LearnDash's grootste concurrentievoordeel is niet de plugin zelf maar het feit dat **tien jaar lang iedereen eromheen heeft gebouwd**. Wie een randgeval heeft, vindt vrijwel altijd een bestaande plugin in plaats van maatwerk te moeten schrijven. De belangrijkste spelers:

- **Uncanny Owl** — het grootste satellietbedrijf, 40.000+ sites:
  - `Uncanny Toolkit for LearnDash` (gratis + Pro): tientallen kleine kwaliteit-van-leven-modules — autocomplete van lessen, cursusdashboards, certificaatbeheer, inlog-redirects. Feitelijk "de ontbrekende instellingen" van LearnDash.
  - `Uncanny Automator`: no-code-automatisering ("als cursist X voltooit → doe Y in plugin/app Z"). Begonnen als LearnDash-tool, inmiddels een generiek WordPress-automatiseringsplatform — het ecosysteem ontgroeide zijn moederschip.
  - `Tin Canny Reporting`: voegt **SCORM/xAPI**-ondersteuning en diepere rapportage toe — essentieel voor corporate training, en iets wat LearnDash zelf nooit inbouwde.
  - `Uncanny Codes`, CEU-credits (accreditatiepunten) en meer.
- **WP Fusion** — synchroniseert LearnDash-gedrag (inschrijving, voortgang, quizscores) met 100+ CRM's en e-mailplatforms via tags. De standaardkeuze zodra marketing-automation serieus wordt.
- **BuddyBoss** — community-platform (thema + plugin) met diepe LearnDash-integratie: social learning, groepen gekoppeld aan cursussen, een app-optie. Veel "cursus + community"-sites zijn feitelijk BuddyBoss+LearnDash.
- **GamiPress** — punten, badges, levels bovenop LearnDash-triggers (zie hoofdstuk 05).
- **WisdmLabs** — jarenlang de grootste add-onbouwer; hun populairste plugins werden in 2023 door LearnDash zelf overgenomen (zie §3), maar het bureau bestaat nog als LearnDash-specialist.
- **Design Upgrades for LearnDash** (Dave Warfel, ldx.design) — CSS/design-laag over de nogal gedateerde standaardstyling; Warfels site is ook de beste onafhankelijke documentatiebron.
- **The Events Calendar / Event Espresso** — live-sessies en cohorten aan cursussen hangen.

**Thema's:** LearnDash werkt met elk WordPress-thema (het rendert via shortcodes/blokken in de content-loop). In de praktijk domineren drie smaken: **BuddyBoss** (community), **Astra** en **Kadence** (beide met kant-en-klare LearnDash-startertemplates). Sinds Kadence en LearnDash onder hetzelfde dak zitten, wordt die combinatie actief gepusht.

**Waarom dit de gracht is:** een concurrent kan de feature-lijst van LearnDash kopiëren, maar niet de duizenden bestaande integratiepaden, tutorials, bureaus, Facebook-groepen en Stack Overflow-antwoorden. Tegelijk is het een wederzijdse afhankelijkheid gebleken: de onrust van 2025–2026 raakt direct de bedrijven die van LearnDash-add-ons leven, en hun vertrouwen bepaalt mede of het platform relevant blijft.

Bronnen: [uncannyowl.com](https://www.uncannyowl.com/), [Uncanny Toolkit op wordpress.org](https://wordpress.org/plugins/uncanny-learndash-toolkit/), [LearnDash-integratiepagina Uncanny Owl](https://www.learndash.com/integrations/uncanny-owl/), [wbcomdesigns over de add-on-stack](https://wbcomdesigns.com/learndash-addon-stack-when-youve-outgrown-it).

---

## 5. Architectuur voor ontwikkelaars: hoe het onder de motorkap zit

Er bestaat officiële developer-documentatie op **developers.learndash.com** (functies, hooks, klassen, REST-API — automatisch gegenereerd uit de codebase). Dat is meer dan de meeste WordPress-plugins bieden. De architectuur in het kort:

### Datamodel: CPT's + usermeta + eigen tabellen

- Alle content is **custom post types**: `sfwd-courses`, `sfwd-lessons`, `sfwd-topic`, `sfwd-quiz`, `sfwd-question`, `sfwd-certificates`, plus `groups`. (Het `sfwd-`-prefix is de fossiele bedrijfsnaam uit 2012.) Instellingen per post staan in grote geserialiseerde meta-arrays — werkbaar, maar lastig te queryen.
- **Voortgang leeft op twee plekken**: samenvattingen per cursus in `wp_usermeta`, en een append-only gebeurtenissenlog in de eigen tabel **`wp_learndash_user_activity`** (+ `_meta`), met `activity_type` course/lesson/topic/quiz/access. Die eigen tabel is waarom LearnDash beter schaalt dan concurrenten die alles in postmeta stoppen: een site met 10.000 cursisten draait op degelijke hosting prima.
- De quiz-engine gebruikt daarnaast **eigen `wpProQuiz`-tabellen** — zie "legacy" hieronder.

*Vergelijk met ons:* dit is structureel hetzelfde patroon als onze `lesson_progress` + `user_stats` in Postgres — samenvatting plus feitenlog. Zij kwamen er na jaren postmeta-pijn op uit; wij zijn er direct mee begonnen.

### Aanpasbaarheid

- **Template-overrides à la WooCommerce**: bestanden uit `wp-content/plugins/sfwd-lms/themes/ld30/templates/` kopieer je naar `wp-content/themes/<jouw-thema>/learndash/ld30/templates/` en pas je aan. Krachtig, maar elke plugin-update kan de brontemplates wijzigen en jouw kopieën verouderen — het klassieke override-onderhoudsprobleem.
- **Honderden hooks/filters**: o.a. `learndash_course_completed`, `learndash_lesson_completed`, `learndash_quiz_completed`, `learndash_update_user_activity`, `learndash_new_user_registered_to_course`. Vrijwel elk gedrag is af te vangen; dit is waar het hele ecosysteem uit §4 op draait.
- **Shortcodes én Gutenberg-blokken** voor alle frontend-onderdelen (cursuslijsten, voortgangsbalken, login, certificaatlink …); de blokken zijn grotendeels wrappers om de oudere shortcodes.
- **REST API v2** onder `/wp-json/ldlms/v2/`: CRUD op courses/lessons/topics/quizzes/groups, plus gebruikersinschrijvingen en voortgang (`/users/{id}/course-progress`, quiz-attempts). Sinds 4.0 volwassen genoeg voor headless frontends en mobiele apps — al bouwt bijna niemand LearnDash headless, omdat je dan precies het deel weggooit (de geïntegreerde WordPress-frontend) waarvoor je het kocht.

### De legacy-schuld

- **De quiz-engine is een ingebakken fork van WP Pro Quiz** (2013), letterlijk aanwezig in `includes/lib/wp-pro-quiz/`, met eigen klassen (`WpProQuiz_Controller_Quiz`), eigen hooks (`wp_pro_quiz_completed_quiz`) en eigen databasetabellen naast de rest van het datamodel. LearnDash heeft er in tien jaar functionaliteit bovenop gebouwd (acht vraagtypen, vragenbanken — zie hoofdstuk 02) maar de kern nooit herschreven. Gevolg: twee datamodellen, "legacy"-functies en -sanitizers die tot in 4.x aangroeien, en quiz-maatwerk dat aanvoelt als archeologie.
- **Settings-sprawl**: instellingen verspreid over globale opties, per-cursus-meta, per-les-meta en quiz-eigen tabellen; deels geserialiseerd. De beruchte leercurve van LearnDash ("waar stond dat vinkje ook alweer?") is hier een direct gevolg van.
- Het onderliggende verhaal is herkenbaar: **succesvolle software wordt oud in de vorm van haar eerste afkortingen.** `sfwd-`-prefixes, een gevorkte quizbibliotheek en drie generaties template-systemen (legacy/ld30) zijn de prijs van tien jaar achterwaartse compatibiliteit met duizenden productiesites.

Bronnen: [developers.learndash.com](https://developers.learndash.com/) ([REST v2](https://developers.learndash.com/rest-api/v2/), [quiz-package](https://developers.learndash.com/package/quiz/), [wp-pro-quiz-bestanden](https://developers.learndash.com/files/includes_lib_wp-pro-quiz_wp-pro-quiz-php/)), [architectuurgids rajaamanullah.com](https://rajaamanullah.com/learndash-extension-development-architecture/).

---

## 6. Marktpositie en concurrenten

### WordPress-plugins (zelf hosten, eigenaarschap)

| | Sterk in | Zwak in |
|---|---|---|
| **LearnDash** | quizdiepte, schaal (eigen tabellen), ecosysteemvolwassenheid, enterprise/compliance | gedateerde UX, alles-is-een-add-on, onzekere koers sinds 2026 |
| **LifterLMS** | memberships en betaalplannen ingebouwd, engagement | postmeta-datamodel schaalt slechter (±2.000 cursisten, daarna optimalisatie nodig) |
| **Tutor LMS** | moderne interface, sterke gratis versie, frontend course builder, marktplaats/multi-instructor | minder diep quiz- en rapportagewerk, jonger ecosysteem |
| **Sensei LMS** | naadloos voor wie al vol op WooCommerce/Automattic zit | smalste featureset van de vier |
| **LearnPress** | gratis instap | kwaliteit en support wisselvallig; add-on-afhankelijk voor alles |

### Gehoste platforms (huren, gemak)

**Teachable, Thinkific, Kajabi, Podia** nemen hosting, updates, betalingen en (deels) marketing uit handen. De ruil is bekend: maandprijzen die meegroeien ($39–$399/mnd), transactiekosten op lagere tiers (Teachable rekende 7,5% op Starter; Gumroad 10% — LearnDash adverteert nadrukkelijk met 0%), beperkte aanpasbaarheid, en je cursisten- en cursusdata bij een derde partij. LearnDash's kernpitch tegen deze groep was altijd: **eigenaarschap** — jouw site, jouw data, geen kosten per cursist, en op termijn goedkoper. Die pitch verzwakte in 2026 niet inhoudelijk, maar wel reputationeel: "eigenaarschap" klinkt anders wanneer de leverancier zelf zijn merk, team en documentatie ontmantelt.

### Waar LearnDash echt goed in bleef

1. **Quizdiepte** — acht vraagtypen, vragenbanken, essay-workflow; geen WordPress-concurrent komt in de buurt (hoofdstuk 02).
2. **Schaal** — het eigen activity-tabelmodel (§5).
3. **B2B/groepen** — Groups, Group Leaders, seat-verkoop; plus SCORM/xAPI via Tin Canny.
4. **Het ecosysteem** (§4) — nog steeds de gracht, al is die nu ook zijn grootste risicofactor.

Bronnen: [oddjar-vergelijking 2025](https://oddjar.com/wordpress-lms-plugins-2025-learndash-lifterlms-tutor-comparison/), [FatLab-alternatieven](https://fatlabwebsupport.com/blog/website-support/learndash-alternatives/), [rajaamanullah-vergelijking](https://rajaamanullah.com/learndash-vs-tutor-lms-vs-lifterlms/), [SchoolMaker](https://www.schoolmaker.com/blog/learndash-pricing).

---

## 7. LearnDash Cloud vs de plugin

- **LearnDash Cloud** (gelanceerd 2022) = de plugin + beheerde WordPress-hosting (Nexcess-infrastructuur) + domein + SSL + dagelijkse back-ups + vooraf ingericht startertemplate + AI-schrijfhulpjes, vanaf **$29/mnd (jaarlijks betaald; $35/mnd bij maandbetaling)**.
- In 2026 hernoemd naar **StellarSites Learning** met tiers Essential $29 / Plus $55 / Ultimate $79 per maand (Essential: 15 GB opslag, 2 TB bandbreedte, 10 PHP-workers met autoscaling). De hernoeming viel midden in de merkchaos van §1; verwacht dat deze naam opnieuw kan wijzigen.
- De ruil tegenover de plugin: je koopt onderhoudsrust, maar levert precies de flexibiliteit in (vrije pluginkeuze, eigen hosting) die de reden was om níét voor Teachable te kiezen. Reviews positioneren Cloud dan ook als instapproduct: beginnen op Cloud, verhuizen naar zelf-gehost zodra je maatwerk nodig hebt.
- Rekensom: Cloud Essential ($348/jaar) ≈ plugin-licentie ($199–$259) + budget-hosting. Het breekpunt zit niet in geld maar in wie de updates draait.

Bronnen: [WP-Tonic-review LearnDash Cloud](https://www.wp-tonic.com/learndash-cloud-an-honest-review-for-2025/), [FatLab](https://fatlabwebsupport.com/blog/website-support/learndash-pricing/), [SchoolMaker](https://www.schoolmaker.com/blog/learndash-pricing).

---

## 8. Voor wie is LearnDash — en wanneer wint zelf bouwen

Eerlijke balans, want beide kanten hebben een echt verhaal.

**LearnDash (of een vergelijkbare plugin) is de juiste keuze wanneer:**

- de bouwer **geen ontwikkelaar** is of geen ontwikkelcapaciteit heeft — je krijgt voor ~$259/jaar functionaliteit waar wij maanden aan gebouwd hebben (quiz-engine, certificaten, drip, groepen, rapportage);
- de site al op WordPress draait en het LMS één onderdeel is van een groter geheel (blog, membership, community);
- er **corporate/compliance-eisen** zijn (SCORM/xAPI, CEU's, seat-verkoop aan bedrijven) — dat is via het ecosysteem oplosbaar en zelf bouwen is daar erg duur;
- snelheid naar een werkend product belangrijker is dan de laatste 20% ervaring.

**Zelf bouwen (zoals ons Next.js-platform) wint wanneer:**

- de **leerervaring zelf het product is** en je die tot in detail wilt bezitten — interactieve lestools zoals onze optierekenaars zijn in LearnDash niet te bouwen zonder er feitelijk een eigen applicatie in te hangen;
- je de **onderhoudslast** van WordPress + 15 plugins die elkaar maandelijks kunnen breken niet wilt dragen — onze stack heeft exact gepinde versies en CI die de samenvoeging test; een LearnDash-site heeft "hopen dat de updates elkaar verdragen";
- **prestaties en bundelhygiëne** ertoe doen (onze server-only contentmodule versus een plugin die alles in de PHP-render mengt);
- je niet afhankelijk wilt zijn van de koers van één leverancier — de gebeurtenissen van 2025–2026 (§1) zijn daar het schoolvoorbeeld van: het product bleef werken, maar team, merk, docs en roadmap bleken in achttien maanden vervangbaar te zijn voor de eigenaar.

De ironie voor dit dossier: Jason betaalde drie jaar voor optie A en bouwde uiteindelijk optie B. Dat was achteraf de juiste volgorde van gebeurtenissen in de verkeerde volgorde van beslissingen — de licentie had in 2024 opgezegd kunnen worden. Maar het onderzoek in deze kennisbank haalt alsnog waarde uit die $720: tien jaar productbeslissingen van de marktleider als gratis specificatie voor wat wij nog missen (zie hoofdstuk 08).

---

## Bronnen

**Officieel (LearnDash / Liquid Web):**

- https://www.liquidweb.com/software/learndash/#pricing — actuele prijzen en tiers (aug 2026)
- https://www.liquidweb.com/press-releases/liquid-web-acquires-learndash/ — overnamebericht 2021
- https://learndash.com/support/kb/add-ons/uncategorized/add-ons-overview/ — add-onoverzicht (support-kb)
- https://www.learndash.com/add-ons/ — add-onpagina
- https://developers.learndash.com/ — developer-docs (REST v2: /rest-api/v2/, quiz-package: /package/quiz/)
- https://www.learndash.com/integrations/uncanny-owl/ — Uncanny Owl-integratiepagina

**Onafhankelijk / industrie:**

- https://memberpress.com/blog/what-happened-to-learndash-stellarwp-collapse/ — StellarWP-afbouw, tijdlijn en ontslagen (let op: concurrent, maar feitelijk gedetailleerd)
- https://wisdmlabs.com/blog/learndash-news-after-the-stellarwp-wind-down-a-calm-fact-first-briefing-on-what-changed-and-what-did-not/ — nuchtere klantbriefing over de wind-down
- https://www.therepository.email/liquid-web-retires-stellarwp-in-botched-rollout-drawing-backlash-from-customers-and-community — kritiek op de uitrol (paywall/403; via zoekresultaten)
- https://thewpminute.com/justin-ferriman-chris-lema-on-liquid-web-acquiring-learndash/ — interview rond de overname
- https://ldx.design/learndash-legacy-pricing/ en https://ldx.design/learndash-pricing-explained/ — prijshistorie (Dave Warfel)
- https://fatlabwebsupport.com/blog/website-support/learndash-pricing/ — verborgen kosten en Cloud-prijzen
- https://www.schoolmaker.com/blog/learndash-pricing — prijsvergelijking 2026
- https://www.wp-tonic.com/learndash-cloud-an-honest-review-for-2025/ — LearnDash Cloud-review
- https://rajaamanullah.com/learndash-extension-development-architecture/ — technische architectuurgids
- https://oddjar.com/wordpress-lms-plugins-2025-learndash-lifterlms-tutor-comparison/ en https://fatlabwebsupport.com/blog/website-support/learndash-alternatives/ — concurrentievergelijkingen
- https://www.uncannyowl.com/ en https://wordpress.org/plugins/uncanny-learndash-toolkit/ — Uncanny Owl-ecosysteem
- https://wbcomdesigns.com/learndash-addon-stack-when-youve-outgrown-it — add-on-stack-analyse

**Onzekerheden:** exacte maand van de grote ontslagronde (okt. vs nov. 2025 — bronnen verschillen), actuele losse ProPanel-prijs ($139–$199/jaar afhankelijk van bron en moment), en of de naam "StellarSites Learning" standhoudt. De cijfers van vóór 2022 komen uit secundaire bronnen (ldx.design) omdat de originele LearnDash-blogposts sinds mei 2026 deels offline zijn.
