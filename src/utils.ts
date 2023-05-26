import { readFileSync, writeFileSync } from "fs";

const writeFile = (path: string, data: string): void => {
    writeFileSync(path, data, { encoding: "utf-8" });
};

const readFile = (path: string): unknown => {
    return JSON.parse(readFileSync(path, "utf-8"));
};

export { writeFile, readFile };
