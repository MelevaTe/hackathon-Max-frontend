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
}

export const BookingActiveList = memo((props: BookingActiveListProps) => {
	const { className, bookingActives, isLoading, error, deleteBooking } =
		props;
	const { t } = useTranslation();

	if (error) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>Активные записи</CellHeader>
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
				<CellHeader>Активные записи</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Spinner
						appearance="themed"
						size={30}
					/>
				</div>
			</div>
		);
	}

	if (!bookingActives.length) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<CellHeader>Активные записи</CellHeader>
				<div className={cls.errorAndLoadingContainer}>
					<Typography.Body variant="large">
						У вас нет активных записей
					</Typography.Body>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames(cls.BookingActiveList, {}, [className])}>
			<CellHeader>Активные записи</CellHeader>
			<div className={cls.scrollContainer}>
				{bookingActives.map((item) => (
					<BookingActiveListItem
						bookingActive={item}
						key={item.id}
						className={cls.item}
						deleteBooking={deleteBooking}
					/>
				))}
			</div>
		</div>
	);
});
