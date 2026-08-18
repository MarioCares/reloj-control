import type { Employee } from "../employee";

export interface EmployeeRepository {
	findByDeviceUserId(deviceUserId: number): Promise<Employee | null>;
	create(employee: Employee): Promise<void>;
	update(employee: Employee): Promise<void>;
	findAll(): Promise<Employee[]>;
}
