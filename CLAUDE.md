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
- Pages: `/` (marketing), `/cursussen`, `/cursussen/[slug]`, `/cursussen/[slug]/les/[les]`, `/cursussen/[slug]/certificaat` (printbaar), `/leerpad` (dashboard).
- XP-regels: 50 XP per les + quizbonus tot 25 XP; herhaalde les = 0 XP.

## Merk (uit 2023-archief "Website Resources Collection.docx")

- Primair blauw `#0072CE` (Pantone 285C), secundair groen `#006546` (349C), logo-navy `#0033A0`, bodytekst `#53565A`, goud-accent voor gamification.
- Font: Open Sans. Origineel logo: `public/logo.svg` (en NAS: `Visual Future\Websites\Beleggingscollege\Background Images\Logos\Used\`).
- Volledig archief: `C:\Users\jason\SynologyDrive\Work Documents\Visual Future\Websites\Beleggingscollege\`.

## Domein & hosting

- `beleggingscollege.nl` = bij Strato (oude WordPress/LearnDash-site draait er nog); migratieplan naar Porkbun + Cloudflare-DNS + Vercel: `docs/domain-migration-plan.md`.
- `beleggingscollege.com` = bij Cloudflare (t/m nov 2027), nog geen DNS.
- Gered materiaal van de oude WordPress-site: `docs/salvage/`.

## SEO-huisregels

- **Nooit een URL/slug wijzigen of verwijderen zonder permanente redirect** toe te voegen in `next.config.ts` (redirects van de oude WordPress-site staan daar al). URL's zijn de SEO-waarde.
- Elke pagina heeft een eigen `<title>` + meta description (via `generateMetadata`); nieuwe pagina's ook.
- Aanwezig: sitemap (`src/app/sitemap.ts`), robots (`src/app/robots.ts`, blokkeert /leerpad + certificaten), Open Graph-defaults (layout), canonicals per pagina, schema.org Course-markup (cursusdetailpagina). Certificaatpagina's zijn noindex.
- Bij deploy nog: OG-afbeelding, Google Search Console aanmelden + sitemap indienen, .nl canoniek houden boven .com.

## Betalingen

- Mollie-account is **volledig live-klaar** (KYC afgerond in 2023, bankrekening geverifieerd, profiel Online). iDEAL, kaarten, PayPal en Apple Pay staan actief; SEPA-incasso is 3 aug 2026 aangevraagd en wacht op goedkeuring.
- **Volledige status, tarieven, MOI-risico (€65) en verplichte tegenmaatregelen: `docs/betalingen-mollie.md`.** Lees dat bestand vóór er iets aan de checkout gebouwd wordt.
- Live API-key hoort in omgevingsvariabelen, **nooit** in de repo.

## Roadmap (v2+)

Accounts/auth + serverkant voortgang, betalingen (College+ €14,99/mnd — zie `docs/betalingen-mollie.md`), AI-studiecoach, cursus Beleggingspsychologie (nu comingSoon-teaser), risicoprofiel-tool, blog.

**Let op bij v2:** betaalde lesinhoud moet naar de server. Nu wordt alle content naar de browser gestuurd — prima voor gratis materiaal, onhoudbaar zodra er betaald wordt.
