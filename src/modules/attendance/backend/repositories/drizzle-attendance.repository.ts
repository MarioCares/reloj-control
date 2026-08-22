import { and, eq } from "drizzle-orm";
import type { Database } from "@/shared/database/db";
import type { Attendance } from "../../domain/attendance";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository";
import { toPersistence } from "../../infrastructure/persistence/attendance.mapper";
import { attendances } from "../database/schema/attendance.schema";

export class DrizzleAttendanceRepository implements AttendanceRepository {
	constructor(private readonly db: Database) {}

	async existsByEmployeeAndDate(
		employeeId: string,
		occurredAt: Date,
		markType: Attendance["markType"],
	): Promise<boolean> {
		const [row] = await this.db
			.select({
				id: attendances.id,
			})
			.from(attendances)
			.where(
				and(
					eq(attendances.employeeId, employeeId),
					eq(attendances.occurredAt, occurredAt),
					eq(attendances.markType, markType),
				),
			)
			.limit(1);

		return Boolean(row);
	}

	async create(attendance: Attendance): Promise<void> {
		await this.db.insert(attendances).values(toPersistence(attendance));
	}
}
