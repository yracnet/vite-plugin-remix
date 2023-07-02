import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
//@ts-ignore
import { remixPlugin } from "../src/index";

const resolve = (name: string) => {
  return process.cwd() + "/" + name;
};

export default defineConfig({
  resolve: {
    alias: {
      "@apiClient": resolve("src/api/client"),
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
