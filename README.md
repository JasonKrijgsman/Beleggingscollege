# Beleggingscollege

**Stap veilig in de wereld van beleggen.** Nederlands e-learningplatform voor eerlijk
beleggingsonderwijs, geworteld in de beste boeken over de beurs — met quizzen, XP, levels,
streaks, badges en printbare certificaten.

Live op [beleggingscollege.com](https://beleggingscollege.com). De `.nl` resolvet sinds
3 aug 2026 via Cloudflare, maar serveert nog de oude WordPress-site; de resterende stappen
staan in `docs/nl-als-hoofddomein.md`.

Next.js 15 (App Router), React 19, TypeScript, Tailwind v4. Accounts via Auth.js v5
(Google, databasesessies), betalen via Mollie, Postgres bij Neon met Drizzle. Cursusinhoud
is typed data in `src/content/`, geen CMS.

## Starten

```bash
npm ci
npm run dev     # http://localhost:3000
```

Voor inloggen en betalen heb je een `.env.local` nodig; zie `.env.example`. **Let op:** de
`DATABASE_URL` die daarin staat wijst naar de productiedatabase. Een verkeerd commando op
je laptop raakt dus echte klantgegevens.

## De poort naar `main`

`main` is beschermd en elke merge deployt naar productie. Direct pushen wordt geweigerd:
bijdragen gaat via een PR met groene CI (typecheck, lint, tests, build, bundelcontrole).
Elke `git push` draait bovendien eerst de tests via de pre-push-hook.

```bash
npm run controle   # dezelfde poort, lokaal
```

Details, beperkingen en wat de tests precies bewaken: `docs/ci.md`.

## Wat er staat

- **9 cursussen** (69 lessen, 280 quizvragen, stand 3 aug 2026): Beleggen voor Beginners
  (gratis), Ontdek Waardebeleggen, Introductie Technische Analyse, Beleggingspsychologie,
  de opties-leerlijn (Opties Begrijpen, Beschermen & Verdienen met Opties, Volatiliteit &
  Spreads), Indexbeleggen & ETF's (elk € 49) en Hefboomproducten (€ 29).
- **Accounts**: inloggen met Google (Auth.js v5, databasesessies).
- **Losse cursussen kopen** via Mollie: iDEAL, kaart, PayPal, Apple Pay. Het abonnement
  College+ is nog niet gebouwd. Let op: in productie staat nog een test-key — zie
  `docs/openstaand.md` hoofdstuk 1.
- **Gamification**: 50 XP per les + quizbonus, 8 levels (Toeschouwer → Meesterbelegger),
  dagelijkse streaks, 10 badges. Voortgang synct voor ingelogde gebruikers naar de server;
  uitgelogd blijft `localStorage` leidend.
- **15 interactieve lestools**: van de rente-op-rente-rekenmachine tot de optieketen-lezer,
  de biastest en de kosten-vreter. Allemaal te testen op `/lab/opties` (intern, noindex).
- **Certificaten**: printbaar per afgeronde cursus. Nog niet verifieerbaar.
- **Vragen bij de les**: redactionele Q&A per les, moderatie op `/beheer/vragen`.

## Drie dingen die je moet weten vóór je iets aanraakt

Alle drie zijn een keer echt misgegaan, en alle drie stil. De volle uitleg staat in
`CLAUDE.md`; dit is de korte versie.

1. **`heeftToegangTot()` in `src/lib/entitlements.ts` is de enige toegangspoort.** Hij
   leest één ding: een rij in `entitlements` met status `actief`. Bouw er geen tweede
   check naast, dan lopen ze uit elkaar.
2. **Cursusinhoud lekt via `import`, niet alleen via props.** `@/content` is daarom
   `server-only`. Controleer een lek nooit alleen in de HTML:
   `npm run build && npm run controleer:bundel` (draait ook in CI).
3. **`db.transaction()` gooit op de neon-http-driver van productie**, terwijl het in de
   PGlite-tests wél werkt — een fout die groen is in CI en pas op productie omvalt. Moet
   iets atomair? Eén statement met data-modifying CTE's.

## Documentatie

Begin bij de eerste twee.

- `CLAUDE.md` — architectuur, huisregels en de valkuilen die we al een keer in productie
  hebben gehad. **De bron van waarheid.** `AGENTS.md` is dezelfde inhoud voor niet-Claude-
  gereedschap; werk ze samen bij.
- **`docs/openstaand.md` — wat er nog niet af is, en wat er bewust open staat.** Lees dit
  vóór je iets belooft of live zet; het is de enige canonieke lijst.
- `docs/architectuur.md` — de kaart: lagen, modulegrenzen en waar ze breken
- `docs/plattegrond.md` — autogegenereerd routeoverzicht (`npm run plattegrond`)
- `docs/ci.md` — de CI-poort, de tests en hoe je lokaal hetzelfde draait
- `docs/ontwerp-betaalmodel.md` — betaalpoging, order en toegang uit elkaar (uitgevoerd,
  PR #22)
- `docs/betalingen-mollie.md` — betalen via Mollie, met de testmatrix van de live checkout
- `docs/e-mail-versturen.md` — waarom Migadu, en wat er nog moet vóór er post uitgaat
- `docs/cursusfabriek.md` — het recept waarmee de zes cursussen van 3 aug 2026 zijn gebouwd
- `docs/volgende-cursussen.md` — onderzochte prioriteitsvolgorde voor nieuwe cursussen
- `docs/opties-curriculum.md` — besluit en onderbouwing van de optie- en hefboomcursussen
- `docs/prijsstrategie.md` — onderbouwing van € 49 / € 14,99 / € 149
- `docs/college-plus-concept.md` — waarom de oefenlaag het abonnement draagt
- `docs/hosting-en-kosten.md` — Vercel, Cloudflare en de kosten
- `docs/domain-migration-plan.md` en `docs/nl-als-hoofddomein.md` — de verhuizing van de
  `.nl`: wat af is, en wat er nog moet
- `docs/analytics.md` — Umami, zelf gehost, en de juridische grens
- `docs/visuele-signatuur.md` — de isometrische stijl
- `docs/wordpress-audit.md` en `docs/salvage/` — wat de oude site was, en de geredde teksten
- `docs/reviews/` — de audits waar veel van het bovenstaande uit komt

De overige documenten in `docs/` zijn per onderwerp genoemd in `CLAUDE.md`.

**Twee die je met een korrel zout moet lezen:**

- `docs/implementatie-accounts-betalen.md` — **half achterhaald.** Geschreven vóór de bouw;
  het auth-hoofdstuk beschrijft Prisma, JWT en wachtwoordinloggen, waarvan niets gebouwd is,
  en het toegangshoofdstuk beschrijft nog `purchases` als toegangsbron.
- `docs/productonderzoek.md` en `docs/wat-de-winkel-mist.md` — analyses van 2 aug 2026,
  inmiddels deels ingehaald. Onderbouwing, geen takenlijst.

Bron van waarheid blijft `CLAUDE.md` en de code.
