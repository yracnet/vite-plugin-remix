//@ts-ignore
import { flatRoutes } from "@remix-run/dev/dist/config/flat-routes.js";
//@ts-ignore
import { defineConventionalRoutes } from "@remix-run/dev/dist/config/routesConvention.js";
import path from "../slash-path";
import { PluginConfig, RouteConvention } from "../types";
import { getMetadata } from "./metadata";

export const getRouteConvention = async (config: PluginConfig) => {
  const routesConvention = config.future.v2_routeConvention
    ? flatRoutes
    : defineConventionalRoutes;
  const remixPageRoutes = Object.values(routesConvention(config.appDirectory));
  const ROOT = {
    path: config.base,
    index: false,
    caseSensitive: true,
    id: "root",
    parentId: "",
    file: config.entryRoot,
  };
  // moduleCache
  const remixAllRoutes = [ROOT, ...remixPageRoutes];
  const result: RouteConvention = remixAllRoutes.map((route: any) => {
    route.path = route.path || "";
    route.file = path.normalize(route.file);
    route.module = path.join(config.appDirectory, route.file);
    route.moduleCache = path.join(config.cacheDirectory, route.file);
    const filePath = path.join(config.root, route.module);
    const exports = getMetadata(filePath);
    route.caseSensitive = !!exports.caseSensitive;
    route.hasAction = !!exports.action;
    route.hasLoader = !!exports.loader;
    route.hasCatchBoundary = !!exports.CatchBoundary;
    route.hasErrorBoundary = !!exports.ErrorBoundary;
    return route;
  });
  return result;
};
