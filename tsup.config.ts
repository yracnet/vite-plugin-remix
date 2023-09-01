import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: [
      "vite",
      "express",
      "@remix-run/react",
      "@remix-run/dev",
      "esbuild",
      "crypto",
      "slash-path",
      "fs",
    ],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
