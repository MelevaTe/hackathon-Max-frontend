export type CourtType = "football" | "basketball" | "tennis" | "volleyball";

export interface Court {
	id: string;
	title: string;
	address: string;
	description: string;
	paid: boolean;
	rating: number;
	img?: string;
	type: CourtType;
}
