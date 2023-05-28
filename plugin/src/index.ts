import { Plugin } from "vite";

export const reminRun = (): Plugin => {
  return {
    name: "vite-plugin-remix",
    enforce: "pre",
    configResolved: async (config) => {
      //To do
    },
    configureServer: (devServer) => {
      //To do
    },
    resolveId: (id: string) => {
      //To do
    },
    load: async (id: string) => {
      //To do
    },
  };
};
