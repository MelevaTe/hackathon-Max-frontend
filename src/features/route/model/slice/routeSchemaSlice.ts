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
			console.log("[ROUTE SLICE] setRouteDestination:", action.payload);
			state.destinationCoords = action.payload;
			console.log(
				"[ROUTE SLICE] Updated destinationCoords:",
				state.destinationCoords
			);
		},
		setShowRoute: (state, action: PayloadAction<boolean>) => {
			console.log("[ROUTE SLICE] setShowRoute:", action.payload);
			state.showRoute = action.payload;

			if (!action.payload) {
				state.destinationCoords = null;
				state.userPosition = null;
				state.routeType = null;
				console.log("[ROUTE SLICE] Cleared route data on hide");
			}

			console.log("[ROUTE SLICE] Updated state:", state);
		},
		clearRoute: (state) => {
			console.log("[ROUTE SLICE] clearRoute called");
			state.destinationCoords = null;
			state.showRoute = false;
			state.userPosition = null;
			state.routeType = null;
			console.log("[ROUTE SLICE] Route cleared");
		},
		setUserPosition: (state, action: PayloadAction<[number, number]>) => {
			console.log("[ROUTE SLICE] setUserPosition:", action.payload);
			state.userPosition = action.payload;
		},
		setRouteType: (state, action: PayloadAction<"car" | "pedestrian">) => {
			console.log("[ROUTE SLICE] setRouteType:", action.payload);
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
			console.log("[ROUTE SLICE] initializeRoute:", action.payload);
			state.destinationCoords = action.payload.destinationCoords;
			state.userPosition =
				action.payload.userPosition || state.userPosition;
			state.routeType = action.payload.routeType || state.routeType;
			console.log("[ROUTE SLICE] Route initialized:", state);
		},
	},
});

export const { actions: routeActions } = routeSlice;
export const { reducer: routeReducer } = routeSlice;
