# 23 — Vijf LMS'en naast elkaar: wat de open source-concurrentie laat zien

> Geschreven 5 aug 2026, na hoofdstuk 19 t/m 22. Vier open source-concurrenten zijn met dezelfde acht vragen gelezen als LearnDash: **Tutor LMS 4.0.4**, **LearnPress 4.2.7**, **Sensei LMS 4.26.2** (Automattic) en **LifterLMS 10.1.0**. Alle vier gratis van wordpress.org, alle vier GPL — daarom mag hier wél uit de code geciteerd worden, anders dan bij LearnDash.
>
> Waarom dit onderzoek er is: hoofdstuk 7 vergeleek de concurrentie alleen op basis van recensiesites. Dat is de zwakste bron in de hele kennisbank, en het bleek ook fout te zitten (§5 hieronder). Belangrijker: LearnDash is een codebase uit 2013. De vraag was of een modernere generatie de problemen die wíj hebben anders oplost.
>
> **Het antwoord is ja, en op één punt met vier tegen één.**

## 1. De vergelijking in één tabel

| | **LearnDash** | **Tutor LMS** | **LearnPress** | **Sensei** | **LifterLMS** |
|---|---|---|---|---|---|
| **Voortgangsopslag** | usermeta-blob **én** activity-tabel, zonder transactie → drift, met een "repareer mijn data"-knop | geen spiegel, elke keer herberekend | één tabel `learnpress_user_items`, voortgang via `COUNT` | `wp_comments` (!); de tabelbackend is sinds aug 2023 "experimenteel" en staat uit | tien eigen tabellen |
| **Eén toegangspoort?** | ja, sinds 5.0 opgeruimd | **nee, drie** — en ze verschillen in de "openbare cursus"-uitzondering | ja, geldt ook in de REST-controllers | ja, plus een providerstemming | ja, maar beslist op querystatus i.p.v. data |
| **Beschermings­mechanisme** | `the_content`-filter | `template_include`-wissel | poort in render **én** REST | templatewissel + `post_password_required` | templatewissel + `the_content` |
| **Uit te zetten met een filter?** | ja | ja (één filter) | ja | ja (zes) | ja (vier) |
| **Juiste antwoorden in de pagina?** | nee, weggestript | **ja, onvoorwaardelijk** | nee | nee | nee |
| **Nakijken server-side?** | ja | ja | ja | ja | ja |
| **Stuurt de client een score?** | **ja** → daarom nonce-ondertekening | nee | nee | nee | nee |
| **Intrekken bij terugbetaling** | alleen PayPal-keten | uitgecommentarieerd; opt-in vinkje | geen `refunded`-status; annuleren wist de leergeschiedenis | geen betaalcode | **alle negatieve statussen via één pad** |
| **Bedrag/valuta geverifieerd** | ja, in de PayPal-keten | nee | nee | n.v.t. | prijs uit het plan; gateways niet in de gratis kern |
| **Tests in de zip** | nee | nee | nee | **ja** | nee |

## 2. De belangrijkste uitkomst: vier tegen één over quizscores

**Geen van de vier concurrenten accepteert een score van de client.** Ze sturen alleen welke antwoorden gegeven zijn; de server rekent punten, percentage en slagen/zakken zelf uit.

Dat zet LearnDash in een ander licht. Hun `p_nonce`/`a_nonce`-ondertekening — die ik in hoofdstuk 11 als de vondst van het onderzoek presenteerde — is geen briljante oplossing maar **een pleister op een architectuurkeuze die de rest niet maakte**. Zij kijken per antwoord na via AJAX en moeten het tussenresultaat daarom ondertekenen. Wie de score gewoon nooit uit handen geeft, heeft niets te ondertekenen.

En dat verandert wat wij zouden moeten bouwen. Hoofdstuk 18 punt 2 beschreef de LearnDash-route. **De eenvoudiger route is de juiste**: de client stuurt de gekozen indexen, de server bepaalt álles. Onze vragen staan al server-side achter `server-only`, dus dit is bij ons goedkoper dan bij wie dan ook.

