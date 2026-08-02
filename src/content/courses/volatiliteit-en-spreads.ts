import type { Course } from "../types";

const course: Course = {
  slug: "volatiliteit-en-spreads",
  title: "Volatiliteit & Spreads",
  subtitle: "De Grieken, de prijs van onzekerheid en strategieën met vangrails",
  description:
    "Voor wie opties wil begrijpen zoals de tegenpartij ze begrijpt. Je leert de Grieken lezen, implied volatility zien als het echte prijskaartje van een optie, en spreads bouwen waarvan de risico's vóóraf vaststaan. Eerlijke voorwaarde: deze cursus veronderstelt dat je de kennis uit Opties Begrijpen én Beschermen & Verdienen met Opties beheerst.",
  level: "Expert",
  accent: "petrol",
  icon: "activity",
  price: "€49",
  order: 7,
  learnPoints: [
    "Wat delta, gamma, theta en vega je vertellen over elke optiepositie, en hoe je ze samen leest als één verhaal",
    "Implied volatility begrijpen als het echte prijskaartje van een optie, inclusief skew en de beruchte IV-crush",
    "Spreads bouwen waarvan maximale winst, maximaal verlies en breakevens vaststaan vóórdat je instapt",
    "Waarom optieschrijvers gemiddeld winnen, en hoe zeldzame staartrisico's dat gemiddelde in dagen kunnen opeten",
    "Marge, brokerregels, transactiekosten en een journaal: de praktische realiteit vóór je ooit een spread opzet",
  ],
  modules: [
    {
      slug: "de-grieken",
      title: "De Grieken",
      description:
        "Elke optiepremie beweegt langs een handvol meetbare gevoeligheden: de Grieken. Wie ze kan lezen, ziet vooraf hoe een positie reageert op koers, tijd en onzekerheid. Deze module maakt van delta, gamma, theta en vega gereedschap in plaats van jargon.",
      lessons: [
        {
          slug: "delta",
          title: "Delta: de richtinggevoeligheid",
          durationMin: 9,
          intro:
            "In de vorige cursussen keek je vooral naar wat een optie waard is op de einddatum. Professionals kijken anders: zij willen weten hoe de premie nú beweegt als de onderliggende koers beweegt. Dat is delta, de eerste en meest gebruikte Griek. In deze les leer je delta lezen op drie manieren: als beweeglijkheidsmaat, als ruwe kansindicatie en als optelsom over je hele portefeuille.",
          sections: [
            {
              heading: "Wat delta meet",
              paragraphs: [
                "Delta vertelt je hoeveel de optiepremie verandert als de onderliggende waarde EUR 1 beweegt. Een calloptie met een delta van 0,50 wordt ruwweg EUR 0,50 meer waard als het aandeel EUR 1 stijgt, en EUR 0,50 minder waard als het EUR 1 daalt. Delta ligt bij calls altijd tussen 0 en 1: de optie kan nooit harder stijgen dan het aandeel zelf.",
                "Neem het rustige, fictieve aandeel Zeewind NV op EUR 40. Een calloptie met uitoefenprijs EUR 40 (at-the-money) heeft typisch een delta rond de 0,50. Een call met uitoefenprijs EUR 34, die al diep in-the-money zit, beweegt bijna één-op-één mee met het aandeel: delta rond de 0,95. En een call met uitoefenprijs EUR 48, ver out-of-the-money, reageert nauwelijks: delta rond de 0,05.",
                "De logica erachter is intuïtief. Een diep in-the-money call is economisch bijna hetzelfde als het aandeel bezitten, dus beweegt hij bijna net zo hard mee. Een verre out-of-the-money call is bijna zeker waardeloos op de einddatum, dus een euro koersbeweging verandert weinig aan dat lot. At-the-money hangt alles nog in de lucht, en daar zit delta in het midden.",
              ],
              bullets: [
                "Calldelta loopt van 0 (ver out-of-the-money) via ongeveer 0,50 (at-the-money) naar 1 (diep in-the-money)",
                "Putdelta is negatief: een put wórdt meer waard als het aandeel daalt, van 0 tot -1",
                "Delta is een momentopname: hij verandert zodra de koers, de tijd of de volatiliteit verandert",
              ],
            },
            {
              heading: "Delta als ruwe kansmeter, met een dikke asterisk",
              paragraphs: [
                "Handelaren gebruiken delta ook als vuistregel voor iets anders: de kans dat de optie in-the-money eindigt. Een call met delta 0,30 zou dan ruwweg 30% kans hebben om op de einddatum boven de uitoefenprijs te sluiten, en een delta van 0,95 betekent 'vrijwel zeker in-the-money'.",
                "Wees hier precies: dit is een ruwe benadering, geen letterlijke kans. Wiskundig zijn delta en de kans op in-the-money eindigen twee nét verschillende grootheden uit hetzelfde model, en dat model leunt bovendien op aannames die niet helemaal kloppen (daarover meer in les 4). Bij korte looptijden en gemiddelde volatiliteit liggen de twee dicht bij elkaar; bij lange looptijden en hoge volatiliteit lopen ze verder uiteen.",
                "Als denkgereedschap is de vuistregel toch waardevol. Wie een call met delta 0,10 koopt, hoort zichzelf te horen zeggen: de markt prijst dit als een kans van grofweg één op tien. Dat mag, maar dan wel bewust, en niet omdat de optie 'lekker goedkoop' oogde.",
              ],
              example: {
                title: "Drie calls op Zeewind NV, drie verhalen",
                body:
                  "Zeewind NV noteert EUR 40. De call EUR 34 (delta 0,95) kost veel premie maar beweegt bijna als het aandeel zelf: dit is de keuze van wie vooral richting wil. De call EUR 40 (delta 0,50) is het klassieke fifty-fifty-verhaal. De call EUR 48 (delta 0,05) kost bijna niets, en dat is geen koopje maar een prijskaartje: de markt schat de kans dat Zeewind vóór de einddatum boven EUR 48 sluit op grofweg 5%. Goedkoop en kansarm zijn hier twee woorden voor hetzelfde.",
              },
            },
            {
              heading: "Delta als hedge-ratio",
              paragraphs: [
                "De tweede professionele lezing van delta: het aantal aandelen dat dezelfde koersgevoeligheid geeft als de optie. Eén optiecontract gaat over 100 aandelen. Een call met delta 0,50 beweegt dus als 100 x 0,50 = 50 aandelen. Wie die call heeft geschréven en het richtingsrisico wil neutraliseren, koopt 50 aandelen ertegenover: de winst op de aandelen compenseert dan (bij kleine bewegingen) het verlies op de geschreven call.",
                "Dit is precies wat marketmakers de hele dag doen. De partij die jouw optie verkoopt, gokt zelden tegen je op richting: ze dekt haar delta direct af met aandelen en verdient aan de geboden-gelaten-marge en aan het beheren van de overige risico's. Dat besef verandert hoe je naar de optiemarkt kijkt: je tegenpartij handelt niet in meningen over de koers, maar in risico's met een prijskaartje.",
                "Omdat delta zelf verandert als de koers beweegt, moet zo'n hedge steeds worden bijgesteld. Hoe snel delta verandert, is een eigen Griek: gamma, het onderwerp van de volgende les.",
              ],
            },
            {
              heading: "Positiedelta: je hele portefeuille in één getal",
              paragraphs: [
                "Delta's mag je optellen, en dat maakt de Griek pas echt praktisch. Tel de delta's van al je posities bij elkaar (aandelen tellen als delta 1 per stuk) en je weet hoe je totale portefeuille reageert op een koersbeweging van de onderliggende waarde.",
                "Dit getal maakt gesprekken over 'ben ik nu eigenlijk long of short?' ineens concreet. Een portefeuille met aandelen én geschreven calls én gekochte puts voelt onoverzichtelijk, maar de positiedelta vat hem samen in één zin: deze portefeuille beweegt op dit moment als zoveel aandelen.",
              ],
              example: {
                title: "De positiedelta van een covered-call-belegger",
                body:
                  "Je bezit 200 aandelen Zeewind NV (delta +200) en hebt daarop 2 calls EUR 42 geschreven met elk een delta van 0,45. De geschreven calls tellen negatief: 2 x 100 x -0,45 = -90. Je positiedelta is +200 - 90 = +110: de portefeuille beweegt op dit moment als 110 aandelen Zeewind. Stijgt het aandeel EUR 1, dan verdien je ruwweg EUR 110; daalt het EUR 1, dan verlies je ruwweg EUR 110. Je profiteert dus nog steeds van stijging, maar gedempt — precies wat je bij een covered call verwacht, en nu kun je het kwantificeren.",
              },
            },
          ],
          bookRefs: [
            {
              title: "Trading Options Greeks",
              author: "Dan Passarelli",
              year: 2012,
              note: "De toegankelijkste serieuze behandeling van de Grieken die er is. Passarelli was zelf marketmaker en legt delta uit zoals de vloer hem gebruikt: als hedge-ratio, niet als abstractie.",
            },
          ],
          keyTakeaways: [
            "Delta = hoeveel de optiepremie beweegt per EUR 1 beweging van de onderliggende waarde; calls 0 tot 1, puts 0 tot -1",
            "Delta is een ruwe benadering van de kans dat de optie in-the-money eindigt — nuttig als vuistregel, geen letterlijke kans",
            "Als hedge-ratio vertelt delta hoeveel aandelen dezelfde koersgevoeligheid geven; zo werkt je tegenpartij",
            "Positiedelta is de optelsom over al je posities: één getal dat zegt als hoeveel aandelen je portefeuille nu beweegt",
          ],
          quiz: [
            {
              question:
                "Een calloptie op Zeewind NV heeft een delta van 0,30. Het aandeel stijgt van EUR 40 naar EUR 41. Wat gebeurt er ruwweg met de premie?",
              options: [
                "De premie stijgt met ongeveer EUR 1, want de optie volgt het aandeel",
                "De premie stijgt met ongeveer EUR 0,30",
                "De premie daalt, want stijgende koersen zijn slecht voor callopties",
                "De premie verandert niet zolang de einddatum niet is bereikt",
              ],
              correctIndex: 1,
              explanation:
                "Delta 0,30 betekent: per EUR 1 koersbeweging beweegt de premie ruwweg EUR 0,30 mee. Alleen een optie met delta 1 (diep in-the-money) volgt het aandeel bijna één-op-één, en optiepremies bewegen juist voortdurend, ook lang vóór de einddatum.",
            },
            {
              question: "Wat zegt een delta van 0,10 op een out-of-the-money call, gelezen als kansmeter?",
              options: [
                "De optie levert gegarandeerd 10% rendement op",
                "De optie is met zekerheid over tien dagen waardeloos",
                "De markt prijst ruwweg 10% kans in dat de optie in-the-money eindigt — als grove benadering, niet als exacte kans",
                "Er is precies 10% kans dat het aandeel gaat stijgen",
              ],
              correctIndex: 2,
              explanation:
                "Delta is bij benadering de kans dat de optie op de einddatum in-the-money is. Het is een vuistregel uit een model met bekende tekortkomingen, dus behandel het als grove schatting. Over rendement of over 'de kans dat het aandeel stijgt' (welke stijging? hoeveel?) zegt delta niets rechtstreeks.",
            },
            {
              question: "Waarom is de delta van een putoptie negatief?",
              options: [
                "Omdat puts altijd verlies opleveren voor de koper",
                "Omdat een put meer waard wordt als de onderliggende koers daalt: premie en koers bewegen tegengesteld",
                "Omdat brokers puts als risicovoller aanmerken dan calls",
                "Omdat de uitoefenprijs van een put onder de huidige koers ligt",
              ],
              correctIndex: 1,
              explanation:
                "Delta meet de richting van het verband tussen koers en premie. Bij een put is dat verband omgekeerd: daalt het aandeel EUR 1, dan stijgt een put met delta -0,40 ruwweg EUR 0,40. Het minteken is dus informatie, geen waardeoordeel — en uitoefenprijzen van puts kunnen overal liggen.",
            },
            {
              question:
                "Je bezit 100 aandelen Zeewind NV en hebt 1 call geschreven met delta 0,60. Wat is je positiedelta en wat betekent die?",
              options: [
                "+160: je portefeuille beweegt als 160 aandelen",
                "+100: geschreven opties tellen niet mee in de positiedelta",
                "-60: je verdient aan een koersdaling",
                "+40: je portefeuille beweegt nog maar als 40 aandelen, want de geschreven call dempt je koersgevoeligheid",
              ],
              correctIndex: 3,
              explanation:
                "Aandelen: +100. Geschreven call: 1 x 100 x -0,60 = -60. Samen +40. Je profiteert dus nog van stijging, maar fors gedempt — en dat klopt met de intuïtie van een covered call met een delta-0,60-call: een flink deel van het opwaartse potentieel is verkocht.",
            },
          ],
          xp: 50,
        },
        {
          slug: "theta-en-gamma",
          title: "Theta en gamma: de ruil tussen tijd en beweging",
          durationMin: 10,
          tool: "optie-tijdverval",
          intro:
            "Tijdswaarde ken je al uit Opties Begrijpen: het deel van de premie dat verdampt richting de einddatum. In deze les wordt dat verval een meetbaar getal (theta) en ontmoet je zijn tegenpool: gamma, de Griek die meet hoe explosief je delta kan veranderen. Samen vormen ze de fundamentele ruil van het optievak: de schrijver verdient elke dag een beetje, en één flinke beweging kan dat in één klap terugnemen.",
          sections: [
            {
              heading: "Theta: wat een dag stilstand kost",
              paragraphs: [
                "Theta is het bedrag dat een optie per dag aan waarde verliest als al het andere gelijk blijft. Een gekochte call op Zeewind NV met een theta van -0,02 wordt elke dag ruwweg EUR 0,02 per aandeel goedkoper, oftewel EUR 2 per contract, puur doordat de tijd verstrijkt. Voor de koper is theta de huur die je betaalt voor het recht; voor de schrijver is het de huur die binnenkomt.",
                "Cruciaal om te snappen: theta is niet constant. Het tijdsverval van een at-the-money optie verloopt niet als een rechte lijn maar als een steeds steilere helling. In het begin van de looptijd verdampt de tijdswaarde traag, in de laatste weken gaat het hard. Wie een optie met drie maanden looptijd koopt en denkt 'ik verlies elke dag een negentigste van de tijdswaarde', rekent zichzelf rijk.",
                "De vuistregel erachter: de tijdswaarde van een at-the-money optie beweegt grofweg mee met de wortel van de resterende looptijd. Halveer de looptijd en er is niet de helft, maar ongeveer 70% van de tijdswaarde over. Het venijn zit dus in de staart — en precies daarom schrijven veel professionals bij voorkeur opties met korte looptijden en kopen ze juist langere.",
              ],
              example: {
                title: "Het niet-lineaire verval van een Zeewind-call",
                body:
                  "Een at-the-money call op Zeewind NV (koers EUR 40, uitoefenprijs EUR 40) met 90 dagen looptijd kost EUR 1,45 — bij een rustig aandeel als dit is dat vrijwel allemaal tijdswaarde. Na 45 dagen, bij ongewijzigde koers en volatiliteit, is er niet de helft over maar ongeveer EUR 1,05. De eerste helft van de looptijd kostte dus EUR 0,40; de tweede helft verdampt de resterende EUR 1,05. En binnen die tweede helft is het weer scheef: de laatste tien dagen gaan het hardst. Tijdsverval is een helling die steeds steiler wordt, geen gelijkmatige afdaling.",
              },
            },
            {
              heading: "Gamma: de versnelling van delta",
              paragraphs: [
                "In les 1 zag je dat delta zelf verandert als de koers beweegt. Gamma meet hoe snel: het is de verandering van delta per EUR 1 koersbeweging. Een optie met delta 0,50 en gamma 0,08 heeft na een stijging van EUR 1 een delta van ongeveer 0,58 — de optie is gevoeliger geworden voor de volgende euro beweging.",
                "Voor de koper van een optie is gamma een cadeautje: beweegt de koers jouw kant op, dan versnelt je winst; beweegt hij van je af, dan remt je verlies juist af, omdat delta krimpt. Voor de schrijver werkt datzelfde mechanisme precies verkeerd om: tegen hem in versnelt het verlies en wordt de positie steeds gevoeliger op het slechtst denkbare moment.",
                "Gamma is het grootst at-the-money en vlak voor de einddatum. Dat is logisch als je het extreme geval bekijkt: een call EUR 40 op de slotdag, met de koers op EUR 39,90, heeft een delta van bijna 0; op EUR 40,10 is die delta ineens bijna 1. Een dubbeltje verschil laat de delta van vrijwel 0 naar vrijwel 1 klappen. Kort lopende at-the-money opties zijn daardoor de meest explosieve instrumenten in dit vak.",
              ],
              bullets: [
                "Gamma = verandering van delta per EUR 1 koersbeweging; kopers hebben positieve gamma, schrijvers negatieve",
                "Gamma piekt at-the-money en neemt sterk toe richting de einddatum",
                "Hoge gamma betekent: je positie verandert snel van karakter — wat gisteren een kleine positie leek, is vandaag een grote",
              ],
            },
            {
              heading: "De ruil: elke dag een beetje versus één keer veel",
              paragraphs: [
                "Theta en gamma zijn twee kanten van dezelfde munt, en die samenhang is de kern van deze les. Wie opties schrijft, ontvangt theta (elke dag een beetje premie-verval in de zak) en draagt negatieve gamma (het risico dat één flinke beweging hard tegen hem in werkt). Wie opties koopt, betaalt theta en bezit positieve gamma. Er bestaat geen positie die theta ontvangt én positieve gamma heeft op hetzelfde stuk van de curve — dat zou gratis geld zijn.",
                "Concreet: een schrijver van de Zeewind-call uit het voorbeeld ontvangt in een rustige week misschien EUR 10 à 15 aan tijdsverval per contract. Komt er dan onverwacht overnamenieuws en gapt het aandeel 10% omhoog, dan schiet de delta van de geschreven call omhoog en staat er in één ochtend een verlies dat weken aan geduldig geïncasseerde theta uitwist. De markt betaalt je die dagelijkse premie niet voor niets: het is de vergoeding voor precies dit scenario.",
                "Dit verklaart ook waarom 'rustig premie innen' zo verleidelijk oogt in een grafiek van resultaten: je ziet een lange reeks kleine plusjes en vergeet dat de zeldzame min er nog niet op staat. Onthoud dit beeld — het komt in les 8 terug, met een echt en pijnlijk voorbeeld.",
              ],
            },
            {
              heading: "Wat dit betekent voor jouw keuzes",
              paragraphs: [
                "Uit deze mechanica volgen praktische lessen die je direct kunt gebruiken. Koop je opties, dan is tijd je vijand: kies looptijden die ruim langer zijn dan de beweging die je verwacht, zodat je niet in het steilste deel van het verval zit terwijl je nog gelijk moet krijgen. Een optie die 'goedkoop' is omdat hij nog maar twee weken loopt, is meestal niet goedkoop maar bijna op.",
                "Schrijf je opties (gedekt, zoals in Beschermen & Verdienen), dan is het spiegelbeeld waar: het steile slot van de looptijd is waar jij je premie het snelst verdient, maar ook waar gamma je positie het wildst maakt. Veel schrijvers sluiten hun positie daarom als het grootste deel van de premie binnen is, in plaats van tot de slotdag maximale gamma te dragen voor de laatste centen.",
                "Gebruik de tool bij deze les om het verval zelf te zien: zet een optie klaar, laat de dagen verstrijken en kijk hoe de curve steeds steiler wordt. Wie die helling één keer echt gezien heeft, koopt nooit meer achteloos een kort lopende optie.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Trading Options Greeks",
              author: "Dan Passarelli",
              year: 2012,
              note: "De hoofdstukken over theta en gamma laten met concrete posities zien hoe de twee elkaars spiegelbeeld zijn — precies de ruil die deze les beschrijft.",
            },
          ],
          keyTakeaways: [
            "Theta is het dagelijkse tijdsverval van de premie: kosten voor de koper, inkomsten voor de schrijver",
            "Tijdsverval is niet lineair: het versnelt sterk in de laatste weken van de looptijd (grofweg wortel-van-de-tijd)",
            "Gamma meet hoe snel delta verandert; hij piekt at-the-money en vlak voor de einddatum",
            "Theta en gamma zijn een onlosmakelijke ruil: wie dagelijks theta int, draagt het gamma-risico dat één gap weken aan premie uitwist",
          ],
          quiz: [
            {
              question:
                "Een at-the-money optie heeft 90 dagen looptijd en EUR 1,45 tijdswaarde. Wat is de beste beschrijving van het verloop van die tijdswaarde?",
              options: [
                "Ze verdampt gelijkmatig: elke dag ongeveer een negentigste",
                "Ze verdampt vooral in het begin van de looptijd, daarna vlakt het af",
                "Ze verdampt steeds sneller: in de eerste helft van de looptijd verdwijnt maar een deel, het gros gaat in de laatste weken",
                "Ze blijft gelijk tot de laatste dag en verdwijnt dan in één keer",
              ],
              correctIndex: 2,
              explanation:
                "Tijdsverval van at-the-money opties versnelt: na de helft van de looptijd is er nog ongeveer 70% van de tijdswaarde over, niet 50%. De laatste weken zijn het steilst. Wie lineair rekent, onderschat systematisch wat de laatste fase van de looptijd kost.",
            },
            {
              question: "Waar en wanneer is gamma het grootst?",
              options: [
                "At-the-money en vlak voor de einddatum",
                "Diep in-the-money en direct na aankoop",
                "Ver out-of-the-money en bij een lange looptijd",
                "Gamma is voor alle opties gelijk, dat is juist het nut van de Griek",
              ],
              correctIndex: 0,
              explanation:
                "Rond de uitoefenprijs en dicht bij de einddatum kan een klein koersverschil de delta van bijna 0 naar bijna 1 laten klappen: maximale gamma. Diep in- of out-of-the-money ligt het lot van de optie al grotendeels vast en verandert delta nauwelijks nog.",
            },
            {
              question:
                "Een belegger schrijft maandenlang met succes kort lopende opties en incasseert wekelijks tijdsverval. Welke uitspraak beschrijft zijn situatie het eerlijkst?",
              options: [
                "Hij heeft een strategie gevonden die structureel gratis geld oplevert",
                "Hij ontvangt theta als vergoeding voor negatieve gamma: één onverwachte gap kan weken aan geïncasseerde premie in één klap terugnemen",
                "Zolang hij alleen schrijft op rustige aandelen loopt hij geen risico",
                "Zijn risico daalt naarmate hij vaker premie heeft geïncasseerd",
              ],
              correctIndex: 1,
              explanation:
                "Theta en gamma zijn een ruil, geen cadeau. De dagelijkse premie is de vergoeding voor het dragen van gap-risico, en dat risico verdwijnt niet doordat het zich een tijd niet voordoet — ook rustige aandelen kunnen gappen op nieuws. Eerdere winsten verlagen het risico van de volgende positie op geen enkele manier.",
            },
            {
              question:
                "Je verwacht dat Zeewind NV binnen twee maanden gaat stijgen en overweegt een call te kopen. Wat is, met de theta-les in het achterhoofd, de verstandigste overweging?",
              options: [
                "Kies de kortst mogelijke looptijd, want die opties zijn het goedkoopst",
                "Looptijd maakt niet uit zolang de uitoefenprijs maar klopt",
                "Koop de optie pas op de laatste dag, dan is alle tijdswaarde er al uit",
                "Kies een looptijd ruim langer dan twee maanden, zodat je niet in het steilste deel van het tijdsverval zit terwijl je op de beweging wacht",
              ],
              correctIndex: 3,
              explanation:
                "Een kort lopende optie is goedkoop omdat hij bijna op is: je betaalt weinig, maar het verval is er het steilst en je hebt geen tijd om gelijk te krijgen. Met een ruimere looptijd betaal je meer premie, maar per dag wachten aanzienlijk minder. Op de laatste dag kopen betekent vrijwel zeker waardeloos aflopen.",
            },
          ],
          xp: 50,
        },
        {
          slug: "vega-en-implied-volatility",
          title: "Vega en implied volatility: de prijs van onzekerheid",
          durationMin: 10,
          tool: "optie-volatiliteit",
          intro:
            "Twee aandelen, allebei op EUR 40, allebei dezelfde uitoefenprijs en looptijd — en toch kost de ene optie drie keer zoveel als de andere. Het verschil heet implied volatility, en wie dat begrip echt doorgrondt, kijkt nooit meer naar een optiepremie zonder te vragen: hoeveel onzekerheid zit hier eigenlijk in de prijs? Dit is de les waarin je leert denken zoals de markt prijst.",
          sections: [
            {
              heading: "Implied volatility: het echte prijskaartje",
              paragraphs: [
                "Van alle ingrediënten die een optiepremie bepalen — koers, uitoefenprijs, looptijd, rente — is er precies één die je nergens kunt opzoeken: hoe beweeglijk de onderliggende waarde de komende tijd zal zijn. De markt lost dat om: uit de premie die handelaren feitelijk betalen, kun je terugrekenen welke beweeglijkheid ze blijkbaar verwachten. Dat teruggerekende getal is de implied volatility (IV).",
                "IV wordt uitgedrukt als een percentage per jaar. Een IV van 18% betekent grofweg: de markt verwacht dat de koers over een jaar in de meeste gevallen binnen zo'n 18% van het huidige niveau eindigt. Let op wat er níét staat: IV zegt niets over de ríchting. Het is een verwachting van beweging, omhoog én omlaag — de markt zegt 'dit wordt spannend', niet 'dit gaat stijgen'.",
                "Vergelijk het met een verzekeringspremie. De opstalverzekering voor een huis naast een vuurwerkopslag kost meer dan die voor een identiek huis in een rustige polder — niet omdat de verzekeraar wéét dat het misgaat, maar omdat de kans op grote uitslagen groter is. IV is exact dat: de premie-opslag voor verwachte turbulentie.",
              ],
              example: {
                title: "Zeewind NV versus FlitsTech NV: zelfde koers, ander prijskaartje",
                body:
                  "Twee fictieve aandelen noteren allebei EUR 40. Zeewind NV is een saai nutsachtig bedrijf met een IV van 18%; FlitsTech NV is een jong techbedrijf met een IV van 55%. Een at-the-money call met drie maanden looptijd kost op Zeewind ongeveer EUR 1,45 — op FlitsTech ongeveer EUR 4,40. Drie keer zo duur, voor exact dezelfde uitoefenprijs en looptijd. Dat verschil is geen inefficiëntie maar informatie: de markt verwacht dat FlitsTech drie keer zo hard beweegt, en laat je daar navenant voor betalen.",
              },
            },
            {
              heading: "Vega: je gevoeligheid voor veranderende verwachtingen",
              paragraphs: [
                "IV is geen constante: verwachtingen veranderen, en daarmee de premies van álle opties tegelijk — zonder dat de koers van het aandeel ook maar beweegt. Vega meet die gevoeligheid: hoeveel de premie verandert als de IV één procentpunt stijgt of daalt. Een optie met een vega van 0,08 wordt EUR 0,08 per aandeel duurder als de IV van 18% naar 19% gaat.",
                "Vega is het grootst bij at-the-money opties met lange looptijden: hoe meer toekomst er in een optie zit, hoe zwaarder de verwachting over die toekomst weegt. Kopers van opties hebben positieve vega (stijgende onzekerheid maakt hun bezit meer waard); schrijvers hebben negatieve vega.",
                "Dit voegt een dimensie toe die veel beginnende optiebeleggers volledig missen: je kunt gelijk hebben over de richting en toch verliezen op de volatiliteit. Wie een call koopt terwijl de IV op een piek staat, koopt duur — en als de rust terugkeert, kan de premie dalen terwijl het aandeel keurig stijgt.",
              ],
            },
            {
              heading: "De IV-crush: gelijk hebben en toch verliezen",
              paragraphs: [
                "Het beruchtste voorbeeld daarvan speelt rond kwartaalcijfers. In de weken vóór de cijfers van een beweeglijk aandeel loopt de IV op: iedereen weet dat er een grote uitslag aankomt, dus de onzekerheidspremie stijgt. Direct ná de publicatie is die onzekerheid weg — wat er ook in de cijfers stond — en klapt de IV omlaag. Dat heet de IV-crush.",
                "Reken mee met FlitsTech NV. Vlak voor de cijfers noteert het aandeel EUR 40 en staat de IV van de maandopties op 80%; een at-the-money call kost dan zo'n EUR 3,60. De cijfers vallen mee en het aandeel stijgt 2%, naar EUR 40,80. Maar de IV zakt terug naar 45% — en de call is nu nog maar zo'n EUR 2,60 waard. De koper had gelijk over de richting en verloor bijna 30% van zijn premie. De crush at meer op dan de koersstijging opleverde.",
                "De les is niet 'koop nooit opties rond cijfers', maar wel: weet wat je koopt. Vóór een bekende nieuwsdatum betaal je een premie die de verwachte uitslag al bevat. Je verdient als koper pas als de werkelijkheid de verwachting overtréft — een lat die veel hoger ligt dan alleen maar gelijk hebben over de richting. In les 6 komt deze logica terug bij straddles.",
              ],
              bullets: [
                "Voor bekende nieuwsdata (cijfers, uitspraken, keuringsbesluiten) is de verwachte uitslag al in de IV geprijsd",
                "Na het nieuws crasht de IV, ongeacht de uitkomst: de onzekerheid zelf is verdwenen",
                "Als optiekoper rond nieuws win je alleen bij een beweging gróter dan de markt al verwachtte",
              ],
            },
            {
              heading: "Skew: waarom puts structureel duurder zijn",
              paragraphs: [
                "Wie een optieketen naast een IV-berekening legt, ontdekt iets opvallends: opties op hetzelfde aandeel met dezelfde looptijd hebben níét allemaal dezelfde IV. Out-of-the-money puts noteren vrijwel altijd tegen een hógere IV dan out-of-the-money calls op vergelijkbare afstand. Dit patroon heet de skew.",
                "De verklaring is deels geschiedenis, deels economie. Sinds de beurskrach van oktober 1987 — één dag waarop de Amerikaanse markt ruim 20% verloor — weten handelaren dat koersen kunnen crashen op een manier die nette modellen niet voorspellen. Bovendien willen veel grote beleggers structureel bescherming kopen (puts als verzekering op hun portefeuille), terwijl er veel minder natuurlijke kopers van verre calls zijn. Meer vraag naar crashbescherming, schaars aanbod: de prijs van die bescherming is structureel hoger.",
                "De skew is daarmee een eerlijk marktsignaal dat je serieus mag nemen: de markt prijst neerwaartse paniek als waarschijnlijker en heftiger dan opwaartse euforie. Voor jou betekent het praktisch: bescherming kopen (puts) is structureel aan de dure kant, en puts schrijven levert structureel wat méér premie op — precies omdat je daarmee het crashrisico overneemt dat een ander kwijt wil. Dat is geen gratis geld; dat is een risico-overdracht met een prijskaartje.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Option Volatility and Pricing",
              author: "Sheldon Natenberg",
              year: 1994,
              note: "Dé klassieker over volatiliteit en optieprijsvorming, waar generaties handelaren mee zijn opgeleid. Pittig maar haalbaar: lees hem in etappes en sla de wiskundige appendices gerust over.",
            },
          ],
          keyTakeaways: [
            "Implied volatility is de beweeglijkheid die de markt in de premie prijst: het echte prijskaartje van een optie",
            "IV is een verwachting van beweging in béíde richtingen, geen koersvoorspelling",
            "Vega meet je gevoeligheid voor veranderende IV; rond nieuws kan de IV-crush je premie opeten terwijl je gelijk hebt over de richting",
            "De skew — puts structureel duurder dan calls — is het marktgeheugen van crashes en de prijs van verzekeringsvraag",
          ],
          quiz: [
            {
              question:
                "Callopties op FlitsTech NV (IV 55%) kosten bij gelijke koers, uitoefenprijs en looptijd bijna drie keer zoveel als die op Zeewind NV (IV 18%). Wat is de beste verklaring?",
              options: [
                "De markt verwacht dat FlitsTech gaat stijgen en Zeewind niet",
                "De markt verwacht dat FlitsTech veel harder zal bewegen — in beide richtingen — en prijst die onzekerheid in de premie",
                "Opties op techbedrijven zijn wettelijk duurder vanwege hogere risicoclassificaties",
                "De marketmaker in FlitsTech rekent hogere winstmarges",
              ],
              correctIndex: 1,
              explanation:
                "IV is een verwachting van beweeglijkheid, niet van richting. Een hoge IV betekent 'dit wordt spannend', niet 'dit gaat omhoog' — anders zouden puts op FlitsTech juist goedkoop zijn, en die zijn net zo goed duurder. Wettelijke prijsklassen bestaan niet en marges verklaren geen factor drie.",
            },
            {
              question:
                "Je koopt vlak vóór de kwartaalcijfers een at-the-money call op FlitsTech voor EUR 3,60 (IV 80%). De cijfers vallen mee, het aandeel stijgt 2%, maar je call is ineens nog maar EUR 2,60 waard. Wat is er gebeurd?",
              options: [
                "De IV-crush: na de cijfers verdween de onzekerheidspremie en die daling woog zwaarder dan de koerswinst",
                "Je broker heeft transactiekosten van de premie afgeboekt",
                "Het tijdsverval van één nacht bedroeg EUR 1,00",
                "De optie is per ongeluk omgezet in een put",
              ],
              correctIndex: 0,
              explanation:
                "De verwachte uitslag zat al in de IV van 80%. Zodra de cijfers er zijn, is de onzekerheid weg en zakt de IV — hier naar 45% — waardoor de premie hard daalt, ook al steeg het aandeel. Theta van één nacht is bij drie weken looptijd veel kleiner dan EUR 1,00, en de andere opties zijn onzin.",
            },
            {
              question: "Wat betekent de volatiliteits-skew in de praktijk?",
              options: [
                "Alle opties met dezelfde looptijd hebben dezelfde IV; verschillen zijn rekenfouten",
                "Calls zijn structureel duurder dan puts, omdat beleggers optimistisch zijn",
                "Out-of-the-money puts noteren tegen hogere IV dan vergelijkbare calls: de markt prijst crashrisico en verzekeringsvraag in",
                "De IV van een aandeel is altijd gelijk aan zijn historische beweeglijkheid",
              ],
              correctIndex: 2,
              explanation:
                "Sinds 1987 prijst de markt in dat dalingen sneller en heftiger kunnen zijn dan stijgingen, en grote beleggers kopen structureel puts als portefeuilleverzekering. Beide effecten maken neerwaartse bescherming duurder. IV en historische volatiliteit lopen juist regelmatig uiteen — dat verschil is waar volatiliteitshandelaren hun vak van maken.",
            },
            {
              question: "Welke optie heeft de grootste vega — de grootste gevoeligheid voor een verandering in IV?",
              options: [
                "Een at-the-money optie met nog een jaar looptijd",
                "Een diep in-the-money optie die morgen afloopt",
                "Een ver out-of-the-money optie die morgen afloopt",
                "Vega is voor alle opties op hetzelfde aandeel gelijk",
              ],
              correctIndex: 0,
              explanation:
                "Hoe meer toekomst er in een optie zit, hoe zwaarder de verwachting over die toekomst in de premie weegt: vega groeit met de looptijd en piekt rond at-the-money. Bij opties die morgen aflopen ligt het lot vrijwel vast en doet de verwachting er nauwelijks nog toe.",
            },
          ],
          xp: 50,
        },
        {
          slug: "de-grieken-samen",
          title: "De Grieken samen: één positie, vier krachten",
          durationMin: 10,
          tool: "optie-greeks",
          intro:
            "Delta, gamma, theta en vega heb je nu los ontmoet. Maar in een echte positie trekken ze tegelijk aan de premie, en soms tegen elkaar in. In deze les volg je één gekochte call van begin tot einddatum en zie je alle vier de krachten aan het werk. Daarna kijken we eerlijk naar het model waar al deze getallen uit komen — en waar dat model de werkelijkheid geweld aandoet.",
          sections: [
            {
              heading: "De uitgangspositie",
              paragraphs: [
                "We kopen een call op Zeewind NV: koers EUR 40, uitoefenprijs EUR 40, looptijd 90 dagen, IV 18%. Premie: EUR 1,45 per aandeel, dus EUR 145 voor één contract. De Grieken bij aanvang: delta ongeveer 0,52, gamma 0,05, theta rond de -0,01 per dag, vega 0,08.",
                "Lees die getallen als één verhaal. De positie beweegt als 52 aandelen (delta). Stijgt de koers, dan wordt dat er meer (gamma). Elke dag wachten kost nu ongeveer één cent per aandeel, maar dat loopt op (theta). En schiet de onzekerheid in de markt omhoog, dan wordt de optie meer waard zonder dat de koers beweegt (vega).",
                "Belangrijk startinzicht: geen van deze getallen is een voorspelling. Het zijn gevoeligheden — antwoorden op als-dan-vragen. Wat er werkelijk gebeurt, bepalen koers, kalender en nieuws.",
              ],
            },
            {
              heading: "Week drie: de koers stijgt, alles verschuift",
              paragraphs: [
                "Na drie weken stijgt Zeewind op goed sectornieuws naar EUR 42. De call is nu zo'n EUR 2,60 waard: EUR 2,00 intrinsieke waarde plus ongeveer EUR 0,60 tijdswaarde. Winst tot nu toe: EUR 1,15 per aandeel. Maar kijk vooral naar wat er met de Grieken gebeurde.",
                "De delta is opgelopen naar ongeveer 0,70: gamma heeft zijn werk gedaan, de positie is 'groter' geworden precies toen het meezat. Tegelijk is de tijdswaarde gedaald van EUR 1,45 naar EUR 0,60 — deels doordat drie weken theta verstreken, maar vooral doordat de optie in-the-money raakte: tijdswaarde is het dikst at-the-money. En de vega is gekrompen: er zit minder onzekerheid in een optie waarvan het lot zich begint af te tekenen.",
                "Dit is het moment waarop een handelaar zichzelf een vraag stelt die beginners overslaan: wil ik deze níéuwe positie? Een delta-0,70-call met slinkende tijdswaarde is een ander instrument dan de fifty-fifty-gok van drie weken geleden. Doorhouden mag, (deels) winst nemen ook — maar kies bewust, in plaats van simpelweg te blijven zitten omdat je nu eenmaal zit.",
              ],
            },
            {
              heading: "De terugval: hoe theta stilletjes het verschil maakt",
              paragraphs: [
                "Het sectornieuws ebt weg en Zeewind zakt in de weken erna terug naar EUR 40,50. Met nog 30 dagen op de klok is de call ongeveer EUR 1,20 waard: EUR 0,50 intrinsiek plus zo'n EUR 0,70 tijdswaarde. De papieren winst van week drie is vrijwel volledig verdampt — terwijl het aandeel nog altijd bóven onze instapkoers staat.",
                "Op de einddatum sluit Zeewind op EUR 41. De call is dan exact zijn intrinsieke waarde waard: EUR 1,00. Eindresultaat: EUR 1,00 ontvangen tegen EUR 1,45 betaald, een verlies van EUR 0,45 per aandeel oftewel EUR 45 per contract. Het aandeel steeg 2,5% en de callkoper verloor ruim 30% van zijn inleg.",
                "Wie alleen in einddatum-diagrammen denkt, vindt dit verwarrend. Wie de Grieken kent, ziet precies wat er gebeurde: de koersstijging (delta) was te klein om de sluipende kosten van tijd (theta) goed te maken. De optiekoper heeft niet één tegenstander maar twee: hij moet gelijk krijgen én op tijd gelijk krijgen. Dat is geen reden om nooit opties te kopen — wel om er nooit in te stappen zonder de vraag: hoevéél beweging heb ik nodig, en vóór wanneer?",
              ],
              example: {
                title: "Dezelfde reis in één tabel",
                body:
                  "Dag 0: koers EUR 40,00, premie EUR 1,45 (alles tijdswaarde). Dag 21: koers EUR 42,00, premie EUR 2,60 (EUR 2,00 intrinsiek + EUR 0,60 tijd) — papieren winst EUR 1,15. Dag 60: koers EUR 40,50, premie EUR 1,20 (EUR 0,50 intrinsiek + EUR 0,70 tijd) — papieren winst bijna weg. Dag 90: koers EUR 41,00, premie EUR 1,00 (alleen intrinsiek) — eindverlies EUR 0,45. Het aandeel eindigde hóger dan bij de start; de optie eindigde in de min. Het verschil tussen die twee zinnen ís deze cursus.",
              },
            },
            {
              heading: "Black-Scholes: nuttige taal, geen waarheid",
              paragraphs: [
                "Alle Grieken in deze module komen uit hetzelfde rekenmodel: Black-Scholes, in 1973 gepubliceerd door Fischer Black en Myron Scholes en uitgebreid door Robert Merton. Het model was een doorbraak — het gaf de wereld voor het eerst één gemeenschappelijke taal om optieprijzen en -risico's in uit te drukken — en Scholes en Merton kregen er in 1997 de Nobelprijs voor economie voor.",
                "Maar het model leunt op aannames die aantoonbaar niet kloppen, en daar zijn we net zo eerlijk over als in onze cursus Technische Analyse over de wetenschappelijke kritiek op dat vakgebied. Black-Scholes veronderstelt dat volatiliteit constant is (les 3 liet zien van niet), dat koersen vloeiend bewegen zonder gaten (elk kwartaalcijferseizoen bewijst het tegendeel), en dat extreme uitslagen uiterst zeldzaam zijn — terwijl echte beurzen vaker en harder crashen dan de netjes klokvormige kansverdeling van het model toestaat. De skew uit les 3 is precies de markt die deze modelfout in de prijzen repareert.",
                "Hoe ga je daar volwassen mee om? Zoals de praktijk het doet: gebruik het model als taal en als meetlat, niet als orakel. Delta, theta en vega zijn uitstekende instrumenten om posities te begrijpen en te vergelijken. Maar behandel de uitkomsten als schattingen met een foutmarge, wees extra wantrouwig in de staarten (grote uitslagen, korte looptijden, paniek) en onthoud: de markt prijst al lang niet meer volgens het kale model — de gebruikers ervan weten allemaal waar het wringt.",
              ],
              bullets: [
                "Aanname: constante volatiliteit — in werkelijkheid beweegt IV voortdurend en clustert onrust",
                "Aanname: vloeiende koersen zonder sprongen — in werkelijkheid gapt de markt op nieuws",
                "Aanname: netjes klokvormige kansen — in werkelijkheid zijn de staarten dikker: crashes komen vaker voor dan het model zegt",
                "Praktische houding: het model is gedeelde taal en meetlat, geen waarheid; reken met foutmarges",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Trading Options Greeks",
              author: "Dan Passarelli",
              year: 2012,
              note: "Passarelli's kracht is precies wat deze les doet: de Grieken niet los behandelen maar als samenspel binnen één levende positie.",
            },
            {
              title: "Option Volatility and Pricing",
              author: "Sheldon Natenberg",
              year: 1994,
              note: "Natenberg behandelt óók de tekortkomingen van de modellen waar hij mee rekent — precies de eerlijke, professionele houding die deze les bepleit.",
            },
          ],
          keyTakeaways: [
            "De Grieken zijn gevoeligheden, geen voorspellingen: samen beschrijven ze hoe één positie op koers, tijd en onzekerheid reageert",
            "Een positie verandert onderweg van karakter; vraag jezelf regelmatig af of je de níéuwe positie nog zou willen openen",
            "Een optiekoper moet gelijk krijgen én op tijd: een stijgend aandeel kan samengaan met een verliezende call",
            "Black-Scholes is gemeenschappelijke taal met bekende fouten (constante volatiliteit, geen gaten, te dunne staarten) — gebruik het als meetlat, niet als orakel",
          ],
          quiz: [
            {
              question:
                "Zeewind NV stijgt in 90 dagen van EUR 40,00 naar EUR 41,00. De at-the-money call die EUR 1,45 kostte, is op de einddatum EUR 1,00 waard. Hoe verklaar je dat het aandeel steeg maar de call verloor?",
              options: [
                "De marketmaker heeft de koper benadeeld bij het afwikkelen",
                "De koersstijging was te klein om het weggelopen tijdsverval goed te maken: op de einddatum resteert alleen intrinsieke waarde",
                "De optie is tussentijds omgezet naar een andere uitoefenprijs",
                "Dit kan niet: als het aandeel stijgt, stijgt een call altijd mee",
              ],
              correctIndex: 1,
              explanation:
                "Bij aankoop bestond de premie volledig uit tijdswaarde (EUR 1,45); op de einddatum is alle tijdswaarde per definitie verdampt en telt alleen intrinsieke waarde (EUR 41 - EUR 40 = EUR 1,00). De koper had EUR 1,45 aan beweging boven de uitoefenprijs nodig om quitte te spelen en kreeg er maar EUR 1,00. Richting goed, timing en omvang te krap.",
            },
            {
              question:
                "Je call raakte in-the-money en de delta liep op van 0,52 naar 0,70. Welke professionele reflex hoort daarbij?",
              options: [
                "Niets doen: een positie beoordeel je alleen op de einddatum",
                "Direct bijkopen, want een stijgende delta bewijst dat het aandeel verder stijgt",
                "Beseffen dat je feitelijk een nieuwe, grotere en andere positie hebt, en bewust kiezen of je díé wilt houden",
                "De optie omruilen voor een put om de winst te beschermen",
              ],
              correctIndex: 2,
              explanation:
                "Gamma heeft de positie van karakter laten veranderen: meer koersgevoeligheid, minder tijdswaarde, ander risicoprofiel. De vraag 'zou ik deze positie nú openen?' dwingt tot een bewuste keuze. Delta voorspelt geen verdere stijging, en 'alleen op de einddatum kijken' is precies het denken dat deze module wil afleren.",
            },
            {
              question: "Welke aanname van Black-Scholes wordt door de werkelijkheid het duidelijkst weersproken?",
              options: [
                "Dat opties een uitoefenprijs en een einddatum hebben",
                "Dat de premie afhangt van de resterende looptijd",
                "Dat een calloptie meer waard wordt als de koers stijgt",
                "Dat volatiliteit constant is en koersen vloeiend bewegen zonder sprongen of dikke staarten",
              ],
              correctIndex: 3,
              explanation:
                "IV beweegt voortdurend, koersen gappen op nieuws en crashes komen vaker voor dan een klokvormige verdeling toestaat — de skew is het litteken dat de markt daarvan draagt. De andere drie stellingen zijn geen aannames maar gewoon hoe opties werken. De volwassen conclusie: gebruik het model als taal en meetlat, met foutmarges.",
            },
            {
              question:
                "Waarom noemen we de Grieken 'gevoeligheden' en nadrukkelijk geen voorspellingen?",
              options: [
                "Ze beantwoorden als-dan-vragen (wat doet de premie áls de koers of de IV beweegt), maar zeggen niets over wat er zal gebeuren",
                "Omdat ze elke dag door de beurs opnieuw worden vastgesteld",
                "Omdat alleen professionals ze mogen gebruiken",
                "Omdat ze uitsluitend gelden voor Europese indexopties",
              ],
              correctIndex: 0,
              explanation:
                "Delta, gamma, theta en vega beschrijven hoe een positie reageert op mogelijke veranderingen — het zijn afgeleiden, geen prognoses. Wat koers en IV daadwerkelijk gaan doen, weet het model niet. Wie dat onderscheid scherp houdt, gebruikt de Grieken waarvoor ze bedoeld zijn: risico begrijpen, niet de toekomst raden.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "strategieen-met-vangrails",
      title: "Strategieën met vangrails",
      description:
        "Met de Grieken op zak kun je posities bouwen die méér zijn dan een enkele optie: combinaties waarvan de risico's vóóraf vaststaan. Deze module behandelt verticale spreads, straddles en de iron condor — telkens met de eerlijke vraag erbij: wat geef je op voor die vangrails, en wanneer is de premie de moeite waard?",
      lessons: [
        {
          slug: "verticale-spreads",
          title: "Verticale spreads: winst en verlies vooraf bekend",
          durationMin: 10,
          tool: "optie-strategiebouwer",
          intro:
            "Eén optie kopen is een gok op richting, timing én volatiliteit tegelijk. Een verticale spread — een optie kopen en tegelijk een verder gelegen optie schrijven — snijdt daar bewust een stuk vanaf. Wat je overhoudt, is de positie waar deze cursus zijn ondertitel aan dankt: maximale winst, maximaal verlies en breakeven staan vast vóórdat je instapt. Dat is niet saai; dat is het hele punt.",
          sections: [
            {
              heading: "De bull call spread: stijging met een plafond",
              paragraphs: [
                "Een bull call spread bestaat uit twee poten met dezelfde looptijd: je koopt een call en schrijft er tegelijk één met een hogere uitoefenprijs. De ontvangen premie van de geschreven call verlaagt je inleg; in ruil daarvoor lever je alle winst bóven die hogere uitoefenprijs in. Je koopt als het ware de stijging tussen twee niveaus, en niets daarbuiten.",
                "Reken mee op Zeewind NV (koers EUR 40, IV 18%, looptijd 90 dagen). De call EUR 40 kost EUR 1,45; de call EUR 42 levert bij verkoop EUR 0,65 op. Netto betaal je EUR 0,80 per aandeel, dus EUR 80 per contract-combinatie. Dat is meteen je maximale verlies, wat er ook gebeurt.",
                "De maximale winst is de afstand tussen de uitoefenprijzen minus je inleg: EUR 2,00 - EUR 0,80 = EUR 1,20 per aandeel. Die pak je bij elke slotkoers vanaf EUR 42. Je breakeven ligt op de lage uitoefenprijs plus de netto premie: EUR 40,80. Drie getallen, allemaal bekend vóór je eerste transactie — vergelijk dat met de losse callkoper uit les 4, die pas achteraf ontdekte hoeveel beweging hij nodig had.",
              ],
              example: {
                title: "De bull call spread 40/42 op Zeewind NV doorgerekend",
                body:
                  "Inleg: EUR 1,45 betaald - EUR 0,65 ontvangen = EUR 0,80 netto (EUR 80 per contract). Slotkoers EUR 39: beide calls waardeloos, verlies EUR 0,80 — het maximum. Slotkoers EUR 40,80: de gekochte call is EUR 0,80 waard, precies je inleg — breakeven. Slotkoers EUR 42 of hoger: gekochte call minus geschreven call is altijd exact EUR 2,00 waard, winst EUR 1,20 — het maximum, ook als Zeewind naar EUR 50 zou vliegen. Je zet EUR 80 in om maximaal EUR 120 te winnen, en geen enkele uitkomst kan daarbuiten vallen.",
              },
            },
            {
              heading: "De bear put spread: dalen met dezelfde vangrails",
              paragraphs: [
                "Het spiegelbeeld voor wie een daling verwacht: koop een put en schrijf een put met een lágere uitoefenprijs. Op het beweeglijke FlitsTech NV (koers EUR 40, IV 55%, 90 dagen) kost de put EUR 40 zo'n EUR 4,40 — de hoge IV maakt losse opties hier fors geprijsd. Verkoop je er de put EUR 35 tegen in voor ongeveer EUR 2,05, dan daalt je inleg naar EUR 2,35.",
                "Maximaal verlies: EUR 2,35 (elke slotkoers vanaf EUR 40). Maximale winst: EUR 5,00 - EUR 2,35 = EUR 2,65, bij elke slotkoers van EUR 35 of lager. Breakeven: EUR 40 - EUR 2,35 = EUR 37,65. Merk op wat de spread hier extra doet: juist bij een hoge IV, waar losse opties duur zijn, verkoop je zelf óók dure premie terug. De spread dempt zo je gevoeligheid voor de volatiliteit — je vega-risico — omdat beide poten grotendeels samen op en neer bewegen met de IV.",
                "Dat is een patroon om te onthouden: hoe duurder de opties (hoge IV), hoe aantrekkelijker het wordt om er een geschreven poot tegenover te zetten. Je financiert je positie deels met dezelfde dure onzekerheidspremie die je als koper zo dwarszit.",
              ],
            },
            {
              heading: "Wat je opgeeft, en waarom dat meestal verstandig is",
              paragraphs: [
                "Eerlijk over de keerzijde: de spread verkoopt de droom. Verdubbelt FlitsTech niet in waarde maar halveert het naar EUR 20, dan verdient de losse putkoper daar fors aan door — de spreadhouder blijft steken op EUR 2,65. De geschreven poot is een plafond op je fantasie. Wie een spread opzet, zegt hardop: ik verwacht een beweging tót ongeveer daar, en verder betaal ik niet voor.",
                "Daar staat veel tegenover. Je inleg is lager, dus hetzelfde budget spreidt over meer posities of blijft deels aan de zijlijn. Je breakeven ligt dichterbij, dus je hoeft minder spectaculair gelijk te krijgen. Je tijdsverval is milder, omdat de geschreven poot elke dag een deel van jouw theta terugverdient. En bovenal: je kent je maximale verlies op de cent, wat positiegrootte-rekenen (les 8 en 9) van giswerk in rekenwerk verandert.",
                "Voor de meeste particulieren die richting willen spelen met opties, is de verticale spread daarom een verstandiger gereedschap dan de losse optie. Niet omdat hij vaker wint — maar omdat hij vooraf afdwingt dat je nadenkt over hoevéél beweging je verwacht, en omdat geen enkele uitkomst je kan verrassen.",
              ],
              bullets: [
                "Lagere inleg en dichterbij gelegen breakeven dan een losse optie",
                "Gedempt tijdsverval en gedempt vega-risico: beide poten compenseren elkaar deels",
                "De prijs: alle winst voorbij de geschreven uitoefenprijs geef je op",
                "Maximaal verlies staat vast — de basis onder elke serieuze positiegrootte-berekening",
              ],
            },
            {
              heading: "Spreads in de praktijk: kleine lettertjes",
              paragraphs: [
                "Twee poten betekent twee keer transactiekosten en twee keer een geboden-gelaten-marge (daarover meer in les 9). Bij spreads met een kleine netto premie kunnen die kosten een merkbaar deel van je maximale winst opeten — reken dat vooraf door, niet achteraf.",
                "Let ook op de afwikkeling rond de einddatum. Eindigt de koers tússen je twee uitoefenprijzen, dan wordt de ene poot uitgeoefend en loopt de andere waardeloos af — je kunt dan onverwacht aandelen (of een aandelenpositie short) in je depot vinden. Veel beleggers sluiten hun spread daarom kort voor de einddatum, wat dit scenario simpelweg uitschakelt.",
                "Oefen dit alles eerst in de strategiebouwer bij deze les: leg poten op elkaar, schuif aan uitoefenprijzen en kijk hoe het winst-verliesdiagram meebeweegt. De vorm van dat diagram — vloer, plafond, kantelpunt — moet je kunnen dromen vóór je er echt geld in stopt.",
              ],
            },
          ],
          keyTakeaways: [
            "Een verticale spread = optie kopen + verder gelegen optie schrijven, zelfde looptijd: je koopt de beweging tussen twee niveaus",
            "Maximale winst, maximaal verlies en breakeven staan vast vóór je instapt — dat is de kern van de strategie",
            "De geschreven poot verlaagt inleg, tijdsverval en vega-risico, maar zet een plafond op je winst",
            "Bij hoge IV zijn spreads extra logisch: je verkoopt zelf ook dure premie terug",
          ],
          quiz: [
            {
              question:
                "Je zet een bull call spread op: call EUR 40 gekocht voor EUR 1,45, call EUR 42 geschreven voor EUR 0,65. Wat zijn je maximale verlies en maximale winst per aandeel?",
              options: [
                "Maximaal verlies EUR 1,45; maximale winst onbeperkt",
                "Maximaal verlies EUR 0,80; maximale winst EUR 1,20",
                "Maximaal verlies EUR 2,00; maximale winst EUR 0,80",
                "Maximaal verlies EUR 0,65; maximale winst EUR 2,00",
              ],
              correctIndex: 1,
              explanation:
                "Netto inleg: EUR 1,45 - EUR 0,65 = EUR 0,80, en meer kun je nooit verliezen. Maximale winst: afstand tussen de uitoefenprijzen (EUR 2,00) minus de inleg = EUR 1,20. Onbeperkte winst bestaat bij een spread per definitie niet — de geschreven call is het plafond.",
            },
            {
              question: "Waar ligt de breakeven van diezelfde 40/42 bull call spread (netto premie EUR 0,80)?",
              options: [
                "Op EUR 42,00, de geschreven uitoefenprijs",
                "Op EUR 41,20, het midden van de spread",
                "Op EUR 40,80: de lage uitoefenprijs plus de netto betaalde premie",
                "Op EUR 39,20: de lage uitoefenprijs minus de netto premie",
              ],
              correctIndex: 2,
              explanation:
                "Op de einddatum is de gekochte call EUR 0,80 waard bij een koers van EUR 40,80 — precies je inleg terug, terwijl de call EUR 42 nog waardeloos is. Daarboven begint de winst. Het kantelpunt hangt dus aan je werkelijke kosten, niet aan het midden van de spread.",
            },
            {
              question:
                "Waarom is een bear put spread op het hoog-volatiele FlitsTech NV (IV 55%) relatief aantrekkelijker dan een losse put kopen?",
              options: [
                "Omdat je met de geschreven poot zelf ook dure premie terugverkoopt: de hoge IV die de gekochte put duur maakt, financiert deels je positie",
                "Omdat spreads op beweeglijke aandelen geen verlies kunnen maken",
                "Omdat de IV van FlitsTech door de spread daalt",
                "Omdat brokers spreads op volatiele aandelen gratis uitvoeren",
              ],
              correctIndex: 0,
              explanation:
                "Bij IV 55% is de losse put fors geprijsd (EUR 4,40 in het voorbeeld). Door de put EUR 35 te schrijven voor EUR 2,05 vang je zelf een deel van diezelfde onzekerheidspremie en daalt je vega-risico. Verlies blijft uiteraard mogelijk (maximaal de netto inleg), jouw positie verandert niets aan de IV van het aandeel, en gratis uitvoeren bestaat niet.",
            },
            {
              question:
                "FlitsTech NV crasht naar EUR 20. Jouw 40/35 bear put spread (inleg EUR 2,35) levert EUR 2,65 winst — maar een losse put EUR 40 had veel meer opgeleverd. Wat is de juiste conclusie?",
              options: [
                "De spread was een fout: bij een verwachte daling koop je altijd losse puts",
                "De broker had de geschreven poot moeten annuleren bij zo'n grote daling",
                "Dit is precies de afgesproken ruil: je gaf de winst voorbij EUR 35 vooraf op in ruil voor een fors lagere inleg en een dichterbij gelegen breakeven",
                "Spreads werken alleen bij stijgende koersen",
              ],
              correctIndex: 2,
              explanation:
                "Een spread is een bewuste uitspraak: ik verwacht een daling tot ongeveer dáár. Valt de beweging groter uit, dan verdient de losse put meer — maar die kostte ook bijna twee keer zoveel inleg en verloor vaker in alle scenario's waarin de daling uitbleef of klein was. Achteraf het beste pad aanwijzen is geen strategie; vooraf de ruil kennen wel.",
            },
          ],
          xp: 50,
        },
        {
          slug: "straddle-en-strangle",
          title: "Straddle en strangle: beweging kopen, richting loslaten",
          durationMin: 9,
          intro:
            "Soms heb je geen mening over de richting maar wel over de beweging: er komt een uitspraak, een cijferpublicatie, een keuringsbesluit — dít aandeel blijft niet stilstaan. De straddle en de strangle zijn gebouwd voor precies dat idee. Maar er zit een eerlijke adder onder het gras, en die is belangrijker dan de strategie zelf: de markt weet meestal óók dat er beweging aankomt.",
          sections: [
            {
              heading: "De straddle: call en put tegelijk",
              paragraphs: [
                "Een straddle is de meest directe manier om beweging te kopen: je koopt een call én een put met dezelfde at-the-money uitoefenprijs en dezelfde looptijd. Stijgt de koers fors, dan wint de call; daalt hij fors, dan wint de put. Alleen bij een koers die blijft hangen rond de uitoefenprijs verlies je — dan verdampen beide premies.",
                "Reken mee op FlitsTech NV, drie weken vóór de kwartaalcijfers. Koers EUR 40, de maandopties noteren tegen een opgelopen IV van 80%. De call EUR 40 kost EUR 3,65 en de put EUR 40 ook EUR 3,65: samen EUR 7,30 per aandeel. Dat is je maximale verlies — en meteen je horde.",
                "Want de breakevens liggen op EUR 40 plus en min die totale premie: EUR 47,30 en EUR 32,70. FlitsTech moet dus ruim 18% stijgen of dalen vóór de einddatum, alleen maar om quitte te spelen. Lees die zin nog eens: achttien procent, binnen een maand, om níét te verliezen.",
              ],
            },
            {
              heading: "De eerlijke adder: de beweging is al geprijsd",
              paragraphs: [
                "Hier komt les 3 met volle kracht terug. Waaróm kost die straddle EUR 7,30? Omdat de IV op 80% staat — omdat de hele markt weet dat er cijfers aankomen en een grote uitslag verwacht. De prijs van de straddle ís de verwachte beweging: handelaren lezen de straddle-premie letterlijk als 'de markt prijst hier een uitslag van zo'n 18% in'.",
                "Als koper van de straddle verdien je dus niet als FlitsTech beweegt. Je verdient als FlitsTech méér beweegt dan de markt al verwachtte. Komt er een uitslag van 10% — op zichzelf een enorme beweging — dan is je call bij een koers van EUR 44 op de einddatum EUR 4,00 waard, de put niets, en sta je op EUR 3,30 verlies per aandeel. Bijna de helft van je inleg weg, terwijl je 'gelijk had' dat het aandeel hard zou bewegen.",
                "Daar bovenop komt de IV-crush uit les 3: direct na de cijfers klapt de IV omlaag en verdampt de resterende tijdswaarde van beide poten tegelijk. Een straddle rond nieuws is daardoor een wedstrijd tegen een lat die de markt zelf al hoog heeft gelegd. Dat kán uit — soms onderschat de markt een uitslag dramatisch — maar het is het tegendeel van gratis geld.",
              ],
              example: {
                title: "Drie uitkomsten voor de FlitsTech-straddle van EUR 7,30",
                body:
                  "Slotkoers EUR 40 (geen beweging): beide poten waardeloos, verlies EUR 7,30 — het maximum. Slotkoers EUR 44 (+10%): call EUR 4,00, put EUR 0, verlies EUR 3,30 — een forse beweging, toch bijna half je geld kwijt. Slotkoers EUR 30 (-25%): put EUR 10,00, call EUR 0, winst EUR 2,70. Pas voorbij de breakevens EUR 47,30 en EUR 32,70 verdien je iets — de markt had de gemiddelde uitslag al in de premie gestopt, dus jij hebt de uitzonderlijke nodig.",
              },
            },
            {
              heading: "De strangle: goedkoper, maar de lat ligt verder weg",
              paragraphs: [
                "De strangle is het zuinige broertje: in plaats van twee at-the-money opties koop je een out-of-the-money call en een out-of-the-money put — bijvoorbeeld de call EUR 45 en de put EUR 35 op FlitsTech. Samen kosten die pakweg EUR 3,40 in plaats van EUR 7,30: minder dan de helft van de inleg, en dus ook een kleiner maximaal verlies.",
                "Gratis is dat verschil niet. De koers moet nu eerst voorbij EUR 45 of onder EUR 35 komen voordat er überhaupt intrinsieke waarde ontstaat; je breakevens liggen op ongeveer EUR 48,40 en EUR 31,60 — nóg verder weg dan bij de straddle. Je verlaagt je inzet, maar verhoogt de kans dat je hem volledig kwijtraakt: bij elke slotkoers tussen EUR 35 en EUR 45 lopen beide poten waardeloos af.",
                "Straddle of strangle is dus geen kwaliteitsverschil maar een knop: hoeveel wil je betalen, tegen welke kans op totaalverlies? Wat beide gemeen hebben: het zijn long-vega-, long-gamma- en fors negatieve-theta-posities. Elke rustige dag kost geld aan twéé poten tegelijk. Wie beweging koopt, moet die beweging snel krijgen.",
              ],
              bullets: [
                "Straddle: at-the-money call + put, duurste variant, dichtstbijzijnde breakevens",
                "Strangle: out-of-the-money call + put, goedkoper, maar grotere kans op totaalverlies",
                "Beide betalen dubbele theta: stilstand kost elke dag aan twee poten",
                "Beide zijn pas winstgevend bij een beweging gróter dan de markt al inprijsde",
              ],
            },
            {
              heading: "Wanneer is beweging kopen wél te verdedigen?",
              paragraphs: [
                "Na al deze nuchterheid de eerlijke andere kant: er zijn momenten waarop beweging kopen een verdedigbare, doordachte positie is. De kern is steeds dezelfde — je moet een onderbouwde reden hebben om te denken dat de markt de kómende beweging ónderschat. Niet 'er gaat iets gebeuren' (dat weet iedereen), maar 'er gaat meer gebeuren dan deze IV suggereert'.",
                "Denk aan situaties met echte tweedeling: een rechtszaak of keuringsbesluit waarbij de uitkomst het bedrijf fundamenteel verandert, terwijl de opties tegen een relatief bescheiden IV noteren. Of een lange periode van uitzonderlijke stilte waarin de IV is weggezakt naar historische bodems, terwijl jij redenen ziet waarom de rust niet houdbaar is. In beide gevallen is je stelling toetsbaar: vergelijk de ingeprijsde beweging (de straddle-premie) met wat jij aannemelijk acht.",
                "En als je die stelling niet hard kunt maken? Dan is de conclusie ook helder, en die mag je gerust bevrijdend vinden: geen positie. De straddle verplicht je tot niets. Het vermogen om een strategie te begrijpen en hem vervolgens níét te gebruiken, is bij opties minstens zo waardevol als de strategie zelf.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Option Volatility and Pricing",
              author: "Sheldon Natenberg",
              year: 1994,
              note: "Natenbergs behandeling van 'de ingeprijsde beweging' is de professionele onderbouwing van deze les: je handelt nooit tegen de beweging zelf, altijd tegen de verwachting ervan.",
            },
          ],
          keyTakeaways: [
            "Straddle (at-the-money call + put) en strangle (beide out-of-the-money) verdienen aan beweging, ongeacht de richting",
            "De premie van een straddle ís de door de markt verwachte uitslag: je wint pas bij méér beweging dan ingeprijsd",
            "Rond bekend nieuws stapelen twee tegenwinden: dubbele theta én de IV-crush direct na de publicatie",
            "Beweging kopen is alleen verdedigbaar met een toetsbare reden waarom de markt de uitslag onderschat — anders: geen positie",
          ],
          quiz: [
            {
              question:
                "Een straddle op FlitsTech NV (koers EUR 40) kost EUR 7,30. Het aandeel beweegt na de cijfers 10% omhoog, naar EUR 44 op de einddatum. Wat is je resultaat?",
              options: [
                "Winst EUR 4,00: de call is in-the-money geëindigd",
                "Verlies EUR 3,30: de call is EUR 4,00 waard, maar dat is minder dan de EUR 7,30 die beide poten samen kostten",
                "Break-even: de beweging van 10% compenseert de premie precies",
                "Winst EUR 2,70: put en call middelen elkaar uit",
              ],
              correctIndex: 1,
              explanation:
                "Op de einddatum telt alleen intrinsieke waarde: de call EUR 40 is bij koers EUR 44 precies EUR 4,00 waard en de put niets. EUR 4,00 - EUR 7,30 = EUR 3,30 verlies. Een beweging van 10% klinkt enorm, maar de markt had via de IV van 80% al een uitslag van zo'n 18% ingeprijsd — en tegen díé lat speel je.",
            },
            {
              question: "Wat is het belangrijkste conceptuele verschil tussen een straddle en een verticale spread?",
              options: [
                "Een straddle koopt beweging ongeacht de richting; een verticale spread speelt juist een richting met begrensde winst en verlies",
                "Een straddle heeft geen maximaal verlies, een spread wel",
                "Een straddle gebruikt twee looptijden, een spread één",
                "Een spread werkt alleen op indexen, een straddle alleen op aandelen",
              ],
              correctIndex: 0,
              explanation:
                "De spread is een richtingspositie met vangrails; de straddle laat de richting bewust los en betaalt daarvoor dubbele premie. Ook een straddle heeft overigens een vast maximaal verlies (de totale betaalde premie), beide gebruiken normaal gesproken één looptijd, en beide bestaan op aandelen én indexen.",
            },
            {
              question:
                "Waarom is een strangle goedkoper dan een straddle op hetzelfde aandeel, en wat is de prijs van dat voordeel?",
              options: [
                "De strangle gebruikt kortere looptijden; nadeel is meer tijdsverval",
                "Brokers geven korting op out-of-the-money combinaties; nadeel is een lagere prioriteit bij uitvoering",
                "De poten liggen out-of-the-money en bevatten dus minder premie; nadeel: de koers moet verder bewegen en de kans dat béíde poten waardeloos aflopen is groter",
                "De strangle bevat maar één optie in plaats van twee",
              ],
              correctIndex: 2,
              explanation:
                "Out-of-the-money opties zijn goedkoper dan at-the-money opties, dus de totale inleg daalt. Maar er ontstaat pas intrinsieke waarde voorbij de verder weg gelegen uitoefenprijzen: de breakevens schuiven naar buiten en het hele gebied ertussen betekent totaalverlies. Zuiniger inzet, hogere lat — een knop, geen gratis verbetering.",
            },
            {
              question:
                "Wanneer is het kopen van een straddle rond een nieuwsmoment het best te verdedigen?",
              options: [
                "Altijd vlak vóór kwartaalcijfers, want dan is een grote uitslag vrijwel zeker",
                "Wanneer de IV extreem hoog staat, want dat bewijst dat er veel gaat gebeuren",
                "Nooit: beweging kopen verliest per definitie",
                "Wanneer je een toetsbare reden hebt om te denken dat de werkelijke uitslag gróter wordt dan de beweging die de straddle-premie al inprijst",
              ],
              correctIndex: 3,
              explanation:
                "Dat er beweging komt, weet de hele markt — dat zit al in de premie, en een hoge IV maakt de lat juist hóger, niet lager. Je verdient alleen aan het verschil tussen werkelijkheid en verwachting. Kun je niet onderbouwen waarom de markt de uitslag onderschat, dan is geen positie een volwaardige (en vaak de beste) keuze. 'Nooit' is ook te kort door de bocht: soms onderschat de markt wel degelijk.",
            },
          ],
          xp: 50,
        },
        {
          slug: "iron-condor-en-kalenderspread",
          title: "Iron condor en kalenderspread: premie met een vangnet",
          durationMin: 10,
          tool: "optie-strategiebouwer",
          intro:
            "Na het kópen van beweging nu de andere kant van de tafel: premie ontvangen omdat je verwacht dat er juist wéínig gebeurt — maar dan mét een vangnet eronder, anders dan de naakte schrijver. De iron condor is daarvan het bekendste voorbeeld. En meteen krijg je er de belangrijkste statistiekles van deze cursus bij: waarom een hoge winkans niets zegt over winstgevendheid.",
          sections: [
            {
              heading: "De iron condor: vier poten, één verwachting",
              paragraphs: [
                "Een iron condor combineert twee verticale spreads uit les 5: een geschreven put spread ónder de koers en een geschreven call spread erbóven. Je ontvangt netto premie, en die houd je volledig als de koers op de einddatum tussen de twee geschreven uitoefenprijzen blijft. Beweegt de koers er wél voorbij, dan begrenzen de gekochte buitenpoten je verlies — dat is het verschil met naakt schrijven, en het hele bestaansrecht van de constructie.",
                "Een voorbeeld op een fictieve AEX-achtige index die op 900 punten staat, met zes weken looptijd. Je schrijft de put 860 en koopt de put 840; je schrijft de call 940 en koopt de call 960. Netto ontvang je 4 punten premie. Blijft de index tussen 860 en 940 — een band van bijna 9% — dan is alles waardeloos op de einddatum en houd je die 4 punten.",
                "Het maximale verlies is de breedte van één vleugel minus de ontvangen premie: 20 - 4 = 16 punten, bereikt als de index onder 840 of boven 960 sluit. Zie de verhouding onder ogen: je wint vaak een klein bedrag en verliest zelden een viervoud daarvan. Die asymmetrie is geen ontwerpfout — het is de essentie, en hij verdient een eigen sectie.",
              ],
            },
            {
              heading: "Waarom een hoge winkans géén winstgevendheid is",
              paragraphs: [
                "Stel dat de kans dat de index binnen de band blijft 80% is — niet onrealistisch voor deze afstanden. Dan wint deze condor vier van de vijf keer. Menig verkoper van cursussen-met-gouden-bergen zou dat adverteren als 'strategie met 80% winrate', en het klopt nog ook. Het zegt alleen niets.",
                "Reken de verwachtingswaarde uit: 80% kans op +4 punten en 20% kans op -16 punten geeft 0,80 x 4 - 0,20 x 16 = 3,2 - 3,2 = 0. Precies nul, vóór transactiekosten. De hoge winkans wordt exact gecompenseerd door het zeldzame, viermaal grotere verlies. Een winrate zonder de bijbehorende winst- en verliesomvang is geen informatie maar reclame — dit is de rekensom die je voor elke 'bijna altijd winst'-strategie moet maken, en de reden dat wij nooit met winrates adverteren.",
                "Of een echte condor uiteindelijk iets oplevert, hangt dus af van de vraag of de ontvangen premie de werkelijke kansen overtreft — bijvoorbeeld doordat de IV structureel iets te hoog staat (daarover alles in les 8). Dat voordeel, áls het er is, is klein en broos: een paar punten geboden-gelaten-marge en transactiekosten over vier poten eten er direct van op. En de psychologie is onaangenamer dan de statistiek: maandenlang kleine winsten maken zorgeloos, precies wanneer die ene verliesmaand nadert die er vier moet uitwissen.",
              ],
              example: {
                title: "De condor-rekensom die elke folder weglaat",
                body:
                  "Iron condor op de index van 900: premie 4 punten ontvangen, maximaal verlies 16 punten, kans op volledige winst 80%. Verwachtingswaarde: 0,80 x 4 - 0,20 x 16 = 0 punten — vóór kosten. Trek er per condor bijvoorbeeld 0,5 punt aan kosten en marges af, en de verwachting is negatief. Dezelfde strategie 'wint' intussen vier van de vijf maanden. Winrate: 80%. Resultaat: verlies. Beide zinnen zijn waar, en alleen de tweede telt.",
              },
            },
            {
              heading: "De kalenderspread: tijd verkopen, tijd kopen",
              paragraphs: [
                "De kalenderspread speelt niet met uitoefenprijzen maar met looptijden: je schrijft een kort lopende optie en koopt een langer lopende met dezelfde uitoefenprijs. Het idee komt rechtstreeks uit les 2: tijdsverval versnelt aan het einde van de looptijd. De korte poot die je schreef, verdampt dus sneller dan de lange poot die je bezit — en dat verschil is je beoogde winst.",
                "Het gedroomde scenario: de koers blijft rond de uitoefenprijs hangen, de korte optie loopt waardeloos af, en jij houdt een langer lopende optie over die nog volop waarde heeft en die je kunt verkopen of opnieuw kunt 'verhuren' door de volgende korte optie te schrijven. Beweegt de koers juist fors weg van de uitoefenprijs, dan verliezen beide poten hun tijdswaarde en verlies je (een deel van) de betaalde netto premie — meer dan die netto premie kan het bij deze gekochte variant niet worden.",
                "De verborgen dimensie is vega. Je lange poot heeft veel meer vega dan je korte (les 3: vega groeit met de looptijd), dus een kalenderspread is per saldo een long-volatiliteitspositie: een dalende IV doet stille pijn, een stijgende IV helpt. Wie een kalenderspread opzet zonder naar het IV-niveau te kijken, speelt ongemerkt een tweede wedstrijd mee — en juist die wedstrijd bepaalt vaak het resultaat.",
              ],
              bullets: [
                "Kalenderspread: korte looptijd schrijven + lange looptijd kopen, zelfde uitoefenprijs",
                "Verdient aan het verschil in tijdsverval; ideaal scenario is een koers die blijft hangen rond de uitoefenprijs",
                "Maximaal verlies bij de gekochte variant: de betaalde netto premie",
                "Per saldo long vega: dalende IV is de stille tegenstander",
              ],
            },
            {
              heading: "Voor wie zijn deze constructies eigenlijk?",
              paragraphs: [
                "Eerlijk antwoord: voor een kleine minderheid. Condors en kalenderspreads vragen vier respectievelijk twee poten aan onderhoud, actief beheer rond de einddatum, begrip van IV-niveaus én de discipline om verliezers volgens plan te sluiten in plaats van te hopen. De premies zijn klein, dus kosten en slordigheid wegen onevenredig zwaar. Dit is boekhoudkundig werk met een risicostaart, geen passief inkomen.",
                "Wat deze les je vooral moet opleveren, is niet de aandrang om condors te gaan schrijven, maar een detector: zodra iemand je een strategie toont met de nadruk op hoe váák hij wint, weet jij welke rekensom er wordt weggelaten. Vraag altijd naar de omvang van de zeldzame verliezen — en of de verteller die zelf al eens heeft meegemaakt. Die vraag is de beste gratis bescherming die deze cursus je kan geven, en in de volgende les zie je wat er gebeurt met wie hem nooit stelde.",
              ],
            },
          ],
          keyTakeaways: [
            "Een iron condor = geschreven put spread + geschreven call spread: premie houden als de koers binnen de band blijft, verlies begrensd door de gekochte vleugels",
            "Hoge winkans zegt niets zonder de verhouding tussen winst- en verliesomvang: reken altijd de verwachtingswaarde uit",
            "Veel kleine winsten plus zeldzame grote verliezen kan netto nul of negatief zijn — en voelt intussen als een winnende strategie",
            "De kalenderspread verdient aan versnellend tijdsverval van de korte poot, maar is ongemerkt een long-vega-positie",
          ],
          quiz: [
            {
              question:
                "Een iron condor levert 4 punten premie op met een maximaal verlies van 16 punten, en de kans op volledige winst is 80% (kans op maximaal verlies 20%). Wat is de verwachtingswaarde vóór kosten?",
              options: [
                "Ongeveer 0 punten: 0,80 x 4 - 0,20 x 16 = 0",
                "+3,2 punten: 80% van de premie",
                "+4 punten: de premie is al ontvangen en dus binnen",
                "-16 punten: het maximale verlies telt altijd volledig mee",
              ],
              correctIndex: 0,
              explanation:
                "Verwachtingswaarde = kans x uitkomst, opgeteld over de scenario's: 0,80 x 4 - 0,20 x 16 = 3,2 - 3,2 = 0. De ontvangen premie is pas definitief als de band houdt, en het maximale verlies weegt via zijn kans mee, niet volledig. Een strategie die vier van de vijf keer wint, kan dus exact niets opleveren — vóór kosten.",
            },
            {
              question: "Wat onderscheidt een iron condor fundamenteel van naakt geschreven opties?",
              options: [
                "De condor heeft een hogere winkans",
                "De gekochte buitenpoten begrenzen het maximale verlies tot een vooraf bekend bedrag",
                "De condor ontvangt meer premie per positie",
                "Naakt schrijven mag alleen op aandelen, condors alleen op indexen",
              ],
              correctIndex: 1,
              explanation:
                "De vleugels — de gekochte opties buiten de geschreven — vormen het vangnet: het verlies stopt bij de breedte van de vleugel minus de premie. Naakt schrijven mist dat net en kan bij extreme bewegingen veelvouden van de premie verliezen (les 8). De condor ontvangt door de gekochte poten juist mínder premie: dat is de prijs van het vangnet.",
            },
            {
              question: "Op welk mechanisme uit de Grieken-module leunt de kalenderspread het zwaarst?",
              options: [
                "Delta: de korte poot heeft een hogere richtingsgevoeligheid",
                "De skew: puts zijn duurder dan calls",
                "Gamma: de lange poot explodeert bij kleine bewegingen",
                "Theta: het tijdsverval van de kort lopende geschreven optie versnelt harder dan dat van de lang lopende gekochte",
              ],
              correctIndex: 3,
              explanation:
                "Les 2 liet zien dat tijdsverval niet lineair is maar versnelt richting de einddatum. De kalenderspread verkoopt precies het steilste stuk van die helling (korte looptijd) en bezit het vlakke stuk (lange looptijd). Delta's zijn bij gelijke uitoefenprijs juist vergelijkbaar, en de skew gaat over uitoefenprijzen, niet looptijden.",
            },
            {
              question:
                "Iemand demonstreert je een 'strategie met 90% winrate' aan de hand van twee jaar louter winstgevende maanden. Welke vraag ontbreekt?",
              options: [
                "Op welk platform de transacties zijn uitgevoerd",
                "Hoe groot de zeldzame verliezen zijn wanneer ze komen — en of die twee jaar er toevallig geen bevatte",
                "Of de strategie ook op Nederlandse aandelen werkt",
                "Hoeveel posities er per maand zijn geopend",
              ],
              correctIndex: 1,
              explanation:
                "Winrate zonder verliesomvang is reclame, geen informatie: 90% kleine winsten kan moeiteloos worden uitgewist door 10% grote verliezen, en een gunstige periode van twee jaar kan het verliesscenario simpelweg nog niet bevat hebben. De condor-rekensom uit deze les — verwachtingswaarde over álle scenario's — is de toets. De volgende les toont wat er gebeurt als niemand hem maakt.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "de-realiteit",
      title: "De realiteit",
      description:
        "Strategieën op papier zijn het makkelijke deel. Deze slotmodule gaat over wat er in de echte wereld bij komt: waarom schrijvers gemiddeld winnen en hoe dat gemiddelde kan bedriegen, hoe marge en brokerregels werken, wat kosten structureel doen met kleine premies — en hoe je met een journaal je eigen eerlijkste leermeester wordt.",
      lessons: [
        {
          slug: "waarom-de-schrijver-meestal-wint",
          title: "Waarom de schrijver meestal wint — en soms alles verliest",
          durationMin: 10,
          intro:
            "Door de hele optie-leerlijn klonk het al: de schrijver int premie en wint vaak. Dat is geen mythe — er zit een echt, meetbaar mechanisme achter dat de volatiliteitsrisicopremie heet. Maar 'meestal winnen' en 'een goede strategie' zijn twee verschillende dingen, en in deze les staat het geschiedenisverhaal dat dat verschil voorgoed in je geheugen zal branden.",
          sections: [
            {
              heading: "De volatiliteitsrisicopremie: een echt fenomeen",
              paragraphs: [
                "Vergelijk over lange periodes de implied volatility (wat de markt aan beweging inprijsde) met de gerealiseerde volatiliteit (wat er daadwerkelijk gebeurde), en er verschijnt een opvallend patroon: de verwachting ligt gemiddeld iets hóger dan de uitkomst. Opties zijn, gemiddeld genomen en over lange periodes, iets te duur geprijsd. Wie ze structureel schrijft, vangt dat verschil — de volatiliteitsrisicopremie.",
                "Waarom bestaat die premie, als iedereen haar kan zien? Om dezelfde reden dat brandverzekeraars gemiddeld winst maken: mensen betálen graag iets te veel om van een klein-maar-verwoestend risico af te zijn. De kopers van bescherming (denk aan de puts uit de skew-les) zijn geen dommeriken — ze kopen gemoedsrust, en de schrijver is hun verzekeraar. De premie is de vergoeding voor het overnemen van precies dat staartrisico.",
                "En daarmee is de premie geen anomalie die 'wegge-arbitreerd' zal worden, maar een beloning voor gedragen risico. Die zin heeft een spiegelbeeld dat je nooit mag vergeten: wie de premie int, hééft dat risico. Elke maand premie ontvangen zonder ooit de staart te zien, betekent niet dat de staart niet bestaat — alleen dat hij nog niet langs is geweest.",
              ],
            },
            {
              heading: "OptionSellers.com: jaren gelijk, in dagen kapot",
              paragraphs: [
                "Nu het verhaal dat elke premie-verkoper zou moeten kennen. OptionSellers.com was een echt Amerikaans vermogensbeheerbedrijf uit Tampa, Florida, dat voor honderden vermogende klanten naakte opties schreef op grondstoffen — dus zonder de vangnetten uit les 7. De oprichter schreef er zelfs een boek over en verscheen jarenlang in de financiële media. De strategie werkte. Jaar na jaar kwamen de premies binnen, en de resultaten leken het verhaal te bewijzen.",
                "In november 2018 explodeerde de Amerikaanse aardgasprijs: in enkele dagen tientallen procenten omhoog, met op het hoogtepunt een dagbeweging van rond de 20%. Het fonds had naakte calls op aardgas geschreven — onbegrensd verlies bij een prijsexplosie, en die kwam. De verliezen overtroffen niet alleen alle marge, maar het volledige vermogen van de klanten: rekeningen werden leeggeveegd en een deel van de klanten bleef met een schúld bij de broker achter. Het bedrijf moest zijn klanten in een videoboodschap meedelen dat alles weg was.",
                "Lees de tijdlijn nog eens: járen van gestage winsten, gevolgd door een totale vernietiging in ongeveer een week. Dat is geen pech die iedereen kan overkomen — het is de wiskundige signatuur van naakt premie verkopen zonder begrenzing: een lange reeks kleine plussen, en één min die niet alleen de plussen maar het hele vermogen opslokt. In het vak heet dit patroon 'pennies voor de stoomwals rapen': elke losse penny is echt, en de stoomwals ook.",
              ],
            },
            {
              heading: "Wat er precies misging — en wat niet",
              paragraphs: [
                "Het is belangrijk om te ontleden wát hier faalde, want 'opties schrijven is dom' is de verkeerde les. De volatiliteitsrisicopremie die het fonds oogstte, bestond echt. Het marktinzicht was niet het probleem. Het probleem was de constructie: naakt (geen gekochte poten die het verlies begrenzen), met hefboom via marge (posities groter dan het vermogen), op een grondstof die berucht is om explosieve bewegingen — aardgas draagt op Amerikaanse handelsvloeren niet voor niets de bijnaam 'de weduwenmaker'.",
                "Vergelijk met de gereedschappen uit deze leerlijn. De covered call uit Beschermen & Verdienen is gedekt: het 'verlies' is gemiste winst boven de uitoefenprijs, nooit een schuld. De spreads en condors uit module 2 hebben gekochte vleugels: het maximale verlies staat vast vóór je instapt. Naakt schrijven op marge is de enige variant waarin de staart je hele vermogen — en meer — kan pakken. Precies daarom is het de scherpste waarschuwing van deze cursus: dit is het punt waar 'meestal winnen' en 'ooit alles verliezen' in één strategie samenkomen.",
                "En onthoud uit les 7: een hoge winkans an sich bewijst niets. OptionSellers had jarenlang een prachtige winrate. De verwachtingswaarde over álle scenario's — inclusief de stoomwals — was een andere som, en die som werd nooit gemaakt waar klanten bij waren.",
              ],
              bullets: [
                "Gedekt schrijven (covered call): maximale schade is gemiste winst — geen vangnet nodig, het aandeel ís het vangnet",
                "Spread of condor: gekochte poten begrenzen het verlies tot een vooraf bekend bedrag",
                "Naakt schrijven op marge: winst begrensd tot de premie, verlies onbegrensd — de enige variant die een schuld kan opleveren",
                "Een jarenlange winstreeks bewijst niet dat het staartrisico weg is; alleen dat het nog niet langskwam",
              ],
            },
            {
              heading: "Positiegrootte: de eerste en laatste verdediging",
              paragraphs: [
                "Als er één beheersmaatregel is die het verschil maakt tussen 'een pijnlijke maand' en 'een geruïneerde klant', is het positiegrootte. Niet de strategie, niet de timing, niet het marktinzicht — de omvang. Een verlies van 100% op een positie van 2% van je vermogen is een leermoment; hetzelfde verlies op een positie met hefboom van drie keer je vermogen is het einde van het spel. De rekensom van OptionSellers ging niet mis op de kansen maar op de omvang.",
                "Praktisch, voor wie ooit premie schrijft: bepaal per positie het échte maximale verlies (bij een spread staat het vast; bij naakt schrijven is het antwoord 'meer dan je denkt' — en dat is het antwoord dat je moet horen), en toets dat tegen je totale vermogen. Vuistregel uit deze leerlijn: als het maximale verlies van één positie je nachtrust of je jaarresultaat kan breken, is de positie te groot, ongeacht hoe aantrekkelijk de premie oogt.",
                "En let op de stille sluiproute waarlangs posities tóch te groot worden: succes. Elke geïncasseerde premie fluistert dat het wel wat meer kan. Wie tien keer wint, verhoogt de inzet — en staat bij de elfde keer precies verkeerd. Dit is geen karakterzwakte van anderen; het is de standaardinstelling van mensen, en het journaal uit de volgende les is er het tegengif voor.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Volatility Trading",
              author: "Euan Sinclair",
              year: 2008,
              note: "De volgende stap voor wie de volatiliteitsrisicopremie serieus wil bestuderen. Wiskundig zwaar en grotendeels geen lesstof voor particulieren — dat zeggen we er eerlijk bij. Lees hem als je wilt weten hoe diep dit vak werkelijk gaat.",
            },
          ],
          keyTakeaways: [
            "De volatiliteitsrisicopremie is echt: implied volatility ligt gemiddeld iets boven de gerealiseerde, en schrijvers oogsten dat verschil als verzekeringspremie",
            "Die premie is een beloning voor gedragen staartrisico — wie haar int, dráágt dat risico, ook als het jaren onzichtbaar blijft",
            "OptionSellers.com (2018): jaren winst met naakte grondstofopties, in dagen volledig vernietigd — klanten verloren alles en hielden deels schuld over",
            "Naakt schrijven op marge is de enige variant waarin verlies je vermogen kan overtreffen; gedekt schrijven en spreads begrenzen de schade per constructie",
            "Positiegrootte is de eerste en laatste verdediging: geen enkele winkans maakt een te grote positie goed",
          ],
          quiz: [
            {
              question: "Wat is de volatiliteitsrisicopremie?",
              options: [
                "De extra premie die brokers rekenen op volatiele aandelen",
                "Het verschijnsel dat implied volatility gemiddeld iets hoger ligt dan de later gerealiseerde beweging, waardoor optieschrijvers gemiddeld een verzekeringsachtige vergoeding oogsten",
                "De wettelijke opslag op optiepremies in turbulente markten",
                "Het bedrag dat je betaalt om een positie vervroegd te sluiten",
              ],
              correctIndex: 1,
              explanation:
                "Kopers van opties betalen gemiddeld iets te veel voor bescherming en kansen — zoals verzekerden gemiddeld iets te veel premie betalen. Schrijvers vangen dat verschil als vergoeding voor het overnemen van staartrisico. Het is een marktfenomeen, geen brokeropslag of wettelijke regeling.",
            },
            {
              question:
                "OptionSellers.com boekte jarenlang winst en werd in november 2018 in ongeveer een week vernietigd. Welke combinatie maakte dat mogelijk?",
              options: [
                "Naakte geschreven opties (onbegrensd verlies) plus hefboom via marge, op een grondstof met explosieve prijsbewegingen",
                "Een boekhoudfraude die jarenlang verborgen bleef",
                "Gedekte calls op een aandeel dat failliet ging",
                "Te kleine posities, waardoor de winsten de kosten niet dekten",
              ],
              correctIndex: 0,
              explanation:
                "De strategie was legaal en het inzicht (de volatiliteitsrisicopremie) was echt; de constructie was fataal. Naakte calls op aardgas hadden onbegrensd verlies, marge maakte de posities groter dan het klantvermogen, en de gasprijsexplosie deed de rest: rekeningen leeg en deels schulden. Gedekte calls kunnen dit patroon per constructie niet opleveren.",
            },
            {
              question: "Waarom noemen handelaren naakt premie verkopen 'pennies voor de stoomwals rapen'?",
              options: [
                "Omdat de premies te klein zijn om van te leven",
                "Omdat de strategie alleen met heel veel kleine posities werkt",
                "Omdat je vaak kleine, echte winsten int terwijl je een zeldzaam maar verwoestend verlies riskeert dat alle winsten en meer kan opslokken",
                "Omdat de transactiekosten per positie hoger zijn dan de premie",
              ],
              correctIndex: 2,
              explanation:
                "Elke penny is echt — de winrate klopt, jarenlang. Maar het profiel is asymmetrisch: begrensde kleine winsten tegenover een onbegrensd staartverlies. De metafoor dwingt je beide te zien: de pennies én de stoomwals. Wie alleen de reeks pennies in de grafiek ziet, kijkt naar precies de helft van het verhaal.",
            },
            {
              question:
                "Welke maatregel had het lot van de OptionSellers-klanten het meest fundamenteel veranderd?",
              options: [
                "Een betere voorspelling van de gasprijs in november 2018",
                "Begrensde constructies (spreads in plaats van naakt) en positiegroottes waarbij het maximale verlies het vermogen nooit kon overtreffen",
                "Sneller handelen tijdens de prijsexplosie zelf",
                "Spreiding over meerdere brokers",
              ],
              correctIndex: 1,
              explanation:
                "Voorspellen van explosies is precies wat structureel niet lukt, en tijdens een prijsexplosie op een krappe markt is 'snel sluiten' vaak illusoir. De enige verdediging die vooraf vaststaat, is constructie plus omvang: gekochte poten die het verlies begrenzen, en posities die zelfs in het slechtste scenario het vermogen niet kunnen breken. Spreiding over brokers verandert niets aan de posities zelf.",
            },
          ],
          xp: 50,
        },
        {
          slug: "marge-brokerregels-en-jouw-journaal",
          title: "Marge, brokerregels en jouw journaal",
          durationMin: 10,
          intro:
            "De slotles gaat niet over nóg een strategie, maar over de omgeving waarin al het voorgaande plaatsvindt: het geld dat je broker als onderpand eist, de drempels die hij bewust opwerpt, de kosten die stilletjes aan elke premie knagen — en het gereedschap waarmee je je eigen eerlijkste beoordelaar wordt. Plus een afsluitende gedachte die je van ons mag verwachten.",
          sections: [
            {
              heading: "Marge: het onderpand achter elke geschreven optie",
              paragraphs: [
                "Wie een optie schrijft, gaat een verplichting aan die veel groter kan worden dan de ontvangen premie. Je broker eist daarom onderpand: marge. Dat is geen kostenpost maar een reservering — een deel van je vermogen dat wordt geblokkeerd als zekerheid dat je je verplichting kunt nakomen. Hoeveel, hangt af van de positie: gedekte constructies en spreads vragen weinig (het maximale verlies is immers begrensd en bekend), naakte posities veel meer.",
                "Het venijn zit in de dynamiek: marge-eisen zijn niet vast. Beweegt de markt tegen je in of schiet de volatiliteit omhoog, dan stijgt de vereiste marge — precies op het moment dat je positie verlies laat zien. Dekt je vermogen de eis niet meer, dan volgt de margin call: bijstorten of de broker sluit posities, naar eigen inzicht en op het moment dat de prijzen tegen je in staan. In het OptionSellers-verhaal was dit het mechanisme dat de verliezen realiseerde: gedwongen sluiten in een markt in paniek.",
                "De praktische les: reken nooit met de marge van een rustige dag. Wie zijn margeruimte vol benut in kalm weer, wordt in storm gedwongen verkocht — en gedwongen verkopen gebeuren per definitie tegen de slechtst denkbare prijzen. Ruimte overhouden is geen voorzichtigheid als karaktertrek maar als rekensom.",
              ],
            },
            {
              heading: "Waarom je broker drempels opwerpt — en dat terecht is",
              paragraphs: [
                "Opties schrijven kan niet zomaar. Brokers delen klanten in risicoprofielen in en vragen kennis- en ervaringstoetsen voordat ze optiehandel vrijgeven; ongedekt schrijven zit doorgaans in de hoogste categorie, achter de meeste drempels. Dat is geen betutteling maar tweeledige zelfbescherming: Europese regels verplichten brokers te toetsen of een product bij de klant past, en een klant met een schuld die hij niet kan betalen, is uiteindelijk óók het probleem van de broker.",
                "Onze eerlijke aanmoediging: behandel die drempels als informatie, niet als hindernis. Als je broker voor een strategie een uitgebreide waarschuwing en een extra toets nodig vindt, vertelt hij je iets over de staartrisico's — dezelfde staart die in les 8 langskwam. De vragenlijst invullen 'zoals ze het willen horen' om een hoger profiel te ontgrendelen, is jezelf voorliegen met extra stappen.",
                "Weet ook wat de drempels níét doen: ze toetsen kennis, geen discipline. Dat een strategie voor je is opengezet, betekent niet dat de positiegrootte klopt of dat het moment verstandig is. De poort beschermt tegen onwetendheid; tegen overmoed bescherm je alleen jezelf.",
              ],
            },
            {
              heading: "Kosten en spreads: de structurele tegenwind",
              paragraphs: [
                "Elke optietransactie betaalt twee tollen. De zichtbare: transactiekosten per contract, bij elke poot, bij openen én sluiten. De onzichtbare en meestal grotere: de geboden-gelaten-marge. Staat een optie EUR 1,40 geboden en EUR 1,60 gelaten, dan is de eerlijke middenprijs EUR 1,50 — maar jij koopt tegen EUR 1,60 en verkoopt tegen EUR 1,40. Wie opent en sluit, staat EUR 0,20 achter op een positie van EUR 1,50: ruim 13%, nog vóór één cent transactiekosten.",
                "Voor meerpotige constructies telt dit dubbel of viervoudig op. De iron condor uit les 7 met zijn 4 punten premie verliest over vier poten al snel een substantieel deel van zijn toch al krappe verwachtingswaarde aan marges en kosten. Dit is de nuchtere reden waarom strategieën die 'op papier' nét positief zijn, in de praktijk vaak nét negatief uitpakken — en waarom professionals obsessief op uitvoeringskosten letten.",
                "Praktische gewoontes die direct geld waard zijn: handel met limietorders (nooit bestens in een optieboek), bij voorkeur in liquide series met krappe marges, en tel vóór elke positie de totale kosten van openen én sluiten op. Is die som meer dan een klein deel van je realistisch verwachte winst, dan is de positie het niet waard — hoe mooi de strategie ook is.",
              ],
              bullets: [
                "Geboden-gelaten-marge is de grootste verborgen kostenpost: bij EUR 1,40-1,60 kost een rondje ruim 13% van de middenprijs",
                "Elke poot betaalt kosten bij openen én sluiten; meerpotige constructies vermenigvuldigen dat",
                "Gebruik limietorders en liquide series; vermijd optieseries met brede marges",
                "Reken de totale kostensom vóóraf af tegen de realistisch verwachte winst",
              ],
            },
            {
              heading: "Het journaal: jouw eigen eerlijkste leermeester",
              paragraphs: [
                "Uit alle voorgaande lessen komt één rode draad: bij opties bedriegt het resultaat. Winsten kunnen uit geluk komen (de stoomwals bleef weg), verliezen uit pech bij een goede beslissing. Wie alleen naar de uitkomst kijkt, leert dus de verkeerde lessen. Het tegengif is een journaal waarin je vóóraf vastlegt wat je denkt — zodat je achteraf je denkwerk kunt beoordelen in plaats van je geluk.",
                "Een bruikbaar format per positie, ingevuld vóór de order: de datum en de constructie (welke poten, welke looptijd); je these in één zin (wat verwacht je, vóór wanneer, en waarom denk je dat de markt dit verkeerd prijst); de IV op dat moment en of die hoog of laag staat voor dit aandeel; je maximale verlies in euro's én als percentage van je vermogen; je exit-plan (bij welke winst, welk verlies of welke datum sluit je); en de totale verwachte kosten. Na het sluiten: de uitkomst, en — belangrijker — of je je plan hebt gevolgd.",
                "Beoordeel jezelf maandelijks op die laatste kolom, niet op het rendement. Een verlies volgens plan is een goede transactie met een slechte uitkomst; een winst buiten het plan om is een slechte transactie met een goede uitkomst, en die tweede categorie is op termijn de duurste. Dit klinkt streng, maar het is precies wat het verschil bleek tussen de professionals die 2018 overleefden en de premie-rapers die het niet overleefden: niet slimmere voorspellingen, maar strengere administratie.",
              ],
              example: {
                title: "Eén journaalregel, ingevuld",
                body:
                  "12 maart — Bull call spread Zeewind NV 40/42, 90 dagen, netto EUR 0,80 (EUR 80 per combinatie). These: sectorherstel tilt Zeewind richting EUR 42 binnen twee maanden; IV staat met 18% rond haar gemiddelde, dus geen volatiliteitsmening. Maximaal verlies: EUR 80 = 0,8% van vermogen. Exit: sluiten bij 70% van de maximale winst, bij halvering van de spreadwaarde, of uiterlijk twee weken voor de einddatum. Verwachte totale kosten: EUR 6. — Wie dit soort regels een jaar lang invult, weet daarna meer over zichzelf als belegger dan welke cursus ook kan vertellen.",
              },
            },
            {
              heading: "De afsluiting die je van ons mag verwachten",
              paragraphs: [
                "Je bent nu aan het einde van de optie-leerlijn, en we sluiten af zoals we begonnen: eerlijk. Voor de meeste van onze cursisten is de gereedschapskist uit Beschermen & Verdienen — de beschermende put, de gedekte call, spaarzaam en op maat ingezet — alles wat ze ooit nodig hebben. Meer poten, meer Grieken en meer schermen betekenen niet meer rendement; ze betekenen vooral meer manieren waarop kosten, complexiteit en overmoed kunnen knagen.",
                "Waarom dan toch deze cursus? Omdat begrip iets anders is dan gebruik. Je weet nu hoe je tegenpartij prijst en denkt, waarom premies zijn wat ze zijn, wat er achter een winrate schuilgaat en hoe het misloopt bij wie dat niet weet. Die kennis beschermt je — óók als je nooit één spread opzet, juist wanneer iemand je iets probeert te verkopen dat te mooi klinkt. En het mooiste is: je hoeft ons niet op ons woord te geloven dat eenvoud meestal wint. Na deze cursus kun je die afweging zelf maken, met open ogen. Precies dat was het doel.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Option Volatility and Pricing",
              author: "Sheldon Natenberg",
              year: 1994,
              note: "Ook over marge, uitvoeringskosten en risicobeheer is Natenberg de standaard. Wie na deze leerlijn dieper wil, herleest hem met nieuwe ogen — pittig maar haalbaar, zeker nu.",
            },
          ],
          keyTakeaways: [
            "Marge is geblokkeerd onderpand dat méégroeit met verlies en volatiliteit; wie zijn ruimte vol benut, wordt in paniekmarkten gedwongen verkocht",
            "Brokerdrempels rond schrijven zijn informatie over staartrisico, geen hindernis om te omzeilen",
            "De geboden-gelaten-marge is de grootste verborgen kostenpost en weegt het zwaarst bij meerpotige constructies met kleine premies",
            "Een journaal met vooraf vastgelegde these, maximaal verlies en exit-plan beoordeelt je denkwerk in plaats van je geluk",
            "Voor de meeste beleggers is de gereedschapskist uit Beschermen & Verdienen genoeg — en na deze cursus kun je dat oordeel zelf vellen",
          ],
          quiz: [
            {
              question: "Wat gebeurt er bij een margin call?",
              options: [
                "De broker verhoogt je transactiekosten tijdelijk",
                "Je ontvangt de ontvangen optiepremie eerder uitbetaald",
                "Je onderpand dekt de gestegen marge-eis niet meer: je moet bijstorten, anders sluit de broker posities — op zijn moment en tegen de dan geldende prijzen",
                "De beurs schorst de handel in jouw optieserie",
              ],
              correctIndex: 2,
              explanation:
                "Marge-eisen stijgen juist wanneer de markt tegen je in beweegt of de volatiliteit oploopt. Schiet je onderpand tekort, dan mag de broker ingrijpen en posities liquideren — doorgaans midden in de storm, tegen de slechtste prijzen. Daarom houd je structureel margeruimte over in plaats van de limiet op te zoeken in rustig weer.",
            },
            {
              question:
                "Een optie noteert EUR 1,40 geboden en EUR 1,60 gelaten. Je koopt en verkoopt kort daarna tegen deze prijzen, zonder koersbeweging. Wat kostte de geboden-gelaten-marge je, afgezet tegen de middenprijs van EUR 1,50?",
              options: [
                "Niets: zonder koersbeweging is er geen verlies",
                "EUR 0,20 per aandeel, ruim 13% van de middenprijs — nog vóór transactiekosten",
                "EUR 0,10 per aandeel: alleen het verschil met de middenprijs bij aankoop",
                "EUR 1,50: de volledige middenprijs",
              ],
              correctIndex: 1,
              explanation:
                "Je koopt tegen de laatprijs (EUR 1,60) en verkoopt tegen de biedprijs (EUR 1,40): EUR 0,20 verschil op een positie van EUR 1,50 is ruim 13%. Beide zijden van het rondje betalen elk EUR 0,10. Dit is de onzichtbare tol die op papier winstgevende strategieën met kleine premies in de praktijk de das omdoet.",
            },
            {
              question: "Wat is het belangrijkste doel van een transactiejournaal bij optiebeleggen?",
              options: [
                "Bewijs verzamelen voor de belastingaangifte",
                "Je winsten bijhouden om je strategie te kunnen promoten",
                "De koersen van al je onderliggende waarden dagelijks noteren",
                "Je denkwerk vóóraf vastleggen, zodat je achteraf je beslissingen kunt beoordelen in plaats van je geluk — resultaat bedriegt bij opties",
              ],
              correctIndex: 3,
              explanation:
                "Bij opties kan een goede beslissing slecht uitpakken en een slechte beslissing winst opleveren; wie alleen uitkomsten bekijkt, leert de verkeerde lessen. Het journaal — these, maximaal verlies, exit-plan, allemaal vóór de order — maakt het proces beoordeelbaar. 'Heb ik mijn plan gevolgd?' is de kolom die telt, niet het rendement van die ene maand.",
            },
            {
              question:
                "Welke afsluitende boodschap geeft deze cursus over het gebruik van alles wat je hebt geleerd?",
              options: [
                "Wie de Grieken beheerst, hoort zo snel mogelijk meerpotige strategieën te gaan handelen",
                "Voor de meeste beleggers volstaat de eenvoudige gereedschapskist (beschermende put, gedekte call); de waarde van deze cursus is dat je dat oordeel nu zélf kunt vellen",
                "Opties zijn na deze cursus zonder risico, mits je een journaal bijhoudt",
                "Alleen wie dagelijks handelt, houdt de geleerde kennis vast",
              ],
              correctIndex: 1,
              explanation:
                "Begrip is iets anders dan gebruik. De kennis uit deze cursus beschermt je vooral: tegen te dure premies, tegen mooie winrates zonder rekensom, tegen te grote posities — óók als je nooit een spread opzet. Meer complexiteit is geen doel; met open ogen kunnen kiezen wél. Risicoloos wordt beleggen nooit, journaal of niet.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
