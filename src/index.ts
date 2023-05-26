import { consola } from "consola";
import { startListen, type MsgHandler } from "blive-message-listener";
import { csrf, sess, roomId } from "./config.js";

const handler: MsgHandler = {
    onError: (err) => {
        consola.error(err);
    },
    onUserAction: (msg) => {
        try {
            if (msg.type !== "ENTRY_EFFECT" && msg.body.action !== "enter") {
                return;
            }
            consola.debug(`ID: ${msg.id}`);
            consola.log(`用户「${msg.body.user.uname}」进入直播间`);
            const formData = new FormData();
            formData.append("bubble", "0");
            let uname = msg.body.user.uname;
            if (uname.length > 11) {
                uname = `${uname.slice(0, 8)}...`;
            }
            formData.append("msg", `欢迎 ${uname} 进入直播间`);
            formData.append("color", "5566168");
            formData.append("mode", "1");
            formData.append("room_type", "0");
            formData.append("jumpfrom", "82001");
            formData.append("fontsize", "25");
            formData.append("roomid", roomId.toString());
            formData.append("csrf", csrf);
            formData.append("csrf_token", csrf);
            formData.append("rnd", "1684682694");
            fetch("https://api.live.bilibili.com/msg/send", {
                method: "POST",
                mode: "cors",
                headers: {
                    cookie: `bili_jct=${csrf}; SESSDATA=${sess}`,
                },
                body: formData,
            })
                .then((res) => {
                    res.json()
                        .then((json: { code: number }) => {
                            if (json.code !== 0) {
                                consola.error(json);
                            } else {
                                consola.debug(`ID ${msg.id} 回复成功`);
                            }
                        })
                        .catch((err) => {
                            consola.error(err);
                        });
                })
                .catch((err) => {
                    consola.error(err);
                });
        } catch {
            return;
        }
    },
};

startListen(roomId, handler);
consola.info(`开始监听直播间 ${roomId}...`);
