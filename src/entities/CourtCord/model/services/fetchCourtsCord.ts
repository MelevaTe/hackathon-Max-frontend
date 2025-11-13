import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import type { CourtType } from "@/entities/Court";
import type { CourtsCords } from "../types/courtsCords.ts";

// const MOCK_COURTS: CourtsCords[] = [
// 	{
// 		id: "123e4567-e89b-12d3-a456-426614174000",
// 		lat: 47.23683,
// 		lon: 39.712619,
// 	},
// 	{
// 		id: "3",
// 		lat: 47.224444,
// 		lon: 39.705,
// 	},
// 	{
// 		id: "4",
// 		lat: 47.221136,
// 		lon: 39.70797,
// 	},
// 	{
// 		id: "5",
// 		lat: 47.23,
// 		lon: 39.7158,
// 	},
// ];

interface FetchCourtsCordParams {
	cityId: string;
	courtType?: CourtType;
}

export const fetchCourtsCord = createAsyncThunk<
	CourtsCords[],
	FetchCourtsCordParams,
	ThunkConfig<string>
>("courtsCords/fetchCourtsCords", async (params, thunkApi) => {
	const { rejectWithValue, extra } = thunkApi;

	try {
		const response = await extra.api.get<{ message: string; courtsCord: CourtsCords[] }>("/courts-service/v1/courts/search/points", {
		  params: {
		    cityId: params.cityId,
		    sport: params.courtType,
		  },
		});

		if (!response.data || !response.data.courtsCord) {
		  throw new Error("No data received");
		}

		return response.data.courtsCord;

		// Пока мок:
		// return MOCK_COURTS;
	} catch (e) {
		return rejectWithValue("Не удалось получить данные о площадках");
	}
});
