interface ConfigOptions {
    sess: string;
    csrf: string;
    blockBot: boolean | string;
    maxRetry: number;
    sendGap: number;
    autoWearMedal: boolean;
    response: {
        enter: boolean | string;
        fans: boolean | string;
        follow: boolean | string;
        gift: boolean | string;
    };
    giftMergeTime: number;
    roomId: number;
}

type FinalOptions = Omit<Required<ConfigOptions>, "blockBot" | "response"> & {
    blockBot: RegExp | null;
    response: boolean;
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
