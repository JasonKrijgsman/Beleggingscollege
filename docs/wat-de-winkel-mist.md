# Wat de winkel nog mist

Laatst bijgewerkt: 2 augustus 2026.

Er is een verschil tussen "de koopknop werkt" en "je hebt een winkel". De knop werkt sinds
2 augustus. Wat hieronder staat is het verschil.

Dit document gaat over de **zes ontbrekende delen die er echt toe doen**, waarom elk een
kerndeel is (en niet iets voor later), en hoe ik het zou oplossen. De volledige lijst van 96
bevindingen staat in `docs/openstaand.md`; dit is de laag daarboven.

Om het scherp te houden per onderdeel dezelfde drie vragen:
**wat mist er**, **wat gaat er kapot zonder**, **wat kost het om te maken**.

---

## 1. De klant krijgt niets in handen

**Wat mist er.** Na het betalen krijgt de klant een webpagina te zien en verder niets. Geen
mail, geen bon, geen factuur. Sluit hij dat tabblad, dan heeft hij geen enkel bewijs dat hij
iets gekocht heeft — geen bedrag, geen datum, geen ordernummer, geen adres om heen te schrijven.

**Waarom dit een kerndeel is.** Drie dingen tegelijk, en dat is waarom dit het eerste is dat af
moet:

1. *Het is wettelijk verplicht.* Bij verkoop op afstand moet de bevestiging op een duurzame
   gegevensdrager. Een webpagina is dat niet: die kan morgen anders zijn. Een mail wel.
2. *Zonder die bevestiging is je herroepingsafstand waarschijnlijk waardeloos.* Je laat de klant
   nu een vinkje zetten waarmee hij afstand doet van zijn bedenktijd van 14 dagen. Dat vinkje
   telt alleen als je die toestemming óók bevestigt. Doe je dat niet, dan houdt hij die 14 dagen
   gewoon — en heb jij niets om je op te beroepen. Je hebt dus wel het ongemak van de checkbox
   en niet de bescherming.
3. *Het is je enige contactmoment.* Er is verder geen enkel moment waarop je een klant bereikt.

**Hoe ik het zou oplossen.** Via Resend, met de records bij Strato (`docs/e-mail-versturen.md`).
De plumbing staat er al: `src/lib/mail.ts`, plus `confirmationSentAt` en `orderNumber` in de
database zodat een klant niet tien keer dezelfde mail krijgt als Mollie de webhook herhaalt.
Wat resteert is de tekst en het aanroepen vanuit de webhook. **Dit is de goedkoopste van de
zes en tegelijk de belangrijkste — een halve dag werk.**

---

## 2. Een terugbetaling doet niets

**Wat mist er.** Betaal je iemand terug via het Mollie-dashboard, dan houdt die persoon zijn
cursus gewoon. Er is geen knop, geen procedure en geen code die toegang intrekt. Andersom net
zo: er is geen manier waarop een klant zijn herroepingsrecht kan uitoefenen behalve een mail
sturen die niemand leest.

**Waarom dit een kerndeel is.** Je FAQ belooft terugbetaling en je voorwaarden beschrijven een
herroepingsrecht. Een belofte die je niet kunt uitvoeren is precies het soort ding waar dit merk
zich tegen afzet. En praktisch: bij een chargeback verlies je het geld én houdt de klant het
product, plus € 10 kosten van Mollie. Bij een MOI is dat € 65.

**Hoe ik het zou oplossen.** Twee stappen, klein en groot:
- *Klein, nu:* Mollie's refund-webhook afvangen en bij een terugbetaling `purchases.status` op
  `refunded` zetten. `heeftToegangTot()` kijkt al alleen naar `paid`, dus daarmee vervalt de
  toegang automatisch. Dit is een uur werk en dicht het gat.
- *Groot, later:* een knop in `/account` waarmee de klant binnen 14 dagen zelf kan ontbinden.
  Dat haalt de aanleiding voor chargebacks en MOI's weg — goedkoper dan het alternatief.

---

## 3. Voortgang reist niet mee, terwijl je het tegendeel verkoopt

**Wat mist er.** XP, level, streak, alle tien de badges, elk lesvinkje en elk certificaat staan
in `localStorage`. De tabellen `lesson_progress` en `user_stats` staan wél in de database, zijn
gemigreerd en gedeployd, en worden door **geen enkele regel code** gelezen of geschreven.

**Waarom dit een kerndeel is.** Niet omdat de functie ontbreekt, maar omdat je hem *verkoopt*.
Een klant koopt op zijn laptop, opent 's avonds zijn telefoon, en vindt daar zijn cursus terug
maar al zijn punten weg. Dat voelt als een defect, en het is de meest waarschijnlijke eerste
supportvraag die je ooit krijgt.

Het raakt bovendien het enige dat een abonnement rechtvaardigt. College+ verkoopt terugkomen.
Gamification die per apparaat opnieuw begint, geeft niemand een reden om terug te komen.

**Hoe ik het zou oplossen.** De database als bron van waarheid zodra iemand is ingelogd,
`localStorage` als val-terug voor wie dat niet is. Bij de eerste login de lokale voortgang
één keer naar boven duwen, zodat wie al bezig was niets kwijtraakt. Reken op een dag werk;
de tabellen zijn er al en het schema klopt.

