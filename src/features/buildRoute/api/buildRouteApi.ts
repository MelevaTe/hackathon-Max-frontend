import {rtkApi} from "@/shared/api/rtkApi.ts";
import type {RouteRequest, RouteResponseItem} from "@/features/buildRoute/model/types/buildRoute.ts";

const buildRouteApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        buildRoute: build.query<RouteResponseItem[], RouteRequest>({
            query: (params) => {
                const { key, ...body } = params;
                return {
                    url: "https://catalog.api.2gis.com/2.0/router/build_route",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        ...body,
                        key,
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