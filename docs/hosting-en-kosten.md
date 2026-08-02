# Waar alles draait en wat het kost

Bijgewerkt: 3 augustus 2026. Zie ook `docs/domain-migration-plan.md` (de .nl-verhuizing)
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

Bron: https://vercel.com/docs/limits/fair-use-guidelines (geraadpleegd 3 aug 2026)

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

Ter vergelijking: het Strato PowerWeb Basic-pakket kostte grofweg €60–120 per jaar voor een
site die nooit iets verkocht heeft.

Mollie rekent geen maandbedrag, alleen per transactie (iDEAL ~€0,29, SEPA-incasso €0,35 —
zie `docs/betalingen-mollie.md` voor het volledige tarievenoverzicht en het MOI-risico).

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
