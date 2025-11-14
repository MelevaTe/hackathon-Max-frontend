import type {
	GeocodeResponse,
	GeocodeItem,
} from "@/features/buildRoute/model/types/buildRoute.ts";
import { rtkApi } from "@/shared/api/rtkApi.ts";

const buildRouteApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		geocode: build.query<GeocodeItem[], { q: string; key: string }>({
			query: ({ q, key }) => {
				const url = new URL(
					"https://catalog.api.2gis.com/3.0/items/geocode"
				);
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

export const { useGeocodeQuery } = buildRouteApi;
