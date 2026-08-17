import { Hono } from "hono";
import { describe, expect, test, vi } from "vitest";
import type { Variables } from "@/types/variables";
import { createRequireAuth } from "./require-auth";

describe("requireAuth middleware", () => {
	test("responds 401 Unauthorized when there is no active session", async () => {
		const getSession = vi.fn(async () => null);
		const app = new Hono<{ Bindings: Env; Variables: Variables }>();

		app.use("/protected", createRequireAuth(getSession));
		app.get("/protected", (c) =>
			c.json({
				success: true,
			}),
		);

		const response = await app.request("/protected");

		expect(response.status).toBe(401);
		await expect(response.json()).resolves.toEqual({
			success: false,
			message: "No autenticado.",
		});
		expect(getSession).toHaveBeenCalledTimes(1);
	});

	test("maps the session user into AuthenticatedUser and stores it in context", async () => {
		const sessionUser = {
			id: "user-123",
			name: "Ada Lovelace",
			email: "ada@example.com",
			emailVerified: true,
			image: undefined,
		};
		const getSession = vi.fn(async () => ({
			user: sessionUser,
		}));
		const app = new Hono<{ Bindings: Env; Variables: Variables }>();

		app.use("/protected", createRequireAuth(getSession));
		app.get("/protected", (c) =>
			c.json({
				success: true,
				user: c.get("user"),
			}),
		);

		const response = await app.request("/protected");

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			success: true,
			user: {
				id: "user-123",
				name: "Ada Lovelace",
				email: "ada@example.com",
				emailVerified: true,
				image: null,
				role: "member",
			},
		});
		expect(getSession).toHaveBeenCalledTimes(1);
	});
});
