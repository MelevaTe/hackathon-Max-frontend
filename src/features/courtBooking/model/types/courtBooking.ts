export interface CourtBooking {
	id: string;
	userId: string;
	courtId: string;
	entryTime: string;
}

export interface CreateCourtBookingRequest {
	courtId: string;
	entryTime: string;
}
