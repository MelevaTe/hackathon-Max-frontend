import type { Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import type { CombinedState } from "@reduxjs/toolkit/query";
import { userLocationReducer } from "@/entities/UserLocation";
import { routeReducer } from "@/features/route";
import { sportFilterReducer } from "@/features/sportFilter";
import { $api } from "@/shared/api/api";
import { rtkApi } from "@/shared/api/rtkApi";
import { createReducerManager } from "./reducerManager";
import type { StateSchema, ThunkExtraArg } from "./StateSchema";
import {geolocationApi} from "@/shared/api/rtkApi2gis.ts";

export function createReduxStore(
		initialState?: StateSchema,
		asyncReducers?: ReducersMapObject<StateSchema>
	) {
		const rootReducers: ReducersMapObject<StateSchema> = {
			...asyncReducers,
			sportFilter: sportFilterReducer,
			userLocations: userLocationReducer,
			route: routeReducer,
			[rtkApi.reducerPath]: rtkApi.reducer,
			[geolocationApi.reducerPath]: geolocationApi.reducer,
		};

		const reducerManager = createReducerManager(rootReducers);

	const extraArg: ThunkExtraArg = {
		api: $api,
	};

	const store = configureStore({
		// @ts-ignore
		reducer: reducerManager.reduce as Reducer<CombinedState<StateSchema>>,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: extraArg,
				},
			}).concat(rtkApi.middleware),
	});

	// @ts-ignore
	store.reducerManager = reducerManager;

	return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];
