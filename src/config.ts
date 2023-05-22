import { existsSync, readFileSync } from "fs";
import { consola } from "consola";
import { parseArgs } from "util";
import { exit } from "process";

consola.info("Parsing config file and command line arguments...");

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

let configPath = values.config;
if (configPath) {
    if (!existsSync(configPath)) {
        consola.warn(`Config file not found: ${configPath}`);
        consola.warn(`Trying to use default config path: ./config.txt`);
        configPath = "./config.txt";
    }
} else {
    consola.debug(`Config file not specified`);
    consola.debug(`Trying to use default config path: ./config.txt`);
    configPath = "./config.txt";
}
if (existsSync(configPath)) {
    const config = readFileSync(configPath, "utf-8").split(/\r?\n/);
    for (const line of config) {
        const [key, value] = line.split("=");
        if (!key || !value) {
            consola.error(`Invalid config line: ${line}`);
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
                    consola.error(`Invalid roomId: ${value}`);
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
        consola.error(`Invalid roomId: ${values.roomId}`);
        exit(1);
    }
    roomId = Number(values.roomId);
}

if (!csrf || !sess || !roomId) {
    consola.error(`Invalid config`);
    exit(1);
}

export { csrf, sess, roomId };
