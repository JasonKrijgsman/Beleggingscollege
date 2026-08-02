# Productonderzoek — vijf lenzen

Laatst bijgewerkt: 2 augustus 2026. Vijf onafhankelijke onderzoekers keken elk vanuit één
invalshoek naar wat het product mist; een zesde woog alle voorstellen. Bronnen staan per
onderdeel genoemd.

## Lens: waarde-per-euro

De vraag "waarom €49 in plaats van gratis YouTube" is met méér tekst niet te winnen. De gratis Nederlandse concurrentie is sterk: DEGIRO's Beleggersacademie is een complete beginnerscursus, Curvo's Backtest is een gratis Europese portefeuillesimulator met 740+ ETF's, Monte Carlo en drawdown-analyse, en Babypips bewijst dat een volledig gratis school met quizzen en voortgangsmeters jarenlang mensen vasthoudt. Tegen dat veld is 6 lessen à ~50 minuten leestekst voor €49 objectief dun.

Waar betaalde cursussen hun geld wél verdienen — dit komt consistent terug in zowel de aanbieders die ik bekeek als de literatuur over waarom mensen om terugbetaling vragen — is vier dingen: (1) gereedschap waarin de cursist zijn eigen cijfers invult en een uitkomst terugkrijgt, (2) oefening met directe feedback in plaats van consumeren, (3) een tastbaar eindproduct dat de cursist na afloop houdt (ingevulde checklist, eigen plan, spiekbriefje), en (4) menselijk contact. Spaarvarkens vraagt €390 voor 10 lessen/20 uur en levert modellen, checklists en modelportefeuilles mee; de terugbetalingsliteratuur noemt letterlijk "templates, checklists en uitgewerkte voorbeelden gekoppeld aan opdrachten" als de manier om spijt te voorkomen.

Twee dingen die specifiek in jouw voordeel werken. Ten eerste de economie: een tool bouw je één keer en bedien je elke koper mee, terwijl video per uur betaald moet worden. Ten tweede neutraliteit: DEGIRO's academie bestaat om rekeningen te openen en Curvo's tool om naar hun product te leiden. Jij verkoopt geen broker. Een rekenmachine zonder verkoopbelang is een echt verkoopargument — en het past precies bij het merk.

Er zit één randvoorwaarde onder bijna alles hieronder: zodra een cursist iets invult dat hij wil bewaren, moet dat naar de database. Voortgang staat nu in localStorage en reist niet mee tussen apparaten. Voorstel 8 is daarom geen los idee maar het fundament onder 2, 5 en 6.

Technisch is de haak al aanwezig: `LessonTool` in C:\Users\jason\CodingProjects\Beleggingscollege\src\content\types.ts is een union van één waarde, en C:\Users\jason\CodingProjects\Beleggingscollege\src\app\cursussen\[slug]\les\[les]\page.tsx regel 160 rendert de tool met één regel. C:\Users\jason\CodingProjects\Beleggingscollege\src\components\CompoundCalculator.tsx (162 regels) is het werkende sjabloon voor tool nummer twee. Moeite-schaal hieronder: klein = een dag of minder, middel = enkele dagen, groot = een week of meer.

Sources: https://www.degiro.nl/leren-beleggen/beleggersacademie, https://curvo.eu/backtest/nl, https://www.babypips.com/learn/forex, https://spaarvarkens.be/onze-prijzen, https://www.automateed.com/how-to-reduce-refunds-for-online-courses, https://www.bogleheads.org/wiki/Investment_policy_statement, https://www.aaii.com/investor-update/article/A-Checklist-Can-Make-You-a-Better-Investor, https://www.tradingview.com/chart/BTCUSD/qmCyeQyK-How-To-Use-The-Bar-Replay-Tool-Rewatch-Trading-History/, https://www.afm.nl/nl-nl/sector/beleggingsondernemingen/doorlopende-verplichtingen/geschiktheidstoets

## Lens: retentie-en-abonnement

KERNBEVINDING: het abonnement heeft nu geen grond, maar "eerst meer cursussen maken" is het duurste en traagste antwoord — en het lost het probleem niet op.

Een zesde cursus van 50 minuten kost tientallen uren en verlengt de catalogus met één avond. Je kunt het gat niet dichtproduceren. De platformen die met een kleine catalogus wél maandelijks geld verdienen, doen het niet met volume maar met drie dingen: (1) een dagelijks/wekelijks terugkeerpunt dat bestaande inhoud hergebruikt, (2) gereedschap dat je blijft gebruiken nadat de les klaar is, en (3) inhoud die veroudert en dus onderhouden moet worden — dát is de enige eerlijke rechtvaardiging voor een terugkerende betaling.

Duolingo is hier het scherpste bewijs. Hun doorbraak (DAU 4,5x, CURR +21%, dagelijkse churn bij beste gebruikers -40%) kwam uit mechanica, niet uit cursusvolume: leaderboards (+17% leertijd, aantal zeer betrokken gebruikers verdrievoudigd), streak-notificaties (aandeel DAU met streak van 7+ dagen bijna verdrievoudigd tot ruim de helft), en de Practice Hub — oefensessies die volledig uit je eigen eerdere fouten worden opgebouwd en dagelijks verversen, zonder één regel nieuwe inhoud. Let op de keerzijde: Duolingo's ábonnement verkoopt geen inhoud, maar het wegnemen van frictie (hearts/energie, advertenties). Dat model is voor Beleggingscollege verboden terrein — het is precies de dark pattern-logica waartegen dit merk zich positioneert. Kopieer de retentiemechanica, niet de monetisatiemechanica.

Brilliant laat het andere model zien: een gratis dagelijkse uitdaging als gewoontelaag bovenop een betaalde diepte-catalogus, met dagsleutels die het gratis gebruik beperken (~85% van omzet uit abonnementen). Ook hier is het terugkeerpunt gratis en klein; de betaling zit in de diepte.

WAT HIER STRUCTUREEL ONTBREEKT, in volgorde van blokkerendheid:
1. Voortgang staat in localStorage. Een abonnement dat je vergeet zodra je van laptop naar telefoon gaat, is onverkoopbaar. Elke andere retentiemechaniek (streak, herhaling, rapport, e-mail) is hierop gebouwd. Dit is geen idee maar een voorwaarde.
2. Er is geen e-mailkanaal. Nul. Wie de gratis cursus doet is daarna onbereikbaar — terwijl e-mail met afstand het best converterende kanaal is (~8% e-mail-naar-lead in financiële diensten, 30-40% boven betaalde kanalen). Dit is de goedkoopste retentie die bestaat.
3. Er is geen terugkeerreden tussen lessen door. 88 quizvragen liggen ongebruikt: resultaten worden opgeslagen en nergens getoond.

EERLIJKE ONZEKERHEID: 88 vragen is een kleine vijver voor spaced repetition — bij dagelijkse herhaling is die binnen weken uitgeput en ga je antwoorden onthouden in plaats van begrijpen. Vragen schrijven is echter verreweg de goedkoopste inhoud die er is (minuten per vraag, uren per les). De inhoudsgroei hoort dáár te zitten, niet in nieuwe cursussen. Ook eerlijk: de retentiecijfers van Brilliant en van membership-modellen komen uit marketingblogs zonder meetdata; de Duolingo-cijfers komen van hun eigen voormalige CPO en zijn wél specifiek. De onderzoekscijfers over herhaling en toetsen zijn robuust (SMD 0,78 in medisch onderwijs, n=21.415; retrieval practice g≈0,50-0,61 versus herlezen), maar gemeten op leerresultaat, niet op abonnementsretentie.

Bronnen: lennysnewsletter.com/p/how-duolingo-reignited-user-growth · blog.duolingo.com/guide-to-duolingo-practice-hub · trophy.so/blog/brilliant-gamification-case-study · brilliant.org/help/pricing-and-plans · pubmed.ncbi.nlm.nih.gov/41601436 · link.springer.com/article/10.1186/s40594-024-00468-5 · focus-digital.co/lead-magnet-conversion-rate-by-industry · pmtoolkit.ai/benchmarks/churn-rate-benchmarks · rijksoverheid.nl/themas/werk/inkomstenbelasting/plannen-werkelijk-rendement-box-3 · nibesvv.nl/blog/afm-schept-duidelijkheid-over-beleggingsadvies

## Lens: publiek-en-vindbaarheid

Eerst de vondst die de opdracht omdraait. Je hebt de e-mailadressen al. In `src/db/schema.ts` staat `email: text("email").unique()` in de `user`-tabel: iedereen die met Google inlogde om de gratis cursus te doen, staat mét geverifieerd adres in je Neon-database. Het probleem is dus niet verzamelen, het is (1) geen juridische grondslag om die mensen te benaderen, (2) geen vastgelegde toestemming, en (3) geen verzendinfrastructuur. Dat is goed nieuws: de duurste stap is al gezet.

De tweede vondst is juridisch en splitst je publiek in tweeën. De uitzondering voor een bestaande klantrelatie (art. 11.7 lid 3 Telecommunicatiewet) eist volgens de DDMA vijf dingen tegelijk, waarvan de eerste is dat het adres verkregen is bij een verplichting tot een financiële transactie. Je €49-kopers vallen daar dus onder: die mag je mailen over vergelijkbare eigen cursussen, zonder aparte toestemming, mits je ze bij aankoop informeert en elke mail een afmeldlink heeft. Je gratis-cursisten vallen er niet onder — geen transactie, geen klantrelatie, dus harde opt-in. En let op de val: bestaande accounts alsnog per mail om toestemming vragen mag niet, want díé mail is zelf al een ongevraagde commerciële mail. Die mensen kun je uitsluitend in het product zelf vragen, bij hun volgende bezoek.

Over het moment. Zet geen e-mailmuur voor de gratis cursus: die cursus ís je lead magnet, en hem afschermen is precies de zet die het merk het meest zou beschadigen. Het aanmeldmoment is het certificaat. Iemand heeft dan negen lessen af, heeft een tastbaar resultaat in handen en heeft één natuurlijke vraag: en nu? Daar hoort je vraag, en nergens anders. Geen exit-intent, geen timer-overlay, geen "laatste kans".

Over SEO, eerlijk: dit is je langzame kanaal, niet je redding. Seer Interactive mat over 5,47 miljoen queries dat de organische CTR bij een AI Overview zakt van 1,62% naar 0,61%, en informatieve, evergreen uitleg — precies wat jij maakt — wordt het hardst geraakt. Tegelijk zijn "beleggen voor beginners"-termen in Nederland bezet door partijen met affiliate-inkomsten (Mr FOB, thehappyinvestors, financer.nl) die je met 32 URL's niet inhaalt. De uitweg is niet meer volume, maar de combinatie van technische hygiëne die nu meetbaar geld kost (geen Search Console, geen favicon, geen OG-afbeelding, www resolvet niet), aantoonbare autoriteit voor een YMYL-onderwerp, en één schrijfgewoonte die tegelijk je nieuwsbrief én je blog vult. Dat laatste is de enige manier waarop dit als eenmanszaak vol te houden is.

Realistische verwachting: dit is een asset van twee tot drie jaar, geen omzetplan voor dit kwartaal. Met een paar honderd gratis-cursisten per jaar en een gezonde opt-in praat je over tientallen abonnees in jaar één. Bouw het nu juist op, dan is het over twee jaar het enige kanaal dat niemand van je af kan nemen.

## Lens: vertrouwen

Het onderzoek levert één ongemakkelijke hoofdconclusie op: er bestaat géén register of keurmerk voor een beleggingsopleider dat een eenmanszaak zonder AFM-vergunning kan halen. Alle vier de kandidaten vallen af, en om verschillende redenen. CRKBO geldt alleen voor beroepsonderwijs — cursussen gericht op vaardigheden in de persoonlijke levenssfeer (hobbycursussen) vallen er expliciet buiten, en de Belastinginspecteur beslist; beleggen leren als particulier valt vrijwel zeker in die tweede categorie. Het NRTO-keurmerk vereist NRTO-lidmaatschap, waarvan de laagste contributiestaffel begint bij €150.000 omzet à €1.500 per jaar — buiten bereik. DSI-registratie vereist dat je wérkgever DSI-deelnemer is, dus onmogelijk voor een zelfstandige. En KFD, SEH, Adfiz en KiFiD zijn allemaal voor financiële dienstverleners met Wft-diploma's en een AFM-vergunning; die voeren zou ronduit misleidend zijn.

Wat wél kan is een webshop-keurmerk: Webshop Keurmerk kost €195 per jaar excl. btw, met geschillenbemiddeling inbegrepen en géén certificeringskosten (Thuiswinkel Waarborg vraagt €890 certificering plus €75 inschrijving plus omzetafhankelijke contributie — te duur). Maar een webshop-keurmerk zegt iets over je bestelproces, niet over je inhoud. Het lost het echte probleem niet op.

Het echte probleem is dat een onzekere beginner op /over-ons een eerlijk, goedgeschreven, volledig tekstueel verhaal leest waarin niets controleerbaar is. Geen gezicht, geen link, geen bron, geen bewijs. De zakelijke basis staat er juist goed (KvK 71856633 en het btw-id in de footer, vestigingsplaats Den Haag — dat is meer dan veel aanbieders doen en het is ook wettelijk verplicht), maar het menselijke en inhoudelijke deel ontbreekt.

Daarom lopen de sterkste voorstellen hieronder niet via een derde partij maar via verifieerbaarheid: laat een hele betaalde les gratis lezen, geef een garantie die ruimer is dan de wet juist dáár waar de wet het herroepingsrecht bij digitale inhoud laat vervallen, laat zien wie je bent en op welke boeken je je baseert, en verzamel reviews die alleen echte kopers kunnen schrijven. Dat laatste is het eerlijke alternatief voor de drie verwijderde testimonials: het verbod is op verzinnen, niet op sociale bewijskracht.

Onzekerheidsmarkeringen: de exacte toelatingseisen van Webshop Keurmerk voor digitale producten heb ik niet volledig kunnen verifiëren (hun voorwaarden sluiten "financiële diensten" expliciet uit — onderwijs is dat niet, maar dat moet bevestigd worden vóór betaling). De NRTO-contributietabel begint bij €150.000 omzet; of er een onzichtbare startersstaffel onder zit, weet ik niet. En de CRKBO-classificatie is uiteindelijk een oordeel van de Belastinginspecteur, geen vaste regel.

## Lens: toegankelijkheid

**De EAA-vraag, kort: nee — Beleggingscollege valt er niet onder. Maar dat is niet hetzelfde als "geen verplichtingen".**

De European Accessibility Act (Richtlijn (EU) 2019/882) geldt sinds 28 juni 2025 en e-commercediensten vallen er nadrukkelijk onder (art. 2(2)(f), gedefinieerd als "services provided at a distance, through websites... with a view to concluding a consumer contract" — dat is exact een cursuswebshop). Maar artikel 4(5) is ondubbelzinnig: "Microenterprises providing services shall be exempt from complying with the accessibility requirements... and any obligations relating to the compliance with those requirements." Volledige vrijstelling, geen documentatieplicht, geen toegankelijkheidsverklaring. Een micro-onderneming is (art. 3): minder dan 10 werkzame personen **én** een jaaromzet óf balanstotaal van ten hoogste €2 miljoen. Een eenmanszaak met één persoon zit daar ruim onder. De Nederlandse implementatiewet (aangenomen Eerste Kamer, april 2024) neemt die vrijstelling over; toezicht op webshops ligt bij de ACM.

Drie randen waar het kantelt: (1) de vrijstelling geldt alleen voor **diensten** — micro-ondernemingen die EAA-**producten** verkopen moeten wél voldoen (hardware, e-readers, betaalterminals; niet van toepassing hier); (2) de vrijstelling vervalt zodra Jason 10 medewerkers heeft óf boven €2 mln omzet komt — dat is een groeirisico, geen permanente vrijbrief; (3) bij verkoop aan overheid, onderwijs of grote werkgevers eist inkoop standaard EN 301 549 / WCAG 2.1 AA. De B2B-deur is dus dicht zolang de site ontoegankelijk is.

