export interface OnlineCourtStatus {
	entryTime: string;
	usersCount: number;
}

export interface OnlineCourtStatusResponse {
	message: string;
	onlines: OnlineCourtStatus[];
}
