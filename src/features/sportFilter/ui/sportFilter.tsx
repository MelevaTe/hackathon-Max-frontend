import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CourtType } from "@/entities/Court";
import cls from "@/pages/MainPage/ui/MainPage.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { Select, type SelectOption } from "@/shared/ui/Select/Select";
import { sportOptions } from "../model/consts/consts.ts";
import { getSport } from "../model/selectors/getSport.ts";
import { sportFilterActions } from "../model/slice/sportFilterSlice.ts";

interface SportFilterProps {
	className?: string;
}

export const SportFilter = memo((props: SportFilterProps) => {
	const { className } = props;
	const dispatch = useAppDispatch();
	const currentSport = useSelector(getSport);

	console.log("спорт из стора:", currentSport);

	const handleChange = (option: SelectOption) => {
		console.log("диспатч нового спорта", option.id);
		dispatch(sportFilterActions.setSport(option.id as CourtType));
	};

	const selectedOption =
		sportOptions.find((opt) => opt.id === currentSport) || sportOptions[0];

	return (
		<div className={classNames("", {}, [className])}>
			<Select
				options={sportOptions}
				value={selectedOption}
				onChange={handleChange}
			/>
		</div>
	);
});
