import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireSession } from "@/modules/identity/frontend/guards/require-session";
import { AuthenticatedNavbar } from "@/shared/ui/navigation/authenticated-navbar";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: requireSession,
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<div className="min-h-screen">
			<AuthenticatedNavbar />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
