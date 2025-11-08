import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { SportFilter } from "@/features/sportFilter";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { ClickableAvatar } from "@/shared/ui/ClickableAvatar/ClickableAvatar.tsx";
import { MapComponent } from "@/shared/ui/Map/MapComponent.tsx";
import cls from "./MainPage.module.scss";

const MainPage = () => {
	const { user } = useMax();
	const { t } = useTranslation();

	return (
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
		</div>
	);
};

export default memo(MainPage);
