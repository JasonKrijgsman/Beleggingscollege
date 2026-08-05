# LearnDash broncode: de commerce- en toegangs-add-ons

> Deze notitie analyseert de **échte plugincode van zeven officiële LearnDash-add-ons**, uitgepakt uit Jasons eigen licentiearchief (licentie geldig t/m juni 2027). Het zijn de **actuele 2026-releases**, geen archiefmateriaal — anders dan hoofdstuk `09`–`11`, die op LearnDash core v4.6.0 (mei 2023) zitten. Geschreven 5 aug 2026. Bestandspaden zijn relatief aan de map van de betreffende add-on. Codefragmenten zijn kort en dienen als bewijs — propriëtaire code, dus we analyseren en herpubliceren niet.
>
> Onderzochte versies:
>
> | Add-on | Map | Versie |
> |---|---|---|
> | WooCommerce Integration | `learndash-woocommerce/` | **2.0.2** |
> | MemberPress Integration | `learndash-memberpress/` | 2.2.2 |
> | Paid Memberships Pro | `learndash-paidmemberships/` | 1.3.6 |
> | Restrict Content Pro | `learndash-restrict-content-pro/` | 1.1.2 |
> | ThriveCart Integration | `learndash-thrivecart/` | 1.0.5 |
> | SamCart Integration | `learndash-samcart/` | 1.1.0.1 |
> | Integrity | `learndash-integrity/` | 1.2.3 |
>
> Dit is voor ons het **meest direct vergelijkbare materiaal dat er is**: elk van deze add-ons doet precies wat onze Mollie-webhook doet — een extern betaalsysteem vertellen aan een LMS wie wat mag zien. Hoofdstuk `03` beschrijft dit vanuit de documentatie, hoofdstuk `10` vanuit de core-gateways; dit stuk gaat over de koppelvlakken zelf.

---

## 1. De grant/revoke-matrix — alle zeven naast ons model

Dit is de kern van het hele hoofdstuk. Lees deze tabel eerst.

| | **Verleent bij** | **Trekt in bij** | **Gedeeltelijke terugbetaling** | **Idempotent bij herhaalde hook?** |
|---|---|---|---|---|
| **WooCommerce 2.0.2** | order `completed`, `processing` (instelbaar per status) | order `pending`, `on-hold`, `cancelled`, `refunded`, `failed`, `checkout-draft` (alles wat niet op *Grant* staat) + order verwijderd/prullenbak | **trekt in — alleen voor de terugbetaalde regelitems** | **ja**, via een referentieteller op order-id |
| **MemberPress 2.2.2** | transactie → `complete`; abonnement → `active` | transactie verlaat `complete` (incl. `refunded`); transactie verlopen; abonnement verlopen; transactie/abonnement verwijderd | n.v.t. — MemberPress kent alleen hele transactiestatussen | **ja**, zelfde referentieteller |
| **Paid Memberships Pro 1.3.6** | order `success`; level toegekend; abonnement herstart | order `cancelled`, `error`, `pending`, `refunded`, `review`; order verwijderd; abonnement verlopen; level opgezegd | n.v.t. | **ja**, teller + `user_has_access_to_object()` |
| **Restrict Content Pro 1.1.2** | membership `active` of `free` | membership `expired`, of einddatum `none`, of membership disabled | n.v.t. | **ja**, zelfde referentieteller |
| **ThriveCart 1.0.5** | `order.success`, `order.subscription_payment`, `order.subscription_completed` | `order.refund`; `order.subscription_cancelled` (**uitgesteld** tot `billing_period_end`) | **instelbaar**: `remove` (standaard) of `keep` | nee — geen teller, directe `ld_update_course_access()` |
| **SamCart 1.1.0.1** | elk `type` dat niet in de intreklijst staat | `type` ∈ `Refund`, `Cancel`, `RecurringPaymentFailed` | n.v.t. — geen bedragvergelijking | nee — geen teller |
| **Beleggingscollege (nu)** | Mollie-betaling `paid` met kloppend bedrag + valuta | volledige terugbetaling én chargeback (via `amountRefunded` / `amountChargedBack`) | **behoudt toegang — bewust** | ja, atomair in één statement (CTE) |

Drie dingen springen eruit:

1. **Wij zijn de enige die gedeeltelijke terugbetaling bewust als "toegang blijft" behandelen.** WooCommerce trekt in voor de terugbetaalde regelitems; ThriveCart maakt er een instelling van maar zet de standaard op *intrekken*. Ons besluit is dus de minderheidspositie in dit ecosysteem — verdedigbaar (wij verkopen één cursus per order, een deelrestitutie is bij ons een coulancegebaar), maar het is een keuze en geen vanzelfsprekendheid. Zie §2.3.
2. **Alle vier de "serieuze" add-ons hebben een referentieteller**, wij niet. Dat lost een probleem op dat wij nog niet hebben, maar wel gaan krijgen (§6).
3. **Geen enkele van de zeven controleert bedrag of valuta tegen de eigen catalogus.** Ze vertrouwen erop dat het bronsysteem (WooCommerce, MemberPress, ThriveCart) dat al deed. Bij WooCommerce en de membership-plugins is dat legitiem: die draaien in dezelfde WordPress-installatie en de add-on leest een lokaal `WC_Order`-object, geen HTTP-payload. Bij ThriveCart en SamCart is het een echte HTTP-webhook — daar is het een gat, zie §4.

---

## 2. WooCommerce Integration 2.0.2 — het vlaggenschip

### 2.1 Hoe een product aan een cursus hangt

Twee post-meta-sleutels op het WooCommerce-product: **`_related_course`** en **`_related_group`**, allebei een array van integer-post-id's. Geschreven door `Learndash_WooCommerce::store_related_courses()` (`includes/class-learndash-woocommerce.php:451`) op de `save_post`-actie, achter een nonce (`ld_wc_nonce`) én een capability-check (`current_user_can('manage_woocommerce')`).

