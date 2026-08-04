import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { paymentAttempts } from "@/db/schema";
import { bedragNaarCenten, mollie, mollieIsGeconfigureerd } from "@/lib/mollie";
import { stuurOrderbevestiging } from "@/lib/orderbevestiging";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Statuscode uit een fout van de Mollie-client, als die er is. De client gooit
 *  een ApiError met een `statusCode`; netwerkfouten hebben er geen. */
function mollieStatus(fout: unknown): number | undefined {
  const code = (fout as { statusCode?: unknown })?.statusCode;
  return typeof code === "number" ? code : undefined;
}

/** Het attemptId-formaat dat de checkout zelf genereert (crypto.randomUUID). */
const UUID_PATROON =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * De metadata die ónze checkout in de betaling zet. Dit komt uit ons eigen
 * `payments.get()`-antwoord (opgehaald met onze API-key), dus het is door ons
 * geschreven data — niet iets uit de publieke payload. De vormcontrole is er
 * omdat ook betalingen van buiten onze checkout dit endpoint kunnen raken.
 */
function onzeMetadata(metadata: unknown): {
  userId: string;
  courseSlug: string;
  attemptId: string;
  amountCents: number;
} | null {
  const m = metadata as {
    userId?: unknown;
    courseSlug?: unknown;
    attemptId?: unknown;
    amountCents?: unknown;
  } | null;
  if (
    m &&
    typeof m.userId === "string" &&
    m.userId.length > 0 &&
    typeof m.courseSlug === "string" &&
    m.courseSlug.length > 0 &&
    typeof m.attemptId === "string" &&
    UUID_PATROON.test(m.attemptId) &&
    typeof m.amountCents === "number" &&
    Number.isInteger(m.amountCents) &&
    m.amountCents > 0
  ) {
    return {
      userId: m.userId,
      courseSlug: m.courseSlug,
      attemptId: m.attemptId,
      amountCents: m.amountCents,
    };
  }
  return null;
}

/**
 * De paid-verwerking als ÉÉN atomair SQL-statement.
 *
 * Waarom geen db.transaction(): de neon-http-driver van productie ondersteunt
 * geen interactieve transacties (hij gooit "No transactions support in
 * neon-http driver"), en db.batch() kan de uitkomst van het ene statement niet
 * in het volgende gebruiken — terwijl het ordernummer van de tellerstand
 * afhangt. Eén statement met data-modifying CTE's is in Postgres per definitie
 * atomair (alles slaagt of alles rolt terug, teller incluis) en draait
 * identiek op neon-http, PGlite en elke andere Postgres. Er is zo zelfs geen
 * crashvenster tússen claim, teller en entitlement: het is één commit.
 *
 * De stappen, met de toegestane overgangen uit docs/ontwerp-betaalmodel.md §2.2:
 *  1. kandidaat: de pending-rij opzoeken en vergrendelen (FOR UPDATE). Een
 *     gelijktijdige tweede webhook wacht hier, ziet daarna dat de rij niet
 *     meer pending is, en doet niets — óók de teller niet, dus geen gat.
 *  2. teller: het jaarnummer atomair ophogen, mét RETURNING.
 *  3. geclaimd: de overgang pending → paid, in één UPDATE samen met het
 *     ordernummer (de rij mag in één statement maar één keer gewijzigd worden).
 *     paidAt wordt precies één keer gezet en schuift dus nooit meer op.
 *  4. recht: het entitlement verlenen of reactiveren (upsert op user+course);
 *     een heraankoop na refund wist revoked_at/revoked_reason en hangt het
 *     recht aan de nieuwe order.
 *
 * Nul rijen terug betekent: al verwerkt — een echte no-op.
 */
