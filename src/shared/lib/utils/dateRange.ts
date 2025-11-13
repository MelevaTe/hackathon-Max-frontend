import dayjs from "dayjs";

interface DateRange {
	startDate: string;
	endDate: string;
}

export const getDateRange = (daysToAdd: number = 7): DateRange => {
	const now = dayjs();
	const startDate = now.format("YYYY-MM-DDTHH:mm:ss");
	const endDate = now.add(daysToAdd, "day").format("YYYY-MM-DDTHH:mm:ss");

	return {
		startDate,
		endDate,
	};
};
