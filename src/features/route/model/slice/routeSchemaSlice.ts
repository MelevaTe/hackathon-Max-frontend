import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { routeSchema } from "../type/routeSchema.ts";

const initialState: routeSchema = {
	destinationCoords: null,
	showRoute: false,
	userPosition: null,
	routeType: null,
};

export const routeSlice = createSlice({
	name: "route",
	initialState,
	reducers: {
		setRouteDestination: (
			state,
			action: PayloadAction<[number, number]>
		) => {
			state.destinationCoords = action.payload;
		},
		setShowRoute: (state, action: PayloadAction<boolean>) => {
			state.showRoute = action.payload;

			if (!action.payload) {
				state.destinationCoords = null;
				state.userPosition = null;
				state.routeType = null;
			}
		},
		clearRoute: (state) => {
			state.destinationCoords = null;
			state.showRoute = false;
			state.userPosition = null;
			state.routeType = null;
		},
		resetForNewRoute: (state) => {
			state.showRoute = false;
			state.userPosition = null;
			state.routeType = null;
		},
		setUserPosition: (state, action: PayloadAction<[number, number]>) => {
			state.userPosition = action.payload;
		},
		setRouteType: (state, action: PayloadAction<"car" | "pedestrian">) => {
			state.routeType = action.payload;
		},
		initializeRoute: (
			state,
			action: PayloadAction<{
				destinationCoords: [number, number];
				userPosition?: [number, number];
				routeType?: "car" | "pedestrian";
			}>
		) => {
			state.destinationCoords = action.payload.destinationCoords;
			state.userPosition =
				action.payload.userPosition || state.userPosition;
			state.routeType = action.payload.routeType || state.routeType;
		},
	},
});

export const { actions: routeActions } = routeSlice;
export const { reducer: routeReducer } = routeSlice;
