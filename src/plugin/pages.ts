import fg from "fast-glob";
import { LoadContext } from "./assertPluginHandler";
import { getMetafile } from "./getMetafile.ts";
import {
  assertIdFile,
  slashJoin,
  slashJoinAbsolute,
  slashJoinName,
} from "./util.ts";

// import { flatRoutes } from "@remix-run/dev/dist/config/flat-routes.js";
// import { defineConventionalRoutes } from "@remix-run/dev/dist/config/routesConvention.js";

export type ConfigRoute = {
  id: string;
  parentId: string;
  path: string;
  file: string;
  module: string;
  index?: boolean;
  hasAction?: boolean;
  hasLoader?: boolean;
  caseSensitive?: boolean;
  hasCatchBoundary?: boolean;
  hasErrorBoundary?: boolean;
};

// TODO: Error when reference to @remix-run/dev/..,this cause "all-reload" on the client

// export const getConfigRouteList1 = (
//   context: LoadContext,
//   name?: string
// ): ConfigRoute[] => {
//   const {
//     config,
//     viteConfig: { base },
//   } = context;
//   const routesConvention = config.future.v2_routeConvention
//     ? flatRoutes
//     : defineConventionalRoutes;
//   const conventionalRoutes = routesConvention(config.appDirectory);
//   const ROOT: ConfigRoute = {
//     id: "root",
//     parentId: "",
//     path: slashJoinName(base),
//     file: config.entryRoot,
//     module: slashJoinAbsolute(base, config.entryRoot),
//     index: false,
//     caseSensitive: undefined,
//   };

//   let routeList: ConfigRoute[] = Object.values(conventionalRoutes).map(
//     (it: any) => {
//       return {
//         id: it.id,
//         parentId: it.parentId,
//         path: it.path || "",
//         file: slashJoinAbsolute(config.appDirectory, it.file),
//         module: slashJoinAbsolute(base, config.appDirectory, it.file),
//         index: it.index,
//         caseSensitive: it.caseSensitive,
//       };
//     }
//   );
//   routeList = [ROOT, ...routeList].map((it) => {
//     let exports = getMetafile("." + it.file);
//     it.caseSensitive = !!exports.caseSensitive;
//     it.hasAction = !!exports.action;
//     it.hasLoader = !!exports.loader;
//     it.hasCatchBoundary = !!exports.CatchBoundary;
//     it.hasErrorBoundary = !!exports.ErrorBoundary;
//     return it;
//   });
//   console.log("getConfigRouteList:", name);
//   return routeList;
// };

export const getConfigRouteList = (
  context: LoadContext,
  name: string
): ConfigRoute[] => {
  const {
    config,
    viteConfig: { base },
  } = context;
  const routeList1 = fg
    .sync("**/*.*", {
      ignore: [],
      onlyDirectories: false,
      dot: true,
      unique: true,
      cwd: slashJoin(".", config.appDirectory, "routes"),
    })
    .sort()
    .map((file) => {
      let id = assertIdFile("routes", file);
      let index = false;
      let ix = id.lastIndexOf("/");
      let parentId = id.substring(0, ix);
      let path = id.substring(ix + 1);
      if (path === "index") {
        path = "";
        index = true;
      }
      if (parentId === "routes") {
        parentId = "root";
      }
      return {
        id,
        parentId,
        path,
        index,
        file: slashJoinAbsolute(config.appDirectory, "routes", file),
      };
    });
  const routeList = [
    {
      id: "root",
      parentId: "",
      path: slashJoinName(base),
      file: config.entryRoot,
    },
    ...routeList1,
  ].map((it) => {
    let exports: any = getMetafile("." + it.file);
    return {
      id: it.id,
      parentId: it.parentId,
      path: it.path,
      file: it.file,
      module: slashJoinAbsolute(base, it.file),
      caseSensitive: !!exports.caseSensitive,
      hasAction: !!exports.action,
      hasLoader: !!exports.loader,
      hasCatchBoundary: !!exports.CatchBoundary,
      hasErrorBoundary: !!exports.ErrorBoundary,
    };
  });
  console.log("getConfigRouteList:", name);
  return routeList;
};