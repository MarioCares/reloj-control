import { describe, expect, it } from "vitest";
import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
	it("accepts valid login credentials", () => {
		const result = loginSchema.safeParse({
			email: "user@example.com",
			password: "secret",
		});

		expect(result.success).toBe(true);
	});

	it("rejects an invalid email", () => {
		const result = loginSchema.safeParse({
			email: "invalid-email",
			password: "secret",
		});

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.message).toBe("Ingresa un email válido.");
	});

	it("requires a password", () => {
		const result = loginSchema.safeParse({
			email: "user@example.com",
			password: "",
		});

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.message).toBe("Ingresa tu contraseña.");
	});
});
