import { redirect } from "@tanstack/react-router";
import { authClient } from "../auth-client";

type RequireSessionOptions = {
	location: {
		href: string;
	};
};

export async function requireSession({ location }: RequireSessionOptions) {
	const { data: session } = await authClient.getSession();

	if (!session) {
		throw redirect({
			to: "/login",
			search: {
				redirect: location.href,
			},
		});
	}

	return { session };
}
