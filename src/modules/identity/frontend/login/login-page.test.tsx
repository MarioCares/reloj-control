// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./login-form", () => ({
	LoginForm: () => <div data-testid="login-form">Login form</div>,
}));

describe("LoginPage", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the login page copy and form container", async () => {
		const { LoginPage } = await import("./login-page");

		render(<LoginPage />);

		expect(
			screen.getByRole("heading", { name: /iniciar sesión/i }),
		).toBeTruthy();
		expect(
			screen.getByText(
				/ingresa tus credenciales para acceder a la plataforma/i,
			),
		).toBeTruthy();
		expect(screen.getByTestId("login-form")).toBeTruthy();
	});
});
