import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'date-fns': ['date-fns'],
          'mui': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers', '@mui/x-data-grid'],
          'axios': ['axios']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['date-fns', 'axios']
  }
})
