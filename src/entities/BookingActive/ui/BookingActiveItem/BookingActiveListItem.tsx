import { Button, CellSimple, IconButton } from "@maxhub/max-ui";
import { Sun, Trash2 } from "lucide-react";
import { memo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";
import cls from "./BookingActiveListItem.module.scss";
import type { UIBookingActive } from "../../model/types/bookingActive.ts";

export interface CourtListItemProps {
	className?: string;
	bookingActive: UIBookingActive;
	deleteBooking: (id: string) => void;
}

export const BookingActiveListItem = memo((props: CourtListItemProps) => {
	const { className, bookingActive, deleteBooking } = props;
	const { setRoute, clearRoute } = useRoute();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleShowRoute = () => {
		clearRoute();
		const destinationCoords: [number, number] = [
			bookingActive.lon,
			bookingActive.lat,
		];
		setRoute(destinationCoords);
		toast.success(`Маршрут до "${bookingActive.title}"`);
		navigate("/");
	};

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
						mode="primary"
						size="medium"
						onClick={handleShowRoute}
					>
						Маршрут
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
