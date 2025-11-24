import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: { port: 5173, open: true },
  build: {
    sourcemap: false,
    target: "es2020"
  },
  resolve: {
    alias: {
      "@scenes": path.resolve(__dirname, "./src/scenes"),
      "@systems": path.resolve(__dirname, "./src/systems"),
      "@assets": path.resolve(__dirname, "./src/assets")
    }
  }
});

