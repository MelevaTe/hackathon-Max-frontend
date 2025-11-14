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
	} catch (e: any) {
		console.error("Ошибка при создании бронирования:", e);

		if (e.isAxiosError && e.response) {
			const { status } = e.response;
			if (status === 409) {
				return rejectWithValue("Вы уже записан на это время.");
			}
		}
		const errorMessage =
			e.response?.data?.message || "Не удалось создать бронирование";
		return rejectWithValue(errorMessage);
	}
});
