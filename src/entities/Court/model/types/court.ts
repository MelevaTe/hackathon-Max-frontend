export type CourtType = "FOOTBALL" | "BASKETBALL" | "TENNIS" | "VOLLEYBALL";

export interface Court {
	id: string;
	lat: number;
	lon: number;
	address: string;
	rating: number;
	type: CourtType;
	photoUrl?: string;
	paid: boolean;
	description: string;
	title: string;
	city_id: null;
}
