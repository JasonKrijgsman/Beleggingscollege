# Mailsjablonen

Laatst bijgewerkt: 2 augustus 2026.

> ## Geschreven vóór de betaalmodelsplitsing van 3 augustus 2026 — twee dingen om te weten vóór je hier tekst uit overneemt
>
> Dit document is bedoeld om **letterlijk** in code te belanden ("neem de tekst letterlijk
> over"). Daarom staat deze waarschuwing bovenaan en niet in een voetnoot.
>
> **1. Overal waar hieronder `purchases` staat, lees `payment_attempts` of `entitlements`.**
> De ene tabel is op 3 augustus in drieën gesplitst: `payment_attempts` (de betaling en het
> order, inclusief `orderNumber`, `confirmationClaimedAt` en `confirmationSentAt`),
> `entitlements` (het toegangsrecht) en `order_counters` (de nummerreeks). "De aankoop staat
> niet langer op `paid`" betekent nu: het **entitlement** staat op `ingetrokken` — dát is wat
> de toegang laat vervallen. En de idempotentie zit niet meer in het lezen van
> `confirmationSentAt` maar in een **atomaire claim** op `confirmationClaimedAt`; dat was
> juist de race die deze formulering niet dichtte. Zie `docs/ontwerp-betaalmodel.md`.
>
> **2. Eén goedgekeurde zin is onwaar geworden en moet herschreven vóór verzending.** De
> verantwoording bij `herroeping-verwerkt` keurt de zin over voortgang goed met de
> motivering "punten en badges leven in localStorage, niet op het account". Sinds 2 augustus
> is dat voor **ingelogde** cursisten niet meer waar: hun voortgang staat in de database. Een
> onware mededeling in een juridisch geladen mail is precies wat dit merk niet kan hebben.
> De orderbevestiging die al in code staat (`src/lib/mailteksten.ts`) is hierop wél
> bijgewerkt en zegt inmiddels dat aankoop én voortgang aan het account hangen; deze
> sjabloon moet dezelfde kant op.
>
> Verder klopt dit document nog: de juridische onderbouwing, de merkstem-afwegingen en het
> punt dat `src/lib/mail.ts` geen `attachments` kent (alleen de provider veranderde — het is
> Migadu SMTP geworden, niet Resend).

Zes transactionele mails, geschreven in de merkstem en juridisch getoetst. Alleen de
**orderbevestiging** is op dit moment in code omgezet (`src/lib/mailteksten.ts`); de andere
vijf staan hier klaar tot ze aan de beurt zijn.

Variabelen staan als {{naam}}. Wie een sjabloon in code omzet: neem de tekst letterlijk over,
ook de saaie stukken — die staan er niet voor de sier maar omdat de wet ze eist. Zie
`docs/e-mail-versturen.md` voor de verzendkant en de onderbouwing hieronder voor het waarom.

---

## orderbevestiging-losse-cursus

**Wanneer:** Eén keer per aankoop, direct nadat de Mollie-webhook de betaling op `paid` heeft gezet — in dezelfde verwerking waarin de cursus wordt ontgrendeld, niet in een latere batch (art. 6:230v lid 7 BW zegt "voordat de dienst wordt uitgevoerd"; hoe kleiner het gat, hoe beter). Verzending is idempotent via `purchases.confirmationSentAt`, zodat Mollie's herhaalde webhookaanroepen niet tien mails opleveren. Geldt alleen voor betaalde losse cursussen; de gratis cursus stuurt niets.

**Onderwerp:** Bevestiging en factuur: {{cursusnaam}}

**Preheader:** Bestelling {{ordernummer}}. Bewaar deze mail: dit is ook je factuur en bevestiging.

**Variabelen:** `{{voornaam}}`, `{{cursusnaam}}`, `{{aantalLessen}}`, `{{cursusUrl}}`, `{{accountUrl}}`, `{{ordernummer}}`, `{{datum}}`, `{{betaalmethode}}`, `{{bedrag}}`, `{{btwRegel}}`, `{{toestemmingMoment}}`, `{{herroepingsverklaring}}`, `{{herroepingsversie}}`, `{{vestigingsadres}}`, `{{btwNummer}}`, `{{voorwaardenUrl}}`, `{{herroepingsrechtUrl}}`, `{{privacyUrl}}`

<details><summary>Toelichting van de schrijver</summary>

WAT IK HEB VERANDERD

1. Eén afzender, één persoon. Het concept wisselde tussen "mij" en "wij/ons/onze servers". Een eenmanszaak heeft geen wij. Overal "ik", behalve waar de handelsnaam Beleggingscollege bedoeld is. Dat is precies het verschil tussen deze mail en een willekeurige webshopmail.

2. Eén handeling bovenaan. {{cursusUrl}} staat nu alleen; {{accountUrl}} is verhuisd naar de regel "Uitvoering" in het bestelblok, waar hij juridisch toch al moest staan. Twee links die om aandacht vechten zijn er één te veel.

3. "Daar wordt aan gewerkt" geschrapt. Voortgang synchroniseren staat niet op de roadmap (die noemt abonnement, bevestigingsmail, facturen, terugbetalingen, studiecoach, risicoprofiel). Het was dus een belofte zonder dekking — precies wat dit merk zegt niet te doen. De beperking zelf blijft, twee keer, in gewone taal.

4. "Levenslang van jou" bijgesteld. De voorwaarden (art. 4) definiëren levenslange toegang eerlijk als "zolang Beleggingscollege bestaat en de cursus aanbiedt", met drie maanden aankondiging en de mogelijkheid het materiaal op te slaan. Die nuance stond niet in de mail, waardoor de mail méér beloofde dan de voorwaarden. Nu staat hij er, inclusief de zin dat updates gratis zijn.

5. Factuur in plaats van bon. De voorwaarden beloven "een factuur waarop de btw apart staat". Deze mail is die factuur; dat staat nu ook in het onderwerp en in de aanhef van het zakelijke deel. Anders staat er een toezegging op de site die het product niet nakomt.

6. Btw als één variabele. {{btwBedrag}} en {{bedragExclBtw}} zijn samengevoegd tot {{btwRegel}}, precies zoals `src/lib/mailteksten.ts` het al doet. Bij KOR = true mag er namelijk géén btw-bedrag in de mail staan, maar de mededeling dat er op grond van de KOR geen btw is berekend. Met twee losse bedragvariabelen kun je dat niet correct renderen.

7. Herroepingsafstand geschikt voor beide regimes. Het concept ankerde het rechtsverlies aan "zodra je toegang hebt gekregen" — dat past op digitale inhoud (art. 6:230p sub g BW), niet op een dienst (sub d). Nu: "zodra de levering begint … vanaf toen stond de cursus volledig voor je open". Dat dekt zowel het beginnen van de levering als de volledige nakoming, zonder de klant een college te geven over een openstaande kwalificatievraag.

8. Eén vinkje, letterlijk geciteerd. De checkout heeft één selectievakje ({{herroepingsverklaring}}), terwijl /herroepingsrecht twee losse vinkjes belooft. De mail bevestigt daarom twee dingen apart maar citeert één vakje verbatim — hij doet niet alsof er twee waren.

9. Coulanceregeling toegevoegd. Die belofte staat al op /herroepingsrecht, dus hij hoort in de bevestiging. Hij vangt bovendien onvrede af voordat die een chargeback of MOI (€ 65) wordt.

10. Ingekort, ruim 15%. Weg: de dubbele productomschrijving in de intro, "Je betaling is gelukt", "Wat je hebt gekocht" (dat staat in het bestelblok), en de losse zin over herroepingskosten die niets toevoegde nu het recht is vervallen.

WAT ER NIET IN ZIT, EN WAAROM: geen link naar het ODR-platform (per 20 juli 2025 gestopt, Verordening (EU) 2024/3228), geen telefoonnummer (er is er geen; alleen verplicht als het bestaat), geen geschillencommissie (nergens bij aangesloten).

VIER DINGEN DIE VÓÓR DE EERSTE ECHTE VERKOOP MOETEN, ANDERS KLOPT DEZE MAIL NIET

a. {{vestigingsadres}} en {{btwNummer}} staan op null in src/lib/mailteksten.ts. Zonder die twee is de mail incompleet (art. 3:15d lid 1 sub a en f BW).

b. De bijlage moet er echt zijn. De mail zegt dat de algemene voorwaarden en het modelformulier als bijlage meekomen. src/lib/mail.ts stuurt op dit moment alleen `text` en `html` naar Resend, geen `attachments`. Of die bijlage wordt gebouwd, of de tekst gaat integraal de body in — alleen een link volstaat niet (art. 6:233 sub b jo. 6:234 BW; HvJ EU C-49/11).

c. De btw-behandeling langs de boekhouder. KOR staat hard op false en het tarief op 21%. Staat er straks een onjuist btw-bedrag in een mail die de klant bewaart, dan is dat lastig terug te draaien.

d. Het grootste gat zit niet in de tekst maar in de verzending. In src/lib/orderbevestiging.ts wordt een mislukte verzending alleen naar de console gelogd: geen herkansing, geen wachtrij, geen signaal. Juist het scenario waarin het herroepingsrecht blijft bestaan verloopt nu dus stil. De mooiste bevestiging is waardeloos als hij niet aankomt.

</details>

```
Hoi {{voornaam}},

Je betaling is binnen en {{cursusnaam}} staat voor je klaar. Hier begin je:

{{cursusUrl}}

Eén ding weet je liever vooraf dan achteraf: je XP, badges en afvinkjes worden op dit moment in je browser bewaard, niet op de server. Ga je verder op een ander apparaat, dan staat de cursus gewoon open — je aankoop hangt aan je account — maar begint die telling daar opnieuw.

Loopt er iets vast, of heb je een vraag over een les? Antwoord gewoon op deze mail. Die komt bij mij terecht, niet bij een helpdesk.

Veel plezier met de cursus,

Jason Krijgsman
Beleggingscollege

────────────────────────────────────────────

Hieronder het zakelijke deel. Niet spannend, maar het hoort erbij: dit is tegelijk je factuur en je wettelijke bevestiging. Bewaar deze mail.

JE BESTELLING

Ordernummer: {{ordernummer}}
Datum: {{datum}}
Product: {{cursusnaam}} — online cursus van {{aantalLessen}} lessen, met een printbaar certificaat na afronding
Soort overeenkomst: eenmalige aankoop. Geen abonnement, geen minimumduur, geen automatische verlenging, geen tweede afschrijving.
Uitvoering: direct na je betaling beschikbaar in je account ({{accountUrl}}). Geen levertermijn, er wordt niets verzonden.
Betaald met: {{betaalmethode}}, via betaaldienstverlener Mollie
Totaalbedrag: {{bedrag}} inclusief btw
{{btwRegel}}
Bijkomende kosten: geen. Dit is het volledige bedrag.

Deze mail bevestigt ook dat ik je bestelling heb ontvangen.

Wat "levenslange toegang" hier betekent: je houdt toegang tot deze cursus zonder ooit bij te betalen, zolang Beleggingscollege bestaat en de cursus aanbiedt. Meer kan ik niet beloven — een website waarvan vaststaat dat hij er over dertig jaar nog is, bestaat niet. Haal ik een cursus definitief weg, dan laat ik dat minstens drie maanden van tevoren weten en kun je het materiaal in die periode opslaan of afdrukken. Updates aan deze cursus krijg je er zonder bijbetaling bij.

JE TOESTEMMING OM DIRECT TE BEGINNEN

Twee dingen moet ik apart bevestigen. Dit zijn ze.

1. Je uitdrukkelijke verzoek om direct te beginnen.
Bij het afrekenen heb je op {{toestemmingMoment}} dit vakje aangevinkt:

"{{herroepingsverklaring}}"

Daarmee heb je me uitdrukkelijk gevraagd de cursus meteen open te zetten: dus binnen de bedenktijd van veertien dagen, voordat die was verstreken.

2. Je erkenning dat je daarmee je herroepingsrecht verliest.
In diezelfde verklaring heb je erkend dat je je recht om de koop binnen veertien dagen te herroepen verliest zodra de levering begint. Dat moment was je betaling: vanaf toen stond de cursus volledig voor je open.

Versie van de tekst die je hebt aangevinkt: {{herroepingsversie}}. Ik bewaar die verklaring met datum en tijd bij je bestelling, zodat later precies na te gaan is wat er stond.

OVER HET HERROEPINGSRECHT

Bij een koop op afstand heb je normaal veertien dagen bedenktijd. Die termijn begint op de dag waarop de overeenkomst is gesloten, hier dus op {{datum}}. Herroepen doe je door dat binnen die termijn ondubbelzinnig te laten weten: een mail aan beheer@beleggingscollege.nl volstaat, of je gebruikt het modelformulier voor herroeping dat als bijlage bij deze mail zit. Bij een geldige herroeping krijg je het volledige bedrag binnen veertien dagen terug.

Door je toestemming hierboven is dat recht bij deze aankoop vervallen. Je kunt de koop dus niet meer binnen veertien dagen ongedaan maken.

Daarnaast staat mijn eigen belofte, en die is ruimer dan de wet: heb je net gekocht, ben je nauwelijks begonnen en past de cursus toch niet bij je? Mail me binnen veertien dagen. Ik kijk daar redelijk naar en betaal in zulke gevallen terug. Ik wil geen geld van iemand die er niets aan heeft.

WAT JE NODIG HEBT

De cursus werkt in elke moderne browser, op computer, tablet of telefoon. Verder heb je alleen een internetverbinding nodig. Er is geen download en geen app.

Je toegang hangt aan het account waarmee je bent ingelogd (via Google) en is persoonlijk: je kunt hem niet doorgeven of doorverkopen. De lessen zijn alleen zichtbaar als je bent ingelogd en de aankoop bij jouw account hoort.

Je voortgang — XP, badges en afvinkjes — staat op dit moment in de opslag van je browser. Wis je die, of ga je naar een ander apparaat of een andere browser, dan begint die telling opnieuw. Je aankoop en je toegang staan wél op je account.

JE WETTELIJKE RECHTEN

De cursus moet zijn wat er is toegezegd: de lessen, de inhoud en de functies zoals beschreven op de site en in deze mail. Klopt dat niet, dan heb je recht op herstel — en lukt herstel niet of duurt het te lang, dan op een passende korting of op ontbinding met terugbetaling. Dat recht is wettelijk, staat los van deze mail en kan niet worden weggeschreven. Ik houd de cursus daarnaast bij en in de lucht zolang je dat redelijkerwijs mag verwachten.

KLACHT OF PROBLEEM

Mail beheer@beleggingscollege.nl; je krijgt uiterlijk binnen vijf werkdagen een inhoudelijke reactie. Kom je er met mij niet uit, dan kun je gratis advies vragen bij ACM ConsuWijzer (consuwijzer.nl). Koop je vanuit een ander EU-land, dan helpt het Europees Consumenten Centrum je verder. Beleggingscollege is niet aangesloten bij een geschillencommissie of keurmerk; er is dus geen buitengerechtelijke geschillenprocedure waaraan ik mij heb onderworpen.

VERKOPER

Beleggingscollege, handelsnaam van de eenmanszaak van Jason Krijgsman
{{vestigingsadres}}
E-mail: beheer@beleggingscollege.nl
KvK-nummer: 71856633
Btw-identificatienummer: {{btwNummer}}

Op dit adres kun je ook een klacht indienen.

ALGEMENE VOORWAARDEN

De algemene voorwaarden en het modelformulier voor herroeping zitten als bijlage bij deze mail, zodat je ze kunt opslaan en later teruglezen. Online staan ze op {{voorwaardenUrl}} en {{herroepingsrechtUrl}}. Wat ik met je gegevens doe, lees je op {{privacyUrl}}.

TOT SLOT

Beleggingscollege geeft onderwijs, geen persoonlijk beleggingsadvies. Wat je in de lessen leert is algemene uitleg, geen aanbeveling om iets te kopen of te verkopen. Beleggen brengt risico's mee: je kunt een deel van je inleg verliezen, of je hele inleg.
```

---

## betaling-niet-afgerond

**Wanneer:** Mollie meldt via de webhook dat een betaling de eindstatus failed, canceled of expired heeft gekregen, terwijl er voor dezelfde klant en dezelfde cursus geen rij met status 'paid' bestaat. Verstuur ongeveer een uur na die statuswijziging, eenmalig per betaalpoging, en alleen als de koper een account met e-mailadres heeft. Controleer vlak voor verzending nog een keer of er inmiddels tóch is betaald — dan niet versturen. Geen herinnering erachteraan.

**Onderwerp:** Je betaling is niet afgerond — er is niets afgeschreven

**Preheader:** De link om alsnog af te ronden staat hierin. Doe je niets, dan gebeurt er niets.

**Variabelen:** `{{voornaam}}`, `{{cursusnaam}}`, `{{bedrag}}`, `{{opnieuwUrl}}`

<details><summary>Toelichting van de schrijver</summary>

Vijf ingrepen.

1) Eén handeling. De concepttekst had twee concurrerende links: opnieuw betalen én de gratis cursus. De hele alinea over Beleggen voor Beginners is eruit, inclusief {{gratisCursusUrl}}. Wie net is afgehaakt bij het afrekenen heeft geen tweede aanbod nodig; dat leest bovendien als redden-wat-er-te-redden-valt. De geruststelling die die alinea moest geven zit nu in "Doe je niets, dan gebeurt er verder niets" — dat doet hetzelfde werk zonder een tweede knop.

