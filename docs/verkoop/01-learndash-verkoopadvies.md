# 01: LearnDash' eigen verkoopboek: wat er bruikbaar is voor een winkel zonder klanten

> Geschreven 5 augustus 2026. Dit document mijnt de **commerciële** kant van LearnDash: hun eigen
> prijzenpagina, hun blogarchief, de LearnDash Academy en de cijfers die zij aanhalen. Niet de code,
> die is behandeld in `docs/learndash/01` t/m `18`.
>
> **Belangrijkste voorbehoud vooraf, en het bepaalt hoe je de rest leest.** LearnDash verkoopt
> *software aan cursusmakers*. Hun blog is een acquisitiekanaal voor die software, geen
> onderzoeksafdeling. Dat betekent: hun eigen prijzenpagina is hard bewijs van wat zij zelf durven,
> hun blogadvies is grotendeels onbeschermde meningsvorming, en hun cijfers zijn bijna nooit
> herleidbaar. Ik heb daarom alles gelabeld:
>
> | Label | Betekenis |
> |---|---|
> | **(A) Bewijs** | Waarneembaar feit, of een cijfer met een noembare bron. Je kunt het zelf controleren. |
> | **(B) Plausibele conventie** | Breed gedeelde praktijk in de markt, logisch verdedigbaar, maar niet gemeten. Prima om te volgen, niet om op te leunen. |
> | **(C) Vulling** | Contentmarketing. Klinkt als advies, zegt niets dat je kunt uitvoeren of toetsen. |
>
> **Dit is een advies, geen besluit.** Wat Jason overneemt hoort in `docs/openstaand.md` of
> `docs/ideeen.md`; dit hoofdstuk wordt niet bijgehouden.

---

## 0. Een waarschuwing over het bronmateriaal zelf

Sinds LearnDash in juni 2026 is opgegaan in Liquid Web is het blogarchief **half gesloopt**. Bij het
schrijven van dit document liep het als volgt:

- `learndash.com/blog/pricing-your-online-courses/` geeft **HTTP 410 Gone**. Weg, en expliciet als
  "permanent weg" gemarkeerd. Waargenomen 5 aug 2026. **(A)**
- `learndash.com/blog/5-course-pricing-models-explained/` geeft **301** naar
  `liquidweb.com/blog/course-pricing-models-explained/`. Werkt dus wel. **(A)**
- `learndash.com/blog/7-essentials-for-a-high-converting-course-landing-page/` loopt in een
  **redirectlus** (meer dan tien hops). Onbereikbaar. **(A)**
- Een aantal titels die in zoekresultaten nog opduikt (`7-ways-to-market-your-online-course`,
  `10-ways-to-measure-the-success-of-your-online-course`) geeft op beide domeinen **404**. **(A)**

Twee dingen om mee te nemen. Ten eerste praktisch: **een deel van hun advies is simpelweg niet meer
te lezen**, dus dit document is een steekproef en geen volledige inventarisatie. Ten tweede, en dat
is de nuttigere les: dit is precies de fout waar onze eigen SEO-huisregel in `CLAUDE.md` tegen
beschermt ("nooit een URL wijzigen of verwijderen zonder permanente redirect"). Een bedrijf dat tien
jaar lang bloginhoud bouwde om vindbaar te zijn, heeft bij een migratie een deel van die waarde
weggegooid. Onze regel is dus geen pedanterie; hier is het foutbeeld, bij het bedrijf dat het
zelf beter had moeten weten.

---

## 1. Wat LearnDash op zijn eigen koopknop doet

Dit is het waardevolste deel van het onderzoek, want het is **gedrag en geen advies**. Een bedrijf
dat tien jaar software aan cursusmakers verkoopt, heeft zijn eigen prijzenpagina wél getest.
Waargenomen op `liquidweb.com/software/learndash`, 5 aug 2026. Alles hieronder is **(A)**.

| Wat | Wat ze doen |
|---|---|
| Aantal opties | **Drie**: Essentials $259/jr, Pro $399/jr, Elite $599/jr |
| Uitgelicht | **De middelste**, met een badge "Most popular" (twee keer op de pagina) |
| Facturatie | **Alleen jaarlijks.** Geen maandoptie op de pagina |
| Knoptekst | Per tier verschillend: "Start with Essentials", "Start with Pro", "Get Elite" |
| Proberen | **Gratis demo van 48 uur, zonder creditcard.** Inloggegevens per mail |
| Garantie | Niet op de prijzenpagina; wel apart beleid: **30 dagen** bij jaarplan, 15 dagen bij het maandelijkse Cloud-plan |
| Geruststelling | "One license, unlimited courses, unlimited learners. Renews annually, cancel any time" en "No per-student fees" |
| Social proof | "100,000+ Active installs", "25M+ Learners taught", "4.8 sterren Trustpilot", "Trusted by 100,000+ creators" |
| Urgentie/schaarste | **Geen.** Geen afteltimer, geen "nog X plekken", geen tijdelijke actieprijs |

