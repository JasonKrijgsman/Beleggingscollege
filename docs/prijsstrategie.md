# Prijsstrategie Beleggingscollege

Laatst bijgewerkt: 2 augustus 2026. Beslisdocument voor prijzen, pakketten, prijzenpagina en de
juridische randvoorwaarden. Gebaseerd op marktonderzoek naar Nederlandse aanbieders (augustus 2026)
en onderzoek naar het combineren van losse verkoop met een abonnement. Bronnen staan onderaan.

Verwante documenten: `docs/betalingen-mollie.md` (betaalstatus en bouwplan), `CLAUDE.md` (merk en
architectuur), `src/lib/pricing.ts` (de prijzen zoals ze nu in de code staan).

---

## 0. De beslissing in één tabel

| Product | Prijs (incl. 21% btw) | Netto (ex btw) | = maanden College+ | Wanneer live |
|---|---|---|---|---|
| **Beleggen voor Beginners** (9 lessen) | **Gratis** | — | — | Nu |
| **Losse cursus**, levenslange toegang | **€49** | €40,50 | 3,3 | Fase 1 (iDEAL/kaart) |
| **Duo-bundel** (beide betaalde cursussen) | **€79** | €65,29 | 5,3 | Fase 1, vervalt bij lancering College+ |
| **College+ maand** | **€14,99/mnd** | €12,39 | 1 | Fase 2 (SEPA-incasso nodig) |
| **College+ jaar** | **€149/jaar** (€12,42/mnd) | €123,14 | 10 | Fase 2 (kan zonder SEPA) |
| Upgrade-krediet los → College+ jaar | betaald bedrag in mindering, max €49 | — | — | Fase 2 |

Drie wijzigingen ten opzichte van vandaag: de losse prijs gaat van €29 naar **€49**, er komt een
**jaarplan van €149**, en losse verkoop gaat **eerst** live — het abonnement volgt.

---

## 1. Onderbouwing per bedrag

### 1.1 Beleggen voor Beginners blijft gratis — en dat is geen weggeefactie meer, maar een toegangseis

Elke serieuze Nederlandse aanbieder heeft gratis instapcontent: Beleggingsinstituut (gratis cursus,
quiz met 25.000+ deelnemers, podcast, e-books), Happy Investors (40+ uur "t.w.v. €1.000"),
LOI/NHA/NTI/Laudius (gratis proefles), Soofos (30 dagen), en LYNX, DEGIRO en BelegWijs geven
hun hele educatie gratis weg. Negen volledige lessen weggeven is dus niet naïef — het is royaler
dan de meeste concurrenten en je mag dat ook zo zeggen. Het is bovendien het enige eerlijke
antwoord op "wat als ik eerst wil proeven?", zonder proefabonnement met incassorisico.

Reken conservatief: freemium converteert doorgaans 2–5% naar betaald. Bij 1.000 mensen die de
gratis cursus afronden zijn ~30 kopers realistisch (≈ €1.470 bruto, €1.215 netto bij €49).

### 1.2 Losse cursus: €49

**Marktdata.** Een serieuze losse beleggingscursus in Nederland kost €99–€499: Beleggingsinstituut
€99 (beginners) tot €499 (strategie), Happy Investors €60–€199, Nowheredays €97, LOI €510 (actie
€259), NHA €319 (actie €279), De Beleggingscursus €499,95. Onder de €50 kom je in het generieke
thuisstudiesegment: Laudius €19,99, Udemy €9,99–€19,99. Daar signaleert de prijs zélf "hobbycursus".
De historische €19,99 (en zeker €4,99) zit dus niet alleen onder de markt — hij vertelt de bezoeker
iets over de inhoud dat niet klopt.

