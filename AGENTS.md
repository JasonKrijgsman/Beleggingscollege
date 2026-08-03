# Beleggingscollege

Nederlands e-learningplatform voor beleggingsonderwijs (beleggingscollege.nl). Missie: eerlijk, toegankelijk beleggingsonderwijs geworteld in klassieke boeken — géén get-rich-quick. Merkstem: Nederlands, je/jij-vorm, vriendelijk-professioneel, reassurance-first.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`), lucide-react icons.
- Cursusinhoud is typed data (`src/content/`). Accounts en aankopen staan in Postgres (Neon + Drizzle); **lesvoortgang leeft nog altijd in localStorage** en reist dus niet mee naar een ander apparaat — de tabellen `lesson_progress` en `user_stats` bestaan wel maar worden door geen enkele regel code gelezen of geschreven.
- Dev server: `npm run dev` (poort 3000). Build: `npm run build`.
- **`docs/openstaand.md` is de lijst met alles wat nog niet af is.** Lees die vóór je iets belooft of live zet.

## Architectuur

- `src/content/types.ts` — contentschema (Course → Module → Lesson → QuizQuestion). Nieuwe cursus = nieuw bestand in `src/content/courses/` + import in `src/content/index.ts`.
- `src/lib/progress.tsx` — gamification-engine (client): XP, levels, streaks, badges, quizscores; persistentie in localStorage key `beleggingscollege-voortgang-v1`. `completeLesson()` is het enige muterende pad.
- `src/lib/levels.ts` (8 levels: Toeschouwer → Meesterbelegger), `src/lib/badges.ts` (10 badges met predicaten), `src/lib/accent.ts` (kleurvarianten per cursus).
- `src/lib/pricing.ts` — bron voor de prijzen zoals ze op de site **staan**: losse cursus €49 eenmalig, College+ €14,99/mnd (€149/jr). Onderbouwing: `docs/prijsstrategie.md`. Let op: wat er daadwerkelijk wordt afgerekend komt uit `prijsInCenten()` in de checkout, dat de weergavetekst met een regex terugrekent naar centen. Wijzig je hier een prijs, controleer dan dat die conversie meeloopt.
- `src/lib/site.ts` — `SITE_URL`, leest `NEXT_PUBLIC_SITE_URL`, standaard `https://beleggingscollege.com`. Canonicals, sitemap, robots, Open Graph en schema.org lezen hier allemaal uit. Bij de verhuizing gaat het meeste dus vanzelf mee — maar níét alles: het e-mailadres, de teksten in de voettekst en het certificaat noemen de `.nl` los in de code. Grep op `beleggingscollege.` vóór je de knop omzet.
- `src/content/blog.ts` — blogartikelen als data. Nieuw artikel = blok toevoegen aan `posts`; overzicht, artikelpagina, sitemap en SEO volgen vanzelf.
- Pages: `/` (marketing), `/cursussen`, `/cursussen/[slug]`, `/cursussen/[slug]/les/[les]`, `/cursussen/[slug]/certificaat` (printbaar), `/leerpad` (dashboard), `/blog` + `/blog/[slug]`, `/over-ons`, `/veelgestelde-vragen`, `/contact`, `/privacy`, `/voorwaarden`, `/herroepingsrecht` (die laatste drie zijn **concepten** en staan op noindex tot een jurist ernaar kijkt), `/lab` (intern stijllab, noindex).
- XP-regels: 50 XP per les + quizbonus tot 25 XP; herhaalde les = 0 XP.

## Accounts, database en toegang

**Live sinds 2 augustus 2026.** Inloggen met Google werkt op productie; er staan echte gebruikers, sessies en gekoppelde providers in de database.

- **Neon-database draait** (PostgreSQL 17, regio Frankfurt), 8 tabellen aangemaakt via `npx drizzle-kit migrate`. De SQL staat in `drizzle/` en hoort mee de repo in.
- **Omgevingsvariabelen staan in Vercel** (Production + Preview): `AUTH_SECRET` (een ándere dan lokaal — een lek op de laptop mag geen productiesessies raken), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, plus alles wat de Neon-integratie zelf injecteert. Lokaal staat hetzelfde in `.env.local` (nooit committen; zie `.env.example`).
- `NEXT_PUBLIC_SITE_URL` staat bewust **niet** in Vercel: `NEXT_PUBLIC_`-variabelen worden in de browserbundel gebakken, dus die als "Sensitive" markeren is schijnveiligheid. De code valt terug op `https://beleggingscollege.com`. Bij de verhuizing naar de `.nl` alsnog toevoegen, als gewone (niet-gevoelige) variabele.
- Google OAuth: alleen de scopes `openid`, `email`, `profile` — daarmee is Google's volledige verificatietraject niet nodig. Alle vier de redirect-URI's (localhost, `.com`, `.nl`, `www.nl`) staan al geregistreerd, dus de domeinverhuizing vraagt daar geen actie.

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

