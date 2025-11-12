import type { CourtBooking } from "./courtBooking.ts";

export interface courtBookingSchema {
	isLoading: boolean;
	error?: string;
	data?: CourtBooking;
}
