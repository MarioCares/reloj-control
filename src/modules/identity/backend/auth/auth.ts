import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Database } from "@/shared/database/db";

export function createAuth(db: Database, baseURL: string, secret: string) {
	return betterAuth({
		baseURL,
		secret,
		basePath: "/api/v1/auth",
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		emailAndPassword: {
			enabled: true,
		},
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: true,
					defaultValue: "member",
					input: false,
				},
			},
		},
	});
}
