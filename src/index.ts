//@ts-ignore
import { Plugin, ResolvedConfig } from "vite";
import {
  RouteMap,
  UserConfig,
  processPluginHandler,
} from "./plugin/processPluginHandler";
import { getRouteMap } from "./plugin/processPages";

export const remixPlugin = (userConfig: UserConfig = {}): Plugin => {
  const { resolveId, loadId, config } = processPluginHandler(
    userConfig,
    __dirname
  );
  let viteConfig: ResolvedConfig;
  let routeMap: RouteMap = {};
  return {
    name: "plugin-remix",
    enforce: "pre",
    config: () => {
      return {
        appType: "custom",
      };
    },
    configResolved: async (_config) => {
      viteConfig = _config;
      routeMap = getRouteMap(
        {
          id: "all",
          config,
          viteConfig,
          routeMap: routeMap,
        },
        "Init Project"
      );
    },
    handleHotUpdate: (data) => {
      const { file } = data;
      routeMap = getRouteMap(
        {
          id: file,
          config,
          viteConfig,
          routeMap: routeMap,
        },
        "Change Files"
      );
    },
    resolveId: (id) => {
      if (id.startsWith("@remix-vite:")) {
        const [, routeId] = id.split(":");
        let route = routeMap[routeId];
        return "@remix-vite:" + route.file;
      }
      return resolveId[id];
    },
    load: (id) => {
      if (id.startsWith("@remix-vite:")) {
        return loadId["@remix-vite:"]?.({
          id,
          config,
          viteConfig,
          routeMap: routeMap,
        });
      }
      return loadId[id]?.({
        id,
        config,
        viteConfig,
        routeMap: routeMap,
      });
    },
    configureServer: async (devServer) => {
      return async () => {
        devServer.middlewares.use(async (req, res, next) => {
          try {
            const module = await devServer.ssrLoadModule(config.handler);
            module.handler(req, res, next);
          } catch (error) {
            next(error);
          }
        });
      };
    },
  };
};
