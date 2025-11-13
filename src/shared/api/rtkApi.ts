import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/const/localstorage";

export const rtkApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: __API__,
		prepareHeaders: (headers) => {
			const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: [
		"BookingActive",
		"BookingHistory",
		"CourtOnline",
		"Court",
		"Weather",
	],
	endpoints: (builder) => ({}),
});
