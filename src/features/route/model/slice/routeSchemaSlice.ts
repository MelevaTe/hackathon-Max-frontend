import { createSlice } from "@reduxjs/toolkit";
import type { routeSchema } from "../type/routeSchema.ts";

const initialState: routeSchema = {
	destinationCoords: null,
	showRoute: false,
	userPosition: null,
};

export const routeSlice = createSlice({
	name: "route",
	initialState,
	reducers: {
		setRouteDestination: (state, action) => {
			state.destinationCoords = action.payload;
			state.showRoute = true;
		},
		clearRoute: (state) => {
			state.destinationCoords = null;
			state.showRoute = false;
			state.userPosition = null;
		},
		setUserPosition: (state, action) => {
			state.userPosition = action.payload;
		},
		resetRouteState: (state) => {
			state.destinationCoords = null;
			state.showRoute = false;
			state.userPosition = null;
		},
	},
});

export const { actions: routeActions } = routeSlice;
export const { reducer: routeReducer } = routeSlice;
