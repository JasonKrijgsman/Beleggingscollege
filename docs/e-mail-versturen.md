# E-mail versturen

Laatst bijgewerkt: 5 augustus 2026.

## Waar we geland zijn

**HET WERKT — bewezen op 5 augustus 2026.** De SMTP-variabelen staan in Vercel
(Production + Preview, wachtwoord als Sensitive), er is geherdeployed, en een
testmodus-aankoop (Introductie Technische Analyse, order `BC-2026-0001`) leverde binnen
een minuut de orderbevestiging af in de **inbox** van Gmail — niet in spam — met
`spf=pass`, `dkim=pass` (key1) én `dmarc=pass` in de `Authentication-Results`. De hele
keten (checkout → Mollie-webhook → atomaire claim → Migadu SMTP → bezorging) is daarmee
end-to-end aangetoond; een testmodus-betaling doorloopt exact dezelfde mailcode als een
echte.

**De enige actie die nog uit dit document volgt: DMARC terug van `p=quarantine` naar
`p=reject`** — zie de checklist onderaan. Daarnaast twee bevindingen uit de testmail, die
elders belegd zijn: de HTML-versie linkt met leestekens erin (kapotte links, zie
`docs/openstaand.md` §6) en het verkopersblok toont `[vestigingsadres nog niet ingevuld]`
zolang `BEDRIJF_ADRES` leeg is (bekend punt, ook `docs/openstaand.md`).

