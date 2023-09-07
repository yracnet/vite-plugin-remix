import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/server-runtime";
//@ts-ignore
import { LiveReload, Welcome } from "@remix-vite/ui";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    },
  ];
};

const Root = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <LiveReload />
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
