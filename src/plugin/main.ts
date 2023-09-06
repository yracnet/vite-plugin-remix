import path from "slash-path";
import { PluginOption, ResolvedConfig } from "vite";
import { LIVE_RELOAD, SERVER_BUILD } from "./names";
import { getRouteConvention } from "./remix/routes";
import { generateChange, generateStart } from "./stringify";
import { PluginConfig } from "./types";

export const remixPluginImpl = (config: PluginConfig): PluginOption => {
  // @ts-ignore
  let vite: ResolvedConfig = {};
  const isReload = (file: string) => {
    file = path.slash(file);
    return config.watcherList.find((it) => file.startsWith(it));
  };

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
      vite = viteConfig;
      config.routeConvention = await getRouteConvention(config, vite);
      await generateStart(config, vite);
    },
    configureServer: async (devServer) => {
      const onReload = async (file: string) => {
        if (isReload(file)) {
          config.routeConvention = await getRouteConvention(config, vite);
          const realFile = path.relative(config.appDirectory, file);
          await generateChange(realFile, config, vite);
        }
      }
      devServer.watcher.on("add", onReload);
      devServer.watcher.on("change", onReload);
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
      if (isReload(file)) {
        config.routeConvention = await getRouteConvention(config, vite);
        const realFile = path.relative(config.appDirectory, file);
        await generateChange(realFile, config, vite);
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
