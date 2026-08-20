import { createFileRoute } from "@tanstack/react-router";
import { ImportEmployeesPage } from "@/modules/employees/frontend/import-employees-page";

export const Route = createFileRoute("/_authenticated/admin/import_employees")({
	component: ImportEmployeesPage,
});
