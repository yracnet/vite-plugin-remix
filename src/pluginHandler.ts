import { ResolvedConfig } from "vite";
import { createManifestInjectSource } from "./plugin/createManifestSource";
import { createServerBuildSource } from "./plugin/createServerBuildSource";
import {
  createRuntimeSource,
  createPartialBuildRuntimeSource,
} from "./plugin/createRuntimeSource";
import { slashFindEntry } from "./plugin/util";

export interface FutureConfig {
  unstable_dev: boolean;
  unstable_postcss: boolean;
  unstable_tailwind: boolean;
  v2_errorBoundary: boolean;
  v2_meta: boolean;
  v2_normalizeFormMethod: boolean;
  v2_routeConvention: boolean;
}

export type PluginConfig = {
  handler: string;
  entryRoot: string;
  entryClient: string;
  entryServer: string;
  appDirectory: string;
  future: FutureConfig;
  dirname: string;
};

export type UserConfig = {
  appDirectory?: string;
  future?: Partial<FutureConfig>;
};

export type ConfigRoute = {
  id: string;
  parentId: string;
  path: string;
  file: string;
  module: string;
  index?: boolean;
  hasAction?: boolean;
  hasLoader?: boolean;
  caseSensitive?: boolean;
  hasCatchBoundary?: boolean;
  hasErrorBoundary?: boolean;
};

export type RouteMap = {
  [routeId: string]: ConfigRoute;
};

export type LoadContext = {
  id: string;
  config: PluginConfig;
  viteConfig: ResolvedConfig;
  routeMap: RouteMap;
};

export type LoadFunction = (context: LoadContext) => Promise<string> | string;

export type PluginHandler = {
  resolveId: {
    [key: string]: string;
  };
  loadId: {
    [key: string]: LoadFunction;
  };
  config: PluginConfig;
};

const defaultFuture: FutureConfig = {
  unstable_dev: false,
  unstable_postcss: false,
  unstable_tailwind: false,
  v2_errorBoundary: false,
  v2_meta: false,
  v2_normalizeFormMethod: false,
  v2_routeConvention: false,
};

export const assertPluginHandler = (
  userConfig: UserConfig,
  dirname: string
): PluginHandler => {
  const root = process.cwd();
  let { appDirectory = "src", future = {} } = userConfig;

  const config: PluginConfig = {
    handler: slashFindEntry(root, appDirectory, "handler"),
    entryRoot: slashFindEntry(root, appDirectory, "root"),
    entryClient: slashFindEntry(root, appDirectory, "entry.client"),
    entryServer: slashFindEntry(root, appDirectory, "entry.server"),
    appDirectory,
    future: Object.assign(defaultFuture, future),
    dirname,
  };
  return {
    resolveId: {
      "@remix-vite/root": config.entryRoot,
      "@remix-vite/handler": config.handler,
      "@remix-vite/entry-client": config.entryClient,
      "@remix-vite/entry-server": config.entryServer,
      "@remix-vite/serverBuild": "@remix-vite/serverBuild.jsx",
      "@remix-vite/manifestInject": "@remix-vite/manifestInject.jsx",
      "@remix-vite/ui": "@remix-vite/ui.jsx",
    },
    loadId: {
      "@remix-vite/serverBuild.jsx": createServerBuildSource,
      "@remix-vite/manifestInject.jsx": createManifestInjectSource,
      "@remix-vite/ui.jsx": createRuntimeSource,
      "@remix-vite:": createPartialBuildRuntimeSource,
    },
    config,
  };
};
