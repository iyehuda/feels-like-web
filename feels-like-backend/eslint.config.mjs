import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.all,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        // @ts-expect-error import.meta
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "eslint-disable-next-line max-statements-per-line": "off",
      "eslint-disable-next-line max-lines-per-function": "off",
      "eslint-disable-next-line max-lines": "off",
      "eslint-disable-next-line max-params": "off",
      "eslint-disable-next-line max-statements": "off",
      "eslint-disable-next-line no-use-before-defined": "off",
      "eslint-disable-next-line @typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "new-cap": "off",
      "no-console": "off",
      "no-invalid-this": "off",
      "no-magic-numbers": ["error", { ignore: [1, 200, 201, 204, 400, 401, 404, 409, 500] }],
      "no-negated-condition": "off",
      "one-var": ["error", "never"],
      "sort-imports": "off",
      "no-underscore-dangle": "off",
      "no-ternary": "off",
    },
  },
  {
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "init-declarations": "off",
      "max-lines-per-function": ["error", { max: 100 }],
      "no-magic-numbers": "off",
    },
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**", "eslint.config.mjs"],
  },
);
