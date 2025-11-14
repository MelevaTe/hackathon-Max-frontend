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
}

export const fetchCourts = createAsyncThunk<
	Court[],
	FetchCourtsParams,
	ThunkConfig<string>
>("court/fetchCourts", async (props, thunkApi) => {
	const { extra, rejectWithValue, getState } = thunkApi;
	const { cityId, sports, replace } = props;

	const limit = getCourtPageLimit(getState());
	const page = getCourtPageNum(getState());

	const testSports: CourtType[] = ["FOOTBALL", "BASKETBALL", "TENNIS"];

	try {
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

		return response.data;
	} catch (e) {
		return rejectWithValue("Не удалось получить данные о площадках");
	}
});
