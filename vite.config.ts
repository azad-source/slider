import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import commonjs from "vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [commonjs(), viteTsconfigPaths()],
  base: "/slider/",
  build: { chunkSizeWarningLimit: 1000 },
  server: {
    open: true,
  },
});
