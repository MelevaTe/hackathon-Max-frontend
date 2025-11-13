import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import cls from "./DatePicker.module.scss";
import "dayjs/locale/ru";

dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale("ru", {
	weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
});

interface CourtBookingProps {
	courtId?: string;
	className?: string;
	selectedDate: string | null;
	onSelectDate: (date: string) => void;
}

export const DatePicker = (props: CourtBookingProps) => {
	const { className, selectedDate, onSelectDate } = props;

	const { t } = useTranslation();

	dayjs.locale("ru");

	const today = dayjs();
	const next7Days = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));

	const formatDateString = (date: dayjs.Dayjs) => date.format("YYYY-MM-DD");

	const getDateLabel = (date: dayjs.Dayjs) => {
		const now = dayjs();

		if (date.isSame(now, "day")) {
			return t("Today", { defaultValue: "Сегодня" });
		}
		if (date.isSame(now.add(1, "day"), "day")) {
			return t("Tomorrow", { defaultValue: "Завтра" });
		}

		return date.format("ddd");
	};

	return (
		<div className={classNames(cls.DatePicker, {}, [className])}>
			<h3 className={cls.Title}>Выберите дату на ближайшую неделю</h3>
			<div className={cls.DaysContainer}>
				{next7Days.map((date, index) => {
					const dateStr = formatDateString(date);
					const isSelected = selectedDate === dateStr;

					const mods = {
						[cls["DayCard--selected"]]: isSelected,
					};

					return (
						<div
							key={index}
							className={classNames(cls.DayCard, mods)}
							onClick={() => onSelectDate(dateStr)}
							role="button"
							tabIndex={-1}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onSelectDate(dateStr);
								}
							}}
						>
							<span className={cls.DayLabel}>
								{getDateLabel(date)}
							</span>
							<span className={cls.DayNumber}>
								{date.format("D")}{" "}
							</span>
							<span className={cls.DayMonth}>
								{date.format("MMM")}{" "}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
