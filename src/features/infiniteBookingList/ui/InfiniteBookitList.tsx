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

	console.log(`[${type}] Current page:`, page);
	console.log(`[${type}] Current hasNextPage:`, hasNextPage);

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
			console.log(`[active] Received page ${page}, data length:`, activeResponse.data.length);
			console.log(`[active] hasNextPage from API:`, activeResponse.hasNextPage);

			const items = activeResponse.data || [];

			if (items.length > 0) {
				const formattedItems = formatActiveItems(items);
				setAllActiveItems((prev) => {
					const newItems = page === 0 ? formattedItems : [...prev, ...formattedItems];
					console.log(`[active] Updated items, total count:`, newItems.length);
					return newItems;
				});
			} else if (page === 0) {
				setAllActiveItems([]);
				console.log(`[active] Cleared items on empty response at page 0`);
			}

			setHasNextPage(activeResponse.hasNextPage);
			console.log(`[active] Set hasNextPage to:`, activeResponse.hasNextPage);
		}
	}, [activeResponse, type, page, formatActiveItems]);

	useEffect(() => {
		if (type === "history" && historyResponse) {
			console.log(`[history] Received page ${page}, data length:`, historyResponse.data.length);
			console.log(`[history] hasNextPage from API:`, historyResponse.hasNextPage);

			const items = historyResponse.data || [];

			if (items.length > 0) {
				const formattedItems = formatHistoryItems(items);
				setAllHistoryItems((prev) => {
					const newItems = page === 0 ? formattedItems : [...prev, ...formattedItems];
					console.log(`[history] Updated items, total count:`, newItems.length);
					return newItems;
				});
			} else if (page === 0) {
				setAllHistoryItems([]);
				console.log(`[history] Cleared items on empty response at page 0`);
			}

			setHasNextPage(historyResponse.hasNextPage);
			console.log(`[history] Set hasNextPage to:`, historyResponse.hasNextPage);
		}
	}, [historyResponse, type, page, formatHistoryItems]);

	const triggerRef = useRef<HTMLDivElement>(null);

	const onLoadNext = () => {
		if (!isFetching && hasNextPage && triggerRef.current) {
			console.log(`[${type}] onLoadNext triggered, incrementing page...`);
			setPage((prev) => {
				const newPage = prev + 1;
				console.log(`[${type}] Page updated to:`, newPage);
				return newPage;
			});
		} else {
			console.log(`[${type}] onLoadNext blocked: isFetching=${isFetching}, hasNextPage=${hasNextPage}`);
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

	console.log(`[${type}] Render: isLoading=${isLoading}, isFetching=${isFetching}, isInitial=${isInitialLoading}, isNext=${isNextLoading}`);

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
