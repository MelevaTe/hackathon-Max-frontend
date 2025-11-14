import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geolocationApi = createApi({
    reducerPath: "geolocationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "",
    }),
    tagTypes: ["Geocode", "Route"],
    endpoints: (builder) => ({}),
});