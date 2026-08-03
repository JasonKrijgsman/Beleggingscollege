# Betalingen via Mollie — status, risico's en bouwplan

Laatst bijgewerkt: 3 augustus 2026 (het betaalmodel is die dag gesplitst; de beschrijving
van de keten en de testmatrix zijn daarop nagelopen). Dit is het levende document voor
alles rond betalen. Zie ook `docs/wordpress-audit.md` (hoe we dit ontdekten) en `CLAUDE.md`
(architectuur).

> **Stand van zaken:** losse cursussen kopen wérkt en is op 2 augustus 2026 end-to-end
> getest op de live site met een **test**-key. Het abonnement wacht nog op SEPA-goedkeuring.
> Vóór de eerste echte verkoop moet de test-key vervangen worden door de live-key.
>
> **Let op bij het lezen van de testmatrix hieronder: die test van 2 augustus liep over het
> óude model.** Toen was er één `purchases`-rij die tegelijk betaalpoging, order en
> toegangsrecht was. Op 3 augustus is dat gesplitst in `payment_attempts` +
> `entitlements` + `order_counters` (PR #22, migratie `0004` staat op productie; de
> onderbouwing is `docs/ontwerp-betaalmodel.md`, dat **uitgevoerd** is en niet meer een
> voorstel). Wat ná de migratie geverifieerd is: de tellingen vóór/na klopten en bestaande
> toegang bleef behouden. Een volledige testaankoop over het nieuwe geldpad op productie
> staat nog als voorwaarde vóór de contract-stap — zie `docs/openstaand.md` §6b. Neem de
> matrix dus als historisch bewijs, niet als beschrijving van de huidige tabellen.

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
      **Sinds migratie 0004 is één `delete` niet meer genoeg**: die aankoop bestaat nu als
      `purchases`-rij (dood), als `payment_attempts`-rij én als `entitlements`-rij, plus
      een tellerstand in `order_counters`. Ruim op in deze volgorde — eerst het
      entitlement, dan de betaalpoging — vanwege de foreign key
      `entitlements_attempt_id_payment_attempts_id_fk`. En zodra er echte kopers zijn is
      een blinde `delete` op `entitlements` het intrekken van iemands toegang; werk dan
      op id, niet op cursusslug.

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
   (400) en bij een cursus die je al hebt (409 — die dedupe leest `entitlements`, en is
   nadrukkelijk géén tweede toegangspoort). Maakt de betaling bij Mollie aan en schrijft
   een **nieuwe** rij in `payment_attempts` met status `pending`.
   **Append-only: elke poging is een eigen rij, bewust een kale insert en géén upsert.**
   Hier stond ooit dat een tweede poging dezelfde rij bijwerkte — dat gedrag is op 3 aug
   2026 juist weggehaald, omdat het de betaalpoging-historie wiste en er maar één
   Mollie-id tegelijk vindbaar bleef. De uniciteit per gebruiker/cursus zit nu in
   `entitlements`; `payment_attempts` heeft een unieke index op `mollie_payment_id`.
   Ons eigen `attemptId` gaat mee in de Mollie-metadata, zodat de webhook een verloren
   rij kan repareren.
3. Klant betaalt op Mollie's eigen pagina. Wij zien nooit bank- of kaartgegevens.
4. `POST /api/mollie/webhook` — Mollie stuurt alléén `id=tr_…`, geen status en geen bedrag.
   Dat is met opzet: het endpoint is publiek. Wij halen de status dus zelf op met onze
   API-key en controleren bedrag én valuta tegen wat wij hadden vastgelegd. Klopt het,
   dan doet **één SQL-statement** alles tegelijk: de poging op `paid`, het ordernummer uit
   `order_counters`, en het entitlement `actief`. Geen `db.transaction()` — die bestaat
   niet op de neon-http-driver van productie (zie CLAUDE.md).
5. `heeftToegangTot()` in `src/lib/entitlements.ts` is de enige toegangspoort, en die kijkt
   naar `entitlements` met status `actief`. **Een betaalpoging op `paid` opent uit zichzelf
   niets** — het is de administratie, niet het recht. De lespagina rendert per verzoek
   (`dynamicParams`), zodat de check nooit vastvriest tijdens de bouw.

### Wat er op 2 augustus 2026 daadwerkelijk getest is (live, met test-key)

*Historisch: dit liep over het oude `purchases`-model. Waar hieronder `purchases` staat,
zou dezelfde test vandaag `payment_attempts` (de rij) plus `entitlements` (het recht)
noemen.*

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
2. **Bevestigingsmail** na aankoop — *gebouwd, maar hij vertrekt nog niet.* Dit stond hier
   als "bestaat niet"; dat onderscheid is materieel, want niet-gebouwd is weken werk en
   dit is een kwartier. De hele keten staat er: `src/lib/mail.ts` (nodemailer tegen Migadu
   SMTP sinds PR #31), `mailteksten.ts`, `orderbevestiging.ts`, afgevuurd vanuit de
   webhook, met een atomaire claim tegen dubbele post. Hij verstuurt niets zolang
   `MAIL_SMTP_GEBRUIKER` en `MAIL_SMTP_WACHTWOORD` leeg zijn — een bewuste stille faal,
   want `verstuurMail()` mag de betaalverwerking nooit laten omvallen. Zie
   `docs/e-mail-versturen.md` voor wat er nog moet gebeuren.
3. **Facturen/btw**: 21% btw, factuur per betaling. De doorlopende nummering bestaat wel
   al (`payment_attempts.order_number`, gevoed door `order_counters`).
4. **Terugbetalingen**: Mollie zet de betaling niet zelf op `refunded`, dat komt via een
   aparte refund-webhook. Zodra we gaan terugbetalen moet daar ook de toegang worden
   ingetrokken (staat als comment in de webhook). Sinds de splitsing zijn dat twee
   handelingen: de betaalpoging krijgt status `refunded`, en het **entitlement** gaat op
   `ingetrokken` met `revoked_at`/`revoked_reason` — dat laatste is wat de deur dichtdoet.

## Prijsstelling — besloten

- 2023 (WooCommerce): Technische Analyse € 19,99, Waardebeleggen € 19,99, Beginners € 4,99
- Nu: **losse cursus € 49**, **College+ € 14,99/maand**, **€ 149/jaar**, beginnerscursus gratis

Beide vormen worden aangeboden, zodat mensen kunnen kiezen. Losse verkoop kon meteen
(iDEAL/kaart staan al live), het abonnement wacht op SEPA-goedkeuring. Bedragen staan op
één plek: `src/lib/pricing.ts`.
