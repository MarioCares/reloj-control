import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireSession } from "@/modules/identity/frontend/guards/require-session";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: requireSession,
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return <Outlet />;
}
