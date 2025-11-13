import { Button, Panel } from "@maxhub/max-ui";
import { List } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { CourtDetails, CourtList } from "@/entities/Court";
import type { Court } from "@/entities/Court/model/types/court.ts";
import { CourtBooking } from "@/features/courtBooking";
import { useGetCourtOnlineStatusQuery } from "@/features/onlineCourtStatus";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { getDateRange } from "@/shared/lib/utils/dateRange.ts";
import { formatDateTime } from "@/shared/lib/utils/formatDate.ts";
import cls from "./CourtListAndDetails.module.scss";
import type { MobileSheetView } from "../model/types/types.ts";

interface CourtListAndDetailsProps {
	className?: string;
	courts?: Court[];
	isLoading?: boolean;
	error?: string;
	initialCourt?: Court | null;
	initialView?: MobileSheetView;
}

export const CourtListAndDetails = memo((props: CourtListAndDetailsProps) => {
	const {
		className,
		courts = [],
		initialCourt = null,
		initialView = "list",
	} = props;
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
	const [selectedCourt, setSelectedCourt] = useState<Court | null>(
		initialCourt
	);
	const [view, setView] = useState<MobileSheetView>(initialView);

	useEffect(() => {
		if (initialCourt) {
			setSelectedCourt(initialCourt);
			setView("details");
			setMobileSheetOpen(true);
		}
	}, [initialCourt]);

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

	const dateRange = useMemo(() => getDateRange(7), []);

	const {
		data: onlineEntries,
		isLoading: isOnlineLoading,
		isError: isOnlineError,
	} = useGetCourtOnlineStatusQuery(
		{
			courtId: selectedCourt?.id!,
			startDate: dateRange.startDate,
			endDate: dateRange.endDate,
		},
		{
			skip: !selectedCourt?.id,
		}
	);

	const formattedOnlineEntries = useMemo(() => {
		if (!onlineEntries) return [];
		return onlineEntries.map((entry) => {
			const { formattedTime, formattedDate } = formatDateTime(
				entry.entryTime
			);
			return {
				formattedTime,
				formattedDate,
				usersCount: entry.usersCount,
			};
		});
	}, [onlineEntries]);

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
				className={cls.MobileSheetContent}
				court={selectedCourt}
				onBack={handleBackToList}
				onClose={handleCloseSheet}
				onBooking={handleOpenBooking}
				onlineEntries={formattedOnlineEntries}
				isOnlineLoading={isOnlineLoading}
				isOnlineError={isOnlineError}
			/>
		) : (
			<div>Данные отсутствуют</div>
		),
		booking: (
			<CourtBooking
				courtId={selectedCourt?.id}
				courtTitle={selectedCourt?.title}
				onBack={handleBackToDetails}
				onClose={handleCloseSheet}
				className={cls.MobileSheetContent}
			/>
		),
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
								view === "details",
							[cls["MobileSheet--withList"]]: view === "list",
							[cls["MobileSheet--withBooking"]]:
								view === "booking",
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
