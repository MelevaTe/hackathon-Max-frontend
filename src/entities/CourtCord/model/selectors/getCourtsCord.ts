import { type StateSchema } from "@/app/providers/StoreProvider";

export const getCourtsCords = (state: StateSchema) => state.courtsCords?.data;
