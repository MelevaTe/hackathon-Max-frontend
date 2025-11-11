import { Typography } from "@maxhub/max-ui";
import { IconButton } from "@maxhub/max-ui";
import { X } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CourtListItem } from "@/entities/Court/ui/CourtListItem/CourtListItem.tsx";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./CourtList.module.scss";
import type { Court } from "../../model/types/court.ts";

interface CourtListProps {
	className?: string;
	courts: Court[];
	isLoading?: boolean;
	onItemClick: (court: Court) => void;
	onClose: () => void;
}

export const CourtList = memo((props: CourtListProps) => {
	const { className, courts, isLoading, onItemClick, onClose } = props;
	const { t } = useTranslation();

	if (!isLoading && !courts.length) {
		return (
			<div className={classNames(cls.CourtList, {}, [className])}>
				<Typography.Body variant="large">
					Поля не найдены
				</Typography.Body>
			</div>
		);
	}

	return (
		<div className={classNames(cls.CourtList, {}, [className])}>
			<div className={cls.header}>
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
			<div className={cls.content}>
				{courts.map((court) => (
					<CourtListItem
						key={court.id}
						court={court}
						onClick={() => onItemClick(court)}
					/>
				))}
			</div>
		</div>
	);
});
