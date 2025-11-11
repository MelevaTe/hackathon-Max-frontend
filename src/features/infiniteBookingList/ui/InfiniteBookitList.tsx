import { Spinner, Typography } from "@maxhub/max-ui";
import { useState, useRef, useEffect } from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { BookingActiveList } from "@/entities/BookingActive";
import type { BookingActive } from "@/entities/BookingActive/model/types/bookingActive";
import { BookingHistoryList } from "@/entities/BookingHistory";
import type { BookingHistory } from "@/entities/BookingHistory/model/types/bookingHistory";
import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll.ts";
import cls from "./InfiniteBookingList.module.scss";
import { useGetActiveBookingsQuery } from "../api/bookingActiveApi.ts";
import { useGetHistoryBookingsQuery } from "../api/bookingHistoryApi.ts";

interface InfiniteBookingListProps {
	className?: string;
	type: "active" | "history";
}

export const InfiniteBookingList = memo((props: InfiniteBookingListProps) => {
	const { className, type } = props;
	const { t } = useTranslation();

	const [page, setPage] = useState(1);
	const size = 10;
	const [allActiveItems, setAllActiveItems] = useState<BookingActive[]>([]);
	const [allHistoryItems, setAllHistoryItems] = useState<BookingHistory[]>(
		[]
	);
	const [hasNextPage, setHasNextPage] = useState(true);

	const {
		data,
		isLoading: isInitialLoading,
		isFetching,
		error,
	} = type === "active"
		? useGetActiveBookingsQuery({ page, size })
		: useGetHistoryBookingsQuery({ page, size });

	useEffect(() => {
		if (data && data.length > 0) {
			if (type === "active") {
				setAllActiveItems(
					(prev) => [...prev, ...data] as BookingActive[]
				);
			} else {
				setAllHistoryItems(
					(prev) => [...prev, ...data] as BookingHistory[]
				);
			}
			if (data.length < 10) {
				setHasNextPage(false);
			}
		}
	}, [data, type]);

	const triggerRef = useRef<HTMLDivElement>(null);

	const onLoadNext = () => {
		if (!isFetching && hasNextPage && triggerRef.current) {
			setPage((prev) => prev + 1);
		}
	};

	useInfiniteScroll({
		callback: onLoadNext,
		triggerRef,
	});

	if (error) {
		return (
			<div className={cls.spinnerContainer}>
				<Typography.Body variant="large">
					Ошибка при загрузке записей
				</Typography.Body>
			</div>
		);
	}

	const isLoading =
		isInitialLoading ||
		(isFetching &&
			(type === "active"
				? allActiveItems.length
				: allHistoryItems.length) === 0);

	if (isLoading) {
		return (
			<div className={cls.spinnerContainer}>
				<Spinner
					appearance="themed"
					size={30}
				/>
			</div>
		);
	}

	return (
		<div className={className}>
			{type === "active" ? (
				<BookingActiveList
					bookingActives={allActiveItems}
					isLoading={false}
				/>
			) : (
				<BookingHistoryList
					bookingHistories={allHistoryItems}
					isLoading={false}
				/>
			)}
			{isFetching && <Spinner />}
			<div
				ref={triggerRef}
				style={{ height: "1px" }}
			/>
		</div>
	);
});