2) Eerlijkheid. "Dat gebeurt vaker dan je denkt" is een cijfermatige claim die we niet kunnen onderbouwen; vervangen door "Meestal ligt het aan een tabblad dat wegvalt of een bankscherm dat afsluit" — dat is een verklaring, geen statistiek. "Het zegt niets over jou" is geschrapt: dat troost iemand die zich waarschijnlijk niet eens schaamde, en klinkt daardoor betuttelend.

3) Merkstem. "Alle drie zijn prima" is teruggebracht tot "Ook prima" — de opsomming natellen is een schrijverstic. "Nog één ding, omdat het soms verwarring geeft" is aanloop; de kaartreservering staat er nu meteen. "Verder vraagt deze mail niets van je" sprak zichzelf tegen (de mail vráágt om af te rekenen) en is vervangen door de feitelijke variant. "Niet bij een helpdesk" is weg: een eenmanszaak die benadrukt geen helpdesk te hebben, doet aan positionering; gewoon zeggen dat het bij jou aankomt is genoeg.

4) Lengte. Van elf naar acht alinea's, ongeveer een derde korter. Niets inhoudelijks verdwenen: de geruststelling, het bedrag, het eenmalige karakter, de vervallende link, de kaartreservering en het antwoordadres staan er allemaal nog.

