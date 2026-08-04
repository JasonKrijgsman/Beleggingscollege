# Ontwerpnotitie: splits betaalpoging, order en toegang

Geschreven: 3 augustus 2026.

> ## Status: UITGEVOERD op 3 augustus 2026 (PR #22)
>
> **Dit is de onderbouwing, niet een openstaande actie.** Wie dit document koud
> opslaat en de zin "er is nog geen regel code gewijzigd" leest — die stond hier
> tot de archiefronde — concludeert ten onrechte dat het betaalmodel nooit
> gebouwd is. Het is er wél, en het is precies het geldpad waar de site nu op
> draait.
>
> - `payment_attempts`, `entitlements` en `order_counters` staan in
>   `src/db/schema.ts` en in `drizzle/0004_betaalmodel.sql`, inclusief de
>   backfill uit `purchases`.
> - **Migratie 0004 is op productie gedraaid.**
> - `heeftToegangTot()` leest sindsdien uitsluitend `entitlements` met status
>   `actief`; de checkout doet een append-only insert in `payment_attempts`;
>   de webhook zet de poging op `paid`, deelt het ordernummer uit én verleent
>   het entitlement — in één statement.
> - `test/betaalmodel.test.ts` en `test/migratie-betaalmodel.test.ts` bewaken de
>   scenario's uit dit document; `test/entitlements.test.ts` pint af dat een
>   betaalpoging op `paid` uit zichzelf géén toegang geeft.
>
> **Wat er nog wél open staat: de contract-stap.** `purchases` bestaat nog als
> tabel, maar wordt door geen enkele regel productiecode meer gelezen of
> geschreven. `DROP TABLE purchases` mag pas na de voorwaarden uit §5 (stap 3)
> hieronder — zie `docs/openstaand.md` §6b voor de actuele stand.
>
> **En één plek waar dit document afwijkt van wat er gebouwd is:** de schets in
> §2.2 gebruikt `await db.transaction(...)`. Dat **kan niet** op de
> productiedriver — neon-http gooit "No transactions support in neon-http
> driver", terwijl PGlite in de tests hem wél accepteert. Neem dat voorbeeld
> dus niet over. De gebouwde versie is één `db.execute()` met data-modifying
> CTE's in `verwerkBetaald()` (`src/app/api/mollie/webhook/route.ts`); de
> waarschuwing staat inmiddels ook in CLAUDE.md.

Dit is de ontwerpnotitie die volgens `docs/openstaand.md` §6b (eerste P0-punt) vóór de
code moet komen. De bevinding zelf komt uit de Codex-harmonisatiereview van 3 augustus
(`docs/reviews/2026-08-03-codex-repository-harmonisatie-en-synthese.md`, §"Prioriteit P0"
punt 1 en §7); elk scenario hieronder is opnieuw tegen de actuele code gelegd, met
regelnummers. Dit werk hoort af te zijn **vóór de live-key** — zolang de `test_`-key erin
staat kan geen van deze races echt geld raken, daarna wel.

**Kort:** de tabel `purchases` speelt nu drie rollen tegelijk — betaalpoging, order en
toegangsrecht — en dat gaat mis zodra er twee dingen tegelijk gebeuren. Het voorstel:
één `entitlements`-rij per gebruiker/cursus (waar `heeftToegangTot()` naar kijkt) en een
append-only `payment_attempts`-tabel met één rij per Mollie-id, met expliciet
toegestane statusovergangen. De eenvoudiger variant (één tabel houden, overgangen
voorwaardelijk maken) is overwogen en afgevallen; de eerlijke afweging staat in §2.3.

---

## 1. Het probleem: één rij speelt drie rollen

De kern zit in twee plekken:

- `src/db/schema.ts:144` dwingt met `purchases_user_course_idx` **één rij per
  gebruiker per cursus** af.
- `src/app/api/checkout/route.ts:88-111` doet `insert … onConflictDoUpdate`: een
  nieuwe betaalpoging **overschrijft** de bestaande rij met het nieuwe payment-id en
  `pending`.

Daardoor is de rij tegelijk: de administratie van een concrete Mollie-betaling, het
orderbewijs (`orderNumber`, `confirmationSentAt`, consentvelden) én het actuele recht op
toegang (`status = "paid"`, gelezen door `src/lib/entitlements.ts:34-44`). Drie begrippen
met drie verschillende levensduren in één rij — en elke race hieronder is een gevolg
daarvan. Alle zes zijn geverifieerd tegen de code; geen ervan vraagt een aanvaller,
alleen een dubbelklik, een trage database of een toekomstige refund.

### Scenario 1 — twee tabbladen, twee betaallinks, één vindbaar

Twee gelijktijdige checkouts (dubbelklik, twee tabbladen). Beide passeren de
"al gekocht?"-select (`checkout/route.ts:60-71` — geen van beide ziet `paid`), beide
maken bij Mollie een betaling aan (`route.ts:77-83`): `tr_A` en `tr_B`. Beide upserts
mikken op dezélfde rij; de laatste schrijver wint en de rij houdt alleen `tr_B` over.

