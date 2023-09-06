import fs from "fs";
import path from "slash-path";
import { PluginOption } from "vite";
import { remixPluginImpl } from "./plugin/main";
import { PluginConfig, RouteConvention, UserConfig } from "./plugin/types";

export const remixPlugin = (userConfig: UserConfig = {}): PluginOption => {
  let {
    appDirectory = "src",
    cacheDirectory = "node_modules/.remix"
  } = userConfig;
  const {
    name = "@remix-vite",
    future = {
      v2_dev: false,
      unstable_postcss: false,
      unstable_tailwind: false,
      v2_errorBoundary: false,
      v2_headers: false,
      v2_meta: true,
      v2_normalizeFormMethod: false,
      v2_routeConvention: false,
    }
  } = userConfig;
  const root = process.cwd();

  cacheDirectory = path.join(cacheDirectory, appDirectory);
  appDirectory = path.join(appDirectory);


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

  const watcherList = [
    path.join(root, appDirectory, handler),
    path.join(root, appDirectory, entryRoot),
    path.join(root, appDirectory, entryClient),
    path.join(root, appDirectory, entryServer),
    path.join(root, appDirectory, "routes/")
  ]
  const routeConvention: RouteConvention = [];

  const config: PluginConfig = {
    name,
    root,
    appDirectory,
    cacheDirectory,
    future,
    handler,
    entryRoot,
    entryClient,
    entryServer,
    watcherList,
    routeConvention,
  };
  return remixPluginImpl(config);
};

export default remixPlugin;
