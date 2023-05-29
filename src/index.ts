//@ts-ignore
import { Plugin, ResolvedConfig } from "vite";
import { UserConfig, assertPluginHandler } from "./plugin/assertPluginHandler";
import { slashJoinAbsolute } from "./plugin/util";

export const remixPlugin = (userConfig: UserConfig = {}): Plugin => {
  const { resolveId, loadId, config } = assertPluginHandler(
    userConfig,
    __dirname
  );
  let viteConfig: ResolvedConfig;
  return {
    name: "plugin-remix",
    enforce: "pre",
    config: () => {
      return {
        appType: "custom",
      };
    },
    configResolved: async (config) => {
      viteConfig = config;
    },
    resolveId: (id) => {
      return resolveId[id];
    },
    load: (id) => {
      return loadId[id]?.({
        id,
        config,
        viteConfig,
      });
    },
    configureServer: async (devServer) => {
      devServer.ws.on("vite:invalidate", async (data) => {
        console.log("INVALID>>>: ", data);
        let module = devServer.moduleGraph.getModuleById(
          "@remix-vite/manifestInject.jsx"
        );
        if (module) {
          devServer.moduleGraph.invalidateModule(module);
          devServer.reloadModule(module);
        }
      });
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
