import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default tseslint.config(
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [
      ...tseslint.configs.strictTypeChecked,
    ],
    plugins: {
      jsdoc,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "jsdoc/require-param": ["error", { checkDestructured: false }],
      "jsdoc/require-returns": "error",
      "jsdoc/check-param-names": "off",
    },
  },
  {
    ignores: ["dist/", "src/vocab.js"],
  },
);
