import type { ComponentPropsWithoutRef } from "react";
import type {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError as FieldErrorMessage } from "./field-error";

type BaseTextFieldProps = Omit<
	ComponentPropsWithoutRef<typeof Input>,
	"name"
> & {
	label?: string;
	error?: { message?: string };
};

type RegisteredTextFieldProps<TFieldValues extends FieldValues> =
	BaseTextFieldProps & {
		name: Path<TFieldValues>;
		register: UseFormRegister<TFieldValues>;
		valueAsNumber?: boolean;
	};

type ControlledTextFieldProps = BaseTextFieldProps & {
	name: string;
	register?: never;
	valueAsNumber?: boolean;
};

type TextFieldProps<TFieldValues extends FieldValues> =
	| RegisteredTextFieldProps<TFieldValues>
	| ControlledTextFieldProps;

export function TextField<TFieldValues extends FieldValues>({
	name,
	label,
	register,
	error,
	id,
	valueAsNumber,
	...props
}: TextFieldProps<TFieldValues>) {
	const inputId = id ?? name;

	const registerOptions: RegisterOptions<TFieldValues, Path<TFieldValues>> = {
		valueAsNumber,
	};

	return (
		<div className="space-y-2">
			{label ? <Label htmlFor={inputId}>{label}</Label> : null}

			<Input
				id={inputId}
				aria-invalid={Boolean(error)}
				{...(register
					? register(name as Path<TFieldValues>, registerOptions)
					: {})}
				{...props}
			/>

			<FieldErrorMessage message={error?.message} />
		</div>
	);
}