async function verwerkBetaald(paymentId: string): Promise<void> {
  // Het jaar komt uit paidAt; beide worden in JS bepaald zodat de tests de
  // klok kunnen sturen. toISOString() is dezelfde UTC-vorm die Drizzle zelf
  // voor timestamp-kolommen hanteert.
  const paidAt = new Date();
  const jaar = paidAt.getFullYear();
  const nummerVoorvoegsel = `BC-${jaar}-`;

  await db.execute(sql`
    WITH kandidaat AS (
      SELECT id, user_id, course_slug FROM payment_attempts
      WHERE mollie_payment_id = ${paymentId} AND status = 'pending'
      FOR UPDATE
    ),
    teller AS (
      INSERT INTO order_counters (jaar, laatste)
      SELECT ${jaar}::int, 1 FROM kandidaat
      ON CONFLICT (jaar) DO UPDATE SET laatste = order_counters.laatste + 1
      RETURNING laatste
    ),
    geclaimd AS (
      UPDATE payment_attempts a
      SET status = 'paid',
          paid_at = ${paidAt.toISOString()}::timestamp,
          order_number = ${nummerVoorvoegsel} ||
            lpad(t.laatste::text, greatest(4, length(t.laatste::text)), '0')
      FROM kandidaat k, teller t
      WHERE a.id = k.id AND a.status = 'pending'
      RETURNING a.id, a.user_id, a.course_slug
    )
    INSERT INTO entitlements (id, user_id, course_slug, status, attempt_id, granted_at)
    SELECT gen_random_uuid(), user_id, course_slug, 'actief', id, ${paidAt.toISOString()}::timestamp
    FROM geclaimd
    ON CONFLICT (user_id, course_slug) DO UPDATE
      SET status = 'actief',
          attempt_id = excluded.attempt_id,
          granted_at = excluded.granted_at,
          revoked_at = NULL,
          revoked_reason = NULL
  `);
}

/**
 * Waarom een terugbetaling niet uit `payment.status` te lezen is.
 *
 * Mollie kent geen status "refunded": een terugbetaalde betaling blijft
 * gewoon `paid` staan, en wat er verandert zijn de velden `amountRefunded`
 * en `amountChargedBack`. Wie alleen naar de status kijkt, ziet een
 * terugbetaling dus nooit — precies waardoor toegang bleef staan nadat het
 * geld terug was.
 *
 * Wanneer trekken we in?
 *  - Chargeback van welk bedrag dan ook. De bank heeft het geld al
 *    teruggehaald; dat is geen coulance maar een geschil.
 *  - Volledige terugbetaling (terug >= betaald). De koop is ongedaan.
 *
 * Wat we bewust NIET doen: intrekken bij een gedeeltelijke terugbetaling.
 * Een korting achteraf of een compensatie van een paar euro hoort de cursus
 * niet af te pakken. Dat blijft handwerk in /beheer.
 */
function terugbetaalReden(payment: {
  amount: { value: string };
  amountRefunded?: { value: string };
  amountChargedBack?: { value: string };
}): "chargeback" | "refund" | null {
  const betaald = bedragNaarCenten(payment.amount.value);
  const teruggeboekt = payment.amountChargedBack
    ? bedragNaarCenten(payment.amountChargedBack.value)
    : 0;
  const terugbetaald = payment.amountRefunded
    ? bedragNaarCenten(payment.amountRefunded.value)
    : 0;

  // Number.isFinite vangt een onbruikbaar bedrag af: NaN zou bij elke
  // vergelijking false opleveren en de terugbetaling stil laten verdwijnen.
  if (Number.isFinite(teruggeboekt) && teruggeboekt > 0) return "chargeback";
  if (
    Number.isFinite(terugbetaald) &&
    Number.isFinite(betaald) &&
    terugbetaald > 0 &&
    terugbetaald >= betaald
  ) {
    return "refund";
  }
  return null;
}

