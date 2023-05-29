import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { remixPlugin } from "../src/index";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "@remix-run/react"],
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
