import type { AuthenticatedUser } from "@/modules/identity/domain/models/authenticated-user";
import type { Database } from "@/shared/database/db";

export type Variables = {
	db: Database;
	user?: AuthenticatedUser;
};
