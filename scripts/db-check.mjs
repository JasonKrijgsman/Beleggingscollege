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
// Sinds de betaalmodel-splitsing leven betalingen in payment_attempts en
// toegang in entitlements; het oude `purchases` staat er alleen nog stil bij.
const pogingen = await sql`
  select course_slug, status, mollie_payment_id, amount_cents, order_number, created_at
  from payment_attempts order by created_at desc limit 10`;
const rechten = await sql`
  select course_slug, status from entitlements order by granted_at desc limit 10`;

console.log("gebruikers:", gebruikers[0].n);
console.log("betaalpogingen:", pogingen.length);
for (const a of pogingen) {
  console.log(
    `  - ${a.course_slug} | ${a.status} | ${a.amount_cents / 100} euro | ${
      a.mollie_payment_id ?? "geen betaling-id"
    } | ${a.order_number ?? "geen ordernummer"} | ${a.created_at?.toISOString?.() ?? a.created_at}`
  );
}
console.log("rechten:", rechten.length);
for (const r of rechten) {
  console.log(`  - ${r.course_slug} | ${r.status}`);
}
