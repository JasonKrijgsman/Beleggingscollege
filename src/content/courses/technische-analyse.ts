import type { Course } from "../types";

const course: Course = {
  slug: "technische-analyse",
  title: "Introductie Technische Analyse",
  subtitle: "Grafieken beheersen & markten voorspellen",
  description:
    "Leer prijsgrafieken, candlestickpatronen en indicatoren lezen zoals een professional, zonder de mythes. Deze cursus behandelt ook eerlijk de wetenschappelijke kritiek op technische analyse en laat zien hoe je TA verstandig inzet: als gereedschap voor timing en risicobeheer, niet als glazen bol.",
  level: "Gevorderd",
  accent: "blauw",
  icon: "chart",
  price: "€14,99",
  order: 3,
  heroQuote: {
    text: "Er is niets nieuws op Wall Street. Dat kan ook niet, want speculatie is zo oud als de bergen. Wat vandaag op de beurs gebeurt, is eerder gebeurd en zal opnieuw gebeuren.",
    source: "Edwin Lefèvre, Reminiscences of a Stock Operator (1923)",
  },
  learnPoints: [
    "De drie aannames achter technische analyse, en de wetenschappelijke kritiek erop",
    "Candlesticks lezen: anatomie, doji, hammer en engulfing-patronen",
    "Trends herkennen en steun- en weerstandszones intekenen",
    "Voortschrijdende gemiddelden, RSI en volume gebruiken als trendfilter",
    "Positiegrootte, stop-loss en risk/reward berekenen als een professional",
    "Een handelsplan en journaal opzetten, want discipline verslaat voorspellen",
  ],
  modules: [
    {
      slug: "grafieken-lezen",
      title: "Grafieken leren lezen",
      description:
        "Van je eerste candlestick tot het intekenen van trends en steunzones. Je leert wat technische analyse wel en niet kan, zodat je grafieken leest met open ogen in plaats van roze bril.",
      lessons: [
        {
          slug: "wat-is-technische-analyse",
          title: "Wat is technische analyse?",
          durationMin: 8,
          intro:
            "Technische analyse klinkt als toekomstvoorspellen met lijntjes, maar het is eigenlijk iets veel nuchters: het bestuderen van vraag en aanbod via de koersgrafiek. In deze les leer je waar TA op gebaseerd is, en waarom serieuze wetenschappers er kritisch op zijn.",
          sections: [
            {
              heading: "Twee brillen op dezelfde markt",
              paragraphs: [
                "Stel: je wilt weten of het aandeel ASML interessant is. Een fundamentele analist duikt in het bedrijf zelf: omzet, winst, schulden, de vraag naar chipmachines. Die vraagt zich af wat het bedrijf waard is en of de koers daaronder of daarboven ligt.",
                "Een technische analist opent alleen de grafiek. Die kijkt niet naar wat ASML maakt, maar naar hoe de koers zich gedraagt: stijgt hij, daalt hij, waar kopen mensen massaal bij, waar verkopen ze? De grafiek is voor de technisch analist een röntgenfoto van vraag en aanbod.",
                "De twee benaderingen sluiten elkaar niet uit. Veel beleggers gebruiken fundamentele analyse om te bepalen wát interessant is, en technische analyse om te bepalen wannéér ze in- of uitstappen. Zo behandelen wij TA in deze cursus ook: als aanvulling, niet als vervanging.",
              ],
            },
            {
              heading: "De drie aannames van technische analyse",
              paragraphs: [
                "Technische analyse rust op drie pijlers, die John Murphy helder beschrijft in zijn standaardwerk. De eerste: de koers verdisconteert alles. Alle kennis, verwachtingen en emoties van alle beleggers samen komen uiteindelijk samen in dat ene getal op je scherm. Je hoeft dus niet elk nieuwsbericht te lezen, want de markt heeft dat al voor je gedaan, zegt de technisch analist.",
                "De tweede aanname: koersen bewegen in trends. Een aandeel dat stijgt, blijft vaker doorstijgen dan dat het abrupt omkeert. Vergelijk het met een supertanker: die verandert niet in één seconde van richting. Trendvolgers proberen op die tanker mee te varen zolang hij de goede kant op gaat.",
                "De derde: geschiedenis herhaalt zich. Niet omdat grafieken magisch zijn, maar omdat mensen dat zijn. Angst en hebzucht in 1929 zien er op een grafiek verrassend hetzelfde uit als angst en hebzucht in 2021. Patronen in grafieken zijn eigenlijk patronen in massapsychologie.",
              ],
              bullets: [
                "De koers verdisconteert alles: alle informatie zit al in de prijs",
                "Koersen bewegen in trends, en trends houden vaker aan dan ze omkeren",
                "Geschiedenis herhaalt zich, omdat menselijke emoties zich herhalen",
              ],
              example: {
                title: "Voorbeeld: goed nieuws, dalende koers",
                body: "Een AEX-bedrijf presenteert 12% winstgroei en toch daalt de koers die dag 4%. Hoe kan dat? Beleggers rekenden al op 15% groei en hadden de koers daarop vooruit laten lopen. Het nieuws was dus al in de prijs verwerkt; alleen de teleurstelling ten opzichte van de verwachting was nieuw. Dit is aanname één in actie: niet het nieuws zelf beweegt de koers, maar het verschil tussen nieuws en verwachting.",
              },
            },
            {
              heading: "De kritiek: waarom wetenschappers sceptisch zijn",
              paragraphs: [
                "Nu het eerlijke verhaal, want dat hoort bij Beleggingscollege. De efficiënte-markthypothese (EMH) stelt dat alle beschikbare informatie al in de koers zit. Klinkt bekend? Dat is precies aanname één van TA, maar dan met een venijnige conclusie eraan vast: als alles al in de prijs zit, valt er uit historische koersen geen structureel voordeel meer te halen. De volgende koersbeweging wordt dan bepaald door nieuwe informatie, en die is per definitie onvoorspelbaar.",
                "Burton Malkiel maakte dit beroemd in A Random Walk Down Wall Street. Hij liet studenten een nep-koersgrafiek maken door munten op te gooien: kop is een stapje omhoog, munt een stapje omlaag. Technisch analisten zagen in die pure toevalsgrafiek prachtige trends en patronen. Ons brein is nu eenmaal gebouwd om patronen te zien, ook waar ze niet zijn.",
                "Het wetenschappelijke bewijs voor TA is gemengd. Sommige studies vinden zwakke momentum-effecten (wat stijgt, stijgt vaak nog even door), andere vinden dat de meeste patronen na aftrek van transactiekosten niets opleveren. Wie je vertelt dat TA een bewezen geldmachine is, is niet eerlijk tegen je.",
              ],
            },
            {
              heading: "Hoe je TA wél zinvol gebruikt",
              paragraphs: [
                "Waarom dan toch een hele cursus? Omdat TA, met de juiste verwachtingen, drie dingen goed kan. Eén: het geeft je een taal en structuur om naar grafieken te kijken, in plaats van op gevoel te gokken. Twee: het helpt bij timing, bijvoorbeeld door niet blind te kopen midden in een vrije val. Drie, en dat is de belangrijkste: het dwingt je tot risicobeheer, met vooraf bepaalde uitstapniveaus en positiegroottes.",
                "Zie TA als een veiligheidsgordel, niet als navigatiesysteem. Een gordel voorspelt niet waar je heen rijdt, maar beperkt de schade als het misgaat. In module 2 zul je zien dat de meest waardevolle les uit deze hele cursus niets met voorspellen te maken heeft, maar alles met discipline.",
                "En zoals altijd: beleggen kent risico's. Geen enkele lijn op een grafiek verandert daar iets aan.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Technical Analysis of the Financial Markets",
              author: "John J. Murphy",
              year: 1999,
              note: "Hét standaardwerk over technische analyse. Hoofdstuk 1 behandelt de drie aannames die je in deze les leerde.",
            },
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton G. Malkiel",
              year: 1973,
              note: "De beroemdste kritiek op technische analyse. Verplichte tegenstem voor iedereen die met grafieken aan de slag wil.",
            },
          ],
          keyTakeaways: [
            "TA bestudeert koers- en volumegedrag; fundamentele analyse bestudeert het bedrijf erachter",
            "De drie aannames: prijs verdisconteert alles, koersen bewegen in trends, geschiedenis herhaalt zich",
            "De efficiënte-markthypothese stelt dat historische koersen geen structureel voordeel opleveren, en het bewijs voor TA is gemengd",
            "Gebruik TA als gereedschap voor timing en risicobeheer naast fundamentele analyse, niet als glazen bol",
          ],
          quiz: [
            {
              question:
                "Een AEX-bedrijf publiceert sterke kwartaalcijfers, maar de koers daalt direct na publicatie. Hoe verklaart een technisch analist dit het meest waarschijnlijk?",
              options: [
                "De markt maakt een fout die zich binnen enkele dagen vanzelf herstelt",
                "Het goede nieuws was al in de koers verwerkt; beleggers hadden op nóg betere cijfers gerekend",
                "Kwartaalcijfers hebben nooit invloed op de koers van een aandeel",
                "De handel in het aandeel was die dag stilgelegd",
              ],
              correctIndex: 1,
              explanation:
                "Volgens de aanname \"de koers verdisconteert alles\" lopen beleggers vooruit op verwachtingen. Niet het nieuws zelf beweegt de koers, maar het verschil tussen het nieuws en wat er al werd verwacht. Vielen de cijfers tegen ten opzichte van die verwachting, dan kan de koers dalen ondanks objectief goed nieuws.",
            },
            {
              question:
                "Wat is de kern van de kritiek die de efficiënte-markthypothese op technische analyse levert?",
              options: [
                "Grafieken zijn te ingewikkeld voor particuliere beleggers om te lezen",
                "Technische analyse werkt alleen op de Amerikaanse beurs, niet op de AEX",
                "Als alle informatie al in de koers zit, valt uit historische koersen geen structureel voordeel te halen",
                "Technische analyse houdt te veel rekening met de winstcijfers van bedrijven",
              ],
              correctIndex: 2,
              explanation:
                "De EMH deelt de aanname dat alle informatie in de prijs zit, maar trekt daaruit de conclusie dat toekomstige bewegingen afhangen van nieuwe, onvoorspelbare informatie. Patronen uit het verleden geven dan geen structureel voorspelbaar voordeel, zeker niet na transactiekosten.",
            },
            {
              question:
                "Malkiel liet studenten een grafiek maken op basis van muntworpen, en technisch analisten zagen er trends en patronen in. Wat illustreert dit experiment?",
              options: [
                "Dat muntworpen een betrouwbare manier zijn om koersen te voorspellen",
                "Dat mensen patronen kunnen zien in pure toeval, dus dat niet elk grafiekpatroon betekenis heeft",
                "Dat technische analyse alleen werkt op grafieken van echte aandelen",
                "Dat trends in koersen altijd exact 50% kans hebben om door te zetten",
              ],
              correctIndex: 1,
              explanation:
                "De toevalsgrafiek bevatte per definitie geen enkele voorspelbare structuur, maar analisten zagen er tóch patronen in. Ons brein is gebouwd om patronen te herkennen, ook waar ze niet bestaan. Daarom moet je elk grafiekpatroon met gezonde scepsis bekijken.",
            },
            {
              question:
                "Hoe gebruik je technische analyse volgens deze les het meest verstandig?",
              options: [
                "Als vervanging van fundamentele analyse, want de koers zegt alles wat je moet weten",
                "Als exacte voorspeller van waar de koers volgende week staat",
                "Als gereedschap voor timing en risicobeheer, naast fundamentele analyse",
                "Alleen voor cryptovaluta, omdat daar geen fundamentele cijfers bestaan",
              ],
              correctIndex: 2,
              explanation:
                "TA voorspelt de toekomst niet, maar geeft structuur aan je timing en dwingt je tot risicobeheer met vooraf bepaalde uitstapniveaus. Gecombineerd met fundamentele analyse (wát koop je) beantwoordt TA de vraag wannéér en met hoeveel risico.",
            },
          ],
          xp: 50,
        },
        {
          slug: "grafiektypen-candlesticks",
          title: "Grafiektypen en candlesticks",
          durationMin: 8,
          intro:
            "Open je een grafiek bij je broker, dan kun je kiezen uit lijnen, staafjes en kaarsjes. In deze les leer je waarom bijna alle actieve beleggers voor candlesticks kiezen, en hoe je de bekendste patronen herkent zonder erin te trappen.",
          sections: [
            {
              heading: "Drie manieren om dezelfde prijs te tekenen",
              paragraphs: [
                "De lijngrafiek is de eenvoudigste: elke dag één punt (meestal de slotkoers), verbonden met een lijn. Perfect voor een snel overzicht van de grote lijn, maar je gooit informatie weg. Je ziet niet waar de koers die dag opende, hoe hoog hij piekte of hoe diep hij wegzakte.",
                "De bargrafiek (staafgrafiek) lost dat op: elk staafje toont vier prijzen per periode: open, hoogste, laagste en slot (in het Engels OHLC). Functioneel, maar visueel nogal karig, alsof je een boek leest zonder alinea's.",
                "De candlestickgrafiek toont exact dezelfde vier prijzen, maar dan in een vorm die je hersenen in één oogopslag verwerken. Japanse rijsthandelaren gebruikten deze techniek al in de 18e eeuw. Groen (of wit) betekent: slot boven open, de kopers wonnen. Rood (of zwart): slot onder open, de verkopers wonnen.",
              ],
            },
            {
              heading: "De anatomie van een candlestick",
              paragraphs: [
                "Elke candle bestaat uit twee delen. Het dikke deel heet het lichaam (body): de afstand tussen de openings- en slotkoers. De dunne streepjes boven en onder heten schaduwen, lonten of wicks: ze tonen de hoogste en laagste koers van die periode.",
                "Het lichaam vertelt je wie er won; de lonten vertellen je hoe de strijd verliep. Een lange lont onderaan betekent: verkopers drukten de koers flink omlaag, maar kopers trokken hem weer op. Een lange lont bovenaan: kopers probeerden het, maar verkopers sloegen terug.",
                "Eén candle kan elke periode voorstellen die je kiest: een dag, een uur, een week. Dezelfde leesregels gelden op elke tijdschaal, al zijn patronen op dag- en weekgrafieken doorgaans betekenisvoller dan op minutengrafieken, waar veel ruis zit.",
              ],
              example: {
                title: "Rekenvoorbeeld: een candle ontleden",
                body: "Een aandeel opent op € 20,00, piekt op € 21,80, zakt tot € 19,60 en sluit op € 21,50. Het lichaam loopt van € 20,00 tot € 21,50 en is groen (slot boven open): € 1,50 aan koperskracht. De bovenlont is € 0,30 (21,80 min 21,50), de onderlont € 0,40 (20,00 min 19,60). Lezing: verkopers probeerden de koers vroeg omlaag te duwen, maar kopers namen het stevig over en hielden de winst grotendeels vast tot het slot.",
              },
            },
            {
              heading: "Bekende patronen: doji, hammer en engulfing",
              paragraphs: [
                "Een doji is een candle waarbij open en slot vrijwel gelijk liggen: een piepklein lichaam met vaak lange lonten. Betekenis: besluiteloosheid. Kopers en verkopers hielden elkaar precies in evenwicht. Na een lange stijging kan een doji een eerste teken zijn dat de kopers moe worden.",
                "Een hammer heeft een klein lichaam bovenin en een lange lont onderaan (minstens twee keer zo lang als het lichaam). Hij ontstaat als verkopers de koers ver omlaag drukken maar kopers vrijwel alles terugveroveren. Verschijnt een hammer na een daling, op een steunzone, dan lezen technisch analisten dat als mogelijk begin van herstel.",
                "Een bullish engulfing bestaat uit twee candles: een rode, gevolgd door een grotere groene waarvan het lichaam het rode lichaam volledig omsluit. De kopers hebben de verkoopdruk van de vorige periode compleet weggevaagd. Het spiegelbeeld, de bearish engulfing, werkt andersom: een grote rode candle omsluit een groene na een stijging.",
              ],
              bullets: [
                "Doji: open en slot vrijwel gelijk, besluiteloosheid in de markt",
                "Hammer: lange onderlont na een daling, kopers vochten terug",
                "Bullish engulfing: groene candle omsluit de vorige rode volledig",
                "Context is alles: hetzelfde patroon betekent weinig zonder trend of steunzone eromheen",
              ],
            },
            {
              heading: "Patronen zijn kansen, geen garanties",
              paragraphs: [
                "Tijd voor de eerlijke kanttekening. Onderzoek naar candlestickpatronen laat zien dat de meeste patronen op zichzelf nauwelijks voorspellende waarde hebben. Een hammer wordt gevolgd door een stijging én door een verdere daling, en de verhouding ligt vaak dichter bij fifty-fifty dan handelsboeken suggereren.",
                "Wat professionals daarom doen: ze gebruiken patronen nooit geïsoleerd, maar als bevestiging binnen een groter verhaal. Een hammer midden in het niets betekent weinig; een hammer precies op een steunzone die al drie keer hield, binnen een opwaartse trend, met oplopend volume, dát is een interessantere situatie. Nog steeds geen garantie, wel een betere kansverhouding.",
                "Denk in scenario's, niet in zekerheden. De juiste vraag is niet \"wat gaat de koers doen?\" maar \"wat doe ik als het patroon klopt, en wat doe ik als het faalt?\". Dat tweede deel, je plan B, behandelen we uitgebreid in les 6.",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Technical Analysis of the Financial Markets",
              author: "John J. Murphy",
              year: 1999,
              note: "Bevat een compleet hoofdstuk over candlesticks, inclusief de Japanse oorsprong en tientallen patronen met illustraties.",
            },
          ],
          keyTakeaways: [
            "Candlesticks tonen open, hoogste, laagste en slotkoers in één oogopslag; een lijngrafiek toont alleen de slotkoers",
            "Het lichaam toont wie er won (kopers of verkopers), de lonten tonen hoe de strijd verliep",
            "Doji = besluiteloosheid, hammer = kopers vochten terug na een daling, engulfing = de ene partij overweldigt de andere",
            "Patronen hebben alleen betekenis in context (trend, steun/weerstand, volume) en zijn nooit een garantie",
          ],
          quiz: [
            {
              question:
                "Een dagcandle heeft een open van € 20,00, een slot van € 21,50, een hoogste punt van € 21,80 en een laagste punt van € 19,60. Welke conclusie klopt?",
              options: [
                "De candle is rood, want de koers zakte tijdens de dag tot onder de opening",
                "De candle is groen met een lichaam van € 1,50 en een onderlont van € 0,40",
                "De candle is een doji, want de koers bewoog beide kanten op",
                "Het lichaam loopt van € 19,60 tot € 21,80",
              ],
              correctIndex: 1,
              explanation:
                "Het slot (€ 21,50) ligt boven de open (€ 20,00), dus de candle is groen met een lichaam van € 1,50. De onderlont is € 20,00 min € 19,60 = € 0,40. Het lichaam loopt tussen open en slot; de uitersten van de dag vormen de lonten. Een doji vereist dat open en slot vrijwel gelijk zijn, en dat is hier duidelijk niet zo.",
            },
            {
              question: "Wat vertelt een doji je over de markt in die periode?",
              options: [
                "Kopers en verkopers hielden elkaar vrijwel in evenwicht: besluiteloosheid",
                "De kopers hebben overtuigend gewonnen en de trend versnelt",
                "Er is die periode nauwelijks gehandeld in het aandeel",
                "De koers gaat de volgende periode gegarandeerd dalen",
              ],
              correctIndex: 0,
              explanation:
                "Bij een doji liggen open en slot vrijwel gelijk: geen van beide partijen kreeg de overhand. Het zegt niets over het handelsvolume (er kan juist heel druk gehandeld zijn) en het garandeert geen richting. Na een lange stijging kan het wél een eerste signaal van aarzeling zijn.",
            },
            {
              question:
                "In welke situatie heeft een hammer-candle volgens deze les de meeste betekenis?",
              options: [
                "Midden in een zijwaartse markt zonder duidelijke niveaus",
                "Op het hoogste punt ooit van een aandeel, na een lange stijging",
                "Na een daling, precies op een steunzone die eerder standhield, liefst met volume als bevestiging",
                "Op een minutengrafiek, want daar zijn patronen het betrouwbaarst",
              ],
              correctIndex: 2,
              explanation:
                "Een patroon krijgt pas betekenis door context. Een hammer na een daling op een bewezen steunzone vertelt een logisch verhaal: verkopers duwden de koers in de steun, kopers veroverden het terrein terug. Op minutengrafieken is juist méér ruis, en midden in het niets zegt een hammer weinig.",
            },
            {
              question:
                "Gisteren sloot een aandeel met een rode candle (open € 30,00, slot € 29,00). Vandaag opent het op € 28,80 en sluit het op € 30,40. Welk patroon is dit, en wat is de nuchtere interpretatie?",
              options: [
                "Een doji: de markt is besluiteloos en je kunt beter niets doen",
                "Een bullish engulfing: kopers overweldigden de verkoopdruk, een mogelijk herstelsignaal dat om bevestiging vraagt",
                "Een hammer: de lange onderlont toont dat verkopers terugsloegen",
                "Een death cross: een betrouwbaar verkoopsignaal volgens de statistiek",
              ],
              correctIndex: 1,
              explanation:
                "Het groene lichaam van vandaag (€ 28,80 tot € 30,40) omsluit het rode lichaam van gisteren (€ 29,00 tot € 30,00) volledig: een bullish engulfing. De nuchtere lezing: een mogelijk signaal, geen garantie. Een death cross is trouwens een kruising van voortschrijdende gemiddelden, geen candlepatroon.",
            },
          ],
          xp: 50,
        },
        {
          slug: "trends-steun-weerstand",
          title: "Trends, steun en weerstand",
          durationMin: 9,
          intro:
            "\"The trend is your friend\" is misschien wel de bekendste beurswijsheid die er is. In deze les leer je trends objectief herkennen, trendlijnen tekenen en de zones vinden waar kopers en verkopers telkens opnieuw slag leveren.",
          sections: [
            {
              heading: "Wat is een trend eigenlijk?",
              paragraphs: [
                "Iedereen ziet dat een koers \"omhoog gaat\", maar technische analyse maakt dat meetbaar. Een opwaartse trend bestaat uit hogere toppen én hogere bodems: elke piek ligt boven de vorige piek, en elke terugval stopt boven het vorige dieptepunt. Een neerwaartse trend is het spiegelbeeld: lagere toppen en lagere bodems.",
                "Stel dat een aandeel deze route aflegt: € 10 → € 12 (top) → € 11 (bodem) → € 13 (hogere top) → € 12,50 (hogere bodem) → € 14. Ondanks twee terugvallen is dit een schoolvoorbeeld van een opwaartse trend: kopers zijn telkens bereid om op een hoger niveau in te stappen.",
                "Beweegt een koers zonder duidelijk hogere of lagere toppen heen en weer, dan spreek je van een zijwaartse markt of trading range. Belangrijk om te herkennen, want de meeste trendtechnieken (en indicatoren, zoals je in module 2 ziet) werken juist dáár slecht.",
              ],
            },
            {
              heading: "Trendlijnen tekenen",
              paragraphs: [
                "Een trendlijn maakt een trend zichtbaar met één rechte lijn. Bij een opwaartse trend teken je de lijn ónder de koers, langs de oplopende bodems. Bij een neerwaartse trend teken je hem bóven de koers, langs de dalende toppen. Je hebt minimaal twee raakpunten nodig om een lijn te kunnen tekenen; pas bij een derde raakpunt geldt de lijn als bevestigd.",
                "Hoe vaker een trendlijn is geraakt zonder te breken, hoe serieuzer beleggers hem nemen, en hoe betekenisvoller een uiteindelijke doorbraak is. Een lijn met vijf raakpunten over acht maanden zegt meer dan een lijntje langs twee toevallige bodems van vorige week.",
                "Een eerlijke waarschuwing: trendlijnen tekenen is deels subjectief. Twee analisten tekenen op dezelfde grafiek vaak nét andere lijnen (op basis van lonten of lichamen, dag- of weekgrafiek). Behandel je trendlijn daarom als hulpmiddel om de trend te bewaken, niet als exacte natuurwet waar de koers zich aan móét houden.",
              ],
            },
            {
              heading: "Steun en weerstand: zones, geen lijnen",
              paragraphs: [
                "Steun is een prijsniveau waar dalingen herhaaldelijk stoppen omdat kopers daar in actie komen. Weerstand is het omgekeerde: een niveau waar stijgingen blijven steken omdat verkopers daar aanbod op de markt gooien. Zie het als vloeren en plafonds in de grafiek.",
                "Waarom bestaan die niveaus? Psychologie en geheugen. Wie een aandeel op € 50 kocht en het naar € 45 zag zakken, denkt vaak: \"bij € 50 sta ik quitte, dan verkoop ik.\" Duizenden beleggers met datzelfde ankerpunt creëren samen echte verkoopdruk rond € 50. Ronde getallen (€ 10, € 50, € 100, en de 800-puntengrens op de AEX) werken om dezelfde reden vaak als magneet.",
                "Teken steun en weerstand daarom als zones van bijvoorbeeld één à twee procent breed, niet als lijnen op de cent nauwkeurig. De markt is een menigte, geen laser. Een klassieke wetmatigheid om te onthouden: gebroken steun wordt vaak nieuwe weerstand, en andersom. Breekt een koers overtuigend door de vloer, dan verandert die oude vloer bij een herstelpoging regelmatig in een plafond.",
              ],
              example: {
                title: "Voorbeeld: van steun naar weerstand",
                body: "Een aandeel stuitert maandenlang omhoog vanaf de zone rond € 50: drie keer getest, drie keer gehouden. Dan breekt het op slechte cijfers naar € 45. Weken later herstelt de koers richting € 50, en precies daar stokt de stijging. Logisch: beleggers die rond € 50 kochten en in de min staan, grijpen de kans om quitte uit te stappen. Hun verkoopdruk maakt van de oude steun een nieuwe weerstand.",
              },
            },
            {
              heading: "Doorbraken en valse doorbraken",
              paragraphs: [
                "Een doorbraak (breakout) is het moment waarop de koers door een weerstand omhoog of door een steun omlaag breekt. Trendvolgers zien dat als signaal dat de krachtsverhouding kantelt: het plafond is eruit, de weg omhoog ligt open. Klinkt mooi, maar er is een addertje.",
                "Dat addertje heet de valse doorbraak: de koers piept boven de weerstand uit, verleidt beleggers om in te stappen, en valt vervolgens hard terug in de oude range. Precies de instappers van het eerste uur zitten dan direct op verlies. Valse doorbraken komen vaak voor; ook Livermore beschreef ze al ruim honderd jaar geleden.",
                "Wat kun je eraan doen? Bevestiging vragen vóór je handelt. Veelgebruikte filters: wacht op een slótkoers voorbij het niveau (niet slechts een piek binnen de dag), kijk of het volume duidelijk oploopt tijdens de doorbraak, of wacht op een throwback: een terugtest waarbij het gebroken niveau standhoudt. Je mist zo soms het begin van een beweging, maar je vermijdt een flink deel van de valse signalen. Die ruil, iets later instappen voor meer zekerheid, is typerend voor volwassen technische analyse.",
              ],
              bullets: [
                "Doorbraak: koers sluit voorbij een belangrijke steun- of weerstandszone",
                "Valse doorbraak: korte uitbraak die snel terugvalt in de oude range",
                "Filters: slotkoers afwachten, volume checken, terugtest laten bevestigen",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Technical Analysis of the Financial Markets",
              author: "John J. Murphy",
              year: 1999,
              note: "De hoofdstukken over trendanalyse en steun/weerstand vormen de basis van deze les.",
            },
            {
              title: "Reminiscences of a Stock Operator",
              author: "Edwin Lefèvre",
              year: 1923,
              note: "Livermore handelde al een eeuw geleden op doorbraken van belangrijke niveaus, en beschreef ook hoe vaak de markt hem met valse bewegingen op het verkeerde been zette.",
            },
          ],
          keyTakeaways: [
            "Opwaartse trend = hogere toppen én hogere bodems; neerwaartse trend is het spiegelbeeld",
            "Een trendlijn heeft minimaal twee raakpunten en is pas bevestigd bij het derde; tekenen blijft deels subjectief",
            "Steun en weerstand zijn zones die ontstaan door massapsychologie; gebroken steun wordt vaak nieuwe weerstand",
            "Valse doorbraken zijn frequent: gebruik slotkoersen, volume of een terugtest als bevestiging voor je handelt",
          ],
          quiz: [
            {
              question:
                "Welke koersreeks past bij een opwaartse trend volgens de definitie uit deze les?",
              options: [
                "€ 10 → € 12 → € 9 → € 13 → € 8: de koers noteert toppen boven € 10",
                "€ 10 → € 12 → € 11 → € 13 → € 12,50 → € 14: hogere toppen en hogere bodems",
                "€ 10 → € 10,20 → € 9,90 → € 10,10 → € 9,95: de koers beweegt rond € 10",
                "€ 14 → € 12 → € 13 → € 11 → € 12 → € 10: elke top en bodem ligt lager",
              ],
              correctIndex: 1,
              explanation:
                "Een opwaartse trend vereist hogere toppen (12 → 13 → 14) én hogere bodems (11 → 12,50). De eerste reeks heeft juist lágere bodems (9 → 8), de derde is een zijwaartse range en de vierde is een neerwaartse trend met lagere toppen en bodems.",
            },
            {
              question:
                "Een aandeel breekt door zijn steunzone rond € 50 en daalt naar € 45. Weken later veert het op richting € 50. Wat verwacht een technisch analist bij dat niveau, en waarom?",
              options: [
                "De koers schiet er waarschijnlijk moeiteloos doorheen, want steun blijft altijd steun",
                "Het niveau is betekenisloos geworden omdat het eenmaal gebroken is",
                "De oude steun werkt nu vaak als weerstand: beleggers die rond € 50 kochten, verkopen daar om quitte te spelen",
                "De koers zal exact op € 50,00 blijven stilstaan",
              ],
              correctIndex: 2,
              explanation:
                "Gebroken steun wordt vaak nieuwe weerstand. Beleggers die rond € 50 kochten en op verlies staan, willen bij een herstel richting hun aankoopprijs \"quitte\" uitstappen. Die collectieve verkoopdruk maakt van de oude vloer een plafond. Een garantie is het niet, maar het is een van de best onderbouwde mechanismen in TA.",
            },
            {
              question:
                "De koers piekt in de middag € 0,30 boven een belangrijke weerstand, maar sluit er weer onder. Hoe ga je hier volgens deze les het verstandigst mee om?",
              options: [
                "Direct instappen: elke beweging boven de weerstand is een geldig koopsignaal",
                "Dit als mogelijke valse doorbraak zien en op bevestiging wachten, zoals een slotkoers boven het niveau met oplopend volume",
                "De weerstandszone van de grafiek verwijderen, want hij is geraakt en dus verbruikt",
                "Concluderen dat het aandeel nooit meer door deze weerstand zal breken",
              ],
              correctIndex: 1,
              explanation:
                "Een piek binnen de dag die niet standhoudt tot het slot is een klassiek kenmerk van een valse doorbraak. Filters zoals een slotkoers voorbij het niveau, duidelijk oplopend volume of een geslaagde terugtest kosten je soms het begin van een beweging, maar besparen je veel valse signalen.",
            },
            {
              question: "Wanneer geldt een opwaartse trendlijn als bevestigd?",
              options: [
                "Zodra je twee willekeurige punten in de grafiek met elkaar verbindt",
                "Wanneer de lijn langs minimaal drie oplopende bodems loopt die hem raakten zonder te breken",
                "Alleen wanneer de lijn exact horizontaal loopt",
                "Wanneer een beursanalist de lijn in een rapport noemt",
              ],
              correctIndex: 1,
              explanation:
                "Twee raakpunten zijn nodig om een lijn überhaupt te kunnen tekenen, maar pas een derde raakpunt bevestigt dat de markt het niveau daadwerkelijk respecteert. Bij een opwaartse trend loopt de lijn onder de koers, langs de oplopende bodems. En onthoud: ook een bevestigde trendlijn is een hulpmiddel, geen natuurwet.",
            },
          ],
          xp: 50,
        },
      ],
    },
    {
      slug: "indicatoren-en-discipline",
      title: "Indicatoren en discipline",
      description:
        "Voortschrijdende gemiddelden, RSI en volume: de meest gebruikte indicatoren, met hun sterke én zwakke punten. En de belangrijkste les van allemaal: waarom risicomanagement en discipline meer opleveren dan de perfecte voorspelling.",
      lessons: [
        {
          slug: "voortschrijdende-gemiddelden",
          title: "Voortschrijdende gemiddelden",
          durationMin: 8,
          intro:
            "Koersgrafieken zijn nerveus: elke dag omhoog, omlaag, omhoog. Een voortschrijdend gemiddelde strijkt die ruis glad zodat de onderliggende trend zichtbaar wordt. In deze les leer je hoe SMA en EMA werken, wat een golden cross is, en waarom deze indicator altijd achterloopt.",
          sections: [
            {
              heading: "Wat een voortschrijdend gemiddelde doet",
              paragraphs: [
                "Een simpel voortschrijdend gemiddelde (SMA, simple moving average) is niets anders dan het gemiddelde van de laatste X slotkoersen, elke dag opnieuw berekend. Het 20-daags SMA van vandaag is dus het gemiddelde van de afgelopen 20 slotkoersen; morgen schuift het venster één dag op. Vandaar \"voortschrijdend\".",
                "Het effect: de wilde dagbewegingen worden uitgemiddeld en je ziet een vloeiende lijn die de trend volgt. Ligt de koers boven een stijgend gemiddelde, dan is de trend opwaarts; ligt hij eronder bij een dalend gemiddelde, dan is de trend neerwaarts. Simpeler kan trendmeting bijna niet.",
                "De lengte bepaalt het karakter. Een 10-daags gemiddelde volgt de koers op de huid maar geeft veel valse signalen; een 200-daags gemiddelde is traag maar toont de grote lijn. Er bestaat geen \"beste\" instelling, wat aanbieders van handelscursussen je ook beloven.",
              ],
              example: {
                title: "Rekenvoorbeeld: 5-daags SMA",
                body: "De slotkoersen van de laatste vijf dagen zijn € 20, € 21, € 23, € 22 en € 24. Het 5-daags SMA is (20 + 21 + 23 + 22 + 24) / 5 = 110 / 5 = € 22,00. Sluit het aandeel morgen op € 25, dan valt de oudste koers (€ 20) uit het venster en wordt het nieuwe SMA (21 + 23 + 22 + 24 + 25) / 5 = € 23,00. Het gemiddelde kruipt dus achter de koers aan, altijd één stap later.",
              },
            },
            {
              heading: "SMA versus EMA",
              paragraphs: [
                "Het SMA telt elke dag even zwaar mee: de koers van 50 dagen geleden weegt net zo veel als die van gisteren. Sommige analisten vinden dat onlogisch, want recent gedrag zegt meer over de markt van nu. Daarom bestaat het exponentieel voortschrijdend gemiddelde (EMA), dat recente koersen zwaarder laat meewegen.",
                "Het praktische verschil: een EMA reageert sneller op omslagen dan een SMA met dezelfde lengte. Dat klinkt als een gratis voordeel, maar dat is het niet. Sneller reageren betekent ook sneller reageren op rúis, dus meer valse signalen in beweeglijke markten. Het is een afruil, geen upgrade.",
                "Voor de grote lijn maakt de keuze weinig uit: op een jaargrafiek lopen het 50-daags SMA en EMA vrijwel gelijk op. Belangrijker dan de perfecte variant kiezen is consequent zijn: kies één instelling en spring niet per trade naar de indicator die toevallig jouw gelijk bevestigt.",
              ],
            },
            {
              heading: "De klassiekers: 50-daags, 200-daags en de golden cross",
              paragraphs: [
                "Twee instellingen zijn wereldwijd standaard geworden: het 50-daags gemiddelde voor de middellange trend en het 200-daags voor de lange termijn. Juist omdat miljoenen beleggers ernaar kijken, gedragen koersen zich er soms naar; het 200-daags gemiddelde fungeert bij indices als de S&P 500 en de AEX regelmatig als veelbesproken steun- of weerstandsniveau. Een zichzelf deels waarmakende voorspelling.",
                "Kruist het 50-daags gemiddelde van onder naar bóven het 200-daags, dan heet dat een golden cross: de middellange trend trekt de lange trend omhoog, historisch vaak gevolgd door verdere stijging. Het spiegelbeeld, het 50-daags dat onder het 200-daags zakt, heet een death cross en geldt als waarschuwing dat de lange trend draait.",
                "Eerlijkheidshalve: onderzoek naar deze kruisingen laat wisselende resultaten zien. Omdat gemiddelden per definitie achterlopen, komt het signaal vaak pas als een flink deel van de beweging al voorbij is. De death cross van maart 2020 verscheen bijvoorbeeld pas nadat de coronacrash grotendeels al gebeurd wás, vlak voor het herstel. Kruisingen beschrijven de trend, ze voorspellen hem niet.",
              ],
            },
            {
              heading: "Gemiddelden als trendfilter, niet als glazen bol",
              paragraphs: [
                "De grootste zwakte van voortschrijdende gemiddelden toont zich in zijwaartse markten. De koers slingert dan telkens door het gemiddelde heen en weer, en elk kruisje lijkt een signaal. Wie ze allemaal volgt, wordt heen en weer geslingerd: steeds nét te laat kopen, nét te laat verkopen. Dit fenomeen heet whipsaw, en het vreet rendement via transactiekosten en kleine verliezen.",
                "Hoe gebruiken doorgewinterde beleggers gemiddelden dan wel? Vooral als filter en context, niet als koop-verkoopmachine. Bijvoorbeeld: alleen koopkansen overwegen zolang de koers boven het stijgende 200-daags gemiddelde noteert, als objectieve check dat je met de lange trend meehandelt in plaats van ertegenin.",
                "Zo bezien is het gemiddelde een antwoord op één simpele vraag: wat is de trend, zonder mijn eigen wishful thinking? Voor die vraag is het een prima stuk gereedschap. Voor de vraag waar de koers volgende maand staat, is het dat niet, en dat geldt voor elke indicator in deze cursus.",
              ],
              bullets: [
                "SMA: gemiddelde van de laatste X slotkoersen, elke dag opgeschoven",
                "EMA: recente koersen wegen zwaarder, dus sneller maar ruisgevoeliger",
                "Golden cross / death cross: 50-daags kruist het 200-daags gemiddelde, een achterlopend trendsignaal",
                "In zijwaartse markten veroorzaken gemiddelden whipsaws: veel valse signalen achter elkaar",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Technical Analysis of the Financial Markets",
              author: "John J. Murphy",
              year: 1999,
              note: "Murphy behandelt voortschrijdende gemiddelden diepgaand, inclusief de afruil tussen snelheid en betrouwbaarheid.",
            },
          ],
          keyTakeaways: [
            "Een voortschrijdend gemiddelde strijkt dagruis glad en maakt de trend zichtbaar, maar loopt per definitie achter op de koers",
            "EMA reageert sneller dan SMA doordat recente koersen zwaarder wegen; sneller betekent ook meer valse signalen",
            "Golden cross en death cross (50/200-daags) beschrijven een trenddraai, vaak pas nadat een groot deel van de beweging al voorbij is",
            "Gebruik gemiddelden als trendfilter, en wees extra alert in zijwaartse markten waar whipsaws je rendement opvreten",
          ],
          quiz: [
            {
              question:
                "De slotkoersen van de laatste vijf dagen zijn € 20, € 21, € 23, € 22 en € 24. Wat is het 5-daags SMA?",
              options: [
                "€ 21,00",
                "€ 22,00",
                "€ 23,00",
                "€ 24,00",
              ],
              correctIndex: 1,
              explanation:
                "Tel de vijf slotkoersen op (20 + 21 + 23 + 22 + 24 = 110) en deel door 5: het SMA is € 22,00. Morgen valt de oudste koers uit het venster en komt de nieuwste erbij, waardoor het gemiddelde meeschuift met de koers.",
            },
            {
              question:
                "Waarom reageert een EMA sneller op een koersomslag dan een SMA met dezelfde lengte?",
              options: [
                "Het EMA gebruikt intraday-koersen in plaats van slotkoersen",
                "Het EMA laat recente koersen zwaarder meewegen in de berekening",
                "Het EMA wordt door brokers eerder bijgewerkt dan het SMA",
                "Het EMA gebruikt automatisch een kortere periode dan het SMA",
              ],
              correctIndex: 1,
              explanation:
                "Bij een SMA telt elke dag in het venster even zwaar; bij een EMA wegen de meest recente koersen het zwaarst. Daardoor pikt het EMA een omslag eerder op, maar reageert het ook sneller op betekenisloze ruis. Het is een afruil, geen gratis verbetering.",
            },
            {
              question:
                "Het 50-daags gemiddelde van een index kruist van onder naar boven het 200-daags gemiddelde. Wat is de meest eerlijke interpretatie van dit \"golden cross\"?",
              options: [
                "Een gegarandeerd koopsignaal: na een golden cross stijgt de markt altijd",
                "Een teken dat je alle posities direct moet verkopen",
                "Een achterlopende bevestiging dat de trend is gedraaid; een deel van de stijging is vaak al voorbij",
                "Een betekenisloos toeval waar geen enkele belegger naar kijkt",
              ],
              correctIndex: 2,
              explanation:
                "Gemiddelden zijn per definitie achterlopend: het kruispunt verschijnt pas nadat de koers al geruime tijd stijgt. Historisch volgde er vaak verdere stijging, maar onderzoek toont wisselende resultaten en garanties bestaan niet. Het signaal beschrijft de trend, het voorspelt hem niet.",
            },
            {
              question:
                "Een aandeel beweegt al maanden zijwaarts tussen € 18 en € 20. Wat is het grootste risico als je in deze fase klakkeloos elke kruising van koers en 50-daags gemiddelde volgt?",
              options: [
                "Whipsaws: een reeks valse signalen waardoor je telkens te laat koopt en verkoopt, met verliezen en kosten als gevolg",
                "Het gemiddelde stopt met berekenen zodra een markt zijwaarts beweegt",
                "Je mist gegarandeerd de grote stijging die na elke zijwaartse fase komt",
                "De broker brengt extra kosten in rekening voor het tonen van indicatoren",
              ],
              correctIndex: 0,
              explanation:
                "In een zijwaartse markt slingert de koers voortdurend door het gemiddelde heen en weer. Elk kruisje lijkt een signaal, maar er is geen trend om te volgen. Het resultaat is een reeks kleine verliezen plus transactiekosten: de klassieke whipsaw. Daarom gebruiken ervaren beleggers gemiddelden vooral als trendfilter, en herkennen ze eerst óf er wel een trend is.",
            },
          ],
          xp: 50,
        },
        {
          slug: "momentum-rsi-volume",
          title: "Momentum: RSI en volume",
          durationMin: 8,
          intro:
            "Een koers vertelt je waar de markt staat; momentum vertelt je hoe hard hij daarheen beweegt. In deze les leer je de populairste momentum-indicator (RSI) lezen, divergenties herkennen en volume gebruiken als leugendetector voor koersbewegingen.",
          sections: [
            {
              heading: "Momentum: de snelheid van de prijs",
              paragraphs: [
                "Gooi een bal omhoog en hij vertraagt vóórdat hij omkeert. Momentum-analisten geloven dat koersen zich vergelijkbaar gedragen: voordat een trend draait, neemt eerst de kracht van de beweging af. Door de snelheid van koersveranderingen te meten, hoop je die vertraging eerder te zien dan de omkering zelf.",
                "Twee aandelen kunnen allebei van € 50 naar € 60 stijgen, maar op heel verschillende manieren: de één in gestage stapjes van € 0,50, de ander met eerst een sprint naar € 58 en daarna moeizaam gekruip. Dezelfde bestemming, totaal ander momentum. Dat verschil zie je niet goed aan de koersgrafiek alleen, wel aan een momentum-indicator.",
              ],
            },
            {
              heading: "De RSI: overbought en oversold, met kanttekeningen",
              paragraphs: [
                "De Relative Strength Index (RSI), in 1978 ontwikkeld door Welles Wilder, meet de kracht van recente stijgingen tegenover recente dalingen, meestal over 14 periodes. De uitkomst is een getal tussen 0 en 100. Simpel gezegd: hoe meer en hoe grotere stijgingsdagen recent, hoe hoger de RSI.",
                "De klassieke leesregels: boven 70 heet de markt \"overbought\" (de stijging is hard gegaan, mogelijk té hard) en onder 30 \"oversold\" (de daling is mogelijk overdreven). Beginners vertalen dat vaak naar: RSI boven 70 is verkopen, onder 30 is kopen. En dat is precies de valkuil van deze les.",
                "Want in een sterke trend kan de RSI wékenlang boven 70 blijven terwijl de koers gewoon doorstijgt. Wie in zo'n trend bij elke \"overbought\"-stand verkoopt, stapt telkens te vroeg uit een winnaar. Overbought betekent niet \"gaat dalen\", het betekent \"is hard gestegen\". Dat is een cruciaal verschil. De RSI werkt het best in zijwaartse markten, en juist het slechtst in de sterke trends waarin beginners hem het vaakst tegenkomen.",
              ],
            },
            {
              heading: "Divergentie: als prijs en indicator elkaar tegenspreken",
              paragraphs: [
                "Interessanter dan de absolute RSI-stand is divergentie: de koers en de indicator vertellen een verschillend verhaal. Bij een negatieve (bearish) divergentie zet de koers een hógere top neer, maar blijft de RSI-top lager dan de vorige. De prijs klimt nog, maar de kracht achter de stijging neemt af, zoals de bal die vertraagt voordat hij valt.",
                "Positieve (bullish) divergentie is het spiegelbeeld: de koers zakt naar een lagere bodem, maar de RSI-bodem ligt hoger dan de vorige. De verkoopdruk neemt af, ook al daalt de prijs nog. Sommige beleggers zien dit als vroeg signaal dat een daling uitgeput raakt.",
                "Ook hier past bescheidenheid: divergenties kunnen lang aanhouden voordat de koers echt draait, en soms draait hij helemaal niet. Behandel een divergentie als een gele vlag die je alerter maakt en je risicobeheer aanscherpt, niet als startschot om vol in te stappen.",
              ],
              example: {
                title: "Voorbeeld: bearish divergentie in de praktijk",
                body: "Een aandeel piekt in maart op € 80 met een RSI van 75. In mei stijgt de koers verder naar € 85, een hogere top, maar de RSI piekt nu op slechts 62. De prijs zegt \"sterker dan ooit\", het momentum zegt \"de kracht neemt af\". Een belegger die dit ziet, hoeft niet te verkopen, maar kan bijvoorbeeld zijn stop-loss (les 6) aanscherpen: als de markt gelijk krijgt, is hij erbij; als de divergentie gelijk krijgt, is zijn verlies beperkt.",
              },
            },
            {
              heading: "Volume: de leugendetector",
              paragraphs: [
                "Volume, het aantal verhandelde stukken per periode, staat als staafjes onder bijna elke grafiek en wordt door beginners massaal genegeerd. Zonde, want volume toont de overtuiging achter een koersbeweging. Een stijging op hoog volume betekent: veel geld stemt vóór. Een stijging op laag volume betekent: er deed bijna niemand mee.",
                "Het klassieke gebruik is bevestiging bij doorbraken, zoals je in les 3 zag. Breekt een koers door een weerstand op twee tot drie keer het gemiddelde dagvolume, dan is de kans op een echte doorbraak groter dan bij een uitbraak op een slaperige handelsdag. Grote bewegingen zonder volume zijn verdacht, zoals een verkiezingsuitslag bij een opkomst van 3%.",
                "In Reminiscences of a Stock Operator lees je hoe Livermore al rond 1900 naar de \"tape\" staarde, de doorlopende stroom van koersen én volumes, om te voelen of grote partijen aan het kopen of verkopen waren. De technologie is veranderd; het principe dat volume overtuiging verraadt, is ruim een eeuw oud.",
              ],
              bullets: [
                "RSI boven 70 = overbought, onder 30 = oversold, maar in sterke trends falen deze grenzen",
                "Divergentie: koers en RSI spreken elkaar tegen, een teken van afnemend momentum",
                "Volume toont de overtuiging achter een beweging; doorbraken zonder volume zijn verdacht",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Technical Analysis of the Financial Markets",
              author: "John J. Murphy",
              year: 1999,
              note: "Murphy wijdt uitgebreide hoofdstukken aan oscillatoren zoals de RSI en aan de rol van volume als bevestiging.",
            },
            {
              title: "Reminiscences of a Stock Operator",
              author: "Edwin Lefèvre",
              year: 1923,
              note: "Livermore las koers en volume van de tickertape om de overtuiging van de grote spelers in te schatten, avant la lettre volume-analyse.",
            },
          ],
          keyTakeaways: [
            "Momentum meet de snelheid van koersbewegingen; afnemend momentum gaat soms aan een trenddraai vooraf",
            "RSI boven 70 betekent \"hard gestegen\", niet \"gaat dalen\": in sterke trends blijft de RSI lang overbought",
            "Divergentie tussen koers en RSI is een gele vlag om je risicobeheer aan te scherpen, geen koop- of verkoopbevel",
            "Volume is de leugendetector: bewegingen op hoog volume verdienen meer vertrouwen dan uitbraken op laag volume",
          ],
          quiz: [
            {
              question:
                "Een aandeel zit in een sterke opwaartse trend en de RSI staat al drie weken boven 70. Wat is de juiste conclusie volgens deze les?",
              options: [
                "Direct verkopen: boven 70 daalt een koers altijd binnen enkele dagen",
                "De RSI is kapot, want hij hoort altijd snel terug te keren naar 50",
                "Overbought betekent \"hard gestegen\", niet \"gaat dalen\": in sterke trends kan de RSI lang hoog blijven",
                "Extra bijkopen, want een hoge RSI garandeert verdere stijging",
              ],
              correctIndex: 2,
              explanation:
                "Dit is dé klassieke RSI-valkuil. In een sterke trend blijft de indicator wekenlang overbought terwijl de koers doorstijgt; wie bij elke stand boven 70 verkoopt, stapt telkens te vroeg uit. Overbought beschrijft het verleden (hard gestegen), het voorspelt niet de toekomst, in geen van beide richtingen.",
            },
            {
              question:
                "De koers van een aandeel stijgt van een top op € 80 naar een hogere top op € 85, maar de RSI piekt daarbij op 62 in plaats van de eerdere 75. Hoe heet dit verschijnsel en wat betekent het?",
              options: [
                "Een golden cross: de trend versnelt en wordt sterker",
                "Een bearish divergentie: de prijs stijgt nog, maar het momentum achter de stijging neemt af",
                "Een whipsaw: de indicator geeft afwisselend koop- en verkoopsignalen",
                "Een bullish divergentie: de verkoopdruk neemt zichtbaar af",
              ],
              correctIndex: 1,
              explanation:
                "Hogere koerstop plus lagere RSI-top is een negatieve (bearish) divergentie: de stijging verliest kracht, zoals een bal die vertraagt voor hij omkeert. Het is een gele vlag om je risicobeheer aan te scherpen, geen garantie op een daling; divergenties kunnen lang aanhouden.",
            },
            {
              question:
                "Twee aandelen breken door een belangrijke weerstand. Aandeel A doet dat op drie keer het gemiddelde dagvolume, aandeel B op een fractie van het normale volume. Welke doorbraak verdient meer vertrouwen, en waarom?",
              options: [
                "Aandeel B: weinig volume betekent weinig verkopers, dus stijgt het makkelijker",
                "Beide evenveel: volume zegt niets over de kwaliteit van een doorbraak",
                "Aandeel A: hoog volume toont dat veel geld de beweging steunt, wat de kans op een echte doorbraak vergroot",
                "Geen van beide: doorbraken zijn per definitie altijd vals",
              ],
              correctIndex: 2,
              explanation:
                "Volume toont de overtuiging achter een beweging. Een doorbraak op hoog volume betekent dat veel partijen actief meedoen; een uitbraak op laag volume kan het werk zijn van een handjevol handelaren en valt makkelijker terug. Garanties geeft ook volume niet, maar het is een waardevolle leugendetector.",
            },
            {
              question: "Wat meet de RSI in essentie?",
              options: [
                "De verhouding tussen de kracht van recente stijgingen en dalingen, uitgedrukt op een schaal van 0 tot 100",
                "Het aantal aandelen dat een bedrijf in totaal heeft uitgegeven",
                "De afstand tussen het 50-daags en het 200-daags voortschrijdend gemiddelde",
                "De winst per aandeel gedeeld door de koers",
              ],
              correctIndex: 0,
              explanation:
                "De RSI vergelijkt de gemiddelde omvang van recente stijgingsdagen met die van recente dalingsdagen (standaard over 14 periodes) en schaalt dat naar 0 tot 100. Hoe dominanter de stijgingen, hoe hoger de stand. Winst per aandeel hoort bij fundamentele analyse, en de afstand tussen gemiddelden is een ander soort indicator.",
            },
          ],
          xp: 50,
        },
        {
          slug: "risicomanagement-handelsplan",
          title: "Risicomanagement en een handelsplan",
          durationMin: 10,
          intro:
            "Dit is de belangrijkste les van de cursus, en hij gaat niet over voorspellen. Professionele handelaren onderscheiden zich niet door vaker gelijk te hebben, maar door klein te verliezen als ze ongelijk hebben. In deze les bouw je het fundament: positiegrootte, stop-loss, risk/reward en een journaal.",
          sections: [
            {
              heading: "Waarom risicobeheer voorspellen verslaat",
              paragraphs: [
                "Hier is een som die veel beginners verrast. Handelaar A heeft in 60% van zijn trades gelijk, maar laat verliezers oplopen: zijn winnaars leveren gemiddeld € 100 op, zijn verliezers kosten € 200. Over 10 trades: 6 × € 100 − 4 × € 200 = € 600 − € 800 = € 200 verlíés, ondanks een winrate waar de meeste mensen van dromen.",
                "Handelaar B heeft maar in 40% van de gevallen gelijk, maar snijdt verliezen snel af: winnaars € 200, verliezers € 100. Over 10 trades: 4 × € 200 − 6 × € 100 = € 800 − € 600 = € 200 wínst. Minder vaak gelijk, toch beter resultaat. De verhouding tussen winst en verlies per trade blijkt belangrijker dan hoe vaak je gelijk hebt.",
                "Dit verklaart waarom deze les de kern van de cursus is. Alle grafieken, patronen en indicatoren uit de vorige lessen geven je hooguit een klein kansvoordeel, áls ze dat al doen. Risicobeheer bepaalt of dat voordeel ooit je rekening bereikt, of onderweg verdampt in een paar grote klappen.",
              ],
            },
            {
              heading: "Positiegrootte: de 1%-regel",
              paragraphs: [
                "De eerste vraag bij elke trade is niet \"gaat dit omhoog?\" maar \"hoeveel mag dit me kosten?\". Een veelgebruikte vuistregel onder actieve handelaren: riskeer per trade maximaal 1% (of voor de voorzichtigen 0,5%) van je totale kapitaal. Niet 1% als inzet, maar 1% als maximaal verlíés als je stop-loss wordt geraakt.",
                "De berekening werkt zo: bepaal eerst je maximale verlies in euro's, bepaal dan waar je stop-loss logisch ligt (bijvoorbeeld onder een steunzone), en déél het maximale verlies door het risico per aandeel. De uitkomst is je positiegrootte. De volgorde is essentieel: het risico bepaalt de positie, niet je enthousiasme.",
                "Het mooie van de 1%-regel is dat hij rampen wiskundig klein houdt. Zelfs tien verliezers op rij, en die komen voor, kosten je dan zo'n 10% van je kapitaal: pijnlijk maar overleefbaar. Wie per trade 10% riskeert, is na diezelfde reeks ruim 65% kwijt en heeft daarna bijna 200% rendement nodig om terug te komen. Beleggen kent risico's; positiegrootte bepaalt hoe groot ze voor jóú zijn.",
              ],
              example: {
                title: "Rekenvoorbeeld: van risico naar aantal aandelen",
                body: "Je handelskapitaal is € 10.000 en je hanteert de 1%-regel: maximaal € 100 verlies per trade. Je wilt een aandeel kopen op € 25,00 en de logische stop-loss ligt onder een steunzone, op € 23,00. Risico per aandeel: € 25,00 − € 23,00 = € 2,00. Positiegrootte: € 100 / € 2,00 = 50 aandelen, een positie van 50 × € 25,00 = € 1.250. Wordt je stop geraakt, dan verlies je (afgezien van kosten en eventuele slippage) € 100: precies volgens plan.",
              },
            },
            {
              heading: "Stop-loss en risk/reward",
              paragraphs: [
                "Een stop-loss is een vooraf bepaald niveau waarop je je verlies neemt, punt. Technische analyse helpt bij het kiezen van dat niveau: net onder een steunzone, onder een trendlijn of onder de bodem van een patroon. De gedachte: als de koers dáár komt, klopt je oorspronkelijke analyse aantoonbaar niet meer, en heeft de positie geen bestaansrecht meer.",
                "De risk/reward-verhouding zet je mogelijke verlies af tegen je realistische winstdoel. Koop je op € 40 met een stop op € 38 (risico € 2) en een koersdoel bij weerstand op € 46 (potentieel € 6), dan is je risk/reward 1 : 3. Veel handelaren nemen alleen trades vanaf 1 : 2, want zoals je in de eerste sectie zag, mag je dan zelfs met minder dan 50% winrate verwachten quitte of positief te spelen.",
                "De grootste vijand van de stop-loss ben je zelf. De verleiding om een stop \"nog even\" te verruimen als de koers ertegenaan kruipt, is enorm: het voelt als geduld, maar het is het opblazen van je risico voorbij je plan. Lefèvre beschreef dit mechanisme al in 1923: niet het denken, maar het zítten, het discipline houden, maakte Livermore zijn grote winsten. En zelfs hij ging meermaals failliet toen hij zijn eigen regels brak.",
              ],
            },
            {
              heading: "Het handelsplan en het journaal",
              paragraphs: [
                "Een handelsplan is een kort document dat je vóóraf schrijft, met koel hoofd, zodat je tijdens de storm niet hoeft te improviseren. Minimaal onderdeel ervan: onder welke voorwaarden je instapt, waar je stop-loss ligt, wat je koersdoel is, hoeveel je riskeert per trade en wanneer je níét handelt (bijvoorbeeld rond cijferpublicaties, of na twee verliezen op één dag).",
                "Het journaal is het verlengstuk: na elke trade noteer je wat je deed, waarom, en hoe je je daarbij voelde. Niet voor de gezelligheid, maar omdat je geheugen een notoire mooiprater is. Zwart op wit ontdek je patronen die je liever niet ziet: dat je verliezen vrijwel altijd komen van trades buiten je plan, dat je na een winst overmoedig groter gaat zitten, dat je op vrijdagmiddag slechter handelt.",
                "Zo eindigt deze cursus waar hij hoort te eindigen: bij jou. De grafieken, candlesticks en indicatoren uit de vorige lessen zijn gereedschap, en gereedschap is zo goed als de hand die het vasthoudt. De markt voorspellen kan niemand betrouwbaar, dat heeft de wetenschap ons wel geleerd. Maar je risico beheersen, je regels volgen en je fouten documenteren, dat kan iedereen leren. Precies daar zit het verschil tussen gokken en gedisciplineerd beleggen.",
              ],
              bullets: [
                "Handelsplan: instapvoorwaarden, stop-loss, koersdoel, maximaal risico en wanneer je niet handelt",
                "Journaal: elke trade vastleggen (wat, waarom, gevoel) om je eigen patronen te ontdekken",
                "Discipline is het product; analyse is slechts de verpakking",
              ],
            },
          ],
          bookRefs: [
            {
              title: "Reminiscences of a Stock Operator",
              author: "Edwin Lefèvre",
              year: 1923,
              note: "Het levensverhaal van Jesse Livermore is één lange les in discipline: zijn grootste winsten kwamen uit geduld, zijn faillissementen uit het breken van zijn eigen regels.",
            },
            {
              title: "A Random Walk Down Wall Street",
              author: "Burton G. Malkiel",
              year: 1973,
              note: "Malkiels kritiek onderstreept waarom risicobeheer belangrijker is dan voorspellen: als de markt nauwelijks voorspelbaar is, is je verdediging het enige dat je zelf volledig in de hand hebt.",
            },
          ],
          keyTakeaways: [
            "De verhouding tussen gemiddelde winst en gemiddeld verlies bepaalt je resultaat meer dan hoe vaak je gelijk hebt",
            "De 1%-regel: bepaal eerst je maximale verlies, dan je stop-niveau, en bereken dááruit je positiegrootte",
            "Plaats je stop-loss waar je analyse aantoonbaar niet meer klopt, en verruim hem nooit tijdens een lopende trade",
            "Neem bij voorkeur trades met een risk/reward van minstens 1 : 2, zodat je ook met een winrate onder 50% kunt overleven",
            "Een handelsplan en journaal maken je fouten zichtbaar; discipline is uiteindelijk belangrijker dan de perfecte voorspelling",
          ],
          quiz: [
            {
              question:
                "Je handelskapitaal is € 10.000 en je riskeert maximaal 1% per trade. Je wilt kopen op € 25,00 met een stop-loss op € 23,00. Hoeveel aandelen kun je volgens de 1%-regel kopen?",
              options: [
                "400 aandelen, want € 10.000 / € 25 = 400",
                "100 aandelen, want je mag € 100 riskeren",
                "50 aandelen, want € 100 maximaal verlies gedeeld door € 2,00 risico per aandeel",
                "4 aandelen, want € 100 / € 25 = 4",
              ],
              correctIndex: 2,
              explanation:
                "Maximaal verlies: 1% van € 10.000 = € 100. Risico per aandeel: € 25,00 − € 23,00 = € 2,00. Positiegrootte: € 100 / € 2,00 = 50 aandelen (een positie van € 1.250). De veelgemaakte fout is je hele kapitaal door de koers delen (400 stuks): dan verlies je bij het raken van je stop € 800, acht keer je geplande risico.",
            },
            {
              question:
                "Je koopt op € 40,00, je stop-loss staat op € 38,00 en je koersdoel ligt bij een weerstand op € 46,00. Wat is je risk/reward-verhouding?",
              options: [
                "1 : 2, want € 46 is ongeveer twee keer € 38 gedeeld door je inzet",
                "1 : 3, want je riskeert € 2,00 voor een potentiële winst van € 6,00",
                "3 : 1, want je winstkans is drie keer zo groot als je verlieskans",
                "1 : 6, want het koersdoel ligt € 6,00 boven je instap",
              ],
              correctIndex: 1,
              explanation:
                "Risico: € 40,00 − € 38,00 = € 2,00. Potentiële winst: € 46,00 − € 40,00 = € 6,00. Dat is 1 : 3: je riskeert één euro om er potentieel drie te winnen. Let op: risk/reward zegt niets over de kans dat het doel wordt gehaald, alleen over de verhouding tussen de bedragen.",
            },
            {
              question:
                "Een handelaar wint slechts 40% van zijn trades, maar zijn winnaars leveren gemiddeld € 200 op en zijn verliezers kosten € 100. Wat is zijn verwachte resultaat over 10 trades?",
              options: [
                "€ 200 verlies, want wie minder dan de helft wint, verliest per definitie",
                "Precies quitte: winsten en verliezen heffen elkaar altijd op",
                "€ 200 winst: 4 × € 200 aan winst tegenover 6 × € 100 aan verlies",
                "Dat is onmogelijk te zeggen zonder de exacte koersen te kennen",
              ],
              correctIndex: 2,
              explanation:
                "4 winnaars × € 200 = € 800; 6 verliezers × € 100 = € 600. Saldo: € 200 winst, ondanks een winrate onder de 50%. Dit is de kernsom van risicomanagement: de verhouding tussen gemiddelde winst en gemiddeld verlies weegt zwaarder dan hoe vaak je gelijk hebt.",
            },
            {
              question:
                "Je positie loopt tegen je in en de koers nadert je stop-loss. Je overweegt de stop \"nog even\" te verruimen zodat je meer ruimte hebt. Wat zegt deze les daarover?",
              options: [
                "Verstandig: een ruimere stop geeft de trade de tijd die hij nodig heeft",
                "Dit is een klassieke disciplinefout: je vergroot je risico voorbij je plan, precies op het moment dat je analyse al ongelijk krijgt",
                "Goed idee, mits je de stop maximaal twee keer per trade verplaatst",
                "Het maakt niet uit, want stops zijn slechts een indicatie",
              ],
              correctIndex: 1,
              explanation:
                "Je stop lag op het niveau waar je analyse aantoonbaar niet meer klopt. Hem verruimen omdat de koers ertegenaan kruipt, betekent: meer riskeren dan gepland, gebaseerd op hoop in plaats van analyse. Livermores verhaal laat zien waar dat eindigt; zelfs de beste handelaar van zijn tijd ging failliet toen hij zijn eigen regels brak. Verplaats stops hooguit in je vóórdeel, nooit ervandaan.",
            },
            {
              question: "Wat is volgens deze les het belangrijkste doel van een handelsjournaal?",
              options: [
                "Bewijs verzamelen voor de Belastingdienst over je transacties",
                "Je winsten kunnen delen op sociale media met andere beleggers",
                "Patronen in je eigen gedrag en fouten ontdekken, omdat je geheugen resultaten mooier maakt dan ze waren",
                "De koersen van je aandelen bijhouden zodat je geen grafieken meer nodig hebt",
              ],
              correctIndex: 2,
              explanation:
                "Je geheugen is een notoire mooiprater: het onthoudt de mooie treffers en vergeet de ondoordachte missers. Een journaal legt zwart op wit vast wat je deed en waarom, zodat terugkerende fouten zichtbaar worden, zoals handelen buiten je plan of te groot gaan zitten na een winst. Dat maakt het journaal een leerinstrument, geen administratieve verplichting.",
            },
          ],
          xp: 50,
        },
      ],
    },
  ],
};

export default course;
