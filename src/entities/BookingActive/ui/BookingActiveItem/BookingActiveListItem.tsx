import { Button, CellHeader, CellList, CellSimple } from "@maxhub/max-ui";
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

	return (
		<CellSimple
			after={
				<Button
					appearance="themed"
					asChild
					mode="primary"
					size="medium"
				>
					<Link to="/">Маршурт</Link>
				</Button>
			}
			before={<Sun color="#007bff" />}
			height="normal"
			overline=""
			subtitle={`${bookingActive.date} • ${bookingActive.date}`}
			title={bookingActive.title}
			className={cls.cell}
		/>
	);
});
