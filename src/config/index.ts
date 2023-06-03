import path from "path";
import defaultConfig from "../../default.config.json";
import { consola } from "consola";
import parseConfig from "./parse.js";
import { configPath, writeFile } from "../utils.js";
import opts from "./opts.js";
import type { ConfigOptions } from "./types.js";
import mergeConfig from "./merge.js";
import logConfig from "./log.js";

const baseConfigPath = path.join(configPath, "config.json");
consola.debug(`全局配置路径 ${baseConfigPath}`);

let baseConfig = parseConfig(baseConfigPath);
// create default config if not exists
if (baseConfig === null) {
    writeFile(path.join(baseConfigPath, "config.json"), JSON.stringify(defaultConfig, null, 4));
    baseConfig = {
        ...defaultConfig,
        roomId: 0,
    };
}

let specifiedConfig: ConfigOptions | null = null;
if (opts.config) {
    consola.debug(`使用指定配置文件 ${opts.config}`);
    specifiedConfig = parseConfig(opts.config);
    if (specifiedConfig === null) {
        consola.warn(`指定配置文件 ${opts.config} 不存在或读取错误`);
    }
} else {
    consola.debug(`未指定配置文件，尝试读取当前目录下的 config.json`);
    specifiedConfig = parseConfig(path.join(process.cwd(), "config.json"));
    if (specifiedConfig === null) {
        consola.debug(`读取当前目录下的 config.json 失败`);
    }
}

const finalConfig = await mergeConfig(baseConfig, specifiedConfig);

logConfig(finalConfig);

export default finalConfig;
