import { LoadFunction } from "./assertPluginHandler";
import { getMetafile } from "./getMetafile";
import { getRemixRouteList } from "./pages.ts";
import { slashJoinAbsolute } from "./util.ts";

export const createServerBuildSource: LoadFunction = (context) => {
  const {
    config,
    viteConfig: { base },
  } = context;

  const routeList = getRemixRouteList(context);

  const manifestRoutes = routeList.reduce((map: any, it) => {
    let exports = getMetafile("." + it.file);
    map[it.id] = {
      id: it.id,
      parentId: it.parentId,
      path: it.path,
      module: it.module,
      index: it.index,
      caseSensitive: it.caseSensitive,
      hasAction: !!exports.action,
      hasLoader: !!exports.loader,
      hasCatchBoundary: !!exports.catchBoundary,
      hasErrorBoundary: !!exports.errorBoundary,
    };
    return map;
  }, {});

  return `  

  export const FakeReload = ()=><div>Reload!</div>;


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
