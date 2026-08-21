import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/import_attlog")({
	component: () => <h1>Carga ATT LOG</h1>,
});
