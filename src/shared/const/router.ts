export enum AppRoutes {
	MAIN = "main",
	PROFILE = "profile",
	// last
	NOT_FOUND = "not_found",
}

export const RoutePath: Record<AppRoutes, string> = {
	[AppRoutes.MAIN]: "/",
	[AppRoutes.PROFILE]: "/profile/", // + :id
	// последний
	[AppRoutes.NOT_FOUND]: "*",
};
