import { useSelector } from "react-redux";
import {
	getRouteDestinationCoords,
	getRouteShow,
	getRouteUserPosition,
	getRouteType,
	routeActions,
} from "@/features/route";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";

export const useRoute = () => {
	const dispatch = useAppDispatch();
	const destinationCoords = useSelector(getRouteDestinationCoords);
	const showRoute = useSelector(getRouteShow);
	const userPosition = useSelector(getRouteUserPosition);
	const routeType = useSelector(getRouteType);

	console.log("[USE_ROUTE HOOK] Current state:", {
		destinationCoords,
		showRoute,
		userPosition,
		routeType,
	});

	const setRoute = (coords: [number, number]) => {
		console.log("[USE_ROUTE HOOK] setRoute called with coords:", coords);
		dispatch(routeActions.setRouteDestination(coords));
	};

	const clearCurrentRoute = () => {
		console.log("[USE_ROUTE HOOK] clearCurrentRoute called");
		dispatch(routeActions.clearRoute());
	};

	const updateUserPosition = (coords: [number, number]) => {
		console.log(
			"[USE_ROUTE HOOK] updateUserPosition called with coords:",
			coords
		);
		dispatch(routeActions.setUserPosition(coords));
	};

	const setRouteType = (type: "car" | "pedestrian") => {
		console.log("[USE_ROUTE HOOK] setRouteType called with type:", type);
		dispatch(routeActions.setRouteType(type));
	};

	const setShowRoute = (show: boolean) => {
		console.log("[USE_ROUTE HOOK] setShowRoute called with show:", show);
		dispatch(routeActions.setShowRoute(show));
	};

	return {
		destinationCoords,
		showRoute,
		userPosition,
		routeType,
		setRoute,
		clearCurrentRoute,
		updateUserPosition,
		setRouteType,
		setShowRoute,
	};
};
