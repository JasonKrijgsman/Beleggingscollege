# 03. Waar cursusverkopers echt op vastlopen

> Geschreven 5 aug 2026. Dit document mijnt **supportmateriaal** in plaats van verkoopmateriaal: kennisbanken, WordPress.org-supportfora, en de blogs van bureaus die kapotte LMS-sites repareren voor hun brood. De gedachte erachter: een kennisbank is een eerlijker document dan een featurelijst, want hij bestaat alleen uit dingen waar klanten daadwerkelijk over gemaild hebben. Een FAQ-pagina is een lijst met fouten die vaak genoeg voorkwamen om op te schrijven.
>
> **Het technische onderzoek staat al elders.** `docs/learndash/18-wat-we-ermee-doen.md` weegt de code, de add-ons en de vier open source-concurrenten; hoofdstuk 19 t/m 23 doen Tutor LMS, LearnPress, Sensei en LifterLMS. Dat wordt hier niet herhaald. Dit gaat over de **operationele** kant: wat kost het om een cursuswinkel te *runnen* zodra er klanten zijn?
>
> Wij hebben nul verkopen. Alles hieronder is dus voorspelling, geen ervaring. De waarde zit in de rijen met "komt bij de eerste klant".

---

## Hoe ik heb gewogen

Twee soorten bewijs, en ik houd ze uit elkaar omdat ze verschillend zwaar zijn.

**(a) Terugkerend en gedocumenteerd.** Een leverancier schrijft geen aparte kennisbankpagina voor een probleem dat één keer voorkwam. Als LearnDash een FAQ heeft met de titel *"What steps can I take if a lesson or topic is not marked as complete?"* dan is dat een geaggregeerd supportvolume, geen incident.[^ld-faq-notcomplete] Hetzelfde geldt voor documentatiediepte: LifterLMS heeft **271 FAQ-artikelen** alleen voor de kern, **28** troubleshootinggidsen en **14** pagina's met alleen maar bekende conflicten.[^lifter-docs] Dat is geen documentatie, dat is een litteken.

**(b) Losse klachten.** Eén forumdraadje. Interessant als illustratie, waardeloos als bewijs van frequentie. Ik label die expliciet.

Voor de **volumemeting** heb ik de documentatie-omvang per onderwerp als proxy gebruikt. Bij LifterLMS is de verdeling over de add-ons veelzeggend: Stripe 22 artikelen, WooCommerce 18, PayPal 14. Dat zijn **54 pagina's over niets anders dan het geldpad**, tegenover 9 over engagements.[^lifter-docs] Betalen kost meer support dan lesgeven.

Een tweede meting die ik meeneem: de **verse supportonderwerpen** op WordPress.org voor Tutor LMS, LearnPress en Sensei. Dat is ruwe, ongefilterde vraag, geschreven door de klant zelf, niet door marketing.[^wp-tutor][^wp-learnpress][^wp-sensei]

Waar het bewijs dun is, zeg ik dat. Vooral bij percentages: de refund- en supporturen-cijfers die rondgaan komen bijna allemaal uit blogs van partijen die iets verkopen dat het probleem oplost.

---

## De ranglijst

Gerangschikt op **(pijn voor een eenpitter) × (kans dat wij het raken)**. Niet op hoe vaak het bij WordPress voorkomt: de helft van hun ellende is plugin-ellende, en die hebben wij niet.

---

### 1. "Ik heb betaald en ik zie niets"

**Bewijs: (a), het sterkst gedocumenteerde probleem in het hele ecosysteem.**

Dit staat overal. Het bureau WooNinjas, dat elf jaar en naar eigen zeggen 6.000 klanten aan LearnDash-support achter zich heeft, zet het bovenaan: *"A learner who cannot enroll, access a purchased course, or cannot advance past a completed lesson will not wait."*[^wooninjas] Solbase zet betaalproblemen in de top 5 met precies de formulering *"Payments appear in WooCommerce but course access is not granted automatically."*[^solbase] Op WordPress.org staan losse draden over precies dit: gebruikers die na een PayPal-betaling niet ingeschreven worden, en bundels vanaf vijf cursussen die het niet doen.[^wp-notenrolling][^wp-noaccess]

Het meest tekenende bewijs is niet een klacht maar een **feature**: LearnDash heeft een *retroactive course access tool* gebouwd die alle voltooide WooCommerce-orders naloopt om alsnog toegang te verlenen.[^ld-woo] Je bouwt zo'n ding niet preventief. Je bouwt het nadat je het honderd keer met de hand hebt gedaan.

De oorzaak bij hen is bijna altijd hetzelfde: **twee systemen die met elkaar gekoppeld moeten worden** (een WooCommerce-product en een LearnDash-cursus), waarbij de koppeling stil verkeerd kan staan.

**Wij:** die oorzaak is weggeontworpen. Er zijn geen twee systemen. `POST /api/checkout` eist een sessie (401 zonder), leest de prijs uit onze eigen catalogus, en de webhook zet de betaalpoging op `paid` én verleent het entitlement in één statement. Er valt geen koppeling verkeerd te zetten, want er is er geen.

