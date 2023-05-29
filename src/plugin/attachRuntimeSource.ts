// TODO: For build process we need implement:
// import.meta.env.MODE !== "development"

import { LoadFunction } from "./assertPluginHandler";
import { readSourceCode, slashJoin, slashJoinAbsolute } from "./util";

export const attachRuntimeSource: LoadFunction = (context) => {
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
