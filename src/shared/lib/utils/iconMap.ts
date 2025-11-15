import {
	Sun,
	Cloud,
	CloudRain,
	CloudSnow,
	CloudDrizzle,
	CloudFog,
	Moon,
	Zap,
} from "lucide-react";
import type { WeatherIconMap } from "@/entities/weather";

export const iconMap: WeatherIconMap = {
	"01d": Sun,
	"01n": Moon,
	"02d": Cloud,
	"02n": Cloud,
	"03d": Cloud,
	"03n": Cloud,
	"04d": Cloud,
	"04n": Cloud,
	"09d": CloudDrizzle,
	"09n": CloudDrizzle,
	"10d": CloudRain,
	"10n": CloudRain,
	"11d": Zap,
	"11n": Zap,
	"13d": CloudSnow,
	"13n": CloudSnow,
	"50d": CloudFog,
	"50n": CloudFog,
};
