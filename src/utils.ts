import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "fs";
import path from "path";
import config from "./config/index.js";

const { maxLength } = config;

const configPath =
    process.platform === "win32"
        ? path.join(process.env.LOCALAPPDATA ?? "", "bili-welcome")
        : process.env.XDG_CONFIG_HOME
        ? path.join(process.env.XDG_CONFIG_HOME, "bili-welcome")
        : path.join(process.env.HOME ?? "", ".config", "bili-welcome");

const fileExists = (path: string): boolean => {
    if (existsSync(path)) {
        const stat = lstatSync(path);
        if (stat.isFile()) {
            return true;
        }
        if (stat.isSymbolicLink()) {
            return fileExists(realpathSync(path));
        }
    }
    return false;
};

const directoryExists = (path: string): boolean => {
    if (existsSync(path)) {
        const stat = lstatSync(path);
        if (stat.isDirectory()) {
            return true;
        }
        if (stat.isSymbolicLink()) {
            return directoryExists(realpathSync(path));
        }
    }
    return false;
};

const writeFile = (filePath: string, data: string): void => {
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, data, { encoding: "utf-8" });
};

const readFile = (path: string): unknown => {
    return JSON.parse(readFileSync(path, "utf-8"));
};

const buildMessage = (base: string, username: string): string => {
    const baseLength = maxLength + 2 - base.length;
    if (username.length > baseLength) {
        return base.replace("%s", username.slice(0, baseLength - 1) + "…");
    }
    return base.replace("%s", username);
};

export { configPath, writeFile, readFile, buildMessage, fileExists, directoryExists };
