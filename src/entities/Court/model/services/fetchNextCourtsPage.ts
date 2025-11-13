import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import {
	getCourtPageHasMore,
	getCourtPageIsLoading,
	getCourtPageNum,
} from "../selectors/courtPageSelectors.ts";
import { fetchCourts } from "../services/fetchCourts.ts";
import { courtActions } from "../slice/courtSchemaSlice.ts";

export const fetchNextCourtsPage = createAsyncThunk<
	void,
	void,
	ThunkConfig<string>
>("court/fetchNextCourtsPage", async (_, thunkApi) => {
	const { getState, dispatch } = thunkApi;
	const hasMore = getCourtPageHasMore(getState());
	const page = getCourtPageNum(getState());
	const isLoading = getCourtPageIsLoading(getState());

	if (hasMore && !isLoading) {
		dispatch(courtActions.setPage(page + 1));
		dispatch(fetchCourts({}));
	}
});
