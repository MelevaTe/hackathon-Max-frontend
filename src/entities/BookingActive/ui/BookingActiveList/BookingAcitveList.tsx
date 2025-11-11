import { CellHeader, CellList, Typography } from "@maxhub/max-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./BookingActiveList.module.scss";
import type { BookingActive } from "../../model/types/bookingActive.ts";
import { BookingActiveListItem } from "../BookingActiveItem/BookingActiveListItem.tsx";

interface BookingActiveListProps {
	className?: string;
	bookingActives: BookingActive[];
	isLoading?: boolean;
}

export const BookingActiveList = memo((props: BookingActiveListProps) => {
	const { className, bookingActives, isLoading } = props;
	const { t } = useTranslation();

	if (!isLoading && !bookingActives.length) {
		return (
			<div className={classNames(cls.BookingActiveList, {}, [className])}>
				<Typography.Body variant="large">
					У вас нет активных записей
				</Typography.Body>
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
					/>
				))}
			</div>
		</div>
	);
});