Betaalt de klant nu de link van het éérste tabblad (`tr_A`), dan vindt de webhook dat id
niet (`src/app/api/mollie/webhook/route.ts:52-60`) en antwoordt hij `200 OK` — waarmee
Mollie ook nooit meer terugkomt. De klant heeft echt betaald en krijgt géén toegang, en
in onze administratie is niets te zien. Dit is het zwaarste scenario: betaald geld
zonder zichtbare order.

### Scenario 2 — de webhook zet `paid`, de checkout zet het terug

Er staat een `pending`-rij met `tr_A`. De klant betaalt, en klikt (ongeduldig, of in een
tweede tabblad) nogmaals op kopen. De checkout leest `pending` (`route.ts:60-71`, dus
geen 409) en maakt `tr_B` aan. Tússen die select en de upsert landt de webhook en zet de
rij op `paid` (`webhook/route.ts:85-93`). Daarna schrijft de upsert
(`route.ts:101-110`) de rij terug naar `status: "pending"` met `tr_B` als payment-id.

Gevolg: toegang die net terecht was verleend is weer weg — `heeftToegangTot()`
(`entitlements.ts:41`) eist `status = "paid"` en ziet het slot. En omdat `tr_A` niet
meer aan een rij hangt, herstelt de herhaalde webhook voor `tr_A` het ook nooit: die
eindigt in de onbekend-id-tak (`webhook/route.ts:60`). De `ne(status, "paid")`-voorwaarde
in de webhook (`route.ts:89-92`) beschermt hier níét tegen — die voorkomt alleen dat
`paidAt` opschuift bij herhaalde webhooks, hij houdt de checkout niet tegen.

### Scenario 3 — databasefout ná `payments.create()`

`route.ts:77` maakt de betaling bij Mollie aan; pas daarna (`route.ts:88`) schrijven we
hem in de database. Faalt die schrijfactie (Neon-hik, timeout), dan bestaat er bij
Mollie een betaalbare betaling die onze administratie niet kent. De klant krijgt een
500 en probeert het opnieuw — waarmee scenario 1 zich alsnog voordoet zodra de retry
slaagt: de oude, wél aangemaakte betaling is voorgoed onvindbaar. Elke webhook over
zo'n weesbetaling eindigt in de onbekend-id-tak en meldt niets.

### Scenario 4 — een retry wist bewijs

De webhook zet een rij op `mismatch` als bedrag of valuta niet klopt
(`webhook/route.ts:64-79`) — precies de rij die je bij een geschil of fraudeonderzoek
wilt bewaren. Maar `mismatch` is geen `paid`, dus een volgende checkout passeert de
409-controle en de upsert overschrijft status én payment-id. Het bewijs (wélk Mollie-id,
wat er gebeurde) is weg; het enige spoor is een `console.error` in Vercels vluchtige
logboeken. Hetzelfde geldt voor `failed`/`expired`/`canceled`: elke retry wist de vorige
poging uit de geschiedenis.

### Scenario 5 — heraankoop na refund hergebruikt oud order- en mailbewijs

Zodra terugbetalen bestaat (roadmap; de webhook reserveert er al een status voor,
`webhook/route.ts:105-108`) komt dit pad vrij: rij op `refunded`, klant koopt later
opnieuw. De upsert-`set` (`route.ts:103-110`) wist `confirmationSentAt`, `orderNumber`
en `paidAt` **niet**. Na de nieuwe betaling ziet `stuurOrderbevestiging()` het oude
`confirmationSentAt` staan en stopt (`src/lib/orderbevestiging.ts:50`): de nieuwe
verkoop krijgt géén wettelijk verplichte bevestiging. En het oude ordernummer blijft
aan de rij hangen (`orderbevestiging.ts:61` pakt het bestaande nummer), dus de nieuwe
betaling wordt geboekt onder het nummer van de terugbetaalde order. Twee verkopen, één
ordernummer, één bevestiging — de doorlopende nummering waar `src/db/schema.ts:137-139`
juist voor bestaat, is dan stuk.

### Scenario 6 — `createdAt` beweegt niet mee

De upsert-`set` bevat `createdAt` niet (`route.ts:103-110`), dus een verse poging
behoudt de aanmaakdatum van de eerste (`schema.ts:128`). Beheer ziet een poging van
vandaag als dagen oud; een toekomstige opruimronde op "hangende pendings ouder dan X"
rekent verkeerd; en `geefOrdernummer()` trekt het jaar uit `createdAt`
(`orderbevestiging.ts:116`), wat over een jaargrens heen het verkeerde jaar in het
ordernummer zet.

