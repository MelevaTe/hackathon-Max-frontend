import { Button, IconButton, Typography } from "@maxhub/max-ui";
import { TimePicker, type TimePickerProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { CircleArrowLeft, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
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

	const onTimeChange: TimePickerProps["onChange"] = (time) => {
		setSelectedTime(time);
	};

	const handleBooking = async () => {
		if (!courtId) {
			return;
		}
		if (!selectedDate) {
			toast.error("Пожалуйста, выберите дату");
			return;
		}
		if (!selectedTime) {
			toast.error("Пожалуйста, выберите время");
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
			toast.success("Вы успешно записались!");
		} catch (e: any) {
			console.error("Ошибка при бронировании:", e);
			const errorMessage = e || "Не удалось записаться";
			toast.error(errorMessage);
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
					inputReadOnly={true}
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
					Записаться
				</Button>
			</div>
		</div>
	);
};