**Maar let op de valstrik die drie van de vier alsnog inbouwden.** Server-side nakijken is niet genoeg als een ándere invoer uit de client komt:

- **Tutor** somt `total_marks` over vraag-id's uit een **verborgen formulierveld** — stuur één vraag-id mee en je scoort 100%.
- **Sensei** neemt `questions_asked[]` ongevalideerd aan (de docblock beweert van niet) en klemt niet op 100%.
- **LearnPress** laat `time_spend` uit de client komen terwijl de tijdslimiet eraan hangt.

Wij hebben exact de spiegelfout: onze `total` komt veilig uit de catalogus, onze `correct` uit de client. **De regel die uit alle vijf volgt: numerator, noemer én de vragenverzameling moeten alle drie uit de eigen catalogus komen.** Eén klantgestuurde invoer is genoeg om de rest waardeloos te maken.

## 3. Wat de concurrentie beter doet dan LearnDash — en dan wij

**LifterLMS koppelt intrekking aan de réden van inschrijving.** Alle negatieve orderstatussen (terugbetaald, geannuleerd, verlopen, mislukt, plan afgelopen) lopen via één pad naar uitschrijven, en de intrekking is gebonden aan waaróm iemand toegang kreeg. Dat is precies wat hoofdstuk 18 als punt 1 voorstelt voor College+, en het zit bij hen in de **gratis kern**.

**Sensei doet hetzelfde probleem nog een slag eleganter.** Inschrijving is daar een *stemming*: meerdere providers beantwoorden onafhankelijk "is deze gebruiker ingeschreven?", het resultaat is een OR, gecachet met een versiehash die zichzelf ongeldig maakt zodra een provider verandert, met een auditjournaal ernaast. Wie ooit meerdere toegangsbronnen heeft (losse aankoop, abonnement, handmatig, actie), heeft hier het volwassen ontwerp: **niet één kolom "waarom", maar een set bronnen die elk hun eigen vraag beantwoorden.**

Twee onafhankelijke implementaties van hetzelfde idee, in twee verschillende gratis producten. Dat maakt punt 1 uit hoofdstuk 18 geen suggestie meer maar de gevestigde standaard — en het onderstreept hoe uitzonderlijk het is dat wij één rij hebben die niet weet waar hij vandaan komt.

**Voortgang zonder spiegel is de norm.** Tutor herberekent altijd, LearnPress telt uit één tabel, LifterLMS heeft eigen tabellen. Alleen LearnDash houdt dubbele boekhouding — en heeft daarom als enige een "Data Upgrades"-reparatieknop. Onze keuze (server als waarheid, afgeleide waarden berekenen) zit in de goede helft.

## 4. Waar wij het beter doen dan alle vijf

**De beschermingslaag is bij álle vijf met een filter uit te zetten.** LearnDash via `learndash_template_preprocess_filter` (en hun eigen Elementor-add-on doet het), Tutor via `tutor_lms_should_template_override`, Sensei via zes filters plus één site-instelling die alles publiek maakt, LifterLMS via vier — waaronder één die LifterLMS zélf op `__return_false` zet. LearnPress geeft het filter zelfs het beslisobject mee.

Bij ons kán dat niet. `import "server-only"` is een **bouwfout**, geen haak: er is geen runtime-moment waarop iets beleefd kan vragen of de grens even opzij mag. Dat is niet omdat wij slimmer zijn, maar omdat het framework een grens biedt die WordPress niet heeft — en het is het sterkste dat uit deze hele vergelijking naar voren komt.

**Transacties.** Sensei heeft er nul in de hele plugin; LearnDash schrijft usermeta en activity los van elkaar. Onze atomaire CTE's in `verwerkLes()` en `verwerkBetaald()` zijn in dit gezelschap een luxe.

## 5. Correctie op hoofdstuk 7

