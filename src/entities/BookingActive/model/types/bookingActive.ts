export interface BookingActive {
	id: string;
	entryTime: string;
	title: string;
	address: string;
	lat: number;
	lon: number;
}

export interface UIBookingActive extends Omit<BookingActive, "entryTime"> {
	entryTime: string;
	formattedEntryDate: string;
	formattedEntryTime: string;
}
