type ImportResultProps = {
	total: number;
	created: number;
	updated: number;
	unchanged: number;
};

type ItemResultProps = {
	label: string;
	value: number;
};

export function ImportResult({
	total,
	created,
	updated,
	unchanged,
}: ImportResultProps) {
	return (
		<div className="grid grid-cols-2 gap-3">
			<ItemResult label="Procesados" value={total} />
			<ItemResult label="Creados" value={created} />
			<ItemResult label="Actualizados" value={updated} />
			<ItemResult label="Sin cambios" value={unchanged} />
		</div>
	);
}

function ItemResult({ label, value }: ItemResultProps) {
	return (
		<div className="rounded-md border p-3">
			<p className="text-xl font-semibold">{value}</p>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	);
}
