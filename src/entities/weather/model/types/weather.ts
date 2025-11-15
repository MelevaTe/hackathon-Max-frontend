export interface OpenWeatherMapResponse {
	cod: string;
	message: number;
	cnt: number;
	list: WeatherItem[];
	city: City;
}

export interface WeatherItem {
	dt: number;
	main: Main;
	weather: WeatherCondition[];
	clouds: Clouds;
	wind: Wind;
	visibility: number;
	pop: number;
	sys: Sys;
	dt_txt: string;
}

export interface Main {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	sea_level: number;
	grnd_level: number;
	humidity: number;
}

export interface WeatherCondition {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export interface Clouds {
	all: number;
}

export interface Wind {
	speed: number;
	deg: number;
	gust: number;
}

export interface Sys {
	pod: string;
}

export interface City {
	id: number;
	name: string;
	coord: Cord;
	country: string;
	population: number;
	timezone: number;
	sunrise: number;
	sunset: number;
}

export interface Cord {
	lat: number;
	lon: number;
}

export interface CurrentWeather {
	iconCode: string;
	temp: number;
	time: number;
	dt_txt: string;
}

export type WeatherIconMap = Record<string, React.FC<any>>;
