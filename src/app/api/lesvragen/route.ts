import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { heeftToegangTot } from "@/lib/entitlements";
import { plaatsVraag } from "@/lib/lesvragen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Een vraag stellen bij een les.
 *
 * De lespagina toont het formulier alleen aan wie de les mag zien, maar dit
 * endpoint controleert dat zélf opnieuw: de UI is geen autorisatie. Zonder
 * die controle kon iedereen met een account vragen posten bij betaalde
 * lessen die hij nooit kocht.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const courseSlug =
    typeof body?.courseSlug === "string" ? body.courseSlug : "";
  const lessonSlug =
    typeof body?.lessonSlug === "string" ? body.lessonSlug : "";

  if (!(await heeftToegangTot(courseSlug))) {
    return NextResponse.json({ error: "Geen toegang tot deze cursus." }, { status: 403 });
  }

  const resultaat = await plaatsVraag(
    userId,
    session.user?.name ?? "",
    courseSlug,
    lessonSlug,
    body?.vraag
  );

  if (!resultaat.ok) {
    return NextResponse.json({ error: resultaat.reden }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
