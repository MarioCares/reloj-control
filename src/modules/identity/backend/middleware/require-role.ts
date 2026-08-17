import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "@/types/app-env";
import type { UserRole } from "../../domain/models/user-role";

export function requireRole(
	allowedRoles: ReadonlyArray<UserRole>,
): MiddlewareHandler<AppEnv> {
	return async (c, next) => {
		const user = c.get("user");

		if (!user) {
			return c.json(
				{
					success: false,
					message: "No autenticado.",
				},
				401,
			);
		}

		if (!allowedRoles.includes(user.role)) {
			return c.json(
				{
					success: false,
					message: "No autorizado.",
				},
				403,
			);
		}

		await next();
	};
}
