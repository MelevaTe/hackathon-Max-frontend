import { load } from "@2gis/mapgl";
import { useEffect, useRef } from "react";
import { MapWrapper } from "./MapWrapper";
import "./Map.scss";
import { Theme } from "@/app/providers/ThemeProvider";
import { Directions } from "@2gis/mapgl-directions";

export interface MarkerData {
	id: string;
	coordinates: [number, number];
	courtInfoId: string;
}

const THEME_TO_STYLE_ID: Record<Theme, string> = {
	[Theme.LIGHT]: "d013506c-74b4-421f-939d-58c7f475b6b4",
	[Theme.DARK]: "bead9c80-2217-47fe-982e-4d385cc4e151",
};

interface MapProps {
	className?: string;
	markers?: MarkerData[];
	theme: Theme;
	onMarkerClick?: (courtInfoId: string) => void;
	showRoute: boolean;
	userPosition: [number, number] | null;
	destinationCoords: [number, number] | null;
	routeType: "car" | "pedestrian" | null;
}

export const MapComponent = ({
	className,
	markers = [],
	theme,
	onMarkerClick,
	showRoute,
	userPosition,
	destinationCoords,
	routeType,
}: MapProps) => {
	const mapRef = useRef<any>(null);
	const mapglRef = useRef<any>(null);
	const markersRef = useRef<any[]>([]);
	const circleRef = useRef<any>(null);
	const destinationMarkerRef = useRef<any>(null);
	const userMarkerRef = useRef<any>(null);
	const directionsRef = useRef<any>(null);

	console.log("[MAP_COMPONENT] Component rendered with props:", {
		showRoute,
		userPosition,
		destinationCoords,
		routeType,
		markersCount: markers.length,
	});

	useEffect(() => {
		console.log("[MAP_COMPONENT] useEffect started with dependencies:", {
			showRoute,
			userPosition,
			destinationCoords,
			routeType,
			markersCount: markers.length,
		});

		let map: any = null;
		let control: any = null;
		let button: HTMLElement | null = null;

		const addDestinationMarker = (coords: [number, number]) => {
			console.log(
				"[MAP_COMPONENT] addDestinationMarker called with coords:",
				coords
			);
			if (!mapRef.current || !mapglRef.current) {
				console.log(
					"[MAP_COMPONENT] Cannot add destination marker - map not ready"
				);
				return;
			}

			if (destinationMarkerRef.current) {
				console.log(
					"[MAP_COMPONENT] Destroying old destination marker"
				);
				destinationMarkerRef.current.destroy();
			}

			const marker = new mapglRef.current.Marker(mapRef.current, {
				coordinates: coords,
			});
			destinationMarkerRef.current = marker;
			console.log("[MAP_COMPONENT] Destination marker created");
		};

		const addUserMarker = (coords: [number, number]) => {
			console.log(
				"[MAP_COMPONENT] addUserMarker called with coords:",
				coords
			);
			if (!mapRef.current || !mapglRef.current) {
				console.log(
					"[MAP_COMPONENT] Cannot add user marker - map not ready"
				);
				return;
			}

			if (userMarkerRef.current) {
				console.log("[MAP_COMPONENT] Destroying old user marker");
				userMarkerRef.current.destroy();
			}

			const marker = new mapglRef.current.Marker(mapRef.current, {
				coordinates: coords,
			});
			userMarkerRef.current = marker;
			console.log("[MAP_COMPONENT] User marker created");
		};

		const geoFindMe = () => {
			console.log("[MAP_COMPONENT] geoFindMe called");
			if (!navigator.geolocation) {
				console.log("[MAP_COMPONENT] Geolocation not supported");
				alert("Геолокация не поддерживается в этом браузере.");
				return;
			}
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					console.log(
						"[MAP_COMPONENT] Geolocation success:",
						pos.coords
					);
					const mapglAPI = mapglRef.current;
					const currentMap = mapRef.current;

					if (!mapglAPI || !currentMap) {
						console.log(
							"[MAP_COMPONENT] Map not ready for geolocation"
						);
						return;
					}

					const center: [number, number] = [
						pos.coords.longitude,
						pos.coords.latitude,
					];

					if (circleRef.current) {
						console.log(
							"[MAP_COMPONENT] Destroying old circle marker"
						);
						circleRef.current.destroy();
					}

					const newCircle = new mapglAPI.CircleMarker(currentMap, {
						coordinates: center,
						radius: 14,
						color: "#4fb848",
						strokeWidth: 4,
						strokeColor: "#ffffff",
					});

					circleRef.current = newCircle;
					console.log(
						"[MAP_COMPONENT] Circle marker created for geolocation"
					);

					currentMap.setCenter(center);
					currentMap.setZoom(16);
				},
				(error) => {
					console.error("[MAP_COMPONENT] Geolocation error:", error);
					switch (error.code) {
						case error.PERMISSION_DENIED:
							alert("Доступ к местоположению запрещён.");
							break;
						case error.POSITION_UNAVAILABLE:
							alert("Невозможно определить местоположение.");
							break;
						case error.TIMEOUT:
							alert("Превышено время ожидания.");
							break;
						default:
							alert("Неизвестная ошибка геолокации.");
					}
				}
			);
		};

		const start = async () => {
			console.log("[MAP_COMPONENT] Loading mapgl...");
			const mapglAPI = await load();
			mapglRef.current = mapglAPI;
			console.log("[MAP_COMPONENT] Mapgl loaded successfully");

			const initialCenter: [number, number] = [39.712619, 47.23683];

			map = new mapglAPI.Map("map-container", {
				center: initialCenter,
				zoom: 17,
				key: import.meta.env.VITE_2GIS_API_KEY,
				zoomControl: "centerRight",
				trafficControl: "centerRight",
			});

			mapRef.current = map;
			console.log("[MAP_COMPONENT] Map initialized");

			if (THEME_TO_STYLE_ID[theme]) {
				map.setStyleById(THEME_TO_STYLE_ID[theme]);
				console.log("[MAP_COMPONENT] Theme applied:", theme);
			}

			const controlContent = `
        <div class="mapgl-geolocate-control">
          <button class="mapgl-geolocate-button" title="Моё местоположение">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <path fill="currentColor" d="M17.89 26.27l-2.7-9.46-9.46-2.7 18.92-6.76zm-5.62-12.38l4.54 1.3 1.3 4.54 3.24-9.08z"/>
            </svg>
          </button>
        </div>
      `;

			control = new mapglAPI.Control(map, controlContent, {
				position: "centerRight",
			});

			button = control
				.getContainer()
				.querySelector(".mapgl-geolocate-button");

			if (button) {
				button.addEventListener("click", geoFindMe);
				console.log(
					"[MAP_COMPONENT] Geolocation button event listener added"
				);
			}

			console.log("[MAP_COMPONENT] showRoute state:", showRoute);

			if (!showRoute) {
				console.log(
					"[MAP_COMPONENT] Adding field markers, count:",
					markers.length
				);
				markers.forEach((markerData, index) => {
					console.log(
						"[MAP_COMPONENT] Adding marker",
						index,
						":",
						markerData
					);
					if (map) {
						const marker = new mapglAPI.Marker(map, {
							coordinates: markerData.coordinates,
						});

						if (onMarkerClick) {
							marker.on("click", (e) => {
								console.log(
									"[MAP_COMPONENT] Marker clicked, courtInfoId:",
									markerData.courtInfoId
								);
								onMarkerClick(markerData.courtInfoId);
							});
						}

						markersRef.current.push(marker);
					}
				});

				if (markers.length > 0) {
					console.log("[MAP_COMPONENT] Centering map on markers");
					const lats = markers.map((m) => m.coordinates[0]);
					const lons = markers.map((m) => m.coordinates[1]);

					const validLats = lats.filter(
						(lat) => typeof lat === "number" && !isNaN(lat)
					);
					const validLons = lons.filter(
						(lon) => typeof lon === "number" && !isNaN(lon)
					);

					if (validLats.length > 0 && validLons.length > 0) {
						const centerLat =
							validLats.reduce((a, b) => a + b, 0) /
							validLats.length;
						const centerLon =
							validLons.reduce((a, b) => a + b, 0) /
							validLons.length;
						map.setCenter([centerLat, centerLon]);
						map.setZoom(markers.length === 1 ? 16 : 14);
					}
				}
			}

			if (showRoute && userPosition && destinationCoords) {
				console.log("[MAP_COMPONENT] Building route with data:", {
					userPosition,
					destinationCoords,
					routeType,
				});

				addUserMarker(userPosition);
				addDestinationMarker(destinationCoords);

				const bounds = {
					southWest: [
						Math.min(userPosition[0], destinationCoords[0]),
						Math.min(userPosition[1], destinationCoords[1]),
					] as [number, number],
					northEast: [
						Math.max(userPosition[0], destinationCoords[0]),
						Math.max(userPosition[1], destinationCoords[1]),
					] as [number, number],
				};
				map.fitBounds(bounds);
				console.log(
					"[MAP_COMPONENT] Map fitted to route bounds:",
					bounds
				);

				if (routeType) {
					if (!directionsRef.current) {
						console.log(
							"[MAP_COMPONENT] Creating directions instance"
						);
						directionsRef.current = new Directions(map, {
							directionsApiKey: import.meta.env.VITE_2GIS_API_KEY,
						});
					}

					const points = [userPosition, destinationCoords];
					console.log(
						"[MAP_COMPONENT] Building route with points:",
						points
					);

					if (routeType === "car") {
						console.log("[MAP_COMPONENT] Building car route");
						directionsRef.current.carRoute({
							points: points,
						});
					} else if (routeType === "pedestrian") {
						console.log(
							"[MAP_COMPONENT] Building pedestrian route"
						);
						directionsRef.current.pedestrianRoute({
							points: points,
						});
					}
				}
			} else if (showRoute) {
				console.log(
					"[MAP_COMPONENT] Cannot build route, missing data:",
					{
						showRoute,
						hasUserPosition: !!userPosition,
						hasDestinationCoords: !!destinationCoords,
						hasRouteType: !!routeType,
					}
				);
			}
		};

		start();

		return () => {
			console.log("[MAP_COMPONENT] Cleanup started");

			markersRef.current.forEach((m, index) => {
				console.log("[MAP_COMPONENT] Destroying marker", index);
				m.destroy();
			});
			markersRef.current = [];

			if (circleRef.current) {
				console.log("[MAP_COMPONENT] Destroying circle marker");
				circleRef.current.destroy();
				circleRef.current = null;
			}

			if (destinationMarkerRef.current) {
				console.log("[MAP_COMPONENT] Destroying destination marker");
				destinationMarkerRef.current.destroy();
				destinationMarkerRef.current = null;
			}

			if (userMarkerRef.current) {
				console.log("[MAP_COMPONENT] Destroying user marker");
				userMarkerRef.current.destroy();
				userMarkerRef.current = null;
			}

			if (directionsRef.current) {
				console.log("[MAP_COMPONENT] Destroying directions");
				directionsRef.current.destroy();
				directionsRef.current = null;
			}

			if (button) {
				console.log(
					"[MAP_COMPONENT] Removing geolocation button event listener"
				);
				button.removeEventListener("click", geoFindMe);
			}

			if (control) {
				console.log("[MAP_COMPONENT] Destroying control");
				control.destroy();
			}

			if (mapRef.current) {
				console.log("[MAP_COMPONENT] Destroying map");
				mapRef.current.destroy();
				mapRef.current = null;
			}

			console.log("[MAP_COMPONENT] Cleanup completed");
		};
	}, [
		markers,
		theme,
		onMarkerClick,
		showRoute,
		userPosition,
		destinationCoords,
		routeType,
	]);

	return (
		<MapWrapper
			className={className}
			style={{ width: "100%", height: "100%" }}
		/>
	);
};
