import { LoadContext } from "./assertPluginHandler";
import { getMetafile } from "./getMetafile.ts";
import { slashJoinAbsolute, slashJoinName } from "./util.ts";

import { flatRoutes } from "@remix-run/dev/dist/config/flat-routes.js";
import { defineConventionalRoutes } from "@remix-run/dev/dist/config/routesConvention.js";

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

export const getRemixRouteList = (
  context: LoadContext,
  name?: string
): ConfigRoute[] => {
  const {
    config,
    viteConfig: { base },
  } = context;
  const routesConvention = config.future.v2_routeConvention
    ? flatRoutes
    : defineConventionalRoutes;

  const conventionalRoutes = routesConvention(config.appDirectory);

  const ROOT: ConfigRoute = {
    id: "root",
    parentId: "",
    path: slashJoinName(base),
    file: config.entryRoot,
    module: slashJoinAbsolute(base, config.entryRoot),
    index: false,
    caseSensitive: undefined,
  };

  let routeList: ConfigRoute[] = Object.values(conventionalRoutes).map(
    (it: any) => {
      return {
        id: it.id,
        parentId: it.parentId,
        path: it.path || "",
        file: slashJoinAbsolute(config.appDirectory, it.file),
        module: slashJoinAbsolute(base, config.appDirectory, it.file),
        index: it.index,
        caseSensitive: it.caseSensitive,
      };
    }
  );
  routeList = [ROOT, ...routeList].map((it) => {
    let exports = getMetafile("." + it.file);
    it.caseSensitive = !!exports.caseSensitive;
    it.hasAction = !!exports.action;
    it.hasLoader = !!exports.loader;
    it.hasCatchBoundary = !!exports.CatchBoundary;
    it.hasErrorBoundary = !!exports.ErrorBoundary;
    return it;
  });
  console.log("getRemixRouteList:", name);
  return routeList;
};
