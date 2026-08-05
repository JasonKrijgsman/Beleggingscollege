# LearnDash: toegangscontrole & verkoop

*Onderzoeksdatum: 5 aug 2026. Onderwerp: hoe LearnDash (WordPress-LMS, versie 4.x) toegang tot cursussen regelt en geld int — en waar dat model sterk of zwak is. Bedoeld als naslag voor Beleggingscollege: wij bouwen hetzelfde probleem zelf (Mollie-checkout → webhook → `entitlements`-tabel), dus vooral de plekken waar LearnDash het anders doet zijn interessant.*

Alle beweringen komen uit de officiële LearnDash-documentatie (learndash.com/support, de Nexcess/HelpScout-spiegels daarvan) of uit gepubliceerde CVE's, tenzij anders vermeld. Waar iets niet te verifiëren was staat dat erbij.

---

## 1. De vijf `Access Modes` van een cursus

Elke cursus heeft precies één toegangsmodus, ingesteld onder **LearnDash LMS → Courses → (cursus) → Settings**, sectie `Course Access Settings`. Dit ene keuzeveld is het hart van het hele verkoopmodel — alles wat LearnDash aan commercie doet hangt eraan.

| Modus | Registratie nodig? | Betaling? | Kern |
|---|---|---|---|
| `Open` | nee | nee | inhoud is publiek |
| `Free` | ja | nee | inschrijven met account |
| `Buy Now` | ja | eenmalig | ingebouwde checkout |
| `Recurring` | ja | terugkerend | abonnement op één cursus |
| `Closed` | ja | extern/handmatig | LearnDash sluit af, iets anders opent |

### `Open`

- Cursusinhoud is publiek zichtbaar zonder registratie of betaling; er is niet eens een inschrijfstap.
- Voortgang wordt alléén bijgehouden voor ingelogde gebruikers; de `Mark Complete`-knop en `Linear Progression` gelden uitsluitend voor wie is ingelogd.
- LearnDash adviseert `Open` vooral voor lead-magnets waar je geen e-mailadres voor wilt vragen. Let op: `Open`-lessen zijn ook voor zoekmachines volledig zichtbaar.

### `Free`

- "Users must be registered and logged in" — inschrijven via een `Take this Course`-knop; met de eigen loginmodule wordt dat `Login to Enroll`.
- Standaardmodus: elke nieuwe cursus staat op `Free` tot je iets anders kiest.
- Het verschil met `Open` is dus alleen het account, niet geld. LearnDash schreef er zelfs een eigen blogpost over ("When to Use Open Courses Versus Free Courses") omdat mensen dit door elkaar halen.

> **Vergelijk met ons:** onze gratis beginnerscursus is feitelijk `Open` (geen account nodig, wél in de sitemap) met een vrijwillige accountlaag eroverheen — LearnDash dwingt je te kiezen.

### `Buy Now`

- Eenmalige betaling; vereist een bedrag in het veld `Course Price`.
- Ondersteunde ingebouwde gateways: PayPal (Checkout), Stripe (Connect), Razorpay.
- "Users are automatically enrolled in the course after successful payment" — de inschrijving is een direct gevolg van de betaalafhandeling, geen aparte stap.
- Werkt samen met LearnDash-coupons (§3) en met puntenaankoop (`Course Points`).

### `Recurring`

Een abonnement op **één cursus** (niet op de hele site — dat is het domein van membership-plugins, §6). Velden:

- `Course Price` — het bedrag per cyclus.
- `Billing Cycle` — getal + eenheid: dagen, weken, maanden of jaren. Voor dagen geldt gedocumenteerd een bereik van 1–90; de maxima voor weken/maanden/jaren staan niet in de geraadpleegde pagina's (niet geverifieerd — vermoedelijk de PayPal-limieten, maar dat is een aanname).
- `Recurring Times` — optioneel: na hoeveel cycli het factureren stopt (leeg = doorlopend). Hiermee bouw je feitelijk een betaling in termijnen: "3 × €20 per maand, daarna klaar".
- `Course Trial Price` — optionele (lagere of gratis) proefprijs.
- `Trial Duration` — hoe lang de proefperiode duurt vóór de normale cyclus begint.

