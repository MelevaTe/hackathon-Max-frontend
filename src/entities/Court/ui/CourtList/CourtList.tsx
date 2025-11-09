import { Typography } from "@maxhub/max-ui";
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
}

// const getSkeletons = (view: ArticleView) =>
//     new Array(view === ArticleView.SMALL ? 9 : 3)
//         .fill(0)
//         .map((item, index) => (
//             <ArticleListItemSkeleton
//                 className={cls.card}
//                 key={index}
//                 view={view}
//             />
//         ));

export const CourtList = memo((props: CourtListProps) => {
	const { className, courts, isLoading } = props;
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
			{courts.map((item) => (
				<CourtListItem
					court={item}
					key={item.id}
					className={cls.card}
				/>
			))}
			{/*{isLoading && getSkeletons(view)}*/}
		</div>
	);
});