**De site staat LIVE op https://beleggingscollege.com** (sinds 2 aug 2026).

- **Code**: GitHub `JasonKrijgsman/Beleggingscollege`, branch `main`.
- **Hosting**: Vercel, team "Visual Future", project `beleggingscollege`. **Elke push naar `main` deployt automatisch**; elke branch krijgt een preview-URL. Login: accounts@jasonkrijgsman.com (wachtwoordloos + passkeys, bewust geen SSO).
- **`beleggingscollege.com`** — registrar Cloudflare (betaald t/m nov 2027), DNS bij Cloudflare, CNAME `@` → `6d87ec9bdcf67bce.vercel-dns-017.com`, **DNS only (grijze wolk)**. Dit is tijdelijk het canonieke adres.
- **`beleggingscollege.nl`** — nog bij Strato. De verhuizing wacht op DNSSEC-deactivering, en die **loopt**: in het Strato-paneel staat onder Domeinen → DNS → DNSSEC "Wordt gedeactiveerd". Er is geen knop om het te versnellen. Zodra `Resolve-DnsName -Name beleggingscollege.nl -Type DS -Server 1.1.1.1` niets meer teruggeeft (nu nog keytag 43361), kan de naamserverwissel door. Cloudflare-zone bestaat al met 11 records klaar. Zie `docs/domain-migration-plan.md`.
- **De `.nl` draait nog de oude WordPress-site**, inclusief drie verzonnen testimonials die we juist uit de nieuwe site hebben gehaald — en dat is het adres in onze eigen footer en op elk certificaat. Dat is de eigenlijke reden dat de verhuizing haast heeft.
- **Zodra de .nl verhuisd is**: `NEXT_PUBLIC_SITE_URL` in Vercel op `https://beleggingscollege.nl` zetten en een permanente redirect `.com` → `.nl` toevoegen. Verder hoeft er niets in de code.
- **Kosten en de Vercel-valkuil rond commercieel gebruik**: `docs/hosting-en-kosten.md`. Kort: Vercel Hobby is alleen voor niet-commercieel gebruik; zodra er betaald kan worden is Pro (~$20/mnd) verplicht.
- Gered materiaal van de oude WordPress-site: `docs/salvage/`.
- Jasons eigen ideeën (gebouwd, nog niet gebouwd, afgevallen): `docs/ideeen.md`. Wat de winkel nog mist en waarom: `docs/wat-de-winkel-mist.md`.

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

- **Losse cursussen kopen wérkt** — op 2 aug 2026 end-to-end getest op de live site: koopknop → Mollie → webhook → `purchases.status = 'paid'` → les ontgrendelt. Bewijs en testmatrix in `docs/betalingen-mollie.md`.
- **Er staat nu een `test_`-key in Vercel.** De winkel lijkt dus open, maar niemand kan echt betalen. Vervang `MOLLIE_API_KEY` door de live-key vóór de eerste verkoop, en deploy daarna opnieuw.
- Mollie-account is live-klaar (KYC afgerond in 2023, bankrekening geverifieerd, profiel Online). iDEAL, kaarten, PayPal en Apple Pay staan actief; SEPA-incasso is 2 aug 2026 aangevraagd en wacht nog op goedkeuring — dat blokkeert alleen het abonnement, niet de losse verkoop.
- **MOI-risico (€65), tarieven en verplichte tegenmaatregelen: `docs/betalingen-mollie.md`.** Lees dat vóór er aan het abonnement gebouwd wordt.
- API-keys horen in omgevingsvariabelen, **nooit** in de repo.

### Twee regels die niet gebroken mogen worden

1. **De prijs komt uit onze eigen catalogus, nooit uit het verzoek.** Anders bepaalt de klant wat hij betaalt.
2. **De webhook gelooft niets uit de payload behalve het id.** Mollie stuurt alleen `id=tr_…`; het endpoint is publiek, dus de status halen we zelf op en we controleren bedrag én valuta tegen wat wij hadden vastgelegd.

## E-mail

**Stand: de code is af, er gaat nog niets de deur uit, en dat is een keuze.** Volledige onderbouwing in `docs/e-mail-versturen.md`.

