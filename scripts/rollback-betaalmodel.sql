-- ------------------------------------------------------------------
-- Terugrolscript voor de betaalmodel-splitsing (docs/ontwerp-betaalmodel.md §3).
--
-- WANNEER: alleen als de omschakel-PR ná de deploy moet worden teruggedraaid.
-- De oude code leest en schrijft `purchases`; alles wat de nieuwe code
-- sindsdien in `payment_attempts` heeft gezet, kent die tabel niet. Dit
-- script kopieert dat verschil terug. Draai het HANDMATIG (psql of de Neon
-- SQL-editor, met de directe/unpooled verbinding), nádat de oude deploy weer
-- live staat. Het is nergens aan gekoppeld en draait dus nooit vanzelf.
--
-- HOE: `payment_attempts` kan meerdere rijen per gebruiker+cursus hebben,
-- `purchases` precies één. We kopiëren daarom per gebruiker+cursus alleen de
-- níéuwste poging, met een upsert op de unieke index — hetzelfde
-- laatste-schrijver-wint-gedrag dat de oude checkout zelf had. De nieuwe
-- tabellen blijven staan (ongebruikt, als bewijs); een eventueel later
-- opnieuw draaien van de omschakel-migratie vraagt dan wél handwerk, want
-- de backfill in 0004 is niet idempotent.
-- ------------------------------------------------------------------

INSERT INTO "purchases" ("id", "user_id", "course_slug", "mollie_payment_id", "status",
  "amount_cents", "currency", "withdrawal_waived_at", "consent_ip", "consent_terms_version",
  "created_at", "paid_at", "confirmation_sent_at", "order_number")
SELECT DISTINCT ON ("user_id", "course_slug")
  "id", "user_id", "course_slug", "mollie_payment_id", "status", "amount_cents", "currency",
  "withdrawal_waived_at", "consent_ip", "consent_terms_version", "created_at", "paid_at",
  "confirmation_sent_at", "order_number"
FROM "payment_attempts"
ORDER BY "user_id", "course_slug", "created_at" DESC
ON CONFLICT ("user_id", "course_slug") DO UPDATE SET
  "mollie_payment_id" = excluded."mollie_payment_id",
  "status" = excluded."status",
  "amount_cents" = excluded."amount_cents",
  "currency" = excluded."currency",
  "withdrawal_waived_at" = excluded."withdrawal_waived_at",
  "consent_ip" = excluded."consent_ip",
  "consent_terms_version" = excluded."consent_terms_version",
  "created_at" = excluded."created_at",
  "paid_at" = excluded."paid_at",
  "confirmation_sent_at" = excluded."confirmation_sent_at",
  "order_number" = excluded."order_number";

-- Controle achteraf: geen gebruiker+cursus uit de pogingen mag ontbreken.
-- Hoort 0 rijen terug te geven.
SELECT a."user_id", a."course_slug"
FROM "payment_attempts" a
LEFT JOIN "purchases" p
  ON p."user_id" = a."user_id" AND p."course_slug" = a."course_slug"
WHERE p."id" IS NULL;
