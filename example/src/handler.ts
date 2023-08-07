//@ts-ignore
import { build } from "@remix-vite/serverBuild";

import { createRequestHandler } from "@remix-run/express";
import express from "express";

let requestHandler = createRequestHandler({
  build,
  mode: "development",
});

export const handler = express();
const onRender = async (req: any, res: any, next: any) => {
  try {
    req.url = req.originalUrl;
    await requestHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};
handler.get("*", onRender);

export const run = (args: any = {}) => {
  const { port = 3000, hostname = "localhost" } = args;
  const app = express();
  // app.use(); //Static Files
  app.use(handler);
  app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
  });
};
