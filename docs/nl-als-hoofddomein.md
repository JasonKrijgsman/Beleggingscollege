# De `.nl` als hoofddomein

Opgesteld 3 augustus 2026, direct na de DNS-verhuizing. Dit is de laatste stap van de
domeinverhuizing die **niet** op Strato wacht.

## Waarom dit haast heeft

`beleggingscollege.nl` resolvet sinds 3 augustus weer, via Cloudflare. Maar de A- en
AAAA-records wijzen nog naar `81.169.145.93` — de oude WordPress-site bij Strato. Dat was
tijdens de verhuizing bewust zo (niets kapotmaken terwijl de delegatie verhuist), maar het
betekent nu:

- Wie `beleggingscollege.nl` intikt, krijgt de oude site. Inclusief **de drie verzonnen
  testimonials** die we uit de nieuwe site hebben gehaald omdat ze niet waar zijn.
- Dat adres staat in onze eigen voettekst en op **elk certificaat** dat een cursist print.
- De echte site draait ondertussen op `beleggingscollege.com`.

Dit was van begin af aan de eigenlijke reden dat de verhuizing haast had. Zie
`docs/openstaand.md` en de eerlijkheidsregels in `CLAUDE.md`.

## Wat er moet gebeuren

1. **Vercel** → project `beleggingscollege` (team Visual Future) → Settings → Domains →
   `beleggingscollege.nl` en `www.beleggingscollege.nl` toevoegen. Vercel toont per domein de
   exacte records die het wil.
2. **Cloudflare** (zone `beleggingscollege.nl`) → DNS:
   - Apex `@`: de bestaande **A** `81.169.145.93` en **AAAA** `2a01:238:20a:202:1093::`
     verwijderen, en het A-record zetten op de waarde die Vercel toont. Neem die waarde
     letterlijk over — Vercel gebruikt tegenwoordig per project verschillende adressen, dus
     `76.76.21.21` uit oudere handleidingen kan verouderd zijn.
   - `www`: het CNAME staat nu naar `beleggingscollege.nl`; omzetten naar wat Vercel toont
     (meestal `cname.vercel-dns.com`).
   - Beide op **DNS only (grijze wolk)**, in elk geval tot Vercel het certificaat heeft
     uitgegeven. Grijs laten mag permanent; ga je later toch proxyen, zet SSL/TLS dan op
     **Full (strict)** en nooit op Flexible (dat geeft een oneindige redirect).
   - **Kom niet aan de MX-, SPF-, DKIM- of DMARC-records.** Die horen bij Migadu en staan los
     van waar de website draait. Mail breekt als je ze weghaalt.
3. **Vercel omgevingsvariabelen**: `NEXT_PUBLIC_SITE_URL` op `https://beleggingscollege.nl`
   (Production + Preview). Die stond er bewust nog niet in; nu wel, als gewone niet-gevoelige
   variabele. Daarna opnieuw deployen — `NEXT_PUBLIC_`-variabelen worden in de bundel gebakken.
4. **Permanente redirect `.com` → `.nl`** toevoegen in `next.config.ts`, naast de bestaande
   WordPress-redirects. Zonder dat concurreren twee identieke sites om dezelfde zoekwoorden.
   Let op dat de redirect de `.com` niet naar zichzelf laat wijzen (oneindige lus) — hij moet
   op de host matchen.
5. **Controleren** na de deploy:
   - `beleggingscollege.nl` en `www.` tonen de Next.js-site, met geldig certificaat.
   - `beleggingscollege.com` stuurt met een 301 door naar de `.nl`.
   - `curl -sI https://beleggingscollege.nl` geeft geen redirect-lus.
   - Canonicals, sitemap en het certificaat noemen de `.nl` (die volgen `SITE_URL`).
   - **Mail werkt nog**: MX wijst nog naar `aspmx1/aspmx2.migadu.com`.
6. **Grep op `beleggingscollege.`** vóór je klaar bent. Niet alles volgt `SITE_URL`: het
   e-mailadres, de voettekst en het certificaat noemen het domein los in de code.

## Wat hierna nog los blijft staan

- Google Search Console: nieuwe property voor de `.nl`, sitemap indienen, en de verhuizing
  daar melden.
- De oude WordPress-site bij Strato is daarna onbereikbaar via het domein. Het pakket loopt
  door tot 05-08-2027 (zie `docs/hosting-en-kosten.md`), dus er is geen haast met opruimen —
  maar controleer wel dat `docs/salvage/` alles bevat wat je wilde bewaren.
- De registrar-verhuizing naar Porkbun staat hier volledig los van en wacht op de verhuiscode;
  zie `docs/domain-migration-plan.md`.