Daarnaast, in dezelfde hoek maar geen race: de ordernummering zelf is tellen-dan-proberen
(`orderbevestiging.ts:106-136`) — bij een botsing op de unieke index slaat de hertelling
een nummer over, de kale `catch {}` (regel 128-130) behandelt élke databasefout als
botsing, en de terugval mailt een `Date.now()`-nummer (regel 135) dat nooit in de
database belandt: de klant krijgt dan een ordernummer dat in de administratie niet
bestaat. De Codex-review (§7) wil dit terecht sámen met het betaalmodel opgelost; het
doelmodel hieronder neemt het mee.

---

## 2. Doelmodel

Drie begrippen, drie levensduren, dus drie plekken:

1. **Betaalpoging** (`payment_attempts`) — append-only, één rij per Mollie-id. Wordt
   nooit verwijderd, het payment-id wordt nooit herschreven. De rij die `paid` bereikt
   ís de order: daar horen ordernummer en mailbewijs bij.
2. **Toegangsrecht** (`entitlements`) — precies één rij per gebruiker per cursus, met
   status `actief` of `ingetrokken`. Dit is voortaan wat `heeftToegangTot()` leest.
3. **Ordernummerteller** (`order_counters`) — één rij per jaar, zodat nummers atomair
   en zonder gaten worden uitgedeeld in plaats van geteld-en-geprobeerd.

Een aparte vierde "orders"-tabel naast de pogingen is overwogen en afgevallen: in deze
winkel is één betaling één order (er is geen winkelwagen), dus een extra tabel voegt
een join toe zonder extra waarheid.

### 2.1 Tabellen (Drizzle)

```ts
/** Eén rij per Mollie-betaling. Append-only: rijen worden nooit verwijderd,
 *  mollie_payment_id / bedrag / consent / created_at worden nooit herschreven.
 *  De rij die "paid" haalt is de order; daar horen ordernummer en mailbewijs bij. */
export const paymentAttempts = pgTable(
  "payment_attempts",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    /** Uniek: een dubbele webhook kan nooit een tweede rij voor dezelfde
     *  betaling maken; twee checkouts maken juist wél twee rijen. */
    molliePaymentId: text("mollie_payment_id").notNull().unique(),
    /** pending | paid | failed | expired | canceled | mismatch | refunded */
    status: text("status").notNull().default("pending"),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),

    /* Consentbewijs, zoals nu (schema.ts:120-126) — per póging vastgelegd,
     * zodat een retry het bewijs van een eerdere poging niet overschrijft. */
    withdrawalWaivedAt: timestamp("withdrawal_waived_at", { mode: "date" }),
    consentIp: text("consent_ip"),
    consentTermsVersion: text("consent_terms_version"),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { mode: "date" }),

    /* Mailbewijs, met een atomaire claim (zie §2.4). */
    confirmationClaimedAt: timestamp("confirmation_claimed_at", { mode: "date" }),
    confirmationSentAt: timestamp("confirmation_sent_at", { mode: "date" }),

    orderNumber: text("order_number").unique(),
  },
  (t) => [
    index("payment_attempts_user_course_idx").on(t.userId, t.courseSlug),
    // Voor de opruimronde uit docs/openstaand.md §6 (hangende pendings naslaan).
    index("payment_attempts_status_idx").on(t.status, t.createdAt),
  ]
);

/** Eén recht per gebruiker per cursus — het enige dat heeftToegangTot() leest. */
export const entitlements = pgTable(
  "entitlements",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    /** actief | ingetrokken */
    status: text("status").notNull().default("actief"),
    /** De betaalpoging (= order) die dit recht als laatste verleende. */
    attemptId: text("attempt_id")
      .notNull()
      .references(() => paymentAttempts.id),
    grantedAt: timestamp("granted_at", { mode: "date" }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { mode: "date" }),
    /** Bijv. "refund" of "misbruik" — voor het audittrail van /beheer. */
    revokedReason: text("revoked_reason"),
  },
  (t) => [
    uniqueIndex("entitlements_user_course_idx").on(t.userId, t.courseSlug),
    index("entitlements_user_idx").on(t.userId),
  ]
);

/** Doorlopende ordernummers zonder tellen-dan-proberen: één rij per jaar,
 *  opgehoogd mét RETURNING binnen de paid-transactie. Rolt de transactie
 *  terug, dan rolt de teller mee — geen gaten. */
export const orderCounters = pgTable("order_counters", {
  jaar: integer("jaar").primaryKey(),
  laatste: integer("laatste").notNull().default(0),
});
```

Kanttekening bij de statuslijst: het schema-commentaar op `purchases`
(`schema.ts:114`) noemt `mismatch` nu niet, terwijl de webhook die status wél schrijft.
In het nieuwe schema staat hij er expliciet in.

### 2.2 Toegestane statusovergangen

Elke overgang zit als voorwaarde **in de UPDATE zelf** (`WHERE status = …`), niet in een
losse select vooraf — dat is precies het verschil met vandaag. Alles wat niet in deze
tabel staat, is verboden; kolommen `mollie_payment_id`, `amount_cents`, `currency`,
consentvelden en `created_at` zijn na de insert onveranderlijk.

