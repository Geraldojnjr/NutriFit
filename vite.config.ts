import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8083',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://backend:8083',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
