import type { Attendance } from "../attendance";

export interface AttendanceRepository {
	existsByEmployeeAndDate(
		employeeId: string,
		occurredAt: Date,
		markType: Attendance["markType"],
	): Promise<boolean>;

	create(attendance: Attendance): Promise<void>;
}
