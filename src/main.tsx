import { StrictMode } from "react";
import App from "./app/App.tsx";
import "@/app/styles/index.scss";
import "./shared/config/i18n/i18n";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
	<BrowserRouter>
		<StrictMode>
			<App />
		</StrictMode>
	</BrowserRouter>
);
