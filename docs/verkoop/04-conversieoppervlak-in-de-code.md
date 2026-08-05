# Het conversie-oppervlak in de code van vijf LMS-plugins

*Brononderzoek van 5 augustus 2026.* Voor dit hoofdstuk heb ik de pluginheaders en de uitvoerende PHP-templates van LearnDash 5.1.8, Tutor LMS 4.0.4, LearnPress 4.2.7, Sensei LMS 4.26.2 en LifterLMS 10.1.0 gelezen. Voor de externe verkooproutes heb ik ook LearnDash WooCommerce Integration 2.0.2, LearnDash ThriveCart Integration 1.0.5 en LearnDash SamCart Integration 1.1.0.1 onderzocht.

Met het conversie-oppervlak bedoel ik hier alle code die een nog niet ingeschreven bezoeker helpt om een cursus te begrijpen, de prijs te beoordelen, af te rekenen en daarna toegang te krijgen. Dat is meer dan een koopknop. De volgorde van informatie, het zichtbare curriculum, een proefles, de accountstap, de foutafhandeling en zelfs de vorm van een prijs zijn allemaal onderdeel van dezelfde route.

Dit is een broncodeanalyse, geen beoordeling van marketingdemo's. Een element telt alleen als standaardfunctionaliteit wanneer de geïnspecteerde code het rendert of er een concrete hook voor registreert. Bij een negatieve bevinding heb ik gericht in de betreffende bronboom gezocht. `vendor/`, vertalingsbestanden, tests en adminpromoties heb ik daarbij niet als bezoekersfunctionaliteit geteld.

## 1. De cursus-verkooppagina zoals de code hem rendert

### De vijf standaardpagina's naast elkaar

| LMS | Volgorde voor een niet-ingeschreven bezoeker | Prijs en CTA | Curriculum en proefles | Bewijslagen en bezwaren |
| --- | --- | --- | --- | --- |
| LearnDash 5.1.8 | Classic: meldingen, infobar, inhoudsmaterialen in tabs, curriculum, loginmodal. Modern: header, inhoud en curriculum, daarna zijbalk met inschrijving en cursusdetails. | Classic toont status, prijs en `Get Started` naast elkaar. Modern zet pricing, access en join onder elkaar in de zijbalk. | Het curriculum is standaard zichtbaar, tenzij `course_disable_content_table` het uitschakelt. Voorbeeldlessen krijgen `Sample %s`. | Geen standaard docentbio, reviews, FAQ of blok met leeruitkomsten gevonden in de cursustemplates. Materialen zijn wel een tab. |
| Tutor LMS 4.0.4 | Lead-informatie, titel en auteursmeta, media, tabinhoud; daarnaast de course entry box, docenten, eisen, materialen, tags en doelgroep. Op mobiel verhuist de entry box naar de hoofdkolom. | Prijs en koopknop staan prominent in `course-entry-box.php`. Bij een actieprijs staat de huidige prijs naast een doorgestreepte reguliere prijs. | `Course Info` bevat beschrijving, `What Will You Learn?` en het curriculum. Previewlessen krijgen een oog, gesloten lessen een slot. | Docentblok, eisen, materialen, doelgroep, beoordelingen en Q&A zijn aanwezig. Geen cursusspecifieke FAQ-template gevonden. |
| LearnPress 4.2.7 | In de klassieke hooks: titel en meta, hoofdinhoud, tabs, extra informatie, reacties en zijbalk. De moderne layout bouwt een lange pagina met beschrijving, leeruitkomsten, doelgroep, eisen, curriculum, materialen, FAQ, docent, featured review, reacties en gerelateerde cursussen. | De zijbalk toont media, prijs, status en inschrijfknoppen. In de moderne layout bestaat ook een mobiele variant van dit koopblok. | Curriculum is een eigen tab of sectie. Items met `_lp_preview` krijgen een previewstatus. | Van de vijf is dit standaard het breedst: docent, FAQ, Requirements, Features, Target audiences, een handmatig gekozen featured review, reacties en automatisch gerelateerde cursussen. |
| LifterLMS 10.1.0 | Video, audio, WordPress-inhoud, cursusmeta, docent, vereisten, prijstabel, syllabus en reviews. De exacte positie komt uit hooks, niet uit een monolithisch template. | `pricing-table.php` rendert één of meer access plans. Elk plan heeft zijn eigen prijs, voorwaarden, proefperiode en knop. | De syllabus toont secties en lessen. Een gratis les blijft toegankelijk; een gesloten les is geen link en krijgt een restrictiebericht. | Docent en reviews zijn standaard. Geen afzonderlijk FAQ- of leeruitkomstenblok gevonden. Vereisten en meerdere prijsplannen vangen wel veel bezwaren af. |
| Sensei LMS 4.26.2 | Titel, voortgang, afbeelding, vereisten en inschrijfmeldingen, inschrijfactie, bericht, video, inhoud of excerpt, daarna modules en lessen. | De gratis core-plugin heeft geen prijs- of checkoutlaag. De CTA is inschrijven of inloggen. | Modules en lessen blijven als curriculum zichtbaar. Previewlessen worden expliciet gemarkeerd. | Geen prijsblok, betaalfunnel, reviews, FAQ of standaard leeruitkomstenblok in core gevonden. Sensei levert hier een cursuspresentatie, geen verkoopstack. |

De tabel verbergt een belangrijk verschil. LearnDash en LifterLMS zijn vooral samenstellingen van kleine templates en hooks. LearnPress levert in zijn moderne layout bijna een complete long-form verkooppagina. Tutor zit ertussenin: het heeft sterke cursusmetadata en sociaal bewijs, maar geen ingebouwde FAQ. Sensei core stopt waar betaalde commerce begint.

### LearnDash: status, prijs, actie, daarna vooral cursusstructuur

De classic LD30-pagina in `themes/ld30/templates/course.php` roept eerst `learndash-course-before` aan, toont zo nodig een certificaatmelding, laadt `modules/infobar.php`, daarna `modules/tabs.php`, en vervolgens de cursusinhoud via `course/listing.php`. Tot slot komen `learndash-course-after` en eventueel de loginmodal.

