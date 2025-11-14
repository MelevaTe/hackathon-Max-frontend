import { Button, IconButton, Spinner } from "@maxhub/max-ui";
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
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";
import type { OnlineEntryFormatted } from "@/shared/types/formatedDate.ts";
import { OnlineEntryItem } from "@/shared/ui/OnlineEntryItem/OnlineEntryItem.tsx";
import { StarRating } from "@/shared/ui/StartRaiting/StartRaiting.tsx";
import cls from "./CourtDetails.module.scss";
import type { Court } from "../../model/types/court.ts";

interface CourtDetailsProps {
	className?: string;
	court: Court;
	onBack: () => void;
	onClose?: () => void;
	onBooking: (courtId: string) => void;
	onlineEntries?: OnlineEntryFormatted[];
	isOnlineLoading?: boolean;
	isOnlineError?: boolean;
	onRoute?: (coords: [number, number]) => void;
}

export const CourtDetails = memo((props: CourtDetailsProps) => {
	const {
		className,
		court,
		onBack,
		onClose,
		onBooking,
		onlineEntries,
		isOnlineError,
		isOnlineLoading,
		onRoute,
	} = props;

	const handleBuildRoute = () => {
		if (court.lat !== undefined && court.lon !== undefined) {
			const coords: [number, number] = [court.lon, court.lat];
			if (onRoute) {
				onRoute(coords);
			}
		}
	};

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
					src={court.photoUrl}
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
				<div className={cls.onlineList}>
					<Typography.Body
						variant="medium"
						className={cls.onlineText}
					>
						Онлайн на поле:
					</Typography.Body>
					<div className={cls.scrollContainer}>
						{isOnlineLoading && (
							<div className={cls.centeredContent}>
								<Spinner
									size={30}
									appearance="themed"
									className={cls.spinner}
								/>
							</div>
						)}
						{!isOnlineLoading && isOnlineError && (
							<div className={cls.centeredContent}>
								<Typography.Body
									variant="medium"
									className={cls.errorText}
								>
									Не удалось загрузить онлайн-записи
								</Typography.Body>
							</div>
						)}
						{!isOnlineLoading &&
							!isOnlineError &&
							onlineEntries?.length === 0 && (
								<div className={cls.centeredContent}>
									<Typography.Body
										variant="medium"
										className={cls.noDataText}
									>
										Нет записей на это поле
									</Typography.Body>
								</div>
							)}
						{!isOnlineLoading &&
							!isOnlineError &&
							onlineEntries &&
							onlineEntries.length > 0 && (
								<div className={cls.entriesList}>
									{onlineEntries.map((item) => (
										<OnlineEntryItem
											usersCount={item.usersCount}
											entryTime={item.formattedTime}
											entryDate={item.formattedDate}
											key={`${item.formattedDate}-${item.formattedTime}`}
										/>
									))}
								</div>
							)}
					</div>
				</div>

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
						onClick={handleBuildRoute}
						iconBefore={<MapPinned />}
					>
						Маршрут
					</Button>
				</div>
			</div>
		</div>
	);
});
