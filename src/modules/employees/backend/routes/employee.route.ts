import { Hono } from "hono";
import type { AppEnv } from "@/types/app-env";
import type { ImportedClockUser } from "../../application/dtos/imported-clock-user";
import { FaceT2UserDatParser } from "../../infrastructure/face-t2/face-t2-user-dat.parser";
import { toEmployeeDto } from "../../infrastructure/persistence/employee.mapper";
import { employeeComposition } from "../composition/employee.composition";

export const employeesRoute = new Hono<AppEnv>();

const parser = new FaceT2UserDatParser();

employeesRoute.post("/import", async (c) => {
	const formData = await c.req.formData();

	const file = formData.get("file");

	if (!(file instanceof File)) {
		return c.json(
			{
				success: false,
				message: "Archivo user.dat es requerido",
			},
			400,
		);
	}

	let importedUsers: ImportedClockUser[];

	try {
		const buffer = await file.arrayBuffer();

		importedUsers = parser.parse(new Uint8Array(buffer));
	} catch {
		return c.json(
			{
				success: false,
				message: "Archivo user.dat inválido para Qwantec FACE-T2",
			},
			400,
		);
	}

	const { importEmployees } = employeeComposition(c.get("db"));

	const result = await importEmployees.execute(importedUsers);

	return c.json(
		{
			sucess: true,
			data: result,
		},
		200,
	);
});

employeesRoute.get("/", async (c) => {
	const { listEmployees } = employeeComposition(c.get("db"));
	const employees = await listEmployees.execute();

	return c.json(
		{
			success: true,
			data: employees.map(toEmployeeDto),
		},
		200,
	);
});
