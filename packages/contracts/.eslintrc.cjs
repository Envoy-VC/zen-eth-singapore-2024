const { resolve } = require("node:path");

const project = resolve(__dirname, "tsconfig.json");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [require.resolve("config/eslint/library.js")],
  parserOptions: { project },
  settings: {
    "import/resolver": { typescript: { project } },
  },
  rules: {
    "no-console": ["off"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: true },
    ],
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
    "@typescript-eslint/restrict-template-expressions": ["warn"],
    "import/order": [
      "off",
      {
        "newlines-between": "ignore",
        alphabetize: { order: "asc" },
      },
    ],
  },
  overrides: [
    {
      files: ["*.config.{mjs,ts,cjs,js,ts}"],
      rules: {
        "import/no-default-export": "off",
        "import/prefer-default-export": ["error", { target: "any" }],
      },
    },
    {
      files: ["**/*.d.ts", "ignition/**/*.ts"],
      rules: { "import/no-default-export": "off" },
    },
  ],
};
