import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mathjs': ['mathjs'],
          'chartjs': ['chart.js', 'vue-chartjs'],
          'mermaid': ['mermaid'],
          'ffmpeg': ['@ffmpeg/ffmpeg', '@ffmpeg/util']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    allowedHosts: [
      '53kgtdokag-3000.cnb.run',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 4175,
    allowedHosts: [
      '53kgtdokag-3000.cnb.run',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ]
  }
})
