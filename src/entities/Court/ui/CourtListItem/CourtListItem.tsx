import { IconButton, Spinner, Typography } from "@maxhub/max-ui";
import { ImageOff, RussianRuble } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import { AppImage } from "@/shared/ui/AppImage/AppImage.tsx";
import { Card } from "@/shared/ui/Card/Card.tsx";
import { StarRating } from "@/shared/ui/StartRaiting/StartRaiting.tsx";
import cls from "./CourtListItem.module.scss";
import type { Court } from "../../model/types/court.ts";

export interface CourtListItemProps {
	className?: string;
	court: Court;
	onClick?: (court: Court) => void;
}

export const CourtListItem = memo((props: CourtListItemProps) => {
	const { className, court, onClick } = props;
	const { t } = useTranslation();

	const handleClick = () => {
		if (onClick) {
			onClick(court);
		}
	};

	return (
		<Card
			className={classNames(cls.FieldCard, {}, [className])}
			onClick={handleClick}
		>
			<AppImage
				src={court.photoUrl}
				alt={court.title}
				className={cls.image}
				fallback={<Spinner size={40} />}
				errorFallback={<ImageOff size={30} />}
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
						size={15}
					/>
					{court.paid && (
						<IconButton
							appearance="themed"
							aria-label="цена"
							mode="primary"
							size="small"
						>
							<RussianRuble size={15} />
						</IconButton>
					)}
				</div>
				<Typography.Body
					variant="medium"
					className={cls.description}
				>
					{court.address}
				</Typography.Body>
			</div>
		</Card>
	);
});
