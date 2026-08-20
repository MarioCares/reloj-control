import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importEmployees, listEmployees } from "../api/employee.api";
import { employeeQueryKeys } from "../api/employee.query-keys";

export function useEmployees() {
	return useQuery({
		queryKey: employeeQueryKeys.all,
		queryFn: listEmployees,
	});
}

export function useImportEmployees() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (file: File) => importEmployees(file),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: employeeQueryKeys.all,
			});
		},
	});
}
