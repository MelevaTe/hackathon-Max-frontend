import { Avatar } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import { MapComponent } from "@/shared/ui/Map/MapComponent.tsx";
import cls from "./MainPage.module.scss";

const MainPage = () => {
	const { user } = useMax();
	const { t } = useTranslation();

	return (
		<div className={cls["main-page"]}>
			<Avatar.Container
				size={50}
				form={"circle"}
				rightBottomCorner={<Avatar.OnlineDot />}
			>
				<Avatar.Image
					fallback="ME"
					fallbackGradient={"blue"}
					src={user?.photo_url}
				/>
			</Avatar.Container>
			{/*<MapComponent />*/}
			{/*<div className={cls["avatar"]}>*/}
			{/*</div>*/}
		</div>
	);
};

export default memo(MainPage);
