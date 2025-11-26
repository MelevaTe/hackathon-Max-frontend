import { Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { AppRouter } from "@/app/providers/router";
import { AuthService } from "@/shared/api/authService.ts";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/const/localstorage.ts";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";

function App() {
	const { max, initData } = useMax();

	useEffect(() => {
		if (max) {
			max.ready();
		}
	}, [max]);

	useEffect(() => {
		if (initData) {
			const existingToken = localStorage.getItem(
				ACCESS_TOKEN_LOCAL_STORAGE_KEY
			);

			if (!existingToken) {
				AuthService.loginWithInitData(initData)
					.then(({ token, userId, role }) => {})
					.catch((err) => {
						console.error("Ошибка аутентификации", err);
					});
			}
		}
	}, [initData]);

	return (
		<div className={classNames("app", {}, [])}>
			<Suspense fallback="">
				<div className="content-page">{<AppRouter />}</div>
			</Suspense>
			<Toaster
				position="top-center"
				reverseOrder={false}
				toastOptions={{
					style: {
						padding: "8px 12px",
						fontSize: "14px",
						width: "170px",
					},
				}}
			/>
		</div>
	);
}

export default App;
