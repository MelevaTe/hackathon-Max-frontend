import { Button, IconButton } from "@maxhub/max-ui";
import { X } from "lucide-react";
import { List } from "lucide-react";
import { memo, useState } from "react";
import type { Court } from "@/entities/Court/model/types/court.ts";
import { CourtList } from "@/entities/Court/ui/CourtList/CourtList.tsx";
import { Panel } from "@/shared/ui/Panel/Panel.tsx";
import cls from "./CourtListAndDetails.module.scss";

interface CourtListAndDetailsProps {
	className?: string;
	courts?: Court[];
	isLoading?: boolean;
	error?: string;
}

export const CourtListAndDetails = memo((props: CourtListAndDetailsProps) => {
	const { className, courts } = props;
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);


	return (
		<>
			{!mobileSheetOpen && (
				<div>
					<Button
						appearance="themed"
						mode="primary"
						onClick={() => setMobileSheetOpen(true)}
						size="large"
						className={cls.OpenButton}
						iconBefore={<List />}
					>
						Список полей
					</Button>
				</div>
			)}

			{mobileSheetOpen && (
				<div className={cls.MobileSheet}>
					<Panel className={cls.MobileWrapper}>
						<IconButton
							appearance="themed"
							aria-label="Название кнопки"
							mode="primary"
							size="medium"
							className={cls.CloseButton}
							onClick={() => setMobileSheetOpen(false)}
						>
							<X />
						</IconButton>
						<CourtList courts={courts || []} />
					</Panel>
				</div>
			)}
		</>
	);
});
