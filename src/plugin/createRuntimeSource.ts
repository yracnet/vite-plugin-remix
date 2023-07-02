// TODO: For build process we need implement:
// import.meta.env.MODE !== "development"
import esbuild from "esbuild";
import { LoadFunction } from "../pluginHandler";
import path from "path";
import fs from "fs";
import { readSourceCode, slashJoin, slashJoinAbsolute } from "./util";

const isLocalImport = (file: string) => {
  return (
    fs.existsSync(file) ||
    fs.existsSync(file + ".js") ||
    fs.existsSync(file + ".jsx") ||
    fs.existsSync(file + ".ts") ||
    fs.existsSync(file + ".tsx")
  );
};

export const createRuntimeSource: LoadFunction = (context) => {
  const {
    config: { dirname },
    viteConfig: { base },
  } = context;
  const filePath = slashJoin(dirname, "/runtime/ui.jsx");
  const code = readSourceCode(filePath)
    .replace("VITE_URL_REFRESH", slashJoinAbsolute(base, "@react-refresh"))
    .replace("VITE_URL_CLIENT", slashJoinAbsolute(base, "@vite/client"));
  return code;
};

export const createPartialBuildRuntimeSource: LoadFunction = async (
  context
) => {
  const { id, viteConfig, routeMap } = context;
  const [, routeId] = id.split(":");
  let route = routeMap[routeId];
  if (!route) {
    return "const DontHackMe = () => <p>Don't hack me, please</p>; export default DontHackMe;";
  }

  const importName = `.${route.file}`;

  const result = await esbuild.build({
    stdin: {
      contents: `import Component from "${importName}"; export default Component;`,
      resolveDir: viteConfig.root,
    },
    write: false,
    bundle: true,
    format: "esm",
    treeShaking: true,
    plugins: [
      {
        name: "custom-resolver",
        setup(build) {
          build.onResolve({ filter: /.*/gi }, (args) => {
            if (args.path !== importName) {
              let file = path.resolve(args.resolveDir, args.path);
              let exist = isLocalImport(file);
              if (exist) {
                return { external: true, path: file };
              }
              return { external: true };
            }
          });
        },
      },
    ],
  });
  const codeOut = result.outputFiles[0].text;
  return codeOut;
};
