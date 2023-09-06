import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
//@ts-ignore
import remixPlugin from "./../src/index.ts";

export default defineConfig({
  base: "myapp",
  appType: "mpa",
  resolve: {
    alias: {
      "@apiClient": path.resolve("src/api/client"),
    },
  },
  plugins: [
    remixPlugin({
      appDirectory: "src",
      cacheDirectory: ".remix",
      future: {
        v2_dev: false,
        unstable_postcss: false,
        unstable_tailwind: false,
        v2_errorBoundary: false,
        v2_headers: false,
        v2_meta: true,
        v2_normalizeFormMethod: false,
        v2_routeConvention: false,
      },
    }),
    react(),
  ],
});
