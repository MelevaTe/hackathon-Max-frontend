import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTime = (entryTime: string) => {
	const date = dayjs.utc(entryTime).local();

	return {
		formattedDate: date.format("DD.MM.YYYY"),
		formattedTime: date.format("HH:mm"),
	};
};
