import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { FaceT2AttendanceDatParser } from "@/modules/attendance/infrastructure/face-t2/face-t2-attlog.parser";

describe("FaceT2AttendanceDatParser", () => {
	const parser = new FaceT2AttendanceDatParser();

	it("parses attendance records from a FACE-T2 attlog.dat file", async () => {
		const fileUrl = new URL(
			"../../../../fixtures/face-t2/COVI222660851_attlog.dat",
			import.meta.url,
		);

		const file = await readFile(fileUrl);

		const records = parser.parse(file);

		expect(records).toHaveLength(2);

		expect(records[0]).toMatchObject({
			deviceUserId: 1,
			field3: 1,
			markType: 0,
			field5: 15,
			field6: 0,
		});

		expect(records[1]).toMatchObject({
			deviceUserId: 1,
			field3: 1,
			markType: 1,
			field5: 15,
			field6: 0,
		});
	});

	it("parses the attendance date correctly", async () => {
		const fileUrl = new URL(
			"../../../../fixtures/face-t2/COVI222660851_attlog.dat",
			import.meta.url,
		);

		const file = await readFile(fileUrl);

		const records = parser.parse(file);

		expect(records[0].occurredAt).toBe("2026-06-19T17:00:04");
	});

	it("returns an empty array when the file is empty", () => {
		const records = parser.parse(new Uint8Array());

		expect(records).toEqual([]);
	});

	it("throws when a record does not contain six fields", () => {
		const invalidContent = "1\t2026-06-19 17:00:04\t1\t0\t15";

		const data = new TextEncoder().encode(invalidContent);

		expect(() => parser.parse(data)).toThrow(
			"Registro en línea 1 inválido para formato FACE-T2. Se esperaban 6 campos y se recibieron 5.",
		);
	});

	it("throws when deviceUserId is invalid", () => {
		const invalidContent = "abc\t2026-06-19 17:00:04\t1\t0\t15\t0";

		const data = new TextEncoder().encode(invalidContent);

		expect(() => parser.parse(data)).toThrow(
			'Campo deviceUserId en línea 1 inválido. Valor: "abc".',
		);
	});

	it("throws when the attendance date has an invalid format", () => {
		const invalidContent = "1\t19-06-2026 17:00:04\t1\t0\t15\t0";

		const data = new TextEncoder().encode(invalidContent);

		expect(() => parser.parse(data)).toThrow(
			'Fecha inválida en registro línea 1. Valor: "19-06-2026 17:00:04".',
		);
	});
});
