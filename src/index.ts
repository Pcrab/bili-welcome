import { startListen, type MsgHandler } from "blive-message-listener";

// Cookie bili_jct
const csrf = "";
// Cookie SESSDATA
const SESSDATA = "";

const roomId = 26887365;
const handler: MsgHandler = {
    onUserAction: (msg) => {
        try {
            if (msg.type !== "ENTRY_EFFECT") {
                return;
            }
            console.log(msg.body.user.uname);
            const formData = new FormData();
            formData.append("bubble", "0");
            formData.append("msg", `欢迎 ${msg.body.user.uname} 进入直播间`);
            // formData.append("msg", `试一下弹幕`);
            formData.append("color", "5566168");
            formData.append("mode", "1");
            formData.append("room_type", "0");
            formData.append("jumpfrom", "82001");
            formData.append("fontsize", "25");
            formData.append("roomid", roomId.toString());
            formData.append("csrf", csrf);
            formData.append("csrf_token", csrf);
            formData.append("rnd", "1684682694");
            console.log(formData);
            fetch("https://api.live.bilibili.com/msg/send", {
                method: "POST",
                mode: "cors",
                headers: {
                    cookie: `bili_jct=${csrf}; SESSDATA=${SESSDATA}`,
                },
                body: formData,
            })
                .then((res) => {
                    res.text()
                        .then((text) => {
                            console.log(text);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch {
            return;
        }
    },
};

const instance = startListen(roomId, handler);

instance.close();
