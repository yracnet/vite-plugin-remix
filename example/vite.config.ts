import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { remixPlugin } from "./../src/index";

export default defineConfig({
  resolve: {
    alias: {
      "@apiClient": path.resolve("src/api/client"),
    },
  },
  plugins: [
    remixPlugin({
      appDirectory: "src",
      future: {
        unstable_dev: false,
        unstable_postcss: false,
        unstable_tailwind: false,
        v2_errorBoundary: false,
        v2_meta: true,
        v2_normalizeFormMethod: false,
        v2_routeConvention: false,
      },
    }),
    react(),
  ],
});
