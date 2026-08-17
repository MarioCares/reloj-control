import { Hono } from "hono";
import type { AppEnv } from "@/types/app-env";
import { requireAuth } from "../middleware/require-auth";
import { requireRole } from "../middleware/require-role";

export const adminTestRoute = new Hono<AppEnv>();

adminTestRoute.get(
	"/dashboard-test",
	requireAuth,
	requireRole(["admin"]),
	(c) => {
		const user = c.get("user");

		return c.json({
			success: true,
			message: "Acceso administrativo permitido.",
			user,
		});
	},
);
