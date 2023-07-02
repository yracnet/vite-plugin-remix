import { LinksFunction } from "@remix-run/server-runtime";
//@ts-ignore
import { LiveReload, Welcome } from "@remix-vite/ui";
import {
  useCatch,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// export const CatchBoundary = () => {
//   const caught = useCatch();
//   return (
//     <html>
//       <head>
//         <title>Oops!</title>
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <h1>
//           {caught.status} {caught.statusText}
//         </h1>
//         <p>{caught.data}</p>
//         <Scripts />
//       </body>
//     </html>
//   );
// }

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/ico",
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
        <Meta />
        <Links />
      </head>
      <body>
        <Welcome />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};
export default Root;
