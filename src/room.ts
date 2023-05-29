import { consola } from "consola";
import { roomId } from "./config.js";

interface RoomInfoResponse {
    code: 0 | 1;
    message: string;
    data: {
        uid: number;
    };
}

const roomInfo = (await (
    await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`)
).json()) as RoomInfoResponse;

if (roomInfo.code === 1) {
    consola.error("获取房间信息失败");
    consola.error(roomInfo.message);
    process.exit(1);
}

const uid = roomInfo.data.uid;
consola.info(`当前直播间主播 uid: ${uid}`);

interface LiveUserInfoResponse {
    code: 0 | 1;
    message: string;
    data: {
        medal_name: string;
    };
}

const liveUserInfo = (await (
    await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`)
).json()) as LiveUserInfoResponse;

if (liveUserInfo.code === 1) {
    consola.error("获取主播信息失败");
    consola.error(liveUserInfo.message);
    process.exit(1);
}

const medal_name = liveUserInfo.data.medal_name;

export { medal_name };
