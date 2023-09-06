import fs from "fs";
import path from "slash-path";
import { ResolvedConfig } from "vite";
import { MANIFEST_INJECT } from "../names";
import { PluginConfig } from "../types";

export const createManifest = (config: PluginConfig, vite: ResolvedConfig) => {
  const { routeConvention } = config;
  const routeManifest = routeConvention
    .map((it) => {
      return {
        id: it.id,
        parentId: it.parentId,
        path: it.path,
        module: path.join("/", vite.base, config.cacheDirectory, it.file),
        index: it.index,
        caseSensitive: it.caseSensitive,
        hasAction: it.hasAction,
        hasLoader: it.hasLoader,
        hasCatchBoundary: it.hasCatchBoundary,
        hasErrorBoundary: it.hasErrorBoundary,
      };
    })
    .reduce((m: any, it) => {
      m[it.id] = it;
      return m;
    }, {});
  const modulseClient = path.join(config.appDirectory, config.entryClient);
  return {
    version: "0",
    url: path.join("/", vite.base, config.cacheDirectory, MANIFEST_INJECT),
    entry: {
      module: path.join("/", vite.base, modulseClient),
      imports: [],
    },
    routes: routeManifest,
  };
};

const createManifestCode = (config: PluginConfig, vite: ResolvedConfig) => {
  const manifest = createManifest(config, vite);
  return `window.__remixManifest = ${JSON.stringify(manifest, null, 2)};`;
};

export const stringifyManifestInject = async (config: PluginConfig, vite: ResolvedConfig) => {
  const manifestCode = createManifestCode(config, vite);
  const cacheFile = path.join(config.cacheDirectory, MANIFEST_INJECT);
  fs.writeFileSync(cacheFile, manifestCode, { encoding: "utf8", flag: "w" });
};
