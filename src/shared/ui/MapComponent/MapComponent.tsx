import { load } from "@2gis/mapgl";
import type { Map as MapGL, Marker } from "@2gis/mapgl/types";
import { Directions } from "@2gis/mapgl-directions";
import { memo, useEffect, useRef } from "react";
import { Theme } from "@/app/providers/ThemeProvider";
import { MapWrapper } from "./MapWrapper";
import "./Map.scss";

export interface MarkerData {
	id: string;
	coordinates: [number, number];
	courtInfoId: string;
}

interface MapProps {
	className?: string;
	markers?: MarkerData[];
	theme: Theme;
	onMarkerClick?: (courtInfoId: string) => void;
	showRoute: boolean;
	userPosition: [number, number] | null;
	destinationCoords: [number, number] | null;
	routeType: "car" | "pedestrian" | null;
	centerCoords?: [number, number];
}

const THEME_TO_STYLE_ID: Record<Theme, string> = {
	[Theme.LIGHT]: "d013506c-74b4-421f-939d-58c7f475b6b4",
	[Theme.DARK]: "bead9c80-2217-47fe-982e-4d385cc4e151",
};

export const MapComponent = memo(
	({
		className,
		markers = [],
		theme,
		onMarkerClick,
		showRoute,
		userPosition,
		destinationCoords,
		routeType,
		centerCoords,
	}: MapProps) => {
		const mapRef = useRef<MapGL | null>(null);
		const mapglRef = useRef<any>(null);
		const markersRef = useRef<Marker[]>([]);
		const directionsRef = useRef<Directions | null>(null);

		useEffect(() => {
			let map: MapGL | null = null;

			const initMap = async () => {
				const mapglAPI = await load();
				mapglRef.current = mapglAPI;

				const initialCenter = centerCoords || [39.712619, 47.23683];

				map = new mapglAPI.Map("map-container", {
					center: initialCenter,
					zoom: 14,
					key: import.meta.env.VITE_2GIS_API_KEY,
					zoomControl: "centerRight",
					trafficControl: "centerRight",
				});

				mapRef.current = map;

				if (THEME_TO_STYLE_ID[theme]) {
					map.setStyleById(THEME_TO_STYLE_ID[theme]);
				}

				const geoControl = new mapglAPI.Control(
					map,
					`
                <div class="mapgl-geolocate-control">
                    <button class="mapgl-geolocate-button" title="Моё местоположение">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <path fill="currentColor" d="M17.89 26.27l-2.7-9.46-9.46-2.7 18.92-6.76zm-5.62-12.38l4.54 1.3 1.3 4.54 3.24-9.08z"/>
                        </svg>
                    </button>
                </div>
            `,
					{ position: "centerRight" }
				);

				const geoButton = geoControl
					.getContainer()
					.querySelector(".mapgl-geolocate-button");
				if (geoButton) {
					geoButton.addEventListener("click", () => {
						navigator.geolocation.getCurrentPosition(
							(pos) => {
								const coords: [number, number] = [
									pos.coords.longitude,
									pos.coords.latitude,
								];
								map!.setCenter(coords);
								map!.setZoom(16);
							},
							(error) =>
								console.error("Geolocation error:", error)
						);
					});
				}
			};

			initMap();

			return () => {
				markersRef.current.forEach((m) => m.destroy());
				markersRef.current = [];

				if (directionsRef.current) {
					directionsRef.current.clear();
					directionsRef.current = null;
				}

				if (mapRef.current) {
					mapRef.current.destroy();
					mapRef.current = null;
				}
			};
		}, []);

		useEffect(() => {
			if (mapRef.current && THEME_TO_STYLE_ID[theme]) {
				mapRef.current.setStyleById(THEME_TO_STYLE_ID[theme]);
			}
		}, [theme]);

		useEffect(() => {
			const map = mapRef.current;
			const mapglAPI = mapglRef.current;
			if (!map || !mapglAPI) return;

			markersRef.current.forEach((m) => m.destroy());
			markersRef.current = [];

			if (directionsRef.current) {
				directionsRef.current.clear();
			}

			if (showRoute && userPosition && destinationCoords && routeType) {
				if (!directionsRef.current) {
					directionsRef.current = new Directions(map, {
						directionsApiKey: import.meta.env.VITE_2GIS_API_KEY,
					});
				}

				const routeOptions = {
					points: [userPosition, destinationCoords],
				};

				if (routeType === "car") {
					directionsRef.current.carRoute(routeOptions);
				} else {
					directionsRef.current.pedestrianRoute(routeOptions);
				}

				const centerLon = (userPosition[0] + destinationCoords[0]) / 2;
				const centerLat = (userPosition[1] + destinationCoords[1]) / 2;
				map.setCenter([centerLon, centerLat]);
				map.setZoom(13);
			} else if (!showRoute && markers.length > 0) {
				markers.forEach((markerData) => {
					const marker = new mapglAPI.Marker(map, {
						coordinates: markerData.coordinates,
					});

					if (onMarkerClick) {
						marker.on("click", () =>
							onMarkerClick(markerData.courtInfoId)
						);
					}

					markersRef.current.push(marker);
				});

				if (markers.length === 1) {
					map.setCenter(markers[0].coordinates);
					map.setZoom(16);
				} else {
					const lons = markers.map((m) => m.coordinates[0]);
					const lats = markers.map((m) => m.coordinates[1]);
					const centerLon =
						lons.reduce((a, b) => a + b) / lons.length;
					const centerLat =
						lats.reduce((a, b) => a + b) / lats.length;
					map.setCenter([centerLon, centerLat]);
					map.setZoom(14);
				}
			}
		}, [
			markers,
			showRoute,
			userPosition,
			destinationCoords,
			routeType,
			onMarkerClick,
			centerCoords,
		]);

		return (
			<MapWrapper
				className={className}
				style={{ width: "100%", height: "100%" }}
			/>
		);
	}
);

MapComponent.displayName = "MapComponent";
