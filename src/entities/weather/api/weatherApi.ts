import { rtkApi } from "@/shared/api/rtkApi";
import type {
	OpenWeatherMapResponse,
	CurrentWeather,
} from "../model/types/weather";

const OPEN_WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!OPEN_WEATHER_API_KEY) {
	console.warn("Нет апи ключа OPEN_WEATHER_API");
}

const transformToCurrentWeather = (
	response: OpenWeatherMapResponse
): CurrentWeather[] => {
	return response.list.map((item) => ({
		iconCode: item.weather[0]?.icon || "01d",
		temp: item.main.temp,
		time: item.dt * 1000,
		dt_txt: item.dt_txt,
	}));
};

const weatherApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getForecast: build.query<
			CurrentWeather[],
			{ lat: number; lon: number }
		>({
			query: ({ lat, lon }) => ({
				url: `${OPEN_WEATHER_API_BASE_URL}/forecast`,
				params: {
					lat,
					lon,
					appid: OPEN_WEATHER_API_KEY,
					units: "metric",
					lang: "ru",
				},
			}),
			transformResponse: (response: OpenWeatherMapResponse) =>
				transformToCurrentWeather(response),
		}),
	}),
});

export const { useGetForecastQuery } = weatherApi;
