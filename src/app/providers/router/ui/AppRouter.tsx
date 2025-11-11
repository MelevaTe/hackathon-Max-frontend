import { Spinner } from "@maxhub/max-ui";
import React, { memo, Suspense, useCallback } from "react";
import { Routes } from "react-router";
import { Route } from "react-router-dom";
import { routeConfig } from "@/app/providers/router/config/routeConfig";
import { RequireMaxEnv } from "@/app/providers/router/ui/RequireMaxEnv.tsx";
import type { AppRoutesProps } from "@/shared/types/router";

const AppRouter = () => {
	const renderWithWrapper = useCallback((route: AppRoutesProps) => {
		const element = (
			<Suspense
				fallback={
					<Spinner
						appearance="themed"
						size={50}
					/>
				}
			>
				{route.element}
			</Suspense>
		);

		return (
			<Route
				key={route.path}
				path={route.path}
				element={<RequireMaxEnv>{element}</RequireMaxEnv>}
			/>
		);
	}, []);

	return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>;
};

export default memo(AppRouter);
