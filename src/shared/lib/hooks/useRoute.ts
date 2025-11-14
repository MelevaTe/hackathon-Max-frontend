import { useSelector } from "react-redux";
import {
	getRouteDestinationCoords,
	getRouteShow,
	getRouteUserPosition,
	routeActions,
} from "@/features/route";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";

export const useRoute = () => {
	const dispatch = useAppDispatch();
	const destinationCoords = useSelector(getRouteDestinationCoords);
	const showRoute = useSelector(getRouteShow);
	const userPosition = useSelector(getRouteUserPosition);

	const setRoute = (coords: [number, number]) => {
		dispatch(routeActions.setRouteDestination(coords));
	};

	const clearCurrentRoute = () => {
		dispatch(routeActions.clearRoute());
	};

	const updateUserPosition = (coords: [number, number]) => {
		dispatch(routeActions.setUserPosition(coords));
	};

	return {
		destinationCoords,
		showRoute,
		userPosition,
		setRoute,
		clearCurrentRoute,
		updateUserPosition,
	};
};
