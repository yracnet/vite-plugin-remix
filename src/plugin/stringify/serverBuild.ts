import fs from "fs";
import path from "slash-path";
import { ResolvedConfig } from "vite";
import { SERVER_BUILD } from "../names";
import { PluginConfig } from "../types";
import { createManifest } from "./manifestInject";

const createServerBuildCode = (config: PluginConfig, vite: ResolvedConfig) => {
  const { routeConvention } = config;

  const importRoutes = routeConvention
    .map((it, ix) => `import * as route${ix} from "/${it.module}"`)
    .join(";\n");

  const routes = routeConvention
    .map((it, ix) => {
      return {
        id: it.id,
        parentId: it.parentId,
        path: it.path,
        module: `__route${ix}__`,
      };
    })
    .reduce((result: any, it: any) => {
      result[it.id] = it;
      return result;
    }, {});

  const buildBlock = {
    publicPath: "",
    entry: {
      module: "__server__",
    },
    routes,
    future: config.future,
    assets: createManifest(config, vite),
    assetsBuildDirectory: "",
  };
  const modulseServer = path.join(config.appDirectory, config.entryServer);
  return `
${importRoutes};
import * as server from "/${modulseServer}";

export const build = ${JSON.stringify(buildBlock, null, 2)};
`
    .replace(/("__(route[0-9]+)__")/gi, "$2")
    .replace(/"__server__"/gi, "server");
};

export const stringifyServerBuild = (config: PluginConfig, vite: ResolvedConfig) => {
  const serverBuildCode = createServerBuildCode(config, vite);
  const cacheFile = path.join(config.root, config.cacheDirectory, SERVER_BUILD);
  const dir = path.dirname(cacheFile);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(cacheFile, serverBuildCode, { encoding: "utf8", flag: "w" });
};
