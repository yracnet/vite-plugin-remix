import fs from "fs";
import { PluginOption } from "vite";
import { LIVE_RELOAD, SERVER_BUILD } from "./names";
import { getRouteConvention } from "./remix/routes";
import path from "./slash-path";
import { stringifyLiveReload } from "./stringify/liveReload";
import { stringifyManifestInject } from "./stringify/manifestInject";
import { stringifyPageFile, stringifyPagesFiles } from "./stringify/pages";
import { stringifyServerBuild } from "./stringify/serverBuild";
import { PluginConfig, RouteConvention, UserConfig } from "./types";

const remixPluginImpl = (config: PluginConfig): PluginOption => {
  let routeConvention: RouteConvention = [];
  return {
    name: "vite-plugin-remix",
    enforce: "pre",
    config: () => {
      return {
        appType: "custom",
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
      return async () => {
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

export const remixPlugin = (userConfig: UserConfig = {}): PluginOption => {
  const {
    name = "@remix-vite",
    appDirectory = "src",
    future = {
      unstable_dev: false,
      unstable_postcss: false,
      unstable_tailwind: false,
      v2_errorBoundary: false,
      v2_meta: true,
      v2_normalizeFormMethod: false,
      v2_routeConvention: false,
    },
  } = userConfig;
  const findEntry = (name: string) => {
    return (
      ["js", "jsx", "ts", "tsx"]
        .map((ext) => `${name}.${ext}`)
        .find((file) => {
          file = path.join(appDirectory, file);
          return fs.existsSync(file);
        }) || name
    );
  };
  const handler = findEntry("handler");
  const entryRoot = findEntry("root");
  const entryClient = findEntry("entry.client");
  const entryServer = findEntry("entry.server");
  const cacheDirectory = process.env.REMIX_CHACHE_DIR || ".remix";
  const config: PluginConfig = {
    name,
    root: ".",
    base: "/",
    appDirectory,
    cacheDirectory: path.join(cacheDirectory, appDirectory),
    future,
    handler,
    entryRoot,
    entryClient,
    entryServer,
  };
  return remixPluginImpl(config);
};

export default remixPlugin;
