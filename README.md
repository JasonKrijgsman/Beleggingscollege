# Beleggingscollege

**Stap veilig in de wereld van beleggen.** Nederlands e-learningplatform voor eerlijk beleggingsonderwijs, geworteld in de beste boeken over de beurs — met quizzen, XP, levels, streaks, badges en printbare certificaten.

Live op [beleggingscollege.com](https://beleggingscollege.com). De `.nl` volgt zodra de verhuizing bij Strato rond is.

## Starten

```bash
npm install
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000).

Voor inloggen en betalen heb je een `.env.local` nodig; zie `.env.example`. **Let op:** de
`DATABASE_URL` die daarin staat wijst naar de productiedatabase. Een verkeerd commando op
je laptop raakt dus echte klantgegevens.

## Wat er staat

- **3 volledige cursussen** (21 lessen, 88 quizvragen): Beleggen voor Beginners (gratis),
  Ontdek Waardebeleggen (€ 49), Introductie Technische Analyse (€ 49) — plus een teaser
  voor Beleggingspsychologie.
- **Accounts**: inloggen met Google (Auth.js v5, databasesessies).
- **Losse cursussen kopen** via Mollie: iDEAL, kaart, PayPal, Apple Pay. Het abonnement
  College+ is nog niet gebouwd.
- **Gamification**: 50 XP per les + quizbonus, 8 levels (Toeschouwer → Meesterbelegger),
  dagelijkse streaks, 10 badges. Voortgang leeft nog in `localStorage` en reist dus **niet**
  met je account mee naar een ander apparaat.
- **Interactieve tools**: rente-op-rente-rekenmachine in de les over samengestelde groei.
- **Certificaten**: printbaar per afgeronde cursus. Nog niet verifieerbaar.

## Documentatie

Begin bij de eerste twee.

- `CLAUDE.md` — architectuur, huisregels en de valkuilen die we al een keer in productie hebben gehad
- **`docs/openstaand.md` — wat er nog niet af is, en wat er bewust open staat**
- `docs/betalingen-mollie.md` — betalen via Mollie, met de testmatrix van de live checkout
- `docs/hosting-en-kosten.md` — Vercel, Cloudflare en de kosten
- `docs/domain-migration-plan.md` — stappenplan voor de verhuizing van de `.nl`
- `docs/prijsstrategie.md` — onderbouwing van € 49 / € 14,99 / € 149
- `docs/visuele-signatuur.md` — de isometrische stijl
- `docs/wordpress-audit.md` en `docs/salvage/` — wat de oude site was, en de geredde teksten
- `docs/implementatie-accounts-betalen.md` — **half achterhaald.** Geschreven vóór de bouw;
  het auth-hoofdstuk beschrijft Prisma, JWT en wachtwoordinloggen, waarvan niets gebouwd is.
  Lees `CLAUDE.md` en de code als bron van waarheid.
