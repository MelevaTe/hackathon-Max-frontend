import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CourtSchema } from "../types/courtSchema.ts";

const initialState: CourtSchema = {
	isLoading: false,
	error: undefined,
	data: undefined,
};

export const courtSlice = createSlice({
	name: "court",
	initialState,
	reducers: {},
});

export const { actions: courtActions } = courtSlice;
export const { reducer: courtReducer } = courtSlice;