**Wat wél geldt, ongeacht de EAA:** de Wet gelijke behandeling op grond van handicap of chronische ziekte. Artikel 5b verbiedt onderscheid bij het aanbieden van goederen en diensten, artikel 2 verplicht tot een "doeltreffende aanpassing" op verzoek "tenzij deze voor hem een onevenredige belasting vormt", en artikel 2a tot het "tenminste geleidelijk" zorgen voor algemene toegankelijkheid. Handhaving loopt via het College voor de Rechten van de Mens: geen boetes, wél een openbaar oordeel mét bedrijfsnaam. Het College oordeelde in 2017 dat Rabobank discrimineerde toen een app-update VoiceOver brak. Voor een merk dat zichzelf verkoopt als de eerlijke, toegankelijke tegenhanger van get-rich-quick is dat het echte risico — niet een boete, maar een oordeel dat het merkverhaal doorprikt.

**Onzekerheid, eerlijk gemarkeerd:** ik kon de Nederlandse wettekst zelf niet openen (mijn gok-URL op wetten.overheid.nl gaf 404), maar de vrijstelling is bevestigd in de richtlijntekst zelf op EUR-Lex (primaire bron), in officiële regulator-guidance en in meerdere Nederlandse juridische commentaren. Ik ben geen jurist; laat de groeigrens bevestigen als de omzet richting de €2 mln gaat. Ik heb bovendien de codebase niet ingezien (alleen web-tools toegestaan), dus enkele voorstellen kunnen deels al geïmplementeerd zijn — check dat eerst.

De tien voorstellen hieronder staan op volgorde van opbrengst gedeeld door moeite. Nummers 1 t/m 7 zijn samen waarschijnlijk twee tot drie dagen werk en halen de site van "onbruikbaar voor blinden" naar "bruikbaar".

## Alle voorstellen (gewogen)

### Veiligheidsmarge-rekenmachine met gevoeligheidstabel (Ontdek Waardebeleggen) _(waarde-per-euro, moeite: klein)_

Interactieve tool in de les 'De veiligheidsmarge' (src/content/courses/waardebeleggen.ts, regel 275). De cursist vult zes velden in die hij letterlijk uit een jaarverslag overtypt: vrije kasstroom per aandeel van vorig jaar, verwachte groei in jaar 1-5 (%), groei in jaar 6-10 (%), rendementseis (%), eindmultiple, en de huidige beurskoers. Terug krijgt hij: (a) de berekende intrinsieke waarde per aandeel, (b) de maximale koopprijs bij 20%, 30% en 50% veiligheidsmarge, (c) de huidige marge in procenten — negatief als het aandeel boven zijn schatting staat, (d) en het belangrijkste: een 5x5-tabel die de intrinsieke waarde toont bij groei ±2 procentpunt tegen rendementseis ±2 procentpunt, met daaronder één zin in gewoon Nederlands: 'Bij redelijke andere aannames komt je uitkomst uit tussen €X en €Y — een verschil van Z%. Dat is precies waarom Graham een marge eist en geen precies getal.' Geen koersdata, geen API, geen bedrijfsnamen: de cursist typt zelf.

**Waarom:** Dit is de enige les in de hele catalogus waar de kernboodschap (waardering is een bandbreedte, geen getal) niet met tekst over te brengen is maar met één keer zelf aan de knoppen draaien wél. Het maakt van een abstract hoofdstuk een handeling die de cursist daarna bij elk aandeel herhaalt. Voor Jason is het het sterkste antwoord op 'waarom niet gratis YouTube': een video kán deze gevoeligheid niet laten voelen, en de tool bedient elke koper zonder extra werk.

**Bewijs:** De formule marge = 1 − (koers / intrinsieke waarde) is standaard (WallStreetPrep, GuruFocus). Aanbieders verkopen hier al Excel-sheets voor: Liberated Stock Trader en Rule One (Phil Town) leveren precies dit als betaald product, wat bewijst dat er betalingsbereidheid voor is. Wat zij níét doen — ik heb geen aanbieder gezien die de gevoeligheidstabel als hoofdgerecht opdient — is de onzekerheid tonen; daar zit jouw onderscheid. Onzekerheidsmarkering: ik heb de betaalde sheets zelf niet gekocht, dit komt uit hun eigen verkooppagina's.

**Risico:** Twee gevaren. Ten eerste: een DCF met agressieve groei-invoer spuugt absurde waarden uit, waarna de cursist denkt dat een aandeel 300% ondergewaardeerd is. Begrens de invoervelden (groei max ~15%, rendementseis min ~6%) en toon bij extremen een waarschuwing. Ten tweede: de tool mag nooit bedrijfsnamen bevatten of het woord 'koop'. Een rekenmachine op eigen invoer is informeren; een uitkomst met een naam eraan begint te lijken op een beleggingsaanbeveling, met bijbehorende regels. Verder is het risico laag: dit is rekenwerk in een bestaand componentpatroon.

### Aandelen-doorlichting: opslaanbare checklist met eigen dossier en PDF (Ontdek Waardebeleggen) _(waarde-per-euro, moeite: middel)_

Een formulier dat de drie praktijklessen (jaarverslagen, kengetallen, moats en management) samenbindt tot één handeling. De cursist voert een bedrijfsnaam in en beantwoordt 12 vragen met ja/nee/weet-niet, elk met een uitklapbare regel uitleg die terugverwijst naar de les: begrijp ik in één zin hoe dit bedrijf geld verdient? Is er de afgelopen vijf jaar elk jaar winst gemaakt? Wat is de schuld ten opzichte van de winst? Wie zit er in de directie en hoeveel aandelen hebben zij zelf? Waar komt de slotgracht vandaan en kan die verdwijnen? Plus twee open velden: 'in één zin: waarom is dit goedkoop?' en 'wat moet er gebeuren waardoor ik hier spijt van krijg?'. Terug krijgt hij een opgeslagen dossier per bedrijf (herzienbaar, met datum), een printbare eenpagina-samenvatting via dezelfde printroute als het bestaande certificaat, en bovenaan een blok 'je hebt 4 van de 12 vragen niet kunnen beantwoorden' — bewust géén score en géén oordeel.

**Waarom:** De checklist is hét canonieke werkstuk van waardebeleggen, en het is precies wat een YouTube-video niet kan: het levert de cursist iets op dat van hém is en dat hij over een jaar terugleest. Het verandert de aankoop van 'ik heb zes teksten gelezen' in 'ik heb nu een werkwijze en drie ingevulde dossiers'. Voor de cursist lost het het echte beginnersprobleem op: niet 'wat is een K/W', maar 'hoe kom ik van nieuwsgierigheid naar een besluit zonder mezelf voor de gek te houden'.

**Bewijs:** Pabrai werkt met een checklist van 97 punten die is opgebouwd uit fouten van hemzelf, Buffett en Munger; Guy Spier en Michael Shearn doen hetzelfde en wijdden er een uur-durende sessie aan bij MOI Global. AAII publiceerde 'A Checklist Can Make You a Better Investor'. Uit de terugbetalingsliteratuur: cursussen met checklists en uitgewerkte voorbeelden gekoppeld aan opdrachten krijgen minder spijt-verzoeken. Spaarvarkens (€390) noemt checklists en modellen expliciet als onderdeel van het pakket.

**Risico:** Grootste valkuil: de verleiding om er een score van te maken ('9/12 — sterk aandeel'). Dat is precies waar het van educatie naar aanbeveling kantelt, en het is bovendien intellectueel oneerlijk, want de twaalf vragen wegen niet even zwaar. Houd het oordeelloos. Praktisch: dit is de eerste plek waar gebruikers eigen tekst opslaan, dus je hebt een tabel nodig, een verwijderknop en een regel in de privacyverklaring. Reken erop dat een deel van de cursisten het formulier één keer invult en nooit meer — dat is geen mislukking, maar bereken de waarde er niet op alsof iedereen tien dossiers aanlegt.

### Grafiek-trainer met bar-voor-bar onthulling (Introductie Technische Analyse) _(waarde-per-euro, moeite: groot)_

Een oefenmodule bij de lessen 'Trends, steun en weerstand' en 'Grafiektypen en candlesticks'. De cursist krijgt een grafiek die ophoudt bij vandaag en moet drie dingen doen: het trendtype kiezen (op/neer/zijwaarts), het meest recente steunniveau aanklikken op de grafiek, en aangeven waar hij zijn stop zou leggen. Daarna rollen de volgende 20 koersstaven één voor één uit, met de officiële lijn eroverheen getekend en feedback in twee lagen: 'jouw steunniveau lag €2,10 onder het onze' én — dit is de kern — 'in 7 van de 20 oefengrafieken hield deze steun het niet; dat is normaal'. De score meet uitdrukkelijk niet of je de richting goed voorspelde, maar of je proces klopte: had je een stop, was je verhouding risico/rendement minstens 1:2. Databron: één set van circa 40 vaste, vooraf gegenereerde koersreeksen als statische JSON in de repo — geen live API, geen abonnement, geen licentieprobleem, en niet te googelen ('welk aandeel is dit?').

**Waarom:** Technische analyse is een vaardigheid van het oog; erover lezen is ongeveer even nuttig als leren fietsen uit een boek. Dit is het enige voorstel in de lijst dat leeroefening met directe feedback biedt, en dat is de duurste ontbrekende laag ten opzichte van gratis video. Tegelijk is het de enige manier om de wetenschappelijke kritiek op TA — die de cursus terecht al benoemt — voelbaar te maken in plaats van als disclaimer: de cursist ziet zelf hoe vaak zijn niveau breekt.

**Bewijs:** TradingView's Bar Replay is de facto het standaard leergereedschap voor TA en wordt juist geprezen omdat het hindsight bias wegneemt; intraday-replay zit daar achter een betaald abonnement, wat aangeeft dat het als waardevol wordt gezien. Er bestaan losse candlestick-herkenningsquizzen en geheugenspellen (gamesfortraders.com, TradingCake, diverse quiz-apps), maar die zijn los van elke cursus en niet in het Nederlands. Babypips laat zien dat quizzen met scores en onderlinge vergelijking een cursus jarenlang draaiende houden.

**Risico:** Drie echte risico's. (1) Bouwtijd: klikbare niveaus tekenen op een grafiek is verreweg het meeste werk in deze lijst; overweeg fase 1 zonder tekenen (alleen meerkeuze op trendtype plus onthulling) en pas later het tekengedeelte. (2) Data: Yahoo Finance is in 2017 afgeschaft en beperkt historische downloads inmiddels tot betalende leden; gratis API's (Alpha Vantage 25 calls/dag, EODHD 20/dag) staan herdistributie niet toe. Synthetische reeksen lossen dat op maar zijn geen echte markt — zeg dat eerlijk in de tool zelf, anders ondermijn je het merk. (3) Merkrisico: een spel dat 'goed voorspeld!' roept, verkoopt precies de illusie waar dit platform tegen is. De scoring moet over proces gaan, niet over gelijk krijgen. Als je die discipline niet volhoudt, bouw hem dan niet.

### Positie- en risicorekenmachine met overlevingscheck (Introductie Technische Analyse) _(waarde-per-euro, moeite: klein)_

Kleine tool in de les 'Risicomanagement en een handelsplan'. Invoer: omvang portefeuille, risico per transactie in procenten, instapkoers, stoploss-koers, koersdoel, transactiekosten. Uitvoer: het aantal aandelen dat daarbij hoort, het bedrag in euro's, het verlies in euro's als de stop wordt geraakt, welk percentage van je portefeuille die positie is, en de verhouding risico/rendement (R-multiple) bij het ingevoerde koersdoel. Daaronder de niet-standaard toevoeging: 'met deze instelling overleef je 10 verliezende transacties op rij met een verlies van 9,6% — bij 5% risico per transactie is datzelfde rijtje 40%.' Plus een waarschuwing zodra risico per transactie boven 2% gaat.

**Waarom:** Beginners in technische analyse gaan niet failliet aan verkeerde patronen maar aan te grote posities. Deze tool zet de belangrijkste les van de cursus om in een getal dat de cursist zelf uitrekent, en de overlevingsregel maakt de 1%-vuistregel invoelbaar in plaats van dogmatisch. Het is bovendien het bindmiddel naar voorstel 5: de uitkomst rolt door in het handelsplan.

**Bewijs:** Positiegrootte = (portefeuille × risico%) ÷ (instap − stop) is de universele formule; de 1-2%-regel voor beginners wordt overal aanbevolen (TradeZella, Liberated Stock Trader, EBC). Er zijn tientallen gratis versies online — dat bewijst de vraag, en verklaart tegelijk waarom dit alléén waarde heeft als het in de les staat en doorloopt naar het plan.

**Risico:** Dit is het minst onderscheidende voorstel in de lijst: wie googelt vindt binnen tien seconden een gratis positierekenmachine. Als losse feature rechtvaardigt hij geen cent. Reken hem dus niet mee als verkoopargument op zich. Tweede punt: getallen als 1% of 2% zijn vuistregels, geen wetenschap — presenteer ze als 'wat ervaren handelaren aanhouden', niet als 'het juiste percentage voor jou', anders zit je tegen persoonlijk advies aan.

### Beleggingsplan-generator: het eindproduct dat de cursist meeneemt _(waarde-per-euro, moeite: middel)_

De afsluiter van beide betaalde cursussen (en op termijn ook de gratis, als kennismaking). Een begeleid formulier van 8 tot 10 vragen die de cursist in zijn eigen woorden beantwoordt: waar beleg ik voor, over hoeveel jaar heb ik het geld nodig, hoeveel leg ik per maand in, wat doe ik als mijn portefeuille 30% zakt, welke regel breek ik nooit, wanneer verkoop ik, en hoe vaak kijk ik ernaar. Bij waardebeleggen komen daar de eigen waarderingsregels bij (minimale marge, maximale positiegrootte); bij technische analyse de handelsregels uit voorstel 4. Uitvoer: een gedateerde, printbare eenpagina 'Mijn beleggingsplan' via dezelfde printroute als het bestaande certificaat (src/components/CertificateView.tsx), opgeslagen in het account. Vul je hem een jaar later opnieuw in, dan krijg je naast elkaar te zien wat je toen schreef en wat je nu schrijft.

**Waarom:** Dit is het tastbare eindproduct dat de aankoop achteraf rechtvaardigt. Een cursist die na afloop een eigen document in handen heeft, ervaart iets anders dan iemand die zes teksten heeft gelezen — en het is precies wat een YouTube-serie structureel niet oplevert. Het versie-vergelijk over een jaar is bovendien de eerlijkste vorm van marketing die je hebt: 'kijk wat je jezelf beloofde toen het rustig was'. Voor het merk sluit het naadloos aan: het gaat over gedrag en volhouden, niet over rendement.

**Bewijs:** Het Investment Policy Statement is de standaardaanbeveling van de Bogleheads-gemeenschap, inclusief downloadbare sjabloon; forumleden delen hun eigen exemplaren met concrete regels ('geen nieuwe schulden', vaste inleg, herbalanceerregels). Elke serieuze TA-cursus eindigt in een handelsplan — jouw eigen les heet zelfs zo. De literatuur over cursusspijt raadt expliciet aan om sjablonen en 'start hier'-materiaal mee te leveren.

**Risico:** Het scherpste risico van alle voorstellen: zodra jij standaardwaarden invult (bijvoorbeeld een voorgestelde verdeling 70/30, of 'beleg minimaal 10 jaar'), verandert het van een spiegel in een aanbeveling. De AFM-grens loopt bij een persoonlijke aanbeveling over een concreet product aan een concrete klant; een plan dat volledig uit de eigen woorden van de cursist bestaat blijft ver daarvandaan, een plan met onze suggesties erin niet. Dus: geen voorgevulde percentages, geen productnamen, geen 'aanbevolen'. Tweede punt: hier vullen mensen echte financiële gegevens in. Bewaar het minimaal, laat het verwijderen, en zet het in de privacyverklaring. Onzekerheidsmarkering: ik ben geen jurist; laat deze tool meelopen in de juridische controle die toch al gepland staat voor de voorwaarden.

### Uitgewerkte praktijkcasussen met echte cijfers _(waarde-per-euro, moeite: middel)_

Twee tot drie casussen per betaalde cursus, elk in drie delen. Deel 1: de situatie op een concrete datum in het verleden, met de echte cijfers uit het jaarverslag of de echte grafiek, en de opdracht om zelf de tool uit voorstel 1 of 4 in te vullen. Deel 2: onze uitwerking, met de redenering stap voor stap en de plekken waar de schatting alle kanten op kon. Deel 3: wat er daarna gebeurde — en dan uitdrukkelijk óók één casus waarin de analyse klopte en de koers alsnog jaren niets deed, en één waarin een op papier prachtige opzet mislukte. Strikt historisch, met datum en bron, nooit vooruitkijkend.

