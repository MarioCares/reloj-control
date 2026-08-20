import { useState } from "react";
import { EmployeesTable } from "./components/employees-table";
import { EmployeesToolbar } from "./components/employees-toolbar";
import { ImportEmployeesDialog } from "./dialogs/import-employees.dialog";
import type { ImportEmployeesFormValues } from "./forms/import-employee-form.schema";
import { useEmployees, useImportEmployees } from "./hooks/employees.hooks";

export function ImportEmployeesPage() {
	const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

	const employeesQuery = useEmployees();
	const importEmployees = useImportEmployees();

	async function handleImportEmployees(values: ImportEmployeesFormValues) {
		await importEmployees.mutateAsync(values.file);
	}

	const response = importEmployees.data;

	if (employeesQuery.isPending) {
		return <div className="p-6">Cargando empleados...</div>;
	}

	if (employeesQuery.isError) {
		return <div className="p-6">No fue posible cargar los empleados.</div>;
	}

	return (
		<main className="space-y-6 p-6">
			<EmployeesToolbar onImport={() => setIsImportDialogOpen(true)} />

			<EmployeesTable employees={employeesQuery.data ?? []} />

			<ImportEmployeesDialog
				isPending={importEmployees.isPending}
				response={response}
				errorMessage={importEmployees.error?.message}
				open={isImportDialogOpen}
				onOpenChange={setIsImportDialogOpen}
				onSubmit={handleImportEmployees}
			/>
		</main>
	);
}
