import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { entitlements } from "@/db/schema";
import { auth } from "@/auth";
import { getCourse } from "@/content";

/**
 * Bepaalt of de HUIDIGE bezoeker een cursus mag zien.
 *
 * Dit is de enige plek waar die vraag beantwoord wordt. Belangrijke regels:
 *
 * 1. Deze module is `server-only`. Importeer hem nooit in een client
 *    component — dan zou de bundler hem meesturen naar de browser.
 * 2. Vertrouw NOOIT iets uit de browser. Niet de localStorage-voortgang, niet
 *    een prop, niet een cookie die de client zelf kan zetten. Alleen de
 *    sessie op de server en een rij in `entitlements` met status "actief".
 * 3. Middleware is GEEN autorisatie. Auth.js waarschuwt daar expliciet voor:
 *    middleware is er voor een nette redirect, de echte controle hoort hier,
 *    zo dicht mogelijk bij het ophalen van de data.
 */
export async function heeftToegangTot(courseSlug: string): Promise<boolean> {
  const course = getCourse(courseSlug);
  if (!course) return false;

  // Gratis cursussen zijn voor iedereen, ook zonder account.
  if (course.free) return true;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return false;

  const rows = await db
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.courseSlug, courseSlug),
        eq(entitlements.status, "actief")
      )
    )
    .limit(1);

  return rows.length > 0;
}

/** Alle cursusslugs waar de huidige bezoeker toegang toe heeft gekocht. */
export async function gekochteCursussen(): Promise<string[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const rows = await db
    .select({ courseSlug: entitlements.courseSlug })
    .from(entitlements)
    .where(
      and(eq(entitlements.userId, userId), eq(entitlements.status, "actief"))
    );

  return rows.map((r) => r.courseSlug);
}
