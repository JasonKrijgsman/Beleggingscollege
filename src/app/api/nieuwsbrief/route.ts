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
 * Het IP van de aanvrager, voor het toestemmingsbewijs én voor de ratelimiet.
 *
 * `x-real-ip` heeft de voorkeur: Vercel zet die zelf en er staat één waarde in,
 * dus er valt niets verkeerd uit te kiezen. `x-forwarded-for` is de terugval
 * (lokaal, of achter een andere proxy) en daar nemen we de voorste waarde.
 *
 * Weet wat dat waard is: staat er ooit een proxy voor die het echte clientadres
 * juist ACHTERAAN toevoegt, dan is de voorste waarde precies wat de beller zelf
 * meestuurde. De ratelimiet hieronder is dus nooit sterker dan de proxy ervoor —
 * één reden te meer dat hij een drempel heet en geen garantie.
 */
function afzenderIp(request: NextRequest): string | null {
  const echt = request.headers.get("x-real-ip")?.trim();
  if (echt) return echt;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

/**
 * Nieuwsbrief-aanmelding. Bewust saai en defensief:
 * - Antwoordt bij een geldig adres ALTIJD hetzelfde, ook als het al bestond —
 *   anders kan iemand hier adressen op lidmaatschap testen.
 * - Slaat het toestemmingsmoment en IP op (AVG: toestemming moet aantoonbaar).
 * - Wie zich ooit afmeldde en aantoonbaar de eigenaar van het adres is, kan
 *   zich opnieuw aanmelden; dat kon helemaal niet (zie de upsert hieronder).
 *   De afmeldknop zelf bestaat nog niet — die komt met de eerste echte mailing
 *   mee, samen met de dubbele bevestiging.
 * - Er wordt pas echt gemaild als de dubbele bevestiging bestaat; tot die
 *   tijd is dit alleen vastleggen, zie docs/e-mail-versturen.md.
 */
export async function POST(request: NextRequest) {
  const ip = afzenderIp(request);

  // Vóór het werk: een IP dat hier staat te hameren krijgt niets te doen.
  // Zonder adresheader delen alle bellers één emmer — dat gebeurt alleen
  // lokaal, want Vercel zet ze altijd.
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
   * Een afmelding terugdraaien mag alleen wie aantoonbaar de eigenaar van het
   * adres is, en dat is hier precies één ding: ingelogd zijn met datzelfde
   * adres. Deze route is publiek en ongeauthenticeerd — zonder die eis kan
   * iedereen die jouw adres kent jouw uitschrijving ongedaan maken, en wordt
   * het opt-outsignaal daarbij ook nog gewist (de kolom gaat op NULL, er is
   * geen historie). "Nieuwe toestemming" is het alleen als de toestemming
   * echt van de eigenaar komt.
   *
   * Voor een uitgelogde herinschrijver blijft het dus stil. Dat is niet mooi,
   * maar het alternatief is erger, en sluitend wordt dit pas met de dubbele
   * bevestiging: dán is de klik op de link het bewijs en mag het anoniem.
   */
  const bewezenEigenaar =
    session?.user?.email?.trim().toLowerCase() === email;

  /*
   * Eén statement, twee gevallen — een upsert op het unieke e-mailadres.
   *
   * Hier stond `onConflictDoNothing()`, en dat maakte afmelden onomkeerbaar:
   * wie zich ooit uitschreef kon zich nooit meer aanmelden. Het formulier zei
   * dan "gelukt" terwijl er niets gebeurde, en dat is precies het soort stille
   * onwaarheid dat we hier niet willen.
   *
   * De `setWhere` op de DO UPDATE doet het onderscheid:
   * - Afgemelde rij + bewezen eigenaar → weer actief, met een VERS toestemmings-
   *   moment en IP.
   * - Bestaande rij die nog gewoon loopt → helemaal niets. De oorspronkelijke
   *   toestemmingsdatum is het bewijs en mag niet opschuiven, en zo blijft een
   *   dubbele aanmelding netjes idempotent.
   * - Alle overige gevallen (waaronder een uitgelogde aanvraag voor een
   *   afgemeld adres) → ook niets, `false` sluit de DO UPDATE dan helemaal af.
   *
   * Het account koppelen we alleen aan als er nu iemand is ingelogd; een
   * eerder gelegde koppeling laten we staan (coalesce). Dat is nu vooral een
   * vangnet — heractiveren kan alleen ingelogd — maar een sessie zonder id mag
   * nooit een bestaande koppeling wegvegen.
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
        // De vorige dubbele bevestiging is met de afmelding vervallen. Laat je
        // deze staan, dan geldt de heropgeleefde rij straks meteen als bevestigd
        // en gaat er post uit zonder dat er ooit opnieuw op een link is geklikt.
        confirmedAt: null,
        // now() en niet new Date(): de kolom wordt bij een nieuwe rij door de
        // database gezet (defaultNow), en één kolom hoort niet door twee
        // verschillende klokken gevuld te worden.
        consentedAt: sql`now()`,
        consentIp: ip,
        source: bron,
        userId: sql`coalesce(excluded.user_id, ${newsletterSignups.userId})`,
      },
      setWhere: bewezenEigenaar
        ? isNotNull(newsletterSignups.unsubscribedAt)
        : sql`false`,
    });

  return NextResponse.json({ ok: true });
}
