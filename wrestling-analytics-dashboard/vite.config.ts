import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wrestling-analytics-dashboard/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          d3: ['d3'],
          motion: ['framer-motion']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
