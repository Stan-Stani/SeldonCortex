import reactHooks from "eslint-plugin-react-hooks"
import tsParser from "@typescript-eslint/parser"

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    ...reactHooks.configs["recommended-latest"]
  }
]
