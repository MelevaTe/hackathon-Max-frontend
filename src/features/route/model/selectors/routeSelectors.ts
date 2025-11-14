import type { StateSchema } from "@/app/providers/StoreProvider";

export const getRouteDestination = (state: StateSchema) =>
	state.route?.destinationCoords;

export const getShowRoute = (state: StateSchema) =>
	state.route?.showRoute ?? false;

export const getUserPosition = (state: StateSchema) =>
	state.route?.userPosition;

export const getRouteType = (state: StateSchema) => state.route?.routeType;

export const getRouteData = (state: StateSchema) => ({
	destinationCoords: state.route?.destinationCoords,
	showRoute: state.route?.showRoute ?? false,
	userPosition: state.route?.userPosition,
	routeType: state.route?.routeType,
});
