import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { EmployeeDto } from "../../application/dtos/employee.dto";

type EmployeesTableProps = {
	employees: EmployeeDto[];
};

export function EmployeesTable({ employees }: EmployeesTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID reloj</TableHead>
					<TableHead>ID externo</TableHead>
					<TableHead>Nombre</TableHead>
					<TableHead>Estado</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{employees.map((employee) => (
					<TableRow key={employee.id}>
						<TableCell>{employee.deviceUserId}</TableCell>
						<TableCell>{employee.externalId}</TableCell>
						<TableCell>{employee.name}</TableCell>
						<TableCell>{employee.active ? "Activo" : "Inactivo"}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
