import type { Context, MiddlewareHandler } from "hono";
import { validateEnv } from "@/config/env";
import type { AppEnv } from "@/types/app-env";
import { toAuthenticatedUser } from "../mappers/authenticated-user.mapper";
import { BetterAuthProvider } from "../providers/better-auth.provider";

type BetterAuthUser = Parameters<typeof toAuthenticatedUser>[0];

type Session = {
	user: BetterAuthUser;
} | null;

type GetSession = (context: Context<AppEnv>) => Promise<Session>;

async function getSessionFromAuth(context: Context<AppEnv>) {
	const env = validateEnv(context.env);

	const provider = new BetterAuthProvider(
		context.get("db"),
		env.BETTER_AUTH_URL,
		env.BETTER_AUTH_SECRET,
	);

	return await provider.getSession(context.req.raw.headers);
}

export function createRequireAuth(
	getSession: GetSession = getSessionFromAuth,
): MiddlewareHandler<AppEnv> {
	return async (c, next) => {
		const session = await getSession(c);

		if (!session) {
			return c.json(
				{
					success: false,
					message: "No autenticado.",
				},
				401,
			);
		}

		c.set("user", toAuthenticatedUser(session.user));

		await next();
	};
}

export const requireAuth = createRequireAuth();
