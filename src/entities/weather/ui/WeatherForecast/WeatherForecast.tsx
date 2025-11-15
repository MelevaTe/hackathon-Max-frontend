import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ru";
import { useTranslation } from "react-i18next";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon/WeatherIco.tsx";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./WeatherForecast.module.scss";
import type { CurrentWeather } from "../../model/types/weather";

dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.updateLocale("ru", {
	weekdaysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
});

interface WeatherForecastProps {
	className?: string;
	forecast: CurrentWeather[];
	isLoading?: boolean;
}

const getDayLabel = (dt_txt: string) => {
	const date = dayjs(dt_txt);
	const today = dayjs();

	if (date.isSame(today, "day")) {
		return "Сегодня";
	}
	if (date.isSame(today.add(1, "day"), "day")) {
		return "Завтра";
	}

	return date.locale("ru").format("ddd");
};

const getTemp = (temp: number) => {
	return `${Math.round(temp)}°`;
};

export const WeatherForecast = (props: WeatherForecastProps) => {
	const { className, forecast, isLoading } = props;
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<div className={classNames(cls.WeatherForecast, {}, [className])}>
				<div className={cls.Loading}>Загрузка...</div>
			</div>
		);
	}

	if (!forecast || forecast.length === 0) {
		return (
			<div className={classNames(cls.WeatherForecast, {}, [className])}>
				<div className={cls.Empty}>Нет данных о погоде</div>
			</div>
		);
	}

	return (
		<div className={classNames(cls.WeatherForecast, {}, [className])}>
			<div className={cls.ForecastContainer}>
				{forecast.map((dayWeather, index) => (
					<div
						key={`${dayWeather.time}-${index}`}
						className={cls.DayCard}
					>
						<span className={cls.DayLabel}>
							{getDayLabel(dayWeather.dt_txt)}
						</span>
						<div className={cls.WeatherIconWrapper}>
							<WeatherIcon
								iconCode={dayWeather.iconCode}
								size={25}
							/>
						</div>
						<span className={cls.Temp}>
							{getTemp(dayWeather.temp)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
