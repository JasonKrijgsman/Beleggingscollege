CREATE TABLE "entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_slug" text NOT NULL,
	"status" text DEFAULT 'actief' NOT NULL,
	"attempt_id" text NOT NULL,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"revoked_reason" text
);
--> statement-breakpoint
CREATE TABLE "order_counters" (
	"jaar" integer PRIMARY KEY NOT NULL,
	"laatste" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_slug" text NOT NULL,
	"mollie_payment_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"withdrawal_waived_at" timestamp,
	"consent_ip" text,
	"consent_terms_version" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	"confirmation_claimed_at" timestamp,
	"confirmation_sent_at" timestamp,
	"order_number" text,
	CONSTRAINT "payment_attempts_mollie_payment_id_unique" UNIQUE("mollie_payment_id"),
	CONSTRAINT "payment_attempts_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_attempt_id_payment_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_user_course_idx" ON "entitlements" USING btree ("user_id","course_slug");--> statement-breakpoint
CREATE INDEX "entitlements_user_idx" ON "entitlements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_attempts_user_course_idx" ON "payment_attempts" USING btree ("user_id","course_slug");--> statement-breakpoint
CREATE INDEX "payment_attempts_status_idx" ON "payment_attempts" USING btree ("status","created_at");--> statement-breakpoint
-- ------------------------------------------------------------------
-- Backfill (docs/ontwerp-betaalmodel.md §3): de bestaande purchases-rijen
-- meekopiëren in hetzelfde migratiebestand, zodat het in elke omgeving —
-- preview, productie, PGlite in de tests — automatisch en identiek gebeurt.
-- `purchases` zelf blijft onaangeroerd staan tot de contract-stap.
-- ------------------------------------------------------------------
-- Elke purchases-rij wordt één betaalpoging; het id blijft gelijk,
-- zodat oud en nieuw naast elkaar te controleren zijn.
INSERT INTO "payment_attempts" ("id", "user_id", "course_slug", "mollie_payment_id", "status",
  "amount_cents", "currency", "withdrawal_waived_at", "consent_ip", "consent_terms_version",
  "created_at", "paid_at", "confirmation_sent_at", "order_number")
SELECT "id", "user_id", "course_slug", "mollie_payment_id", "status", "amount_cents", "currency",
  "withdrawal_waived_at", "consent_ip", "consent_terms_version", "created_at", "paid_at",
  "confirmation_sent_at", "order_number"
FROM "purchases";--> statement-breakpoint
-- Elke betaalde aankoop wordt een actief recht.
INSERT INTO "entitlements" ("id", "user_id", "course_slug", "status", "attempt_id", "granted_at")
SELECT gen_random_uuid(), "user_id", "course_slug", 'actief', "id",
  coalesce("paid_at", "created_at")
FROM "purchases" WHERE "status" = 'paid';--> statement-breakpoint
-- Teller aansluiten op al uitgedeelde nummers, per jaar. Afwijkend van de
-- ontwerpnotitie (die telt met count(*) op created_at) seeden we met het
-- HOOGSTE al uitgedeelde volgnummer, gegroepeerd op het jaar ín het nummer:
-- gelijkwaardig zolang de reeks dicht is, veiliger als er ooit toch een gat
-- zit (dan zou count(*) een al bestaand nummer opnieuw uitdelen en knalt de
-- unieke index), en het jaar in het nummer is het paid-jaar — dat kan rond
-- een jaargrens afwijken van created_at.
INSERT INTO "order_counters" ("jaar", "laatste")
SELECT split_part("order_number", '-', 2)::int,
  max(split_part("order_number", '-', 3)::int)
FROM "purchases" WHERE "order_number" IS NOT NULL
GROUP BY 1;