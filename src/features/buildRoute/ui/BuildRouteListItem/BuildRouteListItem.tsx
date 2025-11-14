import { Typography } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Card } from "@/shared/ui/Card/Card.tsx";
import cls from "./BuildRouteListItem.module.scss";
import type { RouteResponseItem } from "../../model/types/buildRoute";

interface RouteListItemProps {
	className?: string;
	route: RouteResponseItem;
	onClick: () => void;
}

export const RouteListItem = memo((props: RouteListItemProps) => {
	const { className, route, onClick } = props;
	const { t } = useTranslation();

	const duration = Math.round(route.total_duration / 60);
	const transfers = route.transfer_count;
	const transports = route.transport?.join(", ") || "Неизвестно";
	const walkway = route.total_walkway_distance;

	return (
		<Card
			className={classNames(cls.RouteListItem, {}, [className])}
			// onClick={handleClick}
		>
			<div className={cls.header}>
				<Typography.Body
					variant="large"
					className={cls.duration}
				>
					{duration} мин
				</Typography.Body>
				<Typography.Body className={cls.transports}>
					{transports}
				</Typography.Body>
			</div>
			<div className={cls.info}>
				<Typography.Body>Пересадок: {transfers}</Typography.Body>
				<Typography.Body>Пешком: {walkway}</Typography.Body>
			</div>
		</Card>
	);
});
