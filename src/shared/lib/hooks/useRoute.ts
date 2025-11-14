import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	routeActions,
	getRouteDestination,
	getShowRoute,
	getUserPosition,
	getRouteType
} from '@/features/route';

export const useRoute = () => {
	const dispatch = useDispatch();

	const destinationCoords = useSelector(getRouteDestination);
	const showRoute = useSelector(getShowRoute);
	const userPosition = useSelector(getUserPosition);
	const routeType = useSelector(getRouteType);

	const setRoute = useCallback((coords: [number, number]) => {
		dispatch(routeActions.setRouteDestination(coords));
	}, [dispatch]);

	const setShowRoute = useCallback((show: boolean) => {
		dispatch(routeActions.setShowRoute(show));
	}, [dispatch]);

	const clearRoute = useCallback(() => {
		dispatch(routeActions.clearRoute());
	}, [dispatch]);

	const updateUserPosition = useCallback((coords: [number, number]) => {
		dispatch(routeActions.setUserPosition(coords));
	}, [dispatch]);

	const setRouteType = useCallback((type: "car" | "pedestrian") => {
		dispatch(routeActions.setRouteType(type));
	}, [dispatch]);

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