import { readFileSync, writeFileSync } from "fs";

const writeFile = (path: string, data: string): void => {
    writeFileSync(path, data, { encoding: "utf-8" });
};

const readFile = (path: string): unknown => {
    return JSON.parse(readFileSync(path, "utf-8"));
};

const buildMessage = (base: string, username: string): string => {
    const baseLength = 22 - base.length;
    if (username.length > baseLength) {
        return base.replace("%s", username.slice(0, baseLength - 1) + "…");
    }
    return base.replace("%s", username);
};

export { writeFile, readFile, buildMessage };