**Waarom:** Het gat tussen 'ik begrijp de theorie' en 'ik durf het toe te passen' wordt gedicht door voorbeelden waarin iemand het hardop voordoet, inclusief de twijfel. Gratis video's doen dit zelden met echte cijfers, en als ze het doen kiezen ze de casus die goed afliep. Een casus die eerlijk misging is precies het soort inhoud dat dit merk kan maken en de get-rich-quick-aanbieders niet — het is verkoopbaar bewijs van je eigen positionering. Bijkomend voordeel: het verdubbelt bijna de inhoudelijke omvang van een cursus die nu 6 lessen en ~50 minuten telt, en dat probleem los je niet op met gereedschap alleen.

**Bewijs:** 'Uitgewerkte voorbeelden gekoppeld aan de opdrachten van de module' wordt in de terugbetalingsliteratuur genoemd als middel tegen spijt; Spaarvarkens levert praktijkvoorbeelden en modelportefeuilles mee bij €390. De rechtvaardiging van de omvang is intern: 6 lessen / ~50 minuten voor €49 staat tegenover 10 lessen / 20 uur voor €390 bij Spaarvarkens — per euro is dat niet vanzelfsprekend in jouw voordeel.

**Risico:** Dit is het enige voorstel waarvan de kosten niet in code zitten maar in Jasons tijd; een goede casus schrijven kost meer dan een tool bouwen en is niet uit te besteden aan een generator zonder de cijfers te controleren. Verder: zodra je bedrijven bij naam noemt, moeten de cijfers kloppen en moet er een bron bij, en moet volstrekt helder zijn dat het over het verleden gaat — anders komt het in de buurt van een beleggingsaanbeveling, waarvoor eigen regels gelden (feiten scheiden van meningen, bronnen vermelden, belangen melden). Kies daarom grote, goed gedocumenteerde bedrijven en oude data.

### Samenvattingskaart per cursus (printbaar spiekbriefje) _(waarde-per-euro, moeite: klein)_

Eén A4 per cursus, printbaar via de bestaande certificaatroute en dus zonder nieuwe PDF-techniek. Waardebeleggen: de formules (K/W, koers/boekwaarde, veiligheidsmarge), de 12 checklistvragen, de vijf plekken in een jaarverslag waar je begint, en de vier zinnen van Mr. Market. Technische analyse: de candlestick-vormen met wat ze wel en niet zeggen, de positieformule, de 1%-regel met de overlevingstabel, en de vijf regels van een handelsplan. Beleggen voor beginners (gratis): een kaart 'wat te doen als de beurs 20% zakt' — bewust weggeven, want dat is de beste advertentie die je hebt.

**Waarom:** Het is de goedkoopste manier om een cursus van 'gelezen en vergeten' naar 'ligt naast mijn laptop' te brengen, en downloadbaar materiaal is het meest genoemde tastbare extraatje bij betaalde cursussen. Voor Jason kost het bijna niets: de inhoud staat al in de keyTakeaways-velden van de bestaande lessen.

**Bewijs:** Downloads, checklists en sjablonen worden in vrijwel elk overzicht van betaalde cursusonderdelen genoemd, en de terugbetalingsliteratuur adviseert expliciet materiaal dat de cursist buiten de site gebruikt. Nederlandse aanbieders adverteren er ook mee ('incl. gratis downloads' als verkoopargument bij beleggingscursussen voor beginners).

**Risico:** Rechtvaardigt op zichzelf geen €49 — wie dit als het antwoord op de YouTube-vraag presenteert, verkoopt lucht. Bovendien lekt een PDF: hij wordt gedeeld en komt uiteindelijk ergens op internet te staan. Dat is bij lage bouwkosten acceptabel, maar zet er geen inhoud in die de kern van de betaalde cursus is. Kleine praktische valkuil: één A4 blijft alleen één A4 als je streng bent.

### Voortgang en quizresultaten naar het account (fundament onder de rest) _(waarde-per-euro, moeite: middel)_

Voortgang, XP, badges en quizscores verhuizen van localStorage naar de bestaande database (er zijn al tabellen lesson_progress en user_stats in src/db/schema.ts), met een migratie die bestaande localStorage-gegevens bij de eerste keer inloggen overneemt in plaats van weggooit. Daarbovenop de zichtbare opbrengst: de quizresultaten die nu wél worden opgeslagen maar nergens getoond, komen op /leerpad te staan — per les je score, welke vragen je fout had met de uitleg erbij, en een knop om alleen de foute vragen opnieuw te doen.

**Waarom:** Twee redenen. Praktisch: een cursist die op zijn telefoon begint en op zijn laptop verdergaat, verliest nu alles, en dat is bij een betaald product ronduit schadelijk — het is precies het soort ervaring waarna iemand zijn geld terugvraagt. Fundamenteel: elk voorstel hierboven waarin de cursist iets invult dat hij wil bewaren (checklist, plan, biastest, oefenscores) heeft dit nodig. Zonder deze stap zijn 2, 5 en 6 niet te bouwen. En 'je fout beantwoorde vragen opnieuw doen' is gratis leerwinst uit gegevens die je al hebt liggen.

**Bewijs:** Babypips markeert voortgang en toont scores inclusief vergelijking met anderen, en dat is een van de vaakst genoemde redenen waarom die gratis school werkt. De terugbetalingsliteratuur noemt lage betrokkenheid (niet inloggen, niet afmaken) als hoofdoorzaak nummer één van terugbetalingsverzoeken. Verder feitelijk: de infrastructuur staat er al, alleen de schrijfroute ontbreekt.

**Risico:** De migratie is de plek waar het misgaat: iemand die al 8 lessen af heeft in localStorage en na inloggen op nul staat, is een boze klant. Bouw het samenvoegen expliciet (hoogste waarde wint) en test het geval 'ingelogd op apparaat A, niet-ingelogd voortgang op apparaat B'. Tweede punt: dit is geen feature waarvan de verkooppagina beter wordt, dus het is verleidelijk om hem uit te stellen — terwijl de helft van de rest erop wacht. En laat de vergelijking met andere cursisten voorlopig weg: met een handvol gebruikers is dat statistisch niets en het nodigt uit tot precies de competitiehouding die dit merk niet wil.

### Biastest met terugkoppeling en hermeting (Beleggingspsychologie, nu nog leeg) _(waarde-per-euro, moeite: middel)_

De kern van de nog niet gebouwde vierde cursus. Vijftien situatievragen in plaats van zelfbeoordeling — dus niet 'heb jij last van verliesaversie?' maar keuzes: twee loterijen waarvan er één in verlies is gekaderd; een portefeuille waaruit je iets moet verkopen en de winnaar of de verliezer kunt kiezen; een fonds dat je vijf jaar geleden hebt gekocht en dat je nu niet meer zou kopen. Uitvoer: welke drie neigingen jouw antwoorden laten zien, per neiging de alinea uit de betreffende les plus één concrete tegenmaatregel die je in je beleggingsplan kunt zetten ('ik verkoop nooit op de dag dat ik het bedenk'), en een uitnodiging om de test na drie maanden opnieuw te doen met de twee uitslagen naast elkaar.

**Waarom:** Zelfkennis is het enige onderwerp waarbij mensen een test intrinsiek willen doen, en het koppelt direct aan de andere twee cursussen (verliesaversie verklaart waarom je je stop weghaalt; verankering verklaart waarom je aan je aankoopprijs vasthoudt). Het is bovendien het onderwerp waar het contrast met get-rich-quick het scherpst is: die verkopen zelfvertrouwen, jij verkoopt zelfinzicht. Ik heb bij mijn zoekwerk geen goede Nederlandstalige consumentenversie hiervan kunnen vinden — de bestaande materialen zijn CFA-examenstof of Engelstalige pdf's van vermogensbeheerders. Dat is een gat.

**Bewijs:** De taxonomie ligt klaar en is onomstreden: CFA Institute onderscheidt emotionele neigingen (verliesaversie, zelfoverschatting, zelfbeheersing, status quo, spijtaversie) van cognitieve. FINRA-onderzoek dat 64% van de beleggers zichzelf een hoog kennisniveau toedicht, is een perfecte openingsvraag voor de zelfoverschattingssectie. Morgan Stanley en Goldman Sachs Asset Management publiceren beide gedragsgidsen voor adviseurs — het materiaal bestaat, alleen niet als Nederlandse zelftest. Onzekerheidsmarkering: ik heb niet gecontroleerd of de FINRA-cijfers recent zijn geactualiseerd; verifieer voor publicatie.

**Risico:** Het testformaat is precies het genre dat overbelooft — 'ontdek wat voor belegger jij bent' is de toon van de aanbieders waar dit merk zich van afkeert. Twee harde grenzen: geef geen persoonlijkheidslabel ('jij bent de Voorzichtige Bouwer'), en produceer al helemaal geen risicoprofiel met een verdeling erbij, want dan zit je tegen een geschiktheidstoets aan en dat is gereguleerd terrein. Houd het bij: dit zijn de valkuilen die jouw antwoorden suggereren, hier is wat je ertegen kunt doen. Verder: de cursus zelf bestaat nog niet, dus dit is v2-werk — en de test is zonder de bijbehorende lessen weinig waard.

### Vragenrubriek met beloofde reactietermijn (het enige dat YouTube echt niet kan) _(waarde-per-euro, moeite: klein)_

Onder elke les van een betaalde cursus een knop 'stel je vraag over deze les'. De vraag komt bij Jason binnen; het antwoord gaat per e-mail terug én verschijnt — geanonimiseerd en met toestemming — onder de les als 'vragen van cursisten'. Op de verkooppagina staat één concrete belofte, bijvoorbeeld: antwoord binnen vijf werkdagen. Na verloop van tijd bouwt elke les zo een eigen vraag-en-antwoordblok op dat de cursus inhoudelijk laat groeien zonder dat er lessen herschreven worden.

**Waarom:** Persoonlijke terugkoppeling is in alle overzichten de vaakst genoemde reden waarom een betaalde cursus meer waard is dan gratis video, en het is het enige onderdeel dat structureel niet te kopiëren is. Voor een eenmanszaak is het bovendien het goedkoopste 'community'-alternatief: een forum met vijf gebruikers is een spookstad, een vraag die binnen vijf dagen een echt antwoord krijgt niet. Bijkomend voordeel: de vragen vertellen Jason precies waar de lessen tekortschieten, en de antwoorden zijn kant-en-klaar bloginhoud voor de blog die nu één artikel telt.

**Bewijs:** Terugkoppeling van de docent en 'student experience' worden in vergelijkingen van betaalde versus gratis cursussen consistent als hét verschil genoemd (Excel Campus, Heights Platform); platforms zonder interactie worden juist bekritiseerd. Spaarvarkens verkoopt naast de cursus een 'beleggingsclub' onder het motto dat beleggen niets is dat je alleen doet — het sociale deel wordt apart geprijsd, wat aangeeft dat er waarde in zit.

**Risico:** Bouwen is klein, volhouden is groot — en dat is het echte risico. Een beloofde reactietermijn die je bij 40 cursisten niet meer haalt, is schadelijker dan geen belofte; begin dus met een ruime termijn en scherp hem aan als het meevalt. Tweede, zwaarder risico: de vragen zullen persoonlijk zijn ('ik heb €20.000, moet ik dit nu in een wereld-ETF stoppen?'). Elk antwoord op zo'n vraag is persoonlijk beleggingsadvies en daarvoor heb je geen vergunning. Er moet dus een vaste, vriendelijke standaardreactie klaarliggen die de vraag terugbrengt naar het lesmateriaal, en de rubriek moet die grens zichtbaar benoemen bij het invoerveld — niet pas in de kleine lettertjes.

### Voortgang van localStorage naar de database (voorwaarde, geen idee) _(retentie-en-abonnement, moeite: middel)_

Verplaats XP, lesvinkjes, quizscores, streak en badges van localStorage naar de al bestaande tabellen `lesson_progress` en `user_stats` in Neon. `completeLesson()` is het enige muterende pad, dus het is één schrijfroute die naar een server action verhuist. Inclusief eenmalige samenvoeging: bij eerste login lokale voortgang uploaden en daarna de server als waarheid nemen. Voor uitgelogde bezoekers blijft localStorage bestaan als tijdelijke laag.

**Waarom:** Nu verdampt iemands voortgang zodra hij van laptop naar telefoon gaat, óók als hij is ingelogd en betaald heeft. Een abonnement dat je vergeet is per definitie onverkoopbaar, en elke andere mechaniek in dit document (streak, herhaling, jaarrapport, e-mailtrigger) heeft serverdata nodig. Dit is de bodemplaat, niet een verbetering.

**Bewijs:** De tabellen `lesson_progress` en `user_stats` staan al in `src/db/schema.ts` — het schema is er, alleen het schrijfpad niet. Duolingo's hele retentiearchitectuur (streak-notificaties, Practice Hub, leagues) draait op serverzijdige activiteitsdata; zonder die data bestaat geen van die mechanieken. lennysnewsletter.com/p/how-duolingo-reignited-user-growth

**Risico:** De samenvoeging is de valkuil: iemand die op twee apparaten losse voortgang heeft opgebouwd, kan bij een naïeve overschrijving werk kwijtraken. Kies expliciet voor 'hoogste waarde wint' per les en log de merge. Tweede risico: streak-berekening op de server moet tijdzone-bewust zijn (Europe/Amsterdam), anders breekt de streak van iemand die om 23:50 leert.

### Een e-mailkanaal, met toestemming en met een reden om te openen _(retentie-en-abonnement, moeite: middel)_

Twee dingen. (a) Vraag bij aanmaken van een account apart en zonder vinkje-vooraf om toestemming voor een leermail, en bied op de gratis cursus (niet erachter, ernaast) een 'stuur mij de volgende les' aan. (b) Bouw drie geautomatiseerde stromen die geen redactiewerk kosten: welkomstreeks tijdens de gratis cursus, een 'je bent drie weken niet geweest'-mail met één concrete herhaalvraag erin, en een maandelijkse voortgangsmail. Pas daarna eventueel een redactionele nieuwsbrief.

**Waarom:** Wie nu de gratis cursus doet, is daarna definitief onbereikbaar. Er is geen enkel kanaal om iemand terug te halen, geen kanaal om een abonnement aan te kondigen, en geen kanaal om een lancering aan te kondigen. Dit is het goedkoopste retentie-instrument dat bestaat en het ontbreekt volledig — belangrijker dan welke feature ook.

**Bewijs:** E-mail is over kanalen heen het best converterende kanaal: ~8,05% e-mail-naar-lead in financiële dienstverlening tegenover 3,36% via SEO en 3,52% via Meta-advertenties; e-mail presteert 30-40% boven betaalde kanalen (focus-digital.co/lead-magnet-conversion-rate-by-industry). Duolingo's grootste gestage winst kwam niet uit méér notificaties maar uit het beter maken van het bestaande kanaal, met expliciete strategie 'bescherm het kanaal' tegen opt-outs (lennysnewsletter.com).

**Risico:** Drie echte risico's. AVG: toestemming voor marketing is niet inbegrepen bij inloggen met Google — apart vragen, dubbele opt-in, afmeldlink, verwerkersovereenkomst met de mailprovider. Merk: de gratis cursus achter een e-mailmuur zetten breekt de belofte van toegankelijkheid; bied hem aan, dwing hem niet af. En het grootste: een lijst zonder mails is waardeloos, maar mails schrijven is een terugkerende verplichting die niemand overneemt — begin daarom met de drie geautomatiseerde stromen en niet met een wekelijkse nieuwsbrief die na zes weken doodbloedt.

### Herhaalmodus: de 88 bestaande quizvragen als terugkerende oefening _(retentie-en-abonnement, moeite: middel)_

Een pagina '/herhalen' die elke week (niet elke dag) een korte set van 5 vragen samenstelt uit lessen die je al hebt afgerond, met voorrang voor vragen die je fout had en voor lessen die het langst geleden zijn. Geen nieuw materiaal: puur hergebruik van bestaande vragen. Toon daarnaast eindelijk de quizresultaten die nu al worden opgeslagen maar nergens zichtbaar zijn — per les, met 'wat je fout had'.

