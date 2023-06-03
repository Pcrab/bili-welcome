interface ConfigOptions {
    sess: string;
    csrf: string;
    blockBot: boolean;
    maxRetry: number;
    sendGap: number;
    response: {
        enter: boolean | string;
        fans: boolean | string;
        follow: boolean | string;
        gift: boolean | string;
    };
    maxLength: number;
    giftMergeTime: number;
    roomId: number;
}

type FinalOptions = Omit<Required<ConfigOptions>, "response"> & {
    responseEnter: string;
    responseFans: string;
    responseFollow: string;
    responseGift: string;
};

interface Options {
    config?: string;
    debug?: boolean;
    blockBot: boolean;
    response: boolean;
    sess?: string;
    csrf?: string;
    roomId?: string;
}

export type { Options, ConfigOptions, FinalOptions };