/**
 * Het spiegelbeeld van verwerkBetaald(): geld terug, dus recht eraf — ook
 * weer als ÉÉN atomair statement, om dezelfde reden (geen transacties op de
 * neon-http-driver).
 *
 * Twee details die het verschil maken:
 *
 *  1. We pakken zowel `paid` als `pending`. Komt de terugbetaling binnen
 *     vóórdat wij de betaling ooit als betaald verwerkt hebben — Mollie's
 *     eerste webhook kan vertraagd of verloren zijn — dan mag die pending-rij
 *     daarna nóóit alsnog toegang verlenen. Door hem hier direct op
 *     `refunded` te zetten, vindt verwerkBetaald() later geen pending-rij
 *     meer en is de no-op precies wat we willen.
 *
 *  2. Het entitlement wordt alleen ingetrokken als het aan DEZE poging hangt
 *     (`attempt_id = k.id`). Heeft de klant na de terugbetaling opnieuw
 *     gekocht, dan wijst het recht naar de nieuwe order en laat een late
 *     webhook over de oude terugbetaling dat met rust. Zonder die voorwaarde
 *     zou een oude refund de nieuwe aankoop ongedaan maken.
 *
 * Nul rijen betekent: al verwerkt. Herhaalde webhooks zijn dus gratis.
 */
async function verwerkTerugbetaald(
  paymentId: string,
  reden: "chargeback" | "refund"
): Promise<void> {
  const nu = new Date().toISOString();

  await db.execute(sql`
    WITH kandidaat AS (
      SELECT id, user_id, course_slug FROM payment_attempts
      WHERE mollie_payment_id = ${paymentId}
        AND status IN ('pending', 'paid')
      FOR UPDATE
    ),
    gemarkeerd AS (
      UPDATE payment_attempts a
      SET status = 'refunded'
      FROM kandidaat k
      WHERE a.id = k.id
      RETURNING a.id
    )
    UPDATE entitlements e
    SET status = 'ingetrokken',
        revoked_at = ${nu}::timestamp,
        revoked_reason = ${reden}
    FROM kandidaat k
    WHERE e.user_id = k.user_id
      AND e.course_slug = k.course_slug
      AND e.attempt_id = k.id
      AND e.status = 'actief'
  `);
}

/**
 * Mollie meldt hier dat er iets veranderd is aan een betaling.
 *
 * Wat Mollie stuurt is één form-veld: `id=tr_...`. Meer niet. Géén status,
 * géén bedrag. Dat is met opzet: dit endpoint is publiek, dus iedereen kan er
 * een POST heen sturen. De enige betrouwbare bron is Mollie zélf opvragen met
 * onze API-key.
 *
 * Drie regels die we daarom hanteren:
 *  1. Geloof niets uit het verzoek behalve het id. Status altijd zelf ophalen.
 *  2. Controleer bedrag én valuta tegen wat wij hebben vastgelegd. Anders kan
 *     iemand een echte betaling van EUR 1 doen en dat id hierheen sturen om een
 *     cursus van EUR 49 te ontgrendelen.
 *  3. Antwoord vrijwel altijd 200. Een foutcode zorgt voor herhaalpogingen
 *     (10 stuks over 26 uur) en lekt bovendien informatie over wat wij kennen.
 */
