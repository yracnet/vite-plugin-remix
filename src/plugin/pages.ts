import { LoadContext } from "./assertPluginHandler";
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
  caseSensitive?: boolean;
};

export const getRemixRouteList = (context: LoadContext): ConfigRoute[] => {
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

  const routeList: ConfigRoute[] = Object.values(conventionalRoutes).map(
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
  return [ROOT, ...routeList];
};
