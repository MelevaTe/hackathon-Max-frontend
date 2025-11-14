import { createSelector } from "@reduxjs/toolkit";
import { selectUserLocation } from "@/entities/UserLocation";

export const selectUserLocationCoords = createSelector(
	selectUserLocation,
	(location) => {
		if (!location) return null;
		return [location.lon, location.lat] as [number, number];
	}
);