Variabele producten dragen de koppeling **per variatie** (`store_variation_related_courses()`, regel 588) en de meta op het ouderproduct wordt dan expliciet gewist — één product kan dus per variatie een andere cursus ontsluiten. Elke leesplek in de plugin doet daarom eerst `$product->get_variation_id()` en valt anders terug op `$product['product_id']`.

> **Vergelijk met ons:** onze koppeling product→cursus is de cursusslug zelf; er is geen tweede catalogus die kan gaan afwijken. LearnDash heeft twee productcatalogi (WooCommerce-producten en LearnDash-cursussen) met een many-to-many-relatie in post-meta ertussen — flexibeler, en precies de plek waar bij hen "klant heeft betaald maar krijgt niets" ontstaat.

### 2.2 Welke orderstatus verleent, welke trekt in

Sinds 2.0.0 is dit **volledig instelbaar per status**, en dat is architectonisch het interessantste van de hele add-on. De hele bedrading zit in twee methodes:

```php
// includes/class-learndash-woocommerce.php:227
foreach ( $granted_statuses as $status => $label ) {
    add_action( 'woocommerce_order_status_' . $status, [ self::class, 'add_course_access' ], 10, 1 );
}
```

De statuslijst komt niet uit een constante maar uit `wc_get_order_statuses()` — élke status die WooCommerce (of een plugin) kent, krijgt een aan/uit-schakelaar in de instellingen (`src/App/Admin/Pages/Sections/Settings_Enrollment_Status.php`, label `Grant` / `Deny`). De standaardwaarden staan in `set_default_setting_option_values()`:

- **Order, standaard *Grant*:** `wc-completed`, `wc-processing`.
- **Order, standaard *Deny*:** al het andere — `wc-pending`, `wc-on-hold`, `wc-cancelled`, `wc-refunded`, `wc-failed`, `wc-checkout-draft`.
- **Abonnement, standaard *Grant*:** `wc-active`, `wc-pending-cancel`, `wc-on-hold`.
- **Abonnement, standaard *Deny*:** `wc-pending`, `wc-cancelled`, `wc-switched`, `wc-expired`.

Let op de asymmetrie die daar in zit: **`on-hold` trekt in bij een order maar verleent bij een abonnement.** Bij een order betekent on-hold "wacht op geld" (bankoverschrijving), bij een abonnement betekent het "betaling hapert, maar de klant is nog klant". Dat is een doordacht onderscheid, geen slordigheid.

En `pending-cancel` op *Grant* is het patroon "opgezegd, loopt tot het einde van de periode" — de klant heeft opgezegd, maar de betaalde termijn loopt door. Dat is precies wat wij voor College+ nodig hebben (§6).

`Deny` is bovendien actief, niet passief: er wordt een `remove`-hook geregistreerd. Een order die van `completed` naar `failed` gaat, trekt de toegang dus daadwerkelijk in — het is geen "verleent niet", het is "verwijdert".

Verder trekt de add-on in bij `woocommerce_before_trash_order` en `woocommerce_before_delete_order` (`delete_order()`, regel 940) en bij het verwijderen van een enkel orderregelitem (`delete_order_item()`, regel 1066).

> **Vergelijk met ons:** wij hebben één statuswaarde die telt (`paid`) en één die intrekt (terugbetaald/chargeback), hardgecodeerd in de webhook. LearnDash maakt er een matrix van waar de winkelier zelf aan draait. Voor ons is dat overkill — maar het idee dat **"welke status verleent" configuratie is en geen `if`** is het overwegen waard zodra er meer dan één betaalpad is (los kopen + abonnement + coupon + handmatig).

### 2.3 Terugbetalingen: waar het echt anders loopt dan bij ons

De `refunded`-status krijgt een **andere hook dan de rest**, en de reden staat er in het commentaar:

```php
// includes/class-learndash-woocommerce.php:241
if ( $status === 'refunded' ) {
    add_action( 'woocommerce_order_refunded', [ self::class, 'remove_course_access_on_refund' ], 10, 2 );
}
```

Het commentaar erboven: *"Partial refund order still has a status of `completed`, hence the need for another action to process course/group access update."* Dat is exact dezelfde ontdekking als de onze bij Mollie — **een terugbetaling verandert de betaalstatus niet**, dus wie alleen naar de status kijkt, ziet hem nooit. WooCommerce lost het op met een aparte hook, Mollie dwong ons naar `amountRefunded` / `amountChargedBack` te kijken. Zelfde valkuil, twee ecosystemen, en beide leveranciers hebben er een aparte constructie voor moeten bouwen. Dat is een sterke aanwijzing dat dit *het* standaard-ontwerpgat is bij betaalintegraties.

Waar het uiteenloopt is wat er dán gebeurt. `remove_course_access_on_refund()` (regel 712) verzamelt de regelitems van álle refund-objecten op de order en splitst dan:

- **Gedeeltelijke terugbetaling** (orderstatus ≠ `refunded`): `remove_course_access( $order_id, null, $products )` met **alleen de terugbetaalde regelitems** → de cursussen die bij die regels horen worden ingetrokken, de rest van de order blijft staan.
- **Volledige terugbetaling** (orderstatus = `refunded`): `remove_course_access( $order_id )` zonder productfilter → alles van die order eraf.

Er is een ontsnappingsluik: de filter `learndash_woocommerce_order_refund_skip` (per refund-object) en de actie `learndash_woocommerce_order_refund_after`. Een winkelier die het onze kant op wil, moet dus zelf code schrijven.