| Van | Naar | Wie | Voorwaarde in de query |
|---|---|---|---|
| — | `pending` | checkout (insert) | plain `insert`, géén upsert |
| `pending` | `paid` | webhook | `WHERE status = 'pending'` |
| `pending` | `failed` / `expired` / `canceled` | webhook | `WHERE status = 'pending'` |
| `pending` | `mismatch` | webhook | `WHERE status = 'pending'` |
| `paid` | `refunded` | toekomstige refund-webhook | `WHERE status = 'paid'`, trekt in dezelfde transactie het entitlement in |

Bewust afwezig: élke overgang die op `paid` uitkomt behalve vanaf `pending`, en élke
overgang wég van `paid` behalve `refunded`. Een `mismatch` blijft `mismatch` tot een
mens ernaar gekeken heeft (beheeractie, buiten dit ontwerp). Scenario 2 en 4 kunnen zo
niet meer bestaan: er ís geen query meer die een `paid`- of bewijsrij overschrijft.

Voor `entitlements`: `— → actief` (paid-transactie), `actief → ingetrokken`
(refund/misbruik, met reden), `ingetrokken → actief` (nieuwe betaalde order). De
verlening is een upsert op de unieke index — een heraankoop na refund reactiveert de
bestaande rij en zet `attemptId` op de nieuwe order.

De **checkout** wordt daarmee:

1. "Heb je hem al?" leest `entitlements` op `actief` (dit is géén tweede
   toegangspoort — het is dedupe van aankopen, net als de huidige select op
   `route.ts:60-71`; de poort voor content blijft `heeftToegangTot()`).
2. `attemptId` genereren en meesturen in de Mollie-`metadata` (naast `userId` en
   `courseSlug` die er al in staan, `route.ts:82`), plus `amountCents`.
3. `payments.create()`, daarna een **plain insert** van de attempt-rij.

Stap 2 dicht scenario 3: faalt de insert, dan draagt de betaling bij Mollie zelf onze
sleutel. De **webhook** krijgt daarvoor een reparatietak: is een `tr_`-id onbekend, kijk
dan in `payment.metadata` (afkomstig uit `payments.get()` met onze eigen API-key — dus
door óns geschreven data, niet iets uit de publieke payload; regel "geloof niets uit het
verzoek behalve het id" blijft intact). Staat daar ons `attemptId`-formaat in, maak de
ontbrekende rij alsnog aan en verwerk de webhook normaal. Staat er niets van ons in:
`200 OK`, zoals nu (`webhook/route.ts:59-60`).

De **paid-verwerking** wordt één transactie:

> **Niet overnemen — zie het statusblok bovenaan.** `db.transaction()` gooit op de
> neon-http-driver van productie, maar slaagt in de PGlite-tests: een fout die groen
> door CI komt en pas live omvalt. De gebouwde versie doet hetzelfde als één
> `db.execute()` met data-modifying CTE's (kandidaat → teller → geclaimd →
> entitlement-upsert). De schets hieronder blijft staan omdat de vier stappen en hun
> volgorde nog steeds kloppen; alleen het omhulsel is anders.

```ts
await db.transaction(async (tx) => {
  // 1. Atomaire claim: alleen de eerste webhook-aanroep komt hierdoor.
  //    (paid_at schuift dus nooit op — vervangt de ne(status,'paid')-truc.)
  const geclaimd = await tx.update(paymentAttempts)
    .set({ status: "paid", paidAt: new Date() })
    .where(and(eq(paymentAttempts.molliePaymentId, id),
               eq(paymentAttempts.status, "pending")))
    .returning();
  if (geclaimd.length === 0) return; // al verwerkt — echte no-op

  // 2. Ordernummer: teller ophogen mét RETURNING, jaar uit paidAt.
  // 3. Entitlement verlenen/reactiveren (upsert op user+course).
});
// 4. Ná de commit: orderbevestiging versturen (zie §2.4).
```

Omdat het ordernummer nu ín de paid-transactie wordt toegekend, heeft elke betaalde
poging een nummer — óók als de mail daarna misgaat. Dat vervangt de hele
`geefOrdernummer()`-constructie inclusief de `Date.now()`-terugval.

### 2.3 De eenvoudiger variant — en waarom die het niet redt

Eerlijk overwogen: houd `purchases` zoals hij is en maak alleen de overgangen
voorwaardelijk — de upsert krijgt een `setWhere` die `paid` (en `mismatch`) beschermt,
en de heraankoop-velden worden bij een retry expliciet gewist. Dat is één kleine PR,
geen migratie, geen nieuwe tabellen.

Wat die variant wél oplost: scenario 2 (paid → pending) en, met extra `set`-velden,
scenario 5 en 6. Wat hij **principieel niet kan** oplossen:

