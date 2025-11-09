import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CourtType } from "@/entities/Court";
import type { sportFilterSchema } from "../types/sportFilterSchema.ts";

const initialState: sportFilterSchema = {
	sport: "football",
};

export const sportFilterSlice = createSlice({
	name: "sportFilter",
	initialState,
	reducers: {
		setSport: (state, action: PayloadAction<CourtType>) => {
			state.sport = action.payload;
		},
	},
});

export const { actions: sportFilterActions } = sportFilterSlice;
export const { reducer: sportFilterReducer } = sportFilterSlice;
