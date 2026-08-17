import { beforeEach, describe, expect, test, vi } from "vitest";

const { authHandler, createAuthMock, createDbMock, mockDb } = vi.hoisted(() => {
	const mockDb = { kind: "db-stub" };
	const authHandler = vi.fn(async (request: Request) => {
		return new Response(
			JSON.stringify({
				pathname: new URL(request.url).pathname,
			}),
			{
				status: 200,
				headers: {
					"content-type": "application/json",
				},
			},
		);
	});

	return {
		authHandler,
		createAuthMock: vi.fn(() => ({
			handler: authHandler,
		})),
		createDbMock: vi.fn(() => mockDb),
		mockDb,
	};
});

vi.mock("./auth", () => ({
	createAuth: createAuthMock,
}));

vi.mock("../../../../shared/database/db", () => ({
	createDb: createDbMock,
}));

import app from "../../../..";

describe("Auth route mounting", () => {
	beforeEach(() => {
		authHandler.mockClear();
		createAuthMock.mockClear();
		createDbMock.mockClear();
	});

	test("mounts /api/v1/auth/* on Hono and delegates the request to Better Auth", async () => {
		const env = {
			DATABASE_URL: "https://database.example.com",
			BETTER_AUTH_URL: "https://auth.example.com",
			BETTER_AUTH_SECRET: "12345678901234567890123456789012",
		};

		const response = await app.request("/api/v1/auth/session", undefined, env);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			pathname: "/api/v1/auth/session",
		});

		expect(createDbMock).toHaveBeenCalledWith(env.DATABASE_URL);
		expect(createAuthMock).toHaveBeenCalledWith(
			mockDb,
			env.BETTER_AUTH_URL,
			env.BETTER_AUTH_SECRET,
		);
		expect(authHandler).toHaveBeenCalledTimes(1);
		expect(authHandler.mock.calls[0]?.[0]).toBeInstanceOf(Request);
	});
});