5) Nederlands. "Wil je het opnieuw proberen" werd "Wil je het alsnog afronden" — dat sluit aan bij de status (afgebroken, niet mislukt) en herhaalt het woord "proberen" niet uit de preheader. Puntkomma vervangen door komma in de slotzin. Onderwerpregel (55 tekens) en preheader ongewijzigd van strekking, maar de preheader herhaalt nu niet meer letterlijk het onderwerp en zet in plaats daarvan de toon: geen druk.

Let op bij het invullen: {{bedrag}} moet als "EUR 49,00" komen, met komma, niet als "EUR 49.00". En {{opnieuwUrl}} moet naar een betaallink wijzen die op onze eigen prijs is gebaseerd, niet op een bedrag uit de oorspronkelijke afgebroken sessie.

</details>

```
Hoi {{voornaam}},

Je betaling voor {{cursusnaam}} is niet afgerond. Er is niets van je rekening afgeschreven en er staat geen bestelling open.

Meestal ligt het aan een tabblad dat wegvalt of een bankscherm dat afsluit. En soms bedenk je je halverwege. Ook prima.

Wil je het alsnog afronden, dan kan dat hier:
{{opnieuwUrl}}

Het gaat om {{cursusnaam}} voor {{bedrag}}. Eenmalig, geen abonnement, en de cursus blijft daarna van jou. Werkt de link niet meer, dan bestel je hem gewoon opnieuw op de site.

Betaal je met een kaart en zie je toch een bedrag gereserveerd staan? Die reservering valt vanzelf weg. Er wordt niets geïncasseerd.

Doe je niets, dan gebeurt er verder niets. Liep je bij het afrekenen ergens tegenaan? Antwoord dan op deze mail, die komt bij mij terecht.

Groet,
Jason Krijgsman
Beleggingscollege

────────────────────────────────────────────
Beleggingscollege — KVK 71856633
beheer@beleggingscollege.nl

Beleggen brengt risico's met zich mee. Je kunt (een deel van) je inleg verliezen. Beleggingscollege geeft onderwijs, geen persoonlijk beleggingsadvies.
```