Bron: https://learndash.com/support/kb/core/courses/course-enrollment-mode/

### `Closed` — het interessantste van de vijf

`Closed` betekent: LearnDash beschermt de inhoud, maar **doet zelf niets aan inschrijving**. "You are essentially telling LearnDash to restrict access to your course, but don't do anything else." Toegang komt dan van:

1. handmatige inschrijving door een beheerder (§7),
2. lidmaatschap van een `Group` (§4), of
3. een externe e-commerce- of membership-plugin (WooCommerce, MemberPress, …) die de inschrijving programmatisch verleent (§5–6).

`Closed` activeert één extra veld: **`Button URL`** — de "koopknop" op de cursuspagina wijst dan naar een zelfgekozen URL, bijvoorbeeld een WooCommerce-productpagina of een externe salespagina. Dit is de officiële koppelvlak-truc: LearnDash toont de deur, iets anders verkoopt de sleutel.

> **Vergelijk met ons:** ons hele model ís LearnDash's `Closed`-modus — `heeftToegangTot()` beschermt, Mollie verkoopt, en de webhook is onze "externe plugin" die het entitlement schrijft. LearnDash bevestigt daarmee impliciet dat serieuze verkoop buiten het LMS om loopt.

Overige toegangsknoppen in dezelfde settings-sectie: `Course Prerequisites` (andere cursus(sen) eerst afronden; `Any Selected` of `All Selected`), `Course Points` (toegang kopen met verdiende punten: `Required for Access` / `Awarded on Completion`), `Start Date`/`End Date` (inschrijfvenster en beschikbaarheidsperiode), `Student Limit` (maximum aantal inschrijvingen) en `Course Access Expiration` (§7).

Bronnen: https://learndash.com/support/kb/core/courses/course-enrollment-mode/ · https://www.learndash.com/blog/when-to-use-open-courses-versus-free-courses/ · https://ldx.design/learndash-course-types/

---

## 2. Ingebouwde betalingen: gateways, checkout, en wat er bij een refund gebeurt

### Gateways

Ingesteld onder **LearnDash LMS → Settings → Payments**. Daar staan de ingebouwde gateways (Stripe Connect, PayPal, Razorpay) plus doorverwijzingen naar externe verkoopkanalen (WooCommerce, Paid Memberships Pro, SamCart, ThriveCart, 2Checkout). Eén globale `Default Payment Currency` geldt over alle gateways heen; per gateway hoef je geen valuta meer te kiezen. Gateways zijn individueel aan/uit te zetten zonder API-gegevens te verliezen.

- **Stripe Connect** (core sinds LD 4.0-era; verving het oude Stripe-add-on): koppelen via een `Connect Stripe`-knop → OAuth naar Stripe; LearnDash configureert de webhooks voor live- én testmodus automatisch (handmatig kan ook). Ondersteunt kaarten en — relevant voor Nederland — **iDEAL**; de documentatie noemt iDEAL expliciet als optie voor een Europees publiek.
- **PayPal**: het oude `PayPal (IPN)`/Standard is vervangen door **`PayPal Checkout`** (moderne API), omdat PayPal IPN eind 2026 volledig uitzet. Pijnlijk detail uit de migratiedocumentatie: lopende IPN-abonnementen kunnen **niet** worden overgezet naar PayPal Checkout — bestaande abonnees moeten opnieuw kopen. (De exacte LearnDash-versie waarin PayPal Checkout landde is in de geraadpleegde bronnen niet eenduidig; niet geverifieerd.)
- **Razorpay**: vooral voor de Indiase markt; zelfde patroon als Stripe (API-keys, webhooks).

### Checkout- en inschrijfflow

