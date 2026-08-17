// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { navigateMock, signInEmailMock, useNavigateMock, useSearchMock } =
	vi.hoisted(() => ({
		navigateMock: vi.fn(),
		signInEmailMock: vi.fn(),
		useNavigateMock: vi.fn(),
		useSearchMock: vi.fn(),
	}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: useNavigateMock,
	useSearch: useSearchMock,
}));

vi.mock("../auth-client", () => ({
	authClient: {
		signIn: {
			email: signInEmailMock,
		},
	},
}));

describe("LoginForm", () => {
	beforeEach(() => {
		navigateMock.mockReset();
		signInEmailMock.mockReset();
		useNavigateMock.mockReset();
		useSearchMock.mockReset();

		useNavigateMock.mockReturnValue(navigateMock);
		useSearchMock.mockReturnValue({});
	});

	afterEach(() => {
		cleanup();
	});

	it("validates required fields before calling authClient", async () => {
		const user = userEvent.setup();
		const { LoginForm } = await import("./login-form");

		render(<LoginForm />);

		await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

		expect(await screen.findByText("Ingresa un email válido.")).toBeTruthy();
		expect(await screen.findByText("Ingresa tu contraseña.")).toBeTruthy();
		expect(signInEmailMock).not.toHaveBeenCalled();
		expect(navigateMock).not.toHaveBeenCalled();
	});

	it("submits credentials and redirects to the requested route", async () => {
		const user = userEvent.setup();
		const { LoginForm } = await import("./login-form");
		signInEmailMock.mockResolvedValue({ error: null });
		useSearchMock.mockReturnValue({ redirect: "/panel" });

		render(<LoginForm />);

		await user.type(screen.getByLabelText(/email/i), "user@example.com");
		await user.type(screen.getByLabelText(/contraseña/i), "secret");
		await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

		await waitFor(() => {
			expect(signInEmailMock).toHaveBeenCalledWith({
				email: "user@example.com",
				password: "secret",
			});
		});
		await waitFor(() => {
			expect(navigateMock).toHaveBeenCalledWith({
				to: "/panel",
				replace: true,
			});
		});
	});

	it("shows the auth error and avoids navigation when sign in fails", async () => {
		const user = userEvent.setup();
		const { LoginForm } = await import("./login-form");
		signInEmailMock.mockResolvedValue({
			error: {
				message: "Credenciales inválidas.",
			},
		});

		render(<LoginForm />);

		await user.type(screen.getByLabelText(/email/i), "user@example.com");
		await user.type(screen.getByLabelText(/contraseña/i), "bad-password");
		await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

		expect(await screen.findByText("Credenciales inválidas.")).toBeTruthy();
		expect(navigateMock).not.toHaveBeenCalled();
	});
});
