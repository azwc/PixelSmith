import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2020',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    lib: {
      entry: {
        index: resolve('./src/index.ts'),
        vue: resolve('./src/vue/index.ts')
      },
      formats: ['es'],
      cssFileName: 'pixelsmith'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? ''
          return name.endsWith('.css') ? 'pixelsmith.css' : 'fonts/[name][extname]'
        }
      }
    }
  }
})
