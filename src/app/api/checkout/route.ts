import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { purchases } from "@/db/schema";
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

  // Al gekocht? Dan niet nog een keer laten betalen.
  const bestaand = await db
    .select({ status: purchases.status })
    .from(purchases)
    .where(and(eq(purchases.userId, userId), eq(purchases.courseSlug, slug)))
    .limit(1);

  if (bestaand[0]?.status === "paid") {
    return NextResponse.json(
      { error: "Je hebt deze cursus al.", alGekocht: true },
      { status: 409 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  // Eerst bij Mollie aanmaken, zodat we het payment-id meteen kunnen opslaan.
  const payment = await mollie().payments.create({
    amount: { currency: "EUR", value: centenNaarBedrag(centen) },
    description: `Beleggingscollege — ${course.title}`,
    redirectUrl: `${SITE_URL}/cursussen/${slug}/gekocht`,
    webhookUrl: `${SITE_URL}/api/mollie/webhook`,
    metadata: { userId, courseSlug: slug },
  });

  // Eén rij per gebruiker per cursus (unieke index). Bestond er al een
  // mislukte of openstaande poging, dan werken we die bij in plaats van een
  // tweede rij te maken.
  await db
    .insert(purchases)
    .values({
      userId,
      courseSlug: slug,
      molliePaymentId: payment.id,
      status: "pending",
      amountCents: centen,
      currency: "EUR",
      withdrawalWaivedAt: new Date(),
      consentIp: ip,
      consentTermsVersion: HERROEPING_TEKST_VERSIE,
    })
    .onConflictDoUpdate({
      target: [purchases.userId, purchases.courseSlug],
      set: {
        molliePaymentId: payment.id,
        status: "pending",
        amountCents: centen,
        withdrawalWaivedAt: new Date(),
        consentIp: ip,
        consentTermsVersion: HERROEPING_TEKST_VERSIE,
      },
    });

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "Mollie gaf geen betaallink terug." },
      { status: 502 }
    );
  }

  return NextResponse.json({ checkoutUrl });
}
