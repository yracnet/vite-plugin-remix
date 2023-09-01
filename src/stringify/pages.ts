import esbuild from "esbuild";
import fs from "fs";
import path from "slash-path";
import { ContextPlugin } from "../types";

const escapeHTML = (text: string) => {
  return text.replace(/[&<>"'/]/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#x27;";
      case "/":
        return "&#x2F;";
      default:
        return match;
    }
  });
};
const checkLocalImport = (path: string) => {
  return [
    "",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    "/index.js",
    "/index.jsx",
    "/index.ts",
    "/index.tsx",
  ]
    .map((ext) => path + ext)
    .find(fs.existsSync);
};

export const stringifyPageFile = async (
  file: string,
  context: ContextPlugin
) => {
  const { config, routeConvention } = context;
  const route = routeConvention.find((it) => it.file === file);
  if (!route) {
    return false;
  }
  const cacheFile = path.join(config.root, route.moduleCache);
  const importFile = path.join(config.root, route.module);
  const cacheDir = path.dirname(cacheFile);
  try {
    await esbuild.build({
      stdin: {
        sourcefile: cacheFile,
        contents: `import   Component from "${importFile}?include=true"; export default Component;`,
        resolveDir: config.root,
      },
      outfile: cacheFile,
      jsx: "preserve",
      write: true,
      bundle: true,
      format: "esm",
      treeShaking: true,
      allowOverwrite: true,
      plugins: [
        {
          name: "custom-resolver",
          setup(build) {
            build.onResolve({ filter: /.*/gi }, (args) => {
              const isInclude = args.path.endsWith("?include=true");
              if (isInclude) {
                return {
                  external: false,
                };
              }
              const resolvePath = path.join(args.resolveDir, args.path);
              let localPath = checkLocalImport(resolvePath);
              if (localPath) {
                localPath = path.relative(cacheDir, localPath);
              }
              return {
                external: true,
                path: localPath || args.path,
              };
            });
          },
        },
      ],
    });
  } catch (error) {
    error = escapeHTML("Error: " + error);
    const codeOut = `
const Error = () => { 
  return (
    <code>
      <p>Don't hack me, ${file}</p>
      <pre>${error}</pre>
    </code>
  )
};

export default Error;
`;
    fs.writeFileSync(cacheFile, codeOut, { encoding: "utf8", flag: "w" });
  }
  return true;
};

export const stringifyPagesFiles = async (context: ContextPlugin) => {
  const { routeConvention } = context;
  for (let it of routeConvention) {
    await stringifyPageFile(it.file, context);
  }
};
