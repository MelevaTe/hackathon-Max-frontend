import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import {
	courtReducer,
	fetchCourts,
	useGetCourtByIdQuery,
} from "@/entities/Court";
import {
	getCourtPageData,
	getCourtPageHasMore,
	getCourtPageIsLoading,
} from "@/entities/Court/model/selectors/courtPageSelectors.ts";
import { fetchNextCourtsPage } from "@/entities/Court/model/services/fetchNextCourtsPage.ts";
import {
	type CourtsCords,
	courtsCordsReducer,
	fetchCourtsCord,
	getCourtsCords,
} from "@/entities/CourtCord";
import { selectUserLocation } from "@/entities/UserLocation";
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
} from "@/shared/ui/Map/MapComponent.tsx";
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
	const courtsCords = useSelector(getCourtsCords);
	const { userPosition, destinationCoords, routeType, showRoute } =
		useRoute();
	const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (userLocation?.id) {
			dispatch(
				fetchCourts({
					cityId: userLocation.id,
					sports: [currentSport],
				})
			);
		}
	}, [dispatch, currentSport, userLocation?.id]);

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

	useInfiniteScroll({
		callback: () => {
			if (hasMore && !isLoadingCourt && userLocation?.id) {
				dispatch(
					fetchNextCourtsPage({
						cityId: userLocation.id,
						sports: [currentSport],
					})
				);
			}
		},
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

	console.log("[PARENT_COMPONENT] Map props:", {
		markers: markersData,
		showRoute,
		userPosition,
		destinationCoords,
		routeType,
	});

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
