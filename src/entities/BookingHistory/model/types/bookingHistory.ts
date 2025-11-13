export interface BookingHistory {
	id: string;
	entryTime: string;
	title: string;
	address: string;
	description: string;
}

export interface UIBookingHistory extends Omit<BookingHistory, "entryTime"> {
	entryTime: string;
	formattedEntryDate: string;
	formattedEntryTime: string;
}
