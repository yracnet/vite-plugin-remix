// TODO: For build process we need implement:
// import.meta.env.MODE !== "development"
import esbuild from "esbuild";
import { LoadFunction } from "./processPluginHandler";
import {
  readSourceCode,
  slashJoin,
  slashJoinAbsolute,
  slashJoinName,
} from "./util";

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
  const {
    id,
    // config: { dirname },
    viteConfig: { root },
  } = context;
  const [, file] = id.split(":");
  //return `import Component from "${file}"; export default Component;`;
  let filePath = "." + file;
  const result = await esbuild.build({
    stdin: {
      contents: `import Component from "${filePath}"; export default Component;`,
      resolveDir: root,
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
            if (args.path !== filePath) {
              return { external: true };
            }
          });
        },
      },
    ],
  });
  const codeOut = result.outputFiles[0].text;
  console.log(">>>", codeOut);
  return codeOut;
};