**Maar wat overblijft raakt ons wél, en meteen bij de eerste klant:** als de webhook niet aankomt of faalt, is er **geen knop om toegang met de hand te verlenen**. `/beheer` leest `entitlements` en toont ze, maar muteert niets. Ons enige herstelpad is een handmatige SQL-insert op productie, door Jason, 's avonds, op gevoel. En de hele keten heeft nog nooit met een live sleutel gedraaid: de test van 2 aug liep over het oude `purchases`-model, en de winkel staat sinds 5 aug dicht (`docs/openstaand.md` §6b).

> **Label: grotendeels weggeontworpen, maar het herstelpad ontbreekt en dat komt bij de eerste klant.**

---

### 2. Toegang en voortgang met de hand moeten repareren

**Bewijs: (a), zichtbaar in de dagelijkse forumstroom van álle vier de concurrenten.**

Dit is de stille grootverbruiker van tijd. Kijk naar wat mensen letterlijk vragen:

- LearnPress: *"Add new courses to existing user orders"*, *"How to Extend Access to an Expired Course"*, *"The course list of enrolled users View"*[^wp-learnpress]
- Sensei: *"Migrate users from Course A to Course B"*[^wp-sensei]
- Tutor LMS: *"No permission for user details as admin"*, *"Student completion report export"*[^wp-tutor]
- LearnDash: een heel bureau-artikel getiteld *"2 Ways to Manually Enroll Users into a LearnDash Course"*[^ldx-manual]

Het patroon: **de werkelijkheid wijkt af van wat de database zegt, en iemand moet dat met de hand rechtzetten.** Bij LearnDash is dat zo normaal dat de FAQ *"What steps can I take if a lesson or topic is not marked as complete?"* een eigen pagina is.[^ld-faq-notcomplete]

**Wij:** dit hebben we nog niet, en we gaan het krijgen. `/beheer` is bewust read-only. Het eerste bericht "les 4 staat niet op afgerond" kunnen we vandaag niet beantwoorden, en het eerste "ik heb per ongeluk de verkeerde cursus gekocht" evenmin. Dit stond al als punt 5 in `docs/learndash/18-wat-we-ermee-doen.md`; het forumbewijs maakt het harder, niet zachter. De vier fora bevestigen ook de **vorm** die het moet krijgen: één stap aan/uit per gebruiker, en één recht verlenen/intrekken. Geen rapportagelaag.

> **Label: komt bij de eerste klant. Van alles op deze lijst het goedkoopst om nu te bouwen.**

---

### 3. Voortgang die verdwijnt

**Bewijs: (a) voor het bestaan van het probleem, maar hun oorzaak is niet de onze.**

Bij WordPress komt dit vrijwel altijd door **caching**. LearnDash zegt het zelf: hun pagina's zijn per gebruiker dynamisch, dus een pagecache serveert de voortgang van iemand anders.[^ld-cache-forum] De genezing staat in elke troubleshootinggids: sluit alle LMS-pagina's uit van je cache.[^ld-troubleshooting] Er is zelfs een tweede variant, waarbij het autosave-interval van de quiz te kort staat (5 seconden) en de schrijfactie half aankomt onder belasting.[^ld-known] Het bureau SaffireTech noemt daarnaast expliciet het synchroniseren van voortgang **over apparaten heen** als zwak punt, naast de constatering dat LearnDash niet veel meer bijhoudt dan inschrijvingsstatus.[^saffire]

**Wij:** de WordPress-oorzaak bestaat hier niet. Betaalde lespagina's worden expliciet niet vooraf gebouwd (`generateStaticParams` levert alleen de gratis cursus), en er zit geen pagecache per gebruiker tussen.

**Wij hebben wél een eigen variant, en die is echt.** Uitgelogd is localStorage leidend. Wie de gratis cursus doorwerkt zonder in te loggen en daarna op een andere browser of een telefoon terugkomt, ziet nul voortgang, en er is geen scherm dat uitlegt waarom. De snapshotimport repareert dat alleen op hetzelfde apparaat waar de sleutel `beleggingscollege-voortgang-v1` nog staat. Dat is precies de klacht uit de operator-literatuur over afhaken: *"if you miss a week or two, the brain automatically discounts the work already done"*.[^digitaldefynd] Voortgang zichtbaar verliezen is erger dan hem nooit gehad hebben.

Daar komt onze eigen bekende zwakte bovenop: de quizantwoorden reizen nooit mee, dus wie de badge "foutloos" verdient op apparaat A en inlogt op apparaat B, heeft geen antwoordgeschiedenis om iets aan terug te geven.

> **Label: hun oorzaak weggeontworpen, onze eigen variant komt bij de eerste klant die van laptop naar telefoon wisselt.**

---

### 4. E-mail die niet aankomt

**Bewijs: (a), het best gedocumenteerde probleem dat er is, met een oorzaak die wij niet delen.**

