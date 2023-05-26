import { consola } from "consola";
import { startListen, type MsgHandler } from "blive-message-listener";
import { response, roomId } from "./config.js";
import send from "./send.js";

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onUserAction: (msg) => {
        try {
            if (msg.type !== "ENTRY_EFFECT" && msg.body.action !== "enter") {
                return;
            }
            consola.log(`用户「${msg.body.user.uname}」进入直播间`);
            consola.debug(`消息 ID: ${msg.id}`);
            if (response) {
                send(msg.body.user.uname, msg.id);
            }
        } catch {
            return;
        }
    },
};

startListen(roomId, handler);
consola.info(`开始监听直播间 ${roomId}...`);