**Waarom:** Dit is de enige mechaniek die van bestaande inhoud een terugkerende reden maakt zonder één nieuwe les te schrijven. Het is bovendien inhoudelijk eerlijk: het maakt de belofte waar dat je iets onthoudt, in plaats van een certificaat verzamelt. En het levert precies de activiteitsdata op die het jaarrapport en de terughaal-mail nodig hebben.

**Bewijs:** Duolingo's Practice Hub bouwt zijn oefensessies volledig op uit je eigen recente fouten en ververst dagelijks — retentie uit hergebruik, zonder nieuwe inhoud (blog.duolingo.com/guide-to-duolingo-practice-hub). Leerwinst is goed onderbouwd: meta-analyse in medisch onderwijs vindt SMD 0,78 (95% BI 0,56-0,99; n=21.415) voor gespreide herhaling versus normaal studeren (pubmed.ncbi.nlm.nih.gov/41601436); retrieval practice versus herlezen levert g≈0,50-0,61. Wel eerlijk: in cursusgebonden context zakt het spacing-effect naar g≈0,24 (link.springer.com/article/10.1186/s40594-024-00468-5).

**Risico:** 88 vragen is een kleine vijver. Bij dagelijkse herhaling ziet iemand binnen weken alles terug en gaat hij antwoordposities onthouden in plaats van begrippen — dan meet de quiz niets meer en voelt het als bezigheidstherapie. Daarom wekelijks starten, antwoordvolgorde husselen, en de vragenvoorraad laten groeien naar 200+ voordat je de frequentie opvoert. Tweede risico: dit maakt zichtbaar hoeveel iemand vergeten is; formuleer dat als normaal en verwacht, niet als falen — anders werkt het demotiverend en verlies je juist de onzekere beginner die je doelgroep is.

### Gereedschap dat je blijft gebruiken, in plaats van één rekenmachine in een gratis les _(retentie-en-abonnement, moeite: middel)_

Een aparte sectie met drie tot vijf blijvende tools, buiten de lessen om bereikbaar: (1) kostenimpact-calculator — wat kost 0,25% versus 0,85% lopende kosten over 30 jaar in euro's; (2) crash-simulator — wat gebeurde er met een inleg als deze in 2000, 2008 en 2020, hoeveel maanden duurde herstel, puur historisch; (3) inleg- en spaarplansimulator met echte inflatiecorrectie; (4) rebalancing-check. Alle vier rekenen door op getallen die de gebruiker zelf invult en bewaart, zodat terugkomen zin heeft.

**Waarom:** Nu staat er één rente-op-rente-rekenmachine, verstopt in een gratis les. Een les is klaar; gereedschap is nooit klaar. Dit is het verschil tussen 'ik heb die cursus gedaan' en 'ik gebruik die site'. De kostencalculator en de crash-simulator zijn bovendien merkidentiek: ze maken precies de twee punten waar Bogle en Housel over gaan, en ze zijn niet te maken door een get-rich-quick-aanbieder zonder zichzelf tegen te spreken.

**Bewijs:** Brilliant's model draait op een gratis dagelijkse interactieve opgave als gewoontelaag boven de betaalde catalogus; ~85% van de omzet komt uit abonnementen die daar bovenop worden verkocht (brilliant.org/help/pricing-and-plans, trophy.so/blog/brilliant-gamification-case-study — let op: die case study bevat geen harde retentiecijfers, alleen kwalitatieve claims). Portefeuille- en kostentools worden in de bredere markt expliciet gepositioneerd als de reden voor herhaald bezoek (thecollegeinvestor.com/33781/portfolio-analysis-tools).

**Risico:** Hier ligt de AFM-grens. Een rekenmachine die de wiskunde van kosten toont is educatie; een tool die op basis van jouw ingevulde situatie een product of verdeling aanbeveelt, is een persoonlijke aanbeveling en dus beleggingsadvies — vergunningplichtig (nibesvv.nl/blog/afm-schept-duidelijkheid-over-beleggingsadvies). Concreet: noem nooit een fonds, geef nooit een uitkomst in de vorm 'jij zou moeten', en zet dat ook in de code vast als productbeslissing. Tweede risico: de crash-simulator moet historische data gebruiken en mag nergens als voorspelling lezen — één slordige zin en je hebt een rendementsbelofte. Derde: het risicoprofiel-instrument dat al op de roadmap staat, is van alle vier het meest advies-achtig; die zou ik juist als laatste bouwen, niet als eerste.

### Een seizoenskalender met echte Nederlandse haakjes — te beginnen met box 3 _(retentie-en-abonnement, moeite: klein)_

Een vaste jaarcyclus van korte, gedateerde inhoud (een pagina of e-mail van 5 minuten, geen cursus): januari jaaroverzichten van brokers lezen, februari-april aangifteperiode en box 3, augustus/september het nieuwe belastingplan, november/december jaarafsluiting en rebalancing. Plus een doorlopend bijgehouden uitlegpagina 'Box 3: wat verandert er en wanneer'.

**Waarom:** Dit is de enige categorie inhoud die intrinsiek verouderd raakt — en daarmee de meest eerlijke rechtvaardiging voor een terugkerende betaling die er bestaat. Je betaalt niet voor een bibliotheek die je in één avond uit hebt, je betaalt voor iemand die het bijhoudt. Het is ook goedkoop: een seizoensitem is een pagina, geen module, en de kalender herhaalt zich elk jaar met alleen een update.

**Bewijs:** De box 3-overgang is precies zo'n haakje: het wetsvoorstel Wet werkelijk rendement box 3 is op 12 februari 2026 door de Tweede Kamer aangenomen, ligt nog bij de Eerste Kamer, het kabinet besluit in augustus 2026 over aanpassingen, en invoering staat gepland op 1 januari 2028. Ongeveer 400.000 mensen moeten straks extra aangifte doen; voor 2,5 miljoen wordt het vooringevuld (rijksoverheid.nl/themas/werk/inkomstenbelasting/plannen-werkelijk-rendement-box-3). Dat is een meerjarige stroom vragen bij exact jouw doelgroep. Seizoenspatroon in e-learning is ook zichtbaar in churndata: e-learning piekt in churn in de zomer (culta.ai/benchmarks/edtech-benchmarks).

**Risico:** Verouderde belastinginformatie is erger dan geen belastinginformatie, zeker bij een wet die nog niet vaststaat — zet een zichtbare 'bijgewerkt op'-datum en een expliciete 'dit is nog een wetsvoorstel'-melding, en plan het onderhoud in. Tweede risico: fiscale uitleg schuift makkelijk op naar fiscaal advies; houd het bij 'zo werkt de regeling' en verwijs voor persoonlijke situaties door. Derde: dit legt een terugkerende schrijfverplichting bij Jason neer — vier items per jaar is haalbaar, twaalf niet.

### Maandelijkse voortgangsmail en een jaaroverzicht 'Jouw beleggingsjaar' _(retentie-en-abonnement, moeite: klein)_

Een geautomatiseerde maandmail met wat je die maand deed (lessen, herhaalscore, streak, wat je vaak fout had, één vraag om te oefenen) en één keer per jaar een deelbaar overzicht: hoeveel uur je leerde, welke boeken/onderwerpen je afrondde, je sterkste en zwakste onderwerp, wat je in het nieuwe jaar zou kunnen doen.

**Waarom:** Een voortgangsrapport is de goedkoopste inhoud die bestaat — het is een sjabloon over data die je toch al hebt — en het is tegelijk een terughaalmoment voor mensen die zijn afgehaakt. Bij een klein platform is het jaaroverzicht bovendien het enige eerlijke marketingmateriaal dat je hebt: echte cijfers van echte gebruikers, in plaats van verzonnen testimonials.

**Bewijs:** Spotify Wrapped is het schoolvoorbeeld van een jaaroverzicht als heractiveringsmotor: 200 miljoen betrokken gebruikers op dag één in 2025 (+19% j-o-j) en ruim 500 miljoen keer gedeeld (+41%), met effect op churnvermindering en terugkeer van vertrokken gebruikers (musicbusinessworldwide.com, variety.com). Duolingo's grootste doorlopende winst kwam eveneens uit het verfijnen van getimede berichten, niet uit meer berichten (lennysnewsletter.com).

**Risico:** Met dunne data wordt het rapport zielig: '1 les, 0 dagen streak' is demotiverend in plaats van bindend. Dit voorstel heeft daarom voorstel 1 en 3 nodig en werkt pas na een paar maanden gebruik. Tweede risico: een mail die te veel op prestatiemeting lijkt, botst met de reassurance-first toon — schrijf het als terugblik, niet als rapportcijfer. Derde: deelbaarheid nooit afdwingen met valse schaarste of 'deel om te ontgrendelen'.

### Boekenclub: begeleid lezen van de klassiekers, één per kwartaal _(retentie-en-abonnement, moeite: middel)_

Per kwartaal één klassieker (Bogle, Housel, Graham, Malkiel) met een eigen leeswijzer: per hoofdstuk een korte introductie, drie kernvragen, één misvatting die dat hoofdstuk opruimt, en een quizvraag. Plus één live sessie of opgenomen vraag-en-antwoord aan het eind. De gebruiker koopt of leent het boek zelf.

**Waarom:** Dit is de goedkoopste terugkerende inhoud die dit specifieke merk kan maken, omdat het boek de inhoud is en jij de begeleiding levert. Het is bovendien identiteitsversterkend: 'geworteld in klassieke boeken' staat nu in de merkbelofte maar wordt nergens in het product waargemaakt — er staat een boekenkast op de homepage en verder niets. Een kwartaalritme geeft een natuurlijke reden om drie maanden lid te blijven, en dat is precies de periode waarin een abonnement normaal sneuvelt.

**Bewijs:** In de membershipbranche wordt het combineren van een inhoudsbibliotheek met terugkerend live contact consequent genoemd als de sterkste churnrem — 'zelfs één live sessie per maand vermindert churn aanzienlijk' (membership.io/blog/membership-retention-strategies). Eerlijk gemarkeerd: dit is een marketingblog zonder meetdata, geen onderzoek — behandel het als hypothese, niet als bewijs. Wel hard: jaarabonnementen churnen op ongeveer 30-50% van het tempo van maandabonnementen, dus een kwartaalritme past beter bij jaarfacturering (pmtoolkit.ai/benchmarks/churn-rate-benchmarks).

**Risico:** Auteursrecht: een leeswijzer mag geen vervangende samenvatting worden en mag geen substantiële passages overnemen — schrijf je eigen tekst, citeer hooguit een zin met bronvermelding. Tweede risico: een live sessie is een maandelijkse persoonlijke verplichting; bij vier abonnees is dat vernederend en bij vierhonderd onhoudbaar zonder structuur — begin met opgenomen antwoorden op ingestuurde vragen. Derde: de drempel 'je moet zelf een boek kopen' zal een deel afhaken; maak dat vooraf duidelijk in plaats van achteraf.

### Verkoop College+ nog niet als maandabonnement — of verkoop het per jaar met een gepubliceerde belofte _(retentie-en-abonnement, moeite: klein)_

Drie opties, in volgorde van voorkeur. (a) Stel de lancering uit tot de herhaalmodus, het e-mailkanaal en minstens twee blijvende tools draaien, en verkoop tot die tijd alleen losse cursussen. (b) Lanceer alleen jaarlijks (€149) en niet maandelijks, met een openbare roadmap van wat er dat jaar bij komt. (c) Herdefinieer wat je verkoopt: niet 'toegang tot alle cursussen' maar 'oefening, gereedschap en bijhouden' — en zet dat letterlijk zo op de pagina. Wat er niet moet gebeuren: €14,99/mnd aanzetten voor 100 minuten inhoud.

**Waarom:** Bij ~100 minuten betaalde inhoud is maand twee inhoudelijk leeg. Dan gebeurt precies wat dit merk zegt te bestrijden: iemand betaalt door voor iets wat hij niet gebruikt, en de omzet komt uit vergeetachtigheid in plaats van uit waarde. Dat is niet alleen een churnprobleem, het is een merkprobleem — de site claimt de eerlijke tegenhanger te zijn van aanbieders die precies dit doen. En dat argument is niet theoretisch: de aankondiging staat er al, dus de belofte loopt al.

**Bewijs:** Jaarabonnees churnen op ongeveer 30-50% van het tempo van maandabonnees, omdat er geen maandelijks opzegmoment is en de aankoop bewuster is; B2C-edtech houdt jaarlijks gemiddeld ~40% van de klanten vast tegenover ~85% bij B2B (pmtoolkit.ai/benchmarks/churn-rate-benchmarks, culta.ai/benchmarks/edtech-benchmarks). Duolingo laat bovendien zien dat een abonnement niet op inhoud verkocht hoeft te worden — Super verkoopt onbeperkte energie en geen advertenties — maar dat model (kunstmatige frictie, hearts, dagelijkse limieten) is voor dit merk uitgesloten, wat betekent dat de rechtvaardiging hier wél uit oefening, gereedschap en actualiteit moet komen.

**Risico:** Uitstellen kost omzet die je nu al zou kunnen hebben, en de aankondiging staat er al — teruggaan voelt als terugkrabbelen. Praktisch is dat risico klein: SEPA-incasso is nog in behandeling, dus het abonnement kan sowieso nog niet draaien. Gebruik die tijd. Tweede risico bij optie (b): een jaarprijs van €149 tegenover twee losse cursussen van €49 is voor de klant pas logisch als er zichtbaar méér in zit dan die twee cursussen — anders is jaarlijks alleen maar duurder en dat is een eerlijkheidsprobleem, geen prijsprobleem. Derde: een openbare roadmap is een belofte; publiceer alleen wat je zeker haalt.

### Leg toestemming vast in de database — je hebt de adressen al _(publiek-en-vindbaarheid, moeite: middel)_

Een tabel `email_consent` (user_id, doel, granted_at, revoked_at, bron, tekstversie) naast de bestaande `user`-tabel, plus twee gescheiden doelen: `cursusmail` (voortgang en nieuwe lessen in cursussen die je volgt) en `nieuwsbrief` (het redactionele stuk). Twee vinkjes, allebei standaard uit, nooit één vinkje voor alles. Twee plekken waar ze gezet kunnen worden: bij het afronden van de gratis cursus, en op een simpele /instellingen-pagina. Voor de gebruikers die er al staan: één keer vragen bij hun volgende bezoek, in het product, nooit per mail.

**Waarom:** Dit is de goedkoopste stap met het grootste effect, want de adressen liggen er al. `src/db/schema.ts` slaat het Google-adres van elke ingelogde gebruiker op. Wat ontbreekt is de grondslag én het bewijs daarvan. De AVG legt de bewijslast bij jou: bij een klacht moet je kunnen laten zien dát iemand toestemming gaf, waarvoor precies, en welke tekst hij toen zag. Een losse boolean `wil_mail = true` is dat bewijs niet; een rij met tijdstip, bron en tekstversie wel.

**Bewijs:** `C:\Users\jason\CodingProjects\Beleggingscollege\src\db\schema.ts` regel 29: `email: text("email").unique()` in de `user`-tabel. AVG art. 7 lid 1 legt de verantwoordingsplicht voor toestemming bij de verwerker; toestemming moet volgens de AP vrij, specifiek, geïnformeerd en ondubbelzinnig zijn — 'specifiek' is precies waarom één vinkje voor twee soorten mail niet volstaat. ICTRecht behandelt expliciet de vraag of je per mail opnieuw om opt-in mag vragen; de veilige lijn is: niet doen.

**Risico:** Twee vinkjes leveren minder aanmeldingen op dan één. Dat is de prijs van 'specifiek' en die moet je gewoon betalen. Groter risico: dat je dit bouwt en vervolgens maanden niets verstuurt — dan heb je een lijst die koud wordt en waarvan de eerste mail (na een half jaar stilte) als spam wordt gemeld. Bouw dit pas als voorstel 4 en 5 klaarstaan. En één juridische onzekerheid die ik eerlijk markeer: of een puur cursusgerelateerde voortgangsherinnering een 'servicebericht' is of een commerciële mail, is een grijs gebied — door er toch toestemming voor te vragen omzeil je de discussie.

### Het certificaat is het aanmeldmoment, en het enige _(publiek-en-vindbaarheid, moeite: klein)_

