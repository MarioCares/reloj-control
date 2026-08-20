import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { CardSmall } from "@/shared/ui/cards/small-card";
import { useEmployees } from "../hooks/employees.hooks";

export function EmployeesDashboardCard() {
	const navigate = useNavigate();
	const tagQuery = useEmployees();

	return (
		<CardSmall
			isLoading={tagQuery.isPending}
			title="Empleados"
			description="Gestionar empleados que realizan marcas en reloj control"
			actionText="Administrar empleados"
			onClick={() => navigate({ to: "/admin/import_employees" })}
		>
			<div className="flex flex-wrap gap-2">
				<Badge variant="outline">
					{(tagQuery.data ?? []).length} empleados registrados
				</Badge>
			</div>
		</CardSmall>
	);
}
