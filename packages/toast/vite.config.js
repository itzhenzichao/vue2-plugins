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
      name: 'Vue2ToastPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => `toast.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named'
      }
    }
  }
});