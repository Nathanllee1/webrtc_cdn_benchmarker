import { createLogger, format, transports } from "winston";
import chalk from 'chalk';

const { combine, timestamp, label, printf } = format;

const parse_level = (lev_string:string) => {
    switch (lev_string) {
        case "error":
            return chalk.red(lev_string)

        case "info":
            return chalk.green(lev_string)
    }
}

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `[${chalk.grey(new Date().toLocaleTimeString())}] ${parse_level(level)}: ${message}`;
});

var filename = module.filename.split('/').slice(-1);

export const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: filename[0] }),
        timestamp(),
        myFormat
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            label({ label: filename[0] }),
            timestamp(),
            myFormat
        )
    }));
}