Er is geen winkelwagen en geen orderoverzicht: de koper klikt op de koopknop op de cursuspagina, betaalt bij de gateway, en "after payment is complete, a new user account is automatically created, and that user is enrolled in the course they just purchased". Account-aanmaak en inschrijving zijn dus één beweging met de betaling (zie ook §8). Transacties verschijnen als records onder **LearnDash LMS → Transactions** — maar dat zijn logregels, geen orders met facturen.

### Refunds en het aflopen van abonnementen — de zwakke plek

Dit is voor ons de belangrijkste bevinding, dus precies:

- **Terugbetalen doe je in de gateway, niet in LearnDash.** De docs voor zowel Stripe als Razorpay zeggen letterlijk dat refunds en het annuleren van abonnementen vanuit het Stripe/Razorpay-account gebeuren, "not from LearnDash".
- **Een refund trekt de toegang NIET automatisch in.** De officiële lijn: "users are not automatically removed from a course if they are issued a refund — you can remove the course access from their profile." Toegang intrekken na terugbetaling is dus een handmatige beheerdersactie die je kunt vergeten.
- **Abonnementsverloop wordt wél automatisch verwerkt — mits de webhooks staan.** Voor Stripe: "as long as either `invoice.payment_failed` or `customer.subscription.deleted` events happen in Stripe, the user's access will be removed." Vereiste webhook-events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `coupon.deleted` (plus optioneel `charge.failed`, `payment_intent.payment_failed`, `payment_intent.canceled` tegen dubbele accounts). De betrouwbaarheid van intrekking is dus precies zo goed als de webhook-configuratie.

