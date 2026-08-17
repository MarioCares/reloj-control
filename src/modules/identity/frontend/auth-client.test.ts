import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAuthClientMock } = vi.hoisted(() => ({
	createAuthClientMock: vi.fn(),
}));

vi.mock("better-auth/react", () => ({
	createAuthClient: createAuthClientMock,
}));

describe("authClient", () => {
	beforeEach(() => {
		createAuthClientMock.mockReset();
	});

	it("creates the auth client with the expected auth base path", async () => {
		const client = { signIn: {} };
		createAuthClientMock.mockReturnValue(client);

		const { authClient } = await import("./auth-client");

		expect(createAuthClientMock).toHaveBeenCalledWith({
			basePath: "/api/v1/auth",
		});
		expect(authClient).toBe(client);
	});
});
