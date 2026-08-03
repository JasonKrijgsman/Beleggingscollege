# Beleggingscollege — lees CLAUDE.md

**[`CLAUDE.md`](CLAUDE.md) is de projectcontext. Lees dat bestand voordat je iets aanraakt.**
**[`docs/openstaand.md`](docs/openstaand.md) is wat er nog niet af is. Lees dat vóór je iets belooft of live zet.**

Dit bestand was tot 3 augustus 2026 een volledige kopie van `CLAUDE.md`. Dat is
misgegaan zoals kopieën altijd misgaan: hij liep 74 regels achter, beschreef nog
het oude betaalmodel (`purchases` in plaats van `payment_attempts` +
`entitlements`) en beweerde dat lesvoortgang alleen in localStorage leeft,
terwijl die al een dag naar de server syncte. Een agent die hiérop afging kreeg
dus juist over het geldpad en het toegangspad het verkeerde beeld.

Daarom staat hier geen tweede beschrijving meer. Wat hieronder staat zijn
**regels**, geen toestand — regels verouderen niet elke dag, toestand wel.

## De regels die je sowieso moet kennen

1. **Nooit rechtstreeks naar `main` pushen.** Werk op een branch, open een PR en
   laat CI groen worden; `main` is beschermd en elke merge deployt naar
   productie. `npm ci && npm run controle` draait dezelfde poort lokaal.
2. **Nooit een geheim in de repo.** Sleutels horen in omgevingsvariabelen. Het
   omzetbelastingnummer (afgeleid van een BSN) en Jasons woonadres horen
   **nergens** — niet in code, niet in een mail, niet in documentatie.
3. **`heeftToegangTot()` in `src/lib/entitlements.ts` is de enige toegangspoort.**
   Bouw er geen tweede naast. UI die een slotje toont is geen autorisatie.
4. **`@/content` is `server-only`.** Importeer het nooit vanuit een
   `"use client"`-module: dan sleept de hele cursuscatalogus, inclusief
   quizantwoorden, de browserbundel in. Dat is één keer echt gebeurd.
5. **Alles wat de bezoeker leest is Nederlands** — teksten én codecommentaar.
   Toon: rustig, uitleggend, geen verkooppraat.
6. **Wat de site belooft, moet waar zijn.** Dit merk verkoopt zichzelf als de
   eerlijke tegenhanger van get-rich-quick-aanbieders, en dat legt echte
   beperkingen op: geen verzonnen social proof, geen rendementsbeloftes, geen
   claim over een functie die nog niet werkt. Verandert er iets aan het product,
   loop dan na of de publieke teksten nog kloppen — dat is hier al meerdere
   keren misgegaan.
7. **Geen enkele stand van zaken in dit bestand.** Verandert er iets, werk dan
   `CLAUDE.md` bij, of het document waar dat onderwerp thuishoort. Zet het niet
   ook hier neer; dan begint de drift opnieuw.
