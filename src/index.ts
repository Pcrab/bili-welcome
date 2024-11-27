import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type MsgHandler, startListen } from "blive-message-listener";
import { consola } from "consola";
import config from "./config/index.js";
import handleGift from "./gift.js";
import { medal_name } from "./room.js";
import { sendMsg } from "./send.js";
import { updateMedal } from "./updateMedal.js";
import { configPath } from "./utils.js";

await updateMedal();

const {
    data: { buvid },
} = (await (
    await fetch("https://api.bilibili.com/x/web-frontend/getbuvid")
).json()) as {
    data: {
        buvid: string;
    };
};

consola.info("buvid: ", buvid);

const {
    data: { token },
} = (await (
    await fetch(
        `https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${config.roomId}&type=0`,
        {
            headers: {
                cookie: `bili_jct=${config.csrf}; SESSDATA=${config.sess}; buvid3=${buvid}`,
            },
        },
    )
).json()) as {
    data: {
        token: string;
    };
};

consola.info("token: ", token);

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onOpen: () => {
        consola.info(`开始监听直播间 ${config.roomId}...`);
    },
    onClose: () => {
        consola.info("close");
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
                consola.log(
                    `用户「${msg.body.user.uname}」赠送了 ${msg.body.amount} 个 ${msg.body.gift_name}`,
                );
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
    raw: {
        msg: (msg) => {
            if (config.logRaw) {
                fs.appendFileSync(
                    typeof config.logRaw === "string"
                        ? config.logRaw
                        : path.join(configPath, "log.txt"),
                    JSON.stringify(msg) + os.EOL,
                );
            }
        },
    },
};

startListen(config.roomId, handler, {
    ws: {
        platform: "web",
        host: "broadcastlv.chat.bilibili.com",
        protover: 3,
        type: 2,
        uid: config.uid,
        key: token,
        buvid,
    },
});
