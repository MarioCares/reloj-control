import { Employee } from "../../domain/employee";
import type { EmployeeRepository } from "../../domain/repositories/employee.repository";
import type { ImportedClockUser } from "../dtos/imported-clock-user";

export type ImportEmployeesResult = {
	total: number;
	created: number;
	updated: number;
	unchanged: number;
};

export class ImportEmployeesUseCase {
	constructor(private readonly employeeRepository: EmployeeRepository) {}

	async execute(
		importedUsers: ImportedClockUser[],
	): Promise<ImportEmployeesResult> {
		const result: ImportEmployeesResult = {
			total: importedUsers.length,
			created: 0,
			updated: 0,
			unchanged: 0,
		};

		for (const importedUser of importedUsers) {
			const employee = await this.employeeRepository.findByDeviceUserId(
				importedUser.deviceUserId,
			);

			if (!employee) {
				await this.createEmployee(importedUser);
				result.created++;

				continue;
			}

			if (!this.hasChanged(employee, importedUser)) {
				result.unchanged++;

				continue;
			}

			employee.updateFromClock({
				name: importedUser.name,
				externalId: importedUser.externalId,
				active: importedUser.enabled,
			});

			await this.employeeRepository.update(employee);

			result.updated++;
		}

		return result;
	}

	private async createEmployee(importedUser: ImportedClockUser): Promise<void> {
		const employee = Employee.create({
			id: crypto.randomUUID(),
			deviceUserId: importedUser.deviceUserId,
			externalId: importedUser.externalId,
			name: importedUser.name,
			active: importedUser.enabled,
		});

		await this.employeeRepository.create(employee);
	}

	private hasChanged(
		employee: Employee,
		importedUser: ImportedClockUser,
	): boolean {
		return (
			employee.name !== importedUser.name.trim() ||
			employee.externalId !== importedUser.externalId.trim() ||
			employee.active !== importedUser.enabled
		);
	}
}
