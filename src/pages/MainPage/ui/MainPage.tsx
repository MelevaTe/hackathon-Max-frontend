import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { MapComponent } from "@/shared/ui/Map/MapComponent.tsx";
import cls from "./MainPage.module.scss";

const MainPage = () => {
	const { max, user } = useMax();
	const { t } = useTranslation();

	return (
		<div className={cls["main-page"]}>
			<MapComponent />
			<div className={cls["avatar"]} />
		</div>
	);
};

export default memo(MainPage);
