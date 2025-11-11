import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/const/localstorage";
import { $api } from "./api";

interface LoginResponse {
	token: string;
	userId: number;
	role: string;
}

export class AuthService {
	static async loginWithInitData(initData: string): Promise<LoginResponse> {
		const response = await $api.post<LoginResponse>("/auth/login", {
			initData,
		});
		const { token } = response.data;
		localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, token);
		return response.data;
	}
}
