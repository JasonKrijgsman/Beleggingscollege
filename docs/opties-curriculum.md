# Het opties-curriculum — besluit en opzet

Vastgelegd op 3 augustus 2026, na akkoord van Jason op het voorstel uit de
agentverkenning (twee onafhankelijke curriculumontwerpen, een marktonderzoek
naar Nederlandse hefboomproducten en een toolsuite-ontwerp).

## Het besluit in vier regels

1. **Drie optiecursussen** ("de optieladder"), niveau-gevormd maar elk met een
   strategiebelofte op de kaft — los te koop à € 49, eerlijk voorkennisblok in
   plaats van een harde vergrendeling.
2. **Eén hefboomcursus** à € 29 die turbo's, sprinters en CFD's écht uitlegt —
   Jasons uitdrukkelijke keuze: *"We can teach them CFDs. That way they'll
   understand why [most people lose]."* Begrip eerst, geen preek.
3. **De Grieken zitten in cursus 3**, niet in cursus 2: voor een covered call
   heb je geen vega nodig, en zo blijft de belofte van cursus 2 schoon voor de
   rustige portefeuillebelegger.
4. **Alles in één keer gebouwd** (Jasons keuze boven een gefaseerde aanpak),
   inclusief negen interactieve tools.

## De vier cursussen

| # | Slug | Titel | Niveau | Prijs | Accent | Icoon | Order |
|---|------|-------|--------|-------|--------|-------|-------|
| 1 | `opties-begrijpen` | Opties Begrijpen | Gevorderd | € 49 | petrol | target | 5 |
| 2 | `beschermen-en-verdienen-met-opties` | Beschermen & Verdienen met Opties | Gevorderd | € 49 | petrol | shield | 6 |
| 3 | `volatiliteit-en-spreads` | Volatiliteit & Spreads | Expert | € 49 | petrol | activity | 7 |
| 4 | `hefboomproducten` | Hefboomproducten | Gevorderd | € 29 | oranje | gauge | 8 |

Petrol is de familiekleur van de optieladder; oranje is bewust een
waarschuwingstint voor de hefboomcursus. Beide kleurschalen staan in
`src/app/globals.css`; de accentvarianten in `src/lib/accent.ts`.

### Waarom deze snede

Twee onafhankelijk aangestuurde curriculumontwerpen (één "op niveau", één "op
strategie") kwamen vrijwel op dezelfde structuur uit — een sterk teken dat dit
de natuurlijke vorm van de stof is. Optiekennis is écht hiërarchisch (spreads
zonder Grieken-intuïtie is gokken), maar "Opties deel 2" verkoopt aan niemand;
daarom draagt elke trede een eigen belofte. Cursus 3 zal het minst verkopen en
dat is aanvaard: hij is het geloofwaardigheidsanker en College+-materiaal.

### Waarom de hefboomcursus geen waarschuwingsles is

Het oorspronkelijke advies was: één eerlijke vergelijkingsles, geen cursus.
Jason besliste anders, en dat besluit is verdedigbaar binnen de merkregel
"cursusinhoud benoemt de grenzen van elke methode": we leren het mechanisme
(knock-out, financieringsniveau, OTC-tegenpartij) zodat de cursist zélf ziet
waar de verliezen vandaan komen — hetzelfde stramien als de TA-cursus, die
technische analyse onderwijst én de wetenschappelijke kritiek benoemt.
€ 29 in plaats van € 49 omdat hij korter is (6 lessen): eerlijke prijs.

### Geverifieerde feiten in de hefboomcursus (onderzoek 3 aug 2026)

- AFM-turbo-onderzoek (meting jun 2017–jul 2018, publicatie 2020): **68%
  verliest**, gemiddeld ± € 2.680.
- AFM-interventie per 1 okt 2021 (wereldprimeur): hefboomcaps gespiegeld aan
  de ESMA-CFD-caps, verplichte verlieswaarschuwing, bonusverbod. De
  waarschuwing zegt anno 2026 nog steeds ± "7 op de 10 verliest" — de cap
  dempte de ómvang van verliezen, niet de frequentie.
- ESMA-CFD-regime (2018, daarna nationaal verankerd): caps 30:1 t/m 2:1,
  verplichte negative balance protection, margin close-out op 50%,
  verliespercentages per broker ± "drie op de vier".
- **Bux' CFD-tak overleefde de ABN AMRO-overname niet** (aangekondigd dec
  2023, afgerond medio 2024; de speculatieve tak viel expliciet buiten de
  deal). BUX is nu een aandelen/ETF-platform.
