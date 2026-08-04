import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { entitlements, paymentAttempts } from "@/db/schema";
import { getCourse } from "@/content";
import { prijsInCenten } from "@/lib/prijs";
import {
  HERROEPING_TEKST_VERSIE,
  centenNaarBedrag,
  mollie,
  mollieIsGeconfigureerd,
} from "@/lib/mollie";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Herkent een unique-schending (SQLSTATE 23505) van Postgres.
 *
 * Bewust breder dan alleen `fout.code`: de neon-http-driver en de PGlite van
 * de tests verpakken de oorspronkelijke fout allebei anders, en een van die
 * twee niet herkennen betekent hier een 500 in plaats van een nette 409 — in
 * de tests groen, op productie niet. Vandaar ook de tekstcontrole als vangnet.
 */
function isUniekeSchending(fout: unknown): boolean {
  for (let f: unknown = fout, diepte = 0; f && diepte < 5; diepte++) {
    const e = f as { code?: unknown; message?: unknown; cause?: unknown };
    if (e.code === "23505") return true;
    if (
      typeof e.message === "string" &&
      /duplicate key value|unique constraint/i.test(e.message)
    ) {
      return true;
    }
    f = e.cause;
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!mollieIsGeconfigureerd) {
    return NextResponse.json(
      { error: "Betalen is nog niet ingeschakeld." },
      { status: 503 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : null;
  const herroepingAkkoord = body?.herroepingAkkoord === true;

  const course = slug ? getCourse(slug) : undefined;
  if (!slug || !course) {
    return NextResponse.json({ error: "Onbekende cursus." }, { status: 404 });
  }

  // Zonder uitdrukkelijke toestemming mogen we de cursus niet meteen
  // ontsluiten, en dan klopt de hele koopflow niet. Zie docs/betalingen-mollie.md.
  if (!herroepingAkkoord) {
    return NextResponse.json(
      { error: "Je moet akkoord gaan om direct te kunnen beginnen." },
      { status: 400 }
    );
  }

  const centen = prijsInCenten(course);
  if (centen === null) {
    return NextResponse.json(
      { error: "Deze cursus is niet te koop." },
      { status: 400 }
    );
  }

  // Al gekocht? Dan niet nog een keer laten betalen. Dit is dedupe van
  // aankopen, géén tweede toegangspoort — die blijft heeftToegangTot().
  const bestaand = await db
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.courseSlug, slug),
        eq(entitlements.status, "actief")
      )
    )
    .limit(1);

  if (bestaand.length > 0) {
    return NextResponse.json(
      { error: "Je hebt deze cursus al.", alGekocht: true },
      { status: 409 }
    );
  }

  // Loopt er al een poging voor deze cursus? Dan is een tweede betaallink
  // precies wat we niet willen: de klant kan er dan twee betalen, terwijl
  // entitlements uniek is op (user, course) en de tweede betaling dus geen
  // extra toegang oplevert. Geld weg, niets ervoor terug.
  //
  // We vragen Mollie wat die poging waard is in plaats van het te gokken:
  //  - nog betaalbaar  -> diezelfde link teruggeven (het tweede tabblad krijgt
  //                       gewoon de betaling die al openstond)
  //  - niet meer       -> onze rij bijwerken naar de eindstatus en verder gaan
  //                       met een nieuwe poging. Zonder die zelfherstelstap zou
  //                       een blijven hangen pending-rij de klant voorgoed
  //                       blokkeren, want de unique index laat er maar één toe.
  const openstaand = await db
    .select()
    .from(paymentAttempts)
    .where(
      and(
        eq(paymentAttempts.userId, userId),
        eq(paymentAttempts.courseSlug, slug),
        eq(paymentAttempts.status, "pending")
      )
    )
    .limit(1);

  if (openstaand[0]) {
    const vorige = openstaand[0];
    try {
      const bestaandeBetaling = await mollie().payments.get(
        vorige.molliePaymentId
      );
      const nogTeBetalen =
        bestaandeBetaling.status === "open" ||
        bestaandeBetaling.status === "pending";
      const link = nogTeBetalen ? bestaandeBetaling.getCheckoutUrl() : null;

      if (link) {
        return NextResponse.json({ checkoutUrl: link, hergebruikt: true });
      }

      // Uitgelopen, geannuleerd of mislukt: de rij mag van pending af, zodat
      // de nieuwe poging hieronder langs de unique index komt. Betaald? Dan
      // laten we de rij met rust — de webhook gaat erover, en de controle op
      // een bestaand entitlement hierboven vangt de klant de volgende keer op.
      if (["expired", "canceled", "failed"].includes(bestaandeBetaling.status)) {
        await db
          .update(paymentAttempts)
          .set({ status: bestaandeBetaling.status })
          .where(
            and(
              eq(paymentAttempts.id, vorige.id),
              eq(paymentAttempts.status, "pending")
            )
          );
      } else {
        return NextResponse.json(
          {
            error:
              "Er loopt al een betaling voor deze cursus. Wacht even tot die is verwerkt.",
          },
          { status: 409 }
        );
      }
    } catch (fout) {
      console.error(
        `[checkout] kon openstaande betaling ${vorige.molliePaymentId} niet ophalen`,
        fout
      );
      return NextResponse.json(
        {
          error:
            "Er loopt al een betaling voor deze cursus. Probeer het zo opnieuw.",
        },
        { status: 409 }
      );
    }
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  // Ons eigen id gaat mee in de Mollie-metadata (net als het bedrag). Faalt
  // de insert hieronder, dan draagt de betaling bij Mollie zelf onze sleutel
  // en maakt de reparatietak in de webhook de rij alsnog aan.
  const attemptId = crypto.randomUUID();

  const payment = await mollie().payments.create({
    amount: { currency: "EUR", value: centenNaarBedrag(centen) },
    description: `Beleggingscollege — ${course.title}`,
    redirectUrl: `${SITE_URL}/cursussen/${slug}/gekocht`,
    webhookUrl: `${SITE_URL}/api/mollie/webhook`,
    metadata: { userId, courseSlug: slug, attemptId, amountCents: centen },
  });

  // Elke poging is een eigen rij, append-only: bewust een kale insert, géén
  // upsert. Een eerdere mislukte of hangende poging blijft als historie staan.
  //
  // De controle hierboven is een net-zijn-voor-de-klant, geen garantie: twee
  // gelijktijdige verzoeken zien allebei geen openstaande poging. De partiële
  // unique index op (user_id, course_slug) WHERE status = 'pending' is wél een
  // garantie — precies één van de twee inserts slaagt.
  try {
    await db.insert(paymentAttempts).values({
      id: attemptId,
      userId,
      courseSlug: slug,
      molliePaymentId: payment.id,
      status: "pending",
      amountCents: centen,
      currency: "EUR",
      withdrawalWaivedAt: new Date(),
      consentIp: ip,
      consentTermsVersion: HERROEPING_TEKST_VERSIE,
    });
  } catch (fout) {
    if (!isUniekeSchending(fout)) throw fout;

    // Wij verloren de race. Er ligt nu een betaalbare betaling bij Mollie die
    // van niemand is: laat die niet zwerven, want dán heeft de klant alsnog
    // twee links. Annuleren is de enige stap die dat echt oplost; lukt het
    // niet, dan is het een logregel waard — de betaling verloopt vanzelf en
    // de reparatietak in de webhook zou hem anders nog opeisen.
    try {
      if (payment.isCancelable) await mollie().payments.cancel(payment.id);
    } catch (annuleerFout) {
      console.error(
        `[checkout] kon dubbele betaling ${payment.id} niet annuleren`,
        annuleerFout
      );
    }

    const winnaar = await db
      .select()
      .from(paymentAttempts)
      .where(
        and(
          eq(paymentAttempts.userId, userId),
          eq(paymentAttempts.courseSlug, slug),
          eq(paymentAttempts.status, "pending")
        )
      )
      .limit(1);

    if (winnaar[0]) {
      try {
        const betaling = await mollie().payments.get(
          winnaar[0].molliePaymentId
        );
        const link = betaling.getCheckoutUrl();
        if (link) {
          return NextResponse.json({ checkoutUrl: link, hergebruikt: true });
        }
      } catch (ophaalFout) {
        console.error("[checkout] winnaar niet ophaalbaar", ophaalFout);
      }
    }

    return NextResponse.json(
      {
        error:
          "Er loopt al een betaling voor deze cursus. Probeer het zo opnieuw.",
      },
      { status: 409 }
    );
  }

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "Mollie gaf geen betaallink terug." },
      { status: 502 }
    );
  }

  return NextResponse.json({ checkoutUrl });
}
