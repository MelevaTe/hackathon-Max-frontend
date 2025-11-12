import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import type {
	CreateCourtBookingRequest,
	CourtBooking,
} from "../types/courtBooking";

export const createCourtBooking = createAsyncThunk<
	CourtBooking,
	CreateCourtBookingRequest,
	ThunkConfig<string>
>("courtBooking/create", async (bookingData, thunkApi) => {
	const { rejectWithValue, extra } = thunkApi;

	try {
		const response = await extra.api.post<CourtBooking>(
			"/entry-service/v1/entries",
			bookingData
		);

		if (!response.data) {
			throw new Error("No data received");
		}

		return response.data;
	} catch (e) {
		console.error("Ошибка при создании бронирования:", e);
		return rejectWithValue("Не удалось создать бронирование");
	}
});