- **Scenario 1 en 3 niet.** Zolang er één rij per gebruiker/cursus is, kan er maar één
  Mollie-id tegelijk vindbaar zijn. Twee gelijktijdige checkouts maken hoe dan ook twee
  betaalbare links waarvan er één wees wordt. De enige uitweg binnen één tabel is de
  checkout blokkeren zolang er een `pending` staat — maar een verlaten betaallink blijft
  minutenlang (methode-afhankelijk) open, en dan zet een dichtgeklikt tabblad de winkel
  voor die klant op slot tot de expiry-webhook langskomt.
- **Scenario 4 half.** Een `mismatch` kun je met `setWhere` beschermen, maar dan kan de
  klant níét meer opnieuw proberen te kopen; bescherm je hem niet, dan wis je bewijs.
  Met één rij is het altijd kiezen tussen historie en doorgang.
- De ordernummer- en mailproblemen uit §7 van de Codex-review raakt hij niet.

Daar komt bij dat de migratielast van de splitsing nu vrijwel nul is: de
productietabel bevat op dit moment **één** rij (de testaankoop, `docs/openstaand.md`
§1). Uitstellen maakt de migratie alleen maar echter. Daarom: **de splitsing.** De
voorwaardelijke-overgangen-discipline nemen we daarbij gewoon mee — die is in het
nieuwe model geen alternatief maar een bouwsteen (§2.2).

