import { program } from "commander";
import { consola } from "consola";
import type { Options } from "./types.js";

program
    .option("-c, --config [path]", "配置文件路径")
    .option("-d, --debug", "开启调试模式")
    .option("-R, --no-response", "关闭自动回复")
    .option("-B, --no-blockBot", "关闭屏蔽机器人")
    .option("--roomId [roomId]", "配置 roomId")
    .option("--log [logFile]", "log 文件位置");

program.parse();

const opts: Options = program.opts();

if (opts.debug) {
    consola.level = 4;
    consola.debug("Debug 模式已开启");
}

export default opts;
