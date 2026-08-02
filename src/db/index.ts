import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon over HTTP: geen langlevende verbinding, dus geschikt voor de serverless
// omgeving van Vercel. Gebruik de POOLED connection string (hostname met
// "-pooler"); de unpooled variant is alleen voor migraties en pg_dump.
//
// Waarom die placeholder-URL hieronder:
// `next build` laadt deze module om routes te analyseren, en dat gebeurt ook
// als er (nog) geen DATABASE_URL is — bij een verse deploy, of als iemand de
// repo net gekloond heeft. Bouwen hoort geen geheimen nodig te hebben.
//
// Lui initialiseren via een Proxy werkte hier niet: de Auth.js Drizzle-adapter
// inspecteert het db-object om het dialect te bepalen en faalt op een Proxy met
// "Unsupported database type (object)". Daarom bouwen we wél meteen een echte
// instance, maar met een onschuldige placeholder als de variabele ontbreekt.
// De HTTP-client van Neon maakt pas verbinding bij de eerste query, dus dit
// kost niets en verbindt nergens mee.

const PLACEHOLDER =
  "postgresql://build:build@localhost/build?sslmode=require";

const url = process.env.DATABASE_URL;

if (!url && process.env.NODE_ENV === "production") {
  // Geen throw: dat zou de build breken. Wel luid, want in productie is dit fout.
  console.warn(
    "[db] DATABASE_URL ontbreekt. Alles wat de database raakt (inloggen, " +
      "aankopen, voortgang) zal falen. Zet de variabele in Vercel → Settings → " +
      "Environment Variables. Zie .env.example."
  );
}

export const db = drizzle(neon(url ?? PLACEHOLDER), { schema });

/** Of de database daadwerkelijk geconfigureerd is. Handig om een nette
 *  melding te tonen in plaats van een verbindingsfout. */
export const dbIsConfigured = Boolean(url);

export * from "./schema";