Voor een niet-ingeschreven bezoeker is `themes/ld30/templates/modules/infobar/course.php` het eigenlijke verkoopblok. De drie segmenten zijn letterlijk:

1. `Current Status`, met `Not Enrolled` en de uitleg `Enroll in this %s to get access`.
2. `Price`, met het bedrag of `Free`.
3. `Get Started`, met de koopactie, `Log In to Enroll`, of bij een gesloten cursus `This %s is currently closed`.

De modern layout verdeelt hetzelfde model anders. `themes/ld30/templates/modern/course/index.php` laadt achtereenvolgens `header.php`, `content.php` en `sidebar.php`. De hoofdinhoud bevat tabs en het accordion-curriculum. `themes/ld30/templates/modern/course/sidebar/enrollment/index.php` zet pricing, access en join in die volgorde in de zijbalk. Een pre-orderstatus kan de gewone joinactie onderdrukken.

Het curriculum kan dus verkoopinformatie zijn, maar is niet gegarandeerd. `course_disable_content_table` kan de inhoudstabel voor een niet-ingeschreven bezoeker verbergen. Voorbeeldlessen worden in modern gemarkeerd door `themes/ld30/templates/modern/course/accordion/lessons/lesson/attributes/sample.php`, met de korte tekst `Sample %s`.

Ik heb in `themes/ld30/templates/` gericht gezocht naar instructor, author bio, review, rating, FAQ, benefits en learning outcomes. Buiten generieke auteurs- of commentaarmechanismen vond ik geen standaard cursusblokken die deze bezwaren afhandelen. Ook vond ik geen tweede CTA na het curriculum. LearnDash veronderstelt kennelijk dat het WordPress-thema, een pagebuilder of een commerce-integratie het overtuigingswerk rond de kern doet.

### Tutor: de cursusdetailpagina is meteen een verkoopdetailpagina

`templates/single-course.php` begint voor niet-ingeschreven bezoekers met `single/course/lead-info.php`. Daarna volgt een tweekolomsopzet. De hoofdkolom toont video of thumbnail, een mobiele variant van de entry box en de tabinhoud. De zijbalk toont `single/course/course-entry-box.php`, docenten, eisen en materialen, tags en de doelgroep.

`Tutor\Utils::course_nav_items()` in `classes/Utils.php` definieert `Course Info`, `Reviews`, `Q&A` en `Announcements`. `Tutor\Course::enable_disable_course_nav_items()` in `classes/Course.php` haalt Q&A en aankondigingen voor niet-ingeschreven bezoekers weg wanneer de instellingen dat vereisen. Reviews kunnen eveneens globaal uitstaan.

De informatievolgorde binnen `Course Info` is concreet vastgelegd in `includes/tutor-template-functions.php`: beschrijving, `tutor_course_benefits_html()` en daarna het curriculum. Het bijbehorende template `templates/single/course/course-benefits.php` gebruikt de kop `What Will You Learn?`. `templates/single/course/course-topics.php` toont secties, lesnamen en tijdsduren. Het gebruikt `_is_preview` om een preview te onderscheiden van een gesloten les.

Het reviewscherm in `templates/single/course/reviews.php` zegt `Student Ratings & Reviews`, toont het gemiddelde, de verdeling en losse reviews. Zonder reviews verschijnt `No Review Yet`. Alleen ingeschreven cursisten krijgen de schrijf- of bewerkactie. Daarmee is het bewijs echt aan deelname gekoppeld, niet aan een los marketingveld.

De aankoopkaart in `templates/single/course/course-entry-box.php` toont prijs of gratis inschrijving, gevolgd door niveau, aantal inschrijvingen, duur en laatste wijziging. De gratis CTA is `Enroll Now`. Voor Tutor-commerce rendert `templates/single/course/add-to-cart-tutor.php` onder meer `Buy Now`, `Add to Cart` en `View Cart`. Een uitgelogde bezoeker krijgt eerst de loginmodal.

Ik heb in de cursus- en frontendtemplatebomen gericht op `faq` gezocht. Er is algemene accordioncode, maar ik vond geen standaard cursus-FAQ die door deze pagina wordt gerenderd.

### LearnPress: een ingebouwde long-form pagina

`templates/single-course.php` leidt naar `templates/content-single-course.php`; de uiteindelijke volgorde wordt vooral door `inc/lp-template-hooks.php` bepaald. In de klassieke variant opent de summary, volgen titel en primaire metadata zoals docent en categorie, daarna secundaire metadata, de eigenlijke inhoud, de tabs, extra informatie, reacties en de zijbalk.

`learn_press_get_course_tabs()` maakt in core de tabs Overview, Curriculum, Instructor, Materials en FAQ. De filter `learn-press/course-tabs` laat extensies die lijst aanpassen. De FAQ verschijnt alleen wanneer de cursus FAQ-data heeft. De extra blokken komen uit `templates/single-course/extra-info.php` en kunnen `Requirements`, `Features` en `Target audiences` tonen. `Features` is hier feitelijk het blok met wat je leert.

De moderne pagina in `inc/TemplateHooks/Course/SingleCourseModernLayout.php` maakt de verkoopvolgorde nog explicieter. Links staan beschrijving, features, doelgroep, eisen, curriculum, materialen, FAQ, docent en op mobiel de featured review. Rechts staan afbeelding, prijs, leerinformatie, metadata, knoppen, delen en op desktop de featured review. Daarna komen reacties en gerelateerde cursussen.

De featured review is geen volledig reviewsysteem. `course_featured_review()` leest het handmatig ingevulde veld `_lp_featured_review`; het template toont daar vijf stericonen en de kop `Featured Review` bij. Je moet dit dus zien als redactionele testimonialruimte. De gewone reacties staan los daarvan.

Gerelateerde cursussen zijn wel echte automatische output. `inc/TemplateHooks/Course/ListCoursesRelatedTemplate.php` selecteert maximaal vier gepubliceerde cursussen op gedeelde categorieën. De hook `learn-press/single-course/courses-related/layout` rendert ze onder de kop `You might be interested in`.

