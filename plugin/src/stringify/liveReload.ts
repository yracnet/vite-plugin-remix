import fs from "fs";
import path from "slash-path";
import { LIVE_RELOAD } from "../names";
import { ContextPlugin } from "../types";

const createLiveReloadCode = (context: ContextPlugin) => {
  const { config } = context;

  const urlRefresh = path.join("/", config.base, "@react-refresh");
  const urlClient = path.join("/", config.base, "@vite/client");

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

export const stringifyLiveReload = (context: ContextPlugin) => {
  const liveReloadCode = createLiveReloadCode(context);
  const { config } = context;
  const cacheFile = path.join(config.root, config.cacheDirectory, LIVE_RELOAD);
  const dir = path.dirname(cacheFile);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(cacheFile, liveReloadCode, { encoding: "utf8", flag: "w" });
};
