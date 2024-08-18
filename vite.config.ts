import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteTsconfigPaths()],
  base: "/slider/",
  build: { chunkSizeWarningLimit: 1000 },
  server: {
    open: true,
  },
});