**Vijf conclusies die er direct toe doen voor ons.**

1. **Drie opties, middelste uitgelicht.** Dat is exact wat `docs/prijsstrategie.md` §4.1 al besloot
   (maximaal drie, één uitgelicht). Onafhankelijke bevestiging van een keuze die we al hadden. **(B)**
2. **Geen urgentietrucs, bij een bedrijf dat het zich makkelijk had kunnen permitteren.** Dit is het
   nuttigste enkele feit in dit document: onze regel "geen afteltimers, geen nep-schaarste"
   (`docs/prijsstrategie.md` §4.2) kost ons geen concurrentienadeel. De marktleider doet het ook
   niet. **(A)**
3. **De proefvorm is tijdgebonden en niet inhoudsgebonden**: 48 uur alles, in plaats van
   permanent-een-beetje. Wij doen het omgekeerd (negen gratis lessen, voor altijd). Beide zijn
   verdedigbaar; de hunne past bij software, de onze bij onderwijs.
4. **Alleen jaarlijks factureren, met "cancel any time" ernaast.** Dat is precies de combinatie die
   `docs/prijsstrategie.md` §1.5 voorstelt voor College+ (jaarplan eerst, geen SEPA nodig), en het
   werkt hier zonder dat het als opsluiten voelt, omdat "opzeggen wanneer je wilt" er letterlijk
   naast staat.
5. **Hun social proof is een teller, geen quote.** "100.000 installaties" is een feit dat uit hun
   eigen systeem komt. Er staat geen verzonnen testimonial. Voor ons: **tellers zijn een eerlijke
   vorm van social proof en quotes niet, zolang je nog niets verkocht hebt.** Wij hebben nu al
   tellers die waar zijn: negen cursussen, aantal lessen, aantal minuten lesmateriaal.

**Wat we hieruit níét mogen concluderen.** Dat hun tiernamen of prijsverhoudingen voor ons werken.
Zij verkopen B2B-software aan mensen met een verdienmodel; wij verkopen consumenteneducatie. De
*vorm* is overdraagbaar, de *bedragen* niet.

---

## 2. Wat ze over prijs schrijven

### 2.1 Het enige stuk gereedschap dat ze geven

De formule uit *What's the Best Pricing Model for Online Courses?*:

> **Omzet = publieksomvang × conversiepercentage × prijs**

**(C), en toch de moeite waard om op te schrijven.** Als formule is het een tautologie, maar hij
dwingt wel de juiste vraag af, en die vraag is voor ons ongemakkelijk. Vul onze cijfers in: publiek
onbekend maar dicht bij nul, conversie onbekend, prijs €49. Twee van de drie factoren kennen we
niet, en de enige die we wél kennen is de enige waar we maandenlang aan gerekend hebben
(`docs/prijsstrategie.md` is een compleet document over factor drie).

Dat is de scherpste kritiek die dit onderzoek op onze eigen situatie oplevert: **we hebben de prijs
tot achter de komma onderbouwd en de andere twee factoren staan op nul.** Niet omdat de
prijsstrategie fout is, maar omdat hij pas iets doet als er iemand kijkt.

### 2.2 Vier prijsmodellen

Uit hetzelfde artikel. Grotendeels **(C)**, met één bruikbare regel.

| Model | Wat ze zeggen | Waarde voor ons |
|---|---|---|
| Gratis | "A free course or sample lesson can also serve as a test strategy" | Doen we al, ruimer dan zij adviseren |
| Baseline | Breed publiek, lage prijs, snel te maken. "These courses may result in a lot of signups with lower participation" | **De enige echt bruikbare zin**: een lage prijs koopt inschrijvingen, geen deelname. Ondersteunt onze keuze om van €19,99 naar €49 te gaan |
| Premium | Hoogste prijs, vereist "unique content, reputable instructor, or rare subject matter" | Onze €49 zit hier bewust net onder. Klopt met §1.2 van de prijsstrategie |
| Abonnement | Onbeperkte toegang tot gated content | College+ |

### 2.3 Abonnement versus eenmalig

