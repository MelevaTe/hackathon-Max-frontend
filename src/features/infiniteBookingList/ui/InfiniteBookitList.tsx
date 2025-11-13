import { useState, useRef, useEffect } from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { BookingActiveList } from "@/entities/BookingActive";
import type { BookingActive } from "@/entities/BookingActive/model/types/bookingActive";
import { BookingHistoryList } from "@/entities/BookingHistory";
import type { BookingHistory } from "@/entities/BookingHistory/model/types/bookingHistory";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll.ts";
import cls from "./InfiniteBookingList.module.scss";
import {
	useDeleteBookingMutation,
	useGetActiveBookingsQuery,
} from "../api/bookingActiveApi.ts";
import { useGetHistoryBookingsQuery } from "../api/bookingHistoryApi.ts";

interface InfiniteBookingListProps {
	className?: string;
	type: "active" | "history";
}

export const InfiniteBookingList = memo((props: InfiniteBookingListProps) => {
	const { className, type } = props;
	const { t } = useTranslation();

	const [page, setPage] = useState(0);
	const size = 10;
	const [allActiveItems, setAllActiveItems] = useState<BookingActive[]>([]);
	const [allHistoryItems, setAllHistoryItems] = useState<BookingHistory[]>(
		[]
	);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [deleteBooking, { isLoading: isDeleteLoading }] =
		useDeleteBookingMutation();

	const {
		data: activeResponse,
		isLoading: isActiveLoading,
		isFetching: isActiveFetching,
		error: activeError,
	} = useGetActiveBookingsQuery({ page, size }, { skip: type !== "active" });

	const {
		data: historyResponse,
		isLoading: isHistoryLoading,
		isFetching: isHistoryFetching,
		error: historyError,
	} = useGetHistoryBookingsQuery(
		{ page, size },
		{ skip: type !== "history" }
	);

	useEffect(() => {
		if (type === "active" && activeResponse) {
			const items = activeResponse.data || [];

			if (items.length > 0) {
				setAllActiveItems((prev) =>
					page === 0 || prev.length === 0
						? items
						: [...prev, ...items]
				);
			}

			setHasNextPage(activeResponse.hasNextPage);

			if (page === 0 && activeResponse.isEmpty) {
				setHasNextPage(false);
			}
		}
	}, [activeResponse, type, page]);

	useEffect(() => {
		if (type === "history" && historyResponse) {
			const items = historyResponse.data || [];

			if (items.length > 0) {
				setAllHistoryItems((prev) =>
					page === 0 || prev.length === 0
						? items
						: [...prev, ...items]
				);
			}

			setHasNextPage(historyResponse.hasNextPage);

			if (page === 0 && historyResponse.isEmpty) {
				setHasNextPage(false);
			}
		}
	}, [historyResponse, type, page]);

	useEffect(() => {
		setPage(0);
		setAllActiveItems([]);
		setAllHistoryItems([]);
		setHasNextPage(true);
	}, [type]);

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

	const isLoading = type === "active" ? isActiveLoading : isHistoryLoading;
	const isFetching = type === "active" ? isActiveFetching : isHistoryFetching;
	const error = type === "active" ? activeError : historyError;

	const isInitialLoading = isLoading && page === 1;

	return (
		<div className={classNames(cls.InfiniteBookingList, {}, [className])}>
			{type === "active" ? (
				<BookingActiveList
					bookingActives={allActiveItems}
					isLoading={isInitialLoading}
					deleteBooking={deleteBooking}
					error={error}
				/>
			) : (
				<BookingHistoryList
					bookingHistories={allHistoryItems}
					isLoading={isInitialLoading}
					error={error}
				/>
			)}
			{hasNextPage && (
				<div
					ref={triggerRef}
					style={{ height: "1px" }}
				/>
			)}
		</div>
	);
});
