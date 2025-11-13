import { Typography } from "@maxhub/max-ui";
import { Users } from "lucide-react";
import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./OnlineEntryItem.module.scss";

interface OnlineEntryItemProps {
	entryTime: string;
	entryDate: string;
	usersCount: number;
	className?: string;
}

export const OnlineEntryItem = memo((props: OnlineEntryItemProps) => {
	const { entryTime, entryDate, usersCount, className } = props;

	return (
		<div className={classNames(cls.OnlineEntryItem, {}, [className])}>
			<div className={cls.timeContainer}>
				<Typography.Body variant="medium">{entryDate}</Typography.Body>
				<Typography.Body className={cls.time}>
					{entryTime}
				</Typography.Body>
			</div>
			<div className={cls.usersInfo}>
				<Users size={16} />
				<div className={cls.userCount}>{usersCount}</div>
			</div>
		</div>
	);
});
