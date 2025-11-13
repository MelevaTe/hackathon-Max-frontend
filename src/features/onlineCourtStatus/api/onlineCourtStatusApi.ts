import { rtkApi } from "@/shared/api/rtkApi";
import type { OnlineCourtStatus } from "../model/types/onlineCourtStatus.ts";

const onlineStatusApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getCourtOnlineStatus: build.query<
			OnlineCourtStatus[],
			{ courtId: string; startDate: string; endDate: string }
		>({
			query: ({ courtId, startDate, endDate }) => ({
				url: "/v1/entries/online",
				params: {
					courtId,
					startDate,
					endDate,
				},
			}),
			transformResponse: (response: {
				message: string;
				onlines: OnlineCourtStatus[];
			}) => {
				return response.onlines;
			},
			providesTags: (result, error, { courtId }) => [
				{ type: "CourtOnline", id: courtId },
			],
		}),
	}),
	overrideExisting: false,
});

export const { useGetCourtOnlineStatusQuery } = onlineStatusApi;
