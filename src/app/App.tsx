import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";

function App() {
	const { max, user } = useMax();
	const { t, i18n } = useTranslation();

	useEffect(() => {
		if (user?.language_code) {
			const lang = user.language_code.startsWith("ru") ? "ru" : "en";
			if (i18n.language !== lang) {
				i18n.changeLanguage(lang);
			}
		}
	}, [user?.language_code, i18n]);

	useEffect(() => {
		max.ready();
	}, []);

	if (!user) {
		return (
			<div className={classNames("app", {}, [])}>
				<div className="content-page">
					<p>Не удалось получить данные пользователя.</p>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames("app", {}, [])}>
			<div className="content-page">
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
				{user.photo_url && (
					<img
						src={user.photo_url}
						alt="user avatar"
					/>
				)}
			</div>
		</div>
	);
}

export default App;
