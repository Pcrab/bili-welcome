import { existsSync, readFileSync } from "fs";
import { consola } from "consola";
import { parseArgs } from "util";
import { exit } from "process";
import path from "path";

consola.info("开始读取配置文件与命令行参数...");

const { values } = parseArgs({
    options: {
        config: {
            type: "string",
            alias: "c",
        },
        csrf: {
            type: "string",
        },
        sess: {
            type: "string",
        },
        roomId: {
            type: "string",
        },
    },
});

let csrf = "";
let sess = "";
let roomId = 0;

const defaultConfigPath = path.join(process.cwd(), "config.txt");

let configPath = values.config;
if (configPath) {
    if (!existsSync(configPath)) {
        consola.warn(`找不到指定的配置文件: ${configPath}`);
        consola.warn(`尝试使用默认配置文件地址: ./config.txt`);
        configPath = defaultConfigPath;
    }
} else {
    consola.debug(`未指定配置文件`);
    consola.debug(`尝试使用默认配置文件地址: ./config.txt`);
    configPath = defaultConfigPath;
}
if (existsSync(configPath)) {
    const config = readFileSync(configPath, "utf-8")
        .split(/\r?\n/)
        .filter((line) => {
            return line && !line.startsWith("#");
        });
    for (const line of config) {
        const [key, value] = line.split("=");
        if (!key || !value) {
            consola.error(`配置文件格式错误: ${line}`);
            exit(1);
        }
        switch (key) {
            case "csrf":
                csrf = value;
                break;
            case "sess":
                sess = value;
                break;
            case "roomId":
                if (isNaN(Number(value))) {
                    consola.error(`roomId 必须为数字: ${value}`);
                    exit(1);
                }
                roomId = Number(value);
                break;
            default:
                break;
        }
    }
}

if (values.csrf) {
    csrf = values.csrf;
}
if (values.sess) {
    sess = values.sess;
}
if (values.roomId) {
    if (isNaN(Number(values.roomId))) {
        consola.error(`--roomId 指定房间号必须为数字: ${values.roomId}`);
        exit(1);
    }
    roomId = Number(values.roomId);
}

if (!csrf || !sess || !roomId) {
    consola.error(`未指定 csrf 或 sess 或 roomId`);
    exit(1);
}

export { csrf, sess, roomId };
