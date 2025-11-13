import { useCallback } from "react";

interface LocationResult {
	coordinates?: [number, number];
	error?: string;
}

export const useUserLocation = () => {
	const getUserLocation = useCallback((): Promise<LocationResult> => {
		return new Promise((resolve) => {
			if (!navigator.geolocation) {
				resolve({
					error: "Geolocation is not supported by this browser.",
				});
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { longitude, latitude } = position.coords;
					resolve({ coordinates: [longitude, latitude] });
				},
				(error) => {
					let message = "Unknown error";
					switch (error.code) {
						case error.PERMISSION_DENIED:
							message =
								"User denied the request for Geolocation.";
							break;
						case error.POSITION_UNAVAILABLE:
							message = "Location information is unavailable.";
							break;
						case error.TIMEOUT:
							message =
								"The request to get user location timed out.";
							break;
					}
					resolve({ error: message });
				}
			);
		});
	}, []);

	return { getUserLocation };
};
