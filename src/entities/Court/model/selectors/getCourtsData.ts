import { type StateSchema } from "@/app/providers/StoreProvider";

export const getCourtsData = (state: StateSchema) => state.court?.data;
