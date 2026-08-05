# LearnDash — kennisbank

> Onderzoek van 5 aug 2026. Doel: begrijpen wat LearnDash — het WordPress-LMS waar drie jaar voor betaald is zonder dat het ooit iets opleverde — eigenlijk kan, en die kennis omzetten in lessen voor ons eigen platform. Dit is **naslagmateriaal**, geen stand van zaken: het beschrijft LearnDash zoals het er in augustus 2026 voorstaat (de volwassen 4.x-lijn; sinds 4 feb 2026 staat de teller op 5.x, zie hoofdstuk 6) en hoeft dus niet bijgehouden te worden zoals `docs/openstaand.md`.

## Waarom dit onderzoek

Jason kocht LearnDash in juni 2023 voor de oorspronkelijke WordPress-versie van Beleggingscollege, verlengde jaarlijks (1-site-licentie, $199/jaar, ~$240 incl. btw), maar het platform is er nooit mee gebouwd — de site is uiteindelijk als eigen Next.js-applicatie neergezet. Het abonnement is op 5 aug 2026 opgezegd en **blijft actief tot 9 juni 2027** (inclusief updates en support) — precies binnen de periode waarin Liquid Web nog security-patches garandeert (t/m april 2027, zie hoofdstuk 7). De "Liquid Web Software"-factuur van juni 2026 is gewoon deze LearnDash-verlenging: sinds de opheffing van het merk StellarWP (april 2026) factureert het moederbedrijf onder die naam (hoofdstuk 6 §9).

De vraag die dit onderzoek beantwoordt: wat hebben zij in tien jaar productontwikkeling geleerd over online cursussen verkopen en doceren, en wat daarvan is voor ons de moeite waard?

## De hoofdstukken

| Doc | Onderwerp |
|---|---|
| [01-contentmodel.md](01-contentmodel.md) | Cursushiërarchie (Course → Lesson → Topic), Course Builder, Focus Mode, videolessen, custom labels |
| [02-quizzen.md](02-quizzen.md) | De quiz-engine: acht vraagtypen, toetsinstellingen, vragenbanken, essay-nakijkwerk, Challenge Exams |
| [03-toegang-en-verkoop.md](03-toegang-en-verkoop.md) | Access modes, betaalproviders, coupons, Groups & Group Leaders, WooCommerce/membership-patronen, btw/iDEAL |
| [04-voortgang-en-drip.md](04-voortgang-en-drip.md) | Lineair vs vrij, prerequisites, drip-content, timers, video-gates, opdrachten, voortgangsopslag |
| [05-engagement-en-gamification.md](05-engagement-en-gamification.md) | Certificaten, Course Points, GamiPress-stack, Notifications, community-integraties |
| [06-rapportage-en-beheer.md](06-rapportage-en-beheer.md) | ProPanel, rapportages, gebruikersbeheer, GDPR, SCORM/xAPI, onderhoud op schaal |
| [07-ecosysteem-en-markt.md](07-ecosysteem-en-markt.md) | Bedrijf & prijzen, add-on-ecosysteem, architectuur voor ontwikkelaars, concurrenten, wanneer zelf bouwen wint |
| [08-lessen-voor-beleggingscollege.md](08-lessen-voor-beleggingscollege.md) | **De synthese**: wat wij al beter doen, wat LearnDash beter doet, en wat we concreet zouden kunnen overnemen |

Begin bij hoofdstuk 8 als je alleen de conclusies wilt; de rest is het bewijsmateriaal.

### Uit de broncode zelf (hoofdstuk 9–11)

Hoofdstuk 1–8 komen uit documentatie. Daarna is de **échte plugincode** gelezen: `sfwd-lms-v4.6.0.zip` (mei 2023) uit Jasons eigen licentiearchief op de NAS.

| Doc | Onderwerp |
|---|---|
| [09-broncode-architectuur.md](09-broncode-architectuur.md) | Bootstrap, de halfvoltooide `src/`-herschrijving naast 206k regels legacy, hooks als meetbare moat, backwards compatibility als datastructuur |
| [10-broncode-datamodel-en-betalingen.md](10-broncode-datamodel-en-betalingen.md) | Het echte schema, `_sfwd-course_progress` ontleed, wat één "mark complete" schrijft, toegangscontrole op renderniveau, en hoe hun betaalwebhooks verifiëren |
| [11-broncode-quizmotor.md](11-broncode-quizmotor.md) | De WP Pro Quiz-fork van binnen — inclusief het antwoord op de vraag of ze quizscores server-side verifiëren (ja, met ondertekende antwoorden) |

**Let op de versie.** Dit is 4.6.0 uit mei 2023, niet de huidige 5.x (feb 2026). Het is precies wat er gekocht is, en daarmee een eerlijke momentopname — maar reken er niet op dat elk detail nu nog zo is. Een actuelere kopie ophalen kan alleen Jason zelf: het klantportaal (`software.liquidweb.com`) vraagt om inloggen, en een agent mag geen inloggegevens invoeren.

## Leeswijzer

- Featurenamen staan in het Engels tussen backticks (`Focus Mode`, `Buy Now`) zodat ze terug te vinden zijn in LearnDash's eigen documentatie.
- Elke claim in de hoofdstukken heeft een bron; onzekerheden staan als zodanig gemarkeerd.
- "Vergelijk met ons"-notities verwijzen naar onze eigen code (`src/content/`, `src/lib/progress.tsx`, `src/lib/entitlements.ts` enz.).
