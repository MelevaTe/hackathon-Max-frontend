import type {
	RouteRequest,
	RouteResponseItem,
	GeocodeResponse,
	GeocodeItem,
} from "@/features/buildRoute/model/types/buildRoute.ts";
import {geolocationApi} from "@/shared/api/rtkApi2gis.ts";

const buildRouteApi = geolocationApi.injectEndpoints({
	endpoints: (build) => ({
		buildRoute: build.query<RouteResponseItem[], Omit<RouteRequest, "key"> & { key: string }>({
			query: ({ key, ...body }) => ({
				url: `https://routing.api.2gis.com/public_transport/2.0?key=${key}`,
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { ...body },
			}),
			transformResponse: (response: RouteResponseItem[]) => response,
			keepUnusedDataFor: 0,
			providesTags: ["Route"],
		}),
		geocode: build.query<GeocodeItem[], { q: string; key: string }>({
			query: ({ q, key }) => {
				const url = new URL("https://catalog.api.2gis.com/3.0/items/geocode");
				url.searchParams.set("q", q);
				url.searchParams.set("fields", "items.point");
				url.searchParams.set("key", key);
				return {
					url: url.toString(),
				};
			},
			transformResponse: (response: GeocodeResponse) => {
				if (response.meta.code === 200 && response.result.items) {
					return response.result.items;
				}
				return [];
			},
			keepUnusedDataFor: 0,
		}),
	}),
});

export const { useBuildRouteQuery, useGeocodeQuery } = buildRouteApi;
