import { LoadContext, LoadFunction } from "./assertPluginHandler.ts";
import { getMetafile } from "./getMetafile.ts";
import { getRemixRouteList } from "./pages.ts";
import { slashJoinAbsolute } from "./util.ts";

const getManifestRoutes = (context: LoadContext) => {
  const routeList = getRemixRouteList(context, "ManifestInject").map((it) => {
    let exports = getMetafile("." + it.file);
    return {
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
  });
  let routes = routeList.reduce((map: any, it) => {
    map[it.id] = it;
    return map;
  }, {});
  return routes;
};

export const createManifestJson: LoadFunction = (context) => {
  const {
    config,
    viteConfig: { base },
  } = context;
  const manifestRoutes = getManifestRoutes(context);
  const manifest = {
    entry: {
      module: slashJoinAbsolute(base, config.entryClient),
      imports: [],
    },
    routes: manifestRoutes,
    version: "0",
    url: slashJoinAbsolute(base, "/@id/@remix-vite/manifestInject"),
  };
  return JSON.stringify(manifest, null, 2);
};

export const createManifestInjectSource: LoadFunction = (context) => {
  const manifest = createManifestJson(context);
  console.log("Reload ManifestInject");
  return `

  export const FakeReload = ()=><div>Reload!</div>;

  window.__remixManifest = ${manifest};
  `;
};