Eén blok onder het printbare certificaat van de gratis cursus. Geen popup, geen overlay, geen tweede kans op een ander scherm. De tekst is een vraag, geen aanbod: 'Je hebt de basis af. Wil je dat ik je elke twee weken één idee uit een klassiek beleggingsboek stuur? Uitschrijven met één klik, ik verkoop je adres nooit door.' Daaronder het vinkje uit voorstel 1, en een link naar het laatst verzonden nummer zodat iemand vooraf ziet wat hij krijgt.

**Waarom:** Dit is het enige moment waarop de vraag eerlijk gesteld kan worden. De persoon heeft negen lessen afgerond, heeft een tastbaar resultaat, en heeft precies één open vraag: en nu? Op elk eerder moment vraag je iets terug voordat je iets hebt gegeven — dat is de get-rich-quick-choreografie waar je merk zich tegen afzet. Bijkomend voordeel: je vraagt het aan mensen met bewezen doorzettingsvermogen, dus de lijst die je krijgt is klein maar warm.

**Bewijs:** Branchecijfers voor cursusmakers zetten opt-in-pagina's op 3–5% conversie (top 8–15%), terwijl welkomstmails 35–52% openratio halen — die piek zit dus na het commitment, niet ervoor. Dat de timing bij het certificaat het beste werkt is redenering, geen meting: ik heb geen studie gevonden die specifiek 'na certificaat' tegen 'bij aanmelding' test, dus meet het zelf (voorstel 1 legt de bron van elke opt-in al vast, dus dat kan later).

**Risico:** Je bereikt alleen de mensen die de cursus áfmaken. Als afhaakcijfers hoog zijn — en bij gratis online cursussen zijn ze doorgaans hoog — vang je een fractie van je bezoek. De verleiding wordt dan om er toch een popup bij te zetten; doe dat niet, maar voeg wel een tweede, rustig moment toe: één regel op /leerpad voor wie halverwege is.

### Zet de klantrelatie-uitzondering aan met twee zinnen bij de kassa _(publiek-en-vindbaarheid, moeite: klein)_

Bij de Mollie-afrekening één informerende regel plus een afmeldmogelijkheid ter plekke: 'Ik mail je over je aankoop, en soms over een vergelijkbare cursus. Liever niet? Vink dit uit.' Diezelfde regel herhalen in de bevestigingsmail, met een echte afmeldlink. Kopers komen in een aparte lijstsegment dan de nieuwsbriefabonnees, omdat ze op een andere grondslag zitten.

**Waarom:** Dit is de enige groep die je mág mailen zonder om toestemming te vragen — mits je het goed doet. Nu doe je het niet, en dus mag je je best bereikbare publiek (mensen die je al €49 gaven) niets sturen over de volgende cursus. Twee zinnen tekst maken het verschil tussen wel en niet mogen. Het is ook de goedkoopste marketing die er is: verkopen aan iemand die al kocht.

**Bewijs:** DDMA somt de vijf cumulatieve voorwaarden van art. 11.7 lid 3 Tw op: (1) het adres is verkregen in het kader van een verplichting tot een financiële transactie, (2) dezelfde juridische entiteit, (3) de ontvanger is geïnformeerd over het gebruik, (4) hij kon zich bij verzameling al verzetten, (5) het aanbod betreft gelijksoortige eigen producten of diensten. Voorwaarde 3 en 4 zijn precies wat je nu mist. Let op: de afschaffing van de soft opt-in per 1 juli 2026 geldt voor telemarketing, niet voor e-mail — die uitzondering blijft dus bestaan.

**Risico:** Voorwaarde 5, 'gelijksoortig', is de grens. Een andere cursus van jou is gelijksoortig. Een abonnement (College+) waarschijnlijk ook. Een affiliate-link naar een broker absoluut niet, en dat zou je merk sowieso al kosten. Tweede risico: de bevestigingsmail na aankoop bestaat nog niet (staat op je v2-roadmap), dus dit hangt aan voorstel 4. En houd voorwaarde 2 in de gaten bij de domeinwissel: de afzender moet Jason Krijgsman, eenmanszaak, blijven.

### Bouw de verzendfundering voordat je één mail schrijft _(publiek-en-vindbaarheid, moeite: middel)_

Een Europese verzendtool (MailerLite of Brevo — beide EU-gehost met verwerkersovereenkomst, MailerLite is de simpelste voor één persoon), dubbele bevestiging aan, en de DNS-records in Cloudflare: SPF, DKIM en DMARC voor beleggingscollege.com. Verder: een afmeldlink in élke mail die zonder inloggen werkt, een fysiek postadres of KvK-vermelding in de voettekst, en een verwerkingsregister-regeltje in je privacyverklaring dat klopt met wat je echt doet.

**Waarom:** Een vers domein heeft geen verzendreputatie. Zonder correct ingestelde SPF/DKIM/DMARC belandt je eerste mail bij Gmail — waar je publiek zit, ze logden immers met Google in — in de spammap, en dan is je hele lijst in één klap waardeloos. Dubbele bevestiging is niet wettelijk verplicht, maar het is de goedkoopste manier om tegelijk je bewijslast te dekken (voorstel 1), typefouten eruit te filteren en die reputatie te beschermen.

**Bewijs:** MailerLite host EU-abonneedata expliciet binnen de EU; Brevo (Parijs) idem, met DPA. DDMA: afmelden moet 'net zo eenvoudig' zijn als aanmelden — een afmeldlink achter een login is daarom waarschijnlijk onvoldoende, wat relevant is omdat jouw gebruikers via Google inloggen en geen wachtwoord hebben om te onthouden. De AP en meerdere Nederlandse juristen bevestigen dat double opt-in niet verplicht is maar wel het praktische bewijsmiddel.

**Risico:** Dubbele bevestiging kost je 10–25% van je aanmeldingen, want niet iedereen klikt de bevestigingsmail aan. Dat is bewust: die mensen zouden je toch niet gelezen hebben. Verder: kies nu goed, want overstappen van tool kost je later reputatie en soms je hele lijst. Grootste praktische risico is dat je DMARC te streng zet (p=reject) voordat DKIM klopt, en dan je eigen mail blokkeert — begin op p=none en scherp aan.

### Een welkomstreeks van drie mails waarin je niets verkoopt _(publiek-en-vindbaarheid, moeite: middel)_

Drie automatische mails na de dubbele bevestiging. Dag 0: wie je bent, waarom dit platform bestaat, wat ze van je gaan krijgen en hoe vaak — plus meteen de afmeldlink, prominent. Dag 3: de drie boeken waar alles op rust (Graham, Bogle, Housel) en waarom juist die, met per boek één concreet idee dat vandaag bruikbaar is. Dag 8: de eerlijkste mail die je ooit stuurt — wat beleggen niet voor je oplost, en welke drie dingen je eerst geregeld moet hebben (buffer, schulden, horizon) voordat beleggen überhaupt zin heeft. Pas onderaan die derde mail één rustige regel dat er twee betaalde cursussen bestaan.

**Waarom:** De eerste week is het enige moment waarop je bijna zeker gelezen wordt, en het is dus ook het moment waarop je merk zich bewijst of zichzelf tegenspreekt. Een reeks die direct verkoopt bevestigt precies het vermoeden waar je doelgroep last van heeft. Een reeks die begint met 'wat beleggen niet oplost' doet het omgekeerde, en dat is bovendien waar. Het is ook het antwoord op de vraag 'en nu?' die je bij het certificaat opriep.

**Bewijs:** Welkomstmails halen 35–52% openratio tegenover circa 36,5% voor gewone mail, en Omnisend mat in mei 2026 gemiddeld 35,53% open en 11,19% click-to-open op geautomatiseerde welkomstmails — de aandacht is er dus, eenmalig. Inhoudelijk: de derde mail is een directe uitwerking van je eigen merkregel dat cursusinhoud de grenzen van elke methode benoemt.

**Risico:** Drie mails schrijven die niets verkopen voelt als weggegooid werk als er die maand niets binnenkomt, en de verleiding om er in maand drie toch een kortingsactie tussen te schuiven is groot. Dat is het moment waarop dit voorstel faalt. Tweede risico: mail 3 grenst aan financieel advies. Houd het bij algemene voorlichting ('een buffer is gebruikelijk advies'), niet bij persoonlijke aanbeveling, en zet er de opleider-geen-vergunninghouder-regel onder.

### Eén brief per twee weken die tegelijk je blogartikel is _(publiek-en-vindbaarheid, moeite: middel)_

Een vaste rubriek — werktitel 'Uit de boekenkast' — waarin je per keer één idee uit een klassiek boek uitlegt in 600 tot 900 woorden. Elk nummer wordt eerst een blok in `src/content/blog.ts` (waar overzicht, sitemap en SEO vanzelf uit volgen) en gaat daarna als mail de deur uit, met de eerste alinea in de mail en de rest op de site. Eerste zes: Mr. Market en waarom de markt geen orakel is; Bogle over kosten als het enige dat je zeker weet; Housel over het verschil tussen rijk worden en rijk blijven; waarom markttiming bij vrijwel iedereen misgaat (inclusief wat we níét weten); wat een jaarverslag je wel en niet vertelt; de veiligheidsmarge in gewoon Nederlands.

**Waarom:** Dit lost je twee grootste gaten op met één gewoonte, en dat is de enige vorm die een eenmanszaak volhoudt. Je blog heeft één artikel — te weinig om ooit gevonden te worden, en te weinig om autoriteit te tonen. Je lijst heeft niets om te versturen. Dezelfde 900 woorden vullen allebei. De boekenkast is bovendien een oneindige voorraad die exact op je merkbelofte staat, en het is inhoud die niet uit een AI-samenvatting rolt, omdat het jouw lezing van een boek is en niet een feit dat op te zoeken valt.

**Bewijs:** `src/content/blog.ts` bevat nu één post (`waarom-we-geen-koerstips-geven`) en de sitemap bevestigt dat: 32 URL's live, waarvan één blogartikel. De architectuur is al gebouwd voor meer — 'nieuw artikel = blok toevoegen aan posts, overzicht, artikelpagina, sitemap en SEO volgen vanzelf' (CLAUDE.md). Seer Interactive (5,47 mln queries, jan 2025–feb 2026): CTR bij AI Overview 0,61% tegen 1,62% zonder, met informatieve content het hardst geraakt — reden om inhoud te maken die óók zonder Google werkt.

**Risico:** De bouw is klein; de gewoonte is de echte kostenpost. Tweewekelijks is bewust gekozen omdat wekelijks bij een eenmanszaak vrijwel altijd na twee maanden strandt, en een nieuwsbrief die stopt is erger dan geen nieuwsbrief. Tweede risico: bij het bespreken van boeken mag je niet uit auteursrecht putten — parafraseer, citeer hooguit een zin met bronvermelding, reproduceer geen hoofdstukken. Derde: als je 900 woorden per twee weken niet haalt, verlaag dan de frequentie, niet de kwaliteit.

### De SEO-hygiëne die je nu élke gedeelde link kost _(publiek-en-vindbaarheid, moeite: klein)_

Vier kleine dingen, in deze volgorde. (1) Search Console aanmelden met DNS-verificatie via een TXT-record in Cloudflare — dan geldt de verificatie voor het hele domein en overleeft ze de verhuizing naar de .nl; sitemap indienen. (2) Een favicon en een OG-afbeelding, met een variant per cursus. (3) www laten resolveren: CNAME in Cloudflare naar Vercel plus een permanente redirect naar het kale domein. (4) Bing Webmaster Tools erbij, omdat de Bing-index een deel van de AI-zoekmachines voedt.

**Waarom:** Zonder Search Console weet je letterlijk niet of Google je 32 pagina's heeft geïndexeerd, waarop je vertoond wordt, of dat er iets kapot is — je stuurt blind. En de OG-afbeelding is geen cosmetica: de manier waarop een eenmanszaak zijn eerste honderd bezoekers krijgt is dat iemand een link in WhatsApp of LinkedIn plakt. Zonder OG-afbeelding verschijnt daar een grijs blok zonder plaatje, en dat is precies het moment waarop je goedkoop overkomt terwijl je product dat niet is. Dat www niet resolveert kost je elke bezoeker die het adres uit z'n hoofd intikt.

**Bewijs:** Live gecontroleerd: `https://beleggingscollege.com/sitemap.xml` levert 32 URL's, dus de sitemap zelf is in orde en alleen nog niet ingediend. `src/app/sitemap.ts` genereert hem correct uit de content. De brief bevestigt dat favicon, OG-afbeelding en Search Console ontbreken en dat www niet resolveert; CLAUDE.md noemt 'OG-afbeelding, Google Search Console aanmelden + sitemap indienen' zelf al als openstaand.

**Risico:** Nauwelijks risico, wel een valkuil: verifieer in Search Console via DNS en niet via een HTML-bestand of Google Analytics, anders moet je het bij de verhuizing naar de .nl opnieuw doen en verlies je je historie. En verwacht geen effect binnen weken — indexatie en positieopbouw voor een nieuw YMYL-domein duurt maanden. Dit is hygiëne, geen groei.

### Twaalf betaalde lespagina's staan in je sitemap zonder paywall-markering _(publiek-en-vindbaarheid, moeite: klein)_

De lespagina's van Waardebeleggen en Technische Analyse (12 URL's) staan in de sitemap maar tonen een bezoeker zonder aankoop een slot. Twee opties. Voorkeur: het paywall-blok markeren met de structured data die Google daarvoor voorschrijft — `isAccessibleForFree: false` op het Course-object plus een `hasPart` met `@type: WebPageElement` en een `cssSelector` die naar het afgeschermde deel wijst — en tegelijk een echte, crawlbare samenvatting van elke les vrijgeven (wat je leert, waarom het ertoe doet), zodat de pagina inhoudelijk bestaat. Alternatief, als je die samenvattingen niet wilt schrijven: haal de betaalde lessen uit de sitemap en laat alleen de cursusdetailpagina's het werk doen.

**Waarom:** Nu bied je Google twaalf pagina's aan die vrijwel niets bevatten voor wie niet betaald heeft. In het gunstige geval negeert Google ze; in het ongunstige geval drukken ze de gemiddelde kwaliteitsindruk van een domein dat toch al maar 32 URL's heeft. Google waarschuwt bovendien expliciet dat afgeschermde content zónder deze markering richting cloaking gaat, en dat is een spambeleidsovertreding — precies het risico dat je op een YMYL-onderwerp niet wilt lopen.

**Bewijs:** Live gecontroleerd in de sitemap: zes lessen onder /cursussen/waardebeleggen/les/ en zes onder /cursussen/technische-analyse/les/. Google's documentatie over paywalled content schrijft `isAccessibleForFree`, `hasPart`, `@type: WebPageElement` en `cssSelector` voor en noemt `Course` expliciet als ondersteund type — dat past dus precies op jouw contentmodel. Google: bij overtreding 'might not be eligible to be displayed in Search results'.

**Risico:** Het echte risico zit in de uitvoering, niet in het idee: als je crawlbare samenvattingen toevoegt, moet je vasthouden aan je eigen regel dat er nooit een `Course`-object naar een client component gaat (je hebt al eens lesteksten én `correctIndex` gelekt). Bouw de samenvatting als apart veld in het view-model in `src/content/view.ts`, niet door de les zelf half door te geven. Tweede risico: overdrijf de samenvattingen niet — als de gratis samenvatting de les vervangt, verkoop je niets meer.

### Autoriteit tonen in plaats van volume maken _(publiek-en-vindbaarheid, moeite: klein)_

Een echte auteurspagina onder /over-ons met naam, gezicht, achtergrond en — belangrijk — expliciet wat je níét bent (geen AFM-vergunninghouder, geen adviseur). Daaronder: `Person`- en `Organization`-schema op de site, `author`-verwijzing op elk blogartikel en elke cursus, een zichtbare datum van laatste herziening per les, en per les of artikel de bronnen waar het op steunt (welk boek, welk hoofdstuk, welk onderzoek). Plus een korte, gepubliceerde redactionele verantwoording: hoe je content maakt, hoe je hem controleert, en hoe iemand een fout meldt.

**Waarom:** Beleggen is voor Google een YMYL-onderwerp: voor financiële onderwerpen verwacht Google aantoonbare deskundigheid, verifieerbare auteurs, verwijzingen naar gezaghebbende bronnen en een zichtbaar redactieproces. Dat is precies het terrein waarop een eenmanszaak wél kan winnen van contentfarms, want jij hébt een echte naam, echte bronnen en een echte inhoudelijke positie — je maakt ze alleen nergens machineleesbaar. Het is ook het enige SEO-werk dat rechtstreeks je merkbelofte versterkt in plaats van eraan te trekken.