export async function POST(request: Request) {
  if (!mollieIsGeconfigureerd) return new Response("OK", { status: 200 });

  let paymentId: string | null = null;

  try {
    const form = await request.formData();
    const id = form.get("id");
    if (typeof id === "string" && id.startsWith("tr_")) paymentId = id;
  } catch {
    return new Response("OK", { status: 200 });
  }

  if (!paymentId) return new Response("OK", { status: 200 });

  try {
    // Regel 1: status bij Mollie ophalen, niet uit de payload lezen.
    const payment = await mollie().payments.get(paymentId);

    let rijen = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.molliePaymentId, paymentId))
      .limit(1);

    // Reparatietak: kennen wij het id niet, maar draagt de betaling ónze
    // metadata (door onze checkout geschreven, hier uit ons eigen
    // payments.get()-antwoord gelezen), dan is de insert destijds mislukt
    // ná payments.create(). Maak de ontbrekende rij alsnog aan en verwerk
    // de webhook daarna normaal. Het consentbewijs van de oorspronkelijke
    // poging is daarbij helaas verloren — dat zat alleen in de mislukte
    // insert; bedrag en valuta leggen we wél opnieuw vast, uit de metadata
    // die wij er zelf in zetten (we verkopen uitsluitend in EUR).
    if (!rijen[0]) {
      const meta = onzeMetadata(payment.metadata);
      // Staat er niets van ons in: 200, zoals Mollie zelf aanbeveelt.
      if (!meta) return new Response("OK", { status: 200 });

      console.warn(
        `[mollie] reparatie: betaling ${paymentId} had geen rij; ` +
          `aangemaakt uit eigen metadata (attempt ${meta.attemptId})`
      );
      // onConflictDoNothing GERICHT op mollie_payment_id: een gelijktijdige
      // tweede webhook kan ons net vóór zijn geweest; dan is de rij er al en
      // is dat prima. Bewust NIET ongericht — deze insert kan sinds 0005 ook
      // op de partiële unique index botsen (gebruiker heeft al een ándere
      // pending poging voor dezelfde cursus). Die botsing stil wegslikken
      // betekende: betaald geld, geen rij, 200 naar Mollie, nooit een retry.
      // Nu gooit hij, vangt de catch onderaan hem als 500, en herhaalt Mollie
      // tot tien keer over 26 uur — tegen die tijd is de pending-rij opgelost
      // en slaagt de reparatie alsnog.
      await db
        .insert(paymentAttempts)
        .values({
          id: meta.attemptId,
          userId: meta.userId,
          courseSlug: meta.courseSlug,
          molliePaymentId: paymentId,
          status: "pending",
          amountCents: meta.amountCents,
          currency: "EUR",
        })
        .onConflictDoNothing({ target: paymentAttempts.molliePaymentId });

      rijen = await db
        .select()
        .from(paymentAttempts)
        .where(eq(paymentAttempts.molliePaymentId, paymentId))
        .limit(1);
      if (!rijen[0]) return new Response("OK", { status: 200 });
    }

    const poging = rijen[0];

    if (payment.status === "paid") {
      // Geld terug gaat vóór geld binnen. Mollie laat de status op "paid"
      // staan bij een terugbetaling, dus dit moet hier gecontroleerd worden
      // en niet verderop: anders verleent de tak hieronder alsnog toegang
      // voor een betaling die allang teruggeboekt is.
      const reden = terugbetaalReden(payment);
      if (reden) {
        await verwerkTerugbetaald(paymentId, reden);
        return new Response("OK", { status: 200 });
      }

      // Betaald geld op een rij die wij al hebben afgesloten is per definitie
      // een probleem dat een mens moet zien — niet iets om stil met 200 te
      // bevestigen, want dan verdwijnt het: verwerkBetaald() claimt alleen
      // pending-rijen, dus er zou geen recht, geen ordernummer en geen spoor
      // ontstaan. Een 500 laat Mollie tot tien keer over 26 uur terugkomen en
      // houdt de fout zichtbaar in de logs tot er ingegrepen is. Dit hoort
      // nooit te gebeuren (expired/canceled/failed zetten we alleen als
      // Mollie de betaling zelf zo noemde), en juist daarom mag het niet
      // geluidloos zijn als het tóch gebeurt. `mismatch` valt hier bewust
      // buiten: die heeft zijn eigen afhandeling hieronder en zijn eigen
      // bewijsregel.
      if (["expired", "canceled", "failed"].includes(poging.status)) {
        console.error(
          `[mollie] betaald geld op afgesloten rij: betaling ${paymentId} ` +
            `is paid bij Mollie maar staat bij ons op '${poging.status}'. ` +
            `Handmatig herstellen (rij, recht, ordernummer) en dan pas 200.`
        );
        return new Response("Tijdelijke fout", { status: 500 });
      }

      // Regel 2: bedrag en valuta moeten kloppen.
      const betaald = bedragNaarCenten(payment.amount.value);
      if (
        payment.amount.currency !== poging.currency ||
        betaald < poging.amountCents
      ) {
        console.error(
          `[mollie] bedrag komt niet overeen voor ${paymentId}: ` +
            `betaald ${payment.amount.currency} ${payment.amount.value}, ` +
            `verwacht ${poging.currency} ${poging.amountCents / 100}`
        );
        // Alleen pending → mismatch is toegestaan; een rij die al paid of
        // mismatch is blijft onaangeroerd (bewijs wordt nooit overschreven).
        await db
          .update(paymentAttempts)
          .set({ status: "mismatch" })
          .where(
            and(
              eq(paymentAttempts.molliePaymentId, paymentId),
              eq(paymentAttempts.status, "pending")
            )
          );
        return new Response("OK", { status: 200 });
      }

      // De atomaire claim: pending → paid + ordernummer + entitlement, in
      // één statement. Een herhaalde webhook is een echte no-op.
      await verwerkBetaald(paymentId);

      // De wettelijk verplichte bevestiging. Bewust ná het vrijgeven van de
      // toegang, en bewust een functie die nooit gooit: gaat het versturen mis,
      // dan mag dat deze webhook niet laten falen. Anders herhaalt Mollie tien
      // keer over 26 uur terwijl de aankoop allang goed staat. De functie
      // bewaakt zelf (met een atomaire claim) dat er maar één mail per order
      // uitgaat.
      //
      // Alleen voor een rij die ook echt op paid staat. Was er eerder al een
      // terugbetaling langsgekomen, dan staat de rij op 'refunded', verleent
      // verwerkBetaald() niets meer, en hoort er dus ook geen orderbevestiging
      // uit te gaan voor een aankoop die niet bestaat. Bij een gewone herhaalde
      // webhook staat de rij nog gewoon op paid, dus een eerder mislukte mail
      // houdt hier zijn nieuwe kans.
      const [naVerwerking] = await db
        .select({ status: paymentAttempts.status })
        .from(paymentAttempts)
        .where(eq(paymentAttempts.molliePaymentId, paymentId))
        .limit(1);

      if (naVerwerking?.status === "paid") {
        await stuurOrderbevestiging(paymentId);
      }

      return new Response("OK", { status: 200 });
    }

    // Eindstatussen van Mollie overnemen, maar uitsluitend vanaf pending —
    // dat is de volledige lijst toegestane overgangen uit
    // docs/ontwerp-betaalmodel.md §2.2. Tussenstanden als "open" of
    // "authorized" zijn gewoon nog pending en muteren hier niets. De enige weg
    // wég van "paid" is de terugbetaalroute hierboven.
    if (["failed", "expired", "canceled"].includes(payment.status)) {
      await db
        .update(paymentAttempts)
        .set({ status: payment.status })
        .where(
          and(
            eq(paymentAttempts.molliePaymentId, paymentId),
            eq(paymentAttempts.status, "pending")
          )
        );
    }

    return new Response("OK", { status: 200 });
  } catch (fout) {
    const status = mollieStatus(fout);

    // Kent Mollie de betaling niet, dan valt er niets te herstellen. Dit is
    // ook wat er gebeurt als iemand dit publieke endpoint met een verzonnen id
    // bestookt. Rustig 200 teruggeven: een foutcode zou Mollie tien keer over
    // 26 uur laten terugkomen voor een betaling die niet bestaat.
    if (status === 404 || status === 410) {
      console.warn(`[mollie] onbekende betaling ${paymentId} (${status})`);
      return new Response("OK", { status: 200 });
    }

    // Al het overige is wél een echte storing: onze sleutel deugt niet (401),
    // we zitten aan een limiet (429), Mollie ligt eruit of de database is weg.
    // Dan is herhalen juist gewenst, dus geven we een foutcode terug.
    console.error("[mollie] webhook mislukt", fout);
    return new Response("Tijdelijke fout", { status: 500 });
  }
}