---

## 4. Certificaten zijn niets waard

**Wat mist er.** Iedereen kan in een minuut een certificaat maken voor een cursus van € 49 die
hij nooit gekocht heeft — er is geen servercontrole. Er staat geen verificatiecode op en er is
niets om hem tegen na te kijken. De tekst beloofde tot vandaag "alle quizzen behaald", terwijl
de quiz geen ondergrens kent: nul goed telt ook als afgerond.

**Waarom dit een kerndeel is.** Het certificaat is wat je verkoopt. "Certificaat voor elke
afgeronde cursus" staat als kenmerk op de prijskaart. Een certificaat dat iedereen kan maken en
niemand kan controleren, is geen certificaat maar een plaatje. Zodra iemand het op LinkedIn zet
en een ander klikt erop, is dat zichtbaar.

**Hoe ik het zou oplossen.** Drie dingen, oplopend in werk:
- Toegang serverzijdig controleren voordat de pagina rendert (nu gebeurt dat niet).
- Een verificatiecode op het certificaat plus een publieke pagina
  `/certificaat/{{code}}` die zegt wie wat wanneer heeft afgerond.
- Beslissen wat het cijfer betekent: óf een echte slaagdrempel invoeren (bijvoorbeeld 70%, met
  hertoetsen), óf eerlijk "deelnamebewijs" zeggen. Vandaag is de tekst afgezwakt naar
  "doorlopen", maar die keuze staat nog open — en hij is inhoudelijk, niet technisch. **Dit is
  er een voor jou, niet voor mij.**

---

## 5. Er kijkt niemand naar de winkel

**Wat mist er.** Geen monitoring, geen alarmering, geen eigen foutpagina. Elk probleem in dit
document verloopt geruisloos: je hoort het pas van een klant, als die de moeite neemt. Er is ook
niemand die de postbus leest waar `/contact`, `/privacy` en `/herroepingsrecht` naar verwijzen.

**Waarom dit een kerndeel is.** Alle bovenstaande gaten zijn stil. Een mislukte bevestigingsmail
logt een regel die niemand ziet. Een `mismatch`-betaling wacht op iemand die het handmatig
uitzoekt — en die persoon weet niet dat hij iets moet uitzoeken. De wettelijke termijn voor een
herroeping is 14 dagen; die loopt door of je de mail leest of niet.

**Hoe ik het zou oplossen.** Klein beginnen, want dit hoeft niet duur:
- Een eigen `error.tsx` in het Nederlands, zodat een storing niet als een kale Engelse pagina
  eindigt.
- Bij elke betaling die op `mismatch` of langer dan een uur op `pending` staat: een mail naar
  jezelf. Dat is tien regels code en vervangt een monitoringplatform.
- De postbus `beheer@` op je telefoon zetten. Kost nul.
- Later pas: Sentry of vergelijkbaar.

---

## 6. Het bewijs klopt niet met wat je belooft

**Wat mist er.** Btw wordt nergens uitgesplitst, er is geen factuurnummering (dat komt nu pas
met `orderNumber`), er staat geen vestigingsadres en geen btw-identificatienummer op de site, en
er is geen vastlegging van waar de klant zit — terwijl je btw-plicht daarvan afhangt.

**Waarom dit een kerndeel is.** Dit is het soort ding dat maandenlang niets doet en dan in één
keer een probleem is: bij de aangifte, bij een controle, of bij een klant die om een factuur
vraagt en er geen krijgt terwijl je voorwaarden er een beloven.

**Hoe ik het zou oplossen.** De bevestigingsmail is de natuurlijke plek voor de btw-regel, dus
dit lift mee op punt 1. Het adres en het btw-nummer zijn een tekstwijziging in de voettekst —
tien minuten, zodra jij mij die gegevens geeft. De landbepaling van de klant kan uit het
IP-adres dat we al vastleggen plus de betaalmethode van Mollie.

---

## Wat ik in welke volgorde zou doen

| | Wat | Waarom eerst | Werk |
|---|---|---|---|
| 1 | Bevestigingsmail | Wettelijk verplicht, en zonder dit is je herroepingsafstand waardeloos | ½ dag |
| 2 | Terugbetaling trekt toegang in | Een uur werk dat een openstaand gat dicht | 1 uur |
| 3 | Adres + btw-nummer in de voettekst | Verplicht, en het is tekst | 10 min |
| 4 | Waarschuwingsmail bij een vastgelopen betaling | Maakt al het bovenstaande zichtbaar | 1 uur |
| 5 | Voortgang naar de database | De eerste supportvraag die je gaat krijgen | 1 dag |
| 6 | Certificaten controleren en verifieerbaar maken | Het ding dat je verkoopt | 1 dag |

Punt 1 tot en met 4 zijn samen ongeveer een dag en halen de winkel over de streep van
"juridisch verkoopbaar". Punt 5 en 6 gaan over of mensen blijven.

Wat hier bewust **niet** in staat: het abonnement College+. Dat wacht op Mollie's goedkeuring
van automatische incasso, en zolang punt 3 en 5 niet af zijn is er ook geen reden waarom iemand
een abonnement zou volhouden. Zie `docs/prijsstrategie.md`, dat daar al voor waarschuwde.