**Bewijs:** Google's Quality Rater Guidelines behandelen financiële onderwerpen als YMYL en stellen daar de hoogste eisen aan Experience, Expertise, Authoritativeness en Trustworthiness. Ik markeer één ding als onzeker: SEO-blogs circuleren cijfers als 'E-E-A-T weegt bij YMYL ongeveer 24% mee' — dat zijn correlatieschattingen van bureaus, geen uitspraken van Google, en ik zou er geen beslissing op baseren. De richting is wel onomstreden en Google's eigen documentatie ondersteunt hem.

**Risico:** Autoriteitssignalen werken traag en zijn niet los te meten; je zult nooit zeker weten dat juist dit hielp. Reëler risico: de verleiding om jezelf groter te maken dan je bent ('jarenlange ervaring', vage claims). Doe dat niet — een auteurspagina die overdrijft is op dit merk schadelijker dan geen auteurspagina. Schrijf op wat waar is, inclusief wat je niet mag.

### Box 3 vanaf 2028 als levend dossier, niet als los artikel _(publiek-en-vindbaarheid, moeite: klein)_

Eén pagina die je onderhoudt in plaats van publiceert-en-vergeet: wat er verandert aan de belasting op beleggingen, wat de stand van zaken is, en wat het praktisch betekent voor iemand die maandelijks inlegt. Met een zichtbare datum van laatste bijwerking, een korte tijdlijn van wat er wanneer gebeurde, en een expliciete regel dat het voorlichting is en geen fiscaal advies. Bijwerken zodra er nieuws is — en er ís nu nieuws.

**Waarom:** Dit is het enige onderwerp met serieus Nederlands zoekvolume waar je nog kunt winnen, om drie redenen. Het beweegt (dus verouderde concurrentie zakt weg en jij kunt vers zijn), het is landgebonden (dus geen internationale concurrentie), en het is precies het soort vraag waarbij mensen een AI-samenvatting niet vertrouwen en op een bron doorklikken — het gaat over hún geld en de regels veranderen. Bovendien geeft het je iets om over te mailen dat urgent is zonder dat je urgentie hoeft te verzinnen: de deadline komt van de wetgever, niet van jou.

**Bewijs:** Stand van zaken augustus 2026, per Rijksoverheid en fiscale vakbronnen: de Tweede Kamer stemde 12 februari 2026 in met het nieuwe stelsel, de Eerste Kamer stelde de stemming uit tot na de zomer van 2026, staatssecretaris informeerde de Kamer op 19 juni 2026 over verbeteropties en het kabinet zou daar in augustus 2026 over beslissen. Beoogde invoering: 1 januari 2028 (eerder 2026, toen 2027). Genoemde parameters: 36% over werkelijk rendement met een heffingsvrij resultaat van €1.800 per persoon, waarbij 35% en €1.900 worden onderzocht. Controleer deze cijfers vóór publicatie — ze staan op het moment van schrijven letterlijk ter discussie.

**Risico:** Twee reële risico's. Ten eerste onderhoud: een gedateerd dossier dat je een jaar niet bijwerkt is slechter dan geen dossier, want het wordt zichtbaar fout op een onderwerp waar fout zijn duur is. Ten tweede de grens: belastinguitleg schuift richting fiscaal advies, en dat is niet jouw vergunning en niet jouw expertise. Blijf strikt bij 'zo werkt de regel' en ga nooit naar 'dit moet jij doen'. Bij twijfel: verwijs door naar de Belastingdienst en naar een fiscalist.

### Haal het slot van één hele betaalde les _(vertrouwen, moeite: klein)_

Maak één complete les uit elke betaalde cursus publiek toegankelijk: de volledige lestekst, de quiz, de opmaak — precies zoals een koper hem krijgt. Geen preview van drie alinea's, geen e-mailmuur, geen account. Op de cursuspagina als: 'Lees les 3 helemaal gratis. Dan weet je wat je koopt.' Kies bewust een sterke les, niet de zwakste.

**Waarom:** Dit is het enige vertrouwenssignaal dat geen derde partij nodig heeft en dat een oplichter niet kan namaken — zijn inhoud houdt geen inspectie. De onzekere beginner hoeft Jason dan niet te vertrouwen; hij kan hem controleren. De gratis beginnerscursus doet dit nu niet: die is gratis omdat hij gratis is, en zegt de koper niets over hoe een betaalde les eruitziet of waarom die €49 waard is.

**Bewijs:** De architectuur maakt dit goedkoop: src/content/view.ts scheidt al publieke van betaalde velden, precies om te voorkomen dat lesteksten en quizantwoorden lekken. Deze wijziging gebruikt datzelfde mechanisme bewust in omgekeerde richting voor één les. Verder is het exact de logica achter het bestaande gratis-cursusmodel, alleen toegepast op het product dat geld kost.

**Risico:** Je geeft ongeveer een zesde van een betaalde cursus weg. Als de overige vijf lessen niet duidelijk méér bieden, maakt de gratis les het koopbezwaar juist zichtbaar in plaats van dat hij het wegneemt. Let ook op de entitlements-regel: de vrijgegeven les mag niet via generateStaticParams de toegangscheck van de rest bevriezen.

### 30 dagen geld terug, ruimer dan de wet, met een knop die er echt is _(vertrouwen, moeite: middel)_

Een expliciete niet-goed-geld-terug van 30 dagen op elke betaalde cursus, zonder reden opgeven, óók nadat je bent begonnen. Eén e-mailadres of zelfbedieningsknop, een beloofde afhandeltermijn van bijvoorbeeld drie werkdagen, en een terugbetaalpad in Mollie dat de toegang netjes intrekt (purchases.status van 'paid' af).

**Waarom:** Bij digitale inhoud doet de koper aan de kassa afstand van zijn wettelijke herroepingsrecht zodra hij de eerste les opent. Juridisch correct, maar voor een beginner die de aanbieder niet kent voelt dat als: geld weg, geen weg terug. Een garantie die precies over die uitzondering heen gaat, verplaatst het risico van de koper naar Jason — en dat is exact wat een get-rich-quick-aanbieder nooit doet. Het is het sterkste antwoord op 'waarom zou ik jou €49 geven' dat geen enkele derde partij hoeft te bevestigen.

**Bewijs:** De 14 dagen zijn een wettelijke ondergrens; een langere termijn mag (ICTRecht, MKB Juristen). Onderzoek van de University of Dallas, aangehaald door Shift Gedrag, laat zien dat langere retourtermijnen tot méér aankopen en mínder daadwerkelijke retouren leiden — mensen raken gehecht aan wat ze langer bezitten. Springest voert zijn niet-goed-geld-terug expliciet als vertrouwensinstrument, maar sluit e-learning uit; daar zit dus een gat dat Beleggingscollege kan vullen.

**Risico:** Bij €49 aan digitale content kan iemand alles doorlezen en dan terugvragen. Bij lage volumes is dat te dragen, maar bouw wel een grens in (bijvoorbeeld geen tweede terugbetaling per klant) en monitor misbruik. Mollie rekent bij terugbetaling kosten door — check de tarieven in docs/betalingen-mollie.md voordat je de belofte publiceert.

### Zet Jasons gezicht en zijn bronnen op de site _(vertrouwen, moeite: klein)_

Een foto van Jason op /over-ons, een link naar zijn LinkedIn, en per cursus een expliciete bronnenlijst: welk boek, welke editie, welk hoofdstuk. Plus per les een korte 'waar dit vandaan komt'-regel die naar die lijst verwijst.

**Waarom:** /over-ons is nu eerlijk en goed geschreven, maar volledig tekstueel — geen gezicht, geen link, niets dat iemand kan natrekken. 'Autodidact zonder bekende naam' is een sterke, eerlijke positionering, maar die wordt pas geloofwaardig als er iemand te zíén is die hem uitspreekt. En de bronnenlijst is autoriteit die je niet hoeft te claimen: je laat zien op wiens schouders je staat. Het merk beroept zich al op Graham, Bogle en Housel, maar die claim is nergens herleidbaar naar een specifieke passage.

**Bewijs:** De wettelijke transparantie staat er al goed: SiteFooter.tsx toont KvK 71856633 en btw-id NL004813328B30, /over-ons noemt vestigingsplaats Den Haag. Dat is precies wat art. 3:15d BW en art. 27 Handelsregisterwet 2007 eisen en waar de ACM op handhaaft — de zakelijke helft is dus af. Wat ontbreekt is de menselijke en inhoudelijke helft, en juist die twee zijn wat een consument daadwerkelijk beoordeelt.

**Risico:** Een foto en een LinkedIn maken Jason persoonlijk vindbaar en aanspreekbaar; bij een merk dat over andermans geld gaat trekt dat ook kritiek aan. En een bronnenlijst nodigt uit tot narekenen — dat is de bedoeling, maar dan moet elke verwijzing wel kloppen, inclusief hoofdstuknummers.

### Dicht de lekken die een bezoeker onbewust als 'niet echt' leest _(vertrouwen, moeite: klein)_

Vier kleine inconsistenties opruimen die samen één patroon vormen: de footer zegt letterlijk 'beleggingscollege.nl' terwijl de site op .com draait, het contactadres is beheer@beleggingscollege.nl op een .com-site, er is geen favicon en geen OG-afbeelding (dus een gedeelde link landt als leeg vierkant in WhatsApp), en www resolvet niet.

**Waarom:** Wie twijfelt of een site echt is, scant onbewust op inconsistenties. Een footer die een ander domein noemt dan de adresbalk is precies zo'n signaal — het leest als een haastig gekopieerde template. Dit is het goedkoopste vertrouwen dat er bestaat: geen abonnement, geen audit, geen derde partij, alleen afmaken wat half staat.

**Bewijs:** SiteFooter.tsx regel 89 zet 'beleggingscollege.nl' hard in de tekst terwijl src/lib/site.ts als standaard https://beleggingscollege.com hanteert; /over-ons regel 267 en de contactpagina noemen een .nl-mailadres. CLAUDE.md noteert zelf onder SEO-huisregels dat de OG-afbeelding en Google Search Console nog openstaan, en de opdracht bevestigt dat www niet resolvet.

**Risico:** Inhoudelijk geen risico, maar wel een valkuil: als je nu alles naar .com trekt en het .nl-domein komt straks alsnog vrij, herhaal je de inconsistentie in omgekeerde richting. Laat de footer daarom SITE_URL lezen in plaats van een hardgecodeerde string, dan verhuist hij vanzelf mee.

### Word lid van Webshop Keurmerk — het enige keurmerk dat past _(vertrouwen, moeite: middel)_

Lidmaatschap van Stichting Webshop Keurmerk: €195 per jaar exclusief btw, geen certificeringskosten, opzegbaar zonder termijn, inclusief geschillenbemiddeling en gratis gecontroleerde algemene voorwaarden. Logo in de footer met een link naar de openbare registervermelding.

**Waarom:** Op dit moment staat er geen enkele externe partij in voor Beleggingscollege. Een keurmerk is de goedkoopste eerlijke vorm van 'iemand anders heeft hiernaar gekeken': je koopt geen lovende woorden, je koopt toetsing plus een klachtenroute voor de klant. Dat laatste is voor een onzekere koper misschien nog belangrijker dan het logo — het betekent dat hij ergens terechtkan als het misgaat, zonder Jason zelf te hoeven vertrouwen. Bijkomend voordeel: de gratis juridisch gecontroleerde voorwaarden lossen meteen het probleem op dat /voorwaarden, /privacy en /herroepingsrecht nu concepten op noindex zijn.

**Bewijs:** Vergelijking op keurmerk.info: Webshop Keurmerk €195/jr, 10.000+ leden, geschillenbemiddeling inbegrepen, €0 certificeringskosten, opzegbaar zonder opzegtermijn. Thuiswinkel Waarborg vraagt €890 certificering plus €75 inschrijving plus omzetafhankelijke contributie. WebwinkelKeur kost circa €276/jr maar heeft géén geschillenbemiddeling. Alleen Webshop Keurmerk en Thuiswinkel Waarborg dragen officiële erkenning.

**Risico:** De algemene voorwaarden van Stichting Webshop Keurmerk sluiten expliciet 'financiële diensten' uit. Beleggingscollege verkoopt onderwijs en geen financiële dienst, maar dat onderscheid moet schriftelijk bevestigd zijn vóórdat je €195 overmaakt — anders betaal je voor een keurmerk dat je niet mag voeren. Tweede risico: een keurmerk werkt alleen als de bezoeker het herkent, en Webshop Keurmerk is bij consumenten minder bekend dan Thuiswinkel Waarborg.

### Verzamel echte reviews, maar alleen van echte kopers _(vertrouwen, moeite: middel)_

Koppel een geverifieerd reviewsysteem dat alleen mensen kan uitnodigen die daadwerkelijk hebben betaald: WebwinkelKeur vanaf circa €12 per maand, Kiyoh vanaf €24,95 per maand, Feedback Company vanaf €39 per maand — of het onbeperkt gratis reviews verzamelen dat al in de €195 van Webshop Keurmerk zit. Uitnodiging automatisch versturen na het afronden van de laatste les, niet direct na aankoop.

**Waarom:** Het merk verbiedt verzonnen sociale bewijskracht, en terecht — de drie testimonials van de oude site zijn verwijderd toen bleek dat die site nul bestellingen had. Maar het verbod is op verzinnen, niet op sociale bewijskracht. Een systeem waarin uitsluitend kopers kunnen schrijven en het oordeel bij een derde partij staat, is precies het eerlijke alternatief: het bewijs is verifieerbaar en Jason heeft er geen hand in. Dat is een sterker signaal dan een testimonial ooit was, juist omdat hij hem niet kan sturen.

**Bewijs:** Kiyoh verzamelt geverifieerde reviews en toont sterren in Google (vanaf €24,95/mnd na vier weken proef), WebwinkelKeur biedt keurmerk plus reviewsysteem vanaf €12/mnd, Feedback Company vanaf €39/mnd. Webshop Keurmerk onderscheidt zich met onbeperkt gratis reviews verzamelen binnen de jaarbijdrage — als je toch voor dat keurmerk kiest, is dit dus inbegrepen.

**Risico:** Met een handvol klanten is een leeg of bijna leeg reviewprofiel schadelijker dan géén profiel: het maakt zichtbaar hoe klein je bent. Zet dit dus pas aan als er verkoop loopt. En je geeft controle uit handen — één slechte review over 'zes lessen voor €49' is een reëel scenario en blijft permanent staan.

### Vertel bij de koopknop precies wat je wél en niet krijgt _(vertrouwen, moeite: klein)_

Direct bij de prijs, niet weggestopt in de voorwaarden: wat je koopt (zes lessen, ongeveer vijftig minuten, levenslang toegang, printbaar certificaat), wat je níét koopt (geen persoonlijk advies, geen rendementsbelofte, geen signalen, geen community, geen begeleiding), wie het gemaakt heeft, en de garantie. Plus een eerlijk antwoord op de vraag die niemand stelt maar iedereen denkt: is 'levenslang' echt levenslang, en wat gebeurt er als de site ooit stopt?

**Waarom:** €49 voor ongeveer vijftig minuten is de grootste prijsweerstand op de site, en een beginner rekent dat in twee seconden uit. Het zelf benoemen — inclusief de minuten — is ontwapenend en past bij een merk dat zich juist afzet tegen wie het verzwijgt. Het verzwijgen leest daarentegen precies als de tactiek van de aanbieders waar Beleggingscollege tegenover wil staan. Deze verandering kan bovendien meteen met voorstel 1 en 2 mee: samen vormen ze één blok bij de koopknop.

**Bewijs:** De normen van Webshop Keurmerk eisen letterlijk dat producten of diensten duidelijk beschreven zijn met de actuele consumentenprijs, en dat de bestelknop duidelijk maakt dat er een betaalverplichting ontstaat — dit voorstel loopt daar dus op vooruit. De AFM-lijn uit de finfluencer-verkenning is dat objectieve uitleg over beleggen is toegestaan maar ingaan op iemands persoonlijke situatie niet; dat onderscheid hoort zichtbaar te zijn op het moment van kopen, niet alleen in de footer.

