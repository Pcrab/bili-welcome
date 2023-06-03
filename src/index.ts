import { consola } from "consola";
import { startListen, type MsgHandler } from "blive-message-listener";
import config from "./config/index.js";
import { sendMsg } from "./send.js";
import { medal_name } from "./room.js";

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onUserAction: (msg) => {
        try {
            if (msg.type === "ENTRY_EFFECT" || msg.body.action === "enter") {
                consola.log(`用户「${msg.body.user.uname}」进入直播间`);
                if (config.responseEnter) {
                    sendMsg("欢迎 %s 进入直播间～", msg.body.user.uname, msg.id);
                }
            } else if (msg.body.action === "follow") {
                consola.log(`用户「${msg.body.user.uname}」关注了直播间`);
                if (config.responseFollow) {
                    sendMsg("感谢 %s 的关注喵～", msg.body.user.uname, msg.id);
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
                if (config.responseFans) {
                    sendMsg(`感谢 %s 加入${medal_name}～`, msg.body.user.uname, msg.id);
                }
            }
        } catch {
            return;
        }
    },
};

startListen(config.roomId, handler);
consola.info(`开始监听直播间 ${config.roomId}...`);
