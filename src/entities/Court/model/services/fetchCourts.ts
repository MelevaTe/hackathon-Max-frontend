import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import type { Court, CourtType } from "../types/court";

export interface FetchCourtsParams {
	sports?: CourtType[];
	cityId?: string;
}

// const MOCK_COURTS: Court[] = [
// 	{
// 		id: "123e4567-e89b-12d3-a456-426614174000",
// 		title: "баскет в дгту",
// 		lat: 2.123,
// 		lon: 123.213,
// 		address: "г. Ростов-на-Дону, парк Победы",
// 		type: "BASKETBALL",
// 		description: "тут хорошее кольцо для данков",
// 		paid: true,
// 		rating: 4.8,
// 		img: "https://avatars.mds.yandex.net/get-altay/4824927/2a000001810f627303aab28b1b6b53d5febe/L_height",
// 		date: "август",
// 	},
// ];

export const fetchCourts = createAsyncThunk<
	Court[],
	FetchCourtsParams,
	ThunkConfig<string>
>("court/fetchCourts", async (params, thunkApi) => {
	const { rejectWithValue, extra } = thunkApi;

	try {
		// return MOCK_COURTS;

		const response = await extra.api.get<Court[]>("/api/courts", {
			params: {
				sports: params.sports,
				cityId: params.cityId,
			},
		});

		if (!response.data) {
			throw new Error("No data received");
		}
		return response.data;
	} catch (e) {
		return rejectWithValue("Не удалось получить данные о площадках");
	}
});
