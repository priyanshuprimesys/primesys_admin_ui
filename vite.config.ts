import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["pyodide"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.mykidtrackers.com/admin-service",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: true,
    strictPort: true,
    port: 8061,
    open: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      "primesystrack.com",
      "primesys-admin-ui-app-hkqtq.ondigitalocean.app"
    ]
  }
});
