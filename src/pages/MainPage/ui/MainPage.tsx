import { Avatar } from "@maxhub/max-ui";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { MapComponent } from "@/shared/ui/Map/MapComponent.tsx";
import { Select, type SelectOption } from "@/shared/ui/Select/Select.tsx";
import cls from "./MainPage.module.scss";

const sports: SelectOption[] = [
	{ id: 1, name: "Футбол" },
	{ id: 2, name: "Баскетбол" },
	{ id: 3, name: "Теннис" },
	{ id: 4, name: "Волейбол" },
];

const MainPage = () => {
	const { user } = useMax();
	const { t } = useTranslation();
	const [selectedSport, setSelectedSport] = useState<SelectOption>(sports[0]);

	return (
		<div className={cls["main-page"]}>
			<MapComponent />
			<div className={cls.avatar}>
				<Avatar.Container
					size={50}
					form={"circle"}
				>
					<Avatar.Image
						fallback="ME"
						fallbackGradient={"blue"}
						src={user?.photo_url}
					/>
				</Avatar.Container>
			</div>
			<div className={cls.filter}>
				<Select
					options={sports}
					value={selectedSport}
					onChange={setSelectedSport}
				/>
			</div>
		</div>
	);
};

export default memo(MainPage);
