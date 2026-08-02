import type { Course } from "../types";

const course: Course = {
  slug: "beschermen-en-verdienen-met-opties",
  title: "Beschermen & Verdienen met Opties",
  subtitle: "Covered calls, protective puts en premie op aandelen die je al hebt",
  description:
    "De gereedschapskist voor de kalme belegger met een bestaande portefeuille: premie ontvangen op aandelen die je al bezit en bescherming kopen wanneer je die nodig hebt, met bij elke strategie de duidelijkste belofte én de duidelijkste kleine lettertjes. Elke rekensom laat zien wat je krijgt en wat je daarvoor opgeeft. Let op: we gaan ervan uit dat je weet wat een call, put, uitoefenprijs en assignment zijn — is dat niet zo, begin dan eerst met Opties Begrijpen.",
  level: "Gevorderd",
  accent: "petrol",
  icon: "shield",
  price: "€49",
  order: 6,
  learnPoints: [
    "Premie ontvangen met covered calls, en precies uitrekenen welk opwaarts potentieel je daarvoor verkoopt",
    "Uitoefenprijs en looptijd kiezen, posities doorrollen en kalm blijven wanneer je aandelen worden weggeroepen",
    "De cash-secured put doorzien: wat 'betaald worden om te wachten' werkelijk aan risico met zich meebrengt",
    "Bescherming kopen met protective puts en collars, inclusief de eerlijke rekensom van wat verzekeren per jaar kost",
    "Een geschreven optieplan opstellen: positiegrootte, vaste regels, en wanneer je deze strategieën juist níét gebruikt",
  ],
  modules: [
    {
      slug: "opfris-en-fundament",
      title: "Opfris & fundament",
      description:
        "Eén compacte les die het speelveld neerzet: de vier optieposities, waarom premie nooit gratis geld is, en de kernwaarheid waar deze hele cursus op rust — een covered call en een cash-secured put zijn economisch elkaars spiegelbeeld.",
      lessons: [
        {
          slug: "de-vier-posities-in-vijf-minuten",
          title: "De vier posities in vijf minuten",
          durationMin: 8,
          intro:
            "Voordat we ook maar één euro premie ontvangen, zetten we het speelveld strak neer. Deze les is deels herhaling — en dat is bewust: de rest van de cursus bouwt op drie inzichten die je paraat moet hebben, waarvan er één je kijk op 'premie verdienen' voorgoed verandert.",
          sections: [
            {
              heading: "Vier posities, één tabel",
              paragraphs: [
                "Elke optiestrategie, hoe indrukwekkend de naam ook klinkt, is opgebouwd uit maar vier bouwstenen: een call kopen, een call schrijven, een put kopen en een put schrijven. De koper betaalt premie en krijgt daarvoor een recht; de schrijver ontvangt die premie en neemt daarvoor een plicht op zich. Dat is de hele matrix.",
                "Concreet, met een optiecontract op 100 aandelen: wie een call met uitoefenprijs EUR 45 koopt, mag tot de afloopdatum 100 aandelen kopen voor EUR 45 per stuk. Wie diezelfde call schrijft, móét die aandelen leveren voor EUR 45 zodra de koper zijn recht gebruikt. Bij puts is het gespiegeld: de koper mag verkopen tegen de uitoefenprijs, de schrijver moet dan afnemen.",
                "Voelt dit als gesneden koek, mooi — dan ben je hier op de juiste plek. Moet je bij begrippen als uitoefenprijs, looptijd of assignment nog echt nadenken, doe jezelf dan een plezier en volg eerst Opties Begrijpen. Deze cursus gaat ervan uit dat de woordenschat zit, zodat we alle aandacht kunnen richten op het verstandig gebruiken ervan.",
              ],
              bullets: [
                "Call kopen: recht om te kopen tegen de uitoefenprijs; je betaalt premie",
                "Call schrijven: plicht om te leveren tegen de uitoefenprijs; je ontvangt premie",
                "Put kopen: recht om te verkopen tegen de uitoefenprijs; je betaalt premie",
                "Put schrijven: plicht om af te nemen tegen de uitoefenprijs; je ontvangt premie",
              ],
            },
            {
              heading: "Premie is nooit gratis geld",
              paragraphs: [
                "Op YouTube en beleggersfora wordt optiepremie graag gepresenteerd als 'extra inkomen' of zelfs 'passief inkomen' op je portefeuille. Wij gebruiken die woorden in deze cursus nadrukkelijk niet, want ze verhullen wat er echt gebeurt. Premie is een betaling die je ontvangt voor iets wat je weggeeft of op je neemt: bij het schrijven van een call verkoop je je opwaarts potentieel boven de uitoefenprijs, bij het schrijven van een put neem je het neerwaarts risico van een ander over.",
                "De optiemarkt is bovendien geen liefdadigheidsinstelling. Tegenover jouw ontvangen premie staat een koper die er goed over heeft nagedacht, en marktmakers die de prijzen scherp houden. Ziet een premie er opvallend vet uit, dan is dat vrijwel altijd omdat de markt veel beweging in het aandeel verwacht — de vergoeding is hoog omdat het risico hoog is, niet omdat er gratis geld op straat ligt.",
                "Daarom geldt in deze cursus één vaste afspraak: bij elk voorbeeld waarin je premie ontvangt, rekenen we óók uit wat het je kost of wat je opgeeft. Niet om je te ontmoedigen — deze strategieën kunnen prima passen bij een kalme belegger — maar omdat je een ruil alleen kunt beoordelen als je beide kanten ervan kent.",
              ],
            },
            {
              heading: "Gedekt of niets: de grens van deze cursus",
              paragraphs: [
                "Alles wat je hier leert is gedekt (covered). Een geschreven call is gedekt zodra je de 100 onderliggende aandelen bezit: word je aangewezen, dan lever je gewoon aandelen die je al had. Een geschreven put is gedekt (cash-secured) zodra je het volledige aankoopbedrag in kas hebt: word je aangewezen, dan koop je aandelen met geld dat er al voor klaarstond.",
                "Ongedekt (naked) schrijven is een fundamenteel ander spel. Wie een call schrijft zonder de aandelen te bezitten, heeft een theoretisch onbeperkt verlies boven zich hangen: het aandeel kan immers zonder plafond stijgen en jij moet leveren tegen de uitoefenprijs, wat de marktprijs ook is. Brokers eisen er niet voor niets forse marginverplichtingen voor. Ongedekt schrijven hoort thuis in de expertcursus over volatiliteit en spreads, mét de bijbehorende risicohoofdstukken — in deze cursus komt het uitsluitend voor als waarschuwingsbord.",
                "Die grens is geen betutteling maar gereedschapskeuze. Een gedekte positie kan tegenvallen — dat gaan we eerlijk doorrekenen — maar het maximale verlies is altijd vooraf bekend en gekoppeld aan aandelen of cash die je toch al had. Dat past bij het doel van deze cursus: je bestaande portefeuille verstandiger inzetten, niet er een hefboom onder schuiven.",
              ],
            },
            {
              heading: "De kernwaarheid: covered call en cash-secured put zijn spiegelbeelden",
              paragraphs: [
                "Nu het inzicht waar deze cursus op rust. Een covered call (aandelen bezitten plus een call schrijven) en een cash-secured put (cash reserveren plus een put schrijven) met dezelfde uitoefenprijs en looptijd zijn economisch vrijwel identiek. Niet 'een beetje vergelijkbaar' — bij elke eindkoers komt er, afgezien van dividend en rente op je kas, nagenoeg hetzelfde bedrag uit.",
                "Dat klinkt onwaarschijnlijk, want de één voelt als 'premie vangen op mijn aandelen' en de ander als 'betaald worden om te wachten op een koopje'. Maar reken het na (het voorbeeld hieronder doet dat) en je ziet: beide posities winnen beperkt als het aandeel stijgt, en dragen vrijwel het volledige verlies als het aandeel daalt. De verpakking verschilt, de inhoud niet.",
                "Waarom dit ertoe doet: zodra je dit spiegelbeeld ziet, kun je elke mooie verkooppitch voor de één toetsen aan je gevoel bij de ander. Wie huivert bij 'het volle neerwaartse risico van een aandeel dragen voor een beperkte premie' maar enthousiast wordt van 'betaald worden om te wachten', beoordeelt twee keer dezelfde positie — alleen de woorden verschillen. In module 2 gebruiken we dit inzicht voortdurend.",
              ],
              example: {
                title: "Zeewind NV: twee routes, zelfde uitkomst",
                body:
                  "Het aandeel Zeewind NV noteert EUR 42. Route A (covered call): je bezit 100 aandelen en schrijft een call met uitoefenprijs EUR 40 voor EUR 2,80 premie. Route B (cash-secured put): je reserveert EUR 4.000 en schrijft een put met uitoefenprijs EUR 40 voor EUR 0,80 premie. Eindigt Zeewind op de afloopdatum boven EUR 40, dan levert route A je aandelen op tegen EUR 40 plus EUR 2,80 premie = EUR 42,80 per aandeel, een resultaat van EUR 0,80 boven de startkoers; route B houdt simpelweg de EUR 0,80 premie. Eindigt Zeewind op EUR 36, dan staat route A op 100 x (EUR 36 - EUR 42) + EUR 280 = EUR -320 verlies; route B moet afnemen op EUR 40, dus 100 x (EUR 36 - EUR 40) + EUR 80 = EUR -320. Zelfde uitkomst, bij elke eindkoers.",
              },
            },
          ],
          keyTakeaways: [
            "Vier bouwstenen vormen elke optiestrategie: call of put, kopen of schrijven; kopers betalen premie voor rechten, schrijvers ontvangen premie voor plichten",
            "Premie is geen extra inkomen maar een betaling voor iets echts: opgegeven opwaarts potentieel of overgenomen neerwaarts risico",
            "In deze cursus is alles gedekt: calls gedekt door 100 aandelen, puts gedekt door gereserveerde cash; ongedekt schrijven is expertterrein",
            "Een covered call en een cash-secured put met dezelfde uitoefenprijs en looptijd zijn economisch elkaars spiegelbeeld",
          ],
          quiz: [
            {
              question:
                "Je schrijft een gedekte call op je 100 aandelen Zeewind NV en ontvangt EUR 90 premie. Wat is de eerlijkste omschrijving van die EUR 90?",
              options: [
                "Passief inkomen op aandelen die er toch al lagen",
                "Een risicoloze vergoeding, want je bezit de aandelen al",
                "De betaling die je ontvangt voor het verkopen van je koerswinst boven de uitoefenprijs tot de afloopdatum",
                "Een dividend dat de optiebeurs uitkeert aan geduldige beleggers",
              ],
              correctIndex: 2,
              explanation:
                "Premie is een betaling voor iets wat je opgeeft: stijgt Zeewind hard, dan moet jij leveren tegen de uitoefenprijs en gaat de winst daarboven naar de koper van de call. 'Passief inkomen' en 'risicoloos' verhullen precies die ruil, en met dividend heeft optiepremie niets te maken.",
            },
            {
              question:
                "Waarom behandelt deze cursus uitsluitend gedekte posities en verschijnt ongedekt schrijven alleen als waarschuwing?",
              options: [
                "Omdat een ongedekt geschreven call een theoretisch onbeperkt verlies kan opleveren en daarmee buiten het doel van deze cursus valt: een bestaande portefeuille verstandig inzetten",
                "Omdat ongedekt schrijven in Nederland wettelijk verboden is voor particulieren",
                "Omdat ongedekte posities altijd verlies opleveren en gedekte posities altijd winst",
                "Omdat brokers geen ongedekte opties aanbieden aan klanten zonder vergunning",
              ],
              correctIndex: 0,
              explanation:
                "Bij een ongedekte call kan het aandeel zonder plafond stijgen terwijl jij moet leveren tegen de uitoefenprijs: het verliesrisico is theoretisch onbeperkt. Verboden is het niet (brokers stellen wel eisen), en gedekt betekent zeker geen gegarandeerde winst — het betekent dat je maximale verlies vooraf bekend is en gedragen wordt door aandelen of cash die je al had.",
            },
            {
              question:
                "Zeewind NV noteert EUR 42. Positie A: 100 aandelen plus een geschreven call, uitoefenprijs EUR 40. Positie B: EUR 4.000 in kas plus een geschreven put, uitoefenprijs EUR 40, zelfde looptijd. Welke uitspraak klopt?",
              options: [
                "A is veiliger, want je bezit echte aandelen in plaats van een verplichting",
                "B is veiliger, want cash kan niet in waarde dalen",
                "A verdient bij een koersstijging veel meer dan B",
                "A en B leveren bij elke eindkoers (afgezien van dividend en rente) vrijwel hetzelfde resultaat op",
              ],
              correctIndex: 3,
              explanation:
                "Dit is de kernwaarheid van de les: covered call en cash-secured put met dezelfde uitoefenprijs en looptijd zijn economische spiegelbeelden. Beide winnen beperkt bij stijging (de premie plus eventueel het stuk tot de uitoefenprijs) en dragen vrijwel het volledige verlies bij daling. Geen van beide is 'veiliger' dan de ander.",
            },
            {
              question:
                "Een YouTube-video belooft 'elke maand cashflow' met het schrijven van puts op aandelen 'die je toch al wilde hebben'. Wat is, met deze les in de hand, de scherpste controlevraag?",
              options: [
                "Hoeveel premie levert het per maand op?",
                "Zou ik dezelfde positie ook aantrekkelijk vinden als hij werd omschreven als: het vrijwel volledige koersrisico van het aandeel dragen in ruil voor een beperkte, vooraf gemaximeerde premie?",
                "Welke broker heeft de laagste transactiekosten voor deze strategie?",
                "Hoe vaak per jaar kan ik de premie herbeleggen?",
              ],
              correctIndex: 1,
              explanation:
                "Omdat de geschreven put het spiegelbeeld van een covered call is, kun je elke pitch hertalen naar wat je werkelijk op je neemt: bijna het hele neerwaartse risico, tegen een gemaximeerde vergoeding. Vind je de positie in díé bewoording nog steeds passend, dan pas zijn premiehoogte en kosten relevante vervolgvragen.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "premie-ontvangen",
      title: "Premie ontvangen",
      description:
        "De schrijfkant van het vak: premie ontvangen op aandelen die je al bezit of op aandelen die je tegen een lagere prijs zou willen kopen. Met bij elke strategie dezelfde discipline: eerst uitrekenen wat je opgeeft, dan pas kijken wat je ontvangt.",
      lessons: [
        {
          slug: "de-covered-call",
          title: "De covered call",
          durationMin: 9,
          tool: "optie-gedekt-schrijven",
          intro:
            "De covered call is de bekendste manier om premie te ontvangen op aandelen die je al hebt, en tegelijk de meest verkeerd begrepen strategie: hij wordt verkocht als gratis geld terwijl het een ruil is. In deze les leer je de mechaniek, en vooral: precies uitrekenen wat je verkoopt op het moment dat je die premie ontvangt.",
          sections: [
            {
              heading: "De mechaniek: aandelen plus een geschreven call",
              paragraphs: [
                "Een covered call bestaat uit twee delen: je bezit 100 aandelen, en je schrijft daarop één calloptie met een uitoefenprijs boven de huidige koers. De premie wordt direct op je rekening bijgeschreven en is van jou, wat er verder ook gebeurt. Daartegenover staat jouw plicht: eindigt de koers op de afloopdatum boven de uitoefenprijs, dan worden je 100 aandelen weggeroepen tegen die uitoefenprijs.",
                "Het woord 'gedekt' slaat op die 100 aandelen: je hoeft bij assignment niets bij te kopen op de markt, je levert wat je al had. Daarom is dit een van de weinige optiestrategieën die veel brokers ook aan relatief onervaren optiebeleggers toestaan — het maximale verlies is nooit groter dan dat van simpelweg de aandelen bezitten, en zelfs iets kleiner dankzij de premie.",
                "Er zijn maar drie aflopen mogelijk. Eindigt de koers onder de uitoefenprijs, dan verloopt de call waardeloos: je houdt je aandelen én de premie, en kunt desgewenst een nieuwe call schrijven. Eindigt de koers erboven, dan lever je je aandelen tegen de uitoefenprijs en houd je de premie. En tussentijds kun je de call altijd terugkopen om de positie te sluiten — daarover meer in de volgende les.",
              ],
            },
            {
              heading: "De eerlijke ruil: je verkoopt je stijging",
              paragraphs: [
                "Wat verkoop je nu eigenlijk voor die premie? Niet niets, en ook geen abstract 'risico': je verkoopt heel concreet elke euro koerswinst boven de uitoefenprijs tot aan de afloopdatum. Blijft het aandeel hangen of daalt het, dan merk je daar niets van en lijkt de premie inderdaad op een cadeautje. Maar juist in de maanden waarin je aandeel het hardst stijgt — de maanden die op lange termijn een groot deel van het aandelenrendement leveren — sta jij je winst boven de uitoefenprijs af.",
                "Daarom hoort bij elke covered call vooraf één rekensom: wat is mijn maximale opbrengst, en wat laat ik liggen als het aandeel hard stijgt? Het rekenvoorbeeld hieronder doet dit voor Zeewind NV, en de simulator onder deze les laat je het voor elke combinatie van uitoefenprijs en premie zelf verkennen.",
                "Wie deze rekensom consequent maakt, ontdekt vanzelf de juiste gemoedstoestand voor covered calls: schrijf alleen calls op een uitoefenprijs waartegen je oprecht bereid bent te verkopen. Dan is weggeroepen worden geen ramp maar een uitgevoerd plan — je verkocht tegen een prijs die je vooraf prima vond, met een premie als toetje.",
              ],
              example: {
                title: "Zeewind NV op EUR 42: drie aflopen van dezelfde covered call",
                body:
                  "Je bezit 100 aandelen Zeewind NV (koers EUR 42) en schrijft een call met uitoefenprijs EUR 45, looptijd zes weken, premie EUR 0,90 per aandeel: EUR 90 op je rekening. Afloop 1 — Zeewind eindigt op EUR 42: de call verloopt waardeloos, je houdt aandelen en premie; resultaat EUR +90. Afloop 2 — Zeewind zakt naar EUR 38: je aandelen staan EUR 400 lager, de premie dempt dat tot EUR -310; de call beschermde je dus maar EUR 0,90 per aandeel. Afloop 3 — Zeewind stijgt naar EUR 50: je levert op EUR 45 en ontvangt EUR 4.500 + EUR 90 = EUR 4.590. Zonder call waren je aandelen EUR 5.000 waard geweest: de premie van EUR 90 kostte je in dit scenario EUR 500 aan gemiste stijging, per saldo EUR 410. Dát is de prijs van de ruil — en die reken je uit vóórdat je schrijft, niet erna.",
              },
            },
            {
              heading: "Wat de covered call níét is: bescherming",
              paragraphs: [
                "Een hardnekkig misverstand: 'de premie beschermt mijn aandelen tegen een daling'. Dat klopt alleen voor de eerste EUR 0,90 van de daling, om bij het voorbeeld te blijven. Daalt Zeewind van EUR 42 naar EUR 34, dan verlies je EUR 800 op je aandelen en vangt de premie daar EUR 90 van op. Je draagt als covered-call-schrijver vrijwel het volledige koersrisico van de aandeelhouder — logisch, wánt je bent aandeelhouder.",
                "Dit is ook precies wat het spiegelbeeld uit les 1 voorspelt: de covered call is economisch een cash-secured put, en van een geschreven put voelt iedereen meteen aan dat die het neerwaartse risico draagt. Wil je échte bescherming tegen een koersval, dan moet je die kopen in plaats van premie ontvangen — dat is module 3.",
                "De covered call is dus geen verzekering en geen inkomstenmachine, maar een ruilinstrument: je zet onzekere, potentieel grote koerswinst om in een zekere, kleine premie. In een zijwaartse of licht stijgende markt pakt die ruil gunstig uit; in een sterk stijgende markt sta je structureel winst af; in een dalende markt helpt hij nauwelijks. Alle drie de gezichten horen bij hetzelfde gereedschap.",
              ],
              bullets: [
                "De premie dempt een daling alleen met het premiebedrag zelf; daaronder verlies je gewoon mee als aandeelhouder",
                "Maximale opbrengst = (uitoefenprijs - aankoopkoers) + premie; meer kan het nooit worden",
                "Schrijf alleen op een uitoefenprijs waartegen je oprecht bereid bent je aandelen te verkopen",
                "Verwacht je een sterke stijging, dan is een covered call het verkeerde gereedschap: je verkoopt dan precies wat je verwacht te ontvangen",
              ],
            },
          ],
          bookRefs: [
            {
              title: "New Insights on Covered Call Writing",
              author: "Richard Lehman & Lawrence McMillan",
              year: 2003,
              note: "Hét nuchtere standaardwerk over gedekt schrijven: geen inkomstenromantiek, maar de covered call als bewuste ruil tussen premie en opwaarts potentieel — precies de bril van deze module.",
            },
          ],
          keyTakeaways: [
            "Covered call = 100 aandelen + een geschreven call; de premie is direct van jou, de plicht om te leveren boven de uitoefenprijs ook",
            "Je verkoopt concreet alle koerswinst boven de uitoefenprijs tot de afloopdatum; reken vóór het schrijven uit wat dat in een stijgingsscenario kost",
            "De premie is geen bescherming: onder de koers minus premie verlies je vrijwel net zo hard als elke aandeelhouder",
            "Weggeroepen worden is een uitgevoerd plan, geen ongeluk — mits je alleen schrijft op prijzen waartegen je wilt verkopen",
          ],
          quiz: [
            {
              question:
                "Je bezit 100 aandelen Zeewind NV (gekocht op EUR 42) en schrijft een call, uitoefenprijs EUR 45, premie EUR 0,90. Zeewind eindigt op EUR 50. Wat is je totale resultaat vergeleken met de aandelen simpelweg houden zonder call?",
              options: [
                "EUR 90 beter: je hebt immers premie ontvangen",
                "EUR 410 slechter: je opbrengst is EUR 4.590 in plaats van EUR 5.000",
                "Precies gelijk: de premie compenseert de gemiste stijging altijd",
                "EUR 500 beter: je verkocht EUR 3 boven je aankoopkoers plus premie",
              ],
              correctIndex: 1,
              explanation:
                "Met de call lever je op EUR 45: opbrengst EUR 4.500 plus EUR 90 premie = EUR 4.590. Zonder call waren de aandelen EUR 5.000 waard. Het verschil van EUR 410 is de prijs van de ruil in dit scenario: je stond EUR 500 stijging af en kreeg er EUR 90 premie voor terug. De covered call maakte nog steeds winst ten opzichte van je aankoop — maar minder dan niets doen.",
            },
            {
              question:
                "Diezelfde positie, maar Zeewind daalt van EUR 42 naar EUR 34. Wat is het eerlijkste oordeel over de 'bescherming' van de ontvangen premie van EUR 0,90?",
              options: [
                "De premie halveerde het verlies: covered calls zijn een prima verzekering",
                "De premie deed niets, want die geldt alleen bij stijgende koersen",
                "Het verlies is volledig verdwenen omdat de call waardeloos afliep",
                "De premie ving EUR 90 op van een verlies van EUR 800: een pleister, geen verzekering",
              ],
              correctIndex: 3,
              explanation:
                "Je aandelen daalden EUR 800 in waarde; de premie compenseert daarvan precies het premiebedrag, EUR 90. Het resultaat is EUR -710. Een covered call dempt een daling dus alleen met de ontvangen premie — wie echte bescherming wil, moet die kopen (module 3), niet premie ontvangen.",
            },
            {
              question: "Wanneer is een covered call het dúídelijkst het verkeerde gereedschap?",
              options: [
                "Wanneer je een sterke koersstijging van het aandeel verwacht",
                "Wanneer je verwacht dat het aandeel een tijd zijwaarts beweegt",
                "Wanneer je bereid bent je aandelen tegen de uitoefenprijs te verkopen",
                "Wanneer je de aandelen al langer dan een jaar in bezit hebt",
              ],
              correctIndex: 0,
              explanation:
                "Een covered call verkoopt je koerswinst boven de uitoefenprijs. Verwacht je juist een sterke stijging, dan verkoop je precies datgene waarvoor je het aandeel aanhoudt — voor een fractie van de verwachte waarde. Zijwaartse verwachtingen en verkoopbereidheid zijn juist de omstandigheden waarin de ruil kán passen; de bezitsduur is irrelevant.",
            },
            {
              question:
                "Wat is de maximale opbrengst van een covered call op aandelen gekocht op EUR 42, uitoefenprijs EUR 45, premie EUR 0,90 (per aandeel, per stuk gerekend)?",
              options: [
                "Onbeperkt, want je blijft aandeelhouder",
                "EUR 0,90: alleen de premie telt",
                "EUR 3,90: het stuk van EUR 42 naar EUR 45 plus de premie van EUR 0,90",
                "EUR 3,00: de afstand tot de uitoefenprijs; de premie valt er bij assignment tegen weg",
              ],
              correctIndex: 2,
              explanation:
                "Meer dan leveren op EUR 45 plus de ontvangen premie zit er niet in: (EUR 45 - EUR 42) + EUR 0,90 = EUR 3,90 per aandeel, oftewel EUR 390 op het contract. Dat plafond is de kern van de strategie — de premie houd je bij assignment gewoon, maar alles boven de uitoefenprijs is voor de koper van de call.",
            },
          ],
          xp: 50,
        },
        {
          slug: "strike-kiezen-en-doorrollen",
          title: "Strike kiezen en doorrollen",
          durationMin: 9,
          intro:
            "Dezelfde covered call bestaat in tientallen smaken: dichtbij of ver weg, kort of lang. In deze les leer je die keuze bewust maken, een lopende positie doorrollen, en — belangrijker dan menig belegger denkt — kalm blijven rond dividenddata, waar Amerikaanse-stijl opties je kunnen verrassen met vroege assignment.",
          sections: [
            {
              heading: "De uitoefenprijs: dezelfde ruil in drie smaken",
              paragraphs: [
                "Kijk in de optieketen van Zeewind NV (koers EUR 42, looptijd zes weken) en je ziet de ruil in alle gradaties tegelijk. Een call met uitoefenprijs EUR 43 levert bijvoorbeeld EUR 1,50 premie op, de EUR 45 doet EUR 0,90 en de EUR 47 nog EUR 0,40. Hoe dichter de uitoefenprijs bij de koers ligt, hoe meer premie je ontvangt — en hoe groter de kans dat je aandelen worden weggeroepen en hoe minder stijging je zelf houdt.",
                "Er is geen objectief beste keuze; er is wel een keuze die bij jouw plan past. Wil je vooral je aandelen houden en beschouw je de premie als bijvangst, dan kies je een uitoefenprijs ruim boven de koers en accepteer je de lagere premie. Sta je op het punt toch afscheid te nemen van de positie, dan mag de uitoefenprijs dichterbij liggen en de premie hoger zijn — assignment is dan immers gewoon je verkooporder met een fooi erop.",
                "Wantrouw vooral je eigen neiging om 'gewoon de hoogste premie' te pakken. Die hoogste premie hoort bij de uitoefenprijs met de grootste kans op weggeroepen worden en het kleinste behouden opwaarts potentieel. De premie is nooit het doel; hij is de vergoeding voor een ruil die je ook zonder die vergoeding moet kunnen uitleggen.",
              ],
              bullets: [
                "Uitoefenprijs dichtbij: veel premie, grote kans op assignment, weinig eigen stijging over",
                "Uitoefenprijs ver weg: weinig premie, kleine kans op assignment, veel eigen stijging over",
                "Kies de uitoefenprijs op basis van je verkoopbereidheid, niet op basis van de premiehoogte",
              ],
            },
            {
              heading: "Looptijd: kort en vaak, of lang en zelden",
              paragraphs: [
                "Ook de looptijd is een knop. Tijdswaarde verdampt niet gelijkmatig maar versnelt richting de afloopdatum; per dag looptijd ontvang je bij korte series daardoor doorgaans meer premie dan bij lange. Twaalf keer een maandserie schrijven levert over een jaar gerekend dan ook meestal meer totale premie op dan één keer een jaarserie — maar let op het woord 'meestal', en op wat er tegenover staat.",
                "Tegenover die hogere totale premie staan twaalf keer transactiekosten, twaalf beslismomenten en twaalf kansen om op een ongelukkig moment te moeten handelen. Kortere series vragen simpelweg meer onderhoud en meer discipline. Een langere serie is rustiger: je zet de positie op, weet een half jaar wat je plafond is, en kijkt er weinig naar om.",
                "Voor de meeste beleggers in de doelgroep van deze cursus — kalm, met een bestaande portefeuille, geen zin in een tweede baan — is een middenweg van vier tot acht weken een redelijk startpunt: genoeg tijdswaarde-verval om de moeite te lonen, weinig genoeg beslismomenten om het vol te houden. Maar ook hier geldt: het beste schema is het schema dat je daadwerkelijk consequent uitvoert.",
              ],
            },
            {
              heading: "Doorrollen: je afspraak verplaatsen, niet ontlopen",
              paragraphs: [
                "Doorrollen klinkt geavanceerd maar is twee gewone transacties in één: je koopt je geschreven call terug en schrijft tegelijk een nieuwe met een latere afloopdatum, en vaak een andere uitoefenprijs. Dat doe je bijvoorbeeld wanneer de koers richting je uitoefenprijs is gekropen en je je aandelen tóch liever nog even houdt.",
                "Wees eerlijk tegen jezelf over wat doorrollen is: een nieuwe transactie tegen de marktprijs van dát moment, geen manier om een verkeerde inschatting ongedaan te maken. De terugkoop van je oude call kost gewoon geld als die in waarde is gestegen. Wie eindeloos blijft doorrollen om assignment maar te ontlopen, betaalt telkens opnieuw voor het uitstellen van een afspraak die hij zelf heeft gemaakt — en heeft eigenlijk een positie die niet meer bij zijn verwachting past.",
                "Een praktische vuistregel: rol alleen door als de nieuwe positie ook op zichzelf een positie is die je vandaag zou openen. Is het antwoord nee, laat je dan gewoon aanwijzen (of koop de call terug en stop). Assignment accepteren is vaak goedkoper én eerlijker dan maandenlang tegen de markt in blijven rollen.",
              ],
              example: {
                title: "Zeewind kruipt omhoog: doorrollen doorgerekend",
                body:
                  "Je schreef de zesweekse call op Zeewind NV met uitoefenprijs EUR 45 voor EUR 0,90. Vlak voor de afloopdatum noteert Zeewind EUR 45,50; je call is EUR 1,20 waard (EUR 0,50 intrinsiek plus EUR 0,70 tijdswaarde). Je wilt je aandelen nog niet kwijt. Je koopt de call terug voor EUR 1,20 (EUR 120) en schrijft een nieuwe call met afloopdatum over twee maanden, uitoefenprijs EUR 47, premie EUR 1,10 (EUR 110). Netto kost deze rol EUR 10 plus transactiekosten. Wat je koopt voor die EUR 10: je plafond schuift van EUR 45 naar EUR 47 (EUR 200 extra ruimte) — en wat je ervoor teruggeeft: opnieuw twee maanden leverplicht. Beide kanten benoemen, dán pas beslissen.",
              },
            },
            {
              heading: "Weggeroepen worden en het dividendmoment",
              paragraphs: [
                "Eerst het belangrijkste: weggeroepen worden (assignment) is geen ongeluk en geen straf — het is de uitvoering van het contract dat jij hebt getekend, tegen een prijs die je vooraf zelf hebt gekozen. Je ontvangt de uitoefenprijs maal 100, je houdt de premie, klaar. Wie bij elke assignment baalt, heeft niet een assignmentprobleem maar een strikekeuzeprobleem: hij schrijft op prijzen waartegen hij eigenlijk niet wil verkopen.",
                "Wel verdient één moment je speciale aandacht: de dividenddatum. Aandelenopties op Europese en Amerikaanse beurzen zijn doorgaans van Amerikaanse stijl, wat betekent dat de koper zijn recht op élk moment vóór de afloopdatum mag uitoefenen — niet alleen aan het einde. Meestal doet hij dat niet, omdat vroeg uitoefenen tijdswaarde weggooit (les 7 rekent dat voor). Maar vlak vóór een ex-dividenddatum kan het voor de houder van een diep in-the-money call lonen om vroeg uit te oefenen en zo het dividend op te strijken.",
                "De vuistregel: is de resterende tijdswaarde van jouw geschreven call kleiner dan het aanstaande dividend, houd dan serieus rekening met assignment op de dag vóór de ex-dividenddatum. Stel dat Zeewind EUR 0,60 dividend uitkeert en jouw geschreven call met uitoefenprijs EUR 40 (koers inmiddels EUR 44) nog maar EUR 0,25 tijdswaarde bevat: dan is uitoefenen voor de callhouder aantrekkelijk en raak jij mogelijk je aandelen kwijt vóór het dividend, dat dan aan je neus voorbijgaat. Wil je dat niet, rol dan tijdig door of sluit de positie — maar raak niet in paniek: ook deze assignment is gewoon leveren tegen de prijs die je zelf koos.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "New Insights on Covered Call Writing",
              author: "Richard Lehman & Lawrence McMillan",
              year: 2003,
              note: "Behandelt strikekeuze, looptijd en doorrollen als één samenhangend beslisproces in plaats van losse trucjes, inclusief de valkuil van eindeloos rollen tegen de markt in.",
            },
          ],
          keyTakeaways: [
            "Uitoefenprijs dichterbij = meer premie, maar ook meer kans op assignment en minder eigen stijging: kies op verkoopbereidheid, niet op premiehoogte",
            "Korte series leveren per saldo meestal meer premie maar vragen meer onderhoud; kies het schema dat je consequent volhoudt",
            "Doorrollen is terugkopen plus opnieuw schrijven: een nieuwe transactie, geen gum voor een verkeerde inschatting",
            "Assignment is de uitvoering van jouw eigen contract; alleen rond ex-dividenddata verdient vroege assignment extra alertheid",
            "Vuistregel dividend: is de tijdswaarde van je geschreven call kleiner dan het komende dividend, verwacht dan mogelijk assignment vlak vóór de ex-datum",
          ],
          quiz: [
            {
              question:
                "Zeewind NV noteert EUR 42. De zesweekse calls: uitoefenprijs EUR 43 voor EUR 1,50, EUR 45 voor EUR 0,90, EUR 47 voor EUR 0,40. Je wilt je aandelen het liefst nog jaren houden. Welke redenering past daarbij?",
              options: [
                "Eerder de EUR 47 voor EUR 0,40: je accepteert minder premie in ruil voor een kleinere kans op assignment en meer behouden stijging",
                "De EUR 43 voor EUR 1,50: de hoogste premie is altijd de beste keuze",
                "De EUR 45, want de middelste uitoefenprijs is per definitie de veiligste",
                "Geen enkele call schrijven kan nooit de juiste keuze zijn als er premie te ontvangen valt",
              ],
              correctIndex: 0,
              explanation:
                "Wie zijn aandelen wil houden, kiest een uitoefenprijs ruim boven de koers: minder premie, maar ook minder kans om weggeroepen te worden. De hoogste premie hoort juist bij de grootste kans op assignment. En geen call schrijven is wel degelijk een geldige uitkomst — bijvoorbeeld als je een sterke stijging verwacht (les 2).",
            },
            {
              question: "Wat is doorrollen van een geschreven call precies?",
              options: [
                "De broker verlengt je optie automatisch tegen dezelfde premie",
                "Je oefent je eigen call uit en schrijft daarna een nieuwe",
                "Je koopt je geschreven call terug en schrijft tegelijk een nieuwe met een latere afloopdatum (en vaak een andere uitoefenprijs), tegen de marktprijzen van dat moment",
                "Je zet de call om in een put met dezelfde uitoefenprijs",
              ],
              correctIndex: 2,
              explanation:
                "Doorrollen is niets mysterieuzer dan twee transacties: terugkopen en opnieuw schrijven. Cruciaal is dat beide tegen de actuele marktprijs gaan — is je oude call in waarde gestegen, dan betaal je dat verlies gewoon bij de terugkoop. Automatische verlenging bestaat niet, en als schrijver héb je geen uitoefenrecht (dat heeft de koper).",
            },
            {
              question:
                "Je geschreven call op Zeewind (uitoefenprijs EUR 40, koers EUR 44) heeft nog EUR 0,25 tijdswaarde. Morgen is de ex-dividenddatum; het dividend bedraagt EUR 0,60. Wat is verstandig om te weten?",
              options: [
                "Niets bijzonders: uitoefenen kan alleen op de afloopdatum",
                "Er is een reële kans dat je vandaag wordt aangewezen, omdat vroeg uitoefenen de callhouder het dividend van EUR 0,60 oplevert tegen slechts EUR 0,25 opgegeven tijdswaarde",
                "Het dividend wordt automatisch aan de callhouder uitgekeerd, dus assignment is juist onwaarschijnlijk",
                "Je premie wordt met het dividendbedrag verhoogd als compensatie",
              ],
              correctIndex: 1,
              explanation:
                "Aandelenopties zijn doorgaans van Amerikaanse stijl: uitoefenen mag op elk moment. Normaal gooit dat tijdswaarde weg, maar hier wint de callhouder per saldo: hij geeft EUR 0,25 tijdswaarde op en vangt EUR 0,60 dividend. Precies in deze situatie — tijdswaarde kleiner dan het dividend, call in-the-money — is vroege assignment reëel. Dividend gaat naar wie de aandelen op de ex-datum bezit; er bestaat geen automatische compensatie voor schrijvers.",
            },
            {
              question:
                "Je hebt je call op Zeewind al drie keer doorgerold om assignment te vermijden en telkens bijbetaald. Welke conclusie past bij deze les?",
              options: [
                "Blijven rollen: uiteindelijk daalt de koers altijd een keer",
                "De broker had de eerste rol moeten tegenhouden",
                "Doorrollen was sowieso een fout: je mag een geschreven call nooit aanpassen",
                "Je positie past niet meer bij je verwachting: accepteer assignment (of sluit de positie), want telkens bijbetalen om een zelfgekozen afspraak te ontlopen is een plan zonder einde",
              ],
              correctIndex: 3,
              explanation:
                "De vuistregel uit de les: rol alleen door als je de nieuwe positie ook vandaag zelfstandig zou openen. Drie keer bijbetalen om maar niet te hoeven leveren betekent dat je vecht tegen je eigen contract. Assignment accepteren is dan meestal goedkoper en eerlijker. 'De koers daalt uiteindelijk wel' is hoop, geen plan — en doorrollen op zichzelf is prima gereedschap, mits met de juiste reden.",
            },
          ],
          xp: 50,
        },
        {
          slug: "de-cash-secured-put",
          title: "De cash-secured put",
          durationMin: 9,
          intro:
            "'Betaald worden om te wachten op een koopje' — zo wordt de geschreven put op internet verkocht, en het is de best klinkende halve waarheid in optieland. In deze les leer je de mechaniek, rekenen we de andere helft van de waarheid voor, en ontleden we de wheel-strategie die je ongetwijfeld op YouTube bent tegengekomen.",
          sections: [
            {
              heading: "De mechaniek: cash klaarzetten en een put schrijven",
              paragraphs: [
                "Een cash-secured put bestaat, net als de covered call, uit twee delen: je schrijft een put met een uitoefenprijs onder de huidige koers, en je zet het volledige aankoopbedrag klaar op je rekening. Zeewind NV noteert EUR 42; jij schrijft een put met uitoefenprijs EUR 40, looptijd zes weken, en ontvangt EUR 1,10 premie per aandeel: EUR 110. Daarnaast reserveer je EUR 4.000, want dat moet je betalen als je wordt aangewezen.",
                "Er zijn twee aflopen. Eindigt Zeewind boven EUR 40, dan verloopt de put waardeloos en houd je de EUR 110 — je hebt dan zes weken risico gedragen en bent daarvoor betaald. Eindigt Zeewind eronder, dan word je aangewezen: je betaalt EUR 4.000 voor 100 aandelen, wat de koers op dat moment ook is. Dankzij de premie is je effectieve aankoopprijs EUR 40 - EUR 1,10 = EUR 38,90 per aandeel.",
                "Het woord 'cash-secured' is geen versiering maar de kern van de veiligheid: het geld stáát er al, dus assignment kan je nooit in geldnood brengen. Schrijf je puts zonder die reserve, dan schrijf je met geleend risico — dat is de ongedekte variant, en die hoort net als de ongedekte call niet in deze cursus thuis.",
              ],
            },
            {
              heading: "De andere helft van de waarheid",
              paragraphs: [
                "Nu de ontmanteling van de slogan. 'Betaald worden om te wachten' suggereert dat je niets riskeert zolang je wacht. Het spiegelbeeld uit les 1 vertelt je direct dat dat niet klopt: een cash-secured put is economisch een covered call, en dus draag je vanaf de eerste dag vrijwel het volledige neerwaartse risico van de aandeelhouder — voor een vergoeding die gemaximeerd is op de premie.",
                "Kijk naar de asymmetrie. Jouw best denkbare uitkomst is EUR 110, hoe fantastisch Zeewind ook presteert. Jouw slechtst denkbare uitkomst: Zeewind stort door slecht nieuws in en jij moet EUR 4.000 betalen voor aandelen die veel minder waard zijn. En let op het venijnige detail: je wordt precies dán aangewezen wanneer er iets is gebeurd. De prijs die je vooraf 'een mooi koopje' vond, is op dat moment misschien helemaal geen koopje meer, gegeven het nieuwe nieuws.",
                "Ook de vergelijking met een gewone limietorder verdient eerlijkheid, want die wordt vaak gemaakt ('het is een limietorder die premie betaalt'). Twee verschillen: een limietorder kun je op elk moment kosteloos intrekken als je van gedachten verandert — een geschreven put niet, die koop je terug tegen de dan geldende marktprijs. En bij een snelle daling dwars door je uitoefenprijs heen koopt de limietorder rond je limiet, terwijl de put je op de afloopdatum de volle uitoefenprijs laat betalen, hoe diep de koers ook staat.",
              ],
              example: {
                title: "Zeewind zakt naar EUR 33: wachten bleek niet gratis",
                body:
                  "Je schreef de put met uitoefenprijs EUR 40 voor EUR 1,10 premie en reserveerde EUR 4.000. Zeewind krijgt slecht nieuws en eindigt op EUR 33. Je wordt aangewezen: je betaalt EUR 4.000 voor 100 aandelen die EUR 3.300 waard zijn. Inclusief de ontvangen premie sta je op EUR 3.300 + EUR 110 - EUR 4.000 = EUR -590. Ter vergelijking: wie op EUR 42 gewoon 100 aandelen had gekocht, staat op EUR -900. Je deed het dus EUR 310 minder slecht — maar 'betaald worden om te wachten' bleek het dragen van bijna het volledige aandeelhoudersrisico, met een winstplafond van EUR 110. Beide helften van de waarheid horen in je afweging.",
              },
            },
            {
              heading: "De wheel-strategie ontleed",
              paragraphs: [
                "Grote kans dat je op YouTube de wheel bent tegengekomen: schrijf cash-secured puts tot je wordt aangewezen, schrijf vervolgens covered calls op de verkregen aandelen tot ze worden weggeroepen, en begin opnieuw. Elke stap levert premie op, en in de video's oogt het als een perpetuum mobile van cashflow. De strategie is niet onzinnig — elk onderdeel is gedekt en komt uit deze cursus — maar de presentatie verdient een ontleding.",
                "Wat je na les 1 meteen ziet: de wheel is geen slimme afwisseling van twee strategieën, het is vrijwel continu dezélfde economische positie. Een cash-secured put en een covered call zijn spiegelbeelden; wie eeuwig van de één naar de ander draait, draagt dus permanent bijna het volledige koersrisico van het onderliggende aandeel, met telkens een gemaximeerde premie als vergoeding. De premiestroom is geen extra rendement bovenop het aandelenrendement — het ís je vergoeding voor het opgeven van de uitschieters omhoog, terwijl je de uitschieters omlaag houdt.",
                "En juist die uitschieters bepalen het beeld. In rustige, zijwaartse markten oogt de wheel briljant: premie na premie, zelden aangewezen. In een scherpe daling word je aangewezen op uitoefenprijzen die ver boven de nieuwe marktprijs liggen, en zit je vervolgens covered calls te schrijven op een gehalveerde positie — tegen uitoefenprijzen die, als je je verlies niet wilt vastklikken, nauwelijks premie opleveren. Wie de wheel overweegt, moet dat scenario vooraf doorrekenen en accepteren, niet erdoor verrast worden. Dan pas is het een strategie in plaats van een verhaal.",
              ],
            },
            {
              heading: "Wanneer een cash-secured put wél past",
              paragraphs: [
                "Na al deze ontmanteling het eerlijke slot: er is een situatie waarin de cash-secured put een keurig instrument is. Namelijk wanneer alle drie de volgende dingen tegelijk waar zijn: je wilt dit aandeel oprecht in je portefeuille hebben, je vindt de uitoefenprijs ook los van de premie een prijs waartegen je zou kopen, en het gereserveerde geld had toch al geen andere bestemming.",
                "In dat geval zijn beide aflopen acceptabel: word je aangewezen, dan koop je een aandeel dat je wilde tegen een effectieve prijs (uitoefenprijs minus premie) onder wat je bereid was te betalen; verloopt de put waardeloos, dan ben je betaald voor je bereidheid. Wat je nooit terugkrijgt is de derde afloop: stijgt het aandeel hard door, dan heb je het misgelopen en rest alleen de premie. Wie een aandeel écht graag wil hebben, koopt het vaak beter gewoon.",
                "Zo bezien is de cash-secured put geen inkomstenstrategie maar een instrument voor voorwaardelijke koopbereidheid — met als prijs dat je het opwaartse scenario verkoopt en het neerwaartse houdt. Dat is exact dezelfde ruil als bij de covered call, en dat hoort ook zo: het zijn spiegelbeelden.",
              ],
              bullets: [
                "Schrijf alleen puts op aandelen die je oprecht wilt bezitten tegen de uitoefenprijs",
                "Reserveer altijd het volledige aankoopbedrag; zonder die reserve is de positie niet gedekt",
                "Reken vooraf het crashscenario door: aangewezen worden gebeurt juist ná slecht nieuws",
                "Wil je een aandeel heel graag hebben, dan is gewoon kopen vaak de betere keuze: de put verkoopt je opwaartse scenario",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Options as a Strategic Investment",
              author: "Lawrence McMillan",
              note: "Het naslagwerk van de optiewereld: dik, systematisch en nuchter. Het hoofdstuk over het schrijven van puts behandelt precies de risicosymmetrie met gedekt schrijven die deze les centraal stelt.",
            },
          ],
          keyTakeaways: [
            "Cash-secured put = put schrijven met het volledige aankoopbedrag in reserve; effectieve aankoopprijs bij assignment = uitoefenprijs minus premie",
            "'Betaald worden om te wachten' verzwijgt de andere helft: je draagt vrijwel het volledige neerwaartse risico voor een op de premie gemaximeerde vergoeding",
            "Je wordt precies dán aangewezen wanneer er slecht nieuws is; de vooraf gekozen prijs kan dan geen koopje meer zijn",
            "De wheel is vrijwel continu dezelfde economische positie in twee verpakkingen; reken het crashscenario door vóór je eraan begint",
            "De put past alleen als je het aandeel oprecht wilt, de uitoefenprijs ook zonder premie redelijk vindt én de cash toch klaarstond",
          ],
          quiz: [
            {
              question:
                "Je schrijft een cash-secured put op Zeewind NV, uitoefenprijs EUR 40, premie EUR 1,10. Zeewind eindigt op EUR 33 en je wordt aangewezen. Wat is je resultaat op dat moment (op papier, per contract van 100 aandelen)?",
              options: [
                "EUR +110: de premie is van jou, dus je staat op winst",
                "EUR -700: het verschil tussen uitoefenprijs en koers",
                "EUR -900: hetzelfde als een aandeelhouder die op EUR 42 kocht",
                "EUR -590: je betaalde EUR 4.000 voor aandelen van EUR 3.300, gedempt door EUR 110 premie",
              ],
              correctIndex: 3,
              explanation:
                "Rekensom: EUR 3.300 (waarde aandelen) + EUR 110 (premie) - EUR 4.000 (betaald) = EUR -590. Dat is EUR 310 beter dan de aandeelhouder die op EUR 42 instapte (EUR -900), maar het laat zien dat 'wachten' allesbehalve risicoloos was: je droeg bijna het volledige koersrisico voor een winstplafond van EUR 110.",
            },
            {
              question:
                "Iemand noemt de cash-secured put 'gewoon een limietorder waar je premie voor krijgt'. Welk verschil maakt die vergelijking te rooskleurig?",
              options: [
                "Geen enkel: de vergelijking klopt volledig",
                "Een limietorder kun je kosteloos intrekken als de situatie verandert; van een geschreven put kom je alleen af door hem terug te kopen tegen de dan geldende marktprijs",
                "Een limietorder wordt altijd sneller uitgevoerd dan een optie",
                "Bij een limietorder betaal je meer transactiekosten dan bij een optie",
              ],
              correctIndex: 1,
              explanation:
                "Het kernverschil is de verplichting. Verandert het nieuws en wil je niet meer kopen, dan trek je een limietorder gratis in — maar je geschreven put is juist duurder geworden om terug te kopen, precies omdat het nieuws slecht is. De vergelijking verzwijgt dus dat je je bedenkrecht hebt verkocht; dát is een deel van waar de premie voor betaalt.",
            },
            {
              question: "Wat is, na les 1 en deze les, de scherpste karakterisering van de wheel-strategie?",
              options: [
                "Een slimme afwisseling van twee verschillende strategieën die elkaars risico opheffen",
                "Een gegarandeerde premiestroom zolang je maar consequent blijft draaien",
                "Vrijwel continu dezelfde economische positie (bijna het volle neerwaartse risico van het aandeel, gemaximeerde premie als vergoeding) in twee afwisselende verpakkingen",
                "Een strategie die alleen werkt met ongedekte opties en dus buiten deze cursus valt",
              ],
              correctIndex: 2,
              explanation:
                "Omdat cash-secured put en covered call spiegelbeelden zijn, wisselt de wheel niet van risicoprofiel maar van verpakking. De premiestroom is de vergoeding voor permanent gedragen koersrisico en opgegeven uitschieters omhoog — geen extra rendement en zeker geen garantie. De onderdelen zijn overigens netjes gedekt; het probleem zit in de presentatie, niet in de dekking.",
            },
            {
              question:
                "In welke situatie past een cash-secured put volgens deze les het best?",
              options: [
                "Je wilt aandeel X oprecht bezitten, vindt de uitoefenprijs ook zónder premie een redelijke koopprijs, en het aankoopbedrag stond toch al werkloos klaar",
                "Je wilt aandeel X absoluut niet bezitten, maar de premie is te mooi om te laten lopen",
                "Je verwacht dat aandeel X de komende weken hard gaat stijgen en wilt daarvan profiteren",
                "Je hebt het aankoopbedrag niet, maar je broker staat de positie op margin toe",
              ],
              correctIndex: 0,
              explanation:
                "De drievoudige toets uit de les: oprecht willen bezitten, de uitoefenprijs ook los van de premie redelijk vinden, en de cash beschikbaar hebben. Wie het aandeel niet wil, schrijft voor premie een risico dat hij niet wenst; wie een sterke stijging verwacht, verkoopt juist dat scenario voor een fooi; en zonder gereserveerde cash is de put simpelweg niet gedekt.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "bescherming-en-je-plan",
      title: "Bescherming kopen & jouw plan",
      description:
        "De andere kant van de premiestroom: nu ben jíj de koper van bescherming. Wat kost een verzekering op je portefeuille werkelijk, wanneer is die prijs het waard, en hoe giet je alles uit deze cursus in een geschreven plan — inclusief het eerlijke antwoord op de vraag wanneer je dit gereedschap beter in de kast laat.",
      lessons: [
        {
          slug: "de-protective-put",
          title: "De protective put",
          durationMin: 9,
          intro:
            "Tot nu toe ontving jij premie en droeg jij risico; in deze les draaien we de rollen om. Een protective put is een verzekeringspolis op je aandelen: echte bescherming, met een echte premie. We rekenen voor wat die bescherming per jaar kost — en waarom verzekeren structureel verliesgevend is en tóch soms verstandig.",
          sections: [
            {
              heading: "De mechaniek: een vloer onder je aandelen",
              paragraphs: [
                "Je bezit 100 aandelen Zeewind NV op EUR 42 en koopt één put met uitoefenprijs EUR 38, looptijd drie maanden, voor EUR 0,85 per aandeel: EUR 85. Vanaf dat moment heb jij het recht om je 100 aandelen tot de afloopdatum te verkopen voor EUR 38 per stuk, wat er ook gebeurt. Er ligt een vloer onder je positie.",
                "Reken de vloer precies uit. Stort Zeewind naar EUR 30, dan verkoop je via je put op EUR 38: je verlies is (EUR 42 - EUR 38) x 100 + EUR 85 premie = EUR 485. Zonder put was het EUR 1.200 geweest. Je maximale verlies is dus vooraf bekend: het stuk van de koers tot de uitoefenprijs, plus de betaalde premie. Geen enkele andere strategie in deze cursus geeft je die zekerheid — de covered call uit les 2 dempte een daling immers maar met het premiebedrag.",
                "De afstand tussen koers en uitoefenprijs werkt als het eigen risico van je verzekering. Een put op EUR 40 is duurder dan een op EUR 38, en die is weer duurder dan een op EUR 35: hoe minder eigen risico je accepteert, hoe hoger de premie. Dat is geen trucje van de optiemarkt maar dezelfde logica als bij je autoverzekering — en net als daar is een bewust gekozen eigen risico vaak de zinnigste knop om aan te draaien.",
              ],
            },
            {
              heading: "Wat verzekeren per jaar kost",
              paragraphs: [
                "Eén losse premie van EUR 0,85 klinkt overkomelijk. Maar bescherming die je permanent wilt, moet je telkens opnieuw kopen, en dan telt de rekening anders. Vier keer per jaar een driemaands put van EUR 0,85 kost EUR 3,40 per aandeel per jaar. Op een koers van EUR 42 is dat ruwweg 8% van je positiewaarde — elk jaar opnieuw, of de bescherming nu nodig blijkt of niet.",
                "Zet dat naast wat aandelen op lange termijn historisch gemiddeld opleverden — een cijfer dat per periode flink verschilt en geen enkele voorspellende belofte inhoudt — en je ziet het probleem: doorlopende bescherming op dit niveau kan het volledige verwachte rendement van de positie opeten, en meer. Wie zijn hele portefeuille permanent strak verzekert, heeft de facto een spaarrekening met omwegen gebouwd, maar dan met transactiekosten.",
                "Daarom werkt vrijwel niemand met permanente, krappe bescherming. Wie protective puts zinnig inzet, doet dat gericht: voor een specifieke periode (de komende zes maanden tot je het geld nodig hebt), voor een specifieke positie (die ene veel te groot gegroeide plukhoeveelheid aandelen), of met een ruim eigen risico dat alleen de ramp afdekt en niet elke rimpeling. Bescherming is maatwerk, geen abonnement.",
              ],
              example: {
                title: "De jaarrekening van doorlopende bescherming",
                body:
                  "Positie: 100 aandelen Zeewind NV op EUR 42 (waarde EUR 4.200). Doorlopende bescherming met driemaands puts op EUR 38 kost EUR 0,85 x 4 = EUR 3,40 per aandeel per jaar: EUR 340, oftewel zo'n 8% van de positiewaarde. Eindigt Zeewind het jaar onveranderd op EUR 42, dan is je resultaat EUR -340: de verzekering was je enige kostenpost. Stijgt Zeewind 10% naar EUR 46,20, dan houd je van die EUR 420 winst na verzekeringskosten EUR 80 over. Alleen in het rampjaar verdient de put zichzelf terug: bij een val naar EUR 30 beperkt hij je verlies van EUR 1.200 tot EUR 485 (in dat kwartaal). Verzekeren kost dus vrijwel elk jaar geld — dat is geen ontwerpfout, dat is wat verzekeren ís.",
              },
            },
            {
              heading: "Structureel verliesgevend, soms toch verstandig",
              paragraphs: [
                "Laten we het hardop zeggen: verzekeren is structureel verliesgevend. Dat moet ook wel — de verkopers van puts (mensen zoals jij in module 2) willen gemiddeld betaald worden voor het risico dat ze dragen, net als een brandverzekeraar. De meeste jaren brandt je huis niet af en is de premie 'weggegooid'. Toch zeggen we nooit dat een opstalverzekering dom is, en om precies dezelfde reden is een protective put niet per definitie dom: je betaalt niet voor gemiddeld rendement, je betaalt voor het uitsluiten van de uitkomst die je niet kunt dragen.",
                "Wanneer is die prijs het waard? Drie herkenbare situaties. Eén: je hebt het geld op een vaste datum nodig — een huis, een studie, je pensioen over anderhalf jaar — en een halvering onderweg zou dat plan breken. Twee: één positie is buitensporig groot geworden ten opzichte van je totale vermogen en je kunt of wilt nu niet verkopen. Drie: je weet van jezelf dat je bij een scherpe daling in paniek op de bodem verkoopt; een put die dat voorkomt, koopt gedrag — en slecht gedrag is voor veel beleggers de duurste kostenpost van allemaal.",
                "En dan het eerlijke alternatief dat in geen enkele optiecursus mag ontbreken: gewoon minder aandelen aanhouden. Wie de helft van een te grote positie verkoopt, heeft zijn risico ook gehalveerd — zonder jaarlijkse premie. Een protective put is pas de logische keuze als er een echte reden is om de aandelen wél te houden. Is die reden er niet, dan is verkopen de goedkoopste verzekering die bestaat.",
              ],
              bullets: [
                "Verzekeren kost gemiddeld geld; dat is de bedoeling, niet een ontwerpfout",
                "Zinnige inzet: een vaste einddatum, een te groot gegroeide positie, of het afkopen van je eigen paniekgedrag",
                "Ruimer eigen risico (lagere uitoefenprijs) drukt de premie fors: verzeker de ramp, niet de rimpeling",
                "Overweeg altijd het alternatief: positie verkleinen is gratis bescherming",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Intelligent Investor",
              author: "Benjamin Graham",
              year: 1949,
              note: "Graham gebruikt geen opties, maar zijn kerngedachte draagt deze les: veiligheid mag geld kosten, en de belegger die eerst naar het neerwaartse risico kijkt, denkt precies zoals een koper van bescherming hoort te denken.",
            },
          ],
          keyTakeaways: [
            "Een protective put legt een harde vloer onder je positie: maximaal verlies = (koers - uitoefenprijs) + premie, vooraf bekend",
            "Doorlopende bescherming kost op jaarbasis al snel enkele procenten van je positiewaarde en kan het verwachte rendement volledig opeten",
            "Verzekeren is structureel verliesgevend, net als een brandverzekering — je betaalt voor het uitsluiten van de ondraaglijke uitkomst, niet voor rendement",
            "Zet puts gericht in (vaste datum, te grote positie, paniekpreventie) en kies bewust een eigen risico via de uitoefenprijs",
            "Het goedkoopste alternatief is vaak de positie verkleinen: verkopen is gratis bescherming",
          ],
          quiz: [
            {
              question:
                "Je bezit 100 aandelen Zeewind NV (koers EUR 42) en koopt een put met uitoefenprijs EUR 38 voor EUR 0,85 per aandeel. Zeewind stort naar EUR 30. Wat is je maximale verlies op de totale positie?",
              options: [
                "EUR 1.200: de volledige koersdaling van EUR 42 naar EUR 30",
                "EUR 485: de daling tot de vloer van EUR 38 (EUR 400) plus de betaalde premie (EUR 85)",
                "EUR 85: alleen de premie, want de put vergoedt de hele daling",
                "EUR 400: de premie krijg je bij uitoefening terug",
              ],
              correctIndex: 1,
              explanation:
                "De put geeft je het recht te verkopen op EUR 38, dus de daling raakt je alleen van EUR 42 tot EUR 38: EUR 400. Daar komt de premie van EUR 85 bij, samen EUR 485 — fors minder dan de EUR 1.200 zonder bescherming. De premie ben je altijd kwijt; het stuk tussen koers en uitoefenprijs is je eigen risico.",
            },
            {
              question:
                "Doorlopende bescherming van diezelfde positie kost EUR 3,40 per aandeel per jaar (vier driemaands puts van EUR 0,85). Waarom noemt de les dat 'structureel verliesgevend' — en waarom is dat geen diskwalificatie?",
              options: [
                "Omdat de premie in de meeste jaren niet wordt terugverdiend, precies zoals bij een brandverzekering; je betaalt niet voor rendement maar voor het uitsluiten van een ondraaglijke uitkomst",
                "Omdat de optiemarkt puts bewust te duur prijst om particulieren te ontmoedigen",
                "Omdat puts alleen uitbetalen als je ze op de afloopdatum uitoefent, wat bijna niemand lukt",
                "Omdat de premie jaarlijks stijgt naarmate je de bescherming langer aanhoudt",
              ],
              correctIndex: 0,
              explanation:
                "Putverkopers willen, net als verzekeraars, gemiddeld betaald worden voor gedragen risico. De koper verliest dus gemiddeld geld — en dat is de bedoeling: je koopt zekerheid, geen rendement. Of dat verstandig is, hangt af van wat er op het spel staat (vaste einddatum, te grote positie, paniekpreventie), niet van de gemiddelde uitkomst. De overige opties beschrijven mechanismen die niet bestaan.",
            },
            {
              question:
                "Je wilt de premie van je protective put fors verlagen zonder de bescherming helemaal op te geven. Wat is de meest logische knop, in verzekeringstermen?",
              options: [
                "Een langere looptijd kiezen, want lange puts zijn altijd goedkoper",
                "De put pas kopen nádat de koers is gedaald",
                "Twee puts kopen in plaats van één",
                "Een lagere uitoefenprijs kiezen: een groter eigen risico nemen en alleen de echte ramp verzekeren",
              ],
              correctIndex: 3,
              explanation:
                "De afstand tussen koers en uitoefenprijs is je eigen risico: hoe groter, hoe lager de premie. Een put op EUR 35 in plaats van EUR 38 laat rimpelingen voor eigen rekening en dekt alleen de zware val — vaak precies wat je nodig hebt. Langere puts kosten in totaal juist meer premie, wachten op een daling is te laat (dan is de put duurder geworden), en twee puts verdubbelen simpelweg de kosten.",
            },
            {
              question:
                "Een kwart van je vermogen zit inmiddels in één aandeel en dat maakt je nerveus. Er is geen bijzondere reden om de aandelen aan te houden. Wat is, volgens deze les, de eerlijkste eerste overweging?",
              options: [
                "Direct een krappe put op de hele positie kopen: bescherming gaat boven alles",
                "Niets doen: nervositeit is geen beleggingsargument",
                "De positie (deels) verkleinen: verkopen is gratis bescherming, en een put is pas logisch als er een echte reden is om de aandelen te houden",
                "Een covered call schrijven, want de premie vergoedt je nervositeit",
              ],
              correctIndex: 2,
              explanation:
                "De protective put is een oplossing voor wie zijn aandelen om een goede reden níét kwijt wil. Ontbreekt die reden, dan bereikt verkopen hetzelfde risicodoel zonder jaarlijkse premie. Een covered call helpt hier juist niet: die dempt een daling maar met het premiebedrag (les 2), terwijl jouw zorg nu net het neerwaartse scenario is.",
            },
          ],
          xp: 50,
        },
        {
          slug: "de-collar",
          title: "De collar",
          durationMin: 9,
          tool: "optie-strategiebouwer",
          intro:
            "De protective put uit de vorige les had één nadeel: de jaarlijkse premierekening. De collar lost dat op door de bescherming te betalen met een geschreven call — en wordt daarom vaak 'gratis bescherming' genoemd. In deze les bouw je de constructie zelf, en reken je voor waarom gratis het verkeerde woord is.",
          sections: [
            {
              heading: "Twee poten, één kraag",
              paragraphs: [
                "Een collar combineert de twee gereedschappen die je al kent. Om je 100 aandelen Zeewind NV (koers EUR 42) leg je een kraag: je koopt een put met uitoefenprijs EUR 38 (de vloer, kost EUR 0,85) en schrijft tegelijk een call met uitoefenprijs EUR 46 (het plafond, levert EUR 0,80 op). Netto betaal je EUR 0,05 per aandeel: EUR 5 voor drie maanden begrenzing aan beide kanten.",
                "Het resultaat is een positie die zich alleen nog binnen de kraag beweegt. Onder EUR 38 vangt je put alles op; boven EUR 46 gaat de winst naar de koper van jouw call. Daartussenin ben je gewoon aandeelhouder, met dividendrechten en al. Je weet dus vooraf exact je slechtste én je beste uitkomst — een zeldzame luxe in beleggersland, en precies waarom de collar zo goed slaapt.",
                "In de strategiebouwer onder deze les kun je beide poten zelf combineren en zien hoe het uitbetalingsprofiel verandert als je aan de uitoefenprijzen schuift. Doe dat vooral: de kraag versmallen en verbreden is dé manier om te voelen wat je bij elke variant weggeeft en terugkrijgt.",
              ],
            },
            {
              heading: "De rekensom: bijna gratis is niet gratis",
              paragraphs: [
                "De verleiding van de collar zit in dat netto prijskaartje van EUR 5. Vergeleken met EUR 85 voor de kale protective put lijkt de bescherming bijna gratis, en met iets andere uitoefenprijzen lukt zelfs precies EUR 0 — de veelgeprezen zero-cost collar. Maar kijk naar wat er uit je portefeuille verdween: het hele stijgingsscenario boven EUR 46.",
                "Het rekenvoorbeeld hieronder zet de drie aflopen naast elkaar. Onthoud vooral het stijgingsscenario: bij een sprong naar EUR 52 kost de 'bijna gratis' collar je EUR 605 ten opzichte van niets doen. De putpremie betaal je dus wel degelijk — niet in euro's vandaag, maar in afgestane koerswinst morgen. Een zero-cost collar is geen gratis verzekering; het is een verzekering waarvan de premie wordt geïnd in precies de scenario's waarin je hem het minst graag betaalt.",
                "Dat is geen argument tégen de collar. Het is een argument om hem te zien als wat hij is: een bewuste versmalling van je uitkomsten aan twee kanten. Wie zijn plafond kent en accepteert, koopt daarmee een vloer die hij anders premie zou kosten. De vraag is nooit óf je betaalt, maar in welke munt: euro's nu, of stijging straks.",
              ],
              example: {
                title: "Zeewind in de kraag: drie aflopen doorgerekend",
                body:
                  "Positie: 100 aandelen Zeewind NV op EUR 42, put gekocht op EUR 38 (EUR 0,85), call geschreven op EUR 46 (EUR 0,80): netto EUR 5 kosten. Afloop 1 — Zeewind stort naar EUR 33: de put vangt je op vanaf EUR 38, dus resultaat (EUR 38 - EUR 42) x 100 - EUR 5 = EUR -405, waar de onbeschermde aandeelhouder EUR -900 staat. Afloop 2 — Zeewind blijft EUR 42: beide opties verlopen waardeloos, resultaat EUR -5. Afloop 3 — Zeewind springt naar EUR 52: jouw aandelen worden weggeroepen op EUR 46, resultaat (EUR 46 - EUR 42) x 100 - EUR 5 = EUR +395, waar de onbeschermde aandeelhouder EUR +1.000 pakt. De bescherming van afloop 1 werd betaald in afloop 3: EUR 605 afgestane winst.",
              },
            },
            {
              heading: "De kraag afstellen: waar leg je vloer en plafond?",
              paragraphs: [
                "De twee uitoefenprijzen zijn jouw knoppen, en ze werken tegen elkaar in. Wil je de vloer dichterbij (minder eigen risico), dan wordt de put duurder en moet het plafond dichterbij om dat te financieren — je kraag versmalt aan twee kanten. Wil je juist meer stijgingsruimte, dan moet het plafond omhoog, levert de call minder op en betaal je netto bij voor je put. Elke collar is een onderhandeling tussen die twee.",
                "Een handige toets bij het afstellen: kijk niet alleen naar het netto premiesaldo, maar spreek beide grenzen hardop uit als afspraken met jezelf. 'Ik accepteer dat ik boven EUR 46 niets meer verdien' en 'ik accepteer elk verlies tot EUR 38 plus kosten'. Voelt één van beide zinnen als een probleem, dan is niet de collar verkeerd, maar deze afstelling.",
                "Wees ten slotte alert op de fiscale en praktische randjes van weggeroepen worden die je uit les 3 kent: de geschreven call in je collar is een gewone geschreven call, inclusief de kans op vroege assignment rond ex-dividenddata. Een collar zet je zorgen dus niet op slot; hij begrenst ze — onderhoud blijft nodig.",
              ],
              bullets: [
                "Vloer dichterbij = duurdere put = plafond moet dichterbij: de kraag versmalt aan beide kanten",
                "Spreek beide grenzen hardop uit als afspraken met jezelf; wringt er één, verstel dan de kraag",
                "Zero-cost betekent: premie EUR 0, betaald met afgestane stijging — niet: verzekering zonder prijs",
                "De geschreven call in de collar kent dezelfde assignmentregels als in les 3, ook rond dividenddata",
              ],
            },
            {
              heading: "Wanneer een collar past",
              paragraphs: [
                "De collar schittert in overgangsfases. Denk aan de belegger die over twee jaar zijn portefeuille nodig heeft voor een huis en de rit ernaartoe wil begrenzen zonder nu alles te verkopen. Of aan de positie die na jaren groei te groot is geworden en die je gefaseerd wilt afbouwen: een kraag eromheen maakt het tempo van afbouwen minder afhankelijk van de waan van de dag.",
                "De collar past juist slécht bij je langetermijnkern. Wie dertig jaar belegt voor zijn pensioen en permanent collars aanhoudt, geeft decennialang systematisch de beste beursjaren weg — en juist die uitschieters dragen een onevenredig deel van het langetermijnrendement. Begrenzing is waardevol als de einddatum in zicht komt of een specifieke positie knelt, niet als levensstijl.",
                "En ook hier geldt de eerlijke slotvraag uit les 5: is er eigenlijk een goede reden om deze aandelen te houden? Zo nee, dan is (deels) verkopen simpeler, goedkoper en definitiever dan welke kraag ook. De collar is gereedschap voor wie moet of wil blijven zitten — niet een doel op zich.",
              ],
            },
          ],
          keyTakeaways: [
            "Collar = aandelen + gekochte put (vloer) + geschreven call (plafond); slechtste en beste uitkomst staan vooraf vast",
            "De lage of nul netto premie is geen gratis bescherming: je betaalt met alle koerswinst boven het plafond",
            "Vloer en plafond werken tegen elkaar in; stel de kraag af door beide grenzen hardop als afspraak uit te spreken",
            "Sterk in overgangsfases (einddatum in zicht, te grote positie afbouwen), zwak als permanente levensstijl voor je langetermijnkern",
            "Ook in een collar blijft de geschreven call een gewone call, inclusief assignmentrisico rond dividenddata",
          ],
          quiz: [
            {
              question:
                "Je legt een collar om 100 aandelen Zeewind NV (koers EUR 42): put gekocht op EUR 38 voor EUR 0,85, call geschreven op EUR 46 voor EUR 0,80. Zeewind springt naar EUR 52. Wat is je resultaat, en wat 'kostte' de collar je in dit scenario?",
              options: [
                "EUR +1.000, want de collar beschermt alleen aan de onderkant",
                "EUR -5, want boven het plafond vervalt je hele winst",
                "EUR +395; vergeleken met de EUR +1.000 van de onbeschermde aandeelhouder kostte de 'bijna gratis' collar hier EUR 605",
                "EUR +605, het verschil tussen plafond en vloer",
              ],
              correctIndex: 2,
              explanation:
                "Je wordt weggeroepen op EUR 46: (EUR 46 - EUR 42) x 100 = EUR 400, minus EUR 5 netto premie = EUR +395. Zonder collar was het EUR +1.000 geweest. Dat verschil van EUR 605 is de werkelijke premie van je verzekering, geïnd in afgestane stijging — precies waarom 'bijna gratis' het verkeerde woord is.",
            },
            {
              question: "Wat is de eerlijkste omschrijving van een zero-cost collar?",
              options: [
                "Een verzekering die de optiemarkt gratis weggeeft omdat de twee poten elkaar opheffen",
                "Een constructie zonder enig risico: vloer en plafond maken verlies onmogelijk",
                "Een boekhoudkundige truc die brokers gebruiken om transactiekosten te verbergen",
                "Een verzekering waarvan de premie niet in euro's wordt betaald maar in afgestane koerswinst boven het plafond",
              ],
              correctIndex: 3,
              explanation:
                "Bij een zero-cost collar financiert de geschreven call exact de gekochte put: netto EUR 0. Maar de betaling is er wel degelijk — in elke euro stijging boven de calluitoefenprijs die naar de koper van je call gaat. Verlies blijft bovendien mogelijk (tot aan de vloer plus kosten); alleen de ramp eronder is afgedekt.",
            },
            {
              question:
                "Je wilt in je collar de vloer opschuiven van EUR 38 naar EUR 40, maar netto niets bijbetalen. Wat betekent dat vrijwel altijd voor het plafond?",
              options: [
                "Het plafond moet omlaag: de duurdere put moet gefinancierd worden met een call die dichter bij de koers ligt en dus meer opbrengt",
                "Het plafond kan omhoog, want vloer en plafond staan los van elkaar",
                "Het plafond blijft gelijk; alleen de looptijd verandert",
                "Er is geen effect: de broker verrekent het verschil met je dividend",
              ],
              correctIndex: 0,
              explanation:
                "Een hogere vloer betekent een duurdere put. Wil je netto op nul blijven, dan moet de geschreven call meer premie opleveren, en dat doet een call alleen als zijn uitoefenprijs dichter bij de koers ligt. De kraag versmalt dus aan twee kanten tegelijk: meer bescherming onder, minder ruimte boven. Dividend staat hier volledig buiten.",
            },
            {
              question: "Voor welke belegger is een collar volgens deze les het minst geschikt?",
              options: [
                "Iemand die over twee jaar zijn portefeuille nodig heeft voor de aankoop van een huis",
                "Een dertigjarige die voor de lange termijn belegt en van plan is de collar permanent aan te houden op zijn kernportefeuille",
                "Iemand die een te groot gegroeide positie gefaseerd wil afbouwen",
                "Iemand die zijn maximale verlies én maximale winst vooraf wil kennen tijdens een onrustige periode",
              ],
              correctIndex: 1,
              explanation:
                "Permanente collars op een langetermijnkern geven decennialang systematisch de sterkste beursjaren weg, terwijl juist die uitschieters een groot deel van het langetermijnrendement dragen. De collar is gereedschap voor overgangsfases en knellende posities — de andere drie profielen — niet een levensstijl.",
            },
          ],
          xp: 50,
        },
        {
          slug: "assignment-in-de-praktijk",
          title: "Assignment in de praktijk",
          durationMin: 8,
          intro:
            "Over assignment bestaan meer zenuwen dan over welk optieonderwerp ook, en dat is zonde: het is een administratieve gebeurtenis die je zelf hebt afgesproken. In deze les lopen we stap voor stap door een echte aanwijzing heen — wat je op je afschrift ziet, wat er met je geld en aandelen gebeurt, en waarom zelf vroeg uitoefenen bijna altijd geld weggooit.",
          sections: [
            {
              heading: "De uitgangspositie: een geschreven put op Zeewind",
              paragraphs: [
                "We pakken de positie uit les 4 erbij. Zeewind NV noteerde EUR 42 toen je een put schreef met uitoefenprijs EUR 40, looptijd zes weken. Op dag één zag je twee dingen op je rekening gebeuren: er werd EUR 110 premie bijgeschreven (EUR 1,10 x 100), en je broker blokkeerde EUR 4.000 aan bestedingsruimte als dekking voor je leveringsplicht. Dat geblokkeerde bedrag is niet weg — het is gereserveerd, precies zoals 'cash-secured' belooft.",
                "In de weken erna beweegt je positie mee met Zeewind. Daalt de koers, dan wordt de put die je schreef meer waard en toont je broker een papieren verlies op de optiepositie; stijgt de koers, dan verdampt de waarde van de put in jouw voordeel. Belangrijk om te onthouden: dat dagelijkse cijfer is de terugkoopprijs van je verplichting, geen afrekening. Afgerekend wordt er pas bij sluiten, aflopen of assignment.",
                "Zeewind krijgt tegenzittend nieuws en zakt gestaag. Op de expiratievrijdag sluit het aandeel op EUR 37 — ruim onder jouw uitoefenprijs van EUR 40. Wat er nu gebeurt, gaat grotendeels automatisch: opties die op de afloopdatum in-the-money zijn, worden bij vrijwel alle brokers standaard uitgeoefend namens de houder. Die houder hoeft niets te doen, en jij kunt niets meer doen. Het contract voert zichzelf uit.",
              ],
            },
            {
              heading: "Het afschrift: drie regels, geen drama",
              paragraphs: [
                "In het expiratieweekend verwerkt je broker de aanwijzing, en maandagochtend vertelt je afschrift het hele verhaal in drie regels. De eerder ontvangen premie stond er al: plus EUR 110. Nieuw zijn de afboeking van EUR 4.000 aan cash en de bijschrijving van 100 aandelen Zeewind NV. De blokkade op je bestedingsruimte is tegelijk opgeheven — die was er precies voor dit moment.",
                "Trek de balans op. Je betaalde EUR 4.000 voor aandelen die op de slotkoers van EUR 37 samen EUR 3.700 waard zijn, en je ontving eerder EUR 110 premie: per saldo sta je EUR 190 achter. Je effectieve kostprijs per aandeel is EUR 40 - EUR 1,10 = EUR 38,90, en dat is vanaf nu je referentiepunt — niet de EUR 42 van toen je de put schreef, en ook niet de EUR 37 van vandaag.",
                "Merk op wat er allemaal níét gebeurde: geen margin call, geen boete, geen telefoontje van de broker, geen gedwongen verkoop. Assignment van een gedekte positie is administratie. De emotie die veel beginners eromheen voelen, hoort niet bij de gebeurtenis maar bij de koersdaling — en die had je als gewone aandeelhouder nét zo goed meegemaakt, alleen dan vanaf EUR 42 in plaats van EUR 38,90.",
              ],
              example: {
                title: "Het afschrift na de aanwijzing, op een rij",
                body:
                  "Week 1: 'Verkoop opening 1 put ZWD EUR 40, premie ontvangen EUR 110' en 'reservering dekking EUR 4.000'. Expiratieweekend: 'Assignment 1 put ZWD EUR 40: koop 100 aandelen Zeewind NV à EUR 40, af EUR 4.000' en 'reservering opgeheven'. Stand maandag: 100 aandelen à koers EUR 37 = EUR 3.700, plus de EUR 110 premie die allang binnen was, minus EUR 4.000 betaald: papieren resultaat EUR -190. Effectieve kostprijs: EUR 38,90 per aandeel. Controle: (EUR 38,90 - EUR 37,00) x 100 = EUR 190. Het klopt — en niets hieraan vroeg om paniek.",
              },
            },
            {
              heading: "Zelf vroeg uitoefenen gooit bijna altijd tijdswaarde weg",
              paragraphs: [
                "Draai de rollen nu eens om: je bent koper van een put (bijvoorbeeld de protective put uit les 5) en je bescherming is 'aangeslagen'. Zeewind staat op EUR 37, jouw put heeft uitoefenprijs EUR 40 en nog drie weken looptijd. De verleiding is groot om direct uit te oefenen en je aandelen op EUR 40 te verkopen. Bijna altijd is dat de slechtste van de twee routes.",
                "Reken mee. Op de beurs noteert jouw put EUR 3,40: EUR 3,00 intrinsieke waarde plus EUR 0,40 tijdswaarde. Route één, uitoefenen: je verkoopt je aandelen EUR 3,00 boven de marktprijs — voordeel EUR 300. Route twee, de put verkopen: je ontvangt EUR 340, en wil je ook van je aandelen af, dan verkoop je die los tegen de marktprijs. Verschil: EUR 40. Dat is de tijdswaarde die je bij uitoefenen zomaar aan de markt cadeau doet.",
                "Vandaar de vuistregel: een optie met resterende tijdswaarde verkoop je, die oefen je niet uit. De zeldzame uitzonderingen ken je inmiddels: de callhouder die vlak voor een ex-dividenddatum een dividend opstrijkt dat groter is dan de resterende tijdswaarde (les 3), en enkele randgevallen bij diep in-the-money opties waar de tijdswaarde tot vrijwel nul is verdampt. Twijfel je, vergelijk dan gewoon beide routes in euro's — de rekensom van hierboven duurt dertig seconden.",
              ],
            },
            {
              heading: "Na de aanwijzing: gewoon je plan",
              paragraphs: [
                "Je hebt nu 100 aandelen Zeewind op een kostprijs van EUR 38,90, en de vraag is wat je ermee doet. Het antwoord stond er als het goed is al vóórdat je de put schreef: je wilde dit aandeel bezitten tegen deze prijs (de drievoudige toets uit les 4). Dan is er nu dus niets aan de hand — je voert je plan uit, alleen via een omweg die EUR 110 premie opleverde.",
                "Wat je níét doet, is de aanwijzing 'goedmaken'. Meteen een agressieve call schrijven om het papieren verlies terug te verdienen, of de aandelen in paniek dumpen omdat 'het toch al misging' — dat zijn beslissingen op basis van spijt, niet op basis van de situatie van vandaag. Beoordeel de nieuwe positie zoals je elke positie beoordeelt: zou ik deze aandelen tegen deze koers vandaag ook willen hebben? Zo ja, houden (en eventueel rustig een covered call schrijven tegen een prijs waar je écht afscheid wilt nemen). Zo nee, verkopen — zonder wrok.",
                "Daarmee is de cirkel van deze cursus bijna rond: geschreven put, assignment, aandelenbezit, eventueel covered call — elk onderdeel is gereedschap uit dezelfde kist, en assignment is het scharnier ertussen. Geen ramp, geen buitenkans: een scharnier. In de slotles bekijken we wanneer die hele kist het gebruiken waard is, en wanneer je hem beter dicht laat.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Options as a Strategic Investment",
              author: "Lawrence McMillan",
              note: "De hoofdstukken over exercise en assignment beschrijven de afwikkelingsmechaniek tot in detail — nuttig naslagwerk voor wie precies wil weten wat de broker wanneer doet.",
            },
          ],
          keyTakeaways: [
            "Assignment van een gedekte positie is administratie: cash eraf, aandelen erbij, reservering opgeheven — geen margin call, geen drama",
            "Na assignment van een geschreven put is je effectieve kostprijs de uitoefenprijs minus de ontvangen premie; dát is je nieuwe referentiepunt",
            "In-the-money opties worden op de afloopdatum vrijwel altijd automatisch uitgeoefend; als schrijver hoef en kun je dan niets meer doen",
            "Zelf vroeg uitoefenen gooit de resterende tijdswaarde weg: een optie met tijdswaarde verkoop je, die oefen je niet uit",
            "Beoordeel de positie ná assignment zoals elke positie: op de situatie van vandaag, niet op spijt over gisteren",
          ],
          quiz: [
            {
              question:
                "Je geschreven put op Zeewind (uitoefenprijs EUR 40, premie EUR 1,10 ontvangen) wordt bij expiratie aangewezen; de koers is EUR 37. Wat zie je op je afschrift en wat is je effectieve kostprijs?",
              options: [
                "Af: EUR 4.000, bij: 100 aandelen; effectieve kostprijs EUR 38,90 per aandeel dankzij de eerder ontvangen premie",
                "Af: EUR 3.700, bij: 100 aandelen; je koopt altijd tegen de actuele koers",
                "Af: EUR 4.000 plus een boete voor de aanwijzing; effectieve kostprijs EUR 41,10",
                "Er verandert niets totdat je zelf de levering accepteert",
              ],
              correctIndex: 0,
              explanation:
                "Je betaalt de afgesproken uitoefenprijs: EUR 40 x 100 = EUR 4.000, en ontvangt 100 aandelen. De premie van EUR 1,10 had je al, dus je effectieve kostprijs is EUR 38,90. Boetes bestaan niet, accepteren hoeft niet (het contract voert zichzelf uit), en de actuele koers bepaalt de waarde van wat je krijgt — niet wat je betaalt.",
            },
            {
              question:
                "Waarom hoort de emotie rond een aangewezen gedekte put volgens deze les eigenlijk niet bij de assignment zelf?",
              options: [
                "Omdat brokers assignments tegenwoordig geruisloos verwerken",
                "Omdat de pijn van de koersdaling er ook was geweest als gewone aandeelhouder — en dan zelfs vanaf een hogere instapprijs; de assignment is slechts de administratieve afwikkeling van je eigen afspraak",
                "Omdat je bij assignment altijd winst maakt dankzij de premie",
                "Omdat je een assignment achteraf kunt laten terugdraaien als je er bezwaar tegen maakt",
              ],
              correctIndex: 1,
              explanation:
                "Wat pijn doet is de daling van Zeewind, en die had elke aandeelhouder gevoeld — wie op EUR 42 kocht zelfs harder dan jij op je effectieve EUR 38,90. De aanwijzing zelf is drie regels administratie. Winst is allerminst gegarandeerd (hier sta je EUR 190 achter), en terugdraaien bestaat niet: het was jouw contract.",
            },
            {
              question:
                "Je bezit een put op Zeewind, uitoefenprijs EUR 40; de koers is EUR 37 en de put noteert EUR 3,40. Je wilt van je aandelen én je bescherming af. Welke route levert het meest op, en hoeveel scheelt het?",
              options: [
                "Uitoefenen: dat levert altijd meer op dan de optie verkopen",
                "Het maakt niet uit: beide routes komen op hetzelfde neer",
                "De put verkopen voor EUR 340 en de aandelen los tegen de marktprijs verkopen: EUR 40 meer dan uitoefenen, precies de resterende tijdswaarde",
                "Wachten tot de afloopdatum is altijd beter dan beide routes",
              ],
              correctIndex: 2,
              explanation:
                "Uitoefenen verzilvert alleen de intrinsieke waarde: EUR 3,00 per aandeel boven de markt. Verkopen levert de volle optieprijs op: EUR 3,40, dus EUR 40 extra op het contract. Dat verschil is de tijdswaarde die je bij uitoefenen weggooit. Wachten is geen gratis optie: de koers kan herstellen (goed voor je aandelen, slecht voor je put) maar je tijdswaarde tikt hoe dan ook weg — wie wíl sluiten, vergelijkt de twee routes van vandaag.",
            },
            {
              question:
                "Direct na een assignment sta je op papier EUR 190 achter en voel je de drang om 'het terug te verdienen' met een agressieve covered call vlak boven de huidige koers. Wat zegt deze les?",
              options: [
                "Goed idee: de extra premie compenseert het verlies het snelst",
                "Alleen doen als de koers eerst nog verder daalt",
                "Beter een nieuwe put schrijven, dan draait het wiel tenminste door",
                "Beslissingen op basis van spijt zijn het probleem: beoordeel de positie op vandaag, en schrijf hooguit een call op een prijs waartegen je oprecht afscheid wilt nemen",
              ],
              correctIndex: 3,
              explanation:
                "Een agressieve call vlak boven de koers verkoopt bijna al je herstelpotentieel op precies het moment dat je daar het meest aan zou hebben — gedreven door spijt, niet door analyse. De juiste vraag is die van elke positie: wil ik deze aandelen tegen deze koers vandaag bezitten? Het antwoord bepaalt houden, verkopen of rustig gedekt schrijven; je gevoel over gisteren bepaalt niets.",
            },
          ],
          xp: 50,
        },
        {
          slug: "wanneer-dit-loont",
          title: "Wanneer dit loont — en wanneer niet",
          durationMin: 10,
          intro:
            "Je beheerst nu de hele gereedschapskist: premie ontvangen, bescherming kopen, en de afwikkeling zonder zenuwen doorstaan. De slotles zoomt uit: wat zegt het langetermijnbewijs over gedekt schrijven, hoe groot maak je je posities, hoe ziet een geschreven optieplan eruit — en wanneer laat je deze kist verstandig dicht?",
          sections: [
            {
              heading: "Wat zegt het bewijs? De BXM-index",
              paragraphs: [
                "Gelukkig hoeven we niet te gissen naar hoe gedekt schrijven op lange termijn uitpakt: het wordt al decennia gemeten. De bekendste meetlat is de BXM, de CBOE S&P 500 BuyWrite Index, die sinds 2002 (met teruggerekende historie tot 1986) een simpele covered-call-strategie volgt: de S&P 500 aanhouden en er elke maand systematisch een at-the-money call op schrijven.",
                "De grote lijn uit de onderzoeken naar de BXM is opvallend consistent met alles wat je in deze cursus hebt gerekend. Over lange periodes behaalde de index een rendement in de buurt van dat van gewoon de S&P 500 aanhouden, met duidelijk kleinere schommelingen onderweg — de premies dempen het op-en-neer. Maar in sterk stijgende beursjaren bleef de BXM fors achter, precies omdat de geschreven calls de beste maanden aftopten. En in zware dalingen daalde hij vrolijk mee, slechts gedempt door de premie: geen bescherming, zoals les 2 al voorrekende.",
                "De conclusie is dus niet 'covered calls verslaan de markt' en ook niet 'covered calls zijn zinloos'. De conclusie is: gedekt schrijven verandert de vórm van je rendement — vlakker, gelijkmatiger, met afgeknipte pieken — zonder aantoonbaar structureel meer of minder op te leveren. Of die vorm bij je past, hangt af van je temperament en je horizon, niet van een geheime formule. En zoals altijd: resultaten uit het verleden, ook die van indexen, beloven niets over de toekomst.",
              ],
            },
            {
              heading: "Positiegrootte en je geschreven plan",
              paragraphs: [
                "Eén optiecontract gaat over 100 aandelen, en dat maakt positiegrootte hier minder vrijblijvend dan bij aandelen: je kunt niet 'een beetje' schrijven op 40 aandelen Zeewind. Vuistregels voor de kalme belegger: begin met één contract op één positie die je door en door kent, schrijf nooit calls op je hele portefeuille tegelijk, en houd je puts altijd volledig cash-gedekt. Wie meerdere contracten schrijft, spreidt bovendien de afloopdata — dan dwingt niet één expiratievrijdag al je beslissingen op dezelfde dag af.",
                "Belangrijker dan elke vuistregel is dat je je regels opschrijft vóórdat de markt je emoties test. Een optieplan hoeft geen document van tien kantjes te zijn; een half A4 met heldere afspraken is meer waard dan de beste intenties in je hoofd. De kern: welke aandelen komen in aanmerking, welke prijzen vind je écht acceptabel om op te kopen of verkopen, en wat doe je in de scenario's die je inmiddels allemaal hebt doorgerekend?",
                "En houd een logboek bij. Noteer bij elke geschreven optie kort waarom je hem schreef en wat het alternatief was geweest (meestal: niets doen). Na een jaar vertelt dat logboek je iets wat geen cursus je kan vertellen: of dit gereedschap in jóúw handen waarde toevoegt — inclusief alle keren dat een weggeroepen aandeel zonder call veel meer had opgeleverd. Eerlijke administratie is het verschil tussen een strategie en een gewoonte.",
              ],
              bullets: [
                "Welke aandelen: alleen posities die je ook zonder opties zou willen bezitten",
                "Maximum: op welk deel van je portefeuille mogen geschreven calls rusten (en dus: welk deel houdt zijn volle stijgingspotentieel)",
                "Prijsregels: schrijf calls alleen op verkoopbereidheid, puts alleen op koopbereidheid — nooit op premiehoogte",
                "Doorrolregel: alleen doorrollen naar posities die je vandaag ook los zou openen (les 3)",
                "Assignmentregel: wat je doet mét de aandelen erna, staat vast vóórdat je schrijft (les 7)",
                "Logboek: reden van elke transactie plus wat niets doen had opgeleverd",
              ],
            },
            {
              heading: "Opties en box 3: alleen het kader",
              paragraphs: [
                "Tot slot twee praktische zaken, te beginnen met de belastingen — en hier passen wij bewust op onze woorden. Voor de meeste particuliere beleggers in Nederland vallen opties, net als de aandelen waarop ze rusten, onder het vermogen in box 3: je wordt niet per transactie belast, maar over je vermogen volgens de regels die dat jaar gelden. Hoe box 3 precies rekent, is al jaren in beweging (van forfaitaire rendementen richting werkelijk rendement), dus elk concreet getal dat wij hier zouden opschrijven, kan bij het lezen alweer verouderd zijn.",
                "Eén aandachtspunt verdient het om te kennen: wie zeer actief, georganiseerd en met specifieke kennis handelt, kan door de Belastingdienst in uitzonderlijke gevallen worden gezien als iemand met inkomen uit werk (box 1) in plaats van vermogen. Voor de kalme belegger die af en toe een gedekte call of put schrijft op zijn eigen portefeuille is dat normaal gesproken niet aan de orde — maar het bestaan van die grens is goed om te weten.",
                "En daarmee houdt onze rol op: dit is een kader, geen belastingadvies. Wij zijn opleider, geen fiscalist en geen AFM-vergunninghouder. Check je eigen situatie bij de Belastingdienst of een belastingadviseur, zeker als je portefeuille groter wordt of je handelsfrequentie toeneemt. Dat is geen formaliteit onderaan een cursus; het is gewoon het eerlijke antwoord.",
              ],
            },
            {
              heading: "Wanneer je dit allemaal níét doet",
              paragraphs: [
                "De belangrijkste les van een gereedschapscursus is wanneer het gereedschap in de kist blijft. Sla deze strategieën gerust over als je portefeuille nog klein is: één contract vergt 100 aandelen of het volledige aankoopbedrag in cash, en op kleine posities eten transactiekosten een onevenredig deel van elke premie op. Sla ze ook over als je van een aandeel een sterke stijging verwacht — je hebt in les 2 uitgerekend wat een geschreven call dan kost — en als je de rust of tijd niet hebt voor het onderhoud dat expiratiedata, dividendkalenders en doorrolbeslissingen nu eenmaal vragen.",
                "En misschien wel de belangrijkste: doe het niet omdat je het gevoel hebt dat je portefeuille moet 'werken'. Dat gevoel is precies waar de verkopers van premieromantiek op vissen. Een portefeuille van degelijke aandelen of indexfondsen die je simpelweg jarenlang aanhoudt, is een volwaardige strategie — voor veel mensen de beste die er is. Alles uit deze cursus is optioneel gereedschap voor specifieke situaties: een positie die knelt, een einddatum die nadert, verkoopbereidheid die toch al bestond.",
                "Wie zo naar de kist kijkt, heeft de kern van deze cursus te pakken. Opties maken je portefeuille niet beter of slechter; ze maken hem preciezer — je kunt uitkomsten wegsnijden die je niet wilt en betaald worden voor uitkomsten die je toch al accepteerde. Dat vraagt rekensommen vooraf, eerlijkheid over wat je opgeeft en de discipline van een geschreven plan. Precies de drie dingen die je hier hebt geoefend. Kalm blijven en eerst rekenen: meer geheim is er niet.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "New Insights on Covered Call Writing",
              author: "Richard Lehman & Lawrence McMillan",
              year: 2003,
              note: "Bespreekt het langetermijnkarakter van gedekt schrijven — inclusief de indexstudies rond buy-write-strategieën — met dezelfde nuchtere conclusie als deze les: een andere vorm van rendement, geen gratis extra.",
            },
            {
              title: "Options as a Strategic Investment",
              author: "Lawrence McMillan",
              note: "Het naslagwerk om naast je geschreven optieplan te leggen: vrijwel elke situatie die je in de praktijk tegenkomt, staat er systematisch in uitgewerkt.",
            },
          ],
          keyTakeaways: [
            "De BXM-index laat zien wat gedekt schrijven op lange termijn doet: vlakkere rendementen met kleinere schommelingen, fors achterblijvend in sterke stijgingsjaren — een andere vorm, geen gratis extra",
            "Begin met één contract, schrijf nooit op je hele portefeuille tegelijk en spreid afloopdata",
            "Een geschreven optieplan van een half A4 plus een eerlijk logboek maakt het verschil tussen strategie en gewoonte",
            "Opties vallen voor de meeste particulieren in box 3, maar het stelsel is in beweging: check je situatie zelf — deze cursus geeft geen belastingadvies",
            "Laat de kist dicht bij een kleine portefeuille, sterke stijgingsverwachtingen, gebrek aan tijd of de drang dat je geld moet 'werken': gewoon aanhouden blijft een volwaardige strategie",
          ],
          quiz: [
            {
              question:
                "Wat is de meest nauwkeurige samenvatting van decennia aan metingen rond de BXM (CBOE S&P 500 BuyWrite Index)?",
              options: [
                "Systematisch covered calls schrijven verslaat de index structureel dankzij de premiestroom",
                "Covered calls beschermen een portefeuille effectief tegen beursdalingen",
                "De metingen zijn onbruikbaar omdat de BXM pas enkele jaren bestaat",
                "Gedekt schrijven leverde over lange periodes een rendement in de buurt van de index met kleinere schommelingen, maar bleef fors achter in sterk stijgende jaren en daalde in crashes vrijwel gewoon mee",
              ],
              correctIndex: 3,
              explanation:
                "De BXM (historie teruggerekend tot 1986) bevestigt de rekensommen uit deze cursus: premies dempen het op-en-neer en toppen de beste jaren af, terwijl dalingen slechts met het premiebedrag worden verzacht. Geen structurele outperformance, geen bescherming — een andere vórm van rendement. En ook indexhistorie belooft niets over de toekomst.",
            },
            {
              question:
                "Je hebt 250 aandelen Zeewind NV en wilt beginnen met gedekt schrijven. Welke aanpak past bij de vuistregels van deze les?",
              options: [
                "Direct twee contracten schrijven met dezelfde afloopdatum, dan is het overzichtelijk",
                "Drie contracten schrijven; de ontbrekende 50 aandelen koop je wel als je wordt aangewezen",
                "Beginnen met één contract op 100 van je aandelen, zodat 150 aandelen hun volledige stijgingspotentieel houden en je het proces leert kennen",
                "Wachten tot je 300 aandelen hebt, want gedekt schrijven mag alleen op je volledige positie",
              ],
              correctIndex: 2,
              explanation:
                "Klein beginnen met één contract laat je het hele proces — premie, koersbeweging, eventueel assignment — meemaken met beperkte inzet, terwijl het grootste deel van je positie vrij blijft. Drie contracten op 250 aandelen betekent dat één contract ongedekt is: precies wat deze cursus uitsluit. En schrijven op álles tegelijk is het omgekeerde van de vuistregel, geen vereiste.",
            },
            {
              question: "Welke uitspraak over opties en de Nederlandse belastingen past bij deze les?",
              options: [
                "Elke optiepremie wordt direct belast tegen het tarief van box 1",
                "Voor de meeste particulieren vallen opties onder het vermogen in box 3, maar het stelsel is in beweging en deze cursus geeft nadrukkelijk geen belastingadvies: check je eigen situatie",
                "Optiewinsten zijn in Nederland belastingvrij zolang de posities gedekt zijn",
                "De broker houdt automatisch de juiste belasting in, dus zelf uitzoeken is overbodig",
              ],
              correctIndex: 1,
              explanation:
                "Het kader: opties horen voor de meeste particuliere beleggers, net als hun aandelen, bij het vermogen in box 3 — al kan zeer actieve, professionele handel in uitzonderlijke gevallen als box 1-inkomen worden gezien. Omdat de box 3-regels veranderen, hoort elk concreet getal bij de Belastingdienst of een adviseur, niet in een cursus. 'Belastingvrij' en automatische inhouding door de broker zijn fabels.",
            },
            {
              question:
                "Welke belegger kan de gereedschapskist uit deze cursus volgens de slotles het best dicht laten?",
              options: [
                "Iemand met een kleine portefeuille die vindt dat zijn geld 'harder moet werken' en daarom premie wil gaan schrijven",
                "Iemand met 100 aandelen die hij tegen een vooraf bepaalde hogere prijs toch al wilde verkopen",
                "Iemand die een te groot gegroeide positie richting een einddatum wil begrenzen",
                "Iemand die na het doorrekenen van alle scenario's bewust kiest voor de vlakkere rendementsvorm van gedekt schrijven",
              ],
              correctIndex: 0,
              explanation:
                "Kleine portefeuille plus de drang dat geld moet 'werken' is precies de combinatie waarvoor de slotles waarschuwt: transactiekosten drukken zwaar op kleine premies, en dat gevoel is het verkoopargument van premieromantiek — niet een beleggingsreden. De andere drie hebben een concrete situatie waarin het gereedschap past: verkoopbereidheid, een knellende positie, of een bewuste, doorgerekende keuze.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
