import { CourtType } from "@/entities/Court";
import type { SelectOption } from "@/shared/ui/Select/Select.tsx";

export const sportOptions: SelectOption[] = [
	{ id: CourtType.FOOTBALL, name: "Футбол" },
	{ id: CourtType.BASKETBALL, name: "Баскетбол" },
	{ id: CourtType.TENNIS, name: "Теннис" },
	{ id: CourtType.VOLLEYBALL, name: "Волейбол" },
];
