//@ts-ignore
import { Plugin, ResolvedConfig } from "vite";
import { UserConfig, assertPluginHandler } from "./plugin/assertPluginHandler";

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
      // TODO: Reload ManifestInject  when change routes directory
      // PREVENT ERROR on the client!
      // devServer.watcher.on("all", (event, path) => {
      //   let module = devServer.moduleGraph.getModuleById(
      //     "@remix-vite/manifestInject.jsx"
      //   );
      //   if (module) {
      //     devServer.moduleGraph.invalidateModule(module);
      //     devServer.reloadModule(module);
      //   }
      // });
      // devServer.ws.on("vite:invalidate", async (data) => {
      //   let module = devServer.moduleGraph.getModuleById(
      //     "@remix-vite/manifestInject.jsx"
      //   );
      //   if (module) {
      //     devServer.moduleGraph.invalidateModule(module);
      //     devServer.reloadModule(module);
      //   }
      // });
      return async () => {
        devServer.middlewares.use(async (req, res, next) => {
          // console.log("USE>>>", req.url);
          // writeSourceCode("../temp.json", devServer.moduleGraph);
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
