export type PluginConfig = {
  name: string;
  root: string;
  base: string;
  appDirectory: string;
  cacheDirectory: string;
  future: FutureConfig;
  handler: string;
  entryRoot: string;
  entryClient: string;
  entryServer: string;
};

export type UserConfig = {
  name?: string;
  appDirectory?: string;
  future?: FutureConfig;
};

export interface FutureConfig {
  unstable_dev: boolean;
  unstable_postcss: boolean;
  unstable_tailwind: boolean;
  v2_errorBoundary: boolean;
  v2_meta: boolean;
  v2_normalizeFormMethod: boolean;
  v2_routeConvention: boolean;
}

export type ContextPlugin = {
  config: PluginConfig;
  routeConvention: RouteConvention;
};

export interface ConfigRoute {
  path?: string;
  index?: boolean;
  caseSensitive?: boolean;
  id: string;
  parentId?: string;
  file: string;
  //---
  module: string;
  moduleCache: string;
  hasAction?: boolean;
  hasLoader?: boolean;
  hasCatchBoundary?: boolean;
  hasErrorBoundary?: boolean;
}
export interface RouteManifest {
  [routeId: string]: ConfigRoute;
}
export type RouteConvention = ConfigRoute[];
