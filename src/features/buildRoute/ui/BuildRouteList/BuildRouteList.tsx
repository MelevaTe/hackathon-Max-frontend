import { Typography, IconButton, Input } from "@maxhub/max-ui";
import { X, Search } from "lucide-react";
import { memo, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	useBuildRouteQuery,
	useGeocodeQuery,
} from "@/features/buildRoute/api/buildRouteApi.ts";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";
import cls from "./BuildRouteList.module.scss";
import type { RouteResponseItem } from "../../model/types/buildRoute.ts";
import { RouteListItem } from "../BuildRouteListItem/BuildRouteListItem.tsx";

interface RouteListProps {
	className?: string;
	onSelect: (route: RouteResponseItem) => void;
	onBack: () => void;
}

export const RouteList = memo((props: RouteListProps) => {
	const { className, onSelect, onBack } = props;
	const { t } = useTranslation();
	const { userPosition, destinationCoords, updateUserPosition } = useRoute();

	const [address, setAddress] = useState("");
	const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

	useEffect(() => {
		if (!userPosition) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const coords: [number, number] = [
							position.coords.longitude,
							position.coords.latitude,
						];
						updateUserPosition(coords);
					},
					(error) => {
						console.error(
							"Ошибка получения геолокации:",
							error.message
						);
					}
				);
			}
		}
	}, [userPosition, updateUserPosition]);

	const { data: geocodeItems, isLoading: isGeocodeLoading } = useGeocodeQuery(
		{ q: address, key: import.meta.env.VITE_2GIS_API_KEY },
		{ skip: !address }
	);

	const handleSearch = () => {
		if (geocodeItems?.[0]) {
			const { lat, lon } = geocodeItems[0].point;
			setUserCoords([lon, lat]);
		}
	};
	const finalUserCoords = userCoords || userPosition;

	const queryArgs = useMemo(() => {
		if (!finalUserCoords || !destinationCoords) return undefined;

		return {
			key: import.meta.env.VITE_2GIS_API_KEY,
			source: {
				type: "point" as const,
				point: {
					lon: finalUserCoords[0],
					lat: finalUserCoords[1],
				},
			},
			target: {
				type: "point" as const,
				point: {
					lon: destinationCoords[0],
					lat: destinationCoords[1],
				},
			},
			transport: ["bus", "metro", "pedestrian"],
		};
	}, [finalUserCoords, destinationCoords]);

	const {
		data: routes = [],
		isLoading: isRouteLoading,
		isError: isRouteError,
		refetch: refetchRoutes,
	} = useBuildRouteQuery(queryArgs!, {
		skip: !queryArgs,
	});

	if (!finalUserCoords || !destinationCoords) {
		return (
			<div className={classNames(cls.RouteList, {}, [className])}>
				<div className={cls.header}>
					<Typography.Headline>Введите ваш адрес</Typography.Headline>
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
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Введите адрес"
						iconAfter={
							<Search
								onClick={handleSearch}
								style={{ cursor: "pointer" }}
							/>
						}
					/>
				</div>
			</div>
		);
	}

	if (isRouteLoading) {
		return (
			<div className={classNames(cls.RouteList, {}, [className])}>
				<Typography.Body variant="large">
					Загрузка маршрутов...
				</Typography.Body>
			</div>
		);
	}

	if (!routes.length) {
		return (
			<div className={classNames(cls.RouteList, {}, [className])}>
				<Typography.Body variant="large">
					Маршруты не найдены
				</Typography.Body>
			</div>
		);
	}

	return (
		<div className={classNames(cls.RouteList, {}, [className])}>
			<div className={cls.header}>
				<Typography.Headline>Варианты маршрутов</Typography.Headline>
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
				{routes.map((route: RouteResponseItem) => (
					<RouteListItem
						key={route.id}
						route={route}
						onClick={() => onSelect(route)}
					/>
				))}
			</div>
		</div>
	);
});
