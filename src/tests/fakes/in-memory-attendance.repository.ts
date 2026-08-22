import type {
	Attendance,
	AttendanceMarkType,
} from "@/modules/attendance/domain/attendance";
import type { AttendanceRepository } from "@/modules/attendance/domain/repositories/attendance.repository";

export class InMemoryAttendanceRepository implements AttendanceRepository {
	public attendances: Attendance[] = [];

	async existsByEmployeeAndDate(
		employeeId: string,
		occurredAt: Date,
		markType: AttendanceMarkType,
	): Promise<boolean> {
		return this.attendances.some(
			(attendance) =>
				attendance.employeeId === employeeId &&
				attendance.occurredAt.getTime() === occurredAt.getTime() &&
				attendance.markType === markType,
		);
	}

	async create(attendance: Attendance): Promise<void> {
		this.attendances.push(attendance);
	}
}
