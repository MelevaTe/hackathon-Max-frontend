import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { Button } from "@maxhub/max-ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	selectUserLocation,
	userLocationActions,
} from "@/entities/UserLocation";
import { SUPPORTED_CITIES } from "@/shared/const/cities.ts";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { Select, type SelectOption } from "@/shared/ui/Select/Select.tsx";

export const LocationSelectorModal = () => {
	const dispatch = useAppDispatch();
	const userLocation = useSelector(selectUserLocation);

	const [isOpen, setIsOpen] = useState(true);
	const [selectedCity, setSelectedCity] = useState<SelectOption>({
		id: 1,
		name: "Москва",
	});

	const cityOptions: SelectOption[] = SUPPORTED_CITIES.map((city) => ({
		id: city.id,
		name: city.name,
	}));

	useEffect(() => {
		if (cityOptions.length > 0 && !selectedCity) {
			setSelectedCity(cityOptions[0]);
		}
	}, [cityOptions, selectedCity]);

	if (userLocation) {
		return null;
	}

	const handleConfirm = () => {
		if (selectedCity) {
			const city = SUPPORTED_CITIES.find((c) => c.id === selectedCity.id);
			if (city) {
				dispatch(
					userLocationActions.setUserLocation({
						id: city.id,
						name: city.name,
						lat: city.lat,
						lon: city.lon,
					})
				);
			}
		}
		setIsOpen(false);
	};

	return (
		<Dialog
			open={isOpen}
			onClose={() => {}}
			className="relative z-50"
		>
			<DialogBackdrop
				style={{
					position: "fixed",
					inset: 0,
					backgroundColor: "rgba(0, 0, 0, 0.3)",
					zIndex: 50,
				}}
			/>
			<div
				style={{
					position: "fixed",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "16px",
					zIndex: 51,
				}}
			>
				<DialogPanel
					style={{
						width: "100%",
						maxWidth: "90%",
						display: "flex",
						flexDirection: "column",
						padding: "24px",
						border: "1px solid var(--background-secondary-color)",
						borderRadius: "8px",
						backgroundColor: "var(--background-color)",
						color: "var(--text-color)",
						gap: "16px",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
					}}
				>
					<DialogTitle
						style={{
							fontSize: "1.125rem",
							fontWeight: "bold",
							color: "var(--text-color)",
						}}
					>
						Выберите город
					</DialogTitle>
					<div>
						<Select
							options={cityOptions}
							value={selectedCity}
							onChange={setSelectedCity}
							largeWidth
						/>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: "8px",
						}}
					>
						<Button
							onClick={handleConfirm}
							appearance="themed"
							mode="primary"
							size="medium"
						>
							Подтвердить
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
