CREATE TABLE "newsletter_signups" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"user_id" text,
	"source" text NOT NULL,
	"consented_at" timestamp DEFAULT now() NOT NULL,
	"consent_ip" text,
	"confirmed_at" timestamp,
	"unsubscribed_at" timestamp,
	CONSTRAINT "newsletter_signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "newsletter_signups" ADD CONSTRAINT "newsletter_signups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;