> **Vergelijk met ons:** wij trekken toegang automatisch in bij chargebacks en volledige terugbetalingen (PR #42/#44, via `amountRefunded`/`amountChargedBack` omdat Mollie geen status `refunded` kent). Dat is strikt beter dan LearnDash core, waar een refund een handmatige opruimactie vereist — en het bevestigt dat "refund ≠ automatisch toegangsverlies" een veelgemaakte ontwerpfout is, geen exotisch randgeval.

Bronnen: https://learndash.com/support/kb/core/uncategorized/payments/ · https://docs.nexcess.com/software/learndash/stripe-connect/ · https://learndash.com/support/kb/core/settings/razorpay-integration/ · https://learndash.com/support/kb/core/payments/paypal-checkout/ · https://learndash.com/support/kb/non-knowledgebase/uncategorized/paypal-subscriptions-from-standard-to-checkout/

---

## 3. Coupons (core sinds LearnDash 4.1)

Sinds 4.1 (april 2022) zitten kortingscodes in de kern; daarvóór kon het alleen via het betaalplatform zelf. Beheer onder **LearnDash LMS → Coupons**.

Instellingen per coupon:

- `Coupon Code` — de code zelf.
- Type: `Flat Rate` (vast bedrag eraf) of `Percentage Off` (percentage eraf), met een `Amount`.
- `Number of Redemptions` — maximaal aantal inwisselingen (0 = onbeperkt).
- `Start Date` / `End Date` — geldigheidsvenster.
- Toepasbaarheid: alle cursussen/groepen, of een expliciete selectie van specifieke cursussen en/of groepen — per-cursus-coupons zijn dus mogelijk.

Beperkingen (belangrijk):

- **Alleen `Buy Now`.** Coupons werken uitsluitend op cursussen/groepen in `Buy Now`-modus; **niet** op `Recurring` — je kunt dus geen korting op de eerste abonnementstermijn geven via dit systeem.
- Voor nieuwe gebruikers vereisen coupons dat de LearnDash-registratieflow (§8) is ingeschakeld en de registratiepagina's zijn geconfigureerd; het invoerveld (`Apply Coupon`) leeft op die checkout-/registratiepagina en herberekent de prijs vóór de betaling.

> **Vergelijk met ons:** wij hebben nog geen kortingscodes; als we ze bouwen is de LearnDash-les dat de korting vóór het aanmaken van de betaling verrekend moet worden (de prijs blijft uit de eigen catalogus komen, de coupon is een gecontroleerde transformatie daarop — nooit een prijs uit het verzoek).

Bronnen: https://learndash.com/support/kb/core/uncategorized/coupons/ · https://ldx.community/learndash-4-1/

---

## 4. Groups: B2B in de doos

### Wat een `Group` is

Een `Group` is een verzameling gebruikers plus een verzameling cursussen: wie in de groep zit, is automatisch ingeschreven voor álle gekoppelde cursussen ("Assign courses to the group for all group users"). Een groep heeft een eigen pagina (titel, afbeelding, URL, beschrijving) en eigen instellingen, en is daarmee tegelijk een cursusbundel én een organisatie-eenheid.

### Groepen verkopen

Groepen hebben — net als cursussen — toegangsmodi, onder `Group Access Settings`:

- `Free` — registreren/inloggen, geen betaling.
- `Buy Now` — eenmalige prijs in het `Group Price`-veld; zelfde gateways als cursussen. Zo verkoop je een **bundel cursussen in één transactie**.
- `Recurring` — zelfde, maar met factureringsinterval (dagen/weken/maanden/jaren). Geen proefperiode-veld bij groepen (in tegenstelling tot cursussen).
- `Closed` — verkoop via e-commerce/membership-add-on of handmatige plaatsing; activeert ook hier een `Button URL`-veld naar een eigen checkout.

Verdere groepsinstellingen: `Start Date`/`End Date` (ook inzetbaar voor cohorten: dezelfde groep meermaals draaien met andere deelnemers), `Student Limit` (maximum aantal deelnemers in de groep — het dichtstbijzijnde dat core bij "seats" komt).

### `Group Leader`: de B2B-beheerrol

`Group Leader` is een aparte WordPress-rol: iemand die zijn groep(en) beheert zonder site-admin te zijn. Wat die kan:

- Voortgang en prestaties van elk groepslid volgen; rapportages draaien en als CSV exporteren vanaf **LearnDash LMS → Group Administration** (`Export Progress`: voortgang, huidige les, afronding; `Export Results`: quizscores, data, geslaagd/gezakt).
- Communiceren met groepsleden (e-mail vanuit Group Administration) en ingeleverde opdrachten/essays van de groep beoordelen.
- Optioneel méér, via drie capability-instellingen in de globale groepsinstellingen — elk met niveau `Basic` (alleen eigen groepen/gebruikers/cursussen) of `Advanced` (alles op de site):
  - `Manage Groups` — groepen aanmaken en beheren;
  - `Manage Users` — gebruikers beheren, inclusief voortgang aanpassen en gebruikers aanmaken/verwijderen;
  - `Manage Courses` — cursussen (waarvan zij auteur zijn, bij `Basic`) aanmaken en bewerken, gebruikers inschrijven.

### Hiërarchie en seats

- Core kent sinds LD 4.x **subgroepen** (een groepshiërarchie in de groepseditor); de volwaardige organisatiestructuur zit in het officiële add-on **`Groups Plus`**: `Organizations` en `Teams`, verkoopbaar via WooCommerce, inclusief het bijverkopen van extra seats aan een bestaand team. (De precieze grens tussen wat core-subgroepen kunnen en wat Groups Plus toevoegt heb ik niet regel voor regel kunnen verifiëren.)
- Het gangbare B2B-patroon in het ecosysteem is het derde-partij-plugin **Uncanny Groups**: een WooCommerce-product verkoopt N seats voor één of meer cursussen; na aankoop wordt automatisch een LearnDash-groep aangemaakt met de koper als `Group Leader`, die vervolgens zelf via een front-end-dashboard collega's uitnodigt en rapportages ziet. LearnDash's eigen `Group Registration`-add-on doet vergelijkbaars.

> **Vergelijk met ons:** wij hebben geen B2B-verhaal; als een werkgever ooit "10 × Waardebeleggen" wil, is dit het referentiemodel — één betaling, een seats-teller, en een klant-beheerder die zelf toewijst, zonder dat wij per cursist hoeven te factureren.

Bronnen: https://learndash.com/support/kb/core/uncategorized/groups/ · https://learndash.com/support/kb/core/uncategorized/group-access-settings/ · https://learndash.com/support/kb/core/groups/group-leader-capabilities/ · https://learndash.com/support/kb/add-ons/groups-plus/create-an-organization/ · https://www.uncannyowl.com/downloads/uncanny-learndash-groups/

---

## 5. WooCommerce: waarom serieuze shops de ingebouwde betalingen links laten liggen

Het officiële (gratis) add-on **`WooCommerce for LearnDash`** koppelt een WooCommerce-product aan één of meer cursussen en/of groepen ("Related Courses"/"Related Groups" op het product). De cursus zelf zet je op `Closed`. Wat je daarmee wint boven de ingebouwde gateways:

- **Orders, facturen en bonnetjes.** WooCommerce heeft een echt ordermodel; klanten zien aankoophistorie en facturen op hun accountpagina, en met standaard-plugins (PDF Invoices, e.d.) voldoe je aan factuurplichten. LearnDash core heeft alleen `Transactions`-logregels — geen factuur, geen btw-specificatie.
- **Belasting.** WooCommerce heeft een tax-engine (tarieven per land, prijzen incl./excl. btw) en het ecosysteem levert EU-btw-plugins (b2b-nummervalidatie, OSS-drempels, bewijs van afnemerslocatie). LearnDash's eigen checkout heeft **geen enkel belastingbegrip**: het bedrag in `Course Price` is het bedrag, punt.
- **Refunds die toegang intrekken.** Het add-on schrijft niet alleen in (directe inschrijving na betaling, ook retroactief voor bestaande orders) maar ook uít: bij een refund of geannuleerde/verlopen WooCommerce-abonnement (via WooCommerce Subscriptions) wordt de cursist automatisch uitgeschreven. Precies wat core bij een refund niet doet (§2).
- **100+ gateways** — waaronder Mollie's eigen WooCommerce-plugin met iDEAL; plus winkelwagen (meerdere cursussen in één afrekening), upsells, orderbevestigingsmails, kortingsregels die wél op abonnementen werken, enz.

Het patroon in de LearnDash-wereld is daardoor vrijwel universeel: **LearnDash levert het leren, WooCommerce (of een membership-plugin) doet het geld.** De ingebouwde gateways zijn het startersmodel voor wie precies één prijs per cursus heeft en geen facturen hoeft te sturen.

Bronnen: https://learndash.com/support/kb/add-ons/woocommerce-add-on/woocommerce/ · https://www.learndash.com/add-on/woocommerce/ · https://wisdmlabs.com/blog/learndash-woocommerce/ (niet-officieel, ter illustratie van het ecosysteem-patroon)

---

## 6. Membership-plugins: toegang als lidmaatschap

Voor "alles-in-één-abonnement"-modellen (ons College+) gebruikt het ecosysteem geen `Recurring`-cursussen maar een membership-plugin. Het patroon is bij alle drie hetzelfde en officieel gedocumenteerd:

1. Zet de cursussen op **`Closed`**.
2. De membership-plugin (MemberPress, Paid Memberships Pro, Restrict Content Pro, WooCommerce Memberships, …) definieert niveaus ("levels") en handelt checkout, abonnementen, proefperiodes en opzeggingen af.
3. Een officieel koppel-add-on mapt niveau → cursussen: bij aanmelding wordt de gebruiker automatisch in de gemapte cursussen ingeschreven, en **bij verlopen/opzeggen van het lidmaatschap wordt de toegang automatisch ingetrokken** ("automatically grant and remove a member's access to a course based on their membership status").

- **MemberPress**: gratis officieel add-on, onderhouden door LearnDash; mapping per membership-level.
- **Paid Memberships Pro**: zit zelfs als "gateway" in LearnDash's eigen Payments-tab; PMPro's kant heet het `Courses for Membership`-add-on, met een "Require Membership"-blok op de cursus.
- **Restrict Content Pro**: zelfde patroon via een koppelplugin; minder prominent gedocumenteerd aan LearnDash-zijde (niet in detail geverifieerd).

De membership-plugin is hier de bron van waarheid over wie mag; LearnDash is alleen nog de inhoudsleverancier. Dat is exact onze scheiding tussen `entitlements` (mag je?) en `content` (wat krijg je?), maar dan met een plugin-huwelijk in plaats van een functieaanroep.

> **Vergelijk met ons:** College+ (€14,99/mnd, wacht op SEPA-goedkeuring bij Mollie) volgt hetzelfde ontwerp: het abonnement wordt een rij die entitlements verleent en intrekt — niet een eigenschap van elke cursus afzonderlijk, wat LearnDash's `Recurring`-per-cursus wél is en wat daar zichtbaar knelt.

Bronnen: https://learndash.com/support/kb/add-ons/paid-memberships-pro-add-on/paid-memberships-pro/ · https://www.paidmembershipspro.com/add-ons/learndash-integration/ · https://www.learndash.com/integrations/paidmembershipspro/

---

## 7. Inschrijvingsbeheer: handmatig, in bulk, en verlopende toegang

### Handmatig

Op de cursusbewerkpagina zit een `Users`-/`Course Students`-paneel waarmee een beheerder individuele gebruikers in- en uitschrijft; hetzelfde kan via het WordPress-gebruikersprofiel (daar staat per gebruiker de cursustoegang, inclusief de knop om toegang te verwijderen — de handmatige refund-opruiming uit §2). Groepsplaatsing (gebruiker → `Group`) is de tweede handmatige route en schaalt beter, omdat één groepslidmaatschap meerdere cursussen ontsluit.

### Bulk / CSV — niet in core

Een CSV-import van gebruikers-met-inschrijvingen zit **niet** in LearnDash core. De gedocumenteerde routes:

- LearnDash's eigen dev-docs verwijzen naar de gratis WordPress-plugin "Import Users from CSV with Meta", met een metakolom `learndash_group_users` (groeps-ID) zodat geïmporteerde gebruikers via de groep worden ingeschreven.
- Derde partijen: Uncanny Owl's `Import Users` (kolom `learndash_courses` met cursus-ID's), "Manage Enrollment for LearnDash" (bulk-UI + CSV met `user_email`/`course_id`/`group_id`), en anderen.

