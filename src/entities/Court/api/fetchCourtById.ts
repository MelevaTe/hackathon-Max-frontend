import { rtkApi } from "@/shared/api/rtkApi";
import type { Court } from "../model/types/court.ts";

const courtApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getCourtById: build.query<Court, string>({
			query: (id) => `/courts-service/v1/courts/info/${id}`,
			providesTags: (result, error, id) => [{ type: "Court", id }],
		}),
	}),
});

export const { useGetCourtByIdQuery } = courtApi;
