module.exports = {
  root: true,

  env: {
    node: true,
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaVersion: 2020,
  },

  extends: [
    "plugin:vue/base",
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-essential",
    "@logux/eslint-config/ts"
  ],

  rules: {
    semi: ["error", "never"],
    quotes: ["error", "double"],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/mustache-interpolation-spacing": ["error", "never"],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "quote-props": ["error", "as-needed"],
    "object-curly-spacing": ["error", "never"],
    "import/extensions": ["error", "never", {svg: "always", vue: "always"}],
    "import/no-cycle": ["error", {maxDepth: "∞"}]
  },

  settings: {
    "import/extensions": [".js", ".ts", ".vue"],
    "import/parsers": {
      "@typescript-eslint/parser": [".js", ".ts", ".vue"]
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"]
      },
    }
  }
}
