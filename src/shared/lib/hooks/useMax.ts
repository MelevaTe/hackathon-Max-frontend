import { useEffect, useState } from "react";

interface UseMaxReturn {
	max: WebApp | null;
	user: WebAppUser | undefined;
	initData: string | undefined;
	isInMax: boolean | null;
	onClose: () => void;
}

export const useMax = (): UseMaxReturn => {
	const [isInMax, setIsInMax] = useState<boolean | null>(null);
	const [max, setMax] = useState<WebApp | null>(null);

	useEffect(() => {
		const webApp = typeof window !== "undefined" ? window.WebApp : null;

		if (webApp && webApp.initData) {
			setIsInMax(true);
			setMax(webApp);
		} else {
			setIsInMax(false);
			setMax(null);
		}
	}, []);

	const onClose = () => {
		if (max) {
			max.close();
		}
	};

	const initData = max?.initData;
	const user = max?.initDataUnsafe?.user;

	return {
		max,
		initData,
		user,
		isInMax,
		onClose,
	};
};
