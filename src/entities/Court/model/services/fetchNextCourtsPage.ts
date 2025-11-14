import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import type { CourtType } from "@/entities/Court";
import {
	getCourtPageHasMore,
	getCourtPageIsLoading,
	getCourtPageNum,
} from "../selectors/courtPageSelectors.ts";
import { fetchCourts } from "../services/fetchCourts.ts";
import { courtActions } from "../slice/courtSchemaSlice.ts";

export interface FetchNextCourtsPageParams {
	cityId: number;
	sports?: CourtType[];
}

export const fetchNextCourtsPage = createAsyncThunk<
	void,
	FetchNextCourtsPageParams,
	ThunkConfig<string>
>("court/fetchNextCourtsPage", async (params, thunkApi) => {
	const { getState, dispatch } = thunkApi;
	const hasMore = getCourtPageHasMore(getState());
	const page = getCourtPageNum(getState());
	const isLoading = getCourtPageIsLoading(getState());

	if (hasMore && !isLoading) {
		const nextPage = page + 1;
		dispatch(courtActions.setPage(nextPage));

		await dispatch(
			fetchCourts({
				...params,
				replace: false,
				page: nextPage,
			})
		).unwrap();
	}
});