Uit *Subscription vs. One-Time Pricing* (het originele artikel is inmiddels onbereikbaar; deze
formuleringen komen uit zoekresultaatfragmenten en secundaire citaten, dus **de exacte tekst is niet
door mij op de bron geverifieerd**):

> "If your course delivers value over time, charge over time. If it delivers a transformation,
> charge for the result."

**(B).** Aardige beslisregel, maar hij is bij ons al toegepast en scherper geformuleerd:
`docs/prijsstrategie.md` zegt "los = bezit, College+ = doorlopend", wat hetzelfde onderscheid is
maar dan uitgedrukt in wat de klant kóópt in plaats van in wat wij leveren.

Twee observaties uit hetzelfde stuk, beide **(B)**:

- Een lager maandbedrag verlaagt de drempel: "$25 per month" voelt makkelijker dan "$199 upfront",
  ook als de klant uiteindelijk meer betaalt.
- **Een eenmalige betaling signaleert commitment en hangt samen met hogere afrondingscijfers**,
  omdat de koper mentaal en financieel al geïnvesteerd heeft.

Dat tweede punt is voor ons het interessantst, want het is een argument om **losse verkoop niet als
tussenstap naar het abonnement te zien**. Onze €49 met levenslange toegang koopt waarschijnlijk
betere afronding dan €14,99/mnd, en afronding is bij ons geen bijzaak: het certificaat is een deel
van het product. Let op dat dit een *plausibel* verband is en geen gemeten verband; LearnDash
onderbouwt het niet.

### 2.4 De positioneringsregel

Uit *How Much Can You Make Selling Courses?*:

> "A $20 course might appeal to a broader base, but a $200 course can generate significantly higher
> revenue with fewer sales, especially if it offers depth, certification, or transformation."

**(B).** Dit is dezelfde redenering als §1.2 van onze prijsstrategie, met één toevoeging die wij
niet expliciet maken: **certificering wordt als prijsrechtvaardiging genoemd**. Wij hebben
certificaten, maar `docs/wat-de-winkel-mist.md` §4 concludeert dat ze momenteel weinig waard zijn
(geen servercontrole, geen verificatiepagina, geen slaagdrempel). Als certificering een deel van de
€49 draagt, dan is die reparatie een prijsargument en niet alleen netjes.

---

## 3. Wat ze iemand met nul studenten vertellen

Dit is de kern van de opdracht, dus hier ben ik het strengst.

### 3.1 LearnDash Academy

Drie cursussen: *LearnDash 101* (de software), *Crafting Your Course* (onderwerp kiezen, lessen
structureren), *Promoting Your Course* (marketing en monetisatie). De volgorde is: gereedschap,
dan bouwen, dan verkopen. **(A)** dat dit hun volgorde is.

De vier lessen van *Promoting Your Course*, letterlijk:

1. **Create On-Ramp Products**
2. **Go Where The Audience Is**
3. **Leverage Ambassadors**
4. **Post Creative Content**

En de zin die de hele module rechtvaardigt: veel makers investeren zwaar in de cursus om vervolgens
te "launch and discover… no audience".

**Dat is exact onze situatie, en het staat bij hen op de laatste plaats van drie cursussen.** Daar
zit de scherpste les van dit hele document in, en hij is een kritiek op hun eigen curriculum zo goed
als op ons: **de publieksvraag wordt behandeld als het sluitstuk van de bouw, terwijl het de
voorwaarde ervoor is.** Wij hebben negen cursussen gebouwd (`docs/cursusfabriek.md`, 3 aug 2026) en
nul lezers. We hebben hun volgorde perfect gevolgd en zitten nu in het probleem dat hun eigen
lesmateriaal beschrijft.

Van de vier lessen is er voor een solo-operator zonder publiek precies één direct uitvoerbaar:
**Go Where The Audience Is.** "Leverage Ambassadors" vereist mensen, "On-Ramp Products" hebben we al
(de gratis cursus is er een), "Post Creative Content" is **(C)**.

### 3.2 De promotievolgorde die ze aanraden

Uit *How to Promote Your First Online Course* (liquidweb.com), expliciet gericht op de eerste
cursus. Hun volgorde:

1. **Een cursuslandingspagina**: kop, beschrijving, beeld of video, social proof, transparante
   prijs, FAQ (zij zeggen "up to ten questions"), meerdere calls to action.
2. **De e-maillijst benutten**: segmenteren, duidelijke onderwerpregels, nieuwsbrief met echte
   inhoud.
3. **Sociale media**: Facebook-groepen, YouTube (gratis inhoud), LinkedIn, TikTok, X, Instagram.
4. **Een webinar geven.**

Twee citaten die er inhoudelijk toe doen:

