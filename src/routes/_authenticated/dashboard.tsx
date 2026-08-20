import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { EmployeesDashboardCard } from "@/modules/employees/frontend/components/employees-dashboard-card";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const navigate = useNavigate();

	function goTo(page: string) {
		navigate({
			to: page,
		});
	}

	return (
		<div className="p-8 flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p>Acceso directo y métricas.</p>
			<Separator />
			<div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
				<EmployeesDashboardCard />
			</div>
		</div>
	);
}
