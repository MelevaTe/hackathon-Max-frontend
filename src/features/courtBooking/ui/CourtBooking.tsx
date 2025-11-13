import { Button, IconButton, Typography } from "@maxhub/max-ui";
import { TimePicker, type TimePickerProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { CircleArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createCourtBooking } from "@/features/courtBooking/model/services/createCourtBooking.ts";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { DatePicker } from "@/shared/ui/DatePicker/DatePicker.tsx";
import cls from "./CourtBooking.module.scss";

interface CourtBookingProps {
	courtId?: string;
	className?: string;
	onBack: () => void;
	onClose: () => void;
	courtTitle?: string;
}

export const CourtBooking = (props: CourtBookingProps) => {
	const { className, courtId, onBack, onClose, courtTitle } = props;

	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [bookingSuccess, setBookingSuccess] = useState(false);

	const onTimeChange: TimePickerProps["onChange"] = (time) => {
		setSelectedTime(time);
	};

	const handleBooking = async () => {
		console.log("handleBooking запустился");
		console.log("courtId:", courtId);
		console.log("selectedDate:", selectedDate);
		console.log("selectedTime:", selectedTime);
		if (!courtId) {
			console.error("ID корта не указан");
			return;
		}
		if (!selectedDate) {
			console.error("Дата не выбрана");
			return;
		}
		if (!selectedTime) {
			console.error("Время не выбрано");
			return;
		}

		const combinedDateTime = dayjs(selectedDate)
			.set("hour", selectedTime.hour())
			.set("minute", selectedTime.minute())
			.set("second", 0);

		const entryTime = combinedDateTime.toISOString();

		const bookingData = {
			courtId,
			entryTime,
		};

		try {
			await dispatch(createCourtBooking(bookingData)).unwrap();
			setBookingSuccess(true);
		} catch (e) {
			console.error("Ошибка при бронировании:", e);
			console.error("Не удалось создать бронирование");
		}
	};

	return (
		<div className={classNames(cls.CourtBooking, {}, [className])}>
			<div className={cls.header}>
				<Button
					onClick={onBack}
					appearance="themed"
					mode="secondary"
					size="medium"
					iconBefore={<CircleArrowLeft />}
				>
					Назад
				</Button>
				<IconButton
					appearance="neutral"
					aria-label="Закрыть"
					mode="tertiary"
					size="medium"
					onClick={onClose}
				>
					<X />
				</IconButton>
			</div>
			<div className={cls.header}>
				<Typography.Body>{courtTitle}</Typography.Body>
			</div>
			{bookingSuccess && (
				<div className={cls.successMessage}>
					<Typography.Body>Вы записаны!</Typography.Body>
				</div>
			)}
			<div className={cls.content}>
				<DatePicker
					selectedDate={selectedDate}
					onSelectDate={setSelectedDate}
				/>
				<TimePicker
					value={selectedTime}
					onChange={onTimeChange}
					minuteStep={30}
					format="HH:mm"
					showSecond={false}
					placeholder="Выберите время"
					style={{
						width: "100%",
						height: "40px",
						fontSize: "16px",
					}}
				/>
			</div>
			<div className={cls.footer}>
				<Button
					className={cls.bookingButton}
					onClick={handleBooking}
					appearance="themed"
					mode="primary"
					size="large"
				>
					Забронировать
				</Button>
			</div>
		</div>
	);
};
