import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url(),
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(32),
});

export function validateEnv(env: unknown) {
	return envSchema.parse(env);
}
