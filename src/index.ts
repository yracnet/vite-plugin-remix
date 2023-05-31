//@ts-ignore
import { Plugin, ResolvedConfig } from "vite";
import { RouteMap, UserConfig, processConfigPlugin } from "./pluginHandler";
import { getRouteMap } from "./plugin/remixPages";
import { assertModuleId, slashRelativeAbsolute } from "./plugin/util";
import fs from "fs";

export const remixPlugin = (userConfig: UserConfig = {}): Plugin => {
  const { resolveId, loadId, config } = processConfigPlugin(
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
    handleHotUpdate: async (data) => {
      let { server, file, timestamp } = data;
      routeMap = getRouteMap(
        {
          id: file,
          config,
          viteConfig,
          routeMap,
        },
        "Change Files"
      );
      file = slashRelativeAbsolute(viteConfig.root, file);
      let route = Object.values(routeMap).find((it) => it.file === file);
      if (route) {
        server.moduleGraph.invalidateAll();
        server.ws.send({
          type: "update",
          updates: [
            {
              acceptedPath: route.module,
              path: route.module,
              timestamp: timestamp,
              explicitImportRequired: true,
              type: "js-update",
            },
            {
              acceptedPath: "/@id/@remix-vite/manifestInject.jsx",
              path: "/@id/@remix-vite/manifestInject.jsx",
              timestamp: timestamp,
              explicitImportRequired: true,
              type: "js-update",
            },
          ],
        });
        return [];
      }
    },
    resolveId: (id) => {
      if (id.startsWith("@remix-vite:")) {
        return id;
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
