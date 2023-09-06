//@ts-ignore
import { flatRoutes } from "@remix-run/dev/dist/config/flat-routes.js";
//@ts-ignore
import { defineConventionalRoutes } from "@remix-run/dev/dist/config/routesConvention.js";
import path from "slash-path";
import { ResolvedConfig } from "vite";
import { PluginConfig, RouteConvention } from "../types";
import { getMetadata } from "./metadata";

export const getRouteConvention = async (config: PluginConfig, vite: ResolvedConfig) => {
  const routesConvention = config.future.v2_routeConvention
    ? flatRoutes
    : defineConventionalRoutes;
  const remixPageRoutes = Object.values(routesConvention(config.appDirectory));
  const ROOT = {
    path: vite.base,
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
    route.moduleFile = path.join(config.root, route.module);
    route.moduleDir = path.dirname(route.moduleFile);

    route.moduleCache = path.join(config.cacheDirectory, route.file);
    route.moduleCacheFile = path.join(config.root, route.moduleCache);
    route.moduleCacheDir = path.dirname(route.moduleCacheFile);

    const exports = getMetadata(route.moduleFile);
    route.caseSensitive = !!exports.caseSensitive;
    route.hasAction = !!exports.action;
    route.hasLoader = !!exports.loader;
    route.hasCatchBoundary = !!exports.CatchBoundary;
    route.hasErrorBoundary = !!exports.ErrorBoundary;
    return route;
  });
  return result;
};
