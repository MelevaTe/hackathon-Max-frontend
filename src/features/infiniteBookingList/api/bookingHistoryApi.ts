import type { BookingHistory } from "@/entities/BookingHistory";
import { rtkApi } from "@/shared/api/rtkApi";

const bookingHistoryApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getHistoryBookings: build.query<
			BookingHistory[],
			{ page: number; size?: number }
		>({
			query: (params) => ({
				url: "/bookings/history",
				params,
			}),
			providesTags: ["BookingHistory"],
		}),
	}),
});

export const useGetHistoryBookingsQuery =
	bookingHistoryApi.useGetHistoryBookingsQuery;
