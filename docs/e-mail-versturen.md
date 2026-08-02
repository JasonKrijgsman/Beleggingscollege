# E-mail versturen

Laatst bijgewerkt: 2 augustus 2026.

## Het misverstand dat dit document uit de wereld helpt

**Verzenden en ontvangen zijn twee losse dingen.** Een postbus ontvangt post. Transactionele
mail — een orderbevestiging — versturen we via een API, en daar is geen postbus voor nodig.

Dit wacht dus **niet** op de verhuizing bij Strato. En de postbus die we nodig hebben voor
antwoorden bestaat allang: `beheer@beleggingscollege.nl` draait bij Strato en bevat mail.

## Waarom Resend

| | |
|---|---|
| Gratis laag | 3.000 mails per maand, 100 per dag |
| Kosten daarna | $20/mnd voor 50.000 mails |
| Waarom niet Postmark | Betere reputatie, maar 100 mails/mnd gratis en daarna $15 — bij nul klanten onnodig |
| Waarom niet Amazon SES | Goedkoopst op schaal, maar je moet uit de sandbox worden gelaten en het is veel meer werk |
| Waarom niet via Strato SMTP | Werkt, maar Strato is precies de partij waar we weg willen. Dan bouw je iets wat je bij de verhuizing weer moet slopen |

Bij Jasons volume (nul tot enkele verkopen per maand) is Resend jaren gratis.

## De valkuil: DMARC staat op reject en er is geen SPF

Dit is het enige dat echt mis kan gaan, en het gaat *stil* mis.

Op `beleggingscollege.nl` staat `v=DMARC1;p=reject;` — de standaardregel van Strato. Er is
**geen SPF-record**. Dat uitgaande post van Strato tóch aankomt, komt doordat Strato met DKIM
ondertekent (`strato-dkim-0002` en `strato-dkim-0003` staan in de zone). DMARC slaagt namelijk
op SPF **óf** DKIM.

Gaat Resend namens dit domein versturen zonder eigen DKIM, dan slaagt geen van beide en zegt
onze eigen DMARC-regel tegen de ontvanger: *weiger deze mail*. Niet in de map ongewenst —
geweigerd. Elke orderbevestiging zou verdwijnen, en wij zouden dat niet merken.

**Daarom: eerst de DNS-records, dan pas de key in Vercel.**

## Stappenplan

### 1. Resend-account (Jason)
Aanmelden op resend.com. Gratis laag volstaat. Domein `beleggingscollege.nl` toevoegen.

### 2. DNS-records bij Strato (Jason, ik kan meekijken)
Resend toont na het toevoegen van het domein een lijst records. Die kunnen gewoon in het
DNS-paneel van Strato: **Domeinen → beleggingscollege.nl → DNS → TXT- en CNAME-records**.

DNSSEC blokkeert dit niet. DNSSEC blokkeert het wisselen van *naamservers*, niet het wijzigen
van records binnen de zone; Strato ondertekent de zone daarna zelf opnieuw.

Wat Resend vraagt is doorgaans:

| Type | Naam | Waarde |
|---|---|---|
| TXT | `resend._domainkey` | de DKIM-sleutel die Resend toont |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (prioriteit 10) |

Let op de twee dingen die hier fout gaan:
- **De MX en SPF horen op de subdomeinnaam `send`, niet op `@`.** Zet je ze op `@`, dan
  overschrijf je de MX van het hoofddomein en komt er geen post meer binnen op
  `beheer@beleggingscollege.nl`.
- Neem de DKIM-waarde over zonder regeleinden.

### 3. Controleren vóór de key erin gaat
```bash
# DKIM van Resend moet bestaan
nslookup -type=TXT resend._domainkey.beleggingscollege.nl

# de bestaande MX van het hoofddomein moet ONGEWIJZIGD naar Strato blijven wijzen
nslookup -type=MX beleggingscollege.nl
```
De tweede is de belangrijkste: die bewijst dat je de ontvangende post niet gesloopt hebt.

### 4. Omgevingsvariabelen
In Vercel (Production + Preview) en in `.env.local`:

```
RESEND_API_KEY=re_...
MAIL_AFZENDER=Beleggingscollege <beheer@beleggingscollege.nl>
```

Zonder `RESEND_API_KEY` verstuurt de app niets en logt hij een waarschuwing. De aankoop werkt
gewoon door — dat is met opzet, zie hieronder.

### 5. Testen
Koop op de live site een cursus met de test-key en controleer dat de bevestiging aankomt.
Controleer daarna in de kopregels van die mail dat er `dkim=pass` en `dmarc=pass` staat. In
Gmail: de drie puntjes → "Origineel weergeven".

## Ontwerpkeuzes in de code

**`verstuurMail()` gooit nooit.** De aanroep gebeurt vanuit de Mollie-webhook, ná het moment
waarop de aankoop op `paid` staat. Zou een mislukte mail een fout gooien, dan geeft de webhook
een 500 en gaat Mollie het tien keer over 26 uur opnieuw proberen. Liever een klant zonder
bevestigingsmail — die kan hij alsnog krijgen — dan een klant met een aankoop die in de war
raakt. Mislukkingen worden gelogd.

**`purchases.confirmationSentAt` voorkomt dubbele post.** Mollie roept de webhook gegarandeerd
meerdere keren aan voor dezelfde betaling. Zonder dit veld krijgt de klant tien identieke
mails. Het veld is tegelijk het bewijs dát de wettelijk verplichte bevestiging verstuurd is.

**`purchases.orderNumber` is een doorlopende reeks** (`BC-2026-0001`), niet het UUID en niet
het Mollie-id. De Belastingdienst wil een reeks zonder gaten.

## Wat hierna nog moet

- [ ] Bounces en klachten afhandelen. Resend kan een webhook sturen als een mail hard bounct;
      dan weten we dat een klant onbereikbaar is. Nu horen we niets.
- [ ] Een echte factuur met btw-uitsplitsing. De bevestiging is niet hetzelfde als een factuur.
- [ ] Een SPF-record op het hoofddomein toevoegen. Niet nodig zolang DKIM het werk doet, maar
      wel netter, en het scheelt bij ontvangers die op SPF leunen.
