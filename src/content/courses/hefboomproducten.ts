import type { Course } from "../types";

const course: Course = {
  slug: "hefboomproducten",
  title: "Hefboomproducten",
  subtitle: "Turbo's, sprinters en CFD's — eerlijk uitgelegd",
  description:
    "Turbo's, sprinters en CFD's duiken op in elke beleggingsapp, meestal uitgelegd door partijen die eraan verdienen. In deze cursus opent een docent zonder affiliatedeal de motorkap: hoe deze producten echt werken, waar de kosten en risico's zitten en waarom ongeveer zeven op de tien gebruikers er geld mee verliezen. Zodat jij daarna zelf een geïnformeerde keuze maakt.",
  level: "Gevorderd",
  accent: "oranje",
  icon: "gauge",
  price: "€29",
  order: 8,
  learnPoints: [
    "Hoe een hefboom winsten én verliezen vermenigvuldigt, en waarom die rekensom niet symmetrisch is",
    "De motorkap van turbo's en sprinters open: financieringsniveau, stop-loss en de knock-out die je positie definitief beëindigt",
    "Hoe een CFD werkt, wie je tegenpartij is en waar de doorlopende kosten zitten",
    "Wat de AFM en ESMA vonden toen ze de verliescijfers opvroegen, en wat de regels van 2018 en 2021 wél en niet veranderden",
    "Een eerlijk afwegingskader: turbo, CFD, optie — of helemaal geen hefboom",
  ],
  modules: [
    {
      slug: "hoe-ze-werken",
      title: "Hoe ze werken",
      description:
        "Voordat je iets kunt vinden van hefboomproducten, moet je ze kunnen lezen. Deze module haalt de motorkap eraf: eerst de hefboom zelf en zijn ongemakkelijke rekenkunde, daarna de precieze mechanica van turbo's en sprinters, en tot slot het CFD — het product waarbij je broker ook je tegenpartij is.",
      lessons: [
        {
          slug: "de-hefboom",
          title: "Wat een hefboom met je geld doet",
          durationMin: 8,
          tool: "hefboom-simulator",
          intro:
            "Een hefboom is geen truc en geen zwendel: het is gewoon beleggen met geleend geld. Maar wie de rekenkunde ervan niet kent, ontdekt de nadelen pas als het geld al weg is. In deze les leer je precies wat een hefboom vermenigvuldigt — en waarom dat in twee richtingen werkt, maar niet symmetrisch voelt.",
          sections: [
            {
              heading: "Meer blootstelling dan inleg",
              paragraphs: [
                "De kern van elk hefboomproduct is dezelfde: je legt zelf een deel van het geld in, en de aanbieder financiert de rest. Daardoor beweegt je positie alsof je veel meer had belegd dan je eigen inleg. Bij een hefboom van 5 doet elke procent koersbeweging van de onderliggende waarde ongeveer vijf procent met jouw inleg — omhoog én omlaag.",
                "Dat klinkt abstract, dus laten we het concreet maken met de fictieve Zeewind-index, die rond de 900 punten noteert. Stel dat je EUR 1.000 inlegt in een product met hefboom 5. Je hebt dan een blootstelling van EUR 5.000 aan de index: EUR 1.000 van jezelf, EUR 4.000 gefinancierd door de aanbieder.",
                "Stijgt de Zeewind-index 2%, dan wint je positie van EUR 5.000 zo'n EUR 100 — een rendement van 10% op jouw inleg van EUR 1.000. Prachtig. Maar daalt de index 2%, dan verlies je diezelfde EUR 100, ofwel 10% van je inleg. De hefboom weet niet welke kant je op hoopte; hij vermenigvuldigt alles.",
              ],
              example: {
                title: "Eén index, twee uitkomsten",
                body:
                  "De Zeewind-index staat op 900 punten. Jij legt EUR 1.000 in met hefboom 5 (blootstelling EUR 5.000). Scenario A: de index stijgt naar 936 punten (+4%). Jouw positie wint 5 x 4% = 20%, dus EUR 200. Scenario B: de index daalt naar 864 punten (−4%). Jouw positie verliest 20%, dus EUR 200. Dezelfde beweging van 36 punten, exact gespiegeld. Het enige verschil met beleggen zonder hefboom: alles gaat vijf keer zo hard, en over de geleende EUR 4.000 betaal je ondertussen rente.",
              },
            },
            {
              heading: "De rekensom die niemand je vertelt",
              paragraphs: [
                "Hier komt het minst intuïtieve stuk van deze hele cursus, en het belangrijkste. Verlies en herstel zijn niet symmetrisch. Wie 10% verliest, heeft daarna ongeveer 11% stijging nodig om terug bij af te zijn. Wie 50% verliest, heeft 100% stijging nodig. En wie 90% verliest, moet 900% goedmaken. Het gat wordt sneller dieper dan je eruit kunt klimmen.",
                "Zonder hefboom kom je zelden in dat diepe deel van de curve: een breed gespreide portefeuille verliest zelden tientallen procenten in korte tijd. Met hefboom 5 is dat anders. Een indexdaling van 10% — geen crash, gewoon een stevige beursmaand — betekent voor jou een verlies van 50%. Vanaf dat punt moet je positie verdubbelen om quitte te spelen.",
                "Dit is geen mening over hefboomproducten, het is rekenkunde. En het verklaart alvast een deel van de verliescijfers die je in module 2 gaat zien: een hefboom brengt je veel sneller op het punt waar herstel wiskundig zwaar wordt.",
              ],
              bullets: [
                "Na −10% is +11,1% nodig om te herstellen",
                "Na −25% is +33,3% nodig",
                "Na −50% is +100% nodig",
                "Met hefboom 5 bereik je die −50% al bij een indexdaling van 10%",
              ],
            },
            {
              heading: "Waarom het psychologisch anders voelt",
              paragraphs: [
                "De rekensom is symmetrisch, de beleving niet. Winsten met een hefboom voelen als vakmanschap: je had gelijk, en je kreeg er vijf keer zoveel voor. Verliezen voelen als pech, een kwestie van net verkeerd getimed zijn — dus je probeert het nog een keer. Dat patroon, winst aan jezelf toeschrijven en verlies aan de omstandigheden, is diep menselijk en goed gedocumenteerd in de gedragspsychologie.",
                "Daar komt snelheid bij. Zonder hefboom heb je tijd om na te denken; een slechte week kost je misschien 2%. Met hefboom 5 kost diezelfde week 10%, en de verleiding om 'even snel' te reageren is groot. Snelle beslissingen onder druk zijn zelden je beste, en hefboomproducten produceren lopende band-momenten waarop je onder druk moet beslissen.",
                "Wees hier eerlijk tegen jezelf: de vraag is niet alleen of je de producten begrijpt, maar ook of je jezelf kent op het moment dat een positie 40% in de min staat. Die tweede vraag is moeilijker, en belangrijker.",
              ],
            },
            {
              heading: "De hefboom vermenigvuldigt ook de kosten",
              paragraphs: [
                "Nog een gevolg dat vaak wordt overgeslagen: je betaalt kosten over je hele blootstelling, niet over je inleg. In ons voorbeeld financiert de aanbieder EUR 4.000 voor je, en over dat bedrag rekent hij rente — elke dag, ook in het weekend bij sommige producten. Bij een rente van bijvoorbeeld 5% per jaar is dat EUR 200 per jaar aan financieringskosten op een inleg van EUR 1.000: 20% van je eigen geld.",
                "Dat betekent dat een hefboompositie een tegenwindmachine is: staat de onderliggende waarde na een jaar precies op hetzelfde niveau, dan sta jij tóch fors in de min. Hoe de financieringskosten precies werken verschilt per product — bij turbo's kruipt een financieringsniveau omhoog, bij CFD's wordt elke nacht afgerekend — en dat zie je in de volgende twee lessen in detail.",
                "Onthoud voor nu de vuistregel: hefboomproducten zijn gebouwd voor korte periodes. Hoe langer je ze vasthoudt, hoe meer de kosten aan je rendement knagen, onafhankelijk van of je visie klopt.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton Malkiel",
              year: 1973,
              note: "Malkiel is al vijftig jaar de nuchterste stem over speculatie versus beleggen. Zijn kernpunt raakt deze les direct: op korte termijn zijn koersen grotendeels onvoorspelbaar — en een hefboom is een grote weddenschap op precies die korte termijn.",
            },
          ],
          keyTakeaways: [
            "Een hefboom is beleggen met geleend geld: je rendement wordt vermenigvuldigd, in beide richtingen",
            "Verlies en herstel zijn niet symmetrisch: na −50% is +100% nodig, en met hefboom 5 zit je daar al bij een daling van 10%",
            "Winst voelt als kunde en verlies als pech — dat patroon houdt mensen langer in verliezende posities dan verstandig is",
            "Je betaalt kosten over je hele blootstelling: bij een vlakke markt verlies je dus tóch geld",
          ],
          quiz: [
            {
              question:
                "Je koopt voor EUR 500 een product met hefboom 4 op de Zeewind-index. De index daalt 5%. Wat gebeurt er ongeveer met je inleg?",
              options: [
                "Je verliest 5%, dus EUR 25: de hefboom werkt alleen bij winst",
                "Je verliest 4%, dus EUR 20: het verlies volgt de hefboom, niet de index",
                "Je verliest 20%, dus EUR 100: de hefboom vermenigvuldigt de indexbeweging",
                "Je verliest niets zolang je de positie niet verkoopt",
              ],
              correctIndex: 2,
              explanation:
                "Hefboom 4 betekent dat elke procent indexbeweging ongeveer vier procent met je inleg doet: 4 x 5% = 20% verlies, ofwel EUR 100. De hefboom maakt geen onderscheid tussen winst en verlies, en een niet-gerealiseerd verlies is wel degelijk een verlies — bij hefboomproducten kan het zelfs definitief worden voordat je kunt reageren, zoals je in de volgende les ziet.",
            },
            {
              question: "Een positie staat 50% in de min. Hoeveel stijging is er nodig om terug op het beginpunt te komen?",
              options: [
                "100%: je resterende helft moet verdubbelen",
                "50%: evenveel als het verlies",
                "75%: iets meer dan het verlies vanwege de kosten",
                "25%: herstel gaat sneller dan verlies",
              ],
              correctIndex: 0,
              explanation:
                "Van EUR 1.000 naar EUR 500 is −50%, maar van EUR 500 terug naar EUR 1.000 is +100%. Herstel wordt steeds zwaarder naarmate het verlies dieper is — en juist een hefboom brengt je snel in dat diepe deel van de curve.",
            },
            {
              question:
                "De Zeewind-index staat na een jaar precies op hetzelfde niveau als aan het begin. Wat is het meest waarschijnlijke resultaat van een hefboompositie die dat hele jaar is aangehouden?",
              options: [
                "Precies break-even: geen beweging is geen resultaat",
                "Een kleine winst, omdat de aanbieder rente vergoedt over je inleg",
                "Dat is niet te zeggen: kosten spelen bij hefboomproducten geen rol",
                "Een verlies: de financieringskosten over de geleende blootstelling tikten het hele jaar door",
              ],
              correctIndex: 3,
              explanation:
                "Je betaalt rente over het gefinancierde deel van je blootstelling, elke dag opnieuw. Bij een vlakke markt is dat pure min: een hefboompositie heeft een stijging nodig alleen al om de kosten goed te maken. Daarom zijn deze producten gebouwd voor korte periodes.",
            },
            {
              question: "Waarom voelt een hefboom psychologisch anders dan de rekenkunde suggereert?",
              options: [
                "Omdat verliezen wettelijk gemaximeerd zijn en winsten niet",
                "Omdat winst als eigen kunde voelt en verlies als pech, waardoor mensen na verlies vaak nog een poging wagen",
                "Omdat de hefboom bij winst groter is dan bij verlies",
                "Omdat aanbieders winsten sneller uitkeren dan verliezen afboeken",
              ],
              correctIndex: 1,
              explanation:
                "De rekensom is gespiegeld, de beleving niet: succes schrijven we aan onszelf toe, tegenslag aan de omstandigheden. Dat patroon verleidt tot 'nog één keer proberen' — en met een hefboom is elke volgende poging net zo gevaarlijk als de vorige. De hefboom zelf is in beide richtingen exact even groot.",
            },
          ],
          xp: 50,
        },
        {
          slug: "turbos-en-sprinters",
          title: "Turbo's en sprinters: de motorkap open",
          durationMin: 10,
          intro:
            "Turbo, sprinter, speeder: verschillende merknamen, hetzelfde bouwplan. In deze les leer je de drie onderdelen kennen waaruit elke turbo bestaat — financieringsniveau, ratio en stop-loss — en zie je waarom juist die stop-loss de grootste verliesmotor van het product is.",
          sections: [
            {
              heading: "Het bouwplan: financieringsniveau en ratio",
              paragraphs: [
                "Een turbo long is in essentie een pakketje: de uitgevende bank koopt de onderliggende waarde en financiert daarvan het grootste deel zelf. Dat gefinancierde deel heet het financieringsniveau. Jij betaalt alleen het verschil tussen de koers van de onderliggende waarde en dat financieringsniveau. Hoe hoger het financieringsniveau, hoe kleiner jouw stukje — en hoe groter de hefboom.",
                "Neem de Zeewind-index op 900 punten en een turbo long met financieringsniveau 720. Het 'eigen' stuk is dan 900 − 720 = 180 punten. Omdat één indexpunt vaak te duur zou zijn voor één turbo, hakt de uitgever het op met een ratio: bij een ratio van 10 kost de turbo (900 − 720) / 10 = EUR 18,00.",
                "De hefboom rolt hier rechtstreeks uit: 900 / 180 = 5. Beweegt de index 1%, dan beweegt de turbo circa 5%. Let op een subtiel effect: daalt de index, dan wordt het eigen stuk kleiner en de hefboom dus vanzelf gróter. Op 864 punten is de hefboom al 864 / 144 = 6. Een verliezende turbopositie wordt met elke daling risicovoller — precies andersom dan je zou willen.",
              ],
              example: {
                title: "Rekenvoorbeeld: de turbo op de Zeewind-index",
                body:
                  "Zeewind-index: 900 punten. Turbo long, financieringsniveau 720, ratio 10. Prijs: (900 − 720) / 10 = EUR 18,00; hefboom 900 / 180 = 5. Daalt de index 4% naar 864, dan is de turbo (864 − 720) / 10 = EUR 14,40 waard: een verlies van 20%, keurig vijf keer de indexbeweging. Stijgt de index 4% naar 936, dan noteert de turbo EUR 21,60: winst 20%. Zolang de stop-loss niet wordt geraakt, is de turbo dus een strakke vermenigvuldiger.",
              },
            },
            {
              heading: "De stop-loss en de knock-out: dé verliesmotor",
              paragraphs: [
                "De uitgever wil niet dat de koers onder het financieringsniveau zakt — dan zou zijn eigen geld verdampen. Daarom heeft elke turbo een stop-loss-niveau, iets boven het financieringsniveau. Raakt de onderliggende waarde dat niveau, ook maar één tel, dan wordt de turbo definitief beëindigd: de knock-out. Je krijgt de eventuele restwaarde uitgekeerd — het kleine verschil tussen afwikkelkoers en financieringsniveau — en vaak is dat weinig tot niets.",
                "Het woord 'definitief' verdient nadruk. Een gewone belegger die een daling uitzit, kan meeprofiteren van herstel. Een turbobezitter niet: raakt de Zeewind-index op een onrustige ochtend heel even 738 punten (de stop-loss van onze voorbeeldturbo) en veert hij dezelfde middag terug naar 900, dan is jouw positie toch weg. Je had gelijk over de richting, en je bent alsnog vrijwel alles kwijt.",
                "Dit mechanisme, en niet de hefboom op zich, is de grootste verliesmotor van het product. Markten bewegen dagelijks op en neer; hoe hoger je hefboom, hoe dichter de stop-loss bij de huidige koers ligt en hoe groter de kans dat gewone ruis je eruit tikt. Een turbo met hefboom 10 op een index overleeft een daling van pakweg 9% simpelweg niet — en dalingen van die orde komen in de meeste beursjaren wel een keer voor.",
              ],
              example: {
                title: "De ochtend waarop je gelijk had én alles kwijtraakte",
                body:
                  "Onze turbo (financieringsniveau 720, stop-loss 740, ratio 10) noteert EUR 18,00 bij een index van 900. Op een onrustige ochtend zakt de Zeewind-index in een half uur naar 738 punten — onder de stop-loss. Knock-out: de uitgever wikkelt de positie af. Stel dat de afwikkelkoers 736 is, dan is je restwaarde (736 − 720) / 10 = EUR 1,60 per turbo: ruim 91% verlies. Dat de index diezelfde middag herstelt naar 900 punten verandert daar niets meer aan. Zonder hefboom had je op dat moment gewoon quitte gestaan.",
              },
            },
            {
              heading: "Financieringskosten: het niveau kruipt elke dag omhoog",
              paragraphs: [
                "Het financieringsniveau is geleend geld, en over geleend geld betaal je rente. Bij turbo's gebeurt dat onzichtbaar maar onophoudelijk: de uitgever verhoogt het financieringsniveau elke dag een fractie. Jouw stukje — koers minus financieringsniveau — wordt daardoor elke dag iets kleiner, ook als de markt stilstaat.",
                "Reken even mee. Bij een financieringsrente van 5% per jaar groeit een financieringsniveau van 720 punten met zo'n 36 punten per jaar, ofwel een tiende punt per dag. Staat de Zeewind-index na een jaar nog steeds op 900, dan is je turbo geen (900 − 720) / 10 = EUR 18,00 meer waard, maar (900 − 756) / 10 = EUR 14,40. Een verlies van 20% in een markt die niets deed.",
                "En er kruipt nog iets mee omhoog: de stop-loss wordt periodiek mee verhoogd met het financieringsniveau. Een turbo die je lang vasthoudt, wordt dus niet alleen elke dag iets minder waard — hij komt ook steeds dichter bij zijn eigen knock-out te staan. Twee redenen waarom turbo's als lange-termijnbelegging vrijwel altijd verliezen van gewoon de onderliggende waarde kopen.",
              ],
              bullets: [
                "Financieringsniveau stijgt dagelijks met de rente: je turbo verliest waarde in een vlakke markt",
                "De stop-loss stijgt mee: de knock-out komt vanzelf dichterbij",
                "Bij 5% rente kost een jaar aanhouden van onze voorbeeldturbo circa 20% van je inleg",
                "Turbo's zijn daarom gereedschap voor dagen of weken, niet voor maanden of jaren",
              ],
            },
            {
              heading: "Wie geeft ze uit, en hoe verdient die eraan",
              paragraphs: [
                "Turbo's worden uitgegeven door grote banken. In Nederland is BNP Paribas veruit de grootste speler — sinds ABN AMRO in 2021 stopte met eigen turbo's staat BNP ook achter het schap dat je bij ABN AMRO ziet. ING geeft nog altijd zijn eigen Sprinters uit, en de turbo's van het vroegere Binck zijn opgegaan in Saxo. Verschillende etiketten, maar het bouwplan uit deze les is overal hetzelfde.",
                "Turbo's zijn genoteerd aan een beurs, en dat klinkt geruststellender dan het is. In de praktijk is de uitgever in de overgrote meerderheid van de transacties zelf je tegenpartij, en bepaalt hij de bied- en laatprijzen die je op je scherm ziet. Je handelt dus vooral mét de bank, tegen de prijzen van de bank — de beursnotering is het loket, niet een vrije markt van kopers en verkopers.",
                "Hoe verdient de uitgever? Niet door tegen je te wedden — de uitgever dekt zijn posities af — maar aan twee stromen die jij betaalt: het verschil tussen bied- en laatprijs (de spread) bij elke transactie, en de dagelijkse financieringskosten zolang je de positie aanhoudt. Het verdienmodel beloont dus veel handelen en lang aanhouden. Beide zijn zelden in jouw voordeel, en dat mag je gerust een ongemakkelijke prikkel noemen.",
              ],
            },
          ],
          keyTakeaways: [
            "Turboprijs = (koers onderliggende waarde − financieringsniveau) / ratio; hoe hoger het financieringsniveau, hoe groter de hefboom",
            "De hefboom groeit vanzelf als je positie daalt: een verliezende turbo wordt steeds risicovoller",
            "De knock-out is definitief: één tik op de stop-loss en je positie is weg, ook als de koers direct daarna herstelt",
            "Het financieringsniveau én de stop-loss kruipen dagelijks omhoog: aanhouden kost geld en de knock-out komt dichterbij",
            "De uitgever is meestal zelf je tegenpartij, stelt de prijzen en verdient aan spread plus financiering",
          ],
          quiz: [
            {
              question:
                "Een turbo long op de Zeewind-index (koers 900) heeft financieringsniveau 750 en ratio 10. Wat kost deze turbo en wat is de hefboom?",
              options: [
                "EUR 75,00 met hefboom 12: je deelt het financieringsniveau door de ratio",
                "EUR 15,00 met hefboom 6: (900 − 750) / 10, en 900 gedeeld door het eigen stuk van 150",
                "EUR 90,00 met hefboom 10: de koers gedeeld door de ratio",
                "EUR 15,00 met hefboom 10: de ratio bepaalt de hefboom",
              ],
              correctIndex: 1,
              explanation:
                "Prijs = (900 − 750) / 10 = EUR 15,00. De hefboom is koers gedeeld door het eigen stuk: 900 / 150 = 6. De ratio maakt de turbo alleen betaalbaar per stuk; de hefboom komt volledig uit de afstand tussen koers en financieringsniveau.",
            },
            {
              question:
                "De Zeewind-index raakt om 10.02 uur precies de stop-loss van jouw turbo en staat om 16.00 uur weer ruim erboven. Wat is er met je positie gebeurd?",
              options: [
                "Niets: de stop-loss geldt alleen op slotkoersen",
                "De positie is tijdelijk bevroren en loopt vanaf 16.00 uur gewoon weer mee",
                "De positie is definitief beëindigd; je ontvangt hooguit een kleine restwaarde en het herstel is niet meer van jou",
                "De uitgever verlaagt eenmalig het financieringsniveau zodat je positie doorloopt",
              ],
              correctIndex: 2,
              explanation:
                "Eén aanraking van de stop-loss is genoeg: de turbo wordt afgewikkeld en bestaat daarna niet meer. Het herstel later op de dag is voor jou irrelevant — dit is het wezenlijke verschil met een gewone belegging, die een dip kan uitzitten. Precies dit mechanisme maakt de stop-loss dé verliesmotor van het product.",
            },
            {
              question: "Waarom verliest een turbo waarde in een markt die maandenlang stilstaat?",
              options: [
                "Omdat het financieringsniveau dagelijks met de rente wordt verhoogd, waardoor jouw stuk elke dag krimpt",
                "Omdat de beurs een noteringsvergoeding inhoudt op de koers",
                "Omdat de ratio elke maand wordt bijgesteld naar de nieuwe indexstand",
                "Dat klopt niet: zonder koersbeweging blijft een turbo exact evenveel waard",
              ],
              correctIndex: 0,
              explanation:
                "De rente op het geleende deel wordt verwerkt door het financieringsniveau elke dag een fractie op te schuiven. Jouw waarde is koers minus financieringsniveau, dus die krimpt vanzelf — in ons voorbeeld zo'n 20% per jaar bij 5% rente. De stop-loss schuift bovendien mee omhoog, waardoor ook de knock-out dichterbij komt.",
            },
            {
              question: "Turbo's zijn genoteerd aan een beurs. Wat betekent dat in de praktijk voor jou als koper?",
              options: [
                "Dat vraag en aanbod van duizenden beleggers samen de prijs bepalen, net als bij aandelen",
                "Dat de toezichthouder elke transactie vooraf goedkeurt",
                "Dat je turbo's alleen tijdens de openingsveiling kunt kopen",
                "Minder dan het lijkt: de uitgever is in verreweg de meeste transacties zelf je tegenpartij en stelt de bied- en laatprijzen",
              ],
              correctIndex: 3,
              explanation:
                "De beursnotering is vooral een loket. In de praktijk handel je vrijwel altijd tegen de uitgevende bank, tegen prijzen die diezelfde bank afgeeft. De bank verdient aan de spread en de financieringskosten — niet door tegen je te wedden, maar het verdienmodel beloont wel veel handelen en lang aanhouden.",
            },
          ],
          xp: 50,
        },
        {
          slug: "cfds",
          title: "CFD's: een contract met je broker",
          durationMin: 9,
          intro:
            "Een CFD lijkt op het eerste gezicht op een turbo zonder knock-out: hefboom, lage instap, handelen met één tik. Maar onder de motorkap is het een fundamenteel ander product. Je koopt niets op een beurs — je sluit een privécontract met je broker, die tegelijk je tegenpartij is én de prijs bepaalt.",
          sections: [
            {
              heading: "Geen effect, maar een weddenschap op het verschil",
              paragraphs: [
                "CFD staat voor contract for difference: een afspraak tussen jou en je broker om het koersverschil van een onderliggende waarde af te rekenen tussen het moment van openen en sluiten. Stijgt de koers en zit jij long, dan betaalt de broker jou het verschil; daalt de koers, dan betaal jij de broker. Je bezit op geen enkel moment het aandeel, de index of de grondstof zelf.",
                "Het cruciale verschil met een turbo: een CFD is volledig OTC, over the counter. Er komt geen beurs aan te pas — niet als loket en niet als scheidsrechter. De prijs waartegen je handelt is de prijs die je broker je toont, de afwikkeling gebeurt in de systemen van de broker, en je enige tegenpartij is de broker zelf.",
                "Dat hoeft niet mis te gaan, maar je moet zien wat het betekent: dezelfde partij die jouw orders uitvoert, bepaalt ook de koers waartegen dat gebeurt, berekent je financieringskosten en beslist wanneer je positie gedwongen wordt gesloten. Bij aandelen en opties zijn die rollen verdeeld over beurs, marktmakers en toezicht; bij een CFD zitten ze allemaal aan dezelfde kant van de tafel.",
              ],
            },
            {
              heading: "Marge, de 50%-regel en de bodem in je verlies",
              paragraphs: [
                "Bij een CFD leg je niet de hele positiewaarde in, maar een onderpand: de marge. Voor individuele aandelen is de maximale hefboom in de EU 5:1, dus je marge is minimaal 20% van de positie. Wil je EUR 10.000 blootstelling aan een aandeel, dan zet je EUR 2.000 eigen geld klaar. De resterende EUR 8.000 is in feite krediet van je broker.",
                "Loopt de positie tegen je in, dan slinkt je marge. Europese regels schrijven voor dat de broker moet ingrijpen op het moment dat je resterende marge onder 50% van de vereiste marge zakt: de margin close-out. In ons voorbeeld: zakt je EUR 2.000 aan onderpand door verliezen naar EUR 1.000, dan sluit de broker posities om te voorkomen dat je verder wegzakt. Niet als service, maar als verplichting.",
                "Diezelfde regels geven je ook een echte bodem: de negatieve-saldobescherming. Per rekening kun je nooit meer verliezen dan het geld dat erop staat; een plotselinge koerssprong kan je rekening leegmaken, maar geen schuld bij de broker achterlaten. Vóór 2018 kon dat wél, en enkele beruchte valutaschokken lieten toen particulieren achter met schulden van tienduizenden euro's. Deze bescherming is geen detail — het is een van de belangrijkste dingen die de toezichthouder voor je geregeld heeft, zoals je in de volgende les ziet.",
              ],
              bullets: [
                "Marge = jouw onderpand; bij aandelen minimaal 20% van de positie (hefboom max 5:1)",
                "Zakt je marge onder 50% van het vereiste niveau, dan móét de broker posities sluiten",
                "Negatieve-saldobescherming: je kunt nooit meer verliezen dan het saldo op je rekening",
                "Die bodem geldt per rekening, niet per positie: één slechte positie kan wel je hele saldo opeten",
              ],
            },
            {
              heading: "Overnight-financiering: de stille teller",
              paragraphs: [
                "Net als bij turbo's betaal je bij CFD's rente over de gefinancierde blootstelling, maar hier zie je hem wél: elke nacht dat je een positie aanhoudt, schrijft de broker financieringskosten af van je rekening. Het tarief is doorgaans een referentierente plus een opslag van enkele procenten, berekend over de volledige positiewaarde — niet over je marge.",
                "Dat maakt CFD's ongeschikt voor posities die je weken of maanden wilt aanhouden. De teller loopt elke nacht, onafhankelijk van wat de koers doet, en vreet met verrassende snelheid aan je onderpand. Wie een CFD gebruikt om 'goedkoop' langdurig in een aandeel te zitten, betaalt in werkelijkheid een fors jaartarief voor het lenen van blootstelling.",
                "Reken het altijd even om naar je eigen inleg. Een financieringspercentage van 6% per jaar over de positie klinkt bescheiden, maar bij hefboom 5 is dat 30% per jaar over jouw eigen geld. Het aandeel moet dus al fors stijgen voordat jij überhaupt op nul staat.",
              ],
              example: {
                title: "Acht weken aanhouden: wat kost dat?",
                body:
                  "Je opent een CFD-positie van EUR 10.000 op een aandeel, met EUR 2.000 marge (hefboom 5). De broker rekent 6% financieringsrente per jaar over de positiewaarde: EUR 10.000 x 6% / 365 = circa EUR 1,64 per nacht. Houd je de positie 8 weken aan (56 nachten), dan is dat 56 x EUR 1,64 = ruim EUR 92 — zo'n 4,6% van je eigen inleg van EUR 2.000, terwijl het aandeel nog geen millimeter hoefde te bewegen. Op jaarbasis komt dit neer op circa 30% van je inleg aan kosten alleen.",
              },
            },
            {
              heading: "Als het verdienmodel jouw verlies is",
              paragraphs: [
                "Hoe verdient een CFD-broker? Aan de spread en de financiering, net als een turbo-uitgever. Maar er is een derde route die je moet kennen: omdat het contract tussen jou en de broker loopt, kan de broker ervoor kiezen jouw positie níét af te dekken in de markt. Jouw verlies is dan letterlijk zijn winst, en omgekeerd. In de sector heet dat interne afwikkeling; hoeveel een broker afdekt, verschilt per partij en is voor jou van buiten niet te zien.",
                "Denk hier nuchter over na. Een broker die posities van klanten intern houdt, heeft er financieel belang bij dat die klanten verliezen — en de statistieken die je in de volgende les ziet, laten zien dat de meeste klanten dat inderdaad doen. Dat bewijst geen kwade opzet; het betekent wél dat de prikkels anders liggen dan bij een beurs, waar je tegenpartij een willekeurige andere belegger is.",
                "De verplichte waarschuwing die elke CFD-aanbieder tegenwoordig toont — het percentage van de eigen retailklanten dat geld verliest — is precies om deze reden ingevoerd. Lees dat percentage niet als kleine lettertjes, maar als wat het is: de aanbieder die je, zwart op wit, de uitkomstenstatistiek van zijn eigen klanten laat zien.",
              ],
            },
          ],
          keyTakeaways: [
            "Een CFD is een privécontract met je broker over een koersverschil: je bezit nooit de onderliggende waarde",
            "Volledig OTC: de broker is tegenpartij, prijssteller én afwikkelaar tegelijk — alle rollen aan één kant van de tafel",
            "Europese regels beschermen je met de 50%-margin-close-out en negatieve-saldobescherming per rekening",
            "Overnight-financiering loopt elke nacht over de volle positie: bij hefboom 5 kan 6% per jaar zomaar 30% van je inleg betekenen",
            "Sommige brokers dekken klantposities niet af; jouw verlies is dan rechtstreeks hun winst — ken die prikkel",
          ],
          quiz: [
            {
              question: "Wat is het fundamentele verschil tussen een CFD en een turbo?",
              options: [
                "Een CFD heeft geen hefboom en een turbo wel",
                "Een CFD is een privécontract met je broker zonder tussenkomst van een beurs; een turbo heeft in elk geval een beursnotering als loket",
                "Bij een CFD word je eigenaar van het onderliggende aandeel, bij een turbo niet",
                "Een turbo kent financieringskosten en een CFD niet",
              ],
              correctIndex: 1,
              explanation:
                "Beide producten hebben een hefboom en financieringskosten, en bij geen van beide bezit je de onderliggende waarde. Het wezenlijke verschil zit in de structuur: een CFD is volledig OTC — broker als tegenpartij, prijssteller en afwikkelaar — terwijl een turbo tenminste via een beursnotering loopt, ook al is de uitgever daar meestal je feitelijke tegenpartij.",
            },
            {
              question:
                "Je hebt een CFD-positie met EUR 3.000 vereiste marge. Door verliezen zakt je marge naar EUR 1.400. Wat gebeurt er?",
              options: [
                "Niets: zolang je saldo positief is, blijft de positie gewoon open",
                "Je ontvangt een vrijblijvend advies om bij te storten",
                "De positie wordt omgezet in een turbo met vergelijkbare hefboom",
                "De broker is verplicht in te grijpen: je zit onder 50% van de vereiste marge, dus posities worden gesloten",
              ],
              correctIndex: 3,
              explanation:
                "EUR 1.400 is minder dan 50% van de vereiste EUR 3.000. De Europese margin-close-out-regel verplicht de broker dan posities te sluiten — geen service en geen keuze, maar een beschermingsregel die voorkomt dat je nog dieper wegzakt.",
            },
            {
              question:
                "Een broker rekent 6% financieringsrente per jaar over een CFD-positie van EUR 10.000 met EUR 2.000 marge. Wat betekent dat voor jouw eigen geld op jaarbasis?",
              options: [
                "Circa 30% van je inleg: de 6% wordt gerekend over de volle positie, en die is vijf keer je marge",
                "Precies 6% van je inleg: financiering wordt over de marge berekend",
                "Circa 1,2% van je inleg: de rente wordt gedeeld door de hefboom",
                "Niets, zolang je de positie vóór het weekend sluit",
              ],
              correctIndex: 0,
              explanation:
                "De rente loopt over de volledige blootstelling van EUR 10.000: zo'n EUR 600 per jaar, ofwel 30% van jouw EUR 2.000. Dit is waarom CFD's ongeschikt zijn om langdurig aan te houden: de positie moet fors stijgen voordat je überhaupt op nul staat. Alleen posities die je binnen de handelsdag sluit, ontlopen de overnight-teller — maar dan handel je dus per definitie op de kortste termijn.",
            },
            {
              question: "Waarom verplicht de toezichthouder CFD-aanbieders om het verliespercentage van hun eigen klanten te tonen?",
              options: [
                "Omdat het percentage nodig is om de belasting op winst te berekenen",
                "Omdat de broker je tegenpartij is en er zelfs belang bij kan hebben dat je verliest; de statistiek maakt die werkelijkheid vooraf zichtbaar",
                "Omdat aanbieders anders geen vergunning voor aandelenhandel krijgen",
                "Omdat het percentage laat zien hoeveel spread de broker rekent",
              ],
              correctIndex: 1,
              explanation:
                "Bij CFD's liggen de prikkels anders dan op een beurs: de broker kan klantposities intern houden, waardoor jouw verlies zijn winst is. De verplichte waarschuwing dwingt aanbieders hun eigen uitkomstenstatistiek te tonen — doorgaans rond de drie op de vier verliezende klanten — zodat je die informatie hebt vóórdat je begint.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "de-cijfers-en-de-keuze",
      title: "De cijfers en de keuze",
      description:
        "Nu je weet hoe de producten werken, kijken we naar wat er in de praktijk mee gebeurt. Wat vonden de AFM en de Europese toezichthouder toen ze de verliescijfers opvroegen, wat veranderden de regels van 2018 en 2021 — en hoe verhouden turbo's en CFD's zich tot opties en tot gewoon beleggen zonder hefboom?",
      lessons: [
        {
          slug: "wat-de-toezichthouder-vond",
          title: "Wat de toezichthouder vond",
          durationMin: 9,
          intro:
            "Tot nu toe was dit een technische cursus: zo werkt de machine. In deze les kijken we naar de meetresultaten. De AFM heeft namelijk precies uitgezocht hoe het echte turbobeleggers vergaat, en de uitkomst was zo eenduidig dat Nederland als eerste land ter wereld ingreep. Geen meningen in deze les — cijfers.",
          sections: [
            {
              heading: "Het AFM-onderzoek: 68% verloor, gemiddeld EUR 2.680",
              paragraphs: [
                "Onderzoek van de AFM naar Nederlandse turbobeleggers — gemeten van juni 2017 tot en met juli 2018, gepubliceerd in 2020 — leverde een hard cijfer op: 68% van de turbobeleggers verloor in die periode geld. Het gemiddelde verlies lag rond de EUR 2.680 per belegger. Geen crashjaar, geen pandemie-paniek: een tamelijk gewoon beursjaar, waarin ruim twee op de drie gebruikers van dit product met verlies eindigden.",
                "Na de eerste twee modules van deze cursus kun je dat cijfer verklaren in plaats van er alleen van te schrikken. De knock-out maakt tijdelijke dips definitief. De hefboom brengt beleggers snel in het deel van de verliescurve waar herstel wiskundig zwaar is. De financieringskosten tikken elke dag door. En de psychologie — verlies voelt als pech, dus nog een keer proberen — doet de rest. De 68% is geen mysterie; het is de optelsom van de mechanismen die je nu kent.",
                "Belangrijk om erbij te zeggen: dit was geen onderzoek naar oplichters aan de randen van de markt, maar naar het gewone, gereguleerde turboaanbod van gerenommeerde uitgevers. Het product deed precies wat het beloofde. Dat bleek alleen voor de meeste gebruikers niet gunstig uit te pakken.",
              ],
            },
            {
              heading: "De ingreep van 2021 — en de eerlijke voetnoot",
              paragraphs: [
                "Op 1 oktober 2021 greep de AFM in, als eerste toezichthouder ter wereld specifiek voor turbo's. De maatregelen: een maximum op de hefboom, gespiegeld aan de Europese CFD-limieten — van 5:1 voor individuele aandelen tot 30:1 voor de grote valutaparen — plus een verplichte risicowaarschuwing waarin de aanbieder zijn éígen verliespercentage moet noemen, en een verbod op handelsbonussen zoals welkomstpremies.",
                "Werkte het? Gedeeltelijk, en het is belangrijk om precies te zijn over welk deel. De hefboombeperking maakt de klap kleiner: wie minder hefboom kan nemen, staat verder van de knock-out af en verliest bij eenzelfde beweging minder geld. De gemiddelde verliezen per belegger zijn daarmee gedempt.",
                "Maar kijk vandaag op de site van een turbo-aanbieder en je leest nog steeds een waarschuwing in de trant van: 7 op de 10 retailbeleggers verliest geld met de handel in turbo's. De frequentie van verliezen is dus amper veranderd — de meerderheid verliest nog altijd, alleen gemiddeld minder diep. Dat is de eerlijke samenvatting van de ingreep: kleinere wonden, evenveel gewonden. De verliesmotor zelf, de combinatie van knock-out, kosten en gedrag, draait gewoon door binnen de nieuwe grenzen.",
              ],
              bullets: [
                "Per 1 oktober 2021: hefboomlimieten (5:1 aandelen tot 30:1 grote valutaparen), verplichte verlieswaarschuwing met het echte percentage van de aanbieder, bonusverbod",
                "Effect: de ómvang van de verliezen is gedempt",
                "Niet veranderd: de fréquentie — nog altijd verliest circa 7 op de 10",
              ],
            },
            {
              heading: "Europa en CFD's: de ESMA-regels van 2018",
              paragraphs: [
                "De AFM-ingreep stond op de schouders van een Europese: in 2018 legde de Europese toezichthouder ESMA de CFD-sector aan banden, na vergelijkbare verliesstatistieken in vrijwel elk lidstaatonderzoek. Die maatregelen zijn later verankerd in nationale regels en gelden nog steeds. Je kent er inmiddels een paar uit les 3; hier is het complete pakket.",
                "De hefboomlimieten lopen af met het risico van de onderliggende waarde: 30:1 voor de grote valutaparen, 20:1 voor overige valuta en goud, 10:1 voor grondstoffen en de meeste indices, 5:1 voor individuele aandelen en 2:1 voor crypto. Daarbovenop: verplichte negatieve-saldobescherming per rekening, de margin-close-out op 50%, een verbod op bonussen en de verplichte verlieswaarschuwing met het eigen klantpercentage.",
                "Ook hier vertellen de waarschuwingen zelf het vervolgverhaal. De percentages die CFD-brokers vandaag publiceren, schommelen per aanbieder en per jaar, maar clusteren rond circa drie op de vier verliezende retailklanten. Strengere regels, dezelfde asymmetrie: de bescherming begrenst hoe diep je kunt vallen, niet hoe vaak.",
              ],
            },
            {
              heading: "De casus Bux: wat een bank deed met een CFD-tak",
              paragraphs: [
                "Tot slot een kleine Nederlandse casus die meer zegt dan een stapel rapporten. Bux begon ooit als app waarin je met CFD's kon speculeren, en bouwde daarnaast een nette beleggingsapp voor aandelen en ETF's. In december 2023 kondigde ABN AMRO aan Bux over te nemen; medio 2024 was de overname rond.",
                "Het veelzeggende detail: de speculatieve CFD-tak was expliciet van de deal uitgezonderd en is gestopt. De bank nam het aandelen- en ETF-platform over; het CFD-product was het eerste dat sneuvelde. Wat overbleef — en vandaag onder de vlag van ABN AMRO doorgaat — is een platform voor gewoon beleggen in aandelen en ETF's.",
                "Je hoeft daar geen complot in te zien, wel een onthullend oordeel. Een gereguleerde grootbank die een broker koopt en als eerste het CFD-onderdeel buiten de deur houdt, vertelt je iets over hoe de sector zelf naar dit product kijkt zodra reputatie en zorgplicht zwaarder wegen dan de marge erop. Het is hetzelfde signaal als de verplichte verliespercentages, maar dan in daden.",
              ],
            },
          ],
          keyTakeaways: [
            "Onderzoek van de AFM (meting 2017-2018, publicatie 2020): 68% van de turbobeleggers verloor geld, gemiddeld circa EUR 2.680",
            "De AFM-ingreep van 1 oktober 2021 — wereldprimeur — bracht hefboomlimieten, een verplichte verlieswaarschuwing en een bonusverbod",
            "De ingreep dempte de ómvang van verliezen, niet de fréquentie: aanbieders melden nog altijd dat circa 7 op de 10 verliest",
            "De ESMA-regels van 2018 begrenzen CFD's: hefboomlimieten per type onderliggende waarde, negatieve-saldobescherming, close-out op 50%, bonusverbod",
            "Toen ABN AMRO Bux overnam, bleef de CFD-tak expliciet buiten de deal en werd gestopt — een oordeel in daden",
          ],
          quiz: [
            {
              question: "Wat vond het AFM-onderzoek naar turbobeleggers (meting 2017-2018)?",
              options: [
                "Ongeveer de helft verloor geld, met verwaarloosbare bedragen",
                "68% verloor geld, met een gemiddeld verlies van circa EUR 2.680 — in een tamelijk gewoon beursjaar",
                "Alleen beleggers bij niet-gereguleerde aanbieders verloren geld",
                "Turbobeleggers presteerden gemiddeld gelijk aan de index",
              ],
              correctIndex: 1,
              explanation:
                "De kerncijfers: 68% van de turbobeleggers eindigde met verlies, gemiddeld zo'n EUR 2.680. Extra veelzeggend is de context: dit was het gewone, gereguleerde aanbod in een normaal beursjaar. Het product werkte precies zoals ontworpen — en dat pakte voor ruim twee op de drie gebruikers negatief uit.",
            },
            {
              question: "Wat is de eerlijkste samenvatting van het effect van de AFM-ingreep van oktober 2021?",
              options: [
                "De verliezen per belegger werden gemiddeld kleiner, maar het aandeel beleggers dat verliest bleef rond de 7 op de 10",
                "Turbobeleggers maken sindsdien gemiddeld winst",
                "Turbo's met een hefboom zijn sindsdien verboden in Nederland",
                "De ingreep had geen enkel meetbaar effect",
              ],
              correctIndex: 0,
              explanation:
                "De hefboomlimieten dempen de klap: minder hefboom betekent meer afstand tot de knock-out en kleinere verliezen bij dezelfde beweging. Maar de waarschuwingen op aanbiederssites melden nog altijd dat circa 7 op de 10 retailbeleggers verliest. Kleinere wonden, evenveel gewonden — de verliesmotor draait door binnen de nieuwe grenzen.",
            },
            {
              question: "Welke bescherming hoort NIET bij het Europese CFD-pakket dat sinds 2018 geldt?",
              options: [
                "Negatieve-saldobescherming per rekening",
                "Een verplichte verlieswaarschuwing met het klantpercentage van de aanbieder zelf",
                "Een garantie dat je maximaal 50% van je inleg kunt verliezen",
                "Hefboomlimieten die aflopen met het risico, van 30:1 voor grote valutaparen tot 2:1 voor crypto",
              ],
              correctIndex: 2,
              explanation:
                "Zo'n verliesgarantie bestaat niet: je kunt nog steeds je volledige rekeningsaldo kwijtraken. De 50% uit de regels slaat op iets anders — de margin-close-out, die de broker verplicht posities te sluiten zodra je marge onder de helft van het vereiste niveau zakt. De overige drie maatregelen horen wél bij het pakket.",
            },
            {
              question: "Wat gebeurde er met de CFD-tak van Bux toen ABN AMRO de broker overnam?",
              options: [
                "Die werd het paradepaardje van de overname en groeide verder onder de banknaam",
                "Die werd verkocht aan ING en ging verder als onderdeel van de Sprinters",
                "Die werd verplicht ondergebracht bij de AFM",
                "Die was expliciet van de deal uitgezonderd en is gestopt; de bank nam alleen het aandelen- en ETF-platform over",
              ],
              correctIndex: 3,
              explanation:
                "ABN AMRO kondigde de overname eind 2023 aan en rondde die medio 2024 af — zónder de speculatieve CFD-tak, die werd beëindigd. Een gereguleerde grootbank die als eerste het CFD-product buiten de deur houdt: hetzelfde signaal als de verplichte verliespercentages, maar dan in daden.",
            },
          ],
          xp: 50,
        },
        {
          slug: "turbo-cfd-of-optie",
          title: "Turbo, CFD of optie?",
          durationMin: 9,
          intro:
            "Wie hefboom wil, heeft grofweg drie smaken: de turbo, het CFD en de gekochte optie. Ze beloven hetzelfde — meer beweging per ingelegde euro — maar verschillen fundamenteel in wáár je handelt, tegen wíé, en wat er gebeurt als de markt tijdelijk tegenzit. Deze les zet ze eerlijk naast elkaar, inclusief de nadelen van de optie.",
          sections: [
            {
              heading: "Drie producten, één belofte",
              paragraphs: [
                "Op de productpagina lijken de drie inwisselbaar: kleine inleg, grote blootstelling, handelen met één tik. Maar de belofte van hefboom zegt niets over de constructie eronder, en juist die constructie bepaalt wat er met je geld gebeurt in de scenario's die er echt toe doen: een tijdelijke dip, een lange zijwaartse periode, een plotselinge koerssprong.",
                "De vergelijking die we in deze les maken draait om vier vragen. Waar handel je, en tegen wie? Wat kost het aanhouden per dag? Wat gebeurt er bij een tijdelijke daling? En: ken je je maximale verlies vooraf? Wie deze vier vragen op elke productpagina kan beantwoorden, heeft het doel van deze cursus bereikt.",
              ],
            },
            {
              heading: "Waar handel je, en tegen wie?",
              paragraphs: [
                "Bij het CFD is het antwoord het kortst: nergens en tegen je broker. Volledig OTC, de broker stelt de prijs en is je tegenpartij. Bij de turbo is er een beursnotering, maar zoals je in les 2 zag, is de uitgever in de overgrote meerderheid van de transacties zelf je tegenpartij en bepaalt hij de quotes — het loket is van de bank.",
                "De gekochte optie is de enige van de drie met een echte centrale markt. Opties noteren aan een optiebeurs met een centrale afwikkelingspartij, en meerdere marktmakers concurreren met elkaar om jouw order. Die concurrentie drukt de spread, en je tegenpartijrisico ligt bij de afwikkelingsinstantie in plaats van bij één bank of broker. Het is het verschil tussen een markt en een winkel: bij een markt vergelijken verkopers zich met elkaar; in een winkel bepaalt één partij het prijskaartje.",
                "Hoe opties precies werken — premie, uitoefenprijs, looptijd — leer je in onze cursus Opties Begrijpen; hier gaat het alleen om de vergelijking. En die is niet gratis in het voordeel van de optie: de optiemarkt kent een eigen leercurve, en in minder verhandelde opties kan de spread alsnog fors zijn.",
              ],
              bullets: [
                "CFD: geen beurs, broker is tegenpartij én prijssteller",
                "Turbo: beursnotering als loket, maar de uitgever is meestal de feitelijke tegenpartij en stelt de quotes",
                "Optie: centrale beurs, concurrerende marktmakers, afwikkeling via een centrale tegenpartij",
              ],
            },
            {
              heading: "Knock-out versus tijdswaarde",
              paragraphs: [
                "Het scherpste verschil zit in wat er gebeurt als de markt tijdelijk tegen je in beweegt. Turbo: één tik op de stop-loss en je positie is definitief weg, herstel of niet. CFD: geen knock-out op positieniveau, maar de margin-close-out kan je bij een diepe dip alsnog gedwongen uit de markt drukken op het slechtste moment. Gekochte optie: geen van beide. Zolang de looptijd niet voorbij is, kan de koers dalen, herstellen en weer dalen — jouw optie leeft door en profiteert volledig van herstel.",
                "Daar staat een eerlijke prijs tegenover: tijdswaarde. Een optie verliest elke dag een stukje waarde puur door het verstrijken van de tijd, en dat verval versnelt richting de einddatum. Wie een optie koopt en de beweging komt niet, ziet zijn premie wegsmelten — niet door een knock-out, maar door de kalender. De optie heeft dus geen gratis voordeel; ze ruilt het knock-out-risico in voor een vaste, vooraf bekende kostenpost.",
                "En dat 'vooraf bekend' is misschien wel het belangrijkste verschil van allemaal. Bij een gekochte optie is je maximale verlies exact de betaalde premie — geen cent meer, wat er ook gebeurt. Bij een turbo is je maximale verlies je inleg, maar wanneer dat verlies valt, bepaalt de markt via de knock-out. Bij een CFD begrenst alleen de negatieve-saldobescherming je verlies, en die grens ligt op je hele rekeningsaldo, niet op de positie.",
              ],
              example: {
                title: "Dezelfde dip, drie uitkomsten",
                body:
                  "De Zeewind-index zakt van 900 naar 740 punten en herstelt binnen twee maanden naar 900. De turbobezitter (stop-loss 740): knock-out onderweg, vrijwel alles kwijt, herstel gemist. De CFD-houder: als zijn marge de dip overleefde, is hij terug bij af minus zo'n acht weken financieringskosten; was de marge te krap, dan is hij op de bodem uitgestopt. De koper van een calloptie met voldoende looptijd: zag zijn optie diep wegzakken, maar de positie bleef bestaan en herstelde mee — hij verloor alleen tijdswaarde. Drie producten, dezelfde markt, drie totaal verschillende uitkomsten.",
              },
            },
            {
              heading: "Een eerlijk keuzekader",
              paragraphs: [
                "Betekent dit dat de optie 'het beste hefboomproduct' is? Zo simpel is het niet, en die claim ga je hier niet lezen. Opties vragen meer voorkennis, tijdswaardeverval is een echte en doorlopende kostenpost, en ook met opties verliezen veel speculanten geld. Wat wél objectief vaststaat: van de drie is de gekochte optie de enige met een centrale markt, concurrerende prijsstelling, een vooraf exact bekend maximaal verlies en géén knock-out.",
                "Gebruik daarom dit kader. Wil je een korte, gerichte positie en accepteer je dat één koerstik hem definitief kan beëindigen, dan is de turbo het eenvoudigste product — mits je financieringsniveau en stop-loss op de productpagina kunt aanwijzen. Wil je vooral heel kort en heel flexibel handelen, dan is het CFD het soepelste, mits je begrijpt wie je tegenpartij is en wat de nacht kost. Wil je een tijdelijke dip kunnen uitzitten en je maximale verlies vooraf in euro's kennen, dan wijst alles naar de gekochte optie — mits je bereid bent de leercurve te nemen.",
                "En houd de nul-optie op tafel: geen van drieën. Voor de meeste beleggingsdoelen is een hefboom helemaal niet nodig — daarover gaat de laatste les.",
              ],
            },
          ],
          keyTakeaways: [
            "Dezelfde belofte, drie constructies: waar je handelt en tegen wie verschilt fundamenteel per product",
            "De gekochte optie is de enige van de drie met een centrale beurs, concurrerende marktmakers en afwikkeling via een centrale tegenpartij",
            "Turbo's kennen een knock-out, CFD's een margin-close-out; alleen de gekochte optie overleeft elke dip binnen zijn looptijd",
            "De optie betaalt daarvoor met tijdswaardeverval: een vaste, vooraf bekende kostenpost in plaats van een knock-out-risico",
            "Alleen bij de gekochte optie ken je je maximale verlies vooraf exact: de betaalde premie",
          ],
          quiz: [
            {
              question: "Welk van de drie producten heeft als enige een centrale beurs met concurrerende marktmakers?",
              options: [
                "De turbo: die heeft immers een beursnotering",
                "Het CFD: brokers concurreren onderling om de spread",
                "De gekochte optie: centrale beurs, meerdere marktmakers en afwikkeling via een centrale tegenpartij",
                "Alle drie: hefboomproducten zijn in de EU verplicht beursgenoteerd",
              ],
              correctIndex: 2,
              explanation:
                "De turbonotering is vooral een loket — de uitgever is meestal je feitelijke tegenpartij en stelt de quotes. Het CFD heeft helemaal geen beurs: het is een privécontract met je broker. Alleen op de optiebeurs concurreren meerdere marktmakers om jouw order en ligt de afwikkeling bij een centrale tegenpartij.",
            },
            {
              question:
                "De markt zakt fors en herstelt twee maanden later volledig. Welk product profiteert gegarandeerd mee van dat herstel, mits de looptijd toereikend is?",
              options: [
                "De turbo, want de hefboom versnelt het herstel",
                "De gekochte optie: die kent geen knock-out en blijft binnen zijn looptijd bestaan, wat de koers onderweg ook deed",
                "Het CFD, want de negatieve-saldobescherming houdt de positie open",
                "Alle drie, want herstel is herstel",
              ],
              correctIndex: 1,
              explanation:
                "De turbo is bij zo'n dip waarschijnlijk uitgeknockt — definitief. Het CFD kán overleven, maar de margin-close-out kan je op de bodem uit de markt hebben gedrukt; de saldobescherming begrenst je verlies maar houdt geen posities open. Alleen de gekochte optie heeft geen mechanisme dat de positie onderweg beëindigt. De prijs daarvoor: verloren tijdswaarde.",
            },
            {
              question: "Wat is de eerlijke keerzijde van de gekochte optie tegenover turbo en CFD?",
              options: [
                "Tijdswaardeverval: de optie verliest elke dag waarde door het verstrijken van de tijd, versnellend richting de einddatum",
                "Een hoger maximaal verlies dan bij de andere twee",
                "Een verplichte knock-out bij 50% verlies",
                "Opties mogen in de EU niet door particulieren worden gekocht",
              ],
              correctIndex: 0,
              explanation:
                "De optie ruilt het knock-out-risico in voor een vaste kostenpost: tijdswaarde die wegsmelt, zeker als de verwachte beweging uitblijft. Het maximale verlies is juist kléiner en vooraf bekend (de premie), een knock-out bestaat niet, en particulieren mogen gewoon opties kopen — al vraagt dat een eigen leercurve.",
            },
            {
              question:
                "Je wilt een positie kunnen aanhouden door een tijdelijke dip heen én vooraf exact weten wat je maximaal kunt verliezen. Welk product past bij die twee eisen?",
              options: [
                "De turbo, vanwege de vaste stop-loss",
                "Het CFD, vanwege de negatieve-saldobescherming",
                "Geen van de drie: maximale verliezen zijn bij hefboomproducten nooit vooraf bekend",
                "De gekochte optie: geen knock-out binnen de looptijd, en het maximale verlies is exact de betaalde premie",
              ],
              correctIndex: 3,
              explanation:
                "De stop-loss van de turbo werkt precies tegen je eerste eis in: hij beëindigt de positie juist tijdens de dip. De saldobescherming van het CFD begrenst je verlies pas op rekeningniveau, en de close-out kan je onderweg uitstoppen. De gekochte optie voldoet aan beide eisen — tegen de prijs van tijdswaardeverval en een leercurve, zoals de cursus Opties Begrijpen uitlegt.",
            },
          ],
          xp: 50,
        },
        {
          slug: "als-je-toch-wilt",
          title: "Als je het toch wilt doen",
          durationMin: 8,
          intro:
            "Deze cursus eindigt niet met een verbod, want dat zou niet eerlijk zijn: hefboomproducten zijn legaal, gereguleerd en voor sommige doelen bruikbaar. Hij eindigt met iets nuttigers — de regels die de schade begrenzen als je ze gebruikt, en het eerlijke verhaal over het alternatief dat voor de meeste doelen beter werkt.",
          sections: [
            {
              heading: "Geen preek, wel een hek",
              paragraphs: [
                "Je hebt nu alles gezien: de mechaniek, de kosten, de knock-out, de cijfers van de toezichthouder. Als je na dat alles besluit om tóch af en toe een turbo of CFD te gebruiken, dan is dat jouw geïnformeerde keuze — en precies zo'n keuze mogelijk maken was het doel van deze cursus. Wat wij je nog kunnen meegeven is geen oordeel, maar een hek: afspraken met jezelf die voorkomen dat een klein experiment een groot probleem wordt.",
                "Het verschil tussen beleggers die met hefboomproducten 'leergeld betalen' en beleggers die er hun portefeuille mee opblazen, zit vrijwel nooit in marktkennis. Het zit in positiegrootte en discipline vooraf. De cijfers uit les 4 gaan over mensen die gemiddeld te groot zaten en onder druk beslisten. Beide zijn te voorkomen, en allebei vóórdat je de eerste positie opent.",
              ],
            },
            {
              heading: "De vier regels die de schade begrenzen",
              paragraphs: [
                "Regel één is de belangrijkste: de omvang. Gebruik voor hefboomproducten uitsluitend geld dat je volledig kunt verliezen zonder dat het je plannen raakt — behandel het als zakgeld, strikt gescheiden van je echte portefeuille. Niet omdat verlies waarschijnlijk 100% zal zijn, maar omdat het dat kán zijn, en sneller dan je kunt reageren.",
                "Regel twee: nooit bijkopen in een verliezende hefboompositie. Bij gewone aandelen valt over aanvullen bij lagere koersen te discussiëren; bij een turbo niet, want je middelt niet af — je stapelt hefboom op een positie waarvan de hefboom door de daling al vanzelf is gegroeid, steeds dichter bij de knock-out. Bijkopen in de min is hier geen strategie maar versnelling.",
                "Regel drie en vier gaan over weten en opschrijven. Ken je financieringskosten per week in euro's — niet als percentage op een productpagina, maar als bedrag dat jouw positie jou kost, zodat je voelt wanneer aanhouden duurder wordt dan de visie waard is. En schrijf je exit vooraf op: bij welke koers neem je winst, bij welke koers accepteer je je verlies, en wanneer is je oorspronkelijke reden om in te stappen vervallen? Een exit die pas wordt bedacht terwijl de positie 40% in de min staat, wordt geschreven door de slechtst mogelijke auteur: jij, onder druk.",
              ],
              bullets: [
                "Alleen geld dat je volledig kunt missen, strikt gescheiden van je echte portefeuille",
                "Nooit bijkopen in een verliezende hefboompositie: je middelt niet af, je versnelt richting de knock-out",
                "Ken je financieringskosten per week in euro's, niet alleen als percentage",
                "Schrijf je exit op vóór je instapt: winstniveau, verliesniveau en de voorwaarde waaronder je visie vervalt",
              ],
            },
            {
              heading: "Het eerlijke alternatief: meestal geen hefboom",
              paragraphs: [
                "En dan het verhaal dat een verkoper je niet vertelt, omdat er niets aan te verdienen valt. Voor verreweg de meeste beleggingsdoelen — vermogen opbouwen, pensioen aanvullen, een buffer laten groeien — is een hefboom niet alleen onnodig maar contraproductief. De lange termijn en samengestelde groei doen het vermenigvuldigen al voor je, gratis, zonder knock-out en zonder nachtelijke financieringsteller.",
                "Vergelijk de twee machines nog één keer. De hefboommachine vermenigvuldigt je blootstelling maar rekent daarvoor dagelijks kosten, en kent een mechanisme dat je positie definitief kan beëindigen op precies het verkeerde moment. De tijdmachine — breed gespreid beleggen en aanblijven — vermenigvuldigt je inleg via rendement op rendement, kost vrijwel niets en kent geen knock-out. De eerste machine verslaat de tweede alleen als je timing herhaaldelijk klopt, en de cijfers uit les 4 laten zien hoe vaak dat lukt.",
                "Wie goed gespreid belegt, hoeft zich bovendien nooit af te vragen of hij een ochtenddip overleeft. Dat is misschien wel het grootste rendement van beleggen zonder hefboom: het soort rust waarmee je je plan ook echt volhoudt. En een plan dat je volhoudt, verslaat vrijwel altijd een briljant plan dat halverwege sneuvelt.",
              ],
            },
            {
              heading: "Zo lees je voortaan elke productpagina",
              paragraphs: [
                "Tot slot de vaardigheid waar deze hele cursus naartoe werkte: elke turbo- of CFD-pagina kunnen lezen als iemand die weet waar hij op moet letten. Niet om overal vanaf te blijven, maar om nooit meer iets te kopen waarvan je de motor niet hebt gezien.",
                "Loop bij een turbo altijd deze punten na: het financieringsniveau en de afstand tot de huidige koers (daar zit je hefboom), het stop-loss-niveau (daar zit je knock-out), de ratio, het financieringspercentage en de spread. Bij een CFD: de marge-eis, het overnight-financieringstarief, de spread — en het verplichte verliespercentage van de aanbieder zelf. Dat laatste getal staat er niet voor de sier; het is de uitkomstenstatistiek van de mensen die je voorgingen.",
                "Kun je die punten aanwijzen en doorrekenen wat ze voor jouw inleg betekenen, dan ben je precies waar we je hebben willen brengen: niet bang voor deze producten, maar ook niet meer te verleiden door een app-schermpje met een grote groene knop. Wat je ermee doet, is vanaf hier aan jou — en dat is precies zoals het hoort.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "Housel legt beter dan wie ook uit waarom een hefboom goede plannen breekt: zelfs een strategie die uiteindelijk gelijk krijgt, overleeft de tussentijd niet als je gedwongen kunt worden uit te stappen. Overleven gaat vóór optimaliseren.",
            },
          ],
          keyTakeaways: [
            "Gebruik voor hefboomproducten alleen geld dat je volledig kunt verliezen, strikt gescheiden van je echte portefeuille",
            "Bijkopen in een verliezende hefboompositie is geen afmiddelen maar versnellen richting de knock-out",
            "Ken je financieringskosten per week in euro's en schrijf je exit op vóórdat je instapt",
            "Voor de meeste doelen is geen hefboom het beste antwoord: samengestelde groei vermenigvuldigt ook, maar dan zonder knock-out en kostenteller",
            "Lees elke productpagina langs de vaste punten: financieringsniveau, stop-loss, ratio, financieringstarief, spread en het verliespercentage van de aanbieder",
          ],
          quiz: [
            {
              question: "Waarom is bijkopen in een verliezende turbopositie extra riskant, vergeleken met bijkopen in een gewoon aandeel?",
              options: [
                "Omdat de transactiekosten bij turbo's hoger zijn",
                "Omdat de hefboom van de bestaande positie door de daling al is gegroeid en de knock-out dichterbij ligt: je stapelt risico op een positie die al riskanter is geworden",
                "Omdat de uitgever bijkopen in de min contractueel verbiedt",
                "Dat is het niet: afmiddelen werkt bij turbo's precies zoals bij aandelen",
              ],
              correctIndex: 1,
              explanation:
                "Bij een dalende turbo krimpt de afstand tot het financieringsniveau, waardoor de hefboom vanzelf groeit en de stop-loss relatief dichterbij komt. Bijkopen vergroot dan je blootstelling aan een positie die al gevaarlijker is geworden — met de knock-out als definitief einde. Bij een aandeel bestaat dat mechanisme niet; daar is afmiddelen hooguit discutabel, hier is het versnelling.",
            },
            {
              question: "Wat is de kern van de positiegrootte-regel voor hefboomproducten?",
              options: [
                "Maximaal 50% van je portefeuille, zodat de andere helft veilig blijft",
                "De positie moet groot genoeg zijn om de financieringskosten terug te verdienen",
                "Alleen geld dat je volledig kunt verliezen zonder dat je plannen erdoor geraakt worden, strikt gescheiden van je echte portefeuille",
                "De grootte maakt niet uit zolang je een stop-loss instelt",
              ],
              correctIndex: 2,
              explanation:
                "Een totaalverlies is bij deze producten geen randgeval maar een reëel scenario dat sneller kan toeslaan dan je kunt reageren — de knock-out wacht niet op jouw beslissing. Daarom dimensioneer je op het ergste geval: een bedrag waarvan het verlies je nergens toe dwingt. 50% van je portefeuille is daar ver overheen, en een stop-loss verandert niets aan wat je maximaal kunt kwijtraken.",
            },
            {
              question: "Waarom hoort je exit op papier te staan vóórdat je een hefboompositie opent?",
              options: [
                "Omdat je oordeel het minst betrouwbaar is op het moment dat de positie diep in de min staat en je onder druk moet beslissen",
                "Omdat brokers een schriftelijk exitplan eisen bij hefboomproducten",
                "Omdat een opgeschreven exit de knock-out uitschakelt",
                "Omdat je anders geen recht hebt op de negatieve-saldobescherming",
              ],
              correctIndex: 0,
              explanation:
                "Een exit die je ter plekke bedenkt bij 40% verlies wordt geschreven door de slechtst mogelijke auteur: jij, onder druk. Vooraf bepaal je met een koel hoofd je winstniveau, je verliesniveau en de voorwaarde waaronder je visie vervalt. De knock-out en de saldobescherming staan hier los van — die werken hoe dan ook, met of zonder plan.",
            },
            {
              question:
                "Wat is het eerlijke argument om voor de meeste beleggingsdoelen helemaal géén hefboom te gebruiken?",
              options: [
                "Hefboomproducten zijn voor particulieren verboden bij bedragen boven EUR 10.000",
                "Zonder hefboom is verlies onmogelijk",
                "Toezichthouders keuren beleggen met hefboom af voor iedereen",
                "Samengestelde groei vermenigvuldigt je vermogen ook — zonder dagelijkse kosten en zonder mechanisme dat je op het slechtste moment uit de markt drukt",
              ],
              correctIndex: 3,
              explanation:
                "Het argument is geen verbod en geen garantie — verlies kan altijd, en de producten zijn gewoon legaal. Het is een vergelijking van machines: de tijdmachine van breed gespreid beleggen vermenigvuldigt via rendement op rendement, vrijwel gratis en zonder knock-out. De hefboommachine wint daarvan alleen bij herhaaldelijk goede timing, en de cijfers uit les 4 tonen hoe vaak dat lukt.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
