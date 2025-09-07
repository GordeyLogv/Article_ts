import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IDatabaseService } from './database.service.interface.js';
import { TYPES } from '../../types.js';
import { ILoggerService } from '../loggerService/logger.service.interface.js';
import { HttpError } from '../errors/httpError.js';

@injectable()
export class DatabaseService extends PrismaClient implements IDatabaseService {
    constructor(@inject(TYPES.LoggerService) private loggerService: ILoggerService) {
        super();
    }

    public async connect(): Promise<void> {
        try {
            await this.$connect();
            this.loggerService.info(`[DatabaseService] - загружен`);
        } catch (error) {
            if (error instanceof Error) {
                this.loggerService.error(`[DatabaseService] - ошибка подключения`);
                throw new HttpError(500, `Ошибка при подключении к базе данный`, `DatabaseService`);
            }
            throw new HttpError(500, 'Неизвестная ошибка при подключении', 'DatabaseService');
        }
    }

    public async disconnect(): Promise<void> {
        await this.$disconnect();
        this.loggerService.info(`[DatabaseService] - отключен`);
    }
}
