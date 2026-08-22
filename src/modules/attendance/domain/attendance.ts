export type AttendanceMarkType = "entry" | "exit";

export type AttendanceProps = {
	id: string;
	employeeId: string;
	occurredAt: Date;
	markType: AttendanceMarkType;
};

export class Attendance {
	private constructor(private readonly props: AttendanceProps) {}

	static create(props: AttendanceProps): Attendance {
		if (!props.employeeId.trim()) {
			throw new Error("Employee ID is required");
		}

		if (Number.isNaN(props.occurredAt.getTime())) {
			throw new Error("Attendance date is invalid");
		}

		return new Attendance(props);
	}

	get id(): string {
		return this.props.id;
	}

	get employeeId(): string {
		return this.props.employeeId;
	}

	get occurredAt(): Date {
		return this.props.occurredAt;
	}

	get markType(): AttendanceMarkType {
		return this.props.markType;
	}
}
