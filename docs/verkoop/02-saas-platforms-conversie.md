# 02 — Wat de gehoste cursusplatforms aan verkooplaag hebben gebouwd

> Geschreven 5 augustus 2026. Onderzoek naar **Teachable, Thinkific, Kajabi en Podia**, met zijstappen naar Gumroad en Maven. Deze bedrijven hosten samen honderdduizenden cursusondernemingen en hebben het verkoopoppervlak veel verder uitgeoptimaliseerd dan welke WordPress-plugin ook. De vraag is niet "wat kunnen zij", maar: **welk stuk daarvan is bewezen, welk stuk is gewoonte, en welk stuk is verkooppraat van een leverancier die aan onze omzet verdient?**
>
> Verwante documenten: `docs/learndash/18-wat-we-ermee-doen.md` (de technische conclusies uit het LearnDash-spoor), `docs/prijsstrategie.md` (de prijsbesluiten en de juridische randvoorwaarden), `docs/college-plus-concept.md`.
>
> **Dit is onderzoek, geen backlog.** Wat Jason overneemt hoort daarna in `docs/openstaand.md` of `docs/ideeen.md`.

Overal in dit document staat per bevinding een label:

| Label | Betekenis |
|---|---|
| **[bewijs]** | Er ligt een meting of dataset onder, met een vindbare bron. Bias staat er expliciet bij. |
| **[conventie]** | Iedereen doet het zo, en dat is het enige argument. Kan prima kloppen, maar het is niet gemeten. |
| **[vulling]** | Contentmarketing. Een getal zonder herleidbare bron, of advies dat het belang van de leverancier dient. |

---

## 1. De belangrijkste vondst: hun sjabloon en hun advies zijn niet hetzelfde document

Dit is het gat waar je iets aan hebt. Vraag deze bedrijven wat een verkooppagina moet bevatten, en je krijgt een lange lijst. Kijk wat hun product je **standaard geeft** als je een cursus aanmaakt, en je krijgt bijna niets. Dat verschil is informatief, want het advies is geschreven door hun marketingafdeling en het sjabloon door hun productafdeling, en alleen die tweede groep draagt de gevolgen van een pagina die niemand invult.

### 1.1 Wat het advies zegt

