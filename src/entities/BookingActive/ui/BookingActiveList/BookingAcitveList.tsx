import { CellHeader, Spinner, Typography } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./BookingActiveList.module.scss";
import type { UIBookingActive } from "../../model/types/bookingActive.ts";
import { BookingActiveListItem } from "../BookingActiveItem/BookingActiveListItem.tsx";

interface BookingActiveListProps {
	className?: string;
	bookingActives: UIBookingActive[];
	isLoading?: boolean;
	error?: unknown;
	deleteBooking: (id: string) => void;
	triggerRef?: React.RefObject<HTMLDivElement>;
	wrapperRef?: React.RefObject<HTMLDivElement>;
	hasNextPage?: boolean;
	isNextLoading?: boolean;
}

export const BookingActiveList = memo((props: BookingActiveListProps) => {
	const {
		className,
		bookingActives,
		isLoading,
		error,
		deleteBooking,
		triggerRef,
		wrapperRef,
		hasNextPage = false,
		isNextLoading = false,
	} = props;
	const { t } = useTranslation("profile");

	if (error) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>Активные записи</CellHeader>
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
				<CellHeader>{t("Активные записи")}</CellHeader>
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
		<div className={classNames(cls.BookingActiveList, {}, [className])}>
			<CellHeader>{t("Активные записи")}</CellHeader>
			<div
				ref={wrapperRef}
				className={cls.scrollContainer}
			>
				{!bookingActives.length ? (
					<div className={cls.errorAndLoadingContainer}>
						<Typography.Body variant="large">
							{t("У вас нет активных записей")}
						</Typography.Body>
					</div>
				) : (
					bookingActives.map((item) => (
						<BookingActiveListItem
							bookingActive={item}
							key={item.id}
							className={cls.item}
							deleteBooking={deleteBooking}
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
