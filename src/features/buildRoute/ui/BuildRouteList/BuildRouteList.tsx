import { Typography, IconButton, Input, Button } from "@maxhub/max-ui";
import { X, Car, User, Search } from "lucide-react";
import { memo, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
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
		destinationCoords,
		userPosition,
		updateUserPosition,
		routeType,
		setRouteType,
	} = useRoute();

	const [userAddress, setUserAddress] = useState("");
	const [debouncedUserAddress, setDebouncedUserAddress] = useState("");
	const [isGeoLocationAttempted, setIsGeoLocationAttempted] = useState(false);

	const debouncedSetAddress = useDebounce((value: string) => {
		setDebouncedUserAddress(value);
	}, 500);

	useEffect(() => {
		debouncedSetAddress(userAddress);
	}, [userAddress, debouncedSetAddress]);

	useEffect(() => {
		if (userPosition || isGeoLocationAttempted) return;

		if (navigator.geolocation) {
			console.log("[ROUTE_LIST] Requesting geolocation...");
			setIsGeoLocationAttempted(true);

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
					toast.success("Местоположение определено");
				},
				(error) => {
					console.error("[ROUTE_LIST] Geolocation error:", error);
					toast.error(
						"Не удалось определить местоположение. Введите адрес вручную"
					);
				}
			);
		} else {
			console.log("[ROUTE_LIST] Geolocation not supported");
			setIsGeoLocationAttempted(true);
		}
	}, []);

	const { data: userGeocodeItems, isLoading: isUserGeocodeLoading } =
		useGeocodeQuery(
			{
				q: debouncedUserAddress,
				key: import.meta.env.VITE_2GIS_API_KEY,
			},
			{
				skip: !debouncedUserAddress || debouncedUserAddress.length < 3,
			}
		);

	useEffect(() => {
		if (userGeocodeItems?.[0]) {
			console.log("[ROUTE_LIST] Geocoding result:", userGeocodeItems[0]);
			const { lat, lon } = userGeocodeItems[0].point;
			const coords: [number, number] = [lon, lat];
			console.log(
				"[ROUTE_LIST] Setting user position from geocoding:",
				coords
			);
			updateUserPosition(coords);
		}
	}, [userGeocodeItems, updateUserPosition]);

	const handleSetRouteType = (type: "car" | "pedestrian") => {
		console.log("[ROUTE_LIST] Setting route type:", type);
		setRouteType(type);
	};

	const handleBuildRoute = () => {
		console.log("[ROUTE_LIST] Building route with:", {
			userPosition,
			destinationCoords,
			routeType,
		});

		if (userPosition && destinationCoords && routeType) {
			setShowRoute(true);
			onBack();
		} else {
			if (!userPosition) {
				alert("Укажите ваше местоположение");
			} else if (!routeType) {
				alert("Выберите тип маршрута");
			}
		}
	};

	const handleAddressClear = () => {
		setUserAddress("");
		setDebouncedUserAddress("");
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
				<div className={cls.addressInput}>
					<Input
						value={userAddress}
						onChange={(e) => setUserAddress(e.target.value)}
						placeholder={
							userPosition
								? "Местоположение определено"
								: "Введите ваш адрес"
						}
						disabled={isUserGeocodeLoading}
						iconAfter={
							userAddress ? (
								<IconButton
									appearance="neutral"
									mode="tertiary"
									size="medium"
									onClick={handleAddressClear}
									title="Очистить"
								>
									<X />
								</IconButton>
							) : (
								<IconButton
									appearance="neutral"
									mode="tertiary"
									size="medium"
									disabled
								>
									<Search />
								</IconButton>
							)
						}
					/>
					{isUserGeocodeLoading && (
						<Typography.Body>Поиск адреса...</Typography.Body>
					)}
				</div>

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
					{!userPosition
						? "Укажите местоположение"
						: !routeType
							? "Выберите тип маршрута"
							: "Построить маршрут"}
				</Button>
			</div>
		</div>
	);
});
