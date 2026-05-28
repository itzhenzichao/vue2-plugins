import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { resolve } from "node:path";

const srcAlias = {
  "@zhenzichao/vue2-svg-icon": resolve(__dirname, "../svg-icon/src/index.js"),
  "@zhenzichao/vue2-watermark-plugin": resolve(__dirname, "../watermark/src/index.js"),
  "@zhenzichao/vue2-infinite-scroll": resolve(__dirname, "../infinite-scroll/src/index.js"),
  "@zhenzichao/vue2-virtual-list": resolve(__dirname, "../virtual-list/src/index.js"),
  "@zhenzichao/vue2-toast": resolve(__dirname, "../toast/src/index.js")
};

export default defineConfig({
  base: '/vue2-plugins/',
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
      "@": resolve(__dirname, "src"),
      ...process.env.DEV_DIST ? {} : srcAlias
    }
  },
  server: {
    port: 5173
  }
});
