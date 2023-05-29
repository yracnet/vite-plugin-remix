# vite-plugin-remix

Welcome Remix to ViteJS

## Motivation

- I will tried to use Remix Framework on ViteJS environemt

## Install

```bash
yarn add vite-plugin-remix
```

## Dependencies

This plugin require some dependencies for run OK

```bash
yarn add @remix-run/react
yarn add -D  @remix-run/dev @remix-run/express @remix-run/server-runtime
```

### Configure

In [vite.config.ts](./example/vite.config.ts)

```js
import { defineConfig } from "vite";
import { remixPlugin } from "vite-plugin-remix";

export default defineConfig({
  plugins: [
    remixPlugin({
      // appDirectory?: "src",
      // future: {
      //   unstable_dev?: false,
      //   unstable_postcss?: false,
      //   unstable_tailwind?: false,
      //   v2_errorBoundary?: false,
      //   v2_meta?: false,
      //   v2_normalizeFormMethod?: false,
      //   v2_routeConvention?: false,
      // },
    }),
  ],
});
```

### Configure Handler Request

This pugin require a handler request, In ${appDirectory}/[handler.ts](./example/src/handler.ts)

```js
import { createRequestHandler } from "@remix-run/express";
import express from "express";
// Custom File from vite-plugin-remix
import { build } from "@remix-vite/serverBuild";

let requestHandler = createRequestHandler({
  build,
  mode: "production",
});

export const handler = express();
const onRender = async (req, res, next) => {
  try {
    // This FIX is for support the base path deploy on server
    req.url = req.originalUrl;
    await requestHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};
handler.get("*", onRender);

// TODO: export const run = ()=>{ /*custom server for production*/}
```

### Configure LiveReload

In [root.tsx](./example/src/root.tsx) we need use the "LiveReload" component from "@remix-vite/ui"

```js
import { LiveReload, Welcome } from "@remix-vite/ui";
import {
  useCatch,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

const Root = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <LiveReload /> {/* TOP page*/}
        <Meta />
        <Links />
      </head>
      <body>
        <Welcome />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};
export default Root;
```

## Run

Use the vite-flow for run the app

```bash
yarn run dev
```

## Example

See th example project in "example" folder.
