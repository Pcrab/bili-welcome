import defaultConfig from "../../default.config.json";
import type { ConfigOptions, FinalOptions } from "./types.js";
import opts from "./opts.js";
import { loginWithQrcode } from "./login.js";
import { consola } from "consola";
import { defaultEnterResponse, defaultFansResponse, defaultFollowResponse, defaultGiftResponse } from "./constants.js";

const parseResponse = (
    base: ConfigOptions["response"] | boolean,
    key: keyof ConfigOptions["response"],
    defaultResponse: string,
): string => {
    let response: boolean | string = false;
    if (typeof base === "boolean") {
        response = base;
    } else {
        response = base[key];
    }
    if (!response) {
        return "";
    }
    if (response === true) {
        return defaultResponse;
    }
    return response;
};

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
    const responseEnter = parseResponse(response, "enter", defaultEnterResponse);
    const responseFans = parseResponse(response, "fans", defaultFansResponse);
    const responseFollow = parseResponse(response, "follow", defaultFollowResponse);
    const responseGift = parseResponse(response, "gift", defaultGiftResponse);

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
        giftMergeTime: mergedConfig.giftMergeTime,
        maxLength: mergedConfig.maxLength,
        maxRetry,
        sendGap,
        roomId,
        responseEnter,
        responseFans,
        responseFollow,
        responseGift,
    };
};

export default mergeConfig;