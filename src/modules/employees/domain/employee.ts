export type EmployeeProps = {
	id: string;
	deviceUserId: number;
	externalId: string;
	name: string;
	active: boolean;
};

export class Employee {
	private constructor(private readonly props: EmployeeProps) {}

	static create(props: EmployeeProps): Employee {
		if (props.deviceUserId <= 0) {
			throw new Error("El ID del trabajador debe ser mayor a 0 (cero)");
		}

		const name = props.name.trim();

		if (!name) {
			throw new Error("El nombre del trabajador es necesario");
		}

		return new Employee({
			...props,
			name,
			externalId: props.externalId.trim(),
		});
	}

	get id(): string {
		return this.props.id;
	}

	get deviceUserId(): number {
		return this.props.deviceUserId;
	}

	get externalId(): string {
		return this.props.externalId;
	}

	get name(): string {
		return this.props.name;
	}

	get active(): boolean {
		return this.props.active;
	}
}
