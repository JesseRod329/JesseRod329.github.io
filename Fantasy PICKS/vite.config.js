import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      // Don't try to bundle scripts in public folder
      input: {
        main: './index.html'
      }
    }
  },
  // Public files are served as-is
  publicDir: 'public'
})
