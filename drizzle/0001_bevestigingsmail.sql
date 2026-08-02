ALTER TABLE "purchases" ADD COLUMN "confirmation_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "order_number" text;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_order_number_unique" UNIQUE("order_number");