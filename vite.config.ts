import path from "path"
import {defineConfig} from "vite"
import vue from "@vitejs/plugin-vue"
import {babel} from "@rollup/plugin-babel"

export default defineConfig({
  plugins: [
    vue(),
    babel({
      babelrc: true,
      include: ["./src/**"],
      extensions: [".js", ".ts", ".mjs", ".html"],
      babelHelpers: "bundled",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
