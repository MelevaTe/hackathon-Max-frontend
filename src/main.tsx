import { StrictMode } from "react";
import App from "./app/App.tsx";
import "@/app/styles/index.scss";
import "./shared/config/i18n/i18n";
import { MaxUI } from "@maxhub/max-ui";
import "@maxhub/max-ui/dist/styles.css";
import { ConfigProvider, theme } from "antd";
import type { ThemeConfig } from "antd";
import ruRU from "antd/locale/ru_RU";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/app/providers/ErrorBoundary";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

const { darkAlgorithm } = theme;

const antdDarkTheme: ThemeConfig = {
	algorithm: darkAlgorithm,
};

const Root = () => (
	<BrowserRouter>
		<StrictMode>
			<StoreProvider>
				<ErrorBoundary>
					<ThemeProvider>
						<ConfigProvider
							theme={antdDarkTheme}
							locale={ruRU}
						>
							<MaxUI>
								<App />
							</MaxUI>
						</ConfigProvider>
					</ThemeProvider>
				</ErrorBoundary>
			</StoreProvider>
		</StrictMode>
	</BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<Root />);
