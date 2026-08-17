import type { AuthenticatedUser } from "../../domain/models/authenticated-user";
import { defaultUserRole, isUserRole } from "../../domain/models/user-role";

type BetterAuthUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	role?: unknown;
};

export function toAuthenticatedUser(user: BetterAuthUser): AuthenticatedUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		image: user.image ?? null,
		role: isUserRole(user.role) ? user.role : defaultUserRole,
	};
}
