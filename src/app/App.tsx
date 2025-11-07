import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppRouter } from "@/app/providers/router";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";

function App() {
	const { max, user } = useMax();
	const { i18n } = useTranslation();

	useEffect(() => {
		if (user?.language_code) {
			const lang = user.language_code.startsWith("ru") ? "ru" : "en";
			if (i18n.language !== lang) {
				i18n.changeLanguage(lang);
			}
		}
	}, [user?.language_code, i18n]);

	useEffect(() => {
		if (max) {
			max.ready();
		}
	}, [max]);

	return (
		<div className={classNames("app", {}, [])}>
			<Suspense fallback="">
				<div className="content-page">{<AppRouter />}</div>
			</Suspense>
		</div>
	);
}

export default App;