Vier verschillende SMTP-plugins hebben elk een eigen artikel met exact dezelfde titel: *"LearnDash Not Sending Email Notifications"*.[^wpmailsmtp] Solbase zet het op nummer 1 van de vijf.[^solbase] LearnDash heeft er een FAQ voor (*"How can I make email notifications send on time?"*)[^ld-faq] én een aparte waarschuwing bij de Notifications add-on dat je een eigen server-cron nodig hebt.[^ld-known] LearnPress: *"No emails from LearnPress"*. Sensei: *"Email messages are creating problems and they cannot be changed"*.[^wp-learnpress][^wp-sensei]

De oorzaak is bij hen structureel en altijd dezelfde: WordPress verstuurt via `wp_mail()` over de PHP-mailer van een gedeelde host, zonder authenticatie, vanaf het admin-adres. Geen SPF, geen DKIM, dus geen reputatie.[^wpmailsmtp]

**Wij:** die oorzaak bestaat hier niet. `src/lib/mail.ts` gaat via echte SMTP (Migadu, poort 465), SPF, alle drie de DKIM-records en DMARC staan er, en DMARC staat sinds 5 aug weer op `p=reject`. Op de as waar het hele WordPress-ecosysteem op struikelt, staan wij goed.

**Wat er overblijft is subtieler en typisch voor ons.** We hebben bewust bezorglogboeken en bounce-webhooks opgegeven door voor Migadu te kiezen in plaats van Resend (`docs/e-mail-versturen.md`). En `verstuurMail()` gooit nooit, met goede reden: hij draait in de webhook nadat de betaling al op `paid` staat, en een 500 daar betekent tien herhalingen van Mollie. Gevolg: **een orderbevestiging die niet aankomt, is voor ons onzichtbaar.** `confirmationSentAt` bewijst dat wij hem hebben aangeboden, niet dat hij is bezorgd. Bij een verplichte bevestiging (art. 6:230v BW, en de afstandsverklaring van het herroepingsrecht zit erin) is dat het verschil tussen "geleverd" en "denken dat je geleverd hebt".

> **Label: hun oorzaak weggeontworpen, ons blinde vlek is bezorging. Merkbaar bij de eerste klant die belt met "ik heb niets gekregen".**

---

### 5. Terugbetalingen en chargebacks

**Bewijs: (a) voor het mechanisme, (b) en zeer dun voor de percentages.**

Twee lagen, en ze verschillen sterk in bewijskracht.

