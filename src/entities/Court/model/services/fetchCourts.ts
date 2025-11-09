import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import type { Court, CourtType } from "../types/court";

export interface FetchCourtsParams {
	courtType?: CourtType;
}

const MOCK_COURTS: Court[] = [
	{
		id: "1",
		title: "Баскетбольная площадка на ул. Ленина",
		address: "г. Ростов-на-Дону, ул. Ленина, 50",
		type: "basketball",
		description: "тут хорошее кольцо для данков",
		paid: false,
		rating: 4.5,
		img: "https://avatars.mds.yandex.net/get-altay/4824927/2a000001810f627303aab28b1b6b53d5febe/L_height",
	},
	{
		id: "2",
		title: "Баскетбольная площадка в парке Победы",
		address: "г. Ростов-на-Дону, парк Победы",
		type: "basketball",
		description: "тут хорошее кольцо для данков",
		paid: false,
		rating: 4.8,
		img: "https://avatars.mds.yandex.net/get-altay/4824927/2a000001810f627303aab28b1b6b53d5febe/L_height",
	},
	{
		id: "3",
		title: "Баскетбольная площадка в спортивном комплексе",
		address: "г. Ростов-на-Дону, ул. Спортивная, 15",
		type: "basketball",
		description: "тут хорошее кольцо для данков",
		paid: false,
		rating: 4.2,
		img: "https://avatars.mds.yandex.net/get-altay/4824927/2a000001810f627303aab28b1b6b53d5febe/L_height",
	},
	{
		id: "4",
		title: "Баскетбольная площадка во дворе",
		address: "г. Ростов-на-Дону, пер. Ботанический, 7",
		type: "basketball",
		description: "тут хорошее кольцо для данков",
		paid: false,
		rating: 4.0,
		img: "https://avatars.mds.yandex.net/get-altay/4824927/2a000001810f627303aab28b1b6b53d5febe/L_height",
	},
	{
		id: "5",
		title: "Баскетбольная площадка у школы №1",
		address: "г. Ростов-на-Дону, ул. Школьная, 1",
		type: "basketball",
		description: "тут хорошее кольцо для данков",
		paid: false,
		rating: 4.6,
		img: "https://avatars.mds.yandex.net/get-altay/4824927/2a000001810f627303aab28b1b6b53d5febe/L_height",
	},
];

export const fetchCourts = createAsyncThunk<
	Court[],
	FetchCourtsParams,
	ThunkConfig<string>
>("court/fetchCourts", async (params, thunkApi) => {
	const { rejectWithValue, extra } = thunkApi;

	try {
		return MOCK_COURTS;
		
		// const response = await extra.api.get<Court[]>("/api/courts", {
		// 	params: {
		// 		type: params.courtType,
		// 	},
		// });
		//
		// if (!response.data) {
		// 	throw new Error("No data received");
		// }
		// return response.data;
	} catch (e) {
		return rejectWithValue("Не удалось получить данные о площадках");
	}
});
