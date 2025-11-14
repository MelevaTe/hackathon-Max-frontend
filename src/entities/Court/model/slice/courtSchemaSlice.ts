import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchCourts } from "../services/fetchCourts.ts";
import type { Court } from "../types/court.ts";
import type { CourtSchema } from "../types/courtSchema.ts";

const initialState: CourtSchema = {
	isLoading: false,
	error: undefined,
	data: undefined,
	hasNextPage: false,
	isEmpty: true,
	currentPage: 0,
	pageSize: 10,
};

export const courtSlice = createSlice({
	name: "court",
	initialState,
	reducers: {
		clearCourts: (state) => {
			state.data = undefined;
			state.error = undefined;
			state.hasNextPage = false;
			state.isEmpty = true;
			state.currentPage = 0;
		},
		setPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},
		setPageSize: (state, action: PayloadAction<number>) => {
			state.pageSize = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCourts.pending, (state) => {
				state.error = undefined;
				state.isLoading = true;
			})
			.addCase(
				fetchCourts.fulfilled,
				(state, action: PayloadAction<Court[]>) => {
					const courts = action.payload;
					const size = state.pageSize;
					const hasNextPage = courts.length === size;
					const isEmpty = !courts || courts.length === 0;

					if (state.currentPage === 0) {
						state.data = courts;
					} else {
						const existingIds = new Set(state.data?.map(c => c.id) || []);
						const newCourts = courts.filter(c => !existingIds.has(c.id));
						state.data = [...(state.data || []), ...newCourts];
					}

					state.isLoading = false;
					state.hasNextPage = hasNextPage;
					state.isEmpty = state.currentPage === 0 ? isEmpty : false;
				}
			)
			.addCase(fetchCourts.rejected, (state, action) => {
				state.isLoading = false;
				state.error =
					(action.payload as string) ||
					"Не удалось получить данные о площадках";
			});
	},
});

export const { actions: courtActions } = courtSlice;
export const { reducer: courtReducer } = courtSlice;
