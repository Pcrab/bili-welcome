import { sendMsg } from "./send.js";
import config from "./config/index.js";

const { giftMergeTime } = config;

const map: Record<
    number,
    Record<
        string,
        {
            count: number;
            timeout: NodeJS.Timeout;
        }
    >
> = {};

const parseMsg = (msg: string, count: number, giftName: string): string => {
    return msg.replaceAll("%c", count.toString()).replaceAll("%g", giftName);
};

const handleGift = (id: string, uid: number, uname: string, count: number, giftName: string, msg: string): void => {
    let gift = map[uid]?.[giftName];
    if (!gift) {
        gift = {
            count,
            timeout: setTimeout(() => {
                const message = parseMsg(msg, count, giftName);
                sendMsg(message, uname, id);
                delete map[uid]?.[giftName];
            }, giftMergeTime),
        };
        map[uid] = {
            [giftName]: gift,
        };
    } else {
        const timeout = gift.timeout;
        clearTimeout(timeout);
        gift.count += count;
        const giftCount = gift.count;
        gift.timeout = setTimeout(() => {
            const message = parseMsg(msg, giftCount, giftName);
            sendMsg(message, uname, id);
            delete map[uid]?.[giftName];
        }, giftMergeTime);
    }
    return;
};

export default handleGift;
