import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5174
  },
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      input: resolve('./index.html')
    }
  }
})
