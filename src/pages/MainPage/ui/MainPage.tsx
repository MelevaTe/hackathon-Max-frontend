import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { courtReducer, fetchCourts, getCourtsData } from "@/entities/Court";
import { courtBookingReducer } from "@/features/courtBooking";
import { getSport, SportFilter } from "@/features/sportFilter";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { ClickableAvatar } from "@/shared/ui/ClickableAvatar/ClickableAvatar.tsx";
import { MapComponent } from "@/shared/ui/Map/MapComponent.tsx";
import { CourtListAndDetails } from "@/widgets/CourtListAndDetails";
import cls from "./MainPage.module.scss";

const reducers: ReducersList = {
	court: courtReducer,
	courtBooking: courtBookingReducer,
};

const MainPage = () => {
	const { user } = useMax();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const { theme } = useTheme();
	const dispatch = useAppDispatch();
	const currentSport = useSelector(getSport);
	const courts = useSelector(getCourtsData);

	useEffect(() => {
		dispatch(
			fetchCourts({
				sports: [currentSport],
				cityId: "1",
			})
		);
	}, [dispatch, currentSport]);

	const destinationParam = searchParams.get("destination");
	const destinationCoords = destinationParam
		? (destinationParam.split(",").map(Number) as [number, number])
		: undefined;

	console.log("Дестинейшен:", destinationCoords);
	console.log("searchParams:", `/?route=1${searchParams}`);

	return (
		<DynamicModuleLoader reducers={reducers}>
			<div className={cls["main-page"]}>
				<MapComponent
					className={cls.map}
					theme={theme}
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
				<CourtListAndDetails courts={courts} />
			</div>
		</DynamicModuleLoader>
	);
};

export default memo(MainPage);
