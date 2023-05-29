import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: any,
  responseStatusCode: any,
  responseHeaders: any,
  remixContext: any
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,

      {
        onShellReady: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (error) => {
          console.error("Error2:", error);
          reject(error);
        },
        onError: (error) => {
          console.error("Error1:", error);
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
