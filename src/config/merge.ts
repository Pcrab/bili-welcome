import merge from "ts-deepmerge";
import defaultConfig from "../../default.config.json";
import type { ConfigOptions, FinalOptions } from "./types.js";
import opts from "./opts.js";
import { loginWithQrcode } from "./login.js";
import { consola } from "consola";
import {
    defaultBlockBot,
    defaultEnterResponse,
    defaultFansResponse,
    defaultFollowResponse,
    defaultGiftResponse,
} from "./constants.js";

const parseResponse = (
    base: Partial<ConfigOptions["response"]> | boolean,
    key: keyof ConfigOptions["response"],
    defaultResponse: string,
): string => {
    let response: boolean | string | undefined = false;
    if (typeof base === "boolean") {
        response = base;
    } else {
        response = base[key];
    }
    if (response === false) {
        return "";
    }
    if (response === true || response === undefined) {
        return defaultResponse;
    }
    return response;
};

const parseBlockBot = (base: boolean, blockBot: boolean | string): RegExp | null => {
    if (!base) {
        return null;
    }
    if (typeof blockBot === "string") {
        return new RegExp(blockBot, "i");
    }
    if (blockBot) {
        return new RegExp(defaultBlockBot, "i");
    }
    return null;
};

const mergeConfig = async (baseConfig: ConfigOptions, specifiedConfig: ConfigOptions | null): Promise<FinalOptions> => {
    const mergedConfig = ((): ConfigOptions => {
        if (specifiedConfig) {
            return merge(defaultConfig, baseConfig, specifiedConfig);
        } else {
            return merge(defaultConfig, baseConfig);
        }
    })();
    // default to enable blockBot
    const blockBot = parseBlockBot(opts.blockBot, mergedConfig.blockBot);
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
        maxRetry,
        sendGap,
        roomId,
        response: (responseEnter || responseFans || responseFollow || responseGift) !== "",
        responseEnter,
        responseFans,
        responseFollow,
        responseGift,
    };
};

export default mergeConfig;
