import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { paymentAttempts, users } from "@/db/schema";
import { courseLessonCount, getCourse } from "@/content";
import { verstuurMail } from "./mail";
import { orderbevestigingMail } from "./mailteksten";

/**
 * Verstuurt de orderbevestiging voor een betaalde order (= de betaalpoging
 * die "paid" heeft gehaald).
 *
 * Dit is de wettelijk verplichte bevestiging op een duurzame gegevensdrager.
 * Zonder deze mail is de afstandsverklaring van het herroepingsrecht — het
 * vinkje in de checkout — hoogstwaarschijnlijk niet rechtsgeldig. Zie
 * docs/wat-de-winkel-mist.md punt 1.
 *
 * Het ordernummer is hier al toegekend: dat gebeurt atomair in de
 * paid-verwerking van de webhook, sámen met de statusovergang. Deze functie
 * hoeft dus alleen nog te mailen — en te bewaken dat dat precies één keer
 * gebeurt, met een atomaire claim (docs/ontwerp-betaalmodel.md §2.4) in
 * plaats van lezen-dan-doen: twee gelijktijdige webhooks kunnen de oude
 * confirmationSentAt-check allebei passeren, de claim wint er maar één.
 *
 * Deze functie gooit nooit. Hij wordt aangeroepen vanuit de Mollie-webhook,
 * nádat de order al op `paid` staat. Een mislukte mail mag die webhook niet
 * laten falen: dan gaat Mollie tien keer over 26 uur herhalen.
 */
export async function stuurOrderbevestiging(
  molliePaymentId: string
): Promise<void> {
  try {
    const rijen = await db
      .select({
        id: paymentAttempts.id,
        userId: paymentAttempts.userId,
        courseSlug: paymentAttempts.courseSlug,
        status: paymentAttempts.status,
        amountCents: paymentAttempts.amountCents,
        paidAt: paymentAttempts.paidAt,
        confirmationSentAt: paymentAttempts.confirmationSentAt,
        orderNumber: paymentAttempts.orderNumber,
        email: users.email,
        naam: users.name,
      })
      .from(paymentAttempts)
      .innerJoin(users, eq(users.id, paymentAttempts.userId))
      .where(eq(paymentAttempts.molliePaymentId, molliePaymentId))
      .limit(1);

    const order = rijen[0];
    if (!order) return;

    // Alleen bij een echt betaalde order, en maar één keer.
    if (order.status !== "paid") return;
    if (order.confirmationSentAt) return;
    if (!order.email) {
      console.error(
        `[mail] geen e-mailadres voor order ${order.id} — bevestiging niet verstuurd`
      );
      return;
    }
    if (!order.orderNumber) {
      // Hoort niet te kunnen: de paid-verwerking kent het nummer atomair toe.
      // Kan alleen bij een rij van vóór de migratie die zonder nummer op paid
      // stond. Niet zelf een nummer verzinnen — dat is een beheeractie.
      console.error(
        `[mail] order ${order.id} is paid maar heeft geen ordernummer — bevestiging niet verstuurd`
      );
      return;
    }

    const course = getCourse(order.courseSlug);
    if (!course) return;

    // De atomaire claim: alleen wie deze UPDATE wint mag versturen. Crasht de
    // winnaar tussen claim en verzending, dan blijft dat zichtbaar als
    // "geclaimd zonder verstuurd" — precies wat de monitoringronde uit
    // docs/openstaand.md moet naslaan.
    const claim = await db
      .update(paymentAttempts)
      .set({ confirmationClaimedAt: new Date() })
      .where(
        and(
          eq(paymentAttempts.id, order.id),
          isNull(paymentAttempts.confirmationClaimedAt)
        )
      )
      .returning({ id: paymentAttempts.id });
    if (claim.length === 0) return;

    const mail = orderbevestigingMail({
      voornaam: eersteNaam(order.naam),
      cursusnaam: course.title,
      cursusSlug: course.slug,
      aantalLessen: courseLessonCount(course),
      bedragCenten: order.amountCents,
      datum: order.paidAt ?? new Date(),
      ordernummer: order.orderNumber,
    });

    const resultaat = await verstuurMail({
      aan: order.email,
      onderwerp: mail.onderwerp,
      tekst: mail.tekst,
      html: mail.html,
    });

    if (!resultaat.verstuurd) {
      // De mail is aantoonbaar níét weg, dus we geven de claim terug: zo
      // probeert een volgende webhook-aanroep het gewoon opnieuw. Alleen bij
      // een crash tussen claim en verzending blijft de claim staan — en dat
      // is dan terecht zichtbaar als "geclaimd zonder verstuurd".
      await db
        .update(paymentAttempts)
        .set({ confirmationClaimedAt: null })
        .where(eq(paymentAttempts.id, order.id));
      console.error(
        `[mail] orderbevestiging ${order.orderNumber} mislukt (${resultaat.reden}) — ` +
          `klant ${order.email} heeft betaald maar niets ontvangen`
      );
      return;
    }

    await db
      .update(paymentAttempts)
      .set({ confirmationSentAt: new Date() })
      .where(eq(paymentAttempts.id, order.id));
  } catch (fout) {
    console.error("[mail] orderbevestiging mislukt", fout);
  }
}

function eersteNaam(naam: string | null): string {
  if (!naam) return "";
  return naam.trim().split(/\s+/)[0] ?? "";
}
