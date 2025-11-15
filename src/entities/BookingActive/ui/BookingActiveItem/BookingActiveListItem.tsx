import { Button, CellSimple, IconButton } from "@maxhub/max-ui";
import { Trash2 } from "lucide-react";
import { memo, useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	selectCurrentWeather,
	useGetForecastQuery,
	WeatherIcon,
} from "@/entities/weather";
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
	const { t } = useTranslation("profile");

	const { data: forecast, isLoading } = useGetForecastQuery({
		lat: bookingActive.lat,
		lon: bookingActive.lon,
	});

	const currentWeather = useMemo(
		() => selectCurrentWeather(forecast),
		[forecast]
	);

	const handleShowRoute = () => {
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
						{t("Маршрут")}
					</Button>
				</div>
			}
			before={
				<WeatherIcon
					iconCode={currentWeather?.iconCode || "01d"}
					size={24}
				/>
			}
			height="normal"
			overline=""
			subtitle={`${bookingActive.formattedEntryDate} • ${bookingActive.formattedEntryTime}`}
			title={bookingActive.title}
			className={cls.cell}
		/>
	);
});
