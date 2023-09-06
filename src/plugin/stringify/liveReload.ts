import fs from "fs";
import path from "slash-path";
import { ResolvedConfig } from "vite";
import { LIVE_RELOAD } from "../names";
import { PluginConfig } from "../types";

const createLiveReloadCode = (config: PluginConfig, vite: ResolvedConfig) => {

  const urlRefresh = path.join("/", vite.base, "@react-refresh");
  const urlClient = path.join("/", vite.base, "@vite/client");

  return `
  export const LiveReload = () => {
    const __html = \`
import  { injectIntoGlobalHook } from "${urlRefresh}";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
\`;
    return (
      <>
        <script type="module" dangerouslySetInnerHTML={{ __html }}></script>
        <script type="module" src="${urlClient}"></script>
      </>
    );
  };
  
  const style = {
    fontSize: "50px",
    textAlign: "center",
  };
  
  export const Welcome = () => {
    return (
      <div style={style}>
      Welcome <b>RemixJS</b> to the <b>ViteJS</b> environment
      </div>
    );
  };
`;
};

export const stringifyLiveReload = (config: PluginConfig, vite: ResolvedConfig) => {
  const liveReloadCode = createLiveReloadCode(config, vite);
  const cacheFile = path.join(config.cacheDirectory, LIVE_RELOAD);
  fs.writeFileSync(cacheFile, liveReloadCode, { encoding: "utf8", flag: "w" });
};
