import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import type { FC } from "react";
import React, { memo } from "react";
import { classNames, type Mods } from "@/shared/lib/classNames/classNames.ts";
import cls from "./Select.module.scss";

export interface SelectOption {
	id: string | number;
	name: string;
}

export interface SelectProps {
	className?: string;
	options: SelectOption[];
	value: SelectOption;
	onChange: (value: SelectOption) => void;
	largeWidth?: boolean; // Новый пропс
}

export const Select: FC<SelectProps> = memo((props) => {
	const { className, options, value, onChange, largeWidth, ...otherProps } =
		props;

	return (
		<Listbox
			value={value}
			onChange={onChange}
			{...otherProps}
		>
			<ListboxButton className={classNames(cls.Select, {}, [className])}>
				{value.name}
				<ChevronDown />
			</ListboxButton>
			<ListboxOptions
				anchor="bottom"
				className={classNames(
					cls.SelectOptions,
					{
						[cls.SelectOptions_large]: largeWidth, // Условный класс
					},
					[]
				)}
			>
				{options.map((option) => (
					<ListboxOption
						key={option.id}
						value={option}
						className={({ focus, selected }) => {
							const mods: Mods = {
								[cls.SelectOption_focus]: focus,
								[cls.SelectOption_selected]: selected,
							};
							return classNames(cls.SelectOption, mods, []);
						}}
					>
						{({ selected }) => (
							<div className={cls.SelectOptionContent}>
								<Check
									className={classNames(
										cls.SelectOptionCheck,
										{
											[cls.SelectOptionCheck_visible]:
												selected,
										}
									)}
								/>
								<div className={cls.SelectOptionText}>
									{option.name}
								</div>
							</div>
						)}
					</ListboxOption>
				))}
			</ListboxOptions>
		</Listbox>
	);
});
