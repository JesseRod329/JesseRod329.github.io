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
        }
      }
    }
  },
  plugins: []
};

export default config;
