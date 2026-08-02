import type { Course } from "../types";

const course: Course = {
  slug: "waardebeleggen",
  title: "Ontdek Waardebeleggen",
  subtitle: "Winnaars spotten & geduld belonen",
  description:
    "Waardebeleggen is de strategie van Benjamin Graham en Warren Buffett: koop bedrijven voor minder dan ze waard zijn en laat geduld het werk doen. In deze cursus leer je hoe je ondergewaardeerde bedrijven herkent, jaarverslagen leest zonder hoofdpijn en kwaliteit onderscheidt van koopjes die dat niet zijn. Eerlijk, met rekenvoorbeelden en zonder beloftes die niemand kan waarmaken.",
  level: "Gevorderd",
  accent: "navy",
  icon: "scale",
  price: "€49",
  order: 2,
  heroQuote: {
    text: "Prijs is wat je betaalt. Waarde is wat je krijgt.",
    source: "Warren Buffett, aandeelhoudersbrief Berkshire Hathaway (2008)",
  },
  learnPoints: [
    "Het verschil tussen prijs en waarde, en waarom juist dat verschil jouw kans is",
    "Denken als Benjamin Graham: Mr. Market, contrair denken en de veiligheidsmarge",
    "Jaarverslagen lezen: balans, winst-en-verliesrekening en kasstroom in gewone taal",
    "Kengetallen zoals K/W en koers/boekwaarde gebruiken zonder in value traps te trappen",
    "Kwaliteitsbedrijven herkennen aan economische slotgrachten en eerlijk management",
  ],
  modules: [
    {
      slug: "de-filosofie",
      title: "De filosofie",
      description:
        "Voordat je ook maar een cijfer bekijkt, moet je snappen hoe waardebeleggers denken. Deze module legt het fundament: prijs versus waarde, de psychologie van de beurs en de veiligheidsmarge die je beschermt als je ernaast zit.",
      lessons: [
        {
          slug: "wat-is-waardebeleggen",
          title: "Wat is waardebeleggen?",
          durationMin: 8,
          intro:
            "Waardebeleggen klinkt misschien als iets voor doorgewinterde profs met drie beeldschermen, maar de kern is verrassend nuchter: betaal nooit meer voor iets dan het waard is. In deze les ontdek je waar die filosofie vandaan komt, waarom ze al bijna een eeuw meegaat en, net zo belangrijk, wanneer ze je geduld flink op de proef stelt.",
          sections: [
            {
              heading: "Prijs en waarde zijn niet hetzelfde",
              paragraphs: [
                "Stel: je favoriete pot pindakaas kost normaal EUR 4,50, maar deze week ligt hij in de bonus voor EUR 2,90. De pot is exact hetzelfde, alleen de prijs veranderde. In de supermarkt snapt iedereen dat prijs en waarde twee verschillende dingen zijn. Op de beurs vergeten mensen dat massaal.",
                "De koers van een aandeel is niets meer dan de prijs van de laatste transactie. Die beweegt elke seconde, gedreven door nieuws, stemming en handelsalgoritmes. De waarde van het onderliggende bedrijf, wat het echt waard is op basis van de winsten die het de komende jaren gaat maken, verandert veel langzamer. Een fabriek verdwijnt niet omdat de koers vandaag 4% daalt.",
                "Waardebeleggen draait volledig om dat verschil. Je zoekt momenten waarop de prijs op de beurs duidelijk lager ligt dan jouw voorzichtige schatting van de waarde. Dan koop je in feite een euro voor zeventig cent, en wacht je tot de markt zijn vergissing inziet.",
              ],
              example: {
                title: "Hetzelfde bedrijf, twee prijzen",
                body:
                  "Een fictief bedrijf, Molenaar NV, maakt al tien jaar stabiel zo'n EUR 100 miljoen winst per jaar. In maart staat het op de beurs gewaardeerd op EUR 1,5 miljard; na een paniekmaand met somber nieuws over de economie nog maar op EUR 1,0 miljard. De fabrieken, klanten en winstgevendheid zijn amper veranderd, maar de prijs daalde 33%. Een waardebelegger vraagt zich dan af: is het bedrijf echt een derde minder waard geworden, of is alleen de stemming omgeslagen?",
              },
            },
            {
              heading: "Benjamin Graham: de grondlegger",
              paragraphs: [
                "Waardebeleggen begint bij Benjamin Graham, een briljante belegger en docent in New York. Tijdens de beurskrach van 1929 verloor hij een groot deel van zijn vermogen, en die klap vormde zijn denken: nooit meer beleggen op hoop en verhalen, alleen nog op feiten, cijfers en een flinke buffer voor tegenslag.",
                "Graham goot die aanpak in twee boeken die nog steeds worden gelezen: Security Analysis (1934) en het toegankelijkere The Intelligent Investor (1949). Aan Columbia University leidde hij bovendien een generatie beleggers op, onder wie een jonge student uit Omaha: Warren Buffett. Die noemde The Intelligent Investor later veruit het beste boek over beleggen dat ooit is geschreven.",
                "Grahams kernboodschap is tijdloos: gedraag je als mede-eigenaar van een bedrijf, niet als gokker op koersbewegingen. Wie een aandeel koopt, koopt een stukje bedrijf, met echte werknemers, klanten en winsten. Dat perspectief verandert alles aan hoe je naar een dalende koers kijkt.",
              ],
            },
            {
              heading: "Waarom waardebeleggen werkt",
              paragraphs: [
                "Als het idee zo simpel is, waarom zijn koopjes dan niet allang weggekaapt? Omdat de grootste tegenstander niet kennis is, maar gedrag. Mensen overdrijven massaal: bij paniek verkopen ze alles, ook prima bedrijven, en bij euforie betalen ze elke prijs. Die emotionele uitschieters creëren precies de kortingen waar waardebeleggers op jagen.",
                "Daarnaast hebben veel professionele partijen beperkingen die jij als particulier niet hebt. Fondsbeheerders worden per kwartaal afgerekend en durven daardoor vaak niet jaren te wachten tot een ondergewaardeerd aandeel herstelt. Jouw grootste voordeel is geen snellere computer, maar een langere adem.",
                "Onderzoek laat zien dat goedkope aandelen als groep over lange periodes vaak beter presteerden dan dure aandelen, het zogenoemde waardepremie-effect. Let op het woord 'vaak': het is een historisch patroon, geen natuurwet en geen garantie voor de toekomst.",
              ],
              bullets: [
                "Emoties van andere beleggers zorgen voor overdreven koersuitslagen, omhoog én omlaag",
                "Professionals zitten vast aan korte evaluatieperiodes; geduld is jouw structurele voordeel",
                "Kopen met korting geeft een buffer: valt het resultaat tegen, dan heb je in elk geval niet te veel betaald",
              ],
            },
            {
              heading: "En wanneer het niet werkt: het eerlijke verhaal",
              paragraphs: [
                "Hier zijn we bij Beleggingscollege eerlijk over: waardebeleggen kan jarenlang achterlopen op de brede markt. Tussen 2010 en 2020 lieten dure groeiaandelen, vooral grote techbedrijven, goedkope waarde-aandelen ver achter zich. Wie in die periode strikt op koopjes joeg, had regelmatig het gevoel de boot te missen.",
                "Bovendien is goedkoop niet hetzelfde als koopwaardig. Sommige aandelen zijn terecht spotgoedkoop omdat het bedrijf structureel in verval is; dat heet een value trap, en in les 5 leer je die herkennen. Een lage prijs is het begin van je onderzoek, nooit de conclusie.",
                "Waardebeleggen vraagt dus twee dingen die zeldzamer zijn dan rekenkracht: het geduld om jaren te wachten en de discipline om huiswerk te doen voordat je koopt. Kun je dat opbrengen, dan heb je een aanpak met een lange, goed gedocumenteerde staat van dienst. Maar beleggen kent risico's, ook deze stijl: je kunt (tijdelijk of blijvend) minder terugkrijgen dan je inlegt.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Intelligent Investor",
              author: "Benjamin Graham",
              year: 1949,
              note: "Hét fundament van waardebeleggen. Vooral de hoofdstukken over Mr. Market en de veiligheidsmarge zijn verplichte kost; de rest mag je gerust doseren.",
            },
            {
              title: "The Little Book That Still Beats the Market",
              author: "Joel Greenblatt",
              year: 2010,
              note: "Dun, grappig en concreet: Greenblatt legt uit waarom 'goedkoop én goed' kopen werkt, met een simpele formule als kapstok.",
            },
          ],
          keyTakeaways: [
            "De koers is de prijs van de laatste transactie; de waarde is wat het bedrijf echt waard is op basis van toekomstige winsten",
            "Benjamin Graham legde het fundament: koop aandelen als mede-eigenaar van een bedrijf, niet als gokker op koersen",
            "Waardebeleggen werkt vooral doordat andere beleggers overdrijven en professionals geen geduld mogen hebben",
            "Wees eerlijk over de keerzijde: de stijl kan jaren achterblijven en goedkoop is niet automatisch koopwaardig",
          ],
          quiz: [
            {
              question:
                "Een solide bedrijf zonder relevant nieuws daalt in een maand 30% mee met een brede beurspaniek. Hoe kijkt een waardebelegger hier in eerste instantie naar?",
              options: [
                "De markt heeft altijd gelijk, dus het bedrijf is nu echt 30% minder waard",
                "De prijs is duidelijk veranderd, maar of de waarde is veranderd moet ik zelf onderzoeken; misschien is dit juist een kans",
                "Zo'n daling betekent dat je direct moet bijkopen, ongeacht de cijfers",
                "Koersdalingen zijn irrelevant zolang het dividend maar gelijk blijft",
              ],
              correctIndex: 1,
              explanation:
                "Kern van de les: prijs en waarde zijn verschillende dingen. Een daling zonder bedrijfsnieuws zegt vooral iets over de stemming. Maar 'misschien een kans' betekent niet 'blind kopen': je onderzoekt eerst of de waarde echt is aangetast. Optie 3 slaat die stap over en optie 1 verwart prijs met waarde.",
            },
            {
              question: "Wat is de beste omschrijving van de intrinsieke waarde van een aandeel?",
              options: [
                "De hoogste koers die het aandeel het afgelopen jaar heeft bereikt",
                "De prijs die grote beleggers er op dit moment voor betalen",
                "Een schatting van wat het onderliggende bedrijf waard is, gebaseerd op de winsten en kasstromen die het naar verwachting gaat opleveren",
                "De boekwaarde die de accountant in het jaarverslag vermeldt",
              ],
              correctIndex: 2,
              explanation:
                "Intrinsieke waarde is een eigen, onderbouwde schatting van wat het bedrijf waard is, los van de huidige beurskoers. De koers en oude records zeggen daar niets over, en de boekwaarde is slechts één ingrediënt van zo'n schatting, niet de waarde zelf.",
            },
            {
              question:
                "De principes van Graham staan al sinds 1949 in de boeken. Waarom kunnen er dan überhaupt nog ondergewaardeerde aandelen bestaan?",
              options: [
                "Omdat de meeste beleggers geen toegang hebben tot jaarverslagen",
                "Omdat de strategie vooral discipline en jarenlang geduld vraagt, en emoties en korte-termijndruk de meeste beleggers daarvan weerhouden",
                "Omdat waardebeleggen alleen werkt met voorkennis die particulieren niet hebben",
                "Omdat ondergewaardeerde aandelen wettelijk alleen door professionals gekocht mogen worden",
              ],
              correctIndex: 1,
              explanation:
                "Het 'geheim' is allang publiek; de bottleneck is gedrag. Paniekverkopen, kuddegedrag en de kwartaaldruk op professionals zorgen steeds opnieuw voor verkeerd geprijsde aandelen. Jaarverslagen zijn juist voor iedereen gratis toegankelijk, en voorkennis heeft er niets mee te maken (handelen daarop is bovendien verboden).",
            },
            {
              question: "Welke uitspraak over de beperkingen van waardebeleggen is juist?",
              options: [
                "Waardebeleggen kan jarenlang slechter presteren dan de brede markt, zoals in het decennium na 2010",
                "Met waardebeleggen ben je beschermd tegen koersverliezen",
                "Een aandeel met een lage prijs is per definitie een goede waardebelegging",
                "Waardebeleggen werkt alleen in de Verenigde Staten, niet op Europese beurzen zoals de AEX",
              ],
              correctIndex: 0,
              explanation:
                "Eerlijkheid eerst: tussen grofweg 2010 en 2020 bleven goedkope waarde-aandelen fors achter bij groeiaandelen. Bescherming tegen verlies bestaat niet, een lage prijs kan een value trap zijn, en de principes zijn niet aan één land gebonden.",
            },
          ],
          xp: 50,
        },
        {
          slug: "mr-market",
          title: "Mr. Market en de psychologie van de beurs",
          durationMin: 7,
          intro:
            "Benjamin Graham bedacht in The Intelligent Investor een personage dat je nooit meer vergeet: Mr. Market, je manisch-depressieve zakenpartner. Wie deze allegorie echt doorgrondt, kijkt nooit meer hetzelfde naar een rood beursscherm. In deze les leer je koersschommelingen zien als aanbiedingen in plaats van bedreigingen.",
          sections: [
            {
              heading: "De vreemdste zakenpartner ter wereld",
              paragraphs: [
                "Stel je voor: je bezit samen met een partner een goedlopende broodjeszaak. Die partner, Mr. Market, heeft één eigenaardigheid: elke dag noemt hij een prijs waarvoor hij jouw helft wil kopen, of zijn helft aan je wil verkopen. En zijn humeur schommelt enorm.",
                "De ene dag is hij euforisch en biedt hij een belachelijk hoog bedrag voor jouw helft. De andere dag ziet hij het somber in en wil hij zijn helft voor een schijntje van de hand doen. Het mooiste is: je bent nooit verplicht om op zijn bod in te gaan. Negeer je hem vandaag, dan staat hij morgen gewoon weer op de stoep met een nieuwe prijs.",
                "Dit is precies hoe de beurs werkt, schreef Graham in hoofdstuk 8 van The Intelligent Investor. De dagelijkse koersen zijn de biedingen van Mr. Market. Ze zijn er om jou te dienen wanneer het jou uitkomt, niet om je te vertellen wat je bedrijf waard is.",
              ],
            },
            {
              heading: "Zijn humeur is jouw kans",
              paragraphs: [
                "De meeste beleggers doen precies het omgekeerde van wat Graham adviseert: ze worden vrolijk als Mr. Market hoge prijzen roept en raken in paniek als hij lage prijzen noemt. Terwijl een lagere prijs voor hetzelfde bedrijf objectief gezien gewoon een betere deal is, net als bij die pot pindakaas in de bonus.",
                "Daarmee draait Graham het klassieke beursgevoel om: volatiliteit, het op en neer stuiteren van koersen, is voor een goed voorbereide belegger geen risico maar een bron van kansen. Zonder schommelingen zou je nooit een prachtig bedrijf met korting kunnen kopen.",
                "De voorwaarde is wel dat je zelf een idee hebt van wat het bedrijf waard is. Wie geen eigen waardering heeft, kan niet beoordelen of het bod van Mr. Market gek is, en laat zich alsnog meeslepen door zijn stemmingen.",
              ],
              example: {
                title: "Stroopwafel NV en de biedingen van Mr. Market",
                body:
                  "Stel, jouw analyse zegt dat een aandeel Stroopwafel NV zo'n EUR 40 waard is. In een euforisch jaar biedt Mr. Market EUR 62: een mooi moment om te overwegen (een deel) te verkopen. In een paniekmaand biedt hij EUR 25: als je analyse nog klopt, koop je dan hetzelfde bedrijf met 37,5% korting op jouw geschatte waarde. En noemt hij EUR 38? Dan doe je simpelweg niets. Drie biedingen, één constante: jouw eigen waardering bepaalt je reactie, niet zijn humeur.",
              },
            },
            {
              heading: "Contrair denken, zonder eigenwijs te worden",
              paragraphs: [
                "Waardebeleggers staan bekend als contraire denkers: ze kopen wanneer anderen somber zijn en zijn voorzichtig wanneer iedereen juicht. Maar let op, contrair zijn is geen doel op zich. De menigte heeft namelijk vaak gewoon gelijk: een bedrijf dat iedereen mijdt, is soms terecht in de uitverkoop.",
                "Graham formuleerde het scherp: je hebt geen gelijk omdat de massa het met je oneens is, je hebt gelijk omdat je feiten en je redenering kloppen. Contrair denken betekent dus niet automatisch tegen de stroom inzwemmen, maar zelfstandig tot een oordeel komen en dat oordeel durven volgen, óók als het toevallig tegen de heersende mening ingaat.",
                "Het verschil zie je in de praktijk: wie blind elk hard gedaald aandeel koopt, vangt regelmatig een vallend mes. Wie eerst onderzoekt of de winstkracht overeind staat en dan pas koopt, gebruikt de somberheid van anderen in zijn voordeel.",
              ],
            },
            {
              heading: "Praktische regels tegen paniek",
              paragraphs: [
                "Mooie theorie, maar wat doe je als je portefeuille op een dinsdag 8% lager staat en elk nieuwsbericht schreeuwt dat het erger wordt? Precies voor dat moment wil je vooraf afspraken met jezelf hebben gemaakt. In de hitte van het moment is je oordeel het minst betrouwbaar.",
                "Een simpel hulpmiddel is een korte investeringsthese: schrijf bij aankoop in een paar zinnen op waarom je dit bedrijf koopt en wat je schatting van de waarde is. Daalt de koers later hard, dan is de enige relevante vraag: klopt mijn these nog? Zo verplaats je de discussie van je onderbuik naar de feiten.",
              ],
              bullets: [
                "Schrijf vóór elke aankoop een mini-these op: waarom dit bedrijf, en wat is het volgens jou waard?",
                "Check bij een koersval eerst het bedrijfsnieuws, niet het koersgrafiekje: is er iets veranderd aan de winstkracht?",
                "Spreek een afkoelperiode met jezelf af: geen verkoopbeslissingen op de dag van een grote daling",
                "Beoordeel je bedrijven op vaste momenten (bijvoorbeeld per kwartaal), niet elke dag opnieuw",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Intelligent Investor",
              author: "Benjamin Graham",
              year: 1949,
              note: "Hoofdstuk 8 bevat de originele Mr. Market-allegorie. Warren Buffett noemt dit, samen met hoofdstuk 20, het waardevolste dat ooit over beleggen is geschreven.",
            },
          ],
          keyTakeaways: [
            "De beurskoers is een dagelijks bod van de humeurige Mr. Market; je bent nooit verplicht erop in te gaan",
            "Koersschommelingen zijn voor een voorbereide belegger een bron van kansen, geen bedreiging",
            "Contrair denken werkt alleen met huiswerk: je hebt gelijk door je feiten en redenering, niet doordat je tegen de massa ingaat",
            "Bescherm jezelf tegen paniek met vooraf opgeschreven theses en vaste evaluatiemomenten",
          ],
          quiz: [
            {
              question:
                "De AEX daalt 3% en jouw aandeel daalt 8%, zonder enig bedrijfsnieuws. Welke reactie past het best bij Grahams Mr. Market-les?",
              options: [
                "Direct verkopen: zo'n daling voorspelt bijna altijd meer ellende",
                "Nagaan of er iets aan de waarde van het bedrijf is veranderd; zo niet, dan is dit hooguit een interessant bod van Mr. Market, en niets doen mag ook",
                "Meteen fors bijkopen, want elke daling is per definitie een koopkans",
                "Het aandeel een jaar lang niet meer bekijken, want koersen doen er nooit toe",
              ],
              correctIndex: 1,
              explanation:
                "Mr. Market doet een bod; jij beslist op basis van je eigen waardering of je iets doet. Verkopen uit angst laat zijn humeur regeren (optie 1), blind bijkopen slaat het huiswerk over (optie 3), en koersen volledig negeren gooit ook de kansen weg die lage biedingen soms zijn (optie 4).",
            },
            {
              question: "Wat is de kernboodschap van de Mr. Market-allegorie?",
              options: [
                "De beurs is op korte termijn onvoorspelbaar, dus beleggen is eigenlijk gokken",
                "Je moet dagelijks handelen om van de biedingen van Mr. Market te profiteren",
                "Koersen zijn er om je te bedienen, niet om je te sturen: gebruik ze als ze gunstig zijn en negeer ze anders",
                "De marktprijs is de beste schatting van de waarde, dus wijk er niet van af",
              ],
              correctIndex: 2,
              explanation:
                "Graham wil dat je koersen behandelt als vrijblijvende biedingen van een humeurige partner: soms nuttig, vaak te negeren. Optie 4 is precies de omgekeerde denkwijze, en dagelijks handelen (optie 2) speelt Mr. Market juist in de kaart via kosten en emotie.",
            },
            {
              question: "Wanneer is contrair beleggen verstandig volgens Graham?",
              options: [
                "Zodra het sentiment negatief is: hoe somberder de krantenkoppen, hoe beter de koop",
                "Wanneer je eigen analyse van de feiten laat zien dat de markt een bedrijf verkeerd prijst, ook al denkt de meerderheid er anders over",
                "Nooit: de markt heeft altijd gelijk, dus tegen de stroom ingaan is zinloos",
                "Alleen wanneer een aandeel minstens 50% onder zijn hoogste koers ooit staat",
              ],
              correctIndex: 1,
              explanation:
                "Grahams regel: je hebt gelijk omdat je data en redenering kloppen, niet omdat de menigte het oneens is. Somber sentiment of een grote koersval alléén is geen argument; ook de menigte heeft vaak gelijk en sommige dalers zijn terecht goedkoop.",
            },
            {
              question:
                "Vier beleggers reageren op een beursweek met veel schommelingen. Wie laat zich door Mr. Market sturen in plaats van bedienen?",
              options: [
                "Anna herleest haar investeringsthese en concludeert dat er niets is veranderd; ze doet niets",
                "Bram ziet dat een bedrijf van zijn watchlist 25% onder zijn waardering noteert en koopt na een laatste check",
                "Carla verkoopt haar aandelen omdat de koersen al drie dagen dalen en ze het gevoel heeft dat het nog erger wordt",
                "Daan gebruikt de euforie rond een hype-aandeel dat hij bezit om een deel met flinke winst te verkopen",
              ],
              correctIndex: 2,
              explanation:
                "Carla laat de koersbeweging en haar onderbuik beslissen: dat is je laten sturen door het humeur van Mr. Market. Anna, Bram en Daan gebruiken zijn biedingen juist in hun voordeel, of negeren ze bewust op basis van hun eigen waardering.",
            },
          ],
          xp: 50,
        },
        {
          slug: "veiligheidsmarge",
          title: "De veiligheidsmarge",
          durationMin: 8,
          tool: "intrinsieke-waarde",
          intro:
            "Vraag je aan doorgewinterde waardebeleggers wat het allerbelangrijkste concept uit hun vak is, dan krijg je opvallend vaak hetzelfde antwoord: de veiligheidsmarge. Graham noemde het zelfs het geheim van verstandig beleggen, samengevat in drie woorden: margin of safety. In deze les leer je waarom je altijd korting eist, en hoeveel.",
          sections: [
            {
              heading: "Bouw een brug die meer kan dragen",
              paragraphs: [
                "Warren Buffett legt de veiligheidsmarge graag uit met een brug: als je een brug bouwt, eis je dat hij 30.000 kilo kan dragen, ook al rijden er alleen vrachtwagens van 10.000 kilo overheen. Niet omdat je verwacht dat er ooit zo'n zware truck komt, maar omdat je rekening houdt met alles wat je níét hebt voorzien: materiaalfouten, storm, slijtage.",
                "Bij beleggen werkt het precies zo. Je koopt een aandeel alleen wanneer de koers fors onder jouw schatting van de intrinsieke waarde ligt. Die korting is je draagvermogen-reserve: ze vangt schattingsfouten, pech en tegenvallers op zonder dat de belegging meteen een verliespost wordt.",
                "Graham wijdde het slothoofdstuk van The Intelligent Investor aan dit principe en stelde dat het geheim van gezond beleggen in drie woorden past: margin of safety. Geen ingewikkelde formule, maar een houding: eis altijd korting, juist omdat je weet dat je het mis kunt hebben.",
              ],
            },
            {
              heading: "Intrinsieke waarde is een schatting, geen feit",
              paragraphs: [
                "Waarom is die korting zo cruciaal? Omdat intrinsieke waarde geen meetbaar getal is, zoals de temperatuur, maar een schatting van de toekomst. Je maakt aannames over omzetgroei, winstmarges en risico, en kleine verschillen in die aannames leiden tot grote verschillen in uitkomst.",
                "Reken maar mee: waardeer je een stabiel bedrijf op basis van 5% jaarlijkse winstgroei, dan kom je misschien op EUR 55 per aandeel uit. Reken je met 7% groei, dan rolt er zomaar EUR 70 uit. Beide aannames klinken redelijk, maar het verschil is bijna 30%. Wie zijn eigen schatting als exacte waarheid behandelt, houdt zichzelf voor de gek.",
                "Verstandige waardebeleggers werken daarom met bandbreedtes en bewust voorzichtige aannames. Ze vragen niet 'wat is de waarde precies?', maar 'is het aandeel óók goedkoop als mijn sombere scenario uitkomt?'. Precies goed hoeven zitten is niet nodig, ruwweg gelijk hebben met een buffer wel.",
              ],
            },
            {
              heading: "Rekenvoorbeeld: van waarde naar kooplimiet",
              paragraphs: [
                "De veiligheidsmarge maakt van een vage filosofie een concrete koopregel. Je schat eerst de intrinsieke waarde, trekt daar een vast kortingspercentage vanaf en krijgt zo een maximale koopprijs. Ligt de beurskoers daarboven, dan doe je simpelweg niets, hoe mooi het bedrijf ook is.",
                "Dat 'niets doen' is misschien wel het moeilijkste deel. De marge dwingt je om vaker nee dan ja te zeggen en te wachten tot Mr. Market een keer écht somber is. Geduld is hier geen bijzaak maar het mechanisme zelf: zonder wachten geen korting.",
              ],
              example: {
                title: "Waarom de marge je redt als je ernaast zit",
                body:
                  "Stel, je schat de intrinsieke waarde van Windmolen NV op EUR 60 per aandeel en je hanteert een veiligheidsmarge van 30%. Je maximale koopprijs is dan EUR 60 x 0,70 = EUR 42. Je koopt op EUR 40. Blijkt later dat je te optimistisch was en is het bedrijf eigenlijk maar EUR 48 waard, dan heb je alsnog met korting gekocht: je betaalde EUR 40 voor EUR 48 aan waarde. Zonder marge had je op EUR 58 gekocht, tevreden met een schijnbaar kleine korting, en was diezelfde schattingsfout direct een verlies van EUR 10 per aandeel geweest.",
              },
            },
            {
              heading: "Hoe groot moet je marge zijn?",
              paragraphs: [
                "Er bestaat geen wettelijk vastgelegd percentage, maar de logica is helder: hoe onzekerder de toekomst van een bedrijf, hoe groter de marge die je eist. Voor een stabiel bedrijf met voorspelbare winsten, denk aan een supermarktketen of netbeheerder-achtig profiel, is 20 tot 30% korting al een serieuze buffer. Voor een cyclisch bedrijf of een bedrijf in een snel veranderende sector wil je eerder 40 tot 50%.",
                "Interessant is hoe Buffett hierin opschoof onder invloed van zijn compagnon Charlie Munger en de boeken van Philip Fisher. De jonge Buffett kocht matige bedrijven met gigantische kortingen, zogeheten sigarenpeuken. De latere Buffett betaalt liever een redelijke prijs voor een fantastisch bedrijf dan een fantastische prijs voor een redelijk bedrijf: kwaliteit is zelf een vorm van veiligheid.",
                "De les voor jou: veiligheidsmarge en kwaliteit zijn communicerende vaten. Maar hoe goed het bedrijf ook is, een marge van nul is nooit verstandig. Zelfs het beste bedrijf ter wereld kan een slechte belegging zijn als je er te veel voor betaalt.",
              ],
              bullets: [
                "Stabiel en voorspelbaar bedrijf: veiligheidsmarge van grofweg 20-30%",
                "Cyclisch of onvoorspelbaar bedrijf: eerder 40-50% korting eisen",
                "Hogere kwaliteit rechtvaardigt een wat kleinere marge, maar nooit een marge van nul",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Intelligent Investor",
              author: "Benjamin Graham",
              year: 1949,
              note: "Hoofdstuk 20, 'Margin of Safety as the Central Concept of Investment', is de bron van deze hele les.",
            },
            {
              title: "De aandeelhoudersbrieven van Berkshire Hathaway",
              author: "Warren Buffett",
              note: "Gratis te lezen op de site van Berkshire Hathaway. Buffett komt er telkens terug op de veiligheidsmarge en op zijn verschuiving richting kwaliteitsbedrijven.",
            },
          ],
          keyTakeaways: [
            "De veiligheidsmarge is de korting tussen jouw geschatte intrinsieke waarde en de prijs die je maximaal betaalt",
            "Je eist die korting omdat intrinsieke waarde een schatting is: de marge vangt fouten en pech op",
            "Reken met bandbreedtes en voorzichtige aannames in plaats van met één 'exact' getal",
            "Hoe onvoorspelbaarder het bedrijf, hoe groter de vereiste marge; kwaliteit rechtvaardigt een kleinere marge, maar nooit géén marge",
          ],
          quiz: [
            {
              question:
                "Je schat de intrinsieke waarde van een aandeel op EUR 80 en hanteert een veiligheidsmarge van 25%. Wat is je maximale koopprijs?",
              options: [
                "EUR 64, want je telt 25% van de koers op bij je limiet",
                "EUR 55, want je rondt de marge voor de zekerheid af naar boven",
                "EUR 60, want je betaalt maximaal 75% van de geschatte waarde",
                "EUR 100, want een kwaliteitsbedrijf mag een premie kosten",
              ],
              correctIndex: 2,
              explanation:
                "Een marge van 25% betekent: maximaal 100% - 25% = 75% van de geschatte waarde betalen. EUR 80 x 0,75 = EUR 60. De andere opties rekenen de marge verkeerd of laten het principe volledig los.",
            },
            {
              question: "Wat is de belangrijkste reden dat waardebeleggers een veiligheidsmarge eisen?",
              options: [
                "Omdat intrinsieke waarde een onzekere schatting is en de marge fouten en tegenvallers opvangt",
                "Omdat een grotere korting altijd een hoger rendement garandeert",
                "Omdat online brokers transactiekosten rekenen die je moet terugverdienen",
                "Omdat aandelen onder hun boekwaarde wettelijk gezien veiliger zijn",
              ],
              correctIndex: 0,
              explanation:
                "De marge is een buffer tegen je eigen feilbaarheid: je aannames over de toekomst kunnen (en zullen soms) verkeerd zijn. Garanties op rendement bestaan niet, transactiekosten zijn hier verwaarloosbaar klein, en boekwaarde heeft geen juridische beschermingsfunctie.",
            },
            {
              question: "Voor welk bedrijf eis je logischerwijs de grootste veiligheidsmarge?",
              options: [
                "Een supermarktketen met dertig jaar stabiele winsten en trouwe klanten",
                "Een scheepsbouwer wiens winst extreem meebeweegt met de wereldeconomie en die net een topjaar achter de rug heeft",
                "Een netbeheerder-achtig bedrijf met gereguleerde, voorspelbare inkomsten",
                "Een producent van huismerk-levensmiddelen met langlopende contracten",
              ],
              correctIndex: 1,
              explanation:
                "Hoe onvoorspelbaarder de toekomstige winst, hoe groter de kans dat je schatting ernaast zit, en dus hoe meer buffer je nodig hebt. Een cyclische scheepsbouwer op een winstpiek is notoir lastig te waarderen; stabiele, voorspelbare bedrijven vragen een kleinere (maar nooit geen) marge.",
            },
            {
              question:
                "Een aandeel noteert EUR 45 en jouw voorzichtige waardering komt uit op EUR 50. Je hanteert standaard een marge van 30%. Wat doe je?",
              options: [
                "Kopen: het aandeel is per slot van rekening goedkoper dan het waard is",
                "Kopen, maar de helft van je normale bedrag, als compromis",
                "Je waardering verhogen naar EUR 65, zodat de koers wél binnen je marge valt",
                "Niet kopen: met 30% marge is je kooplimiet EUR 35, dus je zet het aandeel op je watchlist en wacht af",
              ],
              correctIndex: 3,
              explanation:
                "EUR 50 x 0,70 = EUR 35: dat is je limiet, en EUR 45 ligt daar ruim boven. Een korting van 10% is te dun om schattingsfouten op te vangen. Optie 3 is precies de valkuil die discipline moet voorkomen: je aannames oprekken tot de conclusie bevalt.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "de-praktijk",
      title: "De praktijk",
      description:
        "Filosofie zonder gereedschap blijft theorie. In deze module duik je in jaarverslagen, kengetallen en kwaliteitskenmerken: alles wat je nodig hebt om zelf te beoordelen of een bedrijf ondergewaardeerd is, of gewoon terecht goedkoop.",
      lessons: [
        {
          slug: "jaarverslagen-lezen",
          title: "Jaarverslagen lezen zonder hoofdpijn",
          durationMin: 9,
          intro:
            "Een jaarverslag van 200 pagina's kan behoorlijk intimiderend ogen. Goed nieuws: je hoeft het niet van kaft tot kaft te lezen. Als je drie overzichten begrijpt, de balans, de winst-en-verliesrekening en het kasstroomoverzicht, kun je ieder bedrijf in grote lijnen doorgronden. Deze les maakt van die drie overzichten gewone-mensentaal.",
          sections: [
            {
              heading: "Geen paniek: zo zit een jaarverslag in elkaar",
              paragraphs: [
                "Elk beursgenoteerd bedrijf publiceert jaarlijks een jaarverslag, gratis te vinden op de investor relations-pagina van de bedrijfswebsite. Nederlandse beursbedrijven publiceren meestal in het Engels, maar schrik daar niet van: de cijferoverzichten zijn universeel opgebouwd.",
                "Het grootste deel van zo'n verslag bestaat uit strategieverhalen, duurzaamheidsrapportages en juridische teksten. Belangrijk voor de volledigheid, maar de kern voor jou als belegger zit in de jaarrekening: drie financiële overzichten plus de toelichting daarop. Die drie vertellen samen het hele verhaal.",
                "Een handig ezelsbruggetje: de balans is een foto, de winst-en-verliesrekening is een film, en het kasstroomoverzicht is de leugendetector. Hieronder lopen we ze een voor een langs.",
              ],
            },
            {
              heading: "De balans: een foto van bezit en schuld",
              paragraphs: [
                "De balans toont op één peildatum, meestal 31 december, wat een bedrijf bezit (activa), wat het schuldig is (verplichtingen) en wat er voor de aandeelhouders overblijft (eigen vermogen). De formule is altijd: bezittingen = schulden + eigen vermogen.",
                "Vergelijk het met een huishouden. Stel, je koopt een huis van EUR 350.000 met een hypotheek van EUR 250.000. Je bezit is dan EUR 350.000, je schuld EUR 250.000 en je eigen vermogen EUR 100.000. Bij een bedrijf werkt het exact zo, alleen heten de posten anders: fabrieken, voorraden en kasgeld aan de ene kant, leningen en openstaande rekeningen aan de andere.",
                "Waar let een waardebelegger op? Vooral op de verhouding tussen schuld en eigen vermogen, op de hoeveelheid kasgeld, en op de post goodwill: betaalde overnamepremies die op de balans staan als bezit, maar die bij tegenvallende overnames ineens afgeboekt kunnen worden. Een balans vol goodwill en schuld is een stuk fragieler dan hij lijkt.",
              ],
              example: {
                title: "De balans van Bakkerij De Korenschoof NV",
                body:
                  "Fictief voorbeeld: De Korenschoof heeft EUR 800 miljoen aan bezittingen (ovens, winkelpanden, voorraden, kasgeld) en EUR 620 miljoen aan verplichtingen (bankleningen, nog te betalen facturen, pensioenverplichtingen). Het eigen vermogen is dan EUR 800 - EUR 620 = EUR 180 miljoen. Zijn er 18 miljoen aandelen, dan is de boekwaarde per aandeel EUR 10. Dat getal kom je in les 5 weer tegen bij de koers/boekwaarde.",
              },
            },
            {
              heading: "De winst-en-verliesrekening: de film van het jaar",
              paragraphs: [
                "Waar de balans één moment vastlegt, vertelt de winst-en-verliesrekening wat er gedurende het hele jaar gebeurde. Bovenaan staat de omzet: alles wat het bedrijf aan klanten factureerde. Daar gaan achtereenvolgens de kosten vanaf: inkoop, personeel, marketing, afschrijvingen, rente en belasting. Onderaan de streep blijft de nettowinst over.",
                "Interessanter dan de absolute winst zijn de marges. De nettomarge (nettowinst gedeeld door omzet) vertelt je hoeveel centen van elke omzet-euro als winst overblijven. Draait De Korenschoof EUR 500 miljoen omzet en EUR 40 miljoen nettowinst, dan is de nettomarge 8%: van elke euro omzet blijft 8 cent over.",
                "Kijk vooral naar de ontwikkeling over meerdere jaren. Stijgende marges wijzen vaak op prijszettingsmacht of slimme kostenbeheersing; structureel dalende marges zijn een signaal dat de concurrentie het bedrijf inhaalt. Eén los jaar zegt weinig, een trend van vijf jaar des te meer.",
              ],
            },
            {
              heading: "Het kasstroomoverzicht: de leugendetector",
              paragraphs: [
                "Winst is een boekhoudkundige mening, kasstroom is een feit. De winst-en-verliesrekening bevat schattingen en keuzes (afschrijvingstermijnen, voorzieningen, nog niet betaalde facturen die al als omzet tellen), maar het kasstroomoverzicht laat zien hoeveel geld er daadwerkelijk binnenkwam en uitging. Daarom is dit het favoriete overzicht van veel waardebeleggers.",
                "Het overzicht kent drie delen: de operationele kasstroom (geld uit de gewone bedrijfsvoering), de investeringskasstroom (geld naar machines, gebouwen en overnames) en de financieringskasstroom (leningen, dividend, aandeleninkoop). Vooral die eerste is goud waard: een gezond bedrijf pompt jaar na jaar meer geld uit zijn activiteiten dan het erin stopt.",
                "De klassieke rode vlag: een bedrijf rapporteert keurige winsten, maar de operationele kasstroom is jaar na jaar negatief of veel lager dan de winst. Dat kan betekenen dat klanten niet betalen, dat voorraden zich opstapelen of dat de winst boekhoudkundig is opgepoetst. Papieren winst zonder echte kasstroom heeft al vaak tot pijnlijke verrassingen geleid, dus zie zo'n patroon als een signaal om extra kritisch te zijn.",
              ],
            },
            {
              heading: "Een leesroutine die werkt",
              paragraphs: [
                "Met deze basis kun je een jaarverslag gericht doorwerken in plaats van erin te verdrinken. Reken op een uur voor je eerste kennismaking met een bedrijf; dat is geen verloren tijd maar de kern van je huiswerk als waardebelegger.",
                "Belangrijker nog dan de volgorde: vergelijk altijd meerdere jaren. Pak minimaal drie, liefst vijf jaarverslagen en zet omzet, marges, schuld en operationele kasstroom naast elkaar. Trends onthullen wat één enkel jaar verbergt.",
              ],
              bullets: [
                "Stap 1: lees de brief van de CEO, maar met een kritische blik: worden problemen benoemd of weggemoffeld?",
                "Stap 2: bekijk het kasstroomoverzicht: verdient het bedrijf echt geld met zijn activiteiten?",
                "Stap 3: scan de balans op schuld, kasgeld en goodwill",
                "Stap 4: volg omzet en marges in de winst-en-verliesrekening over meerdere jaren",
                "Stap 5: duik in de toelichting bij alles wat opvalt, daar staan de details die de hoofdcijfers verklaren",
              ],
            },
          ],
          bookRefs: [
            {
              title: "De aandeelhoudersbrieven van Berkshire Hathaway",
              author: "Warren Buffett",
              note: "Buffett legt in zijn brieven boekhoudkundige begrippen uit in verrassend gewone taal, inclusief de trucs waarmee bedrijven hun cijfers mooier laten lijken. Gratis online te lezen.",
            },
            {
              title: "The Intelligent Investor",
              author: "Benjamin Graham",
              year: 1949,
              note: "Graham hamert op het zelf lezen van de jaarrekening in plaats van vertrouwen op verhalen: het fundament onder deze hele les.",
            },
          ],
          keyTakeaways: [
            "Drie overzichten vertellen het hele verhaal: de balans (foto), de winst-en-verliesrekening (film) en het kasstroomoverzicht (leugendetector)",
            "Eigen vermogen = bezittingen min schulden; let op de balans vooral op schuldniveau, kasgeld en goodwill",
            "Marges en hun trend over meerdere jaren zeggen meer dan de absolute winst van één jaar",
            "Winst is een mening, kasstroom een feit: winst zonder bijpassende operationele kasstroom is een rode vlag",
          ],
          quiz: [
            {
              question: "Welk overzicht laat zien wat een bedrijf op één specifiek moment bezit en schuldig is?",
              options: [
                "De winst-en-verliesrekening",
                "Het kasstroomoverzicht",
                "De balans",
                "Het directieverslag",
              ],
              correctIndex: 2,
              explanation:
                "De balans is de 'foto' op de peildatum: bezittingen aan de ene kant, schulden en eigen vermogen aan de andere. De winst-en-verliesrekening en het kasstroomoverzicht beschrijven juist wat er gedurende het jaar gebeurde, en het directieverslag is tekst, geen cijferoverzicht.",
            },
            {
              question:
                "Een bedrijf rapporteert voor het derde jaar op rij EUR 40 miljoen nettowinst, maar de operationele kasstroom is elk jaar negatief. Wat is de beste interpretatie?",
              options: [
                "Prima teken: winst is belangrijker dan kasstroom",
                "Een serieuze rode vlag: de winst wordt blijkbaar niet omgezet in echt geld, dus je moet uitzoeken waar dat door komt",
                "Normaal verschijnsel: winst en kasstroom horen nooit op elkaar te lijken",
                "Goed nieuws: een negatieve kasstroom betekent dat het bedrijf veel investeert in groei",
              ],
              correctIndex: 1,
              explanation:
                "Winst zonder operationele kasstroom kan wijzen op niet-betalende klanten, groeiende voorraden of opgepoetste cijfers. Let op: optie 4 verwart de operationele kasstroom met de investeringskasstroom; investeringen in groei staan in dat tweede deel van het overzicht.",
            },
            {
              question:
                "Een bedrijf heeft EUR 800 miljoen aan bezittingen en EUR 620 miljoen aan verplichtingen. Hoeveel bedraagt het eigen vermogen?",
              options: [
                "EUR 1.420 miljoen, want je telt beide posten op",
                "EUR 620 miljoen, want de schulden bepalen het eigen vermogen",
                "EUR 800 miljoen, want alle bezittingen zijn van de aandeelhouders",
                "EUR 180 miljoen, want eigen vermogen is bezittingen min schulden",
              ],
              correctIndex: 3,
              explanation:
                "De balansformule: bezittingen = schulden + eigen vermogen, dus eigen vermogen = EUR 800 - EUR 620 = EUR 180 miljoen. Net als bij een huis met hypotheek: wat overblijft na aftrek van de schuld is van jou.",
            },
            {
              question: "Waarom vergelijk je bij het lezen van jaarverslagen bij voorkeur drie tot vijf jaren in plaats van één?",
              options: [
                "Omdat trends in omzet, marges en kasstroom onthullen wat één enkel jaar kan verbergen of flatteren",
                "Omdat jaarverslagen pas na vijf jaar juridisch definitief zijn",
                "Omdat oudere jaarverslagen betrouwbaarder zijn dan recente",
                "Omdat je alleen zo de koersontwikkeling van het aandeel kunt voorspellen",
              ],
              correctIndex: 0,
              explanation:
                "Eén jaar kan vertekend zijn door meevallers, eenmalige posten of een toevallige piek. Een reeks jaren toont de richting: groeien de marges, loopt de schuld op, blijft de kasstroom gezond? De andere opties zijn simpelweg onjuist: verslagen zijn direct definitief en koersvoorspellingen doet een jaarverslag niet.",
            },
            {
              question:
                "Je scant de balans van een overnamehongerig bedrijf en ziet dat goodwill veruit de grootste bezitting is, naast een flinke schuldpositie. Waarom is dat opletten geblazen?",
              options: [
                "Goodwill is kasgeld dat vastzit op een spaarrekening en dus weinig oplevert",
                "Goodwill betekent dat het bedrijf zijn merknaam heeft verkocht aan een concurrent",
                "Goodwill vertegenwoordigt betaalde overnamepremies: valt een overname tegen, dan kan die post ineens worden afgeboekt en verdampt een deel van het eigen vermogen",
                "Goodwill is verboden onder Europese boekhoudregels en wijst op fraude",
              ],
              correctIndex: 2,
              explanation:
                "Goodwill ontstaat wanneer een bedrijf bij een overname meer betaalt dan de boekwaarde van het gekochte bedrijf. Presteert de overname slecht, dan volgt een afboeking die het eigen vermogen raakt. Gecombineerd met veel schuld maakt dat een balans fragieler dan hij op het eerste gezicht lijkt. Goodwill is legaal en heeft niets met kasgeld of merkverkoop te maken.",
            },
          ],
          xp: 50,
        },
        {
          slug: "kengetallen",
          title: "Kengetallen: K/W, koers/boekwaarde en meer",
          durationMin: 9,
          intro:
            "Kengetallen zijn de meetlinten van de waardebelegger: ze vertalen een beurskoers naar iets betekenisvols. Hoeveel betaal je eigenlijk per euro winst? En per euro eigen vermogen? In deze les leer je de vier belangrijkste maatstaven gebruiken, mét hun valkuilen, want een kengetal zonder context is gevaarlijker dan geen kengetal.",
          sections: [
            {
              heading: "De koers-winstverhouding (K/W)",
              paragraphs: [
                "De koers-winstverhouding, internationaal de P/E ratio, is het bekendste kengetal ter wereld. Je deelt de beurskoers door de winst per aandeel. Noteert een aandeel op EUR 45 en bedraagt de winst per aandeel EUR 3, dan is de K/W 15: je betaalt vijftien keer de jaarwinst.",
                "Je kunt de K/W ook omdraaien naar een winstrendement: 1 gedeeld door 15 is ongeveer 6,7%. Zo kun je een aandeel gevoelsmatig vergelijken met bijvoorbeeld de rente op je spaarrekening, met één groot verschil: bedrijfswinsten kunnen groeien, maar ook krimpen of verdwijnen. Dat verschil heet risico.",
                "Een hoge K/W betekent dat de markt veel groei verwacht; een lage K/W betekent lage verwachtingen, terecht of onterecht. Daar zit je kans als waardebelegger, maar ook de grootste valkuil: de W in de formule is de winst van nu, en juist die kan bedrieglijk zijn. Eenmalige boekwinsten of een cyclische piek maken de K/W kunstmatig laag.",
              ],
              example: {
                title: "De kraanbouwer met de verleidelijke K/W",
                body:
                  "Hijskranenbouwer Hein NV noteert op EUR 40 en verdiende afgelopen topjaar EUR 5 per aandeel: K/W 8, spotgoedkoop! Maar de bouwsector zit op een piek. Zakt de winst in een normaal jaar terug naar EUR 2 per aandeel, dan is de 'echte' K/W bij dezelfde koers ineens 20. Bij cyclische bedrijven is een lage K/W op piekwinst dus vaak een optische illusie. Kijk daarom naar de gemiddelde winst over een hele cyclus van pakweg 7 tot 10 jaar.",
              },
            },
            {
              heading: "Koers/boekwaarde (K/B)",
              paragraphs: [
                "De koers/boekwaarde vergelijkt de beurskoers met het eigen vermogen per aandeel, de boekwaarde die je in les 4 leerde berekenen. Noteert een bank op EUR 32 terwijl de boekwaarde EUR 40 per aandeel is, dan is de K/B 0,8: je koopt elke euro eigen vermogen voor 80 cent.",
                "Dit was Grahams favoriete jachtterrein: bedrijven die minder kostten dan hun bezittingen minus schulden. Vandaag werkt de K/B nog steeds goed bij banken, verzekeraars en andere bedrijven waarvan de bezittingen vooral financieel of tastbaar zijn en redelijk objectief te waarderen.",
                "Maar bij moderne bedrijven schiet de K/B vaak tekort. De echte waarde van een softwarebedrijf of sterk merk zit in zaken die grotendeels níét op de balans staan: zelf opgebouwde merkkracht, software, klantrelaties. Zo'n bedrijf kan een K/B van 8 hebben en toch redelijk gewaardeerd zijn. Gebruik de K/B dus sectorbewust en vergelijk alleen soortgenoten met soortgenoten.",
              ],
            },
            {
              heading: "Dividendrendement en schuldratio's",
              paragraphs: [
                "Het dividendrendement is het jaarlijkse dividend gedeeld door de koers. Keert een bedrijf EUR 1,50 per aandeel uit bij een koers van EUR 30, dan is het dividendrendement 5%. Voor waardebeleggers is dividend prettig: je krijgt alvast een deel van je rendement in handen terwijl je wacht tot de markt de onderwaardering inziet.",
                "Maar pas op met extreem hoge dividendrendementen. Zie je ergens 12% staan, dan prijst de markt meestal in dat het dividend verlaagd of geschrapt gaat worden. Check daarom altijd of het dividend wordt gedekt door de operationele kasstroom en hoe hoog de payout ratio is: welk deel van de winst wordt uitgekeerd. Boven de 80% wordt het krap.",
                "Vergeet ten slotte de schulden niet, want schuld maakt elke tegenslag zwaarder. Twee praktische maatstaven: de nettoschuld gedeeld door het brutobedrijfsresultaat (EBITDA), waar boven de 3 het licht op oranje springt, en de rentedekking: hoe vaak kan het bedrijf zijn rentelasten betalen uit de operationele winst? Comfortabel is minstens 5 keer.",
              ],
              bullets: [
                "Dividendrendement = dividend per aandeel / koers; extreem hoge percentages zijn een waarschuwing, geen cadeau",
                "Payout ratio boven de 80% betekent weinig buffer om het dividend vol te houden",
                "Nettoschuld/EBITDA boven de 3: verhoogde waakzaamheid",
                "Rentedekking van minstens 5 keer geeft comfort bij tegenwind",
              ],
            },
            {
              heading: "De value trap: goedkoop met een reden",
              paragraphs: [
                "Nu de belangrijkste waarschuwing van deze les. Sommige aandelen zien er op alle kengetallen spotgoedkoop uit en zijn toch een slechte koop, omdat het bedrijf structureel in verval is. Denk aan uitgevers van papieren kranten of postorderbedrijven rond 2010: elke K/W leek laag, maar de W kelderde elk jaar verder, en de koers erachteraan. Dat is de value trap.",
                "Het mechanisme is verraderlijk: kengetallen kijken naar het heden en verleden, terwijl waarde over de toekomst gaat. Een K/W van 6 is geen koopje als de winst over vijf jaar gehalveerd is; dan betaalde je achteraf gewoon twaalf keer de winst voor een krimpend bedrijf.",
                "Joel Greenblatt vatte de oplossing kernachtig samen: koop niet zomaar goedkope bedrijven, koop goede bedrijven tegen een goedkope prijs. Zijn 'magic formula' combineert daarom een waarderingsmaatstaf met een kwaliteitsmaatstaf (het rendement op geïnvesteerd kapitaal). Hoe je die kwaliteit herkent, is precies het onderwerp van de volgende les.",
              ],
              bullets: [
                "Daalt de omzet al meerdere jaren op rij? Grote kans op een structureel probleem in plaats van een tijdelijke dip",
                "Hoge schulden plus krimpende winst: de gevaarlijkste combinatie",
                "Wordt het product bedreigd door een technologische verschuiving? Dan zijn oude winsten geen gids voor de toekomst",
                "Vraag altijd: waaróm is dit aandeel goedkoop, en is die reden tijdelijk of blijvend?",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book That Still Beats the Market",
              author: "Joel Greenblatt",
              year: 2010,
              note: "Greenblatts magic formula combineert 'goedkoop' met 'goed' en is daarmee het beste medicijn tegen value traps dat in één dun boekje past.",
            },
            {
              title: "The Intelligent Investor",
              author: "Benjamin Graham",
              year: 1949,
              note: "De oorsprong van het denken in kengetallen en het kopen onder de boekwaarde, inclusief Grahams eigen waarschuwingen tegen schijnkoopjes.",
            },
          ],
          keyTakeaways: [
            "K/W = koers / winst per aandeel: je betaalt x keer de jaarwinst; bij cyclische bedrijven kijk je naar de gemiddelde winst over een hele cyclus",
            "K/B werkt goed bij banken en bezittingen-zware bedrijven, maar onderschat bedrijven waarvan de waarde niet op de balans staat",
            "Een extreem hoog dividendrendement is meestal een waarschuwing; check dekking door kasstroom en de payout ratio",
            "Schuld verergert alles: let op nettoschuld/EBITDA (boven 3 is oranje) en rentedekking (minstens 5 keer is comfortabel)",
            "Een value trap lijkt goedkoop op oude cijfers terwijl de toekomst verslechtert; vraag altijd waaróm iets goedkoop is",
          ],
          quiz: [
            {
              question: "Een aandeel noteert op EUR 45 en de winst per aandeel is EUR 3. Wat is de koers-winstverhouding?",
              options: [
                "K/W 15: je betaalt vijftien keer de jaarwinst",
                "K/W 42: koers min winst per aandeel",
                "K/W 6,7: winst gedeeld door koers, keer honderd",
                "K/W 135: koers keer winst per aandeel",
              ],
              correctIndex: 0,
              explanation:
                "K/W = koers / winst per aandeel = 45 / 3 = 15. Optie 3 beschrijft het omgekeerde, het winstrendement (3/45 is ongeveer 6,7%), wat een nuttig getal is maar geen K/W. De andere opties zijn rekenkundig onzinnig.",
            },
            {
              question:
                "Twee bedrijven hebben allebei een K/W van 8: een supermarktketen met stabiele winsten en een kraanbouwer die net een recordjaar draaide. Waarom is voorzichtigheid geboden bij de kraanbouwer?",
              options: [
                "Kraanbouwers hebben altijd hogere schulden dan supermarkten",
                "Zijn winst staat op een cyclische piek: zakt die terug naar normaal, dan blijkt de werkelijke K/W veel hoger dan 8",
                "Een K/W van 8 is voor industriële bedrijven wettelijk gezien te laag",
                "Supermarkten betalen meer dividend en zijn daarom altijd de betere keuze",
              ],
              correctIndex: 1,
              explanation:
                "Bij cyclische bedrijven flatteren piekwinsten de K/W. Halveert de winst in een normaal jaar, dan verdubbelt de K/W bij gelijke koers. Daarom rekenen waardebeleggers bij cyclische bedrijven met de gemiddelde winst over een hele cyclus. De andere opties zijn generalisaties of onzin (er bestaat geen wettelijke K/W).",
            },
            {
              question:
                "Een aandeel keert EUR 2 dividend per jaar uit bij een koers van EUR 25: een dividendrendement van 8%, veel meer dan de spaarrente. Wat controleer je vóórdat je enthousiast wordt?",
              options: [
                "Of de koers het afgelopen jaar is gestegen, want dat bevestigt de kwaliteit",
                "Niets: 8% is objectief beter dan elke spaarrekening",
                "Of het dividend houdbaar is: wordt het gedekt door de operationele kasstroom en hoe hoog is de payout ratio?",
                "Of andere beleggers op forums ook enthousiast zijn over het aandeel",
              ],
              correctIndex: 2,
              explanation:
                "Een opvallend hoog dividendrendement betekent vaak dat de markt een dividendverlaging verwacht: de koers is gedaald omdat beleggers twijfelen. Dekking door kasstroom en een gezonde payout ratio vertellen of het dividend vol te houden is. Koersstijging of sentiment op forums zegt daarover niets, en 'niets checken' is precies hoe beleggers in de dividendval trappen.",
            },
            {
              question: "Voor welk type bedrijf is de koers/boekwaarde het meest betekenisvol?",
              options: [
                "Een softwarebedrijf waarvan de waarde vooral in zelfontwikkelde technologie zit",
                "Een reclamebureau dat draait op talent en klantrelaties",
                "Een bank waarvan de bezittingen vooral uit financiële activa bestaan die redelijk objectief te waarderen zijn",
                "Een merkenbedrijf waarvan de merknaam het waardevolste bezit is",
              ],
              correctIndex: 2,
              explanation:
                "K/B vergelijkt de koers met het eigen vermogen op de balans. Dat werkt het best wanneer de bezittingen ook echt op de balans staan én betrouwbaar gewaardeerd zijn, zoals bij banken en verzekeraars. Zelfontwikkelde software, talent en merkkracht staan grotendeels níét op de balans, waardoor de K/B die bedrijven structureel 'te duur' laat lijken.",
            },
            {
              question: "Wat is de beste omschrijving van een value trap?",
              options: [
                "Een aandeel dat er op kengetallen goedkoop uitziet, maar waarvan de onderliggende winstkracht structureel afkalft, zodat het koopje een illusie blijkt",
                "Een aandeel met een hoge K/W dat door groei toch een goede belegging wordt",
                "Een aandeel dat tijdelijk daalt door marktpaniek terwijl het bedrijf gezond blijft",
                "Een aandeel dat geen dividend uitkeert en daarom onaantrekkelijk is voor waardebeleggers",
              ],
              correctIndex: 0,
              explanation:
                "De trap zit hem in het verschil tussen verleden en toekomst: de kengetallen zijn gebaseerd op oude winsten, terwijl de toekomstige winsten krimpen. Optie 3 beschrijft juist een klassieke kans (prijs daalt, waarde niet), en dividend is geen voorwaarde voor waarde.",
            },
          ],
          xp: 50,
        },
        {
          slug: "moats-en-management",
          title: "Kwaliteit herkennen: slotgrachten en management",
          durationMin: 8,
          intro:
            "Goedkoop kopen is het halve werk; de andere helft is zorgen dat je iets góéds koopt. In deze slotles leer je waar Warren Buffett en Philip Fisher naar zoeken: bedrijven met een economische slotgracht die de winsten jarenlang beschermt, geleid door managers die zich gedragen als eerlijke partners van hun aandeelhouders.",
          sections: [
            {
              heading: "Wat is een economische slotgracht?",
              paragraphs: [
                "Warren Buffett vergelijkt een goed bedrijf met een kasteel: de winstgevendheid is de schat binnenin, en concurrenten zijn de belegeraars die de schat willen plunderen. Wat het kasteel beschermt, is de slotgracht, in beleggersjargon de economic moat: een duurzaam concurrentievoordeel dat anderen buiten de deur houdt.",
                "Waarom is die gracht zo belangrijk? Omdat hoge winsten in een vrije markt normaal gesproken concurrentie aantrekken. Verdient een bedrijf uitzonderlijk goed, dan duiken er kapers op die het kunstje kopiëren en de marges omlaag concurreren. Alleen bedrijven met een echte slotgracht ontsnappen aan die zwaartekracht en blijven jaar na jaar bovengemiddeld verdienen.",
                "Voor waardebeleggers is de moat direct gekoppeld aan waarde: hoe langer een bedrijf zijn hoge rendementen kan vasthouden, hoe meer toekomstige winst er is om vandaag te waarderen. Een brede slotgracht is bovendien zelf een vorm van veiligheidsmarge, zoals je in les 3 zag.",
              ],
            },
            {
              heading: "De vijf klassieke slotgrachten",
              paragraphs: [
                "Slotgrachten komen in een handvol herkenbare vormen. Meestal heeft een sterk bedrijf er één of twee; de allersterkste combineren er meerdere. Het gaat er niet om dat je het etiket kunt plakken, maar dat je begrijpt waaróm klanten niet weglopen en concurrenten niet binnenkomen.",
                "Belangrijk: een slotgracht moet je kunnen terugzien in de cijfers. Een bedrijf dat al tien jaar hoge rendementen op zijn kapitaal en stabiele of stijgende marges laat zien, ondanks concurrentie, bewijst daarmee dat er écht een gracht ligt. Het scherpste bewijs is prijszettingsmacht: kan het bedrijf zijn prijzen verhogen zonder klanten te verliezen? Mooie verhalen zonder die cijfermatige sporen zijn slechts marketing.",
              ],
              bullets: [
                "Netwerkeffecten: elke extra gebruiker maakt het product waardevoller, denk aan marktplaatsen en betaalnetwerken",
                "Overstapkosten: klanten zitten praktisch vast, zoals bedrijven die al hun administratie in één softwarepakket hebben",
                "Sterke merken: klanten betalen vrijwillig meer voor het vertrouwde merk, de reden dat Buffett Coca-Cola kocht",
                "Kostenvoordelen en schaal: de grootste speler produceert het goedkoopst en kan iedereen ondersnijden",
                "Vergunningen, patenten en unieke kennis: van farmapatenten tot de technologische voorsprong van chipmachinemakers",
              ],
            },
            {
              heading: "Scuttlebutt: onderzoek als een journalist",
              paragraphs: [
                "Philip Fisher, naast Graham de tweede grote leermeester van Buffett, voegde iets toe wat je in geen enkele jaarrekening vindt: praat met mensen. Zijn scuttlebutt-methode (vrij vertaald: de geruchtenmachine bij het koffiezetapparaat) komt neer op onderzoek doen bij iedereen rond het bedrijf: klanten, leveranciers, concurrenten en oud-werknemers.",
                "Fishers favoriete vraag aan een concurrent was verrassend simpel: welk bedrijf in jullie sector bewonder je het meest, en waarom? Als concurrenten met tegenzin steeds hetzelfde bedrijf noemen, weet je dat daar iets bijzonders zit. Cijfers vertellen je wat er gebeurd is; scuttlebutt vertelt je waarom, en of het houdbaar is.",
                "Als particulier heb je hier tegenwoordig meer mogelijkheden voor dan Fisher ooit had. Lees klantreviews en vergelijkingssites, test het product zelf, bekijk wat medewerkers op vacature- en reviewsites over de werksfeer schrijven, en volg vakbladen of gebruikersforums. Een middag scuttlebutt geeft je een gevoel voor een bedrijf dat geen kengetal je kan geven.",
              ],
              example: {
                title: "Scuttlebutt in de praktijk: de webwinkel",
                body:
                  "Stel, je onderzoekt een beursgenoteerde webwinkel. De cijfers ogen prima, maar wat zegt de buitenwereld? Je leest honderden recente klantreviews (worden bezorgproblemen structureel?), vergelijkt prijzen en levertijden met twee concurrenten, bestelt zelf eens iets en probeert de klantenservice uit, en scant medewerkersreviews op signalen van chaos of vertrekkend personeel. Kosten: één zaterdagmiddag. Opbrengst: je weet of de mooie marges uit het jaarverslag verdedigd worden door tevreden klanten, of dat er scheuren in de gracht zitten die de cijfers nog niet tonen.",
              },
            },
            {
              heading: "Management: partners of zakkenvullers?",
              paragraphs: [
                "Als aandeelhouder vertrouw je je geld toe aan het management. Buffett stelt daarom drie eisen aan de mensen aan de top: ze moeten bekwaam zijn, integer, en het kapitaal van aandeelhouders verstandig besteden. Vooral dat laatste, kapitaalallocatie, wordt onderschat: elke euro winst kan worden geherinvesteerd, uitgekeerd of verspild aan een prestige-overname.",
                "Hoe beoordeel je dat van buitenaf? Lees de aandeelhoudersbrieven van meerdere jaren achter elkaar. Eerlijk management benoemt fouten expliciet; Buffett zelf bespreekt zijn missers uitgebreid in zijn brieven, en juist dat maakt de rest geloofwaardig. Kijk ook of bestuurders zelf een betekenisvol aandelenbelang hebben: wie eigen geld naast dat van jou heeft staan, denkt vaker als eigenaar.",
                "Minstens zo belangrijk zijn de rode vlaggen. Geen enkele vlag is op zichzelf een doodvonnis, maar stapelen ze zich op, dan geldt voor waardebeleggers een simpele regel: twijfel over de integriteit van het management is reden genoeg om verder te kijken. Er zijn genoeg andere bedrijven; geen enkel koopje is de samenwerking met onbetrouwbare partners waard.",
              ],
              bullets: [
                "Doelen worden telkens stilletjes bijgesteld en elk kwartaal draait om 'aangepaste' winstcijfers waar de echte kosten uit zijn gefilterd",
                "Serie-overnames met veel goodwill, gevolgd door afboekingen een paar jaar later",
                "Beloning van de top stijgt fors terwijl de resultaten dalen",
                "Opvallend veel wisselingen in de financiële top (CFO) of van accountant",
                "Bestuurders verkopen grote pakketten eigen aandelen terwijl ze publiekelijk optimistisch zijn",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Common Stocks and Uncommon Profits",
              author: "Philip Fisher",
              year: 1958,
              note: "De bron van de scuttlebutt-methode en Fishers beroemde vijftien punten voor kwaliteitsbedrijven. Buffett noemt zichzelf deels een leerling van Fisher.",
            },
            {
              title: "De aandeelhoudersbrieven van Berkshire Hathaway",
              author: "Warren Buffett",
              note: "Dé leerschool voor het beoordelen van moats en management, geschreven door de meester zelf, inclusief openhartige analyses van zijn eigen fouten. Gratis online te lezen.",
            },
          ],
          keyTakeaways: [
            "Een economische slotgracht is een duurzaam concurrentievoordeel dat hoge winsten beschermt tegen concurrentie",
            "De vijf klassieke grachten: netwerkeffecten, overstapkosten, merken, kostenvoordelen en vergunningen of patenten; echte grachten zie je terug in jarenlang hoge rendementen en prijszettingsmacht",
            "Fishers scuttlebutt: onderzoek het bedrijf via klanten, concurrenten en (oud-)medewerkers; reviews en forums zijn je moderne gereedschap",
            "Beoordeel management op eerlijkheid over fouten, eigen aandelenbezit en verstandige kapitaalallocatie; bij twijfel over integriteit loop je door",
          ],
          quiz: [
            {
              question: "Wat is het sterkste bewijs dat een bedrijf een echte economische slotgracht heeft?",
              options: [
                "Het bedrijf had vorig jaar de snelste omzetgroei van zijn sector",
                "Het behaalt al tien jaar hoge rendementen op zijn kapitaal en kan prijzen verhogen zonder klanten te verliezen",
                "De CEO benoemt het woord 'moat' regelmatig in interviews en presentaties",
                "Het aandeel is het afgelopen jaar harder gestegen dan de AEX",
              ],
              correctIndex: 1,
              explanation:
                "Een slotgracht moet zichtbaar zijn in de cijfers: langdurig hoge rendementen ondanks concurrentie, en prijszettingsmacht als scherpste test. Eén jaar snelle groei kan iedereen overkomen, mooie woorden zijn marketing, en een koersstijging zegt iets over sentiment, niet over het bedrijf.",
            },
            {
              question: "Welk bedrijf profiteert het duidelijkst van overstapkosten als slotgracht?",
              options: [
                "Een populair lunchcafé in het centrum van Utrecht",
                "Een kledingwinkelketen met scherpe prijzen",
                "Een leverancier van salaris- en boekhoudsoftware waar duizenden bedrijven hun volledige administratie in hebben staan",
                "Een producent van huismerk-frisdrank voor supermarkten",
              ],
              correctIndex: 2,
              explanation:
                "Wie zijn complete administratie in één pakket heeft, kijkt wel drie keer uit voordat hij overstapt: migratie kost tijd, geld en risico. Bij een café, kledingwinkel of huismerkproducent stapt de klant morgen kosteloos over; daar is geen gracht, hooguit een gunfactor.",
            },
            {
              question: "Welke onderzoeksactie past het best bij Fishers scuttlebutt-methode?",
              options: [
                "De koersgrafiek van de afgelopen vijf jaar bestuderen op patronen",
                "Wachten op het volgende jaarverslag en de kengetallen opnieuw doorrekenen",
                "Alleen de koopadviezen van drie zakenbanken naast elkaar leggen",
                "Klantreviews doorspitten, het product zelf uitproberen en lezen wat (oud-)medewerkers over het bedrijf schrijven",
              ],
              correctIndex: 3,
              explanation:
                "Scuttlebutt draait om informatie van buiten de jaarrekening: de ervaringen van klanten, medewerkers, leveranciers en concurrenten. Koersgrafieken en analistenrapporten zijn afgeleide meningen, en kengetallen heb je al; Fisher zocht juist het verhaal áchter die cijfers.",
            },
            {
              question: "Welke waarneming is een rode vlag bij de beoordeling van management?",
              options: [
                "De CEO analyseert in de aandeelhoudersbrief uitgebreid een mislukte overname en wat ervan is geleerd",
                "Bestuurders bezitten zelf voor miljoenen aan aandelen van het bedrijf",
                "De winstdoelen worden telkens stilletjes verlaagd, terwijl de communicatie vooral draait om 'aangepaste' cijfers waar de tegenvallers uit zijn gefilterd",
                "Het bedrijf keert al vijftien jaar een stabiel, door kasstroom gedekt dividend uit",
              ],
              correctIndex: 2,
              explanation:
                "Steeds verschuivende doelpalen en een fixatie op opgepoetste 'aangepaste' winstcijfers wijzen op een management dat de werkelijkheid maskeert. Fouten eerlijk bespreken is juist een positief signaal (Buffett doet het zelf), net als eigen aandelenbezit en een houdbaar dividend.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
