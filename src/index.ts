import { consola } from "consola";
import { startListen, type MsgHandler } from "blive-message-listener";
import { responseEnter, responseFans, responseFollow, roomId } from "./config.js";
import { sendMsg } from "./send.js";
import { buildMessage } from "./utils.js";
import { medal_name } from "./room.js";

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onUserAction: (msg) => {
        try {
            if (msg.type === "ENTRY_EFFECT" || msg.body.action === "enter") {
                consola.log(`用户「${msg.body.user.uname}」进入直播间`);
                if (responseEnter) {
                    sendMsg(buildMessage("欢迎%s进入直播间～", msg.body.user.uname), msg.id);
                }
            } else if (msg.body.action === "follow") {
                consola.log(`用户「${msg.body.user.uname}」关注了直播间`);
                if (responseFollow) {
                    sendMsg(buildMessage("感谢%s的关注喵～", msg.body.user.uname), msg.id);
                }
            }
        } catch {
            return;
        }
    },
    onGift: (msg) => {
        try {
            if (msg.body.gift_name === "粉丝团灯牌") {
                consola.log(`用户「${msg.body.user.uname}」加入了粉丝团「${medal_name}」`);
                if (responseFans) {
                    const message = buildMessage(`感谢%s加入${medal_name}～`, msg.body.user.uname);
                    sendMsg(message, msg.id);
                }
            }
        } catch {
            return;
        }
    },
};

startListen(roomId, handler);
consola.info(`开始监听直播间 ${roomId}...`);
