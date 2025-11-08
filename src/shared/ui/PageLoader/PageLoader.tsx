import { Spinner } from "@maxhub/max-ui";
import React from "react";
import cls from "./PageLoader.module.scss";
import { classNames } from "../../lib/classNames/classNames";

interface PageLoaderProps {
	className?: string;
}

export const PageLoader = ({ className }: PageLoaderProps) => {
	return (
		<div className={classNames(cls.pageLoader, {}, [className])}>
			<Spinner
				appearance="themed"
				size={70}
			/>
		</div>
	);
};
