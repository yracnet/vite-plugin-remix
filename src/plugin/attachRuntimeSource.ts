// TODO: For build process we need implement:
// import.meta.env.MODE !== "development"

import { LoadFunction } from "./assertPluginHandler";
import { getSourceCode, slashJoin } from "./util";

export const attachRuntimeSource: LoadFunction = (context) => {
  const {
    config: { dirname },
  } = context;
  const filePath = slashJoin(dirname, "/runtime/ui.jsx");
  const code = getSourceCode(filePath);
  return `
/**
 * Source: ${filePath}
 */
${code}
  `;
};