**Risico:** Eerlijk zijn over 'zes lessen, vijftig minuten, €49' kan de conversie op korte termijn verlagen. Dan is dat echte informatie over de prijsstelling, geen probleem met de tekst — en de vraag verschuift naar of de prijs klopt (zie docs/prijsstrategie.md), niet of de pagina beter moet verkopen.

### Haal het enige verifieerbare diploma dat wél bereikbaar is: Wft Vermogen _(vertrouwen, moeite: groot)_

Zelf het Wft-examen Vermogen afleggen. Circa €170 tot €300 per module per poging, je kunt je zonder werkgever aanmelden bij een erkende examenprovider, en het diploma is na twee werkdagen te downloaden via Mijn Wft (DUO) — dus objectief natrekbaar. Vermelden als 'Wft Vermogen behaald', altijd met de expliciete toevoeging dat dit géén AFM-vergunning is en dat Beleggingscollege onderwijs geeft, geen advies.

**Waarom:** Dit is het enige credential dat inhoudelijk over beleggen gaat én dat een eenmanszaak zonder AFM-vergunning realistisch kan halen. Het maakt het antwoord op 'wie ben jij om mij dit te leren' controleerbaar in plaats van een verhaal. Voor het merk is dat consistent: de site zegt nu eerlijk 'geen bekende naam, een autodidact' — een behaald examen verandert dat niet, maar bewijst wel dat de autodidact zichzelf aan een externe toets heeft onderworpen.

**Bewijs:** Alle alternatieven vallen aantoonbaar af. CRKBO geldt alleen voor beroepsonderwijs; onderwijs gericht op vaardigheden in de persoonlijke levenssfeer (hobbycursussen) is expliciet uitgesloten en de Belastinginspecteur beslist over de classificatie. Het NRTO-keurmerk vereist NRTO-lidmaatschap, waarvan de contributietabel start bij €150.000 omzet à €1.500 per jaar plus €50 keurmerkbijdrage. DSI-registratie vereist dat je werkgever of opdrachtgever DSI-deelnemer is. KFD, SEH, Adfiz en KiFiD zijn er voor financiële dienstverleners met Wft-diploma's, niet voor opleiders. Wft-examens daarentegen kosten €169,95 bij het WFT Instituut tot €200–300 via CDFD-providers, en het diploma kent geen algemene vervaldatum (wel driejaarlijkse PE).

**Risico:** Maanden studie en een paar honderd euro voor een titel die vrijwel geen consument kent — het rendement op vertrouwen is dus onzeker. Groter risico: een Wft-diploma suggereert adviesbevoegdheid. Vermeld je het zonder keiharde disclaimer, dan beweeg je precies richting het gebied waarop de AFM finfluencers aanspreekt. Doe dit niet als eerste, maar pas als de goedkopere voorstellen staan.

### Quizfeedback hoorbaar maken (en niet alleen met kleur) _(toegankelijkheid, moeite: klein)_

Elke quizvraag wordt een echte <fieldset> met <legend> en echte radio-inputs, zodat pijltjestoetsen werken zoals een schermlezergebruiker verwacht. Na het antwoorden verschijnt de uitkomst in een klein gebied met role="status" (aria-live="polite") met volledige zinnen: "Goed. Antwoord B was juist." of "Fout. Jij koos B; juist was C — [uitleg]". Goed/fout krijgt naast kleur ook een icoon én het woord zelf. De focus blijft staan waar hij is en springt niet weg.

**Waarom:** Dit is het gat dat de eerdere controle vond. De quiz is de kern van de leerervaring én van de XP-bonus; zonder terugkoppeling weet een blinde gebruiker niet of hij iets geleerd heeft. Bij een cursus van €49 is dat niet 'minder fijn', dat is een product dat niet levert wat het belooft. Kleurenblinde gebruikers (ongeveer 1 op 12 mannen) zien het groen/rood-onderscheid evenmin.

**Bewijs:** WCAG 2.2 succescriterium 4.1.3 Status Messages (niveau AA) beschrijft precies dit geval: dynamische feedback die niet bij de focus staat, moet via role="status" of role="alert" aan hulpsoftware worden doorgegeven zonder de focus te verplaatsen (W3C Understanding-document). Aanvullend 1.4.1 Use of Color (niveau A) voor het niet-alleen-kleur-deel.

**Risico:** Een live region die te veel omvat is erger dan geen: als het hele quizblok opnieuw rendert, leest de schermlezer de complete vraag met alle antwoorden nogmaals voor. Alleen de feedbackzin hoort in de live region. Dit is ook precies het soort fout dat automatische testtools niet vangen — één testronde met NVDA (gratis, Windows) of VoiceOver is echt nodig.

### Alles bedienbaar met het toetsenbord, met een zichtbare focusring _(toegankelijkheid, moeite: klein)_

Een skip-link "Direct naar de inhoud" als eerste focusbare element van de pagina (springt naar een <main> met tabindex="-1"). Eén globale :focus-visible-stijl in globals.css: 2 px outline met minstens 3:1 contrast plus offset, en nergens outline:none zonder vervanging. Daarna een handmatige Tab-ronde door lesnavigatie, koopknop, mobiel menu en accordeons: alles bereikbaar, Escape sluit wat opent, en de focus verdwijnt niet achter een sticky header.

**Waarom:** Iedereen met een motorische beperking, RSI, tremor of schermlezer bedient de site zonder muis. Zonder zichtbare focusring is de site technisch bedienbaar maar praktisch onbruikbaar — je ziet niet waar je bent. Extra scherp hier: dit raakt de koopknop en de route naar Mollie. Een omzetpad waarvan de focus onzichtbaar is, verliest klanten die niets zeggen over waarom ze afhaakten.

**Bewijs:** WCAG 2.1.1 Keyboard (A), 2.4.7 Focus Visible (AA) en 2.4.11 Focus Not Obscured (Minimum) (AA, nieuw in WCAG 2.2 — die laatste gaat specifiek over sticky headers die de gefocuste knop bedekken). De Mollie-betaalpagina zelf is Mollie's verantwoordelijkheid, en Mollie is geen micro-onderneming, dus die moet wél aan de EAA voldoen.

**Risico:** Tailwind's preflight-reset en losse componenten kunnen focusstijlen op onverwachte plekken slopen; één globale regel dekt niet alles. En een skip-link die naar een element zonder tabindex="-1" wijst, doet in de meeste browsers helemaal niets — dat is een klassieke schijnoplossing.

### lang="nl", één h1 per pagina en echte landmarks _(toegankelijkheid, moeite: klein)_

<html lang="nl"> in de root-layout. Per pagina precies één <h1>, geen kopniveaus overslaan, en koppen gebruiken voor structuur in plaats van voor lettergrootte. <main>, <nav>, <header>, <footer> als echte elementen, met aria-label waar er meerdere van hetzelfde type zijn (bijvoorbeeld hoofdnavigatie versus lesnavigatie).

**Waarom:** Zonder lang-attribuut leest een schermlezer Nederlandse tekst voor met een Engelse stemsynthese — dat klinkt als onzin en maakt de site onbruikbaar, terwijl de fix één woord is. Koppen zijn hoe een blinde gebruiker een les van 800 woorden doorbladert; zonder koppenstructuur moet hij alles lineair afluisteren. Landmarks doen hetzelfde voor de paginaindeling.

**Bewijs:** WCAG 3.1.1 Language of Page (niveau A — het laagste niveau dat er is), 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA). Let op: ik heb de code niet kunnen inzien, dus mogelijk staat lang="nl" er al — Next.js zet standaard lang="en" in de gegenereerde layout, wat de meest voorkomende variant van deze fout is.

**Risico:** Als koppen nu vooral voor opmaak worden ingezet, kost het herstructureren wat CSS-werk om de visuele hiërarchie gelijk te houden. Verder geen risico.

### Contrast van de merkkleuren narekenen, vooral het goud _(toegankelijkheid, moeite: klein)_

Alle kleurtokens in globals.css narekenen tegen hun werkelijke achtergrond: 4.5:1 voor tekst, 3:1 voor iconen, randen en de focusring. Het goud-accent voor gamification is het grootste risico — goud op wit haalt zelden 4.5:1. Oplossing: een donkerder goudtint voor tekst en het heldere goud alleen als vlak, rand of icoonvulling. Daarnaast: vergrendeld/voltooid/actief nooit alleen via kleur aangeven, maar met een woord of icoon erbij ("Vergrendeld", "Voltooid").

**Waarom:** Ongeveer 1 miljoen Nederlanders heeft een visuele beperking, en daarbovenop leert iedereen weleens op een telefoon in de zon. Dit is bovendien de goedkoopste categorie fouten om te herstellen zolang het om tokens gaat — en de duurste als je er pas achter komt nadat vier cursussen en een blog erop gebouwd zijn.

**Bewijs:** Ik heb de merkkleuren uit CLAUDE.md zelf nagerekend tegen wit: #0072CE geeft 4,89:1 (net voldoende voor normale tekst), #006546 geeft 7,1:1 en bodytekst #53565A geeft 7,4:1. De basis is dus in orde — het gaat om het goud-accent en om lichtgrijze hulptekst, die beide nog niet nagerekend zijn. Normen: WCAG 1.4.3 Contrast (AA), 1.4.11 Non-text Contrast (AA), 1.4.1 Use of Color (A).

**Risico:** Een donkerder goud maakt de beloningsmomenten visueel platter. Vang dat op met vorm, schaal of een badge-omtrek in plaats van met meer verzadiging. En let op: #0072CE zit met 4,89:1 dicht bij de grens — gebruik die kleur niet op een lichtgrijze achtergrond, want dan zakt hij eronder.

### Beweging uitzetbaar maken en de site laten werken op 320 px en 200% zoom _(toegankelijkheid, moeite: klein)_

Eén globale @media (prefers-reduced-motion: reduce)-regel die XP-animaties, confetti, streak-effecten en overgangen terugbrengt tot een fade of niets. Controleren dat er geen user-scalable=no of maximum-scale in de viewport-meta staat. Daarna de lespagina en het leerpad testen op 320 CSS-pixels breed en op 200% tekstvergroting: geen horizontaal scrollen, geen afgekapte tekst, geen overlappende badges.

**Waarom:** Bewegende beloningsanimaties veroorzaken misselijkheid en duizeligheid bij mensen met een vestibulaire aandoening, en leiden af bij ADHD en autisme — precies de mensen die al moeite hebben om bij een financiële tekst te blijven. Zoom is verreweg het meest gebruikte hulpmiddel bij slechtziendheid: veel meer mensen vergroten dan schermlezers gebruiken. Gamification die je niet uit kunt zetten, is voor een deel van je publiek een reden om weg te klikken.

**Bewijs:** WCAG 1.4.4 Resize Text (AA), 1.4.10 Reflow (AA, expliciet 320 CSS-pixels), 1.4.12 Text Spacing (AA). Voor beweging: 2.3.3 Animation from Interactions is formeel AAA, maar de implementatie is één CSS-mediaquery — ongebruikelijk goedkoop voor het effect.

**Risico:** Gamification is een verkoopargument; te ver terugschroeven maakt de ervaring voor iedereen saai. Daarom alleen reageren op de systeeminstelling van de gebruiker, niet standaard uitzetten. Reflow op 320 px kan bij het leerpad-dashboard met XP-balken en badges echt herontwerp vragen — dat is de enige plek waar dit voorstel groter kan uitvallen dan 'klein'.

### Een eerlijke toegankelijkheidsverklaring met een meldknop _(toegankelijkheid, moeite: klein)_

Een pagina /toegankelijkheid die drie dingen doet: benoemen wat aantoonbaar werkt, benoemen wat nog niet werkt en wanneer dat wordt aangepakt, en een direct e-mailadres met de toezegging binnen een concreet aantal werkdagen een doeltreffende aanpassing te zoeken — bijvoorbeeld de lestekst als platte tekst of als audiobestand toesturen. Met een datum erbij, en bijwerken als er iets verandert.

**Waarom:** Dit is precies het mechanisme dat de Wgbh/cz verlangt: een aanpassing op verzoek. Het is de goedkoopste juridische verzekering die er is, want het verplaatst het gesprek van 'ontoegankelijke website' naar 'aanbieder die meedenkt'. En het past exact bij het merk: eerlijk zijn over wat je nog niet kunt, in plaats van een 'WCAG compliant'-badge plakken die niet klopt. Bij een merk dat zich verkoopt op eerlijkheid is deze pagina inhoudelijk sterker dan de meeste marketingtekst op de site.

**Bewijs:** Wgbh/cz artikel 2: de aangesprokene "is gehouden naar gelang de behoefte doeltreffende aanpassingen te verrichten, tenzij deze voor hem een onevenredige belasting vormen", en artikel 2a: draagt "tenminste geleidelijk zorg voor de algemene toegankelijkheid". Artikel 5b maakt het van toepassing op het aanbieden van goederen en diensten. Handhaving loopt via het College voor de Rechten van de Mens; dat oordeelde in 2017 dat Rabobank discrimineerde nadat een app-update de VoiceOver-ondersteuning brak en de bank weigerde iets te doen. Oordelen zijn openbaar, inclusief bedrijfsnaam.

**Risico:** Een verklaring die meer belooft dan de site waarmaakt is misleidend en dus erger dan geen verklaring — zeker voor dit merk, en zeker zodra er betaald wordt. Schrijf alleen op wat daadwerkelijk is getest, en claim nooit 'voldoet aan WCAG 2.2 AA' zonder audit. Beloof ook geen reactietermijn die je als eenmanszaak in een drukke week niet haalt.

### Toegankelijkheid automatisch bewaken in de build _(toegankelijkheid, moeite: klein)_

eslint-plugin-jsx-a11y aanzetten in de bestaande lint-configuratie, en @axe-core/react in development zodat problemen tijdens npm run dev in de console verschijnen. Optioneel één Playwright-test met axe-core over drie representatieve pagina's: home, cursusdetail en een lespagina met quiz, die faalt bij nieuwe overtredingen.

**Waarom:** Alles hierboven verwatert zodra er een vierde cursus, een tweede blogartikel of een abonnementspagina bijkomt — juist bij een eenmanszaak, waar niemand meekijkt. Automatische controle vangt precies het saaie, herhaalbare deel: ontbrekende alt-teksten, invoervelden zonder label, overgeslagen kopniveaus, te laag contrast. Dat is het deel dat je anders elke release opnieuw handmatig moet vinden.

**Bewijs:** Automatische tools vangen naar schatting een derde tot iets meer dan de helft van de WCAG-problemen; Deque claimt met eigen tooling ongeveer 57%, onafhankelijke studies komen lager uit. Bewust genoemd als onzeker cijfer: de spreiding is groot en hangt af van de site. De richting is niet omstreden — nuttig, maar bij lange na niet voldoende.

**Risico:** Valse gerustheid is hier de echte kostenpost. Een groene axe-score zegt niets over of de quizfeedback wordt voorgelezen, of de tabvolgorde logisch is, of de tekst begrijpelijk is. Zet het in als vangnet tegen terugval, niet als bewijs van toegankelijkheid — en schrijf dat verschil op in de toegankelijkheidsverklaring.

### De rente-op-rente-rekenmachine toegankelijk maken _(toegankelijkheid, moeite: middel)_

Elk invoerveld een zichtbaar gekoppeld <label> (geen placeholder als label). De uitkomst in een aria-live="polite"-gebied, zodat een wijziging wordt voorgelezen zonder dat de focus verspringt. Als er een schuifregelaar is: ook bedienbaar met pijltjestoetsen én met een gewoon getalsveld ernaast, nooit alleen slepen. En onder de grafiek een uitklapbare tabel met dezelfde getallen per jaar.

**Waarom:** Dit is de enige interactieve tool op de hele site en hij staat in de gratis cursus — het is dus het visitekaartje, het ding dat mensen onthouden en delen. Voor een blinde gebruiker is een grafiek zonder tekstalternatief een leeg vlak, en juist rente-op-rente is het inzicht waar de hele didactiek op rust. Een tabel helpt bovendien iedereen die liever precieze getallen leest dan een curve schat.

**Bewijs:** WCAG 1.1.1 Non-text Content (A) voor het tekstalternatief bij de grafiek, 2.5.7 Dragging Movements (AA, nieuw in WCAG 2.2) voor de schuifregelaar, 4.1.3 Status Messages (AA) voor de uitkomst, en 1.3.1 voor de labelkoppeling.

