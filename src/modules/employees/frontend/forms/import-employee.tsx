import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type ImportEmployeesFormValues,
	importEmployeesFormSchema,
} from "./import-employee-form.schema";

type ImportEmployeeFormProps = {
	isPending: boolean;
	onSubmit(values: ImportEmployeesFormValues): Promise<void> | void;
	errorMessage?: string;
	onCancel?(): void;
};

export function ImportEmployeeForm({
	isPending,
	onSubmit,
	onCancel,
	errorMessage,
}: ImportEmployeeFormProps) {
	const form = useForm<ImportEmployeesFormValues>({
		resolver: zodResolver(importEmployeesFormSchema),
	});

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<Label htmlFor="file">Archivo user.dat</Label>
			<Input
				id="file"
				type="file"
				accept=".dat"
				disabled={form.formState.isSubmitting}
				onChange={(event) => {
					const file = event.target.files?.[0];

					if (!file) {
						return;
					}

					form.setValue("file", file, {
						shouldValidate: true,
						shouldDirty: true,
					});
				}}
			/>
			{errorMessage ? (
				<p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
					{errorMessage}
				</p>
			) : null}

			<div className="flex justify-end gap-2">
				{onCancel ? (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancelar
					</Button>
				) : null}

				<Button
					type="submit"
					disabled={form.formState.isSubmitting || isPending}
				>
					{form.formState.isSubmitting || isPending ? "Importando" : "Importar"}
				</Button>
			</div>
		</form>
	);
}
