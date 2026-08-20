import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ImportEmployeesResult } from "../../application/dtos/import-employees-result.dto";
import { ImportResult } from "../components/import-result";
import { ImportEmployeeForm } from "../forms/import-employee";
import type { ImportEmployeesFormValues } from "../forms/import-employee-form.schema";

type ImportEmployeesDialogProps = {
	response?: ImportEmployeesResult;
	open: boolean;
	errorMessage?: string;
	onOpenChange(open: boolean): void;
	onSubmit(values: ImportEmployeesFormValues): Promise<void> | void;
	isPending: boolean;
};

export function ImportEmployeesDialog({
	response,
	open,
	errorMessage,
	onOpenChange,
	onSubmit,
	isPending,
}: ImportEmployeesDialogProps) {
	console.log(response);
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Importar Empleados</DialogTitle>
					<DialogDescription>
						Carga el archivo user.dat exportado desde el reloj Quantec FACE-T2.
					</DialogDescription>
				</DialogHeader>
				<ImportEmployeeForm
					isPending={isPending}
					onSubmit={onSubmit}
					errorMessage={errorMessage}
					onCancel={() => onOpenChange(false)}
				/>
				{response && (
					<>
						<Separator />
						<ImportResult
							created={response.created}
							total={response.total}
							unchanged={response.unchanged}
							updated={response.updated}
						/>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