**Risico:** Bij een looptijd van 40 jaar wordt de tabel erg lang; groepeer per 5 jaar of maak hem standaard ingeklapt. En een live region die bij elke toetsaanslag opnieuw voorleest wordt onuitstaanbaar — voeg een korte vertraging toe of ververs pas als het veld de focus verliest.

### Quizresultaten teruggeven en onbeperkt laten herkansen, zonder tijdsdruk _(toegankelijkheid, moeite: middel)_

De quizscores die nu al worden opgeslagen zichtbaar maken op de lespagina en het leerpad ("6 van de 8 goed, laatst geoefend op 2 augustus"), met een knop om de quiz opnieuw te doen en de mogelijkheid per vraag terug te zien welk antwoord juist was en waarom. Nergens een timer, en de gekozen antwoorden blijven zichtbaar na afloop.

**Waarom:** Mensen met een cognitieve beperking, geheugenproblemen, dyslexie of AD(H)D hebben herhaling nodig, en zonder zichtbaar resultaat weten ze niet wát ze moeten herhalen. Nu wordt de data wél opgeslagen en niet teruggegeven — dat is leerwaarde die al betaald is maar niet geleverd wordt. Een timer toevoegen zou hier ronduit uitsluitend werken: langzamer lezen is geen minder begrijpen.

**Bewijs:** WCAG 2.2.1 Timing Adjustable (A) verbiedt niet-aanpasbare tijdslimieten; 3.3.3 Error Suggestion (AA) vraagt om een bruikbare correctiesuggestie bij een fout antwoord. De W3C COGA-richtlijnen (Making Content Usable for People with Cognitive and Learning Disabilities) bevelen herhaling, zichtbare voortgang en het wegnemen van tijdsdruk expliciet aan.

**Risico:** Onbeperkt herkansen in combinatie met de XP-bonus is een puntenpomp die het hele levelsysteem devalueert. Laat de XP-bonus alleen bij de eerste poging meetellen — dat is al de regel voor herhaalde lessen, dus consistent met wat er staat. Tweede risico: dit voorstel raakt de voortgangsopslag, en zolang die in localStorage zit, verdwijnt het resultatenoverzicht bij elk apparaatwissel.

### Jargon uitlegbaar maken: taalniveau B1 en een begrippenlijst _(toegankelijkheid, moeite: groot)_

Een herbruikbare component die een vakterm (rendement, spreiding, koers-winstverhouding, ETF, volatiliteit) markeert met een korte uitleg die verschijnt bij zowel muisaanwijzer als toetsenbordfocus, en die als échte tekst in de DOM staat — geen title-attribuut. Daarnaast per cursus een begrippenlijst, en een taalronde over de openingsalinea van elke les richting B1: kortere zinnen, actieve vorm, geen Engelse term zonder Nederlandse uitleg erbij.

**Waarom:** 2,5 miljoen Nederlanders van 16 jaar en ouder hebben moeite met lezen, schrijven of rekenen, en dat is niet vooral een migratieverhaal — de meerderheid heeft een Nederlandse achtergrond. Het is exact de groep die het meeste te verliezen heeft aan get-rich-quick-aanbieders en het meeste te winnen aan eerlijk onderwijs. De belofte 'toegankelijk beleggingsonderwijs voor beginners' is niet waargemaakt als je er B2-Nederlands met financieel jargon voor moet kunnen lezen. Dit is de enige van de tien voorstellen die niet over software maar over de kernbelofte van het merk gaat.

**Bewijs:** Stichting Lezen en Schrijven, factsheet laaggeletterdheid: 2,5 miljoen laaggeletterden van 16+ (recentere cijfers voor 16-75 lopen op tot circa 3 miljoen; ik markeer die spreiding als onzeker omdat de meetmethode verschilt). Formeel: WCAG 3.1.3 Unusual Words en 3.1.5 Reading Level zijn niveau AAA — dit is dus géén wettelijke eis, maar een merkbelofte. Precies daarom staat het onderaan qua urgentie en bovenaan qua identiteit.

**Risico:** Versimpelen kan precisie kosten, en dit merk verkoopt juist precisie en boekentrouw. De uitweg is de ingang verlagen, niet de inhoud: leg moeilijke termen uit in plaats van ze te vermijden. Tweede risico: hover-tooltips zijn berucht lastig toegankelijk te krijgen (ze voldoen zelden aan WCAG 1.4.13 Content on Hover or Focus) — een uitklapbare definitie of een inline <dfn> met link naar de begrippenlijst is veiliger dan een zwevende tooltip. Derde risico: 17.200 woorden herzien is echt werk; begin met de gratis cursus, want dat is de instap waar mensen afhaken.

## Het advies van de weger

## Stap nul (kost een uur, staat in geen enkel voorstel)

Zet de live Mollie-key in Vercel en zet Vercel op Pro. Zolang er een `test_`-key staat, is elk van de 46 voorstellen decoratie op een winkel waar de kassa niet werkt — en Hobby verbiedt commercieel gebruik sowieso. Dit is geen prioriteit, dit is de voorwaarde.

---

## De zeven, in volgorde

**1. Presentatie- en vindbaarheidshygiëne** — *voorstel 25 + 32, plus de twee gratis toegankelijkheidsfixes uit 39 en 38*
Favicon, OG-afbeelding, www laten resolveren, footer en contactadres die nu `.nl` zeggen op een `.com`-site, Search Console via DNS-verificatie (overleeft de domeinverhuizing), Bing erbij. Meeliften: `lang="nl"` in de root-layout (één woord, en zonder dat leest een schermlezer je site voor met een Engelse stem) en één globale `:focus-visible`-stijl.
**Waarom eerst:** dit is het enige blok waar álles wat je daarna doet doorheen moet. Elke link die je ooit deelt landt nu als grijs vierkant in WhatsApp; zonder Search Console weet je letterlijk niet of je 32 pagina's geïndexeerd zijn. Het is ook het goedkoopste vertrouwen dat bestaat: een site die een ander domein noemt dan de adresbalk leest als haastwerk.
**Kosten:** 4 tot 6 uur. Eén avond en een ochtend.

**2. Maak de verkooppagina controleerbaar in plaats van overtuigend** — *voorstel 29 + 35 + 30 + 31, en de sitemap-opruiming uit 26*
Eén hele sterke les uit elke betaalde cursus volledig open (tekst, quiz, opmaak — geen preview, geen e-mailmuur). Direct bij de prijs: wat je krijgt (6 lessen, ~50 minuten, levenslang, certificaat) én wat je níét krijgt (geen advies, geen signalen, geen begeleiding). 30 dagen geld terug zonder reden, ook na openen. Een foto van jezelf en een bronnenlijst per cursus. En haal meteen de nog-vergrendelde lespagina's uit de sitemap.
**Waarom hier:** €49 voor vijftig minuten is jouw grootste bezwaar en een beginner rekent dat in twee tellen uit. Je kunt dat niet wegschrijven, alleen wegnemen. Een garantie kost je nu nul euro (je hebt geen kopers om terug te betalen) en verplaatst het risico van de twijfelaar naar jou — precies wat een get-rich-quick-aanbieder nooit doet. Een hele gratis les is het enige vertrouwenssignaal dat geen derde partij nodig heeft en dat een oplichter niet kan namaken.
**Kosten:** 1,5 tot 2 dagen, waarvan het meeste tekst.

**3. Eén e-mailadres kunnen verzamelen, met bewijs en met werkende verzending** — *voorstel 20 + 19 + 22, plus één welkomstmail uit 23*
Toestemmingstabel in de database (tijdstip, doel, bron, tekstversie — geen losse boolean), twee gescheiden doelen, allebei standaard uit. Eén aanmeldmoment: onder het certificaat van de gratis cursus. MailerLite of Brevo, dubbele bevestiging, SPF/DKIM/DMARC in Cloudflare. Eén welkomstmail, geen reeks van drie.
**Waarom hier:** dit is het enige item in de lijst waar uitstel onomkeerbaar is. Iedereen die deze maand de gratis cursus doet, is daarna permanent onbereikbaar — geen kanaal voor een lancering, geen kanaal voor een aanbieding, geen kanaal om iemand terug te halen. En je publiek logt met Google in, dus zonder correcte DNS-records belandt je eerste mail bij Gmail in de spam en is je hele lijst in één klap waardeloos.
**Kosten:** 2 dagen. De DNS-records zijn een uur, de rest is zorgvuldigheid.

**4. Voortgang en quizresultaten naar de database** — *voorstel 8/11 samengevoegd, met de zichtbare opbrengst uit 45 en 13*
XP, vinkjes, streak, badges en quizscores van localStorage naar `lesson_progress` en `user_stats`, met eenmalige samenvoeging bij eerste login. Daarbovenop: laat de quizuitslagen zien die je nu al opslaat maar nergens toont — per les je score, welke vragen fout waren met de uitleg, en een knop 'doe alleen de foute vragen opnieuw'.
**Waarom hier en niet eerder:** de migratie is nú op zijn goedkoopst, want er is nog bijna geen lokale data om over te zetten. Elke maand dat je wacht wordt hij duurder. Iemand die op zijn telefoon begint en op zijn laptop verdergaat verliest nu alles — bij een betaald product is dat het soort ervaring waarna iemand zijn geld terugvraagt. En het is de bodemplaat onder 5, 6 en alles wat een cursist ooit wil bewaren.
**Meenemen terwijl je de quizcomponent toch openhebt:** de toegankelijkheidsfixes uit voorstel 37 (echte fieldset/radio's, `role="status"`, goed/fout niet alleen met kleur). Los is dat een klusje, tegelijk is het bijna gratis.
**Kosten:** 3 tot 4 dagen.

**5. De twee rekenmachines, één per betaalde cursus** — *voorstel 1 + 4*
Veiligheidsmarge met de 5×5-gevoeligheidstabel, en positiegrootte met de overlevingscheck. Zelfde vorm werk, dus in één blok.
**Waarom hier:** dit is je scherpste antwoord op "waarom niet gratis YouTube". Een video kán niet laten voelen dat je waardering met twee procentpunt verschil dertig procent verschuift; aan de knoppen draaien wel. En beginners in technische analyse gaan niet failliet aan verkeerde patronen maar aan te grote posities — die tool voorkomt echte schade. Ze maken bovendien allebei een bestaande les beter zonder dat je één nieuwe les schrijft.
**Kosten:** 2 tot 3 dagen samen. Geen API, geen koersdata, geen licentiegedoe.

**6. Beleggingsplan-generator** — *voorstel 5*
Acht tot tien vragen, printbaar via de bestaande certificaatroute, opgeslagen in het account, over een jaar naast je oude versie te leggen.
**Waarom hier:** het tastbare eindproduct dat de aankoop achteraf rechtvaardigt. "Ik heb zes teksten gelezen" versus "ik heb een gedateerd plan dat van mij is" is precies het verschil dat een YouTube-serie structureel niet levert. Het kan pas na 4.
**Kosten:** 2 tot 3 dagen.

**7. 'Uit de boekenkast': één stuk per twee weken dat blog én mail is, met Box 3 als eerste levend dossier** — *voorstel 24 + 28*
600 tot 900 woorden, eerst een blok in `src/content/blog.ts`, daarna de mail eruit. Box 3 vanaf 2028 als pagina die je bijhoudt in plaats van publiceert-en-vergeet.
**Waarom als laatste én als enige doorlopende:** dit is de enige motor voor bezoekers in de hele lijst. Je blog heeft één artikel — te weinig om ooit gevonden te worden. Dezelfde 900 woorden vullen je blog én je lijst, en dat is de enige vorm die één persoon volhoudt. Box 3 is bovendien het enige Nederlandse onderwerp met serieus zoekvolume waar je nog kunt winnen: het beweegt, het is landgebonden, en mensen vertrouwen er geen AI-samenvatting over.
**Kosten:** 3 tot 4 uur per stuk, om de week, voor onbepaalde tijd. Dit stopt nooit — dat is het punt.

**Totaal 1 t/m 6: ongeveer 11 tot 14 werkdagen.** Voor iemand die 's avonds werkt: twee tot drie maanden. Als je in augustus maar één ding doet, doe dan 1 en 2 — samen nog geen week, en de opbrengst is onomkeerbaar.

---

## Wat ik níét zou doen, en waarom

- **College+ bouwen (18).** Niet nu, niet dit jaar. Bij ~100 minuten betaalde inhoud is maand twee inhoudelijk leeg, SEPA-incasso is niet eens goedgekeurd, en je omzet zou uit vergeetachtigheid komen in plaats van uit waarde. Dat is geen churnprobleem maar een merkprobleem: je claimt de eerlijke tegenhanger te zijn van precies dit. Haal de aankondiging weg of zet er "in ontwikkeling" bij.
- **Grafiek-trainer (3).** Inhoudelijk het beste idee in de lijst en het slechtste per uur van jou. Veertig handgemaakte koersreeksen plus een heel interactiemodel, weken werk, voor de kleinste van je twee producten die nul kopers heeft. Bewaar hem als het vlaggenschip voor het moment dat technische analyse aantoonbaar verkoopt.
- **Wft Vermogen halen (36).** Honderden euro's en weken studie voor een diploma dat niemand je op dit moment vraagt. Doe het als er omzet is, niet ervoor.
- **Keurmerk (33) en reviewsysteem (34).** Je kunt geen reviews verzamelen bij nul kopers, en €195 per jaar plus €12–39 per maand uit een bedrijf met €0 omzet is de verkeerde volgorde. Je 30-dagengarantie doet nu hetzelfde werk voor niets.
- **Boekenclub (17), maandmail en jaaroverzicht (16), gereedschapssectie met vier tools (14).** Allemaal retentiemechaniek die leden veronderstelt. Een live sessie met nul deelnemers is geen community, en een jaaroverzicht over gebruikers die er niet zijn is een leeg sjabloon.
- **De B1-taalronde en begrippenlijst (46).** Dit doet me pijn, want het gaat als enige over je kernbelofte. Maar het is een herschrijfronde over 17.200 woorden. Bouw de uitlegcomponent één keer wanneer je de vólgende cursus schrijft en pas hem daar toe; ga niet met terugwerkende kracht 21 lessen herschrijven voor een publiek dat er nog niet is.
- **Praktijkcasussen (6) en de biastest/cursus 4 (9).** Goede ideeën, verkeerde maand. Zie hieronder.

Twee dingen die in géén van de 46 voorstellen staan en die ik boven de helft ervan zou zetten: **laat vijf echte beginners de gratis cursus doen terwijl je meekijkt** (een middag, en het maakt de helft van dit document overbodig of urgent), en **ga twee avonden per week naar de plek waar je publiek al is** — r/beleggen, LinkedIn, financiële Facebookgroepen — en beantwoord vragen zonder te verkopen. Je probleem is niet dat je product te dun is. Je probleem is dat niemand weet dat het bestaat.

---

## De grootste denkfout

**Dat je "meer inhoud" nodig hebt.**

Het gaat zo: je kijkt naar 6 lessen en 50 minuten voor €49, je schaamt je een beetje, en je gaat casussen schrijven, of Beleggingspsychologie bouwen, of het abonnement dat die inhoud moet rechtvaardigen. Dat is het werk dat je het liefst doet en waar je het beste in bent, en het voelt onmiskenbaar als vooruitgang. Het kost je zes tot tien weken.

En het levert vrijwel zeker niets op, om één reden: **je hebt nul klanten, dus niemand is ooit aan het einde van je inhoud gekomen.** Er bestaat geen enkel signaal dat te weinig inhoud je verkoopprobleem is. Een vierde cursus vermenigvuldigt nul met vier. Het abonnement is dezelfde fout in een verdienmodel-kostuum: je bouwt weken aan een terugkerende betaling voor mensen die de eenmalige nog niet hebben gedaan.

De eerlijke volgorde is: eerst kunnen ontvangen, dan gevonden worden, dan geloofd worden, dan verdiepen. Inhoud maken is stap vier en jij wilt eraan beginnen bij stap nul. Schrijf pas weer een cursus als er tien mensen zijn die er om vragen — en tot die tijd is elk uur schrijven beter besteed aan de tweewekelijkse brief uit punt 7, want die verkoopt de cursussen die je al hébt.
