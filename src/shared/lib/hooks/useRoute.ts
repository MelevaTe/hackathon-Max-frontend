import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { StateSchema } from "@/app/providers/StoreProvider";
import { routeActions } from "@/features/route";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";

export const useRoute = () => {
	const dispatch = useAppDispatch();

	const destinationCoords = useSelector(
		(state: StateSchema) => state.route?.destinationCoords
	);
	const showRoute = useSelector(
		(state: StateSchema) => state.route?.showRoute
	);
	const userPosition = useSelector(
		(state: StateSchema) => state.route?.userPosition
	);
	const routeType = useSelector(
		(state: StateSchema) => state.route?.routeType
	);

	const setRoute = useCallback(
		(coords: [number, number]) => {
			dispatch(routeActions.setRouteDestination(coords));
		},
		[dispatch]
	);

	const setShowRoute = useCallback(
		(show: boolean) => {
			dispatch(routeActions.setShowRoute(show));
		},
		[dispatch]
	);

	const clearRoute = useCallback(() => {
		dispatch(routeActions.clearRoute());
	}, [dispatch]);

	const updateUserPosition = useCallback(
		(coords: [number, number]) => {
			dispatch(routeActions.setUserPosition(coords));
		},
		[dispatch]
	);

	const setRouteType = useCallback(
		(type: "car" | "pedestrian") => {
			dispatch(routeActions.setRouteType(type));
		},
		[dispatch]
	);

	const initializeRoute = useCallback(
		(data: {
			destinationCoords: [number, number];
			userPosition?: [number, number];
			routeType?: "car" | "pedestrian";
		}) => {
			dispatch(routeActions.initializeRoute(data));
		},
		[dispatch]
	);

	return {
		destinationCoords,
		showRoute,
		userPosition,
		routeType,
		setRoute,
		setShowRoute,
		clearRoute,
		updateUserPosition,
		setRouteType,
		initializeRoute,
	};
};
