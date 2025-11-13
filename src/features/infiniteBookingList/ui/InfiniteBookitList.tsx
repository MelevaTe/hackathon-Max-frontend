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
	const [allHistoryItems, setAllHistoryItems] = useState<BookingHistory[]>([]);
	const [hasNextPage, setHasNextPage] = useState(true);

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
	} = useGetHistoryBookingsQuery({ page, size }, { skip: type !== "history" });

	useEffect(() => {
		if (type === "active" && activeResponse) {
			const items = activeResponse.data || [];

			if (items.length > 0) {
				setAllActiveItems(prev =>
					page === 1 ? items : [...prev, ...items]
				);
			}

			setHasNextPage(activeResponse.hasNextPage);

			if (page === 1 && activeResponse.isEmpty) {
				setHasNextPage(false);
			}
		}
	}, [activeResponse, type, page]);

	useEffect(() => {
		if (type === "history" && historyResponse) {
			const items = historyResponse.data || [];

			if (items.length > 0) {
				setAllHistoryItems(prev =>
					page === 1 ? items : [...prev, ...items]
				);
			}

			setHasNextPage(historyResponse.hasNextPage);

			if (page === 1 && historyResponse.isEmpty) {
				setHasNextPage(false);
			}
		}
	}, [historyResponse, type, page]);

	useEffect(() => {
		setPage(1);
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

	if (error) {
		return (
			<div className={cls.spinnerContainer}>
				<Typography.Body variant="large">
					{t("Ошибка при загрузке записей")}
				</Typography.Body>
			</div>
		);
	}
	const isEmpty = type === "active"
		? activeResponse?.isEmpty
		: historyResponse?.isEmpty;

	if (!isLoading && isEmpty && page === 1) {
		return (
			<div className={cls.spinnerContainer}>
				<Typography.Body variant="large">
					{type === "active"
						? t("Нет активных бронирований")
						: t("Нет истории бронирований")
					}
				</Typography.Body>
			</div>
		);
	}

	const isInitialLoading = isLoading && page === 1;

	return (
		<div className={className}>
			{type === "active" ? (
				<BookingActiveList
					bookingActives={allActiveItems}
					isLoading={isInitialLoading}
				/>
			) : (
				<BookingHistoryList
					bookingHistories={allHistoryItems}
					isLoading={isInitialLoading}
				/>
			)}

			{isFetching && page > 1 && (
				<div className={cls.spinnerContainer}>
					<Spinner appearance="themed" size={30} />
				</div>
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