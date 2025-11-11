import { Button, Typography } from "@maxhub/max-ui";
import type { JSX } from "react";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import cls from "./RequireMaxEnv.module.scss";

export function RequireMaxEnv({ children }: { children?: JSX.Element }) {
	const { isInMax } = useMax();

	if (isInMax === null) {
		return <div>Проверка окружения...</div>;
	}

	if (!isInMax) {
		return (
			<div className={classNames(cls.requireMaxEnv, {}, [])}>
				<Typography.Action variant="large">
					Откройте данное приложение в Max
				</Typography.Action>
				<Button
					appearance="themed"
					asChild
					mode="primary"
					size="medium"
				>
					<a
						href="https://web.max.ru/11929912"
						rel="noreferrer"
						target="_blank"
					>
						Перейти в Max!
					</a>
				</Button>
			</div>
		);
	}

	return <>{children}</>;
}
