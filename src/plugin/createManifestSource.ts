import { LoadContext, LoadFunction } from "../pluginHandler.ts";
import { slashJoinAbsolute } from "./util.ts";

const createManifestJson = (context: LoadContext) => {
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
  let appIndex = manifestRoutes["routes/app/index"];
  console.log(">>>", appIndex);

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

export const createManifestInjectSource: LoadFunction = async (context) => {
  const manifest = createManifestJson(context);
  console.log("Reload ManifestInject");
  return `

  export const FakeReload = ()=><div>Reload!</div>;

  window.__remixManifest = ${manifest};
  `;
};
