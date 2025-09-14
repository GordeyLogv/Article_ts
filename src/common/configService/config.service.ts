import { inject, injectable } from 'inversify';
import { config, DotenvConfigOutput } from 'dotenv';

import { IConfigService } from './config.service.interfsce.js';
import { TYPES } from '../../types.js';
import { ILoggerService } from '../loggerService/logger.service.interface.js';
import { HttpError } from '../errors/httpError.js';

@injectable()
export class ConfigService implements IConfigService {
    private config: Record<string, string>;

    constructor(@inject(TYPES.LoggerService) private loggerService: ILoggerService) {
        const result: DotenvConfigOutput = config();

        if (result.error) {
            this.loggerService.error('[ConfigService] - .env не удалось загрузить');
            throw new HttpError(500, 'Ошибка загрузки .env', 'ConfigService');
        }

        this.loggerService.info('[ConfigService] - загружен');
        this.config = result.parsed ?? {};
    }

    public get(key: string): string {
        const value = this.config[key];

        if (!value) {
            this.loggerService.error(`[ConfigService] - переменная ${key} не найдена`);
            throw new HttpError(500, `Переменная ${key} не найдена .env`, 'ConfigService');
        }

        return value;
    }

    public get port(): number {
        const port = Number(this.get('PORT'));

        if (isNaN(port)) {
            this.loggerService.error(`[ConfigService] - PORT не число : ${port}`);
            throw new HttpError(500, `port - не число ${port}`, 'ConfigService');
        }

        return port;
    }

    public get host(): string {
        const host = String(this.get('HOST'));

        if (host === 'string') {
            this.loggerService.error(`[ConfigService] - HOST не строка : ${host}`);
            throw new HttpError(500, `host - не строка ${host}`, 'ConfigService');
        }

        return host;
    }

    public get salt(): number {
        const salt = Number(this.get('SALT'));

        if (isNaN(salt)) {
            this.loggerService.error(`[ConfigService] - SALT не число : ${salt}`);
            throw new HttpError(500, `salt - не число ${salt}`, 'ConfigService');
        }

        return salt;
    }

    public get access_token_secret(): string {
        const access_token_secret = String(this.get('ACCESS_TOKEN_SECRET'));

        if (access_token_secret === 'string') {
            this.loggerService.error(`[ConfigService] - access_token_secret не строка : ${access_token_secret}`);
            throw new HttpError(500, `access_token_secret - не строка ${access_token_secret}`, 'ConfigService');
        }

        return access_token_secret;
    }

    public get expiresInSecond(): number {
        const expiresInSecond = Number(this.get('EXPIRESINSECOND'));

        if (isNaN(expiresInSecond)) {
            this.loggerService.error(`[ConfigService] - expiresInSecond не число : ${expiresInSecond}`);
            throw new HttpError(500, `expiresInSecond - не число ${expiresInSecond}`, 'ConfigService');
        }

        return expiresInSecond;
    }

    public get dbPort(): number {
        const dbPort = Number(this.get('DB_PORT'));

        if (isNaN(dbPort)) {
            this.loggerService.error(`[ConfigService] - dbPort не число : ${dbPort}`);
            throw new HttpError(500, `port - не число ${dbPort}`, 'ConfigService');
        }

        return dbPort;
    }

    public get dbHost(): string {
        const dbHost = String(this.get('DB_HOST'));

        if (dbHost === 'string') {
            this.loggerService.error(`[ConfigService] - dbHost не строка : ${dbHost}`);
            throw new HttpError(500, `host - не строка ${dbHost}`, 'ConfigService');
        }

        return dbHost;
    }

    public get dbUser(): string {
        const dbUser = String(this.get('DB_USER'));

        if (dbUser === 'string') {
            this.loggerService.error(`[ConfigService] - dbUser не строка : ${dbUser}`);
            throw new HttpError(500, `host - не строка ${dbUser}`, 'ConfigService');
        }

        return dbUser;
    }

    public get dbPassword(): string {
        const dbPassword = String(this.get('DB_PASSWORD'));

        if (dbPassword === 'string') {
            this.loggerService.error(`[ConfigService] - dbPassword не строка : ${dbPassword}`);
            throw new HttpError(500, `host - не строка ${dbPassword}`, 'ConfigService');
        }

        return dbPassword;
    }

    public get dbDatabase(): string {
        const dbDatabase = String(this.get('DB_DATABASE'));

        if (dbDatabase === 'string') {
            this.loggerService.error(`[ConfigService] - dbDatabase не строка : ${dbDatabase}`);
            throw new HttpError(500, `host - не строка ${dbDatabase}`, 'ConfigService');
        }

        return dbDatabase;
    }
}
