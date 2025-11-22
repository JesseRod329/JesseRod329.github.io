/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.html", "./*.js", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'text-red-500',
    'text-green-500',
    'text-yellow-500'
  ]
}

