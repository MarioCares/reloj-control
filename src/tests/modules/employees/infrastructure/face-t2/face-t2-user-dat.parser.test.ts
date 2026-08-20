import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { FaceT2UserDatParser } from "@/modules/employees/infrastructure/face-t2/face-t2-user-dat.parser";

describe("FaceT2UserDatParser", () => {
	const parser = new FaceT2UserDatParser();

	it("parses users from a FACE-T2 user.dat file", async () => {
		const fileUrl = new URL(
			"../../../../fixtures/face-t2/user.dat",
			import.meta.url,
		);

		const file = await readFile(fileUrl);

		const users = parser.parse(file);

		expect(users).toHaveLength(8);

		expect(users[0]).toEqual({
			deviceUserId: 1,
			externalId: "1",
			name: "Técnico Relojcontrol",
			privilege: 14,
			enabled: true,
		});

		expect(users[7]).toEqual({
			deviceUserId: 8,
			externalId: "6722304",
			name: "EMILIO CASTRO",
			privilege: 0,
			enabled: true,
		});
	});

	it("returns an empty array when the file is empty", () => {
		const users = parser.parse(new Uint8Array());

		expect(users).toEqual([]);
	});

	it("throws when the file size is not a multiple of 72 bytes", () => {
		const invalidFile = new Uint8Array(73);

		expect(() => parser.parse(invalidFile)).toThrow(
			"Archivo user.dat FACE-T2 inválido. Se esperaban datos de 72 bytes.",
		);
	});
});
