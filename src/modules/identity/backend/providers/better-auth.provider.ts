import { createAuth } from "@/modules/identity/backend/auth/auth";
import type { Database } from "@/shared/database/db";

export class BetterAuthProvider {
	private readonly auth;

	constructor(db: Database, baseURL: string, secret: string) {
		this.auth = createAuth(db, baseURL, secret);
	}

	async getSession(headers: Headers) {
		return this.auth.api.getSession({
			headers,
		});
	}
}
