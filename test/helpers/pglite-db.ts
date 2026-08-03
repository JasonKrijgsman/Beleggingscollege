import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "@/db/schema";

/**
 * In-memory Postgres (PGlite) met exact hetzelfde schema als productie: de
 * migraties uit drizzle/ worden echt uitgevoerd. Zo testen we de werkelijke
 * SQL — where-clausules, unieke indexen, onConflict-gedrag — zonder ooit een
 * echte database aan te raken.
 *
 * Gebruik in een testbestand:
 *
 *   vi.mock("@/db", () => import("../helpers/pglite-db"));
 *
 * Elk testbestand krijgt zijn eigen instantie (Vitest isoleert modules per
 * bestand); binnen een bestand maakt `leegAlleTabellen()` schoon schip.
 */
const client = new PGlite();

export const db = drizzle(client, { schema });

export const dbIsConfigured = true;

await migrate(db, { migrationsFolder: "drizzle" });

export async function leegAlleTabellen(): Promise<void> {
  // Entitlements éérst: die verwijzen (zonder cascade) naar payment_attempts.
  await db.delete(schema.entitlements);
  await db.delete(schema.paymentAttempts);
  await db.delete(schema.orderCounters);
  await db.delete(schema.purchases);
  await db.delete(schema.lessonProgress);
  await db.delete(schema.userStats);
  await db.delete(schema.lessonQuestions);
  await db.delete(schema.newsletterSignups);
  await db.delete(schema.users);
}

export async function maakGebruiker(id: string, email?: string) {
  await db.insert(schema.users).values({
    id,
    name: "Testgebruiker",
    email: email ?? `${id}@test.local`,
  });
}

// Het echte @/db doet `export * from "./schema"`; spiegel dat.
export * from "@/db/schema";
