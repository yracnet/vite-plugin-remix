import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";
import { stringifyLiveReload } from "./liveReload";
import { stringifyManifestInject } from "./manifestInject";
import { stringifyPageFile, stringifyPagesFiles } from "./pages";
import { stringifyServerBuild } from "./serverBuild";

export const generateStart = async (config: PluginConfig, vite: ResolvedConfig) => {
    fs.mkdirSync(config.cacheDirectory, { recursive: true });
    await stringifyLiveReload(config, vite);
    await stringifyPagesFiles(config, vite);
    await stringifyServerBuild(config, vite);
    await stringifyManifestInject(config, vite);
}

export const generateChange = async (file: string, config: PluginConfig, vite: ResolvedConfig) => {
    await stringifyPageFile(file, config, vite);
    await stringifyServerBuild(config, vite);
    await stringifyManifestInject(config, vite);
}