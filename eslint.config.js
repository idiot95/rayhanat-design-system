import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import brandCaps, { groups } from "./eslint/brand-caps.js";

export default tseslint.config(
  { ignores: ["**/dist/**", "public/r/**", "node_modules/**", "test-results/**", "playwright-report/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      // Mock screens use href="#" for links that would route in a real app.
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
  { files: ["registry/**/*.{ts,tsx}", "apps/**/*.{ts,tsx,js,jsx}"], ...brandCaps[0] },
  ...brandCaps.slice(1),
  {
    // The showcase's token table documents the hex values; it is the one page allowed to print them.
    files: ["apps/showcase/src/App.tsx"],
    rules: {
      "no-restricted-syntax": ["error", ...groups.flowerRules, ...groups.displayFontRules, ...groups.moduleHueRules, ...groups.flowerAlterRules],
    },
  }
);
