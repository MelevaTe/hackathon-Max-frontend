import dayjs from "dayjs";
import type { CurrentWeather } from "../types/weather";

export const selectDailyForecast = (
	forecast: CurrentWeather[] | undefined
): CurrentWeather[] => {
	if (!forecast || forecast.length === 0) return [];

	const groupedByDay = forecast.reduce(
		(acc, item) => {
			const date = dayjs(item.dt_txt).format("YYYY-MM-DD");

			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(item);

			return acc;
		},
		{} as Record<string, CurrentWeather[]>
	);

	const dailyForecasts = Object.entries(groupedByDay).map(([date, items]) => {
		const eveningForecast = items.reduce((closest, current) => {
			const currentHour = dayjs(current.dt_txt).hour();
			const closestHour = dayjs(closest.dt_txt).hour();
			const targetHour = 18;

			const currentDiff = Math.abs(currentHour - targetHour);
			const closestDiff = Math.abs(closestHour - targetHour);

			return currentDiff < closestDiff ? current : closest;
		});

		return eveningForecast;
	});

	return dailyForecasts.slice(0, 5);
};

export const selectCurrentWeather = (
	forecast: CurrentWeather[] | undefined
): CurrentWeather | undefined => {
	return forecast?.[0];
};

export const selectWeatherByDate = (
	forecast: CurrentWeather[] | undefined,
	date: string
): CurrentWeather[] => {
	if (!forecast) return [];

	return forecast.filter((item) => {
		return dayjs(item.dt_txt).format("YYYY-MM-DD") === date;
	});
};
