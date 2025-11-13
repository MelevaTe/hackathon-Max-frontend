import { useState, useRef, useEffect } from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
	BookingActiveList,
	type UIBookingActive,
} from "@/entities/BookingActive";
import type { BookingActive } from "@/entities/BookingActive/model/types/bookingActive";
import {
	BookingHistoryList,
	type UIBookingHistory,
} from "@/entities/BookingHistory";
import type { BookingHistory } from "@/entities/BookingHistory/model/types/bookingHistory";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll.ts";
import { formatDateTime } from "@/shared/lib/utils/formatDate.ts";
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
	const [allActiveItems, setAllActiveItems] = useState<UIBookingActive[]>([]);
	const [allHistoryItems, setAllHistoryItems] = useState<UIBookingHistory[]>(
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

	const formatActiveItems = (items: BookingActive[]): UIBookingActive[] => {
		return items.map((item) => {
			const { formattedDate, formattedTime } = formatDateTime(
				item.entryTime
			);
			return {
				...item,
				formattedEntryDate: formattedDate,
				formattedEntryTime: formattedTime,
			};
		});
	};

	const formatHistoryItems = (
		items: BookingHistory[]
	): UIBookingHistory[] => {
		return items.map((item) => {
			const { formattedDate, formattedTime } = formatDateTime(
				item.entryTime
			);
			return {
				...item,
				formattedEntryDate: formattedDate,
				formattedEntryTime: formattedTime,
			};
		});
	};

	useEffect(() => {
		if (type === "active" && activeResponse) {
			const items = activeResponse.data || [];

			if (items.length > 0) {
				const formattedItems = formatActiveItems(items);
				setAllActiveItems((prev) =>
					page === 0 ? formattedItems : [...prev, ...formattedItems]
				);
			} else if (page === 0) {
				setAllActiveItems([]);
			}

			setHasNextPage(activeResponse.hasNextPage);
		}
	}, [activeResponse, type, page, formatActiveItems]);

	useEffect(() => {
		if (type === "history" && historyResponse) {
			const items = historyResponse.data || [];

			if (items.length > 0) {
				const formattedItems = formatHistoryItems(items);
				setAllHistoryItems((prev) =>
					page === 0 ? formattedItems : [...prev, ...formattedItems]
				);
			} else if (page === 0) {
				setAllHistoryItems([]);
			}

			setHasNextPage(historyResponse.hasNextPage);
		}
	}, [historyResponse, type, page, formatHistoryItems]);

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

	const isInitialLoading = isLoading && page === 0;
	const isNextLoading = isFetching && page > 0;

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
			{(isNextLoading || hasNextPage) && (
				<div
					ref={triggerRef}
					style={{ height: "20px" }}
				/>
			)}
		</div>
	);
});
