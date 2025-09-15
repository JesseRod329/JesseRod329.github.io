import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sandbox-portfolio-built/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

