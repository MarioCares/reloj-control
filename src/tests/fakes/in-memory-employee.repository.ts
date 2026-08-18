import type { Employee } from "@/modules/employees/domain/employee";
import type { EmployeeRepository } from "@/modules/employees/domain/repositories/employee.repository";

export class InMemoryEmployeeRepository implements EmployeeRepository {
	public employees: Employee[] = [];

	async findByDeviceUserId(deviceUserId: number): Promise<Employee | null> {
		return (
			this.employees.find(
				(employee) => employee.deviceUserId === deviceUserId,
			) ?? null
		);
	}

	async create(employee: Employee): Promise<void> {
		this.employees.push(employee);
	}

	async update(employee: Employee): Promise<void> {
		const index = this.employees.findIndex(
			(current) => current.id === employee.id,
		);

		if (index === -1) {
			throw new Error("Employee not found");
		}

		this.employees[index] = employee;
	}
}
