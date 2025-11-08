import { Container } from "@maxhub/max-ui";
import type { HTMLAttributes } from "react";
import React from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Panel.module.scss";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
}

export const Panel = ({ className, children, ...otherProps }: PanelProps) => {
	return (
		<div
			className={classNames(cls.Panel, {}, [className])}
			{...otherProps}
		>
			<Container>{children}</Container>
		</div>
	);
};
