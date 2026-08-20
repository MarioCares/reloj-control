import type { ImportedClockUser } from "../../application/dtos/imported-clock-user";

const RECORD_SIZE = 72;

const OFFSETS = {
	deviceUserId: 0,
	privilege: 2,
	name: 11,
	enabled: 39,
	externalId: 48,
} as const;

const LENGTHS = {
	name: 28,
	externalId: 24,
} as const;

export class FaceT2UserDatParser {
	parse(data: Uint8Array): ImportedClockUser[] {
		if (data.byteLength === 0) {
			return [];
		}

		if (data.byteLength % RECORD_SIZE !== 0) {
			throw new Error(
				`Archivo user.dat FACE-T2 inválido. Se esperaban datos de ${RECORD_SIZE} bytes.`,
			);
		}

		const users: ImportedClockUser[] = [];

		for (let offset = 0; offset < data.byteLength; offset += RECORD_SIZE) {
			users.push(this.parseRecord(data, offset));
		}

		return users;
	}

	private parseRecord(data: Uint8Array, offset: number): ImportedClockUser {
		const view = new DataView(
			data.buffer,
			data.byteOffset + offset,
			RECORD_SIZE,
		);

		const deviceUserId = view.getUint16(OFFSETS.deviceUserId, true);

		const privilege = view.getUint8(OFFSETS.privilege);

		const name = this.readString(data, offset + OFFSETS.name, LENGTHS.name);

		const enabled = view.getUint8(OFFSETS.enabled) === 1;

		const externalId = this.readString(
			data,
			offset + OFFSETS.externalId,
			LENGTHS.externalId,
		);

		return {
			deviceUserId,
			externalId,
			name,
			privilege,
			enabled,
		};
	}

	private readString(data: Uint8Array, offset: number, length: number): string {
		const bytes = data.slice(offset, offset + length);

		const nullIndex = bytes.indexOf(0);

		const content = nullIndex >= 0 ? bytes.slice(0, nullIndex) : bytes;

		return this.decodeWindows1252(content).trim();
	}

	private decodeWindows1252(bytes: Uint8Array): string {
		return Array.from(bytes)
			.map((byte) => String.fromCharCode(byte))
			.join("");
	}
}
