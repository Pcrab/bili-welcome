import type defaultConfig from "../../default.config.json";

type ConfigOptions = typeof defaultConfig & {
    roomId: number;
};

type FinalOptions = Omit<Required<ConfigOptions>, "response"> & {
    responseEnter: boolean;
    responseFans: boolean;
    responseFollow: boolean;
    responseGift: boolean;
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