### LifterLMS: een prijskeuze vóór het syllabusbewijs

LifterLMS bouwt de pagina op met acties uit `includes/llms.template.hooks.php`. Voor de summary komen optioneel video en audio. Na de hoofdinhoud volgen in de standaardprioriteiten de metadatawrapper, duur, moeilijkheid, tracks, categorieën, tags, cursusdocent, vereisten, de prijstabel, eventueel voortgang, de syllabus en reviews.

Voor conversie is de volgorde opvallend: de prijsplannen staan vóór de volledige syllabus. `templates/product/pricing-table.php` loopt voor een niet-ingeschreven bezoeker door alle beschikbare access plans. Per plan worden achtereenvolgens feature, titel, prijs, beperkingen, beschrijving, proefperiode en knop gerenderd. De pagina herhaalt dus niet één CTA, maar geeft ieder aanbod zijn eigen CTA.

De syllabus komt uit `templates/course/syllabus.php`; de afzonderlijke regels uit `templates/course/lesson-preview.php`. De course author en het reviewgedeelte zijn standaard. Een FAQ en een dedicated blok voor leeruitkomsten heb ik na gerichte zoekopdrachten in de frontendtemplates en hooks niet gevonden.

Er is een `[lifterlms_related_courses]` shortcode in `includes/shortcodes/class.llms.shortcodes.php`, maar die staat niet standaard onder elke cursus. `related_courses()` moet bewust worden geplaatst en haalt in essentie andere gepubliceerde cursussen op, eventueel beperkt tot een categorie. Dit is minder gericht dan LearnPress' automatische categorieoverlap.

### Sensei: sterke inkijk, geen ingebouwde betaalpropositie

`templates/single-course.php` is klein: hooks rond `the_content()` doen het werk. In `includes/hooks/template.php` en de legacy hooks uit `includes/class-sensei-course.php` ontstaat deze volgorde: titel, voortgangsregel en meter, afbeelding, vereiste- en inschrijfmeldingen, inschrijfactie, bericht, video, inhoud, modules en lessen. Zonder volledige toegang kan Sensei de volledige inhoud door een excerpt vervangen.

`templates/single-course/modules.php` en `templates/single-course/lessons.php` maken van de module- en leslijst een royaal curriculumvoorbeeld, inclusief excerpts en previewlabels. De plugin kan zelfs melden hoeveel previewlessen er zijn en gebruikt daarvoor teksten als `%d preview lessons` en `You can access %d of this course's lessons for free`.

Na een gerichte zoekopdracht vond ik in Sensei LMS core geen prijsformatter, betaaltemplate, winkelmand, kortingscode of checkoutcontroller. Dat is geen gemis in de renderketen, maar een productgrens: betaalde verkoop vereist een commerce-uitbreiding die niet in deze bronboom zit.

## 2. Checkout- en registratieflow

Een checkout heeft twee soorten stappen. Er zijn zichtbare schermen voor de koper en technische statussen voor account, order en betaling. De tweede soort bepaalt wat herstel na een fout kost.

| LMS | Zichtbare route | Verplichte gegevens in de standaardflow | Gastafrekenen en moment van accountaanmaak | Kortingscode | Bij een mislukte betaling |
| --- | --- | --- | --- | --- | --- |
| LearnDash | Registreren of inloggen, daarna orderdetails en betaalgateway. | Op een verse configuratie: username, email, first name, last name en password. Alle vijf zijn instelbaar, standaard actief en verplicht. Voorwaarden en privacy kunnen worden toegevoegd. | Geen echte gastcheckout in de normale registratieflow. `user_register` en de authcookie komen vóór de gatewayknoppen. | In orderdetails: `Have a coupon?`, veld `Coupon Code`, actie `Apply`. | De gateway gaat terug naar de productpagina of een gefilterde fail-URL. Het account blijft bestaan; toegang volgt pas na een geslaagde transactie. |
| LifterLMS | Eén checkoutformulier: persoonsgegevens en factuurgegevens links, order, coupon, betaling en toestemming rechts. Sommige gateways voegen een bevestigingsscherm toe. | Standaard onder meer email, voornaam, achternaam, wachtwoord en bevestiging; daarnaast straat, plaats, land, provincie of staat en postcode. Adresregel 2 en telefoon zijn optioneel. De blocks zijn beheerbaar. | Geen anonieme checkout. `LLMS_Order_Generator::commit_user()` registreert de gebruiker vóór `create()` de pending order maakt. | Op dezelfde pagina: `Have a coupon? Click here to enter your code`, `Coupon Code`, `Apply Coupon`. | Validatiefouten worden notices. Een gatewayfout laat account en pending order bestaan; de checkout kan dezelfde order key hergebruiken. |
| Tutor LMS | Eerst account of login, optioneel winkelmand, daarna één checkoutformulier en gateway. `Buy Now` kan de winkelmand overslaan. | Registratie: voornaam, achternaam, username, email, password, password confirmation en eventueel voorwaarden. Checkout: voornaam, achternaam, email, land, plaats, postcode, telefoon en adres; state is aanwezig maar niet met HTML `required`. | Core zet `tutor_is_guest_checkout_enabled` standaard op `false`. Het account bestaat dus al vóór `CheckoutController::pay_now()` een unpaid order maakt. | In de orderdetails: `Have a coupon?`, `Add coupon code`, `Apply`. | De unpaid order blijft bruikbaar. De foutpagina zegt `Payment failed` en biedt `Back to Checkout`. Zonder specifieke fout staat er `An error occurred. Please try to place the order again.` |
| LearnPress | Order review, daarna binnen één formulier login, registratie of gastgegevens, ordernotitie, payment en voorwaarden; één actie `Place order`. | Registratie: email, username, password en password confirmation. Gast: email. De account- en adresvelden kunnen door instellingen en gateway verschillen. | Gastcheckout bestaat, maar staat standaard uit met `guest_checkout=no`. Bij registratie wordt de gebruiker vóór de pending order gemaakt. Een echte gast blijft `LP_User_Guest` en krijgt na betaling een order key per email. | Geen couponinvoer of werkende couponengine in de geïnspecteerde core gevonden. Alleen lege couponvelden in transactiedata zijn geen bezoekersfunctie. | `order_awaiting_payment` maakt hergebruik van de pending order mogelijk. Validatie-exceptions blijven op de checkout. De precieze gatewayfout en terugkeerpagina zijn gatewayafhankelijk. |

