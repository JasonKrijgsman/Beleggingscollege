# Plattegrond van de site

Gegenereerd op 2026-08-03 uit `src/app` door `scripts/plattegrond.mjs`.
**Niet met de hand bewerken** — draai `npm run plattegrond` na elke nieuwe pagina
of API-route, dan kan dit document niet gaan liegen.

## Pagina's (21)

| Route | Rendering | Bijzonderheden |
|---|---|---|
| `/account` | per verzoek (sessie) | toegangscontrole |
| `/beheer` | per verzoek | toegangscontrole |
| `/beheer/vragen` | per verzoek | — |
| `/blog/[slug]` | vooraf gebouwd | — |
| `/blog` | statisch | — |
| `/contact` | statisch | — |
| `/cursussen/[slug]/certificaat` | vooraf gebouwd | — |
| `/cursussen/[slug]/gekocht` | per verzoek | toegangscontrole |
| `/cursussen/[slug]/les/[les]` | vrij gratis vooraf, rest per verzoek | toegangscontrole |
| `/cursussen/[slug]` | per verzoek | toegangscontrole |
| `/cursussen` | per verzoek | toegangscontrole |
| `/herroepingsrecht` | statisch | — |
| `/inloggen` | per verzoek (sessie) | leest sessie |
| `/lab/opties` | statisch | noindex |
| `/lab` | statisch | noindex |
| `/leerpad` | client | — |
| `/over-ons` | statisch | — |
| `/` | statisch | — |
| `/privacy` | statisch | — |
| `/veelgestelde-vragen` | statisch | — |
| `/voorwaarden` | statisch | — |

Rendering-legenda: **vooraf gebouwd** = bij de build als HTML klaargezet (snel, maar
bevriest de inhoud — daarom mag een betaalde les dit nooit volledig zijn);
**per verzoek** = op de server gebouwd op het moment dat iemand hem opvraagt (nodig
zodra de pagina van de bezoeker afhangt); **client** = de pagina zelf is een
client-component (de gegevens komen dan via props of API).

## API-routes (7)

| Route | Wat er speelt |
|---|---|
| `/api/auth/[...nextauth]` | publiek |
| `/api/checkout` | vereist sessie |
| `/api/lesvragen/moderatie` | publiek |
| `/api/lesvragen` | vereist sessie |
| `/api/mollie/webhook` | publiek |
| `/api/nieuwsbrief` | vereist sessie |
| `/api/voortgang` | vereist sessie |

## Vaste onderdelen

| Bestand | Rol |
|---|---|
| `sitemap.ts` | genereert /sitemap.xml (ingediend bij Search Console) |
| `robots.ts` | genereert /robots.txt |
| `icon.svg` + `apple-icon.tsx` | favicon — zelfde beeldmerk als LogoMark; samen wijzigen |
| `opengraph-image.tsx` | de kaart bij gedeelde links |
| `error.tsx` + `global-error.tsx` | Nederlandse foutpagina's |
| `not-found.tsx` | 404 |

## Huisregels bij uitbreiden

- **Nooit een route wijzigen of weghalen zonder permanente redirect** in `next.config.ts`.
- Elke nieuwe pagina krijgt eigen `generateMetadata` (titel + beschrijving + canonical).
- Betaalde inhoud: rendering per verzoek, toegang uitsluitend via
  `heeftToegangTot()` — zie CLAUDE.md voor de valkuilen die al eens misgingen.