---

## herroeping-verwerkt

**Wanneer:** Wordt verstuurd op het moment dat een herroeping (of coulance-terugbetaling) is geaccepteerd: de terugbetaling is bij Mollie aangemaakt en de aankoop in `purchases` staat niet langer op `paid`, waardoor de toegang tot de cursus is vervallen. Eén mail per herroepen aankoop, direct daarna — niet vooraf, want dan klopt de zin over de ingezette terugbetaling nog niet.

**Onderwerp:** Je herroeping is verwerkt en je geld komt terug

**Preheader:** Je hoeft niets te doen; het bedrag gaat terug via dezelfde betaalmethode.

**Variabelen:** `{{voornaam}}`, `{{cursusnaam}}`, `{{bedrag}}`, `{{ordernummer}}`, `{{datum}}`

<details><summary>Toelichting van de schrijver</summary>

Het concept was al grotendeels goed; ik heb vooral gesnoeid en één stem gekozen.

1. Merkstem. "Wij hebben de terugbetaling in gang gezet" is veranderd in "Ik heb" — het is een eenmanszaak, en verderop in de mail staat toch al "ik". Ook "Er worden geen kosten ingehouden" (lijdende vorm, webshoptaal) werd "Ik houd geen kosten in". "Antwoord dan op deze mail. Die komt bij mij terecht, niet bij een helpdesk" sluit nu aan op de formulering in de bestaande orderbevestiging (src/lib/mailteksten.ts), zodat beide mails van dezelfde persoon lijken te komen.

