import defaultConfig from "../../default.config.json";
import type { ConfigOptions, FinalOptions } from "./types.js";
import opts from "./opts.js";
import { loginWithQrcode } from "./login.js";
import { consola } from "consola";

const mergeConfig = async (baseConfig: ConfigOptions, specifiedConfig: ConfigOptions | null): Promise<FinalOptions> => {
    const mergedConfig: ConfigOptions = {
        ...defaultConfig,
        ...baseConfig,
        ...specifiedConfig,
    };
    // default to enable blockBot
    const blockBot = (opts.blockBot && mergedConfig.blockBot) || true;
    const maxRetry = mergedConfig.maxRetry;
    const sendGap = mergedConfig.sendGap;
    mergedConfig.roomId = parseInt(opts.roomId ?? "", 10) || mergedConfig.roomId;

    const response = opts.response && mergedConfig.response;
    const responseFans = typeof response === "boolean" ? response : response.fans;
    const responseFollow = typeof response === "boolean" ? response : response.follow;
    const responseEnter = typeof response === "boolean" ? response : response.enter;

    if (!mergedConfig.sess || !mergedConfig.csrf) {
        const result = await loginWithQrcode();
        mergedConfig.sess = result.sess;
        mergedConfig.csrf = result.csrf;
    }

    const sess = mergedConfig.sess;
    const csrf = mergedConfig.csrf;

    let roomId: number | undefined;
    if (!mergedConfig.roomId) {
        consola.error("未指定 roomId");
        process.exit(1);
    } else {
        roomId = mergedConfig.roomId;
    }

    return {
        sess,
        csrf,
        blockBot,
        maxRetry,
        sendGap,
        roomId,
        responseFans,
        responseFollow,
        responseEnter,
    };
};

export default mergeConfig;
