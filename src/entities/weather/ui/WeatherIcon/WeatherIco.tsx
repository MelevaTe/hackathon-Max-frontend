import { Cloud } from "lucide-react";
import { iconMap } from "@/shared/lib/utils/iconMap.ts";

interface WeatherIconProps {
	iconCode: string;
	size?: number;
	className?: string;
}

export const WeatherIcon = (props: WeatherIconProps) => {
	const { iconCode, size = 24, className } = props;
	const IconComponent = iconMap[iconCode] || Cloud;

	return (
		<IconComponent
			size={size}
			className={className}
		/>
	);
};
