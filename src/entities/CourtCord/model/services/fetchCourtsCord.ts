import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import type { CourtType } from "@/entities/Court";
import type { CourtsCords } from "../types/courtsCords.ts";

interface FetchCourtsCordParams {
	cityId: number;
	courtType?: CourtType;
}

export const fetchCourtsCord = createAsyncThunk<
	CourtsCords[],
	FetchCourtsCordParams,
	ThunkConfig<string>
>("courtsCords/fetchCourtsCords", async (params, thunkApi) => {
	const { rejectWithValue, extra } = thunkApi;

	try {
		const response = await extra.api.post<CourtsCords[]>(
			"/courts-service/v1/courts/search/points",
			{
				cityId: params.cityId,
				sports: params.courtType ? [params.courtType] : [],
			}
		);

		if (!response.data) {
			throw new Error("No data received");
		}

		return response.data;
	} catch (e) {
		return rejectWithValue("Не удалось получить данные о площадках");
	}
});
