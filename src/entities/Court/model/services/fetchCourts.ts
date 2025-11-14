import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import {
	getCourtPageLimit,
	getCourtPageNum,
} from "../selectors/courtPageSelectors.ts";
import type { Court, CourtType } from "../types/court";

export interface FetchCourtsParams {
	replace?: boolean;
	cityId: number;
	sports?: CourtType[];
	page?: number;
}

export const fetchCourts = createAsyncThunk<
	Court[],
	FetchCourtsParams,
	ThunkConfig<string>
>("court/fetchCourts", async (props, thunkApi) => {
	const { extra, rejectWithValue, getState } = thunkApi;
	const { cityId, sports, replace, page: explicitPage } = props;

	const limit = getCourtPageLimit(getState());
	const page =
		explicitPage !== undefined ? explicitPage : getCourtPageNum(getState());

	const testSports: CourtType[] = ["FOOTBALL", "BASKETBALL", "TENNIS"];

	try {
		console.log("Fetching courts with page:", page, "limit:", limit);

		const response = await extra.api.post<Court[]>(
			"/courts-service/v1/courts/info/search/locations",
			{
				cityId,
				sports: testSports,
			},
			{
				params: {
					page,
					size: limit,
				},
			}
		);

		if (!response.data) {
			throw new Error("No data received");
		}

		console.log("Received courts:", response.data.length);

		return response.data;
	} catch (e) {
		console.error("Error fetching courts:", e);
		return rejectWithValue("Не удалось получить данные о площадках");
	}
});
