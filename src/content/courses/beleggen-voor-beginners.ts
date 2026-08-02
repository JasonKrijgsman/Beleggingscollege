import type { Course } from "../types";

const course: Course = {
  slug: "beleggen-voor-beginners",
  title: "Beleggen voor Beginners",
  subtitle: "Je eerste stappen in investeren",
  description:
    "Deze gratis cursus geeft je een solide basis in de wereld van beleggen. Je leert waarom beleggen werkt, hoe aandelen, obligaties en ETF's in elkaar zitten, en hoe je zelf veilig je eerste stappen zet. Geen beloftes over snelle winst, wel eerlijke uitleg geworteld in klassieke beleggingsboeken.",
  level: "Beginner",
  accent: "groen",
  icon: "sprout",
  free: true,
  order: 1,
  heroQuote: {
    text: "Zoek niet naar de naald in de hooiberg. Koop gewoon de hele hooiberg.",
    source: "John C. Bogle, The Little Book of Common Sense Investing",
  },
  learnPoints: [
    "Waarom beleggen op lange termijn vaak slimmer is dan alleen sparen",
    "Hoe rente-op-rente je vermogen laat groeien, met interactieve calculator",
    "Wat aandelen, obligaties, fondsen en ETF's precies zijn",
    "Hoe beurzen werken en wat koersen echt laat bewegen",
    "Hoe je in Nederland een broker kiest en je eerste rekening opent",
    "Hoe je een gespreide startportefeuille opbouwt en klassieke fouten vermijdt",
  ],
  modules: [
    {
      slug: "het-fundament",
      title: "Het fundament",
      description:
        "Voordat je één euro belegt, wil je snappen waaróm je het doet. In deze module leer je wat inflatie met je spaargeld doet, waarom rente-op-rente zo krachtig is en hoe risico en rendement onlosmakelijk samenhangen.",
      lessons: [
        {
          slug: "waarom-beleggen",
          title: "Waarom beleggen?",
          durationMin: 8,
          xp: 50,
          intro:
            "Sparen voelt veilig en beleggen voelt spannend. Maar wie zijn geld tientallen jaren op een spaarrekening laat staan, neemt ongemerkt ook een risico: dat het elk jaar een beetje minder waard wordt.",
          sections: [
            {
              heading: "De stille dief: inflatie",
              paragraphs: [
                "Inflatie betekent dat alles langzaam duurder wordt: je boodschappen, je huur, je kop koffie. Voor jou als spaarder betekent het dat elke euro op je rekening volgend jaar iets minder koopt dan vandaag. Je saldo blijft gelijk, maar je koopkracht krimpt.",
                "De Europese Centrale Bank mikt op ongeveer 2% inflatie per jaar, maar in de praktijk schommelt het. In 2022 liep de Nederlandse inflatie zelfs op tot boven de 10%. Zolang je spaarrente lager is dan de inflatie, word je in koopkracht elk jaar een stukje armer, ook al zie je het bedrag op je rekening niet dalen.",
                "Dat is precies waarom alleen sparen op lange termijn een verborgen kostenpost heeft. Voor je buffer is dat prima, maar voor geld dat tien jaar of langer stilstaat, is het zonde.",
              ],
              example: {
                title: "Rekenvoorbeeld: € 10.000 op de spaarrekening",
                body: "Stel: je hebt € 10.000 op een spaarrekening met 1,5% rente, terwijl de inflatie gemiddeld 3% is. Na 10 jaar staat er € 11.605 op je rekening. Klinkt goed, maar in koopkracht van nu is dat nog maar zo'n € 8.600 waard. Zonder rente was het zelfs gezakt naar ongeveer € 7.400 aan koopkracht. Je verliest dus geen euro's, maar wel wat je ermee kunt kopen.",
              },
            },
            {
              heading: "Wat beleggen anders maakt",
              paragraphs: [
                "Beleggen betekent dat je je geld aan het werk zet: je koopt een stukje van bedrijven (aandelen) of leent geld uit (obligaties) en deelt mee in de winst of rente. Historisch leverde een breed gespreide aandelenportefeuille over lange periodes gemiddeld zo'n 5 tot 7% per jaar op ná inflatie. Dat is een gemiddelde over vele decennia, geen belofte voor volgend jaar.",
                "De prijs die je daarvoor betaalt is beweeglijkheid. Beurzen dalen soms hard: in 2008 halveerde de AEX ongeveer, en begin 2020 verdampte in weken zo'n 30%. Wie toen niet in paniek verkocht, zag de markten daarna herstellen. Beleggen loont historisch juist doordat je die schommelingen accepteert.",
                "Belangrijk om eerlijk te zeggen: rendement uit het verleden biedt geen garantie voor de toekomst. Wat wél zeker is: op een spaarrekening met rente onder de inflatie verlies je gegarandeerd koopkracht. Je kiest dus niet tussen risico en geen risico, maar tussen twee verschillende soorten risico.",
              ],
            },
            {
              heading: "De tijdshorizon: je belangrijkste vriend",
              paragraphs: [
                "Hoe langer je geld belegd kan blijven, hoe kleiner de rol van tussentijdse dips. Een crash van 30% is dramatisch als je het geld volgend jaar nodig hebt, maar over een periode van 30 jaar is het historisch gezien vaak een rimpeling in een stijgende lijn geweest.",
                "Daarom is de eerste vraag van elke belegger niet 'wat moet ik kopen?' maar 'wanneer heb ik dit geld nodig?'. Geld voor de korte termijn hoort op een spaarrekening, geld voor de lange termijn mag werken.",
              ],
              bullets: [
                "Korter dan 5 jaar nodig? Sparen is dan meestal logischer dan beleggen.",
                "5 tot 10 jaar? Beleggen kán, maar houd je risico beperkt.",
                "Langer dan 10 jaar? Dan heeft beleggen historisch de beste papieren.",
                "Altijd eerst: een buffer van enkele maanden vaste lasten op een spaarrekening.",
              ],
            },
            {
              heading: "Beleggen is geen gokken (als je het goed doet)",
              paragraphs: [
                "Veel beginners verwarren beleggen met speculeren: snel handelen, hypes najagen, hopen op een klapper. Dat is dichter bij het casino dan bij vermogensopbouw. Beleggen zoals wij het in deze cursus bedoelen is breed gespreid, goedkoop en geduldig meegroeien met de wereldeconomie.",
                "Morgan Housel laat in The Psychology of Money zien dat succes bij beleggen zelden draait om intelligentie en bijna altijd om gedrag: rustig blijven, lang volhouden, niet te veel willen. Dat is goed nieuws, want gedrag kun je trainen. Daar gaat deze cursus je bij helpen.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "Housel laat met sterke verhalen zien dat vermogen opbouwen vooral draait om geduld en gedrag, niet om slimmigheid. De perfecte mindset voor deze cursus.",
            },
          ],
          keyTakeaways: [
            "Inflatie holt de koopkracht van spaargeld sluipend uit: niet beleggen is óók een risico.",
            "Breed gespreid beleggen leverde historisch gemiddeld 5-7% per jaar op na inflatie, maar met flinke schommelingen en zonder garanties.",
            "Je tijdshorizon bepaalt alles: geld voor de korte termijn spaar je, geld voor 10+ jaar kan beleggen.",
            "Zorg altijd eerst voor een spaarbuffer van enkele maanden vaste lasten.",
            "Succesvol beleggen draait meer om gedrag en geduld dan om slimme trucs.",
          ],
          quiz: [
            {
              question:
                "Je hebt € 10.000 op een spaarrekening met 1,5% rente, terwijl de inflatie 3% is. Wat gebeurt er dat jaar met je koopkracht?",
              options: [
                "Die stijgt met 1,5%, want je krijgt rente",
                "Die blijft precies gelijk, want je saldo daalt niet",
                "Die daalt met ongeveer 1,5%, want de inflatie is hoger dan je rente",
                "Die daalt met 3%, want rente telt niet mee tegen inflatie",
              ],
              correctIndex: 2,
              explanation:
                "Je koopkracht verandert ongeveer met het verschil tussen rente en inflatie: 1,5% − 3% = −1,5%. Je saldo groeit dus wel in euro's, maar je kunt er elk jaar iets minder mee kopen.",
            },
            {
              question: "Waarom wordt beleggen aantrekkelijker naarmate je tijdshorizon langer is?",
              options: [
                "Omdat de beurs op lange termijn nooit kan dalen",
                "Omdat tussentijdse koersschommelingen meer tijd hebben om uit te middelen en je rendement langer kan doorgroeien",
                "Omdat brokers lagere kosten rekenen aan langetermijnbeleggers",
                "Omdat inflatie op lange termijn vanzelf verdwijnt",
              ],
              correctIndex: 1,
              explanation:
                "Op een lange horizon wegen tijdelijke dalingen historisch minder zwaar en krijgt samengestelde groei de tijd om te werken. Garanties zijn er nooit, maar tijd verkleint de impact van een slecht instapmoment. De beurs kan wel degelijk dalen, ook lang.",
            },
            {
              question: "Voor welk doel is een spaarrekening logischer dan beleggen?",
              options: [
                "Een buffer voor onverwachte kosten, zoals een kapotte wasmachine volgend jaar",
                "Vermogen opbouwen voor je pensioen over 30 jaar",
                "Een studiepot voor je kind dat over 15 jaar gaat studeren",
                "Algemene vermogensgroei met een horizon van 20 jaar",
              ],
              correctIndex: 0,
              explanation:
                "Geld dat je op korte termijn nodig kunt hebben, hoort op een spaarrekening: daar is het direct beschikbaar en kan het niet in waarde halveren op het verkeerde moment. Voor doelen van 10+ jaar is beleggen historisch juist logischer.",
            },
            {
              question:
                "Wat is voor iemand met een lange horizon het belangrijkste risico van níet beleggen?",
              options: [
                "Je betaalt automatisch meer belasting over spaargeld",
                "De bank kan je spaarrekening zomaar blokkeren",
                "Je loopt welkomstbonussen van brokers mis",
                "Inflatie holt de koopkracht van je geld tientallen jaren lang sluipend uit",
              ],
              correctIndex: 3,
              explanation:
                "Over lange periodes is inflatie de grote sluipmoordenaar van spaargeld: bij 3% inflatie is de koopkracht van niet-renderend geld na 10 jaar al ruwweg een kwart kleiner. Dat verlies is vrijwel zeker, terwijl beleggingsrisico deels wordt beloond met verwacht rendement.",
            },
          ],
        },
        {
          slug: "rente-op-rente",
          title: "Rente op rente: het achtste wereldwonder",
          durationMin: 9,
          xp: 50,
          tool: "rente-op-rente",
          intro:
            "Einstein zou het het achtste wereldwonder hebben genoemd (of hij dat echt zei, is twijfelachtig, maar het effect is springlevend): rente-op-rente. Wie het snapt, verdient eraan; wie het niet snapt, betaalt ervoor.",
          sections: [
            {
              heading: "Groei over groei: hoe het werkt",
              paragraphs: [
                "Bij gewone (enkelvoudige) rente krijg je elk jaar rente over je oorspronkelijke inleg. Bij samengestelde rente krijg je rente over je inleg én over alle rente die je eerder al ontving. Dat verschil lijkt klein, maar wordt elk jaar groter, want je groeit over een steeds grotere berg.",
                "Bij beleggen werkt het net zo: je rendement (koerswinst en herbelegd dividend) gaat het jaar erop zelf ook rendement opleveren. Vermogensgroei is daardoor geen rechte lijn maar een curve die steeds steiler wordt. In het begin merk je er weinig van; juist in de laatste jaren gebeurt het grootste deel van de groei.",
                "Dat is meteen de belangrijkste les van dit hele hoofdstuk: de kracht zit niet in het percentage, maar in de tijd. Vroeg beginnen met een klein bedrag verslaat vaak laat beginnen met een groot bedrag.",
              ],
              example: {
                title: "Rekenvoorbeeld: € 1.000 tegen 7%",
                body: "Je legt eenmalig € 1.000 in tegen 7% per jaar. Na 1 jaar: € 1.070. Na 2 jaar krijg je 7% over € 1.070, dus € 1.144,90 (niet € 1.140). Na 10 jaar staat er € 1.967,15: bijna een verdubbeling. Met enkelvoudige rente (elk jaar € 70 erbij) was het maar € 1.700 geweest. Dat verschil van € 267 is puur rente over rente, en het groeit elk jaar harder.",
              },
            },
            {
              heading: "De regel van 72",
              paragraphs: [
                "Een handig ezelsbruggetje: deel 72 door je jaarlijkse rendement en je weet ongeveer in hoeveel jaar je geld verdubbelt. Bij 7% per jaar is dat 72 / 7 ≈ 10 jaar. Bij 2% spaarrente duurt een verdubbeling zo'n 36 jaar.",
                "De regel maakt ook meteen duidelijk waarom een lange horizon zo krachtig is: wie 40 jaar belegt tegen 7%, maakt ongeveer vier verdubbelingen mee. En elke verdubbeling is in euro's groter dan alle vorige bij elkaar: van € 1.000 naar € 2.000, naar € 4.000, naar € 8.000, naar € 16.000.",
              ],
            },
            {
              heading: "Vroeg beginnen verslaat veel inleggen",
              paragraphs: [
                "Laten we het concreet maken met twee fictieve beleggers die allebei € 100 per maand inleggen tegen gemiddeld 7% per jaar. Sanne begint op haar 25e, Daan op zijn 35e. Beiden stoppen op hun 65e.",
                "Sanne legt in totaal € 48.000 in en eindigt op ruim € 239.000. Daan legt € 36.000 in en eindigt op ongeveer € 113.000. Sanne legde maar € 12.000 méér in, maar eindigt ruim € 126.000 hoger. Die tien extra jaren aan het begin zijn de duurste jaren om te missen, omdat juist het geld dat het langst staat het hardst doorgroeit.",
                "Speel hieronder zelf met de rente-op-rente-calculator: pas je maandinleg, rendement en looptijd aan en zie wat tijd met je inleg doet. Let vooral op hoe de curve in de laatste tien jaar omhoog buigt.",
              ],
              bullets: [
                "Zelfde maandbedrag, 10 jaar eerder starten: ruim twee keer zo veel eindkapitaal in dit voorbeeld.",
                "Het grootste deel van de groei zit in de laatste jaren, maar die bereik je alleen door vroeg te beginnen.",
                "Herbeleg je dividend, anders zet je een deel van het rente-op-rente-effect uit.",
              ],
            },
            {
              heading: "De schaduwkant: het werkt ook tegen je",
              paragraphs: [
                "Samengestelde groei is neutraal: hij versterkt alles wat jaarlijks terugkeert, ook je kosten. Een fonds dat 1,5% kosten per jaar rekent in plaats van 0,2% klinkt onschuldig, maar dat verschil stapelt tientallen jaren op, precies zoals rendement dat doet. In de les over ETF's rekenen we dit pijnlijk precies voor je uit.",
                "Hetzelfde geldt voor schulden: rood staan of een creditcardschuld tegen 10-14% per jaar is rente-op-rente in zijn agressiefste vorm, maar dan tegen jou. Daarom is dure schuld aflossen vrijwel altijd verstandiger dan beleggen: het is een gegarandeerd 'rendement' ter hoogte van je rentepercentage.",
                "Morgan Housel vat het mooi samen aan de hand van Warren Buffett: het overgrote deel van diens vermogen ontstond ná zijn 60e, simpelweg omdat hij al sinds zijn tiende belegde. Niet briljant timen, maar extreem lang volhouden was het geheim.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "In het hoofdstuk over samengestelde groei rekent Housel voor hoe Buffetts vermogen vooral het product is van tijd, niet van genialiteit. Verplichte kost bij deze les.",
            },
          ],
          keyTakeaways: [
            "Bij rente-op-rente groei je over je inleg én over al je eerdere rendement: exponentiële groei in plaats van een rechte lijn.",
            "Regel van 72: deel 72 door je rendement en je weet in hoeveel jaar je geld ongeveer verdubbelt.",
            "Tijd is belangrijker dan bedrag: 10 jaar eerder starten met € 100 per maand leverde in ons voorbeeld ruim twee keer zo veel op.",
            "Het effect werkt ook tegen je: jaarlijkse kosten en dure schulden stapelen net zo hard op.",
            "Herbeleg dividend om het volledige effect te benutten.",
          ],
          quiz: [
            {
              question:
                "Je zet € 1.000 weg tegen 7% samengestelde rente per jaar. Hoeveel heb je na 2 jaar?",
              options: [
                "€ 1.140, want 2 keer € 70 rente",
                "€ 1.144,90, want in jaar 2 krijg je rente over € 1.070",
                "€ 1.070, want rente krijg je pas na het eerste volledige jaar",
                "€ 1.170, want de rente stijgt elk jaar met 1%",
              ],
              correctIndex: 1,
              explanation:
                "In jaar 2 krijg je 7% over € 1.070 (inleg plus eerste jaar rente): € 1.070 × 1,07 = € 1.144,90. Die extra € 4,90 boven op de 'simpele' € 1.140 lijkt niets, maar precies dat effect wordt elk jaar groter.",
            },
            {
              question:
                "Volgens de regel van 72: bij 6% gemiddeld rendement per jaar verdubbelt je belegging in ongeveer...",
              options: ["6 jaar", "8 jaar", "12 jaar", "24 jaar"],
              correctIndex: 2,
              explanation:
                "72 gedeeld door het rendement geeft de verdubbelingstijd: 72 / 6 = 12 jaar. Het is een benadering, maar verrassend accuraat voor normale rendementen.",
            },
            {
              question:
                "Sanne (start op 25) en Daan (start op 35) leggen allebei € 100 per maand in tot hun 65e tegen 7% per jaar. Waarom eindigt Sanne ruim € 126.000 hoger, terwijl ze maar € 12.000 meer inlegt?",
              options: [
                "Vooral omdat ze in totaal meer inlegt; de rest is afronding",
                "Omdat haar extra beleggingsjaren aan het begin zitten en juist dat geld het langst kan doorgroeien, waar de groei het hardst gaat",
                "Omdat jonge beleggers bij de meeste brokers een hoger rendement krijgen",
                "Omdat het rendement in de eerste tien jaar altijd het hoogst is",
              ],
              correctIndex: 1,
              explanation:
                "Het verschil in inleg (€ 12.000) verklaart maar een fractie. Sannes eerste inleg heeft 40 jaar om te verdubbelen en nog eens te verdubbelen; de grootste absolute groei zit in de laatste jaren van de rit, en die extra rit-lengte heeft alleen zij. Rendement is voor beiden gelijk.",
            },
            {
              question: "In welke situatie werkt het rente-op-rente-effect in je nádeel?",
              options: [
                "Bij jaarlijkse fondskosten van 1,5% en bij rood staan tegen 12% rente",
                "Bij dividend dat je automatisch herbelegt",
                "Bij eenmalige transactiekosten van € 2 per aankoop",
                "Bij je vaste maandelijkse inleg in een indexfonds",
              ],
              correctIndex: 0,
              explanation:
                "Alles wat jaarlijks terugkeert, stapelt op: doorlopende kosten en rente op schulden dus ook. Eenmalige transactiekosten zijn vervelend maar stapelen niet vanzelf door. Herbelegd dividend en periodieke inleg werken juist vóór je.",
            },
          ],
        },
        {
          slug: "risico-en-rendement",
          title: "Risico en rendement",
          durationMin: 9,
          xp: 50,
          intro:
            "Hoger rendement zonder hoger risico bestaat niet: wie je dat belooft, verkoopt iets anders dan beleggen. In deze les leer je hoe die ruil precies werkt en hoeveel risico bij jóu past.",
          sections: [
            {
              heading: "De fundamentele ruil",
              paragraphs: [
                "Rendement is de beloning die beleggers eisen voor het risico dat ze dragen. Een Nederlandse staatsobligatie is heel zeker en levert daarom weinig op; een aandeel in één enkel techbedrijf kan verdubbelen of naar nul gaan en móet dus een hoger verwacht rendement bieden, anders zou niemand het willen hebben.",
                "Die relatie is geen natuurwet per belegging, maar wel de logica van de hele markt. Let op het woord 'verwacht': hoger risico betekent een hogere kans op meer rendement, niet een garantie. Juist die onzekerheid ís het risico waarvoor je betaald wordt.",
                "Draai het ook om: biedt iets een hoog 'gegarandeerd' rendement met zogenaamd laag risico, dan klopt er iets niet. Dat is bijna altijd verborgen risico of gewoon oplichting.",
              ],
            },
            {
              heading: "Volatiliteit: de prijs van het toegangskaartje",
              paragraphs: [
                "Volatiliteit is de mate waarin koersen op en neer bewegen. Aandelen zijn volatiel: een jaar met +25% of −20% is niets bijzonders. Spaargeld beweegt niet, obligaties zitten er tussenin.",
                "Voor je gevoel is een daling van 20% een ramp; voor de statistiek is het routine. Sinds de start van de AEX in 1983 zijn er meerdere crashes van 40% of meer geweest, en toch stond de index (inclusief dividend) op de lange termijn veel hoger. Volatiliteit is niet hetzelfde als geld kwijtraken; het wordt pas verlies als je op het dieptepunt verkoopt of je geld precies dan nodig hebt.",
                "Zie volatiliteit daarom als de toegangsprijs voor het rendement van aandelen. Wie die prijs niet wil betalen, krijgt spaarrente. Wie hem wel betaalt, moet vooraf beslissen hoe hij zich gaat gedragen als de rekening komt.",
              ],
              example: {
                title: "Voorbeeld: hetzelfde rendement, ander gevoel",
                body: "Stel, twee beleggingen eindigen na 10 jaar allebei op +100%. Belegging A groeide braaf elk jaar zo'n 7%. Belegging B kende jaren met −30% en +45%. Rationeel zijn ze even goed, maar bij B stapt een groot deel van de beleggers halverwege gillend uit, op het slechtst denkbare moment. Het rendement van de belegging kríjg je alleen als je gedrag het toelaat.",
              },
            },
            {
              heading: "Tijd en spreiding als schokdempers",
              paragraphs: [
                "Risico verandert met je horizon. Op één willekeurig beursjaar is de kans op verlies met een breed gespreide aandelenportefeuille historisch ruwweg één op drie of vier. Maar over rollende periodes van 15-20 jaar kwamen negatieve totaalrendementen voor brede indices historisch nauwelijks voor. Nogmaals: dat is geschiedenis, geen garantie, maar het patroon is opvallend robuust.",
                "De tweede schokdemper is spreiding, waar we in module 2 diep induiken: veel bedrijven, sectoren en landen tegelijk bezitten, zodat één faillissement je nauwelijks raakt. Eén aandeel kan naar nul; de hele wereldeconomie deed dat nog nooit.",
                "Burton Malkiel laat in A Random Walk Down Wall Street zien dat korte-termijnkoersen zich vrijwel onvoorspelbaar gedragen, maar dat risico en verwacht rendement op lange termijn wél netjes samenhangen. Precies daarom loont geduld en spreiding, en niet voorspellen.",
              ],
            },
            {
              heading: "Wat is jouw risicotolerantie?",
              paragraphs: [
                "Risicotolerantie heeft twee kanten. De financiële kant: kún je risico dragen? Dat hangt af van je horizon, je inkomen, je buffer en of je het geld ergens voor nodig hebt. De emotionele kant: kun je het ook aan zonder in paniek te raken? Die twee zijn allebei belangrijk; de strengste van de twee wint.",
                "Een eerlijke zelftest: stel je voor dat je portefeuille van € 5.000 in drie maanden € 1.500 minder waard wordt. Slaap je nog? Leg je bij? Of lig je wakker en wil je verkopen? Je antwoord zegt meer over je juiste aandelenpercentage dan welke vragenlijst ook.",
                "Beginners overschatten hun risicotolerantie vrijwel altijd, omdat ze die inschatten tijdens een stijgende markt. Begin daarom rustiger dan je stoere zelf wil: risico kun je later altijd opschroeven, maar een paniekverkoop in je eerste crash kan je vertrouwen jaren kosten.",
              ],
              bullets: [
                "Financieel: horizon, buffer, baanzekerheid en verplichtingen bepalen hoeveel risico je kúnt nemen.",
                "Emotioneel: hoe reageer je op een daling van 30% op papier?",
                "Vuistregel: kies het risiconiveau waarbij je in een crash blijft zitten én blijft inleggen.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton G. Malkiel",
              year: 1973,
              note: "Malkiel legt als geen ander uit waarom korte-termijnkoersen onvoorspelbaar zijn en hoe risico en rendement op lange termijn samenhangen. Een klassieker die nog steeds wordt bijgewerkt.",
            },
          ],
          keyTakeaways: [
            "Rendement is de vergoeding voor risico: meer verwacht rendement bestaat alleen met meer onzekerheid.",
            "Volatiliteit is de toegangsprijs voor aandelenrendement; het wordt pas echt verlies als je op het dieptepunt verkoopt.",
            "Historisch nam de kans op een negatief eindresultaat af naarmate de horizon langer werd, al blijft een garantie uit.",
            "Je risicotolerantie is de strengste van twee grenzen: wat je financieel kúnt dragen en wat je emotioneel aankunt.",
            "Beloofd hoog rendement zonder risico is altijd een alarmsignaal.",
          ],
          quiz: [
            {
              question:
                "Waarom levert een Nederlandse staatsobligatie doorgaans minder op dan een breed mandje aandelen?",
              options: [
                "Omdat obligaties minder vaak verhandeld worden dan aandelen",
                "Omdat beleggers extra verwacht rendement eisen als vergoeding voor extra risico, en aandelen risicovoller zijn",
                "Omdat de overheid wettelijk geen hoge rente mag betalen",
                "Omdat obligaties een kortere looptijd hebben dan aandelen",
              ],
              correctIndex: 1,
              explanation:
                "Dit is de kern van risico en rendement: niemand zou het extra risico van aandelen dragen zonder uitzicht op extra beloning. Een zeer veilige lening aan de Nederlandse staat hoeft beleggers maar weinig te bieden om aantrekkelijk te zijn.",
            },
            {
              question:
                "Je portefeuille daalt in één maand 8% en herstelt daarna grotendeels. Wat is de juiste conclusie?",
              options: [
                "Je had bij de top moeten verkopen en eronder weer moeten kopen",
                "Je portefeuille is te riskant en moet direct defensiever",
                "Zulke schommelingen zijn normaal: volatiliteit hoort bij beleggen en zegt weinig over je langetermijnresultaat",
                "De markt wordt gemanipuleerd; dit is geen normaal gedrag",
              ],
              correctIndex: 2,
              explanation:
                "Bewegingen van enkele procenten per maand zijn volstrekt normaal voor aandelen. Achteraf de top en bodem aanwijzen is makkelijk; vooraf lukt het vrijwel niemand structureel. Pas als je van zulke dips wakker ligt, is dát een signaal om je risicoprofiel te heroverwegen.",
            },
            {
              question:
                "Wat gebeurde er historisch met de kans op een negatief eindresultaat van breed gespreide aandelen naarmate de beleggingshorizon langer werd?",
              options: [
                "Die kans werd kleiner, al is dat een historisch patroon en geen garantie",
                "Die kans bleef exact gelijk, want elk beursjaar staat los van het vorige",
                "Die kans werd groter, want in meer jaren passen meer crashes",
                "Na 10 jaar was verlies wiskundig onmogelijk",
              ],
              correctIndex: 0,
              explanation:
                "Over rollende periodes van 15-20 jaar kwamen negatieve totaalrendementen voor brede indices historisch nauwelijks voor: goede en slechte jaren middelen uit terwijl de onderliggende economie groeit. Maar 'historisch zelden' is iets anders dan 'onmogelijk'; eerlijkheid gebiedt dat verschil te blijven noemen.",
            },
            {
              question: "Wie heeft objectief gezien de meeste ruimte om beleggingsrisico te nemen?",
              options: [
                "Iemand die zijn noodbuffer belegt om sneller vermogen op te bouwen",
                "Een 58-jarige die het geld over twee jaar nodig heeft voor een verbouwing",
                "Iemand die met geleend geld belegt omdat het verwachte rendement hoger is dan de rente",
                "Een 24-jarige met een vaste baan, een gevulde spaarbuffer en een horizon van dertig jaar",
              ],
              correctIndex: 3,
              explanation:
                "Een lange horizon, stabiel inkomen en een buffer betekenen dat tussentijdse dalingen uitgezeten kunnen worden. Een belegde noodbuffer, een korte horizon of beleggen met geleend geld zijn juist situaties waarin een daling je dwingt op het slechtste moment te verkopen.",
            },
          ],
        },
      ],
    },
    {
      slug: "de-bouwstenen",
      title: "De bouwstenen",
      description:
        "Aandelen, obligaties, fondsen, ETF's en de beurzen waarop ze handelen: in deze module leer je wat je nu écht bezit als je belegt, en waarom lage kosten en brede spreiding de twee krachtigste knoppen zijn waar je zelf aan kunt draaien.",
      lessons: [
        {
          slug: "aandelen-en-obligaties",
          title: "Aandelen, obligaties en meer",
          durationMin: 9,
          xp: 50,
          intro:
            "Achter elke koersgrafiek zit iets echts: een stukje eigendom van een bedrijf, of een lening met rente. Wie snapt wat hij bezit, raakt minder snel in paniek als de grafiek een keer rood kleurt.",
          sections: [
            {
              heading: "Aandelen: mede-eigenaar van een bedrijf",
              paragraphs: [
                "Een aandeel is een stukje eigendom van een onderneming. Koop je een aandeel Philips of ASML, dan ben je voor een piepklein deel mede-eigenaar: je hebt recht op een deel van de winst en mag stemmen op de aandeelhoudersvergadering. Je koopt dus geen lot, maar een claim op toekomstige winsten.",
                "Je rendement komt uit twee bronnen. Koerswinst: het aandeel wordt meer waard als het bedrijf (naar verwachting) meer winst gaat maken. En dividend: het deel van de winst dat het bedrijf periodiek aan aandeelhouders uitkeert. Sommige bedrijven keren veel uit, groeibedrijven investeren de winst liever in zichzelf.",
                "De keerzijde: als het bedrijf slecht draait, daalt de koers, en bij een faillissement sta je als aandeelhouder achteraan in de rij. Eén los aandeel is daardoor risicovol; daarom draait alles in de volgende lessen om spreiding.",
              ],
              example: {
                title: "Rekenvoorbeeld: dividendrendement",
                body: "Een aandeel kost € 40 en het bedrijf keert € 1,20 dividend per aandeel per jaar uit. Het dividendrendement is dan € 1,20 / € 40 = 3%. Koop je voor € 1.000 aan deze aandelen (25 stuks), dan ontvang je € 30 dividend per jaar, nog los van eventuele koerswinst of -verlies. Herbeleg je dat dividend, dan gaat het zelf ook meegroeien: rente-op-rente in de praktijk.",
              },
            },
            {
              heading: "Obligaties: jij bent de bank",
              paragraphs: [
                "Een obligatie is een verhandelbare lening aan een overheid of bedrijf. Jij leent bijvoorbeeld € 1.000 uit, ontvangt jaarlijks een vaste rente (de coupon, zeg 3% ofwel € 30) en krijgt aan het einde van de looptijd je € 1.000 terug. Voorspelbaarder dan een aandeel, maar met een lager verwacht rendement.",
                "Toch beweegt ook een obligatie in koers. Stijgt de marktrente naar 4%, dan wil niemand jouw oude obligatie met 3% coupon nog voor de volle prijs hebben: de koers daalt tot het effectieve rendement weer concurrerend is. Daalt de rente, dan wordt jouw obligatie juist méér waard. En er is kredietrisico: een wankel bedrijf moet meer rente bieden dan de Duitse of Nederlandse staat.",
                "In een portefeuille zijn obligaties vooral de schokdemper: ze schommelen doorgaans minder dan aandelen en dempen zo de uitslagen van het geheel. Vandaar de klassieke mixen van aandelen en obligaties die je in les 9 gaat zien.",
              ],
            },
            {
              heading: "Vastgoed, grondstoffen en de rest",
              paragraphs: [
                "Naast aandelen en obligaties bestaan er meer beleggingscategorieën. Vastgoed kun je indirect kopen via beursgenoteerde vastgoedfondsen (REIT's): je profiteert dan van huurinkomsten en waardeontwikkeling zonder zelf verhuurder te zijn. Grondstoffen zoals goud en olie zijn verhandelbaar, maar keren geen rente of dividend uit; hun rendement komt puur uit prijsverandering.",
                "Daarnaast kom je crypto, opties en turbo's tegen. Wees eerlijk tegen jezelf: dat zijn speculatieve of hefboomproducten, geen basisbouwstenen voor een beginnersportefeuille. Voor de lange termijn zijn breed gespreide aandelen en obligaties het bewezen fundament; al het andere is hooguit bijzaak.",
              ],
              bullets: [
                "Aandeel: eigendom, rendement uit koerswinst en dividend, hoogste risico van de basisbouwstenen.",
                "Obligatie: lening, rendement uit rente, koers beweegt tegengesteld aan de marktrente.",
                "Vastgoedfonds: indirect stenen bezitten, rendement uit huur en waardegroei.",
                "Grondstoffen en crypto: geen inkomstenstroom, puur prijsspeculatie; optioneel en riskant.",
              ],
            },
            {
              heading: "Wat betekent dit voor jou?",
              paragraphs: [
                "Het belangrijkste inzicht van deze les: een koers is een prijskaartje, geen dobbelsteen. Achter een dalende koers zit een bedrijf dat gewoon producten blijft verkopen, of een lening die gewoon rente blijft betalen. Wie dat beseft, kijkt bij een dip eerder naar de onderliggende waarde dan naar de rode cijfers.",
                "In de volgende les zie je hoe je honderden van deze bouwstenen tegelijk koopt met één fonds of ETF, en waarom dat voor bijna elke beginner het logische startpunt is.",
              ],
            },
          ],
          keyTakeaways: [
            "Een aandeel is mede-eigendom van een bedrijf: je rendement komt uit koerswinst en dividend.",
            "Een obligatie is een verhandelbare lening: je ontvangt rente, en de koers beweegt tegengesteld aan de marktrente.",
            "Obligaties zijn de schokdemper van een portefeuille; aandelen de groeimotor.",
            "Vastgoedfondsen en grondstoffen bestaan ook, maar zijn aanvulling, geen fundament.",
            "Achter elke koers zit echte waarde: dat besef beschermt je bij dalingen.",
          ],
          quiz: [
            {
              question: "Wat bezit je precies als je een aandeel koopt?",
              options: [
                "Een stukje eigendom van de onderneming, met recht op een deel van de winst",
                "Een lening aan de onderneming die met vaste rente wordt terugbetaald",
                "Een verzekering die uitkeert als het bedrijf failliet gaat",
                "Een tegoedbon die het bedrijf op verzoek altijd moet terugkopen",
              ],
              correctIndex: 0,
              explanation:
                "Een aandeel maakt je mede-eigenaar: je deelt mee in winst (via dividend en koersgroei) én in verlies. Vaste rente hoort bij obligaties, en niemand is verplicht je aandeel terug te kopen; je verkoopt het op de beurs aan een andere belegger.",
            },
            {
              question:
                "Een aandeel kost € 40 en keert € 1,20 dividend per jaar uit. Wat is het dividendrendement?",
              options: ["1,2%", "3%", "4,8%", "12%"],
              correctIndex: 1,
              explanation:
                "Dividendrendement = jaarlijks dividend gedeeld door de koers: € 1,20 / € 40 = 0,03 = 3%. Let op: dit zegt niets over koerswinst of -verlies; het is alleen de uitkeringscomponent van je rendement.",
            },
            {
              question:
                "Je bezit een obligatie met een coupon van 3%. De marktrente stijgt naar 4%. Wat gebeurt er met de koers van jouw obligatie?",
              options: [
                "Die stijgt mee, want obligatiekoersen volgen de rente",
                "Die blijft gelijk, want jouw coupon staat contractueel vast",
                "Die daalt, want nieuwe obligaties bieden meer rente en jouw oude wordt pas tegen een lagere prijs weer aantrekkelijk",
                "De obligatie wordt automatisch vervroegd afgelost tegen de nieuwe rente",
              ],
              correctIndex: 2,
              explanation:
                "Niemand betaalt de volle prijs voor 3% als nieuwe obligaties 4% geven. De koers van jouw obligatie zakt tot een koper er effectief toch zo'n 4% op maakt. Jouw coupon in euro's blijft wel gelijk; het is de verhandelwaarde die beweegt.",
            },
            {
              question: "Waarom nemen veel beleggers obligaties op naast aandelen?",
              options: [
                "Omdat obligaties op lange termijn vrijwel altijd meer opleveren dan aandelen",
                "Omdat obligaties zijn vrijgesteld van vermogensbelasting",
                "Omdat obligaties nooit in waarde kunnen dalen",
                "Omdat obligaties doorgaans minder schommelen en zo de uitslagen van de portefeuille dempen",
              ],
              correctIndex: 3,
              explanation:
                "Obligaties zijn de schokdemper: hun stabielere karakter maakt de totale portefeuille rustiger, wat vooral helpt om paniekverkopen te voorkomen. Ze kunnen wel degelijk dalen (bijvoorbeeld bij rentestijging) en leveren op lange termijn historisch juist mínder op dan aandelen.",
            },
          ],
        },
        {
          slug: "fondsen-en-etfs",
          title: "Fondsen, indexfondsen en ETF's",
          durationMin: 10,
          xp: 50,
          intro:
            "Duizenden bedrijven bezitten met één aankoop, tegen kosten van een paar tientjes per jaar: dat is de stille revolutie die John Bogle ontketende. Deze les is misschien wel de belangrijkste van de hele cursus.",
          sections: [
            {
              heading: "Waarom een fonds? Spreiding zonder gedoe",
              paragraphs: [
                "Zelf twintig losse aandelen uitzoeken en bijhouden is veel werk, en zelfs dan ben je matig gespreid. Een beleggingsfonds lost dat op: veel beleggers leggen geld bij elkaar en het fonds koopt daarvan een grote mand beleggingen. Met één deelname bezit je indirect tientallen tot duizenden bedrijven.",
                "Spreiding is het enige 'gratis lunch'-principe in beleggen: het verlaagt je bedrijfsspecifieke risico zonder dat het je verwacht rendement kost. Gaat één bedrijf in de mand failliet, dan scheelt dat je misschien een fractie van een procent in plaats van je halve inleg.",
              ],
            },
            {
              heading: "Actief versus passief: de kernkeuze",
              paragraphs: [
                "Bij een actief fonds probeert een beheerder de markt te verslaan door de 'beste' aandelen te selecteren en slim te timen. Daar betaal je voor: vaak 1 à 2% kosten per jaar. Een passief fonds (indexfonds) probeert niemand te verslaan, maar volgt simpelweg een index zoals de MSCI World of de AEX, tegen kosten van vaak 0,1 à 0,3%.",
                "Nu de ongemakkelijke waarheid waar John Bogle zijn levenswerk van maakte: alle beleggers samen zíjn de markt, dus vóór kosten behalen ze gemiddeld precies het marktrendement. Ná kosten blijft de gemiddelde actieve belegger dus per definitie achter op een goedkoop indexfonds. Het is geen mening maar rekenkunde.",
                "En de uitzonderingen dan, de fondsen die de markt wél verslaan? Die bestaan, maar onderzoek laat keer op keer zien dat het er na kosten weinig zijn, en dat de winnaars van het ene decennium zelden de winnaars van het volgende zijn. Vooraf de blijvende winnaar aanwijzen is precies het voorspelprobleem dat Malkiel beschrijft.",
              ],
              example: {
                title: "Rekenvoorbeeld: wat 1,3% kostenverschil je kost",
                body: "Je belegt € 10.000 voor 30 jaar, met een bruto rendement van 7% per jaar. In een indexfonds met 0,2% kosten groeit dat tegen netto 6,8% naar zo'n € 72.000. In een actief fonds met 1,5% kosten groeit het tegen netto 5,5% naar ongeveer € 49.800. Verschil: ruim € 22.000, meer dan twee keer je oorspronkelijke inleg, verdampt aan kosten. Rente-op-rente werkt namelijk ook op kosten.",
              },
            },
            {
              heading: "ETF's: indexfondsen op de beurs",
              paragraphs: [
                "Een ETF (Exchange Traded Fund) is een fonds dat zelf als een aandeel op de beurs verhandeld wordt. Je koopt en verkoopt het de hele beursdag door tegen actuele koersen, terwijl een klassiek beleggingsfonds meestal maar één keer per dag afrekent. Veruit de meeste ETF's zijn passieve indexvolgers met lage kosten.",
                "De belangrijkste kostenmaatstaf is de TER (Total Expense Ratio): de doorlopende jaarlijkse kosten als percentage van je belegde vermogen. Een wereldwijde aandelen-ETF met een TER van 0,20% kost je bij € 10.000 belegd vermogen dus € 20 per jaar, automatisch verrekend in de koers.",
                "Waar je verder op let bij een ETF: welke index wordt gevolgd (bijvoorbeeld MSCI World: ruwweg 1.500 bedrijven in ontwikkelde landen), de fondsomvang, of dividend wordt uitgekeerd of automatisch herbelegd (accumulerend), en of het fonds fysiek de aandelen bezit. Voor Europese beleggers is ook de UCITS-aanduiding relevant: dat is het Europese regelgevingskader voor beleggingsfondsen.",
              ],
              bullets: [
                "TER = doorlopende jaarlijkse kosten; bij indexfondsen vaak 0,1-0,3%.",
                "Accumulerend = dividend wordt automatisch herbelegd; distribuerend = uitgekeerd.",
                "Eén wereldwijde index-ETF spreidt je over ruwweg 1.500 bedrijven in tientallen landen.",
                "UCITS = Europees toezichtskader; standaard bij ETF's voor Nederlandse beleggers.",
              ],
            },
            {
              heading: "Wat spreiding wel en niet oplost",
              paragraphs: [
                "Eerlijk blijven: een wereldwijde ETF elimineert bedrijfsrisico bijna volledig, maar marktrisico blijft gewoon bestaan. Als de hele wereldeconomie in een recessie duikt, daalt ook je breed gespreide ETF, soms met tientallen procenten. Daar is geen product tegen bestand; daar is je horizon en je gedrag voor.",
                "Bogles conclusie na een halve eeuw in het vak was ontnuchterend simpel: koop de hele hooiberg tegen minimale kosten, en houd hem decennia vast. Saai? Zeker. Maar saai is bij beleggen verrassend vaak een compliment.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "De oprichter van Vanguard en uitvinder van het indexfonds voor particulieren legt uit waarom kosten en spreiding de twee knoppen zijn die er echt toe doen. Hét boek achter deze les.",
            },
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton G. Malkiel",
              year: 1973,
              note: "Malkiel onderbouwt met tientallen jaren data waarom vooraf de winnende actieve fondsen aanwijzen vrijwel onmogelijk is.",
            },
          ],
          keyTakeaways: [
            "Een fonds geeft je met één aankoop brede spreiding; spreiding verlaagt bedrijfsrisico zonder verwacht rendement te kosten.",
            "Alle beleggers samen zijn de markt: na kosten verliest de gemiddelde actieve belegger dus van een goedkoop indexfonds.",
            "De TER lijkt klein, maar 1,3% kostenverschil kan over 30 jaar ruim € 22.000 schelen op € 10.000 inleg.",
            "Een ETF is een beursverhandeld (meestal passief) fonds; let op index, TER, fondsomvang en accumulerend of distribuerend.",
            "Spreiding lost bedrijfsrisico op, geen marktrisico: dalingen blijven bij beleggen horen.",
          ],
          quiz: [
            {
              question: "Wat is het kernverschil tussen actief en passief beleggen?",
              options: [
                "Actief probeert de markt te verslaan met selectie en timing; passief volgt een index tegen lage kosten",
                "Passief handelt vaker dan actief, vandaar de naam indexfonds",
                "Actief is per definitie goedkoper omdat de beheerder efficiënter werkt",
                "Passief belegt alleen in obligaties, actief alleen in aandelen",
              ],
              correctIndex: 0,
              explanation:
                "Actieve fondsen betalen analisten en beheerders om de markt te verslaan; passieve fondsen kopiëren simpelweg een index. Passief handelt juist minder en is daardoor goedkoper. Beide vormen bestaan voor zowel aandelen als obligaties.",
            },
            {
              question:
                "Je hebt € 20.000 in een ETF met een TER van 0,25%. Hoeveel betaal je per jaar aan doorlopende fondskosten?",
              options: ["€ 5", "€ 50", "€ 250", "€ 500"],
              correctIndex: 1,
              explanation:
                "0,25% van € 20.000 = € 50 per jaar. Die kosten zie je niet als afschrijving op je rekening: ze worden dagelijks in kleine stukjes in de koers van de ETF verrekend.",
            },
            {
              question:
                "Wat is de kern van Bogles argument dat goedkope indexfondsen op lange termijn van de meeste actieve fondsen winnen?",
              options: [
                "Indexfondsen selecteren alleen de aandelen die het beste presteren",
                "Indexfondsen lopen geen koersrisico, actieve fondsen wel",
                "Alle beleggers samen behalen gemiddeld het marktrendement; wie de laagste kosten heeft, houdt daar netto het meeste van over",
                "Actieve beheerders kiezen vrijwel altijd de verkeerde aandelen",
              ],
              correctIndex: 2,
              explanation:
                "Het is rekenkunde, geen mening: vóór kosten is het gemiddelde van alle beleggers precies de markt. Actief beheer kost 1-2% per jaar, indexeren 0,1-0,3%; dat verschil stapelt decennia op. Actieve beheerders kiezen niet 'altijd verkeerd', ze zijn gemiddeld gewoon te duur.",
            },
            {
              question: "Wat onderscheidt een ETF van een klassiek beleggingsfonds?",
              options: [
                "Een ETF wordt de hele beursdag verhandeld zoals een aandeel; een klassiek fonds rekent meestal één keer per dag af",
                "Een ETF mag alleen door professionele beleggers gekocht worden",
                "Een ETF heeft altijd hogere doorlopende kosten dan een klassiek fonds",
                "Een ETF kan uitsluitend aandelen bevatten, geen obligaties",
              ],
              correctIndex: 0,
              explanation:
                "ETF staat voor Exchange Traded Fund: een fonds met een doorlopende beursnotering. Juist ETF's zijn vaak goedkoper dan klassieke fondsen, ze zijn er ook voor obligaties, en ze zijn voor iedereen met een beleggingsrekening toegankelijk.",
            },
            {
              question:
                "Je koopt één wereldwijd gespreide aandelen-ETF met zo'n 1.500 bedrijven. Wat betekent dat voor je risico?",
              options: [
                "Je loopt geen risico meer: spreiding beschermt tegen alle verliezen",
                "Het bedrijfsspecifieke risico is sterk verminderd, maar het marktrisico van wereldwijde dalingen blijft volledig bestaan",
                "Je rendement ligt nu vast op het historische gemiddelde van ongeveer 7%",
                "Alleen het risico van Nederlandse bedrijven is nog over",
              ],
              correctIndex: 1,
              explanation:
                "Eén faillissement voel je nauwelijks meer: dat is bedrijfsrisico, en dat spreid je weg. Maar in een wereldwijde crisis dalen vrijwel alle aandelen samen: dat marktrisico is precies waarvoor je op lange termijn beloond wordt, en het verdwijnt nooit.",
            },
          ],
        },
        {
          slug: "financiele-markten",
          title: "Hoe financiële markten werken",
          durationMin: 8,
          xp: 50,
          intro:
            "Elke seconde vinden op beurzen wereldwijd duizenden transacties plaats. Wie snapt hoe die machine werkt, kijkt heel anders naar het beursnieuws van acht uur.",
          sections: [
            {
              heading: "De beurs: een marktplaats voor eigendom",
              paragraphs: [
                "Een beurs is in de kern een goed georganiseerde marktplaats waar kopers en verkopers elkaar vinden. Amsterdam heeft de oudste effectenbeurs ter wereld: al in 1602 werden er aandelen van de VOC verhandeld. Tegenwoordig heet de Amsterdamse beurs Euronext Amsterdam en gaat vrijwel alle handel digitaal.",
                "Belangrijk onderscheid: op de primaire markt geeft een bedrijf nieuwe aandelen uit en haalt het echt geld op, bijvoorbeeld bij een beursgang (IPO). Op de secundaire markt, waar jij als belegger vrijwel altijd handelt, verkopen beleggers hun bestaande aandelen aan elkaar. Het bedrijf zelf merkt daar direct weinig van; jij handelt met andere beleggers.",
                "Grote beurzen wereldwijd zijn onder meer de New York Stock Exchange en Nasdaq in de VS ('Wall Street'), de London Stock Exchange en beurzen in Tokio, Shanghai en Frankfurt. Via een wereldwijde ETF handel je indirect op vrijwel al die markten tegelijk.",
              ],
            },
            {
              heading: "Vraag en aanbod: hoe een koers tot stand komt",
              paragraphs: [
                "Een koers is niets meer dan de prijs van de laatste transactie. In het orderboek van de beurs staan biedprijzen (wat kopers willen betalen) en laatprijzen (waarvoor verkopers willen verkopen). Zodra een koper en verkoper elkaar vinden, is er een transactie en dus een nieuwe koers.",
                "Willen méér mensen kopen dan verkopen tegen de huidige prijs, dan moeten kopers meer bieden en loopt de koers op; andersom zakt hij. Er is dus geen commissie die koersen 'vaststelt': de prijs is het continue resultaat van miljoenen meningen over wat een bedrijf waard is.",
                "Het verschil tussen de beste bied- en laatprijs heet de spread. Bij grote fondsen zoals ASML of een populaire ETF is die spread minimaal; bij kleine, weinig verhandelde aandelen kan hij oplopen en betaal je dus ongemerkt extra bij elke transactie.",
              ],
            },
            {
              heading: "Indices: de thermometers van de markt",
              paragraphs: [
                "Een index is een gewogen mandje aandelen dat de temperatuur van (een deel van) de markt meet. De AEX bevat de 25 meest verhandelde fondsen van Euronext Amsterdam, denk aan ASML, Shell, Unilever en ING. Stijgt de AEX 1%, dan is dat gewogen mandje gemiddeld 1% meer waard geworden.",
                "Andere bekende thermometers: de S&P 500 (500 grote Amerikaanse bedrijven), de Dow Jones, de Nasdaq (technologiezwaar) en de MSCI World (zo'n 1.500 bedrijven uit 23 ontwikkelde landen). Indexfondsen uit de vorige les doen niets anders dan zo'n mandje exact nabouwen.",
                "Let wel: de AEX is zwaar geconcentreerd; een handvol bedrijven bepaalt een groot deel van de beweging. Wie alleen de AEX volgt, is dus veel minder gespreid dan wie wereldwijd belegt. 'De beurs' uit het nieuws is bovendien meestal maar één index van één land.",
              ],
            },
            {
              heading: "Wat beweegt koersen echt?",
              paragraphs: [
                "Op lange termijn volgen koersen de winstontwikkeling van bedrijven. Op korte termijn reageren ze op alles wat verwachtingen bijstelt: kwartaalcijfers, rentebesluiten van centrale banken, inflatiecijfers, olieprijzen, verkiezingen, oorlogen en soms pure stemming.",
                "Cruciaal inzicht: koersen reageren op het verschil tussen nieuws en verwachting, niet op het nieuws zelf. Maakt een bedrijf 20% meer winst bekend terwijl de markt op 30% rekende, dan kan de koers gewoon dalen. Alles wat voorspelbaar was, zat immers al in de prijs verwerkt.",
                "Daarom is beursnieuws voor de lange-termijnbelegger vooral achtergrondruis. Malkiel noemde de korte termijn een 'random walk': uit koersen van gisteren valt de richting van morgen niet betrouwbaar af te leiden. Goed nieuws eigenlijk, want het betekent dat je niets hoeft te voorspellen om mee te groeien met de markt.",
              ],
              example: {
                title: "Voorbeeld: goed nieuws, dalende koers",
                body: "Chipbedrijf X rapporteert € 2 miljard kwartaalwinst, 15% meer dan vorig jaar. Toch daalt het aandeel 6%. Hoe kan dat? Analisten rekenden op 25% groei, en die verwachting zat al in de koers. Het 'goede' nieuws was dus eigenlijk een tegenvaller ten opzichte van wat was ingeprijsd. Koersen handelen in verwachtingen, niet in krantenkoppen.",
              },
            },
          ],
          bookRefs: [
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton G. Malkiel",
              year: 1973,
              note: "De bron van het inzicht dat korte-termijnkoersen onvoorspelbaar bewegen omdat al het bekende nieuws al in de prijs zit. Maakt je immuun voor beurspraatjes.",
            },
          ],
          keyTakeaways: [
            "Een beurs is een marktplaats: als particulier handel je vrijwel altijd met andere beleggers, niet met het bedrijf zelf.",
            "Koersen ontstaan door vraag en aanbod in het orderboek; niemand stelt ze centraal vast.",
            "Een index zoals de AEX of MSCI World is een gewogen mandje dat de markt meet; indexfondsen bouwen dat mandje na.",
            "Koersen reageren op het verschil tussen nieuws en verwachting: goed nieuws kan een koers laten dalen.",
            "Korte-termijnkoersen zijn vrijwel onvoorspelbaar; voor een indexbelegger is dat geen probleem maar een geruststelling.",
          ],
          quiz: [
            {
              question: "Wanneer stijgt de koers van een aandeel?",
              options: [
                "Als het bedrijf nieuwe aandelen uitgeeft",
                "Als kopers bereid zijn meer te betalen dan verkopers vragen, en de prijs oploopt tot ze elkaar vinden",
                "Op de dag dat het dividend wordt uitgekeerd",
                "Als er die dag minder aandelen verhandeld worden dan normaal",
              ],
              correctIndex: 1,
              explanation:
                "Een koers is de prijs waar vraag en aanbod elkaar ontmoeten: overtreft de koopdruk het aanbod, dan loopt de prijs op. Nieuwe aandelen uitgeven verwatert juist, op de ex-dividenddag daalt de koers doorgaans met ongeveer het dividendbedrag, en een lager volume zegt op zichzelf niets over de richting.",
            },
            {
              question: "Wat is de AEX?",
              options: [
                "De toezichthouder op de Nederlandse financiële markten",
                "Het gemiddelde rendement van Nederlandse spaarrekeningen",
                "Een index van de 25 meest verhandelde fondsen aan de beurs van Amsterdam",
                "Een Europees fonds dat in staatsobligaties belegt",
              ],
              correctIndex: 2,
              explanation:
                "De AEX (Amsterdam Exchange Index) is een gewogen mandje van de 25 meest verhandelde aandelen op Euronext Amsterdam, met zwaargewichten als ASML en Shell. De toezichthouder waar je misschien aan dacht, is de AFM.",
            },
            {
              question:
                "Een bedrijf presenteert 15% winstgroei, maar de koers daalt na de cijfers. Wat is de meest logische verklaring?",
              options: [
                "Dat kan eigenlijk niet: hogere winst leidt vrijwel altijd tot een hogere koers",
                "Het bedrijf heeft de cijfers waarschijnlijk verkeerd berekend",
                "Grote beleggers mogen op cijferdagen niet handelen, waardoor de koers wegzakt",
                "De markt had nog hogere groei al ingeprijsd; koersen reageren op verwachtingen, niet alleen op feiten",
              ],
              correctIndex: 3,
              explanation:
                "Alles wat de markt verwachtte, zat al in de koers verwerkt. Valt het nieuws tegen ten opzichte van die verwachting, dan daalt de koers, hoe 'goed' het nieuws op zichzelf ook klinkt. Dit verklaart een groot deel van de ogenschijnlijk onlogische beursreacties.",
            },
            {
              question:
                "Wat betekent Malkiels stelling dat koersen op korte termijn een 'random walk' volgen?",
              options: [
                "Dat koersbewegingen van morgen niet betrouwbaar te voorspellen zijn uit de koersen van gisteren",
                "Dat koersen willekeurig door de beursorganisatie worden vastgesteld",
                "Dat de beurs op lange termijn geen rendement oplevert",
                "Dat alleen professionele handelaren koersen kunnen voorspellen",
              ],
              correctIndex: 0,
              explanation:
                "Omdat al het bekende nieuws al in de prijs zit, wordt de korte termijn gedreven door onverwacht nieuws, en dat is per definitie onvoorspelbaar, ook voor professionals. Op lange termijn is er wél een opwaartse trend door winstgroei; de 'random walk' gaat over de dagelijkse bewegingen daaromheen.",
            },
          ],
        },
      ],
    },
    {
      slug: "aan-de-slag",
      title: "Aan de slag",
      description:
        "Van theorie naar praktijk: je kiest een broker, opent je eerste rekening, kiest een strategie die bewezen werkt en bouwt een portefeuille die bij je past, zonder in de klassieke beginnersvallen te trappen.",
      lessons: [
        {
          slug: "broker-kiezen",
          title: "Een broker kiezen en je eerste rekening",
          durationMin: 9,
          xp: 50,
          intro:
            "Om te beleggen heb je een beleggingsrekening nodig bij een bank of broker. De verschillen in kosten en aanbod zijn groter dan je denkt, en juist als beginner wil je hier even rustig voor gaan zitten.",
          sections: [
            {
              heading: "Bank of gespecialiseerde broker?",
              paragraphs: [
                "In Nederland kun je grofweg twee kanten op. Beleggen via je eigen grootbank (ING, ABN AMRO, Rabobank): vertrouwd, alles in één app, maar vaak met hogere service- en transactiekosten en een beperkter fondsenaanbod. Of via een gespecialiseerde broker zoals DeGiro, Lynx, Saxo Bank of Interactive Brokers: doorgaans goedkoper en met veel meer keuze, maar je moet een extra rekening openen en zelf iets meer uitzoeken.",
                "We noemen deze namen als voorbeeld, niet als aanbeveling: aanbieders veranderen hun tarieven regelmatig en wat voor de één past, past niet voor de ander. Waar het om gaat: weet dát er grote verschillen zijn, en vergelijk zelf actuele tarieven voordat je kiest.",
                "Check bij elke aanbieder of hij onder toezicht staat van de AFM en DNB (of een andere Europese toezichthouder). Staat een partij nergens geregistreerd of lokt ze je via social media met gegarandeerde rendementen, dan ben je vrijwel zeker bij een oplichter beland. Wegblijven.",
              ],
            },
            {
              heading: "De kosten die je moet vergelijken",
              paragraphs: [
                "Uit de les over ETF's weet je: kosten stapelen. Bij een broker heb je grofweg vier soorten. Transactiekosten betaal je per aan- of verkoop, bij de ene aanbieder een paar euro of zelfs bijna nul, bij de andere flink meer. Servicekosten of bewaarloon zijn periodieke kosten, vaak een percentage van je belegd vermogen, en juist die tikken bij banken aan.",
                "Daarnaast zijn er valutakosten als je in dollars handelt (bij Amerikaanse ETF's of aandelen) en de fondskosten (TER) die in het product zelf zitten en dus bij elke broker gelijk zijn. Bij veel brokers kun je bepaalde ETF's bovendien onder voorwaarden extra goedkoop of zonder transactiekosten kopen; handig voor wie maandelijks inlegt.",
              ],
              example: {
                title: "Rekenvoorbeeld: € 200 per maand, twee kostenplaatjes",
                body: "Stel, je legt € 200 per maand in één wereldwijde ETF in. Bij aanbieder A betaal je € 1 transactiekosten per maand en geen servicekosten: € 12 per jaar. Bij aanbieder B betaal je 0,5% servicekosten over je belegde vermogen: bij € 10.000 opgebouwd is dat al € 50 per jaar, en het groeit mee met je vermogen. Over 20 jaar loopt zo'n verschil, met rente-op-rente erbij, in de duizenden euro's. Vergelijken loont dus echt.",
              },
            },
            {
              heading: "Hoe veilig is je geld bij een broker?",
              paragraphs: [
                "Goed om te weten: jouw beleggingen zijn geen eigendom van de broker. Ze worden via een apart bewaarbedrijf gescheiden bewaard van het vermogen van het bedrijf zelf (vermogensscheiding). Gaat de broker failliet, dan blijven jouw aandelen en ETF's in principe gewoon van jou en worden ze overgeboekt.",
                "Mocht er bij dat bewaren toch iets misgaan, dan is er in Nederland het beleggerscompensatiestelsel, dat onder voorwaarden tot € 20.000 per persoon dekt. Niet-belegd geld dat op een geldrekening bij een bank staat, valt doorgaans onder het depositogarantiestelsel tot € 100.000. Koersverlies wordt uiteraard nooit vergoed; dat is gewoon beleggingsrisico.",
              ],
            },
            {
              heading: "Belasting: box 3 in het kort",
              paragraphs: [
                "In Nederland betaal je als particuliere belegger geen belasting per transactie of over elke verkoopwinst apart. In plaats daarvan valt je vermogen (spaargeld plus beleggingen, minus schulden) in box 3. Boven een heffingsvrij vermogen van grofweg € 57.000 à € 60.000 per persoon (het dubbele voor fiscale partners) betaal je jaarlijks belasting op basis van een door de fiscus verondersteld rendement.",
                "Voor de meeste beginners betekent dit: onder die grens betaal je simpelweg niets over je beleggingen. De exacte bedragen en rekenmethode veranderen bovendien regelmatig; het box 3-stelsel is al jaren in beweging. Check daarom de actuele cijfers op de site van de Belastingdienst en zie dit vooral als kader, niet als belastingadvies.",
              ],
              bullets: [
                "Openen van een rekening: identificatie (iDIN of paspoort), koppelen tegenrekening, kennistoets over beleggen.",
                "De wettelijk verplichte kennistoets is geen examen maar een geschiktheidscheck; na deze cursus haal je hem op je sloffen.",
                "Begin desnoods met een klein bedrag om het platform te leren kennen voordat je serieus inlegt.",
              ],
            },
          ],
          keyTakeaways: [
            "Banken zijn vertrouwd maar vaak duurder; gespecialiseerde brokers goedkoper met meer keuze. Vergelijk actuele tarieven zelf.",
            "Let op vier kostensoorten: transactiekosten, service-/bewaarkosten, valutakosten en de TER van het fonds zelf.",
            "Door vermogensscheiding blijven je beleggingen bij een faillissement van de broker in principe van jou; het beleggerscompensatiestelsel is een extra vangnet.",
            "Box 3: onder het heffingsvrije vermogen betaal je in de praktijk niets; daarboven belasting over een verondersteld rendement. Check actuele bedragen.",
            "Controleer altijd of een aanbieder onder AFM/DNB-toezicht staat; gegarandeerd rendement is een oplichterssignaal.",
          ],
          quiz: [
            {
              question: "Welke kosten tellen allemaal mee als je aanbieders vergelijkt om te beleggen?",
              options: [
                "Alleen de transactiekosten per order, de rest is verwaarloosbaar",
                "Alleen de jaarlijkse servicekosten van de broker",
                "Transactiekosten, service-/bewaarkosten, eventuele valutakosten én de fondskosten (TER) samen",
                "Alleen de kosten bij verkoop; aankopen zijn overal gratis",
              ],
              correctIndex: 2,
              explanation:
                "Je totale kostenplaatje is de optelsom van al deze posten. Welke het zwaarst weegt, hangt af van je gedrag: wie maandelijks kleine bedragen inlegt, voelt vooral transactiekosten; wie een groot vermogen aanhoudt, vooral procentuele servicekosten.",
            },
            {
              question: "Je Nederlandse broker gaat failliet. Wat gebeurt er met jouw ETF's?",
              options: [
                "Die ben je kwijt: ze vallen in de faillissementsboedel van de broker",
                "Ze zijn gescheiden bewaard via een apart bewaarbedrijf en blijven in principe van jou; het beleggerscompensatiestelsel is een extra vangnet",
                "De Nederlandse staat vergoedt altijd de volledige waarde, onbeperkt",
                "De AFM verkoopt je beleggingen en maakt het geld naar je over",
              ],
              correctIndex: 1,
              explanation:
                "Vermogensscheiding is de kern: jouw stukken staan niet op de balans van de broker. Gaat er bij het bewaren tóch iets mis, dan dekt het beleggerscompensatiestelsel onder voorwaarden tot € 20.000. Koersverlies valt daar nooit onder; dat is beleggingsrisico.",
            },
            {
              question: "Hoe worden beleggingen van particulieren in Nederland belast?",
              options: [
                "Via box 3: over je vermogen boven het heffingsvrije bedrag, op basis van een door de fiscus verondersteld rendement",
                "Via een vermogenswinstbelasting: je rekent af over de werkelijke winst bij elke verkoop",
                "Via een vast percentage belasting op elke transactie",
                "Helemaal niet: beleggingswinsten zijn in Nederland belastingvrij",
              ],
              correctIndex: 0,
              explanation:
                "Nederland belast (nu nog) niet je werkelijke verkoopwinst maar je vermogen in box 3, boven een heffingsvrij bedrag van grofweg € 57.000 à € 60.000 per persoon. Onder die grens betaal je in de praktijk niets. Het stelsel wordt regelmatig aangepast, dus check de actuele regels.",
            },
            {
              question: "Wat is een eerlijke samenvatting van grootbanken versus gespecialiseerde brokers?",
              options: [
                "Banken zijn altijd de beste keuze, want beleggen via je eigen bank is veiliger",
                "Gespecialiseerde brokers zijn altijd beter, want de goedkoopste aanbieder wint per definitie",
                "Het maakt niet uit: de kosten verschillen tussen aanbieders nauwelijks",
                "Banken zijn vaak duurder maar vertrouwd en alles-in-één; brokers vaak goedkoper met meer keuze. Vergelijk kosten én gemak voor jouw situatie",
              ],
              correctIndex: 3,
              explanation:
                "Beide vallen onder hetzelfde toezicht en dezelfde beschermingsregels, dus 'veiliger' is de bank niet per se. De kostenverschillen zijn juist fors en stapelen door rente-op-rente. Maar gemak telt ook: de beste keuze is er een die je jarenlang volhoudt.",
            },
          ],
        },
        {
          slug: "strategieen",
          title: "Strategieën: kopen en vasthouden",
          durationMin: 9,
          xp: 50,
          intro:
            "De best gedocumenteerde beleggingsstrategie voor particulieren is verrassend onspectaculair: koop breed gespreid, leg periodiek in en blijf zitten. In deze les zie je waarom juist die saaiheid zo goed werkt.",
          sections: [
            {
              heading: "Buy & hold: tijd in de markt",
              paragraphs: [
                "Buy & hold betekent: je koopt een breed gespreide portefeuille en houdt die jarenlang vast, door bull- en bearmarkten heen. Je rendement komt uit de langetermijngroei van de wereldeconomie, niet uit slim in- en uitstappen. Bogles advies was letterlijk: 'stay the course', houd koers.",
                "Waarom werkt dit? Ten eerste ontloop je transactiekosten en fouten die actief handelen met zich meebrengt. Ten tweede blijf je belegd tijdens de beste beursdagen, en die blijken verrassend bepalend: onderzoek naar Amerikaanse beursdata laat zien dat wie over tientallen jaren slechts de tien à twintig beste dagen miste, een fors deel van het totale rendement misliep. En die beste dagen clusteren gemeen genoeg vlak rond de slechtste, precies wanneer uitgestapte beleggers aan de zijlijn staan.",
                "Buy & hold is simpel maar niet makkelijk. Het vraagt dat je in een crash van 30% niets doet, terwijl je hele omgeving in paniek is. Daarom leg je je strategie het best vooraf vast, op een rustig moment, en niet midden in de storm.",
              ],
            },
            {
              heading: "Periodiek inleggen (dollar cost averaging)",
              paragraphs: [
                "Dollar cost averaging (DCA), in het Nederlands gewoon periodiek inleggen, betekent dat je elke maand een vast bedrag belegt, ongeacht de koers. Staat de koers laag, dan koopt je vaste bedrag automatisch méér stukken; staat hij hoog, dan minder. Je gemiddelde aankoopprijs komt daardoor wiskundig onder de gemiddelde koers over die periode uit.",
                "Minstens zo belangrijk is het psychologische effect: je hoeft nooit meer te beslissen óf dit een goed moment is om te kopen. Die beslissing is geautomatiseerd, en daarmee is meteen de grootste bron van beleggersfouten uitgeschakeld: je eigen twijfel. Een dip voelt zelfs een beetje als uitverkoop, want je maandbedrag koopt meer stukken.",
                "Voor de meeste starters is DCA ook praktisch de realiteit: je belegt vanuit je maandelijkse inkomen. Zet er een automatische overboeking voor op, direct na je salaris, en het gebeurt vanzelf.",
              ],
              example: {
                title: "Rekenvoorbeeld: DCA in een beweeglijke markt",
                body: "Je legt vier maanden lang € 100 per maand in een ETF in. De koersen zijn achtereenvolgens € 10, € 8, € 12,50 en € 10. Je koopt dus 10, 12,5, 8 en 10 stukken: 40,5 stukken voor € 400. Je gemiddelde aankoopprijs is € 400 / 40,5 = € 9,88, terwijl de gemiddelde koers € 10,13 was. Zonder ook maar iets te voorspellen, kocht je automatisch relatief veel op het goedkoopste moment.",
              },
            },
            {
              heading: "Waarom de markt timen meestal mislukt",
              paragraphs: [
                "Market timing, uitstappen voor de daling en instappen voor de stijging, klinkt logisch en faalt in de praktijk hardnekkig. Het probleem: je moet twéé keer gelijk hebben. Ook wie de top redelijk raakt, durft er op de bodem zelden weer in, want op de bodem is het nieuws per definitie het zwartst. En elke maand wachten aan de zijlijn kost je de dagen waarop het herstel plaatsvindt.",
                "Malkiels random walk verklaart waarom: korte-termijnbewegingen worden gedreven door onverwacht nieuws, en dat is niet structureel te voorspellen, ook niet door professionals. Studies naar het werkelijke rendement van beleggers laten bovendien telkens zien dat de gemiddelde belegger slechter presteert dan zijn eigen fondsen, puur door in- en uitstapgedrag op verkeerde momenten.",
                "Het eerlijke verhaal is dus: 'time in the market beats timing the market' is geen tegeltjeswijsheid maar een statistisch patroon. Niet omdat de markt nooit daalt, maar omdat niemand betrouwbaar vooraf weet wannéér.",
              ],
              bullets: [
                "Timen vereist twee goede beslissingen: eruit én er weer in. De tweede is psychologisch het zwaarst.",
                "De beste beursdagen clusteren rond de slechtste; wie uitstapt, mist ze vrijwel gegarandeerd.",
                "Automatiseer je inleg, dan bestaat de timingvraag simpelweg niet meer.",
              ],
            },
            {
              heading: "Je strategie op één A4",
              paragraphs: [
                "Een goede beginnersstrategie past op een bierviltje: elke maand op dag X automatisch € Y naar een wereldwijd gespreide ETF, dividend herbeleggen, portefeuille hooguit een paar keer per jaar bekijken, en verkopen alleen volgens vooraf bepaalde regels (bijvoorbeeld als je doel of horizon verandert, niet omdat de beurs daalt).",
                "Schrijf dit echt even op. Onderzoek naar beleggersgedrag en de boeken van Housel laten hetzelfde zien: het verschil tussen plan en impuls bepaalt op lange termijn meer van je rendement dan de exacte ETF die je kiest. Beleggen blijft risicodragend, maar een vastgelegde strategie haalt de grootste risicofactor weg: jijzelf op een slechte dag.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "Bogles mantra 'stay the course' is de kern van deze les: koop de markt, blijf zitten en laat de tijd het werk doen.",
            },
          ],
          keyTakeaways: [
            "Buy & hold werkt doordat je kosten en gedragsfouten vermijdt én belegd bent op de beste beursdagen, die rond de slechtste clusteren.",
            "Met periodiek inleggen (DCA) koop je automatisch meer stukken als de koers laag staat; je gemiddelde aankoopprijs komt onder de gemiddelde koers uit.",
            "Market timing vereist twee keer gelijk hebben en mislukt daardoor structureel, ook bij professionals.",
            "Automatiseer je maandelijkse inleg: dan bestaat de timingvraag niet meer.",
            "Leg je strategie vooraf schriftelijk vast; je plan beschermt je tegen je impulsen.",
          ],
          quiz: [
            {
              question:
                "Je legt vier maanden € 100 in bij koersen van € 10, € 8, € 12,50 en € 10. Wat is je gemiddelde aankoopprijs per stuk?",
              options: ["€ 10,13", "€ 10,00", "€ 9,88", "€ 8,00"],
              correctIndex: 2,
              explanation:
                "Je koopt 10 + 12,5 + 8 + 10 = 40,5 stukken voor in totaal € 400: gemiddeld € 9,88 per stuk. Dat ligt onder de gemiddelde koers van € 10,13, omdat je vaste bedrag bij lage koersen automatisch meer stukken kocht.",
            },
            {
              question:
                "Waarom ligt je gemiddelde aankoopprijs bij periodiek inleggen onder de gemiddelde koers van die periode?",
              options: [
                "Omdat brokers korting geven op automatische orders",
                "Omdat een vast bedrag automatisch méér stukken koopt als de koers laag staat en minder als hij hoog staat",
                "Omdat koersen na elke aankoop gemiddeld stijgen",
                "Omdat je bij periodiek inleggen geen transactiekosten betaalt",
              ],
              correctIndex: 1,
              explanation:
                "Het is puur wiskunde: € 100 koopt 12,5 stukken bij een koers van € 8 en maar 8 stukken bij € 12,50. Goedkope momenten wegen daardoor automatisch zwaarder in je gemiddelde, zonder dat je iets hoeft te voorspellen.",
            },
            {
              question: "Waarom mislukt het timen van de markt in de praktijk zo vaak?",
              options: [
                "Omdat je twee keer gelijk moet hebben (uitstappen én weer instappen) en de beste beursdagen vaak vlak na de slechtste komen",
                "Omdat particuliere beleggers pas na de professionals mogen handelen",
                "Omdat koersinformatie voor particulieren altijd een dag vertraagd is",
                "Omdat je in Nederland bij elke verkoop direct belasting over de winst betaalt",
              ],
              correctIndex: 0,
              explanation:
                "Zelfs wie de top aardig raakt, durft er op de bodem zelden weer in, want dan is het nieuws het somberst. Wie aan de zijlijn staat, mist de hersteldagen die het gros van het rendement bepalen. En nee: in box 3 betaal je juist níet per verkooptransactie belasting; die afleider komt uit de vorige les.",
            },
            {
              question:
                "De beurs daalt 20% en je volgt een buy & hold-strategie met maandelijkse inleg. Wat doe je volgens die strategie?",
              options: [
                "Alles verkopen om verdere schade te voorkomen",
                "Stoppen met inleggen tot de bodem duidelijk zichtbaar is",
                "Vasthouden aan je plan en gewoon volgens schema blijven inleggen",
                "Overstappen naar de aandelen die het minst gedaald zijn",
              ],
              correctIndex: 2,
              explanation:
                "De kern van buy & hold is dat je gedrag niet verandert door koersbewegingen. Je maandbedrag koopt tijdens de dip zelfs meer stukken. 'De bodem afwachten' klinkt verstandig, maar een bodem is alleen achteraf zichtbaar; in de praktijk mis je zo het herstel.",
            },
          ],
        },
        {
          slug: "je-eerste-portefeuille",
          title: "Je eerste portefeuille en klassieke fouten",
          durationMin: 10,
          xp: 50,
          intro:
            "Tijd om alles samen te brengen: hoe ziet een logische eerste portefeuille eruit, en hoe omzeil je de fouten waar bijna elke beginner (en eerlijk is eerlijk: ook menig gevorderde) een keer in trapt?",
          sections: [
            {
              heading: "De bouwtekening: aandelen/obligatie-mix per profiel",
              paragraphs: [
                "De belangrijkste beslissing voor je portefeuille is niet wélke ETF, maar de verhouding tussen aandelen (groeimotor) en obligaties (schokdemper). Die verhouding bepaalt het overgrote deel van zowel je verwachte rendement als je schommelingen.",
                "Ter illustratie, nadrukkelijk als educatief voorbeeld en niet als persoonlijk advies, drie klassieke profielen. Defensief: zo'n 30% aandelen / 70% obligaties, voor een korte horizon of wie slecht tegen dalingen kan. Neutraal: rond 60/40, de klassieke middenweg. Offensief: 80 tot 100% aandelen, voor een lange horizon en sterke zenuwen. Hoe langer je horizon en hoe stabieler je situatie, hoe meer aandelen je kúnt dragen; wat je wílt dragen, weet alleen jij (denk terug aan les 3).",
                "De invulling kan verbluffend simpel: één wereldwijd gespreide aandelen-ETF plus eventueel één brede obligatie-ETF is voor veel beginners al een volwaardige portefeuille. Meer producten betekent niet meer spreiding als die producten grotendeels hetzelfde bevatten.",
              ],
              example: {
                title: "Voorbeeld: drie profielen in een daling van 30% op de aandelenmarkt",
                body: "Stel, aandelen dalen wereldwijd 30% en obligaties blijven ruwweg vlak. Een portefeuille van € 10.000 wordt dan bij een defensief profiel (30/70) zo'n € 9.100 waard (−9%), bij neutraal (60/40) ongeveer € 8.200 (−18%) en bij offensief (100% aandelen) € 7.000 (−30%). Zelfde crash, drie totaal verschillende ervaringen. Kies het profiel waarbij jij in dat scenario blijft zitten én blijft inleggen.",
              },
            },
            {
              heading: "Klassieke fout 1: paniekverkoop en hypejacht",
              paragraphs: [
                "De duurste fout in beleggen is verkopen tijdens een crash. Je zet dan een tijdelijk papieren verlies om in een definitief verlies, en het herstel, dat historisch vaak fel en vroeg kwam, vindt plaats zonder jou. Menig belegger die in maart 2020 'even veiligheid zocht', kocht maanden later duurder terug.",
                "De spiegelbeeldfout is kopen op de top van een hype: meme-aandelen, de crypto-manie van 2021, of welk 'aandeel dat iedereen heeft' er dit jaar ook langskomt. Als je buurman, je timeline én de kapper erover beginnen, zit het goede instapmoment er meestal al lang op. Rendement uit het verleden, zeker spectaculair recent rendement, zegt niets over wat komt.",
                "Housel noemt dit het verschil tussen rijk wórden en rijk blíjven: het eerste lukt soms met geluk, het tweede alleen met discipline. FOMO en paniek zijn dezelfde emotie, hebzucht en angst, die jouw plan probeert te overrulen. Je A4'tje uit de vorige les is het tegengif.",
              ],
            },
            {
              heading: "Klassieke fout 2: kosten en versnippering negeren",
              paragraphs: [
                "Je weet inmiddels wat 1% extra jaarlijkse kosten over 30 jaar doet (ruim € 22.000 op een inleg van € 10.000, weet je nog). Toch kiezen beginners verrassend vaak een duur actief fonds van de eigen bank, gewoon omdat het makkelijk is. Check dus altijd de TER en de brokerkosten voordat je koopt.",
                "Een subtielere fout is versnippering: tien verschillende ETF's, een handvol losse aandelen en drie thema-fondsen. Dat vóelt gespreid, maar overlapt vaak enorm (elke wereldwijde ETF bevat al Apple en Microsoft) en maakt je portefeuille onoverzichtelijk en soms duurder. Bij beleggen is minder vaak meer.",
                "En de sluipendste fout: te vaak kijken. Wie dagelijks zijn app opent, ziet bijna de helft van de dagen rode cijfers en voelt elke dip. Wie per kwartaal kijkt, ziet vooral de trend. Zet notificaties uit; je portefeuille heeft geen toezicht nodig, jouw rust wel.",
              ],
              bullets: [
                "Paniekverkoop: van papieren verlies naar echt verlies, en het herstel gebeurt zonder jou.",
                "Hypejacht: instappen ná de stijging; spectaculair recent rendement is geen voorspeller.",
                "Dure of dubbele producten: check TER, brokerkosten en overlap tussen fondsen.",
                "Dagelijks kijken: maximale stress, nul toegevoegde waarde.",
              ],
            },
            {
              heading: "Klein beginnen is de beste leerschool",
              paragraphs: [
                "Je hoeft niet te wachten tot je 'genoeg' hebt: bij de meeste Nederlandse brokers kun je al vanaf enkele tientjes per maand periodiek beleggen, soms zelfs in fracties van een ETF. Met € 25 of € 50 per maand bouw je geen fortuin in een jaar, maar wel iets waardevollers: ervaring, gewoonte en rust bij je eerste echte dip, terwijl de teller van rente-op-rente alvast loopt.",
                "Kleine bedragen maken fouten bovendien goedkoop. Je eerste paniekmoment meemaken met € 300 in de markt is een les; hetzelfde moment met € 30.000 is een drama. Begin klein, verhoog je inleg als je inkomen en zelfvertrouwen groeien, en blijf bij de principes uit deze cursus: breed spreiden, kosten laag, automatisch inleggen, koers houden.",
                "Daarmee is de cirkel rond. Je weet waarom je belegt, wat je koopt, waar je het koopt en hoe je jezelf tegen jezelf beschermt. Beleggen kent altijd risico's en garanties bestaan niet, maar je start nu met een fundament dat de meeste beginners missen. Veel succes, en onthoud Bogle: koop de hooiberg, en houd koers.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "Vrijwel elke klassieke fout uit deze les komt in Housels verhalen voorbij: paniek, hebzucht, en waarom rijk blijven een andere vaardigheid is dan rijk worden.",
            },
          ],
          keyTakeaways: [
            "Je aandelen/obligatie-verhouding bepaalt het grootste deel van je rendement én je schommelingen; kies haar op basis van horizon en risicotolerantie.",
            "Eén wereldwijde aandelen-ETF plus eventueel een obligatie-ETF is voor veel beginners al een volwaardige, goed gespreide portefeuille.",
            "De duurste fouten zijn gedragsfouten: paniekverkoop in een crash en instappen op de top van een hype.",
            "Let op kosten en overlap: meer producten is niet meer spreiding, en dagelijks kijken voegt alleen stress toe.",
            "Klein beginnen (vanaf enkele tientjes per maand) is een volwaardige start: je bouwt gewoonte en ervaring op terwijl rente-op-rente alvast loopt.",
          ],
          quiz: [
            {
              question:
                "Wie past, puur educatief geredeneerd, het beste bij een defensieve mix met relatief veel obligaties?",
              options: [
                "Een twintiger met een horizon van dertig jaar die schommelingen prima aankan",
                "Iemand die het geld over een paar jaar nodig heeft en wakker ligt van tussentijdse dalingen",
                "Iemand die zo snel mogelijk een maximaal rendement wil behalen",
                "Iemand zonder spaarbuffer die vandaag nog wil beginnen met beleggen",
              ],
              correctIndex: 1,
              explanation:
                "Korte horizon plus lage risicotolerantie wijzen beide richting een defensieve mix: obligaties dempen de uitslagen. De twintiger kán juist offensiever, maximaal rendement vraagt juist meer aandelen(risico), en wie geen buffer heeft, moet die éérst opbouwen voordat beleggen verstandig is.",
            },
            {
              question: "Wat is het werkelijke gevaar van verkopen tijdens een beurscrash?",
              options: [
                "Je zet een tijdelijk papieren verlies om in een definitief verlies en mist vaak het herstel, dat historisch vaak vroeg en fel kwam",
                "Verkopen in een daling kost extra transactiekosten, en dat is het grootste probleem",
                "Je mag daarna wettelijk zes maanden niet opnieuw instappen",
                "Er is geen gevaar: verkopen bij een daling beschermt je vermogen juist",
              ],
              correctIndex: 0,
              explanation:
                "Zolang je blijft zitten, is een daling een papieren verlies dat kan herstellen. Verkoop je, dan is het verlies echt, en omdat herstel vaak snel en onaangekondigd komt, stap je meestal duurder weer in. De transactiekosten zijn hierbij verwaarloosbaar vergeleken met het gemiste herstel.",
            },
            {
              question:
                "Een collega tipt een aandeel dat deze maand al 300% is gestegen: 'iedereen koopt het'. Wat is de verstandigste reactie?",
              options: [
                "Direct kopen, voordat het nog duurder wordt",
                "Een klein deel van je noodbuffer inzetten om het te proberen",
                "Herkennen dat dit FOMO is: spectaculair recent rendement voorspelt niets, en zo'n gok past niet in een gespreid langetermijnplan",
                "Wachten tot het aandeel nog een keer verdubbelt en dan pas instappen",
              ],
              correctIndex: 2,
              explanation:
                "Als 'iedereen' al gekocht heeft, zit de stijging grotendeels achter je en het risico voor je. Rendement uit het verleden zegt niets over de toekomst, en je noodbuffer beleg je nooit. De tip herkennen als hype-signaal en bij je plan blijven ís de vaardigheid die deze cursus je wilde leren.",
            },
            {
              question: "Waarom is beginnen met bijvoorbeeld € 50 per maand een volwaardige start?",
              options: [
                "Omdat kleine bedragen procentueel sneller verdubbelen dan grote",
                "Omdat je goedkoop ervaring en een beleggingsgewoonte opbouwt terwijl rente-op-rente alvast voor je loopt, en fouten je weinig kosten",
                "Omdat brokers pas boven € 1.000 belegd vermogen kosten rekenen",
                "Omdat kleine beleggers voorrang krijgen bij populaire ETF's",
              ],
              correctIndex: 1,
              explanation:
                "Het rendementspercentage is voor klein en groot geld gelijk, maar de leerwaarde niet: je eerste dip meemaken met een klein bedrag is een goedkope les. Ondertussen bouw je de gewoonte op die op lange termijn het verschil maakt, en begint je vermogen alvast samengesteld te groeien.",
            },
          ],
        },
      ],
    },
  ],
};

export default course;
