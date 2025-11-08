import { type StateSchema } from "@/app/providers/StoreProvider";

export const getSport = (state: StateSchema) => state.sportFilter.sport;
