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
import { courtBookingReducer } from "@/features/courtBooking";
import { getSport, SportFilter } from "@/features/sportFilter";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { ClickableAvatar } from "@/shared/ui/ClickableAvatar/ClickableAvatar.tsx";
import {
	MapComponent,
	type MarkerData,
} from "@/shared/ui/Map/MapComponent.tsx";
import { CourtListAndDetails } from "@/widgets/CourtListAndDetails";
import cls from "./MainPage.module.scss";

const reducers: ReducersList = {
	court: courtReducer,
	courtBooking: courtBookingReducer,
	courtsCords: courtsCordsReducer,
};

const MainPage = () => {
	const { user } = useMax();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const dispatch = useAppDispatch();
	const currentSport = useSelector(getSport);
	const courts = useSelector(getCourtPageData);
	const hasMore = useSelector(getCourtPageHasMore);
	const isLoadingCourt = useSelector(getCourtPageIsLoading);
	const courtsCords = useSelector(getCourtsCords);
	const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dispatch(fetchCourts({}));
	}, [dispatch, currentSport]);

	useEffect(() => {
		dispatch(fetchCourtsCord({ cityId: 1, courtType: currentSport }));
	}, [dispatch, currentSport]);

	useInfiniteScroll({
		callback: () => {
			if (hasMore && !isLoadingCourt) {
				dispatch(fetchNextCourtsPage());
			}
		},
		triggerRef,
		wrapperRef,
	});

	const destinationParam = searchParams.get("destination");
	const destinationCoords = destinationParam
		? (destinationParam.split(",").map(Number) as [number, number])
		: undefined;

	console.log("Дестинейшен:", destinationCoords);
	console.log("searchParams:", `/?route=1${searchParams}`);

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
				<MapComponent
					className={cls.map}
					markers={markersData}
					theme={theme}
					onMarkerClick={handleMarkerClick}
					destinationCoords={destinationCoords}
					showRoute={!!destinationCoords}
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
