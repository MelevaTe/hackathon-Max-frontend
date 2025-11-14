import type { StateSchema } from "@/app/providers/StoreProvider";

export const getRouteDestinationCoords = (state: StateSchema) =>
	state.route?.destinationCoords;

export const getRouteShow = (state: StateSchema) => state.route?.showRoute;

export const getRouteUserPosition = (state: StateSchema) =>
	state.route?.userPosition;
