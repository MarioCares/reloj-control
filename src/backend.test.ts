import { expect, test } from "vitest";
import app from ".";

test("GET /api/v1/health devuelve estado 200 y JSON correcto", async () => {
	const res = await app.request("/api/v1/health");
	expect(res.status).toBe(200);

	const data = await res.json();
	expect(data).toEqual({
		status: "healthy",
		runtime: "Cloudflare Worker",
	});
});
