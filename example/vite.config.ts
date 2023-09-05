import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
//@ts-ignore
//import { remixPlugin } from "../plugin/src/index.ts";
import { remixPlugin } from "vite-plugin-remix";

export default defineConfig({
  base: "",
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
