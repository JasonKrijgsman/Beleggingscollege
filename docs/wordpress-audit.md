# Audit van de oude WordPress-site (wp-admin), 3 augustus 2026

Inventarisatie vóór het opzeggen van het Strato-pakket. Conclusie vooraf:
**er gaat niets verloren** — geen omzet, geen klanten, geen gepubliceerde inhoud.
Het enige echt waardevolle is de Mollie-koppeling en de prijshistorie.

## Betalingen (het belangrijkste)

- **Mollie Payments for WooCommerce is geïnstalleerd** en werkt: "Successfully connected with **Test API** ✓".
- **Alleen de Test API-key is ingevuld; de Live API-key is leeg.** Er zijn dus nooit echte betalingen mogelijk geweest.
- Business location in WooCommerce staat correct op **Nederland**.
- Betekenis: er bestaat een Mollie-account (minimaal in testmodus). Of dat account volledig
  live-klaar is (KYC/identificatie + gekoppelde bankrekening) is **niet zichtbaar in WordPress** —
  dat moet in het Mollie-dashboard zelf gecontroleerd worden.
- WooCommerce-installatiewizard staat op **stap 4 van 6**: nooit afgerond.

## Producten en omzet

| Product | Prijs | Aangemaakt |
|---|---|---|
| Introductie Technische Analyse | € 19,99 | 09-06-2023 |
| Ontdek Waardebeleggen | € 19,99 | 09-06-2023 |
| Beleggen voor Beginners | € 4,99 | 04-06-2023 |

- **0 bestellingen.** Nooit iets verkocht.
- **2 gebruikers**: 1 beheerder (jij) + 1 abonnee. Geen klantenbestand.
- Let op de discrepantie: de producten stonden op € 19,99 / € 4,99, terwijl de homepage
  "vanaf € 14,99" adverteerde. De nieuwe site hanteert € 14,99 (College+ per maand).

## Inhoud

- **Blog**: 1 concept ("Hoe open ik een beleggingsrekening?", 30-08-2022) — **leeg, alleen een titel**.
  Plus het standaard "Hello world!"-bericht. Niets te redden.
- **LearnDash-lessen**: alleen titels (in het Engels) zichtbaar via de openbare cursuspagina;
  de admin-lijst en de REST API zijn afgeschermd door een LearnDash-opt-in-scherm resp. 401.
  Gezien de rest van de bevindingen vrijwel zeker lege stubs — het 2023-traject bleef bij plannen.
  Curriculumstructuur is al bewaard in `docs/salvage/`.
- **MailPoet**: geïnstalleerd maar nooit ingericht, geen abonneelijst.

## Techniek

- WordPress **6.8.1** (7.0.2 beschikbaar), **15 plugin-updates open**, SiteLock meldt
  "1 kwetsbare website". Een verouderde WordPress met verouderde plugins is een reëel
  veiligheidsrisico — extra reden om deze site niet langer dan nodig te laten draaien.
- Plugins: LearnDash LMS, Elementor + Elementor Pro, WooCommerce, Mollie, Jetpack, MailPoet,
  WPForms, The Events Calendar, Google Site Kit, Pinterest for WooCommerce,
  Limit Login Attempts Reloaded. Polylang/WPML worden gevraagd door LearnDash Multilingual
  maar zijn niet actief.

## Wat meenemen naar het nieuwe platform

1. **Mollie** als betaalprovider (iDEAL/SEPA) — de logische keuze, koppeling bestond al.
2. **Prijsinformatie** als referentie voor de College+-prijsstelling.
3. Verder niets: geen klanten, geen bestellingen, geen teksten.

## Wat te controleren vóór opzegging van het pakket

- [ ] Mollie-dashboard: is het account volledig geverifieerd en zit er een bankrekening aan vast?
- [ ] Google Site Kit: is er een Search Console/Analytics-property gekoppeld die we moeten
      overzetten naar de nieuwe site (i.v.m. historische zoekdata)?
- [ ] E-mail: postvakken op het domein zijn al afgevangen — mail gaat straks via Migadu.
