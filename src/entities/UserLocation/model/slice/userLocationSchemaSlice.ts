import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { userLocation } from "../types/userLocation.ts";
import type { userLocationSchema } from "../types/userLocationSchema.ts";

const initialState: userLocationSchema = {
	data: undefined,
};

export const userLocationSlice = createSlice({
	name: "userLocation",
	initialState,
	reducers: {
		setUserLocation: (state, action: PayloadAction<userLocation>) => {
			state.data = action.payload;
		},
		clearUserLocation: (state) => {
			state.data = undefined;
		},
		updateUserLocationCoordinates: (
			state,
			action: PayloadAction<{ lat: number; lon: number }>
		) => {
			if (state.data) {
				state.data.lat = action.payload.lat;
				state.data.lon = action.payload.lon;
			}
		},
	},
});

export const { actions: userLocationActions } = userLocationSlice;
export const { reducer: userLocationReducer } = userLocationSlice;
