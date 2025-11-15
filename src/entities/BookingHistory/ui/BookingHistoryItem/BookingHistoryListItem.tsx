import { CellSimple } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { UIBookingHistory } from "../../model/types/bookingHistory.ts";

export interface CourtListItemProps {
	className?: string;
	bookingHistory: UIBookingHistory;
}

export const BookingHistoryListItem = memo((props: CourtListItemProps) => {
	const { className, bookingHistory } = props;
	const { t } = useTranslation("profile");

	return (
		<CellSimple
			height="normal"
			overline=""
			subtitle={`${bookingHistory.formattedEntryDate} • ${bookingHistory.formattedEntryTime}`}
			title={bookingHistory.title}
		/>
	);
});
