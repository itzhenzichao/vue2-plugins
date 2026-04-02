import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    createVuePlugin(),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "Vue2SvgIconPlugin",
      fileName: "vue2-svg-icon",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});

