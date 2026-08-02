// Snelle controle op de productiedatabase: welke tabellen staan er, en hoeveel
// gebruikers en aankopen zijn er? Draai met: node scripts/db-check.mjs
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const tabellen = await sql`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name`;
console.log("tabellen:", tabellen.map((r) => r.table_name).join(", "));

const gebruikers = await sql`select count(*)::int as n from "user"`;
const aankopen = await sql`
  select course_slug, status, mollie_payment_id, amount_cents, created_at
  from purchases order by created_at desc limit 10`;

console.log("gebruikers:", gebruikers[0].n);
console.log("aankopen:", aankopen.length);
for (const a of aankopen) {
  console.log(
    `  - ${a.course_slug} | ${a.status} | ${a.amount_cents / 100} euro | ${
      a.mollie_payment_id ?? "geen betaling-id"
    } | ${a.created_at?.toISOString?.() ?? a.created_at}`
  );
}
