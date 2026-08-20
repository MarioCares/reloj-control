import { z } from "zod";

export const importEmployeesFormSchema = z.object({
	file: z
		.instanceof(File, {
			message: "Debes seleccionar un archivo",
		})
		.refine(
			(file) => file.name.toLowerCase().endsWith(".dat"),
			"El archivo debe tener extensión .dat",
		),
});

export type ImportEmployeesFormValues = z.infer<
	typeof importEmployeesFormSchema
>;
