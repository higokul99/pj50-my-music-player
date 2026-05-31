import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('axios') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
