import { beforeEach, describe, expect, test, vi } from "vitest";

const { createAuthMock, createDbMock, getSessionMock, handlerMock, mockDb } =
	vi.hoisted(() => {
		const mockDb = { kind: "db-stub" };

		return {
			createAuthMock: vi.fn(() => ({
				api: {
					getSession: getSessionMock,
				},
				handler: handlerMock,
			})),
			createDbMock: vi.fn(() => mockDb),
			getSessionMock: vi.fn(),
			handlerMock: vi.fn(async () => new Response(null, { status: 200 })),
			mockDb,
		};
	});

vi.mock("./modules/identity/backend/auth/auth", () => ({
	createAuth: createAuthMock,
}));

vi.mock("./shared/database/db", () => ({
	createDb: createDbMock,
}));

import app from "./index";

describe("GET /api/v1/protected/me", () => {
	const env = {
		DATABASE_URL: "https://database.example.com",
		BETTER_AUTH_URL: "https://auth.example.com",
		BETTER_AUTH_SECRET: "12345678901234567890123456789012",
	};

	beforeEach(() => {
		createAuthMock.mockClear();
		createDbMock.mockClear();
		getSessionMock.mockReset();
		handlerMock.mockClear();
	});

	test("responds 401 Unauthorized when there is no session", async () => {
		getSessionMock.mockResolvedValueOnce(null);

		const response = await app.request("/api/v1/protected/me", undefined, env);

		expect(response.status).toBe(401);
		await expect(response.json()).resolves.toEqual({
			success: false,
			message: "No autenticado.",
		});
		expect(createDbMock).toHaveBeenCalledWith(env.DATABASE_URL);
		expect(createAuthMock).toHaveBeenCalledWith(
			mockDb,
			env.BETTER_AUTH_URL,
			env.BETTER_AUTH_SECRET,
		);
		expect(getSessionMock).toHaveBeenCalledTimes(1);
	});

	test("responds 200 OK and returns the mapped AuthenticatedUser when the session is valid", async () => {
		getSessionMock.mockResolvedValueOnce({
			user: {
				id: "user-456",
				name: "Grace Hopper",
				email: "grace@example.com",
				emailVerified: false,
				image: undefined,
			},
		});

		const response = await app.request("/api/v1/protected/me", undefined, env);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			success: true,
			user: {
				id: "user-456",
				name: "Grace Hopper",
				email: "grace@example.com",
				emailVerified: false,
				image: null,
				role: "member",
			},
		});
		expect(createDbMock).toHaveBeenCalledWith(env.DATABASE_URL);
		expect(createAuthMock).toHaveBeenCalledWith(
			mockDb,
			env.BETTER_AUTH_URL,
			env.BETTER_AUTH_SECRET,
		);
		expect(getSessionMock).toHaveBeenCalledTimes(1);
	});
});