2. Eerlijkheid. Inhoudelijk stond er niets fouts: geen rendementsbelofte, geen urgentie, geen sociale bewijskracht, en de zin over voortgang klopt (punten en badges leven in localStorage, niet op het account). Ik heb wel "je toegang is met deze mail ingetrokken" geschrapt — de mail trekt niets in, het systeem doet dat, en die volgorde suggereren is onnauwkeurig. Nu: "is vervallen". Ook de belofte bij de feedbackvraag ("je krijgt er geen aanbod voor terug") is bewust behouden; die is het waard.

3. Nederlands. "als waarmee je hebt betaald" → "als waarmee je betaald hebt", "doorgaans binnen enkele werkdagen" → "meestal binnen een paar werkdagen" (minder ambtelijk). Bedragen blijven in de variabele, die met komma wordt opgemaakt.

4. Lengte. Van zes naar vier alinea's. De losse slotalinea ("Bedankt dat je het geprobeerd hebt...") en de feedbackvraag stonden apart terwijl ze om dezelfde handeling vroegen; die zijn samengevoegd. De zin "Je hoeft hier verder niets voor te doen" bleef, want dat is precies de spanning die je bij een terugbetaling wegneemt.

5. Eén handeling. Er stonden twee losse verzoeken om te antwoorden. Nu is er één: antwoord op deze mail. De links in de voet zijn juridisch, geen concurrerende call-to-action, en staan in dezelfde volgorde als in de orderbevestiging.

Nog checken voordat dit live gaat: het vestigingsadres en btw-nummer ontbreken in het verkopersblok (staat als TODO in src/lib/mailteksten.ts, regel 13-16) en horen ook hier te staan.

</details>

