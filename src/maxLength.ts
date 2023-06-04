import { consola } from "consola";
import config from "./config/index.js";

let maxLength = 20;

interface Response {
    code: number;
    data: {
        privilege: {
            privilege_type: 0 | 1 | 2 | 3;
        };
    };
}

if (config.response) {
    const result = (await (
        await fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=`, {
            headers: {
                // cookie
                cookie: `bili_jct=${config.csrf}; SESSDATA=${config.sess}`,
            },
        })
    ).json()) as Response;
    if (result.code === 0) {
        const type = result.data.privilege.privilege_type;
        if (type === 1 || type === 2) {
            maxLength = 40;
        }
    }
}

consola.debug(`最大消息长度: ${maxLength} 字`);

export default maxLength;