> **Vergelijk met ons:** ons besluit is *"volledige terugbetaling en chargeback trekken in, een gedeeltelijke terugbetaling laat de cursus bewust staan."* WooCommerce doet het omgekeerde: gedeeltelijk terugbetalen betekent bij hen "die regel is teruggedraaid, dus die toegang ook". Beide zijn intern consistent, maar let op het verschil in wat een order ís: bij hen kan één order vijf cursussen bevatten, dus "regel terugdraaien" is betekenisvol. Bij ons is één betaling altijd precies één cursus, dus een deelrestitutie kán geen productregel zijn — het is per definitie een korting achteraf. **Onze regel is daarmee niet afwijkend maar passend bij ons ordermodel**, en dat is het argument dat in `docs/ontwerp-betaalmodel.md` hoort te staan als iemand er ooit over valt.
>
> Wat we wél moeten overnemen: zodra wij ooit een bundel of een tweede cursus in één betaling verkopen, verandert de vraag "wat doet een deelrestitutie" van triviaal in echt — en dan is de WooCommerce-regel de juiste.

ThriveCart maakt van precies deze vraag een instelling (§4.1) — het feit dat LearnDash dat nodig had, bevestigt dat het een echte productbeslissing is en geen implementatiedetail.

### 2.4 Idempotentie: de referentieteller

Dit is het slimste stuk van de add-on, en het lost een probleem op dat wij nog niet hebben opgelost.

Toegang wordt niet geteld als "wel/niet ingeschreven" maar als een **lijst van order-id's per cursus**, opgeslagen in usermeta `_learndash_woocommerce_enrolled_courses_access_counter`:

```php
// includes/class-learndash-woocommerce.php:1988 (increment_course_access_counter)
if ( ! isset( $courses[ $course_id ] )
     || array_search( $order_id, $courses[ $course_id ] ) === false ) {
    $courses[ $course_id ][] = $order_id;
}
```

En de intrekkant (`update_remove_course_access()`, regel 1897):

```php
$courses = self::decrement_course_access_counter( $course_id, $user_id, $order_id );

if ( ! isset( $courses[ $course_id ] ) || empty( $courses[ $course_id ] ) ) {
    ld_update_course_access( $user_id, $course_id, $remove = true );
}
```

Wat dit oplevert:

- **Herhaalde hooks zijn onschadelijk.** Hetzelfde order-id twee keer verwerken voegt niets toe. Daarbovenop staat nog `is_user_enrolled_to_course()` als tweede zeef vóór `ld_update_course_access()`.
- **Toegang uit meerdere bronnen wordt correct afgebouwd.** Heeft iemand cursus X via order 100 én via abonnement 250, dan haalt het terugbetalen van order 100 de toegang **niet** weg — pas als de laatste bron verdwijnt. Dat is een echte referentietelling en het is precies het scenario dat bij ons stil fout zou gaan.
- `reset_course_access_counter()` (regel 2049) gooit de hele lijst leeg bij een verlopen-en-heringeschreven cursus; er staat een eerlijke `@todo` bij ("only remove access counter from old WC orders").

De zwakte: het is een **read-modify-write op één geserialiseerd usermeta-veld, zonder lock of transactie**. Twee gelijktijdige webhooks (order voltooid + abonnement geactiveerd) kunnen elkaars schrijfactie overschrijven. WordPress biedt hier geen transactiegrens, dus dit is geen slordigheid van de add-on maar een grens van het platform.

> **Vergelijk met ons:** onze `entitlements` is *één rij per gebruiker per cursus* met een status. Dat is idempotent bij herhaling (ON CONFLICT / status blijft `actief`) en atomair — beter dan hun usermeta-blob. Maar het **weet niet waaróm** iemand toegang heeft. Zodra College+ bestaat, kan dezelfde cursus uit twee bronnen komen (los gekocht + in het abonnement), en dan trekt het opzeggen van het abonnement een cursus in die de klant apart betaald heeft. Dat is een echte, stille bug-in-wording. LearnDash's referentieteller is het antwoord, en bij ons is het goedkoper te bouwen dan bij hen: een `bron`-kolom (`order:<id>` / `abonnement:<id>`) plus intrekken-als-laatste-bron-verdwijnt, met de atomariteit die Postgres al geeft. Zie §6.

### 2.5 Abonnementen (WooCommerce Subscriptions)

`add_subscription_course_access()` / `remove_subscription_course_access()` (regels 1234 en 1182) volgen hetzelfde patroon, met vier eigenaardigheden:

- **Bij intrekken wordt niet alleen het abonnement-id maar élke gerelateerde order afgeteld** (`$subscription->get_related_orders()`). Dat is een bewuste opruiming: de verlengingsorders die elk hun eigen id in de teller zetten, moeten er allemaal uit — anders houdt de teller de toegang eeuwig overeind.
- **De inschrijfdatum wordt teruggezet naar de aanmaakdatum van het abonnement** (`course_{id}_access_from` = `date_created`), zodat drip-feeding niet bij elke verlenging opnieuw begint. Zonder dat zou een maandabonnee elke maand weer bij les 1 staan. Filterbaar via `learndash_woocommerce_reset_subscription_course_access_from`.
- **`expired` kan afgezet worden** met de optie `learndash_woocommerce_disable_access_removal_on_expiration` — dan blijft toegang staan na afloop. Dat is het "je houdt wat je gehad hebt"-model als bewuste keuze.
- **Einde van het factureringsschema** (bijv. "12 × betalen, dan klaar") wordt apart afgevangen: `remove_course_access_on_billing_cycle_completion()` (regel 1444) kijkt of `calculate_date('next_payment')` nul is. Standaardgedrag daarvan is instelbaar; de bedoeling is "termijnbetaling → toegang blijft" versus "abonnement → toegang eindigt".

`switch_subscription()` (regel 1464) verwerkt up-/downgrades: eerst de oude regelitems intrekken, dan de nieuwe verlenen — precies de volgorde die je wilt, en dankzij de teller loopt een cursus die in beide zit geen moment op nul.

