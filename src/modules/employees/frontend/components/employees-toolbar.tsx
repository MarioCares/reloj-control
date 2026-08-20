import { Button } from "@/components/ui/button";

type EmployeesToolbarProps = {
	onImport(): void;
};

export function EmployeesToolbar({ onImport }: EmployeesToolbarProps) {
	return (
		<header className="flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold">Empleados</h1>
				<p className="text-muted-foreground">
					Visualiza el listado de empleados para obtener reportes o importa
					nuevos desde el archivo exportado por reloj control
				</p>
			</div>

			<Button onClick={onImport}>Importar</Button>
		</header>
	);
}
