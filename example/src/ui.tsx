export const LiveReload = () => {
  let __html = `
    import { injectIntoGlobalHook } from "/@react-refresh";
    injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    `;
  return (
    <>
      <script type="module" dangerouslySetInnerHTML={{ __html }}></script>
      <script type="module" src="/@vite/client"></script>
    </>
  );
};

const style: any = {
  fontSize: "50px",
  textAlign: "center",
};

export const Welcome = () => {
  return (
    <div style={style}>
      Welcome <b>RemixJS</b> to <b>ViteJS</b> environment
    </div>
  );
};
