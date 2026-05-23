import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    createVuePlugin(),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Vue2InfiniteScrollPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => `infinite-scroll.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  }
});