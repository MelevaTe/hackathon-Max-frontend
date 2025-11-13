import { CellHeader, Spinner, Typography } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { BookingHistoryListItem } from "@/entities/BookingHistory/ui/BookingHistoryItem/BookingHistoryListItem.tsx";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./BookingHistoryList.module.scss";
import type { UIBookingHistory } from "../../model/types/bookingHistory.ts";

interface BookingHistoryListProps {
	className?: string;
	bookingHistories: UIBookingHistory[];
	isLoading?: boolean;
	error?: unknown;
	triggerRef?: React.RefObject<HTMLDivElement>;
}

export const BookingHistoryList = memo((props: BookingHistoryListProps) => {
	const { className, bookingHistories, isLoading, error, triggerRef } = props;
	const { t } = useTranslation();

	if (error) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>История записей</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Typography.Body variant="large">
						Ошибка при загрузке записей
					</Typography.Body>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>История записей</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Spinner
						appearance="themed"
						size={30}
					/>
				</div>
			</div>
		);
	}

	if (!bookingHistories.length) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>История записей</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Typography.Body variant="large">
						У вас нет истории записей
					</Typography.Body>
				</div>
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
				<div
					ref={triggerRef}
					style={{ height: "1px" }}
				/>
			</div>
		</div>
	);
});
