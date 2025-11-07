import { type CSSProperties, memo } from "react";

interface MapWrapperProps {
	className?: string;
	style?: CSSProperties;
}

export const MapWrapper = memo(
	({ className, style }: MapWrapperProps) => {
		return (
			<div
				id="map-container"
				className={className}
				style={{
					width: "100%",
					height: "100%",
					...style,
				}}
			/>
		);
	},
	() => true
);
