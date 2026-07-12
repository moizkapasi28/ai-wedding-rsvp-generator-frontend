import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ValidateEnv(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
