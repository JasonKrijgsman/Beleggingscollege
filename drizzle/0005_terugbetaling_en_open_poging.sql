-- Hooguit één openstaande betaalpoging per gebruiker per cursus.
--
-- Zonder deze index kwamen twee tabbladen allebei door de "al gekocht?"-
-- controle in de checkout en kreeg de klant twee betaalbare links. Betaalde
-- hij ze allebei, dan leverde de tweede niets op: entitlements is uniek op
-- (user_id, course_slug), dus die betaling herwees alleen attempt_id. Geld weg,
-- niets ervoor terug — en tot deze migratie was er ook geen terugbetaalroute
-- om dat mee recht te zetten.
--
-- EERST OPRUIMEN. Een unique index kan niet gebouwd worden als er al dubbelen
-- staan, en die kunnen er zijn: afgebroken checkouts blijven als 'pending'
-- achter tot Mollie's expiry-webhook langskomt (zie docs/openstaand.md §6).
-- We houden per (gebruiker, cursus) de nieuwste pending en zetten de oudere op
-- 'expired' — dat is wat er feitelijk mee gebeurd is, en het is de status die
-- de checkout zelf ook zet als Mollie zegt dat een poging verlopen is.
-- Bewijs blijft staan: de rijen worden niet verwijderd, alleen afgesloten.
UPDATE "payment_attempts" a
SET "status" = 'expired'
WHERE a."status" = 'pending'
  AND EXISTS (
    SELECT 1 FROM "payment_attempts" b
    WHERE b."user_id" = a."user_id"
      AND b."course_slug" = a."course_slug"
      AND b."status" = 'pending'
      AND (
        b."created_at" > a."created_at"
        OR (b."created_at" = a."created_at" AND b."id" > a."id")
      )
  );
--> statement-breakpoint
-- Partieel: alleen pending-rijen doen mee. Afgeronde pogingen
-- (paid/failed/expired/canceled/mismatch/refunded) mogen onbeperkt naast
-- elkaar blijven staan — de tabel is append-only, en een heraankoop na
-- terugbetaling moet gewoon kunnen.
CREATE UNIQUE INDEX "payment_attempts_open_per_course_idx"
  ON "payment_attempts" USING btree ("user_id","course_slug")
  WHERE "payment_attempts"."status" = 'pending';
