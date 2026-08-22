import { Hono } from "hono";
import { validateEnv } from "./config/env";
import { attendanceRoute } from "./modules/attendance/backend/routes/attlog.route";
import { employeesRoute } from "./modules/employees/backend/routes/employee.route";
import { createAuth } from "./modules/identity/backend/auth/auth";
import { requireAuth } from "./modules/identity/backend/middleware/require-auth";
import { adminTestRoute } from "./modules/identity/backend/routes/admin-test.route";
import { createDb } from "./shared/database/db";
import type { Variables } from "./types/variables";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/api/v1/health", (c) => {
	return c.json({
		status: "healthy",
		runtime: "Cloudflare Worker",
	});
});

app.use("*", async (c, next) => {
	const env = validateEnv(c.env);
	const db = createDb(env.DATABASE_URL);
	c.set("db", db);
	await next();
});

app.onError((err, c) => {
	console.error(`[Error Centralizado]: ${err.message}`);
	return c.json(
		{
			success: false,
			message: "Ha ocurrido un error interno en el servidor del Edge.",
		},
		500,
	);
});

app.all("/api/v1/auth/*", async (c) => {
	const auth = createAuth(
		c.get("db"),
		c.env.BETTER_AUTH_URL,
		c.env.BETTER_AUTH_SECRET,
	);
	return auth.handler(c.req.raw);
});

app.get("/api/v1/protected/me", requireAuth, (c) => {
	const user = c.get("user");

	return c.json({
		success: true,
		user,
	});
});

app.route("/api/v1/admin", adminTestRoute);
app.route("/api/v1/employees", employeesRoute);
app.route("/api/v1/attendances", attendanceRoute);

export default app;
