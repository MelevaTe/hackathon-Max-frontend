import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchCourts } from "../services/fetchCourts.ts";
import type { Court } from "../types/court.ts";
import type { CourtSchema } from "../types/courtSchema.ts";

const initialState: CourtSchema = {
	isLoading: false,
	error: undefined,
	data: undefined,
};

export const courtSlice = createSlice({
	name: "court",
	initialState,
	reducers: {
		clearCourts: (state) => {
			state.data = undefined;
			state.error = undefined;
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
					state.isLoading = false;
					state.data = action.payload;
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
