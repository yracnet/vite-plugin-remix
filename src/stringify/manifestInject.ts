import fs from "fs";
import { MANIFEST_INJECT } from "../names";
import path from "../slash-path";
import { ContextPlugin } from "../types";

export const createManifest = (context: ContextPlugin) => {
  const { config, routeConvention } = context;
  const routeManifest = routeConvention
    .map((it) => {
      return {
        id: it.id,
        parentId: it.parentId,
        path: it.path,
        module: path.join("/", config.base, config.cacheDirectory, it.file),
        index: it.index,
        caseSensitive: it.caseSensitive,
        hasAction: it.hasAction,
        hasLoader: it.hasLoader,
        hasCatchBoundary: it.hasCatchBoundary,
        hasErrorBoundary: it.hasErrorBoundary,
      };
    })
    .reduce((m, it) => {
      m[it.id] = it;
      return m;
    }, {});
  const modulseClient = path.join(config.appDirectory, config.entryClient);
  return {
    version: "0",
    url: path.join("/", config.base, config.cacheDirectory, MANIFEST_INJECT),
    entry: {
      module: path.join("/", config.base, modulseClient),
      imports: [],
    },
    routes: routeManifest,
  };
};

const createManifestCode = (context: ContextPlugin) => {
  const manifest = createManifest(context);
  return `window.__remixManifest = ${JSON.stringify(manifest, null, 2)};`;
};

export const stringifyManifestInject = async (context: ContextPlugin) => {
  const manifestCode = createManifestCode(context);
  const { config } = context;
  const cacheFile = path.join(
    config.root,
    config.cacheDirectory,
    MANIFEST_INJECT
  );
  const dir = path.dirname(cacheFile);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(cacheFile, manifestCode, { encoding: "utf8", flag: "w" });
};
