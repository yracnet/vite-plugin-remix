---
layout: page
---

![](logo.svg)

# vite-plugin-remix

Welcome Remix to ViteJS!

## Motivation

I wanted to use the Remix Framework within the ViteJS environment, while keeping the web module imports and HRM (Hot Module Replacement) functionalities.
RemixJS comes with a custom server, but this plugin allows you to use the Vite server during development.

## Installation

```bash
yarn add -D vite-plugin-remix
```

## Dependencies

This plugin requires some dependencies to work properly:

```bash
yarn add @remix-run/react
yarn add -D @remix-run/dev @remix-run/express @remix-run/server-runtime
```

### Configuration

In your `vite.config.ts` file:

```js
import { defineConfig } from "vite";
import remixPlugin from "vite-plugin-remix";
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

### Configure Request Handler

This plugin requires a request handler. Create a `handler.ts` file in `${appDirectory}` (e.g., `src/handler.ts`):

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
    // This FIX is for supporting the base path deployment on the server
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

In your `root.tsx` file (e.g., `src/root.tsx`), you need to use the `LiveReload` component from `@remix-vite/ui`:

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
        <LiveReload /> {/* Placed at the top of the page */}
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

To run the app, use the Vite flow:

```bash
yarn run dev
```

## Example

Check out the example project in the "example" folder.

## Var Environemnt

- REMIX_CHACHE_DIR: Defined REMIX_CHACHE_DIR for change the cache directory, default value .remix

## TO DO

- Build Project with Plugin
- Optimize Source Code