- Turbo-uitgevers nu: BNP Paribas dominant (ook achter het ABN AMRO-schap
  sinds ABN in 2021 met eigen turbo's stopte); **ING Sprinters bestaan nog
  gewoon**; Binck-turbo's zijn in Saxo opgegaan. De claim "BNP nam ING's
  turbotak over" is ónjuist — niet in lesmateriaal laten sluipen.

## De toolsuite

Alle optierekenkunde zit in `src/lib/opties.ts` (pure functies: Black-Scholes,
Greeks, payoff, breakevens — geen `"use client"`, geen `@/content`-import, mag
veilig de bundel in want er zit geen cursusinhoud in). Tools renderen via de
registry in `src/components/lesson-tools.tsx`; een nieuwe tool is één regel in
de map plus een waarde in het `LessonTool`-union in `src/content/types.ts`.

| LessonTool-waarde | Component | Les (cursus) |
|---|---|---|
| `optie-uitbetaling` | `OptiePayoffTool` (mode "enkel") | De vier posities (1) |
| `optie-keten` | `OptieKetenTool` | De optieketen lezen (1) |
| `optie-tijdswaarde` | `OptieTijdswaardeTool` | Intrinsieke waarde en tijdswaarde (1) |
| `optie-strategiebouwer` | `OptiePayoffTool` (mode "bouwer") | De collar (2), Verticale spreads (3) |
| `optie-gedekt-schrijven` | `GedektSchrijvenTool` | De covered call (2) |
| `optie-tijdverval` | `OptieTijdvervalTool` | Theta en gamma (3) |
| `optie-volatiliteit` | `OptieVolatiliteitTool` | Vega en implied volatility (3) |
| `optie-greeks` | `OptieGreeksTool` | De Grieken samen (3) |
| `hefboom-simulator` | `HefboomSimulatorTool` | De hefboom (4) |

Ontwerpprincipes van de tools: fictieve onderliggenden (aandeel **Zeewind NV**
± EUR 42, index **NLX** ± 900 — nooit echte tickers of live data), deterministisch
(zelfde invoer → zelfde beeld op elk apparaat), contractgrootte × 100 overal
expliciet (de klassieke beginnersfout), en elke tool sluit af met een eerlijk
"waar dit ophoudt"-blok inclusief "geen beleggingsadvies".

## Bewuste keuzes en open eindjes

- **Prijs € 29** parseert probleemloos door `prijsTekstNaarCenten()` — geen
  wijziging aan het betaalpad nodig.
- **Geen bundelprijs** voor de drie optiecursussen: dat raakt
  `src/lib/pricing.ts` en de prijsweergave en is een apart besluit.
- **Sitemap**: de nieuwe betaalde lessen stromen automatisch de sitemap in via
  `src/app/sitemap.ts`; het al openstaande punt "horen vergrendelde lessen in
  de sitemap?" (docs/openstaand.md §7) wordt door deze uitbreiding groter.
- **Verwante blogkansen** (nog niet geschreven): "opties vs turbo's", de
  AFM-interventie van 2021, het Bux-verhaal. De zoektermen worden nu
  gedomineerd door affiliate-sites.
- De cursusteksten zijn door AI-agents geschreven op basis van het huisstijl-
  anker (waardebeleggen.ts) en daarna redactioneel nagelopen; de feitelijke
  claims over AFM/ESMA komen uit het geverifieerde onderzoek hierboven.
