import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://18.218.50.201',
        changeOrigin: true,
      },
      '/_': {
        target: 'http://18.218.50.201',
        changeOrigin: true,
      }
    }
  }
})