> "Use free content. This familiarizes your audience with your teaching style and proves you can
> provide value."

**(B), en voor ons het belangrijkste zinnetje uit de hele blog.** Het herformuleert waar gratis
inhoud vóór is: niet om het curriculum te tonen, maar om te bewijzen dat jouw *manier van uitleggen*
deugt. Onze negen gratis lessen doen dat al. Wat we er niet uit halen is een e-mailadres en een
tweede contactmoment.

> Over social proof bij een eerste cursus: "think about including positive comments or DMs from your
> audience".

**Dit is de eerste plek waar hun advies tegen onze merkregels aan schuurt.** Zie §6.

### 3.3 Zeven manieren om geld te verdienen

Uit *7 Ways to Make Money Selling Online Courses*. De meeste zijn **(C)**, twee zijn relevant:

- **"Offer the course for free, then charge for certification."** Ze noemen dat Coursera hiermee
  "over $1 million in their first year" verdiende. **Cijfer zonder herleidbare bron, dus (C) als
  bewijs**, maar het model zelf is **(B)** en het is voor ons opvallend: wij geven negen lessen én
  het certificaat gratis weg. Ik stel niet voor dat te veranderen (het botst met "royaler dan de
  concurrent" uit `docs/prijsstrategie.md` §1.1), maar het is wel het onbenutte scharnier: het
  certificaat is het enige onderdeel van de gratis cursus met externe waarde.
- **"Pre-sell your course."** Valideer vraag vóór je bouwt, met "a free pilot lesson to test your
  idea and build up a subscriber list". **(B).** Voor ons grotendeels te laat (negen cursussen
  staan er al), maar wél toepasbaar op de **volgende** cursus: `docs/volgende-cursussen.md` noemt
  Portefeuillebouw & Risicobeheer als eerstvolgende. Die zou je kunnen aankondigen vóór je hem
  bouwt, en de aanmeldingen tellen. Nul aanmeldingen is dan een goedkoop antwoord.

### 3.4 Marktonderzoek

Uit *How to Conduct Market Research for Your Online Course*: onderwerp bepalen (marktplaatsen als
Udemy bekijken, zoekwoordonderzoek), een leerderspersona maken, een enquête uitzetten
(SurveyMonkey, Google Forms), concurrentie analyseren (SWOT), actieplan opstellen. Geen enkel
getal in het hele artikel.

**(C) als geheel**, met één uitzondering: hun enquêtevraag "if you offered a course on a chosen
topic, would they take it?" is **(B)** en voor ons goedkoop uit te voeren, want we hebben al een
kanaal waar mensen ons iets vragen: de redactionele lesvragen (`src/lib/lesvragen.ts`). Wie een
vraag stelt bij een gratis les, heeft aandacht en is bereikbaar.

---

## 4. Cijfers en benchmarks die zij noemen

Hier is het oordeel het hardst, want dit is waar contentmarketing zich als data voordoet.

| Claim | Waar het vandaan komt | Oordeel |
|---|---|---|
| Gemiddelde afrondingsgraad online cursussen: **10 tot 15%** | Rondgezongen in het LearnDash-ecosysteem. Het originele artikel *Why Course Completion Rates Matter* dat het zou onderbouwen, **noemt in de huidige versie geen enkel cijfer en geen enkele bron** | **(C) als bewijs.** Wel als **(B) verwachtingsanker** bruikbaar: reken niet op hoge afronding |
| Wereldwijde e-learningmarkt $250,8 mrd (2020) naar $457,8 mrd (2026) | GlobeNewswire, in *How Much Can You Make Selling Courses?* | **(A) dat de bron genoemd wordt**, maar marktomvang zegt niets over een Nederlandse niche-webshop. Irrelevant voor ons |
| Nieuwe makers verdienen $500 tot $5.000 per maand | Kale bewering, geen bron | **(C)** |
| "99,9% van de consumenten kijkt naar reviews vóór een aankoop" | Aangehaald in het Course Reviews-artikel, zonder herleidbare bron | **(C)**, en het getal is op zijn gezicht al ongeloofwaardig |
| Klantvoorbeelden ("10.000+ leden", "400+ actieve studenten", "200+ betalende leden") | Eigen klantcases | **(A) als anekdote, (C) als benchmark.** Overlevingsbias: je ziet alleen wie het haalde |
| "100.000+ installaties", "25M+ learners" op hun prijzenpagina | Eigen telemetrie | **(A)**, en het beste voorbeeld van eerlijke social proof in dit hele dossier |

