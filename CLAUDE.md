# Beleggingscollege

Nederlands e-learningplatform voor beleggingsonderwijs (beleggingscollege.nl). Missie: eerlijk, toegankelijk beleggingsonderwijs geworteld in klassieke boeken — géén get-rich-quick. Merkstem: Nederlands, je/jij-vorm, vriendelijk-professioneel, reassurance-first.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`), lucide-react icons.
- Geen backend/database in v1: cursusinhoud is typed data (`src/content/`), voortgang leeft in localStorage.
- Dev server: `npm run dev` (poort 3000). Build: `npm run build`.

## Architectuur

- `src/content/types.ts` — contentschema (Course → Module → Lesson → QuizQuestion). Nieuwe cursus = nieuw bestand in `src/content/courses/` + import in `src/content/index.ts`.
- `src/lib/progress.tsx` — gamification-engine (client): XP, levels, streaks, badges, quizscores; persistentie in localStorage key `beleggingscollege-voortgang-v1`. `completeLesson()` is het enige muterende pad.
- `src/lib/levels.ts` (8 levels: Toeschouwer → Meesterbelegger), `src/lib/badges.ts` (10 badges met predicaten), `src/lib/accent.ts` (kleurvarianten per cursus).
- `src/lib/pricing.ts` — **enige bron voor prijzen**: losse cursus €49 eenmalig, College+ €14,99/mnd (€149/jr). Onderbouwing: `docs/prijsstrategie.md`.
- `src/lib/site.ts` — `SITE_URL`, leest `NEXT_PUBLIC_SITE_URL`, standaard `https://beleggingscollege.com`. Canonicals, sitemap, robots, Open Graph en schema.org lezen hier allemaal uit. **Eén variabele omzetten verhuist de hele site naar de .nl.**
- `src/content/blog.ts` — blogartikelen als data. Nieuw artikel = blok toevoegen aan `posts`; overzicht, artikelpagina, sitemap en SEO volgen vanzelf.
- Pages: `/` (marketing), `/cursussen`, `/cursussen/[slug]`, `/cursussen/[slug]/les/[les]`, `/cursussen/[slug]/certificaat` (printbaar), `/leerpad` (dashboard), `/blog` + `/blog/[slug]`, `/over-ons`, `/veelgestelde-vragen`, `/contact`, `/privacy`, `/voorwaarden`, `/herroepingsrecht` (die laatste drie zijn **concepten** en staan op noindex tot een jurist ernaar kijkt), `/lab` (intern stijllab, noindex).
- XP-regels: 50 XP per les + quizbonus tot 25 XP; herhaalde les = 0 XP.

## Accounts, database en toegang

Aanwezig maar **slapend**: zonder `DATABASE_URL` en Google-sleutels draait de site precies als voorheen.

- **Neon** = gehoste Postgres (serverless, schaalt naar nul, gratis laag, regio Frankfurt — **regio is achteraf niet te wijzigen**). **Drizzle** = ORM: queries in TypeScript in plaats van SQL-strings, met typecontrole tijdens de build.
- **Waarom niet SQLite:** dat is een bestand op schijf, en Vercel heeft geen blijvend bestandssysteem — elke instance krijgt zijn eigen kopie en elke deploy wist hem. Waarom niet Supabase: die pauzeert gratis projecten na een week inactiviteit, onacceptabel voor betalende klanten. Vercel Postgres bestaat niet meer (in 2024 naar Neon verhuisd). Zelf hosten op de NAS kan technisch, maar dan wordt de thuisverbinding de beschikbaarheid van de webshop.
- `src/db/schema.ts` — Auth.js-tabellen (exact zoals de adapter ze verwacht) + `purchases`, `lesson_progress`, `user_stats`.
- `src/auth.ts` / `src/auth.config.ts` — gesplitst omdat middleware op de Edge draait en daar geen database kan laden. **Database-sessies, geen JWT**: alleen zo kun je toegang direct intrekken na terugbetaling of misbruik.
- **`src/lib/entitlements.ts` is de enige plek die bepaalt of iemand een betaalde cursus mag zien.** `server-only`, kijkt uitsluitend naar de sessie en een rij in `purchases` met status `paid`. Middleware is géén autorisatie (Auth.js waarschuwt daar expliciet voor) — die doet alleen een nette redirect.
- Versies staan **exact gepind**: Auth.js v5 is na 2,5 jaar nog steeds beta en Drizzle 1.0-rc breekt auth-adapters. Niet upgraden zonder testen.
- Valkuil in `src/db/index.ts`: de verbinding wordt opgezet met een placeholder-URL als `DATABASE_URL` ontbreekt, anders faalt `next build`. Lui initialiseren via een Proxy kán niet — de Drizzle-adapter inspecteert het db-object en faalt met "Unsupported database type".
- Volledige implementatiegids met geverifieerde versies en codevoorbeelden: `docs/implementatie-accounts-betalen.md`.

### Domeinwissel raakt dit alles níét

Accounts, aankopen en voortgang hangen aan gebruikers-id's, niet aan een URL. Bij de verhuizing naar de `.nl` verandert alleen: `NEXT_PUBLIC_SITE_URL`, een redirect `.com` → `.nl`, en — als die er niet al staat — de callback-URL in Google Cloud Console. **Zet daarom bij het aanmaken van de Google-client meteen álle redirect-URI's erin** (`.com`, `.nl` en localhost); dan hoeft daar later niets aan te gebeuren.

