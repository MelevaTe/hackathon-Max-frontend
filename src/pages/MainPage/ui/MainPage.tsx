import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getCourtsData } from "@/entities/Court/model/selectors/getCourtsData.ts";
import { fetchCourts } from "@/entities/Court/model/services/fetchCourts.ts";
import { courtReducer } from "@/entities/Court/model/slice/courtSchemaSlice.ts";
import { SportFilter } from "@/features/sportFilter";
import { getSport } from "@/features/sportFilter/model/selectors/getSport.ts";
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
};

const MainPage = () => {
	const { user } = useMax();
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const currentSport = useSelector(getSport);
	const courts = useSelector(getCourtsData);


	useEffect(() => {
		dispatch(fetchCourts({ courtType: currentSport }));
	}, [dispatch, currentSport]);


	return (
		<DynamicModuleLoader reducers={reducers}>
			<div className={cls["main-page"]}>
				<MapComponent />
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
