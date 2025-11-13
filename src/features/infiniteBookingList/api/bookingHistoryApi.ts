import type { BookingHistory } from "@/entities/BookingHistory";
import { rtkApi } from "@/shared/api/rtkApi";

export interface BookingHistoryResponse {
	data: BookingHistory[];
	message: string;
	hasNextPage: boolean;
	isEmpty: boolean;
}

const bookingHistoryApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getHistoryBookings: build.query<
			BookingHistoryResponse,
			{ page: number; size?: number }
		>({
			query: (params) => ({
				url: "/entry-service/v1/entries/history",
				params,
			}),
			keepUnusedDataFor: 0,
			transformResponse: (
				baseResponse: {
					historyEntries?: BookingHistory[];
					message: string;
				},
				meta,
				arg
			) => {
				const historyEntries = baseResponse.historyEntries || [];
				const { message } = baseResponse;

				const hasData = historyEntries && historyEntries.length > 0;
				const hasNextPage =
					hasData && historyEntries.length === (arg.size || 10);
				const isEmpty = !hasData || historyEntries.length === 0;

				return {
					data: historyEntries,
					message: message,
					hasNextPage: hasNextPage,
					isEmpty: isEmpty,
				};
			},
		}),
	}),
});

export const { useGetHistoryBookingsQuery } = bookingHistoryApi;
