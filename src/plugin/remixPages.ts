import fg from "fast-glob";
import { ConfigRoute, LoadContext, RouteMap } from "../pluginHandler.ts";
import { getMetafile } from "./getMetafile.ts";
import {
  assertIdFile,
  slashJoin,
  slashJoinAbsolute,
  slashJoinName,
} from "./util.ts";

//@ts-ignore
import { flatRoutes } from "@remix-run/dev/dist/config/flat-routes.js";
//@ts-ignore
import { defineConventionalRoutes } from "@remix-run/dev/dist/config/routesConvention.js";

const getRouteList = (context: LoadContext, name: string): ConfigRoute[] => {
  const {
    config,
    viteConfig: { base },
  } = context;
  const routesConvention = config.future.v2_routeConvention
    ? flatRoutes
    : defineConventionalRoutes;
  const conventionalRoutes = routesConvention(config.appDirectory);
  const ROOT: ConfigRoute = {
    id: "root",
    parentId: "",
    path: slashJoinName(base),
    file: config.entryRoot,
    module: slashJoinAbsolute(base, config.entryRoot),
    index: false,
    caseSensitive: undefined,
  };

  let routeList: ConfigRoute[] = Object.values(conventionalRoutes).map(
    (it: any) => {
      return {
        id: it.id,
        parentId: it.parentId,
        path: it.path || "",
        file: slashJoinAbsolute(config.appDirectory, it.file),
        module: slashJoinAbsolute(base, config.appDirectory, it.file),
        index: it.index,
        caseSensitive: it.caseSensitive,
      };
    }
  );
  routeList = [ROOT, ...routeList].map((it) => {
    it.module = slashJoinAbsolute(
      base,
      "/@id/@remix-vite:" + it.id + ":default.jsx"
    );
    let exports = getMetafile("." + it.file);
    it.caseSensitive = !!exports.caseSensitive;
    it.hasAction = !!exports.action;
    it.hasLoader = !!exports.loader;
    it.hasCatchBoundary = !!exports.CatchBoundary;
    it.hasErrorBoundary = !!exports.ErrorBoundary;
    return it;
  });
  return routeList;
};

// const getRouteList = (
//   context: LoadContext,
//   name: string
// ): ConfigRoute[] => {
//   const {
//     config,
//     viteConfig: { base, root },
//   } = context;
//   const routeList1 = fg
//     .sync("**/*.*", {
//       ignore: [],
//       onlyDirectories: false,
//       dot: true,
//       unique: true,
//       cwd: slashJoin(".", config.appDirectory, "routes"),
//     })
//     .sort()
//     .map((file) => {
//       let id = assertIdFile("routes", file);
//       let index = false;
//       let ix = id.lastIndexOf("/");
//       let parentId = id.substring(0, ix);
//       let path = id.substring(ix + 1);
//       if (path === "index") {
//         path = "";
//         index = true;
//       }
//       if (parentId === "routes") {
//         parentId = "root";
//       }
//       file = slashJoinAbsolute(config.appDirectory, "routes", file);
//       return {
//         id,
//         parentId,
//         path,
//         index,
//         file,
//       };
//     });
//   const routeList = [
//     {
//       id: "root",
//       parentId: "",
//       path: slashJoinName(base),
//       file: config.entryRoot,
//     },
//     ...routeList1,
//   ].map((it) => {
//     const exports: any = createMetafile("." + it.file);
//     const module = slashJoinAbsolute(base, it.file);
//     const moduleClient = slashJoinAbsolute(
//       base,
//       "/@id/@remix-vite:" + it.id + ":default.jsx"
//     );
//     return {
//       id: it.id,
//       parentId: it.parentId,
//       path: it.path,
//       file: it.file,
//       module: moduleClient,
//       caseSensitive: !!exports.caseSensitive,
//       hasAction: !!exports.action,
//       hasLoader: !!exports.loader,
//       hasCatchBoundary: !!exports.CatchBoundary,
//       hasErrorBoundary: !!exports.ErrorBoundary,
//     };
//   });
//   return routeList;
// };

export const getRouteMap = (context: LoadContext, name: string): RouteMap => {
  let list = getRouteList(context, name);
  return list.reduce((map: RouteMap, it) => {
    map[it.id] = it;
    return map;
  }, {});
};
