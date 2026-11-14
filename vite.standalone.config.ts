import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  build: {
    target: 'es2019',
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    lib: {
      entry: resolve('./src/standalone.ts'),
      formats: ['iife'],
      name: 'PixelUI',
      fileName: () => 'pixelsmith.js',
      cssFileName: 'pixelsmith'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? ''
          return name.endsWith('.css') ? 'pixelsmith.css' : 'fonts/[name][extname]'
        }
      }
    }
  }
})
