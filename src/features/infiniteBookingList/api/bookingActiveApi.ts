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
				const hasNextPage = activeEntries.length === (arg.size || 10);
				const isEmpty = !activeEntries || activeEntries.length === 0;

				return {
					data: activeEntries || [],
					message,
					hasNextPage,
					isEmpty,
				};
			},
			providesTags: ["BookingActive"],
		}),
		deleteBooking: build.mutation<void, string>({
			query: (id) => ({
				url: `/entry-service/v1/entries/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["BookingActive"],
		}),
	}),
});

export const { useGetActiveBookingsQuery, useDeleteBookingMutation } =
	bookingActiveApi;
