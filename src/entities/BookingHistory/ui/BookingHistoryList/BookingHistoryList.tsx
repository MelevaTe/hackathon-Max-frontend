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
	wrapperRef?: React.RefObject<HTMLDivElement>;
	hasNextPage?: boolean;
	isNextLoading?: boolean;
}

export const BookingHistoryList = memo((props: BookingHistoryListProps) => {
	const {
		className,
		bookingHistories,
		isLoading,
		error,
		triggerRef,
		wrapperRef,
		hasNextPage = false,
		isNextLoading = false,
	} = props;
	const { t } = useTranslation("profile");

	if (error) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>{t("История записей")}</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Typography.Body variant="large">
						{t("Ошибка при загрузке записей")}
					</Typography.Body>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>{t("История записей")}</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Spinner
						appearance="themed"
						size={30}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames(cls.BookingHistoryList, {}, [className])}>
			<CellHeader>История записей</CellHeader>
			<div
				ref={wrapperRef}
				className={cls.scrollContainer}
			>
				{!bookingHistories.length ? (
					<div className={cls.errorAndLoadingContainer}>
						<Typography.Body variant="large">
							{t("У вас нет истории записей")}
						</Typography.Body>
					</div>
				) : (
					bookingHistories.map((item) => (
						<BookingHistoryListItem
							bookingHistory={item}
							key={item.id}
							className={cls.item}
						/>
					))
				)}
				{(hasNextPage || isNextLoading) && (
					<div
						ref={triggerRef}
						style={{ height: "20px", minHeight: "20px" }}
					/>
				)}
			</div>
		</div>
	);
});
