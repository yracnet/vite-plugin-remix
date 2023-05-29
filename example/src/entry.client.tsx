import { RemixBrowser } from "@remix-run/react";
import React from "react";
import ReactDOM from "react-dom/client";

React.startTransition(() => {
  ReactDOM.hydrateRoot(
    document,
    <React.StrictMode>
      <RemixBrowser />
    </React.StrictMode>
  );
});
