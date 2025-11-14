/// <reference types="@2gis/mapgl/global" />

export {};

declare global {
	const mapgl: typeof import("@2gis/mapgl/types/index");
}
