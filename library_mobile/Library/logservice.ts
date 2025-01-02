import { consoleTransport, logger } from 'react-native-logs';

type log = {
    debug: (message: string) => void,
    info: (message: string) => void,
    warn: (message: string) => void,
    error: (message: string) => void,
};

const defaultConfig = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    severity: 'debug',
    transport: consoleTransport,
    transportOptions: {
        colors: {
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'redBright',
        },
    },
    async: true,
    dateFormat: 'time',
    printLevel: true,
    printDate: true,
    fixedExtLvlLength: false,
    enabled: true,
};

export const LOG: log = logger.createLogger(defaultConfig);
