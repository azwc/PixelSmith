import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2019',
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    lib: {
      entry: resolve('./src/vue/umd.ts'),
      formats: ['umd'],
      name: 'PixelSmithVue',
      fileName: () => 'pixelsmith-vue.js',
      cssFileName: 'pixelsmith'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? ''
          return name.endsWith('.css') ? 'pixelsmith.css' : 'fonts/[name][extname]'
        }
      }
    }
  }
})
