import React from "react";
import ReactDOM from "react-dom/client";
//@ts-ignore
import { Welcome } from "@remix-vite/ui";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
