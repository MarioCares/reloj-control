import type { UserRole } from "./user-role";

export interface AuthenticatedUser {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	role: UserRole;
}