Voor een pakket dat B2B-groepen verkoopt is dat een opvallend gat in de kern.

### `Course Access Expiration`

Per cursus (tab `Course Access Expiration` in de cursusinstellingen): toegang verloopt N dagen **na de inschrijfdatum van de cursist** (rollend, niet op een vaste datum — vaste vensters doe je met `Start Date`/`End Date`). Optioneel schakel je daarbij dataverwijdering in: bij verlopen toegang worden de cursus- en quizgegevens van de gebruiker **gewist**. De docs waarschuwen expliciet dat dit onomkeerbaar is en raden een back-up aan.

> **Vergelijk met ons:** wij verkopen bewust permanente toegang en zouden voortgang nooit wissen; interessant is vooral dat LearnDash "toegang kwijt" en "voortgang kwijt" als twee losse beslissingen modelleert — dezelfde scheiding als bij ons tussen `entitlements` en `lesson_progress`.

Bronnen: https://learndash.com/support/kb/core/courses/course-enrollment-mode/ · https://developers.learndash.com/snippet/import-users-via-csv/ · https://www.uncannyowl.com/knowledge-base/import-learndash-users/ · https://www.training-spark.com/how-to-set-course-access-expiration-in-learndash/ (niet-officieel)

---

## 8. Registratie en login

Sinds LD 3.6 heeft LearnDash een eigen registratie-ervaring (vereist de "LearnDash 3.0"-templateset), geconfigureerd onder **LearnDash LMS → Settings → General → Login and Registration**:

