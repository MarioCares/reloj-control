import type { ImportedAttendanceRecord } from "../../application/dtos/import-attlog";

export class FaceT2AttendanceDatParser {
	parse(data: Uint8Array): ImportedAttendanceRecord[] {
		if (data.byteLength === 0) {
			return [];
		}

		const content = new TextDecoder().decode(data);

		return content
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line, index) => this.parseLine(line, index + 1));
	}

	private parseLine(
		line: string,
		lineNumber: number,
	): ImportedAttendanceRecord {
		const fields = line.split("\t");

		if (fields.length !== 6) {
			throw new Error(
				`Registro en línea ${lineNumber} inválido para formato FACE-T2. Se esperaban 6 campos y se recibieron ${fields.length}.`,
			);
		}

		const [
			deviceUserIdRaw,
			occurredAtRaw,
			field3Raw,
			markTypeRaw,
			field5Raw,
			field6Raw,
		] = fields.map((field) => field.trim());

		const deviceUserId = this.parseNumber(
			deviceUserIdRaw,
			"deviceUserId",
			lineNumber,
		);

		const field3 = this.parseNumber(field3Raw, "field3", lineNumber);

		const markType = this.parseNumber(markTypeRaw, "markType", lineNumber);

		const field5 = this.parseNumber(field5Raw, "field5", lineNumber);

		const field6 = this.parseNumber(field6Raw, "field6", lineNumber);

		const occurredAt = this.parseDate(occurredAtRaw, lineNumber);

		return {
			deviceUserId,
			occurredAt,
			field3,
			markType,
			field5,
			field6,
		};
	}

	private parseNumber(
		value: string,
		fieldName: string,
		lineNumber: number,
	): number {
		const parsed = Number(value);

		if (!Number.isInteger(parsed)) {
			throw new Error(
				`Campo ${fieldName} en línea ${lineNumber} inválido. Valor: "${value}".`,
			);
		}

		return parsed;
	}

	private parseDate(value: string, lineNumber: number): string {
		const match = value.match(
			/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
		);

		if (!match) {
			throw new Error(
				`Fecha inválida en registro línea ${lineNumber}. Valor: "${value}".`,
			);
		}

		const [, year, month, day, hour, minute, second] = match;

		return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
	}
}
