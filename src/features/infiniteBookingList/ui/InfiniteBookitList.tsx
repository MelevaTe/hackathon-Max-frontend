import { useState, useRef, useEffect, useCallback } from "react";
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
	const processedPagesRef = useRef<Set<number>>(new Set());
	const [deleteBookingMutation] = useDeleteBookingMutation();

	const handleDeleteBooking = async (id: string) => {
		try {
			await deleteBookingMutation(id).unwrap();
			if (type === "active") {
				setAllActiveItems((prev) =>
					prev.filter((item) => item.id !== id)
				);
			}
		} catch (error) {
			console.error("Failed to delete booking:", error);
		}
	};

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

	const formatActiveItems = useCallback(
		(items: BookingActive[]): UIBookingActive[] => {
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
		},
		[]
	);

	const formatHistoryItems = useCallback(
		(items: BookingHistory[]): UIBookingHistory[] => {
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
		},
		[]
	);

	useEffect(() => {
		if (type !== "active" || !activeResponse) return;

		const items = activeResponse.data || [];
		const currentHasNextPage = activeResponse.hasNextPage;

		if (page === 0) {
			if (items.length > 0) {
				const formattedItems = formatActiveItems(items);
				setAllActiveItems(formattedItems);
			} else {
				setAllActiveItems([]);
			}
			processedPagesRef.current = new Set([0]);
		} else {
			if (processedPagesRef.current.has(page)) return;
			if (items.length > 0) {
				const formattedItems = formatActiveItems(items);
				setAllActiveItems((prev) => {
					const existingIds = new Set(prev.map((item) => item.id));
					const newItems = formattedItems.filter(
						(item) => !existingIds.has(item.id)
					);
					return [...prev, ...newItems];
				});
			}
			processedPagesRef.current.add(page);
		}

		setHasNextPage(currentHasNextPage);
	}, [activeResponse, type, page, formatActiveItems]);

	useEffect(() => {
		if (type !== "history" || !historyResponse) return;

		const items = historyResponse.data || [];
		const currentHasNextPage = historyResponse.hasNextPage;

		if (page === 0) {
			if (items.length > 0) {
				const formattedItems = formatHistoryItems(items);
				setAllHistoryItems(formattedItems);
			} else {
				setAllHistoryItems([]);
			}
			processedPagesRef.current = new Set([0]);
		} else {
			if (processedPagesRef.current.has(page)) return;
			if (items.length > 0) {
				const formattedItems = formatHistoryItems(items);
				setAllHistoryItems((prev) => {
					const existingIds = new Set(prev.map((item) => item.id));
					const newItems = formattedItems.filter(
						(item) => !existingIds.has(item.id)
					);
					return [...prev, ...newItems];
				});
			}
			processedPagesRef.current.add(page);
		}

		setHasNextPage(currentHasNextPage);
	}, [historyResponse, type, page, formatHistoryItems]);

	useEffect(() => {
		setPage(0);
		setHasNextPage(true);
		processedPagesRef.current = new Set();
		if (type === "active") {
			setAllActiveItems([]);
		} else {
			setAllHistoryItems([]);
		}
	}, [type]);

	const triggerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const onLoadNext = useCallback(() => {
		const isFetching =
			type === "active" ? isActiveFetching : isHistoryFetching;
		if (!isFetching && hasNextPage) {
			setPage((prev) => prev + 1);
		}
	}, [type, isActiveFetching, isHistoryFetching, hasNextPage]);

	useInfiniteScroll({
		callback: onLoadNext,
		triggerRef,
		wrapperRef: scrollContainerRef,
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
					deleteBooking={handleDeleteBooking}
					error={error}
					triggerRef={triggerRef}
					wrapperRef={scrollContainerRef}
					hasNextPage={hasNextPage}
					isNextLoading={isNextLoading}
				/>
			) : (
				<BookingHistoryList
					bookingHistories={allHistoryItems}
					isLoading={isInitialLoading}
					error={error}
					triggerRef={triggerRef}
					wrapperRef={scrollContainerRef}
					hasNextPage={hasNextPage}
					isNextLoading={isNextLoading}
				/>
			)}
		</div>
	);
});
