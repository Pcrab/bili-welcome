import type defaultConfig from "../../default.config.json";

type ConfigOptions = typeof defaultConfig & {
    roomId: number;
};

type FinalOptions = Omit<Required<ConfigOptions>, "response"> & {
    responseFans: boolean;
    responseFollow: boolean;
    responseEnter: boolean;
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
