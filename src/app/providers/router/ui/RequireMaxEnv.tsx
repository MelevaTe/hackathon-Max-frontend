import type { JSX } from "react";
import { useMax } from "@/shared/lib/hooks/useMax.ts";

export function RequireMaxEnv({ children }: { children?: JSX.Element }) {
	const { isInMax } = useMax();

	// if (isInMax === null) {
	// 	return <div>Проверка окружения...</div>;
	// }
	//
	// if (!isInMax) {
	// 	return <div>Откройте данное приложение в MAX</div>;
	// }

	return <>{children}</>;
}
