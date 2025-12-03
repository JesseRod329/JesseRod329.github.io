import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/creator-tools-hub/',
  server: {
    port: 5174,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})

