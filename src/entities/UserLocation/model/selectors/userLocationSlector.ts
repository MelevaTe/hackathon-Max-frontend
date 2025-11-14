import type { StateSchema } from "@/app/providers/StoreProvider";

export const selectUserLocation = (state: StateSchema) =>
	state.userLocations?.data;
