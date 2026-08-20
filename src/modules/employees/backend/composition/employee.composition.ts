import type { Database } from "@/shared/database/db";
import { ImportEmployeesUseCase } from "../../application/use-cases/import-employees.use-case";
import { ListEmployeesUseCase } from "../../application/use-cases/list-employees.use-case";
import { DrizzleEmployeeRepository } from "../repositories/drizzle-employee.repository";

export function employeeComposition(db: Database) {
	const employeeRepository = new DrizzleEmployeeRepository(db);

	return {
		importEmployees: new ImportEmployeesUseCase(employeeRepository),
		listEmployees: new ListEmployeesUseCase(employeeRepository),
	};
}
