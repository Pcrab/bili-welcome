import { consola } from "consola";
import { startListen, type MsgHandler } from "blive-message-listener";
import config from "./config/index.js";
import { sendMsg } from "./send.js";
import { medal_name } from "./room.js";
import handleGift from "./gift.js";

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onUserAction: (msg) => {
        try {
            if (msg.type === "ENTRY_EFFECT") {
                return;
            }
            if (msg.body.action === "enter") {
                consola.log(`用户「${msg.body.user.uname}」进入直播间`);
                sendMsg(config.responseEnter, msg.body.user.uname, msg.id);
            } else if (msg.body.action === "follow") {
                consola.log(`用户「${msg.body.user.uname}」关注了直播间`);
                sendMsg(config.responseFollow, msg.body.user.uname, msg.id);
            }
        } catch {
            return;
        }
    },
    onGift: (msg) => {
        try {
            if (msg.body.gift_name === "粉丝团灯牌") {
                consola.log(
                    `用户「${msg.body.user.uname}」赠送了 ${msg.body.amount} 个 粉丝团灯牌并加入了粉丝团「${medal_name}」`,
                );
                handleGift(
                    msg.id,
                    msg.body.user.uid,
                    msg.body.user.uname,
                    msg.body.amount,
                    msg.body.gift_name,
                    config.responseFans,
                );
            } else {
                consola.log(`用户「${msg.body.user.uname}」赠送了 ${msg.body.amount} 个 ${msg.body.gift_name}`);
                handleGift(
                    msg.id,
                    msg.body.user.uid,
                    msg.body.user.uname,
                    msg.body.amount,
                    msg.body.gift_name,
                    config.responseGift,
                );
            }
        } catch {
            return;
        }
    },
};

startListen(config.roomId, handler);
consola.info(`开始监听直播间 ${config.roomId}...`);
