CREATE TABLE "lesson_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"naam" text DEFAULT '' NOT NULL,
	"course_slug" text NOT NULL,
	"lesson_slug" text NOT NULL,
	"vraag" text NOT NULL,
	"antwoord" text,
	"status" text DEFAULT 'wachtend' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"answered_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "lesson_questions" ADD CONSTRAINT "lesson_questions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_questions_les_idx" ON "lesson_questions" USING btree ("course_slug","lesson_slug","status");--> statement-breakpoint
CREATE INDEX "lesson_questions_user_idx" ON "lesson_questions" USING btree ("user_id");