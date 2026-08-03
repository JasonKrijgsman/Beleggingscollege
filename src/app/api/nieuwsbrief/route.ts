import { NextResponse, type NextRequest } from "next/server";
import { isNotNull, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { newsletterSignups } from "@/db/schema";
import { verbruikPoging } from "@/lib/ratelimiet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tien aanmeldingen per kwartier per IP. Ruim genoeg voor een typefout of een
 *  huishouden achter één adres, krap genoeg om het formulier niet als
 *  invoerveld voor een lijst te kunnen gebruiken. */
const MAX_PER_IP = 10;
const VENSTER_MS = 15 * 60 * 1000;

/**
 * Nieuwsbrief-aanmelding. Bewust saai en defensief:
 * - Antwoordt bij een geldig adres ALTIJD hetzelfde, ook als het al bestond —
 *   anders kan iemand hier adressen op lidmaatschap testen.
 * - Slaat het toestemmingsmoment en IP op (AVG: toestemming moet aantoonbaar).
 * - Wie zich ooit afmeldde kan zich gewoon opnieuw aanmelden; dat was kapot
 *   (zie de upsert hieronder). De afmeldknop zelf bestaat nog niet — die komt
 *   met de eerste echte mailing mee, samen met de dubbele bevestiging.
 * - Er wordt pas echt gemaild als de dubbele bevestiging bestaat; tot die
 *   tijd is dit alleen vastleggen, zie docs/e-mail-versturen.md.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  // Vóór het werk: een IP dat hier staat te hameren krijgt niets te doen.
  // Zonder x-forwarded-for delen alle bellers één emmer — dat gebeurt alleen
  // lokaal, want Vercel zet die header altijd.
  const limiet = verbruikPoging(
    `nieuwsbrief:${ip ?? "onbekend"}`,
    MAX_PER_IP,
    VENSTER_MS
  );
  if (!limiet.toegestaan) {
    return NextResponse.json(
      { error: "Dat gaat wat snel achter elkaar. Probeer het zo nog eens." },
      { status: 429, headers: { "Retry-After": String(limiet.naSeconden) } }
    );
  }

  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const bron = typeof body?.bron === "string" ? body.bron.slice(0, 80) : "onbekend";

  // Bewust simpele controle: de echte validatie is de bevestigingsmail straks.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Dat lijkt geen geldig e-mailadres." },
      { status: 400 }
    );
  }

  const session = await auth();

  /*
   * Eén statement, twee gevallen — een upsert op het unieke e-mailadres.
   *
   * Hier stond `onConflictDoNothing()`, en dat maakte afmelden onomkeerbaar:
   * wie zich ooit uitschreef kon zich nooit meer aanmelden. Het formulier zei
   * dan "gelukt" terwijl er niets gebeurde, en dat is precies het soort stille
   * onwaarheid dat we hier niet willen.
   *
   * De `setWhere` op de DO UPDATE doet het onderscheid:
   * - Bestaande rij die is afgemeld → weer actief, met een VERS toestemmings-
   *   moment en IP. Dat is ook AVG-technisch juist: dit is nieuwe toestemming.
   * - Bestaande rij die nog gewoon loopt → helemaal niets. De oorspronkelijke
   *   toestemmingsdatum is het bewijs en mag niet opschuiven, en zo blijft een
   *   dubbele aanmelding netjes idempotent.
   *
   * Het account koppelen we alleen aan als er nu iemand is ingelogd; een
   * eerder gelegde koppeling laten we staan (coalesce), want anonieme
   * herinschrijving is geen reden om te vergeten wiens adres dit was.
   */
  await db
    .insert(newsletterSignups)
    .values({
      email,
      userId: session?.user?.id ?? null,
      source: bron,
      consentIp: ip,
    })
    .onConflictDoUpdate({
      target: newsletterSignups.email,
      set: {
        unsubscribedAt: null,
        // now() en niet new Date(): de kolom wordt bij een nieuwe rij door de
        // database gezet (defaultNow), en één kolom hoort niet door twee
        // verschillende klokken gevuld te worden.
        consentedAt: sql`now()`,
        consentIp: ip,
        source: bron,
        userId: sql`coalesce(excluded.user_id, ${newsletterSignups.userId})`,
      },
      setWhere: isNotNull(newsletterSignups.unsubscribedAt),
    });

  return NextResponse.json({ ok: true });
}
