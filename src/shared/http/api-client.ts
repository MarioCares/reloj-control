import axios from "axios";
import { ApiError } from "./api-error";
import type { ApiErrorResponse } from "./api-types";

export const api = axios.create({
	baseURL: "/api/v1",
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError<ApiErrorResponse>(error)) {
			const status = error.response?.status ?? 500;
			const message =
				error.response?.data?.message ?? "Ha ocurrido un error inesperado.";

			return Promise.reject(
				new ApiError(message, status, error.response?.data?.issues),
			);
		}

		return Promise.reject(error);
	},
);
