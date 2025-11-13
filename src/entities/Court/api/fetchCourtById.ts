import { rtkApi } from "@/shared/api/rtkApi";
import type { Court } from "../model/types/court.ts";

const courtApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getCourtById: build.query<Court, string>({
			query: (courtInfoId) =>
				`/courts-service/v1/courts/info/${courtInfoId}`,
			providesTags: (result, error, courtInfoId) => [
				{ type: "Court", courtInfoId },
			],
		}),
	}),
});

export const { useGetCourtByIdQuery } = courtApi;