- Een aan te wijzen **`Registration Page`** (met het registratieblok/shortcode) en een aparte **registratiebevestigings-/redirectpagina** — na registratie is de gebruiker standaard direct ingelogd en stuur je hem bijvoorbeeld naar een bedankpagina of het cursusoverzicht.
- Een **login-popup (modal)**: een loginlink die je op elke pagina of widget kunt zetten en die een overlay opent, zodat de bezoeker niet van de pagina af hoeft.
- De **checkout en registratie zijn samengevoegd** ("registration flow", aangescherpt in LD 4.0): wie een betaalde cursus koopt zonder account, registreert, betaalt en start in één doorloop — er wordt niet meer achteraf per mail om een wachtwoord gevraagd. Bij de ingebouwde gateways geldt: betaling voltooid → account automatisch aangemaakt → ingeschreven (§2). De coupon-invoer (§3) leeft in diezelfde flow.

> **Vergelijk met ons:** wij lossen hetzelfde op met Google-login vóór de checkout; LearnDash kiest "betalen creëert het account". Dat verlaagt frictie maar maakt de webhook-afhandeling verantwoordelijk voor identiteit — een extra reden waarom hun webhookconfiguratie (§2) zo kritisch is.

Bronnen: https://learndash.com/support/kb/core/settings/login-registration/ · https://learndash.com/support/kb/non-knowledgebase/uncategorized/the-new-ld-3-6-registration-process/

