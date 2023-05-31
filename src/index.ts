//@ts-ignore
import { Plugin, ResolvedConfig } from "vite";
import { RouteMap, UserConfig, assertPluginHandler } from "./pluginHandler";
import { getRouteMap } from "./plugin/processPages";

export const remixPlugin = (userConfig: UserConfig = {}): Plugin => {
  const { resolveId, loadId, config } = assertPluginHandler(
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
      console.log("configResolved:", Object.keys(routeMap));
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
      console.log("handleHotUpdate:", Object.keys(routeMap));
    },
    resolveId: (id) => {
      if (id.startsWith("@remix-vite:")) {
        const [_, routeId] = id.split(":");
        const route = routeMap[routeId];
        //return "@remix-vite:" + route.file;
        return route.file;
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
