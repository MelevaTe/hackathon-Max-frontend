import { Button, Panel } from "@maxhub/max-ui";
import { List } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { CourtDetails, CourtList } from "@/entities/Court";
import type { Court } from "@/entities/Court/model/types/court.ts";
import { RouteList, useBuildRouteQuery } from "@/features/buildRoute";
import { CourtBooking } from "@/features/courtBooking";
import { useGetCourtOnlineStatusQuery } from "@/features/onlineCourtStatus";
import { classNames } from "@/shared/lib/classNames/classNames.ts";
import { useRoute } from "@/shared/lib/hooks/useRoute.ts";
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
	triggerRef?: React.RefObject<HTMLDivElement>;
	wrapperRef?: React.RefObject<HTMLDivElement>;
}

export const CourtListAndDetails = memo((props: CourtListAndDetailsProps) => {
	const {
		className,
		courts = [],
		initialCourt = null,
		initialView = "list",
		triggerRef,
		wrapperRef,
	} = props;
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
	const [selectedCourt, setSelectedCourt] = useState<Court | null>(
		initialCourt
	);
	const [view, setView] = useState<MobileSheetView>(initialView);
	const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

	const { userPosition, destinationCoords } = useRoute();

	const isEnabled = userPosition && destinationCoords;

	const queryArgs = useMemo(() => {
		if (!isEnabled) return undefined;

		return {
			key: import.meta.env.VITE_2GIS_API_KEY,
			source: {
				type: "point" as const,
				point: {
					lon: userPosition![0],
					lat: userPosition![1],
				},
			},
			target: {
				type: "point" as const,
				point: {
					lon: destinationCoords![0],
					lat: destinationCoords![1],
				},
			},
			transport: ["bus", "metro", "pedestrian"],
		};
	}, [userPosition, destinationCoords, isEnabled]);

	const {
		data: routes = [],
		isLoading: isRouteLoading,
		isError: isRouteError,
		refetch: refetchRoutes,
	} = useBuildRouteQuery(queryArgs!, {
		skip: !queryArgs,
	});

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

	const handleSelectRoute = (route: any) => {
		setSelectedRouteId(route.id);
		// setView("routeDetails");
	};

	const handleOpenRouteList = () => {
		if (!isEnabled) {
			return;
		}
		refetchRoutes();
		setView("routeList");
	};

	const dateRange = useMemo(() => getDateRange(7), []);

	const utcDateRange = useMemo(() => {
		const startDate = new Date(dateRange.startDate);
		const endDate = new Date(dateRange.endDate);

		return {
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		};
	}, [dateRange]);

	const {
		data: onlineEntries,
		isLoading: isOnlineLoading,
		isError: isOnlineError,
	} = useGetCourtOnlineStatusQuery(
		{
			courtId: selectedCourt?.id!,
			startDate: utcDateRange.startDate,
			endDate: utcDateRange.endDate,
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
				triggerRef={triggerRef}
				wrapperRef={wrapperRef}
			/>
		),
		details: selectedCourt ? (
			<CourtDetails
				className={cls.MobileSheetContent}
				court={selectedCourt}
				onBack={handleBackToList}
				onClose={handleCloseSheet}
				onBooking={handleOpenBooking}
				onRoute={handleOpenRouteList}
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
		routeList: (
			<RouteList
				routes={routes}
				isLoading={isRouteLoading}
				onSelect={handleSelectRoute}
				onBack={handleBackToList}
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
