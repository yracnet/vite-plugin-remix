import fs from "fs";
import path from "slash-path";
import { PluginOption } from "vite";
import { remixPluginImpl } from "./plugin/main";
import { PluginConfig, UserConfig } from "./plugin/types";

export const remixPlugin = (userConfig: UserConfig = {}): PluginOption => {
  const {
    name = "@remix-vite",
    appDirectory = "src",
    future = {
      unstable_dev: false,
      unstable_postcss: false,
      unstable_tailwind: false,
      v2_errorBoundary: false,
      v2_meta: true,
      v2_normalizeFormMethod: false,
      v2_routeConvention: false,
    },
  } = userConfig;
  const findEntry = (name: string) => {
    return (
      ["js", "jsx", "ts", "tsx"]
        .map((ext) => `${name}.${ext}`)
        .find((file) => {
          file = path.join(appDirectory, file);
          return fs.existsSync(file);
        }) || name
    );
  };
  const handler = findEntry("handler");
  const entryRoot = findEntry("root");
  const entryClient = findEntry("entry.client");
  const entryServer = findEntry("entry.server");
  const cacheDirectory = process.env.REMIX_CHACHE_DIR || "node_modules/.remix";
  const config: PluginConfig = {
    name,
    root: ".",
    base: "/",
    appDirectory,
    cacheDirectory: path.join(cacheDirectory, appDirectory),
    future,
    handler,
    entryRoot,
    entryClient,
    entryServer,
  };
  return remixPluginImpl(config);
};

export default remixPlugin;
