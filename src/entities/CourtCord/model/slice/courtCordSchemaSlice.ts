import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchCourtsCord } from "../services/fetchCourtsCord";
import type { CourtsCords } from "../types/courtsCords.ts";
import type { CourtsCordsSchema } from "../types/courtsCordsSchema.ts";

const initialState: CourtsCordsSchema = {
	isLoading: false,
	error: undefined,
	data: undefined,
};

export const courtsCordsSlice = createSlice({
	name: "courtCord",
	initialState,
	reducers: {
		clearCourtCords: (state) => {
			state.data = undefined;
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCourtsCord.pending, (state) => {
				state.error = undefined;
				state.isLoading = true;
			})
			.addCase(
				fetchCourtsCord.fulfilled,
				(state, action: PayloadAction<CourtsCords[]>) => {
					state.isLoading = false;
					state.data = action.payload;
				}
			)
			.addCase(fetchCourtsCord.rejected, (state, action) => {
				state.isLoading = false;
				state.error =
					action.payload || "Не удалось получить данные о площадках";
			});
	},
});

export const { actions: courtsCordsActions } = courtsCordsSlice;
export const { reducer: courtsCordsReducer } = courtsCordsSlice;
