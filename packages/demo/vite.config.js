import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    createVuePlugin(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, "src/assets/icons")],
      symbolId: "icon-[name]",
      svgoOptions: {
        plugins: [
          {
            name: "removeAttrs",
            params: {
              attrs: ["fill", "stroke", "color", "width", "height", "style", "fill-opacity"]
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@zhenzichao/vue2-svg-icon": resolve(__dirname, "../svg-icon/src/index.js")
    }
  },
  server: {
    port: 5173
  }
});
