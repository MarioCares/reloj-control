import type { EmployeeDto } from "@/modules/employees/application/dtos/employee.dto";
import type { ImportEmployeesResult } from "@/modules/employees/application/dtos/import-employees-result.dto";
import { api } from "@/shared/http/api-client";
import type { ApiSuccessResponse } from "@/shared/http/api-types";

export async function listEmployees(): Promise<EmployeeDto[]> {
	const response =
		await api.get<ApiSuccessResponse<EmployeeDto[]>>("/employees");
	return response.data.data;
}

export async function importEmployees(
	file: File,
): Promise<ImportEmployeesResult> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await api.post<ApiSuccessResponse<ImportEmployeesResult>>(
		"/employees/import",
		formData,
	);
	return response.data.data;
}
