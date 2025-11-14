import { createSlice } from "@reduxjs/toolkit";
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
		setRouteDestination: (state, action) => {
			console.log("[ROUTE SLICE] setRouteDestination:", action.payload);
			state.destinationCoords = action.payload;
			state.showRoute = true;
			console.log("[ROUTE SLICE] Updated state:", {
				destinationCoords: state.destinationCoords,
				showRoute: state.showRoute,
			});
		},
		setShowRoute: (state, action) => {
			console.log("[ROUTE SLICE] setShowRoute:", action.payload);
			state.showRoute = action.payload;
			console.log("[ROUTE SLICE] Updated showRoute:", state.showRoute);
		},
		clearRoute: (state) => {
			console.log("[ROUTE SLICE] clearRoute called");
			const oldState = { ...state };
			state.destinationCoords = null;
			state.showRoute = false;
			state.userPosition = null;
			state.routeType = null;
			console.log("[ROUTE SLICE] Cleared route, old state:", oldState);
		},
		setUserPosition: (state, action) => {
			console.log("[ROUTE SLICE] setUserPosition:", action.payload);
			state.userPosition = action.payload;
			console.log(
				"[ROUTE SLICE] Updated userPosition:",
				state.userPosition
			);
		},
		setRouteType: (state, action) => {
			console.log("[ROUTE SLICE] setRouteType:", action.payload);
			state.routeType = action.payload;
			console.log("[ROUTE SLICE] Updated routeType:", state.routeType);
		},
		resetRouteState: (state) => {
			console.log("[ROUTE SLICE] resetRouteState called");
			const oldState = { ...state };
			state.destinationCoords = null;
			state.showRoute = false;
			state.userPosition = null;
			state.routeType = null;
			console.log("[ROUTE SLICE] Reset state, old state:", oldState);
		},
	},
});

export const { actions: routeActions } = routeSlice;
export const { reducer: routeReducer } = routeSlice;
