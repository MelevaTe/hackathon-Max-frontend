import { createSlice } from "@reduxjs/toolkit";
import { createCourtBooking } from "../services/createCourtBooking.ts";
import type { courtBookingSchema } from "../types/courtBookingSchema.ts";

const initialState: courtBookingSchema = {
	isLoading: false,
	error: undefined,
	data: undefined,
};

export const courtBookingSlice = createSlice({
	name: "courtBooking",
	initialState,
	reducers: {
		resetBookingState: (state) => {
			state.isLoading = false;
			state.error = undefined;
			state.data = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createCourtBooking.pending, (state) => {
				state.isLoading = true;
				state.error = undefined;
			})
			.addCase(createCourtBooking.fulfilled, (state, action) => {
				state.isLoading = false;
				state.data = action.payload;
			})
			.addCase(createCourtBooking.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const { actions: courtBookingActions } = courtBookingSlice;
export const { reducer: courtBookingReducer } = courtBookingSlice;
