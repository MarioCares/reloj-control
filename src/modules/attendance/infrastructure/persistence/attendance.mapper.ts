import type { attendances } from "../../backend/database/schema/attendance.schema";
import { Attendance } from "../../domain/attendance";

type AttendanceRow = typeof attendances.$inferSelect;

export function toDomain(row: AttendanceRow): Attendance {
	return Attendance.create({
		id: row.id,
		employeeId: row.employeeId,
		occurredAt: row.occurredAt,
		markType: row.markType as "entry" | "exit",
	});
}

export function toPersistence(attendance: Attendance) {
	return {
		id: attendance.id,
		employeeId: attendance.employeeId,
		occurredAt: attendance.occurredAt,
		markType: attendance.markType,
	};
}
