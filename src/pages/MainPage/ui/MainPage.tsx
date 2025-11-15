import { skipToken } from "@reduxjs/toolkit/query";
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useTheme } from "@/app/providers/ThemeProvider";
import {
	courtReducer,
	fetchCourts,
	fetchNextCourtsPage,
	getCourtPageData,
	getCourtPageHasMore,
	getCourtPageIsLoading,
	useGetCourtByIdQuery,
} from "@/entities/Court";
import { courtActions } from "@/entities/Court/model/slice/courtSchemaSlice.ts";
import {
	type CourtsCords,
	courtsCordsReducer,
	fetchCourtsCord,
	getCourtsCords,
} from "@/entities/CourtCord";
import {
	selectUserLocation,
	selectUserLocationCoords,
} from "@/entities/UserLocation";
import {
	selectDailyForecast,
	useGetForecastQuery,
	WeatherForecast,
} from "@/entities/weather";
import { courtBookingReducer } from "@/features/courtBooking";
import { getSport, SportFilter } from "@/features/sportFilter";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";
import { ClickableAvatar } from "@/shared/ui/ClickableAvatar/ClickableAvatar.tsx";
import {
	MapComponent,
	type MarkerData,
} from "@/shared/ui/MapComponent/MapComponent.tsx";
import { CourtListAndDetails } from "@/widgets/CourtListAndDetails";
import { LocationSelectorModal } from "@/widgets/LocationSelectorModal";
import cls from "./MainPage.module.scss";

const reducers: ReducersList = {
	court: courtReducer,
	courtBooking: courtBookingReducer,
	courtsCords: courtsCordsReducer,
};

const MainPage = () => {
	const { user } = useMax();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const dispatch = useAppDispatch();
	const currentSport = useSelector(getSport);
	const userLocation = useSelector(selectUserLocation);
	const courts = useSelector(getCourtPageData);
	const hasMore = useSelector(getCourtPageHasMore);
	const isLoadingCourt = useSelector(getCourtPageIsLoading);
	const userLocationCoords = useSelector(selectUserLocationCoords);
	const courtsCords = useSelector(getCourtsCords);
	const {
		resetForNewRoute,
		showRoute,
		userPosition,
		destinationCoords,
		routeType,
	} = useRoute();
	const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const {
		data: forecast,
		isLoading: isLoadingForecast,
		error: forecastError,
	} = useGetForecastQuery(
		userLocationCoords
			? { lat: userLocationCoords[1], lon: userLocationCoords[0] }
			: skipToken
	);

	const dailyForecast = useMemo(
		() => selectDailyForecast(forecast),
		[forecast]
	);

	useEffect(() => {
		resetForNewRoute();

		dispatch(courtActions.clearCourts());

		if (userLocation?.id) {
			dispatch(
				fetchCourts({
					cityId: userLocation.id,
					sports: [currentSport],
					page: 0,
				})
			);
		}
	}, [dispatch, currentSport, userLocation?.id, resetForNewRoute]);

	useEffect(() => {
		if (userLocation?.id) {
			dispatch(
				fetchCourtsCord({
					cityId: userLocation.id,
					courtType: currentSport,
				})
			);
		}
	}, [dispatch, currentSport, userLocation?.id]);

	const handleLoadMore = useCallback(() => {
		if (hasMore && !isLoadingCourt && userLocation?.id) {
			dispatch(
				fetchNextCourtsPage({
					cityId: userLocation.id,
					sports: [currentSport],
				})
			);
		}
	}, [
		hasMore,
		isLoadingCourt,
		userLocation?.id,
		dispatch,
		currentSport,
		courts?.length,
	]);

	useInfiniteScroll({
		callback: handleLoadMore,
		triggerRef,
		wrapperRef,
	});

	const {
		data: selectedCourt,
		isLoading,
		error,
	} = useGetCourtByIdQuery(selectedCourtId!, {
		skip: !selectedCourtId,
	});

	const handleMarkerClick = useCallback((courtInfoId: string) => {
		setSelectedCourtId(courtInfoId);
	}, []);

	const transformCourtsCordsToMarkers = (
		courtsCords: CourtsCords[]
	): MarkerData[] => {
		return courtsCords.map((court) => ({
			id: court.id,
			coordinates: [court.lon, court.lat],
			courtInfoId: court.courtInfoId,
		}));
	};

	const markersData = transformCourtsCordsToMarkers(courtsCords || []);

	return (
		<DynamicModuleLoader reducers={reducers}>
			<div className={cls["main-page"]}>
				<LocationSelectorModal />
				<MapComponent
					className={cls.map}
					markers={showRoute ? [] : markersData}
					userPosition={userPosition}
					destinationCoords={destinationCoords}
					routeType={routeType}
					showRoute={showRoute}
					theme={theme}
					onMarkerClick={handleMarkerClick}
					centerCoords={userLocationCoords}
				/>
				<div className={cls.avatar}>
					<ClickableAvatar
						userId={user?.id}
						photoUrl={user?.photo_url}
						fallback="ME"
						size={50}
					/>
				</div>
				<SportFilter className={cls.filter} />
				<WeatherForecast
					forecast={dailyForecast}
					isLoading={isLoading}
					className={cls.weatherForecast}
				/>
				<CourtListAndDetails
					wrapperRef={wrapperRef}
					courts={courts}
					initialCourt={selectedCourt}
					initialView="details"
					triggerRef={triggerRef}
				/>
			</div>
		</DynamicModuleLoader>
	);
};

export default memo(MainPage);
