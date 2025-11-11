import { CellSimple } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { BookingHistory } from "../../model/types/bookingHistory.ts";

export interface CourtListItemProps {
	className?: string;
	bookingHistory: BookingHistory;
}

export const BookingHistoryListItem = memo((props: CourtListItemProps) => {
	const { className, bookingHistory } = props;
	const { t } = useTranslation();

	return (
		<CellSimple
			height="normal"
			overline=""
			subtitle={`${bookingHistory.date} • ${bookingHistory.date}`}
			title={bookingHistory.title}
		/>
	);
});
