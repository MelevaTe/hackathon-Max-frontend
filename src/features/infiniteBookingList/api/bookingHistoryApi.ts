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

				const hasNextPage = historyEntries.length === (arg.size || 10);
				const isEmpty = !historyEntries || historyEntries.length === 0;

				return {
					data: historyEntries,
					message,
					hasNextPage,
					isEmpty,
				};
			},
		}),
	}),
});

export const { useGetHistoryBookingsQuery } = bookingHistoryApi;
