import type { ImgHTMLAttributes, ReactElement } from "react";
import React, { useLayoutEffect, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import cls from "./AppImage.module.scss";

interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
	className?: string;
	fallback?: ReactElement;
	errorFallback?: ReactElement;
	src?: string;
	alt?: string;
}

export const AppImage = (props: AppImageProps) => {
	const {
		className,
		src,
		alt = "image",
		fallback,
		errorFallback,
		...otherProps
	} = props;
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useLayoutEffect(() => {
		const img = new Image();
		img.src = src ?? "";
		img.onload = () => {
			setIsLoading(false);
		};
		img.onerror = () => {
			setHasError(true);
			setIsLoading(false);
		};
	}, [src]);

	if (isLoading && fallback) {
		return (
			<div className={classNames(cls.fallback, {}, [className])}>
				fallback
			</div>
		);
	}

	if (hasError && errorFallback) {
		return (
			<div className={classNames(cls.errorFallback, {}, [className])}>
				errorFallback
			</div>
		);
	}

	return (
		<img
			className={classNames(cls.AppImage, {}, [className])}
			src={src}
			alt={alt}
			loading="lazy"
			{...otherProps}
		/>
	);
};
