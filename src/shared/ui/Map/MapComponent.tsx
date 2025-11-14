import { load } from "@2gis/mapgl";
import { useEffect, useRef } from "react";
import { MapWrapper } from "./MapWrapper";
import "./Map.scss";
import { Theme } from "@/app/providers/ThemeProvider";
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";

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
}

export const MapComponent = ({
	className,
	markers = [],
	theme,
	onMarkerClick,
}: MapProps) => {
	const { showRoute, userPosition, destinationCoords } = useRoute();

	const mapRef = useRef<mapgl.Map | null>(null);
	const mapglRef = useRef<any>(null);
	const markersRef = useRef<mapgl.Marker[]>([]);
	const circleRef = useRef<mapgl.CircleMarker | null>(null);
	const destinationMarkerRef = useRef<mapgl.Marker | null>(null);
	const userMarkerRef = useRef<mapgl.Marker | null>(null);

	useEffect(() => {
		let map: mapgl.Map | null = null;
		let control: mapgl.Control | null = null;
		let button: HTMLElement | null = null;

		const addDestinationMarker = (coords: [number, number]) => {
			if (!mapRef.current || !mapglRef.current) return;

			if (destinationMarkerRef.current) {
				destinationMarkerRef.current.destroy();
			}

			const marker = new mapglRef.current.Marker(mapRef.current, {
				coordinates: coords,
			});
			destinationMarkerRef.current = marker;
		};

		const addUserMarker = (coords: [number, number]) => {
			if (!mapRef.current || !mapglRef.current) return;

			if (userMarkerRef.current) {
				userMarkerRef.current.destroy();
			}

			const marker = new mapglRef.current.Marker(mapRef.current, {
				coordinates: coords,
			});
			userMarkerRef.current = marker;
		};

		const geoFindMe = () => {
			if (!navigator.geolocation) {
				alert("Геолокация не поддерживается в этом браузере.");
				return;
			}
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const mapglAPI = mapglRef.current;
					const currentMap = mapRef.current;

					if (!mapglAPI || !currentMap) return;

					const center: [number, number] = [
						pos.coords.longitude,
						pos.coords.latitude,
					];

					if (circleRef.current) {
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

					currentMap.setCenter(center);
					currentMap.setZoom(16);
				},
				(error) => {
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
			const mapglAPI = await load();
			mapglRef.current = mapglAPI;

			const initialCenter: [number, number] = [39.712619, 47.23683];

			map = new mapglAPI.Map("map-container", {
				center: initialCenter,
				zoom: 17,
				key: import.meta.env.VITE_2GIS_API_KEY,
				zoomControl: "centerRight",
				trafficControl: "centerRight",
			});

			mapRef.current = map;

			if (THEME_TO_STYLE_ID[theme]) {
				map.setStyleById(THEME_TO_STYLE_ID[theme]);
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
			}

			if (!showRoute) {
				markers.forEach((markerData) => {
					if (map) {
						const marker = new mapglAPI.Marker(map, {
							coordinates: markerData.coordinates,
						});

						if (onMarkerClick) {
							marker.on("click", (e) => {
								onMarkerClick(markerData.courtInfoId);
							});
						}

						markersRef.current.push(marker);
					}
				});

				if (markers.length > 0) {
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

			if (showRoute && userPosition) {
				addUserMarker(userPosition);

				if (destinationCoords) {
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
					addDestinationMarker(destinationCoords);
				}
			}
		};

		start();

		return () => {
			markersRef.current.forEach((m) => m.destroy());
			markersRef.current = [];

			if (circleRef.current) {
				circleRef.current.destroy();
				circleRef.current = null;
			}

			if (destinationMarkerRef.current) {
				destinationMarkerRef.current.destroy();
				destinationMarkerRef.current = null;
			}

			if (userMarkerRef.current) {
				userMarkerRef.current.destroy();
				userMarkerRef.current = null;
			}

			if (button) {
				button.removeEventListener("click", geoFindMe);
			}

			if (control) control.destroy();

			if (mapRef.current) {
				mapRef.current.destroy();
				mapRef.current = null;
			}
		};
	}, [
		markers,
		theme,
		onMarkerClick,
		showRoute,
		userPosition,
		destinationCoords,
	]);

	return (
		<MapWrapper
			className={className}
			style={{ width: "100%", height: "100%" }}
		/>
	);
};
