import type { Course } from "../types";

const course: Course = {
  slug: "opties-begrijpen",
  title: "Opties Begrijpen",
  subtitle: "Rechten, plichten en premie — stap voor stap",
  description:
    "Opties hebben de naam ingewikkeld en riskant te zijn, en dat is niet helemaal onterecht: wie ze niet begrijpt, kan er snel geld mee verliezen. Maar wie ze wél begrijpt, ontdekt gereedschap waarmee je risico kunt afbakenen in plaats van opzoeken. Deze cursus is bedoeld voor beleggers die al aandelen bezitten en opties fascinerend maar intimiderend vinden: we bouwen het fundament rustig op, met eerlijke rekenvoorbeelden waarin het verliesscenario altijd meedoet.",
  level: "Gevorderd",
  accent: "petrol",
  icon: "target",
  price: "€49",
  order: 5,
  learnPoints: [
    "Wat een optie precies is: het recht (niet de plicht) om te kopen of verkopen, en wat je met de premie eigenlijk betaalt",
    "De vier basisposities en waarom de schrijver een fundamenteel ander risico loopt dan de koper",
    "Een optieketen lezen als een brokerscherm: bied- en laatprijs, volume, open interest en de rekensom van maal honderd",
    "Hoe intrinsieke waarde, tijdswaarde en volatiliteit samen de premie bepalen, en waarom de klok tegen de koper tikt",
    "Twee verstandige, risicoverlagende eerste toepassingen naast je aandelenportefeuille — plus de eerlijke redenen waarom veel optiekopers verliezen",
  ],
  modules: [
    {
      slug: "de-bouwstenen",
      title: "De bouwstenen",
      description:
        "Voordat je ook maar één order overweegt, moet het fundament staan: wat een optie is, welke vier posities er bestaan, hoe je een optieketen leest en waar de premie uit is opgebouwd. Deze module bouwt dat fundament rustig op, inclusief de rekensom van maal honderd die veel beginners overslaan.",
      lessons: [
        {
          slug: "wat-is-een-optie",
          title: "Wat is een optie?",
          durationMin: 9,
          intro:
            "Een optie is geen mysterieus product voor handelaren met drie beeldschermen, maar een contract met twee kanten: een recht voor de koper en een plicht voor de verkoper. In deze les leer je de vijf bouwstenen die elke optie beschrijven — en waarom een verzekering de beste vergelijking is die je kunt maken.",
          sections: [
            {
              heading: "Een recht, geen plicht",
              paragraphs: [
                "Een optie is een contract dat de koper het récht geeft om iets te doen, zonder de plícht. Een calloptie geeft je het recht om aandelen te kópen tegen een vooraf afgesproken prijs; een putoptie geeft je het recht om aandelen te verkópen tegen zo'n afgesproken prijs. Wil je van dat recht geen gebruik maken, dan laat je het simpelweg lopen. Meer dan de premie die je ervoor betaalde, kun je als koper nooit verliezen.",
                "Tegenover elk recht staat iemand met een plicht: de verkoper van de optie, in vaktaal de schrijver. Die ontvangt de premie en belooft in ruil daarvoor te leveren (bij een call) of af te nemen (bij een put) zodra de koper zijn recht uitoefent. Dat verschil tussen recht en plicht is de belangrijkste zin van deze hele cursus, want het bepaalt wie welk risico draagt.",
                "Opties bestaan overigens al veel langer dan de beurs zoals wij die kennen; het idee van 'nu een klein bedrag betalen voor het recht om later tegen een vaste prijs te handelen' duikt al eeuwen op in de handel. Op de beurs zijn ze gestandaardiseerd: vaste contractgroottes, vaste looptijden, vaste uitoefenprijzen. Daardoor kun je ze net zo makkelijk verhandelen als aandelen.",
              ],
            },
            {
              heading: "De vijf bouwstenen van elk optiecontract",
              paragraphs: [
                "Elke optie op de beurs wordt volledig beschreven door vijf elementen. Wie deze vijf kan benoemen, kan elke optie 'lezen', hoe exotisch de reeks cijfers op het scherm ook oogt.",
                "Eén ding lichten we er nu al even uit, omdat het verderop in de cursus grote gevolgen heeft: één optiecontract op aandelen gaat vrijwel altijd over 100 aandelen. Een premie van EUR 1,50 op het scherm betekent dus EUR 150 uit je portemonnee. In les 3 rekenen we daar uitgebreid mee; onthoud voor nu alleen dat je elke schermprijs met honderd vermenigvuldigt.",
              ],
              bullets: [
                "Type: een call (recht om te kopen) of een put (recht om te verkopen)",
                "Onderliggende waarde: het aandeel of de index waar het contract over gaat, bijvoorbeeld 100 aandelen Zeewind NV",
                "Uitoefenprijs (strike): de vaste prijs waartegen je mag kopen of verkopen",
                "Expiratiedatum: de datum waarna het recht ophoudt te bestaan",
                "Premie: de prijs die de koper aan de schrijver betaalt voor het recht",
              ],
            },
            {
              heading: "De verzekeringsmetafoor",
              paragraphs: [
                "De beste manier om opties te begrijpen is via iets wat je al kent: een verzekering. Wie een inboedelverzekering afsluit, betaalt een premie voor het recht op een uitkering als het misgaat. Gaat er niets mis, dan ben je de premie kwijt — en dat vind je prima, want je kocht zekerheid, geen loterijlot.",
                "Een putoptie op aandelen die je bezit, werkt precies zo. Je betaalt een premie voor het recht om je aandelen tegen een vaste prijs te verkopen, wat er ook gebeurt met de koers. Daalt de beurs hard, dan is je verlies begrensd. Blijft de koers liggen of stijgt hij, dan verloopt je 'polis' ongebruikt en ben je de premie kwijt.",
                "De metafoor helpt ook om de schrijver te begrijpen: die speelt de rol van verzekeraar. Hij incasseert premies en draagt in ruil daarvoor het risico van de schade. Verzekeren kan een prima bedrijfsmodel zijn — maar alleen voor wie de risico's kan dragen en begrijpt. Precies daarom behandelen we het schrijven van opties in deze cursus wél (je moet weten wat er aan de andere kant van jouw order gebeurt), maar leren we je pas gedekte varianten gebruiken, in les 8.",
              ],
              example: {
                title: "Een verzekering voor je aandelen Zeewind NV",
                body:
                  "Stel, je bezit 100 aandelen Zeewind NV op een koers van EUR 42. Je koopt één putoptie met uitoefenprijs EUR 40 en drie maanden looptijd voor EUR 1,50 premie: dat kost EUR 1,50 x 100 = EUR 150. Scenario 1: Zeewind zakt naar EUR 33. Zonder put was je verlies EUR 900; met de put mag je je aandelen voor EUR 40 verkopen, dus je verlies blijft beperkt tot EUR 200 koersverlies plus EUR 150 premie = EUR 350. Scenario 2 (het verliesscenario van de put zelf): Zeewind blijft op EUR 42 of stijgt. De put verloopt waardeloos en de EUR 150 premie ben je kwijt — net als een verzekeringspremie in een jaar zonder schade.",
              },
            },
            {
              heading: "Gereedschap, geen versneller",
              paragraphs: [
                "Op sociale media zie je opties vooral voorbijkomen als turbo-knop: klein bedrag erin, met wat geluk een veelvoud eruit. Dat kán, net zoals je met een hamer een raam in kunt slaan. Maar wie opties zo gebruikt, speelt een spel met kansen die structureel tegenzitten — daarover zijn we in les 9 uitgebreid eerlijk.",
                "In deze cursus benaderen we opties als wat ze in de kern zijn: gereedschap om risico te verplaatsen. Je kunt er bescherming mee kopen, afspraken mee vastleggen en rendement mee toevoegen aan aandelen die je toch al bezit. Datzelfde gereedschap kan risico ook enorm vergróten; het verschil zit niet in het product maar in het gebruik.",
                "Tot slot het eerlijke kader waarbinnen deze hele cursus valt: wij zijn opleider, geen adviseur. Wat je hier leert is hoe opties wérken, niet welke optie jij zou moeten kopen. Beleggen met opties kent echte risico's, en bij sommige posities kun je meer verliezen dan je inleg. Juist daarom beginnen we bij de basis.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Options Playbook",
              author: "Brian Overby",
              year: 2010,
              note: "De toegankelijkste introductie in optieland: elke strategie op één pagina, met heldere tekeningen en zonder wiskunde-intimidatie. De eerste hoofdstukken sluiten naadloos aan op deze les.",
            },
          ],
          keyTakeaways: [
            "Een optie geeft de koper een recht (kopen bij een call, verkopen bij een put); de schrijver ontvangt de premie en draagt de plicht",
            "Vijf bouwstenen beschrijven elke optie: type, onderliggende waarde, uitoefenprijs, expiratiedatum en premie",
            "Een putoptie op aandelen die je bezit werkt als een verzekering: premie kwijt als er niets gebeurt, bescherming als het misgaat",
            "Eén contract gaat over 100 aandelen: een schermprijs van EUR 1,50 is EUR 150 echt geld",
            "Opties zijn gereedschap om risico te verplaatsen, geen versneller — het verschil zit in het gebruik, niet in het product",
          ],
          quiz: [
            {
              question:
                "Je koopt een calloptie op Zeewind NV met uitoefenprijs EUR 44 en expiratie over drie maanden. Wat heb je precies gekocht?",
              options: [
                "De plicht om over drie maanden 100 aandelen Zeewind te kopen tegen EUR 44",
                "Het recht om direct 100 aandelen Zeewind te verkopen tegen EUR 44",
                "Het recht om tot de expiratiedatum 100 aandelen Zeewind te kopen tegen EUR 44",
                "Een aandeel Zeewind met korting van EUR 44",
              ],
              correctIndex: 2,
              explanation:
                "Een call geeft de kóper een récht om te kópen, tegen de uitoefenprijs, tot expiratie. Geen plicht (dat is de kant van de schrijver), geen verkooprecht (dat is een put) en zeker geen aandeel met korting. Wil je het recht niet gebruiken, dan laat je het simpelweg lopen.",
            },
            {
              question: "Wat is het maximale verlies van de kóper van een optie?",
              options: [
                "De betaalde premie — meer kan de koper nooit verliezen",
                "De uitoefenprijs maal 100",
                "Onbeperkt, want de koers kan blijven dalen",
                "De premie plus de waarde van de onderliggende aandelen",
              ],
              correctIndex: 0,
              explanation:
                "De koper heeft een recht, geen plicht. Loopt het anders dan gehoopt, dan laat hij de optie waardeloos aflopen en is alleen de premie weg. Onbegrensde verliezen bestaan bij opties wél, maar aan de kant van de schrijver — daarover gaat les 2.",
            },
            {
              question:
                "Je bezit aandelen en wilt je beschermen tegen een flinke koersdaling. Welke optiepositie lijkt het meest op het afsluiten van een verzekering?",
              options: [
                "Een calloptie schrijven op je aandelen",
                "Een calloptie kopen op een andere onderliggende waarde",
                "Een putoptie schrijven en de premie incasseren",
                "Een putoptie kopen op de aandelen die je bezit",
              ],
              correctIndex: 3,
              explanation:
                "Een gekochte put geeft je het recht om je aandelen tegen de uitoefenprijs te verkopen, wat de koers ook doet: dat is precies de structuur van een verzekering (premie betalen, uitkering bij schade). Een put schríjven is juist de verzekeraarsrol, en calls beschermen niet tegen dalingen.",
            },
            {
              question:
                "Je kocht de put uit het lesvoorbeeld voor EUR 150 en Zeewind staat op expiratie op EUR 45. Wat gebeurt er?",
              options: [
                "Je krijgt de premie terug omdat de optie niet is gebruikt",
                "De put verloopt waardeloos en de EUR 150 premie ben je kwijt — vergelijkbaar met een verzekeringsjaar zonder schade",
                "Je bent verplicht je aandelen alsnog voor EUR 40 te verkopen",
                "De schrijver moet je het verschil tussen EUR 45 en EUR 40 betalen",
              ],
              correctIndex: 1,
              explanation:
                "Boven de uitoefenprijs is het verkooprecht op EUR 40 niets waard: je kunt je aandelen op de beurs immers voor méér kwijt. De premie is definitief betaald — dat is de kostprijs van de zekerheid die je drie maanden had. Een plicht heb je als koper nooit, en premies worden nooit terugbetaald.",
            },
          ],
          xp: 50,
        },
        {
          slug: "de-vier-posities",
          title: "De vier basisposities",
          durationMin: 9,
          tool: "optie-uitbetaling",
          intro:
            "Twee optietypes (call en put) maal twee kanten van het contract (kopen en schrijven) geeft vier basisposities. Wie deze vier echt doorgrondt — vooral het fundamentele verschil in risico tussen koper en schrijver — heeft het hart van deze cursus te pakken.",
          sections: [
            {
              heading: "Vier posities, één tabel",
              paragraphs: [
                "Elke optiepositie die bestaat, hoe ingewikkeld ook, is opgebouwd uit vier bouwstenen. Je kunt een call kopen (long call) of schrijven (short call), en je kunt een put kopen (long put) of schrijven (short put). 'Long' betekent in beleggerstaal simpelweg dat je iets bezit; 'short' dat je het hebt verkocht zonder het eerst te bezitten.",
                "De koper betaalt de premie en krijgt het recht; de schrijver ontvangt de premie en draagt de plicht. Met welke verwachting neem je welke positie in? Een long call profiteert van een stijging, een long put van een daling. De schrijvers zitten er spiegelbeeldig in: de short call hoopt dat de koers níét (ver) stijgt, de short put dat hij níét (ver) daalt.",
              ],
              bullets: [
                "Long call: premie betalen, recht om te kopen — profiteert van een stijging",
                "Long put: premie betalen, recht om te verkopen — profiteert van een daling",
                "Short call: premie ontvangen, plicht om te leveren — profiteert als de koers niet boven de uitoefenprijs stijgt",
                "Short put: premie ontvangen, plicht om af te nemen — profiteert als de koers niet onder de uitoefenprijs daalt",
              ],
            },
            {
              heading: "De koper: verlies begrensd, winst variabel",
              paragraphs: [
                "Voor de koper is de rekensom overzichtelijk. Je maximale verlies staat vanaf dag één vast: de betaalde premie, geen cent meer. Daar staat tegenover dat je winst kan oplopen als de koers flink jouw kant op beweegt — bij een call in theorie onbeperkt, bij een put tot de onderliggende waarde nul is.",
                "Maar laat je niet misleiden door dat woord 'onbeperkt'. Om als koper winst te maken moet de koers niet alleen de goede kant op, hij moet ook vér genoeg bewegen om je premie terug te verdienen, en dat vóór de expiratiedatum. Dat punt heet het break-evenpunt: bij een call is dat de uitoefenprijs plus de betaalde premie. Een koers die 'een beetje' stijgt, is voor een callkoper vaak nog steeds verlies.",
                "In de tool bij deze les kun je dit zelf zien: het uitbetalingsdiagram van elke positie, met de knik op de uitoefenprijs en het break-evenpunt erbij. Speel er even mee voordat je verder leest — het diagram zegt meer dan drie alinea's tekst.",
              ],
              example: {
                title: "Long call op Zeewind NV: winst én verlies doorgerekend",
                body:
                  "Zeewind NV noteert EUR 42. Je koopt een call met uitoefenprijs EUR 44 voor EUR 1,20: kosten EUR 120. Je break-evenpunt is EUR 44 + EUR 1,20 = EUR 45,20. Scenario 1: Zeewind staat op expiratie op EUR 48. Je recht om op EUR 44 te kopen is dan EUR 4 per aandeel waard: EUR 400 per contract, minus EUR 120 premie is EUR 280 winst. Scenario 2 (het verliesscenario): Zeewind stijgt naar EUR 43,50 — de goede richting! Toch is je call waardeloos, want niemand gebruikt een kooprecht op EUR 44 als de beurs EUR 43,50 vraagt. Je verliest de volle EUR 120, terwijl een aandeelhouder gewoon EUR 1,50 per aandeel verdiende.",
              },
            },
            {
              heading: "De schrijver: winst begrensd, verlies niet",
              paragraphs: [
                "Voor de schrijver is de rekensom omgekeerd — en dat maakt schrijven fundamenteel anders. Zijn maximale winst staat vast: de ontvangen premie. Zijn maximale verlies niet. Wie een call schrijft zonder de onderliggende aandelen te bezitten (ongedekt of 'naakt' schrijven), belooft te leveren tegen de uitoefenprijs, wat de aandelen op dat moment ook kosten. Stijgt de koers explosief, dan moet hij duur inkopen om goedkoop te leveren, en dat verlies kent in theorie geen plafond.",
                "Reken het maar na met de call uit het voorbeeld hierboven, nu van de andere kant. De schrijver ontving EUR 120. Schiet Zeewind door een overnamebod naar EUR 60, dan moet hij 100 aandelen leveren voor EUR 44 die hem EUR 60 per stuk kosten: EUR 1.600 verlies, minus de premie nog altijd EUR 1.480. En EUR 60 is geen bovengrens — er ís geen bovengrens. Wij leggen dit uit zodat je begrijpt welk risico er aan de schrijfkant leeft, niet als techniek om toe te passen: ongedekt calls schrijven hoort niet thuis in een beginnersportefeuille, en veel brokers staan het beginners terecht niet eens toe.",
                "De short put is minder extreem, maar niet mild: de schrijver belooft 100 aandelen af te nemen tegen de uitoefenprijs. Gaat het bedrijf failliet, dan koopt hij tegen de uitoefenprijs iets wat niets meer waard is. Bij een put met uitoefenprijs EUR 40 en EUR 1,40 ontvangen premie is het maximale verlies dus (EUR 40 - EUR 1,40) x 100 = EUR 3.860. Groot, maar in elk geval begrensd en vooraf te berekenen.",
              ],
            },
            {
              heading: "De asymmetrie is de kern",
              paragraphs: [
                "Zet de twee kanten naast elkaar en je ziet de asymmetrie die deze hele les draagt: de koper riskeert een klein, vooraf bekend bedrag voor een kans op veel; de schrijver incasseert een klein, vooraf bekend bedrag tegen een risico op veel. Geen van beide kanten is 'goed' of 'fout' — het zijn twee verschillende beroepen, zoals verzekerde en verzekeraar.",
                "Die asymmetrie verklaart ook waarom brokers voor schrijvers strengere eisen stellen. Wie opties schrijft, moet onderpand (margin) aanhouden, en de broker kan om extra geld vragen als de positie tegen je inloopt. Als koper heb je daar geen last van: je hebt betaald en daarmee is de kous af.",
                "In les 8 kom je de schrijfkant opnieuw tegen, maar dan in de gedekte vorm: een call schrijven op aandelen die je al bezít. Dan is de leverplicht geen bedreiging maar een afspraak die je bewust maakt. Het verschil tussen gedekt en ongedekt schrijven is het verschil tussen een afspraak en een openstaande rekening zonder maximum.",
              ],
            },
          ],
          keyTakeaways: [
            "Er zijn vier basisposities: long call, long put, short call en short put — elke complexere strategie is daaruit opgebouwd",
            "De koper riskeert alleen de premie; zijn break-evenpunt ligt bij een call op uitoefenprijs plus premie",
            "De schrijver heeft een begrensde winst (de premie) en bij ongedekt geschreven calls een in theorie onbegrensd verlies",
            "Ongedekt schrijven moet je begrijpen om de markt te snappen, maar het is geen techniek voor beginners",
            "Schrijvers moeten margin aanhouden; kopers niet — hun risico is al volledig betaald",
          ],
          quiz: [
            {
              question: "Wat beschrijft de asymmetrie tussen optiekoper en optieschrijver het best?",
              options: [
                "De koper en de schrijver lopen exact hetzelfde risico, alleen op verschillende momenten",
                "De koper riskeert maximaal de premie met kans op veel; de schrijver wint maximaal de premie met risico op veel",
                "De schrijver kan nooit meer verliezen dan de ontvangen premie",
                "De koper draagt het grootste risico, want hij betaalt geld vooruit",
              ],
              correctIndex: 1,
              explanation:
                "Recht tegenover plicht: het maximale verlies van de koper is de premie, terwijl de maximale winst van de schrijver diezelfde premie is — en zijn verlies kan (bij ongedekte calls zelfs onbegrensd) veel groter worden. Dat is precies omgekeerd aan optie 4, en optie 3 beschrijft de koper, niet de schrijver.",
            },
            {
              question:
                "Je koopt een call op Zeewind NV, uitoefenprijs EUR 44, premie EUR 1,20 (EUR 120 per contract). Op expiratie staat Zeewind op EUR 48. Wat is je resultaat?",
              options: [
                "EUR 280 winst: het recht is (EUR 48 - EUR 44) x 100 = EUR 400 waard, minus EUR 120 premie",
                "EUR 400 winst: het volledige verschil tussen koers en uitoefenprijs",
                "EUR 120 verlies: de optie verloopt waardeloos",
                "EUR 600 winst: het verschil tussen EUR 48 en de oorspronkelijke koers van EUR 42, maal 100",
              ],
              correctIndex: 0,
              explanation:
                "Het kooprecht op EUR 44 is bij een koers van EUR 48 precies EUR 4 per aandeel waard, dus EUR 400 per contract. Daar gaat de betaalde premie van EUR 120 vanaf: EUR 280 winst. De premie vergeten (optie 2) is een klassieke beginnersfout, en optie 4 rekent met de aandelenkoers in plaats van de uitoefenprijs.",
            },
            {
              question: "Waarom geldt het ongedekt (naakt) schrijven van callopties als zo gevaarlijk?",
              options: [
                "Omdat de premie die je ontvangt belast wordt als loon",
                "Omdat je de aandelen dan met korting moet aanbieden aan andere beleggers",
                "Omdat je moet leveren tegen de uitoefenprijs terwijl de koers in theorie onbeperkt kan stijgen — je verlies kent geen plafond",
                "Omdat de optie dan automatisch langer doorloopt dan de expiratiedatum",
              ],
              correctIndex: 2,
              explanation:
                "De ongedekte schrijver heeft de aandelen niet en moet ze bij uitoefening tegen de dan geldende koers inkopen om ze tegen de (lagere) uitoefenprijs te leveren. Omdat een koers geen bovengrens kent, kent dat verlies er ook geen. Daarom stellen brokers hier margin-eisen en is dit geen techniek voor beginners.",
            },
            {
              question: "Welke plicht heeft de schrijver van een putoptie met uitoefenprijs EUR 40?",
              options: [
                "De plicht om 100 aandelen te leveren tegen EUR 40 als de koper uitoefent",
                "De plicht om de premie terug te betalen als de koers stijgt",
                "Geen enkele plicht: een put schrijven geeft alleen rechten",
                "De plicht om 100 aandelen af te nemen tegen EUR 40 als de koper uitoefent — ook als ze op de beurs veel minder waard zijn",
              ],
              correctIndex: 3,
              explanation:
                "De putschrijver belooft te kópen tegen de uitoefenprijs. Daalt het aandeel naar EUR 25, dan betaalt hij toch EUR 40 per stuk: EUR 1.500 verlies per contract, verzacht door de ontvangen premie. Leveren (optie 1) is de plicht van de cállschrijver; premies worden nooit terugbetaald.",
            },
          ],
          xp: 50,
        },
        {
          slug: "de-optieketen-lezen",
          title: "De optieketen lezen",
          durationMin: 9,
          tool: "optie-keten",
          intro:
            "Open je bij een broker voor het eerst een optieketen, dan kijk je tegen een muur van getallen aan. Goed nieuws: die muur heeft een vaste opbouw, en na deze les lees je hem als een menukaart. Onderweg leer je de twee kostenposten kennen die beginners het vaakst over het hoofd zien: de spread en de factor honderd.",
          sections: [
            {
              heading: "De plattegrond van een optieketen",
              paragraphs: [
                "Een optieketen (option chain) is simpelweg de prijslijst van alle opties op één onderliggende waarde. De opbouw is bij vrijwel elke broker hetzelfde: bovenaan kies je de expiratiemaand, in het midden staan de uitoefenprijzen van laag naar hoog, links daarvan de callopties en rechts de putopties. Eén rij is dus één uitoefenprijs, met de call- en putvariant naast elkaar.",
                "Per optie zie je minimaal een biedprijs en een laatprijs, en meestal ook het volume van vandaag en de open interest. Die vier kolommen zijn je gereedschap; de rest (Grieken, implied volatility) komt in latere lessen en cursussen aan bod. Laat je dus niet afschrikken door kolommen die je nog niet kent — je hebt ze voor je eerste analyse niet nodig.",
                "In de oefenketen bij deze les kun je klikken zonder dat er iets kan gebeuren: het is een nagebouwd brokerscherm met fictieve prijzen voor Zeewind NV. Gebruik hem naast de tekst; de begrippen hieronder herken je er direct in.",
              ],
            },
            {
              heading: "Bied, laat en de spread als echte kostenpost",
              paragraphs: [
                "De biedprijs (bid) is wat kopers op dit moment willen betalen; de laatprijs (laat of ask) is waarvoor verkopers willen verkopen. Koop jij direct, dan betaal je de laatprijs; verkoop je direct, dan krijg je de biedprijs. Het verschil tussen die twee heet de spread, en dat is geen abstract detail maar een echte kostenpost die je betaalt zodra je handelt.",
                "Bij aandelen van grote bedrijven is de spread vaak een cent of minder. Bij opties is hij structureel breder, omdat er per uitoefenprijs en looptijd veel minder handel is. Een spread van EUR 0,10 tot EUR 0,20 is bij liquide opties heel normaal — en vergeet niet: maal honderd. Wie koopt en direct weer verkoopt, is die hele spread kwijt zonder dat de koers ook maar bewoog.",
              ],
              example: {
                title: "Wat de spread je werkelijk kost",
                body:
                  "In de keten van Zeewind NV staat een call met biedprijs EUR 0,80 en laatprijs EUR 0,95. Koop je hem tegen de laatprijs, dan betaal je EUR 95. Zou je direct daarna spijt krijgen en verkopen tegen de biedprijs, dan ontvang je EUR 80. Verlies: EUR 15 per contract, ofwel bijna 16% van je inleg — terwijl er op de beurs niets gebeurde. Ter vergelijking: bij een aandeel van EUR 42 met een spread van EUR 0,02 kost hetzelfde rondje 0,05%. Dit is waarom optiebeleggers met limietorders werken (les 7) en waarom veel handelen bij opties extra duur is (les 9).",
              },
            },
            {
              heading: "Maal honderd: de rekensom die je nooit mag overslaan",
              paragraphs: [
                "We stipten het al twee keer aan en nu behandelen we het voluit, want dit is de plek waar beginners het vaakst schrikken: één optiecontract op aandelen gaat over 100 aandelen, en álle schermprijzen zijn prijzen per aandeel. Een optie die op EUR 0,80 noteert oogt als klein geld, maar kost EUR 80. Een premie van EUR 3,10 is EUR 310. Wie 'voor de zekerheid' vijf contracten koopt van die goedkope optie van EUR 0,80, heeft EUR 400 ingezet.",
                "De omgekeerde schrik bestaat ook, en die is gevaarlijker: wie een optie schríjft en uitgeoefend wordt, moet 100 aandelen leveren of afnemen. Een geschreven put met uitoefenprijs EUR 40 betekent dat er EUR 4.000 klaar moet staan om de aandelen af te nemen. Dat bedrag zie je nergens in de keten staan — je moet het zelf uitrekenen, elke keer opnieuw.",
                "Maak er een gewoonte van om bij elke optie die je bekijkt twee getallen hardop te benoemen: wat kost dit contract écht (premie maal 100), en over welk bedrag aan aandelen gaat het (uitoefenprijs maal 100)? Die tweede vraag went snel en voorkomt de vervelendste verrassingen uit dit vak.",
              ],
            },
            {
              heading: "Volume en open interest: is er wel iemand thuis?",
              paragraphs: [
                "Volume telt hoeveel contracten er vandaag zijn verhandeld; open interest telt hoeveel contracten er in totaal openstaan — posities die zijn geopend en nog niet gesloten of afgelopen. Samen vertellen ze je hoe druk het is op deze specifieke optie, en dat is belangrijker dan het klinkt.",
                "In een drukke optie (hoog volume, hoge open interest) zijn de spreads krap en kun je vlot in- en uitstappen. In een stille optie kan de spread oplopen tot tientallen procenten van de premie, en sta je bij verkoop soms lang te wachten op een redelijke prijs. Als vuistregel: zie je een open interest van vrijwel nul en een spread die een groot deel van de premie beslaat, dan is dit geen optie om in te handelen — hoe interessant het onderliggende aandeel ook is.",
                "Verwar open interest overigens niet met een koopsignaal. Veel openstaande contracten betekent alleen dat er veel afspraken lopen, niet dat die afspraken slim zijn. Het is een maat voor drukte, niet voor kwaliteit.",
              ],
              bullets: [
                "Volume = verhandelde contracten vandaag; open interest = totaal openstaande contracten",
                "Krappe spread + hoge open interest = vlot handelen tegen eerlijke prijzen",
                "Brede spread + lage open interest = wegblijven, ongeacht hoe mooi het verhaal is",
                "Open interest zegt iets over drukte, niets over de kwaliteit van het idee",
              ],
            },
          ],
          keyTakeaways: [
            "Een optieketen is een vaste plattegrond: expiratie bovenaan, uitoefenprijzen in het midden, calls links en puts rechts",
            "De spread tussen bied- en laatprijs is een echte kostenpost: kopen tegen laat en verkopen tegen bied kost je direct geld",
            "Alle schermprijzen zijn per aandeel en één contract gaat over 100 aandelen: EUR 0,80 op het scherm is EUR 80 uit je portemonnee",
            "Reken bij elke optie ook uit over welk aandelenbedrag het contract gaat (uitoefenprijs maal 100)",
            "Handel alleen in opties met redelijke spreads en serieuze open interest",
          ],
          quiz: [
            {
              question: "Een optie op Zeewind NV noteert een laatprijs van EUR 0,85. Wat betaal je als je één contract koopt?",
              options: [
                "EUR 0,85, want dat is de prijs op het scherm",
                "EUR 8,50, want een contract gaat over 10 aandelen",
                "EUR 85, want de schermprijs is per aandeel en één contract gaat over 100 aandelen",
                "EUR 850, want je betaalt de laatprijs plus de uitoefenprijs",
              ],
              correctIndex: 2,
              explanation:
                "Optieprijzen zijn altijd per aandeel genoteerd en het standaardcontract op aandelen omvat er 100: EUR 0,85 x 100 = EUR 85. Dit maal-honderd-effect is de eerste rekensom bij élke optie — een 'goedkope' optie is minder klein geld dan het scherm suggereert.",
            },
            {
              question:
                "Een call heeft biedprijs EUR 0,80 en laatprijs EUR 0,95. Je koopt tegen de laatprijs en verkoopt direct weer tegen de biedprijs. Wat is je verlies per contract?",
              options: [
                "EUR 15: je betaalde EUR 95 en ontving EUR 80 — de spread is een echte kostenpost",
                "EUR 0: kopen en verkopen op hetzelfde moment kost niets",
                "EUR 0,15: het verschil tussen bied en laat",
                "EUR 95: je hele inleg, want de optie is direct waardeloos",
              ],
              correctIndex: 0,
              explanation:
                "De spread van EUR 0,15 per aandeel wordt maal 100 een verlies van EUR 15 per contract, bijna 16% van de inleg, zonder dat de koers bewoog. Optie 3 vergeet de contractgrootte. Dit is waarom limietorders en weinig handelen bij opties extra belangrijk zijn.",
            },
            {
              question: "Wat betekent 'open interest' in een optieketen?",
              options: [
                "De rente die de broker rekent over je optiepositie",
                "Het totale aantal contracten dat is geopend en nog niet gesloten of afgelopen",
                "Het aantal contracten dat vandaag is verhandeld",
                "Het aantal beleggers dat de optie op een watchlist heeft staan",
              ],
              correctIndex: 1,
              explanation:
                "Open interest telt de openstaande afspraken en is daarmee een maat voor hoe 'bewoond' een optieserie is. Het dagelijkse handelsvolume (optie 3) is een andere kolom. Let op: hoge open interest zegt iets over drukte en verhandelbaarheid, niet over of de positie een goed idee is.",
            },
            {
              question:
                "Je vindt een optie op een klein Nederlands fonds met een spread van EUR 0,40 op een premie van EUR 0,90, en een open interest van 3 contracten. Wat is de verstandigste conclusie?",
              options: [
                "Een koopje: hoe kleiner het fonds, hoe groter de winstkansen",
                "Prima om te kopen, zolang je maar tegen de biedprijs koopt",
                "De lage open interest bewijst dat insiders iets weten",
                "Wegblijven: deze optie is zo illiquide dat de spread bijna de helft van de premie opslokt",
              ],
              correctIndex: 3,
              explanation:
                "Een spread van EUR 0,40 op EUR 0,90 betekent dat je ruwweg 44% van je inleg kwijt bent aan alleen al in- en uitstappen, en met 3 openstaande contracten is er nauwelijks een markt. Bij zulke series blijf je weg, hoe interessant het bedrijf ook is. Kopen 'tegen de biedprijs' kan bovendien meestal niet — daar staan immers de kopers, onder wie jijzelf.",
            },
          ],
          xp: 50,
        },
        {
          slug: "intrinsieke-waarde-en-tijdswaarde",
          title: "Intrinsieke waarde en tijdswaarde",
          durationMin: 9,
          tool: "optie-tijdswaarde",
          intro:
            "Waarom kost de ene optie EUR 3,10 en de andere EUR 0,45, op hetzelfde aandeel en met dezelfde looptijd? Het antwoord zit in twee bouwstenen: wat de optie nú al waard is als je hem zou uitoefenen, en wat je betaalt voor de tijd en onzekerheid die nog komen. Na deze les kun je elke premie uit elkaar rafelen.",
          sections: [
            {
              heading: "In, at en out of the money",
              paragraphs: [
                "Optiebeleggers delen opties in drie categorieën in, afhankelijk van waar de koers staat ten opzichte van de uitoefenprijs. Een call is 'in the money' (ITM) als de koers bóven de uitoefenprijs staat: het kooprecht heeft dan direct nut. Staat de koers vlak bij de uitoefenprijs, dan heet de optie 'at the money' (ATM). Staat de koers eronder, dan is de call 'out of the money' (OTM): uitoefenen zou nu zinloos zijn.",
                "Bij puts is het gespiegeld, want een verkooprecht is juist nuttig als de koers láág staat: een put is in the money als de koers ónder de uitoefenprijs staat, en out of the money als hij erboven staat. Even wennen, maar de logica is steeds dezelfde: in the money betekent 'dit recht heeft nu al concrete waarde'.",
                "Met Zeewind NV op EUR 42 wordt het tastbaar: de call met uitoefenprijs EUR 40 is in the money (je mag kopen op EUR 40 wat EUR 42 waard is), de call EUR 42 is at the money en de call EUR 46 is out of the money. Voor de puts geldt het omgekeerde: de put EUR 44 is in the money, de put EUR 40 out of the money.",
              ],
            },
            {
              heading: "Premie = intrinsieke waarde + tijdswaarde",
              paragraphs: [
                "De intrinsieke waarde van een optie is wat uitoefenen nú zou opleveren. Voor de call EUR 40 op Zeewind (koers EUR 42) is dat EUR 2: kopen op EUR 40, direct EUR 42 waard. Voor elke out-of-the-money optie is de intrinsieke waarde precies nul — niet negatief, want een recht dat niets oplevert, laat je gewoon lopen.",
                "Toch kost die call EUR 40 op het scherm geen EUR 2,00 maar bijvoorbeeld EUR 3,10. Dat verschil van EUR 1,10 is de tijdswaarde: de prijs van alles wat er tot expiratie nog kan gebeuren. De koers kan immers verder stijgen, en voor die mogelijkheid betaal je. De formule is altijd: premie = intrinsieke waarde + tijdswaarde, en dus ook: tijdswaarde = premie min intrinsieke waarde.",
                "Hieruit volgt iets belangrijks voor out-of-the-money opties: hun premie bestaat voor 100% uit tijdswaarde. De call EUR 46 van EUR 0,45 heeft nul intrinsieke waarde — je betaalt volledig voor de hoop dat Zeewind vóór expiratie boven de EUR 46 klimt. Zulke opties zijn niet 'goedkoop'; ze bevatten simpelweg nog geen enkele zekerheid.",
              ],
              example: {
                title: "Drie calls op Zeewind NV uit elkaar gerafeld",
                body:
                  "Zeewind noteert EUR 42, alle opties hebben drie maanden looptijd. Call EUR 40 kost EUR 3,10: intrinsieke waarde EUR 2,00 (EUR 42 - EUR 40), tijdswaarde EUR 1,10. Call EUR 42 kost EUR 1,60: intrinsieke waarde EUR 0, tijdswaarde EUR 1,60. Call EUR 46 kost EUR 0,45: intrinsieke waarde EUR 0, tijdswaarde EUR 0,45. Kijk goed: de tijdswaarde is het hóógst bij de at-the-money optie (EUR 1,60), niet bij de duurste of de goedkoopste. En het verliesscenario: blijft Zeewind drie maanden op EUR 42 staan, dan verliest de koper van de call EUR 40 zijn volledige tijdswaarde (EUR 110 per contract) en houdt hij alleen de intrinsieke EUR 200 over — de kopers van de calls EUR 42 en EUR 46 verliezen hun volledige inleg.",
              },
            },
            {
              heading: "Waarom tijdswaarde piekt at the money",
              paragraphs: [
                "Dat de at-the-money optie de meeste tijdswaarde heeft, is geen toeval maar logica. Tijdswaarde is de prijs van onzekerheid, en de onzekerheid is het grootst precies rond de uitoefenprijs: daar is het echt een dubbeltje op zijn kant of de optie waardevol afloopt of waardeloos.",
                "Bij een diep-in-the-money call is er weinig spanning: die loopt vrijwel zeker met intrinsieke waarde af en gedraagt zich bijna als het aandeel zelf. Bij een ver-out-of-the-money call is er ook weinig spanning, maar dan andersom: de kans dat hij nog iets wordt is klein, dus wil niemand er veel tijdswaarde voor betalen. De piek zit in het midden, en dat zie je in de tool bij deze les als een berg met de top op de uitoefenprijs.",
                "Deze verdeling heeft een praktisch gevolg dat we in les 6 uitdiepen: tijdswaarde is het deel van je premie dat gegarandeerd verdampt naarmate expiratie nadert. Hoe meer tijdswaarde je koopt, hoe harder je iets nodig hebt dat die verdamping goedmaakt.",
              ],
            },
            {
              heading: "Wat dit betekent voor jou als koper",
              paragraphs: [
                "Wie deze les samenvat in één zin, komt uit op: als optiekoper betaal je voor tijd en onzekerheid, en beide nemen af. De intrinsieke waarde kan meebewegen met de koers, maar de tijdswaarde loopt onherroepelijk naar nul op de expiratiedatum — de enige vraag is hoe snel.",
                "Wees daarom op je hoede voor de gedachte 'deze optie kost maar EUR 0,45, dus ik kan weinig verliezen'. In euro's klopt dat, in procenten niet: die EUR 0,45 is voor 100% tijdswaarde en verdampt volledig als de verwachte beweging uitblijft. Een lage premie betekent niet dat de optie een koopje is; hij betekent dat de markt de kans op succes klein acht. In les 9 zie je wat er gebeurt met beleggers die dit verschil negeren.",
                "Goed nieuws is er ook: je kunt tijdswaarde niet alleen kópen maar ook verkópen. Wie schrijft, incasseert de tijdswaarde die bij de koper verdampt. Dat is de motor achter de covered call uit les 8 — met alle plichten die je in les 2 hebt leren kennen.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Options as a Strategic Investment",
              author: "Lawrence McMillan",
              year: 1980,
              note: "Al ruim veertig jaar hét naslagwerk over opties, meer dan duizend pagina's dik. Eerlijk gezegd: dit lees je niet van kaft tot kaft, en dat hoeft ook niet. Zie het als encyclopedie voor wie later één strategie tot op de bodem wil uitzoeken.",
            },
          ],
          keyTakeaways: [
            "In the money = het recht heeft nu al concrete waarde; bij calls koers boven de uitoefenprijs, bij puts eronder",
            "Premie = intrinsieke waarde + tijdswaarde; out-of-the-money opties bestaan voor 100% uit tijdswaarde",
            "Tijdswaarde is de prijs van onzekerheid en piekt at the money",
            "Tijdswaarde loopt onherroepelijk naar nul richting expiratie — als koper begint elke dag met die tegenwind",
            "Een lage premie is geen koopje maar een klein geachte kans; 'goedkoop' bestaat bij opties niet zonder context",
          ],
          quiz: [
            {
              question:
                "Zeewind NV noteert EUR 42. Een call met uitoefenprijs EUR 40 kost EUR 3,10. Hoe is die premie opgebouwd?",
              options: [
                "EUR 3,10 intrinsieke waarde en EUR 0 tijdswaarde",
                "EUR 2,00 intrinsieke waarde (EUR 42 - EUR 40) en EUR 1,10 tijdswaarde",
                "EUR 1,10 intrinsieke waarde en EUR 2,00 tijdswaarde",
                "EUR 0 intrinsieke waarde en EUR 3,10 tijdswaarde",
              ],
              correctIndex: 1,
              explanation:
                "Uitoefenen levert nu EUR 42 - EUR 40 = EUR 2,00 per aandeel op: dat is de intrinsieke waarde. De rest van de premie, EUR 3,10 - EUR 2,00 = EUR 1,10, is tijdswaarde — de prijs van wat er tot expiratie nog kan gebeuren.",
            },
            {
              question: "Waaruit bestaat de premie van een out-of-the-money optie?",
              options: [
                "Volledig uit tijdswaarde: de intrinsieke waarde is nul",
                "Volledig uit intrinsieke waarde: tijdswaarde hebben alleen langlopende opties",
                "Half intrinsieke waarde, half tijdswaarde",
                "Uit de spread tussen bied- en laatprijs",
              ],
              correctIndex: 0,
              explanation:
                "Out of the money betekent dat uitoefenen nu niets oplevert, dus de intrinsieke waarde is exact nul (nooit negatief — een nutteloos recht laat je lopen). Alles wat je betaalt is tijdswaarde: de hoop dat de koers vóór expiratie de goede kant op beweegt. Blijft die beweging uit, dan verdampt de volledige premie.",
            },
            {
              question: "Bij welke optie is de tijdswaarde doorgaans het hoogst?",
              options: [
                "Bij een diep-in-the-money optie, want die is het duurst",
                "Bij een ver-out-of-the-money optie, want daar is de meeste fantasie",
                "Bij een at-the-money optie, want daar is de onzekerheid over de afloop het grootst",
                "Tijdswaarde is bij elke uitoefenprijs gelijk zolang de looptijd gelijk is",
              ],
              correctIndex: 2,
              explanation:
                "Tijdswaarde is de prijs van onzekerheid, en rond de uitoefenprijs is het echt een dubbeltje op zijn kant. Diep in the money gedraagt de optie zich bijna als het aandeel (weinig spanning), ver out of the money acht de markt de kans zo klein dat niemand er veel voor betaalt. De piek zit in het midden.",
            },
            {
              question: "Wanneer is een pútoptie in the money?",
              options: [
                "Als de koers van het aandeel boven de uitoefenprijs staat",
                "Als de optie meer dan een maand looptijd heeft",
                "Als de premie hoger is dan EUR 1,00",
                "Als de koers van het aandeel onder de uitoefenprijs staat",
              ],
              correctIndex: 3,
              explanation:
                "Een put is een verkooprecht, en verkopen tegen een vaste prijs is waardevol als de koers dáároverheen gedaald is: koers onder de uitoefenprijs betekent dat uitoefenen direct iets oplevert. Het spiegelbeeld van de call dus. Looptijd en premiehoogte zeggen hier niets over.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "de-praktijk-op-euronext",
      title: "De praktijk op Euronext",
      description:
        "Van theorie naar het echte handelsscherm. In deze module leer je de spelregels van de Nederlandse optiemarkt: het verschil tussen aandelen- en indexopties, hoe tijdsverval en volatiliteit je premie dagelijks beïnvloeden, en wat er allemaal geregeld moet zijn voordat je eerste order de deur uit kan.",
      lessons: [
        {
          slug: "amerikaans-europees-en-de-aex",
          title: "Amerikaans, Europees en de AEX",
          durationMin: 9,
          intro:
            "Op Euronext handel je in twee smaken opties die op belangrijke punten verschillen: aandelenopties en indexopties. De begrippen 'Amerikaanse stijl' en 'Europese stijl' hebben niets met geografie te maken, maar alles met wannéér je mag uitoefenen en wát er dan gebeurt. Deze les zorgt dat je nooit verrast wordt door je eigen afschrift.",
          sections: [
            {
              heading: "Twee stijlen: wanneer mag je uitoefenen?",
              paragraphs: [
                "Een optie van Amerikaanse stijl mag je op élk moment tijdens de looptijd uitoefenen; een optie van Europese stijl alleen op de expiratiedatum zelf. De namen zijn historisch gegroeid vakjargon — beide stijlen worden wereldwijd verhandeld, ook gewoon op Euronext in Amsterdam.",
                "Voor de Nederlandse markt is de vuistregel simpel: aandelenopties (op bijvoorbeeld de grote AEX-fondsen) zijn van Amerikaanse stijl, indexopties op de AEX zijn van Europese stijl. Die combinatie moet je paraat hebben, want de stijl bepaalt welk risico je als schríjver loopt: bij Amerikaanse stijl kan de plicht elke dag aan je deur kloppen, bij Europese stijl pas op expiratie.",
                "Belangrijk om erbij te zeggen: ook een optie van Europese stijl kun je elke handelsdag gewoon verkópen. De beperking geldt alleen het uitoefenen van het recht, niet het verhandelen van het contract. In de praktijk verkopen de meeste beleggers hun opties trouwens sowieso in plaats van ze uit te oefenen — dat is meestal voordeliger, omdat je bij verkoop ook de resterende tijdswaarde ontvangt.",
              ],
            },
            {
              heading: "Aandelenopties: fysieke levering en assignment",
              paragraphs: [
                "Oefent de koper van een aandelenoptie zijn recht uit, dan worden er écht aandelen geleverd: 100 stuks per contract, tegen de uitoefenprijs. Dat heet fysieke levering (physical delivery). Voor de koper is dat een keuze; voor de schrijver is het een plicht die hem wordt toegewezen. Die toewijzing heet assignment, en het is misschien wel het meest gevreesde (en minst begrepen) woord onder beginnende optieschrijvers.",
                "Hoe werkt het? Oefent ergens een koper uit, dan wijst de clearingorganisatie die uitoefening toe aan een willekeurige schrijver met een openstaande positie in dezelfde serie. Jij kunt als schrijver dus geen 'nee' zeggen en het moment niet kiezen. Bij opties van Amerikaanse stijl kan dat op elke handelsdag gebeuren, al is de kans daarop vooral reëel als de optie diep in the money staat of er nauwelijks tijdswaarde over is — wie uitoefent, gooit immers de resterende tijdswaarde weg.",
                "Klinkt spannend, maar op je afschrift is assignment verrassend saai: je ziet een uitoefeningstransactie, aandelen die je rekening verlaten (of binnenkomen) en het bijbehorende geldbedrag tegen de uitoefenprijs. Geen boetes, geen drama — gewoon de afspraak uit het contract die wordt uitgevoerd. Wie alleen gedekte posities schrijft, zoals je in les 8 leert, kan door assignment nooit in de problemen komen: de aandelen staan al klaar.",
              ],
              example: {
                title: "Zo ziet assignment eruit op je afschrift",
                body:
                  "Je bezit 100 aandelen Zeewind NV en hebt daarop een call geschreven met uitoefenprijs EUR 44. Zeewind sluit op expiratie op EUR 47 en je wordt geassigneerd. Op je afschrift zie je twee regels: '100 aandelen Zeewind NV geleverd wegens uitoefening call EUR 44' en een bijschrijving van EUR 4.400 (100 x EUR 44). Je aandelen zijn weg, het afgesproken bedrag staat op je rekening. Let wel op het gemiste stuk: de aandelen waren op de beurs EUR 4.700 waard, dus de levering 'kostte' je EUR 300 aan misgelopen koerswinst boven de uitoefenprijs — precies de afspraak die je bij het schrijven maakte in ruil voor de premie.",
              },
            },
            {
              heading: "AEX-indexopties: afrekenen in geld",
              paragraphs: [
                "Bij een indexoptie op de AEX kan er niets geleverd worden — je kunt een index immers niet in je depot leggen. Daarom werken indexopties met cash settlement: op expiratie wordt het verschil tussen de afrekenkoers van de index en jouw uitoefenprijs simpelweg in geld verrekend, vermenigvuldigd met EUR 100 per indexpunt.",
                "Reken even mee met een fictief voorbeeld. Stel, een AEX-achtige index noteert 900 punten en jij bezit een call met uitoefenprijs 880 die vandaag expireert. Wordt de afrekenkoers vastgesteld op 900, dan ontvang je (900 - 880) x EUR 100 = EUR 2.000 op je rekening. Was de afrekenkoers 875 geweest, dan was je call waardeloos verlopen en was je de volledige premie kwijt — cash settlement verandert niets aan dat verliesscenario.",
                "Let op de maatvoering: door die factor EUR 100 per punt vertegenwoordigt één indexoptie op een stand van 900 een onderliggende waarde van EUR 90.000. Indexopties zijn daarmee fors grotere instrumenten dan de meeste aandelenopties, en de premies zijn er ook naar. Voor de meeste beginnende optiebeleggers zijn aandelenopties daarom het logische startpunt.",
              ],
            },
            {
              heading: "De derde vrijdag",
              paragraphs: [
                "Standaard optieseries op Euronext expireren op de derde vrijdag van de maand. Die datum staat gewoon in de optieketen, maar het ritme is handig om te kennen: rond expiratievrijdag zie je vaak extra handel en verschuift de aandacht naar de volgende maand. Er bestaan inmiddels ook week- en dagopties op populaire onderliggende waarden, maar de maandseries op de derde vrijdag zijn de klassieke standaard.",
                "Twee praktische afspraken moet je kennen. Ten eerste: de afrekenkoers van AEX-indexopties is niet zomaar de slotkoers, maar wordt op expiratiedag berekend als gemiddelde van indexstanden gedurende een vastgestelde periode — dat maakt de afrekening minder gevoelig voor één uitschieter op het slot. Ten tweede: in-the-money aandelenopties worden op expiratie doorgaans automatisch uitgeoefend. Wie niet 100 aandelen geleverd wil krijgen (of kwijt wil), moet zijn positie dus vóór expiratie sluiten.",
                "De les hieruit is dezelfde als steeds in deze module: er zit geen magie in de mechanica, maar wel een agenda. Zet de expiratiedata van je posities in je agenda en beslis ruim van tevoren wat je ermee wilt — verkopen, doorrollen of laten uitoefenen. De expiratie overkomt je maar één keer per positie; laat het geen verrassing zijn.",
              ],
              bullets: [
                "Aandelenopties op Euronext: Amerikaanse stijl, fysieke levering van 100 aandelen, assignment kan elke handelsdag",
                "AEX-indexopties: Europese stijl, cash settlement van EUR 100 per indexpunt, alleen op expiratie",
                "Afrekenkoers van de index = gemiddelde over een vastgestelde periode op expiratiedag, niet de slotkoers",
                "In-the-money opties worden op expiratie doorgaans automatisch uitgeoefend: sluit tijdig wat je niet geleverd wilt krijgen",
              ],
            },
          ],
          keyTakeaways: [
            "Amerikaanse stijl = uitoefenen mag de hele looptijd; Europese stijl = alleen op expiratie; verhandelen kan bij beide altijd",
            "Aandelenopties op Euronext zijn Amerikaans met fysieke levering; AEX-indexopties zijn Europees met cash settlement",
            "Assignment is de toewijzing van een uitoefening aan een schrijver: niet te kiezen, niet te weigeren, maar bij gedekte posities ongevaarlijk",
            "Eén indexoptie gaat over EUR 100 per punt — op een stand van 900 is dat EUR 90.000 aan onderliggende waarde",
            "Standaardexpiratie is de derde vrijdag van de maand; beslis vóór die tijd wat er met je positie moet gebeuren",
          ],
          quiz: [
            {
              question: "Wat is het verschil tussen een optie van Amerikaanse stijl en een van Europese stijl?",
              options: [
                "Amerikaanse opties worden in dollars verhandeld, Europese in euro's",
                "Een Amerikaanse optie mag de hele looptijd worden uitgeoefend, een Europese alleen op de expiratiedatum",
                "Amerikaanse opties zijn alleen op Amerikaanse beurzen te koop",
                "Europese opties kun je tussentijds niet verkopen",
              ],
              correctIndex: 1,
              explanation:
                "De stijlnamen gaan uitsluitend over het uitoefenmoment, niet over geografie of valuta — beide stijlen worden gewoon op Euronext verhandeld. En let op het verschil tussen uitoefenen en verhandelen: ook een Europese optie kun je elke handelsdag verkopen.",
            },
            {
              question: "Hoe wordt een AEX-indexoptie op expiratie afgewikkeld?",
              options: [
                "Je krijgt de 25 grootste AEX-aandelen geleverd in je depot",
                "De optie wordt automatisch doorgerold naar de volgende maand",
                "Je moet zelf vóór expiratie kiezen tussen levering en verlenging",
                "In geld: het verschil tussen afrekenkoers en uitoefenprijs, maal EUR 100 per punt",
              ],
              correctIndex: 3,
              explanation:
                "Een index kun je niet leveren, dus indexopties kennen cash settlement: bij een call met uitoefenprijs 880 en een afrekenkoers van 900 ontvang je (900 - 880) x EUR 100 = EUR 2.000. Eindigt de optie out of the money, dan ontvang je niets en is de premie definitief verloren.",
            },
            {
              question:
                "Je hebt een gedekte call geschreven (uitoefenprijs EUR 44) op je 100 aandelen Zeewind NV en wordt geassigneerd. Wat zie je op je afschrift?",
              options: [
                "Je 100 aandelen verlaten je rekening en er wordt EUR 4.400 bijgeschreven — de afspraak uit het contract wordt uitgevoerd",
                "Een boete van de beurs omdat je te laat hebt gereageerd op de uitoefening",
                "Niets: assignment is alleen een administratieve melding zonder gevolgen",
                "Een verplichting om binnen 30 dagen nieuwe aandelen te kopen",
              ],
              correctIndex: 0,
              explanation:
                "Assignment betekent simpelweg dat de leveringsafspraak wordt uitgevoerd: aandelen eruit, uitoefenprijs maal 100 erin. Geen boetes, geen vervolgverplichtingen. Omdat je de aandelen al bezat (gedekt geschreven), kon dit je ook nooit in de problemen brengen — je 'kost' is alleen de koerswinst boven EUR 44 die je hebt weggegeven in ruil voor de premie.",
            },
            {
              question: "Wanneer expireren de standaard maandseries van opties op Euronext?",
              options: [
                "Op de laatste handelsdag van de maand",
                "Op de eerste maandag van de maand",
                "Op de derde vrijdag van de maand",
                "Op een datum die per broker verschilt",
              ],
              correctIndex: 2,
              explanation:
                "De derde vrijdag van de maand is de klassieke expiratiedag voor standaardseries. De datum is een beurs-afspraak en verschilt dus niet per broker. Handig om te weten: zet expiratiedata in je agenda en beslis ruim van tevoren of je een positie sluit, doorrolt of laat aflopen — in-the-money aandelenopties worden doorgaans automatisch uitgeoefend.",
            },
          ],
          xp: 50,
        },
        {
          slug: "tijdsverval-en-volatiliteit",
          title: "Tijdsverval en volatiliteit",
          durationMin: 10,
          intro:
            "Je hebt gelijk over de richting van het aandeel en tóch verlies je geld op je optie. Dat overkomt vrijwel elke beginnende optiekoper, en het is geen pech maar mechanica: tijdsverval en volatiliteit werken dag en nacht op je premie in. Deze les geeft je het gevoel voor beide, zonder formules.",
          sections: [
            {
              heading: "Theta: de klok tikt tegen de koper",
              paragraphs: [
                "In les 4 zag je dat tijdswaarde onherroepelijk naar nul loopt richting expiratie. Optiehandelaren hebben voor de snelheid van dat verval een naam: theta. Een theta van EUR 0,02 betekent dat je optie, bij verder gelijkblijvende omstandigheden, elke dag zo'n EUR 0,02 aan tijdswaarde verliest — EUR 2 per contract, elke kalenderdag, ook in het weekend als de beurs dicht is.",
                "Het venijnige is dat theta niet constant is: het tijdsverval versnelt naarmate expiratie nadert. Een optie met negen maanden looptijd verliest per dag nauwelijks merkbaar waarde; dezelfde optie in de laatste weken voor expiratie smelt zienderogen. Vooral at-the-money opties, met hun grote tijdswaarde uit les 4, verliezen in die laatste weken het hardst.",
                "Voor jou als koper betekent dit: tijd is letterlijk geld, en wel andermans geld. Elke dag dat de verwachte koersbeweging uitblijft, betaal je huur aan de schrijver. Vandaar de vuistregel dat kopers van kortlopende opties niet alleen gelijk moeten hebben over de richting, maar ook over het tempo — en dat is veel gevraagd.",
              ],
            },
            {
              heading: "Implied volatility: de prijs van onzekerheid",
              paragraphs: [
                "De tweede kracht op je premie is volatiliteit: hoe beweeglijk de markt verwacht dat het aandeel zal zijn. Die verwachting zit in de premie ingebakken en heet implied volatility (IV). Hoe meer beweging de markt verwacht, hoe hoger de premies — logisch, want bij een wild bewegend aandeel is de kans groter dat een optie flink in the money eindigt, en dus vraagt de schrijver meer voor zijn risico.",
                "IV is geen constante eigenschap van een aandeel maar een stemming die op en neer gaat. Voor de publicatie van kwartaalcijfers loopt de IV vaak op: iedereen weet dat er nieuws komt en dat de koers kan springen, dus opties worden duurder. Direct ná de cijfers is de onzekerheid weg en zakt de IV abrupt terug — handelaren noemen dat de volatility crush. Wie vlak voor cijfers een dure optie koopt, kan gelijk krijgen over de richting en toch verliezen doordat de premie leegloopt.",
                "Onthoud vooral dit: als optiekoper koop je volatiliteit, als schrijver verkoop je haar. Koop je wanneer de IV hoog staat, dan betaal je een toptarief voor onzekerheid die daarna kan wegebben. Het is dezelfde les als bij aandelen — de prijs die je betaalt bepaalt mede je resultaat — maar bij opties werkt hij twee keer zo hard door.",
              ],
            },
            {
              heading: "Waarom je optie daalt terwijl het aandeel stijgt",
              paragraphs: [
                "Nu kunnen we het raadsel uit de intro oplossen. De waarde van je optie hangt niet alleen af van de koers van het aandeel, maar ook van de resterende tijd en de implied volatility. Beweegt de koers te langzaam de goede kant op, dan kan het tijdsverval de koerswinst volledig opeten. Zakt bovendien de IV, dan krijg je een tweede klap bovenop de eerste.",
                "Dit is geen zeldzaam randgeval maar het dagelijkse lot van kortlopende out-of-the-money opties. Reken het voorbeeld hieronder rustig na — het is misschien wel het belangrijkste rekenvoorbeeld van de cursus, omdat het laat zien dat 'gelijk hebben' bij opties uit drie delen bestaat: richting, omvang én timing.",
              ],
              example: {
                title: "Gelijk over de richting, toch verlies",
                body:
                  "Zeewind NV noteert EUR 42. Je verwacht een stijging en koopt voor EUR 0,60 (EUR 60 per contract) een call met uitoefenprijs EUR 46 die over vijf weken expireert. Je krijgt gelijk: drie weken later staat Zeewind op EUR 43 — een keurige stijging van 2,4%. Maar je call noteert nu EUR 0,35. Wat gebeurde er? De optie is nog steeds volledig out of the money (intrinsieke waarde EUR 0), er zijn drie van de vijf weken tijdswaarde verdampt, en na de goed ontvangen kwartaalcijfers zakte de implied volatility. Resultaat: het aandeel steeg, jij staat EUR 25 per contract in de min (EUR 0,60 - EUR 0,35 = EUR 0,25 x 100). Verkoop je nu, dan is dat je verlies; houd je vast en blijft Zeewind onder EUR 46, dan verlies je de volle EUR 60.",
              },
            },
            {
              heading: "Wat dit betekent voor jouw start",
              paragraphs: [
                "Trek uit deze les geen moedeloze conclusie maar een nuchtere: de krachten die tegen de koper werken, werken vóór de schrijver. Tijdsverval is de motor achter de covered call die je in les 8 leert — daar incasseer jij de tijdswaarde die bij een ander verdampt. Beide rollen zijn legitiem; je moet alleen weten welke rol je speelt en welke wind er dan waait.",
                "Koop je toch een optie, dan geeft deze les je drie praktische lessen mee. Gun jezelf looptijd: langer lopende opties zijn duurder, maar het tijdsverval per dag is milder en je stelling hoeft minder haast te hebben. Kijk naar de IV voordat je koopt: na een nieuwsgolf premies betalen is duur bier. En reken vóór aankoop uit wat er moet gebeuren om quitte te spelen — niet alleen welke koers, maar ook wanneer.",
                "Wil je dieper in theta, vega en de andere 'Grieken' duiken, dan is daar de vervolgcursus Volatiliteit & Spreads voor. Voor nu is intuïtie genoeg: tijd kost de koper geld, onzekerheid is geprijsd, en beide kun je niet negeren.",
              ],
              bullets: [
                "Tijdsverval (theta) versnelt richting expiratie en loopt ook in het weekend door",
                "Implied volatility stijgt vóór verwacht nieuws en zakt er abrupt na (volatility crush)",
                "Als koper moet je gelijk hebben over richting, omvang én timing — drie keer raak",
                "Langere looptijd = milder tijdsverval per dag, tegen een hogere premie",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Options, Futures, and Other Derivatives",
              author: "John Hull",
              year: 1988,
              note: "Hét academische standaardwerk waar elke professional mee is opgeleid. We noemen het voor de eerlijkheid: het bestaat, het is uitstekend, en je hebt het voor deze cursus niet nodig. Intuïtie eerst, wiskunde later — of nooit, en ook dat is prima.",
            },
          ],
          keyTakeaways: [
            "Theta is de snelheid van het tijdsverval: elke dag verdampt er tijdswaarde, en het verval versnelt richting expiratie",
            "Implied volatility is de ingeprijsde beweeglijkheid: hoge IV = dure opties, en IV zakt vaak abrupt na nieuws",
            "Een optie kan dalen terwijl het aandeel stijgt: tijdsverval en IV-daling kunnen de koerswinst overtreffen",
            "Als koper heb je drie dingen tegelijk nodig: de goede richting, voldoende omvang en de juiste timing",
            "Dezelfde krachten werken vóór de schrijver — dat inzicht is de opmaat naar de covered call in les 8",
          ],
          quiz: [
            {
              question: "Wat gebeurt er met het tijdsverval (theta) van een optie naarmate de expiratiedatum nadert?",
              options: [
                "Het versnelt: vooral in de laatste weken smelt de tijdswaarde het hardst",
                "Het vertraagt: de meeste tijdswaarde verdwijnt in de eerste week na aankoop",
                "Het stopt: vlak voor expiratie is de tijdswaarde bevroren",
                "Het keert om: vlak voor expiratie groeit de tijdswaarde weer aan",
              ],
              correctIndex: 0,
              explanation:
                "Tijdsverval is niet lineair maar versnelt richting het einde: een optie met maanden looptijd verliest per dag weinig, dezelfde optie in de laatste weken zienderogen. Daarom is een kortlopende optie kopen zo'n haastige stelling — de klok tikt er het hardst.",
            },
            {
              question:
                "Zeewind NV stijgt in drie weken van EUR 42 naar EUR 43, maar jouw call met uitoefenprijs EUR 46 daalt van EUR 0,60 naar EUR 0,35. Wat is de beste verklaring?",
              options: [
                "De broker heeft een fout gemaakt in de koersen",
                "Er is een dividend uitgekeerd waardoor alle opties minder waard worden",
                "De optie is out of the money gebleven terwijl tijdswaarde verdampte en de implied volatility zakte",
                "Callopties dalen altijd als het aandeel stijgt",
              ],
              correctIndex: 2,
              explanation:
                "De optiewaarde hangt af van koers, tijd én verwachte beweeglijkheid. De koers steeg te weinig om de optie in the money te brengen, drie weken tijdswaarde verdampten, en de IV zakte na de cijfers. Richting goed, omvang en timing niet — en dan verlies je als koper toch.",
            },
            {
              question: "Waarom lopen optiepremies vaak op vlak vóór de publicatie van kwartaalcijfers?",
              options: [
                "Omdat de beurs dan hogere transactiekosten rekent",
                "Omdat schrijvers rond cijfers verplicht hun posities moeten sluiten",
                "Omdat de rente rond cijferpublicaties stijgt",
                "Omdat de markt een koerssprong verwacht: de implied volatility en dus de prijs van onzekerheid stijgt",
              ],
              correctIndex: 3,
              explanation:
                "Iedereen weet dat cijfers de koers kunnen laten springen, dus de ingeprijsde beweeglijkheid (IV) loopt op en opties worden duurder. Na de publicatie is de onzekerheid weg en zakt de IV vaak abrupt — de volatility crush. Wie vlak voor cijfers koopt, betaalt dus een toptarief.",
            },
            {
              question: "Over welke drie dingen moet een optiekoper gelijk krijgen om winst te maken?",
              options: [
                "De richting van de koers, het dividend en de rentestand",
                "De richting van de beweging, de omvang ervan én de timing binnen de looptijd",
                "Alleen de richting: de rest regelt de markt",
                "De uitoefenprijs, de contractgrootte en de naam van de schrijver",
              ],
              correctIndex: 1,
              explanation:
                "Richting alleen is niet genoeg: de beweging moet groot genoeg zijn om premie en tijdsverval goed te maken, en hij moet binnen de looptijd plaatsvinden. Dat drievoudige gelijk is de kern van waarom optiekopen moeilijker is dan het lijkt — en het eerlijke bruggetje naar les 9.",
            },
          ],
          xp: 50,
        },
        {
          slug: "je-eerste-order",
          title: "Je eerste order",
          durationMin: 9,
          intro:
            "De theorie staat; nu de praktijk van het handelen zelf. In deze les regelen we de randvoorwaarden: een broker die opties aanbiedt, de wettelijke kennistoets die je moet halen, en de twee gewoontes — limietorders en liquide series — die je vanaf order één moet aanleren.",
          sections: [
            {
              heading: "Een broker kiezen zonder reclamepraat",
              paragraphs: [
                "Om opties op Euronext te verhandelen heb je een broker nodig die dat aanbiedt. In Nederland kunnen particulieren daarvoor onder meer terecht bij DEGIRO, LYNX en Saxo — we noemen ze als feit, niet als aanbeveling; welke partij bij jou past, hangt af van je situatie en dat is een keuze die wij als opleider niet voor je maken. Er zijn er meer, en let op: niet elke populaire beleggingsapp biedt optiehandel aan.",
                "Waar let je op? Uiteraard op de tarieven per optiecontract — die verschillen behoorlijk en veranderen regelmatig, dus controleer de actuele tarievenlijst bij de broker zelf in plaats van op vergelijkingssites of in cursussen (ook deze). Maar kijk verder dan kosten alleen: hoe overzichtelijk is de optieketen, kun je makkelijk het uitbetalingsprofiel van een positie zien, en hoe duidelijk communiceert de broker over margin en assignment?",
                "Eén ding is bij elke broker hetzelfde: je moet voor optiehandel een aparte toestemming aanvragen bovenop je gewone beleggingsrekening. Dat is geen commerciële drempel maar een wettelijke — en daarover gaat de volgende sectie.",
              ],
            },
            {
              heading: "De kennis- en ervaringstoets is geen pesterij",
              paragraphs: [
                "Voordat een broker je opties laat verhandelen, is hij op grond van de Europese richtlijn MiFID II verplicht te toetsen of je begrijpt wat je gaat doen. Je krijgt vragen over hoe opties werken, welke risico's eraan kleven en wat je eigen ervaring is. Scoor je onvoldoende, dan moet de broker je waarschuwen of de toegang weigeren.",
                "Zie die toets niet als hindernis maar als gratis examen. Sterker nog: hem ruim en zonder gokken halen is een eerlijk doel van deze cursus. De vragen gaan over precies de stof die je nu beheerst — het verschil tussen recht en plicht, het maximale verlies per positie, de contractgrootte van 100, wat assignment betekent. Struikel je ergens over, dan is dat een signaal om de betreffende les nog eens te doen, niet om antwoorden op te zoeken.",
                "Wees ook eerlijk in het ervaringsdeel van de vragenlijst. De verleiding bestaat om ervaring aan te dikken zodat je sneller toegang krijgt, maar die bescherming is er voor jou: de toets is het laatste vangnet vóór je met echt geld aan de slag gaat. Wie moet sjoemelen om binnen te komen, is er nog niet klaar voor — en dat is geen schande, alleen een kwestie van volgorde.",
              ],
            },
            {
              heading: "Altijd een limietorder",
              paragraphs: [
                "Bij aandelen van grote bedrijven kun je met een marktorder (kopen tegen de beste beschikbare prijs) meestal weinig kapot maken. Bij opties ligt dat anders, en wel door de spread uit les 3: de afstand tussen bied en laat is groter, en bij rustige series kan een marktorder worden uitgevoerd tegen een prijs die fors slechter is dan je verwachtte.",
                "Maak er daarom vanaf order één een ijzeren gewoonte van: opties handel je met een limietorder, waarbij jij de maximale koopprijs (of minimale verkoopprijs) vastlegt. Een veelgebruikt startpunt is een limiet rond het midden tussen bied en laat; word je niet uitgevoerd, dan kun je je limiet stapje voor stapje aanpassen. Zo betaal je nooit ongemerkt de volle spread.",
                "Accepteer daarbij dat een limietorder soms níét wordt uitgevoerd. Dat voelt als iets missen, maar het is de bedoeling: de limiet beschermt je tegen slechte prijzen, en de prijs daarvan is dat je af en toe naast een transactie grijpt. In een liquide serie is dat zelden een probleem; in een illiquide serie is het juist het signaal dat je daar niet moet zijn.",
              ],
              example: {
                title: "Marktorder versus limietorder in een rustige serie",
                body:
                  "Een call op Zeewind NV noteert bied EUR 1,00 / laat EUR 1,30 — een rustige serie met een brede spread. Met een marktorder koop je tegen de laatprijs: EUR 130 per contract. Met een limietorder op EUR 1,15 (het midden) bied je EUR 115; grote kans dat een marketmaker je tegemoetkomt. Scheelt EUR 15 per contract op een positie van ruwweg EUR 115 — zo'n 13% van je inleg, verdiend met één klik discipline. Het verliesscenario van de limietorder: de koers loopt weg en je order wordt niet uitgevoerd. Dan heb je geen positie — vervelend als je gelijk blijkt te krijgen, maar aanzienlijk minder erg dan structureel de volle spread betalen.",
              },
            },
            {
              heading: "Liquiditeit: waar je wél en niet handelt",
              paragraphs: [
                "Niet elke optieserie op Euronext is even bewoond. Op de grote AEX-fondsen is de handel doorgaans levendig: krappe spreads, veel open interest, vlotte uitvoering. Op kleinere fondsen kan de optiehandel dun tot vrijwel afwezig zijn, met de brede spreads uit les 3 als gevolg. Dezelfde strategie die op een liquide fonds prima uitvoerbaar is, wordt op een illiquide fonds opgevreten door de kosten.",
                "Voor je eerste orders is de richtlijn daarom eenvoudig: begin bij de meest verhandelde namen en controleer per serie de spread en de open interest voordat je een order inlegt. En begin klein — met één contract. De verleiding om 'de moeite waard' te handelen met meerdere contracten komt later vanzelf; eerst wil je het hele proces een paar keer meemaken: order inleggen, uitvoering, de positie zien bewegen, en sluiten.",
                "Tot slot voor de volledigheid: dit alles is uitvoeringstechniek, geen strategie. Wélke optie je koopt of schrijft en waarom, dat is het onderwerp van les 8 — en van de keuzes die je uiteindelijk zelf maakt. Wij leren je het gereedschap kennen; wat je ermee bouwt, blijft jouw beslissing en jouw verantwoordelijkheid.",
              ],
              bullets: [
                "Controleer vóór elke order: spread redelijk? Open interest serieus?",
                "Begin met één contract op een liquide fonds — het proces leren is je eerste rendement",
                "Limietorder, altijd; pas je limiet liever stapsgewijs aan dan dat je een marktorder gebruikt",
                "Tarieven veranderen: check de actuele tarievenlijst bij de broker zelf",
              ],
            },
          ],
          keyTakeaways: [
            "Optiehandel vereist een aparte toestemming bij je broker; DEGIRO, LYNX en Saxo bieden het aan (feit, geen aanbeveling)",
            "De MiFID II-kennistoets is een wettelijk verplicht vangnet: haal hem ruim en eerlijk, of doe eerst de stof opnieuw",
            "Handel opties uitsluitend met limietorders — de spread maakt marktorders onnodig duur",
            "Blijf bij liquide series met krappe spreads en serieuze open interest, en begin met één contract",
            "Tarieven verschillen en veranderen: controleer ze altijd bij de broker zelf",
          ],
          quiz: [
            {
              question: "Waarom moet je bij een broker een kennis- en ervaringstoets afleggen voordat je opties mag verhandelen?",
              options: [
                "Omdat brokers zo extra inschrijfgeld kunnen vragen",
                "Omdat alleen professionele beleggers opties mogen verhandelen",
                "Omdat de Europese richtlijn MiFID II brokers verplicht te toetsen of je dit complexe product begrijpt",
                "Omdat de AFM elke optiebelegger persoonlijk registreert",
              ],
              correctIndex: 2,
              explanation:
                "MiFID II verplicht brokers om bij complexe producten zoals opties je kennis en ervaring te toetsen, en je te waarschuwen of te weigeren bij onvoldoende score. Het is beleggersbescherming, geen verdienmodel — en de toets ruim en eerlijk halen is een prima lakmoesproef voor of je er klaar voor bent.",
            },
            {
              question: "Waarom is een limietorder bij opties zoveel belangrijker dan bij grote aandelen?",
              options: [
                "Omdat de spread bij opties breder is en een marktorder dus tegen een fors slechtere prijs kan worden uitgevoerd",
                "Omdat marktorders bij opties wettelijk verboden zijn",
                "Omdat limietorders bij opties gratis zijn en marktorders niet",
                "Omdat een limietorder garandeert dat je altijd wordt uitgevoerd",
              ],
              correctIndex: 0,
              explanation:
                "De spread is bij opties structureel breder dan bij liquide aandelen, zeker in rustige series. Een limietorder legt jouw maximale prijs vast; de prijs daarvan is dat je soms níét wordt uitgevoerd (optie 4 is dus precies verkeerd om). Marktorders zijn niet verboden, alleen onverstandig.",
            },
            {
              question: "Je wilt je eerste optieorder plaatsen. Welke combinatie past het best bij wat deze les adviseert?",
              options: [
                "Vijf contracten op een klein fonds, marktorder, want dan ben je zeker van uitvoering",
                "Eén contract op een liquide AEX-fonds, limietorder rond het midden van de spread",
                "Tien contracten van een goedkope optie onder EUR 0,50, want dan is je risico klein",
                "Eén contract op het fonds met de breedste spread, want daar valt het meest te verdienen",
              ],
              correctIndex: 1,
              explanation:
                "Klein beginnen (één contract), op een liquide fonds, met een limietorder: zo leer je het proces zonder onnodige kosten. Optie 3 herhaalt de denkfout uit les 4 — tien 'goedkope' contracten zijn EUR 500 aan pure tijdswaarde — en een brede spread is een kostenpost, geen kans.",
            },
            {
              question: "Wat is de juiste omgang met brokertarieven voor opties?",
              options: [
                "Tarieven zijn bij alle Nederlandse brokers wettelijk gelijk",
                "Tarieven zijn verwaarloosbaar zolang je maar weinig contracten handelt",
                "De goedkoopste broker is altijd de beste keuze",
                "Controleer de actuele tarievenlijst bij de broker zelf: tarieven verschillen per partij en veranderen regelmatig",
              ],
              correctIndex: 3,
              explanation:
                "Tarieven verschillen echt en wijzigen regelmatig — daarom noemt deze cursus bewust geen bedragen. En kosten zijn belangrijk (zeker bij veel handelen, zie les 9), maar niet het enige criterium: overzichtelijkheid, informatie over margin en assignment en het ordersysteem tellen mee.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "eerlijk-van-start",
      title: "Eerlijk van start",
      description:
        "De laatste module maakt de cirkel rond: twee verstandige, risicoverlagende toepassingen waarmee je naast een bestaande aandelenportefeuille kunt beginnen — en het eerlijke verhaal over waarom veel optiekopers geld verliezen, inclusief een checklist om te bepalen of jij er klaar voor bent.",
      lessons: [
        {
          slug: "twee-verstandige-eerste-strategieen",
          title: "Twee verstandige eerste strategieën",
          durationMin: 10,
          intro:
            "Je hoeft niet te speculeren om opties zinvol te gebruiken. De twee strategieën in deze les — de covered call en de protective put — bouwen allebei voort op aandelen die je al bezit, en verlagen je risico of voegen inkomen toe in plaats van je hefboom op te pompen. Precies daarom zijn dit de juiste eerste stappen.",
          sections: [
            {
              heading: "Waarom juist deze twee",
              paragraphs: [
                "De meeste optie-ellende ontstaat bij posities die op zichzelf staan: losse calls en puts gekocht op hoop, of erger, ongedekt geschreven. De twee strategieën van deze les zijn anders van karakter: ze bestaan alleen náást een aandelenpositie en veranderen het risicoprofiel van iets wat je toch al hebt. De covered call ruilt onzeker koerspotentieel in voor zekere premie; de protective put ruilt zekere premie in voor een harde ondergrens.",
                "Merk op dat het spiegelbeelden zijn van elkaar: de één verkoopt tijdswaarde, de ander koopt haar. Welke (en óf een van beide) bij je past, hangt af van wat je met je aandelen wilt — dat blijft jouw afweging, geen advies van ons. Wat wij kunnen doen, is beide eerlijk voorrekenen, mét de scenario's waarin ze je geld kosten.",
              ],
            },
            {
              heading: "De covered call: premie op wat je al bezit",
              paragraphs: [
                "Bij een covered call (gedekt geschreven call) bezit je 100 aandelen en schrijf je daarop één calloptie, meestal met een uitoefenprijs boven de huidige koers. Je incasseert direct de premie. Blijft de koers onder de uitoefenprijs, dan verloopt de call waardeloos en houd je aandelen én premie. Stijgt de koers erbovenuit, dan worden je aandelen weggeroepen tegen de uitoefenprijs — je verkoopt dus, tegen een prijs die je vooraf zelf koos, met de premie als bonus.",
                "De eerlijke prijs van deze strategie is het geplafonneerde opwaartse potentieel: explodeert het aandeel omhoog, dan doe je vanaf de uitoefenprijs niet meer mee. Een covered call is daarom in essentie een afspraak met jezelf: 'tegen déze prijs ben ik een tevreden verkoper.' Wie stiekem hoopt dat het aandeel verdubbelt, moet er geen call op schrijven.",
                "En de tweede eerlijkheid, die vaker wordt vergeten: de covered call beschermt je nauwelijks tegen een daling. De ontvangen premie is een pleister, geen helm. Daalt het aandeel hard, dan draag je vrijwel het volledige koersverlies, slechts verzacht met het premiebedrag. Wie bescherming zoekt, moet bij de volgende sectie zijn.",
              ],
              example: {
                title: "Covered call op Zeewind NV: drie scenario's",
                body:
                  "Je bezit 100 aandelen Zeewind NV op EUR 42 en schrijft een call met uitoefenprijs EUR 46, twee maanden looptijd, premie EUR 0,70: EUR 70 ontvangen. Scenario 1 (koers blijft EUR 44): de call verloopt waardeloos; je houdt je aandelen, EUR 200 koerswinst en EUR 70 premie. Scenario 2 (koers naar EUR 50): je wordt geassigneerd en levert op EUR 46. Resultaat: EUR 400 koerswinst plus EUR 70 premie = EUR 470 — prima, maar EUR 330 minder dan de EUR 800 die de pure aandeelhouder pakte. Scenario 3, het verliesscenario (koers naar EUR 36): je aandelen verliezen EUR 600 en de premie dempt dat tot EUR 530 verlies. De call heeft je niet beschermd — dat was ook nooit zijn taak.",
              },
            },
            {
              heading: "De protective put: de verzekering uit les 1, nu volwassen",
              paragraphs: [
                "De protective put ken je in essentie al uit les 1: je bezit 100 aandelen en koopt een put die je het recht geeft ze tegen de uitoefenprijs te verkopen. Daarmee zet je een harde ondergrens onder je positie: wat er ook gebeurt — winstwaarschuwing, beurscrash, faillissementsgeruchten — jouw maximale verlies staat vanaf dat moment vast en is vooraf uit te rekenen.",
                "De eerlijke prijs zit hier in de premie, en die tikt aan als je structureel verzekert. Wie elke drie maanden een put van EUR 1,50 koopt, betaalt EUR 600 per jaar op een positie van EUR 4.200 — ruim 14% verzekeringskosten per jaar. Op de lange termijn vreet dat elk redelijk aandelenrendement op. Een protective put is daarom vooral zinvol als tijdelijke bescherming in specifieke situaties, niet als permanente gewoonte; welke situaties dat zijn, verkennen we in de vervolgcursus.",
                "Reken het maximale verlies altijd vooraf uit: (aankoopkoers - uitoefenprijs) x 100 + betaalde premie. Met aandelen op EUR 42, een put EUR 40 en EUR 1,50 premie is dat (EUR 2 x 100) + EUR 150 = EUR 350, hoe diep Zeewind ook zakt. En het verliesscenario van de put zelf blijft gelden: blijft de koers liggen of stijgt hij, dan was de EUR 150 premie de kostprijs van rust die achteraf niet nodig bleek.",
              ],
            },
            {
              heading: "Wat deze cursus bewust nog niet doet",
              paragraphs: [
                "Wie deze twee strategieën beheerst, ziet al snel de volgende vraag opdoemen: kun je ze combineren, verfijnen, doorrollen? Ja — en precies daar begint de vervolgcursus Beschermen & Verdienen met Opties, die de covered call en protective put uitdiept: uitoefenprijzen kiezen, looptijden rollen, en de combinatie van beide (de collar). Dat is bewust een aparte cursus: eerst moet dit fundament zitten.",
                "Wat je hier ook nog niet vindt: spreads, straddles en andere meerpotige constructies. Niet omdat ze geheim zijn, maar omdat ze zonder dit fundament vooral duurdere manieren zijn om dezelfde fouten te maken. De cursus Volatiliteit & Spreads behandelt ze op het moment dat jij er klaar voor bent.",
                "En de vraag die je jezelf nu misschien stelt — 'welke van deze twee moet ík doen?' — beantwoorden we bewust niet. Dat hangt af van je portefeuille, je doelen en je buffer, en daarmee is het persoonlijk advies dat wij als opleider niet geven. Wat we wél kunnen zeggen: doe voorlopig niets wat je niet aan iemand anders kunt uitleggen, inclusief het verliesscenario.",
              ],
              bullets: [
                "Covered call = aandelen + geschreven call: premie vangen, opwaarts potentieel begrensd, nauwelijks bescherming omlaag",
                "Protective put = aandelen + gekochte put: harde ondergrens, tegen structureel oplopende verzekeringskosten",
                "Beide bestaan alleen naast een aandelenpositie — dat is precies wat ze geschikt maakt als eerste stap",
                "Verdieping (uitoefenprijzen kiezen, rollen, de collar): de cursus Beschermen & Verdienen met Opties",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Options Playbook",
              author: "Brian Overby",
              year: 2010,
              note: "De hoofdstukken over de covered call en de protective put zijn de perfecte aanvulling op deze les: één pagina per strategie, met het uitbetalingsprofiel er in één oogopslag bij.",
            },
          ],
          keyTakeaways: [
            "De covered call ruilt koerspotentieel boven de uitoefenprijs in voor directe premie — schrijf hem alleen op een prijs waartegen je een tevreden verkoper bent",
            "Een covered call beschermt nauwelijks tegen dalingen: de premie is een pleister, geen helm",
            "De protective put zet een uitrekenbare ondergrens onder je positie: (aankoopkoers - uitoefenprijs) x 100 + premie",
            "Structureel verzekeren met puts is duur; zie de put als tijdelijke bescherming, niet als permanente gewoonte",
            "Beide strategieën bestaan naast aandelen die je al bezit — dat risicoverlagende karakter maakt ze tot de juiste eerste stap",
          ],
          quiz: [
            {
              question:
                "Je bezit 100 aandelen Zeewind NV (gekocht op EUR 42) en schrijft een call EUR 46 voor EUR 0,70 premie. Zeewind stijgt naar EUR 50 en je wordt geassigneerd. Wat is je totale resultaat?",
              options: [
                "EUR 800 winst: de volledige koersstijging van EUR 42 naar EUR 50",
                "EUR 470 winst: EUR 400 koerswinst tot de uitoefenprijs plus EUR 70 premie",
                "EUR 70 verlies: je raakt je aandelen kwijt en houdt alleen de premie",
                "EUR 330 verlies: het verschil tussen EUR 50 en EUR 46, maal 100, minus de premie",
              ],
              correctIndex: 1,
              explanation:
                "Je levert op EUR 46: koerswinst (EUR 46 - EUR 42) x 100 = EUR 400, plus EUR 70 premie = EUR 470. De EUR 330 uit optie 4 is geen verlies maar gemíste extra winst boven de uitoefenprijs — de vooraf bekende prijs van de covered call. Wie dat gemis onverdraaglijk vindt, moet geen calls schrijven op aandelen die hij wil houden.",
            },
            {
              question: "Welke uitspraak over de covered call is juist?",
              options: [
                "De ontvangen premie beschermt je volledig tegen koersdalingen",
                "Een covered call is even riskant als een ongedekt geschreven call",
                "Met een covered call kun je nooit geld verliezen",
                "De strategie begrenst je opwaartse potentieel en dempt een daling slechts met het premiebedrag",
              ],
              correctIndex: 3,
              explanation:
                "De covered call heeft één begrensde kant (omhoog: vanaf de uitoefenprijs doe je niet meer mee) en één vrijwel open kant (omlaag: je draagt het koersverlies, slechts verzacht met de premie). Verliezen kan dus wel degelijk — zie scenario 3 uit de les. Ongedekt schrijven is een wezenlijk ander en veel gevaarlijker dier, zoals les 2 liet zien.",
            },
            {
              question:
                "Je koopt aandelen op EUR 42 en direct daarbij een protective put met uitoefenprijs EUR 40 voor EUR 1,50 premie. Wat is je maximale verlies op deze combinatie?",
              options: [
                "EUR 350: (EUR 42 - EUR 40) x 100 aan koersverlies plus EUR 150 premie",
                "EUR 150: alleen de betaalde premie",
                "EUR 4.200: de volledige aandelenpositie kan naar nul",
                "EUR 200: het verschil tussen aankoopkoers en uitoefenprijs, maal 100",
              ],
              correctIndex: 0,
              explanation:
                "De put garandeert een verkoopprijs van EUR 40, dus het koersverlies stopt bij (EUR 42 - EUR 40) x 100 = EUR 200. Tel daar de premie van EUR 150 bij op: maximaal EUR 350, hoe diep het aandeel ook zakt. Optie 4 vergeet de premie — een klassieke fout — en optie 3 beschrijft de positie zónder put.",
            },
            {
              question: "Waarom is een protective put als permanente, doorlopende gewoonte doorgaans onverstandig?",
              options: [
                "Omdat brokers maximaal één put per jaar per klant toestaan",
                "Omdat een put alleen werkt bij stijgende koersen",
                "Omdat de steeds terugkerende premies op jaarbasis een fors percentage van je positie kosten en zo je rendement opeten",
                "Omdat de bescherming van een put na drie maanden wettelijk vervalt",
              ],
              correctIndex: 2,
              explanation:
                "Wie elk kwartaal EUR 1,50 premie betaalt op een positie van EUR 42 per aandeel, is ruim 14% per jaar aan verzekeringskosten kwijt — meer dan een redelijk aandelenrendement. De put is daarom gereedschap voor specifieke periodes waarin je bescherming wilt, geen abonnement. De andere opties zijn verzonnen regels die niet bestaan.",
            },
          ],
          xp: 50,
        },
        {
          slug: "waarom-de-meeste-optiekopers-verliezen",
          title: "Waarom de meeste optiekopers verliezen",
          durationMin: 10,
          intro:
            "De eerlijkste les van de cursus, bewust aan het slot. Losse opties kopen is een spel waarin de kansen structureel tegen je werken — door kosten, tijdsverval en je eigen gedrag. Wie dat begrijpt vóórdat hij begint, kan opties gebruiken zoals ze bedoeld zijn. En wie na deze les besluit voorlopig níét te handelen, heeft de cursus net zo goed met succes afgerond.",
          sections: [
            {
              heading: "De tegenwind is structureel, geen pech",
              paragraphs: [
                "Tel de lessen van deze cursus bij elkaar op en het beeld is niet vrolijk voor de koper van losse opties. Je betaalt de laatprijs en spread bij aankoop (les 3), je premie bevat tijdswaarde die gegarandeerd verdampt (les 4), het verval versnelt in je gezicht (les 6), en je moet gelijk hebben over richting, omvang én timing tegelijk. Daar komen transactiekosten nog bovenop, twee keer per rondje.",
                "Een groot deel van de gekochte opties loopt dan ook waardeloos af of wordt met verlies verkocht — precies wat je op grond van de mechanica zou verwachten. Dat is geen samenzwering; het is de premie die verzekeraars verdienen aan verzekerden, structureel en over grote aantallen. Het exacte percentage verschilt per onderzoek en per marktperiode, dus dat prikken we hier niet vast: de mechanica erachter is belangrijker dan het getal.",
                "Belangrijk voor de eerlijkheid: dit betekent níét dat de schrijver 'dus altijd wint'. De schrijver incasseert vaak kleine winsten en vangt af en toe een grote klap — zie les 2. Er is geen kant van het contract waar het geld vanzelf ligt; er zijn alleen rollen met verschillende risicoprofielen en, aan beide kanten, kosten.",
              ],
            },
            {
              heading: "De drie klassieke manieren om te verliezen",
              paragraphs: [
                "De eerste is overtrading: te vaak handelen. Elke transactie kost spread plus tarief, en opties nodigen uit tot actie — er is altijd wel een expiratie, een niveau, een cijferseizoen. Wie tien keer per maand een 'kleine' positie van EUR 80 opent en sluit met gemiddeld EUR 10 aan spread en kosten per rondje, verbrandt EUR 100 per maand aan wrijving alleen. De beurs hoeft dan niet eens tegen te zitten om je te laten verliezen.",
                "De tweede is het lot uit de loterij: ver-out-of-the-money opties kopen omdat ze 'maar' EUR 0,20 kosten. Je weet inmiddels dat die prijs geen koopje is maar een kansinschatting: de markt acht de benodigde beweging zeer onwaarschijnlijk. Af en toe betaalt er eentje spectaculair uit, en dat verhaal hoor je dan overal — de negentien verdampte premies eromheen halen de verjaardag niet. Goedkoop is bij opties geen synoniem voor kansrijk; het is meestal het tegendeel.",
                "De derde is onderschatting van je tegenpartij. Aan de andere kant van je order staat zelden een andere particulier, maar meestal een marketmaker: een professionele partij die doorlopend bied- en laatprijzen afgeeft, zijn risico's per seconde afdekt en zijn boterham verdient aan de spread die jij betaalt. Dat is een nette, gereguleerde rol — zonder marketmakers was er geen liquide optiemarkt. Maar het betekent wel dat de prijzen die jij ziet zelden 'fout' zijn. Wie denkt structureel slimmer te zijn dan de professionele prijszetters, moet zich afvragen waarop die voorsprong precies berust.",
              ],
            },
            {
              heading: "Opties naast turbo's en CFD's",
              paragraphs: [
                "Opties zijn niet de enige hefboomproducten die je als Nederlandse particulier tegenkomt: brokers en uitgevende banken bieden ook turbo's en CFD's aan. Een volwaardige vergelijking krijgen ze in de aparte cursus Hefboomproducten; hier zetten we alleen de structuurverschillen op een rij, omdat ze verrassend in het voordeel van opties uitpakken.",
                "Ten eerste: beursopties zijn van de drie de enige die op een centrale beurs worden verhandeld, met een clearingorganisatie als tegenpartijgarantie en publieke prijsvorming. Turbo's koop je van de uitgevende bank, CFD's zet je uit tegen je broker — je handelt er rechtstreeks tegen de partij die het product maakt en prijst. Ten tweede: een gekochte optie heeft géén knock-out. Een turbo kan bij het aanraken van het stop loss-niveau ineens waardeloos worden en daarmee is je positie definitief weg, ook als de koers daarna herstelt; een gekochte optie leeft tot expiratie, hoe wild de rit onderweg ook is. Ten derde: het maximale verlies van een optiekóper is de premie — vooraf bekend, zwart op wit. Bij CFD's kunnen verliezen doorlopen zolang de positie openstaat.",
                "Eerlijkheidshalve: deze voordelen gelden voor de kóper van opties. Wie opties schrijft, heeft zoals je weet een heel ander risicoprofiel, en geen van de drie productsoorten maakt de hefboom zelf onschuldig. Maar als je ooit kiest tussen deze drie gereedschappen voor een tijdelijke, begrensde positie, is het goed om te weten dat de optie de enige is met een centrale beurs, zonder knock-out en met een vooraf bekend maximaal verlies voor de koper.",
              ],
            },
            {
              heading: "Ben ik er klaar voor? De checklist",
              paragraphs: [
                "Tot slot de vraag waar deze cursus naartoe werkte. Niet 'welke optie moet ik kopen?' — die vraag beantwoorden wij principieel niet — maar: ben ik er klaar voor om dit gereedschap überhaupt op te pakken? Loop de checklist hieronder eerlijk langs. Elke 'nee' is geen diskwalificatie maar een concrete verwijzing: de les staat erbij.",
                "En onthoud het openingszinnetje van deze les: wie na alle eerlijkheid besluit om (voorlopig) geen opties te verhandelen, heeft deze cursus met succes afgerond. Je begrijpt nu wat er in een optieketen gebeurt, wat er achter de premies zit en welke afspraken je aandelen kunnen raken — kennis die zijn geld waard is, óók met de handen op de rug. Beleggen kent risico's; je kunt (een deel van) je inleg verliezen, en bij het schrijven van opties meer dan dat. Dat wisten we aan het begin, en het is aan het eind niet minder waar geworden.",
              ],
              bullets: [
                "Ik kan de vier basisposities uitleggen, inclusief wie het recht heeft en wie de plicht (les 1 en 2)",
                "Ik reken elke schermprijs automatisch maal 100 en weet over welk aandelenbedrag een contract gaat (les 3)",
                "Ik kan van elke premie de intrinsieke waarde en tijdswaarde uit elkaar halen (les 4)",
                "Ik weet wat assignment is, wanneer het kan gebeuren en hoe het op mijn afschrift oogt (les 5)",
                "Ik begrijp waarom een optie kan dalen terwijl het aandeel stijgt (les 6)",
                "Ik verwacht de kennis- en ervaringstoets van mijn broker ruim en zonder gokken te halen (les 7)",
                "Ik begin — als ik begin — met één contract, een limietorder en een liquide serie, met geld waarvan het verlies mijn plannen niet raakt (les 7 en 9)",
              ],
            },
          ],
          bookRefs: [
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton Malkiel",
              year: 1973,
              note: "De sceptische tegenstem die elke optiebelegger gelezen moet hebben: Malkiel laat zien hoe moeilijk het is de markt structureel te verslaan — en waarom kosten en overmoed de stilste tegenstanders zijn. Gezond tegengif na negen lessen optiekunde.",
            },
          ],
          keyTakeaways: [
            "De koper van losse opties heeft structurele tegenwind: spread, tarieven, verdampende tijdswaarde en een drievoudige gelijk-vereiste",
            "De drie klassieke verliesroutes: overtrading, goedkope out-of-the-money loten en het onderschatten van professionele tegenpartijen",
            "Goedkoop is bij opties geen synoniem voor kansrijk — een lage premie ís de kansinschatting van de markt",
            "Vergeleken met turbo's en CFD's heeft de optiekoper drie structuurvoordelen: centrale beurs, geen knock-out, vooraf bekend maximaal verlies",
            "Besluiten om (nog) niet te handelen is een volwaardige, succesvolle uitkomst van deze cursus",
          ],
          quiz: [
            {
              question: "Waarom verliezen veel kopers van losse opties structureel geld, los van pech?",
              options: [
                "Omdat brokers de koersen in het nadeel van particulieren aanpassen",
                "Omdat spread, transactiekosten en verdampende tijdswaarde elke positie met tegenwind laten beginnen, en overtrading die wrijving vermenigvuldigt",
                "Omdat opties alleen winstgevend zijn voor beleggers met voorkennis",
                "Omdat de AFM winsten op opties extra belast",
              ],
              correctIndex: 1,
              explanation:
                "De tegenwind is mechanisch, geen complot: je koopt tegen de laatprijs, betaalt tarieven, en je premie bevat tijdswaarde die gegarandeerd naar nul loopt. Wie daarbovenop vaak handelt, betaalt die wrijving telkens opnieuw. Koersmanipulatie door brokers en speciale AFM-belastingen bestaan niet.",
            },
            {
              question:
                "Een out-of-the-money call kost 'maar' EUR 0,20. Wat is de juiste manier om naar die lage prijs te kijken?",
              options: [
                "Een kans: voor EUR 20 per contract kun je nauwelijks iets verliezen",
                "Een teken dat de markt een fout maakt die jij kunt uitbuiten",
                "Een aanwijzing om er juist veel contracten van te kopen, zodat het de moeite waard wordt",
                "Een kansinschatting: de markt acht de benodigde beweging zeer onwaarschijnlijk, en de premie bestaat volledig uit tijdswaarde die meestal verdampt",
              ],
              correctIndex: 3,
              explanation:
                "De lage prijs ís de boodschap: weinig kans, dus weinig premie. In euro's is het verlies klein, in procenten meestal 100 — en wie er 'voor de moeite' tien koopt, heeft gewoon EUR 200 ingezet op een onwaarschijnlijke uitkomst. Goedkoop en kansrijk zijn bij opties bijna tegenpolen.",
            },
            {
              question: "Welk structuurverschil onderscheidt beursopties van turbo's en CFD's?",
              options: [
                "Opties worden als enige van de drie op een centrale beurs verhandeld, kennen geen knock-out en de koper weet zijn maximale verlies vooraf",
                "Opties hebben als enige van de drie een hefboomwerking",
                "Bij opties kun je als koper meer verliezen dan je inleg, bij turbo's en CFD's niet",
                "Turbo's en CFD's zijn in Nederland verboden voor particulieren",
              ],
              correctIndex: 0,
              explanation:
                "Drie echte structuurvoordelen voor de optiekóper: publieke prijsvorming op een centrale beurs met clearing, geen knock-out die je positie definitief kan wegvagen terwijl de koers later herstelt, en een maximaal verlies dat vooraf vaststaat (de premie). Alle drie de producten hebben hefboomwerking, en optie 3 is precies omgekeerd. Het volledige verhaal staat in de cursus Hefboomproducten.",
            },
            {
              question: "Je loopt de 'ben ik er klaar voor?'-checklist langs en stuit op twee punten waar je 'nee' moet antwoorden. Wat is de bedoeling van de les?",
              options: [
                "Toch beginnen, maar met de helft van je geplande inzet",
                "De checklist nog eens invullen tot er overal 'ja' staat",
                "De bijbehorende lessen opnieuw doen en pas handelen als je elk punt oprecht kunt afvinken — of besluiten om voorlopig niet te handelen, wat een even goede uitkomst is",
                "De vragen overslaan die niet over jouw favoriete strategie gaan",
              ],
              correctIndex: 2,
              explanation:
                "Elke 'nee' verwijst naar een concrete les: dat is huiswerk, geen diskwalificatie. En het belangrijkste eerlijke punt van de cursus: besluiten om (nog) niet te handelen is een succesvolle afronding, geen mislukking. Sjoemelen met je eigen checklist heeft hetzelfde probleem als sjoemelen met de brokertoets — de enige die je ermee misleidt, ben jijzelf.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
