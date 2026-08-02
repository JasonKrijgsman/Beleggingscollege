import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { importeerSnapshot, verwerkLes } from "@/lib/voortgang-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Voortgang van de ingelogde gebruiker.
 *
 * POST met { soort: "les" }      → één afgeronde les bijschrijven
 * POST met { soort: "snapshot" } → localStorage-historie eenmalig importeren
 *
 * Beide geven de volledige, door de server herrekende voortgang terug; de
 * client neemt dat antwoord over als waarheid. Wie niet is ingelogd krijgt
 * 401 en werkt gewoon door op localStorage — dat is geen fout maar de
 * normale situatie voor een anonieme bezoeker.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Leeg verzoek." }, { status: 400 });
  }

  if (body.soort === "les") {
    const { courseSlug, lessonSlug, correct, total, dagLokaal } = body;
    if (typeof courseSlug !== "string" || typeof lessonSlug !== "string") {
      return NextResponse.json({ error: "Onbekende les." }, { status: 400 });
    }
    const state = await verwerkLes(
      userId,
      courseSlug,
      lessonSlug,
      { correct: Number(correct) || 0, total: Number(total) || 0 },
      dagLokaal
    );
    return NextResponse.json({ state });
  }

  if (body.soort === "snapshot") {
    const state = await importeerSnapshot(userId, body.snapshot);
    return NextResponse.json({ state });
  }

  return NextResponse.json({ error: "Onbekende soort." }, { status: 400 });
}