### 2.6 Vier randen die je bij ons ook tegenkomt

**Gastafrekenen is onmogelijk gemaakt, niet gewaarschuwd.** Inschrijven vereist een `WP_User`; dus filtert de add-on `woocommerce_checkout_registration_enabled`/`_required` naar `true` en zet in `force_registration_during_checkout()` (regel 1663) letterlijk `$_POST['createaccount'] = 1` zodra de winkelwagen een cursus bevat. Daarnaast toont het beheer een waarschuwing als gastafrekenen aanstaat (`src/admin-views/notices/warnings/guest-checkout-enabled.php`). *Vergelijk met ons:* wij lossen dit op met Google-login vóór de checkout — dezelfde conclusie ("identiteit moet er zijn vóór het geld"), netter geïmplementeerd.

**Orders worden automatisch op `completed` gezet.** `auto_complete_transaction()` (regel 1681, gehaakt op `woocommerce_payment_complete` én `woocommerce_thankyou`) zet de order op `completed` zodra álle regels een cursus/groep zijn of virtueel/downloadbaar — behalve bij handmatige betaalmethodes (`bacs`, `cheque`, `cod`). Digitale producten hebben geen verzendstap, dus `processing` is betekenisloos. Merk op dat toegang standaard al bij `processing` wordt verleend, dus dit is opruiming, geen voorwaarde.

**Grote inschrijvingen gaan naar een wachtrij.** Bevat een order **5 of meer** cursussen/groepen (`get_products_count_for_silent_course_enrollment()`, filterbaar), dan wordt er niets direct ingeschreven maar een regel gezet in de optie `learndash_woocommerce_silent_course_enrollment_queue`, afgehandeld door een **WP-cron die per minuut draait** (`includes/class-cron.php`) en per keer standaard **één** wachtrij-item verwerkt. Een klant die een bundel van tien cursussen koopt, kan dus na betalen even niets hebben. Dat is een bewuste ruil (een `ld_update_course_access()` per cursus is duur) maar het betekent dat **"betaald" en "toegang" niet meer in dezelfde request zitten** — en WP-cron draait alleen bij bezoek, dus op een stille site kan het lang duren. MemberPress en PMPro hebben exact dezelfde drempel van 5 met een eigen wachtrij.

**Retroactief toegang verlenen is een expliciete tool.** `src/App/Modules/Retroactive_Access_Tool/Handler.php` loopt in batches van 100 door bestaande orders en abonnementen en past dezelfde grant/deny-matrix toe — inclusief een aparte controle op gedeeltelijke terugbetalingen, omdat zo'n order gewoon `completed` blijft en dus niet in de deny-lijst valt. *Vergelijk met ons:* wij hebben zoiets niet, en zullen het nodig hebben op het moment dat we de grant/revoke-regels ooit wijzigen. De les is dat de regels **herbruikbaar** moeten zijn buiten de webhook om — bij ons betekent dat: geen beslislogica in de route-handler, maar in een functie die ook een backfill kan aanroepen.

---

## 3. De membership-add-ons: het referentieontwerp voor College+

Drie plugins, drie leveranciers, en toch bijna letterlijk hetzelfde patroon. Dat maakt het overtuigend: dit is de vorm die dit probleem heeft.

### 3.1 Het gedeelde patroon

1. **Mapping level → cursussen/groepen** wordt op het lidmaatschapsniveau opgeslagen, niet op de cursus.
2. **Statusovergang van de transactie of het abonnement** is de enige trigger. Nergens wordt periodiek gecontroleerd of iemand nog mag.
3. **Referentieteller in usermeta**, met per plugin een eigen sleutel: `_learndash_memberpress_enrolled_courses_access_counter`, `_learndash_pmp_enrolled_objects_access_counter`, `_learndash_rcp_enrolled_courses_access_counter`. Alle drie precies de constructie uit §2.4.
4. **Uiteindelijk altijd** `ld_update_course_access()` / `ld_update_group_access()` — dezelfde functie als handmatige inschrijving en als de core-gateways. Er is geen tweede toegangsmechanisme.
5. **Drempel van 5** cursussen → wachtrij + cron, en dezelfde inschrijfdatum-reset om drip te laten werken.

### 3.2 MemberPress (`includes/class-integration.php`)

Twee sporen naast elkaar. Transacties:

```php
// mepr-txn-transition-status
if ( ( $txn->txn_type == 'sub_account' || $old_status != 'complete' ) && $new_status == 'complete' ) { … add_access … }
elseif ( $old_status == 'complete' && $new_status != 'complete' )                                    { … remove_access … }
```

Alles wat `complete` verlaat trekt in — inclusief `refunded`, want dat is gewoon een van de MemberPress-transactiestatussen. Daarnaast `mepr-transaction-expired` (met een her-controle `$user->active_product_subscriptions()` om te voorkomen dat een verlopen losse transactie een nog actief abonnement sloopt) en `mepr_pre_delete_transaction`.

Abonnementen (`subscription_transition_status`, regel 349) hebben één regel die eruit springt:

```php
} elseif ( $new_status != 'active' ) {
    if ( ! $subscription->is_expired() ) {
        return;   // opgezegd maar nog niet verlopen → toegang blijft
    }
```

**Opzeggen trekt niet in; verlopen wel.** Dat is het WooCommerce-`pending-cancel`-idee, hier geïmplementeerd als expliciete check in plaats van als statusconfiguratie.

Er zit ook een guard tegen te vroeg inschrijven: staat een abonnement op `active` terwijl de eerste transactie nog niet `complete` is (offline betaling, geen proefperiode), dan wordt er níét ingeschreven. Dat is precies de "geloof de status van het bronsysteem niet blind"-reflex die wij bij Mollie hanteren.