### LearnDash: eerst identiteit, daarna geld

De moderne registratiepagina staat in `src/views/modules/registration/registration.php`. Een uitgelogde bezoeker ziet eerst login en registratie. Pas wanneer de gebruiker geregistreerd of al ingelogd is, rendert het template de orderdetails en betaalbuttons. `src/views/modules/registration/register/form.php` bouwt het formulier.

De standaardvelden komen uit `includes/settings/settings-sections/class-ld-settings-section-registration-fields.php`. `username`, `email`, `first_name`, `last_name` en `password` zijn bij een verse instelling ingeschakeld en verplicht. Beheerders kunnen die toestand wijzigen. Een zichtbaar tweede wachtwoordveld zit niet in deze standaardset; `LearnDash\Core\Modules\Registration\Form::set_confirm_password()` zet intern de bevestiging gelijk aan het gekozen wachtwoord om aan WordPressvalidatie te voldoen.

`learndash_register_user_success()` hangt aan `user_register`, slaat namen en wachtwoordgegevens op en zet een authcookie. Dit gebeurt vóórdat de koper een gateway kiest. De betaling kan dus mislukken terwijl het account al bestaat. Dat is een bruikbaar herstelanker, maar het is ook frictie vóór betaling.

De coupon zit in de orderweergave, niet op de cursuskaart. Bij annuleren of falen gebruikt `Learndash_Payment_Gateway::get_url_fail()` standaard de permalink van het product, of de homepagina bij meerdere producten. De filter `learndash_payment_option_url_fail` kan dit wijzigen. Ik vond in core geen uniforme, gatewayonafhankelijke foutpagina met een eigen hersteltekst.

### LifterLMS: account en order als twee herstelbare tussenstanden

`templates/checkout/form-checkout.php` toont één formulier. `LLMS_Order_Generator::generate()` valideert eerst de velden. Daarna maakt `commit_user()` via `llms_register_user()` de gebruiker aan en pas daarna maakt `create()` de order. Het gevolg is duidelijk: een weggevallen betaalvenster wist de identiteit noch de pending order.

De standaard blokdefinities staan in `includes/schemas/llms-reusable-blocks.php`. Ze kunnen in beheer worden aangepast, dus de lijst in de tabel is een schone standaard en geen universele contracteis voor elke LifterLMS-site. `templates/checkout/form-confirm-payment.php` is een mogelijke tweede zichtbare stap als een gateway bevestiging van een bestaande order verlangt.

De betaalactie heet afhankelijk van de situatie `Buy Now` of `Enroll Now`. Dezelfde pagina bevat de coupon en juridische toestemming. LifterLMS komt hiermee het dichtst bij een samenhangende single-page checkout, maar vraagt standaard veel meer gegevens dan voor alleen digitale toegang nodig zijn.

### Tutor: loginmuur vóór een nette commercecheckout

De kernroute begint bij `templates/dashboard/registration.php` of login. In `classes/Utils.php` is `apply_filters( 'tutor_is_guest_checkout_enabled', false )` de beslisnaad. Core levert geen gastgebruiker die dit zelf afmaakt. Een uitbreiding kan de filter aanzetten en moet dan via `tutor_guest_user_id` een geldige gebruiker leveren.

Na optioneel `templates/ecommerce/cart.php` komt `templates/ecommerce/checkout.php`. De pagina bevat orderdetails, `checkout-billing.php`, payment methods, toestemming en `Pay Now`. De billingvelden staan in `templates/ecommerce/checkout-billing-form-fields.php`.

`Tutor\Ecommerce\CheckoutController::pay_now()` bewaart de billinggegevens, berekent de order en maakt een order met `PAYMENT_UNPAID` voordat de gateway wordt gestart. Bij terugkeer kan `get_valid_incomplete_order()` die order opnieuw gebruiken. `templates/ecommerce/order-placement-failed.php` geeft de koper daardoor een concrete weg terug in plaats van een dood einde.

### LearnPress: dezelfde pagina kan registratie én gastkoop dragen

De basis staat in `templates/checkout/form.php`; `inc/lp-template-hooks.php` bepaalt de onderdelen. De order review wordt vóór het formulier gehangen. Binnen het formulier volgen de mogelijke accountpanelen, ordernotitie, betaalmethode en voorwaarden. Login, registratie en gast zijn alternatieve toestanden, geen drie opeenvolgende stappen.

`templates/checkout/account-register.php` vraagt email, username, password en bevestiging. `templates/checkout/guest-email.php` vraagt alleen email en legt uit dat de order key na betaling wordt verstuurd. Registratie is alleen beschikbaar wanneer WordPressregistratie is toegestaan; gastcheckout staat in de standaardinstelling uit.

De checkoutcontrole valideert of registreert de gebruiker vóór `create_order()` een pending order maakt. Voor een gast blijft de identiteit aan email en order key hangen. De corebetaling abstraheert de gateway, waardoor er geen betrouwbaar algemene fouttekst te citeren is. Ik vond ook na gericht zoeken op coupon, coupon code en discount geen couponformulier of kortingsberekening in deze coreversie.

## 3. Funnel-machinerie

### Wat werkelijk in de kern zit

