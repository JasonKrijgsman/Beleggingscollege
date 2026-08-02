import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { newsletterSignups } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Nieuwsbrief-aanmelding. Bewust saai en defensief:
 * - Antwoordt bij een geldig adres ALTIJD hetzelfde, ook als het al bestond —
 *   anders kan iemand hier adressen op lidmaatschap testen.
 * - Slaat het toestemmingsmoment en IP op (AVG: toestemming moet aantoonbaar).
 * - Er wordt pas echt gemaild als de dubbele bevestiging bestaat; tot die
 *   tijd is dit alleen vastleggen, zie docs/e-mail-versturen.md.
 */
export async function POST(request: NextRequest) {
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
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  await db
    .insert(newsletterSignups)
    .values({
      email,
      userId: session?.user?.id ?? null,
      source: bron,
      consentIp: ip,
    })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}