**Anti-kannibalisatie.** De vuistregel is: losse prijs ≥ 3–5 maanden abonnement. Bij €14,99/mnd is
dat €45–€75. Onder ~3 maanden verdwijnt het abonnement (dan is "één maand nemen, alles doorlopen,
opzeggen" altijd de rationele keuze); boven ~8 maanden verdwijnt de losse verkoop. €49 = 3,3
maanden en zit netjes aan de onderkant van die band — passend bij een merk dat toegankelijk wil zijn.

**Waarom niet €99?** Dat is marktconform maar niet merkconform. €99 hoort bij aanbieders met
docentbegeleiding, live webinars, community of signalen. Beleggingscollege levert zelfstudie met
quizzen, XP en certificaat. €49 is de eerlijke prijs voor precies dát, en nog steeds ruim boven het
bulksegment.

**Ondergrens.** €39 werkt nog net (2,6 maanden), maar dan wordt het abonnement dominant zodra
iemand meer dan één cursus wil. Ga niet lager. Ga ook niet differentiëren per cursus (€49 voor
Waardebeleggen en €29 voor Technische Analyse): één prijs voor alles is eerlijker, simpeler uit te
leggen en voorkomt dat je impliciet zegt dat de ene cursus minder waard is.

**Het moment.** Je hebt nog nooit iets verkocht. Er is geen prijshistorie om te verdedigen en geen
bestaande klant die zich benadeeld voelt. Dit is het goedkoopste moment dat je ooit krijgt om te
herprijzen. (Let op: juist omdat je nooit €19,99 hebt gerekend, mag je die prijs ook niet
doorgestreept tonen — zie §5.1.)

### 1.3 Duo-bundel: €79 — tijdelijk, en alleen zolang College+ nog niet bestaat

Twee cursussen los is €98. Een bundel op €79 (19% korting) beloont wie alles wil, zonder dat je
kortingsacties nodig hebt. In fase 1 bestaat er nog geen abonnement, dus er is niets te
kannibaliseren: elke bundelverkoop is winst.

**Bij lancering van College+ vervalt de duo-bundel.** Reden: bij drie betaalde cursussen zou een
bundel van €119–€129 pal naast het jaarplan van €149 komen te liggen, en dan verkoop je twee keer
bijna hetzelfde. Bovendien wil je op de prijzenpagina maximaal drie opties (§4). Alle
bundelkopers houden uiteraard levenslange toegang tot wat ze gekocht hebben.

### 1.4 College+ maand: €14,99 — houden

De markt kent twee clusters. Brede Nederlandse leerabonnementen zitten op **€12,50–€19,95/mnd**
(Soofos €12,50–€19, Unschooled €19,95, Beleggers Belangen €15,95, Skillshare ≈€13). Beleggings-
specifieke lidmaatschappen zitten op **€45–€59/mnd** (Beleggingsinstituut €45,83, Happy Investors
€59). Het verschil zit volledig in koop-/verkoopsignalen, modelportefeuilles en persoonlijke
begeleiding — precies wat Beleggingscollege bewust niet doet en niet wil doen.

€14,99 zit dus goed in het eerste cluster en dat is een bewuste positioneringskeuze, geen
onderprijzing. Wil je ooit naar €25–€29 (Nowheredays-niveau), dan moet daar community of
live-begeleiding tegenover staan. Doe dat niet omdat het meer oplevert; doe het alleen als je die
belofte ook waarmaakt.

### 1.5 College+ jaar: €149 — het belangrijkste nieuwe product

**Waarom.** €149/jaar = €12,42/mnd, ofwel 17% korting: "twaalf maanden voor de prijs van tien".
Dat is exact de meest gebruikte kortingshoogte (16,7%). Onder 15% motiveert het niet, boven 30%
signaleert het dat je maandprijs opgeblazen is. De Nederlandse markt normaliseert dit al: Soofos
€149,95/jaar, Unschooled €143,40/jaar, MasterClass en Skillshare verkopen vrijwel alleen jaarlijks.
Toevallig-of-niet komt €149 exact overeen met Soofos, de beste model-analoog die er is.

**Twee praktische voordelen die zwaarder wegen dan de korting:**

1. **Het jaarplan is één betaling en heeft dus géén SEPA-incasso nodig.** iDEAL, kaart, PayPal en
   Apple Pay staan al live. Je kunt College+ jaarlijks lanceren zonder op Mollie te wachten.
2. **Retentie.** Een abonnement met een statische catalogus die je in een weekend uitkijkt, heeft
   geen retentiegrond. Waar de gemiddelde abonnementsdienst ~5%/mnd churn kent (levensduur ≈ 20
   maanden), moet je hier rekenen op 30–50% churn → levensduur 2–3 maanden → LTV €30–45. Dat is
   mínder dan één losse cursus van €49. Een jaarplan koopt 12 maanden in één keer af en draait dat
   probleem om.

**Anker.** Toon het jaarplan als eerste, in maandequivalent: "€12,42 per maand, jaarlijks betaald
(€149)" naast "€14,99 per maand". Bezoekers verankeren op het eerste getal dat ze zien.

### 1.6 Upgrade-krediet: wat je los kocht, gaat van je eerste jaar af

Wie eerder een losse cursus (of de duo-bundel) kocht, krijgt dat bedrag — tot maximaal €49 — in
mindering op het eerste jaar College+. Dit is de standaard anti-kannibalisatiemove: bestaande
kopers *upgraden* in plaats van zich bestraft te voelen. Het haalt ook de enige echte twijfel weg
bij de losse koop ("straks komt er een abonnement en heb ik te veel betaald"), wat past bij een
merk dat op geruststelling stuurt.

Praktisch: als code of automatisch verrekend bij het aanmaken van het abonnement; geldig tot 12
maanden na de losse aankoop; niet stapelbaar en niet in contanten uit te keren. Zet dat zo in de
voorwaarden.

### 1.7 Wat we bewust níét doen

| Optie | Besluit | Reden |
|---|---|---|
| Lifetime all-access (à la Soofos €399) | **Niet nu** | Met 3–4 cursussen niet te verdedigen, en je ruilt toekomstige LTV in voor cashflow die je niet nodig hebt. Heroverwegen bij 8+ cursussen. |
| Credits (1 cursus per maand) | **Niet doen** | Derde mentaal model bovenop twee prijsvormen; complexiteit weegt niet op tegen de winst bij 3–4 cursussen. |
| Prijs per cursus differentiëren | **Niet doen** | Eén prijs is eerlijker en simpeler; verschil in prijs leest als verschil in kwaliteit. |
| Tripwire van €27 (zoals Beleggingsinstituut) | **Niet doen** | Een minimale betaalstap tussen gratis en betaald is een verkooptruc, geen onderwijskeuze. Onze gratis cursus is al de proef. |
| Gratis proefmaand College+ | **Niet in fase 2** | Proefabonnementen mogen wettelijk nooit stilzwijgend verlengen, dus je krijgt de retentie niet en wél het incassorisico. |
| Doorgestreepte "van"-prijzen | **Mag niet** | Je hebt nooit iets verkocht, dus er is geen referentieprijs (§5.1). |
| Nep-optie om College+ beter te laten lijken (decoy) | **Niet doen** | Het decoy-effect repliceert nauwelijks (11 van 91 pogingen in het onderzoek van Yang & Lynn), en het is precies het commerciële trucje dat we niet willen kopiëren. |

---

## 2. Wat je precies krijgt — feature-matrix

| | Gratis | Losse cursus (€49) | College+ (€14,99/mnd of €149/jr) |
|---|---|---|---|
| Beleggen voor Beginners (9 lessen) | ✅ | ✅ | ✅ |
| De gekozen betaalde cursus | — | ✅ | ✅ |
| Álle betaalde cursussen | — | — | ✅ |
| Nieuwe cursussen die later verschijnen | — | — | ✅ zolang je abonnement loopt |
| Updates en herzieningen van je cursus | ✅ | ✅ | ✅ |
| Alle lessen, quizzen, XP, levels, streaks | ✅ | ✅ | ✅ |
| Badges | ✅ | ✅ | ✅ |
| Printbaar certificaat per afgeronde cursus | ✅ | ✅ | ✅ |
| Interactieve tools en rekenmachines (v2) | beperkt | — | ✅ |
| AI-studiecoach (v2) | — | — | ✅ |
| **Toegangsduur** | zolang het platform bestaat | **levenslang** (zolang het platform bestaat) | zolang je abonnement loopt |
| Toegang na stoppen/opzeggen | n.v.t. | blijft | **vervalt** — voortgang en certificaten blijven wel |
| Betaalvorm | — | eenmalig | maand of jaar |
| Opzeggen | n.v.t. | n.v.t. | maandelijks, in je account, één klik |

**Ja: losse koop geeft levenslange toegang.** Dat rechtvaardigt de €49, past bij "eerlijk
onderwijs" en werkt bewezen naast een abonnement (Domestika doet precies dit naast Skillshare).
Twee dingen moet je daarbij wél expliciet regelen:

- In de voorwaarden: *"levenslang" betekent zolang Beleggingscollege bestaat en de cursus aanbiedt.*
  Beloof geen eeuwigheid die je niet kunt garanderen.
- Als je toch stopt: minimaal drie maanden van tevoren melden en het cursusmateriaal downloadbaar
  maken (pdf). Zet die belofte in de voorwaarden — het kost je vrijwel niets en het is precies het
  soort toezegging waar dit merk om moet draaien.

**Het verschil dat je verkoopt is niet prijs, maar soort.** Verkoop geen twee prijzen voor
hetzelfde ding; verkoop twee verschillende dingen:

- **Los = bezit.** Eén cursus, eenmalig betalen, voor altijd van jou, geen verplichting.
- **College+ = doorlopend.** Alles wat er is én alles wat erbij komt, plus de tools die alleen
  doorlopend te leveren zijn. Stopt wanneer jij stopt.

---

## 3. Kannibalisatiecheck

| Wat de bezoeker overweegt | Prijs | = maanden College+ | Werkt het? |
|---|---|---|---|
| Eén cursus los | €49 | 3,3 | ✅ Ruim boven de ondergrens van 3 |
| Duo-bundel (fase 1) | €79 | 5,3 | ⚠️ **Vervallen op 3 aug 2026**: "beide betaalde cursussen" bestaat niet meer — er zijn er acht. Nooit gebouwd; een eventuele bundel is een nieuw besluit. |
| Twee cursussen los, geen bundel | €98 | 6,5 | ✅ Abonnement wint bij wie álles wil |
| Drie cursussen los | €147 | 9,8 | ✅ Jaarplan €149 wint direct, mét toekomstige cursussen |
| Alles los (stand 3 aug 2026: 7×€49 + €29) | €372 | 24,8 | ✅ Het relevante anker geworden: College+ jaar is 2,5× goedkoper dan alles los |
| College+ jaar | €149 | 10 | ✅ Rekent zichzelf uit vanaf ~2 cursussen |

De conclusie die je op de pagina mag zetten zonder te overdrijven: **wil je één onderwerp, koop dan
los. Wil je meer dan één, dan is College+ goedkoper.** Dat is geen verkooppraatje, dat is rekenwerk
dat de bezoeker zelf kan controleren.

---

## 4. Hoe de prijzenpagina eruitziet

### 4.1 Structuur

Maximaal drie opties. Meer keuze verlaagt de conversie hard (de klassieke jamstudie: 30% kocht bij
6 opties, 3% bij 24). Maand/jaar is een **toggle binnen** de College+-kolom, geen vierde kolom.

**Fase 1 (nu):**

| Kolom 1 | Kolom 2 | Kolom 3 |
|---|---|---|
| **Gratis** — Beleggen voor Beginners | **Eén cursus** — €49, levenslang | **Beide cursussen** — €79 *(uitgelicht)* |

**Fase 2 (na SEPA + cursus 4):**

| Kolom 1 | Kolom 2 | Kolom 3 |
|---|---|---|
| **Gratis** — Beleggen voor Beginners | **Eén cursus** — €49, levenslang | **College+** — €12,42/mnd jaarlijks (€149) of €14,99/mnd *(uitgelicht: "Meest gekozen")* |

### 4.2 Regels voor de weergave

- **Eén uitgelichte optie**, met visuele hiërarchie en een badge. Gebruik "Meest gekozen" pas als
  het waar is; zolang je nog geen verkopen hebt: **"Onze aanbeveling"**. Nooit een claim die je
  niet kunt onderbouwen.
- **Toon de jaarprijs eerst, in maandequivalent**: "€12,42 per maand, jaarlijks betaald (€149)",
  met daaronder klein "of €14,99 per maand, maandelijks opzegbaar".
- **Alle prijzen inclusief btw**, vanaf het eerste getal dat de bezoeker ziet (§5.1).
- **Geen doorgestreepte prijzen, geen afteltimers, geen "nog 3 plekken", geen exit-popups.**
  Het merk is de belofte; één trucje op de prijzenpagina kost je die.
- Direct onder de tabel een rekenregel, in gewone taal: *"Twee cursussen los kosten €98. College+
  kost €149 per jaar en bevat alles, ook wat er nog bij komt. Volg je één onderwerp, dan is los
  goedkoper. Volg je er meer, dan College+."*

### 4.3 Teksten die op de pagina moeten staan

Kort blok "Wat als ik stop?" direct onder de tabel — dit is merkkritisch, want verrassing is voor
een reassurance-first merk dodelijk:

> **Wat gebeurt er als ik College+ opzeg?**
> Je toegang tot de betaalde cursussen stopt aan het einde van je betaalde periode. Je voortgang,
> je XP en de certificaten die je hebt gehaald blijven van jou.
>
> **Kan ik maandelijks opzeggen?**
> Ja. Eén klik in je account, geen opzegtermijn, geen telefoontje. Je houdt toegang tot het einde
> van de periode die je al betaald hebt.
>
> **En als ik een cursus los koop?**
> Dan is die van jou, ook als je nooit een abonnement neemt. Koop je later toch College+, dan
> trekken we wat je betaald hebt van je eerste jaar af.
>
> **Ik wil eerst kijken of het bij me past.**
> Beleggen voor Beginners is gratis. Negen lessen, geen creditcard, geen proefabonnement dat
> stilzwijgend doorloopt.

Toon op de kaarten wat er in zit met de bestaande lijstjes uit `src/lib/pricing.ts`
(`LOSSE_CURSUS_VOORDELEN`, `COLLEGE_PLUS_VOORDELEN`) — houd ze feitelijk, geen superlatieven.

### 4.4 Wat er in de code moet veranderen

| Bestand | Nu | Wordt |
|---|---|---|
| `src/lib/pricing.ts` → `losseCursus` | `"€29"` | `"€49"` |
| `src/lib/pricing.ts` | — | velden erbij: `bundelTwee: "€79"`, `abonnementJaar: "€149"`, `abonnementJaarPerMaand: "€12,42"` |
| `src/content/courses/waardebeleggen.ts` → `price` | `"€29"` | `"€49"` |
| `src/content/courses/technische-analyse.ts` → `price` | `"€29"` | `"€49"` |
| `src/content/courses/beleggingspsychologie.ts` → `price` | `"€29"` | `"€49"` |
| `src/app/cursussen/[slug]/page.tsx` (schema.org `offers`) | fallback `"€14,99"` | losse prijs `49.00`, `priceCurrency: "EUR"` |
| Nieuwe pagina | — | `/prijzen` met eigen `generateMetadata` + canonical, plus opname in `sitemap.ts` |

Let op de SEO-huisregel: een nieuwe `/prijzen`-pagina is prima, maar verwijder of hernoem geen
bestaande URL's zonder permanente redirect in `next.config.ts`.

---

## 5. Juridische checklist (Nederland/EU)

Alles hieronder is **blokkerend voor de eerste transactie**, niet "later netjes maken".

### 5.1 Btw en prijsvermelding

| Punt | Wat het betekent |
|---|---|
| **Tarief: 21%** | Een vooraf opgenomen, geautomatiseerde online cursus is een *elektronische dienst*. Het 9%-tarief geldt alleen voor digitale onderwijsinformatie die aantoonbaar voor lespakketten van onderwijsinstellingen is ontwikkeld; een zelfstandige interactieve cursus met eindtoetsen valt daar expliciet buiten. De onderwijsvrijstelling vereist erkend onderwijs (CRKBO) én live docent-deelnemerinteractie — beide ontbreken. |
| **Prijzen incl. btw tonen** | Vanaf het eerste aanbod, inclusief alle onvermijdbare kosten. Btw pas bij het afrekenen optellen mag niet. ACM kan boetes tot €450.000 opleggen. €49 en €14,99 zijn dus consumentenprijzen; netto €40,50 en €12,39. |
| **"Vanaf €49" mag** | Mits de totaalprijs vanaf het eerste moment ook zichtbaar is. |
| **Geen van/voor-prijzen** | Een doorgestreepte referentieprijs moet de laagste prijs van de afgelopen 30 dagen zijn (Omnibus-richtlijn). Je hebt nooit iets verkocht, dus "~~€19,99~~ nu €14,99" is verboden. Ook "waarde €199" is riskant. |
| **EU-drempel €10.000** | Tot €10.000 grensoverschrijdende B2C-digitale omzet per jaar mag je Nederlandse btw rekenen aan alle EU-consumenten; daarboven OSS-registratie. Houd dit bij vanaf de eerste verkoop. |
| **KOR overwegen** | Vrijstelling onder €20.000 omzet: 21% meer marge of 21% lagere consumentenprijs. Nadeel: geen btw terugvorderen op hosting, Mollie en ontwerp, en bij groei moet je er weer uit. **Met een boekhouder bespreken vóór de eerste transactie.** |
| Facturen | Factuur per betaling, 21% btw apart vermeld. |

### 5.2 Herroepingsrecht — anders voor los dan voor abonnement

**Losse cursus = digitale inhoud.** Het herroepingsrecht kán vervallen, maar alleen bij **twee
afzonderlijke handelingen** van de consument:

1. Uitdrukkelijke voorafgaande toestemming om binnen de bedenktermijn met levering te beginnen.
2. Een verklaring dat hij daarmee afstand doet van zijn herroepingsrecht.

Dit in één vinkje samenvoegen is riskant en wordt door ICTRecht expliciet bekritiseerd. Doe het als
**twee losse checkboxes** bij het afrekenen (niet voorgevinkt) en **herhaal beide in de
orderbevestigingsmail** (duurzame gegevensdrager). Doe je dit niet goed, dan houdt de koper zijn
herroepingsrecht: hij kan de cursus volledig doorlopen én zijn geld terugvragen.

**College+ = vrijwel zeker een digitale dienst, geen digitale inhoud.** Een platform dat méér doet
dan bestanden leveren — voortgang bijhouden, aanbevelen, personaliseren — is volgens het HvJ een
*dienst*, en de XP-, badge- en voortgangsengine plaatst College+ daar vrijwel zeker in. Gevolg:

- Het herroepingsrecht kun je **niet wegtekenen**. 14 dagen na het sluiten van het abonnement.
- De consument is dan een **evenredige vergoeding** verschuldigd voor het gebruikte deel — maar
  alléén als hij uitdrukkelijk om directe uitvoering heeft gevraagd én je hem correct hebt
  geïnformeerd.
- Heb je hem niet correct geïnformeerd: hij betaalt **niets** en de bedenktijd loopt door tot
  **maximaal 12 maanden** (art. 6:230o lid 2 BW). Sinds het Arvato-arrest (HR 12 november 2021)
  toetst de rechter dit **ambtshalve** — je hoeft er niet eens verweer op te voeren.

### 5.3 De verplichte herroepingsknop — al van kracht

**Sinds 19 juni 2026** moeten webshops een online herroepingsfunctie aanbieden (Richtlijn (EU)
2023/2673, in Nederland art. 6:230oa BW; implementatiewet 36860 aangenomen door de Tweede Kamer op
19 maart 2026 en de Eerste Kamer op 7 april 2026). Dit geldt voor alle via een online-interface
gesloten B2C-overeenkomsten waarvoor een herroepingsrecht bestaat — abonnementen, digitale content
en online diensten worden expliciet genoemd.

Vier vereisten:

1. Duidelijk zichtbare knop met ondubbelzinnig label ("hier de overeenkomst ontbinden").
2. Eenvoudig formulier — alleen strikt noodzakelijke gegevens (naam, ordernummer, e-mail). Inloggen
   mag je vragen, accountaanmaak eisen niet.
3. Aparte bevestigingsknop ("herroeping bevestigen").
4. Onmiddellijke e-mailbevestiging met datum en tijdstip.

Niet vereist waar het herroepingsrecht geldig is uitgesloten (losse cursus mét correcte
afstandsverklaring), **wel** vereist voor College+. Bouw één herroepingspagina en link ernaar vanuit
de footer en de accountpagina. ACM handhaaft.

### 5.4 Opzegtermijnen — Wet van Dam

| Regel | Toepassing bij ons |
|---|---|
| Na de eerste contractperiode maandelijks opzegbaar, max. 1 maand opzegtermijn (art. 6:236 sub j/p BW) | Maandplan: geen minimumtermijn, opzegging per einde betaalde periode. Jaarplan: eerste termijn 12 maanden, daarna maandelijks opzegbaar. |
| Online afgesloten = online opzegbaar | Opzegknop in het account, één klik, bevestigingsmail. ACM verbiedt opzegdrempels zoals doorverwijzen naar de telefoon of informatie verstoppen. |
| Proefabonnementen verlengen nooit stilzwijgend | Reden te meer om geen gratis proefmaand te doen; onze gratis cursus vervult die rol. |
| Strijdige bedingen zijn vernietigbaar | Dan kan de consument direct opzeggen. Niet slim proberen. |

Bijkomend voordeel: opzeggen in één klik is ook de belangrijkste tegenmaatregel tegen een Melding
Onterechte Incasso bij Mollie (€65 excl. btw) — zie `docs/betalingen-mollie.md`.

### 5.5 Wat er in de algemene voorwaarden moet staan

- Identiteit, KvK-nummer, btw-nummer, contactgegevens en een reactietermijn.
- Prijzen inclusief 21% btw; geen bijkomende kosten.
- **Definitie van "levenslange toegang"**: zolang Beleggingscollege bestaat en de cursus aanbiedt;
  bij beëindiging minimaal drie maanden vooraf melden en materiaal downloadbaar maken.
- **College+**: toegang vervalt bij opzegging; voortgang en behaalde certificaten blijven behouden.
- Herroepingsrecht: los (digitale inhoud, met de twee-handelingen-uitzondering) versus College+
  (dienst, 14 dagen, evenredige vergoeding), plus modelformulier voor herroeping.
- Opzegbepalingen conform §5.4 en de verwijzing naar de herroepingsfunctie.
- Upgrade-krediet: max €49, geldig tot 12 maanden na aankoop, niet stapelbaar, niet uitkeerbaar.
- SEPA-mandaat: bedrag, frequentie, mandaatreferentie, vooraankondiging vóór elke incasso,
  omschrijving `BELEGGINGSCOLLEGE` op het afschrift.
- Bewaartermijn van het incassobewijs: minimaal 13 maanden na de laatste incasso.
- Privacyverklaring en cookiebeleid; verwerkersafspraken met Mollie en de hostingpartij.
- **Disclaimer: educatief, geen beleggingsadvies, geen persoonlijk advies.**

### 5.6 AFM — nu al ontwerpen, niet later repareren

Educatie is geen beleggingsadvies: advies is "het aanbevelen van één of meer specifieke financiële
instrumenten aan een specifieke cliënt". De huidige cursussen zitten ruim aan de veilige kant.
Twee roadmap-items verdienen nu al een ontwerpbesluit:

- **AI-studiecoach**: hard blokkeren op instrumentspecifieke aanbevelingen. Uitleggen wat een ETF
  is mag; "koop deze ETF" niet.
- **Risicoprofiel-tool**: een profiel bepalen mag; het koppelen aan een concrete
  portefeuillesamenstelling schuift richting vergunningplichtig advies.

Omdat beide alleen in College+ zitten, is dit ook een prijsvraagstuk: ze zijn de inhoudelijke
rechtvaardiging van het abonnement, dus ze moeten juridisch houdbaar zijn vóór je College+ lanceert.

---

## 6. Wat nu, wat later

### Fase 1 — nu live te zetten (alleen iDEAL, kaart, PayPal, Apple Pay)

| Wat | Status |
|---|---|
| Beleggen voor Beginners gratis | Al zo |
| Losse cursus €49, levenslange toegang | Eenmalige betaling — geen SEPA nodig |
| Duo-bundel €79 | Eenmalige betaling — geen SEPA nodig |
| Prijzenpagina met drie opties, "Onze aanbeveling" op de bundel | Nieuw |
| Twee losse herroepingsvinkjes + orderbevestiging | Blokkerend |
| Voorwaarden, herroepingspagina, modelformulier, disclaimer in de footer | Blokkerend |
| Btw- en KOR-keuze met de boekhouder | Blokkerend |

**Belangrijke nuance:** "kan nu live" slaat op de *betaalkant*. Technisch is er nog wél werk nodig,
en dat geldt voor losse verkoop net zo hard als voor het abonnement: accounts en login, een
database, en vooral **serverkant afscherming** van betaalde lessen. Nu wordt alle lesinhoud naar de
browser gestuurd — betaalde content moet naar de server, anders is die leesbaar voor iedereen die
kijkt. Zie `docs/betalingen-mollie.md` §"Wat er nog gebouwd moet worden".

Deze volgorde sluit ook aan bij waar de markt naartoe beweegt: kopers zijn abonnementsmoe en
eenmalige aankopen converteren beter.

### Fase 2 — wacht op twee dingen tegelijk

**Voorwaarde A: cursus 4 (Beleggingspsychologie) is af.** ✅ **Vervuld op 3 aug 2026** — sterker:
er zijn nu 8 betaalde cursussen met 60 betaalde lessen (~540 minuten), dus het
"na één maand op"-argument is vervallen. Wat College+ nu nog blokkeert is voorwaarde B
hieronder plus de groeipoort en lanceervoorwaarden uit `docs/college-plus-concept.md` §5
(tien echte losse verkopen, werkend e-mailkanaal, live betaalsleutel, juridische toets).
**Voorwaarde B: Mollie heeft SEPA-incasso goedgekeurd** — nodig voor het maandplan (aangevraagd
2 augustus 2026, status: in beoordeling).

| Wat | Vereist SEPA? |
|---|---|
| College+ **jaar** €149 (eenmalige betaling via iDEAL/kaart) | **Nee** — kan zodra cursus 4 er is |
| College+ **maand** €14,99 (recurring) | **Ja** voor iDEAL→SEPA; kaart en PayPal kunnen wél recurring |
| Herroepingsknop (art. 6:230oa BW) | n.v.t., maar verplicht vóór de eerste abonnementsverkoop |
| Opzegknop in het account + bevestigingsmail | n.v.t., verplicht |
| Upgrade-krediet losse koop → jaarplan | n.v.t. |
| Duo-bundel uitfaseren | n.v.t. |

Als SEPA lang op zich laat wachten: **lanceer College+ dan alleen als jaarplan.** Dat is geen
noodgreep — het is in de markt (MasterClass, Skillshare) de norm, het geeft je twaalf maanden
retentie in plaats van één, en het vermijdt het MOI-risico van €65 per geval volledig.

### Volgorde van beslissingen

1. Prijzen vastleggen in `src/lib/pricing.ts` en de cursusbestanden (§4.4).
2. Boekhouder: btw-tarief bevestigen en KOR-keuze maken.
3. Juridische teksten laten opstellen/controleren (voorwaarden, herroeping, privacy).
4. Accounts + database + serverkant afscherming bouwen.
5. Losse verkoop live via Mollie (iDEAL/kaart/PayPal/Apple Pay).
6. Cursus 4 afmaken.
7. College+ jaar live; maandplan zodra SEPA groen is.
8. Na ~6 maanden verkoopdata: prijzen evalueren. Verkoopt €49 makkelijk, dan is €59–€69 de
   volgende stap richting het marktgemiddelde — nooit door te verhogen bij bestaande klanten
   zonder aankondiging.

---

## Bronnen

**Nederlandse markt (prijzen, augustus 2026)**
- [Beleggingsinstituut — cursusaanbod](https://www.beleggingsinstituut.nl/cursus-beleggen/) · [lidmaatschap](https://www.beleggingsinstituut.nl/leren-beleggen/) · [gratis cursus](https://www.beleggingsinstituut.nl/gratis-cursus-beginnen-met-beleggen/)
- [Happy Investors — aandelenabonnement](https://thehappyinvestors.nl/aandelen-abonnement/) · [Exclusief](https://thehappyinvestors.nl/happy-investors-exclusief/)
- [LOI Cursus Beleggen](https://www.loi.nl/cursussen/beleggen) · [NHA Beleggen voor Beginners](https://www.nha.nl/hobbycursussen/persoonlijke-ontwikkeling/cursus-beleggen-voor-beginners) · [NTI](https://www.nti.nl/beroepsopleidingen/makelaardij-bank-en-verzekeringswezen/beleggen-voor-beginners/) · [Laudius](https://www.laudius.nl/cursus/beleggen-voor-beginners)
- [De Beleggingscursus](https://debeleggingscursus.nl/) · [Unschooled / MoneyTalks](https://www.unschooled.nl/online-cursus-beleggen-voor-beginners) · [Beleggersplek — vergelijking](https://beleggersplek.nl/beste-cursussen-leren-beleggen/) · [IC.nl — 12 cursussen beleggen](https://www.ic.nl/beleggen/)
- [Soofos Plus](https://soofos.nl/plus/) · [Soofos levenslange toegang](https://soofos.nl/levenslange-toegang/)
- [LYNX Masterclass](https://www.lynx.nl/educatie-inspiratie/masterclass-beleggen/) · [BelegWijs gratis cursus](https://www.belegwijs.nl/cursus) · [Beleggers Belangen](https://www.abonnement.nl/aanbiedingen/beleggers-belangen/)
- [Coursera Plus](https://www.coursera.org/courseraplus/special/euro-new-year-2026) · [MasterClass pricing](https://onlinecourseing.com/masterclass-pricing/) · [Udemy NL-prijzen](https://nl.pepper.com/kortingscode/udemy.com)

**Prijsmodellen, kannibalisatie en prijzenpagina**
- [Tutor LMS — Subscription vs. One-Time Purchase](https://tutorlms.com/blog/how-to-price-online-courses-subscription-vs-single-sales/) · [Passion.io — Cohort Course Pricing Guide](https://passion.io/blog/cohort-course-pricing-guide-one-time-payment-vs-subscription-models)
- [LearnPress](https://learnpresslms.com/blog/subscription-vs-one-time-payment-pricing/) · [Klasio](https://klasio.com/blog/14597/subscription-vs-one-time-course-sales) · [Learning Revolution — Membership Pricing](https://www.learningrevolution.net/membership-site-pricing/)
- [Subscription Index — Annual vs Monthly](https://www.subscriptionindex.com/guides/annual-vs-monthly-pricing) · [Fungies — Annual vs Monthly SaaS Pricing](https://fungies.io/annual-vs-monthly-saas-pricing-strategy/)
- [RiskVerdict — Lifetime Deal vs Subscription](https://www.riskverdict.com/guides/lifetime-deal-vs-subscription) · [Tiny Workshops — Skillshare vs Domestika](https://tinyworkshops.com/skillshare-vs-domestika/)
- [Figma — Pricing Page Best Practices](https://www.figma.com/resource-library/pricing-page-best-practices/) · [WiserNotify](https://wisernotify.com/blog/pricing-page-best-practices-to-increase-conversions/) · [Briefd — Anchoring Effect](https://briefd.it/blog/anchoring-effect-pricing-pages/)
- [Atticus Li — Decoy Effect repliceert niet](https://atticusli.com/replication-crisis/decoy-effect-asymmetric-dominance/) · [Growth Unhinged — Free-to-Paid Conversion Report](https://www.growthunhinged.com/p/free-to-paid-conversion-report) · [Recurly — Churn Benchmarks](https://recurly.com/research/churn-rate-benchmarks/)

**Recht en btw**
- [ACM — Prijzen vermelden](https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/prijzen-vermelden) · [ACM — Leidraad prijsweergave](https://www.acm.nl/nl/publicaties/leidraad-prijsweergave-en-vergelijkingen)
- [Van Ree — 9% of 21% btw bij online leeromgeving](https://www.vanreeaccountants.nl/newsitem/toegang-tot-online-leeromgeving-9-of-21-btw/) · [Cooster](https://cooster.nl/kennisbank/nieuws/moet-je-9-of-21-btw-betalen-voor-online-leren) · [Belastingdienst — digitale diensten](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/zakendoen_met_het_buitenland/goederen_en_diensten_naar_andere_eu_landen/btw_berekenen_bij_diensten/wijziging_in_digitale_diensten_vanaf_2015/) · [VATupdate — €10.000-drempel](https://www.vatupdate.com/2025/10/11/eu-vat-compliance-b2c-distance-sales-rules-and-e10000-threshold-guide/) · [Onderneming.nl — KOR](https://www.onderneming.nl/belasting/kleineondernemersregeling/)
- [ICTRecht — Factsheet herroepingsrecht](https://www.ictrecht.nl/kennis/factsheets/herroepingsrecht) · [ICTRecht — Herroepingsrecht op digitale inhoud uitsluiten?](https://www.ictrecht.nl/blog/herroepingsrecht-op-digitale-inhoud-kun-je-dat-uitsluiten) · [Trusted Shops](https://business.trustedshops.nl/blog/herroepingsrecht-digitale-inhoud)
- [Thuiswinkel.org — herroepingsfunctie](https://www.thuiswinkel.org/kennisbank/kennisartikelen/de-herroepingsfunctie-op-weg-naar-implementatie-in-nederland/) · [Rassers — herroepingsknop 2026](https://rassers.nl/nieuws/herroepingsknop-webshop-2026/) · [nl.legal](https://nl.legal/blog/herroepingsknop-verplicht-webshop-2026) · [Holla](https://www.holla.nl/nieuws/de-herroepingsknop-wat-online-handelaren-nu-moeten-weten)
- [IT en Recht — streamingabonnement als dienst](https://www.itenrecht.nl/artikelen/streamingabonnement-als-dienst-herroepingsrecht-en-vergoeding-bij-video-on-demand) · [Prime Law — art. 6:230m BW](https://www.primelaw.nl/consumer-litigation/online-dienstverlening-herroepingsrecht-informatieplicht-art-6230m-bw/)
- [Iusmentis — Wet van Dam](https://www.iusmentis.com/zakendoen/consumentenrecht/wetvandam-stilzwijgend-opzeggen-verlengen/) · [ACM ConsuWijzer — abonnement opzeggen](https://consument.acm.nl/kan-ik-van-de-overeenkomst-af/opzeggen-stoppen-annuleren/abonnement-opzeggen) · [ACM — online opzeggen](https://www.acm.nl/nl/publicaties/acm-online-afgesloten-abonnement-moet-je-online-kunnen-opzeggen)
- [Mollie — Recurring Payments](https://help.mollie.com/hc/en-us/articles/115000967505-How-do-I-use-Recurring-Payments-via-Mollie) · [Mollie — Subscriptions](https://www.mollie.com/products/recurring)
- [AFM — Leidraad kwalificatie innovatieve dienstverlening](https://www.afm.nl/~/profmedia/files/wet-regelgeving/beleidsuitingen/leidraden/kwalificatie-innovatieve-dienstverlening.ashx) · [NIBE-SVV — AFM over beleggingsadvies](https://www.nibesvv.nl/blog/afm-schept-duidelijkheid-over-beleggingsadvies)
