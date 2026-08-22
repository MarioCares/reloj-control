import { beforeEach, describe, expect, it } from "vitest";
import { ImportAttendancesUseCase } from "@/modules/attendance/application/use-cases/import-attendances-use-case";
import { Attendance } from "@/modules/attendance/domain/attendance";
import { Employee } from "@/modules/employees/domain/employee";
import { InMemoryAttendanceRepository } from "@/tests/fakes/in-memory-attendance.repository";
import { InMemoryEmployeeRepository } from "@/tests/fakes/in-memory-employee.repository";

describe("ImportAttendancesUseCase", () => {
	let employeeRepository: InMemoryEmployeeRepository;
	let attendanceRepository: InMemoryAttendanceRepository;
	let useCase: ImportAttendancesUseCase;

	beforeEach(() => {
		employeeRepository = new InMemoryEmployeeRepository();
		attendanceRepository = new InMemoryAttendanceRepository();

		useCase = new ImportAttendancesUseCase(
			employeeRepository,
			attendanceRepository,
		);
	});

	it("creates an attendance record", async () => {
		const employee = Employee.create({
			id: crypto.randomUUID(),
			deviceUserId: 1,
			externalId: "1",
			name: "Employee One",
			active: true,
		});

		employeeRepository.employees.push(employee);

		const occurredAt = "2026-06-19T17:00:04";

		const result = await useCase.execute([
			{
				deviceUserId: 1,
				occurredAt,
				field3: 1,
				markType: 0,
				field5: 15,
				field6: 0,
			},
		]);

		expect(result).toEqual({
			total: 1,
			created: 1,
			duplicates: 0,
			unknownEmployees: 0,
		});

		expect(attendanceRepository.attendances).toHaveLength(1);

		const attendance = attendanceRepository.attendances[0];

		expect(attendance.employeeId).toBe(employee.id);
		expect(attendance.markType).toBe("entry");
		expect(attendance.occurredAt).toEqual(new Date("2026-06-19T21:00:04.000Z"));
	});

	it("maps mark type 1 as exit", async () => {
		const employee = Employee.create({
			id: crypto.randomUUID(),
			deviceUserId: 1,
			externalId: "1",
			name: "Employee One",
			active: true,
		});

		employeeRepository.employees.push(employee);

		await useCase.execute([
			{
				deviceUserId: 1,
				occurredAt: "2026-06-19T17:00:04",
				field3: 1,
				markType: 1,
				field5: 15,
				field6: 0,
			},
		]);

		expect(attendanceRepository.attendances[0].markType).toBe("exit");
	});

	it("ignores a duplicate attendance record", async () => {
		const employee = Employee.create({
			id: crypto.randomUUID(),
			deviceUserId: 1,
			externalId: "1",
			name: "Employee One",
			active: true,
		});

		employeeRepository.employees.push(employee);

		const occurredAt = new Date("2026-06-19T21:00:04.000Z");

		attendanceRepository.attendances.push(
			Attendance.create({
				id: crypto.randomUUID(),
				employeeId: employee.id,
				occurredAt,
				markType: "entry",
			}),
		);

		const result = await useCase.execute([
			{
				deviceUserId: 1,
				occurredAt: "2026-06-19T17:00:04",
				field3: 1,
				markType: 0,
				field5: 15,
				field6: 0,
			},
		]);

		expect(result).toEqual({
			total: 1,
			created: 0,
			duplicates: 1,
			unknownEmployees: 0,
		});

		expect(attendanceRepository.attendances).toHaveLength(1);
	});

	it("ignores attendance records for unknown employees", async () => {
		const result = await useCase.execute([
			{
				deviceUserId: 999,
				occurredAt: "2026-06-19T17:00:04",
				field3: 1,
				markType: 0,
				field5: 15,
				field6: 0,
			},
		]);

		expect(result).toEqual({
			total: 1,
			created: 0,
			duplicates: 0,
			unknownEmployees: 1,
		});

		expect(attendanceRepository.attendances).toHaveLength(0);
	});

	it("throws when mark type is unsupported", async () => {
		const employee = Employee.create({
			id: crypto.randomUUID(),
			deviceUserId: 1,
			externalId: "1",
			name: "Employee One",
			active: true,
		});

		employeeRepository.employees.push(employee);

		await expect(
			useCase.execute([
				{
					deviceUserId: 1,
					occurredAt: "2026-06-19T17:00:04",
					field3: 1,
					markType: 2,
					field5: 15,
					field6: 0,
				},
			]),
		).rejects.toThrow("Unsupported attendance mark type: 2");
	});
});
