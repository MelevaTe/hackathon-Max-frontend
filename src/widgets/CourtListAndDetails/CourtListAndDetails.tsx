import { Button, IconButton } from "@maxhub/max-ui";
import { X } from "lucide-react";
import { List } from "lucide-react";
import { memo, useState } from "react";
import { Panel } from "@/shared/ui/Panel/Panel.tsx";
import cls from "./CourtListAndDetails.module.scss";

interface SidebarProps {
	className?: string;
}

export const CourtListAndDetails = memo(({ className }: SidebarProps) => {
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
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
						<h1>тест тест</h1>
					</Panel>
				</div>
			)}
		</>
	);
});
