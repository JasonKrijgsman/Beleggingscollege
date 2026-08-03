import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getCourse } from "@/content";
import { heeftToegangTot } from "@/lib/entitlements";
import { importeerSnapshot, verwerkLes } from "@/lib/voortgang-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bestaat deze les écht in de catalogus? Een slug die we niet kennen is geen
 *  stille no-op maar een fout: dan klopt er iets niet aan de aanroep. */
function lesBestaat(courseSlug: string, lessonSlug: string): boolean {
  const course = getCourse(courseSlug);
  return (
    course?.modules.some((m) => m.lessons.some((l) => l.slug === lessonSlug)) ??
    false
  );
}

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
 *
 * TOEGANG: ingelogd zijn is niet genoeg. De lespagina toont de knop alleen
 * aan wie de cursus mag zien, maar de UI is geen autorisatie — precies zoals
 * bij /api/lesvragen. Zonder de controle hieronder kon iedereen met een
 * account voortgang bijschrijven voor een betaalde cursus die hij nooit
 * kocht, en zo XP, badges, een streak en uiteindelijk een certificaat
 * verzamelen voor materiaal dat hij nooit heeft gezien. `heeftToegangTot()`
 * is en blijft de enige poort die dat beoordeelt.
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
    if (
      typeof courseSlug !== "string" ||
      typeof lessonSlug !== "string" ||
      !lesBestaat(courseSlug, lessonSlug)
    ) {
      return NextResponse.json({ error: "Onbekende les." }, { status: 400 });
    }

    if (!(await heeftToegangTot(courseSlug))) {
      return NextResponse.json(
        { error: "Geen toegang tot deze cursus." },
        { status: 403 }
      );
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
    const state = await importeerSnapshot(
      userId,
      await snoeiSnapshot(userId, body.snapshot)
    );
    return NextResponse.json({ state });
  }

  return NextResponse.json({ error: "Onbekende soort." }, { status: 400 });
}

/**
 * Het snapshot terugsnoeien tot de cursussen waar deze gebruiker recht op
 * heeft: de gratis cursus plus wat hij gekocht heeft.
 *
 * Hier weigeren we bewust niet het hele verzoek. Een snapshot is een bulk-
 * import van oude localStorage-historie, en die kan best een cursus bevatten
 * waarvan de toegang later is ingetrokken (terugbetaling) of die de bezoeker
 * op een gedeelde computer heeft opgepikt. Eén verouderde slug mag de rest
 * van iemands leergeschiedenis niet laten sneuvelen. Wat er afvalt wordt wél
 * gelogd, zodat een patroon van pogingen zichtbaar is.
 *
 * WEES EERLIJK OVER DE PRIJS. Voor de gesnoeide cursus zelf is het verlies
 * definitief: de client neemt dit antwoord over als waarheid en schrijft het
 * terug naar localStorage (src/lib/progress.tsx). Wat hier afvalt staat niet
 * in de database, komt dus niet terug in het antwoord, en is bij de
 * eerstvolgende paginalading ook uit de browseropslag weg. Wat al wél op de
 * server stond blijft staan — we verwijderen nergens lesson_progress-rijen —
 * dus het raakt uitsluitend puur-lokale historie van een cursus waar geen
 * recht (meer) op is. De gebruiker merkt daar niets van; de console.warn
 * hieronder is het enige spoor.
 */
async function snoeiSnapshot(userId: string, snapshot: unknown) {
  const s =
    snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)
      ? (snapshot as Record<string, unknown>)
      : {};

  const completed =
    s.completed && typeof s.completed === "object" && !Array.isArray(s.completed)
      ? (s.completed as Record<string, unknown>)
      : {};

  // Eerst de gratis catalogustoets: die kost geen databasewerk, en zo kan een
  // verzonnen snapshot met duizend slugs geen duizend queries uitlokken — er
  // blijven hooguit zoveel vragen over als de catalogus cursussen heeft.
  const kandidaten = Object.entries(completed).filter(([courseSlug]) =>
    Boolean(getCourse(courseSlug))
  );

  // De poort blijft `heeftToegangTot()`, maar de vragen gaan tegelijk de deur
  // uit. Serieel was elke cursus een eigen sessielookup (database-sessies, en
  // `auth()` cachet niet) plus een entitlement-query, en op neon-http is elke
  // query een losse rondreis naar Frankfurt. Dit pad loopt bij élke
  // paginalading van een ingelogde bezoeker, dus dat telt op.
  const beoordeeld = await Promise.all(
    kandidaten.map(
      async ([courseSlug, lessen]) =>
        [courseSlug, lessen, await heeftToegangTot(courseSlug)] as const
    )
  );

  const toegestaan: Record<string, unknown> = {};
  const geweigerd: string[] = [];
  for (const [courseSlug, lessen, magHet] of beoordeeld) {
    if (magHet) {
      toegestaan[courseSlug] = lessen;
    } else {
      geweigerd.push(courseSlug);
    }
  }

  if (geweigerd.length > 0) {
    console.warn(
      `[voortgang] snapshot van ${userId}: ${geweigerd.length} cursus(sen) ` +
        `overgeslagen wegens ontbrekende toegang: ${geweigerd.join(", ")}`
    );
  }

  // Alleen `completed` hoeft gesnoeid: quizScores worden per geïmporteerde
  // les opgezocht, dus een score van een cursus die hier afvalt wordt nooit
  // gelezen. De streak en de naam blijven zoals ze waren.
  return { ...s, completed: toegestaan };
}
