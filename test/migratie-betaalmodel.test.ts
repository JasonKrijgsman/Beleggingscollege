import { readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";

/**
 * De migratietest uit docs/ontwerp-betaalmodel.md §5 (slot): vóór en ná
 * migratie 0004 moeten de tellingen uit §3 kloppen. Dit bestand gebruikt
 * bewust NIET de gedeelde pglite-helper — die draait alle migraties al bij
 * het importeren, en hier willen we juist de wereld van vóór 0004 kunnen
 * vullen. We voeren dus exact dezelfde SQL-bestanden uit die drizzle-kit ook
 * op productie draait, met echte purchases-rijen ertussen.
 */

const drizzleMap = path.resolve(__dirname, "..", "drizzle");

async function voerMigratieUit(client: PGlite, tag: string): Promise<void> {
  const sql = await readFile(path.join(drizzleMap, `${tag}.sql`), "utf8");
  // "--> statement-breakpoint" begint met "--" en is dus gewoon SQL-commentaar;
  // exec() voert het hele bestand statement voor statement uit.
  await client.exec(sql);
}

async function journaalTags(): Promise<string[]> {
  const journaal = JSON.parse(
    await readFile(path.join(drizzleMap, "meta", "_journal.json"), "utf8")
  ) as { entries: { idx: number; tag: string }[] };
  return journaal.entries
    .sort((a, b) => a.idx - b.idx)
    .map((e) => e.tag);
}

async function telling(client: PGlite, query: string): Promise<number> {
  const res = await client.query<{ n: number }>(query);
  return Number(res.rows[0]?.n ?? NaN);
}

describe("migratie 0004_betaalmodel", () => {
  it("kopieert elke purchases-rij, verleent per paid-rij één recht en sluit de teller aan", async () => {
    const client = new PGlite();
    const tags = await journaalTags();

    // Bewust op naam gezocht en niet "de laatste migratie" genomen. Dat stond
    // hier eerst, en het brak zodra 0005 erbij kwam: `slice(0, -1)` betekende
    // dan "tot en met 0004", waardoor de migratie die deze test wíl toetsen al
    // gedraaid was voordat de test hem zelf uitvoerde. Zo blijft dit bestand
    // over 0004 gaan, hoeveel migraties er daarna ook nog bij komen.
    const index = tags.indexOf("0004_betaalmodel");
    expect(index).toBeGreaterThanOrEqual(0);
    const laatste = tags[index];

    // Alles tot en met 0003: de wereld zoals productie die vóór de splitsing had.
    for (const tag of tags.slice(0, index)) await voerMigratieUit(client, tag);

    // De inhoud van die wereld: één betaalde aankoop (mét ordernummer, zoals
    // de echte testaankoop) en één mislukte poging zonder nummer.
    await client.exec(`
      INSERT INTO "user" (id, name, email) VALUES ('u1', 'Koper', 'koper@test.local');
      INSERT INTO purchases (id, user_id, course_slug, mollie_payment_id, status,
        amount_cents, currency, created_at, paid_at, order_number)
      VALUES ('aankoop-paid', 'u1', 'waardebeleggen', 'tr_oud_paid', 'paid',
        4900, 'EUR', '2026-08-02 10:00:00', '2026-08-02 10:01:00', 'BC-2026-0003');
      INSERT INTO purchases (id, user_id, course_slug, mollie_payment_id, status,
        amount_cents, currency, created_at)
      VALUES ('aankoop-failed', 'u1', 'technische-analyse', 'tr_oud_failed', 'failed',
        4900, 'EUR', '2026-08-02 11:00:00');
    `);

    await voerMigratieUit(client, laatste);

    // Telling 1 uit §3: count(purchases) = count(payment_attempts).
    expect(await telling(client, `SELECT count(*)::int AS n FROM purchases`)).toBe(2);
    expect(
      await telling(client, `SELECT count(*)::int AS n FROM payment_attempts`)
    ).toBe(2);

    // Telling 2: aantal paid-rijen = aantal entitlements.
    expect(
      await telling(
        client,
        `SELECT count(*)::int AS n FROM purchases WHERE status = 'paid'`
      )
    ).toBe(1);
    expect(
      await telling(client, `SELECT count(*)::int AS n FROM entitlements`)
    ).toBe(1);

    // De id's blijven gelijk, zodat oud en nieuw naast elkaar te controleren
    // zijn; het recht hangt aan de betaalde poging en is actief.
    const recht = await client.query<{
      attempt_id: string;
      status: string;
      course_slug: string;
    }>(`SELECT attempt_id, status, course_slug FROM entitlements`);
    expect(recht.rows[0]).toEqual({
      attempt_id: "aankoop-paid",
      status: "actief",
      course_slug: "waardebeleggen",
    });

    // De poging draagt status, nummer en bedrag ongewijzigd mee.
    const poging = await client.query<{
      status: string;
      order_number: string | null;
      amount_cents: number;
    }>(`SELECT status, order_number, amount_cents FROM payment_attempts
        WHERE id = 'aankoop-paid'`);
    expect(poging.rows[0]).toEqual({
      status: "paid",
      order_number: "BC-2026-0003",
      amount_cents: 4900,
    });

    // De teller sluit aan op het HOOGSTE uitgedeelde nummer (0003), zodat de
    // eerstvolgende verkoop BC-2026-0004 krijgt — nooit een hergebruikt nummer.
    const teller = await client.query<{ jaar: number; laatste: number }>(
      `SELECT jaar, laatste FROM order_counters`
    );
    expect(teller.rows).toEqual([{ jaar: 2026, laatste: 3 }]);

    await client.close();
  });
});
