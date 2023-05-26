import { consola } from "consola";
import { startListen, type MsgHandler } from "blive-message-listener";
import { roomId } from "./config.js";
import send from "./send.js";
import { buildMessage } from "./utils.js";

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onUserAction: (msg) => {
        try {
            if (msg.type === "ENTRY_EFFECT" || msg.body.action === "enter") {
                consola.log(`用户「${msg.body.user.uname}」进入直播间`);
                send(buildMessage("欢迎%s进入直播间", msg.body.user.uname), msg.id);
                return;
            } else if (msg.body.action === "follow") {
                consola.log(`用户「${msg.body.user.uname}」关注了直播间`);
                send(buildMessage("感谢%s的关注喵～", msg.body.user.uname), msg.id);
                return;
            }
        } catch {
            return;
        }
    },
    onGift: (msg) => {
        try {
            consola.log(`用户「${msg.body.user.uname}」赠送 ${msg.body.amount} 个 ${msg.body.gift_name}`);
            if (msg.body.gift_name === "粉丝团灯牌") {
                consola.debug(`消息 ID: ${msg.id}`);
                const message = buildMessage("感谢 %s 加入手艺喵~", msg.body.user.uname);
                consola.debug(`回复消息: ${message}`);
                send(message, msg.id);
            }
        } catch {
            return;
        }
    },
};

startListen(roomId, handler);
consola.info(`开始监听直播间 ${roomId}...`);
