import { DrizzleEmployeeRepository } from "@/modules/employees/backend/repositories/drizzle-employee.repository";
import type { Database } from "@/shared/database/db";
import { ImportAttendancesUseCase } from "../../application/use-cases/import-attendances-use-case";
import { DrizzleAttendanceRepository } from "../repositories/drizzle-attendance.repository";

export function attendanceComposition(db: Database) {
	const attendanceRepository = new DrizzleAttendanceRepository(db);
	const employeeRepository = new DrizzleEmployeeRepository(db);

	return {
		importAttendances: new ImportAttendancesUseCase(
			employeeRepository,
			attendanceRepository,
		),
	};
}
