import { Typography, IconButton, Input, Button } from "@maxhub/max-ui";
import { X, Car, User, Search } from "lucide-react";
import { memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGeocodeQuery } from "@/features/buildRoute/api/buildRouteApi.ts";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";
import cls from "./BuildRouteList.module.scss";

interface RouteListProps {
	className?: string;
	onBack: () => void;
}

export const RouteList = memo((props: RouteListProps) => {
	const { className, onBack } = props;
	const { t } = useTranslation();
	const {
		setShowRoute,
		setRoute,
		destinationCoords,
		userPosition,
		updateUserPosition,
		routeType,
		setRouteType,
	} = useRoute();

	const [userAddress, setUserAddress] = useState("");
	const [debouncedUserAddress, setDebouncedUserAddress] = useState("");

	console.log("[ROUTE_LIST] Component rendered with props:", {
		userPosition,
		destinationCoords,
		routeType,
	});

	useEffect(() => {
		console.log(
			"[ROUTE_LIST] useEffect for geolocation, userPosition:",
			userPosition
		);
		if (!userPosition) {
			if (navigator.geolocation) {
				console.log("[ROUTE_LIST] Requesting geolocation...");
				navigator.geolocation.getCurrentPosition(
					(position) => {
						console.log(
							"[ROUTE_LIST] Geolocation success:",
							position.coords
						);
						const coords: [number, number] = [
							position.coords.longitude,
							position.coords.latitude,
						];
						updateUserPosition(coords);
					},
					(error) => {
						console.error(
							"[ROUTE_LIST] Error getting geolocation:",
							error.message
						);
					}
				);
			} else {
				console.log("[ROUTE_LIST] Geolocation not supported");
			}
		}
	}, [userPosition, updateUserPosition]);

	const debouncedSetUserAddress = useDebounce((value: string) => {
		console.log("[ROUTE_LIST] Debounced address set:", value);
		setDebouncedUserAddress(value);
	}, 500);

	useEffect(() => {
		debouncedSetUserAddress(userAddress);
	}, [userAddress, debouncedSetUserAddress]);

	const { data: userGeocodeItems, isLoading: isUserGeocodeLoading } =
		useGeocodeQuery(
			{ q: debouncedUserAddress, key: import.meta.env.VITE_2GIS_API_KEY },
			{ skip: !debouncedUserAddress }
		);

	useEffect(() => {
		if (userGeocodeItems?.[0]) {
			console.log("[ROUTE_LIST] Geocoding result:", userGeocodeItems[0]);
			const { lat, lon } = userGeocodeItems[0].point;
			const coords: [number, number] = [lon, lat];
			console.log(
				"[ROUTE_LIST] Updating user position from geocoding:",
				coords
			);
			updateUserPosition(coords);
		}
	}, [userGeocodeItems, updateUserPosition]);

	const handleSetRouteType = (type: "car" | "pedestrian") => {
		console.log("[ROUTE_LIST] handleSetRouteType:", type);
		setRouteType(type);
	};

	const handleBuildRoute = () => {
		console.log("[ROUTE_LIST] handleBuildRoute called with:", {
			userPosition,
			destinationCoords,
			routeType,
		});

		if (userPosition && destinationCoords && routeType) {
			console.log("[ROUTE_LIST] Setting showRoute to true");
			setShowRoute(true);
		} else {
			console.log("[ROUTE_LIST] Cannot build route, missing data:", {
				hasUserPosition: !!userPosition,
				hasDestinationCoords: !!destinationCoords,
				hasRouteType: !!routeType,
			});
		}
	};

	return (
		<div className={classNames(cls.RouteList, {}, [className])}>
			<div className={cls.header}>
				<Typography.Headline>Построить маршрут</Typography.Headline>
				<IconButton
					appearance="neutral"
					aria-label="Закрыть"
					mode="tertiary"
					size="medium"
					onClick={onBack}
				>
					<X />
				</IconButton>
			</div>
			<div className={cls.content}>
				<Input
					value={userAddress}
					onChange={(e) => {
						setUserAddress(e.target.value);
						console.log(
							"[ROUTE_LIST] User address input changed:",
							e.target.value
						);
					}}
					placeholder="Ваш адрес"
					iconAfter={
						<IconButton
							appearance="neutral"
							mode="tertiary"
							size="medium"
						>
							<Search />
						</IconButton>
					}
				/>

				<div className={cls.routeTypeButtons}>
					<IconButton
						appearance={routeType === "car" ? "themed" : "neutral"}
						mode="primary"
						size="medium"
						onClick={() => handleSetRouteType("car")}
					>
						<Car />
					</IconButton>
					<IconButton
						appearance={
							routeType === "pedestrian" ? "themed" : "neutral"
						}
						mode="primary"
						size="medium"
						onClick={() => handleSetRouteType("pedestrian")}
					>
						<User />
					</IconButton>
				</div>

				<Button
					appearance="themed"
					mode="primary"
					size="large"
					onClick={handleBuildRoute}
					disabled={!userPosition || !destinationCoords || !routeType}
					className={cls.buildButton}
				>
					Построить маршрут
				</Button>
			</div>
		</div>
	);
});
