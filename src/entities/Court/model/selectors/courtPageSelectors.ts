import type { StateSchema } from "@/app/providers/StoreProvider";
import type { Court } from "@/entities/Court";

export const getCourtPageIsLoading = (state: StateSchema) =>
	state.court?.isLoading || false;
export const getCourtPageHasMore = (state: StateSchema) =>
	state.court?.hasNextPage || false;
export const getCourtPageNum = (state: StateSchema) =>
	state.court?.currentPage || 0;
export const getCourtPageLimit = (state: StateSchema) =>
	state.court?.pageSize || 50;
export const getCourtPageData = (state: StateSchema): Court[] | undefined =>
	state.court?.data;
