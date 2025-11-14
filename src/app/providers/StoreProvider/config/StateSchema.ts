import type {
	UnknownAction,
	EnhancedStore,
	Reducer,
	ReducersMapObject,
} from "@reduxjs/toolkit";
import type { CombinedState } from "@reduxjs/toolkit/query";
import type { AxiosInstance } from "axios";
import type { CourtSchema } from "@/entities/Court";
import type { CourtsCordsSchema } from "@/entities/CourtCord";
import type { userLocationSchema } from "@/entities/UserLocation";
import type { courtBookingSchema } from "@/features/courtBooking";
import type { routeSchema } from "@/features/route";
import type { sportFilterSchema } from "@/features/sportFilter";
import type { rtkApi } from "@/shared/api/rtkApi";

export interface StateSchema {
	sportFilter: sportFilterSchema;
	userLocations: userLocationSchema;
	route: routeSchema;
	[rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;

	// Асинхронные редюсеры
	court?: CourtSchema;
	courtsCords?: CourtsCordsSchema;
	courtBooking?: courtBookingSchema;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;

export interface ReducerManager {
	getReducerMap: () => ReducersMapObject<StateSchema>;
	// @ts-ignore
	reduce: (
		state: StateSchema,
		action: UnknownAction
		// @ts-ignore
	) => CombinedState<StateSchema>;
	add: (key: StateSchemaKey, reducer: Reducer) => void;
	remove: (key: StateSchemaKey) => void;
	//true - вмонтирован, false - демонтирован
	getMountedReducers: () => MountedReducers;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
	reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
	api: AxiosInstance;
}

export interface ThunkConfig<T> {
	rejectValue: T;
	extra: ThunkExtraArg;
	state: StateSchema;
}