| Functie | LearnDash | Tutor | LearnPress | LifterLMS | Sensei core |
| --- | --- | --- | --- | --- | --- |
| Order bump of one-click upsell | Niet gevonden | Niet gevonden | Niet gevonden | Niet gevonden | Niet gevonden |
| Cross-sell op checkout | Niet gevonden | Niet gevonden | Niet gevonden | Niet gevonden | Niet gevonden |
| Verlaten winkelmand terughalen | Niet gevonden | Niet gevonden | Niet gevonden | Niet gevonden | Niet gevonden |
| Aanbevolen cursussen | Geen standaardblok | Geen native blok gevonden | Automatisch, maximaal vier op gedeelde categorie | Alleen handmatig te plaatsen shortcode | Niet gevonden |
| Bundel | LearnDash Group kan meerdere cursussen ontsluiten; commerce vraagt een gateway of integratie | Course bundle heeft extensienaden, maar de uitvoerende Pro-code zit niet in deze corebron | Niet in core gevonden | Membership kan meerdere cursussen leveren | Niet in core |
| Termijnen of abonnement | Eigen recurring instellingen, inclusief een eindig aantal betalingen en trial | Subscription-hooks en types zijn aanwezig als extensienaad; implementatie zit niet in de onderzochte core | Niet in core gevonden | Meerdere access plans, eenmalig of recurring, eindig of doorlopend, met trial | Niet in core |
| Coupon | Corecheckout | Corecommerce | Niet in core gevonden | Corecheckout | Niet in core |

Voor de eerste drie rijen heb ik per bronboom gericht gezocht op varianten van `order bump`, `upsell`, `one click`, `cross-sell`, `cart abandonment`, `abandoned cart`, `recovery` en verwante class- en hooknamen. De treffers voor upsell bleken adminpromoties of compatibiliteitscommentaar, geen kopergerichte funnel. `Niet gevonden` betekent hier dus: geen uitvoerende native implementatie in de onderzochte versie. Het sluit een Pro-add-on, WooCommerce-uitbreiding of maatwerkhook niet uit.

### LearnDash plus WooCommerce: productmapping, geen funnelbouwer

De WooCommerce-koppeling maakt van een WooCommerce-product een toegangspakket. In `includes/class-learndash-woocommerce.php` en de productmodellen worden `_related_course` en `_related_group` gebruikt. Een product of variatie kan daardoor meerdere cursussen en groepen leveren.

De integratie forceert de accountvereiste via de WooCommerce-filters `woocommerce_checkout_registration_enabled` en `woocommerce_checkout_registration_required`. Op ingestelde orderstatussen wordt toegang toegekend. Bij refund, cancellation en relevante subscriptionstatussen kan zij toegang intrekken. De precieze WooCommerce-orderstatussen zijn beheerbaar in de add-on.

Dat is een heldere architectuurgrens:

* WooCommerce bezit catalogus, winkelmand, checkout, coupons en de plekken waar WooCommerce of andere uitbreidingen een upsell of cross-sell kunnen tonen.
* LearnDash WooCommerce Integration 2.0.2 bezit alleen de mapping van betaald product naar cursus- of groepstoegang en de synchronisatie bij statuswijzigingen.
* Ik vond in de integratie zelf geen order-bumpwidget, upsellalgoritme of verlaten-winkelmandproces.

Een LearnDash Group is functioneel een bundel aan de toegangskant. Het is niet vanzelf een samengestelde aanbieding op de checkout. Daarvoor moet één extern product aan de groep worden gekoppeld, of moeten meerdere cursus-ID's aan een product hangen.

### ThriveCart: de volledige externe aankoop komt terug als `purchase_map`

`LearnDash_Thrivecart_Integration` in `includes/class-thrivecart-integration.php` luistert op `init` naar een request met `?learndash-integration=thrivecart`. `is_transaction_valid()` controleert het POST-veld `thrivecart_secret`. De filter `learndash_thrivecart_process_webhook` kan de verwerking tegenhouden of uitbreiden.

De gegevensstroom is concreet:

1. Bij `event === 'order.success'` leest de integratie `customer` en de array `purchase_map`.
2. Ieder extern ID, bijvoorbeeld `product-123`, wordt opgezocht in custom post type `ld-thrivecart` via meta `_ld_thrivecart_product_id`.
3. De mapping bevat `_ld_thrivecart_courses` en `_ld_thrivecart_groups`.
4. `add_access()` zoekt of maakt de WordPressgebruiker op `customer.email` en roept `ld_update_course_access()` of `ld_update_group_access()` aan.
5. Na gebruikersaanmaak bestaat de action `learndash_thrivecart_after_create_user`.

De integratie begrijpt daarnaast `order.refund`, `order.subscription_payment`, `order.subscription_completed` en `order.subscription_cancelled`. Bij annulering kan zij verwijdering uitstellen tot `subscription.billing_period_end` via WP Cron action `learndash_thrivecart_access_removal`. Een instelling en `filter_webhook_process()` bepalen of een gedeeltelijke refund toegang laat staan.

Hier zit de reden om een externe cart te gebruiken. Order bumps, een upsell- of downsellpagina, een externe checkout en eventuele cart-recovery worden vóór de webhook door ThriveCart afgehandeld. LearnDash hoeft alleen de uiteindelijke gekochte ID's te begrijpen. De add-on kent geen semantisch verschil tussen het hoofdproduct en een bump. Als beide als ID in `purchase_map` staan en beide zijn gemapt, worden beide uitgevoerd. Als een extern funnelonderdeel geen gemapt ID terugstuurt, kan LearnDash er niets mee.

De precieze schermen en regels van die externe funnel zijn niet uit deze WordPress-add-on te verifiëren. De code bewijst wel de grens en de terugspraak, niet hoe ThriveCart zijn checkout op dit moment configureert.

### SamCart: één product-ID per notificatie

`LearnDash_Samcart_Integration` in `includes/class-samcart-integration.php` gebruikt `?learndash-integration=samcart`. Als een secret is ingesteld, moet de query ook de juiste `secret_key` bevatten. De filter `learndash_samcart_process_notification_url` kan het JSON-request blokkeren.

De payloadvelden die de code daadwerkelijk leest zijn `type`, `product`, `customer` en `order`. De koppelsleutel is `product.id`. Custom post type `ld-samcart-product` bewaart die in `_ld_samcart_product_id`; `_ld_samcart_courses` bevat de bijbehorende LearnDash-cursus-ID's. In deze versie vond ik geen SamCart-mapping naar LearnDash Groups.

De gebruiker wordt gevonden op `customer.email` of na de aankoop aangemaakt met `customer.first_name` en `customer.last_name`. Daarna volgt `learndash_samcart_after_create_user`. De types `Refund`, `Cancel` en `RecurringPaymentFailed` zetten `$remove` op `true`; andere types verlenen toegang en leggen een `sfwd-transactions` record vast.

