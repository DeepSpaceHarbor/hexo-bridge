import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/bridge/",
  plugins: [react(), viteTsconfigPaths()],
  build: {
    assetsInlineLimit: 5000,
    chunkSizeWarningLimit: 1000000,
  },
  server: {
    open: true,
    port: 3000,
  },
});
