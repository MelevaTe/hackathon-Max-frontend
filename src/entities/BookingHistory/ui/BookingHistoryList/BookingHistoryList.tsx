import { CellHeader, Typography } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { BookingHistoryListItem } from "@/entities/BookingHistory/ui/BookingHistoryItem/BookingHistoryListItem.tsx";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./BookingHistoryList.module.scss";
import type { BookingHistory } from "../../model/types/bookingHistory.ts";

interface BookingHistoryListProps {
	className?: string;
	bookingHistories: BookingHistory[];
	isLoading?: boolean;
	error?: unknown;
}

export const BookingHistoryList = memo((props: BookingHistoryListProps) => {
	const { className, bookingHistories, isLoading, error } = props;
	const { t } = useTranslation();

	if (error) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<Typography.Body variant="large">
					Ошибка при загрузке записей
				</Typography.Body>
			</div>
		);
	}

	if (!isLoading && !bookingHistories.length) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<Typography.Body variant="large">
					У вас нет истории записей
				</Typography.Body>
			</div>
		);
	}

	return (
		<div className={classNames(cls.BookingHistoryList, {}, [className])}>
			<CellHeader>История записей</CellHeader>
			<div className={cls.scrollContainer}>
				{bookingHistories.map((item) => (
					<BookingHistoryListItem
						bookingHistory={item}
						key={item.id}
						className={cls.item}
					/>
				))}
			</div>
		</div>
	);
});
