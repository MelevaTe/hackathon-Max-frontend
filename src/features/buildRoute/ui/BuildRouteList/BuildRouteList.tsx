import { Typography, IconButton } from "@maxhub/max-ui";
import { X } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./BuildRouteList.module.scss";
import type { RouteResponseItem } from "../../model/types/buildRoute";
import { RouteListItem } from "../BuildRouteListItem/BuildRouteListItem.tsx";

interface RouteListProps {
	className?: string;
	routes: RouteResponseItem[];
	isLoading?: boolean;
	onSelect: (route: RouteResponseItem) => void;
	onBack: () => void;
}

export const RouteList = memo((props: RouteListProps) => {
	const { className, routes, isLoading, onSelect, onBack } = props;
	const { t } = useTranslation();

	if (!isLoading && !routes.length) {
		return (
			<div className={classNames(cls.RouteList, {}, [className])}>
				<Typography.Body variant="large">
					Маршруты не найдены
				</Typography.Body>
			</div>
		);
	}

	return (
		<div className={classNames(cls.RouteList, {}, [className])}>
			<div className={cls.header}>
				<Typography.Headline>Варианты маршрутов</Typography.Headline>
				<IconButton
					appearance="neutral"
					aria-label="Закрыть"
					mode="tertiary"
					size="medium"
					onClick={onBack}
				>
					<X />
				</IconButton>
			</div>
			<div className={cls.content}>
				{routes.map((route) => (
					<RouteListItem
						key={route.id}
						route={route}
						onClick={() => onSelect(route)}
					/>
				))}
				<div style={{ height: "20px", minHeight: "20px" }} />
			</div>
		</div>
	);
});
