CREATE TABLE "attendances" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"mark_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendances_employee_date_mark_unique" ON "attendances" USING btree ("employee_id","occurred_at","mark_type");--> statement-breakpoint
CREATE INDEX "attendances_employee_id_idx" ON "attendances" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "attendances_occurred_at_idx" ON "attendances" USING btree ("occurred_at");