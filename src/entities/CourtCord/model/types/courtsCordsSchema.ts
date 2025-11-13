import type { CourtsCords } from "./courtsCords.ts";

export interface CourtsCordsSchema {
	isLoading: boolean;
	error?: string;
	data?: CourtsCords[];
}
