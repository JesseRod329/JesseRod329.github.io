/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        victory: '#10b981',
        defeat: '#ef4444',
        championship: '#f59e0b',
      }
    },
  },
  plugins: [],
}
