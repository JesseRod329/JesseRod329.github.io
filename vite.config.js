import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        desktop: 'desktop.html',
        terminal: 'terminal.html',
        classic: 'classic.html',
        planner: 'planner/index.html',
        'fashion-palette': 'fashion-palette/index.html',
        ios: 'ios/index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
})
