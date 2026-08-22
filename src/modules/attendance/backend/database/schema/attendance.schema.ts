import {
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { employees } from "@/modules/employees/backend/database/schema/employee.schema";

export const attendances = pgTable(
	"attendances",
	{
		id: text("id").primaryKey(),

		employeeId: text("employee_id")
			.notNull()
			.references(() => employees.id),

		occurredAt: timestamp("occurred_at", {
			withTimezone: true,
		}).notNull(),

		markType: text("mark_type").notNull(),

		createdAt: timestamp("created_at", {
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("attendances_employee_date_mark_unique").on(
			table.employeeId,
			table.occurredAt,
			table.markType,
		),

		index("attendances_employee_id_idx").on(table.employeeId),

		index("attendances_occurred_at_idx").on(table.occurredAt),
	],
);
