import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [svgr(), react(), tsconfigPaths()],
	build: {
		sourcemap: true,
	},
	resolve: {
		alias: [{ find: "@", replacement: "/src" }],
	},
	define: {
		__API__: JSON.stringify("http://10.134.113.92:8072"),
	},
});
