import type { Employee } from "../../domain/employee";
import type { EmployeeRepository } from "../../domain/repositories/employee.repository";

export class ListEmployeesUseCase {
	constructor(private readonly employeeRepository: EmployeeRepository) {}

	async execute(): Promise<Employee[]> {
		return this.employeeRepository.findAll();
	}
}
