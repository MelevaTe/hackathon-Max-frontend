import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/const/localstorage";
import { $api } from "./api";

interface LoginResponse {
	token: string;
	userId: number;
	role: string;
}

export class AuthService {
	static async loginWithInitData(initData: string): Promise<LoginResponse> {
		const response = await $api.post<LoginResponse>(
			"/auth-service/v1/auth/login",
			{
				initData,
			}
		);
		localStorage.setItem(
			ACCESS_TOKEN_LOCAL_STORAGE_KEY,
			response.data.token
		);
		return response.data;
	}
}
