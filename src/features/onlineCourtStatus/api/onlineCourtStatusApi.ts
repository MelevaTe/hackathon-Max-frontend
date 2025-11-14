import { rtkApi } from "@/shared/api/rtkApi";
import type { OnlineCourtStatus } from "../model/types/onlineCourtStatus.ts";

const onlineStatusApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getCourtOnlineStatus: build.query<
			OnlineCourtStatus[],
			{ courtId: string; startDate: string; endDate: string }
		>({
			query: ({ courtId, startDate, endDate }) => ({
				url: "/entry-service/v1/entries/online",
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
			keepUnusedDataFor: 0,
		}),
	}),
	overrideExisting: false,
});

export const { useGetCourtOnlineStatusQuery } = onlineStatusApi;
