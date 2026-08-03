import type { Course } from "../types";

const course: Course = {
  slug: "indexbeleggen",
  title: "Indexbeleggen & ETF's",
  subtitle: "De saaie route die meestal wint",
  description:
    "Indexbeleggen is de eenvoudigste vorm van beleggen: je koopt de hele markt in één keer, tegen lage kosten, en laat de tijd het werk doen. En nu het eerlijke deel: voor de meeste mensen is deze ene cursus genoeg — onze andere cursussen leren echte vakken, maar je hebt ze niet nodig om verstandig te beleggen. Dat zeggen we hardop, want een opleider die alleen actieve strategieën verkoopt en dít verzwijgt, is niet eerlijk bezig.",
  level: "Beginner",
  accent: "leisteen",
  icon: "globe",
  price: "€49",
  order: 9,
  heroQuote: {
    text: "Zoek niet naar de naald in de hooiberg. Koop gewoon de hele hooiberg.",
    source: "John C. Bogle, The Little Book of Common Sense Investing (2007)",
  },
  learnPoints: [
    "Waarom de grote meerderheid van de professionele fondsen de index op lange termijn niet verslaat, en wat dat voor jou betekent",
    "Wat een index, een indexfonds en een ETF precies zijn, uitgelegd in gewone taal",
    "Hoe kosten en dividendlekkage stilletjes aan je rendement knagen, en waar je op let om dat te beperken",
    "Hoe je met één fonds of een klein setje fondsen de hele wereld koopt, inclusief de eerlijke keerzijdes",
    "Hoe je het volhoudt: automatisch inleggen, van je portefeuille afblijven en weten wanneer indexbeleggen níét past",
  ],
  modules: [
    {
      slug: "waarom-saai-wint",
      title: "Waarom saai wint",
      description:
        "Voordat je ook maar één fonds bekijkt, wil je snappen waaróm deze saaie aanpak zo goed werkt. Deze module legt het bewijs op tafel: waarom zelfs professionals de markt zelden blijvend verslaan, wat een indexfonds precies is en waarom lage kosten het best bewaarde geheim van beleggen zijn.",
      lessons: [
        {
          slug: "de-markt-verslaan-is-de-uitzondering",
          title: "De markt verslaan is de uitzondering",
          durationMin: 9,
          intro:
            "Beleggen begint vaak met de vraag: welke aandelen moet ik kiezen? Deze cursus begint met een geruststellender antwoord: waarschijnlijk hoef je helemaal niet te kiezen. In deze les zie je waarom zelfs betaalde professionals de markt zelden blijvend verslaan, en wat dat betekent voor jou — en, eerlijk is eerlijk, voor onze eigen andere cursussen.",
          sections: [
            {
              heading: "Wat betekent 'de markt verslaan' eigenlijk?",
              paragraphs: [
                "De markt is simpelweg het gemiddelde van alle beleggers samen. Dat gemiddelde wordt gemeten met een index: een lijst aandelen met een rekenregel erachter, zoals de AEX voor de 25 grootste Nederlandse beursbedrijven of een wereldindex voor duizenden bedrijven wereldwijd. Stijgt zo'n index 8% in een jaar, dan behaalde de gemiddelde euro in die markt ruwweg 8%.",
                "Er zijn twee manieren om met die meetlat om te gaan. Actieve beleggers proberen béter te scoren dan de index: ze kiezen aandelen, timen hun momenten en betalen vaak een fondsbeheerder om dat voor hen te doen. Passieve beleggers, ook wel indexbeleggers, doen het omgekeerde: ze kopen gewoon de hele lijst en nemen genoegen met het marktgemiddelde.",
                "Genoegen nemen met het gemiddelde klinkt als opgeven. Het verrassende nieuws van deze les: dat 'gemiddelde' blijkt in de praktijk een score te zijn waar de meeste professionals niet aan kunnen tippen. Hoe dat kan, zie je hieronder.",
              ],
            },
            {
              heading: "Het bewijs: de meeste profs halen de meetlat niet",
              paragraphs: [
                "Al tientallen jaren vergelijken onderzoekers de prestaties van actieve beleggingsfondsen met hun index. De uitkomst is opvallend consistent, in de Verenigde Staten én in Europa: hoe langer de periode, hoe groter het deel van de fondsen dat achterblijft bij de index. Over periodes van vijftien jaar gaat het om de grote meerderheid — ruwweg acht à negen van de tien fondsen.",
                "En dat is nog geflatteerd, want slecht presterende fondsen worden vaak stilletjes opgeheven of samengevoegd. Die verdwijnen uit de statistieken, waardoor de overgebleven fondsen er als groep beter uitzien dan de werkelijkheid. Onderzoekers noemen dat overlevingsvertekening: je ziet alleen de overlevers, niet de gesneuvelden.",
                "Belangrijk om erbij te zeggen: er bestáán fondsen die de index langdurig verslaan. Het probleem is dat je vooraf niet kunt zien welke dat zullen zijn. Fondsen die de afgelopen jaren wonnen, staan de jaren erna opvallend vaak bij de achterblijvers. Rendement uit het verleden is geen selectiemiddel — dat zinnetje staat niet voor niets verplicht onder elke fondsadvertentie.",
              ],
              bullets: [
                "Over lange periodes blijft de grote meerderheid van de actieve fondsen achter bij hun eigen index",
                "Verdwenen fondsen flatteren de statistieken: de mislukkingen tellen niet meer mee",
                "Winnaars bestaan, maar zijn vooraf niet betrouwbaar aan te wijzen",
              ],
            },
            {
              heading: "Waarom lukt het zelfs de profs niet?",
              paragraphs: [
                "De eerste reden is wiskundig, en die bedacht niet wij maar Nobelprijswinnaar William Sharpe. Alle beleggers samen zíjn de markt. Vóór kosten behaalt de gemiddelde belegger dus per definitie het marktgemiddelde. Maar actief beleggen kost geld: beheervergoedingen, transactiekosten, salarissen van analisten. Trek die kosten van het gemiddelde af, en de gemiddelde actieve belegger moet ná kosten wel achterblijven bij de index. Dat is geen mening, dat is rekenen.",
                "De tweede reden is concurrentie. De beurs van nu is geen markt waar een slimme particulier tegenover suffe amateurs staat: aan de andere kant van bijna elke transactie zit een professional met snellere informatie en meer rekenkracht. Om de markt te verslaan is het niet genoeg om slim te zijn — je moet structureel slimmer zijn dan de andere professionals, die allemaal hetzelfde proberen. Dat lukt sommigen, maar het is de uitzondering, niet de regel.",
                "Wat levert meedoen met het gemiddelde dan op? Wereldwijd gespreide aandelen leverden over de afgelopen eeuw historisch gemiddeld zo'n 7% per jaar op. Let op: dat is een gemiddelde uit het verleden, geen belofte — er zaten jaren van min 40% tussen en decennia van tegenwind. Maar het laat zien dat 'genoegen nemen met het gemiddelde' historisch geen genoegdoening was, maar een prima resultaat.",
              ],
            },
            {
              heading: "En onze eigen andere cursussen dan?",
              paragraphs: [
                "Hier wordt het ongemakkelijk, dus zeggen we het maar gewoon. Beleggingscollege verkoopt cursussen over waardebeleggen, technische analyse en opties. Dat zijn actieve aanpakken — precies het soort beleggen waarvan deze les net liet zien dat de meeste mensen er niet beter van worden dan van een simpel indexfonds. Een cursusverkoper die dat verzwijgt, heeft een geloofwaardigheidsprobleem. Dus verzwijgen we het niet.",
                "Onze andere cursussen leren echte vakken. Waardebeleggen is een ambacht met een lange staat van dienst, opties zijn gereedschap dat je kunt leren beheersen, en zelfs van technische analyse leggen we eerlijk uit wat de wetenschap ervan vindt. Maar een vak leren is iets anders dan een vak nodig hebben. De meeste mensen met een baan, een gezin en een pensioengat hebben geen tweede vak nodig — die hebben een spaarplan nodig dat vanzelf loopt.",
                "Daarom is dit onze eerlijke rangorde: deze cursus is de standaardroute, de rest is verdieping voor wie het vak in wil. Zie je na deze acht lessen af van al onze andere cursussen, dan is deze cursus geslaagd. En vind je beleggen stiekem zó leuk dat je meer wilt, dan weet je straks precies wat je erbij haalt — en met welk deel van je geld je dat verstandig doet (daarover meer in les 8).",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "Geschreven door de oprichter van Vanguard en uitvinder van het indexfonds voor particulieren. Dun, herhaalt zichzelf soms, maar de kernboodschap van deze hele cursus staat erin.",
            },
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton Malkiel",
              year: 1973,
              note: "Het academische fundament onder indexbeleggen, telkens geactualiseerd. Dikker en droger dan Bogle; lees vooral de hoofdstukken over waarom koersen zich zo lastig laten voorspellen.",
            },
          ],
          keyTakeaways: [
            "Een index meet het gemiddelde van de markt; indexbeleggers kopen dat gemiddelde in plaats van het te willen verslaan",
            "Over lange periodes blijft de grote meerderheid van de professionele fondsen achter bij hun index — ruwweg acht à negen van de tien over vijftien jaar",
            "De oorzaak is structureel: kosten drukken iedereen onder het gemiddelde, en de concurrent aan de overkant is ook een professional",
            "Historisch leverden wereldwijd gespreide aandelen gemiddeld zo'n 7% per jaar op — een gemiddelde uit het verleden, geen belofte",
            "Onze andere cursussen leren echte vakken, maar dit is de standaardroute: voor de meeste mensen is deze cursus genoeg",
          ],
          quiz: [
            {
              question:
                "Wat laat het langlopende onderzoek naar actieve beleggingsfondsen consequent zien?",
              options: [
                "Ongeveer de helft van de fondsen verslaat de index, de andere helft niet — het is een muntworp",
                "Over periodes van vijftien jaar blijft de grote meerderheid van de fondsen achter bij hun eigen index",
                "Professionele fondsen verslaan de index bijna altijd, alleen particulieren blijven achter",
                "Fondsen die de afgelopen vijf jaar wonnen, winnen meestal ook de volgende vijf jaar",
              ],
              correctIndex: 1,
              explanation:
                "Het patroon is opvallend consistent: hoe langer de periode, hoe groter het deel van de actieve fondsen dat achterblijft — over vijftien jaar ruwweg acht à negen van de tien. Winnaars uit het verleden blijken bovendien geen betrouwbare winnaars voor de toekomst, dus ook optie 4 klopt niet.",
            },
            {
              question:
                "Waarom moet de gemiddelde actieve belegger ná kosten wel achterblijven bij de index?",
              options: [
                "Omdat actieve beleggers gemiddeld minder verstand van bedrijven hebben dan indexbeleggers",
                "Omdat de overheid actief beleggen zwaarder belast dan indexbeleggen",
                "Omdat indexfondsen voorrang krijgen bij het kopen van aandelen",
                "Omdat alle beleggers samen de markt zíjn: vóór kosten behalen ze gemiddeld het marktgemiddelde, en de kosten van actief beleggen gaan daar nog vanaf",
              ],
              correctIndex: 3,
              explanation:
                "Dit is het rekenkundige argument van William Sharpe: de gemiddelde belegger kán vóór kosten niet beter doen dan de markt, want samen vormen alle beleggers die markt. Actief beleggen brengt hogere kosten mee dan passief volgen, dus ná kosten zakt het gemiddelde actieve resultaat onder de index. Kennis, belasting of voorrang hebben er niets mee te maken.",
            },
            {
              question:
                "Een fonds adverteert dat het de index de afgelopen vijf jaar heeft verslagen. Wat is de nuchtere reactie van een indexbelegger?",
              options: [
                "Knap, maar winnaars uit het verleden blijken vooraf geen betrouwbare winnaars voor de toekomst — dit is geen reden om over te stappen",
                "Zo'n fonds heeft bewezen beter te zijn en verdient dus een plek in je portefeuille",
                "Vijf jaar outperformance is statistisch onmogelijk, dus het fonds moet frauderen",
                "De index was de afgelopen vijf jaar blijkbaar kapot en wordt binnenkort herzien",
              ],
              correctIndex: 0,
              explanation:
                "Er zijn altijd fondsen die een periode winnen — met duizenden fondsen kan dat ook puur door toeval. Het probleem is dat winnaars van de afgelopen jaren de jaren erna opvallend vaak bij de achterblijvers staan. Vijf goede jaren zijn dus geen fraude en geen bewijs, maar vooral: geen selectiemiddel.",
            },
            {
              question:
                "Waarom vertelt een cursusaanbieder die ook actieve cursussen verkoopt je dit verhaal eigenlijk?",
              options: [
                "Omdat indexbeleggen alleen werkt voor mensen die eerst een cursus actief beleggen hebben afgerond",
                "Omdat actief beleggen wettelijk verboden is voor particulieren zonder cursuscertificaat",
                "Omdat eerlijkheid hier een productvereiste is: de meeste mensen hebben aan deze standaardroute genoeg, en de andere cursussen zijn verdieping voor wie het vak in wil",
                "Omdat de andere cursussen binnenkort uit het aanbod verdwijnen",
              ],
              correctIndex: 2,
              explanation:
                "Precies dit is het eerlijke verhaal van les 1: onze andere cursussen leren echte vakken, maar een vak leren is iets anders dan een vak nodig hebben. Deze cursus is de standaardroute; de rest is er voor wie beleggen als vak of hobby wil verdiepen — het liefst met een bewust afgebakend deel van het geld.",
            },
          ],
          xp: 50,
        },
        {
          slug: "wat-is-een-indexfonds",
          title: "Wat is een indexfonds (en wat is een ETF)?",
          durationMin: 8,
          intro:
            "Index, indexfonds, ETF, tracker: de termen vliegen je om de oren en betekenen nét niet allemaal hetzelfde. Goed nieuws: er zit een simpele logica achter, en die past in één les. Na deze les weet je precies wat je koopt als je een indexfonds koopt — en waarom dat fundamenteel iets anders is dan de markt proberen te voorspellen.",
          sections: [
            {
              heading: "Een index is een meetlat, geen belegging",
              paragraphs: [
                "Een index is om te beginnen niets meer dan een lijst met een rekenregel. De AEX is een lijst van de 25 grootste beursbedrijven van Nederland; een brede wereldindex bevat ruim duizend bedrijven uit ruim twintig ontwikkelde landen. Een rekenbureau houdt de lijst bij, telt de koersen volgens een vaste formule op en publiceert de uitkomst: het indexcijfer dat je in het nieuws hoort.",
                "Je kunt een index zelf niet kopen, net zomin als je 'het gemiddelde weer' kunt kopen. Het is een meetlat: een manier om in één getal te vangen hoe een hele markt het doet. Pas als een fonds die meetlat gaat nadoen, wordt het iets waar jij geld in kunt stoppen.",
                "De meeste grote indexen wegen bedrijven naar hun beurswaarde, in jargon marktkapitalisatie: het aantal aandelen keer de koers. Een bedrijf dat op de beurs tien keer zo veel waard is als een ander, telt tien keer zo zwaar mee in de index. Dat heeft een handig gevolg: stijgt of daalt een bedrijf in waarde, dan past zijn gewicht in de index zich vanzelf aan, zonder dat er gehandeld hoeft te worden.",
              ],
            },
            {
              heading: "Van meetlat naar fonds",
              paragraphs: [
                "Een indexfonds is een beleggingsfonds met één simpele opdracht: doe de meetlat na. Het fonds verzamelt geld van duizenden beleggers en koopt daarmee de aandelen uit de index, in dezelfde verhoudingen. Weegt een bedrijf 3% in de index, dan stopt het fonds 3% van het geld in dat bedrijf. Meer beslissingen zijn er niet.",
                "Daarmee koop jij met één aankoop een minuscuul plakje van honderden of duizenden bedrijven tegelijk. Gaat één bedrijf failliet, dan voel je dat nauwelijks: het was maar een fractie van je fonds. Die ingebouwde spreiding is de eerste grote kracht van indexbeleggen — je hangt nooit aan het lot van één bedrijf.",
                "De tweede grote kracht is dat 'geen beslissingen' ook 'bijna geen kosten' betekent. Een indexfonds heeft geen sterrenanalist nodig, geen team dat bedrijven bezoekt, geen dure voorspellingen. Volgen is goedkoop, voorspellen is duur — en in les 3 zie je hoe verrassend veel dat verschil uitmaakt.",
              ],
              example: {
                title: "Wat gebeurt er met jouw EUR 100?",
                body:
                  "Stel, je legt EUR 100 in bij een wereldwijd gespreid indexfonds. Het fonds verdeelt dat automatisch over alle bedrijven in de index, naar hun gewicht: een groot techbedrijf dat 4% van de index uitmaakt krijgt EUR 4, een middelgroot Europees bedrijf van 0,1% krijgt 10 cent, en de kleinste posities krijgen fracties van een cent. Met één transactie ben je mede-eigenaar van meer dan duizend bedrijven — iets waar je handmatig maanden en een fortuin aan transactiekosten voor nodig zou hebben.",
              },
            },
            {
              heading: "Wat maakt een ETF anders?",
              paragraphs: [
                "Een ETF (exchange traded fund, letterlijk: beursverhandeld fonds) is een indexfonds dat zelf op de beurs genoteerd staat. Je koopt en verkoopt een ETF via je broker, precies zoals een aandeel: op elk moment van de handelsdag, tegen de koers van dat moment. Een klassiek indexfonds handel je meestal één keer per dag rechtstreeks met de fondsaanbieder af, tegen één vastgestelde koers.",
                "Voor jou als langetermijnbelegger is dat verschil kleiner dan het lijkt. Wie dertig jaar belegt, heeft er niets aan om binnen één dag te kunnen handelen — sterker nog, dat gemak verleidt sommige mensen juist tot te véél handelen. Beide vormen doen hetzelfde werk: de index volgen tegen lage kosten. In Nederland zijn ETF's inmiddels de meest gangbare vorm, en het woord 'tracker' hoor je voor allebei.",
                "Wat je wel wilt onthouden: een ETF heeft een koers die de hele dag beweegt, en bij het kopen betaal je een klein verschil tussen bied- en laatprijs (de spread — komt terug in les 3). Verder geldt: de afkorting zegt niets over wát erin zit. Er bestaan ook exotische en riskante ETF's; in deze cursus gaat het steeds over de saaie soort, een breed gespreide aandelen-ETF tegen lage kosten.",
              ],
            },
            {
              heading: "Volgen is iets anders dan voorspellen",
              paragraphs: [
                "Sta nog even stil bij het wezenlijke verschil met alles wat je misschien over beleggen dacht. Een indexfonds heeft géén mening. Het voorspelt niet welke sector gaat winnen, stapt niet uit als de beurs daalt en niet in als het sentiment goed is. Het volgt. Altijd. Ook als dat een tijd pijnlijk is.",
                "Dat is geen luiheid maar een bewuste keuze, gebaseerd op de les van les 1: voorspellen lukt zelfs de professionals zelden blijvend, en pogingen daartoe kosten gegarandeerd geld. De indexbelegger geeft het voorspellen op en houdt daar twee dingen aan over: het marktgemiddelde en heel veel rust.",
                "Eerlijkheidshalve: die rust heeft een prijs. Wie de index volgt, daalt in een slechte beurstijd vól mee — er is geen beheerder die je 'eruit haalt'. Dat is geen ontwerpfout maar de kern van de afspraak, en in les 8 kijken we die keerzijde recht in de ogen.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "Bogle richtte in 1976 het eerste indexfonds voor particulieren op en werd er jarenlang om uitgelachen. Dit dunne boek is zijn verantwoording — en die leest verrassend vlot.",
            },
          ],
          keyTakeaways: [
            "Een index is een lijst met een rekenregel — een meetlat voor een markt, niet iets wat je zelf kunt kopen",
            "Een indexfonds doet de meetlat na: het koopt alle bedrijven uit de index in dezelfde verhoudingen, en jij koopt met één transactie een plakje van allemaal",
            "Een ETF is een indexfonds dat als een aandeel op de beurs verhandelbaar is; voor de lange termijn is het verschil met een klassiek indexfonds klein",
            "De meeste indexen wegen naar beurswaarde: grote bedrijven tellen zwaarder mee, en gewichten passen zich vanzelf aan",
            "Een indexfonds volgt, altijd — ook omlaag. Het voorspelt niets, en juist dat maakt het goedkoop en rustig",
          ],
          quiz: [
            {
              question: "Wat is een index precies?",
              options: [
                "Een beleggingsfonds dat je bij elke broker kunt kopen",
                "Een garantie van de beurs dat je inleg beschermd is",
                "Een lijst aandelen met een rekenregel, die in één getal samenvat hoe een markt het doet",
                "Een voorspelling van hoe de beurs zich volgend jaar ontwikkelt",
              ],
              correctIndex: 2,
              explanation:
                "Een index is een meetlat: een bijgehouden lijst bedrijven plus een formule die er één indexcijfer van maakt. Kopen kun je hem niet — daarvoor heb je een indexfonds of ETF nodig dat de lijst nadoet. Met garanties of voorspellingen heeft een index niets te maken.",
            },
            {
              question:
                "In een naar beurswaarde gewogen wereldindex is bedrijf A op de beurs twintig keer zo veel waard als bedrijf B. Wat betekent dat voor jouw indexfonds?",
              options: [
                "Het fonds belegt automatisch twintig keer zo veel van jouw geld in bedrijf A als in bedrijf B",
                "Het fonds belegt in beide bedrijven evenveel, want spreiding betekent gelijke porties",
                "Het fonds kiest zelf welk van de twee bedrijven de beste vooruitzichten heeft",
                "Bedrijf B wordt uit de index verwijderd zodra het twintig keer kleiner is",
              ],
              correctIndex: 0,
              explanation:
                "Wegen naar marktkapitalisatie betekent: hoe groter de beurswaarde, hoe zwaarder het gewicht. Twintig keer zo groot is twintig keer zo zwaar. Het fonds maakt daarbij geen eigen keuzes — dat is precies het punt. Deze weging heeft ook een keerzijde (grote bedrijven domineren), daarover meer in les 6.",
            },
            {
              question: "Wat is het belangrijkste verschil tussen een ETF en een klassiek indexfonds?",
              options: [
                "Een ETF volgt de index, een klassiek indexfonds probeert de index te verslaan",
                "Een ETF is altijd goedkoper dan een klassiek indexfonds",
                "Een klassiek indexfonds spreidt over meer bedrijven dan een ETF",
                "Een ETF is zelf op de beurs genoteerd en de hele handelsdag verhandelbaar; een klassiek indexfonds handel je meestal één keer per dag met de aanbieder af",
              ],
              correctIndex: 3,
              explanation:
                "Beide volgen een index; het verschil zit in de verhandelbaarheid. Een ETF koop je als een aandeel via de beurs, met een doorlopende koers en een spread. Voor een langetermijnbelegger is dat verschil klein — en 'altijd goedkoper' of 'beter gespreid' is geen wetmatigheid, dat hangt van het specifieke fonds af.",
            },
            {
              question: "De beurs daalt drie maanden op rij. Wat doet jouw indexfonds?",
              options: [
                "Het stapt tijdelijk over naar veiligere beleggingen tot de storm voorbij is",
                "Het blijft simpelweg de index volgen en daalt dus vol mee",
                "Het keert je inleg terug zodra het verlies groter wordt dan 10%",
                "Het schakelt een beheerder in die de slechtste aandelen uit de index verkoopt",
              ],
              correctIndex: 1,
              explanation:
                "Een indexfonds heeft geen mening en geen rem: het volgt, ook omlaag. Er is geen beheerder die ingrijpt en geen vangnet dat verliezen begrenst. Dat klinkt hard, maar het is de kern van de afspraak — en de reden dat het zo goedkoop is. Hoe je met dalingen omgaat, is een gedragsvraag; die komt in les 7 en 8 terug.",
            },
          ],
          xp: 50,
        },
        {
          slug: "de-kosten-vreter",
          title: "De kosten-vreter",
          durationMin: 9,
          tool: "kosten-vreter",
          intro:
            "Als er één getal is dat je als indexbelegger uit je hoofd moet kennen, dan is het niet het rendement — dat kent niemand vooraf — maar de kosten. Die staan wél vast, elk jaar opnieuw, in goede én slechte jaren. In deze les leer je waar de kosten zitten, ook de verstopte, en reken je zelf uit wat een schijnbaar klein verschil over dertig jaar aanricht.",
          sections: [
            {
              heading: "TER: de jaarlijkse hap uit je fonds",
              paragraphs: [
                "Elk fonds rekent lopende kosten, samengevat in de TER (total expense ratio): het percentage van jouw belegde vermogen dat er elk jaar aan beheer, administratie en toezicht af gaat. Een TER van 0,2% betekent: van elke EUR 1.000 die je belegd hebt, verdwijnt jaarlijks EUR 2 naar de fondsaanbieder.",
                "Je krijgt er nooit een rekening voor. De kosten worden dagelijks in miniporties uit het fondsvermogen gehaald, dus je ziet alleen een iets lager rendement dan de index zelf. Juist die onzichtbaarheid maakt kosten zo verraderlijk: wat je niet ziet, voelt als gratis.",
                "Ter oriëntatie, als feitelijk marktbeeld: breed gespreide indexfondsen en ETF's hebben tegenwoordig vaak een TER tussen de 0,1% en 0,3% per jaar, terwijl actief beheerde fondsen dikwijls tussen de 1% en 2% rekenen. Dat verschil oogt klein — het is het verschil tussen twee tientjes en honderdvijftig euro per EUR 10.000 per jaar. Maar de echte schade zit in de opstapeling, en die rekenen we zo door.",
              ],
            },
            {
              heading: "De kosten die niet in de folder staan",
              paragraphs: [
                "De TER is helaas niet het hele verhaal. Koop je een ETF, dan betaal je op het moment van aankoop de spread: het kleine verschil tussen de biedprijs (waarvoor je kunt verkopen) en de laatprijs (waarvoor je kunt kopen). Bij grote, veelverhandelde ETF's is dat vaak maar een paar honderdsten van een procent; bij kleine of exotische fondsen kan het oplopen. Je betaalt de spread bij elke transactie — nog een reden om niet vaak te handelen.",
                "Daarnaast rekent je broker mogelijk transactiekosten per aankoop en soms servicekosten over je totale tegoed. En binnen het fonds zelf zitten nog handelskosten die buiten de TER vallen: ook een indexfonds moet af en toe aandelen kopen en verkopen als de index wijzigt. Bij brede, rustige indexfondsen zijn die intern gemaakte kosten gelukkig klein.",
                "De optelsom noemen we in deze cursus je werkelijke kosten: TER plus spread plus broker- en servicekosten, omgerekend naar een percentage per jaar. Dat vraagt vijf minuten rekenwerk bij het kiezen van een fonds en broker, en het is zo'n beetje het best betaalde rekenwerk dat er bestaat — zoals het voorbeeld hieronder laat zien.",
              ],
              bullets: [
                "TER: de jaarlijkse lopende kosten van het fonds zelf",
                "Spread: het verschil tussen bied- en laatprijs, betaald bij elke ETF-transactie",
                "Brokerkosten: transactie- en/of servicekosten van het platform waar je koopt",
                "Interne handelskosten van het fonds: klein bij brede indexfondsen, maar niet nul",
              ],
            },
            {
              heading: "Het rekenvoorbeeld dat alles verandert",
              paragraphs: [
                "Tijd voor de som die van kostenletters een kostenbesef maakt. We vergelijken twee beleggers die allebei EUR 10.000 dertig jaar laten staan, in dezelfde markt. De een betaalt 0,2% werkelijke kosten per jaar, de ander 1,5%. Voor de rekensom nemen we aan dat de markt vóór kosten 6% per jaar zou opleveren — een aanname om mee te rekenen, geen voorspelling.",
                "Het venijn zit in het samengestelde effect: je betaalt de kosten niet alleen over je inleg, maar elk jaar opnieuw over je hele opgebouwde vermogen — én je loopt het rendement mis dat het wegbetaalde geld zelf had kunnen opleveren. Kosten vreten dus niet alleen aan je rendement, maar ook aan het rendement óp je rendement.",
                "Bogle vatte het samen in één zin die je mag onthouden: you get what you don't pay for — je krijgt wat je níét betaalt. Rendement is onzeker, kosten zijn gegarandeerd. Elke tiende procent kosten die je vermijdt, is een tiende procent rendement die je met zekerheid binnenhaalt. Er is in beleggen bijna niets anders dat zekerheid biedt; grijp het dus waar je kunt.",
              ],
              example: {
                title: "EUR 10.000, dertig jaar, twee kostenniveaus",
                body:
                  "Rekenaanname: de markt levert vóór kosten 6% per jaar op. Belegger A betaalt 0,2% kosten en groeit dus met netto 5,8% per jaar: EUR 10.000 wordt in dertig jaar ongeveer EUR 54.300. Belegger B betaalt 1,5% kosten en groeit met netto 4,5% per jaar: dezelfde EUR 10.000 wordt ongeveer EUR 37.500. Verschil: bijna EUR 17.000, oftewel bijna een derde van het eindbedrag van belegger A — opgegeten door 1,3 procentpunt aan extra kosten per jaar. En dit werkt bij élk marktrendement zo: de markt is voor beiden gelijk, alleen de kosten verschillen.",
              },
            },
            {
              heading: "Waarom goedkope fondsen structureel winnen",
              paragraphs: [
                "Je zou kunnen denken: een duur fonds kan zijn kosten toch terugverdienen met beter beheer? In theorie ja, maar les 1 liet al zien hoe zelden dat blijvend lukt. Onderzoek naar fondsprestaties wijst bovendien telkens hetzelfde aan als beste voorspeller van toekomstig relatief rendement — niet de sterren van beoordelaars, niet de reputatie van de beheerder, maar de kosten. Hoe lager, hoe beter de vooruitzichten. Saai, maar robuust.",
                "De logica is dezelfde als in les 1: het rendement van de markt is voor iedereen hetzelfde speelveld, kosten zijn de gegarandeerde aftrekpost. Een fonds dat 1,5% rekent, moet elk jaar 1,3 procentpunt beter presteren dan een fonds van 0,2% om alleen maar gelíjk te eindigen. Jaar in, jaar uit, dertig jaar lang. Dat is een gewicht dat bijna niemand blijvend meedraagt.",
                "Praktisch betekent dit: bij het vergelijken van breed gespreide indexfondsen die dezelfde index volgen, zijn de kosten je belangrijkste vergelijkingspunt. Niet het enige — in module 2 komen er nog een paar typisch Nederlandse afwegingen bij — maar wel het punt waar je begint. Speel gerust met de kosten-vreter hieronder om het effect met je eigen bedragen te zien.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "Het hele boek is in wezen één lang pleidooi over kosten, met Bogles beroemde regel 'you get what you don't pay for' als kern. Voor deze les is het dé bron.",
            },
          ],
          keyTakeaways: [
            "De TER is het jaarlijkse kostenpercentage van het fonds; je ziet er nooit een rekening van, en juist dat maakt kosten verraderlijk",
            "Je werkelijke kosten zijn breder: TER plus spread plus broker- en servicekosten, omgerekend per jaar",
            "Kosten stapelen samengesteld: 1,5% in plaats van 0,2% per jaar vreet in dertig jaar bijna een derde van je eindbedrag op (bij 6% rekenrendement: EUR 54.300 tegenover EUR 37.500 uit EUR 10.000)",
            "Rendement is onzeker, kosten zijn gegarandeerd — lage kosten zijn de enige zekere 'winst' die je kunt pakken",
            "Bij fondsen die dezelfde index volgen zijn kosten je eerste en belangrijkste vergelijkingspunt",
          ],
          quiz: [
            {
              question: "Je fonds heeft een TER van 0,25% en je hebt EUR 20.000 belegd. Wat merk jij daarvan?",
              options: [
                "Je ontvangt jaarlijks een factuur van EUR 50 die je apart moet betalen",
                "Je betaalt eenmalig EUR 50 bij aankoop en daarna nooit meer",
                "De kosten gelden alleen in jaren waarin het fonds winst maakt",
                "Er verdwijnt jaarlijks ongeveer EUR 50 uit het fondsvermogen, verwerkt in een iets lager rendement — een rekening zie je nooit",
              ],
              correctIndex: 3,
              explanation:
                "0,25% van EUR 20.000 is EUR 50 per jaar, dagelijks in miniporties uit het fondsvermogen gehaald. Je merkt het alleen doordat je rendement iets achterblijft bij de index. De kosten lopen door in goede én slechte jaren — er bestaat geen 'alleen bij winst'-korting.",
            },
            {
              question: "Wat is de spread bij het kopen van een ETF?",
              options: [
                "De jaarlijkse beheervergoeding van de fondsaanbieder",
                "Het verschil tussen de bied- en laatprijs, dat je bij elke transactie betaalt",
                "De boete die je betaalt als je binnen een jaar verkoopt",
                "Het verschil tussen het rendement van de ETF en dat van de index",
              ],
              correctIndex: 1,
              explanation:
                "De spread is het gaatje tussen de prijs waarvoor je kunt kopen (laat) en verkopen (bied). Bij grote, veelverhandelde ETF's is het klein, maar je betaalt het bij élke transactie — een van de redenen om weinig te handelen. De jaarlijkse beheervergoeding is de TER, en optie 4 beschrijft (ongeveer) de tracking error uit les 8.",
            },
            {
              question:
                "In het rekenvoorbeeld van deze les groeit EUR 10.000 in dertig jaar naar zo'n EUR 54.300 bij 0,2% kosten en naar zo'n EUR 37.500 bij 1,5% kosten. Wat verklaart dat grote verschil?",
              options: [
                "Het dure fonds belegde in slechtere aandelen dan het goedkope fonds",
                "Dure fondsen mogen wettelijk minder risico nemen en groeien daarom langzamer",
                "De kosten worden elk jaar opnieuw over het hele opgebouwde vermogen gerekend, en het wegbetaalde geld mist bovendien zijn eigen toekomstige rendement — het verschil stapelt dus samengesteld op",
                "Het verschil komt door inflatie, die dure fondsen harder raakt",
              ],
              correctIndex: 2,
              explanation:
                "In het voorbeeld is het marktrendement voor beide beleggers exact gelijk; alleen de kosten verschillen. Het samengestelde effect doet de rest: elk jaar een hap uit een steeds groter vermogen, plus het gemiste rendement op alle eerdere happen. Zo eet 1,3 procentpunt per jaar in dertig jaar bijna een derde van je eindbedrag op.",
            },
            {
              question: "Wat bedoelde John Bogle met 'you get what you don't pay for'?",
              options: [
                "Elke euro aan kosten die je vermijdt, is een euro rendement die je met zekerheid binnenhaalt — terwijl al het andere in beleggen onzeker is",
                "Gratis fondsen presteren altijd beter dan betaalde fondsen",
                "Wie niets betaalt voor advies, krijgt ook geen goed advies",
                "Goedkope fondsen zijn een teken van lage kwaliteit, dus je krijgt waar je voor betaalt",
              ],
              correctIndex: 0,
              explanation:
                "Bogles punt: het marktrendement is voor iedereen hetzelfde en vooraf onzeker, maar kosten staan vast. Vermeden kosten zijn dus de enige gegarandeerde 'opbrengst' in beleggen. Het is geen pleidooi tegen elke vergoeding, maar de constatering dat bij fondsen — anders dan bij veel producten — duurder structureel níét beter blijkt.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "de-nederlandse-details",
      title: "De Nederlandse details",
      description:
        "Twee indexfondsen die dezelfde index volgen, kunnen toch verschillend uitpakken — zeker voor een Nederlandse belegger. Deze module behandelt de keuzes achter de schermen: hoe een fonds de index nabootst, wat het met dividend doet, het typisch Nederlandse dividendlek en hoe een wereldportefeuille er eigenlijk uitziet.",
      lessons: [
        {
          slug: "fysiek-synthetisch-uitkerend-herbeleggend",
          title: "Fysiek of synthetisch, uitkerend of herbeleggend",
          durationMin: 8,
          intro:
            "Op het informatieblad van een ETF staan woorden die klinken als scheikunde: fysieke replicatie, synthetische replicatie, uitkerend, herbeleggend. Achter elk woord zit een simpele keuze van de fondsaanbieder — en als je die vier begrippen kent, kun je vrijwel elk fondsdocument lezen. Dat gaan we in deze les regelen.",
          sections: [
            {
              heading: "Fysieke replicatie: het fonds koopt de aandelen echt",
              paragraphs: [
                "Replicatie is het jargonwoord voor: hoe bootst het fonds de index na? De meest voor de hand liggende manier is fysiek. Het fonds koopt simpelweg de aandelen uit de index en houdt ze in bewaring. Wat jij bezit, is dan een plakje van een mandje échte aandelen — precies wat je intuïtief verwacht bij een indexfonds.",
                "Bij hele brede indexen met duizenden bedrijven kopen sommige fondsen niet elk piepklein aandeel, maar een slimme steekproef die de index vrijwel exact nadoet. Dat heet sampling (bemonstering) en het scheelt handelskosten in de kleinste, duurst verhandelbare posities. Het fonds bezit dan nog steeds echte aandelen, alleen niet allemáál.",
                "Fysieke fondsen lenen hun aandelen soms tijdelijk uit aan andere partijen, tegen vergoeding en onderpand. Dat drukt de kosten iets, maar voegt een klein tegenpartijrisico toe. Het staat netjes in de fondsdocumenten, inclusief hoe het onderpand geregeld is — weer zo'n detail dat je nu kunt opzoeken en begrijpen.",
              ],
            },
            {
              heading: "Synthetische replicatie: een belofte met onderpand",
              paragraphs: [
                "Een synthetisch fonds koopt de indexaandelen níét zelf. In plaats daarvan sluit het een ruilcontract (een swap) met een grote bank: de bank belooft het fonds precies het rendement van de index te leveren. Jij krijgt dus wel het indexrendement, maar via een omweg — je bezit geen mandje aandelen, je bezit een belofte.",
                "Laten we hier eerlijk over zijn, want synthetisch klinkt enger dan het is. Zulke fondsen zijn in Europa streng gereguleerd: tegenover de belofte moet onderpand staan, zodat de schade beperkt blijft als de bank zijn belofte niet kan nakomen. En voor sommige lastig toegankelijke markten is synthetisch de goedkoopste of zelfs de enige praktische route. Het is geen trucage — maar het ís een extra schakel.",
                "De nuchtere afweging: een belofte plus onderpand is nét iets minder eenvoudig dan gewoon de aandelen bezitten. Voor een brede wereldportefeuille zijn er ruim voldoende fysieke fondsen, dus veel langetermijnbeleggers kiezen daar uit voorkeur voor eenvoud. Wie een synthetisch fonds overweegt, weet nu in elk geval wat er onder de motorkap zit — en dat begrip is precies waar deze les voor is.",
              ],
            },
            {
              heading: "Uitkerend of herbeleggend: wat gebeurt er met het dividend?",
              paragraphs: [
                "De bedrijven in je fonds keren dividend uit: een deel van hun winst, in geld. Het fonds moet daar iets mee. Een uitkerend fonds (distributing) maakt het dividend periodiek aan jou over; je ziet het als geld op je beleggingsrekening verschijnen. Een herbeleggend fonds (accumulating) koopt er automatisch nieuwe aandelen voor binnen het fonds; je ziet geen geld, maar je fondswaarde groeit iets harder.",
                "Voor vermogensopbouw heeft herbeleggend twee stille voordelen. Ten eerste het rente-op-rente-effect uit onze gratis cursus: dividend dat direct weer belegd wordt, gaat zelf ook rendement opleveren, zonder dat er iets aan de strijkstok van uitstel of vergeten blijft hangen. Ten tweede gemak: je hoeft niets te doen, niets zelf te herbeleggen en betaalt geen extra transactiekosten om het dividend weer aan het werk te zetten.",
                "Uitkerend heeft ook een eerlijk gebruik: wie van zijn vermogen wil léven, bijvoorbeeld rond het pensioen, vindt het prettig dat er vanzelf geld binnenkomt. Voor de Nederlandse belasting maakt de keuze intussen doorgaans weinig uit: box 3 kijkt naar de waarde van je vermogen, niet naar of je dividend liet uitkeren of herbeleggen (zo werkt de regel, peildatum augustus 2026 — belastingregels veranderen, check bij twijfel de Belastingdienst). In de opbouwfase is herbeleggend voor de meeste mensen simpelweg de handigste vorm.",
              ],
              bullets: [
                "Fysiek: het fonds bezit de echte aandelen (soms via een steekproef)",
                "Synthetisch: het fonds bezit een belofte van een bank, met onderpand als vangnet",
                "Uitkerend: dividend komt als geld naar jou toe",
                "Herbeleggend: dividend wordt automatisch binnen het fonds herbelegd — handig in de opbouwfase",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "Bogle hamert op eenvoud en op het herbeleggen van dividend als stille motor achter vermogensgroei — de geest achter deze hele les.",
            },
          ],
          keyTakeaways: [
            "Fysieke replicatie: het fonds koopt de indexaandelen echt; sampling is daarvan een variant met een slimme steekproef",
            "Synthetische replicatie: het fonds krijgt het indexrendement via een ruilcontract met een bank — niet eng maar wél een extra schakel; er staat verplicht onderpand tegenover",
            "Uitkerend fonds: dividend komt als geld naar jou; herbeleggend fonds: dividend wordt automatisch herbelegd",
            "In de opbouwfase is herbeleggend meestal het handigst: maximaal rente-op-rente, geen omkijken, geen extra transactiekosten",
            "Voor box 3 maakt uitkerend of herbeleggend doorgaans weinig uit (peildatum augustus 2026) — regels veranderen, dus check bij twijfel de Belastingdienst",
          ],
          quiz: [
            {
              question: "Wat bezit je (indirect) als je een fysiek replicerend indexfonds koopt?",
              options: [
                "Een plakje van een mandje echte aandelen die het fonds in bewaring houdt",
                "Een belofte van een bank om het indexrendement te leveren",
                "Een verzekering die je inleg beschermt tegen koersdalingen",
                "Een lening aan de fondsaanbieder met de index als rente",
              ],
              correctIndex: 0,
              explanation:
                "Fysiek betekent letterlijk fysiek: het fonds koopt de aandelen uit de index en jij bezit daar via het fonds een evenredig plakje van. De belofte-constructie hoort bij synthetische fondsen, en bescherming tegen dalingen biedt geen enkel indexfonds.",
            },
            {
              question: "Wat is de eerlijkste samenvatting van een synthetische ETF?",
              options: [
                "Een verboden constructie die alleen buiten Europa nog bestaat",
                "Een fonds dat precies hetzelfde is als een fysiek fonds, alleen goedkoper",
                "Je krijgt het indexrendement via een ruilcontract met een bank: gereguleerd en met onderpand, maar je bezit een belofte in plaats van de aandelen zelf",
                "Een fonds dat probeert de index te verslaan met slimme derivaten",
              ],
              correctIndex: 2,
              explanation:
                "Synthetisch is niet verboden en niet per definitie goedkoper of duurder — het is een andere constructie. De kern: een extra schakel (de bank die belooft) met een verplicht vangnet (het onderpand). Het doel blijft de index volgen, niet verslaan.",
            },
            {
              question:
                "Sanne is 32 en bouwt vermogen op voor over dertig jaar. Waarom past een herbeleggend fonds waarschijnlijk goed bij haar situatie?",
              options: [
                "Omdat herbeleggende fondsen wettelijk verplicht zijn voor beleggers onder de 40",
                "Omdat het dividend automatisch wordt herbelegd: maximaal rente-op-rente-effect, zonder gedoe en zonder extra transactiekosten",
                "Omdat herbeleggende fondsen geen TER rekenen",
                "Omdat ze dan elk kwartaal dividend op haar rekening gestort krijgt",
              ],
              correctIndex: 1,
              explanation:
                "In de opbouwfase wil je dat elk dividend direct weer aan het werk gaat — herbeleggend regelt dat vanzelf. Dividend op je rekening gestort krijgen is juist het kenmerk van een uitkerend fonds, en kosteloos zijn herbeleggende fondsen helaas niet. Een leeftijdswet bestaat uiteraard niet.",
            },
            {
              question:
                "Wat betekent het als een fysiek fonds aan 'securities lending' (aandelen uitlenen) doet?",
              options: [
                "Het fonds leent geld van beleggers om extra aandelen te kopen",
                "Het fonds leent jouw participaties uit, waardoor je tijdelijk niet kunt verkopen",
                "Het fonds is daarmee automatisch synthetisch geworden",
                "Het fonds leent zijn aandelen tijdelijk uit tegen vergoeding en onderpand: het drukt de kosten iets, maar voegt een klein tegenpartijrisico toe",
              ],
              correctIndex: 3,
              explanation:
                "Uitlenen levert het fonds (en dus jou) een kleine vergoeding op, met onderpand als zekerheid — maar er is nu wel een partij die iets terug moet geven. Het fonds blijft gewoon fysiek en jouw eigen participaties blijven verhandelbaar. Hoe het geregeld is, staat in de fondsdocumenten.",
            },
          ],
          xp: 50,
        },
        {
          slug: "het-dividendlek",
          title: "Het dividendlek: de typisch Nederlandse les",
          durationMin: 10,
          intro:
            "Dit is de les die je in Amerikaanse boeken en video's niet vindt, omdat hij specifiek voor Nederlandse beleggers speelt: dividendlekkage. Het klinkt als loodgieterswerk en dat is het eigenlijk ook — ergens onderweg lekt een stukje van jouw dividend weg naar buitenlandse belastingdiensten. In deze les zie je waar het lek zit, hoe groot het is en waarom de vestigingsplaats van een fonds ertoe doet. Vooraf gezegd: dit is uitleg van het stelsel zoals het in augustus 2026 werkt, geen fiscaal advies.",
          sections: [
            {
              heading: "Bronbelasting: het buitenland houdt eerst iets in",
              paragraphs: [
                "Keert een Amerikaans bedrijf dividend uit aan een buitenlandse belegger, dan houdt de Amerikaanse fiscus daar eerst belasting op in vóórdat het geld het land verlaat. Dat heet bronbelasting: belasting aan de bron. Voor veel landen, waaronder Nederland, is het tarief op Amerikaans dividend door belastingverdragen 15%. Van EUR 100 dividend komt er dus EUR 85 aan.",
                "Bijna elk land doet dit, met eigen tarieven, en ook Nederland zelf: op dividend van Nederlandse bedrijven wordt 15% dividendbelasting ingehouden. Het idee achter de verdragen is dat je als belegger die ingehouden belasting vervolgens kunt verrekenen met de belasting in je eigen land, zodat je niet dubbel betaalt.",
                "Voor jou als particulier met een los Nederlands aandeel werkt dat redelijk: de ingehouden Nederlandse dividendbelasting verreken je met je inkomstenbelasting. Maar jij koopt geen losse aandelen — jij koopt een fonds. En daar wordt het interessant, want tussen jou en dat Amerikaanse dividend zit nu een extra schakel: het fonds zelf, met een eigen vestigingsland.",
              ],
            },
            {
              heading: "Waarom een fonds in Ierland dat geld vaak niet voor jou terugkrijgt",
              paragraphs: [
                "Veel grote ETF's zijn gevestigd in Ierland of Luxemburg. Ontvangt zo'n Iers fonds dividend van Amerikaanse bedrijven, dan houdt de VS daar (dankzij het Iers-Amerikaanse verdrag) 15% op in. Tot zover niets bijzonders. Het probleem: dat fonds kan die 15% niet aan jóú doorgeven om te verrekenen. Het fonds is de formele ontvanger, niet jij — en de Nederlandse Belastingdienst verrekent geen belasting die een Iers fonds in Amerika betaalde.",
                "Die 15% is daarmee voor jou definitief kwijt: weggelekt. Vandaar de naam dividendlekkage. Het fonds doet niets fout — het volgt gewoon de verdragen die voor zíjn vestigingsland gelden — maar de keten belegger-fonds-bedrijf loopt over twee grenzen, en bij zo'n dubbele grensovergang blijft er belasting hangen die bij rechtstreeks bezit verrekenbaar was geweest.",
                "Een fonds dat in Nederland is gevestigd, kan dit deels repareren. Nederland kent een fondsregime dat (onder voorwaarden) is ontworpen om die keten fiscaal doorzichtig te maken: het fonds kan buitenlandse bronbelasting deels terugvragen of verrekenen, en houdt bij zijn eigen uitkering aan jou Nederlandse dividendbelasting in — en díé kun jij als Nederlandse belegger wél gewoon verrekenen met je inkomstenbelasting. Netto lekt er dan veel minder weg. Nogmaals: zo werkt het stelsel anno augustus 2026; de details zijn aan verandering onderhevig en dit is geen advies over wat jij moet kiezen.",
              ],
            },
            {
              heading: "Hoe groot is het lek eigenlijk?",
              paragraphs: [
                "Tijd voor orde van grootte, want een lek is pas een argument als je weet hoeveel er doorheen loopt. Wereldwijd gespreide aandelen keren grofweg zo'n 2% van hun waarde per jaar uit als dividend. Alleen over het déél daarvan dat uit landen met niet-verrekenbare bronbelasting komt, lekt er iets weg. De optelsom komt voor een wereldportefeuille bij een niet-Nederlands fonds typisch uit op enkele tienden van een procent per jaar — geen drama, maar ook geen afrondingsfout.",
                "Zet dat naast les 3 en je ziet waarom deze les bestaat: we maakten ons daar druk over kostenverschillen van enkele tienden van een procent, en het dividendlek speelt in precies diezelfde orde van grootte. Een fonds met een iets hogere TER maar zonder lek kan netto dus gunstiger uitpakken dan een goedkoper fonds mét lek — je moet ze samen bekijken, niet los.",
                "Maar laat het lek geen obsessie worden. Spreiding, lage totale kosten en vól kunnen blijven zitten (les 7) blijven de hoofdzaken; het dividendlek is één weegfactor daarnaast, niet de belangrijkste. En omdat dit fiscale loodgieterswerk is dat met verdragen en wetgeving meebeweegt: controleer de actuele situatie bij de Belastingdienst of een belastingadviseur voordat je er grote beslissingen aan ophangt.",
              ],
              example: {
                title: "Het lek in euro's, op een portefeuille van EUR 10.000",
                body:
                  "Stel, je hebt EUR 10.000 in een wereldwijd gespreid fonds en de bedrijven daarin keren 2% dividend uit: EUR 200 per jaar. Ongeveer twee derde van een wereldindex bestaat tegenwoordig uit Amerikaanse aandelen; over dat Amerikaanse deel (EUR 133 aan dividend) houdt de VS 15% in: zo'n EUR 20. Kan je fonds dat niet voor je terughalen of verrekenbaar maken, dan is dat EUR 20 per jaar kwijt — ongeveer 0,2% van je portefeuille. Klinkt klein, maar het is dezelfde orde van grootte als de complete TER van een goedkoop indexfonds, en het tikt elk jaar opnieuw.",
              },
            },
            {
              heading: "Wat je hiermee doet (en wat niet)",
              paragraphs: [
                "Praktisch komt deze les neer op één extra vraag bij het vergelijken van fondsen: waar is het fonds gevestigd, en wat betekent dat voor de dividendstroom richting een Nederlandse belegger? Fondsaanbieders die zich op de Nederlandse markt richten, zijn hier meestal open over; ook onafhankelijke vergelijkingen besteden er aandacht aan. Je hoeft het lek niet zelf tot op de cent uit te rekenen — snappen wáár het zit en dat het meeweegt, is genoeg.",
                "Wat je er niet mee moet doen: het verheffen tot enige selectiecriterium. Een fonds in Nederland scoort op dit ene punt structureel goed, maar kosten, omvang, spreiding en de index die gevolgd wordt tellen net zo goed mee. En internationale fondsen hebben weer eigen voordelen, zoals enorme schaal. Er is hier geen objectief 'beste' — er is een afweging, en die kun je nu zelf maken.",
                "Tot slot het eerlijke voorbehoud, nog één keer expliciet: belastingverdragen worden heronderhandeld, fondsregimes worden herzien en wat in augustus 2026 klopt, kan over een paar jaar anders liggen. Deze les leert je het mechanisme, zodat je nieuwsberichten hierover kunt plaatsen. De actuele regels check je bij de Belastingdienst; persoonlijke fiscale keuzes bespreek je zo nodig met een adviseur.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton Malkiel",
              year: 1973,
              note: "Malkiel behandelt belastingen als serieuze rendementsfactor — zij het voor de Amerikaanse situatie. Het principe 'na-belasting-rendement is wat telt' is universeel; het Nederlandse loodgieterswerk uit deze les vind je alleen hier.",
            },
          ],
          keyTakeaways: [
            "Bronbelasting: landen houden eerst belasting in op dividend voor buitenlandse ontvangers — op Amerikaans dividend doorgaans 15%",
            "Dividendlekkage: een fonds buiten Nederland kan die ingehouden belasting vaak niet voor jou verrekenbaar maken, en dan is dat deel definitief kwijt",
            "Een fonds dat in Nederland is gevestigd kan het lek grotendeels dichten: het houdt Nederlandse dividendbelasting in, en die verreken jij wél met je inkomstenbelasting",
            "Orde van grootte op een wereldportefeuille: enkele tienden van een procent per jaar — vergelijkbaar met een complete TER, dus weeg het mee náást de kosten",
            "Dit is het stelsel per augustus 2026, geen advies: regels veranderen, dus check de actuele situatie bij de Belastingdienst of een adviseur",
          ],
          quiz: [
            {
              question:
                "Een Amerikaans bedrijf keert EUR 100 dividend uit aan een Iers indexfonds. Hoeveel komt er bij het fonds aan, en wat gebeurt er met de rest?",
              options: [
                "EUR 100: binnen belastingverdragen stroomt dividend altijd onbelast tussen landen",
                "Ongeveer EUR 85: de VS houdt 15% bronbelasting in, en het Ierse fonds kan die 15% doorgaans niet voor Nederlandse beleggers verrekenbaar maken",
                "Ongeveer EUR 85: maar het fonds krijgt die 15% aan het eind van het jaar automatisch terug van de Nederlandse Belastingdienst",
                "EUR 79: de VS en Ierland houden allebei belasting in en Nederland nog eens",
              ],
              correctIndex: 1,
              explanation:
                "De VS houdt aan de bron 15% in; er komt EUR 85 aan. De kern van het dividendlek: het fonds is de formele ontvanger, dus jij kunt die Amerikaanse belasting niet verrekenen, en de Nederlandse Belastingdienst geeft geen belasting terug die een Iers fonds in Amerika betaalde. Dat deel lekt weg.",
            },
            {
              question:
                "Waarom kan een fonds dat in Nederland is gevestigd het dividendlek voor een Nederlandse belegger vaak grotendeels dichten?",
              options: [
                "Omdat Nederlandse fondsen zijn vrijgesteld van alle buitenlandse belastingen",
                "Omdat Nederlandse fondsen alleen in Nederlandse bedrijven beleggen, waar geen bronbelasting op zit",
                "Omdat de koers van Nederlandse fondsen wordt gecorrigeerd voor het lek",
                "Omdat het Nederlandse fondsregime de keten fiscaal doorzichtiger maakt: het fonds kan buitenlandse bronbelasting deels terughalen of verrekenen, en de Nederlandse dividendbelasting die het zelf inhoudt, verreken jij met je inkomstenbelasting",
              ],
              correctIndex: 3,
              explanation:
                "De reparatie zit in het stelsel: het Nederlandse fondsregime is (onder voorwaarden) ontworpen zodat de belasting niet blijft hangen bij de tussenschakel. Het fonds belegt gewoon wereldwijd en is nergens volledig van vrijgesteld — en let op: dit beschrijft de regels per augustus 2026, geen belofte voor de eeuwigheid.",
            },
            {
              question:
                "Wat is voor een wereldwijd gespreide portefeuille bij een niet-Nederlands fonds de realistische orde van grootte van het dividendlek?",
              options: [
                "Enkele procenten per jaar — het overschaduwt alle andere kosten",
                "Exact nul, want verdragen dichten elk lek",
                "Enkele tienden van een procent per jaar — dezelfde orde van grootte als een complete TER van een goedkoop fonds",
                "Alleen een eenmalig bedrag bij aankoop van het fonds",
              ],
              correctIndex: 2,
              explanation:
                "Reken mee: zo'n 2% dividendrendement, waarvan een deel uit landen komt waar 15% blijft hangen — dat telt op tot enkele tienden van een procent per jáár, elk jaar opnieuw. Genoeg om mee te wegen naast de TER, niet genoeg om er alles voor opzij te zetten.",
            },
            {
              question: "Hoe hoort deze les over dividendlekkage gebruikt te worden?",
              options: [
                "Als uitleg van het mechanisme per augustus 2026, mee te wegen naast kosten en spreiding — actuele regels check je bij de Belastingdienst of een adviseur",
                "Als doorslaggevend bewijs dat je uitsluitend fondsen uit één land zou moeten kopen",
                "Als truc om helemaal geen belasting meer over je beleggingen te betalen",
                "Als reden om dividend uitkerende bedrijven volledig te mijden",
              ],
              correctIndex: 0,
              explanation:
                "Dit is stelselkennis, geen advies en zeker geen belastingtruc: het lek gaat over waar ingehouden belasting blijft hangen, niet over belasting ontwijken. De vestigingsplaats is één weegfactor naast kosten, omvang en spreiding — en omdat verdragen en regimes veranderen, verifieer je de actuele stand voordat je kiest.",
            },
          ],
          xp: 50,
        },
        {
          slug: "een-wereldportefeuille",
          title: "Een wereldportefeuille: de hele wereld kopen",
          durationMin: 9,
          intro:
            "'Koop gewoon de hele wereld' is het standaardadvies uit indexland. Maar wat kóóp je dan eigenlijk? In deze les maken we dat concreet: hoe een wereldportefeuille in elkaar zit, waarom die minder gespreid is dan hij klinkt — en waarom dat geen diskwalificatie is, zolang je het maar wéét. Plus een eerlijke alinea over obligaties.",
          sections: [
            {
              heading: "De hele wereld in één fonds (of een klein setje)",
              paragraphs: [
                "Wereldindexen komen in twee smaken. Indexen van ontwikkelde markten dekken de volwassen economieën: de VS, West-Europa, Japan en een reeks andere landen, samen goed voor ruim duizend grote en middelgrote bedrijven. Opkomende markten — denk aan China, India, Brazilië — zitten daar níét in; daarvoor bestaan aparte indexen, of gecombineerde wereldindexen die beide werelden in één keer dekken en daarmee op duizenden bedrijven uitkomen.",
                "Praktisch kun je dus twee kanten op: één fonds dat alles-in-één de hele wereld volgt, of een klein setje van bijvoorbeeld een ontwikkelde-marktenfonds plus een opkomende-marktenfonds. Alles-in-één is het toppunt van eenvoud; een setje geeft iets meer keuze in de verhoudingen, in ruil voor iets meer onderhoud. Beide zijn volwaardige routes — dit is een smaakkwestie, geen goed-fout-vraag.",
                "Waar je wel op let: dat je jezelf niet dubbel telt. Wie een wereldindexfonds combineert met een apart Amerika-fonds 'voor de zekerheid', bezit Amerikaanse aandelen twee keer en is dus minder gespreid dan hij denkt. De kracht van een wereldportefeuille is juist dat één of twee brede fondsen het complete werk doen — meer potjes betekent hier niet meer spreiding.",
              ],
            },
            {
              heading: "Eerlijk over concentratie: de wereld is topzwaar",
              paragraphs: [
                "Nu de eerlijkheid die je van ons gewend bent. 'Duizenden bedrijven' klinkt als perfecte spreiding, maar een wereldindex weegt naar beurswaarde (les 2), en de beurswaarde van de wereld is scheef verdeeld. Amerikaanse aandelen maken de laatste jaren ruwweg twee derde van een brede wereldindex uit, en binnen dat Amerikaanse deel wegen een handvol grote technologiebedrijven opvallend zwaar. Je duizenden bedrijven zijn er echt — maar de kopgroep bepaalt een flink deel van je resultaat.",
                "Is dat erg? Het is in elk geval geen ontwerpfout: de weging wéérspiegelt gewoon waar beleggers wereldwijd hun geld het meest waard vinden, en hij beweegt vanzelf mee als dat verandert. In de jaren tachtig woog Japan zwaar in de wereldindex; toen de Japanse beurs terugviel, kromp dat gewicht automatisch mee, zonder dat een indexbelegger iets hoefde te doen. Dat zelfcorrigerende karakter is een van de stille krachten van het systeem.",
                "Maar het betekent wél dat 'de hele wereld' gevoeliger is voor de VS en voor grote techbedrijven dan het etiket suggereert. Hapert dat deel van de markt, dan voel jij dat volop mee. Wie dat begrijpt, koopt een wereldindex met open ogen; wie het niet weet, schrikt op het verkeerde moment. Vandaar deze les: het is een eigenschap én een risico, en je hoort hem allebei te kennen.",
              ],
            },
            {
              heading: "Home bias: de verleiding van dichtbij",
              paragraphs: [
                "Beleggers over de hele wereld maken dezelfde fout: ze beleggen veel te veel in hun eigen land. Dat heet home bias. Nederlandse beleggers kopen relatief veel Nederlandse aandelen, Amerikanen Amerikaanse, Japanners Japanse. Bekend voelt veilig — je kent de bedrijven uit het nieuws en van de winkelstraat.",
                "Maar rekenkundig is het een concentratieprobleem: de Nederlandse beurs is maar een heel klein deel van de wereldwijde beurswaarde. Wie vooral AEX-bedrijven koopt, hangt zijn vermogen op aan één klein land — terwijl zijn baan, huis en pensioen daar meestal óók al aan hangen. Ging het ooit structureel mis met de Nederlandse economie, dan zou zo'n belegger op alle fronten tegelijk geraakt worden.",
                "De wereldportefeuille is het medicijn: je eigen land zit er gewoon in, precies met het gewicht dat het op wereldschaal heeft, en de rest van de wereld draagt de rest. Bekendheid is geen spreiding — dat is de hele les in vijf woorden.",
              ],
              bullets: [
                "Home bias: de neiging om veel te veel te beleggen in je eigen land, puur omdat het bekend voelt",
                "Je inkomen, huis en pensioen hangen vaak al aan de Nederlandse economie — je beleggingen hoeven daar niet nog eens bij",
                "In een wereldindex krijgt Nederland vanzelf zijn eerlijke (kleine) gewicht",
              ],
            },
            {
              heading: "En obligaties dan? Eén eerlijke alinea",
              paragraphs: [
                "Deze cursus gaat over aandelen-ETF's, maar je komt in fondsenland ook obligaties tegen: leningen aan overheden of bedrijven, met rente als vergoeding. In één eerlijke alinea: obligaties bewegen doorgaans rustiger dan aandelen, en historisch stond daar een lager gemiddeld rendement tegenover — de klassieke ruil tussen rust en groei. Veel beleggers mengen daarom aandelen met obligaties om de schommelingen van hun totale portefeuille te dempen, in een verhouding die past bij hoeveel beweging ze aankunnen en hoe lang hun geld kan blijven staan.",
                "Hoe je die verhouding kiest, wat obligaties precies zijn en welke risico's dáár weer in zitten (want rustiger is niet risicoloos): dat is een eigen vakgebied dat een eerlijke behandeling verdient, en die past niet in een alinea. We parkeren de diepgang dus bewust voor een toekomstige cursus. Voor nu is dit genoeg: weet dat de knop bestaat, en dat 100% aandelen niet de enige smaak is.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton Malkiel",
              year: 1973,
              note: "Malkiel onderbouwt de brede, wereldwijd gespreide portefeuille en behandelt óók de mix met obligaties per levensfase. Een dik boek — gebruik het als naslagwerk, niet als verplichte kost van kaft tot kaft.",
            },
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "Home bias en schrikken van concentratie zijn gedragsonderwerpen, en niemand schrijft daar zo prettig over als Housel. Korte, losse hoofdstukken — ideaal tussendoor.",
            },
          ],
          keyTakeaways: [
            "Eén breed wereldfonds of een klein setje (ontwikkeld + opkomend) volstaat om de hele wereld te kopen; meer potjes is niet meer spreiding",
            "Een wereldindex is topzwaar: Amerikaanse aandelen wegen ruwweg twee derde en grote techbedrijven wegen daarbinnen zwaar — een eigenschap én een risico dat je hoort te kennen",
            "De weging corrigeert zichzelf: verschuift de wereldeconomie, dan verschuiven de gewichten vanzelf mee",
            "Home bias — te veel beleggen in eigen land — voelt veilig maar stapelt risico op risico; bekendheid is geen spreiding",
            "Obligaties zijn de rustiger tegenhanger met historisch lager gemiddeld rendement; de diepgang daarover bewaren we eerlijk voor een eigen cursus",
          ],
          quiz: [
            {
              question:
                "Joris koopt een wereldindexfonds en daarnaast 'voor de zekerheid' een apart fonds met Amerikaanse aandelen. Wat is er mis met zijn redenering?",
              options: [
                "Niets: hoe meer fondsen, hoe beter gespreid je bent",
                "Amerikaanse aandelen mogen niet gecombineerd worden met een wereldindexfonds",
                "Amerikaanse aandelen zitten al zwaar in de wereldindex, dus hij telt ze dubbel en wordt juist gecóncentreerder in plaats van gespreider",
                "Een wereldindexfonds bevat helemaal geen Amerikaanse aandelen, dus de aanvulling is logisch",
              ],
              correctIndex: 2,
              explanation:
                "Een wereldindex bestaat al voor ruwweg twee derde uit Amerikaanse aandelen. Er een Amerika-fonds naast zetten vergroot precies het deel dat al het zwaarst weegt. Meer potjes voelt als meer spreiding, maar het gaat om wat erín zit — dit is dubbel tellen, geen zekerheid.",
            },
            {
              question: "Wat is de eerlijke keerzijde van een naar beurswaarde gewogen wereldindex?",
              options: [
                "De index bevat te weinig bedrijven om van echte spreiding te spreken",
                "Hij is topzwaar: de VS en een handvol grote techbedrijven bepalen een flink deel van je resultaat, dus 'de hele wereld' is gevoeliger voor die kopgroep dan het etiket suggereert",
                "De gewichten moeten elk jaar handmatig worden bijgesteld, wat kosten veroorzaakt",
                "Kleine landen worden bewust uit de index geweerd",
              ],
              correctIndex: 1,
              explanation:
                "De duizenden bedrijven zijn er echt, maar de beurswaarde van de wereld is scheef verdeeld en de weging volgt die scheefheid. Dat is tegelijk een kracht (de index corrigeert zichzelf automatisch, zonder handmatig bijstellen) en een risico dat je moet kennen: hapert de kopgroep, dan voel je dat volop.",
            },
            {
              question: "Waarom is home bias voor een Nederlandse belegger extra onhandig?",
              options: [
                "Omdat Nederlandse aandelen wettelijk zwaarder belast worden dan buitenlandse",
                "Omdat de AEX historisch altijd slechter presteerde dan andere beurzen",
                "Omdat Nederlandse bedrijven geen dividend uitkeren",
                "Omdat je baan, huis en pensioen vaak al aan de Nederlandse economie hangen — er ook nog geconcentreerd in beleggen stapelt risico op risico",
              ],
              correctIndex: 3,
              explanation:
                "Het probleem is concentratie, niet de kwaliteit van Nederlandse bedrijven: de Nederlandse beurs is een heel klein deel van de wereld, terwijl je overige financiële leven meestal al Nederlands is. Een wereldportefeuille geeft Nederland vanzelf zijn eerlijke, kleine gewicht. De andere opties zijn feitelijk onjuist.",
            },
            {
              question: "Welke uitspraak over obligaties past bij de eerlijke samenvatting uit deze les?",
              options: [
                "Obligaties bewegen doorgaans rustiger dan aandelen, met historisch een lager gemiddeld rendement — een ruil tussen rust en groei, en rustiger is niet risicoloos",
                "Obligaties zijn risicoloos en daarom altijd beter dan aandelen",
                "Obligaties zijn aandelen van kleine bedrijven",
                "Obligaties leverden historisch meer op dan aandelen, maar met meer schommelingen",
              ],
              correctIndex: 0,
              explanation:
                "Obligaties zijn leningen aan overheden of bedrijven: doorgaans rustiger dan aandelen, historisch met een lager gemiddeld rendement — en dat historische beeld is geen belofte. Risicoloos zijn ze niet (ook leningen kennen risico's). De diepgang bewaren we voor een eigen cursus; voor nu volstaat de ruil rust-versus-groei.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "kopen-automatiseren-volhouden",
      title: "Kopen, automatiseren en volhouden",
      description:
        "Kennis wordt pas vermogen als je begint én volhoudt. Deze slotmodule maakt het praktisch: automatisch periodiek inleggen, de eerlijke afweging tussen ineens en gespreid instappen, waar je op let bij een broker — en de les die deze cursus compleet maakt: wat indexbeleggen níét voor je doet, en wanneer het niet past.",
      lessons: [
        {
          slug: "automatiseren-en-eraf-blijven",
          title: "Automatiseren en eraf blijven",
          durationMin: 9,
          intro:
            "De grootste vijand van de indexbelegger is niet de markt — het is de eigen hand die naar de verkoopknop kruipt. Deze les gaat daarom over het bouwen van een systeem dat zonder jou draait: automatisch inleggen, één keer goed instappen en daarna vooral heel consequent níéts doen.",
          sections: [
            {
              heading: "Periodiek inleggen: maak er een abonnement van",
              paragraphs: [
                "De kern van een volhoudbaar beleggingsplan is verbluffend simpel: een vast bedrag, op een vaste dag, elke maand, automatisch. Direct na je salaris een overboeking naar je beleggingsrekening en een (bij veel platforms instelbare) automatische aankoop van je fonds. Beleggen wordt dan een abonnement, net als je huur of je energiecontract — iets wat gebéúrt, niet iets wat je elke maand opnieuw beslist.",
                "Waarom is dat automatische zo belangrijk? Omdat elke maandelijkse beslissing een kans is om níét te beleggen. De beurs staat hoog ('ik wacht op een dip'), de beurs staat laag ('het is nu te eng'), het nieuws is onrustig ('even afwachten') — er is altijd een reden. Automatisering haalt die beslissingen weg, en daarmee de twijfel, het uitstel en het gedoe.",
                "Er zit nog een prettige bijvangst aan vaste bedragen: je koopt automatisch méér participaties als de koersen laag staan en minder als ze hoog staan. Dat is geen magische truc die verlies voorkomt, maar het betekent wel dat een dalende beurs voor een maandelijkse inlegger ook iets oplevert: dezelfde euro's kopen meer. Zo went je systeem je vanzelf af om dalingen als pure rampspoed te zien.",
              ],
            },
            {
              heading: "Ineens instappen of spreiden? Het eerlijke antwoord",
              paragraphs: [
                "Dan de vraag die iedereen met een spaarpot stelt: ik heb EUR 20.000 — zet ik dat er in één keer in, of verspreid over bijvoorbeeld een jaar? Het statistische antwoord is helder en verrast veel mensen: in historisch onderzoek won meteen alles beleggen in grofweg twee van de drie vergelijkbare periodes van gespreid instappen. Logisch ook: markten stegen historisch vaker dan ze daalden, dus geld aan de zijlijn miste gemiddeld méér stijging dan het aan daling ontweek.",
                "Betekent dat dat spreiden dom is? Nee — en hier komt het eerlijke deel. Die statistiek gaat over gemiddelden; jouw leven speelt zich één keer af. Wie vlak voor een flinke daling alles inlegt en daarvan zó schrikt dat hij verkoopt, is slechter af dan wie gespreid instapte en bleef zitten. Gespreid instappen is dus vooral een gedragskeuze: je koopt er gemoedsrust en de zekerheid mee dat je nooit precies op de top alles hebt ingelegd, tegen de prijs van een statistisch iets lagere verwachting.",
                "Beide keuzes zijn verdedigbaar, en dat zeggen we niet uit slapheid maar omdat het klopt. De enige écht slechte keuze is de derde, stiekeme optie: eindeloos wachten op het perfecte instapmoment. Dat moment kondigt zich nooit aan, en ondertussen doet je geld niets. Kies ineens of kies een vast spreidingsschema met een einddatum — maar kies, en leg het vast.",
              ],
              example: {
                title: "EUR 20.000: twee verdedigbare routes, één valkuil",
                body:
                  "Route A: je belegt de EUR 20.000 vandaag in één keer — statistisch de route met de beste papieren, maar je resultaat hangt vol aan wat de markt hierna doet. Route B: je legt twaalf maanden lang ruim EUR 1.650 per maand automatisch in — gemiddeld iets minder verwachting, maar een topkoop op het slechtste moment is uitgesloten en je slaapt er misschien beter door. De valkuil: 'ik wacht tot de beurs gedaald is.' Daar bestaat geen schema voor, dus die keuze wordt in de praktijk uitstel zonder einde. A en B zijn allebei prima; alleen niet-kiezen verliest altijd.",
              },
            },
            {
              heading: "Een broker kiezen: waar je op let (zonder namen)",
              paragraphs: [
                "Je hebt een platform nodig om je fonds te kopen: een broker of een bank met beleggingsdienst. Wij noemen bewust geen namen — aanbieders veranderen hun tarieven en voorwaarden voortdurend, en wat vandaag de beste deal is, is dat volgend jaar misschien niet. Wat wél houdbaar is: de vier vragen waarmee je elk platform zelf kunt beoordelen.",
                "Eén: wat zijn de totale kosten voor jóúw patroon — maandelijkse kleine aankopen van een breed fonds? Let op transactiekosten, servicekosten over je tegoed en eventuele kosten per fonds. Twee: waar is de partij gevestigd en onder welk toezicht valt ze? Voor Nederlandse beleggers betekent een vergunning in de EU dat toezicht en beleggerscompensatieregelingen volgens Europese regels geregeld zijn — de details staan verplicht op de site van de aanbieder. Drie: staan jouw beleggingen juridisch gescheiden van het vermogen van het bedrijf zelf, zodat ze bij een faillissement van de broker buiten de boedel vallen? In Nederland en de EU is die vermogensscheiding voor beleggingen de norm; hoe het precies geregeld is, hoort de aanbieder uit te leggen.",
                "En vier, onderschat maar belangrijk: gemak. Kun je automatisch periodiek inleggen? Is het beschikbare fondsenaanbod breed genoeg voor de wereldportefeuille uit les 6? Werkt het zonder ergernis? Een platform dat automatiseren makkelijk maakt, verdient zichzelf terug in volgehouden gedrag — en volhouden is, zoals deze hele module betoogt, waar het rendement uiteindelijk vandaan komt.",
              ],
              bullets: [
                "Totale kosten voor jouw gebruikspatroon: transactie-, service- en fondskosten bij elkaar opgeteld",
                "Vestiging en toezicht: EU-vergunning, en check hoe de beleggerscompensatie is geregeld",
                "Vermogensscheiding: jouw beleggingen horen buiten de boedel van de broker te vallen",
                "Gemak: automatische periodieke inleg en een passend fondsenaanbod houden je plan draaiende",
              ],
            },
            {
              heading: "Als de beurs daalt: het draaiboek is 'niets doen'",
              paragraphs: [
                "Er komt een moment — niet óf, maar wanneer — dat je portefeuille 20, 30, misschien 40% lager staat en elk journaal opent met beurspaniek. Wat doet de indexbelegger dan? Als het goed is: precies wat het plan zegt. De automatische inleg loopt door (en koopt goedkoper in), de rest blijft staan. Verkopen in een daling is de enige manier om van een papieren verlies een definitief verlies te maken.",
                "Dat is makkelijk opgeschreven en moeilijk gedaan, en we gaan niet doen alsof een alinea tekst je daarop voorbereidt. De psychologie van dalingen — waarom je brein op precies het verkeerde moment 'doe iets!' schreeuwt en wat daartegen helpt — is een eigen vak. Daarom hebben we er een aparte cursus voor: Beleggingspsychologie. Als indexbelegger is dát, veel meer dan extra kennis over fondsen, de logische verdieping op deze cursus.",
                "Voor nu geven we je het draagbare draaiboek mee: leg vandaag, bij heldere hemel, schriftelijk vast wat je bij een daling doet ('inleg loopt door, ik verkoop niets, ik kijk hooguit maandelijks'). Een afspraak met jezelf van drie regels, gemaakt op een rustige dag, is op een paniekdag meer waard dan alle beursanalyses bij elkaar.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Simple Path to Wealth",
              author: "JL Collins",
              year: 2016,
              note: "Begonnen als brieven aan zijn dochter: automatiseren, simpel houden en doorbeleggen door dalingen heen. Toegankelijker dan Bogle, wel op de Amerikaanse situatie geschreven — de Nederlandse details haal je uit module 2.",
            },
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "Waarom redelijk volhoudbaar gedrag wint van optimaal onhoudbaar gedrag — precies het thema van deze les, in korte hoofdstukken die je los kunt lezen.",
            },
          ],
          keyTakeaways: [
            "Automatiseer je inleg: vast bedrag, vaste dag, elke maand — elke handmatige beslissing is een kans om niet te beleggen",
            "Ineens instappen won historisch in grofweg twee van de drie periodes, maar gespreid instappen is een verdedigbare gedragskeuze; alleen eindeloos wachten op 'het juiste moment' verliest altijd",
            "Kies een broker op vier punten: totale kosten voor jouw patroon, vestiging en toezicht, vermogensscheiding en gemak van automatiseren",
            "Bij een daling is het draaiboek: inleg loopt door, niets verkopen — leg dat nú vast, niet tijdens de paniek",
            "De logische verdieping op deze cursus is niet méér fondsenkennis maar gedragskennis: zie de cursus Beleggingspsychologie",
          ],
          quiz: [
            {
              question: "Waarom is autómatisch periodiek inleggen zoveel effectiever dan elke maand zelf besluiten?",
              options: [
                "Omdat automatische aankopen altijd tegen een gunstiger koers worden uitgevoerd",
                "Omdat elke handmatige beslissing een moment is waarop twijfel, uitstel of marktnieuws je kan tegenhouden — automatisering haalt die momenten weg",
                "Omdat brokers wettelijk verplicht zijn korting te geven op automatische orders",
                "Omdat je dan gegarandeerd geen verlies meer kunt maken",
              ],
              correctIndex: 1,
              explanation:
                "Het voordeel is gedragsmatig, niet financieel-technisch: het plan draait door op dagen dat jij zou aarzelen. Er bestaat geen gunstiger koers of wettelijke korting voor automatische orders, en tegen verlies beschermt het niet — het beschermt tegen niet-beleggen en paniekbeslissingen.",
            },
            {
              question:
                "Femke heeft EUR 20.000 en twijfelt tussen ineens beleggen en spreiden over een jaar. Wat is het eerlijke antwoord uit deze les?",
              options: [
                "Altijd spreiden: ineens instappen is roekeloos gokwerk",
                "Altijd ineens: spreiden is statistisch bewezen onzin",
                "Wachten tot de beurs eerst flink gedaald is en dan pas instappen",
                "Statistisch won ineens beleggen historisch het vaakst, maar spreiden met een vast schema is een verdedigbare gedragskeuze — alleen wachten op het perfecte moment is altijd de verkeerde optie",
              ],
              correctIndex: 3,
              explanation:
                "Historisch won meteen beleggen in grofweg twee van de drie periodes, omdat markten vaker stegen dan daalden. Maar jouw leven is geen gemiddelde: wie door gespreid instappen rustig blijft zitten, kiest óók goed. De enige verliezende strategie is uitstel vermomd als geduld — 'wachten op de dip' heeft geen einddatum.",
            },
            {
              question: "Wat betekent vermogensscheiding bij een broker, en waarom check je dat?",
              options: [
                "Dat je beleggingen juridisch gescheiden zijn van het vermogen van de broker zelf, zodat ze bij diens faillissement buiten de boedel vallen",
                "Dat je spaargeld en beleggingen niet op dezelfde app zichtbaar mogen zijn",
                "Dat de broker jouw rendement gescheiden houdt van dat van andere klanten",
                "Dat je pas kunt verkopen na een verplichte bedenktermijn",
              ],
              correctIndex: 0,
              explanation:
                "Jouw fondsen horen niet van de broker te zijn maar van jou, ondergebracht in een aparte juridische structuur. Gaat de broker failliet, dan vallen jouw beleggingen dan buiten het faillissement. In Nederland en de EU is dit voor beleggingen de norm — maar hóé het geregeld is, hoort elke aanbieder te kunnen uitleggen, dus vraag het na.",
            },
            {
              question:
                "De beurs is in drie maanden 30% gedaald en de krantenkoppen zijn zwart. Wat zegt het draaiboek van deze les?",
              options: [
                "Verkopen en terugkopen zodra de bodem officieel bereikt is",
                "De automatische inleg pauzeren tot het nieuws weer positief is",
                "Inleg loopt gewoon door (en koopt goedkoper in), je verkoopt niets, en je valt terug op de afspraak die je op een rustige dag met jezelf hebt vastgelegd",
                "Alles verkopen: 30% verlies bewijst dat indexbeleggen niet werkt",
              ],
              correctIndex: 2,
              explanation:
                "Een bodem is alleen achteraf zichtbaar, dus 'terugkopen op de bodem' is geen plan maar een wens. Pauzeren betekent duurder terugkomen als het herstel je moed teruggeeft. Het draaiboek is saai en dat is de bedoeling: doorbeleggen, niets verkopen — en waarom je brein daar zo tegen protesteert, leert de cursus Beleggingspsychologie.",
            },
          ],
          xp: 50,
        },
        {
          slug: "wanneer-indexbeleggen-niet-past",
          title: "Wanneer indexbeleggen níét past",
          durationMin: 9,
          intro:
            "Een eerlijke cursus eindigt niet met een juichverhaal maar met de grenzen van zijn eigen onderwerp. In deze slotles zetten we op een rij wat indexbeleggen níét doet, voor wie of wat het niet geschikt is, en wanneer actieve aanpakken wél een zinnige plek hebben. En we eindigen met het eerlijke slotwoord dat je van een cursusverkoper misschien niet verwacht.",
          sections: [
            {
              heading: "Wat indexbeleggen níét doet",
              paragraphs: [
                "Eerst de grootste misvatting: indexbeleggen is geen bescherming. Daalt de wereldbeurs 35%, dan daalt jouw wereldindexfonds ook ruwweg 35% — er is geen beheerder die remt, geen vangnet, geen airbag. Spreiding beschermt je tegen het omvallen van één bedrijf, niet tegen een daling van de hele markt. Wie 'veilig' zoekt, zoekt iets anders dan een aandelenindexfonds.",
                "Tweede beperking: zelfs het volgen zelf is niet perfect. Het rendement van jouw fonds wijkt altijd iets af van de index — door kosten, door de timing van dividenden, door de praktische uitvoering. Dat verschil heet tracking error (volgfout). Bij goede, brede fondsen is het klein, maar het bestaat, en het is een nuttig controlegetal in fondsdocumenten: een fonds dat zijn index structureel slecht volgt, doet zijn enige taak niet goed.",
                "Derde beperking: de index is confectie, geen maatwerk. Je koopt de hele lijst, inclusief bedrijven waar je misschien moreel of inhoudelijk niets mee hebt. Er bestaan indexvarianten die op allerlei criteria filteren, maar hoe meer je filtert, hoe verder je van 'de hele hooiberg' afraakt en hoe meer keuzes (en vaak kosten) er terugsluipen. De pure indexbelegger accepteert de confectie; wie maatwerk wil, betaalt daarvoor op de een of andere manier.",
              ],
              bullets: [
                "Geen bescherming tegen marktdalingen: je daalt vol mee, spreiding helpt alleen tegen het omvallen van individuele bedrijven",
                "Tracking error: je fonds volgt de index nooit exact — klein bij goede fondsen, maar controleer het",
                "Geen maatwerk: je koopt de hele lijst, ook de bedrijven die je zelf nooit gekozen zou hebben",
              ],
            },
            {
              heading: "Geld dat je binnenkort nodig hebt, hoort hier niet",
              paragraphs: [
                "De belangrijkste niet-passend-situatie heeft niets met fondskeuze te maken maar met tijd. Aandelen — óók breed gespreide — kunnen jaren achtereen lager staan dan je aankoopprijs. Geld dat je over twee of drie jaar nodig hebt voor een huis, een studie of een verbouwing, kan die jaren niet uitzitten. Voor zulk geld is de beurs geen groeimotor maar een gokje met een deadline.",
                "De klassieke vuistregel uit de beleggingsliteratuur: hoe korter je horizon, hoe minder er in aandelen thuishoort. Geld voor de komende paar jaar staat op een spaarrekening — saai, maar op tijd beschikbaar. En vóór alles komt een buffer voor onverwachte kosten, zodat je nooit gedwongen bent je beleggingen op het slechtste moment te verkopen. Zo'n gedwongen verkoop in een dip is precies de manier waarop 'langetermijnbeleggen' in de praktijk stukloopt.",
                "Dit is misschien de minst spannende sectie van de hele cursus, en tegelijk degene die de meeste ellende voorkomt. De vraag is niet alleen wáárin je belegt, maar met wélk geld. Indexbeleggen werkt voor geld dat de tijd heeft; al het andere geld verdient een saaiere plek.",
              ],
            },
            {
              heading: "Wanneer actief wél een plek heeft",
              paragraphs: [
                "Na zeven lessen indexlof is dit een goed moment voor de andere kant. Er zijn eerlijke redenen om (deels) actief te beleggen. Plezier is er een: sommige mensen vinden bedrijven analyseren oprecht leuk, zoals anderen puzzelen of vogels spotten. Leren is er nog een: wie zelf een paar aandelen volgt, leest jaarverslagen en voelt marktschommelingen aan den lijve — dat leert meer dan tien theorieboeken. En soms heb je een sterke, doordachte overtuiging over een sector of bedrijf en wil je daarnaar kunnen handelen.",
                "De klassieke oplossing verzoent beide werelden: de kern-satellietaanpak. De kern van je vermogen — veruit het grootste deel — zit saai in de wereldportefeuille uit deze cursus. Daarnaast houden veel beleggers een klein, vooraf begrensd deel als 'speelgeld' voor actieve ideeën: klein genoeg dat het fout mag gaan zonder je doelen te raken, echt genoeg om van te leren. De grens vooraf vastleggen is het hele eieren eten — niet pas bepalen als een idee 'zeker weten' voelt.",
                "In dat licht kun je ook onze eigen andere cursussen eerlijk plaatsen. Waardebeleggen, opties, technische analyse: het zijn vakken voor dat actieve deel, voor wie het vak wil leren — niet omdat het moet, maar omdat het kan en soms gewoon leuk is. Volg je ze, doe het dan met de speelgeld-bril op: als verdieping naast je kern, niet als vervanging ervan. Dat is geen kleinering van die cursussen; het is de juiste plek ervoor.",
              ],
            },
            {
              heading: "Het eerlijke slotwoord",
              paragraphs: [
                "Acht lessen geleden beloofden we een cursus die deels tegen onze eigen winkel in zou pleiten. Bij deze de conclusie, zonder omwegen: voor de meeste doelen van de meeste mensen is de route uit deze cursus genoeg. Een breed wereldfonds, lage kosten, oog voor de Nederlandse details, automatisch inleggen, eraf blijven. Geen koersen kijken, geen tips volgen, geen tweede vak leren. De saaie route — die daarom meestal wint.",
                "Dat een cursusverkoper dat opschrijft, mag je gerust opmerkelijk vinden. Onze reden is simpel: dit merk bestaat bij de gratie van eerlijkheid, en eerlijk onderwijs vertelt je ook wanneer je klaar bent. Je bent nu klaar — in de goede zin. Wat overblijft is uitvoeren en volhouden, en als je ooit één ding wilt herlezen als de beurs in brand lijkt te staan, laat het het draaiboek uit les 7 zijn.",
                "En beleggen blijft beleggen, dus het echte slotwoord is een waarschuwing zonder franje: ook met de beste spreiding en de laagste kosten kun je (tijdelijk of blijvend) minder terugkrijgen dan je inlegt. Historische gemiddelden zijn geschiedenis, geen belofte. Wie dat aanvaardt en tóch rustig maandelijks inlegt, heeft deze cursus niet alleen gelezen maar begrepen. Veel succes — en veel saaie jaren toegewenst.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "The Little Book of Common Sense Investing",
              author: "John C. Bogle",
              year: 2007,
              note: "Ook Bogle besluit met bescheidenheid: de index geeft je het marktrendement, niets meer en niets minder. Herlees het slothoofdstuk als afronding van deze cursus.",
            },
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              year: 2020,
              note: "Housels onderscheid tussen 'rationeel' en 'redelijk' is het beste kader voor de speelgeld-vraag: een plan dat je volhoudt, verslaat een perfect plan dat je opgeeft.",
            },
          ],
          keyTakeaways: [
            "Indexbeleggen beschermt niet tegen marktdalingen: je daalt vol mee — spreiding helpt alleen tegen het lot van individuele bedrijven",
            "Tracking error en confectie horen erbij: je fonds volgt de index nooit perfect en je koopt de hele lijst, ook wat je zelf niet gekozen had",
            "Geld dat je binnen enkele jaren nodig hebt en je buffer horen niet in aandelen — de vraag is niet alleen waarin, maar met welk geld",
            "Actief beleggen heeft een eerlijke plek voor plezier, leren en overtuigingen: klein, vooraf begrensd 'speelgeld' naast een saaie kern — en dáár passen onze andere cursussen",
            "Het eerlijke slot: voor de meeste doelen is deze saaie route genoeg; historische gemiddelden zijn geschiedenis, geen belofte",
          ],
          quiz: [
            {
              question: "De wereldbeurs daalt 35%. Wat mag je van je wereldindexfonds verwachten?",
              options: [
                "Het daalt hooguit half zo hard, want spreiding dempt marktdalingen",
                "Het daalt ook ruwweg 35%: spreiding beschermt tegen het omvallen van één bedrijf, niet tegen een daling van de hele markt",
                "Het schakelt automatisch over naar obligaties om de schade te beperken",
                "Het daalt niet, want indexfondsen volgen alleen stijgingen",
              ],
              correctIndex: 1,
              explanation:
                "Dit is de kernbeperking om te kennen vóórdat je begint: een indexfonds ís de markt, dus het daalt vol mee. Spreiding neutraliseert bedrijfsspecifieke rampen (één faillissement voel je nauwelijks), maar tegen marktbreed slecht weer bestaat binnen een aandelenfonds geen vangnet.",
            },
            {
              question: "Wat is tracking error?",
              options: [
                "Een boete die het fonds betaalt als het de index verslaat",
                "Een fout in de berekening van het indexcijfer door het rekenbureau",
                "Het verschil tussen het rendement van je fonds en dat van de gevolgde index — klein bij goede fondsen, maar nooit helemaal nul",
                "Het bedrag dat je verliest door de spread bij aan- en verkoop",
              ],
              correctIndex: 2,
              explanation:
                "Volgen is de enige taak van een indexfonds, en tracking error meet hoe goed dat lukt: kosten, dividendtiming en praktische uitvoering zorgen altijd voor een kleine afwijking. Het is een nuttig controlegetal bij fondsvergelijking — structureel slecht volgen is voor een indexfonds een diskwalificatie.",
            },
            {
              question:
                "Tim spaart voor een huis dat hij over twee jaar wil kopen en overweegt het geld zolang in een wereldindexfonds te zetten. Wat zegt deze les?",
              options: [
                "Prima plan: twee jaar is genoeg om van het historische gemiddelde te profiteren",
                "Goed idee, mits hij een fonds zonder dividendlek kiest",
                "Alleen doen als hij dagelijks de koersen in de gaten houdt",
                "Niet doen: aandelen kunnen jaren lager staan, en geld met een deadline van twee jaar kan dat niet uitzitten — daarvoor is de spaarrekening de juiste plek",
              ],
              correctIndex: 3,
              explanation:
                "Historische gemiddelden gelden over lange periodes; twee jaar is op de beurs een muntworp. Moet Tim in een dip verkopen omdat de aankoopdatum nadert, dan wordt het papieren verlies definitief. De vraag is niet alleen waarin je belegt, maar met welk geld — kortetermijngeld hoort saai en beschikbaar te staan.",
            },
            {
              question:
                "Hoe past actief beleggen (zelf aandelen kiezen, opties, technische analyse) volgens deze cursus naast indexbeleggen?",
              options: [
                "Als klein, vooraf begrensd 'speelgeld'-deel naast een saaie kern: voor plezier, leren en overtuigingen — met de grens vastgelegd vóórdat een idee 'zeker weten' voelt",
                "Als vervanging van de kern zodra je er een cursus over hebt gevolgd",
                "Helemaal niet: deze cursus bewijst dat actief beleggen altijd zinloos is",
                "Alleen voor professionals met een vergunning",
              ],
              correctIndex: 0,
              explanation:
                "De kern-satellietaanpak verzoent beide werelden: het grootste deel saai in de wereldportefeuille, een klein vooraf begrensd deel voor actieve ideeën. Actief is niet zinloos — het is een vak en soms een plezier — maar het is verdieping naast je kern, niet de vervanging ervan. Precies zo horen ook onze eigen andere cursussen gebruikt te worden.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
