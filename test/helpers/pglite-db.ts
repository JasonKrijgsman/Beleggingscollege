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

/* ------------------------------------------------------------------
 * Gecontroleerd interleaven
 *
 * PGlite deelt één verbinding, dus twee gelijktijdige aanroepen wisselen
 * elkaar per statement af — net als twee verzoeken op productie. Alleen is
 * de volgorde daarvan niet te sturen, en dan bewijst een racetest niets:
 * hij slaagt toevallig. Met `houdVast()` zet je het éérste statement dat op
 * een patroon past stil, laat je een ander verzoek er volledig langs, en
 * geef je het daarna vrij. Zo is de gevaarlijke volgorde reproduceerbaar.
 * ---------------------------------------------------------------- */

type Haak = { patroon: RegExp; aangekomen: () => void; slot: Promise<void> };
let haak: Haak | null = null;

/* eslint-disable @typescript-eslint/no-explicit-any */
const echteQuery = client.query.bind(client) as (...a: any[]) => Promise<any>;
(client as any).query = async (sql: string, ...rest: any[]) => {
  if (haak && haak.patroon.test(sql)) {
    const h = haak;
    haak = null; // maar één statement vasthouden, niet elk volgend
    h.aangekomen();
    await h.slot;
  }
  return echteQuery(sql, ...rest);
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Houd het eerstvolgende statement dat op `patroon` past tegen.
 * `bereikt` gaat open zodra dat statement klaarstaat (maar nog niets deed);
 * `laatLos()` geeft het daarna vrij.
 */
export function houdVast(patroon: RegExp): {
  bereikt: Promise<void>;
  laatLos: () => void;
} {
  let aangekomen!: () => void;
  const bereikt = new Promise<void>((r) => (aangekomen = r));
  let laatLos!: () => void;
  const slot = new Promise<void>((r) => (laatLos = r));
  haak = { patroon, aangekomen, slot };
  return { bereikt, laatLos };
}

export async function leegAlleTabellen(): Promise<void> {
  haak = null;
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
