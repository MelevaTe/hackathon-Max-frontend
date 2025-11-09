import type { Court } from "./court.ts";

export interface CourtSchema {
	isLoading: boolean;
	error?: string;
	data?: Court[];
}
