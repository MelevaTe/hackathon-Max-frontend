import { Typography } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Card } from "@/shared/ui/Card/Card.tsx";
import { StarRating } from "@/shared/ui/StartRaiting/StartRaiting.tsx";
import cls from "./CourtListItem.module.scss";
import type { Court } from "../../model/types/court.ts";

export interface CourtListItemProps {
	className?: string;
	court: Court;
}

export const CourtListItem = memo((props: CourtListItemProps) => {
	const { className, court } = props;
	const { t } = useTranslation();

	return (
		<Card
			className={classNames(cls.FieldCard, {}, [className])}
			// onClick={handleClick}
		>
			<img
				src={court.img}
				alt={court.title}
				className={cls.image}
			/>
			<div className={cls.content}>
				<Typography.Body
					variant="large"
					className={cls.name}
				>
					{court.title}
				</Typography.Body>
				<div className={cls.ratingContainer}>
					<StarRating
						rating={court.rating}
						max={5}
					/>
				</div>
				<Typography.Body
					variant="medium"
					className={cls.description}
				>
					{court.description}
				</Typography.Body>
			</div>
		</Card>
	);
});
