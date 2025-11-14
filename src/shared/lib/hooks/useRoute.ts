import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	routeActions,
	getRouteDestination,
	getShowRoute,
	getUserPosition,
	getRouteType,
} from "@/features/route";

export const useRoute = () => {
	const dispatch = useDispatch();

	const destinationCoords = useSelector(getRouteDestination);
	const showRoute = useSelector(getShowRoute);
	const userPosition = useSelector(getUserPosition);
	const routeType = useSelector(getRouteType);

	console.log("useRoute - текущие значения:", {
		destinationCoords,
		showRoute,
		userPosition,
		routeType
	});

	const setRoute = useCallback(
		(coords: [number, number]) => {
			console.log("useRoute - setRoute вызван с координатами:", coords);
			dispatch(routeActions.setRouteDestination(coords));
		},
		[dispatch]
	);

	const setShowRoute = useCallback(
		(show: boolean) => {
			console.log("useRoute - setShowRoute вызван с:", show);
			dispatch(routeActions.setShowRoute(show));
		},
		[dispatch]
	);

	const clearRoute = useCallback(() => {
		console.log("useRoute - clearRoute вызван");
		dispatch(routeActions.clearRoute());
	}, [dispatch]);

	const updateUserPosition = useCallback(
		(coords: [number, number]) => {
			console.log("useRoute - updateUserPosition вызван с:", coords);
			dispatch(routeActions.setUserPosition(coords));
		},
		[dispatch]
	);

	const setRouteType = useCallback(
		(type: "car" | "pedestrian") => {
			console.log("useRoute - setRouteType вызван с:", type);
			dispatch(routeActions.setRouteType(type));
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
	};
};