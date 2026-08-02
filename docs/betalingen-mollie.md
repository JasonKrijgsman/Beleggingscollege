# Betalingen via Mollie — status, risico's en bouwplan

Laatst bijgewerkt: 3 augustus 2026. Dit is het levende document voor alles rond betalen.
Zie ook `docs/wordpress-audit.md` (hoe we dit ontdekten) en `CLAUDE.md` (architectuur).

## Status van het Mollie-account

| Onderdeel | Status |
|---|---|
| Organisatie | Beleggingscollege, org_17405389, voorwaarden geaccepteerd 4 juni 2023 |
| Onboarding | **Afgerond** — "Je bent klaar om betaald te worden" |
| Live profiel | **Beleggingscollege** (www.beleggingscollege.nl) — status **Online** |
| Bankrekening | Geverifieerd, gekoppeld, geselecteerd voor uitbetalingen, EUR (IBAN staat bewust niet in deze repo) |
| Actieve methoden | iDEAL, krediet-/debetkaarten, PayPal, Apple Pay |
| SEPA-incasso | **Aangevraagd op 3 aug 2026** — status: klok-icoon = in beoordeling bij Mollie |
| Oud testprofiel | example.org — geblokkeerd, kan genegeerd worden |

De KYC-molen is dus al in 2023 doorlopen. Betalingen zijn **niet** het knelpunt; het ontbreekt
alleen nog aan accounts/login en serverkant in de nieuwe app.

### Openstaande actie
- [ ] **Controleer of Mollie SEPA-incasso heeft goedgekeurd** (klok → vinkje op de pagina
      Instellingen → Online Betalingen). Mollie doet hiervoor een extra controleproces.
- [ ] Live API-key ophalen uit Mollie en veilig in de omgevingsvariabelen van de nieuwe app zetten
      (**nooit** in de repo committen). De oude WordPress-koppeling stond alleen op de Test-key.

## Tarieven SEPA-incasso (zoals getoond in het Mollie-dashboard)

| Post | Bedrag |
|---|---|
| SEPA-incasso (per incasso) | € 0,35 |
| Direct debit batch | € 0,35 |
| Terugstorting | € 0,25 |
| Chargeback (storno) | € 10,00 |
| Mislukte incassopoging | € 0,95 |
| **Melding Onterechte Incasso (MOI)** | **€ 65,00 excl. btw** |

## Het risico dat we bewust accepteren — MOI

Twee verschillende scenario's, vaak door elkaar gehaald:

1. **Storno binnen 8 weken.** De klant draait de incasso zelf terug via zijn bankomgeving,
   zonder opgaaf van reden en zonder onderzoek. Kosten: het teruggeboekte bedrag + € 10,00.
   **Dit is niet de € 65.**
2. **MOI, tot 13 maanden na de incasso.** De klant meldt bij de bank dat de incasso
   *ongeautoriseerd* was. De bank toetst of het mandaat geldig is; Mollie vraagt ons om bewijs.
   Mollie: *"Als de automatische incasso ongeautoriseerd was, ontvangt jouw klant het bedrag
   terug en betaal jij de kosten... € 65,- exclusief btw."* De € 65 is dus **voorwaardelijk**,
   niet automatisch bij elke terugboeking.

**De adder onder het gras:** Mollie stelt zelf dat een iDEAL-betaling **geen officiële
SEPA-machtiging** is. Formeel geldig zijn alleen een natte handtekening of een digitale
Machtiging (die Mollie niet aanbiedt). En: bij discussie over de geldigheid van de machtiging
**wint de consument**. In de standaard iDEAL-first-payment-flow verliezen we een MOI dus
waarschijnlijk → € 65 excl. btw (≈ € 78,65 incl.) plus terugbetaling.

Praktisch blijft dit zeldzaam: iemand moet actief bij de bank verklaren nooit getekend te hebben.
Ontevreden klanten zeggen bijna altijd gewoon op of storneren binnen 8 weken.

### Verplichte tegenmaatregelen bij het bouwen van de checkout
Deze punten zijn geen "nice to have" — ze zijn onze enige verdediging bij een MOI:

- [ ] Expliciete akkoordverklaring bij aanmelden (aparte checkbox, geen vooraangevinkt vakje)
- [ ] **Bewijs opslaan**: tijdstip, IP-adres, versie van de voorwaarden, mandaatreferentie
- [ ] Bevestigingsmail direct na aanmelden met bedrag, frequentie en mandaatreferentie
- [ ] Herkenbare omschrijving op het bankafschrift: `BELEGGINGSCOLLEGE`
- [ ] Vooraankondiging vóór elke incasso (pre-notification)
- [ ] **Opzeggen in één klik** in het account — dit haalt de aanleiding voor een MOI weg
- [ ] Bewaartermijn bewijs: minimaal 13 maanden na de laatste incasso

Kaartbetalingen (al actief) kennen een ander geschillenregime waarin goed bewijs wél telt;
het is verstandig om zowel iDEAL/SEPA als kaart aan te bieden.

## Wat er nog gebouwd moet worden (dit is het echte werk)

De huidige site is volledig statisch: alle lesinhoud wordt naar de browser gestuurd. Dat is
prima voor gratis content, maar **betaalde content moet naar de server** — anders is die
leesbaar voor iedereen die kijkt. Benodigd voor v2:

1. **Accounts + login** (bijv. Auth.js) — nu leeft voortgang alleen in localStorage
2. **Database** voor gebruikers, voortgang en abonnementsstatus
3. **Serverkant afscherming** van betaalde lessen (content niet meesturen zonder actief abonnement)
4. **Mollie-koppeling**: eerste betaling via iDEAL → mandaat → recurring via SEPA-incasso.
   Mollie heeft een eigen **Abonnementen**-product in het dashboard; recurring hoeft niet
   volledig zelf gebouwd te worden.
5. **Webhooks** van Mollie verwerken (betaald / mislukt / gestorneerd) en de toegang daarop
   bijwerken
6. Facturen/btw: 21% btw, factuur per betaling

## Prijsstelling — nog te beslissen

- 2023 (WooCommerce): Technische Analyse € 19,99, Waardebeleggen € 19,99, Beginners € 4,99
- 2023 (homepage-claim): "vanaf € 14,99"
- Nieuwe site (nu): **College+ € 14,99/maand**, beginnerscursus gratis

Te beslissen: alleen abonnement, of ook losse cursussen kopen? Losse verkoop kan meteen
(iDEAL/kaart staan al live), een abonnement moet wachten op SEPA-goedkeuring.
