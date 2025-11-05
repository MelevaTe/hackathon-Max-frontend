import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { memo } from "react";
import cls from "./Button.module.scss";
import type { Mods } from "../../lib/classNames/classNames";
import { classNames } from "../../lib/classNames/classNames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	square?: boolean;
	disabled?: boolean;
	children?: ReactNode;
}

export const Button: FC<ButtonProps> = memo((props) => {
	const { className, children, square, disabled, ...otherProps } = props;

	const mods: Mods = {
		[cls.square]: square,
		[cls.disabled]: disabled,
	};

	return (
		<button
			className={classNames(cls.button, mods, [className])}
			disabled={disabled}
			{...otherProps}
		>
			{children}
		</button>
	);
});
