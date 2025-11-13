import type { BookingActive } from "@/entities/BookingActive";
import { rtkApi } from "@/shared/api/rtkApi";

export interface BookingActiveResponse {
	data: BookingActive[];
	message: string;
	hasNextPage: boolean;
	isEmpty: boolean;
}

const bookingActiveApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getActiveBookings: build.query<
			BookingActiveResponse,
			{ page: number; size?: number }
		>({
			query: (params) => ({
				url: "/entry-service/v1/entries/active",
				params,
			}),
			keepUnusedDataFor: 0,
			transformResponse: (
				baseResponse: {
					activeEntries: BookingActive[];
					message: string;
				},
				meta,
				arg
			) => {
				const { activeEntries, message } = baseResponse;

				const hasData = activeEntries && activeEntries.length > 0;
				const hasNextPage =
					hasData && activeEntries.length === (arg.size || 10);
				const isEmpty = !hasData || activeEntries.length === 0;

				return {
					data: activeEntries || [],
					message: message,
					hasNextPage: hasNextPage,
					isEmpty: isEmpty,
				};
			},
		}),
	}),
});

export const { useGetActiveBookingsQuery } = bookingActiveApi;
