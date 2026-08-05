# Waar alles draait en wat het kost

Bijgewerkt: 2 augustus 2026. Zie ook `docs/domain-migration-plan.md` (de .nl-verhuizing)
en `docs/betalingen-mollie.md` (betalen).

## De vier losse onderdelen

Strato deed dit alles in één pakket en rekende daar een bundelprijs voor. Nu is het opgesplitst,
en daarom valt de rekening zo veel lager uit. Elk onderdeel doet iets anders:

| Rol | Wat het doet | Bij wie | Kosten |
|---|---|---|---|
| **Registrar** | Eigendom van de naam in het register | `.com` bij Cloudflare · `.nl` nog bij Strato → **Porkbun** | ~€10/jr resp. ~€7/jr |
| **DNS** | Vertaalt de naam naar "de site staat hier" | Cloudflare | €0 |
| **Hosting** | De computer die de site bouwt en serveert | Vercel | €0 → **~$20/mnd**, zie hieronder |
| **E-mail** | Postbussen op het domein | Migadu (bestaand abonnement) | €0 extra |

Porkbun komt dus **alleen** in beeld voor de `.nl`, en pas nadat Strato die vrijgeeft.
Cloudflare verkoopt geen `.nl`-domeinen, anders had alles bij één partij gekund.

## ⚠️ Vercel Hobby mag niet commercieel gebruikt worden

Dit is de belangrijkste kostenvalkuil. Vercel schrijft letterlijk:

> "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the
> platform requires either a Pro or Enterprise plan."

Onder commercieel gebruik valt volgens diezelfde pagina onder meer:

- elke manier van betaling vragen of verwerken van bezoekers;
- **adverteren met de verkoop van een product of dienst**;
- advertenties tonen; zelfs donaties vragen.

De site toont nu al prijzen (€49 per cursus, €14,99/mnd voor College+). Daarmee zitten we
strikt genomen al tegen die grens aan, en zodra de Mollie-checkout live gaat zijn we er
zeker overheen. **Reken op Vercel Pro ($20/mnd) op het moment dat er verkocht kan worden.**

Bron: https://vercel.com/docs/limits/fair-use-guidelines (geraadpleegd 2 aug 2026)

### Alternatieven, mocht dat storen

De site is standaard Next.js in een Git-repo; er zit geen enkele lock-in in.
**Cloudflare Pages** en **Netlify** draaien hetzelfde, en Cloudflare's gratis laag staat
commercieel gebruik wél toe. Het is de moeite waard dat te vergelijken op het moment dat
Pro verplicht wordt — maar niet eerder: eerst verkopen, dan optimaliseren.

## Verwachte jaarkosten

| Fase | Wat | Per jaar |
|---|---|---|
| **Nu** (nog niets te koop) | alles gratis, alleen domeinen | ~€10 |
| **Zodra je verkoopt** | Vercel Pro €20/mnd + twee domeinen | **~€250** |
| Later, bij groei | database boven de gratis laag, e-mailvolume | pas relevant bij echt verkeer |

Twee posten die op 3 augustus 2026 zijn bijgekomen en in deze tabel nog niet zichtbaar
waren, allebei vandaag nog gratis:

- **Bezoekmeting.** Umami wordt zelf gehost als een **tweede Vercel-project met een eigen
  Neon-database** (bewust niet dezelfde database als de site). Beide passen in de gratis
  lagen, maar let op de samenhang met de regel hierboven: als het hoofdproject naar Pro
  moet omdat er verkocht wordt, is het de vraag of een tweede project op Hobby daar los van
  staat. De code staat klaar en de meting staat uit tot de instantie er is; zie
  `docs/analytics.md`.
- **E-mail.** Migadu draait al voor andere domeinen van Jason en kost dus niets extra voor
  dit domein. Dat was een van de doorslaggevende argumenten om Resend te laten vallen; zie
  `docs/e-mail-versturen.md`.

Ter vergelijking: het Strato PowerWeb Basic-pakket kostte grofweg €60–120 per jaar voor een
site die nooit iets verkocht heeft.

**Let op — dat pakket loopt gewoon door, en dat is niet op te zeggen (3 aug 2026).** In
Contracten → Contractinformatie staat: STRATO PowerWeb Basic, **€6 per maand**, actief sinds
05-08-2020, en **"Eerstvolgende mogelijkheid tot opzegging: 05-08-2027"**. De domeinregel
(€7,20/jr) is daar een aparte post binnen. Reken dus tot augustus 2027 op **€72 per jaar
Strato bovenop** alles hierboven, ook nadat het domein verhuisd is. Het domein wegverhuizen
zegt het pakket niet op — dat is een losse handeling met een eigen opzegtermijn, en die
termijn is voor dit jaar al verstreken.

Mollie rekent geen maandbedrag, alleen per transactie (iDEAL ~€0,29, SEPA-incasso €0,35 —
zie `docs/betalingen-mollie.md` voor het volledige tarievenoverzicht en het MOI-risico).

## Oude WordPress-plugins: Elementor Pro en LearnDash lopen af (5 aug 2026)

De oude `.nl`-site draaide op WordPress met betaalde plugin-licenties (zie de plugin-lijst in
`docs/wordpress-audit.md`). Twee daarvan waren losse jaarabonnementen, apart van het
Strato-pakket. Op **5 augustus 2026** is bij allebei de **automatische verlenging uitgezet** —
niet direct opgezegd, dus de toegang en updates lopen door tot het einde van de al betaalde
termijn en daarna vervalt het vanzelf, zonder nieuwe afschrijving:

| Abonnement | Waar te beheren | Toegang tot | Volgende afschrijving |
|---|---|---|---|
| **Elementor Pro – Essential** (ID 13473233) | `my.elementor.com` → Account settings → Subscriptions | **6 juni 2027** | geen (Renewal: Manual) |
| **LearnDash** (ID 1036821) | `account.learndash.com` → Subscriptions | einde lopende termijn | geen (Next Payment: N/A, was 9 juni 2027) |

Beide zijn **omkeerbaar**: de auto-verleng-schakelaar staat op dezelfde plek en kan terug aan
als Jason zich bedenkt. LearnDash had daarnaast een ouder abonnement (844420) dat al eerder was
opgezegd. Dit past bij het uitfaseren van de oude WordPress-site (nu vervangen door de
Next.js-build), dus doorlopen laten lapsen is de bedoeling.

**Twijfelt een latere sessie hierover** — wel of niet volledig laten vervallen, opnieuw
aanzetten, of iets uit de oude site alsnog nodig — **vraag het gerust aan Jason**; hij vindt het
prima om hierover benaderd te worden.

## Praktische aandachtspunten

- **Vercel-inlog** loopt via accounts@jasonkrijgsman.com, wachtwoordloos met passkeys. Bewust
  geen SSO via GitHub/Google: als dat account ooit dichtgaat wil Jason er nog steeds in kunnen.
  GitHub is alleen als integratie gekoppeld, en met toegang tot uitsluitend deze ene repo.
- **Cloudflare API-tokens** zijn per zone gescoped. Het bestaande "Edit zone DNS"-token werkt
  op `beleggingscollege.nl`, maar (nog) niet op de `.com` — een poging dat uit te breiden is
  niet doorgekomen. Records voor de `.com` gaan dus via het dashboard.
- **Het Cloudflare-dashboard is traag en instabiel** in geautomatiseerde browsersessies: het
  "Add record"-formulier verdwijnt regelmatig halverwege. De API is veel betrouwbaarder;
  gebruik die waar mogelijk, met de zone-ID (te vinden op de Overview-pagina van de zone).