```
Hoi {{voornaam}},

Je herroeping is verwerkt. De koop van {{cursusnaam}} is ontbonden en je krijgt het volledige bedrag van {{bedrag}} terug.

Je hoeft daar niets voor te doen. Ik heb de terugbetaling in gang gezet via Mollie, naar dezelfde betaalmethode als waarmee je betaald hebt. Mollie verwerkt dat meestal binnen een paar werkdagen; wanneer het bedrag op je rekening staat, bepaalt je bank. Ik houd geen kosten in.

Je toegang tot {{cursusnaam}} is vervallen, dus de lessen kun je niet meer openen. Wat je in je browser hebt opgebouwd — punten, badges, afgevinkte lessen — blijft daar staan.

Bedankt dat je het geprobeerd hebt. Heb je nog een vraag over de terugbetaling, of wil je in één regel kwijt waarom de cursus niet paste? Antwoord dan op deze mail. Die komt bij mij terecht, niet bij een helpdesk. Ik gebruik het om de cursus beter te maken en stuur je geen aanbod terug.

Groet,
Jason Krijgsman
Beleggingscollege

────────────────────────────────────────────
JE HERROEPING

Ordernummer:      {{ordernummer}}
Cursus:           {{cursusnaam}}
Herroeping op:    {{datum}}
Terug te betalen: {{bedrag}} (volledig, zonder kosten)
Wijze:            dezelfde betaalmethode als je aankoop

VERKOPER
Beleggingscollege
KVK: 71856633
beheer@beleggingscollege.nl

Algemene voorwaarden: https://beleggingscollege.com/voorwaarden
Herroepingsrecht:     https://beleggingscollege.com/herroepingsrecht
Privacyverklaring:    https://beleggingscollege.com/privacy

```

---

## welkom-nieuw-account

**Wanneer:** Eenmalig, direct nadat iemand voor het eerst inlogt met Google en er een nieuw account wordt aangemaakt (Auth.js: nieuwe gebruiker in `users`). Niet bij volgende logins, en niet na een aankoop — daar hoort een aparte bevestigingsmail bij.

**Onderwerp:** Welkom bij Beleggingscollege: begin bij les 1

**Preheader:** Waar je begint en wat Beleggingscollege wel en niet doet.

**Variabelen:** `{{voornaam}}`, `{{eersteLesUrl}}`

<details><summary>Toelichting van de schrijver</summary>

Vijf ingrepen.

1. Eén handeling. De mail had twee links: de eerste les en {{leerpadUrl}}. Het leerpad is bij een leeg account toch nog leeg, dus die link kostte alleen aandacht. Geschrapt; {{leerpadUrl}} staat niet meer in de variabelen. Wat overblijft is één klik.

2. Twee beloftes die we niet kunnen waarmaken, weg. "Aan het meeverhuizen van je voortgang wordt gewerkt" — synchronisatie van voortgang staat niet op de roadmap, dus dat is een toezegging zonder dekking. Nu staat het feit er kaal, wat eerlijker klinkt en niets belooft. Ook "duurt een minuut of acht" is geschrapt: zet die terug zodra je de leestijd van les 1 echt gemeten hebt, dan is het een prettig detail in plaats van een gok.

3. Korter. Twee kopjes werden er één; de manifest-alinea "Wij geven onderwijs" ging op in de rest, en het browser-detail heeft geen eigen kopje meer nodig — een los feit met een kopje erboven maakt het zwaarder dan het is. Ruim een kwart korter, zonder dat er inhoud verdween.

4. Toon. "Het enige wat nu telt, is dat je begint bij de eerste les" is de zin die je in elke onboardingmail vindt; nu staat er gewoon "Begin bij de eerste les". Verder "Je bent ingelogd en je account staat klaar" ingekort (wie deze mail krijgt, wéét dat hij ingelogd is), en "niets te kiezen" geschrapt omdat er op dat moment ook niets te kiezen valt.

5. Onderwerpregel. "Welkom bij Beleggingscollege — je eerste les staat klaar" beloofde iets dat klaarstaat; nu staat er een instructie die precies overeenkomt met de enige link in de mail (45 tekens).

Ongemoeid gelaten: de disclaimer onderaan, de vergunningszin en het aanbod om op de mail te antwoorden. Dat laatste is strikt genomen een tweede handeling, maar het is geen concurrerende link en het is precies wat een eenmanszaak geloofwaardig maakt. Wel voorwaarde: het antwoordadres moet echt bij jou uitkomen, anders is die zin een leugen.

</details>

```
Hoi {{voornaam}},

Je account staat klaar. Fijn dat je er bent.

Als beleggen je vooral onzeker maakt: dat is een normale plek om te beginnen. Je hoeft niets te weten en niets te kopen om te starten.

Begin bij de eerste les:

{{eersteLesUrl}}

Dat is les 1 van Beleggen voor Beginners, de gratis cursus van negen lessen. Hij gaat over de simpelste vraag die er is: waarom zou je eigenlijk beleggen?

Wat je hier wel en niet krijgt

De lessen zijn geworteld in klassieke boeken — Benjamin Graham, John Bogle, Morgan Housel — en niet in de waan van de dag. Je krijgt uitleg die klopt, inclusief de grenzen van elke methode.

Je krijgt geen tips, geen koersvoorspellingen en geen persoonlijk beleggingsadvies. Daar hebben we geen vergunning voor, en het is ook niet wat we willen doen. Beloftes over rendement lees je hier nooit.

Eén detail over hoe het nu werkt: je XP, badges en afgevinkte lessen staan in deze browser, niet op je account. Log je op een ander apparaat in, dan staan je cursussen gewoon open, maar begint die telling opnieuw. Wat je koopt, hoort wel bij je account.

Loopt er iets vast, of heb je een vraag over een les? Antwoord op deze mail. Die komt bij mij terecht, niet bij een helpdesk.

Veel plezier met les 1,

Jason Krijgsman
Beleggingscollege, Den Haag

────────────────────────────────────────────
beheer@beleggingscollege.nl · KVK 71856633

Beleggen brengt risico's met zich mee; je kunt (een deel van) je inleg verliezen. Beleggingscollege geeft onderwijs, geen persoonlijk beleggingsadvies.
```

