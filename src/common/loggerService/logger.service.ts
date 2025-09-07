import winston from 'winston';
import { injectable } from 'inversify';

import { ILoggerService } from './logger.service.interface.js';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:MM:SS' }),
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, stack, ..._meta }) => {
                    let msg = `[${String(timestamp)}] ${String(level)} ${String(message)}`;
                    if (stack)
                        msg += `\n${typeof stack === 'string' ? stack : JSON.stringify(stack)}`;
                    return msg;
                }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
            exitOnError: false,
        });
    }

    info(...args: unknown[]): void {
        this.logger.info(args.map(String).join(' '));
    }

    warn(...args: unknown[]): void {
        this.logger.warn(args.map(String).join(' '));
    }

    error(...args: unknown[]): void {
        this.logger.error(args.map(String).join(' '));
    }
}
