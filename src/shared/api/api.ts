import axios from "axios";
import { AuthService } from "./authService.ts";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../const/localstorage.ts";

export const $api = axios.create({
	baseURL: __API__,
	// withCredentials: true,
});

$api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

$api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes("/auth/login")
		) {
			originalRequest._retry = true;

			try {
				const webApp =
					typeof window !== "undefined"
						? (window as any).WebApp
						: null;

				if (!webApp || !webApp.initData) {
					throw new Error("initData отсутствует");
				}

				const initData = webApp.initData;

				await AuthService.loginWithInitData(initData);

				const newToken = localStorage.getItem(
					ACCESS_TOKEN_LOCAL_STORAGE_KEY
				);

				if (newToken) {
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return $api(originalRequest);
				} else {
					throw new Error(
						"Не удалось получить новый токен после повторной аутентификации."
					);
				}
			} catch (err) {
				console.error(
					"Ошибка повторной аутентификации через initData",
					err
				);
			}
		}

		return Promise.reject(error);
	}
);
