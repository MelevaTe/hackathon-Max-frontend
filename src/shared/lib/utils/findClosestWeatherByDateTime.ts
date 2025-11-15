import dayjs from "dayjs";
import type { OpenWeatherMapResponse, WeatherItem } from "@/entities/weather";

export function findClosestWeatherByDateTime(
	forecast: OpenWeatherMapResponse["list"],
	targetDate: Date | number | string,
	toleranceMs: number = 3 * 60 * 60 * 1000
): WeatherItem | null {
	const targetDayjs = dayjs(targetDate);

	if (!targetDayjs.isValid()) {
		return null;
	}

	const targetTime = targetDayjs.valueOf();

	let closestItem: WeatherItem | null = null;
	let minDiff = Infinity;

	for (const item of forecast) {
		const itemDayjs = dayjs.unix(item.dt);
		const itemTime = itemDayjs.valueOf();

		const diff = Math.abs(itemTime - targetTime);

		if (diff <= toleranceMs && diff < minDiff) {
			minDiff = diff;
			closestItem = item;
		}
	}

	return closestItem;
}
