import { Button, CellSimple } from "@maxhub/max-ui";
import { Sun } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { BookingActive } from "@/entities/BookingActive";
import cls from "./BookingActiveListItem.module.scss";

export interface CourtListItemProps {
	className?: string;
	bookingActive: BookingActive;
}

export const BookingActiveListItem = memo((props: CourtListItemProps) => {
	const { className, bookingActive } = props;
	const { t } = useTranslation();

	const destinationCoords = [bookingActive.lon, bookingActive.lat] as [
		number,
		number,
	];
	const searchParams = `?destination=${destinationCoords.join(",")}`;

	return (
		<CellSimple
			after={
				<Button
					appearance="themed"
					asChild
					mode="primary"
					size="medium"
				>
					<Link to={`/?route=1${searchParams}`}>Маршрут</Link>
				</Button>
			}
			before={<Sun color="#007bff" />}
			height="normal"
			overline=""
			subtitle={`${bookingActive.entryTime} • ${bookingActive.entryTime}`}
			title={bookingActive.title}
			className={cls.cell}
		/>
	);
});