> **Stand eind 3 augustus 2026 — alles behalve de laatste stap is gedaan** *(historisch;
> de laatste stap is op 5 aug gezet, zie boven)*:
>
> - De naamservers van `beleggingscollege.nl` staan bij Cloudflare (`joan`/`rene.ns.cloudflare.com`);
>   DNSSEC is eraf en de delegatie was binnen tien minuten bij SIDN.
> - **Migadu is Actief** sinds `2026-08-03T15:51:18Z`. Geen "Rerun Checks" nodig geweest — Migadu
>   zag de records zelf. SPF, drie DKIM-CNAME's en DMARC stonden er vóór de activering.
> - **`beheer@beleggingscollege.nl` bestaat** (naam "Beleggingscollege", verzenden en ontvangen
>   aan, IMAP/POP3/ManageSieve aan, verloopt nooit). Daarnaast staat er een ongebruikte `admin@`
>   die automatisch is meegekomen met het domein.
> - De ombouw van Resend (HTTP) naar Migadu (SMTP) zit in `main` (PR #31).
>
> **Wat nog moet:** `MAIL_SMTP_GEBRUIKER` en `MAIL_SMTP_WACHTWOORD` in Vercel (Production +
> Preview), opnieuw deployen, één echte bestelling testen, en pas dán DMARC terugzetten van
> `p=quarantine` naar `p=reject`. Die volgorde is niet vrijblijvend — zie de valkuil verderop.
>
> **Let op:** Forwarding staat bij Migadu op Inactive. Post die binnenkomt blijft daar liggen
> tot iemand inlogt, en dit is straks ook het adres waar klanten hun antwoord heen sturen.

De rest van dit document legt vast waaróm het Migadu is en niet Resend, en wat we bewust níét
gedaan hebben — zodat niemand dit over drie weken opnieuw gaat uitzoeken.

## Het misverstand dat dit document uit de wereld helpt

**Verzenden en ontvangen zijn twee losse dingen.** Een postbus ontvangt post. Transactionele
mail — een orderbevestiging — versturen we via een server of API, en daar is geen postbus voor
nodig. Dit heeft dus nooit gewacht op Strato, ook al leek dat zo.

De postbus die we nodig hebben voor antwoorden bestond trouwens allang:
`beheer@beleggingscollege.nl` draaide bij Strato en bevatte mail. **Dat is sinds de
naamserverwissel van 3 augustus niet meer waar** — de MX van dit domein wijst nu naar
Migadu (`aspmx1`/`aspmx2.migadu.com`), en Strato waarschuwt zelf dat e-mailfuncties
vervallen zodra je eigen naamservers gebruikt. De postbus is inmiddels bij Migadu
aangemaakt; zie het statusblok bovenaan. Wie deze regel las toen hij nog "werkt gewoon"
zei: de post die de site op /contact, /voorwaarden, /herroepingsrecht en /privacy
belooft te ontvangen, komt aan bij Migadu en nergens anders.

## Waarom Migadu en niet Resend

Eerst stond hier Resend. Dat is teruggedraaid na een gesprek met Jason op 2 augustus 2026, en
de redenering is het waard om te bewaren.

| | Migadu | Resend |
|---|---|---|
| Kosten | Al betaald (Micro/yearly), draait al voor bliep.org en jasonkrijgsman.com | Gratis tot 3.000/mnd |
| Accounts | Nul nieuwe | Eén nieuwe |
| DNS-records | Nodig | Ook nodig |
| Bezorglogboek, bounce-webhooks | Nee | Ja |
| Waar de post van dit domein tóch heen gaat | Hierheen | — |

**Doorslaggevend:** Jason betaalt al voor Migadu, vertrouwt het, en de post van
`beleggingscollege.nl` gaat er na de verhuizing sowieso heen. Eén dienst minder is bij een
eenmanszaak meer waard dan een bezorgdashboard dat je bij nul tot enkele verkopen per maand
toch niet leest. Een harde bounce komt bij Migadu gewoon terug in de postbus.

**Wat we daarmee opgeven:** zicht op aflevering. Bij Resend zie je in een dashboard of een mail
is aangekomen; bij Migadu merk je het pas als er iets terugkomt. Voor een mail waar een
juridisch gevolg aan hangt is dat een reëel nadeel — zie het openstaande punt over een
herkansing in `docs/openstaand.md`.

**Heroverwegen wanneer:** het volume groeit, of als een bounce-golf de verzendreputatie raakt.
Bij Migadu zit de transactionele post op dezelfde reputatie als Jasons persoonlijke mail. Bij
dit volume geen probleem, bij een groter volume wel iets om uit elkaar te trekken.

### Een correctie die je moet kennen

Er is even gedacht dat transactionele mail buiten Migadu's toegestane gebruik valt. **Dat klopt
niet.** Migadu's voorwaarden verbieden spam en mailinglijsten waar mensen geen toestemming voor
gaven. Een orderbevestiging aan iemand die net betaald heeft is geen van beide. Wat Migadu wél
heeft is een uitgaand quotum per abonnement, en dat is bij dit volume niet relevant.

Het echte obstakel is een ander, zie hieronder.

## Waarom we wachtten op de `.nl` — historisch, opgelost op 3 augustus 2026

> Dit hoofdstuk en het volgende (de ontsnappingsroute) beschrijven de situatie vóór de
> naamserverwissel. **Ze zijn ingehaald**: de delegatie staat bij Cloudflare, de MX wijst
> naar Migadu en het domein is Actief. De afweging blijft staan omdat ze uitlegt waarom we
> níét eerst e-mail op de `.com` hebben opgezet — dat is nog steeds een goede reden.

Migadu activeert een domein pas als de MX-records naar Migadu wijzen — hun eigen tekst: *"Email
capability will remain inactive until the required checks pass."* Zonder activering geen
verzending. Migadu gebruiken voor `beleggingscollege.nl` betekent dus de MX weghalen bij Strato,
en dat betekent de bestaande postbus meeverhuizen.

Dat kán vandaag (zie de ontsnappingsroute hieronder), maar het hoeft niet, en dit is waarom:

**De bevestigingsmail staat niet op het kritieke pad.** Er kan vandaag geen echt geld
binnenkomen, om redenen die los van e-mail staan:

- `MOLLIE_API_KEY` in Vercel is nog een `test_`-key
- Vercel staat op Hobby, dat commercieel gebruik verbiedt
- Er staat nog geen vestigingsadres in de bevestiging

De bevestiging wordt pas blokkerend op het moment dat de live-key erin gaat. Wachten kost dus
niets, en het scheelt een postbus op de `.com` opzetten die je een paar weken later weer
verhuist.

**Het risico van wachten:** hiermee hangt een wettelijke voorwaarde aan het tempo van Strato, en
dat tempo is niet van ons. Er staat "DNSSEC: Wordt gedeactiveerd" zonder datum.

## De ontsnappingsroute — als Strato blijft treuzelen (nooit nodig geweest)

> **Niet meer uitvoeren.** Strato hoefde niet ingehaald te worden: DNSSEC ging er op
> 3 augustus zelf af en de naamserverwissel was binnen tien minuten bij SIDN. Stap 3
> ("Rerun Checks") is bovendien niet nodig gebleken — Migadu zag de records uit zichzelf.
> Het staat er nog als vastgelegde afweging, niet als draaiboek.

Doe dit zodra Jason wél wil verkopen en de `.nl` nog niet verhuisd is. **De e-mailverhuizing
heeft de naamserverwissel niet nodig.** MX-records staan ín de zone bij Strato, en DNSSEC
blokkeert het wijzigen van records niet — alleen het wisselen van naamservers.

1. Exporteer de bestaande post uit `beheer@` en `info@` bij Strato (samen ± 6 MB, via IMAP of
   Migadu's importfunctie). **Sla deze stap niet over**, anders ben je de inhoud kwijt.
2. Zet Migadu's records in het DNS-paneel van Strato: Domeinen → beleggingscollege.nl → DNS.
   De volledige lijst staat in `docs/migadu-records.txt`.
3. Migadu → Rerun Checks. Het domein gaat van Inactive naar Active.
4. Maak `beheer@beleggingscollege.nl` aan bij Migadu en importeer de oude post.
5. Vul de omgevingsvariabelen (zie onder) en test.

Diezelfde records komen bij de uiteindelijke verhuizing gewoon opnieuw in Cloudflare te staan.
Er gaat dus geen werk verloren.

### Wat we bewust níét doen

**E-mail opzetten op `beleggingscollege.com`.** Dat kon vandaag — de DNS van de `.com` ligt
volledig bij Cloudflare, zonder Strato en zonder DNSSEC. Afgevallen omdat je dan
`beheer@beleggingscollege.com` configureert, een paar weken gebruikt, en daarna alsnog naar de
`.nl` verhuist: het adres in de code wijzigen, opnieuw verifiëren, klanten met twee adressen.
Die rompslomp is meer waard dan de weken die het scheelt, zolang er toch niet verkocht wordt.

**Versturen via Strato SMTP.** Werkt vandaag, nul DNS-wijzigingen, DKIM slaagt al. Afgevallen
omdat Strato precies de partij is waar we weg willen: je bouwt iets wat je bij de verhuizing
weer sloopt. Bovendien zet je dan een postbuswachtwoord in Vercel in plaats van een sleutel die
je kunt intrekken — en dat wachtwoord geeft ook leestoegang tot de postbus.

## De valkuil die er was — en de omgekeerde actie die er nu ligt

Dit was het enige dat echt stil mis kon gaan, en het is op 3 augustus afgevangen. De
redenering hoort bewaard te blijven, de conclusie is veranderd.

**Hoe het was.** Op `beleggingscollege.nl` stond `v=DMARC1;p=reject;` — de standaardregel van
Strato — en er was **geen SPF-record**. Dat uitgaande post van Strato tóch aankwam, kwam
doordat Strato met DKIM ondertekende (`strato-dkim-0002` en `strato-dkim-0003` stonden in de
zone). DMARC slaagt namelijk op SPF **óf** DKIM. Zou Migadu namens dit domein gaan versturen
zonder dat Migadu's eigen records stonden, dan slaagde geen van beide en zei onze eigen
DMARC-regel tegen de ontvanger: *weiger deze mail*. Niet in de map ongewenst — geweigerd.
Elke orderbevestiging zou verdwijnen, en wij zouden dat niet merken.

**Hoe het nu is (geverifieerd 3 augustus 2026 tegen 1.1.1.1):** de zone bij Cloudflare
publiceert een SPF-record `v=spf1 include:spf.migadu.com -all`, de drie DKIM-CNAME's naar
`migadu.com`, en DMARC op `v=DMARC1; p=quarantine; adkim=r; aspf=r`. Er is dus wél SPF, en
DMARC staat bewust op quarantine.

**De actie die overblijft is daarmee de omgekeerde van wat hier ooit stond:** niet "zet DMARC
op quarantine", maar **DMARC terugzetten naar `p=reject` zodra verzenden aantoonbaar werkt**.
Doe dat pas ná een geslaagde echte bestelling; quarantine is de zachte landing tussen die twee
momenten. Wie hier stopt na het invullen van de SMTP-variabelen, laat het domein permanent op
de zwakkere regel staan.

## Omgevingsvariabelen

In Vercel (Production + Preview) en in `.env.local`:

```
MAIL_SMTP_GEBRUIKER=     # het volledige mailadres, bijv. beheer@beleggingscollege.nl
MAIL_SMTP_WACHTWOORD=
MAIL_SMTP_HOST=          # optioneel, standaard smtp.migadu.com
MAIL_SMTP_PORT=          # optioneel, standaard 465
MAIL_AFZENDER=Beleggingscollege <beheer@beleggingscollege.nl>
BEDRIJF_ADRES=
BEDRIJF_BTW_NUMMER=NL004813328B30
```

**De ombouw naar Migadu is gedaan** (3 augustus 2026). `src/lib/mail.ts` praat via nodemailer
met `smtp.migadu.com`; de gebruikersnaam is het volledige mailadres. De rest van de keten —
`orderbevestiging.ts`, `mailteksten.ts`, de webhook — is niet aangeraakt: die roepen alleen
`verstuurMail()` aan. Dat was precies het punt van die modulegrens.

**nodemailer staat exact op 8.0.11 en dat is geen slordigheid.** Auth.js (`next-auth`,
`@auth/core`) heeft een peer dependency op `nodemailer@^7 || ^8`. Installeer je 9, dan weigert
npm de installatie met een ERESOLVE-fout en breekt de auth-adapter. Optrekken kan pas als
Auth.js zelf meegaat.

Zonder verzendgegevens verstuurt de app niets en logt hij een waarschuwing. De aankoop werkt
gewoon door; dat is met opzet.

## Twee btw-nummers, en één ervan mag nooit naar buiten

Jason heeft er twee, en ze lijken op elkaar:

- **`NL004813328B30`** — het **btw-identificatienummer**. Dit is het openbare nummer; het hoort
  in de voettekst (art. 3:15d BW) en in de orderbevestiging. Staat er inmiddels in.
- Het **omzetbelastingnummer** — afgeleid van Jasons BSN, staat bewust niet in de repo — hoort
  **nergens** gepubliceerd te worden. Niet in de repo, niet in de footer, niet in een mail, niet
  in documentatie. We noemen het hier alleen bij naam, zodat je weet dát het bestaat en waarom je het
  niet moet gebruiken.

## Ontwerpkeuzes in de code

**`verstuurMail()` gooit nooit.** De aanroep gebeurt vanuit de Mollie-webhook, ná het moment
waarop de aankoop op `paid` staat. Zou een mislukte mail een fout gooien, dan geeft de webhook
een 500 en gaat Mollie het tien keer over 26 uur opnieuw proberen. Liever een klant zonder
bevestigingsmail — die kan hij alsnog krijgen — dan een klant met een aankoop die in de war
raakt. Mislukkingen worden gelogd.

**Een atomaire claim voorkomt dubbele post — niet meer een gelezen vlaggetje.** Mollie roept de
webhook gegarandeerd meerdere keren aan voor dezelfde betaling. Hier stond dat
`purchases.confirmationSentAt` dat afving; dat klopt sinds 3 augustus 2026 op twee punten niet
meer. Ten eerste zit het veld nu op `payment_attempts` (het betaalmodel is gesplitst, zie
`docs/ontwerp-betaalmodel.md`). Ten tweede — en dat is de inhoudelijke correctie — was
lezen-dan-doen een race: twee gelijktijdige webhooks lazen allebei "nog niet verstuurd" en
mailden allebei. Nu claimt `stuurOrderbevestiging()` eerst met
`UPDATE … SET confirmation_claimed_at = now() WHERE confirmation_claimed_at IS NULL … RETURNING`;
wie nul rijen terugkrijgt stopt. Blijkt de mail daarna aantoonbaar níét weg, dan wordt de claim
teruggegeven zodat een volgende aanroep het opnieuw probeert. `confirmationSentAt` is daarmee
alleen nog het bewijs dát de wettelijk verplichte bevestiging verstuurd is — en het verschil
tussen "geclaimd" en "verstuurd" is precies wat een monitoringronde moet naslaan.

**`payment_attempts.orderNumber` is een doorlopende reeks** (`BC-2026-0001`), niet het UUID en
niet het Mollie-id. De Belastingdienst wil een reeks zonder gaten. Het nummer wordt niet los
verzonnen maar atomair uitgedeeld uit de tabel `order_counters`, binnen hetzelfde statement dat
de betaling op `paid` zet. Daardoor heeft élke betaalde poging een nummer, ook als de mail
daarna mislukt — en rolt de statusovergang terug, dan rolt de teller mee. De oude
`geefOrdernummer()`-constructie (rijen tellen, +1 proberen, met een `Date.now()`-terugval die
een nummer mailde dat nooit in de database stond) bestaat niet meer; `orderbevestiging.ts`
weigert expliciet om zelf een nummer te verzinnen en logt in plaats daarvan een fout.

## Wat hierna nog moet

- [x] ~~`src/lib/mail.ts` omzetten van de Resend-API naar Migadu SMTP.~~ Gedaan 3 aug 2026.
- [ ] Een herkansing als de bevestigingsmail mislukt. Nu wordt dat alleen naar de console
      gelogd, terwijl juist die mail bepaalt of het herroepingsrecht vervalt.
- [ ] Bounces afhandelen. Bij Migadu komen die terug in de postbus; er moet iemand kijken.
- [ ] Een echte factuur met btw-uitsplitsing. De bevestiging is geen factuur.
- [x] ~~Een SPF-record toevoegen.~~ Staat er sinds 3 aug 2026:
      `v=spf1 include:spf.migadu.com -all`, samen met de drie DKIM-CNAME's.
- [ ] **DMARC terugzetten van `p=quarantine` naar `p=reject`** — de voorwaarde is op
      5 aug 2026 vervuld: verzenden is aantoonbaar goed (testaankoop bezorgd in de
      Gmail-inbox met spf/dkim/dmarc alle drie pass). Dit is nu gewoon een
      Cloudflare-DNS-wijziging die kan. Het blijft het punt dat het makkelijkst blijft
      liggen, want niets breekt als je het vergeet; het domein staat dan alleen
      permanent zwakker.
