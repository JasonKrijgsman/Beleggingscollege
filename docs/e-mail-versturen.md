# E-mail versturen

Laatst bijgewerkt: 2 augustus 2026.

## Waar we geland zijn

**Migadu, en de code praat er inmiddels ook echt mee.** De ombouw van Resend (HTTP) naar Migadu
(SMTP) is op 3 augustus 2026 gedaan; er gaat alleen nog niets de deur uit omdat de
omgevingsvariabelen leeg zijn.

> **Stand 3 augustus 2026:** de naamservers van `beleggingscollege.nl` zijn bij Strato omgezet
> naar Cloudflare (`joan`/`rene.ns.cloudflare.com`) nadat DNSSEC eindelijk op "Niet actief"
> stond. Zodra die delegatie doorwerkt, neemt de Cloudflare-zone het over — inclusief de
> Migadu-MX. Daarna: Migadu → Rerun Checks, postbus aanmaken, variabelen vullen, testen.

Dat "wachten" is een bewuste keuze en geen vergeten actie. Onderbouwing hieronder, inclusief
wat we níét doen en waarom — zodat niemand dit over drie weken opnieuw gaat uitzoeken.

## Het misverstand dat dit document uit de wereld helpt

**Verzenden en ontvangen zijn twee losse dingen.** Een postbus ontvangt post. Transactionele
mail — een orderbevestiging — versturen we via een server of API, en daar is geen postbus voor
nodig. Dit heeft dus nooit gewacht op Strato, ook al leek dat zo.

De postbus die we nodig hebben voor antwoorden bestaat trouwens allang:
`beheer@beleggingscollege.nl` draait bij Strato, bevat mail en werkt gewoon.

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

## Waarom we wachten op de `.nl`

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

## De ontsnappingsroute — als Strato blijft treuzelen

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

## De valkuil: DMARC staat op reject en er is geen SPF

Dit is het enige dat echt stil mis kan gaan.

Op `beleggingscollege.nl` staat `v=DMARC1;p=reject;` — de standaardregel van Strato. Er is
**geen SPF-record**. Dat uitgaande post van Strato tóch aankomt, komt doordat Strato met DKIM
ondertekent (`strato-dkim-0002` en `strato-dkim-0003` staan in de zone). DMARC slaagt namelijk
op SPF **óf** DKIM.

Gaat Migadu straks namens dit domein versturen zonder dat Migadu's eigen DKIM-records staan, dan
slaagt geen van beide en zegt onze eigen DMARC-regel tegen de ontvanger: *weiger deze mail*.
Niet in de map ongewenst — geweigerd. Elke orderbevestiging zou verdwijnen, en wij zouden dat
niet merken.

**Daarom: eerst de records, dan pas verzenden.** En zet DMARC tijdelijk op `p=quarantine` tot
verzenden bewezen werkt; daarna terug naar `reject`.

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

**`purchases.confirmationSentAt` voorkomt dubbele post.** Mollie roept de webhook gegarandeerd
meerdere keren aan voor dezelfde betaling. Zonder dit veld krijgt de klant tien identieke mails.
Het veld is tegelijk het bewijs dát de wettelijk verplichte bevestiging verstuurd is.

**`purchases.orderNumber` is een doorlopende reeks** (`BC-2026-0001`), niet het UUID en niet het
Mollie-id. De Belastingdienst wil een reeks zonder gaten.

## Wat hierna nog moet

- [x] ~~`src/lib/mail.ts` omzetten van de Resend-API naar Migadu SMTP.~~ Gedaan 3 aug 2026.
- [ ] Een herkansing als de bevestigingsmail mislukt. Nu wordt dat alleen naar de console
      gelogd, terwijl juist die mail bepaalt of het herroepingsrecht vervalt.
- [ ] Bounces afhandelen. Bij Migadu komen die terug in de postbus; er moet iemand kijken.
- [ ] Een echte factuur met btw-uitsplitsing. De bevestiging is geen factuur.
- [ ] Een SPF-record toevoegen. Niet strikt nodig zolang DKIM het werk doet, maar netter.
