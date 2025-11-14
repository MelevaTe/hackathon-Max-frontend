export interface routeSchema {
	destinationCoords: [number, number] | null;
	showRoute: boolean;
	userPosition: [number, number] | null;
	routeType: "car" | "pedestrian" | null;
}