- **Verzenden en ontvangen zijn twee losse dingen.** Een postbus ontvangt; transactionele mail versturen we via een server of API en dat heeft géén postbus nodig. Dit wachtte dus nooit op Strato — een misvatting die ons een tijd heeft opgehouden.
- **Gekozen: Migadu**, niet Resend. Jason betaalt er al voor (draait voor bliep.org en jasonkrijgsman.com) en de post van dit domein gaat er na de verhuizing sowieso heen. We geven daarmee bezorglogboeken en bounce-webhooks op; bij nul tot enkele verkopen per maand is dat een prima ruil.
- **Correctie die je moet kennen:** transactionele mail is níét in strijd met Migadu's voorwaarden. Die verbieden spam en niet-toegestemde mailinglijsten; een orderbevestiging is geen van beide. Het obstakel is dat Migadu een domein pas activeert als de MX ernaartoe wijst.
- **We wachten op de verhuizing van de `.nl`**, omdat de bevestigingsmail niet op het kritieke pad staat: er kan toch geen echt geld binnenkomen (test-key, Vercel Hobby, geen vestigingsadres). Duurt Strato te lang, dan is er een ontsnappingsroute — de MX kan bij Strato zelf naar Migadu wijzen, zónder naamserverwissel, want DNSSEC blokkeert alleen dat laatste. Stappen staan in `docs/e-mail-versturen.md`.
- **Valkuil die stil misgaat:** het domein publiceert `p=reject` zónder SPF. Uitgaande post slaagt nu alleen doordat Strato met DKIM ondertekent. Verstuurt Migadu straks zonder eigen DKIM-records, dan wordt élke bevestigingsmail geweigerd — niet in spam, geweigerd. Eerst de records, dan pas verzenden.
- `src/lib/mail.ts` praat nu met de HTTP-API van Resend. Migadu heeft alleen SMTP, dus die ene functie moet nog omgebouwd worden. De rest van de keten (`orderbevestiging.ts`, `mailteksten.ts`, de webhook) raakt dat niet: die roepen alleen `verstuurMail()` aan.
- `verstuurMail()` **gooit nooit**: hij draait in de Mollie-webhook nadat de aankoop al op `paid` staat, en een mislukte mail mag daar geen 500 van maken (Mollie herhaalt dan tien keer over 26 uur).
- `purchases.confirmationSentAt` voorkomt tien identieke mails bij herhaalde webhooks en is tegelijk het bewijs dát de verplichte bevestiging is verstuurd.

### Bedrijfsgegevens: één btw-nummer is openbaar, het andere nooit

- **`NL004813328B30`** is het **btw-identificatienummer**. Openbaar, hoort in de voettekst (art. 3:15d BW) en in de orderbevestiging. Staat er.
- Het **omzetbelastingnummer** (afgeleid van Jasons BSN) staat bewust **niet in de repo** — het exacte nummer hoort in geen enkel bestand. Publiceer het **nooit**: niet in code, niet in een mail, niet in documentatie. Nodig? Haal het buiten de repo op.
- Vestigingsadres en btw-nummer komen uit de omgevingsvariabelen `BEDRIJF_ADRES` en `BEDRIJF_BTW_NUMMER`, en staan bewust niet in de repo: Jason wil zijn woonadres niet op internet. Het adres is nog niet opgelost — zie `docs/openstaand.md`.
- **Geen kleineondernemersregeling** (bevestigd 2 aug 2026), dus de 21%-regel in de bevestiging klopt.

## Toegang tot betaalde content

`heeftToegangTot()` in `src/lib/entitlements.ts` is de **enige** toegangspoort — voeg geen tweede check elders toe, dan lopen ze uit elkaar.

Drie valkuilen die we al een keer in productie hebben gehad. Alle drie waren stil.

- **Props naar client components komen in de HTML terecht.** Geef daarom nooit een `Course` door; gebruik de view-modellen in `src/content/view.ts`. Zo lekten ooit alle lesteksten én de quizantwoorden (`correctIndex`) mee in de publieke cursuspagina.
- **Imports lekken net zo hard als props — en dat is de gemenere van de twee.** Een module met `"use client"` die `@/content` importeert, sleept de complete modulegraaf mee de browserbundel in, ook als hij er alleen een lestelling uit gebruikt. Zo stonden 21 lessen en 88 quizantwoorden in een publiek JS-bestand van 197 kB, terwijl de HTML schoon was en de propkant al was dichtgezet. **`@/content` heeft daarom `import "server-only"`**: de build faalt nu zodra iemand dit opnieuw doet. Heeft een client component cursusgegevens nodig, gebruik dan `catalogus()` uit `view.ts` op de server en geef het resultaat door. Types importeren mag wél, maar uitsluitend met `import type` — dat verdwijnt bij het compileren.
- **Betaalde lespagina's mogen niet vooraf gebouwd worden.** `generateStaticParams` levert alleen de gratis cursus; de rest rendert per verzoek. Anders bevriest de toegangscheck tijdens de bouw — zonder sessie — en zien kopers voor altijd het slot.

**Controleer een lek nooit alleen in de HTML.** Dat was de fout waardoor de tweede valkuil maandenlang onopgemerkt bleef: de pagina zag er schoon uit. Haal de bundel er ook bij:

```bash
npm run build && grep -rl "correctIndex" .next/static/chunks/
```

## Roadmap (v2+)

Abonnement College+ (wacht op SEPA), bevestigingsmail na aankoop, facturen/btw, terugbetalingen, AI-studiecoach, cursus Beleggingspsychologie (nu comingSoon-teaser), risicoprofiel-tool.
