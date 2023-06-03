import { medal_name } from "./room.js";
import config from "./config/index.js";
import { consola } from "consola";

const { csrf, sess, roomId, blockBot, maxRetry, sendGap, maxLength } = config;
const response = config.responseEnter || config.responseFans || config.responseFollow;

interface LinkedListNode<T> {
    value: T;
    next: LinkedListNode<T> | null;
}

const MAX_RETRY = maxRetry;
const SEND_GAP = sendGap;

interface Message {
    message: string;
    id: string;
    try: number;
}

let first: LinkedListNode<Message> | null = null;
let last: LinkedListNode<Message> | null = null;

const insertFirst = (node: LinkedListNode<Message>): void => {
    if (first === null) {
        first = node;
        last = node;
        return;
    } else {
        node.next = first;
        first = node;
    }
};

const insertLast = (node: LinkedListNode<Message>): void => {
    if (last === null) {
        first = node;
        last = node;
        return;
    } else {
        last.next = node;
        last = node;
    }
};

const getFirst = (): LinkedListNode<Message> | null => {
    const node = first;
    if (first === last) {
        first = null;
        last = null;
    } else {
        first = first?.next ?? null;
    }
    return node;
};

const send = async (node: LinkedListNode<Message>): Promise<void> => {
    const formData = new FormData();
    formData.append("bubble", "0");
    formData.append("msg", node.value.message);
    formData.append("color", "5566168");
    formData.append("mode", "1");
    formData.append("room_type", "0");
    formData.append("jumpfrom", "82001");
    formData.append("fontsize", "25");
    formData.append("roomid", roomId.toString());
    formData.append("csrf", csrf);
    formData.append("csrf_token", csrf);
    formData.append("rnd", "1684682694");
    try {
        const result = (await (
            await fetch("https://api.live.bilibili.com/msg/send", {
                method: "POST",
                mode: "cors",
                headers: {
                    cookie: `bili_jct=${csrf}; SESSDATA=${sess}`,
                },
                body: formData,
            })
        ).json()) as { code: number };
        if (result.code !== 0) {
            consola.error(`发送失败: ID: ${node.value.id}`);
            consola.error(result);
            throw new Error("发送失败");
        } else {
            consola.success(`发送成功: ID: ${node.value.id}`);
        }
    } catch {
        node.value.try++;
        if (node.value.try > MAX_RETRY) {
            consola.error(`已尝试过 ${MAX_RETRY} 次，放弃发送`);
            return;
        } else {
            consola.warn(`准备重试第 ${node.value.try} 次`);
            insertFirst(node);
        }
    }
};

if (response) {
    setInterval((): void => {
        const node = getFirst();
        if (!node) {
            return;
        }
        void send(node);
    }, SEND_GAP);
}

const buildMessage = (base: string, username: string): string => {
    const replaced = base.replace("%m", medal_name);
    const baseLength = maxLength + 2 - replaced.length;
    if (username.length > baseLength) {
        return replaced.replace("%s", username.slice(0, baseLength - 1) + "…");
    }
    return replaced.replace("%s", username);
};

const sendMsg = (message: string, uname: string, id = ""): void => {
    if (!message) {
        return;
    }
    if (blockBot) {
        const botReg = /(\d\d-\d\d-\d\d\d.*)|(bili_[0-9]{5,})/;
        if (botReg.exec(uname)) {
            consola.debug(`已阻止回复机器人: ${uname}`);
            return;
        }
    }
    const msg = buildMessage(message, uname);
    if (msg.length > config.maxLength) {
        consola.debug(`已阻止发送过长的消息: ${msg}`);
        return;
    }
    insertLast({
        value: {
            message: msg,
            id,
            try: 0,
        },
        next: null,
    });
    return;
};

export { sendMsg };
