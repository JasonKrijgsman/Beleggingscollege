import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { heeftToegangTot } from "@/lib/entitlements";
import { plaatsVraag } from "@/lib/lesvragen";
import { verbruikPoging } from "@/lib/ratelimiet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tien pogingen per kwartier per account. Ruim boven wat iemand die echt een
 *  vraag stelt nodig heeft (met afgekeurde te korte vragen erbij), en het
 *  scheelt de database een hoop werk bij wie het formulier zit te hameren. */
const MAX_PER_GEBRUIKER = 10;
const VENSTER_MS = 15 * 60 * 1000;

/**
 * Een vraag stellen bij een les.
 *
 * De lespagina toont het formulier alleen aan wie de les mag zien, maar dit
 * endpoint controleert dat zélf opnieuw: de UI is geen autorisatie. Zonder
 * die controle kon iedereen met een account vragen posten bij betaalde
 * lessen die hij nooit kocht.
 *
 * Op de gebruiker-id gelimiteerd, niet op IP: insturen kan alleen ingelogd,
 * en een account is hier de duurdere sleutel om er nog een van te maken.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const limiet = verbruikPoging(
    `lesvragen:${userId}`,
    MAX_PER_GEBRUIKER,
    VENSTER_MS
  );
  if (!limiet.toegestaan) {
    return NextResponse.json(
      {
        error:
          "Dat gaat wat snel achter elkaar. Neem even de tijd en probeer het zo opnieuw.",
      },
      { status: 429, headers: { "Retry-After": String(limiet.naSeconden) } }
    );
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
