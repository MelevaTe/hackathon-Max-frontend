import { Typography } from "@maxhub/max-ui";
import { Star } from "lucide-react";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import cls from "./StartRaiting.module.scss";

interface StarRatingProps {
	className?: string;
	rating: number;
	max?: number;
}

export const StarRating = (props: StarRatingProps) => {
	const { className, rating, max } = props;
	const fullStars = Math.floor(rating);

	return (
		<div className={classNames(cls.starRating, {}, [className])}>
			{[...Array(max)].map((_, i) => {
				const isFilled = i < fullStars;
				const starClass = classNames(
					cls.star,
					{
						[cls["star--filled"]]: isFilled,
						[cls["star--empty"]]: !isFilled,
					},
					[]
				);

				return (
					<Star
						key={i}
						size={12}
						className={starClass}
					/>
				);
			})}
			<Typography.Body
				variant="medium"
				className={cls["star-rating"]}
			>
				{rating.toFixed(1)}
			</Typography.Body>
		</div>
	);
};
