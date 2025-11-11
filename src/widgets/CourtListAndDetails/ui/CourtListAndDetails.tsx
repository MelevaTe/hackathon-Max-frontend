import { Button, Panel } from "@maxhub/max-ui";
import { X, List } from "lucide-react";
import { memo, useState } from "react";
import { CourtDetails, CourtList } from "@/entities/Court";
import type { Court } from "@/entities/Court/model/types/court.ts";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import cls from "./CourtListAndDetails.module.scss";
import type { MobileSheetView } from "../model/types/types.ts";

interface CourtListAndDetailsProps {
	className?: string;
	courts?: Court[];
	isLoading?: boolean;
	error?: string;
}

export const CourtListAndDetails = memo((props: CourtListAndDetailsProps) => {
	const { className, courts = [] } = props;
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
	const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
	const [view, setView] = useState<MobileSheetView>("list");

	const handleOpenDetails = (court: Court) => {
		setSelectedCourt(court);
		setView("details");
	};

	const handleBackToList = () => {
		setSelectedCourt(null);
		setView("list");
	};

	const handleOpenBooking = (courtId: string) => {
		setView("booking");
	};

	const handleBackToDetails = () => {
		setView("details");
	};

	const handleOpenSheet = () => {
		setSelectedCourt(null);
		setView("list");
		setMobileSheetOpen(true);
	};

	const handleCloseSheet = () => {
		setMobileSheetOpen(false);
		setView("list");
	};

	const viewComponents: Record<MobileSheetView, JSX.Element> = {
		list: (
			<CourtList
				courts={courts}
				className={cls.MobileSheetContent}
				onItemClick={handleOpenDetails}
				onClose={handleCloseSheet}
			/>
		),
		details: selectedCourt ? (
			<CourtDetails
				court={selectedCourt}
				onBack={handleBackToList}
				onClose={handleCloseSheet}
				className={cls.MobileSheetContent}
			/>
		) : (
			<div>Данные отсутствуют</div>
		),
		booking: <div></div>,
	};

	return (
		<>
			{!mobileSheetOpen && (
				<div>
					<Button
						appearance="themed"
						mode="primary"
						onClick={handleOpenSheet}
						size="large"
						className={cls.OpenButton}
						iconBefore={<List />}
					>
						Список полей
					</Button>
				</div>
			)}

			{mobileSheetOpen && (
				<div
					className={classNames(
						cls.MobileSheet,
						{
							[cls["MobileSheet--withDetails"]]:
								selectedCourt !== null,
							[cls["MobileSheet--withList"]]:
								selectedCourt === null,
						},
						[className]
					)}
				>
					<Panel
						className={cls.panel}
						mode="secondary"
					>
						{viewComponents[view]}
					</Panel>
				</div>
			)}
		</>
	);
});
