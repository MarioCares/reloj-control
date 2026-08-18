import type { employees } from "../../backend/database/schema/employee.schema";
import { Employee } from "../../domain/employee";

type EmployeeRow = typeof employees.$inferSelect;

export function toDomain(row: EmployeeRow): Employee {
	return Employee.create({
		id: row.id,
		deviceUserId: row.deviceUserId,
		externalId: row.externalId,
		name: row.name,
		active: row.active,
	});
}

export function toPersistence(employee: Employee) {
	return {
		id: employee.id,
		deviceUserId: employee.deviceUserId,
		externalId: employee.externalId,
		name: employee.name,
		active: employee.active,
	};
}
