# College+ en de AI-studiecoach — het definitieve concept

> **De cijfers in dit document zijn van 2 augustus 2026, toen er drie gebouwde cursussen
> stonden (21 lessen, 88 quizvragen, waarvan één cursus gratis). Op 3 augustus zijn het er
> negen geworden — 69 lessen, 280 quizvragen — en drie dragende getallen zijn daarmee
> achterhaald.** Het oordeel zelf — College+ verkoopt de oefenlaag, niet de bibliotheek —
> staat er sterker door en verandert niet: een grotere catalogus maakt "betaal elke maand
> voor toegang" niet ineens eerlijk. Maar reken niet meer met deze getallen:
>
> | Staat er | Werkelijk (3 aug 2026) |
> |---|---|
> | "een catalogus van ~100 minuten" | 622 minuten totaal, waarvan 541 achter de betaalmuur |
> | "88 vragen" in de vragenvijver (twee keer) | 280 quizvragen |
> | "~17.200 woorden" corpus / ±35.000 tokens prefix | gemeten over 21 lessen; het zijn er nu 69 — hertel vóór gebruik |
>
> Twee gevolgen die je moet meenemen. **Ten eerste:** het argument "met 88 vragen is de
> vijver klein, dus wekelijks en niet dagelijks" steunt niet meer op dit cijfer — de eigen
> drempel uit `docs/productonderzoek.md` ("laat de voorraad groeien naar 200+ voordat je de
> frequentie opvoert") is gehaald. Of dagelijks dan ook *wenselijk* is, is een aparte vraag.
> **Ten tweede: de rekensom in §4 en de conclusie "geen vectordatabase nodig" hangen aan het
> corpus, en dat corpus is meer dan verdrievoudigd in lessen.** De genoemde omslag lag rond
> 150K tokens; of het corpus daar nog onder blijft is precies de vraag die je moet hertellen
> vóór je erop bouwt — schrijf daarvoor eerst het corpus-script uit fase 0 en tel de tokens,
> in plaats van de oude schatting op te schalen. De kosten per bericht schalen mee. De
> prijzen zelf staan onveranderd in `docs/prijsstrategie.md`.

Laatst bijgewerkt: 2 augustus 2026. Synthese van drie ontwerpvoorstellen (gewoontelaag, groeiende bibliotheek, coach voorop), getoetst aan `docs/productonderzoek.md`, `docs/prijsstrategie.md`, `docs/ideeen.md` en de merkregels in `CLAUDE.md`. De prijzen zelf staan en blijven in `docs/prijsstrategie.md`; dit document beslist wat College+ ís, wanneer het verkocht mag worden, en wat er tot die tijd gebeurt.

---

## 1. Het oordeel

**De dragende gedachte komt uit het gewoonte-concept: College+ verkoopt geen bibliotheek, maar de oefenlaag erbovenop.** Elke week een verse oefenset uit je eigen antwoorden, een AI-oefenmeester die je fouten nabespreekt, gereedschap met jouw eigen cijfers erin, en inhoud die wordt bijgehouden omdat ze veroudert. De cursussen zitten erin, maar zijn de ingang — niet de reden van de terugkerende betaling. Dat is de enige invulling die de eerlijkheidstoets doorstaat én de Duolingo-les uit het productonderzoek toepast: retentie komt uit mechanica, niet uit volume. Een catalogus van ~100 minuten kan de belofte "betaal elke maand" niet dragen, hoeveel cursussen er ook bijkomen; oefening die elke week opnieuw uit jouw eigen data ontstaat wél.

**Uit het bibliotheek-concept neem ik twee dingen over die het gewoonte-concept mist:**

- **Het openbare actualisatielog.** Dit is het beste losse idee van de drie: een pagina "Wat is er nieuw en bijgewerkt" waarin elke lesactualisatie, nieuwe vraag, casus en dossier-update met datum staat. Het maakt de eerlijkheidsbelofte *afdwingbaar* in plaats van decoratief — een stille maand is voor iedereen zichtbaar, en dat is de bedoeling. De klok start nú, niet bij lancering (zelfde datapatroon als `src/content/blog.ts`, een dag werk).
- **De timing-discipline: het bewijs moet ouder zijn dan het abonnement.** Daarmee neem ik het "wacht een half jaar"-scenario grotendeels over — zie §5 voor de expliciete weging.

**Uit het bibliotheek-concept verwerp ik:**

- **Het catalogus-minimum als grond voor het abonnement** ("ruwweg tweemaal de huidige bibliotheek"). Dat herimporteert precies de denkfout waar het productonderzoek mee eindigt: dat je "meer inhoud" nodig hebt. Cursus 4 blijft wél een lanceervoorwaarde, maar om een andere, smallere reden: de prijsrekensom. *(Bijgewerkt 3 aug 2026: die rekensom is inmiddels ruim gedekt — 8 betaalde cursussen, alles-los ≈ €372 tegenover €149 jaar. De conclusie verandert niet: de retentiegrond is en blijft de oefenlaag.)*
- **Sonnet als standaardmodel.** De modelkeuze beslist de evalset, niet het bangste gevoel; zie §4.
- **De beloofde casus-cadans** (2–3 casussen per cursus per jaar). Publiceer het log en de teller, nooit de belofte — beloven wat je misschien niet haalt is het patroon waar dit merk zich tegen afzet.
- **De coach als "bibliothecaris"/vraagbaak als hoofdrol.** Het coach-concept zegt het zelf eerlijk: op een klein corpus is een vraagbaak snel uitgevraagd. *(Het corpus is op 3 aug 2026 gegroeid naar ~540 betaalde minuten, wat de vraagbaak rijker maakt — maar het argument blijft: de vraagbaak-functie komt er (fase 2) en draagt het abonnement niet.)*

**Uit het coach-concept neem ik over:**

- **De oefenmeester-rol als fase 1** en het socratische doorvragen (retrieval practice, het best onderbouwde leereffect in het hele onderzoek).
- **De evalset als release-criterium**: ~50 vragen waarvan ~20 bewust verboden (inclusief jailbreak-pogingen), nul instrumentspecifieke antwoorden, gedocumenteerd met datum, modelversie en promptversie. Dat laatste is geen pedanterie: bij een AFM-vraag moet je kunnen laten zien wat de coach wanneer kon zeggen.
- **De weigering als onderwijs.** Als de coach weigert, legt hij uit wáárom het vergunningstelsel bestaat en wat het verschil is tussen onderwijs en advies. Dat is de merkbelofte in werking, geen disclaimer.
- **De technische verdediging in lagen**: output-filter op tickerpatronen en adviesfrases, kill-switch via omgevingsvariabele (uit het bibliotheek-concept), feature flag met vijf testgebruikers, beta-label bij livegang, AVG-paragraaf (verwerkersrelatie Anthropic, bewaartermijn in de privacyverklaring).

**Uit het coach-concept verwerp ik:**

- **De coach als verkoopmotor.** Hij is de rente op de oefenlaag, niet het product. Eén gelekt "koop ETF X"-screenshot is merkramp én toezichtsrisico; hoe centraler de coach op de verkooppagina staat, hoe groter dat risico weegt.
- **De vragenrubriek met beloofde antwoordtermijn** in het lanceerpakket. Goed idee, maar het is nóg een verplichting die nooit stopt, bovenop het lognalezen en de seizoensitems. V2, met een ruime termijn.
- **"Onbeperkt binnen fair use" als framing.** Het is een kostengrens (40 berichten per dag) en zo noemen we hem ook — eerlijk vermeld bij de chat.

**Eén correctie op het gewoonte-concept zelf:** het box 3-dossier gaat *niet* achter de betaalmuur. De lens publiek-en-vindbaarheid is er expliciet over: dit is het enige Nederlandse onderwerp met serieus zoekvolume waar je nog kunt winnen. Het dossier blijft openbaar — het is tegelijk je beste SEO-asset én publiek bewijs dat je bijhoudt wat veroudert. College+ krijgt de begeleiding eromheen: de vier gedateerde seizoensitems en de koppeling met het weekrapport. Ook het weekrapport-per-mail wacht op de verzendfundering; op /leerpad kan het meteen.

---

## 2. Wat de abonnee krijgt

Het verhaal op de verkooppagina wordt: **"College+ is voor wie wil blijven oefenen en bijblijven. Wil je één onderwerp leren, koop die cursus dan los — die is voor altijd van jou."** Die tweede zin staat er letterlijk bij; het is de rekenregel uit `docs/prijsstrategie.md` §3 en de goedkoopste geloofwaardigheid die er bestaat.

Concreet, in volgorde van waarom je betaalt:

1. **De wekelijkse oefenset op /herhalen.** Elke maandag vijf vragen uit lessen die je al afrondde, met voorrang voor vragen die je fout had en lessen die het langst geleden zijn. Antwoordopties gehusseld, deterministisch per gebruiker + weeknummer zodat de set de hele week stabiel blijft. Geen SM-2-algoritme: simpel en uitlegbaar wint. Framing overal reassurance-first — "vergeten is normaal, daarom herhalen we" — nooit rode scores.
2. **De AI-studiecoach als oefenmeester.** Bespreekt je foute antwoord na in andere woorden dan de les, verwijst terug naar de les, stelt één controlevraag terug, en stelt varianten op bestaande vragen zodat je begrippen leert in plaats van antwoordposities. Zie §4.
3. **Een weekrapport op /leerpad**: wat je oefende, wat bleef hangen, wat volgende week terugkomt. Geschreven als terugblik, niet als rapportcijfer. Later ook per mail, voor wie toestemming gaf.
4. **De seizoensbegeleiding bij het (openbare) box 3-dossier**: vier korte gedateerde items per jaar — jaaroverzichten lezen, aangifte, belastingplan, jaarafsluiting — strikt "zo werkt de regel", nooit "dit moet jij doen".
5. **Alle cursussen, ook nieuwe, plus alle interactieve tools met opgeslagen invoer.** De bibliotheek en het gereedschap: inbegrepen en waardevol, maar bewust gepresenteerd als wat je krijgt, niet als waarom je maandelijks betaalt. Bij opzeggen stopt de toegang; je eigen ingevulde gegevens blijven exporteerbaar en je certificaten blijven van jou.
6. **Een groeiende vragenvijver met een openbare teller** ("nu 88 vragen; vorige maand 76") en **het actualisatielog** als controleerbaar bewijs van onderhoud. De teller in plaats van een belofte.

---

## 3. Waarom maandelijks (en jaarlijks) eerlijk is

De toets is die van het gewoonte-concept: **als Jason in een maand nul nieuwe lessen schrijft, ontvangt de abonnee die maand dan toch iets echts?** Ja — een verse oefenset uit zijn eigen geschiedenis, nabespreking van zijn eigen fouten, een rapport over zijn eigen activiteit, en seizoensitems die bestaan omdat de wetgever beweegt. Dat is het wezenlijke verschil met "toegang tot 100 minuten inhoud", waar maand twee leeg is en de omzet uit vergeetachtigheid komt — het model dat dit merk zegt te bestrijden.

Drie dingen maken het rond:

- **Er wordt niets bestaands achter de betaalmuur getrokken.** De gratis cursus houdt al zijn quizzen, de quizreview en "doe je foute vragen opnieuw"; losse kopers houden dat alles voor hun gekochte cursus levenslang, inclusief de wekelijkse herhaalset over hun eigen lessen. College+ is nieuwe waarde bovenop (de vijver over álle cursussen, de coach, het rapport, de seizoensbegeleiding), geen weggehaalde waarde terugverkocht. Dat is de grens tussen Duolingo's retentiemechanica (kopiëren) en Duolingo's monetisatie (verboden terrein): geen hearts, geen energie, geen daglimiet op leren.
- **De eerlijkheid is controleerbaar, niet beloofd.** Het actualisatielog laat elke abonnee elke maand narekenen wat er gebeurd is. Opzeggen is één klik met bevestigingsmail. De zwakke plek staat op de site zelf: met 88 vragen is de vijver klein, dus de herhaling is wekelijks en niet dagelijks, en de teller laat zien dat de vijver groeit.
- **Het jaarplan is het hoofdproduct en wordt als eerste getoond** (€12,42/mnd, jaarlijks betaald — het anker uit prijsstrategie §1.5). De churn-realiteit blijft: reken bij het maandplan op 2–3 maanden levensduur. De oefenlaag is wat het jáárplan eerlijk maakt, geen churn-wondermiddel — dat zegt het gewoonte-concept zelf, en het klopt.

---

## 4. De AI-studiecoach

### Rol en grens

Fase 1 is uitsluitend **oefenmeester**: hij leeft op de quizreview en /herhalen, waar de context (les, vraag, gegeven antwoord) automatisch meegaat en het gesprek smal blijft. Boven de chat staat permanent: *"Dit is een AI-studiecoach. Hij legt lesstof uit en geeft nooit beleggingsadvies."*

De AFM-grens is een architectuurprincipe (prijsstrategie §5.6): beleggingsadvies = het aanbevelen van specifieke financiële instrumenten aan een specifieke cliënt — dus worden **beide dimensies afzonderlijk geblokkeerd**, als dubbele marge. Nooit een instrument noemen in aanbevelende of afradende zin (ook niet "veel beginners kiezen X"); nooit ingaan op de persoonlijke situatie ("ik heb €20.000…" krijgt Jasons vaste, vriendelijke standaardreactie met verwijzing naar de les en naar het AFM-register); geen verdelingen, bedragen, timing, voorspellingen, risicoprofielen of persoonlijk fiscaal advies. Waar hij weigert, legt hij uit waarom de grens bestaat — de weigering is zelf onderwijs.

### Techniek

Gehoste API, niet Jasons lokale LLM — dat besluit staat al in `docs/ideeen.md` en blijft: de thuisverbinding mag niet de beschikbaarheid van een betaald product worden, en logging, versiebeheer en een kill-switch horen op een server. De lokale LLM blijft de gratis prototype-speeltuin voor prompt en evalset.

Geen vectordatabase: de hele catalogus is ~17.200 woorden getypte data in `src/content/`, dus een build-script zet alles om in één corpusdocument dat als gecachte prefix (±35.000 tokens) in elk verzoek meegaat. Dat minimaliseert hallucinatie (de coach kan alleen antwoorden uit wat hij letterlijk voor zich heeft), maakt bronverwijzing per les triviaal, en is pas te heroverwegen boven ~150K tokens corpus — jaren weg. Eén streaming route handler achter `heeftToegangTot()` in `src/lib/entitlements.ts` — de bestaande, enige toegangspoort; geen tweede check elders.

**Model: start met claude-haiku-4-5; de evalset is de poort.** Haalt Haiku geen nul fouten op de verboden set, dan claude-sonnet-4-6 (±3× de kosten, op deze schaal irrelevant). Dit is geen bezuiniging maar een toets: de guardrails zitten in lagen, niet in modelvertrouwen. Vijf lagen: (1) systeemprompt met de verbodscategorieën en de standaard-weigerteksten in merkstem; (2) goedkope pre-check die persoonlijke-adviesvragen vóór het model al naar de standaardreactie stuurt; (3) output-filter (regex op tickers, ISIN, fondsnamen, "ik zou kopen") dat verdachte antwoorden vervangt en logt; (4) volledige gesprekslogging in Neon met steekproefsgewijze review door Jason — bij tientallen gebruikers kan dat echt; (5) rate limit van 40 berichten per dag, eerlijk vermeld als kostengrens. Plus een kill-switch: één omgevingsvariabele die de coach vervangt door "de studiecoach is even offline". Model-ID exact gepind; per gesprek model- en promptversie gelogd.

### Rekensom (Haiku 4.5: $1/M input, $5/M output, cache-read ~$0,10/M)

Per bericht: ±35.000 tokens gecachte prefix als cache-read ($0,0035) + ±1.500 verse tokens vraag en historie ($0,0015) + ±350 tokens antwoord ($0,00175) ≈ **$0,007 per bericht**. Een normale abonnee met 40 berichten per maand: ≈ $0,28 ≈ €0,26; conservatief dubbel gerekend (cache-misses door de 5-minuten-TTL, langere gesprekken) nog onder €0,55. Absolute plafond dankzij de 40/dag-limiet: ±1.200 berichten ≈ €8 per maand. Tegen €12,39 netto maandprijs is normaal gebruik dus **2–4% van de omzet**; bij 25 abonnees ~€10 API-kosten per maand, bij 100 abonnees €25–50. Onzekerheid eerlijk gemarkeerd: wisselkoers en Nederlandse tokenisatie zijn schattingen (±30%) — de conclusie (de API is niet de kostenpost; misbruik zonder limiet zou het zijn) kantelt daar niet op.

### Fasering

- **Fase 0 (nu, kost avonden):** corpus-script, systeemprompt, standaard-weigerteksten en de evalset schrijven; prototypen lokaal, evalueren tegen de echte API. De chatteksten lopen mee in de juristcontrole die al gepland staat voor de voorwaarden.
- **Fase 1 (achter feature flag, dan bij lancering publiek met beta-label):** oefenmeester op quizreview en /herhalen. Smalste rol, duidelijkste context, kleinste kans op ontsporing.
- **Fase 2 (na weken logs lezen):** vrije vragen over de lesstof op elke betaalde lespagina, altijd met bronverwijzing per les.
- **Fase 3 (pas na maanden):** coach-gegenereerde vraagvarianten in de wekelijkse vijver — elke vraag door Jason gekeurd vóór hij erin komt. Ongecontroleerde AI-inhoud hoort niet in een product dat op eerlijkheid verkoopt.

---

## 5. Lanceervoorwaarden, in volgorde

Er wordt **geen enkel abonnement verkocht** voordat dit alles staat. De eerlijke boodschap staat er per stap bij.

1. **Stap nul: live Mollie-key in Vercel en Vercel Pro.** Zolang er een `test_`-key staat is alles hierna decoratie op een winkel waar de kassa niet werkt.
2. **De aankondiging eerlijk maken (een uur, vandaag).** Zie §7.
3. **Het actualisatielog live, klok start nu (een dag).** Het bewijs van onderhoud moet ouder zijn dan het abonnement.
4. **Per-vraag-antwoorden naar de server.** `src/lib/progress.tsx` regel 163 zegt het expliciet: de server bewaart geen individuele antwoorden. Zonder een `question_attempts`-tabel (of jsonb-kolom op `lesson_progress`) bestaat "oefenen uit je fouten" niet apparaatoverstijgend. Dit is de bodemplaat onder de hele oefenlaag — en het verbetert de losse verkoop ook.
5. **/herhalen live** voor iedereen, over de lessen waar je toegang toe hebt (§6).
6. **Coach fase 1 compleet**: guardrails, logging, rate limit, evalset op nul verboden antwoorden, red-team-avond, vijf testgebruikers.
7. **Juridisch af — blokkerend, niet cosmetisch.** /voorwaarden, /privacy en /herroepingsrecht van concept-op-noindex naar juristgecontroleerd, inclusief de College+-bepalingen (toegang vervalt, voortgang blijft, upgrade-krediet) en de coachteksten. De herroepingsknop (art. 6:230oa BW, verplicht sinds 19 juni 2026 — College+ is vrijwel zeker een dienst, dus niet weg te tekenen) en de opzegknop-in-één-klik met bevestigingsmail.
8. **De groeipoort: bewijs van publiek.** Geen College+-verkoop zonder ten minste tien echte losse verkopen en een werkend, groeiend e-mailkanaal (de verzendfundering uit het productonderzoek). Een oefenlaag voor nul abonnees is een leeg sjabloon; het productonderzoek is er terecht hard over dat het probleem vindbaarheid is, niet inhoud.
9. **Cursus 4 (Beleggingspsychologie, incl. biastest) af.** ✅ **Vervuld op 3 aug 2026 — en bewust buiten de voorgeschreven volgorde**: de cursus is geschreven vóórdat de groeipoort (stap 8) zicht gaf, op Jasons uitdrukkelijke opdracht, samen met vijf andere cursussen (zie `docs/cursusfabriek.md`). De prijsrekensom is daarmee ruimschoots gedekt (8 betaalde cursussen, alles-los ≈ €372 tegenover €149 jaar); **stap 8 blijft de bindende poort** voor de daadwerkelijke College+-verkoop.
10. **Verkooppagina en `src/lib/pricing.ts` herschreven** rond "oefening, gereedschap en bijhouden", jaarplan eerst getoond, de rekenregel "wil je één onderwerp, koop dan los" erop, de coachgrenzen zichtbaar, seizoenskalender met minimaal drie maanden loghistorie. Dan pas verkoop aan: **eerst alleen het jaarplan €149** (eenmalige betaling, geen SEPA nodig, geen MOI-risico), met het upgrade-krediet actief en de duo-bundel uitgefaseerd; het maandplan volgt zodra Mollie SEPA-incasso goedkeurt én het jaarplan een paar maanden stabiel draait.

**De weging van het half-jaar-scenario, expliciet.** Het bibliotheek-concept zegt: lanceer pas begin 2027, en dat is geen vertraging maar de voorwaarde. Dat oordeel neem ik over — de optelsom hierboven komt bij avondwerk (±15–19 werkdagen fundamenten, plus 4–6 weken cursus 4, plus jurist en groeipoort) vanzelf op begin 2027 uit, en SEPA-goedkeuring plus de juristcontrole maken sneller sowieso onmogelijk. Maar de *reden* corrigeer ik: we wachten niet tot de bibliotheek verdubbeld is, we wachten tot (a) het onderhoudsbewijs in het log ouder is dan de belofte, (b) er aantoonbaar publiek is dat de eenmalige aankoop al doet, en (c) de oefenlaag draait op echte data. Het verschil is niet academisch: onder de bibliotheek-redenering zou Jason nu maandenlang cursussen gaan schrijven voor nul lezers — de grootste denkfout uit het productonderzoek. Onder deze redenering bouwt hij goedkope fundamenten die de lósse verkoop nu al beter maken, en wordt het wachten productief.

---

## 6. Wat morgen al kan, zonder abonnement

Het abonnement is geen excuus om niets te doen; het meeste hierboven is los waardevol.

- **Vandaag, een uur:** de site-aanpassingen uit §7.
- **Deze week:** het actualisatielog (een dag) en de eerste versie van het openbare box 3-dossier met zichtbare bijwerkdatum (een dag schrijfwerk) — dat is meteen het levende dossier uit de weger-prioriteit 7.
- **Daarna, 3–4 dagen:** per-vraag-antwoorden naar de server plus **"doe alleen je foute vragen opnieuw" voor iedereen** — de gratis cursus incluis. Dit is gratis leerwinst uit data die er al ligt, en het maakt de gratis cursus (de lead magnet) beter.
- **Daarna, 3–4 dagen:** **/herhalen voor iedereen, over de lessen waar je toegang toe hebt.** Gratis-cursisten oefenen over de gratis cursus, kopers over hun gekochte cursus — levenslang, want er wordt later niets teruggetrokken. College+ maakt straks de vijver groter (alle cursussen, nieuwe vragen) en voegt coach, rapport en seizoensbegeleiding toe.
- **Parallel, kost alleen avonden:** coach fase 0 — corpus-script, prompt, weigerteksten en evalset, geprototyped op de lokale LLM zonder één API-cent. **Geen publieke gratis coach-proef**: elke publieke chatbot draagt het volle AFM- en merkrisico zonder dat er iets tegenover staat; de coach gaat pas naar buiten als oefenmeester achter de betaalmuur, na de evalset en de jurist.
- **Doorlopend:** nieuwe quizvragen schrijven richting 150 bij lancering (minuten per vraag, de goedkoopste inhoudsgroei die er is) — elke vraag maakt /herhalen voor iedereen rijker en komt in het log.

---

## 7. Eerlijkheidsparagraaf: wat er nú op de site moet veranderen

Er staat op dit moment één belofte live die dit concept niet dekt, en die gaat vandaag op de schop:

1. **`src/app/page.tsx` regel 430:** de College+-kaart zegt "Beschikbaar bij lancering". Dat is een deadline zonder datum voor een product dat niet bestaat. Wordt: **"In ontwikkeling"** — zonder datum, zonder "binnenkort". `docs/ideeen.md` noemt dit zelf al "een belofte met een deadline"; die belofte stopt nu.
2. **`src/lib/pricing.ts` regel 30:** "Vragen stellen aan de AI-studiecoach" belooft een vrije chatbot. Wordt de fase 1-werkelijkheid: **"AI-oefenmeester die je foute quizantwoorden nabespreekt (in ontwikkeling — geeft nooit beleggingsadvies)"**. Minder beloven dan er komt is toegestaan; meer niet.
3. **Zelfde bestand, regel 28–32:** "Interactieve tools en rekenmachines" als College+-onderscheider klopt niet meer sinds de twee tools vandaag in de betaalde cursussen live gingen — een losse koper hééft de tool van zijn cursus. Wordt: "Alle interactieve tools, met opgeslagen invoer". En "Maandelijks opzegbaar" mag pas op de kaart zodra het maandplan echt bestaat; bij een jaarplan-eerst-lancering wordt dat "Jaarlijks, met één klik opzegbaar".
4. **De koptekst van `src/lib/pricing.ts`** zegt "MAAND is de instap en staat vooraan" — dat spreekt prijsstrategie §1.5 (jaarplan eerst tonen, ankereffect) tegen. Bij de herschrijf van de verkooppagina wordt het jaarplan het eerste getal, en het commentaar in de code gaat mee.
5. **Wat er nadrukkelijk níét gebeurt:** geen aftelklok naar de lancering, geen "binnenkort", geen wachtlijst met schaarste-taal, en geen enkel College+-kenmerk op de site dat niet in fase 1 zit. De kaart mag zeggen wat er in ontwikkeling is; hij mag niets verkopen wat er niet is. Zodra de verkoop opengaat, staat naast de prijs ook de zwakke plek: herhaling betekent dat je vragen terugziet — dat is de bedoeling — en de vijver is klein maar groeit, met de teller erbij.

De diepste eerlijkheidsregel van dit concept is dezelfde als die van het merk: **de site belooft alleen wat het log kan bewijzen.** Daarom start het log vandaag, en daarom is "College+ komt begin 2027, en tot die tijd verkopen we losse cursussen" geen zwaktebod maar het antwoord dat een eerlijke aanbieder geeft.
