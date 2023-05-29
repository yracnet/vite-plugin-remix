import React from "react";
import ReactDOM from "react-dom/client";
import { Welcome } from "/../plugin/src/index";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
