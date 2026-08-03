# Beleggingscollege

**Stap veilig in de wereld van beleggen.** Nederlands e-learningplatform voor eerlijk beleggingsonderwijs, geworteld in de beste boeken over de beurs — met quizzen, XP, levels, streaks, badges en printbare certificaten.

Live op [beleggingscollege.com](https://beleggingscollege.com). De `.nl` volgt zodra de verhuizing bij Strato rond is.

## Starten

```bash
npm ci
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000).

Voor inloggen en betalen heb je een `.env.local` nodig; zie `.env.example`. **Let op:** de
`DATABASE_URL` die daarin staat wijst naar de productiedatabase. Een verkeerd commando op
je laptop raakt dus echte klantgegevens.

**Bijdragen gaat via een PR**: `main` is beschermd, elke merge deployt naar productie, en
CI (typecheck, lint, tests, build, bundelcontrole) is verplicht. Lokaal reproduceer je de
hele poort met `npm run controle`; elke `git push` draait bovendien eerst de tests via de
pre-push-hook. Zie `docs/ci.md`.

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

## Documentatie

Begin bij de eerste twee.

- `CLAUDE.md` — architectuur, huisregels en de valkuilen die we al een keer in productie hebben gehad
- **`docs/openstaand.md` — wat er nog niet af is, en wat er bewust open staat**
- `docs/ci.md` — de CI-poort, de tests en hoe je lokaal hetzelfde draait
- `docs/cursusfabriek.md` — het recept waarmee de zes cursussen van 3 aug 2026 zijn gebouwd
- `docs/volgende-cursussen.md` — onderzochte prioriteitsvolgorde voor nieuwe cursussen
- `docs/opties-curriculum.md` — besluit en onderbouwing van de optie- en hefboomcursussen
- `docs/betalingen-mollie.md` — betalen via Mollie, met de testmatrix van de live checkout
- `docs/hosting-en-kosten.md` — Vercel, Cloudflare en de kosten
- `docs/domain-migration-plan.md` — stappenplan voor de verhuizing van de `.nl`
- `docs/prijsstrategie.md` — onderbouwing van € 49 / € 14,99 / € 149
- `docs/visuele-signatuur.md` — de isometrische stijl
- `docs/wordpress-audit.md` en `docs/salvage/` — wat de oude site was, en de geredde teksten
- `docs/implementatie-accounts-betalen.md` — **half achterhaald.** Geschreven vóór de bouw;
  het auth-hoofdstuk beschrijft Prisma, JWT en wachtwoordinloggen, waarvan niets gebouwd is.
  Lees `CLAUDE.md` en de code als bron van waarheid.
