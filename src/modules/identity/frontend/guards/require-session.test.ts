import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock, redirectMock } = vi.hoisted(() => ({
	getSessionMock: vi.fn(),
	redirectMock: vi.fn(),
}));

vi.mock("../auth-client", () => ({
	authClient: {
		getSession: getSessionMock,
	},
}));

vi.mock("@tanstack/react-router", () => ({
	redirect: redirectMock,
}));

describe("requireSession", () => {
	beforeEach(() => {
		getSessionMock.mockReset();
		redirectMock.mockReset();
		redirectMock.mockImplementation((options) => ({
			type: "redirect",
			...options,
		}));
	});

	it("returns the session when the user is authenticated", async () => {
		const session = {
			user: { id: "user-1" },
			session: { id: "session-1" },
		};
		getSessionMock.mockResolvedValue({ data: session });

		const { requireSession } = await import("./require-session");

		await expect(
			requireSession({
				location: {
					href: "/private",
				},
			}),
		).resolves.toEqual({ session });
		expect(redirectMock).not.toHaveBeenCalled();
	});

	it("redirects to login when the session is missing", async () => {
		getSessionMock.mockResolvedValue({ data: null });

		const { requireSession } = await import("./require-session");

		await expect(
			requireSession({
				location: {
					href: "/private?filter=recent",
				},
			}),
		).rejects.toEqual({
			type: "redirect",
			to: "/login",
			search: {
				redirect: "/private?filter=recent",
			},
		});
		expect(redirectMock).toHaveBeenCalledWith({
			to: "/login",
			search: {
				redirect: "/private?filter=recent",
			},
		});
	});
});