Hoofdstuk 7 nam van recensiesites over dat LifterLMS "een postmeta-datamodel" heeft dat "boven ±2.000 cursisten" optimalisatie vraagt. **Dat klopt niet op het mechanisme**: LifterLMS gebruikt tien eigen tabellen. De naam `wp_lifterlms_user_postmeta` heeft de secundaire bronnen vermoedelijk misleid.

De strekking klopt om ándere redenen (enkelkolomse indexen onder driekolomse queries; één voortgangsbalk is één query per les), en het echte getal staat in hun eigen code: **500**. Daarboven throttelt LifterLMS de herberekening naar eens per vier uur en verwerkt het in de achtergrond.

Bredere les, en het is dezelfde als in hoofdstuk 18: **hoofdstuk 7 is het enige hoofdstuk dat volledig op secundaire bronnen leunt, en het is nu twee keer op een feitelijke fout betrapt.** Behandel het als marktcontext, niet als techniek.

## 6. Wat dit verandert aan hoofdstuk 18

| Punt in h. 18 | Wat er verandert |
|---|---|
| **1. `bron` op `entitlements`** | **Sterker.** Twee gratis concurrenten hebben dit; Sensei's providerstemming is het ontwerp om na te volgen als er ooit meer dan twee bronnen komen. Blijft de eerste aanbeveling. |
| **2. Serverzijdige quizscore** | **Herzien en goedkoper.** Niet LearnDash' ondertekening nabouwen, maar zoals de andere vier: de client stuurt alleen keuzes, de server bepaalt alles — inclusief de noemer en de vragenverzameling. |
| **28. Geen tweede toegangscontrole** | **Sterker.** Alle vijf hebben een uitschakelbare beschermingslaag; onze bouwtijdgrens is uniek in dit veld. |
| Alle overige punten | Ongewijzigd. Geen van de vier gaf aanleiding een aanbeveling te schrappen of toe te voegen. |

## 7. Zou een van deze vier een betere keuze zijn geweest dan LearnDash?

Eerlijke afweging, want die vraag hangt onder dit hele dossier.

- **Voor het platform dat we uiteindelijk gebouwd hebben: nee, geen van vijf.** Onze interactieve lestools (de optierekenaars) zijn in geen enkele van deze plugins te bouwen zonder er feitelijk een eigen applicatie in te hangen, en alle vijf slepen de WordPress-onderhoudslast mee.
- **Als er in 2023 tóch een WordPress-LMS was gekozen, was LifterLMS technisch de betere geweest** — betaal- en toegangsmodel netjes in de gratis kern, één intrekkingspad, de schoonste quiz van het veld. LearnDash' voorsprong zit in quizdiepte en het ecosysteem, niet in het fundament.
- **Tutor LMS is de modernste codebase** (PSR-4, DI-container, echte foreign keys) en de zwakste op toegangscontrole — een goede herinnering dat moderne architectuur en correcte autorisatie los van elkaar staan.
- **Sensei is het meest WordPress-idiomatisch** en betaalt daar de prijs voor: voortgang in `wp_comments`, met een betere backend die drie jaar na dato nog "experimenteel" heet.

De conclusie van hoofdstuk 7 blijft dus overeind, maar met een nuance: de keuze tussen deze plugins had minder uitgemaakt dan de keuze om ze allemaal níét te gebruiken.

## Onzekerheden

- De gratis LifterLMS-kern bevat geen echte betaalgateway (alleen handmatige betaling), dus of hun Stripe-add-on bedrag en valuta hercontroleert is **niet vastgesteld**.
- Alle vier zijn gelezen, niet gedraaid. Geen van de bevindingen is op een draaiende installatie getoetst.
- De agents corrigeerden onderweg zes eigen bevindingen (drie bij Sensei, twee bij LearnPress, één bij LifterLMS); die staan in de onzekerhedensecties van de betreffende hoofdstukken. Bevindingen die niet zijn ingetrokken, zijn niet daarmee ook onafhankelijk geverifieerd — anders dan bij hoofdstuk 17, waar dat expliciet wél is gebeurd.
