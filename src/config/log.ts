import { consola } from "consola";
import type { FinalOptions } from "./types.js";

const logConfig = (config: FinalOptions): void => {
    if (config.blockBot) {
        consola.debug("屏蔽机器人已开启");
    } else {
        consola.debug("屏蔽机器人已关闭");
    }

    if (config.responseEnter || config.responseFans || config.responseFollow || config.responseGift) {
        if (config.responseFans) {
            consola.debug(`自动回复加入粉丝团已开启: ${config.responseFans}`);
        }
        if (config.responseFollow) {
            consola.debug(`自动回复关注已开启: ${config.responseFollow}`);
        }
        if (config.responseEnter) {
            consola.debug(`自动回复进入直播间已开启: ${config.responseEnter}`);
        }
        if (config.responseGift) {
            consola.debug(`自动回复礼物已开启: ${config.responseGift}`);
        }
    } else {
        consola.debug("自动回复已关闭");
    }

    consola.debug(`合并礼物间隔: ${config.giftMergeTime}ms`);

    consola.debug(`最大重试次数: ${config.maxRetry}次`);
    consola.debug(`发送间隔: ${config.sendGap}ms`);

    consola.debug(`最长消息长度: ${config.maxLength}个字符`);
};

export default logConfig;
