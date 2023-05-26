import { csrf, sess, roomId, response } from "./config.js";
import { consola } from "consola";

const send = (message: string, id = ""): void => {
    if (!response) {
        return;
    }
    const formData = new FormData();
    formData.append("bubble", "0");
    formData.append("msg", message);
    formData.append("color", "5566168");
    formData.append("mode", "1");
    formData.append("room_type", "0");
    formData.append("jumpfrom", "82001");
    formData.append("fontsize", "25");
    formData.append("roomid", roomId.toString());
    formData.append("csrf", csrf ?? "");
    formData.append("csrf_token", csrf ?? "");
    formData.append("rnd", "1684682694");
    fetch("https://api.live.bilibili.com/msg/send", {
        method: "POST",
        mode: "cors",
        headers: {
            cookie: `bili_jct=${csrf ?? ""}; SESSDATA=${sess ?? ""}`,
        },
        body: formData,
    })
        .then((res) => {
            res.json()
                .then((json: { code: number }) => {
                    if (json.code !== 0) {
                        consola.error(json);
                    } else {
                        consola.debug(`ID ${id} 回复成功`);
                    }
                })
                .catch((err) => {
                    consola.error(err);
                });
        })
        .catch((err) => {
            consola.error(err);
        });
};

export default send;
