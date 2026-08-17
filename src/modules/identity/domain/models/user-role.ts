export const userRoles = ["admin", "member"] as const;

export type UserRole = (typeof userRoles)[number];

export const defaultUserRole: UserRole = "member";

export function isUserRole(value: unknown): value is UserRole {
	return typeof value === "string" && userRoles.includes(value as UserRole);
}