---

## 9. Hoe de afscherming technisch werkt — en waar hij lek was

- **Afscherming op weergaveniveau.** LearnDash-inhoud bestaat uit gewone WordPress-posttypes (`sfwd-courses`, `sfwd-lessons`, `sfwd-quiz`, …). Bij het renderen beslist de template op basis van de inschrijfstatus of de inhoud wordt getoond of het "je hebt geen toegang"-scherm. De data zelf staat gewoon in de database als publiek posttype; de bescherming is een laag eroverheen — vergelijkbaar met onze eerste valkuil (props/HTML schoon, bundel lek), maar dan permanent, want WordPress kent geen bouwtijd/servergrens zoals React Server Components.
- **En dat ging precies dáár mis.** Begin 2024: **CVE-2024-1208 en CVE-2024-1210** — de eigen REST API (`/wp-json/ldlms/v1/` en `/v2/`) gaf aan **niet-ingelogde** bezoekers alle quizzen en quizvragen prijs, tot en met LearnDash ≤ 4.10.2. Daarnaast **CVE-2024-1209**: geüploade opdrachten (assignments) van cursisten waren door onbekenden te bladeren en downloaden. Gefixt in 4.10.2 (deels) en 4.10.3 (jan 2024, volledig). De API kán uitgeschakeld worden via de filter `learndash_rest_api_enabled`, maar de onderzoeker merkte op dat dat destijds een ander lek opende.
- De les is dezelfde die wij al betaald hebben: **een tweede uitgang (API, bundel) heeft zijn eigen slot nodig** — het slot op de voordeur (template/HTML) zegt niets over de zijdeur. Bij ons dwingt `import "server-only"` op `@/content` dit af; WordPress heeft zo'n bouwfoutmechanisme niet, dus daar is het patchen achteraf.

Bronnen: https://github.com/karlemilnikka/CVE-2024-1208-and-CVE-2024-1210 · https://wpscan.com/vulnerability/f4b12179-3112-465a-97e1-314721f7fe3d/ · https://developers.learndash.com/learndash-rest-api-listing/

---

## 10. EU/NL-relevantie samengevat

- **iDEAL**: alleen via Stripe Connect (of via WooCommerce + Mollie/andere PSP). PayPal Checkout en Razorpay bieden het niet zinvol voor NL.
- **Facturen**: de ingebouwde checkout maakt géén facturen; er is alleen een `Transactions`-log en de bon van de gateway. Voor de Nederlandse factuurplicht (btw-specificatie, KVK/btw-nummer) heb je WooCommerce + een factuurplugin nodig, of externe facturatie (Quaderno e.d.).
- **Btw**: de ingebouwde gateways rekenen geen belasting — `Course Price` is een kaal bedrag. EU-OSS, prijzen incl. btw, en b2b-verlegging bestaan alleen in het WooCommerce-spoor. Wie in de EU serieus met LearnDash verkoopt, gebruikt daarom vrijwel altijd `Closed` + WooCommerce.
- **Herroepingsrecht/consumentenrecht** wordt nergens in de LearnDash-docs behandeld; dat ligt volledig bij de shop-laag. (Geen verrassing, wel goed om te weten dat het pakket je daar niets bij aanreikt.)

