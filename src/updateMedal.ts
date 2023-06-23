import { medal_name } from "./room.js";
import config from "./config/index.js";
import { consola } from "consola";

interface Medal {
    medal_name: string;
    medal_id: number;
}

const getMedals = async (
    page: number,
): Promise<{
    code: number;
    data: {
        page_info: {
            total_page: number;
        };
        items: Medal[];
    };
}> => {
    const result = (await (
        await fetch(`https://api.live.bilibili.com/xlive/app-ucenter/v1/user/GetMyMedals?page_size=10&page=${page}`, {
            headers: {
                cookie: `SESSDATA=${config.sess}; bili_jct=${config.csrf}`,
            },
        })
    ).json()) as {
        code: number;
        data: {
            page_info: {
                total_page: number;
            };
            items: Medal[];
        };
    };
    return result;
};

const changeMedal = async (medal_id: number): Promise<void> => {
    const formData = new FormData();
    formData.append("csrf_token", config.csrf);
    formData.append("csrf", config.csrf);
    formData.append("medal_id", medal_id.toString());
    const result = await fetch("https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear", {
        method: "POST",
        mode: "cors",
        headers: {
            cookie: `SESSDATA=${config.sess}`,
        },
        body: formData,
    });
    const data = (await result.json()) as {
        code: number;
        data: unknown;
    };
    if (data.code === 0) {
        consola.info("勋章佩戴成功");
    }
    return;
};

const updateMedal = async (): Promise<void> => {
    if (!config.response) {
        return;
    }
    let page = 1;
    let maxPage = 1;
    while (page <= maxPage) {
        const result = await getMedals(page);
        maxPage = result.data.page_info.total_page;
        for (const medal of result.data.items) {
            if (medal.medal_name === medal_name) {
                await changeMedal(medal.medal_id);
                return;
            }
        }
        page += 1;
    }
    console.log("Not found");
    return;
};

export { updateMedal };
