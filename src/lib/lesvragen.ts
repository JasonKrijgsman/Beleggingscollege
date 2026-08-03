import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
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

/**
 * Openbare vragen bij een les: goedgekeurd én beantwoord, nieuwste eerst.
 *
 * Gooit nooit. Deze functie draait óók tijdens de build (de gratis lessen
 * worden vooraf gerenderd), en een hapering van de database mag een deploy
 * niet laten mislukken. Bij een fout: geen vragen tonen, en de regel loggen.
 * De les zelf blijft dan gewoon werken.
 */
export async function zichtbareVragen(
  courseSlug: string,
  lessonSlug: string
): Promise<LesVraag[]> {
  try {
    return await db
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
  } catch (fout) {
    console.error(
      `[lesvragen] kon vragen niet ophalen voor ${courseSlug}/${lessonSlug}`,
      fout
    );
    return [];
  }
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

  const voornaam = naam.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";

  /*
   * Tellen en invoegen in ÉÉN statement.
   *
   * Het was eerst een SELECT count(...) gevolgd door een INSERT, en daar zat
   * een gat tussen: twee gelijktijdige inzendingen lazen allebei "twee
   * wachtend", en allebei mochten door — vier openstaande vragen bij een
   * limiet van drie. Nu staat de telling in de WHERE van de INSERT zelf, dus
   * hij wordt pas op het moment van invoegen bepaald.
   *
   * Eerlijk over de rest van het gat: onder READ COMMITTED werkt elk statement
   * met de momentopname van zijn eigen start, dus twee inzendingen op precies
   * hetzelfde moment kunnen in theorie nog steeds allebei ruimte zien. De
   * schade is dan één vraag te veel in de moderatiewachtrij. Sluitend krijg je
   * dat alleen met een slot of SERIALIZABLE, en dat is te zwaar geschut voor
   * een spamdrempel — geen transacties dus, wat ook nodig is omdat de
   * neon-http-driver ze niet ondersteunt.
   *
   * Geen rij terug = de limiet gold. Dat is meteen het antwoord.
   */
  const geplaatst = await db.execute(sql`
    INSERT INTO lesson_questions (id, user_id, naam, course_slug, lesson_slug, vraag)
    SELECT gen_random_uuid(), ${userId}, ${voornaam}, ${courseSlug}, ${lessonSlug}, ${vraag}
    WHERE (
      SELECT count(*) FROM lesson_questions
      WHERE user_id = ${userId} AND status = 'wachtend'
    ) < ${MAX_WACHTEND_PER_GEBRUIKER}::int
    RETURNING id
  `);

  if (geplaatst.rows.length === 0) {
    return {
      ok: false,
      reden:
        "Je hebt al een paar vragen ingestuurd — dank! Geef me even de kans die te bekijken voordat je er meer stuurt.",
    };
  }
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
