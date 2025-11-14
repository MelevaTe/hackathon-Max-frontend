import type {
	RouteRequest,
	RouteResponseItem,
} from "@/features/buildRoute/model/types/buildRoute.ts";
import { rtkApi } from "@/shared/api/rtkApi.ts";

const buildRouteApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		buildRoute: build.query<RouteResponseItem[], Omit<RouteRequest, 'key'> & { key: string }>({
			query: ({ key, ...body }) => {
				return {
					url: `https://routing.api.2gis.com/public_transport/2.0?key=${key}`,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: {
						...body,
					},
				};
			},
			transformResponse: (response: RouteResponseItem[]) => {
				return response;
			},
			keepUnusedDataFor: 0,
			providesTags: ["Route"],
		}),
	}),
});

export const { useBuildRouteQuery } = buildRouteApi;