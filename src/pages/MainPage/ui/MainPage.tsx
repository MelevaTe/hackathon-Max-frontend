import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useMax } from "@/shared/lib/hooks/useMax.ts";

const MainPage = () => {
	const { max, user } = useMax();
	const { t } = useTranslation();

	if (!user) {
		return <div>Загрузка данных пользователя</div>;
	}

	return (
		<div>
			<h1>Привет:</h1>
			<p>имя</p>
			<p>{user.first_name || "—"}</p>
			<p>id</p>
			<p>{user.id || "—"}</p>
			<p>фамилия</p>
			<p>{user.last_name || "—"}</p>
			<p>username</p>
			<p>{user.username || "—"}</p>
			<p>{t("язык")}</p>
			<p>{user.language_code || "—"}</p>
			<p>initdata</p>
			<p>{max?.initData}</p>
			{user.photo_url && (
				<img
					src={user.photo_url}
					alt="user avatar"
				/>
			)}
		</div>
	);
};

export default memo(MainPage);
