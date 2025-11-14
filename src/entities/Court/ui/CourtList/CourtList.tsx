import { Typography } from "@maxhub/max-ui";
import { IconButton } from "@maxhub/max-ui";
import { X, HeartCrack } from "lucide-react";
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
	triggerRef?: React.RefObject<HTMLDivElement>;
	wrapperRef?: React.RefObject<HTMLDivElement>;
}

export const CourtList = memo((props: CourtListProps) => {
	const {
		className,
		courts,
		isLoading,
		onItemClick,
		onClose,
		triggerRef,
		wrapperRef,
	} = props;
	const { t } = useTranslation();

	if (!isLoading && !courts.length) {
		return (
			<div className={classNames(cls.CourtList, {}, [className])}>
				<div className={cls.header}>
					<Typography.Headline>Доступные поля</Typography.Headline>
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
				<div className={cls.contentError}>
					<Typography.Headline>
						Нет доступных полей
					</Typography.Headline>
					<HeartCrack
						size={90}
						color={"#f56565"}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames(cls.CourtList, {}, [className])}>
			<div className={cls.header}>
				<Typography.Headline>Доступные поля</Typography.Headline>
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
			<div
				ref={wrapperRef}
				className={cls.content}
			>
				{courts.map((court) => (
					<CourtListItem
						key={court.id}
						court={court}
						onClick={() => onItemClick(court)}
					/>
				))}
				<div
					ref={triggerRef}
					style={{ height: "20px", minHeight: "20px" }}
				/>
			</div>
		</div>
	);
});
