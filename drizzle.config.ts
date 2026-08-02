import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Valkuil: drizzle-kit leest .env.local niet vanzelf (Next.js wel).
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migraties gaan over de DIRECTE verbinding, niet via de pooler:
    // PgBouncer in transaction mode kan de statements van een migratie niet aan.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