**Het mechanisme is hard.** Bij LearnDash met 2Checkout: *"a refund does not automatically remove course access; if you want to revoke access after refunding, you need to remove the student's enrollment manually."*[^wooninjas-2co] Pas met LearnDash WooCommerce 2.0.0 kwam er een instelling om toegang aan de orderstatus te koppelen.[^ld-woo-200] Met andere woorden: jarenlang gaf geld terug bij hen géén toegang terug. Dat is exact het gat dat wij op 4 aug hebben gedicht (PR #42 en #44).

**De percentages zijn zacht.** Er circuleren cijfers van 8% refunds voor "goed opgezette" launches tot 18 tot 28% van alle omzet, met chargebacks 41% omhoog jaar-op-jaar.[^communipass] Die komen uit een marketingblog van een communityplatform, zonder methode, zonder steekproef. **Niet gebruiken om iets op te baseren.** Het enige cijfer met een echte meting eronder dat ik vond, is Sift: gemiddeld chargebackpercentage 0,26% in Q3 2025, over alle e-commerce.[^sift] Dat is een orde van grootte lager dan de blogs suggereren, en het is nog steeds niet ons segment.

**Wij hebben hier een structureel Nederlands voordeel dat de Amerikaanse literatuur niet kent.** Bij iDEAL is een betaling definitief: de bank kan hem niet terugdraaien, alleen de verkoper kan terugbetalen.[^mollie-ideal][^klacht] De hele chargeback-industrie draait op kaartschema's.[^klacht] Onze iDEAL-omzet is dus per constructie chargebackvrij; de blootstelling zit alleen in kaarten, PayPal en Apple Pay. Dat is een reëel voordeel bij een Nederlands publiek, en het is geen ontwerpkeuze van ons maar geluk van de markt.

Wat er wél voor ons ligt: de verwerking is gebouwd, maar **nog nooit één keer echt doorlopen**. Een terugbetaling via het Mollie-dashboard, controleren dat het entitlement op non-actief springt, controleren dat de les weer op slot gaat. Dat kost een half uur en het is de goedkoopste verzekering op deze lijst.

> **Label: weggeontworpen (en beter dan LearnDash), maar ongetest. iDEAL neemt het grootste deel van de chargebackpijn weg.**

---

### 6. Herroepingsrecht: het Nederlandse geval dat de bronnen niet kennen

**Bewijs: juridisch, niet uit supportfora. Nederlandse en EU-specifiek.**

De hele Angelsaksische refund-literatuur gaat over je eigen refundbeleid: wat jíj belooft. In Nederland is dat het kleinste deel. Bij digitale inhoud heeft de consument 14 dagen bedenktijd vanaf het sluiten van de overeenkomst, en die vervalt **alleen** als je twee dingen apart hebt vastgelegd: uitdrukkelijke voorafgaande toestemming om direct te leveren, én een verklaring dat hij daarmee zijn herroepingsrecht verliest.[^ictrecht][^thuiswinkel] Ontbreekt de informatieplicht, dan blijft het recht staan, en dan is een cursus 14 dagen (of in het slechtste geval veel langer) gratis uit te proberen.

**Wij:** dit is netjes gebouwd. De checkout weigert met een 400 als `herroepingAkkoord` niet true is, de tekstversie wordt vastgelegd (`HERROEPING_TEKST_VERSIE`), en de orderbevestiging herhaalt beide punten expliciet ("2. Je erkenning dat je daarmee je herroepingsrecht verliest"). Dat is beter dan wat de meeste WordPress-winkels doen, waar dit met een los vinkje of helemaal niet geregeld is.

**Het gat zit niet in de code maar in het papier:** `/herroepingsrecht`, `/voorwaarden` en `/privacy` zijn nog concepten op noindex, en er heeft geen jurist naar gekeken. De waiver is zo sterk als de tekst waarnaar hij verwijst.

> **Label: weggeontworpen in de code, open in de juridische controle. Raakt ons pas als iemand het aanvecht, maar dan meteen volledig.**

---

### 7. Facturen en btw

**Bewijs: (a) voor de vraag, maar uit een aangrenzende markt.**

In het WordPress-ecosysteem is dit een hele plugincategorie op zich (WooCommerce EU VAT Compliance, YITH EU VAT/OSS, Flexible Invoices), en de kern van wat ze doen is: btw-nummer valideren bij VIES, verleggen bij B2B, en een genummerde factuur genereren.[^woo-vat] Dat er een markt voor is, betekent dat webshops die zonder beginnen er tegenaan lopen.

Voor ons is het concreter: een online cursus is een digitale dienst en valt onder 21%.[^maatos] Een deel van ons publiek is zzp'er, en die vraagt om een factuur waarmee hij de voorbelasting kan aftrekken. Een factuur moet doorlopend genummerd zijn, anders heeft de klant geen recht op aftrek.[^ondernemersplein]

**Wij:** half af, en de goede helft is de moeilijke helft. `order_counters` geeft een doorlopend ordernummer per jaar, het btw-identificatienummer staat in de voettekst en in de bevestiging, en de 21%-regel klopt omdat er geen KOR is. Wat ontbreekt: **een document dat er als factuur uitziet en dat de klant kan downloaden**, en het adres van de klant erop. Dat is precies wat een zakelijke koper gaat vragen, in een mail, aan Jason, met de hand.

> **Label: komt bij de eerste zakelijke klant. Geen structureel risico, wel handwerk per klant tot het er is.**

---

### 8. Certificaten

**Bewijs: (a), terugkerend bij drie van de vier concurrenten.**

LearnPress: *"Certificate is blank"*, *"Using actual students names in certificates"*. Sensei: *"Problems with Sensei LMS Certificate"*.[^wp-learnpress][^wp-sensei] LearnDash heeft het zelfs in de bekende-problemen-lijst: SiteGrounds beeldoptimalisatie vervormt certificaatafbeeldingen of maakt er zwarte vlakken van.[^ld-known] De rode draad: certificaten zijn **PDF-generatie met lettertypen en afbeeldingen**, en dat is een categorie bugs die zich alleen bij de klant manifesteert.

**Wij:** die hele categorie is weg. Ons certificaat is een printbare HTML-pagina, geen PDF-pijplijn, geen lettertype-embedding, geen beeldoptimalisatie die ertussen komt.

**Eén concreet gat blijft:** het certificaat noemt `beleggingscollege.nl` in de code, en dat domein geeft nu 404. Elk certificaat dat vandaag gedrukt wordt, verwijst naar een dode pagina. Dat is geen supportlast maar reputatieschade op papier dat mensen bewaren.

> **Label: bugcategorie weggeontworpen; de dode .nl-verwijzing is er nu al en raakt de eerste klant die iets afrondt.**

---

### 9. Inloggen en wachtwoorden

**Bewijs: (a) in het brede e-learning-supportmateriaal, (b) specifiek per LMS.**

Wachtwoordherstel is het klassieke nummer één in elke studentensupportinbox, en de Uncanny-analyse uit `docs/learndash/15-...` liet al zien dat LearnDash's grootste gratis module een inlogformulier van 4.140 regels met 66 instellingen is. In het aangrenzende materiaal (het aanpalende probleem bij verkoop) komt de variant terug die voor een webshop duurder is: **de klant heeft betaald met een ander e-mailadres dan waarmee hij inlogt.**[^cengage] Bij Tutor LMS is dat sinds de introductie van guest checkout expliciet mogelijk geworden.

**Wij:** allebei weggeontworpen, en dat is een van de sterkste keuzes in dit project. Google OAuth betekent geen wachtwoorden, dus geen herstel, geen CAPTCHA, geen 2FA-support. En de checkout eist een sessie voordat er een betaallink wordt gemaakt, dus de betaling hangt per constructie aan het ingelogde account. Een e-mailmismatch kán niet ontstaan.

**De restpijn is klein maar scherp:** wie de toegang tot zijn Google-account kwijtraakt, heeft bij ons geen enkel alternatief inlogpad en dus geen toegang tot een betaalde cursus. Er is één weg in. Bij een handjevol klanten is dat een acceptabele ruil; het is wel goed om te weten dat het bestaat, want de oplossing is opnieuw handwerk in `/beheer` (zie punt 2).

> **Label: weggeontworpen, met één restrisico dat pas bij volume gaat tellen.**

---

### 10. Cursisten die niet afmaken

**Bewijs: (a) voor het verschijnsel, met harde academische cijfers; (b) voor de verklaringen.**

De cijfers zijn stevig aan de bovenkant: van grootschalige open cursussen maakt minder dan 15% het af, en voor MOOC's specifiek lag de voltooiing op 3,13% in 2017-18 met een dalende trend.[^harvard] Voor betaalde cursussen wordt 40 tot 80% uitval genoemd.[^harvard] Let op de vergelijkbaarheid: gratis MOOC's zijn niet hetzelfde product als een betaalde cursus van €49, en de bronnen die dat samenvoegen doen dat te makkelijk.

De **verklaringen** komen van operators en zijn zachter, maar ze wijzen consistent dezelfde kant op: onduidelijke verwachtingen, te veel materiaal, geen praktische toepassing, sociale isolatie, en het effect dat wie een week mist zijn eerdere werk mentaal afschrijft.[^heights-completion][^digitaldefynd]

Interessanter voor ons zijn de **refundtriggers** die operators noemen, want die staan dichter bij het geld: *"this was not what I expected"*, *"I cannot reach the creator"* (stilte wordt gelezen als lage waarde), en klanten die het materiaal vergelijken met wat ze gratis uit een AI-chat halen.[^communipass] Dat laatste is voor een beleggingscursus in 2026 geen randgeval.

**Wij:** de gamification-laag (XP, levels, streaks, badges) is precies op dit probleem gericht en dat is een bewuste sterkte. Twee dingen ontbreken die de literatuur direct benoemt: **"ga verder waar je was"** (tegen het wegvallen na een onderbreking) en **de voltooiingsmail** (het enige moment van trots dat we nu weggooien). Allebei staan ze al in doc 18 als punt 3 en 4; de dropout-literatuur is een tweede, onafhankelijke reden om ze te doen.

Eén punt waar we bewust tegen de literatuur in gaan: *"I cannot reach the creator"* is een genoemde refundtrigger, en onze lesvragen zijn expliciet redactioneel zonder beloofde termijn. Dat is een juiste keuze voor een eenpitter (zie `docs/menselijke-elementen.md`), maar het is een keuze mét een prijs, en die prijs wordt in refundverzoeken betaald. Goed om dat te weten in plaats van het weg te redeneren.

> **Label: hebben wij, gedeeltelijk geadresseerd. Twee goedkope reparaties liggen klaar.**

---

### 11. Spam- en botregistraties

**Bewijs: (a), bij twee van de vier concurrenten in de verse forumstroom.**

LearnPress: *"Hundreds of Fake LP Registrations"*. Tutor LMS: *"Inscription spams/bots site formation"*.[^wp-learnpress][^wp-tutor] Een open registratieformulier op een WordPress-site is doelwit, en de rommel komt in de gebruikerstabel, in de rapportage en in de mail.

**Wij:** Google OAuth legt de drempel hoog genoeg dat dit geen thema wordt bij onze omvang. Het restoppervlak is de nieuwsbrief (IP-limiet) en de lesvragen (limiet op gebruikers-id), en beide draaien op `src/lib/ratelimiet.ts`, dat in-memory is en dus per instance werkt. Dat is bewust een snelheidsdrempel en geen garantie. Bij ons huidige volume is dat proportioneel.

> **Label: grotendeels weggeontworpen. Het bekende gat in de ratelimiet is bewust en verantwoord bij dit volume.**

---

### 12. Een update die de winkel breekt

**Bewijs: (a), spectaculair zichtbaar bij Tutor LMS.**

De actuele supportlijst van Tutor LMS is grotendeels één versie-incident: *"Critical Error updating Tutor LMS Free from 3.9.14 to 4.0.1"*, *"Quiz does not load after upgrade to Tutor LMS 4.0.2"*, *"Course Builder Error after latest update"*, *"tutor lms 4.0.1 bugs"*.[^wp-tutor] LearnPress heeft *"LearnPress 4.4.0 database/schema issue"* en een Spaanstalige melding dat versie 4.3.5 de hele database sloopte.[^wp-learnpress] Sensei: *"Question Post Type Returning 404 After Update"*.[^wp-sensei]

De les is niet "WordPress is slecht". De les is: **een schemawijziging die uitrolt zonder dat de bijbehorende migratie eerst gedraaid is, is de duurste storing die een cursuswinkel kent**, want hij raakt iedereen tegelijk en meestal het geldpad.

**Wij:** wij hebben geen pluginecosysteem, wel een CI-poort, en dat dekt het meeste. Maar we hebben **exact dezelfde faalvorm** met een andere oorzaak, en die staat in onze eigen `CLAUDE.md`: een merge naar `main` deployt naar productie en draait **geen** migratie. Op 4 aug ging dat bijna mis (PR #42 was live terwijl de partiële unique index nog niet bestond). Dat is precies het Tutor-incident, alleen met ons als leverancier én als klant.

> **Label: hebben wij, met een bekende en gedocumenteerde discipline als enige verdediging.**

---

### 13. Zien wie er vastloopt

**Bewijs: (a), maar met een tegenargument uit ons eigen onderzoek.**

Tutor LMS: *"Student completion report export"*, *"No permission for user details as admin"*, *"Registration date column"*.[^wp-tutor] LifterLMS heeft 25 artikelen alleen over rapportage.[^lifter-docs] De vraag is echt.

**Wij:** `/beheer` toont betaalpogingen en toegang, en verder niets. Doc 18 punt 11 zei het al en ik onderschrijf het: met onze aantallen is een SQL-query in een terminal goedkoper dan een dashboard. Bouwen zodra het aantal cursisten je verrast.

> **Label: hebben wij, bewust uitgesteld.**

---

### 14. De supportlast zelf

**Bewijs: (b), en het bewijs is slecht.**

Hier moet ik eerlijk zijn: de cijfers die rondgaan over supporturen bij cursusmakers komen zonder uitzondering uit contentmarketing van virtual assistants en supportbureaus. "Vier uur per dag aan operationele taken" en "responstijd onder vier uur verhoogt de voltooiing van 34% naar 51%" komen allebei uit partijen die support verkopen, zonder methode of steekproef.[^customerhub] **Niet citeren, niet plannen op.**

Wat wél overeind blijft is kwalitatief en unaniem: de manier om supportlast te verlagen is niet sneller antwoorden maar **vragen voorkomen**, door vóór de koop te beantwoorden wat mensen daarna gaan vragen.[^heights-service] En de structurele observatie van WooNinjas dat *"the most common LearnDash issues are not crashes. They are configuration problems that look like bugs"*, wat betekent: het meeste supportvolume ontstaat in de installatie, niet in het gebruik.[^wooninjas]

**Wij:** wij zijn onze eigen installatie, dus die hele categorie bestaat hier niet. Onze supportlast wordt bepaald door punt 1, 2, 3, 4 en 7 van deze lijst, en die zijn allemaal concreet.

> **Label: goeddeels weggeontworpen omdat wij geen product zijn dat iemand anders moet configureren.**

---

## Waar het bewijs dun is

Om dit document eerlijk te houden, expliciet:

| Claim | Waarom dun |
|---|---|
| Refundpercentages van 8% tot 28% | Marketingblogs van platforms en communities. Geen methode, geen steekproef, geen segment. Het enige gemeten cijfer dat ik vond (Sift, 0,26% chargebacks Q3 2025) is een orde van grootte lager en gaat over alle e-commerce.[^sift][^communipass] |
| "Vier uur per dag support" | Contentmarketing van een VA-bureau.[^customerhub] |
| "Responstijd < 4 uur verhoogt voltooiing van 34% naar 51%" | Contentmarketing van een supportplatform. Geen bron, geen n.[^customerhub] |
| Voltooiingspercentages van MOOC's toegepast op betaalde cursussen | De academische cijfers (< 15%, 3,13%) zijn solide, maar gaan over gratis open cursussen. Overzetten naar een betaald product van €49 is een sprong die de secundaire bronnen te makkelijk maken.[^harvard] |
| Facturen als supportlast | Afgeleid uit het bestaan van een pluginmarkt, niet uit gemeten klachten. De richting klopt, de omvang is onbekend.[^woo-vat] |
| Refundtriggers ("kan de maker niet bereiken", "staat ook in een AI-chat") | Plausibel en herkenbaar, maar één bron, en die verkoopt communitysoftware.[^communipass] |

En één ding dat ik **niet** heb kunnen vinden en dat wel de moeite waard zou zijn: openbaar supportmateriaal van een Nederlandse cursusverkoper. Alles hierboven is Angelsaksisch behalve het herroepingsrecht en het btw-stuk. Het risico dat we daardoor iets missen dat specifiek is voor de Nederlandse markt, is reëel.

---

## De kaart: elke pijn afgezet tegen ons

| # | Pijn | Hebben wij | Weggeontworpen | Komt bij de eerste klant |
|---|---|:---:|:---:|:---:|
| 1 | "Ik heb betaald en zie niets" | | ✅ oorzaak (één systeem, login vóór checkout) | ⚠️ **geen herstelknop; keten nooit live getest** |
| 2 | Toegang/voortgang met de hand repareren | | | ⚠️ **ja, `/beheer` is read-only** |
| 3 | Voortgang die verdwijnt | | ✅ hun oorzaak (geen pagecache per gebruiker) | ⚠️ **onze variant: uitgelogde localStorage, ander apparaat** |
| 4 | E-mail komt niet aan | | ✅ oorzaak (echte SMTP, SPF/DKIM/DMARC) | ⚠️ **geen bezorgbewijs, geen bounces** |
| 5 | Refunds en chargebacks | | ✅ intrekken bij refund/chargeback; iDEAL kent geen chargeback | ⚠️ nooit één keer doorlopen |
| 6 | Herroepingsrecht | | ✅ waiver + versie vastgelegd, checkout weigert zonder | ⚠️ juridische teksten nog concept |
| 7 | Facturen en btw | | half (ordernummer, btw-nr, 21%) | ⚠️ **geen downloadbare factuur** |
| 8 | Certificaten kapot | | ✅ HTML i.p.v. PDF-pijplijn | ⚠️ certificaat noemt de dode `.nl` |
| 9 | Inloggen/wachtwoorden/e-mailmismatch | | ✅ Google OAuth + login vóór checkout | klein: geen tweede inlogpad |
| 10 | Cursisten maken niet af | ⚠️ ja | deels (gamification) | "ga verder waar je was" + voltooiingsmail ontbreken |
| 11 | Spam-/botregistraties | | ✅ Google OAuth | nee (ratelimiet bewust zacht) |
| 12 | Update breekt de winkel | ⚠️ ja (merge deployt, migratie niet) | | nee, maar één slechte dag is genoeg |
| 13 | Zien wie vastloopt | ⚠️ ja | | bewust uitgesteld |
| 14 | Supportlast per klant | | ✅ wij zijn geen product dat een klant configureert | volgt uit 1, 2, 3, 4 en 7 |

**Wat je hieruit meeneemt:** wij hebben opvallend veel van de WordPress-pijn structureel weggeontworpen, en dat is geen toeval maar het gevolg van drie keuzes (één systeem in plaats van twee, Google OAuth in plaats van wachtwoorden, echte SMTP in plaats van `wp_mail`). Maar **weggeontworpen betekent "de oorzaak bestaat hier niet", niet "er kan niets misgaan"**. In vijf van de veertien rijen staat de oorzaak op groen terwijl het **herstelpad** ontbreekt. Dat is de vorm van ons risico: niet dat het breekt, maar dat we het niet kunnen repareren als het breekt, en dat we niet zien dat het gebroken is.

---

## Bronnen

**Kennisbanken (leveranciers)**

[^ld-faq]: LearnDash Knowledge Base, FAQ-index. <https://docs.nexcess.com/software/learndash/faqs/> (o.a. "How can I make email notifications send on time?", "Why is the registration form not showing?", "How do I automatically assign users to courses when they sign up/register on my site?")
[^ld-faq-notcomplete]: LearnDash Support, "What steps can I take if a lesson or topic is not marked as complete?" <https://learndash.com/support/kb/resources/faqs/what-steps-can-i-take-if-a-lesson-or-topic-is-not-marked-as-complete-2>
[^ld-troubleshooting]: LearnDash, "Troubleshooting Basics". <https://docs.nexcess.com/software/learndash/troubleshooting-basics/>
[^ld-known]: LearnDash, "Known Issues & Conflicts". <https://docs.nexcess.com/software/learndash/known-issues/> (SiteGround-beeldoptimalisatie en certificaten; autosave-interval en quizvoortgang; server-cron voor notificaties)
[^ld-woo]: LearnDash, "WooCommerce Integration" (retroactive course access tool). <https://learndash.com/support/kb/add-ons/woocommerce-add-on/woocommerce/>
[^ld-woo-200]: LearnDash, "Introducing LearnDash WooCommerce 2.0.0" (Enrollment Status gekoppeld aan orderstatus). <https://www.learndash.com/blog/introducing-learndash-woocommerce-2-0/>
[^lifter-docs]: LifterLMS Knowledge Base, categorie-index met artikelaantallen. <https://lifterlms.com/docs/> (Core FAQ 271, Troubleshooting 28, Known Conflicts 14, Stripe 22, WooCommerce 18, PayPal 14, Reporting 25, Engagements 9)

**Supportfora (ruwe klantvraag)**

[^wp-tutor]: WordPress.org, supportforum Tutor LMS. <https://wordpress.org/support/plugin/tutor/>
[^wp-learnpress]: WordPress.org, supportforum LearnPress. <https://wordpress.org/support/plugin/learnpress/>
[^wp-sensei]: WordPress.org, supportforum Sensei LMS. <https://wordpress.org/support/plugin/sensei-lms/>
[^wp-notenrolling]: WordPress.org, "Learndash purchases not enrolling". <https://wordpress.org/support/topic/learndash-purchases-not-enrolling/>
[^wp-noaccess]: WordPress.org, "Users have no access to Learndash courses". <https://wordpress.org/support/topic/users-have-no-access-to-learndash-courses/>
[^ld-cache-forum]: WordPress.org, "Caching Issue: LearnDash Progress Inconsistency with LiteSpeed Cache". <https://wordpress.org/support/topic/caching-issue-learndash-progress-inconsistency-with-litespeed-cache/>

**Bureaus die deze sites repareren**

[^wooninjas]: WooNinjas, "LearnDash Customer Support in 2026". <https://wooninjas.com/learndash-customer-support-in-2026/>
[^wooninjas-2co]: WooNinjas, "LearnDash 2Checkout Setup" (refund verwijdert toegang niet automatisch). <https://wooninjas.com/how-to-accept-course-payments-in-learndash-using-2checkout/>
[^solbase]: Solbase Tech, "Top 5 LearnDash Issues Course Creators Face". <https://solbasetech.com/top-5-learndash-issues-course-creators-face/>
[^saffire]: SaffireTech, "Common Challenges in LearnDash". <https://www.saffiretech.com/blog/common-challenges-in-learndash-identifying-addressing-key-issues/>
[^ldx-manual]: ldx.design, "2 Ways to Manually Enroll Users into a LearnDash Course". <https://ldx.design/manually-enroll-users-learndash-course/>
[^wpmailsmtp]: WP Mail SMTP, "How to Fix LearnDash Not Sending Email Notifications". <https://wpmailsmtp.com/learndash-not-sending-email-notifications/>

**Betalen, terugbetalen, chargebacks**

[^mollie-ideal]: Mollie Support, "Can I cancel or get a refund for an iDeal payment?" <https://help.mollie.com/hc/en-us/articles/31577524811922-Can-I-cancel-or-get-a-refund-for-an-iDeal-payment>
[^klacht]: KLACHT.nl, "Je geld terug via chargeback: zo werkt het" (iDEAL is definitief; chargeback is een kaartschemaprocedure). <https://www.klacht.nl/consumentenrecht/geld-terug-chargeback/>
[^sift]: Sift, "Q4 2025 Digital Trust Index: Dispute & Chargeback Data". <https://sift.com/index-reports-disputes-q4-2025/>
[^communipass]: Communipass, "Online Course Refund Crisis 2026". <https://communipass.com/blog/online-course-refund-crisis-2026/>. **Let op: contentmarketing, geen methode. Alleen als illustratie gebruikt.**

**Juridisch en fiscaal (NL/EU)**

[^ictrecht]: ICTRecht, "Herroepingsrecht op digitale inhoud: kun je dat uitsluiten?" <https://www.ictrecht.nl/blog/herroepingsrecht-op-digitale-inhoud-kun-je-dat-uitsluiten>
[^thuiswinkel]: Thuiswinkel.org, "Uitzonderingen op het herroepingsrecht". <https://www.thuiswinkel.org/kennisbank/kennisartikelen/uitzonderingen-op-het-herroepingsrecht/>
[^maatos]: Maatos, "Btw en online cursussen" (digitale dienst, 21%). <https://maatos.nl/belasting-toegevoegde-waarde-en-online-cursussen/>
[^ondernemersplein]: Ondernemersplein (Overheid.nl), "Facturen maken en versturen". <https://ondernemersplein.overheid.nl/wetten-en-regels/facturen-maken-en-versturen/>
[^woo-vat]: WordPress.org, "European VAT Compliance Assistant for WooCommerce" (VIES-validatie, OSS-rapportage). <https://wordpress.org/plugins/woocommerce-eu-vat-compliance/>

**Uitval, voltooiing en supportlast**

[^harvard]: Samengevat in eLearning Industry en Field Trip Zoom, op basis van Harvard/MIT-onderzoek naar open online cursussen (< 15% voltooiing; 3,13% bij MOOC's in 2017-18; 40-80% uitval bij online studenten). <https://elearningindustry.com/dropout-rates-of-online-courses-cut-high> en <https://www.fieldtripzoom.com/why-do-less-than-15-of-students-complete-their-studies/>
[^heights-completion]: Heights Platform, "Why Are Students Not Completing My Online Course?" <https://www.heightsplatform.com/blog/why-are-students-not-completing-my-online-course>
[^heights-service]: Heights Platform, "Handling Customer Service for Online Course Creators". <https://www.heightsplatform.com/blog/handling-customer-service-for-online-course-creators>
[^digitaldefynd]: DigitalDefynd, "10 Reasons People Don't Finish Online Courses". <https://digitaldefynd.com/IQ/why-people-not-finish-online-courses/>
[^customerhub]: CustomerHub, "Human Support That Really Helps Online Course Creators" en TopVA, "How a course creator offloaded 30 hours a week". <https://www.customerhub.com/post/human-support-that-really-helps-online-course-creators-launch>. **Contentmarketing, cijfers zonder methode. Expliciet als onbruikbaar gemarkeerd.**
[^cengage]: Cengage Support, "Sign In Through Your LMS" (gebruik hetzelfde e-mailadres als je LMS-account). <https://help.cengage.com/student-purchase-access/common/sign-in-through-lms.html>

---

*Interne bronnen waarnaar hierboven verwezen wordt: `docs/learndash/18-wat-we-ermee-doen.md`, `docs/openstaand.md`, `docs/e-mail-versturen.md`, `docs/ontwerp-betaalmodel.md`, `docs/menselijke-elementen.md`, `docs/betalingen-mollie.md`.*
