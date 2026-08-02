import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessonQuestions } from "@/db/schema";
import { getCourse } from "@/content";

/**
 * Vragen & antwoorden bij een les — REDACTIONEEL, geen helpdesk.
 * (Besloten 3 aug 2026, zie docs/ideeen.md.)
 *
 * Jason wil geen tweede baan als vragenbeantwoorder, en "stel een vraag,
 * antwoord volgt" oogt als een klein, overvraagd eenmansbedrijf. Daarom:
 * - Insturen kan alleen ingelogd, en alleen bij lessen waar je toegang toe
 *   hebt. De toegangscontrole doet de API-route via heeftToegangTot().
 * - Een vraag wordt pas openbaar als Jason hem zélf uitkiest en beantwoordt.
 *   Er is GEEN beloofde termijn en GEEN zichtbare wachtrij: een ingestuurde
 *   vraag is een suggestie, geen ticket. Off-topic of persoonlijke-advies-
 *   vragen (opties bij de Graham-les, "wat moet ik met mijn geld") verschijnen
 *   nooit — die wijst de moderatie af. Beantwoorde vragen groeien uit tot een
 *   mini-FAQ die de les scherper maakt.
 * - Maximaal drie openstaande inzendingen per gebruiker tegen spam.
 */

export const MAX_WACHTEND_PER_GEBRUIKER = 3;
export const VRAAG_MIN = 10;
export const VRAAG_MAX = 1000;

/**
 * De vaste, vriendelijke afwijzing voor persoonlijke beleggingsvragen.
 * Deze lag klaar vóórdat de eerste vraag binnen kon komen — dat was de
 * uitdrukkelijke voorwaarde bij dit besluit. Jason voegt hem in de
 * moderatie met één klik in en kan hem daar nog aanpassen.
 */
export const AFM_STANDAARDANTWOORD =
  "Goede vraag om te stellen — en precies het soort vraag dat ik niet mag " +
  "beantwoorden. Wat jij met jouw geld zou moeten doen hangt af van jouw " +
  "situatie, en daarover adviseren is in Nederland terecht voorbehouden aan " +
  "vergunninghouders onder toezicht van de AFM. Beleggingscollege is een " +
  "opleider: ik leg uit hoe dingen werken, zodat je zelf sterker beslist. " +
  "Wat ik je wél kan aanraden: kijk nog eens naar deze les, en stel je vraag " +
  "gerust opnieuw in algemene vorm (“hoe werkt X” in plaats van “wat moet ik " +
  "doen”) — die beantwoord ik graag.";

export type LesVraag = {
  id: string;
  naam: string;
  vraag: string;
  antwoord: string | null;
  status: string;
  createdAt: Date;
  answeredAt: Date | null;
};

function lesBestaat(courseSlug: string, lessonSlug: string): boolean {
  const course = getCourse(courseSlug);
  return Boolean(
    course?.modules.some((m) => m.lessons.some((l) => l.slug === lessonSlug))
  );
}

/** Openbare vragen bij een les: goedgekeurd én beantwoord, nieuwste eerst. */
export async function zichtbareVragen(
  courseSlug: string,
  lessonSlug: string
): Promise<LesVraag[]> {
  return db
    .select({
      id: lessonQuestions.id,
      naam: lessonQuestions.naam,
      vraag: lessonQuestions.vraag,
      antwoord: lessonQuestions.antwoord,
      status: lessonQuestions.status,
      createdAt: lessonQuestions.createdAt,
      answeredAt: lessonQuestions.answeredAt,
    })
    .from(lessonQuestions)
    .where(
      and(
        eq(lessonQuestions.courseSlug, courseSlug),
        eq(lessonQuestions.lessonSlug, lessonSlug),
        eq(lessonQuestions.status, "zichtbaar")
      )
    )
    .orderBy(desc(lessonQuestions.answeredAt))
    .limit(50);
}

export type PlaatsResultaat =
  | { ok: true }
  | { ok: false; reden: string };

export async function plaatsVraag(
  userId: string,
  naam: string,
  courseSlug: string,
  lessonSlug: string,
  vraagRuw: unknown
): Promise<PlaatsResultaat> {
  const vraag = typeof vraagRuw === "string" ? vraagRuw.trim() : "";
  if (vraag.length < VRAAG_MIN) {
    return { ok: false, reden: "Schrijf je vraag iets voluit — minstens tien tekens." };
  }
  if (vraag.length > VRAAG_MAX) {
    return { ok: false, reden: "Dat is meer een betoog dan een vraag — maximaal duizend tekens." };
  }
  if (!lesBestaat(courseSlug, lessonSlug)) {
    return { ok: false, reden: "Onbekende les." };
  }

  const [{ wachtend }] = await db
    .select({ wachtend: count() })
    .from(lessonQuestions)
    .where(
      and(
        eq(lessonQuestions.userId, userId),
        eq(lessonQuestions.status, "wachtend")
      )
    );
  if (wachtend >= MAX_WACHTEND_PER_GEBRUIKER) {
    return {
      ok: false,
      reden:
        "Je hebt al een paar vragen ingestuurd — dank! Geef me even de kans die te bekijken voordat je er meer stuurt.",
    };
  }

  await db.insert(lessonQuestions).values({
    userId,
    naam: naam.trim().split(/\s+/)[0]?.slice(0, 40) ?? "",
    courseSlug,
    lessonSlug,
    vraag,
  });
  return { ok: true };
}

/** Alles wat op moderatie wacht, oudste eerst — eerlijk is eerlijk. */
export async function wachtendeVragen() {
  return db
    .select()
    .from(lessonQuestions)
    .where(eq(lessonQuestions.status, "wachtend"))
    .orderBy(lessonQuestions.createdAt)
    .limit(100);
}

export type ModereerResultaat = { ok: boolean };

export async function modereer(
  id: string,
  actie: "beantwoord" | "afgewezen",
  antwoordRuw: unknown
): Promise<ModereerResultaat> {
  if (actie === "beantwoord") {
    const antwoord =
      typeof antwoordRuw === "string" ? antwoordRuw.trim() : "";
    if (antwoord.length < 2 || antwoord.length > 4000) return { ok: false };
    await db
      .update(lessonQuestions)
      .set({ status: "zichtbaar", antwoord, answeredAt: new Date() })
      .where(
        and(eq(lessonQuestions.id, id), eq(lessonQuestions.status, "wachtend"))
      );
    return { ok: true };
  }
  await db
    .update(lessonQuestions)
    .set({ status: "afgewezen" })
    .where(
      and(eq(lessonQuestions.id, id), eq(lessonQuestions.status, "wachtend"))
    );
  return { ok: true };
}