Eén constructie is opvallend fragiel: **corporate accounts worden opgeruimd via `add_action('delete_user_meta', …)`**, met de eerlijke toelichting *"Hooked to delete_user_meta since there's no available hook in the plugin"*. Toegang intrekken hangt daar dus aan het toevallig verdwijnen van een metasleutel.

### 3.3 Paid Memberships Pro (`learndash-paidmemberships.php`)

Architectonisch de afwijkende van de drie, en op twee punten leerzaam.

**Ten eerste: de add-on zet PMPro's eigen contentslot bewust uit voor LearnDash-inhoud.**

```php
add_filter( 'pmpro_has_membership_access_filter', [ 'Learndash_Paidmemberships', 'has_object_access' ], 99, 4 );
// → geeft voor 'sfwd-courses' en 'groups' onvoorwaardelijk true terug
```

Twee sloten op één deur is erger dan één, want ze lopen uit elkaar. PMPro regelt de verkoop, LearnDash regelt de toegang, en de add-on haalt PMPro's slot er expliciet af. **Dat is exact ons principe** — `heeftToegangTot()` is de enige poort, voeg er geen tweede naast toe.

**Ten tweede: waar er wél een extra voorwaarde nodig is, wordt de bestaande poort uitgebreid, niet omzeild.** De e-mailbevestigingscheck hangt op de core-filter zelf:

```php
add_filter( 'sfwd_lms_has_access', [ __CLASS__, 'check_user_access' ], 10, 3 );
```

`check_user_access()` (regel 714) geeft `false` terug als het niveau e-mailbevestiging vereist en de gebruiker die niet heeft gedaan — het herleidt daarbij eerst een les/topic/quiz naar zijn cursus. Dat is het goede patroon: één poort, uitbreidbaar van buitenaf.

De statuslijst zit in een klassieke `switch` op de PMPro-orderstatus (`update_object_access_on_order_update()`, regel 793): `success` verleent; `cancelled`, `error`, `pending`, `refunded`, `review` trekken in. Merk op dat **`pending` en `review` intrekken** — een order die in handmatige beoordeling gaat, verliest direct toegang. Streng, maar consistent.

