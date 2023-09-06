export type PluginConfig = {
  name: string;
  root: string;
  appDirectory: string;
  cacheDirectory: string;
  future: FutureConfig;
  handler: string;
  entryRoot: string;
  entryClient: string;
  entryServer: string;
  watcherList: string[];
  routeConvention: RouteConvention;
};

export type UserConfig = Partial<Omit<PluginConfig,
  "root" |
  "handler" |
  "entryRoot" |
  "entryClient" |
  "entryServer" |
  "watcherList" |
  "routeConvention"
>>;

export interface FutureConfig {
  v2_dev: boolean;
  unstable_postcss: boolean;
  unstable_tailwind: boolean;
  v2_errorBoundary: boolean;
  v2_headers: boolean;
  v2_meta: boolean;
  v2_normalizeFormMethod: boolean;
  v2_routeConvention: boolean;
  [key: string]: boolean;
}

export interface ConfigRoute {
  path?: string;
  index?: boolean;
  caseSensitive?: boolean;
  id: string;
  parentId?: string;
  file: string;
  //---
  module: string;
  moduleDir: string;
  moduleFile: string;
  moduleCache: string;
  moduleCacheDir: string;
  moduleCacheFile: string;
  hasAction?: boolean;
  hasLoader?: boolean;
  hasCatchBoundary?: boolean;
  hasErrorBoundary?: boolean;
}

export interface RouteManifest {
  [routeId: string]: ConfigRoute;
}

export type RouteConvention = ConfigRoute[];
