import "server-only";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { purchases, users } from "@/db/schema";
import { getCourse } from "@/content";
import { ordernummer, verstuurMail } from "./mail";
import { orderbevestigingMail } from "./mailteksten";

/**
 * Verstuurt de orderbevestiging voor een betaalde aankoop.
 *
 * Dit is de wettelijk verplichte bevestiging op een duurzame gegevensdrager.
 * Zonder deze mail is de afstandsverklaring van het herroepingsrecht — het
 * vinkje in de checkout — hoogstwaarschijnlijk niet rechtsgeldig. Zie
 * docs/wat-de-winkel-mist.md punt 1.
 *
 * Deze functie gooit nooit. Hij wordt aangeroepen vanuit de Mollie-webhook,
 * nádat de aankoop al op `paid` staat. Een mislukte mail mag die webhook niet
 * laten falen: dan gaat Mollie tien keer over 26 uur herhalen.
 */
export async function stuurOrderbevestiging(
  molliePaymentId: string
): Promise<void> {
  try {
    const rijen = await db
      .select({
        id: purchases.id,
        userId: purchases.userId,
        courseSlug: purchases.courseSlug,
        status: purchases.status,
        amountCents: purchases.amountCents,
        paidAt: purchases.paidAt,
        confirmationSentAt: purchases.confirmationSentAt,
        orderNumber: purchases.orderNumber,
        email: users.email,
        naam: users.name,
      })
      .from(purchases)
      .innerJoin(users, eq(users.id, purchases.userId))
      .where(eq(purchases.molliePaymentId, molliePaymentId))
      .limit(1);

    const aankoop = rijen[0];
    if (!aankoop) return;

    // Alleen bij een echt betaalde aankoop, en maar één keer. Mollie roept de
    // webhook gegarandeerd vaker aan; zonder deze regel krijgt de klant tien
    // identieke mails.
    if (aankoop.status !== "paid") return;
    if (aankoop.confirmationSentAt) return;
    if (!aankoop.email) {
      console.error(
        `[mail] geen e-mailadres voor aankoop ${aankoop.id} — bevestiging niet verstuurd`
      );
      return;
    }

    const course = getCourse(aankoop.courseSlug);
    if (!course) return;

    const nummer = aankoop.orderNumber ?? (await geefOrdernummer(aankoop.id));

    const mail = orderbevestigingMail({
      voornaam: eersteNaam(aankoop.naam),
      cursusnaam: course.title,
      cursusSlug: course.slug,
      bedragCenten: aankoop.amountCents,
      datum: aankoop.paidAt ?? new Date(),
      ordernummer: nummer,
    });

    const resultaat = await verstuurMail({
      aan: aankoop.email,
      onderwerp: mail.onderwerp,
      tekst: mail.tekst,
      html: mail.html,
    });

    if (!resultaat.verstuurd) {
      // Niet als verstuurd markeren, zodat een latere poging het opnieuw doet.
      console.error(
        `[mail] orderbevestiging ${nummer} mislukt (${resultaat.reden}) — ` +
          `klant ${aankoop.email} heeft betaald maar niets ontvangen`
      );
      return;
    }

    await db
      .update(purchases)
      .set({ confirmationSentAt: new Date() })
      .where(eq(purchases.id, aankoop.id));
  } catch (fout) {
    console.error("[mail] orderbevestiging mislukt", fout);
  }
}

/**
 * Kent een doorlopend ordernummer toe: BC-2026-0001.
 *
 * De Belastingdienst wil een reeks zonder gaten, dus tellen we de bestaande
 * genummerde aankopen van dit jaar in plaats van iets willekeurigs te
 * verzinnen. Bij gelijktijdige aankopen kan dat botsen; de unieke index op
 * `order_number` vangt dat af en we proberen het opnieuw.
 */
async function geefOrdernummer(purchaseId: string): Promise<string> {
  const jaar = new Date().getFullYear();

  for (let poging = 0; poging < 5; poging++) {
    const [telling] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(purchases)
      .where(
        and(
          isNotNull(purchases.orderNumber),
          sql`extract(year from ${purchases.createdAt}) = ${jaar}`
        )
      );

    const nummer = ordernummer(jaar, (telling?.n ?? 0) + 1 + poging);

    try {
      await db
        .update(purchases)
        .set({ orderNumber: nummer })
        .where(eq(purchases.id, purchaseId));
      return nummer;
    } catch {
      // Botsing op de unieke index: iemand anders was net eerder.
    }
  }

  // Lukt het na vijf pogingen niet, dan liever een bevestiging met een
  // afwijkend nummer dan helemaal geen bevestiging.
  return ordernummer(jaar, Date.now() % 10000);
}

function eersteNaam(naam: string | null): string {
  if (!naam) return "";
  return naam.trim().split(/\s+/)[0] ?? "";
}
