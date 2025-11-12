import { Button, IconButton } from "@maxhub/max-ui";
import { Typography } from "@maxhub/max-ui";
import {
	Calendar1,
	CircleArrowLeft,
	X,
	MapPinned,
	RussianRuble,
} from "lucide-react";
import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { StarRating } from "@/shared/ui/StartRaiting/StartRaiting.tsx";
import cls from "./CourtDetails.module.scss";
import type { Court } from "../../model/types/court.ts";

interface CourtDetailsProps {
	court: Court;
	onBack: () => void;
	onClose?: () => void;
	onBooking: (courtId: string) => void;
	className?: string;
}

export const CourtDetails = memo((props: CourtDetailsProps) => {
	const { className, court, onBack, onClose, onBooking } = props;

	return (
		<div className={classNames(cls.CourtDetails, {}, [className])}>
			<div className={cls.header}>
				<Button
					onClick={onBack}
					appearance="themed"
					mode="secondary"
					size="medium"
					iconBefore={<CircleArrowLeft />}
				>
					Назад
				</Button>
				<IconButton
					appearance="neutral"
					aria-label="Закрыть"
					mode="tertiary"
					size="medium"
					onClick={onClose}
				>
					<X />
				</IconButton>
			</div>

			<div className={cls.content}>
				<img
					src={court.img}
					alt={court.title}
					className={cls.image}
				/>

				<Typography.Headline
					variant={"large-strong"}
					className={cls.name}
				>
					{court.title}
				</Typography.Headline>
				<Typography.Body
					variant={"large"}
					className={cls.name}
				>
					{court.address}
				</Typography.Body>

				<div className={cls.ratingContainer}>
					<StarRating
						rating={court.rating}
						max={5}
						size={20}
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
					{court.description}
				</Typography.Body>

				<div className={cls.actionButtons}>
					<Button
						appearance="themed"
						mode="primary"
						size="medium"
						className={cls.actionButton}
						onClick={() => onBooking(court.id)}
						iconBefore={<Calendar1 />}
					>
						Записаться
					</Button>
					<Button
						appearance="themed"
						mode="primary"
						size="medium"
						className={cls.actionButton}
						// onClick={onGetRouteClick}
						iconBefore={<MapPinned />}
					>
						Маршрут
					</Button>
				</div>
			</div>
		</div>
	);
});
