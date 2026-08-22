import { fromZonedTime } from "date-fns-tz";
import type { EmployeeRepository } from "@/modules/employees/domain/repositories/employee.repository";
import { Attendance } from "../../domain/attendance";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository";
import type { ImportAttendancesResult } from "../dtos/import-attendances-result.dto";
import type { ImportedAttendanceRecord } from "../dtos/import-attlog";

export class ImportAttendancesUseCase {
	constructor(
		private readonly employeeRepository: EmployeeRepository,
		private readonly attendanceRepository: AttendanceRepository,
	) {}

	async execute(
		records: ImportedAttendanceRecord[],
	): Promise<ImportAttendancesResult> {
		const result: ImportAttendancesResult = {
			total: records.length,
			created: 0,
			duplicates: 0,
			unknownEmployees: 0,
		};

		for (const record of records) {
			const employee = await this.employeeRepository.findByDeviceUserId(
				record.deviceUserId,
			);

			if (!employee) {
				result.unknownEmployees++;
				continue;
			}

			const markType = this.mapMarkType(record.markType);

			const occurredAt = fromZonedTime(record.occurredAt, "America/Santiago");

			const exists = await this.attendanceRepository.existsByEmployeeAndDate(
				employee.id,
				occurredAt,
				markType,
			);

			if (exists) {
				result.duplicates++;
				continue;
			}

			const attendance = Attendance.create({
				id: crypto.randomUUID(),
				employeeId: employee.id,
				occurredAt,
				markType,
			});

			await this.attendanceRepository.create(attendance);

			result.created++;
		}

		return result;
	}

	private mapMarkType(markType: number): "entry" | "exit" {
		switch (markType) {
			case 0:
				return "entry";

			case 1:
				return "exit";

			default:
				throw new Error(`Unsupported attendance mark type: ${markType}`);
		}
	}
}
