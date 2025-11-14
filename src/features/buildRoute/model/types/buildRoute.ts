export interface SourceTargetObj {
	type: "point";
	point: {
		lon: number;
		lat: number;
	};
}

export interface Waypoint {
	combined: boolean;
	routes_names: string[];
	subtype?: string;
}

export interface ScheduleItem {
	period?: number;
	precise_time: string;
	start_time: number;
	start_time_utc: number;
	type: string;
}

export interface Movement {
	alternatives: any[];
	id: string;
	type: string;
	waypoint: Waypoint;
	metro?: any;
	platforms?: any;
}

export interface RouteResponseItem {
	id: number;
	crossing_count: number;
	route_id?: string;
	movements: Movement[];
	pedestrian: boolean;
	schedules?: ScheduleItem[];
	schedules_events?: any[];
	total_distance: number;
	total_duration: number;
	total_walkway_distance: string;
	transfer_count: number;
	transport?: string[] | null;
	waypoints?: Waypoint[] | null;
}

export interface RouteRequest {
	source: SourceTargetObj;
	target: SourceTargetObj;
	transport: string[];
	key: string;
	enable_schedule?: boolean;
	max_result_count?: number;
	start_time?: number;
}

export interface GeocodeItem {
	address_name: string;
	full_name: string;
	point: {
		lat: number;
		lon: number;
	};
}

export interface GeocodeResponse {
	meta: {
		code: number;
	};
	result: {
		items: GeocodeItem[];
		total: number;
	};
}