Wat we níét moeten kopiëren: de mapping staat in één **site-brede WordPress-optie** `_level_course_option` (cursus-id → komma-gescheiden lijst van level-id's), naast rijen in PMPro's eigen `pmpro_memberships_pages`-tabel. Eén geserialiseerd blob voor alle koppelingen van de hele site, gelezen en geschreven bij elke wijziging — dezelfde soort hotspot als het `_sfwd-course_progress`-blob uit hoofdstuk `10`.

### 3.4 Restrict Content Pro (`includes/class-integration.php`)

De kortste van de drie, en die heeft de scherpste regel:

```php
// rcp_transition_membership_status, regel 243
if ( 'active' === $new_status || 'free' === $new_status ) {
    self::add_access_to_user( $user_id, $membership_id );
} else {
    if ( 'expired' === $new_status || 'none' === $membership->calculate_expiration() ) {
        self::remove_access_from_user( $user_id, $membership_id );
    }
}
```

Alles wat niet `active`/`free` is, trekt **alleen** in als het echt verlopen is of als er geen einddatum meer te berekenen valt. Een opzegging met een einddatum in de toekomst laat de toegang dus staan tot die datum — hetzelfde grace-model, weer anders geschreven. `rcp_membership_post_disable` trekt wél onvoorwaardelijk in.

RCP is ook de enige met een uitgewerkt **groepsaccount**-spoor (`rcpga_*`-hooks): een werkgever koopt één membership en de leden erven de toegang, inclusief opruimen bij het verwijderen van de groep. Relevant als B2B ooit speelt (hoofdstuk `03` §4).

> **Vergelijk met ons — dit is het hele ontwerp voor College+ in vier regels:**
>
> 1. Het abonnement is één rij die **bronnen** van entitlements is, geen kopie van entitlements per cursus. Verandert de inhoud van College+, dan verandert de mapping en niet duizend rijen.
> 2. **Opzeggen ≠ intrekken.** Alle drie de plugins hebben hier een expliciete check; alle drie kozen "toegang loopt tot de betaalde periode voorbij is". Bij ons betekent dat: het entitlement krijgt een `geldigTot`, en het intrekken hangt aan die datum — niet aan het opzegmoment.
> 3. **Statusovergang is de enige trigger**, maar dan moet je élke overgang zien. Alle drie hooken op zowel abonnement- als transactie-/ordergebeurtenissen én op verwijderen. Onze Mollie-abonnementswebhook zal hetzelfde moeten: één gemiste `subscription.cancelled` betekent gratis toegang voor altijd, want er is geen tweede controle.
> 4. **De referentieteller is niet optioneel** zodra dezelfde cursus los te koop is én in het abonnement zit.

---

## 4. ThriveCart en SamCart: het vertrouwensmodel van een externe webhook

Hier is de vergelijking met onze ijzeren regel het meest direct, want dit zijn echte HTTP-endpoints die door een externe partij worden aangeroepen. Onze regel: **de webhook gelooft niets uit de payload behalve het id; we halen de betaling zelf op en controleren bedrag én valuta tegen wat wij hadden vastgelegd.**

### 4.1 ThriveCart 1.0.5

**Endpoint:** `home_url('/?learndash-integration=thrivecart')`, afgehandeld op de `init`-actie (`includes/class-thrivecart-integration.php:76`).

**Authenticatie: een gedeeld geheim woord in de payload.**

```php
// is_transaction_valid(), regel 617
if ( isset( $_post['thrivecart_secret'] ) ) {
    $secret = $_post['thrivecart_secret'];
    $check  = trim( $options['secret_word'] );
    if ( $secret === $check ) { return true; }
}
return false;
```

Kenmerken, feitelijk:

- Het is een **gedeeld wachtwoord, geen handtekening**. De payload wordt niet ondertekend, dus de inhoud is niet cryptografisch gebonden aan het geheim.
- Vergelijking met `===`, niet `hash_equals()` — dus niet in constante tijd.
- Ontbreekt het geheim in de instellingen, dan geeft de functie `null` terug en wordt het verzoek geweigerd met een duidelijke melding (sinds 1.0.5; daarvóór een `wp_die()`). Het is dus **niet** optioneel — anders dan bij SamCart.
- Er wordt **niets teruggehaald bij ThriveCart**. Er is in dit ontwerp ook geen bron om iets bij op te halen: ThriveCart's model is fire-and-forget, er is geen "haal transactie X op"-aanroep in de add-on. Dat is een wezenlijk verschil met Mollie/Stripe en het maakt de id-only-regel daar onuitvoerbaar.

**Wat er uit de payload wordt vertrouwd:** het `event`-veld (bepaalt verlenen of intrekken), `customer.email` (**waarmee een WordPress-gebruiker wordt aangemaakt** als die nog niet bestaat, `maybe_create_user()` regel 418), `purchase_map` (de product-id's die de cursussen bepalen), en bij een terugbetaling `order.total` versus `refund.amount`. Bedrag en valuta worden **nergens** tegen de LearnDash-catalogus gelegd — er ís geen prijs in de LearnDash-kant van deze koppeling.

**Gedeeltelijke terugbetaling is een expliciete instelling** (`includes/admin/class-settings-section.php`), standaard `remove`:

```php
// filter_webhook_process(), regel 49
if ( $behavior === 'keep' && $data['order']['total'] !== $data['refund']['amount'] ) {
    return false;   // webhook afbreken, toegang blijft
}
```

Twee kanttekeningen bij die vergelijking, allebei feitelijk: hij draait **na** `sanitize_text_field()`, dus het is een **stringvergelijking** — `"49.00"` versus `"49.0"` telt als verschillend; en een reeks deelrestituties die samen het hele bedrag beslaan, blijft per stuk "gedeeltelijk". Bij de stand `remove` (standaard) speelt dit niet, want dan wordt er niet vergeleken.

**Opzeggen van een abonnement is uitgesteld intrekken**, en dat is netjes gedaan: `order.subscription_cancelled` leest `subscription.billing_period_end` en plant met `wp_schedule_single_event()` een intrekking op dat moment (`schedule_access_removal()`, regel 381) in plaats van meteen. Hetzelfde grace-model als de membership-plugins, maar dan zonder dat er een abonnementsstatus in WordPress leeft. Kwetsbaar punt: het hangt aan WP-cron, dus de intrekking gebeurt pas bij het eerste bezoek ná dat moment.

**Idempotentie:** geen teller, geen dedupe op transactie-id. Herhaalde `order.success`-webhooks roepen gewoon opnieuw `ld_update_course_access()` aan. Dat is grotendeels onschadelijk (die functie is zelf grofweg idempotent), maar er is geen bescherming tegen een grant die ná een revoke opnieuw binnenkomt.

### 4.2 SamCart 1.1.0.1

De dunste van de zeven, en het duidelijkste contrast met onze regel.

**Endpoint:** `?learndash-integration=samcart`, op `init` (`includes/class-samcart-integration.php:16`).

**Authenticatie: een geheime sleutel in de query string — en die is optioneel.**

```php
$secret_key = learndash_samcart()->get_secret_key();

if ( ! empty( $secret_key )
     && ( ! isset( $_GET['secret_key'] ) || sanitize_text_field( wp_unslash( $_GET['secret_key'] ) ) !== $secret_key ) ) {
    return;
}
```

Feitelijk: is er in de instellingen geen sleutel ingevuld, dan wordt de controle **overgeslagen** en verwerkt het endpoint elk binnenkomend verzoek. Is er wel een sleutel, dan reist die als **URL-parameter** mee — dat is de plek die serverlogs, proxies en referrers standaard bewaren, anders dan een header of body-veld.

**Wat er vertrouwd wordt:** alles. `type` bepaalt verlenen of intrekken, `product.id` bepaalt welke cursussen, `customer.email` bepaalt (en creëert) de gebruiker. Geen bedrag, geen valuta, geen re-fetch, geen transactie-id-dedupe.

En de statuslogica is **fail-open**:

```php
$remove = in_array( $type, array( 'Refund', 'Cancel', 'RecurringPaymentFailed' ) ) ? true : false;
```

Elke `type`-waarde die niet in dat lijstje staat — inclusief een onbekende, een toekomstige, of een lege — betekent **verlenen**. De membership-add-ons doen het omgekeerd (alleen een expliciete `active`/`complete` verleent, de rest niet).

Nog twee feitelijke observaties: `sanitize_array()` roept zichzelf recursief aan voor geneste arrays maar **wijst het resultaat niet terug toe** (`$this->sanitize_array($value);` zonder `$array[$key] =`), dus geneste payloadwaarden komen ongefilterd in de transactie-post-meta terecht — in de ThriveCart-versie van dezelfde functie is die toewijzing er wél. En SamCart ondersteunt alleen cursussen, geen groepen.

### 4.3 De vergelijking, zonder omhaal

| | Authenticatie | Payload-inhoud herverifieerd? | Bedrag/valuta gecontroleerd? | Onbekende status |
|---|---|---|---|---|
| **Onze Mollie-webhook** | geen — alleen het id komt binnen | **ja**, status opgehaald bij Mollie | **ja**, tegen `payment_attempts` | verleent niets |
| LearnDash core / Stripe (h. `10`) | geen — alleen het id | **ja**, `events->retrieve()` | nee | verleent niets |
| ThriveCart 1.0.5 | gedeeld geheim in de body, verplicht | nee (geen bron beschikbaar) | nee | verleent niets |
| SamCart 1.1.0.1 | gedeelde sleutel in de URL, **optioneel** | nee | nee | **verleent** |

> **Vergelijk met ons:** onze regel is niet overdreven — hij is het strengste model in dit veld, en het enige dat *zowel* de afzender *als* het bedrag vastpint. Wat deze twee add-ons laten zien is dat het model alleen kán bij een PSP die een "haal transactie X op"-aanroep aanbiedt. Mollie heeft die; ThriveCart en SamCart niet, en dan blijft er weinig anders over dan een gedeeld geheim. **Dat is een selectiecriterium voor een betaalpartner, geen implementatiedetail** — de dag dat we een tweede verkoopkanaal overwegen (een affiliate-platform, een externe checkout), is "kan ik de transactie server-side terugvragen?" de eerste vraag.
>
> En het tweede punt is gratis over te nemen: **een onbekende status hoort niets te verlenen.** Bij ons is dat al zo, maar het is het soort ding dat sluipenderwijs verdwijnt als iemand een `switch` met een `default:` schrijft.

---

## 5. Integrity 1.2.3 — wat "content protection" in code betekent

De plugin belooft *"Protect your LearnDash site from content theft."* De code bestaat uit vier losse functies, alle vier standaard uit.

### 5.1 Prevent Hotlinking (`includes/class-prevent-hotlinking.php`)

Schrijft een blok in de `.htaccess` van de WordPress-root:

```apache
RewriteCond %{HTTP_REFERER} !^http(s)?://(www\.)?$domain [NC]
RewriteRule \.(jpg|jpeg|png|gif|avi|flv|wmv|mp4|mov|mp3)$ - [NC,F,L]
```

Wat het doet: verzoeken naar media**bestanden** met een `Referer` die niet van het eigen domein komt, krijgen 403. Wat het niet doet: het beschermt **geen lesteksten, geen quizzen, geen PDF's** (die extensie staat niet in de lijst, wel uitbreidbaar via `learndash_integrity_protected_file_extensions`), en het is geen toegangscontrole — een ingelogde bezoeker die de bestands-URL kopieert en direct opent, stuurt geen referer en komt er dus juist wél in. De `Referer`-header komt bovendien van de client. Architectonisch: dit voorkomt dat een andere site jouw bandbreedte opsnoept, niet dat iemand je cursus meeneemt.

Implementatie-observaties: er wordt rechtstreeks met `file_get_contents`/`file_put_contents` op `ABSPATH . '.htaccess'` geschreven (niet via de WordPress-filesystem-API, en zonder foutafhandeling als het bestand niet schrijfbaar is); `remove_htaccess_rule()` leest het bestand zonder `file_exists`-controle; en op nginx doet het geheel niets — er is geen detectie van de webserver.

### 5.2 Prevent Content Copy (`assets/js/prevent-content-copy.js`)

De hele functie is dertien regels jQuery:

```js
$('body').bind('contextmenu cut copy', function (e) { e.preventDefault(); return false; });
```

Plus hetzelfde voor `paste`, met een uitzondering voor wachtwoordvelden. Rechtermuisknop, knippen en kopiëren worden geblokkeerd op de hele pagina.

Architectonisch is dit **UX-frictie, geen bescherming**: het draait in de browser van degene tegen wie het zich richt. Broncode bekijken, devtools, JavaScript uitzetten, lezerweergave, `curl`, printen naar PDF — allemaal onaangeraakt. Het kost bovendien echte bruikbaarheid: een cursist kan geen tickersymbool of formule meer kopiëren, en toetsenbord-sneltoetsen voor toegankelijkheid sneuvelen mee. LearnDash zet het niet voor niets standaard uit.

### 5.3 Prevent Concurrent Login (`includes/class-prevent-concurrent-login.php`)

De enige van de vier die een echt bedrijfsrisico adresseert: **gedeelde accounts**. Bij inloggen wordt een transient `learndash_user_login_{user_id}` gezet met een TTL van één uur, plus een cookie `learndash_login_timestamp`. Bij een volgende login controleert `is_login_quota_available()` of de transient leeg is, of dat de cookie-timestamp gelijk is aan de transient — zo niet, dan `wp_logout()` en terug naar het inlogscherm met `?exceed_max_concurrent_login`.

Wat dat feitelijk is: **één sessie tegelijk, met een venster van een uur.** Er is geen instelbaar aantal ("quota" is in de code altijd 1). De transient verloopt na een uur ongeacht activiteit, dus twee mensen die het account met meer dan een uur ertussen gebruiken merken er niets van; en één persoon die op laptop én telefoon werkt, wordt uitgelogd. Er zijn twee ontsnappingsluiken: rol-uitsluiting (`prevent_concurrent_login_exclude_roles`) en een per-gebruiker vinkje (usermeta `learndash_integrity_bypass_concurrent_login`) op het profielscherm. De cookie wordt gezet zonder `HttpOnly`, `Secure` of `SameSite`.

### 5.4 reCAPTCHA v2/v3 (`includes/class-recaptcha*.php`)

Google reCAPTCHA op het inlog- en registratieformulier, gehaakt op `wp_authenticate_user` en `registration_errors` (plus `learndash_registration_errors` voor LearnDash's eigen registratieflow). v3 met instelbare score-drempel, v2 als checkbox. Dit richt zich op geautomatiseerde account-aanmaak en credential stuffing, niet op contentdiefstal — het zit in dezelfde plugin omdat "integriteit" hier ruim is opgevat.

> **Vergelijk met ons:** dit hele pakket bevestigt iets ongemakkelijks: **tegen het kopiëren van cursusinhoud bestaat geen technische oplossing**, en de marktleider verkoopt er dus vooral frictie voor. De enige functie met echt effect is de sessielimiet, en die richt zich op *accountdelen* — een omzetprobleem, geen contentprobleem.
>
> Voor ons volgt daaruit: (1) rechtermuisknop-blokkades zijn we niet aan het bouwen, ze kosten bruikbaarheid en leveren niets; (2) onze feitelijke bescherming is architectonisch en al gebouwd — betaalde lesinhoud verlaat de server niet zonder entitlement, afgedwongen door `import "server-only"` op `@/content` en de bundelcontrole in CI, wat sterker is dan alles in deze plugin; (3) accountdelen is wél een reëel risico bij €49-cursussen met permanente toegang, en als we daar ooit iets aan doen, is "één actieve sessie" met database-sessies (die we al hebben) goedkoop te bouwen — maar het is een handhavingsbeslissing, geen technische. Reken erop dat het klantcontact oplevert.

---

## 6. Wat we hiervan overnemen voor College+

Vijf dingen, in volgorde van hoeveel ze schelen.

1. **Een bron per entitlement, en intrekken pas als de laatste bron weg is.** Alle vier de serieuze add-ons doen dit; wij hebben het niet. Zodra College+ bestaat, kan iemand cursus X los gekocht hébben én via het abonnement krijgen — en dan trekt het opzeggen die cursus in. Concreet: een kolom `bron` op `entitlements` (`order:<paymentAttemptId>` / `abonnement:<subscriptionId>`), of een tweede tabel `entitlement_bronnen`. Intrekken wordt dan "verwijder deze bron, en zet de status pas op ingetrokken als er geen bron meer over is" — in één statement met een CTE, dus atomair, wat de usermeta-blob van LearnDash niet is. Dit is de belangrijkste van de vijf en hij is stil: zonder deze wijziging is er geen foutmelding, alleen een boze klant.
2. **Opzeggen trekt niet in; verlopen wel.** MemberPress (`! $subscription->is_expired() → return`), RCP (`'expired' === $new_status || 'none' === calculate_expiration()`) en WooCommerce (`pending-cancel` standaard op *Grant*) doen dit alle drie. Bij ons: het abonnements-entitlement krijgt een `geldigTot`, opzeggen zet alleen `verlengtNiet`, en de intrekking hangt aan de datum. Dat is ook consumentenrechtelijk het juiste gedrag — de klant heeft de periode betaald.
3. **De grant/revoke-regels horen niet in de route-handler.** WooCommerce's retroactieve tool draait dezelfde matrix over historische orders; dat kan alleen omdat de beslissing een aanroepbare functie is. Bij ons: `verwerkBetaald()` mag de beslissing niet *zijn*, hij moet hem *aanroepen*. Dat is de voorwaarde om ooit een backfill te draaien nadat we een regel wijzigen.
4. **Een onbekende status verleent niets.** SamCart's `$remove = in_array(...) ? true : false` is het tegenvoorbeeld. Bij een abonnementswebhook met een statusveld dat Mollie later kan uitbreiden, is dit geen theorie.
5. **Het argument voor onze deelrestitutie-regel opschrijven.** WooCommerce trekt in per terugbetaald regelitem, ThriveCart maakt er een instelling van met *intrekken* als standaard. Wij zijn de uitzondering, en dat is verdedigbaar omdat één betaling bij ons altijd precies één cursus is — een deelrestitutie kán dus geen productregel zijn. Maar die redenering staat nergens vast, en zodra we een bundel verkopen vervalt hij. Hoort in `docs/ontwerp-betaalmodel.md`, naast invariant I1b.

Wat we níét overnemen: de statusmatrix als beheerinstelling (overkill bij één PSP en één productvorm), de wachtrij-met-cron voor grote inschrijvingen (onze inschrijving is één rij, niet N dure schrijfacties), en de hele Integrity-aanpak op één punt na (§5.4).

---

## 7. Onzekerheden

- **Ik heb de code gelezen, niet gedraaid.** Er stond geen WordPress-installatie met WooCommerce, MemberPress, PMPro, RCP of WooCommerce Subscriptions naast om de hooks daadwerkelijk te laten vuren. De statuslijsten komen uit `wc_get_order_statuses()` / `wcs_get_subscription_statuses()`, die ik uit de standaardwaarden in `Settings_Enrollment_Status` heb afgeleid — een site met eigen orderstatussen krijgt daar extra rijen bij, standaard op *Deny*.
- **De WooCommerce-standaardwaarden gelden alleen bij een verse installatie.** `load_settings_values()` zet ze pas als de optie nog leeg is; een site die van 1.x is geüpgraded kan andere waarden hebben, en ik heb `includes/class-upgrade.php` niet uitgekamd op wat daar precies wordt overgezet.
- **Het gedrag rond gelijktijdigheid is afgeleid uit de codevorm** (read-modify-write op usermeta zonder lock), niet gemeten. Of het in de praktijk misgaat hangt af van hoeveel hooks er tegelijk vuren.
- **Bij ThriveCart heb ik de partial-refund-vergelijking als stringvergelijking gelezen** omdat de filter na `sanitize_array()` draait. Als ThriveCart die velden altijd in centen als integer-string stuurt, is het punt theoretisch. Niet geverifieerd tegen echte ThriveCart-payloads.
- **De "verleent bij"-kolom voor SamCart is een gevolgtrekking**, geen documentatie: de code kent alleen een intreklijst, dus alles daarbuiten valt in het verlenen-pad. Welke `type`-waarden SamCart daadwerkelijk verstuurt, staat niet in de add-on.
- **Van Integrity heb ik de effectiviteit architectonisch beoordeeld** (waar draait de code, wie controleert wie), niet met een aanvalspoging. Dat was ook niet de opdracht.
- De membership-add-ons hebben elk nog een cron-spoor voor het **wijzigen van de level→cursus-mapping** achteraf (in batches, met een lockbestand bij MemberPress). Dat heb ik alleen op hoofdlijn bekeken; de foutafhandeling bij een halverwege afgebroken batch heb ik niet nagelopen.
