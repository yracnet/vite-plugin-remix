// TODO: For build process we need implement:
// import.meta.env.MODE !== "development"

import { LoadFunction } from "./assertPluginHandler";
import { getSourceCode, slashJoin, slashJoinAbsolute } from "./util";

export const attachRuntimeSource: LoadFunction = (context) => {
  const {
    config: { dirname },
    viteConfig: { base },
  } = context;
  const filePath = slashJoin(dirname, "/runtime/ui.jsx");
  const code = getSourceCode(filePath)
    .replace("VITE_URL_REFRESH", slashJoinAbsolute(base, "@react-refresh"))
    .replace("VITE_URL_CLIENT", slashJoinAbsolute(base, "@vite/client"));
  return `
/**
 * Source: ${filePath}
 */
${code}
  `;
};
