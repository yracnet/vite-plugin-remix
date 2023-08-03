import crypto from "crypto";
import { buildSync } from "esbuild";
import fs from "fs";

const CACHE: any = {};

const generateMD5 = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto.createHash("md5").update(fileContent).digest("hex");
  return hash;
};

export const getMetadata = (filePath: string) => {
  try {
    let md5 = generateMD5(filePath);
    let cache = CACHE[filePath] || { md5: "0", exports: {} };
    if (cache.md5 === md5) {
      return cache.exports;
    }
    cache.md5 = md5;
    let result = buildSync({
      entryPoints: [filePath],
      platform: "neutral",
      format: "esm",
      metafile: true,
      write: false,
      loader: {
        ".js": "jsx",
      },
      logLevel: "silent",
      bundle: true,
      outfile: "out.js",
      external: ["*"],
    });
    const exports = result.metafile.outputs["out.js"]?.exports || [];
    cache.exports = exports.reduce((map: any, name) => {
      map[name] = true;
      return map;
    }, {});
    return cache.exports;
  } catch (error) {
    console.log("Error on getMetafile:", error, filePath);
    return {};
  }
};
