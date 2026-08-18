import { eq } from "drizzle-orm";
import type { Database } from "@/shared/database/db";
import type { Employee } from "../../domain/employee";
import type { EmployeeRepository } from "../../domain/repositories/employee.repository";
import {
	toDomain,
	toPersistence,
} from "../../infrastructure/persistence/employee.mapper";
import { employees } from "../database/schema/employee.schema";

export class DrizzleEmployeeRepository implements EmployeeRepository {
	constructor(private readonly db: Database) {}

	async findByDeviceUserId(deviceUserId: number): Promise<Employee | null> {
		const [row] = await this.db
			.select()
			.from(employees)
			.where(eq(employees.deviceUserId, deviceUserId))
			.limit(1);

		return row ? toDomain(row) : null;
	}

	async create(employee: Employee): Promise<void> {
		await this.db.insert(employees).values(toPersistence(employee));
	}

	async update(employee: Employee): Promise<void> {
		const data = toPersistence(employee);

		await this.db
			.update(employees)
			.set({
				deviceUserId: data.deviceUserId,
				externalId: data.externalId,
				name: data.name,
				active: data.active,
				updatedAt: new Date(),
			})
			.where(eq(employees.id, employee.id));
	}

	async findAll(): Promise<Employee[]> {
		const rows = await this.db.select().from(employees).orderBy(employees.name);

		return rows.map(toDomain);
	}
}
