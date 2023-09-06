import path from "slash-path";
import { PluginOption } from "vite";
import { LIVE_RELOAD, SERVER_BUILD } from "./names";
import { getRouteConvention } from "./remix/routes";
import { stringifyLiveReload } from "./stringify/liveReload";
import { stringifyManifestInject } from "./stringify/manifestInject";
import { stringifyPageFile, stringifyPagesFiles } from "./stringify/pages";
import { stringifyServerBuild } from "./stringify/serverBuild";
import { PluginConfig, RouteConvention } from "./types";

export const remixPluginImpl = (config: PluginConfig): PluginOption => {
  let routeConvention: RouteConvention = [];

  return {
    name: "vite-plugin-remix",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [`${config.name}/serverBuild`]: path.resolve(
              config.cacheDirectory,
              SERVER_BUILD
            ),
            [`${config.name}/ui`]: path.resolve(
              config.cacheDirectory,
              LIVE_RELOAD
            ),
          },
        },
      };
    },
    configResolved: async (viteConfig) => {
      config.root = viteConfig.root;
      config.base = viteConfig.base;
      routeConvention = await getRouteConvention(config);
      await stringifyLiveReload({ config, routeConvention });
      await stringifyPagesFiles({ config, routeConvention });
      await stringifyServerBuild({ config, routeConvention });
      await stringifyManifestInject({ config, routeConvention });
    },
    configureServer: async (devServer) => {
      const appPath = path.join(config.root, config.appDirectory);
      devServer.watcher.on("add", async (file) => {
        const realFile = path.relative(appPath, file);
        if (realFile.startsWith("routes")) {
          routeConvention = await getRouteConvention(config);
          await stringifyPageFile(realFile, {
            config,
            routeConvention,
          });
          await stringifyServerBuild({ config, routeConvention });
          await stringifyManifestInject({ config, routeConvention });
        }
      });
      return () => {
        devServer.middlewares.use(async (req, res, next) => {
          try {
            const handler = path.join(config.appDirectory, config.handler);
            const module = await devServer.ssrLoadModule(handler);
            module.handler(req, res, next);
          } catch (error) {
            next(error);
          }
        });
      };
    },
    handleHotUpdate: async (data) => {
      const { file, server, timestamp } = data;
      const realFile = path.relative(config.appDirectory, file);
      const pageChange = await stringifyPageFile(realFile, {
        config,
        routeConvention,
      });
      if (pageChange) {
        server.ws.send({
          type: "update",
          updates: [
            {
              type: "js-update",
              path: file,
              acceptedPath: file,
              timestamp,
            },
          ],
        });
        return [];
      }
    },
  };
};
