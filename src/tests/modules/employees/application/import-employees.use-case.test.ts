import { beforeEach, describe, expect, it } from "vitest";
import { ImportEmployeesUseCase } from "@/modules/employees/application/use-cases/import-employees.use-case";
import { Employee } from "@/modules/employees/domain/employee";
import { InMemoryEmployeeRepository } from "@/tests/fakes/in-memory-employee.repository";

describe("ImportEmployeesUseCase", () => {
	let repository: InMemoryEmployeeRepository;
	let useCase: ImportEmployeesUseCase;

	beforeEach(() => {
		repository = new InMemoryEmployeeRepository();
		useCase = new ImportEmployeesUseCase(repository);
	});

	it("creates a new employee", async () => {
		const result = await useCase.execute([
			{
				deviceUserId: 1,
				externalId: "1001",
				name: "Mario Cares",
				privilege: 0,
				enabled: true,
			},
		]);

		expect(result).toEqual({
			total: 1,
			created: 1,
			updated: 0,
			unchanged: 0,
		});

		expect(repository.employees).toHaveLength(1);

		expect(repository.employees[0]).toMatchObject({
			deviceUserId: 1,
			externalId: "1001",
			name: "Mario Cares",
			active: true,
		});
	});

	it("updates an employee when clock data changed", async () => {
		repository.employees.push(
			Employee.create({
				id: crypto.randomUUID(),
				deviceUserId: 1,
				externalId: "1001",
				name: "Mario",
				active: true,
			}),
		);

		const result = await useCase.execute([
			{
				deviceUserId: 1,
				externalId: "1001",
				name: "Mario Cares",
				privilege: 0,
				enabled: true,
			},
		]);

		expect(result).toEqual({
			total: 1,
			created: 0,
			updated: 1,
			unchanged: 0,
		});

		expect(repository.employees[0].name).toBe("Mario Cares");
	});

	it("does not update an employee when data has not changed", async () => {
		repository.employees.push(
			Employee.create({
				id: crypto.randomUUID(),
				deviceUserId: 1,
				externalId: "1001",
				name: "Mario Cares",
				active: true,
			}),
		);

		const result = await useCase.execute([
			{
				deviceUserId: 1,
				externalId: "1001",
				name: "Mario Cares",
				privilege: 0,
				enabled: true,
			},
		]);

		expect(result).toEqual({
			total: 1,
			created: 0,
			updated: 0,
			unchanged: 1,
		});

		expect(repository.employees).toHaveLength(1);
	});

	it("imports a mix of new, updated and unchanged employees", async () => {
		repository.employees.push(
			Employee.create({
				id: crypto.randomUUID(),
				deviceUserId: 1,
				externalId: "1001",
				name: "Employee One",
				active: true,
			}),
			Employee.create({
				id: crypto.randomUUID(),
				deviceUserId: 2,
				externalId: "1002",
				name: "Old Name",
				active: true,
			}),
		);

		const result = await useCase.execute([
			{
				deviceUserId: 1,
				externalId: "1001",
				name: "Employee One",
				privilege: 0,
				enabled: true,
			},
			{
				deviceUserId: 2,
				externalId: "1002",
				name: "New Name",
				privilege: 0,
				enabled: true,
			},
			{
				deviceUserId: 3,
				externalId: "1003",
				name: "Employee Three",
				privilege: 0,
				enabled: true,
			},
		]);

		expect(result).toEqual({
			total: 3,
			created: 1,
			updated: 1,
			unchanged: 1,
		});

		expect(repository.employees).toHaveLength(3);
	});
});
