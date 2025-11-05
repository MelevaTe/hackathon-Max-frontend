import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import eslintComments from "eslint-plugin-eslint-comments";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { eslintBoundariesConfig } from "./eslint.boundaries.js";

export default [
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		ignores: [
			"node_modules/**",
			"public/**",
			"storybook-static/**",
			"build/**",
			"dist/**",
			"**/*.d.ts",
		],
	},
	// Конфиг для клиентского кода (React)
	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.app.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
			react: reactPlugin,
			"react-hooks": reactHooks,
			"jsx-a11y": jsxA11y,
			import: importPlugin,
			"eslint-comments": eslintComments,
			prettier: prettierPlugin,
		},
		settings: {
			react: {
				version: "detect",
			},
			"import/resolver": {
				typescript: {
					project: "./tsconfig.app.json",
					alwaysTryTypes: true,
				},
			},
		},
		rules: {
			"prettier/prettier": "error",
			...eslintConfigPrettier.rules,

			"@typescript-eslint/no-unused-vars": "error",
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/consistent-type-imports": "error",

			"react/prop-types": "off",
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off",

			"import/order": [
				"error",
				{
					groups: [["builtin", "external", "internal"]],
					pathGroups: [
						{
							pattern: "@/**",
							group: "internal",
							position: "after",
						},
					],
					"newlines-between": "never",
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
				},
			],

			quotes: "off",
			"@typescript-eslint/quotes": "off",
			semi: "off",
			indent: "off",
			"comma-dangle": "off",
			"object-curly-spacing": "off",
			"@typescript-eslint/object-curly-spacing": "off",
			"arrow-parens": "off",
			"jsx-quotes": "off",
		},
	},
	// Конфиг для Node.js файлов (Vite config)
	{
		files: ["vite.config.ts"],
		languageOptions: {
			globals: {
				...globals.node,
			},
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.node.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			"@typescript-eslint/no-var-requires": "off",
			"import/order": "off",
		},
	},
	eslintBoundariesConfig,
];
