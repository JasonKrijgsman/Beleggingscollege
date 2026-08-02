# Betalingen via Mollie — status, risico's en bouwplan

Laatst bijgewerkt: 2 augustus 2026. Dit is het levende document voor alles rond betalen.
Zie ook `docs/wordpress-audit.md` (hoe we dit ontdekten) en `CLAUDE.md` (architectuur).

> **Stand van zaken:** losse cursussen kopen wérkt en is op 2 augustus 2026 end-to-end
> getest op de live site met een **test**-key. Het abonnement wacht nog op SEPA-goedkeuring.
> Vóór de eerste echte verkoop moet de test-key vervangen worden door de live-key.

## Status van het Mollie-account

| Onderdeel | Status |
|---|---|
| Organisatie | Beleggingscollege, org_17405389, voorwaarden geaccepteerd 4 juni 2023 |
| Onboarding | **Afgerond** — "Je bent klaar om betaald te worden" |
| Live profiel | **Beleggingscollege** (www.beleggingscollege.nl) — status **Online** |
| Bankrekening | Geverifieerd, gekoppeld, geselecteerd voor uitbetalingen, EUR (IBAN staat bewust niet in deze repo) |
| Actieve methoden | iDEAL, krediet-/debetkaarten, PayPal, Apple Pay |
| SEPA-incasso | **Aangevraagd op 2 aug 2026** — status: klok-icoon = in beoordeling bij Mollie |
| Oud testprofiel | example.org — geblokkeerd, kan genegeerd worden |
| Test-key in gebruik | `test_…` staat in Vercel (Production + Preview) én in `.env.local` |

Mollie bevestigde tijdens de test zelf: *"Your account is ready to start processing iDEAL
payments."* De methodes die de API in testmodus teruggaf voor EUR 49,00 zijn iDEAL | Wero,
Card en PayPal.

De KYC-molen is dus al in 2023 doorlopen. Betalingen zijn **niet** het knelpunt; het ontbreekt
alleen nog aan accounts/login en serverkant in de nieuwe app.

### Openstaande actie
- [ ] **Controleer of Mollie SEPA-incasso heeft goedgekeurd** (klok → vinkje op de pagina
      Instellingen → Online Betalingen). Mollie doet hiervoor een extra controleproces.
      Blokkeert alleen het abonnement, niet de losse verkoop.
- [ ] **Vóór de eerste echte verkoop:** live API-key ophalen uit Mollie en `MOLLIE_API_KEY`
      in Vercel vervangen (**nooit** in de repo committen). Zolang de test-key erin staat
      lijkt de winkel open, maar kan niemand echt betalen — dat is de stilste manier om
      omzet te missen. Na het wisselen opnieuw deployen; de key wordt bij de bouw ingeladen.
- [ ] Vercel Pro (~$20/mnd) nemen: het Hobby-plan verbiedt commercieel gebruik.
- [ ] Testaankoop opruimen: de rij `waardebeleggen | paid` op Jasons eigen account komt uit
      de testbetaling `tr_hTh3aaeBX99fmiT2SjpUJ` en is nooit met echt geld betaald.

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

## Wat er staat — losse cursussen kopen

Klaar en getest. De weg die een klant aflegt:

1. `/cursussen/[slug]` toont de koopknop (`src/components/KoopKnop.tsx`) met de verplichte
   herroepingscheckbox. De knop blijft uit tot die is aangevinkt.
2. `POST /api/checkout` — prijs komt uit **onze eigen catalogus**, nooit uit het verzoek,
   anders bepaalt de klant zelf wat hij betaalt. Weigert zonder login (401), zonder akkoord
   (400) en bij een cursus die je al hebt (409). Maakt de betaling bij Mollie aan en schrijft
   één rij in `purchases` met status `pending` (unieke index op userId + courseSlug, dus een
   tweede poging werkt dezelfde rij bij in plaats van er een nieuwe naast te zetten).
3. Klant betaalt op Mollie's eigen pagina. Wij zien nooit bank- of kaartgegevens.
4. `POST /api/mollie/webhook` — Mollie stuurt alléén `id=tr_…`, geen status en geen bedrag.
   Dat is met opzet: het endpoint is publiek. Wij halen de status dus zelf op met onze
   API-key en controleren bedrag én valuta tegen wat wij hadden vastgelegd.
5. `heeftToegangTot()` in `src/lib/entitlements.ts` is de enige toegangspoort. De lespagina
   rendert per verzoek (`dynamicParams`), zodat de check nooit vastvriest tijdens de bouw.

### Wat er op 2 augustus 2026 daadwerkelijk getest is (live, met test-key)

| Controle | Uitkomst |
|---|---|
| Koopknop uit tot herroepingsvakje aan staat | ✅ |
| Mollie-checkout opent, testmodus-banner, logo, € 49,00 | ✅ |
| `purchases`-rij op `pending` met hetzelfde `tr_`-id als de checkout-URL | ✅ |
| Webhook zet de rij op `paid` | ✅ |
| Vergrendelde les toont daarna de volledige inhoud | ✅ |
| `/account` toont "Ontdek Waardebeleggen — Levenslang toegang" | ✅ |
| Koopknop verdwijnt na aankoop | ✅ |
| Checkout zonder login | 401 ✅ |
| Webhook met een verzonnen `tr_`-id | 200 ✅ (zie hieronder) |
| Anoniem verzoek op de betaalde les ná de aankoop | slotpagina, 0 regels lesinhoud ✅ |
| Cache-headers op die pagina | `private, no-cache, no-store` ✅ |

De laatste twee zijn de belangrijkste: ze bewijzen dat een betaalde pagina niet per ongeluk
in de CDN belandt en zo bij een willekeurige bezoeker terechtkomt.

### Waarom de webhook 200 antwoordt op een onbekend id

Mollie geeft een 404 als je een betaling opvraagt die niet bestaat. Die fout viel eerst in de
algemene catch en leverde een 500 op — waarmee Mollie tien keer over 26 uur terugkwam voor
iets wat nooit gaat lukken. Omdat het endpoint publiek is kon iedereen dat uitlokken met een
verzonnen id. Nu onderscheiden we 404/410 (betaling bestaat niet → 200, klaar) van echte
storingen als 401, 429 en 5xx, waar herhalen juist gewenst is.

## Wat er nog niet staat

1. **Abonnement (College+)** — eerste betaling via iDEAL → mandaat → recurring via SEPA.
   Wacht op de SEPA-goedkeuring. Mollie heeft een eigen **Abonnementen**-product in het
   dashboard; recurring hoeft niet volledig zelf gebouwd te worden.
2. **Bevestigingsmail** na aankoop — nu krijgt de klant alleen de bedankpagina.
3. **Facturen/btw**: 21% btw, factuur per betaling.
4. **Terugbetalingen**: Mollie zet de betaling niet zelf op `refunded`, dat komt via een
   aparte refund-webhook. Zodra we gaan terugbetalen moet daar ook de toegang worden
   ingetrokken (staat als comment in de webhook).

## Prijsstelling — besloten

- 2023 (WooCommerce): Technische Analyse € 19,99, Waardebeleggen € 19,99, Beginners € 4,99
- Nu: **losse cursus € 49**, **College+ € 14,99/maand**, **€ 149/jaar**, beginnerscursus gratis

Beide vormen worden aangeboden, zodat mensen kunnen kiezen. Losse verkoop kon meteen
(iDEAL/kaart staan al live), het abonnement wacht op SEPA-goedkeuring. Bedragen staan op
één plek: `src/lib/pricing.ts`.
