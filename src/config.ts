import { existsSync, mkdirSync } from "fs";
import { consola } from "consola";
import path from "path";
import { program } from "commander";
import { loginWithQrcode } from "./login.js";
import { writeFile, readFile } from "./utils.js";
import defaultConfig from "../default.config.json";

consola.info("开始解析参数和配置...");

program
    .option("-c, --config [path]", "配置文件路径")
    .option("-d, --debug", "开启调试模式")
    .option("-R, --no-response", "关闭自动回复")
    .option("--sess [SESSDATA]", "配置 SESSDATA")
    .option("--csrf [bili_jct]", "配置 bili_jct")
    .option("--roomId [roomId]", "配置 roomId");

program.parse();

interface Options {
    config?: string;
    debug?: boolean;
    response: boolean;
    sess?: string;
    csrf?: string;
    roomId?: string;
}
const opts: Options = program.opts();

interface ConfigOptions {
    sess?: string;
    csrf?: string;
    roomId?: number;
    response?:
        | boolean
        | {
              fans?: boolean;
              follow?: boolean;
              enter?: boolean;
          };
}

if (opts.debug) {
    consola.level = 4;
    consola.debug("Debug 模式已开启");
}

// base config, make sure it exists
const baseConfigPath =
    process.platform === "win32"
        ? path.join(process.env.LOCALAPPDATA ?? "", "bili-welcome")
        : process.env.XDG_CONFIG_HOME
        ? path.join(process.env.XDG_CONFIG_HOME, "bili-welcome")
        : path.join(process.env.HOME ?? "", ".config", "bili-welcome");
consola.debug(`全局配置文件夹路径 ${baseConfigPath}`);
if (!existsSync(baseConfigPath)) {
    consola.debug("全局配置文件夹不存在");
    consola.debug(`创建全局配置文件文件夹 ${baseConfigPath}`);
    mkdirSync(baseConfigPath, { recursive: true });
}
const baseConfigFile = path.join(baseConfigPath, "config.json");
consola.debug(`全局配置文件路径: ${baseConfigFile}`);
if (!existsSync(baseConfigFile)) {
    consola.debug("全局配置文件不存在");
    consola.debug(`使用空配置创建全局配置文件 ${baseConfigFile}`);
    writeFile(baseConfigFile, JSON.stringify(defaultConfig, null, 4));
}
const baseConfig = readFile(baseConfigFile) as ConfigOptions;
consola.debug("全局配置文件内容：");
consola.debug(baseConfig);

// command specific config file
let cmdConfig: ConfigOptions = {};
if (opts.config) {
    consola.debug(`命令行指定配置文件: ${opts.config}`);
    const configFile = path.isAbsolute(opts.config) ? opts.config : path.join(process.cwd(), opts.config);
    consola.debug(`查找位于 ${configFile} 的配置文件`);
    if (!existsSync(configFile)) {
        consola.error(`无法找到配置文件 ${configFile}`);
        process.exit(1);
    }
    cmdConfig = readFile(configFile) as ConfigOptions;
} else {
    if (existsSync(path.join(process.cwd(), "config.json"))) {
        consola.debug("当前目录下发现配置文件，将会使用该配置");
        cmdConfig = readFile(path.join(process.cwd(), "config.json")) as ConfigOptions;
    }
}
consola.debug("指定配置文件内容:");
consola.debug(cmdConfig);

const finalConfig = {
    ...defaultConfig,
    ...baseConfig,
    ...cmdConfig,
};
consola.debug("配置文件合并后内容:");
consola.debug(finalConfig);

// override config with command line options
if (opts.csrf) {
    consola.debug(`命令行指定 csrf: ${opts.csrf}`);
    finalConfig.csrf = opts.csrf;
}
if (opts.sess) {
    consola.debug(`命令行指定 sess: ${opts.sess}`);
    finalConfig.sess = opts.sess;
}
if (opts.roomId) {
    consola.debug(`命令行指定 roomId: ${opts.roomId}`);
    finalConfig.roomId = parseInt(opts.roomId);
}

const response = opts.response && finalConfig.response;
// default to enable true
const responseEnter = typeof response === "boolean" ? response : response.enter ?? true;
const responseFans = typeof response === "boolean" ? response : response.fans ?? true;
const responseFollow = typeof response === "boolean" ? response : response.follow ?? true;
const boolResponse = responseEnter || responseFans || responseFollow;

if (!boolResponse) {
    consola.debug("自动回复已禁用");
} else if (responseEnter && responseFans && responseFollow) {
    consola.debug("自动回复已启用");
} else {
    if (responseEnter) {
        consola.debug("自动回复已启用: 进入直播间");
    }
    if (responseFans) {
        consola.debug("自动回复已启用: 新粉丝团成员");
    }
    if (responseFollow) {
        consola.debug("自动回复已启用: 新关注");
    }
}

// if response is enabled, but final config doesn't have sess and csrf, try login
if (!finalConfig.sess || !finalConfig.csrf) {
    if (boolResponse) {
        consola.info("自动回复已启用，但 csrf 与 sess 未指定。尝试使用二维码登录");
        consola.info("请使用手机 app 扫描二维码登录");
        const result = await loginWithQrcode();
        finalConfig.sess = result.sess;
        finalConfig.csrf = result.csrf;
    } else {
        consola.info("自动回复已关闭，跳过登录");
    }
}

// if base config file doesn't have sess and csrf, but final config has, write to base config file
if (finalConfig.sess && finalConfig.csrf && (!baseConfig.sess || !baseConfig.csrf)) {
    consola.debug("将 sess 与 csrf 写入全局配置文件");
    writeFile(
        baseConfigFile,
        JSON.stringify({ ...baseConfig, sess: finalConfig.sess, csrf: finalConfig.csrf }, null, 4),
    );
}

// verify roomId
consola.debug(`验证 roomId: ${finalConfig.roomId ?? ""}`);
if (!finalConfig.roomId || !Number.isInteger(finalConfig.roomId)) {
    consola.error("roomId 必须为整数");
    process.exit(1);
}

consola.info("配置与参数解析完成");

// export config
const sess = finalConfig.sess;
const csrf = finalConfig.csrf;
const roomId = finalConfig.roomId;
export { sess, csrf, roomId, boolResponse as response, responseEnter, responseFans, responseFollow };