---

## cursus-afgerond-certificaat

**Wanneer:** Direct nadat de laatste openstaande les van een cursus is afgerond (completeLesson zet die cursus op 100 procent). Eenmalig per gebruiker per cursus; niet opnieuw versturen als iemand een les herhaalt.

**Onderwerp:** Je certificaat voor {{cursusnaam}}

**Preheader:** Alle {{aantalLessen}} lessen doorlopen. Je certificaat staat klaar — sla het even op.

**Variabelen:** `{{voornaam}}`, `{{cursusnaam}}`, `{{aantalLessen}}`, `{{totaalXp}}`, `{{certificaatUrl}}`, `{{volgendeCursusNaam}}`, `{{volgendeCursusUrl}}`

<details><summary>Toelichting van de schrijver</summary>

Belangrijkste inhoudelijke ingreep: "Aan het meeverhuizen van voortgang wordt gewerkt" is geschrapt. Dat staat niet op de roadmap, dus het is een belofte die we niet kunnen waarmaken — precies wat dit merk niet doet. De beperking zelf blijft er eerlijk in staan, zonder troostzin.

Eén handeling: het certificaat. De vervolgcursus concurreerde in het concept met een eigen alinea plus prijsblok; die is nu een P.S. van één regel. Het prijsblok ("onze betaalde cursussen kosten € 49,00") is weg: het is een afrondmail, geen verkoopmail, en {{volgendeCursusNaam}} kan ook de gratis cursus zijn — dan klopte die zin niet eens. De prijs staat op de pagina waar de link heen gaat. De anti-urgentie is teruggebracht tot "geen haast — er verloopt niets"; drie zinnen uitleggen dat je géén schaarste gebruikt, is zelf ook een verkooptruc.

Taal: "print hem / sla hem op" is fout, het is het certificaat, dus "het". "Wat er op staat" aan elkaar: "erop". "Les voor les, tot het einde — daar mag je even bij stilstaan" is geschrapt: te veel schouderklopje, en de warmte landt beter in "Fijn dat je het hebt afgemaakt" aan het eind. Zo staat er ook niet twee keer een felicitatie.

Lengte: van negen naar zes alinea's, ongeveer een derde korter. Alles wat verdween was óf herhaling, óf verkoop, óf een belofte. Onderwerpregel ongewijzigd (informatief, kort); preheader ingekort en met "doorlopen" in plaats van iets wat naar slagen ruikt.

</details>

```
Hoi {{voornaam}},

Je hebt {{cursusnaam}} afgerond: alle {{aantalLessen}} lessen, {{totaalXp}} XP onderweg.

Je certificaat staat hier klaar:
{{certificaatUrl}}

Vul je naam in en print het, of sla het op als pdf.

Wat erop staat, is dat je alle lessen hebt doorlopen. Geen diploma met wettelijke status en geen examenuitslag — de quizzen hebben geen slaaggrens, die zijn er om je te laten merken wat blijft hangen.

Sla het nu even op. Je voortgang — XP, badges, vinkjes — staat op dit moment in de browser van dit apparaat, niet op je account. Open je de site op je telefoon, dan begint de telling daar opnieuw en is dit certificaat daar niet terug te halen. Je aankopen blijven wel aan je account hangen.

Klopt er iets niet aan je certificaat, of heb je een vraag over de stof? Antwoord gewoon op deze mail. Die komt bij mij terecht.

Fijn dat je het hebt afgemaakt.

Jason Krijgsman
Beleggingscollege

P.S. Een logische volgende stap is {{volgendeCursusNaam}}: {{volgendeCursusUrl}}. Geen haast — er verloopt niets.

────────────────────────────────────────────
Beleggingscollege — Jason Krijgsman, KVK 71856633
beheer@beleggingscollege.nl

Beleggen brengt risico's met zich mee. Je kunt (een deel van) je inleg verliezen. Beleggingscollege geeft onderwijs — geen persoonlijk beleggingsadvies.

Dit bericht krijg je eenmalig, omdat je een cursus hebt afgerond.
```

---

## bestelling-vastgelopen

