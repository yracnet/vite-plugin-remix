import fs from "fs";
import path from "path";

export const getSourceCode = (file: string): string =>
  fs.readFileSync(file, { encoding: "utf8" });

export const slash = (str = "") => {
  return str.replace(/\\/g, "/");
};

export const slashJoin = (...paths: string[]) => {
  return slash(path.join(...paths));
};

export const slashJoinAbsolute = (...paths: string[]) => {
  return slash(path.join("/", ...paths));
};

export const slashJoinName = (...paths: string[]) => {
  let pathName = slash(path.join(...paths));
  if (pathName.startsWith("/")) {
    pathName = pathName.substring(1);
  }
  if (pathName.endsWith("/")) {
    pathName = pathName.substring(0, pathName.length - 1);
  }
  return pathName;
};

export const slashResolveAbsolute = (pathRoot: string, pathName: string) => {
  pathName = path.resolve(pathRoot, pathName);
  pathName = path.relative(pathRoot, pathName);
  return slashJoin("/", pathName);
};

export const assertIdFile = (...paths: string[]) => {
  return (
    slashJoin(".", ...paths)
      .split("/")
      //Remove Extension
      .map((path) => path?.replace(/\.[^.]+$/, ""))
      // Parse Remix Param
      .map((path) => path?.replaceAll("$", ":"))
      // Parse NextJS Param
      .map((path) => path?.replaceAll("[", ":").replaceAll("]", ""))
      .join("/")
  );
};

const entryExts = [".js", ".jsx", ".ts", ".tsx"];

export const slashFindEntry = (root: string, dir: string, basename: string) => {
  for (let ext of entryExts) {
    let file = path.resolve(root, dir, basename + ext);
    if (fs.existsSync(file)) {
      file = path.relative(root, file);
      return slashJoinAbsolute(file);
    }
  }
  return "";
};