> **Vergelijk met ons:** dit is de kern-rechtvaardiging van onze eigen bouw — Mollie geeft ons iDEAL als eersteklas betaalmethode en wij houden factuur- en btw-logica (21%-regel in de orderbevestiging) in eigen hand, zonder een tweede platform (WooCommerce) ertussen.

---

## Bronnen

Officieel (LearnDash):

- https://learndash.com/support/kb/core/courses/course-enrollment-mode/ — de vijf access modes, prijs- en trialvelden
- https://learndash.com/support/kb/core/uncategorized/payments/ — Payments-instellingenscherm, gateway-overzicht, globale valuta
- https://docs.nexcess.com/software/learndash/stripe-connect/ — Stripe Connect: setup, webhooks, iDEAL, refunds, abonnementsverloop (officiële doc-spiegel)
- https://learndash.com/support/kb/core/settings/razorpay-integration/ — Razorpay: refunds via de gateway, niet via LearnDash
- https://learndash.com/support/kb/core/payments/paypal-checkout/ — PayPal Checkout
- https://learndash.com/support/kb/non-knowledgebase/uncategorized/paypal-subscriptions-from-standard-to-checkout/ — IPN-sunset en niet-migreerbare abonnementen
- https://learndash.com/support/kb/core/uncategorized/coupons/ — coupons: types, velden, alleen-Buy-Now-beperking
- https://learndash.com/support/kb/core/uncategorized/groups/ — Groups-basis
- https://learndash.com/support/kb/core/uncategorized/group-access-settings/ — toegangsmodi en Button URL voor groepen
- https://learndash.com/support/kb/core/groups/group-leader-capabilities/ — Group Leader: Basic/Advanced, Manage Users/Courses/Groups
- https://learndash.com/support/kb/add-ons/groups-plus/create-an-organization/ — Groups Plus: Organizations/Teams
- https://learndash.com/support/kb/add-ons/woocommerce-add-on/woocommerce/ — WooCommerce-integratie
- https://learndash.com/support/kb/add-ons/paid-memberships-pro-add-on/paid-memberships-pro/ — PMPro-patroon
- https://learndash.com/support/kb/core/settings/login-registration/ — registratiepagina en loginmodal
- https://learndash.com/support/kb/non-knowledgebase/uncategorized/the-new-ld-3-6-registration-process/ — registratieflow
- https://developers.learndash.com/snippet/import-users-via-csv/ — CSV-import (aanbevolen externe plugin)
- https://developers.learndash.com/learndash-rest-api-listing/ — REST API
- https://www.learndash.com/blog/when-to-use-open-courses-versus-free-courses/ — Open vs. Free
- https://www.learndash.com/blog/selling-online-courses-b2b-and-b2c-just-got-easier-with-the-latest-groups-plus-update/ — Groups Plus B2B

Niet-officieel (ecosysteem/beveiliging, ter aanvulling):

- https://github.com/karlemilnikka/CVE-2024-1208-and-CVE-2024-1210 en https://wpscan.com/vulnerability/f4b12179-3112-465a-97e1-314721f7fe3d/ — API-lekken en fixes
- https://www.uncannyowl.com/downloads/uncanny-learndash-groups/ en https://www.uncannyowl.com/knowledge-base/import-learndash-users/ — Uncanny Groups / Import Users
- https://ldx.community/learndash-4-1/ — release-samenvatting 4.1 (coupons)
- https://ldx.design/learndash-course-types/ — uitleg cursustypen
- https://wisdmlabs.com/blog/learndash-woocommerce/ — waarom WooCommerce-integratie
- https://www.paidmembershipspro.com/add-ons/learndash-integration/ — PMPro-zijde van de koppeling
- https://www.training-spark.com/how-to-set-course-access-expiration-in-learndash/ — Course Access Expiration in de praktijk
