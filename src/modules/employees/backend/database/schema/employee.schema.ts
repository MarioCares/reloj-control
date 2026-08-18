import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const employees = pgTable(
	"employees",
	{
		id: text("id").primaryKey(),

		deviceUserId: integer("device_user_id").notNull(),

		externalId: text("external_id").notNull(),

		name: text("name").notNull(),

		active: boolean("active").notNull().default(true),

		createdAt: timestamp("created_at", {
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),

		updatedAt: timestamp("updated_at", {
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("employees_device_user_id_unique").on(table.deviceUserId),
	],
);
