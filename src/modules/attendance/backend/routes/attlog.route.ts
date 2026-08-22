import { Hono } from "hono";
import type { AppEnv } from "@/types/app-env";
import type { ImportedAttendanceRecord } from "../../application/dtos/import-attlog";
import { FaceT2AttendanceDatParser } from "../../infrastructure/face-t2/face-t2-attlog.parser";
import { attendanceComposition } from "../composition/attendance.composition";

export const attendanceRoute = new Hono<AppEnv>();

const parser = new FaceT2AttendanceDatParser();

attendanceRoute.post("/import", async (c) => {
	const formData = await c.req.formData();

	const file = formData.get("file");

	if (!(file instanceof File)) {
		return c.json(
			{
				success: false,
				message: "El archivo de marcaciones es obligatorio.",
			},
			400,
		);
	}

	let records: ImportedAttendanceRecord[];

	try {
		const buffer = await file.arrayBuffer();

		records = parser.parse(new Uint8Array(buffer));
	} catch {
		return c.json(
			{
				success: false,
				message: "El archivo de marcaciones no es válido.",
			},
			400,
		);
	}

	const { importAttendances } = attendanceComposition(c.get("db"));

	const result = await importAttendances.execute(records);

	return c.json(
		{
			success: true,
			data: result,
		},
		200,
	);
});
