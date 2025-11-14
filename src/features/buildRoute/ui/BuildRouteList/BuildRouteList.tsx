import { Typography, IconButton, Input, Button } from "@maxhub/max-ui";
import { X, Car, User, Search, Calendar1 } from "lucide-react";
import { memo, useState, useEffect } from "react";
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
	const [isGeoLocation, setIsGeoLocation] = useState(false);

	const debouncedSetAddress = useDebounce((value: string) => {
		setDebouncedUserAddress(value);
	}, 500);

	useEffect(() => {
		debouncedSetAddress(userAddress);
	}, [userAddress, debouncedSetAddress]);

	useEffect(() => {
		if (userPosition || isGeoLocation) return;

		if (navigator.geolocation) {
			setIsGeoLocation(true);

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const coords: [number, number] = [
						position.coords.longitude,
						position.coords.latitude,
					];
					console.log("Координаты определены: ", coords);
					updateUserPosition(coords);
					toast.success("Местоположение определено");
				},
				(error) => {
					toast.error(
						"Не удалось определить местоположение. Введите адрес вручную"
					);
				}
			);
		} else {
			setIsGeoLocation(true);
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
			const { lat, lon } = userGeocodeItems[0].point;
			const coords: [number, number] = [lon, lat];
			updateUserPosition(coords);
		}
	}, [userGeocodeItems, updateUserPosition]);

	const handleSetRouteType = (type: "car" | "pedestrian") => {
		setRouteType(type);
	};

	const handleBuildRoute = () => {
		if (userPosition && destinationCoords && routeType) {
			setShowRoute(true);
			onBack();
		} else {
			if (!userPosition) {
				toast.error("Местоположение определено");
			} else if (!routeType) {
				toast.error("Выберите тип маршрута");
			} else if (!destinationCoords) {
				toast.error("Не указан пункт назначения");
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
				<div style={{fontSize: '12px', marginBottom: '10px'}}>
					User: {userPosition ? `[${userPosition.join(', ')}]` : 'не определено'}<br/>
					Dest: {destinationCoords ? `[${destinationCoords.join(', ')}]` : 'не определено'}<br/>
					Type: {routeType || 'не выбран'}
				</div>
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
									<X/>
								</IconButton>
							) : (
								<IconButton
									appearance="neutral"
									mode="tertiary"
									size="medium"
									disabled
								>
									<Search/>
								</IconButton>
							)
						}
					/>
					{isUserGeocodeLoading && (
						<Typography.Body>Поиск адреса...</Typography.Body>
					)}
				</div>

				<div className={cls.routeTypeButtons}>
					<Button
						appearance={routeType === "car" ? "themed" : "neutral"}
						mode="primary"
						size="medium"
						className={cls.actionButton}
						onClick={() => handleSetRouteType("car")}
						iconBefore={<Car/>}
					>
						На машине
					</Button>
					<Button
						appearance={
							routeType === "pedestrian" ? "themed" : "neutral"
						}
						mode="primary"
						size="medium"
						className={cls.actionButton}
						onClick={() => handleSetRouteType("pedestrian")}
						iconBefore={<User/>}
					>
						пешком
					</Button>
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
