import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "@/modules/identity/frontend/login/login-page";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});
