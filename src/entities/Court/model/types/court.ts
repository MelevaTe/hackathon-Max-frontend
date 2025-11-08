import type { CourtType } from "../consts/CourtConsts.ts";

export interface Court {
	id: string;
	title: string;
	description: string;
	paid: boolean;
	img: string;
	type: CourtType;
}