Ook hier leeft de funnel buiten het LMS. SamCart kan een koper langs zijn eigen hoofdproduct, bump en vervolgoffers sturen, maar deze integratie ontvangt per notificatie één `product.id` en kent alleen die mapping. Elke extra aanbieding moet dus een eigen gemapt product en een passende notificatie opleveren. De add-on bouwt zelf geen bump, upsell of herstelmail.

### De bruikbare native uitzonderingen

LifterLMS heeft geen klassieke funnel, maar `LLMS_Access_Plan` maakt wel aanbodarchitectuur mogelijk. Eén cursus kan naast elkaar een eenmalige koop, termijnen, een abonnement en een trial tonen. Memberships kunnen cursusrechten bundelen. Dit zijn prijskeuzes op één verkooppagina, geen post-purchase upsells.

Tutor core heeft een echte multi-item cart, `Buy Now`, sale pricing en coupons. De bron bevat extensienaden zoals `tutor_checkout_subscription_item` en `tutor_get_plan_info`, plus verwijzingen naar course bundles. De concrete Pro-klassen die abonnementen of bundles uitvoeren waren niet aanwezig, dus hun bezoekersflow heb ik niet als corefunctionaliteit geteld.

LearnPress heeft als enige van deze coreversies een automatisch gerelateerd-cursussenblok op de standaard moderne pagina. Dat is een cross-navigation na de inhoud, niet een checkout-cross-sell. Sensei core heeft zonder commerce evenmin een funneloppervlak.

## 4. Gratis naar betaald in code

### Vier verschillende vormen van inkijk

| LMS | Publieke belofte | Toegang tot een proefonderdeel | Wat een gesloten onderdeel zegt of doet |
| --- | --- | --- | --- |
| LearnDash | Cursuspagina met status, prijs en curriculum, tenzij de inhoudstabel is uitgezet. | Een lesson met sample-status omzeilt in `LearnDash\Core\Models\Step::is_content_visible()` de normale toegang, zolang geen latere beschikbaarheidsdatum blokkeert. | Niet-zichtbare lesinhoud wordt niet gerenderd. Op de cursuspagina stuurt de infobar naar `Get Started`; op de directe gesloten les vond ik geen uniforme kooptekst in de standaardtemplates. |
| Tutor | Cursusinfo, leeruitkomsten, curriculum en reviews blijven publiek. | `_is_preview` opent een afzonderlijke `single-preview-lesson.php`. Een cursus kan daarnaast geheel public zijn. | `templates/single/lesson/required-enroll.php` zegt `Permission Denied` en `Please enroll in this course to view course content.`, noemt de cursus en biedt `View Course`. |
| LearnPress | Overzicht, curriculum, docent, FAQ en prijs blijven als verkooppagina publiek. | `_lp_preview` markeert een curriculumitem als preview en maakt het bereikbaar zonder cursusrecht. | `templates/single-course/content-protected.php` zegt tegen een gast: `This content is protected, please login and enroll in the course to view this content!`. Het woord login is een link. Een ingelogde bezoeker krijgt de message uit het access-resultaat. |
| LifterLMS | Hoofdinhoud, prijstabel en syllabus staan vóór de restrictie op individuele lessen. | Een lesson met de optie `Free Lesson` omzeilt `llms_page_restricted()` zonder inschrijving. Een access plan kan daarnaast een gratis of betaalde trial hebben. | Een gesloten syllabusregel is geen link en toont de restrictiereden. Bij direct bezoek wordt naar de cursus teruggestuurd. De standaardtekst is `You must enroll in this course to access course content.` en is per cursus aanpasbaar. |
| Sensei | Cursusinhoud of excerpt, modules, lessen en het aantal previews zijn publiek. | Een preview lesson wordt als `This is a preview lesson` behandeld en kan, afhankelijk van de logininstelling, direct leesbaar zijn. | `templates/course-theme/locked-lesson-notice.php` toont `You don't have access to this lesson`. Een gast krijgt `Please register or sign in to access the course content.` met `Take course` en `Sign in`. Een ingelogde bezoeker krijgt `Please register for this course to access the content.` met `Take course`. |

LearnDash heeft ook een financiële proefperiode voor recurring toegang. De proefles en de trial zijn verschillende mechanismen. De proefles is contentmetadata; de trial hoort bij prijs- en betaalinstellingen. LifterLMS maakt hetzelfde onderscheid met `Free Lesson` en de trialgegevens van een access plan.

Tutor en LearnPress core bieden contentpreviews, maar in de geïnspecteerde corecode vond ik geen volwaardige gratis abonnementsproefperiode. Tutor bevat wel hooks voor een afzonderlijke subscriptionuitbreiding. Sensei core verkoopt niet en heeft daarom alleen de stap van publiek naar ingeschreven, niet van gratis naar betaald.

Geen van de vijf maakt puur op basis van de positie automatisch de eerste les gratis. Ik heb daar gericht op gezocht. LearnDash sample, Tutor `_is_preview`, LearnPress `_lp_preview`, LifterLMS `Free Lesson` en Sensei preview lesson zijn expliciete keuzes per onderdeel. `Eerste les gratis` is dus een redactionele configuratie, geen vaste funnelregel.

De beste gesloten schermen doen twee dingen tegelijk: ze leggen uit waarom inhoud dicht is en bieden één betekenisvolle terugweg. Tutor en Sensei doen dat expliciet. LearnPress noemt login en inschrijven in de tekst. LifterLMS brengt de bezoeker terug naar de pagina waar de prijsplannen al staan. LearnDash' standaard lesgating is technisch correct, maar de directe gesloten les is als verkoopmoment minder expliciet dan zijn cursusinfobar.

## 5. Prijsweergave

