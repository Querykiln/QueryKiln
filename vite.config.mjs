import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  // When running `npm run dev`, Vite is in "serve" mode
  const isDev = command === "serve";

  return {
    plugins: [react()],

    // Fix file paths when loading the app through file:// in production
    base: "./",

    build: {
      outDir: "dist",
    },

    server: {
      port: 5173,
      strictPort: true,
    },

    // This exposes the dev server URL for Electron to read
    define: {
      // Electron will read this value in main.cjs
      VITE_DEV_SERVER_URL: isDev ? `"http://localhost:5173/"` : "undefined",
    },
  };
});