**Wanneer:** Verstuurd zodra een aankoop blijft hangen omdat de gecontroleerde Mollie-betaling niet overeenkomt met de vastgelegde order: de webhook haalt de status zelf op, ziet dat bedrag of valuta afwijkt van wat in `purchases` staat, zet de rij dus niet op `paid` en logt de mismatch. De klant heeft afgerekend (of denkt dat te hebben) maar de cursus blijft op slot. Eén mail per vastgelopen bestelling, direct na de mismatch; niet opnieuw sturen zolang dezelfde order in onderzoek is.

**Onderwerp:** Je bestelling staat stil – je geld raak je niet kwijt

**Preheader:** Het ging mis aan mijn kant. Je hoort uiterlijk de eerstvolgende werkdag van me.

**Variabelen:** `{{voornaam}}`, `{{bedrag}}`, `{{cursusnaam}}`, `{{ordernummer}}`

<details><summary>Toelichting van de schrijver</summary>

Vier soorten ingrepen.

1. "Wij" is weggehaald. Het concept sprak afwisselend over "ons systeem", "onze kant" en "wij hadden vastgelegd", terwijl er precies één iemand is die dit oplost. Alles staat nu in de ik-vorm, behalve waar echt het systeem bedoeld wordt. Dat is meteen het verschil tussen een mens uit Den Haag en een klantenserviceafdeling.

2. Ruim een derde korter. De vier losse kopjes (wat is er aan de hand / wat is misgegaan / wat ik nu doe / wanneer je iets hoort) zijn tot twee alinea's samengevoegd; ze vertelden deels hetzelfde. "Wat er precies is misgegaan, weet ik nog niet" en "ik ga geen oorzaak verzinnen" stonden dubbel — het eerlijke deel is blijven staan, de herhaling niet. "Vragen tussendoor?" en de losse afsluiting zijn samengetrokken.

3. Eén handeling. Het concept bood aan het eind twee kanalen (antwoorden of naar {{contactEmail}} schrijven), waardoor de keuze tussen optie 1 en 2 concurrentie kreeg. {{contactEmail}} is geschrapt; er is nu precies één stap: antwoorden met 1 of 2. De variabele is daarom ook uit de lijst.

4. Nederlandse interpunctie. De losse koppeltekens die als gedachtestreepje dienstdeden zijn vervangen door een echt kastlijntje (—), en de puntkomma in de terugstortzin voorkomt een aan elkaar geplakte zin.

Bewust níét aangepast: de belofte "uiterlijk de eerstvolgende werkdag" (operationele toezegging, geen rendementsbelofte, en waar te maken) en "levenslange toegang" (dat is wat een losse cursus daadwerkelijk geeft). Er zat geen valse urgentie, verzonnen sociale bewijskracht of voortgangsclaim in het concept, dus daar viel niets te schrappen. {{bedrag}} moet door het systeem als "EUR 49,00" worden ingevuld — met komma, niet met punt.

</details>

```
Hoi {{voornaam}},

Eerst het belangrijkste: je bent je geld niet kwijt. Is er {{bedrag}} afgeschreven, dan krijg je dat terug óf ik zet {{cursusnaam}} alsnog voor je open. Jij kiest. Is er niets afgeschreven, dan betaal je ook niets.

Wat er speelt: bestelling {{ordernummer}} is blijven steken. Je betaling en wat ik had vastgelegd komen niet overeen, en zolang dat zo is geeft het systeem de cursus niet vrij. Die rem hoort er te zitten, alleen sta jij er nu achter te wachten.

Waaróm het misging weet ik nog niet. Ik ga geen oorzaak verzinnen voordat ik het heb nagekeken. Ik leg je betaling bij betaaldienst Mollie naast mijn eigen administratie en zoek uit waar die twee uit elkaar lopen. Met de hand, door mij.

Uiterlijk de eerstvolgende werkdag hoor je van me — ook als ik het dan nog niet rond heb.

Twee opties, allebei even goed:

1. Geld terug. Ik stort {{bedrag}} volledig terug via de betaalmethode waarmee je betaalde. Hoe snel het op je rekening staat, bepaalt je bank; meestal een paar werkdagen.

2. De cursus alsnog open. Ik zet {{cursusnaam}} met de hand voor je klaar, met dezelfde levenslange toegang als bij een gewone aankoop.

Antwoord op deze mail met 1 of 2, dan regel ik dat. Laat je het aan mij over, dan hoor je vanzelf van me.

Eén ding nog: reken het niet opnieuw af zolang dit loopt. Dan staat er straks twee keer geld open en wordt het uitzoeken alleen maar ingewikkelder.

Sorry voor het gedoe. Je hebt zelf niets verkeerd gedaan.

Hartelijke groet,
Jason Krijgsman
Beleggingscollege

--------------------------------------------
JE BESTELLING

Ordernummer:  {{ordernummer}}
Cursus:       {{cursusnaam}}
Bedrag:       {{bedrag}}
Status:       in onderzoek, cursus nog niet vrijgegeven

Antwoord op deze mail; die komt direct bij mij terecht, niet bij een helpdesk.

Beleggingscollege — Jason Krijgsman, KVK 71856633
```

---

