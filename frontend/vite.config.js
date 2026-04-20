import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: "https://hospital-management-be4o.onrender.com/api",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
