import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf5ff",
          100: "#cce0ff",
          500: "#2563eb",
          700: "#1d4ed8"
        },
        'cyber-cyan': '#00f3ff',
        'cyber-pink': '#ff00ff',
        'cyber-black': '#0a0a14',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    }
  },
  plugins: []
};

export default config;
