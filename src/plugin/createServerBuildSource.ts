import { LoadFunction } from "./processPluginHandler.ts";
import { slashJoinAbsolute } from "./util.ts";

export const createServerBuildSource: LoadFunction = (context) => {
  const {
    config,
    viteConfig: { base },
  } = context;

  const routeList = Object.values(context.routeMap);
  const manifestRoutes = routeList.reduce((map: any, it) => {
    map[it.id] = {
      id: it.id,
      parentId: it.parentId,
      path: it.path,
      module: it.module,
      index: it.index,
      caseSensitive: it.caseSensitive,
      hasAction: it.hasAction,
      hasLoader: it.hasLoader,
      hasCatchBoundary: it.hasCatchBoundary,
      hasErrorBoundary: it.hasErrorBoundary,
    };
    return map;
  }, {});
  console.log("Reload ServerBuild");
  return `  
${routeList
  .map((it, ix) => `import * as route${ix} from "${it.file}"`)
  .join(";\n")}
import * as server from "${config.entryServer}";

const manifestRoutes = ${JSON.stringify(manifestRoutes, null, 2)};

const buildManifest = {
  entry: {
    module: "${slashJoinAbsolute(base, config.entryClient)}",
    imports: [],
  },
  routes: manifestRoutes,
  version: "0",
  url: "${slashJoinAbsolute(base, "/@id/@remix-vite/manifestInject")}",
};

const buildRoutes = {
  ${routeList
    .map(
      (it, ix) => `"${it.id}": {
    id: "${it.id}",
    parentId: "${it.parentId}",
    path: "${it.path}",
    module: route${ix},
  }`
    )
    .join(",\n  ")}  
};

const buildFuture = ${JSON.stringify(config.future, null, 2)};

const buildEntry = {
  module: server,
};

export const build = {
  entry: buildEntry,
  assets: buildManifest,
  routes: buildRoutes,
  future: buildFuture,
  assetsBuildDirectory: "",
  publicPath: "",
};
  
`;
};