> **Update 4 augustus 2026 — scenario 1 is alsnog gedicht (review-bevinding #2).**
> Bovenstaande liet scenario 1 bewust open: het splitsingsmodel maakt bij twee
> gelijktijdige checkouts nog steeds twéé betaalbare links, en de enige uitweg —
> de checkout blokkeren zolang er een `pending` staat — heeft als prijs dat een
> verlaten betaallink de winkel voor die klant op slot zet tot de expiry-webhook
> langskomt. De architectuurreview van augustus 2026 woog dat opnieuw en koos
> vóór de blokkade: een tweede betaalbare link betekent dat de klant twee keer
> kan afrekenen, en er is (nog) geen terugbetaalroute (review #1) om dat te
> herstellen — dubbel afschrijven weegt zwaarder dan even wachten op de expiry.
> Concreet: een **partiële unieke index** `payment_attempts (user_id,
> course_slug) WHERE status = 'pending'` (migratie `0005`) staat hooguit één
> lopende betaling per cursus toe, en de checkout dedupet daar bovenop nog vóór
> Mollie (`checkout/route.ts`). Zie invariant **I7** en de test in
> `test/checkout.route.test.ts` + het herschreven scenario 1/2 in
> `test/betaalmodel.test.ts`.
>
> Wat híermee nog niet dicht is: een uiterst smalle race waarin de paid-webhook
> voor de eerste betaling precies tussen de twee dedupe-selects van een tweede
> checkout commit — dan ziet die tweede checkout géén actief recht én geen
> pending, en kan alsnog een tweede link ontstaan. Dat restje hoort bij review
> #1 (terugbetaling): pas met een refund-route is "geld binnen voor een al
> bezeten cursus" netjes te herstellen. Een fijnere UX-variant (de bestaande
> betaallink hervatten in plaats van 409) staat als vervolg in
> `docs/openstaand.md`.

### 2.4 Ordermail: claim in plaats van lezen-dan-doen

Vandaag is de dubbelmail-bescherming lezen-dan-doen (`orderbevestiging.ts:49-50` leest,
`:89-92` markeert pas ná verzending): twee gelijktijdige webhooks kunnen allebei mailen.
Nieuw: een atomaire claim op de attempt-rij —

```sql
UPDATE payment_attempts SET confirmation_claimed_at = now()
WHERE id = $1 AND confirmation_claimed_at IS NULL
```

— alleen wie de claim wint verstuurt, en zet daarna `confirmationSentAt`. Crasht de
winnaar tussen claim en verzending, dan is dat zichtbaar als `geclaimd zonder verstuurd`:
precies wat de herkansings-/monitoringronde uit `docs/openstaand.md` §2 en §6 moet
naslaan (claim ouder dan X minuten zonder `sentAt` → opnieuw aanbieden). Dit ontwerp
lost dat openstaande punt dus niet óp, maar maakt het voor het eerst detecteerbaar —
vandaag is "twee keer verstuurd" én "nooit verstuurd" allebei onzichtbaar.

`verstuurMail()` blijft een functie die nooit gooit, en de webhook blijft mailen ná de
toegangsverlening (buiten de transactie — een trage mailserver mag de paid-commit niet
ophouden).

---

## 3. Migratie: expand → migrate → contract

> **Stand na de uitvoering:** stap 1 (expand) en stap 2 (migrate) zijn op 3 augustus
> 2026 gedaan — `drizzle/0004_betaalmodel.sql` is op productie gedraaid en PR #22 heeft
> alle zes de lezers en schrijvers hieronder omgezet. **Stap 3 (contract,
> `DROP TABLE purchases`) staat nog open.** De rest van dit hoofdstuk leest daarom als
> het draaiboek dat gevolgd is, niet als werk dat nog moet beginnen.

Uitgangspunt (`docs/openstaand.md` §6b): **eerst op een Neon Preview-branch, nooit
rechtstreeks vanaf de laptop op productie.** Migraties draaien hier handmatig met
`npx drizzle-kit migrate`; de stappen hieronder houden daar rekening mee. De
productietabel bevat vandaag één rij: de testaankoop
`waardebeleggen | paid | tr_hTh3aaeBX99fmiT2SjpUJ` (`docs/openstaand.md` §1). Dat maakt
dit het goedkoopste moment dat deze migratie ooit zal hebben.

**Stap 1 — expand (migratie `0004_betaalmodel.sql`).** Nieuwe tabellen aanmaken,
`purchases` onaangeroerd laten, en de bestaande rijen kopiëren in hetzelfde
migratiebestand (dan gebeurt het in elke omgeving — preview, productie, PGlite in de
tests — automatisch en identiek):

```sql
CREATE TABLE payment_attempts ( … );
CREATE TABLE entitlements ( … );
CREATE TABLE order_counters ( … );

-- Elke purchases-rij wordt één betaalpoging; het id blijft gelijk,
-- zodat oud en nieuw naast elkaar te controleren zijn.
INSERT INTO payment_attempts (id, user_id, course_slug, mollie_payment_id, status,
  amount_cents, currency, withdrawal_waived_at, consent_ip, consent_terms_version,
  created_at, paid_at, confirmation_sent_at, order_number)
SELECT id, user_id, course_slug, mollie_payment_id, status, amount_cents, currency,
  withdrawal_waived_at, consent_ip, consent_terms_version, created_at, paid_at,
  confirmation_sent_at, order_number
FROM purchases;

-- Elke betaalde aankoop wordt een actief recht.
INSERT INTO entitlements (id, user_id, course_slug, status, attempt_id, granted_at)
SELECT gen_random_uuid(), user_id, course_slug, 'actief', id,
  coalesce(paid_at, created_at)
FROM purchases WHERE status = 'paid';

-- Teller aansluiten op al uitgedeelde nummers, per jaar.
INSERT INTO order_counters (jaar, laatste)
SELECT extract(year from created_at)::int, count(*)::int
FROM purchases WHERE order_number IS NOT NULL
GROUP BY 1;
```

**Stap 2 — migrate (de omschakel-PR).** Eén PR die alle lezers en schrijvers omzet;
dat zijn er precies zes (geverifieerd met grep op `purchases` in `src/`):

| Bestand | Wat verandert |
|---|---|
| `src/app/api/checkout/route.ts` | dedupe leest `entitlements`; plain insert in `payment_attempts`; `attemptId` + `amountCents` mee in de Mollie-metadata |
| `src/app/api/mollie/webhook/route.ts` | leest/schrijft `payment_attempts` met de voorwaardelijke overgangen uit §2.2; paid-transactie verleent entitlement en ordernummer; reparatietak voor onbekende id's met onze metadata |
| `src/lib/entitlements.ts` | `heeftToegangTot()` en `gekochteCursussen()` lezen `entitlements` op `actief` — zelfde handtekening, zelfde aanroepers |
| `src/lib/orderbevestiging.ts` | leest de attempt-rij; ordernummer komt al uit de paid-transactie; claim uit §2.4; `geefOrdernummer()` vervalt |
| `src/app/cursussen/[slug]/gekocht/page.tsx` | toont de status van de **nieuwste** poging voor user+cursus (`order by created_at desc`) in plaats van dé rij (regels 36-41) |
| `src/app/beheer/page.tsx` | toont entitlements en álle pogingen — dat is juist de winst: historie wordt zichtbaar |

Ook mee in deze PR: het schema-commentaar "de enige bron van waarheid voor toegang"
(`schema.ts:93-98`) verhuist naar `entitlements`, en het type-export `Purchase`
(`schema.ts:256`) krijgt een opvolger.

Volgorde van uitrol: migratie draaien op een **Neon Preview-branch** (de
Vercel/Neon-integratie maakt per preview-deployment een kopie van productie), daar de
tellingen controleren (`count(purchases) = count(payment_attempts)`; aantal
`paid`-rijen = aantal entitlements) én een volledige testaankoop doorlopen met de
test-key. Daarna, direct achter elkaar: migratie op productie draaien en de
omschakel-PR mergen. Tussen die twee momenten schrijft oude code nog naar `purchases`
en loopt de kopie achter — bij het huidige verkeer (test-key, geen echte verkoop) is
dat venster leeg, maar houd het uit voorzichtigheid kort en controleer de tellingen
ná de deploy opnieuw.

**Rollback.** Vóór de omschakel-PR: triviaal — oude code leest `purchases`, dat
onaangeroerd is; nieuwe tabellen staan er dan hooguit ongebruikt bij. Ná de
omschakel-PR: deploy terugdraaien én de sindsdien nieuwe rijen terugkopiëren; omdat
`payment_attempts` meerdere rijen per user+cursus kan hebben en `purchases` één,
kopieert het terugrol-script per user+cursus alleen de nieuwste rij (schrijf dat script
bij de omschakel-PR alvast uit en leg het naast de migratie vast). Dit is de reden om
het omschakelvenster klein te houden.

**Stap 3 — contract (aparte, latere PR).** Pas als `/beheer` aantoonbaar hetzelfde
laat zien als voorheen, grep op `purchases` in `src/` leeg is en er minstens één
volledige testaankoop op productie (test-key) doorheen is: `DROP TABLE purchases` in
een eigen migratie. Geen haast; een stilstaande tabel kost niets.

**De testaankoop.** De migratie kopieert hem gewoon mee (attempt `paid` + entitlement
op Jasons account) — een migratie hoort geen data te laten verdwijnen. Het opruimen
ervan blijft de aparte, bewuste actie uit `docs/openstaand.md` §1; na de omschakeling
betekent dat: de entitlement-rij en de attempt-rij verwijderen (of markeren), niet meer
de `purchases`-rij.

Dit is sinds de migratie ook echt gebeurd, dus **één `delete` is niet meer genoeg**.
Die ene testrij bestaat nu drie keer: als `purchases`-rij (dood gewicht), als
`payment_attempts`-rij en als `entitlements`-rij, plus een tellerstand in
`order_counters`. Wie alleen `purchases` opruimt verandert niets aan de toegang; wie
met `payment_attempts` begint botst op de foreign key
`entitlements_attempt_id_payment_attempts_id_fk`. De volgorde is dus: **eerst het
entitlement, dan de betaalpoging**, en de `purchases`-rij zolang die tabel er nog
staat. Denk daarbij aan de bredere waarschuwing: zodra er echte kopers zijn, is een
blinde `delete` op `entitlements` het intrekken van iemands toegang.

---

## 4. Invarianten — dit moet een test kunnen bewijzen

- **I1 — Elke Mollie-id blijft reconcilieerbaar.** Voor elke `payments.create()` die
  slaagt bestaat er (direct, of na de webhook-reparatietak via onze metadata) precies
  één `payment_attempts`-rij met dat id. Rijen worden nooit verwijderd en
  `mollie_payment_id` wordt nooit herschreven.
- **I2 — Maximaal één actief recht per gebruiker per cursus.** Afgedwongen door
  `entitlements_user_course_idx` plus de upsert; een heraankoop reactiveert, maakt
  nooit een tweede rij.
- **I3 — Betaald geld eindigt nooit zonder zichtbare order.** Elke rij die `paid`
  bereikt heeft in dezelfde transactie een ordernummer gekregen en is in `/beheer`
  zichtbaar; een paid-webhook voor een link die wij hebben uitgegeven kan nooit in de
  onbekend-id-tak eindigen (I1).
- **I4 — Elke nieuwe verkoop krijgt een nieuw ordernummer en een eigen bevestiging.**
  `orderNumber`, `confirmationClaimedAt` en `confirmationSentAt` leven op de poging en
  worden nooit van een eerdere poging geërfd; ordernummers zijn doorlopend per jaar en
  bestaan uitsluitend als ze in de database staan.
- **I5 — `paid` is een eenrichtingsstraat.** Vanaf `paid` bestaat alleen de overgang
  naar `refunded`; geen enkele query kan een `paid`-rij op `pending` of iets anders
  zetten. `paidAt` verandert na de eerste keer nooit meer.
- **I6 — De webhookcontrole op bedrag én valuta blijft exact zoals hij is**
  (`webhook/route.ts:62-79`), inclusief de `mismatch`-status bij afwijking.
- **I7 — Hooguit één lopende betaling per gebruiker per cursus.** Afgedwongen door
  de partiële unieke index `payment_attempts_pending_uniek` (`user_id, course_slug`
  `WHERE status = 'pending'`, migratie `0005`); de checkout dedupet daarnaast al
  vóór `payments.create` (`checkout/route.ts`). Twee gelijktijdige checkouts
  leveren dus nooit twee betaalbare links op — precies één wint, de ander krijgt
  409. Append-only blijft intact: mislukte/verlopen/betaalde pogingen mogen naast
  elkaar blijven staan, want de index geldt alleen voor `pending`. Toegevoegd na
  review-bevinding #2 (augustus 2026); zie de update onder §2.3.

---

## 5. Testplan

Fundament: het bestaande PGlite-patroon (`test/helpers/pglite-db.ts` —
`vi.mock("@/db", () => import("./helpers/pglite-db"))` draait de échte migraties uit
`drizzle/`, dus ook `0004` inclusief de datakopie; `test/checkout.route.test.ts` en
`test/mollie-webhook.test.ts` laten zien hoe route-handlers met een gemockte
Mollie-client tegen die database draaien). De races interleaven we gecontroleerd met
uitgestelde promises op de mocks: laat `payments.create` hangen tot de test het sein
geeft, en schuif de webhook er precies tussen.

Eén beperking eerlijk benoemd: PGlite is één verbinding, dus échte gelijktijdigheid op
rijvergrendeling test hij niet. Dat is hier geen bezwaar — álle zes scenario's uit §1
zijn interleaving tussen `await`-punten in JavaScript, en dát interleaven kan de test
exact sturen. De voorwaardelijke UPDATEs en unieke indexen voert PGlite bovendien echt
uit. Wie het zwaardere bewijs wil: dezelfde tests draaien ongewijzigd tegen een Neon
Preview-branch (`DATABASE_URL` omzetten), dat is een optionele integratiestap, geen
CI-vereiste.

De vijf verplichte concurrency-tests, elk gekoppeld aan invarianten:

1. **Twee gelijktijdige checkouts** (scenario 1): beide `payments.create`-aanroepen
   tegelijk laten afronden → precies één attempt-rij overleeft, de andere insert
   botst op de partiële unieke index en krijgt 409 (I7); daarna een paid-webhook
   voor de overlevende id → entitlement `actief` (I2, I3). Er is geen tweede
   betaalbare link meer.
2. **Tweede checkout terwijl er al een pending staat** (scenario 2): met een
   bestaande `pending`-rij wordt de tweede checkout vóór `payments.create`
   geweigerd (409, I7); de lopende betaling en het latere recht blijven intact
   (I5). De oude paid→pending-terugdraaival kan in het splitsingsmodel al niet
   meer, en de front-doorcontrole sluit ook het ontstaan van een tweede link.
3. **Dubbele webhook** (en §2.4): twee paid-webhooks voor dezelfde id tegelijk →
   precies één claim wint, één ordernummer, één mail, `paidAt` stabiel (I4, I5).
4. **Databasefout ná `payments.create()`** (scenario 3): de insert één keer laten
   gooien → daarna een webhook voor die id met onze metadata → reparatietak maakt de
   rij aan en verwerkt normaal (I1, I3); een webhook voor een vreemd id zonder onze
   metadata blijft `200` zonder rij.
5. **Refund gevolgd door heraankoop** (scenario 5): attempt A `paid → refunded`,
   entitlement `ingetrokken`; nieuwe checkout → nieuwe attempt-rij; paid-webhook →
   nieuw ordernummer ≠ oud, nieuwe bevestiging verstuurd, entitlement gereactiveerd
   met `attemptId` van de nieuwe order (I2, I4). Rij A blijft onaangeroerd staan (I1).

Daarnaast, klein maar verplicht: een migratietest die op PGlite vóór en ná `0004` de
tellingen uit §3 controleert, en een test dat de ordernummerreeks over een jaargrens
(`paidAt` 31 dec → 1 jan) per jaar opnieuw op 0001 begint zonder gat in het oude jaar.

De bestaande tests (`test/entitlements.test.ts`, `test/orderbevestiging.test.ts`,
`test/veilig-pad.test.ts`) verhuizen mee naar de nieuwe tabellen; hun beweringen —
prijs uit de catalogus, bedragcontrole, één mail per order — blijven inhoudelijk
identiek. Als die tests ná de omschakeling groen zijn zónder dat hun beweringen zijn
afgezwakt, is dat het bewijs dat het gedrag voor de klant gelijk bleef.

---

## 6. Wat er níét verandert

- **`heeftToegangTot()` blijft de enige toegangspoort.** Zelfde bestand, zelfde
  handtekening, zelfde aanroepers; alleen de tabel eronder wordt `entitlements`. Er
  komt géén tweede controle bij — de dedupe-select in de checkout is een
  aankoopcontrole, geen contentpoort, precies zoals vandaag.
- **De webhook gelooft niets uit de payload behalve het id** en haalt de status zelf
  op (`webhook/route.ts:49-50`). De reparatietak leest metadata uit dat éígen
  `payments.get()`-antwoord — data die wij er zelf in hebben gezet — niet uit het
  publieke verzoek.
- **De prijs komt uit onze eigen catalogus**, via `prijsInCenten()` — nooit uit het
  verzoek (`checkout/route.ts:51`).
- **De bedrag-én-valutacontrole in de webhook blijft exact zoals hij is** (I6).
- **De 200-discipline blijft**: onbekende id's zonder onze metadata krijgen `200`
  (geen herhaalstorm, geen informatielek, `webhook/route.ts:119-125`), echte storingen
  krijgen `500` zodat Mollie wél herhaalt (`webhook/route.ts:127-131`). En de
  orderbevestiging kan de webhook nog steeds niet laten falen: `verstuurMail()` gooit
  nooit en draait buiten de paid-transactie.
