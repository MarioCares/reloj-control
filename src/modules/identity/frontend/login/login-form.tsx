import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { authClient } from "../auth-client";
import { type LoginFormValues, loginSchema } from "./login.schema";

export function LoginForm() {
	const [authError, setAuthError] = useState<string | null>(null);
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as { redirect?: string };
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginFormValues) {
		setAuthError(null);

		const { error } = await authClient.signIn.email({
			email: values.email,
			password: values.password,
		});

		if (error) {
			setAuthError(error.message ?? "No fue posible iniciar sesión.");
			return;
		}

		await navigate({
			to: search.redirect ?? "/",
			replace: true,
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Controller
					control={control}
					name="email"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Email</FieldLabel>
							<Input
								{...field}
								id={field.name}
								type="email"
								autoComplete="email"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={control}
					name="password"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
							<Input
								{...field}
								id={field.name}
								type="password"
								autoComplete="current-password"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{authError ? <FieldError>{authError}</FieldError> : null}

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
				</Button>
			</FieldGroup>
		</form>
	);
}
