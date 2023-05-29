import { defineConfig } from "tsup";
import fse from "fs-extra";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: [
      "vite",
      "express",
      "@remix-run/react",
      "esbuild",
      "crypto",
      "fs",
      "fast-glob",
    ],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
    onSuccess: async () => {
      await fse.copy("src/runtime", "dist/runtime");
    },
  },
]);