## Merk (uit 2023-archief "Website Resources Collection.docx")

- Primair blauw `#0072CE` (Pantone 285C), secundair groen `#006546` (349C), logo-navy `#0033A0`, bodytekst `#53565A`, goud-accent voor gamification.
- Font: Open Sans. Origineel logo: `public/logo.svg` (en NAS: `Visual Future\Websites\Beleggingscollege\Background Images\Logos\Used\`).
- Volledig archief: `C:\Users\jason\SynologyDrive\Work Documents\Visual Future\Websites\Beleggingscollege\`.

## Domein & hosting

**De site staat LIVE op https://beleggingscollege.com** (sinds 3 aug 2026).

- **Code**: GitHub `JasonKrijgsman/Beleggingscollege`, branch `main`.
- **Hosting**: Vercel, team "Visual Future", project `beleggingscollege`. **Elke push naar `main` deployt automatisch**; elke branch krijgt een preview-URL. Login: accounts@jasonkrijgsman.com (wachtwoordloos + passkeys, bewust geen SSO).
- **`beleggingscollege.com`** — registrar Cloudflare (betaald t/m nov 2027), DNS bij Cloudflare, CNAME `@` → `6d87ec9bdcf67bce.vercel-dns-017.com`, **DNS only (grijze wolk)**. Dit is tijdelijk het canonieke adres.
- **`beleggingscollege.nl`** — nog bij Strato, migratie loopt vast op hun DNSSEC-deactivering. Zie `docs/domain-migration-plan.md` (inclusief de valkuil dat DNSSEC het hele domein blokkeert). Cloudflare-zone bestaat al met 11 records klaar; naamservers wijzen nog naar Strato.
- **Zodra de .nl verhuisd is**: `NEXT_PUBLIC_SITE_URL` in Vercel op `https://beleggingscollege.nl` zetten en een permanente redirect `.com` → `.nl` toevoegen. Verder hoeft er niets in de code.
- **Kosten en de Vercel-valkuil rond commercieel gebruik**: `docs/hosting-en-kosten.md`. Kort: Vercel Hobby is alleen voor niet-commercieel gebruik; zodra er betaald kan worden is Pro (~$20/mnd) verplicht.
- Gered materiaal van de oude WordPress-site: `docs/salvage/`.

## SEO-huisregels

- **Nooit een URL/slug wijzigen of verwijderen zonder permanente redirect** toe te voegen in `next.config.ts` (redirects van de oude WordPress-site staan daar al). URL's zijn de SEO-waarde.
- Elke pagina heeft een eigen `<title>` + meta description (via `generateMetadata`); nieuwe pagina's ook.
- Aanwezig: sitemap (`src/app/sitemap.ts`), robots (`src/app/robots.ts`, blokkeert /leerpad + certificaten), Open Graph-defaults (layout), canonicals per pagina, schema.org Course-markup (cursusdetailpagina). Certificaatpagina's zijn noindex.
- Canonicals volgen `SITE_URL` (nu .com). Zodra de .nl live is: variabele omzetten én `.com` permanent naar `.nl` redirecten, anders concurreren twee identieke sites met elkaar.
- Nog te doen: OG-afbeelding, Google Search Console aanmelden + sitemap indienen.

## Eerlijkheid is een productvereiste, geen sfeer

Dit merk verkoopt zichzelf als de eerlijke tegenhanger van get-rich-quick-aanbieders. Dat legt echte beperkingen op:

- **Geen verzonnen social proof.** De drie testimonials van de oude site zijn verwijderd toen bleek dat die site nul bestellingen had; ze zijn vervangen door de boekenkast-sectie. Zet geen reviews terug die niet echt zijn — het is ook misleidende reclame zodra je verkoopt.
- **Geen claims die je niet kunt waarmaken.** De badge op College+ zegt "Onze aanbeveling", niet "Meest gekozen" — dat laatste weten we pas als mensen kiezen.
- **Geen rendementsbeloftes, geen persoonlijk beleggingsadvies.** Wij zijn opleider, geen AFM-vergunninghouder. Dit hoort ook expliciet in de voorwaarden en op /contact te staan.
- Cursusinhoud benoemt de grenzen van elke methode (bijv. de wetenschappelijke kritiek op technische analyse). Houd dat zo.

## Betalingen

- Mollie-account is **volledig live-klaar** (KYC afgerond in 2023, bankrekening geverifieerd, profiel Online). iDEAL, kaarten, PayPal en Apple Pay staan actief; SEPA-incasso is 3 aug 2026 aangevraagd en wacht op goedkeuring.
- **Volledige status, tarieven, MOI-risico (€65) en verplichte tegenmaatregelen: `docs/betalingen-mollie.md`.** Lees dat bestand vóór er iets aan de checkout gebouwd wordt.
- Live API-key hoort in omgevingsvariabelen, **nooit** in de repo.

## Roadmap (v2+)

Accounts/auth + serverkant voortgang, betalingen (College+ €14,99/mnd — zie `docs/betalingen-mollie.md`), AI-studiecoach, cursus Beleggingspsychologie (nu comingSoon-teaser), risicoprofiel-tool, blog.

**Let op bij v2:** betaalde lesinhoud moet naar de server. Nu wordt alle content naar de browser gestuurd — prima voor gratis materiaal, onhoudbaar zodra er betaald wordt.