| LMS | Formatter en valuta | Actieprijs of vergelijkprijs | Eenmalig tegenover recurring |
| --- | --- | --- | --- |
| LearnDash | `learndash_get_price_formatted()` in `includes/payments/ld-payments-functions.php`. Gebruikt indien beschikbaar `NumberFormatter` met locale; anders valuta-instellingen, symbool en positie. | Geen native regular-price plus sale-price paar gevonden in core. Coupons veranderen het ordertotaal pas in de checkout. | Eenmalig toont het bedrag. Recurringtemplates tonen onder meer `Every ...`; bij trial eerst `%1$s for %2$s %3$s`, daarna `Then ...`. Een eindig `recurring_times` wordt ondersteund. |
| Tutor | `tutor_get_formatted_price()` in `includes/tutor-general-functions.php`, met code of symbool, links of rechts, decimalen en scheidingstekens. Kan delegeren aan WooCommerce, EDD of Paid Memberships Pro. | `templates/single/course/add-to-cart-tutor.php` toont de actuele prijs en zet de reguliere prijs in `<del>`. Ook `Incl. tax` kan verschijnen. | Core kent extensienaden voor subscriptions, maar de uitvoerende addon en zijn precieze prijszin ontbreken uit deze bronset. |
| LearnPress | `learn_press_format_price()` in `inc/order/lp-order-functions.php`, met valuta, positie, decimalen en scheidingstekens plus filters. | `SingleCourseTemplate::html_price()` rendert `origin-price` en `price`, dus een echte compare-at weergave. | Geen recurring prijsmodel of abonnementszin in core gevonden. |
| LifterLMS | `llms_price()` gebruikt het ingestelde valutasymbool, positie met of zonder spatie, decimalen en scheidingstekens. Nuldecimalen kunnen worden getrimd. | `templates/product/access-plan-pricing.php` toont een `SALE` label, reguliere prijs, actieprijs, planning en eventueel einddatum. | Access plans drukken eenmalig, terugkerend en een eindig aantal betalingen uit. `access-plan-trial.php` voegt `TRIAL`, proefprijs en duur toe. Meerdere plannen staan naast elkaar. |
| Sensei core | Geen prijsformatter in de onderzochte corebron. | Niet van toepassing. | Niet van toepassing. |

Ik heb ook gericht gezocht naar een bezoekerslabel als `Starting at`, `From`, `As low as` of `Vanaf` zonder de spatie. In de prijs- en frontendcode vond ik geen native vanaf-prijs. LearnDash, Tutor en LearnPress tonen de prijs van het concrete aanbod. LifterLMS vat zijn meerdere access plans niet samen tot één minimumprijs, maar rendert de afzonderlijke plannen. Sensei core heeft geen prijs.

### LearnDash: correcte valuta, beperkte merchandising

`learndash_get_price_formatted()` is degelijk internationalisatiegereedschap. Met PHP `NumberFormatter` wordt de locale gebruikt. De fallback kiest het geconfigureerde symbool of de valutacode en zet een enkel teken doorgaans vóór het getal, terwijl een langere code erachter kan komen. Filters laten maatwerk toe.

De productdata en templates bevatten in core geen afzonderlijke reguliere prijs en sale price die samen een doorgestreepte vergelijkprijs vormen. Ik heb gericht gezocht op `sale_price`, `regular_price`, `compare_at` en bijbehorende templateklassen. Coupons bestaan wel, maar maken de cursuskaart niet tot een actiekaart.

De recurringtemplates onder `themes/ld30/templates/modern/course/sidebar/enrollment/pricing/recurring/` splitsen een trial en het normale ritme. Daardoor kan de bezoeker eerst een proefprijs met duur zien en daarna een `Then` regel. Zonder trial staat het interval centraal. De datalaag ondersteunt ook een beperkt aantal herhalingen, zodat termijnen niet als eindeloos abonnement hoeven te worden gepresenteerd.

### Tutor en LearnPress: sale pricing is zichtbaar verkoopbewijs

Tutor houdt de formatter in `tutor_get_formatted_price()`, maar laat de actieve monetization engine beslissen wanneer WooCommerce, EDD of Paid Memberships Pro de betaling bezit. In de eigen Tutor-commercevariant toont `add-to-cart-tutor.php` de displayprijs en daarna de reguliere prijs in `<del>`. Dat is de klassieke huidige prijs plus vergelijkprijs. Belasting kan als `Incl. tax` worden vermeld.

LearnPress doet hetzelfde via `LearnPress\TemplateHooks\Course\SingleCourseTemplate::html_price()`: een eventuele oude prijs krijgt `origin-price`, de verkoopprijs `price`. `learn_press_format_price()` beheert symbool, code, positie en scheidingstekens. In core is dit een eenmalige prijs. Ik vond geen abonnementsmodel dat een periode of aantal termijnen op de cursuspagina formuleert.

### LifterLMS: de prijs is een aanbodmodel

Bij LifterLMS is niet de cursus maar het access plan de verkoopeenheid. Daardoor kan dezelfde cursus meerdere planblokken hebben met eigen titel, beschrijving, prijs, beperkingen en CTA. `templates/product/access-plan-pricing.php` kan een reguliere prijs, actieprijs, `SALE`, startplanning en vervaldatum tonen. `templates/product/access-plan-trial.php` voegt afzonderlijk de trial toe.

Dit is krachtig, maar maakt de pagina ook snel druk. De code kan een eenvoudige aankoop, drie termijnen, een doorlopend abonnement en een trial naast elkaar zetten. Dat is alleen betere conversie wanneer de keuzes werkelijk een duidelijk klantprobleem oplossen.

## Wat ons cursuspagina- en checkoutontwerp hiervan zou lenen

Beleggingscollege verkoopt losse cursussen van 49 euro in een Next.js 15 App Router-app en verwerkt betalingen via Mollie. Het huidige slotscherm laat niet-kopers het curriculum al zien. Dat is een goede basis. De codevergelijking wijst niet naar méér funnel, maar naar een beter geordende route met minder onzekerheid.

### Prioriteit 1: maak het bestaande slotscherm de feitelijke verkooppagina

Dit levert waarschijnlijk het meeste op tegen de laagste bouwkosten:

