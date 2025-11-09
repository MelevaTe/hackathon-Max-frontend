import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import cls from "./Card.module.scss";

interface CardProps {
	className?: string;
	children: ReactNode;
	onClick?: () => void;
}

export const Card = (props: CardProps) => {
	const { className, children, ...otherProps } = props;
	return (
		<div
			className={classNames(cls.Card, {}, [className])}
			{...otherProps}
		>
			{children}
		</div>
	);
};
