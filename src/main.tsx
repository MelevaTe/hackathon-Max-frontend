import { StrictMode } from "react";
import App from "./app/App.tsx";
import "@/app/styles/index.scss";
import "./shared/config/i18n/i18n";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/app/providers/ErrorBoundary";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { MaxUI } from "@maxhub/max-ui";
import "@maxhub/max-ui/dist/styles.css";

const Root = () => (
	<BrowserRouter>
		<StrictMode>
			<ErrorBoundary>
				<ThemeProvider>
					<MaxUI>
						<App />
					</MaxUI>
				</ThemeProvider>
			</ErrorBoundary>
		</StrictMode>
	</BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<Root />);
