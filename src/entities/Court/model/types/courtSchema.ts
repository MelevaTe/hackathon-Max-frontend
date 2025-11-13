import type { Court } from "./court.ts";

export interface CourtSchema {
	isLoading: boolean;
	error?: string;
	data?: Court[];
	hasNextPage: boolean;
	isEmpty: boolean;
	currentPage: number;
	pageSize: number;
}
