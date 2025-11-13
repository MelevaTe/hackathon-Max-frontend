import { Button, CellSimple, IconButton } from "@maxhub/max-ui";
import { Sun, Trash2 } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cls from "./BookingActiveListItem.module.scss";
import type { UIBookingActive } from "../../model/types/bookingActive.ts";

export interface CourtListItemProps {
	className?: string;
	bookingActive: UIBookingActive;
	deleteBooking: (id: string) => void;
}

export const BookingActiveListItem = memo((props: CourtListItemProps) => {
	const { className, bookingActive, deleteBooking } = props;
	const { t } = useTranslation();

	const destinationCoords = [bookingActive.lon, bookingActive.lat] as [
		number,
		number,
	];
	const searchParams = `?destination=${destinationCoords.join(",")}`;

	return (
		<CellSimple
			after={
				<div className={cls.btnWrapper}>
					<IconButton
						appearance="negative"
						asChild
						mode="primary"
						size="medium"
						onClick={() => deleteBooking(bookingActive.id)}
					>
						<Trash2 color="#fff" />
					</IconButton>
					<Button
						appearance="themed"
						asChild
						mode="primary"
						size="medium"
					>
						<Link to={`/?route=1${searchParams}`}>Маршрут</Link>
					</Button>
				</div>
			}
			before={<Sun color="#007bff" />}
			height="normal"
			overline=""
			subtitle={`${bookingActive.formattedEntryDate} • ${bookingActive.formattedEntryTime}`}
			title={bookingActive.title}
			className={cls.cell}
		/>
	);
});
