import type { BookingActive } from "@/entities/BookingActive";
import { rtkApi } from "@/shared/api/rtkApi";

const bookingActiveApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getActiveBookings: build.query<
			BookingActive[],
			{ page: number; size?: number }
		>({
			query: (params) => ({
				url: "/v1/entries/active",
				params,
			}),
			providesTags: ["BookingActive"],
		}),
	}),
});

export const useGetActiveBookingsQuery =
	bookingActiveApi.useGetActiveBookingsQuery;