Teachables eigen "sales page formula" bestaat uit acht blokken, in deze volgorde ([Teachable, How to Create a Powerful Sales Page](https://www.teachable.com/blog/powerful-sales-page)):

1. Kop / hero
2. Cursusbeschrijving
3. Case study of testimonial
4. **CTA-knop**
5. Docentbio
6. Case study of testimonial (nogmaals)
7. FAQ
8. **CTA-knop** (nogmaals)

**Kijk wat er níét in staat:** geen curriculumoverzicht, geen prijsblok, geen garantie, geen "voor wie is dit". Wél twee keer social proof, in twee van de acht posities. **[conventie]**

Hun landingspagina-artikel geeft een kortere, andere lijst: kop, subkop, beeld, voordelen, social proof, CTA ([Teachable, How To Create Great Landing Pages](https://www.teachable.com/blog/best-practices-for-great-landing-page-design)). En hun UX-artikel geeft weer een derde indeling, ditmaal zonder inhoudelijke blokken: visuele hiërarchie, duidelijkheid boven de vouw, onmisbare CTA, snelheid, vertrouwenssignalen, mobiel, meten ([Teachable, 7 Proven UX Tips](https://www.teachable.com/blog/course-sales-page-conversions)). Drie artikelen van één leverancier, drie verschillende lijsten. Dat is op zichzelf al een aanwijzing dat er geen gemeten "juiste volgorde" bestaat. **[conventie]**

Bureaus rond Kajabi vatten het samen als **hook → outcomes → proof → details → risk reversal → CTA** ([parker.media](https://www.parker.media/blog/kajabi-sales-page-templates), [jiffycoursesonline](https://www.jiffycoursesonline.com/blog/8-proven-ways-to-boost-your-kajabi-sales-page-conversions)). Dat is niet van Kajabi zelf, maar het is wel de enige formulering die "risk reversal" (garantie, herroeping, wat-als-het-niets-voor-me-is) als eigen stap benoemt. Voor ons merk is dat de interessantste stap van de zes. **[conventie]**

### 1.2 Wat het sjabloon geeft

Thinkific is hier het eerlijkst, want hun documentatie is niet geschreven om te overtuigen. Een cursuspagina wordt aangemaakt met **precies twee secties** ([Thinkific Support, Build Your Course Page](https://support.thinkific.com/hc/en-us/articles/360030727293-Build-Your-Course-Page)):

1. **Banner**: cursusnaam, cursusbeschrijving en een dynamische koopknop die naar de checkout linkt.
2. **Curriculum**: automatisch gevuld met alle hoofdstukken en lessen die niet op concept staan.

Al het andere (testimonials, docentbio, FAQ, garantie, prijsvergelijking) is een optionele sectie die je zelf toevoegt. Podia doet hetzelfde principe: elk product krijgt een ingebouwde verkooppagina die je daarna aankleedt ([Podia, Features](https://www.podia.com/features)). Kajabi werkt met secties die uit blokken bestaan, met voorgevulde presets ([Kajabi Help, Add Sections](https://help.kajabi.com/articles/website/pages/add-sections-to-your-pages)). Teachable geeft blokken waarvan het curriculumblok en het bundelblok de enige zijn die zichzelf vullen ([Teachable Help, Page Blocks](https://support.teachable.com/en/articles/11682518-page-blocks-page-editor-1-0)).

**De conclusie die hieruit volgt, en die voor ons de hele sectie waard is:** de enige twee dingen die deze platforms belangrijk genoeg vinden om automatisch neer te zetten zijn **een belofte met een koopknop** en **het volledige lesoverzicht**. Precies de twee dingen die een maker zonder klanten al kán invullen. De rest van hun eigen adviesformule (twee testimonialblokken van de acht) is voor een nieuwe verkoper letterlijk niet in te vullen. **[bewijs, in de zwakke zin: dit is een observatie over hun productgedrag, niet een A/B-test]**

### 1.3 Wat dat voor ons betekent

Wij hebben de Thinkific-standaard al: `/cursussen/[slug]` toont beschrijving plus curriculum, en toont niet-kopers het curriculum in plaats van een startknop. Wat er ontbreekt ten opzichte van de gedeelde formule is niet social proof (die mogen we niet verzinnen), maar:

- **Een expliciete uitkomstbelofte boven de vouw** ("na deze cursus kun je X"), los van de cursusbeschrijving.
- **Een prijsblok op de cursuspagina zelf**, niet alleen een knop.
- **Een risk-reversal-blok.** Zie §7.
- **Een FAQ op de pagina**, niet alleen op `/veelgestelde-vragen`.

---

## 2. Checkout

Hier is het beeld veel concreter dan bij de verkooppagina, want het zijn features en geen meningen.

| | Teachable | Thinkific | Kajabi | Podia |
|---|---|---|---|---|
| Checkout | eigen, met Teachable:Pay | eigen (Thinkific Payments/Stripe) | eigen, per offer een checkoutpagina | **één pagina**, expliciet als kenmerk |
| Order bump (op de checkout) | ja | beperkt | ja, als vinkje in de zijbalk | **nee** |
| Upsell (ná betaling) | ja | beperkt | ja, aparte pagina met eigen verkooptekst | ja, tot 3 producten, reeds gekochte uitgesloten |
| Betaalplan / termijnen | ja | ja | ja | ja |
| Abonnement | op alle plannen sinds juni 2025 | vanaf Start-plan | ja | ja |
| Verlaten winkelwagen | ja, automatisch (Basic max 15 mails, Pro onbeperkt en aanpasbaar) | via integratie | ja | **nee** |
| Btw / lokale belasting | Teachable:Pay regelt btw, GST, US sales tax | Stripe Tax | ja | 230 jurisdicties |
| iDEAL | via Stripe | via Stripe | via Stripe | **ja, expliciet genoemd** |

Bronnen: [Podia checkout-update](https://www.podia.com/articles/checkout-updates), [Podia Help, upsells](https://help.podia.com/en/articles/11370406-offering-upsells), [Teachable Help, abandoned cart](https://support.teachable.com/en/articles/11682443-abandoned-cart-emails), [Kajabi Help, upsells vs order bumps](https://help.kajabi.com/en/articles/12695543-what-is-the-difference-between-an-upsell-and-order-bump), [Thinkific Support, pricing](https://support.thinkific.com/hc/en-us/articles/360030356354-Set-Your-Course-Pricing).

**Vier dingen die opvallen.**

**a) Eén pagina is de norm, en Podia verkoopt het als kenmerk.** Ze hebben hun checkout herbouwd zodat bestelgegevens, kortingscode en betaalkeuze op één scherm staan in plaats van in stappen ([Podia](https://www.podia.com/articles/checkout-updates)). Niemand in deze groep verkoopt een meerstapscheckout als voordeel. **[conventie, breed gedragen]** Wij hebben dit al: koopknop → Mollie → terug. Wat wij daar wél bovenop hebben zitten is een inlogeis vóór de betaling. Dat is bij ons een gevolg van entitlements aan een gebruikers-id hangen, maar het is wel de grootste frictie die deze platforms bewust hebben weggehaald.

**b) Order bumps: het meest onderbouwde cijfer in dit hele document, en tegelijk het slechtst passende.** SamCart claimt over meer dan 7 miljard dollar aan verwerkte transacties dat order bumps gemiddeld 30 tot 40% converteren ([SamCart](https://www.samcart.com/blog/the-complete-guide-to-order-bumps)). Teachable meldt bij de lancering van hun eigen order-bumpfunctie ongeveer **8% hogere gemiddelde orderwaarde**, een gemiddelde orderwaarde van **circa $139**, en dat bijna 600 scholen de functie gebruikten voor ruim **$107.000 aan omzet** ([Teachable](https://www.teachable.com/blog/order-bumps-drive-sales)). **[bewijs, met stevige bias]** Let op dat laatste getal: $107.000 over 600 scholen is ongeveer $178 per school. Dat is een lanceerbericht, geen dataset. En SamCart is een checkoutleverancier die order bumps verkoopt.

Teachables eigen prijsregel maakt het voor ons meteen onbruikbaar: **bij een product onder $100 hoort een bump van rond $27 tot $37** ([Teachable, How to Price an Order Bump](https://www.teachable.com/blog/how-to-price-an-order-bump)). Bij een cursus van €49 is het enige product dat in die band valt Hefboomproducten à €29, en die als impulsartikel naast een andere cursus zetten is precies het signaal dat `docs/prijsstrategie.md` §1.2 wilde vermijden ("verschil in prijs leest als verschil in kwaliteit"). **Order bumps passen niet bij één prijs voor alles.**

**c) Verlaten winkelwagen is de goedkoopste echte omzetmachine in de tabel, en Podia heeft hem niet.** Teachable stuurt automatisch mail naar wie de checkout verlaat, en zet er op het instapplan een harde limiet op (15 unieke gebruikers), wat betekent dat ze het als betaalde waarde beschouwen. Bij ons ligt dit al klaar zonder dat er iets voor gebouwd is: `payment_attempts` heeft één rij per Mollie-betaling met status `pending`, mail werkt sinds vandaag, en sinds PR #42 is er nog maar één openstaande poging per gebruiker per cursus, dus ontdubbeling is al opgelost. Zie §8.

**d) Belasting en valuta zijn bij hen een platformdienst, bij ons een eigen keuze.** Alle vier regelen btw/GST automatisch. Wij rekenen bewust één prijs inclusief 21% Nederlandse btw tot de EU-drempel van €10.000 (`docs/prijsstrategie.md` §5.1). Dat is geen achterstand: het is het simpelere model, en het blijft simpel tot die drempel in zicht komt.

---

## 3. Van gratis naar betaald

Alle vier duwen dezelfde volgorde: **eerst een e-mailadres, dan pas een verkoop.** Wat ze daarvoor aanbieden verschilt.

**Gratis proefles binnen de betaalde cursus.** Thinkifics `Free Preview` markeert losse lessen als gratis: geen vervaldatum, geen limiet op het aantal gebruikers, en de bezoeker krijgt een koopprompt zodra hij de preview afrondt of op een vergrendelde les klikt ([Thinkific Support, Create a Free Course Preview](https://support.thinkific.com/hc/en-us/articles/360030722473-Create-a-Free-Course-Preview)). Podia heeft dezelfde mechaniek ([Podia, Online Courses](https://www.podia.com/online-courses)). **[conventie, maar unaniem]** Let op het praktische detail dat Thinkific noemt: hun Purchase-event vuurt niet bij een gratis preview, dus je moet zelf een conversie definiëren. Bij ons zou dat betekenen: meet "proefles afgerond" apart, anders zie je in Umami wel het bezoek en niet het effect.

Dit is dezelfde aanbeveling als punt 8 uit `docs/learndash/18-wat-we-ermee-doen.md`, nu bevestigd door een tweede, onafhankelijke groep leveranciers. Dat maakt het het best onderbouwde losse voorstel in beide documenten.

**Lead magnet en e-mailcursus.** Podia stelt het scherpst: het verschil tussen makers die veel verkopen en makers die niets verkopen is dat de eersten een lead magnet maken die mensen echt willen ([Podia, How to create a lead magnet](https://www.podia.com/articles/how-to-create-a-lead-magnet)). **[vulling in de formulering, conventie in de substantie]** Hun uitvoering is wél leerzaam: wie een lead magnet aanvraagt wordt automatisch doorgestuurd naar het betaalde aanbod en krijgt upsells in de checkout ([Podia Help, Building a complete sales funnel](https://help.podia.com/en/articles/11370933-building-a-complete-sales-funnel)). Teachable pusht specifiek de **e-mailcursus** als lead magnet: het is tegelijk een minimale versie van je product en een verkoopreeks, en je ziet wie meeleest ([Teachable, How to Create an Email Course](https://www.teachable.com/blog/email-course)). **[conventie]**

**Wachtlijst en cohort.** Maven is de enige die hier een getal aan hangt, en het is een toelatingseis en geen conversiecijfer: om in hun marktplaats te komen moet je **200 wachtlijstinschrijvingen of 5 betaalde inschrijvingen** hebben, te halen via gratis "Lightning Lessons" en je eigen netwerk ([Maven Help, course discovery](https://help.maven.com/en/articles/13228393-understanding-maven-s-course-discovery-system)). Ze waarschuwen expliciet: bouw eerst een wachtlijst via een interessepeiling, en **zet geen landingspagina online die gesloten is voor inschrijving** ([Maven Help, waitlist](https://help.maven.com/en/articles/5622854-all-about-your-course-waitlist)). **[conventie]**

De veelgeciteerde claim dat een warme wachtlijst op 5 tot 15% converteert tegenover 0,5 tot 2% bij koud verkeer komt van wachtlijstleveranciers ([LaunchList](https://getlaunchlist.com/waitlist-for-online-courses), [Waitlister](https://waitlister.me/use-cases/online-courses)) zonder methodologie of steekproef. **[vulling]** De richting is plausibel, het getal is niet bruikbaar.

**Wat hiervan bij ons past.** Onze gratis cursus van negen lessen ís de proef, en is royaler dan alle vier deze platforms adviseren. Wat we mísen is het stuk erna: er gebeurt niets automatisch als iemand die gratis cursus afrondt. Dat is bij deze platforms precies het moment waarop de koopprompt valt.

---

## 4. Prijsadvies dat ze publiceren

**Teachable adviseert minimaal $100** en noemt $97 tot $2.997 de gebruikelijke band, met de expliciete redenering "met premium pricing is meer echt meer, want minder vragen betekent minder verdienen" ([Teachable, How to Price Your Online Course](https://www.teachable.com/blog/how-to-price-your-online-course)). **[vulling]** en wel om drie redenen tegelijk: het is de Amerikaanse markt, het is zelfrapportage, en Teachable verdient aan transactievolume. Dit advies is niet neutraal.

Twee onderdelen van hun advies zijn wél bruikbaar:

- **Cohort- en liveformats horen hoger geprijsd dan zelfstudie**, omdat je directe toegang, groepssessies en feedback verkoopt ([Teachable](https://www.teachable.com/blog/how-to-price-your-online-course)). **[conventie]** Dat is exact de redenering waarmee `docs/prijsstrategie.md` §1.2 op €49 uitkomt in plaats van €99: wij leveren zelfstudie, dus wij horen aan de onderkant van de band. De marktleider bevestigt onze redenering, niet ons getal.
- **Wil je meer vragen, voeg dan iets toe** (spreekuren, interviews, begeleiding), niet alleen een hoger cijfer. **[conventie]** Zelfde logica als onze eigen regel dat €25 tot €29 voor College+ pas mag als er community of begeleiding tegenover staat.

**Abonnement versus eenmalig.** Teachable claimt dat leden **43% hogere lifetime value** hebben dan eenmalige kopers ([Teachable, Thinkific vs Teachable](https://www.teachable.com/blog/thinkific-vs-teachable)). **[vulling]**: geen steekproef, geen periode, geen definitie van LTV, en het staat in een vergelijkingsartikel dat hun eigen plannen verkoopt. Het spreekt bovendien onze eigen churn-aanname tegen (`docs/prijsstrategie.md` §1.5 rekent op 30 tot 50% churn per maand bij een statische catalogus). **Niet overnemen.** Onze redenering waarom een jaarplan het maandplan verslaat staat op eigen benen en is beter onderbouwd dan dit cijfer.

**Externe prijsdata, wél bruikbaar als context.** Een derde partij analyseerde 146.271 Gumroad-producten: cursussen kosten daar gemiddeld **$95,74**, de mediane maker verdient **$72 per maand**, en producten onder de $10 vertegenwoordigen ongeveer 35% van alle producten maar slechts **0,8% van de omzet** ([InsightRaider, Gumroad statistics 2026](https://insightraider.com/en/data/gumroad-statistics-2026)). **[bewijs]**, met de kanttekening dat dit een scrape is en Gumroad geen cursusplatform maar een digitale-productenwinkel. Die laatste 0,8% is wel het cijfer dat het beste ondersteunt waarom de oude €19,99 en zeker €4,99 niet werkten.

Kajabi meldt een gemiddelde van **$37.000 per maker per jaar** ([ElectroIQ](https://electroiq.com/stats/kajabi-statistics/)). **[vulling door selectie]**: hun goedkoopste plan kost $179 per maand, dus wie daar zit heeft al omzet. Datzelfde geldt voor hun claim uit het Creator Report 2025 dat makers met een communitycomponent 2x meer verdienen: dat is correlatie, en de aannemelijkste verklaring is dat wie al verkoopt zich een community kan veroorloven.

---

## 5. Wat ze een maker zonder publiek vertellen

Dit is onze situatie: nul verkopen, geen lijst. Ik heb bij alle vier gezocht naar het antwoord, en het antwoord is opvallend eensluidend en opvallend onbevredigend.

- **Thinkific**: zoek nieuwe gemeenschappen en groepen op, beantwoord vragen op plekken als Quora, geef webinars, en zet vooraf veel gratis waarde op je site ([Thinkific Support, Launch and Market Your Course](https://support.thinkific.com/hc/en-us/articles/360030354094-Launch-and-Market-Your-Course)).
- **Podia**: bouw eerst een lead magnet, dan een lijst, dan verkoop ([Podia](https://www.podia.com/articles/how-to-build-a-sales-funnel)).
- **Teachable**: e-mailcursus als instap, daarna de verkooppagina ([Teachable](https://www.teachable.com/blog/email-course)).
- **Maven**, en dit is de enige die concreet wordt: interview tien geïnteresseerden, voer **een op een gesprekken met elke geïnteresseerde student**, geef een gratis workshop, vraag ingeschreven studenten om verwijzingen. Zes weken, handmatig, zonder funnel ([Maven, 6-week plan](https://maven.com/resources/6-week-plan)).

**De eerlijke lezing: geen van deze platforms heeft een mechanisme dat de eerste koper produceert.** Alle vier zeggen dezelfde zin op vier manieren: ga elders mensen halen. Het platform converteert verkeer, het maakt geen verkeer. Dat is geen tekortkoming van hun product, het is de grens ervan, en het is precies de grens waar wij nu tegenaan zitten. Onze site is technisch af; wat ontbreekt is verkeer.

Mavens advies is het enige dat werkt bij nul, en het is ook het enige dat niet schaalt: praat met mensen. Voor Beleggingscollege vertaalt dat naar iets wat het merk toch al wil zijn, namelijk de redactionele lesvragen uit `docs/menselijke-elementen.md`: geen helpdesk, wel een echt mens die antwoordt. Dat is Mavens tactiek in productvorm.

---

## 6. De cijfers, en waarom je er weinig aan hebt

Ik zet ze hier bij elkaar met de bias erbij, zodat niemand ze later uit dit document plukt zonder het voorbehoud.

| Claim | Getal | Bron | Oordeel |
|---|---|---|---|
| Conversie verkooppagina cursus | 1 tot 3%; toppers 5 tot 10% | [acceleroi](https://www.acceleroi.com/blog/unlocking-success-exploring-the-average-conversion-rate-for-online-courses) | **[vulling]** Marketingbureau, geen methodologie, geen steekproef. Wordt overal geciteerd omdat het plausibel klinkt. |
| Conversie opt-inpagina | 3 tot 5%; toppers 8 tot 15% | idem | **[vulling]** Zelfde bron. |
| E-maillijst naar verkoop bij een lancering | 1 tot 3% van de lijst, tot 5%+ bij een warme lijst | breed geciteerd, o.a. [Paige Brunton](https://www.paigebrunton.com/blog/email-list-size-online-course) | **[conventie]** Consistent over veel bronnen, nergens gemeten. Bruikbaar als grove rekenregel, niet als voorspelling. |
| Afrondingspercentage zelfstudie | 5 tot 15% | [Skillademia-samenvatting](https://www.skillademia.com/statistics/online-course-completion-statistics/), teruggaand op MOOC-onderzoek (Columbia 15%, MIT 3,13%) | **[bewijs, maar niet over ons]** Die cijfers komen van gratis MOOC's. Betaalde zelfstudiecursussen liggen hoger (15 tot 25%), cohortcursussen 40 tot 70%. |
| Cursussen met coaching en community | 70%+ afronding tegenover 10 tot 15% zelfstudie | Thinkific 2024, via derden geciteerd | **[vulling]** Thinkific verkoopt community-functies. Bovendien selectie: wie coaching koopt is al gemotiveerder. |
| Order bump conversie | 30 tot 40% | [SamCart](https://www.samcart.com/blog/the-complete-guide-to-order-bumps) over $7 mrd transacties | **[bewijs met bias]** Grote dataset, leverancier van de functie. |
| Order bump effect bij Teachable | +8% orderwaarde, AOV ~$139 | [Teachable](https://www.teachable.com/blog/order-bumps-drive-sales) | **[bewijs met bias]** Lanceerbericht: 600 scholen, $107k totaal. Kleine basis. |
| Restitutiepercentage | 5 tot 10% over de meeste niches | breed geciteerd, geen primaire bron | **[conventie]** |
| Geld-terug-garantie | +21% verkopen, 12% restituties, netto +6,5% | één casus, herkomst onbekend | **[vulling]** Eén anekdote met precieze decimalen. Dat is een waarschuwingsteken, geen bewijs. |
| Leden hebben 43% hogere LTV | 43% | [Teachable](https://www.teachable.com/blog/thinkific-vs-teachable) | **[vulling]** Zie §4. |

**Eén voorbeeld apart, omdat het laat zien hoe deze getallen ontstaan.** Teachables landingspagina-artikel citeert onder meer: landingspagina's converteren 160% beter, video verhoogt conversie met 86%, social proof met 5%, en **"meerdere CTA's verlagen de conversie met 226%"** ([Teachable](https://www.teachable.com/blog/best-practices-for-great-landing-page-design)). Dat laatste kán niet: je kunt niet 226% van iets afhalen. Het is een verminkte doorgifte van een oud onderzoek over meerdere *aanbiedingen* per mail. Bovendien spreekt het hun eigen verkooppaginaformule tegen, die juist twee CTA's voorschrijft. **Dat is één artikel dat zichzelf tegenspreekt met een onmogelijk getal, op de site van de marktleider.** Behandel elk conversiecijfer uit deze hoek zo.

---

## 7. Wat botst met een merk dat eerlijkheid als productvereiste heeft

Deze platforms hebben overtuigingstechnieken in het product ingebouwd. Vier daarvan zijn voor ons uitgesloten, en één daarvan is in Nederland ook nog verboden.

| Wat ze bouwen | Waarom het bij ons niet kan |
|---|---|
| **Doorgestreepte prijs bij de order bump.** Teachable heeft er een aparte functie voor, met als motivering "lean into urgency" ([Teachable](https://www.teachable.com/blog/order-bumps-drive-sales)). | **Wettelijk verboden voor ons.** De Omnibus-richtlijn eist dat een doorgestreepte prijs de laagste prijs van de afgelopen 30 dagen is. Wij hebben nooit iets verkocht, dus er is geen referentieprijs (`docs/prijsstrategie.md` §5.1). ACM handhaaft. |
| **Afteltimers.** Kajabi heeft ingebouwde timers voor livelanceringen; voor evergreen verkoop bestaat een hele industrie (Deadline Funnel, Apresly) die per bezoeker een persoonlijke deadline verzint ([Deadline Funnel](https://www.deadlinefunnel.com/), [askwelmoed](https://askwelmoed.com/blog/kajabi-evergreen-countdown-timer)). | Een deadline die per bezoeker opnieuw begint is een leugen met een cookie. Dit is exact het trucje waar `docs/prijsstrategie.md` §4.2 "geen afteltimers" over zegt. |
| **FOMO als expliciete ontwerpopdracht** ("position your order bump to cause FOMO"). | Ons merk is reassurance-first. Angst als verkoopmiddel is niet een graduele afwijking maar het tegenovergestelde. |
| **Tellers met ingeschreven studenten** als vertrouwenssignaal ("meer dan 1.500 studenten", en Teachable zet zelf "150.000+ creators" boven hun artikelen). | Bij nul verkopen is dit óf leeg óf verzonnen. Zie ook de verwijderde testimonials van de oude site. |
| **Inkomstenframing** ("how to make money selling courses" als standaardregister). | Bij een beleggingsmerk is dit geen smaakkwestie maar een AFM- en reclamerisico. |

**En dan de nuttige spiegel: "risk reversal" hoeft geen truc te zijn.** In de Kajabi-formule is dat de garantiestap, doorgaans een 30-dagen-geld-terug-belofte. Wij hebben iets beters, en we hebben het al: **een wettelijk herroepingsrecht en een verplichte herroepingsknop** (`docs/prijsstrategie.md` §5.2 en §5.3). Dat is geen marketingclaim maar een afdwingbaar recht. De honderden dollars die makers uitgeven aan het *voelen* van veiligheid, kunnen wij vervangen door het gewoon op te schrijven op de plek waar hun garantieblok staat. Dat is de goedkoopste conversiewinst in dit hele document, en de enige die volledig binnen het merk valt.

---

## 8. Wat een Nederlandse eenpitter zonder lijst als eerste zou kopiëren

Gerangschikt op (waarde) ÷ (bouwkosten), met het merkfilter er al overheen. Alles wat hierboven onder **[vulling]** viel is hier weggelaten.

**1. Zet het Thinkific-standaardsjabloon af tegen onze cursuspagina, en vul de vier gaten.** Uitkomstbelofte boven de vouw, prijs zichtbaar op de pagina zelf, een FAQ-blok met de drie vragen die er voor die cursus toe doen, en een risk-reversal-blok. Alle vier zijn tekst, geen techniek. Dit is de goedkoopste post in de lijst.

**2. Maak van het herroepingsrecht een verkoopargument in plaats van een voetnoot.** Eén blok, in gewone taal, op de plek waar iedereen een garantie zet: wat je krijgt, wat er gebeurt als het niets voor je is, en dat je toegang levenslang is. `docs/prijsstrategie.md` §4.3 heeft die teksten al voor de prijzenpagina; ze horen ook op de cursuspagina. Dit is de enige overtuigingstechniek uit dit onderzoek die eerlijker wordt naarmate je hem beter uitvoert.

**3. Eén gratis proefles per betaalde cursus.** Unaniem bij Thinkific en Podia, en het staat al als punt 8 in `docs/learndash/18-wat-we-ermee-doen.md`. Twee onafhankelijke sporen die op hetzelfde uitkomen. Let op Thinkifics valkuil: meet "proefles afgerond" apart, want een gratis inschrijving is geen aankoop en verschijnt niet vanzelf in je cijfers. En let op onze eigen SEO-huisregels: sitemap en slotscherm moeten meebewegen.

**4. Eén herinneringsmail bij een afgebroken betaling.** Het is de enige checkoutfunctie uit §2 die bij ons bijna gratis is: `payment_attempts` heeft al een rij met status `pending`, sinds PR #42 is er nog maar één openstaande poging per gebruiker per cursus (dus geen dubbele mails), en `verstuurMail()` werkt sinds vandaag. Eén mail na een paar uur, met een link terug, zonder korting en zonder timer. Teachable beschouwt dit als betaalde waarde en knijpt het af op hun instapplan; dat is een sterker signaal dan welk conversiecijfer in §6 ook.

**5. Doe iets op het moment dat iemand de gratis cursus afrondt.** Dat is bij alle vier platforms hét conversiemoment, en bij ons gebeurt er nu niets. De voltooiingsmail met certificaatlink staat al in de LearnDash-lijst; dit is dezelfde mail met één zin erbij over wat de logische volgende cursus is. Geen aandrang, geen aanbieding.

**6. Begin een lijst, met de nieuwsbriefroute die er al ligt.** Niet omdat lead magnets magisch zijn, maar omdat elk van deze vier bedrijven dezelfde volgorde noemt en geen van hen een alternatief kent. Zonder lijst heeft de rest van dit document weinig aangrijpingspunt.

**7. Praat met de eerste tien geïnteresseerden, handmatig.** Mavens advies, en het enige uit dit hele onderzoek dat werkt bij nul klanten. Wij hebben er de productvorm al voor: de redactionele lesvragen.

### Wat je bewust niet overneemt

- **Order bumps.** Teachables eigen prijsregel (bump onder de $100 hoort op $27 tot $37) botst frontaal met ons besluit van één prijs voor alle cursussen.
- **Teachables prijsadvies van minimaal $100.** Amerikaanse markt, leverancier met belang bij hoger volume, en hun eigen redenering over zelfstudie versus cohort ondersteunt juist €49.
- **De 43%-LTV-claim over abonnementen.** Ongefundeerd, en hij spreekt onze eigen, beter onderbouwde churn-analyse tegen.
- **Alles uit §7**: timers, doorgestreepte prijzen, FOMO-teksten, studententellers.
- **Post-checkout-upsells.** Technisch prima, maar bij één cursus per aankoop en een catalogus van negen is het een tweede verkoopmoment zonder tweede aanbod. Heroverwegen als er ooit een bundel komt, en dan als apart besluit met een eigen rekensom.

---

## Bronnen

**Verkooppagina en sjablonen**
- [Teachable — How to Create a Powerful Sales Page](https://www.teachable.com/blog/powerful-sales-page) · [Best Practices for Great Landing Page Design](https://www.teachable.com/blog/best-practices-for-great-landing-page-design) · [7 Proven UX Tips to Boost Course Sales Page Conversions](https://www.teachable.com/blog/course-sales-page-conversions) · [Best Online Course Sales Page Examples](https://www.teachable.com/blog/sales-page-examples) · [Page Blocks (Page Editor 1.0)](https://support.teachable.com/en/articles/11682518-page-blocks-page-editor-1-0)
- [Thinkific Support — Build Your Course Page](https://support.thinkific.com/hc/en-us/articles/360030727293-Build-Your-Course-Page) · [Site Page Templates](https://support.thinkific.com/hc/en-us/articles/30636452899863-Site-Page-Templates)
- [Kajabi Help — Add Sections to your pages](https://help.kajabi.com/articles/website/pages/add-sections-to-your-pages) · [parker.media — Why Kajabi Sales Page Templates Actually Work](https://www.parker.media/blog/kajabi-sales-page-templates) · [jiffycoursesonline — 8 Proven Ways to Boost Your Kajabi Sales Page Conversions](https://www.jiffycoursesonline.com/blog/8-proven-ways-to-boost-your-kajabi-sales-page-conversions)
- [Podia — All Features](https://www.podia.com/features)

**Checkout, order bumps en upsells**
- [Podia — Upgrades to Podia's checkout flow](https://www.podia.com/articles/checkout-updates) · [Podia Help — Offering upsells](https://help.podia.com/en/articles/11370406-offering-upsells) · [Podia Help — Understanding the customer checkout experience](https://help.podia.com/en/articles/11370931-understanding-the-customer-checkout-experience) · [Podia Help — Managing payment plans](https://help.podia.com/en/articles/11370990-managing-payment-plans)
- [Teachable Help — Abandoned Cart Emails](https://support.teachable.com/en/articles/11682443-abandoned-cart-emails) · [Teachable — Order Bumps Drive Sales Through Urgency](https://www.teachable.com/blog/order-bumps-drive-sales) · [Teachable — How to Price an Order Bump](https://www.teachable.com/blog/how-to-price-an-order-bump) · [Teachable — New plans June 2025](https://support.teachable.com/en/articles/11682410-new-teachable-plans-in-june-2025)
- [Kajabi Help — Upsell vs Order Bump](https://help.kajabi.com/en/articles/12695543-what-is-the-difference-between-an-upsell-and-order-bump) · [Kajabi Help — Upsells overview](https://help.kajabi.com/articles/sales/offers/upsells-overview)
- [Thinkific Support — Set Your Product Pricing](https://support.thinkific.com/hc/en-us/articles/360030356354-Set-Your-Course-Pricing)
- [SamCart — The Complete Guide to Order Bumps](https://www.samcart.com/blog/the-complete-guide-to-order-bumps)

**Gratis naar betaald**
- [Thinkific Support — Create a Free Course Preview](https://support.thinkific.com/hc/en-us/articles/360030722473-Create-a-Free-Course-Preview) · [Why is my Free Preview not working?](https://support.thinkific.com/hc/en-us/articles/360052082633-Why-is-my-Free-Preview-not-working) · [How to Generate Leads and Capture Emails](https://support.thinkific.com/hc/en-us/articles/360030722813-How-to-Generate-Leads-and-Capture-Emails)
- [Podia — How to create a lead magnet](https://www.podia.com/articles/how-to-create-a-lead-magnet) · [Podia Help — Building a complete sales funnel](https://help.podia.com/en/articles/11370933-building-a-complete-sales-funnel) · [Podia — Online Courses](https://www.podia.com/online-courses)
- [Teachable — How to Create an Email Course That Converts](https://www.teachable.com/blog/email-course)
- [Maven Help — All about your course waitlist](https://help.maven.com/en/articles/5622854-all-about-your-course-waitlist) · [Maven Help — Understanding Maven's course discovery system](https://help.maven.com/en/articles/13228393-understanding-maven-s-course-discovery-system) · [Maven — A 6-week plan for selling your course](https://maven.com/resources/6-week-plan) · [Maven Help — Launch Playbook](https://help.maven.com/en/collections/3709239-launch-playbook)
- [LaunchList — Waitlist for online courses](https://getlaunchlist.com/waitlist-for-online-courses) · [Waitlister — Online courses](https://waitlister.me/use-cases/online-courses)

**Prijzen en marktcijfers**
- [Teachable — How to Price Your Online Course](https://www.teachable.com/blog/how-to-price-your-online-course) · [Teachable — Thinkific vs Teachable](https://www.teachable.com/blog/thinkific-vs-teachable)
- [Thinkific Support — Launch and Market Your Course](https://support.thinkific.com/hc/en-us/articles/360030354094-Launch-and-Market-Your-Course) · [Thinkific Plus — 2025 Benchmarks Report](https://www.thinkific.com/resources/revenue-generation-benchmarks/) (achter een formulier, inhoud niet geverifieerd)
- [InsightRaider — 146.271 Gumroad-producten geanalyseerd](https://insightraider.com/en/data/gumroad-statistics-2026) · [ElectroIQ — Kajabi Statistics](https://electroiq.com/stats/kajabi-statistics/) · [ElectroIQ — Teachable Statistics](https://electroiq.com/stats/teachable-statistics/)
- [acceleroi — Average Online Course Conversion Rate](https://www.acceleroi.com/blog/unlocking-success-exploring-the-average-conversion-rate-for-online-courses) · [Paige Brunton — How big does my email list need to be](https://www.paigebrunton.com/blog/email-list-size-online-course) · [Skillademia — Online Course Completion Statistics](https://www.skillademia.com/statistics/online-course-completion-statistics/) · [Ruzuku — Course Completion Rate Benchmarks](https://www.ruzuku.com/learn/articles/course-completion-rates)

**Urgentie en scarcity-gereedschap (ter illustratie, niet ter navolging)**
- [Deadline Funnel](https://www.deadlinefunnel.com/) · [askwelmoed — evergreen countdown timer in Kajabi](https://askwelmoed.com/blog/kajabi-evergreen-countdown-timer) · [Heights Platform — refund policy voor online cursussen](https://www.heightsplatform.com/blog/how-to-create-the-best-refund-policy-for-your-online-course)