**De conclusie over hun cijfers is streng en eenvoudig: er valt geen enkele benchmark uit LearnDash
te halen waar je een besluit op mag baseren.** Geen conversiepercentages, geen refundpercentages,
geen prijselasticiteit. Wie een getal nodig heeft, moet elders zoeken. Dat is niet erg, maar het
betekent wel dat de bestaande cijfers in `docs/prijsstrategie.md` (freemium 2 tot 5%, churn 30 tot
50%) hier **niet** door bevestigd of weerlegd worden. Ze blijven staan op hun eigen bronnen.

---

## 5. Refunds en afronding

### 5.1 Wat ze zelf doen

LearnDash' eigen beleid, waargenomen op `liquidweb.com/policies/learndash-refund`: **30 dagen bij
een jaarplan, 15 dagen bij het maandelijkse Cloud-plan.** Twee dingen zijn interessant aan de
formulering. **(A)**

> "We're committed to making your experience with LearnDash a pleasure at all times, even if that
> means providing a refund."

En: klanten moeten eerst "submit a support request" voordat ze terugbetaling vragen, plus
"Canceling your subscription does not automatically trigger a refund."

**Dat eerste is een drempel in vriendelijke verpakking**, en het is precies het soort constructie
waar de ACM in Nederland bezwaar tegen maakt bij opzegprocedures. Voor ons niet overneembaar: onze
juridische situatie (`docs/prijsstrategie.md` §5.2 en §5.3) is strenger, en sinds 19 juni 2026 is
een online herroepingsknop verplicht. **Niet kopiëren.**

Het bruikbare deel is de **vorm**: een genoemde termijn ("30 dagen") is concreter en
geruststellender dan "neem contact op". Onze losse cursus sluit het herroepingsrecht juist uit via
de twee-handelingen-constructie. Dat mag, maar het is wel het tegenovergestelde signaal van wat een
reassurance-first merk uitstraalt. **Dat is een echte spanning en die staat nog nergens
opgeschreven.** Zie §7 punt 6.

### 5.2 Afronding verhogen

Uit *Why Course Completion Rates Matter (And How to Improve Them)*. Zeven tactieken, waarvan er drie
voor ons nieuw of onbenut zijn:

1. **Wees vooraf expliciet over tijdsbesteding.** Zet in de cursusbeschrijving hoe lang het duurt,
   hoeveel tijd per week, wat de omvang is. **(B)** en bij ons **niet gedaan**: onze cursuspagina's
   noemen lessen, niet uren. Dit is een tekstwijziging van een uur en het verlaagt bovendien
   refundgronden ("het was meer werk dan ik dacht").
2. **Microlearning: lessen van 1 tot 15 minuten.** Wij zitten daar al in (60 betaalde lessen,
   ongeveer 540 minuten, dus gemiddeld negen minuten). Bevestiging, geen actie.
3. **Analyseer waar mensen afhaken.** "Examine when and where learners stop engaging." **(B).**
   Wij hebben de data (`lesson_progress`), we kijken er alleen niet naar, en de bezoekmeting
   (Umami) staat nog uit (`docs/analytics.md`).
4. Persoonlijk contact opnemen bij achterblijvers, binnen 24 uur reageren, community bouwen,
   gamification. Van deze vier: gamification hebben we, community is bewust afgevallen
   (`docs/ideeen.md`), en "binnen 24 uur reageren" belooft precies de nakijkcapaciteit die we
   bewust níét beloven bij de lesvragen. **Niet overnemen.**

### 5.3 Onboardingmail

Uit het LearnDash-ecosysteem rond hun Notifications-add-on: welkomstmail binnen minuten na
inschrijving, navigatiegids na een paar dagen, voortgangscheck rond week één, en niet meer dan één
mail per dag. **(B).**

Relevant omdat mail bij ons **sinds vandaag werkt** (`docs/e-mail-versturen.md`, DMARC terug op
`p=reject`). We hebben nu precies één transactionele mail: de orderbevestiging. Er is geen
welkomstmail, geen inactiviteitsmail en geen voltooiingsmail. Dat laatste stond al als punt 4 in
`docs/learndash/18-wat-we-ermee-doen.md`.

---

## 6. Wat botst met onze eerlijkheidsregels

Vier dingen, en ze staan hier om **niet** gedaan te worden.

**1. "Voeg positieve reacties en DM's toe als je nog geen reviews hebt."**
Uit *How to Promote Your First Online Course*. Dit is testimonial-farming met een nette naam: het
maakt losse aanmoedigingen visueel gelijk aan geverifieerde klantoordelen. Onze regel is hard (geen
verzonnen social proof, `CLAUDE.md`), en de drie testimonials van de oude site zijn hier al een keer
om verwijderd. **Niet doen.** Het eerlijke alternatief staat in §1: tellers uit ons eigen systeem.

