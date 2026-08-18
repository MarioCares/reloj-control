CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"device_user_id" integer NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "employees_device_user_id_unique" ON "employees" USING btree ("device_user_id");