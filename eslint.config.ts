import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  pluginRouter.configs["flat/recommended"],
  reactHooks.configs.flat.recommended,
  eslintConfigPrettier,
  perfectionist.configs["recommended-natural"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  globalIgnores([
    "!node_modules/", // unignore `node_modules/` directory
    "node_modules/*", // ignore its content
    "!node_modules/mylibrary/", // unignore `node_modules/mylibrary` directory
    "routeTree.gen.ts", // ignore generated route tree
    "dist/", // ignore build output
    ".tanstack", // ignore tanstack internal files
    ".vscode", // ignore vscode settings
  ]),
]);