1. Houd het volledige curriculum zichtbaar, zoals LearnDash, Tutor, LearnPress en Sensei doen. Markeer wat de koper direct krijgt en toon duur of lesvorm alleen waar die informatie echt bekend is.
2. Zet boven het curriculum één rustig koopblok met cursustitel, een feitelijke samenvatting, `€ 49 eenmalig` en één primaire actie, bijvoorbeeld `Koop deze cursus`.
3. Herhaal na het curriculum dezelfde actie en prijs. Geen nieuwe formulering, geen tweede aanbod. De bezoeker die het bewijs heeft gelezen hoeft niet terug te zoeken.
4. Voeg vóór het curriculum een compact blok `Dit leer je` toe met concrete uitkomsten uit de echte cursusinhoud. Tutor en LearnPress laten zien dat dit het verschil vormt tussen een inhoudsopgave en een koopargument.
5. Laat `heeftToegangTot()` in `src/lib/entitlements.ts` de enige toegangspoort blijven. Het slotscherm en de knop zijn presentatie; zij mogen nooit een tweede autorisatieregel worden.

De prijszin moet overal identiek zijn: `€ 49 eenmalig`. Geen `vanaf`, geen doorgestreepte adviesprijs en geen tijdelijke actie zolang er geen echte andere prijs en aantoonbare actieperiode bestaat.

### Prioriteit 2: voeg één eerlijke proefles toe wanneer de inhoud daarvoor geschikt is

Een preview is de meest productgerichte vorm van bewijs. Tutor, LearnPress, LifterLMS en Sensei hebben daar allemaal expliciete itemmetadata voor. Voor Beleggingscollege is één representatieve, inhoudelijk afgeronde les beter dan een willekeurig afgeknipt fragment.

De goedkoopste veilige implementatie is een server-side eigenschap op een les, bijvoorbeeld `isPreview`, die dezelfde contentroute gebruikt maar vóór `heeftToegangTot()` een strikt beperkte uitzondering krijgt. Die uitzondering moet op les-ID zijn gebaseerd, niet op een queryparameter vanuit de browser. De cursuspagina kan de les markeren met `Proefles` en er rechtstreeks naartoe linken.

Als zo'n les nog niet redactioneel is gekozen en gecontroleerd, is alleen het zichtbare curriculum eerlijker dan een zwakke preview. De pagina mag geen `Probeer gratis` beloven voordat de route echt werkt.

### Prioriteit 3: laat Mollie-fouten terugkeren naar een herstelbare betaalstatus

De beste checkoutpatronen uit LifterLMS en Tutor zijn niet hun hoeveelheid velden, maar hun herstelbare tussenstand. Beleggingscollege heeft al `payment_attempts` en `entitlements`. Gebruik die scheiding zichtbaar:

* Maak of hergebruik één pending `payment_attempt` vóór de redirect naar Mollie.
* Ken pas na een geverifieerde succesvolle webhook een entitlement toe.
* Laat annuleren of falen terugkomen op een pagina met cursusnaam, bedrag, status in gewone taal en één actie `Opnieuw betalen`.
* Maak die actie idempotent, zodat verversen of een dubbele webhook geen dubbel recht of dubbel intern orderrecord oplevert.
* Bewaar het curriculum op de terugkeerpagina als context, maar maak de foutmelding en herstelactie het eerste schermdeel.

Vraag vóór betaling alleen gegevens die betaling, accountkoppeling of wettelijke administratie echt vereisen. Kopieer niet de lange standaardadresformulieren van LifterLMS of Tutor voor een digitaal product als Mollie en onze administratie die velden niet nodig hebben. Een aparte WordPress-achtige username, voornaam, achternaam en wachtwoordstap vóór de betaalkeuze zou in deze app extra frictie zijn. Koppel de betaalpoging aan de bestaande ingelogde gebruiker en laat de huidige authenticatiemethode de identiteit bezitten.

### Prioriteit 4: bouw pas later aanbevelingen, en dan na de hoofdtaak

LearnPress' categoriegerelateerde cursussen zijn een bruikbaar patroon wanneer er genoeg aanbod is. Voor losse cursussen van 49 euro zou ik ze eerst op de bedankpagina en in het cursistendashboard zetten, niet als cross-sell in de checkout. De koper moet één beslissing afronden.

Een simpele aanbeveling kan later uit gedeelde onderwerpen komen en moet maximaal twee relevante cursussen tonen. Meet eerst of bezoekers de cursuspagina begrijpen, op de CTA klikken, Mollie bereiken en na een fout opnieuw proberen. Zonder die basis is een aanbevelingsalgoritme afleiding.

### Wat we juist niet moeten overnemen

* Geen order bumps, one-click upsells of downsellketens. Ze passen niet bij de rustige, uitleggende positionering en lossen voor een catalogus met losse cursussen geen huidig probleem op.
* Geen verzonnen reviews, aantallen cursisten of vaste vijf sterren zoals het vrije featured-reviewveld van LearnPress kan suggereren. Toon pas sociaal bewijs wanneer het echt, herleidbaar en met toestemming verzameld is.
* Geen kunstmatige schaarste, aftellers of doorgestreepte prijzen. Een saleweergave is alleen correct bij een echte eerdere prijs en een echte eindvoorwaarde.
* Geen couponveld dat permanent zichtbaar is wanneer er geen actief couponbeleid bestaat. Zo'n veld vertelt iedere koper zonder code dat die mogelijk te veel betaalt.
* Geen abonnement, trial of termijnkeuze voor een product dat gewoon 49 euro eenmalig kost. LifterLMS bewijst dat veel prijsflexibiliteit technisch kan, niet dat zij voor deze propositie wenselijk is.
* Geen lange checkout met adres, telefoon, aparte username en dubbel wachtwoord alleen omdat LMS-plugins dat standaard doen. Hun defaults bedienen veel bedrijfsmodellen tegelijk; onze checkout mag specifiek zijn.

De kern die wel het lenen waard is, past in één rustige lijn: laat inhoud zien, leg concreet uit wat de bezoeker leert, noem één volledige prijs, geef één veilige koopactie, en breng een mislukte betaling terug naar een duidelijke herstelknop. Dat vergroot het conversie-oppervlak zonder de belofte van Beleggingscollege te verwateren.
