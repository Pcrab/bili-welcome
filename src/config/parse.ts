import { fileExists, readFile } from "../utils.js";
import path from "path";
import type { ConfigOptions } from "./types.js";
import { consola } from "consola";

const parsePath = (configPath: string): string => {
    return path.isAbsolute(configPath) ? configPath : path.join(process.cwd(), configPath);
};

const parseConfig = (configPath: string): ConfigOptions | null => {
    const finalPath = parsePath(configPath);
    if (fileExists(finalPath)) {
        consola.debug(`找到配置文件 ${finalPath}`);
        return readFile(finalPath) as ConfigOptions;
    }
    return null;
};

export default parseConfig;
