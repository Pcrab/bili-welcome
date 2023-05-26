import qrcode from "qrcode-terminal";
import { consola } from "consola";

const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const generateQrCodeUrl = "https://passport.bilibili.com/x/passport-login/web/qrcode/generate";
interface GenerateQrcodeResponse {
    data: {
        url: string;
        qrcode_key: string;
    };
}
const generateQrCode = async (): Promise<string> => {
    const response = (await (await fetch(generateQrCodeUrl, {})).json()) as GenerateQrcodeResponse;
    qrcode.generate(response.data.url, { small: true });
    return response.data.qrcode_key;
};

const pollQrcodeUrl = "https://passport.bilibili.com/x/passport-login/web/qrcode/poll";

interface PollQrcodeResponse {
    data: {
        url: string;
        refresh_token: string;
        timestamp: number;
        code: 0 | 86038 | 86090 | 86101;
        message: string;
    };
}

const pollQrcode = async (qrcodeKey: string): Promise<[number, { sess: string; csrf: string }]> => {
    const response = (await (await fetch(`${pollQrcodeUrl}?qrcode_key=${qrcodeKey}`)).json()) as PollQrcodeResponse;
    // login not success
    if (response.data.code !== 0) return [response.data.code, { sess: "", csrf: "" }];

    // login success, write SESSDATA and bili_jct
    const url = new URL(response.data.url);
    const result = Object.fromEntries(url.searchParams);
    return [
        0,
        {
            sess: encodeURIComponent(result.SESSDATA ?? ""),
            csrf: result.bili_jct ?? "",
        },
    ];
};

const loginWithQrcode = async (): Promise<{ sess: string; csrf: string }> => {
    let succeeded = false;
    let qrcodeKey = "";

    const refreshQrcode = async (): Promise<void> => {
        if (!succeeded) {
            qrcodeKey = await generateQrCode();
        }
    };

    await refreshQrcode();
    while (true) {
        await sleep(3000);
        const result = await pollQrcode(qrcodeKey);
        switch (result[0]) {
            case 0:
                consola.info("登录成功");
                succeeded = true;
                return result[1];
            case 86038:
                consola.debug("二维码已过期，尝试重新生成");
                await refreshQrcode();
                break;
            case 86090:
                consola.debug("二维码已扫描，等待用户确认");
                break;
            case 86101:
                consola.debug("等待扫描二维码");
                break;
            default:
                throw new Error("未知错误");
        }
    }
};

export { loginWithQrcode };