**2. "Direct na je webinar is het perfecte moment voor tijdelijke aanbiedingen."**
Uit hetzelfde artikel. Kunstmatige urgentie. Botst met `docs/prijsstrategie.md` §4.2 (geen
afteltimers, geen tijdelijke acties) en met de Omnibus-regel over referentieprijzen: wij hebben nooit
iets verkocht, dus er is geen "van"-prijs die we mogen tonen. Extra pikant: **LearnDash doet dit op
zijn eigen prijzenpagina zelf niet.** Ze adviseren een truc die ze zelf niet nodig hebben. **Niet
doen.**

**3. Inkomstensuggesties ("nieuwe makers verdienen $500 tot $5.000 per maand").**
Voor hén marketing richting cursusmakers. Voor óns zou het equivalent ("cursisten behalen gemiddeld
X% rendement") niet alleen misleidend zijn maar direct richting AFM-terrein gaan. Dit is de reden
waarom `docs/prijsstrategie.md` §5.6 bestaat. **Niet doen, in geen enkele formulering.**

**4. Een refund-aanvraag achter een verplichte supportronde zetten.**
Zie §5.1. Bij hen beleid, bij ons in Nederland juridisch riskant en merkinconsistent.

Wat opvalt als je deze vier naast elkaar zet: **het slechtste advies staat in de blog, het beste
gedrag staat op hun eigen koopknop.** De blog moet klikken winnen, de prijzenpagina moet omzetten.
Als vuistregel voor toekomstig bronnenonderzoek is dat de moeite waard: kijk naar wat een bedrijf
doet waar het zelf geld verdient, niet naar wat het schrijft om gevonden te worden.

---

## 7. Wat een solo-operator hiermee kan, op volgorde

Gerangschikt op (waarde voor een winkel zonder klanten) gedeeld door (uren van Jason). Alles wat
alleen met publiek werkt, staat onderaan.

### Doen

**1. Zet tijdsbesteding op elke cursuspagina.** ("Refine course description", §5.2.) Negen lessen
zegt niets; "ongeveer 90 minuten, in tien avonden van tien minuten" zegt wel iets. Verlaagt de
drempel én de teleurstelling achteraf. Eén uur werk, raakt geen enkel geldpad. **(B)**

**2. Vang een e-mailadres af aan het eind van de gratis cursus.** Hun hele promotievolgorde hangt op
stap 2 (de lijst), en wij hebben negen gratis lessen die nu niets achterlaten. De
nieuwsbriefroute bestaat al (`POST /api/nieuwsbrief`, met ratelimiet). Het ontbrekende stuk is de
plaats: het moment ná de laatste gratis les is het enige moment waarop iemand aantoonbaar tevreden
is. Let op: dit moet vrijwillig blijven en het certificaat mag er niet achter komen te liggen, want
dan is het een muur en geen uitnodiging. **(B)**

**3. Voltooiingsmail met certificaatlink.** Stond al als punt 4 in
`docs/learndash/18-wat-we-ermee-doen.md`, en dit onderzoek versterkt het langs twee lijnen: het is
hun eerste onboardingtrigger (§5.3) én het certificaat is een prijsrechtvaardiging (§2.4). Mail
werkt sinds vandaag. **(B)**

**4. Gebruik tellers als social proof, nooit quotes.** Negen cursussen, 60 betaalde lessen,
ongeveer 540 minuten. Waar, controleerbaar, en het is de vorm die LearnDash zelf kiest. Zet het op
de homepage en de prijzenpagina. Vervangt de verleiding uit §6 punt 1. **(A)**

**5. Ga waar het publiek is, en accepteer dat dit het enige echte antwoord is.** Van de vier lessen
in *Promoting Your Course* is dit de enige die zonder bestaand publiek werkt. Voor ons betekent dat
concreet: de gratis cursus is het product dat je promoot, niet de betaalde. Dit is de duurste post
op deze lijst in uren van Jason en de enige die de omzetformule uit §2.1 op factor één raakt. **(B)**

**6. Beslis expliciet wat het herroepingsrecht doet aan het merk.** (§5.1.) Nu is de keuze puur
juridisch gemaakt: uitsluiten mag, dus we sluiten uit. Maar "geen bedenktijd" naast "wij zijn de
eerlijke aanbieder" is een spanning, en LearnDash zet er niet voor niets "30 dagen" bij. Dit is een
besluit voor Jason, geen bouwtaak, en het is gratis om te nemen zolang er nul klanten zijn.

### Overwegen

**7. Kondig de volgende cursus aan vóór je hem bouwt.** (§3.3, pre-selling.) Portefeuillebouw &
Risicobeheer is de eerstvolgende. Aanmeldingen tellen is een goedkope vraagtest, mits je niets
belooft wat je niet levert en geen geld vraagt voor iets dat nog niet bestaat. **(B)**

**8. Kijk waar mensen afhaken in de gratis cursus.** (§5.2 punt 3.) De data staat al in
`lesson_progress`. Eén SQL-query is genoeg; een dashboard is dat nadrukkelijk niet (zie
`docs/learndash/18` punt 11). **(B)**

**9. Vraag de mensen die al lesvragen stellen wat ze zouden kopen.** (§3.4.) Dat kanaal bestaat en
die mensen zijn aantoonbaar betrokken. Het is de goedkoopste vorm van marktonderzoek die we hebben.

### Niet doen

**10.** Alles uit §6. **11.** Webinars, ambassadeurs en affiliate-programma's: die vragen allemaal
een publiek dat er nog niet is, dus ze staan hier niet als "slecht" maar als "verkeerde volgorde".
**12.** Reviews verzamelen: pas relevant na tientallen klanten, en dat stond al in
`docs/learndash/18` punt 17.

---

## 8. Wat hiervan geldt voor een winkel zonder klanten

Dit is de kern, en het is oncomfortabel.

**Het meeste verkoopadvies van LearnDash veronderstelt een publiek, en wij hebben er geen.** Van
alles wat ik gelezen heb, gaat verreweg het grootste deel over *converteren* van mensen die al
kijken: landingspagina's, e-mailsegmentatie, upsells, bundels, reviews, webinars. Dat is niet
verkeerd, het is alleen de tweede helft van het probleem. Wij zitten in de eerste helft, en daar
gaat één van hun vier promotielessen over.

**Vier dingen die daaruit volgen.**

**Ten eerste: onze prijs is niet het probleem, en dat weten we nu beter.** De omzetformule uit §2.1
maakt zichtbaar dat we één van de drie factoren tot achter de komma hebben uitgerekend terwijl de
andere twee op nul staan. `docs/prijsstrategie.md` is goed werk en het blijft staan. Het levert
alleen niets op tot er iemand op de pagina komt. Verder aan de prijs sleutelen is uitstel.

**Ten tweede: de gratis cursus is het product dat verkocht moet worden, niet de betaalde.** Dit is
de enige plek waar hun advies en onze situatie precies op elkaar passen ("use free content… proves
you can provide value", §3.2). Negen volledige gratis lessen zijn royaler dan wat de Nederlandse
concurrentie weggeeft (`docs/prijsstrategie.md` §1.1). Dat is nu een kostenpost en geen kanaal,
omdat er niets achteraan komt: geen e-mailadres, geen volgend contactmoment, geen mail als iemand
klaar is. **Punt 2 en 3 uit §7 zijn samen minder dan een dag werk en ze veranderen de gratis cursus
van een etalage in een trechter.**

**Ten derde: nul klanten is precies het goede moment voor de besluiten die later duur worden.** Dat
argument staat al in `docs/prijsstrategie.md` §1.2 over herprijzen, en het geldt breder: de keuze
over het herroepingsrecht (§7 punt 6), de vorm van social proof (§7 punt 4), en het besluit om géén
urgentietrucs te gebruiken kosten vandaag niets en zijn met honderd klanten een migratie of een
reputatiekwestie. LearnDash' eigen prijzenpagina bewijst dat je zonder die trucs marktleider kunt
worden.

**Ten vierde, en dit is het echte antwoord: het knelpunt is niet de winkel maar de aandacht.** De
winkel is dicht (geen live betaalsleutel), maar dat is niet wat de eerste verkoop tegenhoudt. Zelfs
met een open winkel en een perfecte prijzenpagina verkoopt een site zonder bezoekers nul. **Wat dit
onderzoek eigenlijk oplevert is dat de volgende inspanning niet in het platform hoort te zitten.**
Er is negen cursussen lang gebouwd; wat ontbreekt is het eerste publiek. Dat is bovendien het enige
punt op deze hele lijst dat een agent niet voor Jason kan doen.

**En één praktische waarschuwing tot slot:** de winkel moet wél open voordat er publiek is, niet
erna. Nu staat er een testsleutel in Vercel, dus wie vandaag zou willen kopen, kan dat niet. Dat is
een bewust besluit van Jason (zie de memory-notitie bij payments) en het blijft zijn besluit. Maar
de volgorde die uit dit onderzoek volgt is: **winkel open, dan trechter dicht, dan publiek zoeken.**
Andersom verbrand je de eerste bezoekers die je met moeite hebt gevonden.

---

## Bronnen

Alle URL's geraadpleegd op 5 augustus 2026. Waar een `learndash.com`-adres 301 doorstuurt naar
`liquidweb.com` staat het eindadres vermeld; waar een pagina 404, 410 of een redirectlus gaf, is dat
expliciet genoteerd, want dat is zelf een bevinding (§0).

**LearnDash' eigen commerciële pagina's**
- [LearnDash prijzen en productpagina (liquidweb.com/software/learndash)](https://www.liquidweb.com/software/learndash/): tiers, badges, social proof, 48-uursdemo, afwezigheid van urgentie
- [LearnDash restitutiebeleid](https://www.liquidweb.com/policies/learndash-refund/): 30 dagen jaarplan, 15 dagen maandplan, verplichte supportronde
- [LearnDash Academy](https://academy.learndash.com/): drie cursussen en hun volgorde
- [LearnDash Academy, Promoting Your Course](https://docs.nexcess.com/software/learndash/academy/promoting-your-course/): de vier lestitels

**Blog: prijs en verdienmodel**
- [What's the Best Pricing Model for Online Courses?](https://www.liquidweb.com/blog/course-pricing-models-explained/): vier modellen, omzetformule
- [How Much Can You Make Selling Courses?](https://www.liquidweb.com/blog/how-much-can-you-make-selling-courses/): marktomvang, inkomensbeweringen, klantcases
- [7 Ways to Make Money Selling Online Courses](https://www.liquidweb.com/blog/ways-to-make-money-selling-online-courses/): certificering als betaalpunt, pre-selling
- [Subscription vs. One-Time Pricing](https://www.learndash.com/blog/online-course-pricing-subscription-vs-one-time/): **origineel gaf 404; inhoud uit zoekresultaatfragmenten, niet op de bron geverifieerd**
- [Pricing Your Online Courses](https://www.learndash.com/blog/pricing-your-online-courses/): **HTTP 410 Gone, niet te lezen**

**Blog: promotie, conversie en marktonderzoek**
- [How to Promote Your First Online Course](https://www.liquidweb.com/blog/how-to-promote-your-first-online-course/): de promotievolgorde, gratis inhoud, en de twee adviezen uit §6
- [How to Conduct Market Research for Your Online Course](https://www.liquidweb.com/blog/how-to-conduct-market-research-for-your-online-course/): persona, enquête, SWOT
- [Get Student Feedback with the LearnDash Course Reviews Add-on](https://www.liquidweb.com/blog/course-reviews-add-on-available-for-learndash/): reviews, en het onhoudbare 99,9%-cijfer
- [7 Essentials for a High-Converting Course Landing Page](https://www.learndash.com/blog/7-essentials-for-a-high-converting-course-landing-page/): **redirectlus, onbereikbaar**
- [How to Create a Winning LearnDash Course Sales Page](https://www.learndash.com/blog/creating-a-learndash-course-sales-page/): **HTTP 410 Gone**; het advies over "risk reversal, such as a money-back guarantee" komt uit zoekresultaatfragmenten en is niet op de bron geverifieerd

**Blog: afronding, betrokkenheid en mail**
- [Why Course Completion Rates Matter (And How to Improve Them)](https://www.liquidweb.com/blog/improve-online-course-completion-rates/): zeven tactieken, en opvallend: géén cijfers in de huidige versie
- [Gamification: A Guide for Course Creators](https://www.liquidweb.com/blog/gamification-for-course-creators/): zes elementen, nul bronvermeldingen
- [How to Build an Engaging Online Learning Community](https://www.liquidweb.com/blog/build-online-learning-community/): cohorten, groepsleiders, peer teaching
- [8 Metrics Every Course Creator Should Track](https://www.learndash.com/blog/8-metrics-every-course-creator-should-track/): **HTTP 410 Gone**

**Interne documenten waar dit op voortbouwt**
- `docs/learndash/18-wat-we-ermee-doen.md`: de technische afweging over hetzelfde ecosysteem
- `docs/prijsstrategie.md`: prijzen, prijzenpagina, juridische randvoorwaarden
- `docs/wat-de-winkel-mist.md`: de zes ontbrekende delen, deels ingehaald
- `docs/college-plus-concept.md`, `docs/volgende-cursussen.md`, `docs/analytics.md`, `docs/e-mail-versturen.md`
