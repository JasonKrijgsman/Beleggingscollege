import { eq } from "drizzle-orm";
import { db } from "@/db";
import { purchases } from "@/db/schema";
import { bedragNaarCenten, mollie, mollieIsGeconfigureerd } from "@/lib/mollie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Statuscode uit een fout van de Mollie-client, als die er is. De client gooit
 *  een ApiError met een `statusCode`; netwerkfouten hebben er geen. */
function mollieStatus(fout: unknown): number | undefined {
  const code = (fout as { statusCode?: unknown })?.statusCode;
  return typeof code === "number" ? code : undefined;
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

    const rijen = await db
      .select()
      .from(purchases)
      .where(eq(purchases.molliePaymentId, paymentId))
      .limit(1);

    const aankoop = rijen[0];
    // Onbekend id: 200 teruggeven, zoals Mollie zelf aanbeveelt.
    if (!aankoop) return new Response("OK", { status: 200 });

    if (payment.status === "paid") {
      // Regel 2: bedrag en valuta moeten kloppen.
      const betaald = bedragNaarCenten(payment.amount.value);
      if (
        payment.amount.currency !== aankoop.currency ||
        betaald < aankoop.amountCents
      ) {
        console.error(
          `[mollie] bedrag komt niet overeen voor ${paymentId}: ` +
            `betaald ${payment.amount.currency} ${payment.amount.value}, ` +
            `verwacht ${aankoop.currency} ${aankoop.amountCents / 100}`
        );
        await db
          .update(purchases)
          .set({ status: "mismatch" })
          .where(eq(purchases.molliePaymentId, paymentId));
        return new Response("OK", { status: 200 });
      }

      // Idempotent: dezelfde webhook komt gegarandeerd vaker binnen. Deze
      // update is een no-op als de rij al op "paid" staat.
      await db
        .update(purchases)
        .set({ status: "paid", paidAt: new Date() })
        .where(eq(purchases.molliePaymentId, paymentId));

      return new Response("OK", { status: 200 });
    }

    // Alle overige statussen 1-op-1 overnemen: failed, expired, canceled.
    // Bij een terugbetaling zet Mollie de betaling niet op "refunded"; dat
    // komt via een aparte refund-webhook. Zodra we terugbetalingen gaan doen
    // moet hier ook de toegang weer ingetrokken worden.
    await db
      .update(purchases)
      .set({ status: payment.status })
      .where(eq(purchases.molliePaymentId, paymentId));

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
